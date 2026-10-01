import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export interface JiraIdentity {
  url: string;
  key: string;
}

const keyPattern = /^[A-Z][A-Z0-9]*-[0-9]+$/;

export function parseJiraIssueUrl(input: string, origin: string, browsePath: string): JiraIdentity {
  let parsed: URL;
  try {
    parsed = new URL(input.trim());
  } catch {
    throw new Error('Invalid Jira issue URL');
  }
  const expectedOrigin = new URL(origin);
  const key = parsed.pathname.startsWith(browsePath) ? parsed.pathname.slice(browsePath.length) : '';
  if (
    parsed.origin !== expectedOrigin.origin
    || parsed.username
    || parsed.password
    || parsed.search
    || parsed.hash
    || parsed.pathname !== `${browsePath}${key}`
    || !keyPattern.test(key)
  ) throw new Error('Invalid Jira issue URL');
  return { url: parsed.href, key };
}

export function slugifySummary(summary: string): string {
  const slug = summary
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
  return slug || 'issue';
}

export function ticketFolderName(key: string, summary: string): string {
  if (!keyPattern.test(key)) throw new Error(`Invalid Jira issue key: ${key}`);
  return `${key}-${slugifySummary(summary)}`;
}

export function assertInside(parent: string, child: string): void {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path escapes parent: ${child}`);
  }
}

export interface JiraField {
  name: string;
  value: string | null;
  availability: 'Available' | 'Not provided' | 'Unavailable';
}

export interface JiraComment {
  id: string;
  author: string | null;
  createdAt: string | null;
  body: string | null;
}

export interface JiraCommentMedia {
  id: string;
  fileName: string;
}

export interface JiraCommentPage {
  startAt: number;
  maxResults: number;
  total: number;
  comments: JiraComment[];
  media: JiraCommentMedia[];
}

type AdfNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
  content?: AdfNode[];
};

function adfText(node: AdfNode, media: JiraCommentMedia[], listPrefix = ''): string {
  const children = (node.content ?? []).map((child) => adfText(child, media, listPrefix)).join('');
  if (node.type === 'text') {
    return (node.marks ?? []).reduce((value, mark) => {
      if (mark.type === 'code') return `\`${value}\``;
      if (mark.type === 'strong') return `**${value}**`;
      if (mark.type === 'em') return `*${value}*`;
      if (mark.type === 'link' && typeof mark.attrs?.href === 'string') return `[${value}](${mark.attrs.href})`;
      return value;
    }, node.text ?? '');
  }
  if (node.type === 'mention') return `@${typeof node.attrs?.text === 'string' ? node.attrs.text.replace(/^@/, '') : 'unknown'}`;
  if (node.type === 'media') {
    const id = typeof node.attrs?.id === 'string' ? node.attrs.id : '';
    const fileName = typeof node.attrs?.alt === 'string' ? node.attrs.alt : 'media';
    if (!id) return '';
    media.push({ id, fileName });
    return `[Evidence: ${fileName}](attachments/${safeAttachmentName(id, fileName)})\n\n`;
  }
  if (node.type === 'hardBreak') return '\n';
  if (node.type === 'paragraph') return `${children}\n\n`;
  if (node.type === 'heading') return `${'#'.repeat(Number(node.attrs?.level) || 1)} ${children.trim()}\n\n`;
  if (node.type === 'bulletList') return (node.content ?? []).map((child) => `- ${adfText(child, media).trim()}\n`).join('');
  if (node.type === 'orderedList') return (node.content ?? []).map((child, index) => `${index + 1}. ${adfText(child, media).trim()}\n`).join('');
  if (node.type === 'listItem') return children;
  if (node.type === 'codeBlock') return `\`\`\`${typeof node.attrs?.language === 'string' ? node.attrs.language : ''}\n${children.trim()}\n\`\`\`\n\n`;
  if (node.type === 'table') {
    const rows = (node.content ?? []).map((row) => (row.content ?? []).map((cell) => adfText(cell, media).trim().replace(/\|/g, '\\|').replace(/\n+/g, '<br>')));
    if (!rows.length) return '';
    return `| ${rows[0].join(' | ')} |\n| ${rows[0].map(() => '---').join(' | ')} |\n${rows.slice(1).map((row) => `| ${row.join(' | ')} |`).join('\n')}\n\n`;
  }
  return children;
}

