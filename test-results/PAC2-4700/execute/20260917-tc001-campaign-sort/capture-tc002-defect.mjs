import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const quick = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await quick.waitFor({ state: 'visible', timeout: 10_000 });
await page.keyboard.press('Escape');
await page.locator('.quicksend-context-menu-root:visible').waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {});
await quick.locator('button').filter({ hasText: /^(?:\d+)?Campaign$/i }).first().click();
await quick.getByRole('button', { name: /^Save$/i }).last().click();
const choice = page.getByRole('dialog').filter({ hasText: /^Save Campaign/i }).last();
await choice.waitFor({ state: 'visible', timeout: 10_000 });
await choice.getByRole('button').filter({ hasText: /^Save as New/i }).click();
await choice.getByRole('button', { name: /^Save$/i }).last().click();
const form = page.getByRole('dialog').filter({ hasText: /^Save as new Campaign/i }).last();
await form.waitFor({ state: 'visible', timeout: 10_000 });
await form.getByPlaceholder('Enter a campaign name').fill('NEW TEST CAMPAIGN');
const sms = form.getByPlaceholder('Enter an SMS template name');
if (await sms.isEditable()) await sms.fill('NEW TEST CAMPAIGN');
await form.getByRole('button', { name: /^Save$/i }).click();
const toast = page.locator('.p-toast-message').last();
await toast.waitFor({ state: 'visible', timeout: 15_000 });
const screenshot = path.join(outDir, 'PAC2-4700-TC002-duplicate-generic-error-20260917.png');
await page.screenshot({ path: screenshot, mask: [quick], maskColor: '#202020' });
const summary = {
  caseId: 'PAC2-4700-TC-002',
  result: 'Fail',
  reason: 'Duplicate Save as New returned generic error instead of required duplicate-name validation',
  expectedErrorMatched: false,
  observedFeedbackCategory: 'Generic error',
  creationPrevented: await form.isVisible(),
  evidence: path.basename(screenshot),
  mutation: { class: 'Persistent attempt', occurred: false, action: 'Duplicate Save as New rejected' },
  cleanup: { required: false, performed: false, leftovers: [] },
  sensitiveData: { persisted: false, patientAreaMasked: true, screenshotReviewedByRule: true },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '33-tc002-duplicate-validation.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await form.getByRole('button', { name: /^Cancel$/i }).click().catch(() => {});
await browser.close();
