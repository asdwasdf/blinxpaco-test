import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium, request, type Download, type Page } from '@playwright/test';
import { loadConfig } from './load-config.js';
import {
  assertTicketKeyAvailable,
  collectJiraCommentPages,
  createTicketAtomically,
  jiraExtractionEvaluator,
  mediaIdFromMediaUrl,
  parseJiraIssueUrl,
  relinkCommentMedia,
  safeAttachmentName,
  validateSnapshot,
  type JiraIdentity,
} from './jira-import-core.js';

export function resolveJiraProfileDirectory(root: string, authDirectory: string): string {
  return path.resolve(root, authDirectory, 'jira-chrome-profile');
}

export function isJiraIssueUrl(value: string, origin: string, browsePath: string): boolean {
  try {
    const url = new URL(value);
    return url.origin === new URL(origin).origin
      && new RegExp(`^${browsePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[A-Z][A-Z0-9]*-[0-9]+$`).test(url.pathname);
  } catch {
    return false;
  }
}

function identityFromPageUrl(value: string, origin: string, browsePath: string): JiraIdentity {
  if (!isJiraIssueUrl(value, origin, browsePath)) throw new Error('Invalid Jira issue URL');
  const url = new URL(value);
  const key = url.pathname.slice(browsePath.length);
  return { url: `${url.origin}${url.pathname}`, key };
}

export function isJiraAuthenticationUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.hostname === 'id.atlassian.com' || /\/(?:login|signin|sign-in|auth)(?:[/?#]|$)/i.test(url.pathname);
  } catch {
    return false;
  }
}

export interface JiraCommentPageFetcher {
  evaluate<T>(callback: unknown, arg: string): Promise<T>;
}

export function parseImportArgs(argv: string[]): { url?: string; commentLimit?: number; attachmentLimit?: number } {
  const result: { url?: string; commentLimit?: number; attachmentLimit?: number } = {};
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index];
    if (value === '--comments' || value === '--attachments') {
      const limit = Number(argv[++index]);
      if (!Number.isInteger(limit) || limit < 1) throw new Error(`${value} must be a positive integer`);
      if (value === '--comments') result.commentLimit = limit;
      else result.attachmentLimit = limit;
    } else if (!result.url) result.url = value;
    else throw new Error('Usage: npm run jira:import -- [jira-url] [--comments N] [--attachments N]');
  }
  return result;
}

export function selectLatest<T>(items: T[], limit: number | undefined, dateOf: (item: T) => string | null | undefined): T[] {
  if (!limit || items.length <= limit) return items;
  return [...items]
    .sort((left, right) => Date.parse(dateOf(left) ?? '') - Date.parse(dateOf(right) ?? ''))
    .slice(-limit);
}

export async function fetchJiraAttachments(
  page: JiraCommentPageFetcher,
  key: string,
): Promise<import('./jira-import-core.js').JiraAttachment[]> {
  const issue = await page.evaluate<{ fields?: { attachment?: Array<{ id?: unknown; filename?: unknown; created?: unknown; mimeType?: unknown; size?: unknown; content?: unknown }> } }>(
    async (url: string) => {
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`Jira attachments unavailable: HTTP ${response.status}`);
      return response.json();
    },
    `/rest/api/3/issue/${encodeURIComponent(key)}?fields=attachment`,
  );
  const attachments = issue.fields?.attachment;
  if (!Array.isArray(attachments)) throw new Error('Jira attachments unavailable');
  return attachments.map((item) => {
    if (typeof item.id !== 'string' || typeof item.filename !== 'string' || typeof item.content !== 'string') {
      throw new Error('Invalid Jira attachment');
    }
    return {
      id: item.id,
      fileName: item.filename,
      ...(typeof item.created === 'string' ? { createdAt: item.created } : {}),
      mediaType: typeof item.mimeType === 'string' ? item.mimeType : null,
      sizeBytes: typeof item.size === 'number' && item.size >= 0 ? item.size : null,
      sourceUrl: item.content,
      localPath: null,
      state: 'Pending',
      error: null,
    };
  });
}

export async function fetchJiraComments(
  page: JiraCommentPageFetcher,
  key: string,
): Promise<{ total: number; comments: import('./jira-import-core.js').JiraComment[]; media: import('./jira-import-core.js').JiraCommentMedia[] }> {
  return collectJiraCommentPages((startAt) => page.evaluate(
    async (url: string) => {
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`Jira comments unavailable: HTTP ${response.status}`);
      return response.json();
    },
    `/rest/api/3/issue/${encodeURIComponent(key)}/comment?startAt=${startAt}&maxResults=100`,
  ));
}