export function parseJiraCommentPage(value: unknown): JiraCommentPage {
  if (!value || typeof value !== 'object') throw new Error('Invalid Jira comment page');
  const page = value as { startAt?: unknown; maxResults?: unknown; total?: unknown; comments?: unknown };
  if (!Number.isInteger(page.startAt) || !Number.isInteger(page.maxResults) || !Number.isInteger(page.total) || !Array.isArray(page.comments)) {
    throw new Error('Invalid Jira comment page');
  }
  const media: JiraCommentMedia[] = [];
  const comments = page.comments.map((comment): JiraComment => {
    const item = comment as { id?: unknown; author?: { displayName?: unknown }; created?: unknown; body?: AdfNode };
    if (typeof item.id !== 'string' || typeof item.author?.displayName !== 'string' || typeof item.created !== 'string' || !item.body) {
      throw new Error('Invalid Jira comment page');
    }
    return { id: item.id, author: item.author.displayName, createdAt: item.created, body: adfText(item.body, media).trim() || null };
  });
  return { startAt: page.startAt as number, maxResults: page.maxResults as number, total: page.total as number, comments, media };
}

export function mediaIdFromMediaUrl(value: string): string | null {
  try {
    const match = /\/file\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\/|$)/i.exec(new URL(value).pathname);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

export function relinkCommentMedia(
  comments: JiraComment[],
  media: JiraCommentMedia[],
  attachments: JiraAttachment[],
  byMediaId: ReadonlyMap<string, JiraAttachment> = new Map(),
): JiraComment[] {
  const byName = new Map(attachments.map((attachment) => [attachment.fileName, attachment]));
  return comments.map((comment) => ({
    ...comment,
    body: media.reduce((body, item) => {
      const attachment = (item.fileName === 'media' ? undefined : byName.get(item.fileName)) ?? byMediaId.get(item.id.toLowerCase());
      if (!attachment) throw new Error(`unresolved Jira comment media: ${item.fileName}`);
      const next = body?.replace(
        `attachments/${safeAttachmentName(item.id, item.fileName)}`,
        `attachments/${safeAttachmentName(attachment.id, attachment.fileName)}`,
      ) ?? null;
      if (item.fileName === attachment.fileName) return next;
      return next?.replace(`[Evidence: ${item.fileName}]`, `[Evidence: ${attachment.fileName}]`) ?? null;
    }, comment.body),
  }));
}

export async function collectJiraCommentPages(
  fetchPage: (startAt: number) => Promise<unknown>,
): Promise<{ total: number; comments: JiraComment[]; media: JiraCommentMedia[] }> {
  const comments: JiraComment[] = [];
  const media: JiraCommentMedia[] = [];
  const ids = new Set<string>();
  let total: number | null = null;
  let startAt = 0;
  while (total === null || startAt < total) {
    const page = parseJiraCommentPage(await fetchPage(startAt));
    if (page.startAt !== startAt || page.maxResults < 1 || (total !== null && page.total !== total)) {
      throw new Error('Invalid Jira comment pagination');
    }
    total = page.total;
    media.push(...page.media);
    if (!page.comments.length && startAt < total) throw new Error('Invalid Jira comment pagination');
    for (const comment of page.comments) {
      if (ids.has(comment.id)) throw new Error('Invalid Jira comment pagination');
      ids.add(comment.id);
      comments.push(comment);
    }
    startAt += page.comments.length;
  }
  if (comments.length !== total) throw new Error('Invalid Jira comment pagination');
  return { total, comments, media };
}

export interface JiraLinkedIssue {
  relationship: string | null;
  key: string;
  summary: string | null;
  url: string;
}

export interface JiraAttachment {
  id: string;
  fileName: string;
  mediaType: string | null;
  sizeBytes: number | null;
  sourceUrl: string;
  localPath: string | null;
  state: 'Pending' | 'Downloaded' | 'Failed';
  error: string | null;
}

export interface JiraIssueSnapshot {
  sourceUrl: string;
  key: string;
  summary: string;
  description: string | null;
  acceptanceCriteria: string | null;
  fields: JiraField[];
  linkedIssues: JiraLinkedIssue[];
  comments: JiraComment[];
  attachments: JiraAttachment[];
  unavailableSections: string[];
}

export function jiraExtractionEvaluator(): (identity: JiraIdentity) => JiraIssueSnapshot {
  return (identity: JiraIdentity) => {
    const text = (element: Element | null): string | null => {
      const value = (element as HTMLElement | null)?.innerText?.replace(/\s+/g, ' ').trim();
      return value || null;
    };
    const section = (label: string) => document.querySelector(`[aria-label="${label}"]`);
    const summary = text(document.querySelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]'))
      ?? text(document.querySelector('main h1'))
      ?? text(document.querySelector('h1'))
      ?? '';
    const descriptionElement = document.querySelector('[data-testid="issue.views.field.rich-text.description"]') ?? section('Description');
    const acceptanceElement = section('Acceptance criteria') ?? section('Acceptance Criteria');
    const fields = [...document.querySelectorAll('[data-field-name]')].map((element) => {
      const name = element.getAttribute('data-field-name') ?? '';
      const value = text(element.querySelector('[data-field-value]'));
      return { name, value, availability: value ? 'Available' : 'Not provided' } as JiraField;
    }).filter((field) => field.name);
    const comments = [...document.querySelectorAll('[data-testid="issue-comment"], [data-comment-id], [data-testid^="comment-base-item-"]')].map((element, index) => ({
      id: element.getAttribute('data-comment-id') ?? element.getAttribute('data-testid')?.replace(/^comment-base-item-/, '') ?? `comment-${index + 1}`,
      author: text(element.querySelector('[data-testid="comment-author"], [data-testid*="author"], [data-qa*="author"], a[href*="/people/"], span:first-child')),
      createdAt: element.querySelector('time')?.getAttribute('datetime') ?? null,
      body: text(element.querySelector('[data-testid="comment-body"], [data-testid*="comment-body"], [data-qa*="comment-body"], p')),
    })).filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index);
    const linkedIssues = [...document.querySelectorAll('a[data-testid="linked-issue"]')].flatMap((element) => {
      const anchor = element as HTMLAnchorElement;
      const url = new URL(anchor.href, identity.url);
      const match = /\/browse\/([A-Z][A-Z0-9]*-[0-9]+)$/.exec(url.pathname);
      if (url.origin !== new URL(identity.url).origin || !match) return [];
      const label = text(anchor) ?? match[1];
      const summaryText = label.replace(new RegExp(`^${match[1]}\\s*[—–-]?\\s*`), '').trim();
      return [{ relationship: anchor.getAttribute('data-relationship'), key: match[1], summary: summaryText || null, url: url.href }];
    });
    const attachments = [...document.querySelectorAll('a[data-testid="attachment"], a[href*="/secure/attachment/"]')].flatMap((element, index) => {
      const anchor = element as HTMLAnchorElement;
      const url = new URL(anchor.href, identity.url);
      if (url.origin !== new URL(identity.url).origin || !url.pathname.includes('/secure/attachment/')) return [];
      const id = anchor.getAttribute('data-attachment-id') ?? url.pathname.split('/').filter(Boolean).at(-2) ?? `attachment-${index + 1}`;
      const parsedSize = Number(anchor.getAttribute('data-size'));
      return [{
        id,
        fileName: text(anchor) ?? decodeURIComponent(url.pathname.split('/').at(-1) ?? ''),
        mediaType: anchor.getAttribute('data-media-type'),
        sizeBytes: Number.isFinite(parsedSize) && parsedSize >= 0 ? parsedSize : null,
        sourceUrl: url.href,
        localPath: null,
        state: 'Pending' as const,
        error: null,
      }];
    }).filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id || candidate.sourceUrl === item.sourceUrl) === index);
    const modernAttachments = [...document.querySelectorAll('[data-testid*="attachment-id."]')].flatMap((element, index) => {
      const testId = element.getAttribute('data-testid') ?? '';
      const id = /attachment-id\.([^\s.]+)/.exec(testId)?.[1] ?? `attachment-card-${index + 1}`;
      const button = element.querySelector('button[data-testid="media-card-primary-action"][aria-label$=" — Download"]');
      const fileName = button?.getAttribute('aria-label')?.replace(/ — Download$/, '') ?? text(element.querySelector('[data-test-media-name]')) ?? '';
      return button && fileName ? [{
        id,
        fileName,
        mediaType: null,
        sizeBytes: null,
        sourceUrl: `jira-download:${id}`,
        localPath: null,
        state: 'Pending' as const,
        error: null,
      }] : [];
    });
    attachments.push(...modernAttachments);
    const uniqueAttachments = attachments.filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id || candidate.sourceUrl === item.sourceUrl) === index);
    const unavailableSections: string[] = [];
    for (const [name, element] of [['Description', descriptionElement], ['Acceptance criteria', acceptanceElement]] as const) {
      if (element?.getAttribute('data-unavailable') === 'true') unavailableSections.push(name);
    }
    return {
      sourceUrl: identity.url,
      key: identity.key,
      summary,
      description: text(descriptionElement),
      acceptanceCriteria: text(acceptanceElement),
      fields,
      linkedIssues,
      comments,
      attachments: uniqueAttachments,
      unavailableSections,
    };
  };
}

