import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const qaName = `QA PAC2-4700 ${Date.now()}`;
const qaFile = path.join(outDir, 'qa-save-campaign.txt');
await writeFile(qaFile, 'Synthetic PAC2-4700 QA attachment. No personal data.\n');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages.toReversed()) if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]:visible').count()) { page = candidate; break; }
if (!page) throw new Error('Blocked: visible Quick Send missing');
const quickSend = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await quickSend.locator('button').filter({ hasText: /^\s*\d*\s*Campaign\s*$/i }).first().click();
const saveButton = quickSend.getByRole('button', { name: /^Save$/i }).last();
if (!(await saveButton.isEnabled())) {
  await quickSend.getByText(/\(click to change\)/i).first().click();
  const sortWidget = page.locator('.sort-dropdown').filter({ hasText: /By message type|By date|A\s*[–-]\s*Z/i }).first();
  await sortWidget.waitFor({ state: 'visible', timeout: 15_000 });
  const category = page.locator('.campaign-option-category-header').first();
  await category.waitFor({ state: 'visible', timeout: 15_000 });
  await category.click();
  let campaign = category.locator('xpath=ancestor::li[@role="treeitem"][1]').locator('li[role="treeitem"]').first();
  if (!(await campaign.isVisible().catch(() => false))) {
    const categories = page.locator('.campaign-option-category-header');
    for (let index = 1; index < await categories.count(); index += 1) {
      const candidate = categories.nth(index);
      await candidate.click();
      campaign = candidate.locator('xpath=ancestor::li[@role="treeitem"][1]').locator('li[role="treeitem"]').first();
      if (await campaign.isVisible().catch(() => false)) break;
    }
  }
  await campaign.waitFor({ state: 'visible', timeout: 15_000 });
  await campaign.click();
  await saveButton.waitFor({ state: 'visible', timeout: 15_000 });
}
await saveButton.waitFor({ state: 'visible', timeout: 10_000 });
if (!(await saveButton.isEnabled())) {
  await quickSend.locator('button').filter({ hasText: /^\s*\d*\s*Files\s*$/i }).first().click();
  await quickSend.locator('input[type="file"]').first().setInputFiles(qaFile);
}
if (!(await saveButton.isEnabled())) {
  await quickSend.locator('button').filter({ hasText: /^\s*\d*\s*Campaign\s*$/i }).first().click();
  const edit = quickSend.getByText(/^Edit$/i).first();
  if (await edit.isVisible().catch(() => false)) await edit.click();
  const subject = quickSend.locator('input[placeholder*="subject" i]').first();
  if (await subject.isEditable().catch(() => false)) {
    await subject.fill(`${await subject.inputValue()} QA`);
  } else {
    const editor = quickSend.locator('[contenteditable="true"]:visible').first();
    if (await editor.isEditable().catch(() => false)) await editor.pressSequentially(' QA');
  }
}
if (!(await saveButton.isEnabled())) throw new Error('Blocked: Save remained disabled after approved safe draft changes');
await saveButton.click();
const choice = page.getByRole('dialog').filter({ hasText: /^Save Campaign/i }).last();
await choice.waitFor({ state: 'visible', timeout: 10_000 });
await choice.getByRole('button').filter({ hasText: /^Save as New/i }).first().click();
await choice.getByRole('button', { name: /^Save$/i }).last().click();
const form = page.getByRole('dialog').filter({ hasText: /^Save as new Campaign/i }).last();
await form.waitFor({ state: 'visible', timeout: 10_000 });
const name = form.getByPlaceholder('Enter a campaign name');
const email = form.getByPlaceholder('Enter an email template name');
const sms = form.getByPlaceholder('Enter an SMS template name');
await name.fill(qaName);
if (await email.isEditable().catch(() => false)) await email.fill(`${qaName} Email`);
if (await sms.isEditable().catch(() => false)) await sms.fill(`${qaName} SMS`);
await form.getByRole('button', { name: /^Save$/i }).last().click();
const toast = page.locator('.p-toast-message').last();
await Promise.race([
  form.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {}),
  toast.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {}),
]);
const modalClosed = !(await form.isVisible().catch(() => false));
const toastCategory = await toast.isVisible().catch(() => false) ? (/success/i.test(await toast.innerText()) ? 'Success' : 'Error') : 'None';
const created = modalClosed && toastCategory !== 'Error';
const summary = {
  scope: 'Quick Send Save as New', result: created ? 'Pass' : 'Inconclusive', qaCampaignName: qaName,
  observation: { modalClosed, toastCategory },
  mutation: { class: 'Persistent', occurred: created, action: 'Created uniquely named QA campaign' },
  cleanup: { required: created, performed: false, leftovers: created ? [qaName] : [] },
  sensitiveData: { persisted: false, screenshots: false }, observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '42-save-new-qa-campaign.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
if (!created) process.exitCode = 1;
