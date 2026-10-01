import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { Readable, Writable } from 'node:stream';
import path from 'node:path';
import { test } from 'node:test';
import { chromium } from '@playwright/test';
import { downloadFromBrowserUrl, downloadRestAttachment, fetchJiraAttachments, fetchJiraComments, isJiraAuthenticationUrl, isJiraIssueUrl, resolveAttachmentMediaIds, resolveJiraProfileDirectory, saveBrowserDownload, waitForEnter } from '../jira-import.js';
import { loadConfig } from '../load-config.js';
import {
  assertTicketKeyAvailable,
  parseJiraIssueUrl,
  slugifySummary,
  ticketFolderName,
  jiraExtractionEvaluator,
  renderTicket,
  validateSnapshot,
  createTicketAtomically,
  downloadAttachments,
  safeAttachmentName,
  parseJiraCommentPage,
  collectJiraCommentPages,
  relinkCommentMedia,
  mediaIdFromMediaUrl,
} from '../jira-import-core.js';

test('loads configured Jira origin and browse path', () => {
  assert.deepEqual(loadConfig().jira, {
    origin: 'https://blinxsolutions.atlassian.net',
    browsePath: '/browse/',
  });
});

test('uses a dedicated local Jira browser profile', async () => {
  const config = loadConfig();
  assert.equal(
    resolveJiraProfileDirectory('D:/repo', config.paths.playwrightAuth),
    'D:\\repo\\playwright\\.auth\\jira-chrome-profile',
  );
  const source = await readFile(path.resolve('scripts/jira-import.ts'), 'utf8');
  assert.match(source, /launchPersistentContext/);
  assert.match(source, /channel:\s*'chrome'/);
  assert.doesNotMatch(source, /storageState|sessionStorage/);
  assert.match(source, /if \(completed\) await context\.close\(\)/);
  assert.match(source, /request\.newContext\(\)/);
  assert.doesNotMatch(source, /downloadFromBrowserUrl\(page, button, context\.request/);
  assert.match(source, /if \(page\.isClosed\(\)\) await reopenIssue\(\)/);
  assert.match(source, /downloadRestAttachment\(context\.request, attachment\.sourceUrl/);
  assert.match(source, /throw new Error\('Attachment request failed'\)/);
});

test('accepts only a configured Jira issue URL', () => {
  assert.deepEqual(
    parseJiraIssueUrl('https://blinxsolutions.atlassian.net/browse/PAC2-3798', 'https://blinxsolutions.atlassian.net', '/browse/'),
    { url: 'https://blinxsolutions.atlassian.net/browse/PAC2-3798', key: 'PAC2-3798' },
  );
  for (const value of [
    'https://evil.test/browse/PAC2-3798',
    'https://blinxsolutions.atlassian.net/issues/PAC2-3798',
    'https://blinxsolutions.atlassian.net/browse/PAC2-3798?x=1',
  ]) assert.throws(() => parseJiraIssueUrl(value, 'https://blinxsolutions.atlassian.net', '/browse/'), /Invalid Jira issue URL/);
});

test('builds a valid deterministic folder name', () => {
  assert.equal(slugifySummary(' Refactor branching — ticket! '), 'refactor-branching-ticket');
  assert.equal(ticketFolderName('PAC2-3798', ' Refactor branching — ticket! '), 'PAC2-3798-refactor-branching-ticket');
});

test('rejects any existing folder with the same key', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'jira-import-'));
  await mkdir(path.join(root, 'PAC2-3798-old-title'));
  await assert.rejects(assertTicketKeyAvailable(root, 'PAC2-3798'), /already exists/);
});

test('extracts summary from Jira h1 outside main', async () => {
  const identity = { url: 'https://blinxsolutions.atlassian.net/browse/PAC2-4399', key: 'PAC2-4399' };
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent('<div id="jira"><h1>Update O/e Blood Pressure Codes</h1></div>');
    const snapshot = await page.evaluate(jiraExtractionEvaluator(), identity);
    assert.equal(snapshot.summary, 'Update O/e Blood Pressure Codes');
  } finally {
    await browser.close();
  }
});

