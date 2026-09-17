import { chromium } from '@playwright/test';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const quickSend = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
let saveDialog = page.getByRole('dialog').filter({ hasText: /^Save as new Campaign/i }).last();
if (!(await saveDialog.isVisible().catch(() => false))) {
  await quickSend.getByRole('button', { name: /^Save$/i }).last().click();
  const choice = page.getByRole('dialog').filter({ hasText: /^Save Campaign/i }).last();
  await choice.waitFor({ state: 'visible', timeout: 10_000 });
  await choice.getByRole('button').filter({ hasText: /^Save as New/i }).click();
  await choice.getByRole('button', { name: /^Save$/i }).last().click();
  saveDialog = page.getByRole('dialog').filter({ hasText: /^Save as new Campaign/i }).last();
  await saveDialog.waitFor({ state: 'visible', timeout: 10_000 });
}
await saveDialog.getByPlaceholder('Enter a campaign name').fill('NEW TEST CAMPAIGN');
const sms = saveDialog.getByPlaceholder('Enter an SMS template name');
if (await sms.isEditable()) await sms.fill('NEW TEST CAMPAIGN');
await saveDialog.getByRole('button', { name: /^Save$/i }).last().click();
await page.waitForTimeout(1500);
const state = await saveDialog.evaluate((root) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  return {
    text: clean(root.innerText).slice(0, 1200),
    errors: [...root.querySelectorAll('[class*="error"], .p-invalid, [aria-invalid="true"], [role="alert"]')].filter(visible).map((node) => clean(node.textContent || node.getAttribute('aria-label'))).filter(Boolean).slice(0, 30),
    fields: [...root.querySelectorAll('input')].map((node) => ({ placeholder: node.placeholder, disabled: node.disabled, invalid: node.getAttribute('aria-invalid'), cls: String(node.className).slice(0, 120) })),
  };
});
const toasts = await page.locator('.p-toast-message:visible').allTextContents();
console.log(JSON.stringify({ state, toasts: toasts.map((value) => value.replace(/\s+/g, ' ').trim()) }, null, 2));
if (await saveDialog.isVisible()) await saveDialog.getByRole('button', { name: /^Cancel$/i }).click();
await browser.close();