export function validateSnapshot(snapshot: JiraIssueSnapshot, identity: JiraIdentity): void {
  if (snapshot.sourceUrl !== identity.url || snapshot.key !== identity.key || !snapshot.summary.trim()) {
    throw new Error('Invalid Jira issue snapshot');
  }
  const origin = new URL(identity.url).origin;
  const unique = (values: string[]) => values.length === new Set(values).size;
  if (!unique(snapshot.comments.map((item) => item.id)) || !unique(snapshot.attachments.map((item) => item.id))) {
    throw new Error('Invalid Jira issue snapshot: duplicate IDs');
  }
  for (const attachment of snapshot.attachments) {
    if (!attachment.fileName) throw new Error('Invalid Jira issue snapshot: unsafe attachment');
    if (attachment.sourceUrl.startsWith('jira-download:')) continue;
    const url = new URL(attachment.sourceUrl);
    if (
      url.origin !== origin
      || (!url.pathname.includes('/secure/attachment/') && !/^\/rest\/api\/3\/attachment\/content\/[0-9]+$/.test(url.pathname))
    ) {
      throw new Error('Invalid Jira issue snapshot: unsafe attachment');
    }
  }
}

function markdownValue(value: string | null, unavailable: boolean): string {
  return unavailable ? 'Unavailable' : value || 'Not provided';
}