test('extracts and renders the normalized Jira fixture', async () => {
  const identity = { url: 'https://blinxsolutions.atlassian.net/browse/PAC2-3798', key: 'PAC2-3798' };
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const fixture = path.resolve('scripts/tests/fixtures/jira-issue.html');
    await page.setContent(await readFile(fixture, 'utf8'));
    const snapshot = await page.evaluate(jiraExtractionEvaluator(), identity);
    assert.equal(snapshot.summary, 'Refactor branching ticket');
    assert.equal(snapshot.comments.length, 2);
    assert.equal(snapshot.linkedIssues[0].key, 'PAC2-1000');
    assert.equal(snapshot.attachments.length, 3);
    validateSnapshot(snapshot, identity);
    const markdown = renderTicket(snapshot, '2026-09-21T10:00:00.000Z');
    assert.match(markdown, /## Summary\n\nRefactor branching ticket/);
    assert.match(markdown, /## Comments[\s\S]*QA User[\s\S]*Observed on dev/);
    assert.match(markdown, /Captured comments: 2/);
    assert.match(markdown, /## Tester notes\n$/);
  } finally {
    await browser.close();
  }
});

test('extracts comments and attachments from accessible Jira sections', async () => {
  const identity = { url: 'https://blinxsolutions.atlassian.net/browse/PAC2-4700', key: 'PAC2-4700' };
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(`
      <h1>Branching ticket</h1>
      <section aria-label="Comments">
        <article data-comment-id="10003"><span>QA User</span><time datetime="2026-09-22T10:00:00.000Z"></time><p>Current Jira comment.</p></article>
        <article data-testid="comment-base-item-10004"><span>Developer</span><p>Current Jira activity comment.</p></article>
      </section>
      <section aria-label="Attachments">
        <a href="https://blinxsolutions.atlassian.net/secure/attachment/20004/current.png">current.png</a>
        <div data-testid="attachment-id.20005"><span data-test-media-name>recording.mp4 22 Sep 2026, 10:00 AM</span><button data-testid="media-card-primary-action" aria-label="recording.mp4 — Download"></button></div>
      </section>
    `);
    const snapshot = await page.evaluate(jiraExtractionEvaluator(), identity);
    assert.deepEqual(snapshot.comments, [
      { id: '10003', author: 'QA User', createdAt: '2026-09-22T10:00:00.000Z', body: 'Current Jira comment.' },
      { id: '10004', author: 'Developer', createdAt: null, body: 'Current Jira activity comment.' },
    ]);
    assert.deepEqual(snapshot.attachments.map(({ id, fileName }) => ({ id, fileName })), [
      { id: '20004', fileName: 'current.png' },
      { id: '20005', fileName: 'recording.mp4' },
    ]);
  } finally {
    await browser.close();
  }
});

test('parses Jira API comments with author, timestamp, and ADF table', () => {
  const page = parseJiraCommentPage({
    startAt: 0,
    maxResults: 100,
    total: 2,
    comments: [
      {
        id: '10',
        author: { displayName: 'QA User' },
        created: '2026-09-22T10:00:00.000+0000',
        body: {
          type: 'doc',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Before ' }, { type: 'text', text: 'code', marks: [{ type: 'code' }] }] },
            { type: 'table', content: [{ type: 'tableRow', content: [
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A' }] }] },
              { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'B' }] }] },
            ] }, { type: 'tableRow', content: [
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1' }] }] },
              { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2' }] }] },
            ] }] },
          ],
        },
      },
      {
        id: '11',
        author: { displayName: 'Developer' },
        created: '2026-09-22T11:00:00.000+0000',
        body: { type: 'doc', content: [{ type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Done' }] }] }] }] },
      },
    ],
  });
  assert.equal(page.total, 2);
  assert.equal(page.comments[0].author, 'QA User');
  assert.equal(page.comments[0].createdAt, '2026-09-22T10:00:00.000+0000');
  assert.match(page.comments[0].body ?? '', /Before `code`/);
  assert.match(page.comments[0].body ?? '', /\| A \| B \|/);
  assert.equal(page.comments[1].body, '- Done');
});

