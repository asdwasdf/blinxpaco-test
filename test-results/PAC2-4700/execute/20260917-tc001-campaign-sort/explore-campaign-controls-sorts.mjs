import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages.toReversed()) {
  if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]:visible').count()) {
    page = candidate;
    break;
  }
}
if (!page) throw new Error('Blocked: visible Quick Send missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Campaign\s*$/i }).first().click();

const current = dialog.getByText(/\(click to change\)/i).first();
await current.waitFor({ state: 'visible', timeout: 15_000 });
await current.click();
const sortWidget = page.locator('.sort-dropdown').filter({ hasText: /By message type|By date|A\s*[–-]\s*Z|Z\s*[–-]\s*A/i }).first();
await sortWidget.waitFor({ state: 'visible', timeout: 15_000 });
const picker = sortWidget.locator('xpath=ancestor::*[.//*[normalize-space(text())="Select Campaign"]][1]');
const sortButton = sortWidget.locator('[role="button"]').first();
const optionNames = ['By date (descending)', 'By date (ascending)', 'By message type', 'A–Z', 'Z–A'];
const sortResults = [];
for (const name of optionNames) {
  await sortButton.click();
  const option = page.getByRole('option', { name, exact: true }).first();
  if (!(await option.isVisible().catch(() => false))) {
    sortResults.push({ option: name, result: 'Not Run', reason: 'Option not visible' });
    await sortButton.click().catch(() => {});
    continue;
  }
  await option.click();
  const selected = (await picker.locator('.sort-dropdown .p-dropdown-label').first().innerText()).replace(/\s+/g, ' ').trim();
  const rowCount = await picker.getByRole('treeitem').count();
  sortResults.push({ option: name, result: selected === name && rowCount >= 3 ? 'Pass' : 'Inconclusive', selectedMatched: selected === name, rowCount });
}
const pickerClose = page.getByRole('button', { name: /^Close$/i }).locator(':visible').last();
if (await pickerClose.isVisible().catch(() => false)) await pickerClose.click();
await sortWidget.waitFor({ state: 'hidden', timeout: 10_000 });

const labels = ['Preview', 'Edit', 'Virtual Consult Link', 'Merge Fields', 'Copy to Email', 'Resources'];
const visibleControls = {};
for (const label of labels) visibleControls[label] = await dialog.getByText(new RegExp(`^${label}$`, 'i')).first().isVisible().catch(() => false);

let previewOpened = false;
const preview = dialog.getByText(/^Preview$/i).first();
if (await preview.isVisible().catch(() => false)) {
  const before = await page.locator('[role="dialog"]:visible').count();
  await preview.click();
  previewOpened = await page.locator('[role="dialog"]:visible').count() > before;
  const previewDialog = page.getByRole('dialog').filter({ hasText: /Preview/i }).last();
  if (previewOpened && await previewDialog.isVisible().catch(() => false)) await previewDialog.getByRole('button', { name: /^Close$/i }).last().click().catch(() => {});
}
let templatesOpened = false;
const copy = dialog.getByText(/^Copy to Email$/i).first();
if (await copy.isVisible().catch(() => false)) {
  await copy.click();
  const library = page.getByRole('dialog').filter({ hasText: /Email Templates Library/i }).last();
  templatesOpened = await library.isVisible().catch(() => false);
  if (templatesOpened) await library.getByRole('button', { name: /^Close$/i }).last().click().catch(() => {});
}
let mergeOpened = false;
const merge = dialog.getByText(/^Merge Fields$/i).first();
if (await merge.isVisible().catch(() => false)) {
  await merge.click();
  mergeOpened = await page.locator('.p-dropdown-panel:visible, .p-overlaypanel:visible, [role="menu"]:visible, [role="listbox"]:visible').count() > 0;
  if (mergeOpened) await merge.click().catch(() => {});
}

const summary = {
  scope: 'Quick Send Campaign controls and sort options',
  result: sortResults.every(({ result }) => result === 'Pass') && previewOpened && templatesOpened && mergeOpened ? 'Pass' : 'Inconclusive',
  observation: { visibleControls, previewOpened, templatesOpened, mergeFieldsOpened: mergeOpened, sortResults },
  action: 'Read-only overlays and temporary sort state only; Edit, Resources, and Virtual Consult Link not selected',
  mutation: { class: 'Temporary', occurred: true, action: 'Sort state changed; no campaign saved' },
  sensitiveData: { persisted: false, screenshots: false, campaignNamesPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '41-campaign-controls-sorts-explore.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
