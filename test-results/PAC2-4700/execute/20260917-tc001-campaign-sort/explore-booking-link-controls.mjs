import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages) if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]:visible').count()) { page = candidate; break; }
if (!page) throw new Error('Blocked: visible Quick Send missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Booking Link\s*$/i }).first().click();
const dateTime = dialog.getByText(/^Date & Time$/i).first();
const refresh = dialog.getByRole('button', { name: /Refresh Availability/i }).or(dialog.getByText(/Refresh Availability/i)).first();
const confirmation = dialog.getByText(/Confirmation\/Reminder Message/i).first();
await dateTime.waitFor({ state: 'visible', timeout: 15_000 });
await confirmation.waitFor({ state: 'attached', timeout: 15_000 });
await confirmation.scrollIntoViewIfNeeded();
const controls = await dialog.locator('input:visible, button:visible, [role="button"]:visible, [role="checkbox"]:visible').evaluateAll((nodes) => nodes.map((node) => ({
  role: node.getAttribute('role'), type: node.getAttribute('type'), label: (node.getAttribute('aria-label') || node.getAttribute('placeholder') || node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100), disabled: node.disabled || node.getAttribute('aria-disabled') === 'true',
})).filter(({ label }) => label));
const dateTimeVisible = await dateTime.isVisible();
const refreshAvailabilityVisible = await refresh.isVisible().catch(() => false);
const confirmationControlVisible = await confirmation.isVisible();
let confirmationOpened = false;
if (confirmationControlVisible) {
  await confirmation.click();
  confirmationOpened = await page.locator('.p-dropdown-panel:visible, [role="listbox"]:visible, .p-overlaypanel:visible').count() > 0;
  if (confirmationOpened) await confirmation.click().catch(() => {});
}
const summary = {
  scope: 'Quick Send Booking Link controls',
  result: dateTimeVisible && confirmationControlVisible ? 'Pass' : 'Fail',
  observation: {
    dateTimeVisible,
    refreshAvailabilityVisible,
    confirmationControlVisible,
    confirmationInteractionOpenedOverlay: confirmationOpened,
    controlCount: controls.length,
    dateOrTimeInputs: controls.filter(({ type, label }) => /date|time/i.test(type || '') || /date|time/i.test(label)).length,
  },
  action: 'Controls inspected; availability refresh and values were not changed',
  mutation: { class: 'None', occurred: false },
  sensitiveData: { persisted: false, screenshots: false, labelsPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '40-booking-link-controls-explore.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