export async function waitForEnter(
  input: NodeJS.ReadableStream = process.stdin,
  output: NodeJS.WritableStream = process.stdout,
): Promise<void> {
  output.write('Nhấn Enter sau khi đã đăng nhập và mở đúng Jira issue...');
  await new Promise<void>((resolve) => input.once('data', () => resolve()));
}

export interface JiraReadyPage {
  url(): string;
  evaluate<T>(callback: unknown, arg: string): Promise<T>;
}

export async function isRequestedIssueReady(
  page: JiraReadyPage,
  identity: JiraIdentity,
  origin: string,
  browsePath: string,
): Promise<boolean> {
  if (!isJiraIssueUrl(page.url(), origin, browsePath)
    || new URL(page.url()).pathname !== new URL(identity.url).pathname) return false;
  try {
    const issue = await page.evaluate<{ key?: unknown }>(async (url: string) => {
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }, `/rest/api/3/issue/${encodeURIComponent(identity.key)}?fields=summary`);
    return issue.key === identity.key;
  } catch {
    return false;
  }
}

async function waitForIssueReady(
  page: Page,
  identity: JiraIdentity,
  origin: string,
  browsePath: string,
  timeoutMs = 5 * 60_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isRequestedIssueReady(page, identity, origin, browsePath)) return;
    await page.waitForTimeout(500);
  }
  throw new Error(`Blocked: Jira issue ${identity.key} chưa sẵn sàng sau khi chờ đăng nhập`);
}

