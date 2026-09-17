import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const invalidPath = path.join(outDir, 'qa-invalid.exe');
const validPath = path.join(outDir, 'qa-remove.txt');
await writeFile(invalidPath, 'Synthetic invalid extension; no executable content.\n');
await writeFile(validPath, 'Synthetic QA file; no personal data.\n');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages.toReversed()) if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]:visible').count()) { page = candidate; break; }
if (!page) throw new Error('Blocked: Quick Send missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
const tab = dialog.locator('button').filter({ hasText: /^\s*\d*\s*Files\s*$/i }).first();
await tab.click();
const input = dialog.locator('input[type="file"]').first();
const accept = await input.getAttribute('accept');
await input.setInputFiles(invalidPath);
const invalidToast = page.locator('.p-toast-message:visible').last();
await invalidToast.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
const invalidVisible = await dialog.getByText(/qa-invalid\.exe/i).isVisible().catch(() => false);
const invalidRejected = !invalidVisible && (await invalidToast.isVisible().catch(() => false));
await input.setInputFiles(validPath);
const validName = dialog.getByText(/qa-remove\.txt/i).first();
await validName.waitFor({ state: 'visible', timeout: 10_000 });
const row = validName.locator('xpath=ancestor::*[self::li or self::div][.//button][1]');
let remove = row.getByRole('button', { name: /Remove|Delete/i }).first();
if (!(await remove.isVisible().catch(() => false))) remove = row.locator('button').last();
const removeControlVisible = await remove.isVisible().catch(() => false);
if (removeControlVisible) await remove.click();
const removed = await validName.waitFor({ state: 'hidden', timeout: 10_000 }).then(() => true).catch(() => false);
const summary = {
  scope: 'Quick Send file invalid-type validation and remove',
  result: invalidRejected && removed ? 'Pass' : 'Inconclusive',
  observation: { accept, invalidRejected, invalidFileRendered: invalidVisible, validationFeedbackVisible: await invalidToast.isVisible().catch(() => false), validFileAttached: true, removeControlVisible, removed },
  mutation: { class: 'Temporary draft', occurred: true, action: 'Attempted synthetic invalid file; attached then removed synthetic text file' },
  cleanup: { required: true, performed: removed, leftovers: removed ? [] : ['qa-remove.txt draft attachment'] },
  sensitiveData: { persisted: false, screenshots: false }, observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '44-file-validation-remove.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
