# Jira Ticket Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import đúng một Jira issue qua Edge login thủ công thành `ticket/<KEY>-<slug>/ticket.md` cùng attachments, không cần copy/convert thủ công.

**Architecture:** Giữ logic thuần trong `scripts/jira-import-core.ts` để fixture-test không cần Jira; `scripts/jira-import.ts` chỉ điều phối Edge session tạm, DOM extraction, download và atomic commit. Dữ liệu được giữ trong memory/staging cho tới khi core issue hợp lệ; target key tồn tại thì dừng trước browser/download/write.

**Tech Stack:** TypeScript ES modules, Node.js stdlib, `@playwright/test`, Node `node:test`, YAML loader hiện có.

**Spec:** `docs/superpowers/specs/2026-09-21-jira-ticket-import-design.md`

## Global Constraints

- Chỉ Jira origin `https://blinxsolutions.atlassian.net`; đúng một issue mỗi run.
- Hỗ trợ URL argument hoặc issue người dùng tự mở trong Edge automation.
- Mỗi invocation dùng headed Edge session/profile tạm; không lưu/reuse auth state, cookie, token hoặc credential.
- Jira interaction chỉ read-only: navigation, expand, scroll, download; không Jira mutation.
- Thu toàn bộ visible fields, comments, linked issues và attachments; thiếu phải ghi `Not provided` hoặc `Unavailable`, không suy đoán.
- Output duy nhất: `ticket/<KEY>-<summary-slug>/ticket.md` và optional `attachments/`.
- Bất kỳ folder nào cùng ticket key đã tồn tại trong `ticket/` làm run dừng; không merge/overwrite.
- Core extraction/write lỗi không để target folder nửa vời; attachment lỗi riêng lẻ không hủy issue import.
- `## Tester notes` là section cuối, ban đầu rỗng.
- Không tự chạy `paco-ticket`, không ghi `manifest.yaml`/`status.md`, không xử lý video sau download trong importer.
- Không thêm dependency.

## File Map

- Create `scripts/jira-import-core.ts`: model, URL/key/slug/path validation, duplicate scan, filename safety, Markdown rendering, atomic writer.
- Create `scripts/jira-import.ts`: CLI, temporary Edge lifecycle, manual-login pause, rendered UI extraction, attachment download, diagnostics.
- Create `scripts/tests/jira-import.test.ts`: pure fixture/filesystem tests plus local Playwright DOM fixture test.
- Create `scripts/tests/fixtures/jira-issue.html`: sanitized rendered Jira fixture.
- Modify `scripts/workflow-types.ts`: add typed non-sensitive Jira configuration.
- Modify `scripts/load-config.ts`: validate Jira origin and browse path.
- Modify `paco.config.yaml`: configure Jira origin/path.
- Modify `package.json`: register `jira:import`.
- Modify `CLAUDE.md`: define Jira URL trigger and import-only boundary.
- `.gitignore`: unchanged; `/test-results/` already covers diagnostics and no auth profile persists.

---

### Task 1: Jira configuration, URL identity, and duplicate guard

**Files:**
- Modify: `scripts/workflow-types.ts:51-82`
- Modify: `scripts/load-config.ts:62-120`
- Modify: `paco.config.yaml:1-32`
- Create: `scripts/jira-import-core.ts`
- Create: `scripts/tests/jira-import.test.ts`

**Interfaces:**
- Produces `PacoConfig['jira']: { origin: string; browsePath: string }`.
- Produces:
  ```ts
  export interface JiraIdentity { url: string; key: string }
  export function parseJiraIssueUrl(input: string, origin: string, browsePath: string): JiraIdentity
  export function slugifySummary(summary: string): string
  export function ticketFolderName(key: string, summary: string): string
  export async function assertTicketKeyAvailable(sourceRoot: string, key: string): Promise<void>
  export function assertInside(parent: string, child: string): void
  ```

- [ ] **Step 1: Write failing config and identity tests**

```ts
import assert from 'node:assert/strict';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { loadConfig } from '../load-config.js';
import {
  assertTicketKeyAvailable,
  parseJiraIssueUrl,
  slugifySummary,
  ticketFolderName,
} from '../jira-import-core.js';

test('loads configured Jira origin and browse path', () => {
  assert.deepEqual(loadConfig().jira, {
    origin: 'https://blinxsolutions.atlassian.net',
    browsePath: '/browse/',
  });
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
```