test('renders ADF comment media at its source position', () => {
  const page = parseJiraCommentPage({
    startAt: 0, maxResults: 100, total: 1,
    comments: [{
      id: '12', author: { displayName: 'QA User' }, created: '2026-09-22T12:00:00.000Z',
      body: { type: 'doc', content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Before' }] },
        { type: 'mediaSingle', content: [{ type: 'media', attrs: { id: 'media-uuid', alt: 'evidence.png' } }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'After' }] },
      ] },
    }],
  });
  assert.equal(page.comments[0].body, 'Before\n\n[Evidence: evidence.png](attachments/media-uuid-evidence.png)\n\nAfter');
  assert.deepEqual(page.media, [{ id: 'media-uuid', fileName: 'evidence.png' }]);
});

test('relinks comment media to its issue attachment', () => {
  const comments = [{ id: '1', author: 'QA', createdAt: '2026-09-22T10:00:00.000Z', body: '[Evidence: evidence.png](attachments/media-uuid-evidence.png)' }];
  const attachments = [{ id: '200', fileName: 'evidence.png', mediaType: 'image/png', sizeBytes: null, sourceUrl: 'https://blinxsolutions.atlassian.net/secure/attachment/200/evidence.png', localPath: null, state: 'Pending' as const, error: null }];
  assert.deepEqual(
    relinkCommentMedia(comments, [{ id: 'media-uuid', fileName: 'evidence.png' }], attachments),
    [{ ...comments[0], body: '[Evidence: evidence.png](attachments/200-evidence.png)' }],
  );
  assert.throws(() => relinkCommentMedia(comments, [{ id: 'missing', fileName: 'missing.png' }], attachments), /unresolved Jira comment media/);
});

test('renders ADF media without alt as a placeholder filename', () => {
  const page = parseJiraCommentPage({
    startAt: 0, maxResults: 100, total: 1,
    comments: [{
      id: '13', author: { displayName: 'QA User' }, created: '2026-09-22T12:00:00.000Z',
      body: { type: 'doc', content: [
        { type: 'mediaSingle', content: [{ type: 'media', attrs: { id: 'media-uuid', type: 'file' } }] },
      ] },
    }],
  });
  assert.equal(page.comments[0].body, '[Evidence: media](attachments/media-uuid-media)');
  assert.deepEqual(page.media, [{ id: 'media-uuid', fileName: 'media' }]);
});