function escapeTable(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

export function renderTicket(snapshot: JiraIssueSnapshot, importedAt: string): string {
  const unavailable = new Set(snapshot.unavailableSections);
  const fieldRows = snapshot.fields.length
    ? snapshot.fields.map((field) => `| ${escapeTable(field.name)} | ${escapeTable(field.availability === 'Unavailable' ? 'Unavailable' : field.value ?? 'Not provided')} |`).join('\n')
    : '| Not provided | Not provided |';
  const linked = snapshot.linkedIssues.length
    ? snapshot.linkedIssues.map((item) => `- ${item.relationship ?? 'Related'}: [${item.key}${item.summary ? ` — ${item.summary}` : ''}](${item.url})`).join('\n')
    : 'Not provided';
  const comments = snapshot.comments.length
    ? snapshot.comments.map((item) => `### ${item.author ?? 'Unavailable'} — ${item.createdAt ?? 'Unavailable'}\n\n${item.body ?? 'Unavailable'}`).join('\n\n')
    : 'Not provided';
  const attachments = snapshot.attachments.length
    ? snapshot.attachments.map((item) => item.localPath
      ? `- [${item.fileName}](${item.localPath}) — \`${item.state}\``
      : `- ${item.fileName} — \`${item.state}\`${item.error ? `: ${item.error}` : ''}`).join('\n')
    : 'Not provided';
  const failures = snapshot.attachments.filter((item) => item.state === 'Failed');
  return `# ${snapshot.key} — ${snapshot.summary}\n\n## Jira metadata\n- URL: ${snapshot.sourceUrl}\n- Imported at: ${importedAt}\n\n## Summary\n\n${snapshot.summary}\n\n## Description\n\n${markdownValue(snapshot.description, unavailable.has('Description'))}\n\n## Acceptance criteria\n\n${markdownValue(snapshot.acceptanceCriteria, unavailable.has('Acceptance criteria'))}\n\n## Fields\n\n| Field | Value |\n|---|---|\n${fieldRows}\n\n## Linked issues\n\n${linked}\n\n## Comments\n\n${comments}\n\n## Attachments\n\n${attachments}\n\n## Import notes\n- Captured comments: ${snapshot.comments.length}\n- Missing/unreadable sections: ${snapshot.unavailableSections.length ? snapshot.unavailableSections.join(', ') : 'None'}\n- Failed attachments: ${failures.length ? failures.map((item) => item.fileName).join(', ') : 'None'}\n\n## Tester notes\n`;
}

export function safeAttachmentName(id: string, originalName: string): string {
  const extension = path.extname(path.basename(originalName));
  const stem = path.basename(originalName, extension)
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/[. ]+$/g, '') || 'attachment';
  const safeExtension = extension.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-');
  const prefix = `${id}-`;
  const maxStem = Math.max(1, 180 - prefix.length - safeExtension.length);
  return `${prefix}${stem.slice(0, maxStem)}${safeExtension}`;
}