- [ ] **Step 2: Run test; verify expected failure**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts`

Expected: FAIL because `jira-import-core.ts` and config fields do not exist.

- [ ] **Step 3: Implement minimal config and identity logic**

Add to `PacoConfig`:

```ts
jira: { origin: string; browsePath: string };
```

Add to `paco.config.yaml`:

```yaml
jira:
  origin: https://blinxsolutions.atlassian.net
  browsePath: /browse/
```

`loadConfig()` must require HTTPS origin with no path/query/hash and `browsePath` beginning/ending `/`. `parseJiraIssueUrl()` accepts exact origin plus `${browsePath}<KEY>`, no credentials/query/hash/port override. Key regex: `^[A-Z][A-Z0-9]*-[0-9]+$`. `slugifySummary()` uses `NFKD`, removes combining marks, lowercases, replaces non-ASCII alphanumeric runs with `-`, trims, caps at 80 characters, falls back to `issue`. Duplicate scan checks directory names matching `^<escaped-key>-` before browser launch.

- [ ] **Step 4: Run focused tests and type-check**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts && npm run type-check`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/workflow-types.ts scripts/load-config.ts paco.config.yaml scripts/jira-import-core.ts scripts/tests/jira-import.test.ts
git commit -m "feat: validate Jira import identity

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 2: Normalized issue model, fixture extraction, and Markdown rendering

**Files:**
- Modify: `scripts/jira-import-core.ts`
- Create: `scripts/tests/fixtures/jira-issue.html`
- Modify: `scripts/tests/jira-import.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface JiraField { name: string; value: string | null; availability: 'Available' | 'Not provided' | 'Unavailable' }
  export interface JiraComment { id: string; author: string | null; createdAt: string | null; body: string | null }
  export interface JiraLinkedIssue { relationship: string | null; key: string; summary: string | null; url: string }
  export interface JiraAttachment { id: string; fileName: string; mediaType: string | null; sizeBytes: number | null; sourceUrl: string; localPath: string | null; state: 'Pending' | 'Downloaded' | 'Failed'; error: string | null }
  export interface JiraIssueSnapshot { sourceUrl: string; key: string; summary: string; description: string | null; acceptanceCriteria: string | null; fields: JiraField[]; linkedIssues: JiraLinkedIssue[]; comments: JiraComment[]; attachments: JiraAttachment[]; unavailableSections: string[] }
  export function jiraExtractionEvaluator(identity: JiraIdentity): () => JiraIssueSnapshot
  export function validateSnapshot(snapshot: JiraIssueSnapshot, identity: JiraIdentity): void
  export function renderTicket(snapshot: JiraIssueSnapshot, importedAt: string): string
  ```

- [ ] **Step 1: Create sanitized fixture and failing extraction/render tests**

Fixture contains semantic elements for `Summary`, `Description`, `Acceptance criteria`, visible field pairs, two comments with author/time, one linked issue and three attachments. Test with local headless Playwright:

```ts
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(await readFile(fixturePath, 'utf8'));
const snapshot = await page.evaluate(jiraExtractionEvaluator(identity));
await browser.close();
assert.equal(snapshot.summary, 'Refactor branching ticket');
assert.equal(snapshot.comments.length, 2);
assert.equal(snapshot.linkedIssues[0].key, 'PAC2-1000');
assert.equal(snapshot.attachments.length, 3);
validateSnapshot(snapshot, identity);
const markdown = renderTicket(snapshot, '2026-09-21T10:00:00.000Z');
assert.match(markdown, /## Summary\n\nRefactor branching ticket/);
assert.match(markdown, /## Comments[\s\S]*QA User[\s\S]*Observed on dev/);
assert.match(markdown, /## Tester notes\n$/);
```

Also test missing description renders `Not provided`, permission-hidden section renders `Unavailable`, key mismatch/cross-origin attachment rejects.

- [ ] **Step 2: Run test; verify failure**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts`

Expected: FAIL on missing model/evaluator/renderer.

- [ ] **Step 3: Implement evaluator, validation, and renderer**

Evaluator priority: accessible/labelled sections, stable `data-testid`, scoped fallback. Normalize whitespace, preserve DOM order, resolve links against `identity.url`, deduplicate comments/attachments/links. `validateSnapshot()` rejects blank summary, key/source mismatch, duplicate IDs, cross-origin or non-attachment download URLs. Renderer emits spec section order, preserves comment author/time, escapes Markdown table pipes, uses `Not provided` only for known empty values and `Unavailable` only for unreadable sections.

- [ ] **Step 4: Run focused tests and type-check**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts && npm run type-check`

Expected: PASS without Jira network access.