test('relinks unnamed comment media by media UUID', () => {
  const comments = [{ id: '1', author: 'QA', createdAt: '2026-09-22T10:00:00.000Z', body: '[Evidence: media](attachments/media-uuid-media)' }];
  const attachments = [{ id: '201', fileName: 'notes.docx', mediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', sizeBytes: null, sourceUrl: 'https://blinxsolutions.atlassian.net/rest/api/3/attachment/content/201', localPath: null, state: 'Pending' as const, error: null }];
  assert.deepEqual(
    relinkCommentMedia(comments, [{ id: 'media-uuid', fileName: 'media' }], attachments, new Map([['media-uuid', attachments[0]]])),
    [{ ...comments[0], body: '[Evidence: notes.docx](attachments/201-notes.docx)' }],
  );
});

test('extracts media UUID from Media Platform file URL', () => {
  assert.equal(
    mediaIdFromMediaUrl('https://api.media.atlassian.com/file/091d6daf-81f9-4904-8876-10f1d1e21605/binary'),
    '091d6daf-81f9-4904-8876-10f1d1e21605',
  );
  assert.equal(mediaIdFromMediaUrl('https://blinxsolutions.atlassian.net/rest/api/3/attachment/content/201'), null);
});

test('maps unmatched attachments to media UUIDs from HEAD redirects', async () => {
  const attachments = [{
    id: '201',
    fileName: 'notes.docx',
    mediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: null,
    sourceUrl: 'https://blinxsolutions.atlassian.net/rest/api/3/attachment/content/201',
    localPath: null,
    state: 'Pending' as const,
    error: null,
  }];
  const map = await resolveAttachmentMediaIds({
    get: async () => { throw new Error('unused'); },
    head: async (url) => {
      assert.equal(url, attachments[0].sourceUrl);
      return { status: () => 200, url: () => 'https://api.media.atlassian.com/file/091d6daf-81f9-4904-8876-10f1d1e21605/binary' };
    },
  }, attachments, 'https://blinxsolutions.atlassian.net');
  assert.equal(map.get('091d6daf-81f9-4904-8876-10f1d1e21605'), attachments[0]);
});

test('rejects malformed Jira API comment pagination', () => {
  assert.throws(
    () => parseJiraCommentPage({ startAt: 0, maxResults: 100, total: 2, comments: [{ id: '1', author: {}, created: '', body: null }] }),
    /Invalid Jira comment page/,
  );
});

test('collects every Jira API comment page exactly once', async () => {
  const pages = [
    { startAt: 0, maxResults: 2, total: 3, comments: [
      { id: '1', author: { displayName: 'One' }, created: '2026-09-22T10:00:00.000Z', body: { type: 'doc', content: [] } },
      { id: '2', author: { displayName: 'Two' }, created: '2026-09-22T10:01:00.000Z', body: { type: 'doc', content: [] } },
    ] },
    { startAt: 2, maxResults: 2, total: 3, comments: [
      { id: '3', author: { displayName: 'Three' }, created: '2026-09-22T10:02:00.000Z', body: { type: 'doc', content: [] } },
    ] },
  ];
  const result = await collectJiraCommentPages(async (startAt) => pages.find((page) => page.startAt === startAt));
  assert.equal(result.total, 3);
  assert.deepEqual(result.comments.map((comment) => comment.id), ['1', '2', '3']);
});

test('rejects incomplete or duplicate Jira API comment pages', async () => {
  await assert.rejects(
    collectJiraCommentPages(async () => ({ startAt: 0, maxResults: 100, total: 2, comments: [
      { id: '1', author: { displayName: 'One' }, created: '2026-09-22T10:00:00.000Z', body: { type: 'doc', content: [] } },
    ] })),
    /Invalid Jira comment pagination/,
  );
  await assert.rejects(
    collectJiraCommentPages(async (startAt) => ({ startAt, maxResults: 1, total: 2, comments: [
      { id: '1', author: { displayName: 'One' }, created: '2026-09-22T10:00:00.000Z', body: { type: 'doc', content: [] } },
    ] })),
    /Invalid Jira comment pagination/,
  );
});

test('fetches paginated Jira comments through the active page only', async () => {
  const urls: string[] = [];
  const page = {
    evaluate: async <T>(_callback: unknown, url: string): Promise<T> => {
      urls.push(url);
      return ({ startAt: urls.length - 1, maxResults: 1, total: 2, comments: [{
        id: String(urls.length), author: { displayName: 'QA User' }, created: '2026-09-22T10:00:00.000Z', body: { type: 'doc', content: [] },
      }] } as T);
    },
  };
  const result = await fetchJiraComments(page, 'PAC2-4700');
  assert.equal(result.total, 2);
  assert.deepEqual(urls, [
    '/rest/api/3/issue/PAC2-4700/comment?startAt=0&maxResults=100',
    '/rest/api/3/issue/PAC2-4700/comment?startAt=1&maxResults=100',
  ]);
});

test('fetches all issue attachments through the active page', async () => {
  const page = { evaluate: async <T>(): Promise<T> => ({ fields: { attachment: [{
    id: '200', filename: 'evidence.png', mimeType: 'image/png', size: 4,
    content: 'https://blinxsolutions.atlassian.net/secure/attachment/200/evidence.png',
  }] } } as T) };
  assert.deepEqual(await fetchJiraAttachments(page, 'PAC2-4700'), [{
    id: '200', fileName: 'evidence.png', mediaType: 'image/png', sizeBytes: 4,
    sourceUrl: 'https://blinxsolutions.atlassian.net/secure/attachment/200/evidence.png', localPath: null, state: 'Pending', error: null,
  }]);
});

test('downloads attachments independently and sanitizes names', async () => {
  assert.equal(safeAttachmentName('20001', '../../screen.png'), '20001-screen.png');
  assert.equal(safeAttachmentName('20002', 'CON.mp4'), '20002-CON.mp4');
  const root = await mkdtemp(path.join(tmpdir(), 'jira-attachments-'));
  const attachments = [
    { id: '1', fileName: 'one.txt', mediaType: 'text/plain', sizeBytes: 3, sourceUrl: 'https://blinxsolutions.atlassian.net/secure/attachment/1/one.txt', localPath: null, state: 'Pending' as const, error: null },
    { id: '2', fileName: 'two.txt', mediaType: 'text/plain', sizeBytes: 3, sourceUrl: 'https://blinxsolutions.atlassian.net/secure/attachment/2/two.txt', localPath: null, state: 'Pending' as const, error: null },
    { id: '3', fileName: 'three.txt', mediaType: 'text/plain', sizeBytes: 5, sourceUrl: 'https://blinxsolutions.atlassian.net/secure/attachment/3/three.txt', localPath: null, state: 'Pending' as const, error: null },
  ];
  const result = await downloadAttachments(root, attachments, async (attachment, target) => {
    if (attachment.id === '2') throw new Error('forbidden');
    await import('node:fs/promises').then(({ writeFile }) => writeFile(target, attachment.id === '1' ? 'one' : 'three'));
  });
  assert.deepEqual(result.map((item) => item.state), ['Downloaded', 'Failed', 'Downloaded']);
  assert.equal(await readFile(path.join(root, '1-one.txt'), 'utf8'), 'one');
  assert.equal(await readFile(path.join(root, '3-three.txt'), 'utf8'), 'three');
});

test('does not publish a ticket when any attachment download fails', async () => {
  const sourceRoot = await mkdtemp(path.join(tmpdir(), 'jira-ticket-failed-'));
  const snapshot = {
    sourceUrl: 'https://blinxsolutions.atlassian.net/browse/PAC2-4700',
    key: 'PAC2-4700',
    summary: 'Failed attachment',
    description: null,
    acceptanceCriteria: null,
    fields: [], linkedIssues: [], comments: [], unavailableSections: [],
    attachments: [{ id: '1', fileName: 'evidence.png', mediaType: 'image/png', sizeBytes: null, sourceUrl: 'jira-download:1', localPath: null, state: 'Pending' as const, error: null }],
  };
  await assert.rejects(
    createTicketAtomically(sourceRoot, snapshot, '2026-09-22T10:00:00.000Z', async () => { throw new Error('browser closed'); }),
    /Attachment downloads failed: evidence.png/,
  );
  assert.deepEqual(await readdir(sourceRoot), []);
});

test('accepts Jira REST attachment content URLs', () => {
  const identity = { url: 'https://blinxsolutions.atlassian.net/browse/PAC2-4700', key: 'PAC2-4700' };
  assert.doesNotThrow(() => validateSnapshot({
    sourceUrl: identity.url, key: identity.key, summary: 'REST attachment', description: null, acceptanceCriteria: null,
    fields: [], linkedIssues: [], comments: [], unavailableSections: [],
    attachments: [{ id: '1', fileName: 'evidence.png', mediaType: 'image/png', sizeBytes: null, sourceUrl: 'https://blinxsolutions.atlassian.net/rest/api/3/attachment/content/1', localPath: null, state: 'Pending', error: null }],
  }, identity));
});

test('creates a complete ticket folder atomically', async () => {
  const sourceRoot = await mkdtemp(path.join(tmpdir(), 'jira-ticket-'));
  const snapshot = {
    sourceUrl: 'https://blinxsolutions.atlassian.net/browse/PAC2-3798',
    key: 'PAC2-3798',
    summary: 'Atomic output',
    description: 'Description',
    acceptanceCriteria: null,
    fields: [], linkedIssues: [], comments: [], unavailableSections: [],
    attachments: [{ id: '1', fileName: 'one.txt', mediaType: 'text/plain', sizeBytes: 3, sourceUrl: 'https://blinxsolutions.atlassian.net/secure/attachment/1/one.txt', localPath: null, state: 'Pending' as const, error: null }],
  };
  const target = await createTicketAtomically(sourceRoot, snapshot, '2026-09-21T10:00:00.000Z', async (_attachment, destination) => { await import('node:fs/promises').then(({ writeFile }) => writeFile(destination, 'one')); });
  assert.deepEqual((await readdir(target)).sort(), ['attachments', 'ticket.md']);
  assert.match(await readFile(path.join(target, 'ticket.md'), 'utf8'), /## Tester notes\n$/);
  await assert.rejects(createTicketAtomically(sourceRoot, snapshot, '2026-09-21T10:00:00.000Z', async (_attachment, destination) => { await import('node:fs/promises').then(({ writeFile }) => writeFile(destination, 'one')); }), /already exists/);
});

test('saves a browser download only when its filename matches the Jira attachment', async () => {
  const calls: string[] = [];
  const page = {
    waitForEvent: async (event: string) => {
      calls.push(`wait:${event}`);
      return {
        suggestedFilename: () => 'evidence.png',
        saveAs: async (target: string) => { calls.push(`save:${target}`); },
      };
    },
  };
  const button = { click: async () => { calls.push('click'); } };
  await saveBrowserDownload(page, button, 'evidence.png', 'D:/staging/1-evidence.png');
  assert.deepEqual(calls, ['wait:download', 'click', 'save:D:/staging/1-evidence.png']);
  await assert.rejects(
    saveBrowserDownload(page, button, 'other.png', 'D:/staging/1-other.png'),
    /Download filename mismatch/,
  );
});

test('downloads a REST attachment content URL via trusted redirect', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'jira-rest-download-'));
  const target = path.join(root, 'evidence.mov');
  const calls: string[] = [];
  const request = {
    get: async (url: string, options?: { timeout?: number }) => {
      const parsed = new URL(url);
      calls.push(`${parsed.origin}${parsed.pathname}:${options?.timeout}`);
      return {
        status: () => 200,
        url: () => 'https://api.media.atlassian.com/file/abc/binary?token=secret',
        body: async () => Buffer.from('video'),
      };
    },
  };
  await downloadRestAttachment(request, 'https://blinxsolutions.atlassian.net/rest/api/3/attachment/content/1', target, 'https://blinxsolutions.atlassian.net');
  await assert.rejects(
    downloadRestAttachment({ get: async () => { throw new Error('GET https://api.media.atlassian.com/file?token=secret timed out'); } }, 'https://blinxsolutions.atlassian.net/rest/api/3/attachment/content/1', target, 'https://blinxsolutions.atlassian.net'),
    (error: Error) => error.message === 'Attachment request failed',
  );
  assert.deepEqual(calls, ['https://blinxsolutions.atlassian.net/rest/api/3/attachment/content/1:300000']);
  assert.equal(await readFile(target, 'utf8'), 'video');
});

