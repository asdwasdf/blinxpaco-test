import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages.toReversed()) if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]:visible').count()) { page = candidate; break; }
if (!page) throw new Error('Blocked: visible Quick Send missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
const tab = dialog.locator('button').filter({ hasText: /^(?:\d+)?Health Forms$/i }).first();
await tab.click();
const added = dialog.getByText(/^Added Health Forms:$/i);
await added.waitFor({ state: 'visible', timeout: 10_000 });
const frequency = dialog.getByText(/Frequency \(Optional\)/i).first();
const reviewer = dialog.getByText(/\d+\s*Selected/i).first();
const dropdowns = dialog.locator('.p-dropdown:visible');
const dropdownCount = await dropdowns.count();
let frequencyOpened = false;
let frequencyOptions = 0;
if (await frequency.isVisible().catch(() => false)) {
  const dropdown = frequency.locator('xpath=ancestor::*[contains(@class,"p-dropdown")][1]');
  await dropdown.click();
  const panel = page.locator('.p-dropdown-panel:visible, [role="listbox"]:visible').last();
  frequencyOpened = await panel.isVisible().catch(() => false);
  if (frequencyOpened) {
    frequencyOptions = await panel.locator('[role="option"]:visible, li:visible').count();
    await dropdown.press('Escape').catch(() => {});
  }
}
let previewOpened = false;
const eye = dialog.locator('button:visible, [role="button"]:visible').filter({ has: page.locator('svg[data-icon="eye"]') }).first();
if (await eye.isVisible().catch(() => false)) {
  await eye.click();
  previewOpened = await page.getByText(/Preview|File Upload|Health Form/i).last().isVisible().catch(() => false);
  await page.keyboard.press('Escape').catch(() => {});
}
const summary = {
  scope: 'Quick Send Health Forms preview and Frequency',
  result: frequencyOpened && frequencyOptions > 0 ? 'Pass' : 'Inconclusive',
  observation: {
    addedSectionVisible: true,
    reviewerControlVisible: await reviewer.isVisible().catch(() => false),
    dropdownCount,
    frequencyControlVisible: await frequency.isVisible().catch(() => false),
    frequencyOpened,
    frequencyOptions,
    frequencyChanged: false,
    previewControlFound: await eye.isVisible().catch(() => false),
    previewOpened,
  },
  mutation: { class: 'Temporary', occurred: false, action: 'Opened controls only; no Frequency value changed' },
  sensitiveData: { persisted: false, screenshots: false, formNamePersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '39-health-forms-frequency-explore.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