- [ ] **Step 5: Commit**

```bash
git add scripts/jira-import-core.ts scripts/tests/jira-import.test.ts scripts/tests/fixtures/jira-issue.html
git commit -m "feat: normalize rendered Jira issues

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 3: Safe attachments and atomic ticket creation

**Files:**
- Modify: `scripts/jira-import-core.ts`
- Modify: `scripts/tests/jira-import.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export function safeAttachmentName(id: string, originalName: string): string
  export type AttachmentFetcher = (url: string) => Promise<{ finalUrl: string; status: number; body: Buffer }>
  export async function downloadAttachments(stagingAttachmentsDir: string, attachments: JiraAttachment[], origin: string, fetcher: AttachmentFetcher): Promise<JiraAttachment[]>
  export async function createTicketAtomically(sourceRoot: string, snapshot: JiraIssueSnapshot, importedAt: string): Promise<string>
  ```

- [ ] **Step 1: Write failing attachment and atomic-write tests**

```ts
assert.equal(safeAttachmentName('20001', '../../screen.png'), '20001-screen.png');
assert.equal(safeAttachmentName('20002', 'CON.mp4'), '20002-CON.mp4');
```

Use injected fetcher: first attachment succeeds, second returns 403, third succeeds. Assert states `Downloaded`, `Failed`, `Downloaded`; downloaded bytes match; no URL body/header is logged. Atomic tests assert:

- successful run creates exactly `<folder>/ticket.md` plus successful attachment files;
- `ticket.md` ends with one final `## Tester notes`;
- duplicate key fails before staging;
- injected write/rename failure leaves no target folder and cleans staging;
- traversal/symlink-like output is rejected by `assertInside()`/`lstat()` checks.

- [ ] **Step 2: Run test; verify failure**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts`

Expected: FAIL on missing attachment/atomic APIs.

- [ ] **Step 3: Implement downloader and atomic commit**

Filename format `<id>-<sanitized-basename>`; replace controls and Windows/POSIX forbidden characters, trim trailing dots/spaces, cap at 180 characters preserving extension. Fetcher result must be 2xx and `finalUrl` remain on configured origin. Write each attachment via temporary file then rename. Record per-file failure without throwing. `createTicketAtomically()` creates `.jira-import-<random>` under source root, writes attachments then rendered `ticket.md`, rechecks key availability, renames staging directory to final target, cleans staging in `finally` on failure.

- [ ] **Step 4: Run focused tests and type-check**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts && npm run type-check`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/jira-import-core.ts scripts/tests/jira-import.test.ts
git commit -m "feat: write Jira tickets atomically

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 4: Temporary Edge orchestration and CLI

**Files:**
- Create: `scripts/jira-import.ts`
- Modify: `scripts/tests/jira-import.test.ts`
- Modify: `package.json:5-15`

**Interfaces:**
- Produces:
  ```ts
  export function isJiraIssueUrl(value: string, origin: string, browsePath: string): boolean
  export function isJiraAuthenticationUrl(value: string): boolean
  export async function waitForEnter(input?: NodeJS.ReadableStream, output?: NodeJS.WritableStream): Promise<void>
  export async function main(argv?: string[]): Promise<void>
  ```
- Public command: `npm run jira:import -- [jira-url]`.

- [ ] **Step 1: Write failing CLI helper and registration tests**

```ts
assert.equal(isJiraAuthenticationUrl('https://id.atlassian.com/login?continue=x'), true);
assert.equal(isJiraIssueUrl(identity.url, config.jira.origin, config.jira.browsePath), true);
assert.equal(isJiraIssueUrl('https://blinxsolutions.atlassian.net/browse/PAC2-9999', config.jira.origin, config.jira.browsePath), true);
const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8'));
assert.equal(packageJson.scripts['jira:import'], 'node --loader ts-node/esm scripts/jira-import.ts');
```

Test `waitForEnter(Readable.from(['\n']), writable)` resolves once. Test more than one argument rejects before browser launch.