export type AttachmentWriter = (attachment: JiraAttachment, target: string) => Promise<void>;

export async function downloadAttachments(
  stagingAttachmentsDir: string,
  attachments: JiraAttachment[],
  writer: AttachmentWriter,
): Promise<JiraAttachment[]> {
  await fs.mkdir(stagingAttachmentsDir, { recursive: true });
  const output: JiraAttachment[] = [];
  for (const attachment of attachments) {
    const fileName = safeAttachmentName(attachment.id, attachment.fileName);
    const target = path.join(stagingAttachmentsDir, fileName);
    assertInside(stagingAttachmentsDir, target);
    try {
      await writer(attachment, target);
      output.push({ ...attachment, localPath: `attachments/${fileName}`, state: 'Downloaded', error: null });
    } catch (error) {
      output.push({ ...attachment, localPath: null, state: 'Failed', error: error instanceof Error ? error.message : String(error) });
    }
  }
  return output;
}

export async function createTicketAtomically(
  sourceRoot: string,
  snapshot: JiraIssueSnapshot,
  importedAt: string,
  fetcher: AttachmentWriter,
): Promise<string> {
  validateSnapshot(snapshot, { url: snapshot.sourceUrl, key: snapshot.key });
  const root = path.resolve(sourceRoot);
  await fs.mkdir(root, { recursive: true });
  await assertTicketKeyAvailable(root, snapshot.key);
  const folder = ticketFolderName(snapshot.key, snapshot.summary);
  const target = path.join(root, folder);
  const staging = path.join(root, `.jira-import-${randomUUID()}`);
  assertInside(root, target);
  assertInside(root, staging);
  try {
    await fs.mkdir(staging);
    const downloaded = await downloadAttachments(
      path.join(staging, 'attachments'),
      snapshot.attachments,
      fetcher,
    );
    const failures = downloaded.filter((attachment) => attachment.state === 'Failed');
    if (failures.length) {
      throw new Error(`Attachment downloads failed: ${failures.map((attachment) => `${attachment.fileName} (${attachment.error ?? 'unknown error'})`).join(', ')}`);
    }
    const finalSnapshot = { ...snapshot, attachments: downloaded };
    await fs.writeFile(path.join(staging, 'ticket.md'), renderTicket(finalSnapshot, importedAt), 'utf8');
    await assertTicketKeyAvailable(root, snapshot.key);
    await fs.rename(staging, target);
    return target;
  } catch (error) {
    await fs.rm(staging, { recursive: true, force: true });
    throw error;
  }
}

export async function assertTicketKeyAvailable(sourceRoot: string, key: string): Promise<void> {
  if (!keyPattern.test(key)) throw new Error(`Invalid Jira issue key: ${key}`);
  const resolvedRoot = path.resolve(sourceRoot);
  let entries;
  try {
    entries = await fs.readdir(resolvedRoot, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
  const prefix = `${key}-`;
  const existing = entries.find((entry) => entry.isDirectory() && !entry.isSymbolicLink() && entry.name.startsWith(prefix));
  if (existing) throw new Error(`Jira ticket ${key} already exists: ${existing.name}`);
}