test('downloads a signed browser URL without waiting for the browser file', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'jira-signed-download-'));
  const target = path.join(root, 'evidence.png');
  const calls: string[] = [];
  const page = {
    waitForEvent: async () => ({
      suggestedFilename: () => 'evidence.png',
      url: () => 'https://api.media.atlassian.com/file/abc/binary?token=secret',
      cancel: async () => { calls.push('cancel'); },
    }),
  };
  const button = { click: async () => { calls.push('click'); } };
  const request = {
    get: async (url: string, options?: { timeout?: number }) => {
      calls.push(`${new URL(url).origin}:${options?.timeout}`);
      return {
        status: () => 200,
        url: () => 'https://api.media.atlassian.com/file/abc/binary?token=secret',
        body: async () => Buffer.from('image'),
      };
    },
  };
  await downloadFromBrowserUrl(page, button, request, 'evidence.png', target, 'https://blinxsolutions.atlassian.net');
  assert.deepEqual(calls, ['click', 'cancel', 'https://api.media.atlassian.com:300000']);
  assert.equal(await readFile(target, 'utf8'), 'image');
});

test('sanitizes signed URL request failures', async () => {
  const page = {
    waitForEvent: async () => ({
      suggestedFilename: () => 'video.mp4',
      url: () => 'https://media-cdn.atlassian.com/file?token=secret',
      cancel: async () => {},
    }),
  };
  const button = { click: async () => {} };
  const request = { get: async () => { throw new Error('GET https://media-cdn.atlassian.com/file?token=secret timed out'); } };
  await assert.rejects(
    downloadFromBrowserUrl(page, button, request, 'video.mp4', 'D:/staging/video.mp4', 'https://blinxsolutions.atlassian.net'),
    (error: Error) => error.message === 'Attachment request failed',
  );
});