- [ ] **Step 2: Run test; verify failure**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts`

Expected: FAIL because CLI and package script are absent.

- [ ] **Step 3: Implement exact browser flow**

`main()` sequence:

1. Load config; accept zero or one URL argument.
2. With URL: parse identity and call `assertTicketKeyAvailable()` before browser launch.
3. Launch `chromium.launch({ channel: 'msedge', headless: false })`; no `userDataDir`, storage-state save or CDP flags.
4. Open URL or configured Jira origin. Print Vietnamese instruction to login/open issue; wait for terminal `Enter`.
5. Parse current `/browse/<KEY>` URL; with supplied URL require exact same key. Run duplicate-key guard for no-URL mode.
6. Expand/scroll read-only field, comments, links, attachments regions until counts stabilize twice, capped at 30 seconds.
7. Evaluate extractor and validate core snapshot.
8. Resolve final folder from summary; download attachments through authenticated `context.request.get()` fetcher. Reject non-2xx/cross-origin final URL.
9. Call atomic writer. Print target path plus unavailable sections and failed attachment names.
10. Close browser in `finally`; temporary browser context disappears without persistence.

On auth/core extraction failure, save screenshot to `test-results/jira-import/<timestamp>.png`, throw `Blocked: <reason>`, create no ticket folder. Direct-entry wrapper prints only sanitized message and sets exit code 1.

Add:

```json
"jira:import": "node --loader ts-node/esm scripts/jira-import.ts"
```

- [ ] **Step 4: Run focused suite, type-check, and invalid-input smoke**

Run:

```bash
node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts
npm run type-check
npm run jira:import -- https://evil.test/browse/PAC2-3798
```

Expected: tests/type-check PASS; invalid URL exits non-zero with `Invalid Jira issue URL`, opens no browser, creates no ticket.

- [ ] **Step 5: Commit**

```bash
git add scripts/jira-import.ts scripts/tests/jira-import.test.ts package.json
git commit -m "feat: import Jira tickets through Edge

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 5: Claude trigger, project validation, and authorized live-run boundary

**Files:**
- Modify: `CLAUDE.md:25-38`
- Modify: `scripts/tests/jira-import.test.ts`

**Interfaces:**
- Consumes public command from Task 4.
- Produces durable behavior rule: configured Jira issue URL means import request; successful import does not imply `paco-ticket` execution.

- [ ] **Step 1: Add failing repository-contract test**

```ts
const instructions = await readFile(path.resolve('CLAUDE.md'), 'utf8');
assert.match(instructions, /blinxsolutions\.atlassian\.net\/browse\/<TICKET-ID>/);
assert.match(instructions, /không tự chạy `paco-ticket`/);
assert.match(instructions, /mỗi lần import.*đăng nhập thủ công/i);
```

- [ ] **Step 2: Run test; verify failure**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/jira-import.test.ts`

Expected: FAIL because trigger documentation is absent.

- [ ] **Step 3: Document the minimal trigger contract**

Add a `## Jira Import` section to `CLAUDE.md`:

```markdown
## Jira Import

- URL `https://blinxsolutions.atlassian.net/browse/<TICKET-ID>` là yêu cầu import đúng một Jira issue vào `ticket/` bằng `npm run jira:import -- <URL>`.
- Mỗi lần import mở Edge session mới; người dùng đăng nhập thủ công; không lưu/reuse Jira authentication.
- Folder cùng ticket key đã tồn tại thì dừng; không merge/overwrite.
- Import thành công không tự chạy `paco-ticket`; workflow QA cần yêu cầu riêng.
```

- [ ] **Step 4: Run full validation**

Run:

```bash
npm run type-check
npm run test:fixtures
npm run validate:static
git diff --check
git status --short
```

Expected: all commands exit 0; status includes only planned Jira files plus pre-existing unrelated changes. Diff contains no real Jira body, credential, cookie, token, signed attachment URL or browser state.

- [ ] **Step 5: Stop before live Jira import**

Do not run `PAC2-3798` during implementation verification. Report that controlled smoke remains pending because it opens Jira, requires manual login, downloads data and creates local ticket source. Ask for explicit run approval separately.

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md scripts/tests/jira-import.test.ts
git commit -m "docs: define Jira import trigger

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

## Self-Review Results

- Spec coverage: URL/no-URL input, temporary Edge login, full rendered data, comments, links, attachments, duplicate stop, atomic output, diagnostics, privacy, trigger behavior and validation map to Tasks 1–5.
- Scope correction: removed persistent Edge profile, CDP, reimport/merge, `source/issue.json`, `attachments.md`, attachment confirmation and automatic video ingestion; those contradicted the approved spec.
- Placeholder scan: no `TBD`, `TODO`, unspecified error handling or undefined later interface remains.
- Type consistency: `JiraIdentity`, `JiraIssueSnapshot`, `JiraAttachment` and public signatures are defined once and reused unchanged.
- Live selector risk: fixture establishes the contract; first authorized live smoke may require adding observed selector fallbacks plus sanitized regression fixture updates.
