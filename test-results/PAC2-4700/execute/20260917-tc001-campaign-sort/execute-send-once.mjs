import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const attached = await dialog.getByText(/Attached Files:\s*qa-upload\.txt/i).isVisible().catch(() => false);
if (!attached) throw new Error('Blocked: synthetic attachment not selected');
const beforeUrl = page.url();
const action = dialog.getByRole('button', { name: 'quick-send-action' });
await action.click();
await Promise.race([
  dialog.waitFor({ state: 'hidden', timeout: 15_000 }),
  page.locator('.p-toast-message').last().waitFor({ state: 'visible', timeout: 15_000 }),
  page.locator('[role="dialog"]:visible').filter({ hasNot: dialog }).last().waitFor({ state: 'visible', timeout: 15_000 }),
]).catch(() => {});
const quickVisible = await dialog.isVisible().catch(() => false);
const toastTexts = (await page.locator('.p-toast-message:visible').allTextContents()).map((value) => value.replace(/\s+/g, ' ').trim());
const schedulerPopup = await page.getByText(/scheduler link|required.*booking|booking link.*required/i).isVisible().catch(() => false);
const success = !quickVisible || toastTexts.some((value) => /sent|success/i.test(value));
const blocked = toastTexts.some((value) => /error|failed|wrong|required/i.test(value)) || schedulerPopup;
const summary = {
  scope: 'Quick Send message with synthetic attachment',
  result: success ? 'Pass' : blocked ? 'Blocked' : 'Inconclusive',
  reason: success ? 'Quick Send completed or success feedback observed' : blocked ? 'Application blocked send and displayed validation/error feedback' : 'No completion, error, or confirmation feedback observed after one approved send attempt',
  precondition: { syntheticAttachmentSelected: attached },
  observation: { quickSendStillVisible: quickVisible, urlChanged: page.url() !== beforeUrl, feedbackObserved: toastTexts.length > 0 || schedulerPopup },
  mutation: { class: 'External message send', occurred: success, action: 'One approved Quick Send attempt' },
  cleanup: { required: false, performed: false, leftovers: success ? ['Sent message cannot be recalled through tested UI'] : ['Synthetic attachment remains selected in open Quick Send'] },
  sensitiveData: { persisted: false, screenshots: false, feedbackTextPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '36-message-send-result.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ ...summary, diagnosticFeedback: toastTexts.map((value) => value.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[number]')) }, null, 2));
await browser.close();