async function switchToTestingDetailsTab(page: Page): Promise<boolean> {
  try {
    // Jira new UI: tab buttons with "Testing Details" label
    const tabButton = page.locator('button[role="tab"], button:has-text("Testing Details")').filter({ hasText: /Testing Details/i });
    if (await tabButton.count() > 0) {
      await tabButton.first().click();
      await page.waitForTimeout(500);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

async function expandAndStabilize(page: Page): Promise<void> {
  const deadline = Date.now() + 30_000;
  let stable = 0;
  let previous = '';
  while (Date.now() < deadline && stable < 2) {
    const current = await page.evaluate(() => {
      for (const element of document.querySelectorAll<HTMLElement>('button[aria-expanded="false"], button')) {
        const label = element.innerText || element.getAttribute('aria-label') || '';
        if (element.getAttribute('aria-expanded') === 'false' || /^(Expand Attachments|Expand Activity|Show more comments)$/i.test(label)) element.click();
      }
      const attachmentsHeading = [...document.querySelectorAll('h2')].find((element) => /attachments/i.test(element.innerText));
      const carousel = attachmentsHeading?.parentElement?.parentElement;
      const next = carousel?.querySelector<HTMLButtonElement>('button[aria-label="right"], button[aria-label="Next"]');
      if (next && !next.disabled) next.click();
      window.scrollTo(0, document.body.scrollHeight);
      return [
        document.querySelectorAll('[data-testid="issue-comment"], [data-comment-id], [data-testid^="comment-base-item-"]').length,
        document.querySelectorAll('a[data-testid="attachment"], a[href*="/secure/attachment/"], [data-testid*="attachment-id."]').length,
        document.querySelectorAll('[data-field-name]').length,
      ].join(':');
    });
    stable = current === previous ? stable + 1 : 0;
    previous = current;
    await page.waitForTimeout(500);
  }
}

export interface BrowserDownloadPage {
  waitForEvent(event: 'download'): Promise<Pick<Download, 'suggestedFilename' | 'saveAs'>>;
}

export interface BrowserUrlDownloadPage {
  waitForEvent(event: 'download'): Promise<Pick<Download, 'suggestedFilename' | 'url' | 'cancel'>>;
}

export interface AttachmentRequest {
  get(url: string, options?: { timeout?: number }): Promise<{
    status(): number;
    url(): string;
    body(): Promise<Buffer>;
  }>;
  head?(url: string, options?: { timeout?: number }): Promise<{
    status(): number;
    url(): string;
  }>;
}

export async function resolveAttachmentMediaIds(
  request: AttachmentRequest,
  attachments: import('./jira-import-core.js').JiraAttachment[],
  jiraOrigin: string,
): Promise<Map<string, import('./jira-import-core.js').JiraAttachment>> {
  const byMediaId = new Map<string, import('./jira-import-core.js').JiraAttachment>();
  for (const attachment of attachments) {
    if (!isTrustedAttachmentUrl(attachment.sourceUrl, jiraOrigin) || !request.head) continue;
    let response;
    try {
      response = await request.head(attachment.sourceUrl, { timeout: 60_000 });
    } catch {
      continue;
    }
    const mediaId = mediaIdFromMediaUrl(response.url());
    if (mediaId) byMediaId.set(mediaId, attachment);
  }
  return byMediaId;
}

export interface BrowserDownloadButton {
  click(): Promise<void>;
}

export async function saveBrowserDownload(
  page: BrowserDownloadPage,
  button: BrowserDownloadButton,
  expectedFileName: string,
  destination: string,
): Promise<void> {
  const downloadPromise = page.waitForEvent('download');
  await button.click();
  const download = await downloadPromise;
  const actualFileName = download.suggestedFilename();
  if (actualFileName !== expectedFileName) {
    throw new Error(`Download filename mismatch: expected ${expectedFileName}, got ${actualFileName}`);
  }
  await download.saveAs(destination);
}

function isTrustedAttachmentUrl(value: string, jiraOrigin: string): boolean {
  const url = new URL(value);
  return url.protocol === 'https:' && (
    url.origin === new URL(jiraOrigin).origin
    || url.hostname === 'api.media.atlassian.com'
    || url.hostname.endsWith('.atlassian.com')
    || url.hostname.endsWith('.atlassian.net')
  );
}

export async function downloadRestAttachment(
  request: AttachmentRequest,
  sourceUrl: string,
  destination: string,
  jiraOrigin: string,
): Promise<void> {
  if (!isTrustedAttachmentUrl(sourceUrl, jiraOrigin)) throw new Error('Untrusted attachment URL');
  let response;
  try {
    response = await request.get(sourceUrl, { timeout: 5 * 60_000 });
  } catch {
    throw new Error('Attachment request failed');
  }
  if (response.status() < 200 || response.status() >= 300 || !isTrustedAttachmentUrl(response.url(), jiraOrigin)) {
    throw new Error(`HTTP ${response.status()} or unsafe redirect`);
  }
  await fs.writeFile(destination, Buffer.from(await response.body()));
}

export async function downloadAttachmentWithFallback(
  attachment: import('./jira-import-core.js').JiraAttachment,
  destination: string,
  downloadRest: (attachment: import('./jira-import-core.js').JiraAttachment, destination: string) => Promise<void>,
  downloadBrowser: (attachment: import('./jira-import-core.js').JiraAttachment, destination: string) => Promise<void>,
): Promise<void> {
  try {
    await downloadRest(attachment, destination);
  } catch {
    try {
      await downloadBrowser(attachment, destination);
    } catch {
      throw new Error('Attachment REST and browser downloads failed');
    }
  }
}

export async function downloadFromBrowserUrl(
  page: BrowserUrlDownloadPage,
  button: BrowserDownloadButton,
  request: AttachmentRequest,
  expectedFileName: string,
  destination: string,
  jiraOrigin: string,
): Promise<void> {
  const downloadPromise = page.waitForEvent('download');
  await button.click();
  const download = await downloadPromise;
  const actualFileName = download.suggestedFilename();
  if (actualFileName !== expectedFileName) {
    throw new Error(`Download filename mismatch: expected ${expectedFileName}, got ${actualFileName}`);
  }
  const url = download.url();
  if (!isTrustedAttachmentUrl(url, jiraOrigin)) throw new Error('Untrusted attachment URL');
  await download.cancel().catch(() => {});
  let response;
  try {
    response = await request.get(url, { timeout: 5 * 60_000 });
  } catch {
    throw new Error('Attachment request failed');
  }
  if (response.status() < 200 || response.status() >= 300 || !isTrustedAttachmentUrl(response.url(), jiraOrigin)) {
    throw new Error(`HTTP ${response.status()} or unsafe redirect`);
  }
  await fs.writeFile(destination, Buffer.from(await response.body()));
}

async function saveDiagnostic(page: Page, testResults: string): Promise<void> {
  const directory = path.resolve(testResults, 'jira-import');
  await fs.mkdir(directory, { recursive: true });
  await page.screenshot({ path: path.join(directory, `${Date.now()}.png`), fullPage: true });
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const options = parseImportArgs(argv);
  const config = loadConfig();
  const sourceRoot = path.resolve(config.paths.ticketSource);
  let requested: JiraIdentity | null = null;
  if (options.url) {
    requested = parseJiraIssueUrl(options.url, config.jira.origin, config.jira.browsePath);
    await assertTicketKeyAvailable(sourceRoot, requested.key);
  }

  const profileDirectory = resolveJiraProfileDirectory(process.cwd(), config.paths.playwrightAuth);
  await fs.mkdir(profileDirectory, { recursive: true });
  const launch = () => chromium.launchPersistentContext(profileDirectory, { channel: 'chrome', headless: false, acceptDownloads: true });
  let context = await launch();
  const attachmentRequest = await request.newContext();
  let page = context.pages()[0] ?? await context.newPage();
  let completed = false;
  try {
    await page.goto(requested?.url ?? config.jira.origin);
    console.log('Đăng nhập Jira thủ công trong Chrome và mở đúng issue cần import.');
    if (process.stdin.isTTY) await waitForEnter();
    else if (requested) {
      await waitForIssueReady(page, requested, config.jira.origin, config.jira.browsePath);
    } else {
      throw new Error('Blocked: Chế độ không URL cần terminal tương tác');
    }
    const identity = identityFromPageUrl(page.url(), config.jira.origin, config.jira.browsePath);
    if (requested && identity.key !== requested.key) throw new Error(`Blocked: Open issue ${identity.key} does not match requested ${requested.key}`);
    await assertTicketKeyAvailable(sourceRoot, identity.key);
    await page.waitForLoadState('domcontentloaded');
    // Switch to Testing Details tab to capture feature branch URLs
    const hasTestingTab = await switchToTestingDetailsTab(page);
    if (hasTestingTab) {
      console.log('Captured Testing Details tab');
    }
    await expandAndStabilize(page);
    const domSnapshot = await page.evaluate(jiraExtractionEvaluator(), identity);
    const commentPage = await fetchJiraComments(page, identity.key).catch(() => {
      throw new Error('Jira comments unavailable; refusing partial import');
    });
    const allAttachments = await fetchJiraAttachments(page, identity.key).catch(() => {
      throw new Error('Jira attachments unavailable; refusing partial import');
    });
    const comments = selectLatest(commentPage.comments, options.commentLimit, (item) => item.createdAt);
    const media = commentPage.media.filter((item) => comments.some((comment) => comment.body?.includes(`attachments/${safeAttachmentName(item.id, item.fileName)}`)));
    const attachments = selectLatest(allAttachments, options.attachmentLimit, (item) => item.createdAt);
    const namedAlts = new Set(media.map((item) => item.fileName).filter((name) => name !== 'media'));
    const unresolvedMedia = commentPage.media.filter((item) => item.fileName === 'media' || !attachments.some((attachment) => attachment.fileName === item.fileName));
    const byMediaId = unresolvedMedia.length
      ? await resolveAttachmentMediaIds(
        context.request,
        attachments.filter((attachment) => !namedAlts.has(attachment.fileName)),
        config.jira.origin,
      )
      : new Map();
    const snapshot = {
      ...domSnapshot,
      comments: relinkCommentMedia(comments, media, attachments, byMediaId, options.attachmentLimit !== undefined),
      attachments,
    };
    validateSnapshot(snapshot, identity);
    const reopenIssue = async (): Promise<void> => {
      context = await launch();
      page = context.pages()[0] ?? await context.newPage();
      await page.goto(identity.url);
      await waitForIssueReady(page, identity, config.jira.origin, config.jira.browsePath);
      await expandAndStabilize(page);
    };
    const target = await createTicketAtomically(sourceRoot, snapshot, new Date().toISOString(), async (attachment, destination) => {
      const downloadBrowser = async (): Promise<void> => {
        if (page.isClosed()) await reopenIssue();
        const button = page.locator(`[data-testid*="attachment-id.${attachment.id}"] button[data-testid="media-card-primary-action"][aria-label$=" — Download"]`);
        if (await button.count() !== 1) throw new Error(`Attachment download control unavailable: ${attachment.id}`);
        await downloadFromBrowserUrl(page, button, attachmentRequest, attachment.fileName, destination, config.jira.origin);
      };
      if (attachment.sourceUrl.startsWith('jira-download:')) {
        await downloadBrowser();
        return;
      }
      await downloadAttachmentWithFallback(
        attachment,
        destination,
        (item, targetPath) => downloadRestAttachment(context.request, item.sourceUrl, targetPath, config.jira.origin),
        downloadBrowser,
      );
    });
    console.log(`Imported Jira ticket: ${target}`);
    if (snapshot.unavailableSections.length) console.log(`Unavailable: ${snapshot.unavailableSections.join(', ')}`);
    completed = true;
  } catch (error) {
    try { await saveDiagnostic(page, config.paths.testResults); } catch { /* diagnostic is best-effort */ }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message.startsWith('Blocked:') ? message : `Blocked: ${message}`);
  } finally {
    await attachmentRequest.dispose();
    if (completed) await context.close();
  }
}

const entryPoint = process.argv[1];
if (entryPoint && import.meta.url === pathToFileURL(path.resolve(entryPoint)).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
