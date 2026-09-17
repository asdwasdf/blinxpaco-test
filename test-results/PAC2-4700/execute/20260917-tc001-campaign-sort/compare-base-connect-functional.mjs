import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required for temporary file checks');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const invalidPath = path.join(outDir, 'qa-parity-invalid.exe');
const validPath = path.join(outDir, 'qa-parity-remove.txt');
await writeFile(invalidPath, 'Synthetic invalid extension; no executable content.\n');
await writeFile(validPath, 'Synthetic QA file; no personal data.\n');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: browser context missing');
const pages = context.pages();
const pageMap = {
  base: pages.toReversed().find((page) => /\/paco\/dashboard\/?$/i.test(page.url())),
  branch: pages.toReversed().find((page) => /\/paco-connect\/feature-branch\/pac2-4700-qs-only\/dashboard/i.test(page.url())),
};
const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
const closeOverlay = async (page, dialog) => {
  const secondary = page.locator('[role="dialog"]:visible').filter({ hasNot: dialog }).last();
  if (await secondary.isVisible().catch(() => false)) {
    const close = secondary.getByRole('button', { name: /^(Close|Cancel)$/i }).last();
    if (await close.isVisible().catch(() => false)) await close.click();
    return;
  }
  const overlay = page.locator('.p-dropdown-panel:visible, .p-overlaypanel:visible, [role="menu"]:visible').last();
  if (await overlay.isVisible().catch(() => false)) await page.keyboard.press('Escape');
};
const inspect = async (page, contextName) => {
  if (!page) throw new Error(`Blocked: ${contextName} page missing`);
  await page.bringToFront();
  const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
  await dialog.waitFor({ state: 'visible', timeout: 15_000 });
  const result = { context: contextName, campaign: {}, healthForms: {}, bookingLink: {}, files: {} };

  await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Campaign\s*$/i }).first().click();
  for (const [key, label] of [['preview', 'Preview'], ['templates', 'Templates'], ['mergeFields', 'Merge Fields']]) {
    let control = dialog.getByText(new RegExp(`^${label}$`, 'i')).first();
    if (label === 'Merge Fields' && !(await control.isVisible().catch(() => false))) control = dialog.getByRole('button', { name: /Merge Fields/i }).first();
    result.campaign[`${key}ControlVisible`] = await control.isVisible().catch(() => false);
    if (!result.campaign[`${key}ControlVisible`]) continue;
    const beforeDialogs = await page.locator('[role="dialog"]:visible').count();
    await control.click();
    result.campaign[`${key}InteractionWorked`] = await page.locator('[role="dialog"]:visible').count() > beforeDialogs || await page.locator('.p-dropdown-panel:visible, .p-overlaypanel:visible, [role="menu"]:visible, [role="listbox"]:visible').count() > 0 || (label === 'Preview' && await dialog.getByText(/Preview:/i).isVisible().catch(() => false));
    await closeOverlay(page, dialog);
  }
  const change = dialog.getByText(/\(click to change\)/i).first();
  result.campaign.selectorVisible = await change.isVisible().catch(() => false);
  if (result.campaign.selectorVisible) {
    await change.click();
    const sortWidget = page.locator('.sort-dropdown:visible').first();
    await sortWidget.waitFor({ state: 'visible', timeout: 15_000 });
    const native = sortWidget.locator('select');
    result.campaign.sortOptions = await native.locator('option').allTextContents().then((values) => values.map(clean)).catch(() => []);
    if (!result.campaign.sortOptions.length) {
      await sortWidget.locator('[role="button"]').click();
      result.campaign.sortOptions = await page.getByRole('option').allTextContents().then((values) => values.map(clean));
      await page.keyboard.press('Escape');
    }
    result.campaign.categoryCount = await page.locator('.campaign-option-category-header:visible').count();
    const pickerClose = page.getByRole('button', { name: /^Close$/i }).locator(':visible').last();
    if (await pickerClose.isVisible().catch(() => false)) await pickerClose.click();
    else await change.click().catch(() => {});
  }

  await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Health Forms\s*$/i }).first().click();
  result.healthForms.emptyStateVisible = await dialog.getByText(/No Health Forms|Select Health Form|Add Health Form/i).first().isVisible().catch(() => false);
  result.healthForms.addedSectionVisible = await dialog.getByText(/^Added Health Forms:$/i).isVisible().catch(() => false);
  result.healthForms.frequencyVisible = await dialog.getByText(/Frequency \(Optional\)/i).first().isVisible().catch(() => false);
  const healthButtons = await dialog.locator('button:visible,[role="button"]:visible').evaluateAll((nodes) => nodes.map((node) => ({ label: (node.getAttribute('aria-label') || node.textContent || '').replace(/\s+/g, ' ').trim(), title: node.getAttribute('title') || '' })).filter(({ label, title }) => /health|select|add|preview|view/i.test(`${label} ${title}`)));
  result.healthForms.relevantControlCount = healthButtons.length;

  await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Booking Link\s*$/i }).first().click();
  const dateTime = dialog.getByText(/^Date & Time$/i).first();
  const refresh = dialog.getByRole('button', { name: /Refresh Availability/i }).or(dialog.getByText(/Refresh Availability/i)).first();
  const confirmation = dialog.getByText(/Confirmation\/Reminder Message/i).first();
  result.bookingLink.dateTimeVisible = await dateTime.isVisible().catch(() => false);
  result.bookingLink.refreshVisible = await refresh.isVisible().catch(() => false);
  result.bookingLink.confirmationVisible = await confirmation.isVisible().catch(() => false);
  result.bookingLink.reasonCodeVisible = await dialog.getByPlaceholder(/Select Reason Code/i).isVisible().catch(() => false);
  result.bookingLink.notesVisible = await dialog.getByPlaceholder(/Booking Notes/i).isVisible().catch(() => false);

  await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Files\s*$/i }).first().click();
  const input = dialog.locator('input[type="file"]').first();
  result.files.accept = await input.getAttribute('accept');
  await input.setInputFiles(invalidPath);
  const invalidName = dialog.getByText(/qa-parity-invalid\.exe/i).first();
  const invalidToast = page.locator('.p-toast-message:visible').last();
  await invalidToast.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
  result.files.invalidRendered = await invalidName.isVisible().catch(() => false);
  result.files.invalidFeedbackVisible = await invalidToast.isVisible().catch(() => false);
  if (result.files.invalidRendered) {
    const invalidRow = invalidName.locator('xpath=ancestor::*[self::li or self::div][.//button][1]');
    const removeInvalid = invalidRow.locator('button').last();
    if (await removeInvalid.isVisible().catch(() => false)) await removeInvalid.click();
  }
  await input.setInputFiles(validPath);
  const validName = dialog.getByText(/qa-parity-remove\.txt/i).first();
  await validName.waitFor({ state: 'visible', timeout: 10_000 });
  result.files.validAttached = true;
  const row = validName.locator('xpath=ancestor::*[self::li or self::div][.//button][1]');
  const remove = row.locator('button').last();
  result.files.removeVisible = await remove.isVisible().catch(() => false);
  if (result.files.removeVisible) await remove.click();
  result.files.validRemoved = await validName.waitFor({ state: 'hidden', timeout: 10_000 }).then(() => true).catch(() => false);
  return result;
};
const base = await inspect(pageMap.base, 'base');
const branch = await inspect(pageMap.branch, 'branch');
const comparable = (value) => JSON.stringify(value);
const sections = ['campaign', 'healthForms', 'bookingLink', 'files'];
const differences = sections.filter((section) => comparable(base[section]) !== comparable(branch[section])).map((section) => ({ section, base: base[section], branch: branch[section] }));
const summary = {
  scope: 'PACO base versus PACO Connect branch Quick Send functional parity',
  result: differences.length ? 'Fail' : 'Pass', base, branch, differences,
  mutation: { class: 'Temporary draft', occurred: true, action: 'Synthetic invalid/valid files attached; removal attempted in both contexts' },
  cleanup: { required: true, performed: base.files.validRemoved && branch.files.validRemoved && !base.files.invalidRendered && !branch.files.invalidRendered, leftovers: [] },
  sensitiveData: { persisted: false, screenshots: false, patientIdentityPersisted: false }, observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '51-base-connect-functional-comparison.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ result: summary.result, base, branch, differences }, null, 2));
await browser.close();
