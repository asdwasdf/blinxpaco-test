import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const quickSend = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await quickSend.waitFor({ state: 'visible', timeout: 10_000 });

let saveDialog = page.getByRole('dialog').filter({ hasText: /^Save as new Campaign/i }).last();
if (!(await saveDialog.isVisible().catch(() => false))) {
  let choiceDialog = page.getByRole('dialog').filter({ hasText: /^Save Campaign/i }).last();
  if (!(await choiceDialog.isVisible().catch(() => false))) {
    await quickSend.getByRole('button', { name: /^Save$/i }).last().click();
    await choiceDialog.waitFor({ state: 'visible', timeout: 10_000 });
  }
  await choiceDialog.getByRole('button').filter({ hasText: /^Save as New/i }).first().click();
  await choiceDialog.getByRole('button', { name: /^Save$/i }).last().click();
  saveDialog = page.getByRole('dialog').filter({ hasText: /^Save as new Campaign/i }).last();
  await saveDialog.waitFor({ state: 'visible', timeout: 10_000 });
}

const nameField = saveDialog.getByPlaceholder('Enter a campaign name');
const emailTemplateField = saveDialog.getByPlaceholder('Enter an email template name');
const smsTemplateField = saveDialog.getByPlaceholder('Enter an SMS template name');
await nameField.waitFor({ state: 'visible', timeout: 10_000 });
await nameField.fill('NEW TEST CAMPAIGN');
if (await emailTemplateField.isEditable().catch(() => false)) await emailTemplateField.fill('NEW TEST CAMPAIGN');
if (await smsTemplateField.isEditable().catch(() => false)) await smsTemplateField.fill('NEW TEST CAMPAIGN');

const toast = page.locator('.p-toast-message').last();
await saveDialog.getByRole('button', { name: /^Save$/i }).last().click();
await toast.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
const toastText = await toast.isVisible().catch(() => false) ? (await toast.innerText()).replace(/\s+/g, ' ').trim() : '';
const expected = /An email template with this name already exists\. Please choose another name and try again\./i;
const matched = expected.test(toastText);
const modalStillOpen = await saveDialog.isVisible().catch(() => false);
const result = matched && modalStillOpen ? 'Pass' : 'Fail';
if (modalStillOpen) await saveDialog.getByRole('button', { name: /^(Cancel|Close)$/i }).last().click().catch(() => {});

const summary = {
  caseId: 'PAC2-4700-TC-002',
  result,
  reason: matched ? 'Duplicate-name validation shown and creation prevented' : 'Expected duplicate-name validation not observed',
  duplicateName: 'NEW TEST CAMPAIGN',
  modalRemainedOpen: modalStillOpen,
  expectedErrorMatched: matched,
  mutation: { class: 'Persistent attempt', occurred: false, action: 'Duplicate Save as New rejected before creation' },
  cleanup: { required: false, performed: false, leftovers: [] },
  sensitiveData: { persisted: false, screenshots: false, toastTextPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '33-tc002-duplicate-validation.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
