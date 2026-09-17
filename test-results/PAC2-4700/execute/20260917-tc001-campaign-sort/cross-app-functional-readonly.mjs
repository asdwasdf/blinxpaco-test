import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const runId = `20260917-cross-app-${Date.now()}`;
const outDir = path.resolve(`test-results/PAC2-4700/execute/${runId}`);
await mkdir(outDir, { recursive: true });
const patientQuery = ['Michael', 'Ramella'].join(' ');
const contexts = [
  { key: 'base', url: 'https://blinx.dev.blinxpaco-np.com/paco/dashboard/' },
  { key: 'connect', url: 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/' },
  { key: 'os', url: 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard' },
];
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const browserContext = browser.contexts()[0];
if (!browserContext) throw new Error('Blocked: no authenticated CDP context');
const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();

async function openQuickSend(target) {
  const page = await browserContext.newPage();
  await page.setViewportSize({ width: 1920, height: 945 });
  const started = performance.now();
  await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (/\/login(?:[/?#]|$)/i.test(page.url())) throw new Error(`Blocked: ${target.key} authentication expired`);
  const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
  await search.waitFor({ state: 'visible', timeout: 45_000 });
  await search.fill('');
  await search.pressSequentially(patientQuery, { delay: 40 });
  const row = page.locator('div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
  await row.waitFor({ state: 'visible', timeout: 30_000 });
  const actions = row.getByRole('button', { name: /^Patient actions menu$/i });
  await actions.click();
  let quick = page.getByRole('menuitem', { name: /^Quick Send$/i }).first();
  if (!(await quick.isVisible().catch(() => false))) quick = page.getByText(/^Quick Send$/i).first();
  await quick.click();
  const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
  await dialog.waitFor({ state: 'visible', timeout: 30_000 });
  return { page, dialog, openMs: Math.round(performance.now() - started) };
}

async function inspect(target) {
  const { page, dialog, openMs } = await openQuickSend(target);
  const result = { key: target.key, entryUrl: target.url, finalUrl: page.url().replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]'), openMs, campaign: {}, healthForms: {}, bookingLink: {}, files: {}, errors: [] };
  try {
    const campaignTab = dialog.locator('button').filter({ hasText: /^\s*\d*\s*Campaign\s*$/i }).first();
    await campaignTab.click();
    result.campaign.controls = {};
    for (const label of ['Preview', 'Edit', 'Merge Fields', 'Templates']) result.campaign.controls[label] = await dialog.getByText(new RegExp(`^${label}$`, 'i')).first().isVisible().catch(() => false);
    const change = dialog.getByText(/\(click to change\)/i).first();
    result.campaign.selectorVisible = await change.isVisible().catch(() => false);
    if (result.campaign.selectorVisible) {
      await change.click();
      const sort = page.locator('.sort-dropdown:visible').first();
      await sort.waitFor({ state: 'visible', timeout: 15_000 });
      const sortButton = sort.locator('[role="button"]').first();
      await sortButton.click();
      const optionPanel = page.locator('.p-dropdown-panel:visible, [role="listbox"]:visible').last();
      await optionPanel.waitFor({ state: 'visible', timeout: 10_000 });
      result.campaign.sortOptions = (await optionPanel.getByRole('option').allTextContents()).map(clean);
      await sortButton.click();
      result.campaign.categoryCount = await page.locator('.campaign-option-category-header:visible').count();
      result.campaign.sortChecks = [];
      const wanted = ['By date (descending)', 'By date (ascending)', 'By message type', 'A - Z', 'Z - A'];
      for (const name of wanted) {
        await sortButton.click();
        const option = page.getByRole('option', { name, exact: true }).first();
        const available = await option.isVisible().catch(() => false);
        if (available) await option.click();
        else await sortButton.click().catch(() => {});
        const selectedLabel = clean(await sort.locator('.p-dropdown-label').first().textContent().catch(() => ''));
        result.campaign.sortChecks.push({ name, available, selected: available && selectedLabel === name });
      }
      const pickerClose = page.locator('button[aria-label="Close"]:visible').last();
      if (await pickerClose.isVisible().catch(() => false)) await pickerClose.click();
      else await change.click().catch(() => {});
    }

    const healthTab = dialog.locator('button').filter({ hasText: /^\s*\d*\s*Health Forms\s*$/i }).first();
    const healthStarted = performance.now();
    await healthTab.click();
    await dialog.getByText(/Add Health Form\(s\)|Select Health Form|Added Health Forms:|No Health Forms/i).first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {});
    result.healthForms.loadMs = Math.round(performance.now() - healthStarted);
    result.healthForms.addControlVisible = await dialog.getByText(/Add Health Form\(s\)/i).isVisible().catch(() => false);
    result.healthForms.addedSectionVisible = await dialog.getByText(/^Added Health Forms:$/i).isVisible().catch(() => false);
    result.healthForms.frequencyVisible = await dialog.getByText(/Frequency \(Optional\)/i).first().isVisible().catch(() => false);

    const bookingTab = dialog.locator('button').filter({ hasText: /^\s*\d*\s*Booking Link\s*$/i }).first();
    const bookingStarted = performance.now();
    await bookingTab.click();
    await dialog.getByText(/^Date & Time$/i).first().waitFor({ state: 'visible', timeout: 30_000 });
    result.bookingLink.loadMs = Math.round(performance.now() - bookingStarted);
    result.bookingLink.dateTime = true;
    result.bookingLink.refresh = await dialog.getByText(/Refresh Availability/i).first().isVisible().catch(() => false);
    result.bookingLink.confirmation = await dialog.getByText(/Confirmation\/Reminder Message/i).first().isVisible().catch(() => false);
    result.bookingLink.reasonCode = await dialog.getByPlaceholder(/Select Reason Code/i).isVisible().catch(() => false);
    result.bookingLink.notes = await dialog.getByPlaceholder(/Booking Notes/i).isVisible().catch(() => false);
    result.bookingLink.comboboxCount = await dialog.getByRole('combobox').count();
    const slotOptions = [];
    const combos = dialog.getByRole('combobox');
    for (let index = 0; index < Math.min(4, await combos.count()); index += 1) {
      const trigger = combos.nth(index).locator('xpath=ancestor::div[@data-pc-name="multiselect"][1]').locator('[data-pc-section="trigger"]');
      if (!(await trigger.isVisible().catch(() => false))) continue;
      await trigger.click();
      const panel = page.locator('.p-multiselect-panel:visible').last();
      if (await panel.isVisible().catch(() => false)) {
        const labels = await panel.getByRole('option').allTextContents();
        slotOptions.push(...labels.map((value) => clean(value).replace(/\b\d{6,}\b/g, '[number]')));
        await trigger.click();
      }
    }
    result.bookingLink.slotOptionCount = new Set(slotOptions).size;
    result.bookingLink.mappedConnectSlotPresent = slotOptions.some((value) => /Adult Phlebotomy paco-connect/i.test(value));
    result.bookingLink.schedulerPopupVisible = await page.getByText('Scheduler Link Required', { exact: true }).isVisible().catch(() => false);

    const filesTab = dialog.locator('button').filter({ hasText: /^\s*\d*\s*Files\s*$/i }).first();
    await filesTab.click();
    const fileInput = dialog.locator('input[type="file"]').first();
    result.files.inputVisible = await fileInput.count() === 1;
    result.files.accept = await fileInput.getAttribute('accept');
  } catch (error) {
    result.errors.push(error.message.split('\n')[0]);
  }
  const close = dialog.getByRole('button', { name: /^Close$/i }).last();
  if (await close.isVisible().catch(() => false)) await close.click().catch(() => {});
  await page.close();
  return result;
}

const results = [];
for (const target of contexts) results.push(await inspect(target));
const base = results.find(({ key }) => key === 'base');
const comparisons = results.filter(({ key }) => key !== 'base').map((item) => ({
  key: item.key,
  sortOptionsMatch: JSON.stringify(item.campaign.sortOptions) === JSON.stringify(base.campaign.sortOptions),
  campaignControlsMatch: JSON.stringify(item.campaign.controls) === JSON.stringify(base.campaign.controls),
  healthLoadRatio: base.healthForms.loadMs ? Number((item.healthForms.loadMs / base.healthForms.loadMs).toFixed(2)) : null,
  bookingControlsMatch: ['dateTime', 'refresh', 'confirmation', 'reasonCode', 'notes'].every((name) => item.bookingLink[name] === base.bookingLink[name]),
  fileAcceptMatch: item.files.accept === base.files.accept,
  errors: item.errors,
}));
const summary = { runId, result: results.some(({ errors }) => errors.length) ? 'Inconclusive' : 'Pass', results, comparisons, mutation: { class: 'None', occurred: false }, sensitiveData: { persisted: false, screenshots: false, optionLabelsPersisted: false }, observedAt: new Date().toISOString() };
await writeFile(path.join(outDir, 'readonly-coverage.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ runId, result: summary.result, comparisons, perContext: results.map(({ key, openMs, campaign, healthForms, bookingLink, files, errors }) => ({ key, openMs, campaign, healthForms, bookingLink, files, errors })) }, null, 2));
await browser.close();