test('rejects an untrusted browser download redirect', async () => {
  const page = {
    waitForEvent: async () => ({
      suggestedFilename: () => 'evidence.png',
      url: () => 'https://evil.test/file',
      cancel: async () => {},
    }),
  };
  const button = { click: async () => {} };
  const request = { get: async () => { throw new Error('must not request'); } };
  await assert.rejects(
    downloadFromBrowserUrl(page, button, request, 'evidence.png', 'D:/staging/evidence.png', 'https://blinxsolutions.atlassian.net'),
    /Untrusted attachment URL/,
  );
});

test('validates CLI URL states and waits for terminal confirmation', async () => {
  assert.equal(isJiraAuthenticationUrl('https://id.atlassian.com/login?continue=x'), true);
  assert.equal(isJiraAuthenticationUrl('https://blinxsolutions.atlassian.net/login'), true);
  assert.equal(isJiraIssueUrl('https://blinxsolutions.atlassian.net/browse/PAC2-3798', 'https://blinxsolutions.atlassian.net', '/browse/'), true);
  assert.equal(isJiraIssueUrl('https://blinxsolutions.atlassian.net/browse/PAC2-3798?focusedCommentId=1', 'https://blinxsolutions.atlassian.net', '/browse/'), true);
  let prompt = '';
  await waitForEnter(Readable.from(['\n']), new Writable({ write(chunk, _encoding, callback) { prompt += chunk.toString(); callback(); } }));
  assert.match(prompt, /Nhấn Enter/);
  const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8')) as { scripts: Record<string, string> };
  assert.equal(packageJson.scripts['jira:import'], 'node --loader ts-node/esm scripts/jira-import.ts');
});

test('renders missing and unavailable values without inference', () => {
  const identity = { url: 'https://blinxsolutions.atlassian.net/browse/PAC2-3798', key: 'PAC2-3798' };
  const snapshot = {
    sourceUrl: identity.url,
    key: identity.key,
    summary: 'Minimal issue',
    description: null,
    acceptanceCriteria: null,
    fields: [],
    linkedIssues: [],
    comments: [],
    attachments: [],
    unavailableSections: ['Acceptance criteria'],
  };
  const markdown = renderTicket(snapshot, '2026-09-21T10:00:00.000Z');
  assert.match(markdown, /## Description\n\nNot provided/);
  assert.match(markdown, /## Acceptance criteria\n\nUnavailable/);
  assert.throws(() => validateSnapshot({ ...snapshot, key: 'PAC2-1' }, identity), /Invalid Jira issue snapshot/);
});
