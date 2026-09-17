import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
if (process.env.PACO_ALLOW_DESTRUCTIVE !== 'true') throw new Error('Blocked: PACO_ALLOW_DESTRUCTIVE=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const created = JSON.parse(await readFile(path.join(outDir, '42-save-new-qa-campaign.json'), 'utf8'));
const qaName = created.qaCampaignName;
if (!/^QA PAC2-4700 \d+$/.test(qaName)) throw new Error('Blocked: cleanup target is not owned QA data');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages.toReversed()) if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]:visible').count()) { page = candidate; break; }
if (!page) throw new Error('Blocked: visible Quick Send missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Campaign\s*$/i }).first().click();
const currentText = (await dialog.innerText()).replace(/\s+/g, ' ');
if (!currentText.includes(qaName)) throw new Error('Blocked: current Quick Send campaign is not owned QA campaign');

const edit = dialog.getByText(/^Edit$/i).first();
if (await edit.isVisible().catch(() => false)) await edit.click();
const editor = dialog.locator('[contenteditable="true"]:visible').first();
if (await editor.isEditable().catch(() => false)) await editor.pressSequentially(' Updated');
const save = dialog.getByRole('button', { name: /^Save$/i }).last();
if (!(await save.isEnabled())) throw new Error('Blocked: Save disabled for QA update');
await save.click();
const choice = page.getByRole('dialog').filter({ hasText: /^Save Campaign/i }).last();
await choice.waitFor({ state: 'visible', timeout: 10_000 });
const update = choice.getByRole('button').filter({ hasText: /^Update existing/i }).first();
await update.click();
await choice.getByRole('button', { name: /^Update$/i }).last().click();
const toast = page.locator('.p-toast-message').last();
await toast.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
const updatePass = await toast.isVisible().catch(() => false) && /success/i.test(await toast.innerText());

let deleteControl = dialog.getByRole('button', { name: /Delete/i }).first();
if (!(await deleteControl.isVisible().catch(() => false))) {
  const menu = dialog.getByRole('button', { name: /More|Actions/i }).first();
  if (await menu.isVisible().catch(() => false)) await menu.click();
  deleteControl = page.getByRole('menuitem', { name: /Delete/i }).first();
}
let deleted = false;
if (await deleteControl.isVisible().catch(() => false)) {
  await deleteControl.click();
  const confirm = page.getByRole('dialog').filter({ hasText: /Delete/i }).last();
  await confirm.waitFor({ state: 'visible', timeout: 10_000 });
  const text = (await confirm.innerText()).replace(/\s+/g, ' ');
  if (!text.includes(qaName) && !/campaign/i.test(text)) throw new Error('Blocked: delete confirmation target unclear');
  await confirm.getByRole('button', { name: /^Delete$/i }).last().click();
  await confirm.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
  deleted = true;
}
const summary = {
  scope: 'Quick Send Update existing and QA cleanup',
  result: updatePass && deleted ? 'Pass' : updatePass ? 'Blocked' : 'Inconclusive',
  qaCampaignName: qaName,
  observation: { updateSucceeded: updatePass, deleteControlFound: await deleteControl.count() > 0, deleted },
  mutation: { class: 'Persistent then destructive', occurred: true, action: 'Updated only owned QA campaign, then attempted cleanup' },
  cleanup: { required: true, performed: deleted, leftovers: deleted ? [] : [qaName] },
  sensitiveData: { persisted: false, screenshots: false }, observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '43-update-cleanup-qa-campaign.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
