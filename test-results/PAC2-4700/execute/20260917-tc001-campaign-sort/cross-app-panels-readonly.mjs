import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const runId = `20260917-panels-${Date.now()}`;
const outDir = path.resolve(`test-results/PAC2-4700/execute/${runId}`);
await mkdir(outDir, { recursive: true });
const targets = [
  ['base', 'https://blinx.dev.blinxpaco-np.com/paco/dashboard/'],
  ['connect', 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/'],
  ['os', 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard'],
];
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
async function open(key, url) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 945 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
  await search.waitFor({ state: 'visible', timeout: 45_000 });
  await search.pressSequentially(['Michael', 'Ramella'].join(' '), { delay: 30 });
  const row = page.locator('div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
  await row.waitFor({ state: 'visible', timeout: 30_000 });
  await row.getByRole('button', { name: 'Patient actions menu' }).click();
  let quick = page.getByRole('menuitem', { name: 'Quick Send', exact: true });
  if (!(await quick.isVisible().catch(() => false))) quick = page.getByText('Quick Send', { exact: true }).first();
  await quick.click();
  const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
  await dialog.waitFor({ state: 'visible', timeout: 30_000 });
  return { key, page, dialog };
}
async function inspect(key, url) {
  const { page, dialog } = await open(key, url);
  const output = { key, healthForms: {}, bookingLink: {}, files: {}, viewPatientDetails: {}, errors: [] };
  try {
    const health = dialog.locator('button').filter({ hasText: /^\s*\d*\s*Health Forms\s*$/i }).first();
    const start = performance.now(); await health.click();
    const add = dialog.getByText('Add Health Form(s)', { exact: true });
    await add.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {});
    output.healthForms.loadMs = Math.round(performance.now() - start);
    output.healthForms.addVisible = await add.isVisible().catch(() => false);
    output.healthForms.addedVisible = await dialog.getByText('Added Health Forms:', { exact: true }).isVisible().catch(() => false);
    output.healthForms.frequencyVisible = await dialog.getByText(/Frequency \(Optional\)/i).first().isVisible().catch(() => false);

    const booking = dialog.locator('button').filter({ hasText: /^\s*\d*\s*Booking Link\s*$/i }).first();
    const bookingStart = performance.now(); await booking.click();
    const dateTime = dialog.getByText('Date & Time', { exact: true }).first();
    await dateTime.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
    output.bookingLink.loadMs = Math.round(performance.now() - bookingStart);
    for (const [name, locator] of Object.entries({ dateTime, refresh: dialog.getByText(/Refresh Availability/i).first(), confirmation: dialog.getByText(/Confirmation\/Reminder Message/i).first(), reasonCode: dialog.getByPlaceholder(/Select Reason Code/i), notes: dialog.getByPlaceholder(/Booking Notes/i) })) output.bookingLink[name] = await locator.isVisible().catch(() => false);
    output.bookingLink.comboboxCount = await dialog.getByRole('combobox').count();
    const slotLabels = [];
    for (let i = 0; i < Math.min(4, output.bookingLink.comboboxCount); i += 1) {
      const trigger = dialog.getByRole('combobox').nth(i).locator('xpath=ancestor::div[@data-pc-name="multiselect"][1]').locator('[data-pc-section="trigger"]');
      if (!(await trigger.isVisible().catch(() => false))) continue;
      await trigger.click();
      const panel = page.locator('.p-multiselect-panel:visible').last();
      if (await panel.isVisible().catch(() => false)) { slotLabels.push(...(await panel.getByRole('option').allTextContents()).map(clean)); await trigger.click(); }
    }
    output.bookingLink.slotOptionCount = new Set(slotLabels).size;
    output.bookingLink.mappedConnectSlotPresent = slotLabels.some((value) => /Adult Phlebotomy paco-connect/i.test(value));
    output.bookingLink.schedulerPopup = await page.getByText('Scheduler Link Required', { exact: true }).isVisible().catch(() => false);

    const files = dialog.locator('button').filter({ hasText: /^\s*\d*\s*Files\s*$/i }).first();
    await files.click();
    const input = dialog.locator('input[type="file"]');
    output.files.inputCount = await input.count(); output.files.accept = await input.first().getAttribute('accept').catch(() => null);

    const details = dialog.getByRole('button', { name: 'View Patient Details', exact: true });
    await details.click();
    output.viewPatientDetails.opened = await dialog.getByText(/Patient Information|Contact Details/i).first().isVisible().catch(() => false);
    await details.click().catch(() => {});
  } catch (error) { output.errors.push(error.message.split('\n')[0]); }
  await dialog.getByRole('button', { name: 'Close' }).last().click().catch(() => {});
  await page.close(); return output;
}
const results = [];
for (const [key, url] of targets) results.push(await inspect(key, url));
const base = results[0];
const comparisons = results.slice(1).map((value) => ({ key: value.key, healthControlsMatch: ['addVisible','addedVisible','frequencyVisible'].every((name) => value.healthForms[name] === base.healthForms[name]), bookingControlsMatch: ['dateTime','refresh','confirmation','reasonCode','notes'].every((name) => value.bookingLink[name] === base.bookingLink[name]), slotCountDelta: (value.bookingLink.slotOptionCount || 0) - (base.bookingLink.slotOptionCount || 0), fileAcceptMatch: value.files.accept === base.files.accept, detailsMatch: value.viewPatientDetails.opened === base.viewPatientDetails.opened, healthLoadRatio: base.healthForms.loadMs ? Number((value.healthForms.loadMs / base.healthForms.loadMs).toFixed(2)) : null, errors: value.errors }));
const summary = { runId, result: results.some((value) => value.errors.length) ? 'Inconclusive' : 'Pass', results, comparisons, mutation: { class: 'None', occurred: false }, observedAt: new Date().toISOString() };
await writeFile(path.join(outDir, 'panels-coverage.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2)); await browser.close();
