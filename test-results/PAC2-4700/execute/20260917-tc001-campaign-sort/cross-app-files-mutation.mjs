import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const targets = [
  ['base', 'https://blinx.dev.blinxpaco-np.com/paco/dashboard/'],
  ['connect', 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/'],
  ['os', 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard'],
];
const runId = `20260917-files-${Date.now()}`;
const outDir = path.resolve(`test-results/PAC2-4700/execute/${runId}`);
await mkdir(outDir, { recursive: true });
const invalidPath = path.join(outDir, 'qa-invalid.exe');
const validPath = path.join(outDir, 'qa-remove.txt');
await writeFile(invalidPath, 'Synthetic invalid extension; no executable content.\n');
await writeFile(validPath, 'Synthetic QA file; no personal data.\n');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no authenticated CDP context');

async function openQuickSend(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
  await search.waitFor({ state: 'visible', timeout: 45_000 });
  await search.fill('Michael Ramella');
  const row = page.locator('div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
  await row.waitFor({ state: 'visible', timeout: 30_000 });
  await row.getByRole('button', { name: 'Patient actions menu' }).click();
  await page.getByRole('menuitem', { name: 'Quick Send', exact: true }).click();
  const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
  await dialog.waitFor({ state: 'visible', timeout: 30_000 });
  return dialog;
}

async function removeFile(dialog, name) {
  const label = dialog.getByText(name, { exact: true }).first();
  if (!(await label.isVisible().catch(() => false))) return { removed: true, controlPresent: false };
  const attachment = label.locator('xpath=ancestor::div[contains(@class,"added-attachment")][1]');
  const remove = attachment.locator('button:visible, [role="button"]:visible, input[type="checkbox"]:visible').last();
  const controlPresent = await remove.isVisible().catch(() => false);
  if (controlPresent) await remove.click();
  const removed = await label.waitFor({ state: 'hidden', timeout: 5_000 }).then(() => true).catch(() => false);
  return { removed, controlPresent };
}

async function inspect(key, url) {
  const page = await context.newPage();
  const result = { key, files: {}, cleanup: {}, errors: [] };
  try {
    const dialog = await openQuickSend(page, url);
    await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Files\s*$/i }).first().click();
    const input = dialog.locator('input[type="file"]').first();
    result.files.accept = await input.getAttribute('accept');
    await input.setInputFiles(invalidPath);
    const invalid = dialog.getByText('qa-invalid.exe', { exact: true }).first();
    const toast = page.locator('.p-toast-message:visible').last();
    await Promise.race([
      invalid.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {}),
      toast.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {}),
    ]);
    result.files.invalidRendered = await invalid.isVisible().catch(() => false);
    result.files.invalidFeedbackVisible = await toast.isVisible().catch(() => false);
    const invalidCleanup = await removeFile(dialog, 'qa-invalid.exe');
    result.cleanup.invalidRemoved = invalidCleanup.removed;
    result.files.invalidRemoveControl = invalidCleanup.controlPresent;
    await input.setInputFiles(validPath);
    const valid = dialog.getByText('qa-remove.txt', { exact: true }).first();
    await valid.waitFor({ state: 'visible', timeout: 10_000 });
    result.files.validRendered = true;
    const validCleanup = await removeFile(dialog, 'qa-remove.txt');
    result.cleanup.validRemoved = validCleanup.removed;
    result.files.validRemoveControl = validCleanup.controlPresent;
    result.cleanup.complete = result.cleanup.invalidRemoved && result.cleanup.validRemoved;
  } catch (error) {
    result.errors.push(error.message.split('\n')[0]);
  } finally {
    await page.close();
  }
  return result;
}

const results = [];
for (const target of targets) results.push(await inspect(...target));
const base = results[0];
const comparisons = results.slice(1).map((item) => ({
  key: item.key,
  acceptMatch: item.files.accept === base.files.accept,
  invalidBehaviorMatch: item.files.invalidRendered === base.files.invalidRendered && item.files.invalidFeedbackVisible === base.files.invalidFeedbackVisible,
  validBehaviorMatch: item.files.validRendered === base.files.validRendered && item.cleanup.validRemoved === base.cleanup.validRemoved,
}));
const failedValidation = results.some(({ files }) => files.invalidRendered || !files.invalidFeedbackVisible);
const cleanupIncomplete = results.some(({ cleanup }) => cleanup.complete === false);
const summary = {
  runId,
  result: results.some(({ errors }) => errors.length) ? 'Inconclusive' : cleanupIncomplete ? 'Blocked' : failedValidation ? 'Fail' : 'Pass',
  results,
  comparisons,
  mutation: { class: 'Temporary', occurred: true, action: 'Attached synthetic invalid and valid files to unsaved drafts only' },
  cleanup: { required: true, performed: !cleanupIncomplete, leftovers: cleanupIncomplete ? ['Synthetic draft attachment may remain until dialog close; page was closed without save/send'] : [] },
  sensitiveData: { persisted: false, screenshots: false, patientIdentityPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, 'files-mutation.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
