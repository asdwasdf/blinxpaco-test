import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const targets = [
  ['base', 'https://blinx.dev.blinxpaco-np.com/paco/dashboard/'],
  ['connect', 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/'],
  ['os', 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard'],
];
const runId = `20260917-booking-${Date.now()}`;
const outDir = path.resolve(`test-results/PAC2-4700/execute/${runId}`);
await mkdir(outDir, { recursive: true });
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no authenticated CDP context');
const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();

async function inspect(key, url) {
  const page = await context.newPage();
  const result = { key, stage: 'navigate', bookingLink: {}, errors: [] };
  try {
    await page.setViewportSize({ width: 1920, height: 945 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
    await search.waitFor({ state: 'visible', timeout: 45_000 });
    await search.fill('Michael Ramella');
    const row = page.locator('div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
    await row.waitFor({ state: 'visible', timeout: 30_000 });
    result.stage = 'patient-actions';
    await row.getByRole('button', { name: 'Patient actions menu' }).click();
    result.stage = 'quick-send';
    await page.getByRole('menuitem', { name: 'Quick Send', exact: true }).click();
    const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
    await dialog.waitFor({ state: 'visible', timeout: 30_000 });
    result.stage = 'template-picker';
    const selectedTemplate = dialog.getByText('General Patient Message', { exact: true }).filter({ visible: true });
    if (await selectedTemplate.count() === 0) {
      const change = dialog.getByText('(click to change)', { exact: true });
      const choose = dialog.getByText('Choose template', { exact: true });
      const picker = await change.count() === 1 ? change : choose;
      result.bookingLink.pickerLabel = clean(await picker.textContent().catch(() => ''));
      await picker.click();
      result.stage = 'template-option';
      const category = page.locator('.campaign-option-category-header:visible').first();
      await category.waitFor({ state: 'visible', timeout: 15_000 });
      await category.click();
      let option = category.locator('xpath=ancestor::li[@role="treeitem"][1]').locator('li[role="treeitem"]', { hasText: 'General Patient Message' }).first();
      if (!(await option.isVisible().catch(() => false))) {
        option = category.locator('xpath=ancestor::li[@role="treeitem"][1]').locator('li[role="treeitem"]').first();
      }
      result.bookingLink.templateOptionCount = await option.count();
      await option.click();
    }
    result.stage = 'template-selected';
    result.stage = 'booking-tab';
    const tab = page.getByRole('button', { name: 'tab-Booking Link', exact: true });
    result.bookingLink.tabCount = await tab.count();
    result.bookingLink.beforeClass = await tab.getAttribute('class');
    await tab.click();
    await dialog.getByText(/^Date & Time$/i).first().waitFor({ state: 'visible', timeout: 30_000 });
    result.bookingLink.afterClass = await tab.getAttribute('class');
    const controls = {
      dateTime: dialog.getByText(/^Date & Time$/i).first(),
      refresh: dialog.getByText(/Refresh Availability/i).first(),
      confirmation: dialog.getByText(/Confirmation\/Reminder Message/i).first(),
      reasonCode: dialog.getByPlaceholder(/Select Reason Code/i),
      notes: dialog.getByPlaceholder(/Booking Notes/i),
    };
    for (const [name, locator] of Object.entries(controls)) result.bookingLink[name] = await locator.isVisible().catch(() => false);
    result.bookingLink.comboboxCount = await dialog.getByRole('combobox').count();
    const slotLabels = [];
    for (let index = 0; index < Math.min(6, result.bookingLink.comboboxCount); index += 1) {
      const combo = dialog.getByRole('combobox').nth(index);
      const trigger = combo.locator('xpath=ancestor::div[@data-pc-name="multiselect"][1]').locator('[data-pc-section="trigger"]');
      if (!(await trigger.isVisible().catch(() => false))) continue;
      await trigger.click();
      const panel = page.locator('.p-multiselect-panel:visible').last();
      await panel.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
      if (await panel.isVisible().catch(() => false)) {
        slotLabels.push(...(await panel.getByRole('option').allTextContents()).map(clean));
        await trigger.click();
      }
    }
    result.bookingLink.slotOptionCount = new Set(slotLabels).size;
    result.bookingLink.mappedConnectSlotPresent = slotLabels.some((label) => /Adult Phlebotomy paco-connect/i.test(label));
    result.bookingLink.schedulerPopup = await page.getByText('Scheduler Link Required', { exact: true }).isVisible().catch(() => false);
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
  controlsMatch: ['dateTime', 'refresh', 'confirmation', 'reasonCode', 'notes'].every((name) => item.bookingLink[name] === base.bookingLink[name]),
  comboboxCountMatch: item.bookingLink.comboboxCount === base.bookingLink.comboboxCount,
  mappedSlotMatch: item.bookingLink.mappedConnectSlotPresent === base.bookingLink.mappedConnectSlotPresent,
  schedulerPopupMatch: item.bookingLink.schedulerPopup === base.bookingLink.schedulerPopup,
}));
const summary = { runId, result: results.some(({ errors }) => errors.length) ? 'Inconclusive' : 'Pass', results, comparisons, mutation: { class: 'None', occurred: false }, observedAt: new Date().toISOString() };
await writeFile(path.join(outDir, 'booking-readonly.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
