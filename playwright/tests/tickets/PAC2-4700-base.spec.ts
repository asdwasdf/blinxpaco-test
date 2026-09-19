import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';

test.setTimeout(60_000);

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com/paco/';
const PATIENT_QUERY = 'Michael Ramella';
// Confirmed 2026-09-18 (test-results/PAC2-4700/locate/20260918-quicksend-base):
// two search results share this name; NHS number renders with a space, not
// contiguous digits.
const PATIENT_NHS_DISPLAY = '709 86';

async function one(locator: Locator, label: string): Promise<Locator> {
  const count = await locator.count();
  if (count !== 1) throw new Error(`Blocked: expected one ${label}, found ${count}`);
  return locator;
}

async function openQuickSend(page: Page): Promise<Locator> {
  const search = page.getByPlaceholder('Search patients by name or NHS number', { exact: true });
  await expect(search).toBeVisible({ timeout: 15_000 });
  await search.fill(PATIENT_QUERY);

  const patientResult = page
    .locator('div')
    .filter({ hasText: PATIENT_NHS_DISPLAY })
    .filter({ has: page.getByRole('button', { name: 'Patient actions menu', exact: true }) })
    .last();
  await expect(patientResult).toBeVisible({ timeout: 15_000 });

  const patientActions = await one(
    patientResult.getByRole('button', { name: 'Patient actions menu', exact: true }),
    'Patient actions menu',
  );
  await patientActions.click({ timeout: 10_000 });

  const quickSend = page
    .locator('[role="menuitem"], li')
    .filter({ hasText: 'Quick Send' })
    .filter({ visible: true });
  await expect(quickSend).toHaveCount(1, { timeout: 10_000 });
  await quickSend.click({ timeout: 10_000 });

  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveCount(1, { timeout: 15_000 });
  await expect(dialog).toBeVisible({ timeout: 15_000 });
  return dialog;
}

async function closeDialog(dialog: Locator): Promise<void> {
  const close = dialog.getByRole('button', { name: /close/i });
  if (await close.count()) await close.first().click();
}

test('PAC2-4700 base: Quick Send dialog opens for patient (route smoke)', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });

  const dialog = await openQuickSend(page);
  await expect(dialog).toBeVisible();

  await closeDialog(dialog);
  await page.close();
});

test('PAC2-4700-TC-016 base: Significant Info categories are readable', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });

  const dialog = await openQuickSend(page);

  // Confirmed 2026-09-18: the patient info panel is opened by the
  // "View Patient Details" toggle (class `patient-details-toggle-btn`) in the
  // dialog header, not by any element with visible text "Patient Information"
  // (that text is a hidden <p> label inside `patient__contact-details`).
  const viewPatientDetails = dialog.getByRole('button', { name: 'View Patient Details', exact: true });
  await expect(viewPatientDetails).toBeVisible({ timeout: 10_000 });
  await viewPatientDetails.click();

  const significantInfo = dialog.getByText('Significant Info', { exact: true }).filter({ visible: true });
  await expect(significantInfo).toBeVisible({ timeout: 10_000 });
  await significantInfo.click();

  // Confirmed accordion tab labels (test-results/PAC2-4700/locate/20260918-quicksend-base/
  // patient-info-toggle-candidates.json). Differs from the original draft:
  // no "PACO Registers" tab exists on base.
  for (const category of [
    'Personal Info',
    'Allergies',
    'Active Medications',
    'Past Medications',
    'Appointments',
    'Active Problems',
    'Significant Past Problems',
    'Test Results',
    'Attachments',
  ]) {
    const control = dialog.getByText(category, { exact: true }).filter({ visible: true }).first();
    await expect(control).toBeVisible({ timeout: 5_000 });
    await control.click();
  }

  await closeDialog(dialog);
  await page.close();
});

test('PAC2-4700-TC-008 base: Patient Reply misroutes to Health Forms (known bug regression)', async ({ authenticatedContext }) => {
  // Expected behavior is still Open Question OQ-7 (BA has not confirmed what
  // "Patient Reply" should do). This test locks in the ACTUAL Observed
  // behavior from manual testing (docs/tickets/.../test-cases.md TC-008,
  // status.md: "click nhảy sang tab Health Forms") as a regression baseline.
  // If this test starts failing, the misroute behavior changed — re-verify
  // with tester/BA before updating the assertion either way.
  const page = await authenticatedContext.newPage();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });

  const dialog = await openQuickSend(page);

  const patientReply = dialog.locator('[title="Set up Patient Reply"]');
  await expect(patientReply).toBeVisible({ timeout: 10_000 });
  await patientReply.click();

  const healthFormsTab = dialog.getByRole('button', { name: 'tab-Health Forms', exact: true });
  await expect(healthFormsTab).toHaveClass(/active/, { timeout: 10_000 });

  await closeDialog(dialog);
  await page.close();
});

test('PAC2-4700-TC-012 base: "Search all tabs..." does not filter (known bug regression)', async ({ authenticatedContext }) => {
  // Expected behavior is still Open Question OQ-10 (dev has not confirmed
  // whether this search should filter). This test locks in the ACTUAL
  // Observed behavior from manual testing (test-cases.md TC-012, status.md:
  // "gõ 'blood' không filter/highlight gì") as a regression baseline.
  const page = await authenticatedContext.newPage();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });

  const dialog = await openQuickSend(page);

  const viewPatientDetails = dialog.getByRole('button', { name: 'View Patient Details', exact: true });
  await expect(viewPatientDetails).toBeVisible({ timeout: 10_000 });
  await viewPatientDetails.click();

  const searchAllTabs = dialog.getByPlaceholder(/search all tabs/i);
  await expect(searchAllTabs).toBeVisible({ timeout: 10_000 });

  const tabsBefore = await dialog.locator('.p-accordion-tab').filter({ visible: true }).count();
  await searchAllTabs.fill('blood');

  const highlighted = dialog.locator('mark, .highlight, [class*="highlight" i]');
  await expect(highlighted).toHaveCount(0);
  const tabsAfter = await dialog.locator('.p-accordion-tab').filter({ visible: true }).count();
  expect(tabsAfter).toBe(tabsBefore);

  await closeDialog(dialog);
  await page.close();
});

async function openCampaignPicker(dialog: Locator): Promise<void> {
  const change = dialog.getByText('(click to change)', { exact: true });
  const choose = dialog.getByText('Choose template', { exact: true });
  const changeCount = await change.count();
  await (changeCount === 1 ? change : choose).first().click({ timeout: 10_000 });
  await expect(dialog.locator('[role="treeitem"]').first()).toBeVisible({ timeout: 10_000 });
}

function normalized(value: string): string {
  return value.normalize('NFKD').toLocaleLowerCase('en-GB');
}

test('PAC2-4700-TC-006 base: Campaign sort A-Z', async ({ authenticatedContext }) => {
  // Corrected 2026-09-18: an earlier session wrongly concluded no sort
  // control existed, because "By message type" looked like a static filter
  // label. It is actually the CURRENT VALUE of a real sort dropdown
  // (`.sort-dropdown` inside `_custom-treeselect-filter-sort-container_`)
  // with 5 options: "By date (descending)", "By date (ascending)",
  // "By message type", "A - Z", "Z - A". Confirmed by opening its panel
  // (test-results/PAC2-4700/locate/20260918-quicksend-base/tc006-sort-dropdown-options.json).
  const page = await authenticatedContext.newPage();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });

  const dialog = await openQuickSend(page);
  await openCampaignPicker(dialog);

  const sortDropdown = dialog.locator('.sort-dropdown');
  await expect(sortDropdown).toBeVisible({ timeout: 10_000 });
  await sortDropdown.click();

  const panel = page.locator('.p-dropdown-panel, .p-dropdown-items-wrapper, [role="listbox"]').filter({ visible: true }).first();
  await expect(panel).toBeVisible({ timeout: 5_000 });
  const azOption = panel.locator('li, [role="option"]').filter({ hasText: 'A - Z' });
  await expect(azOption).toHaveCount(1);
  await azOption.click();

  // After selecting a sort order, the tree re-renders flat (no category
  // headers) — wait for that state before reading names.
  await expect(dialog.locator('.campaign-option-category-header')).toHaveCount(0, { timeout: 10_000 });
  const treeitems = dialog.locator('[role="treeitem"]').filter({ visible: true });
  await expect(treeitems.first()).toBeVisible({ timeout: 10_000 });

  const names = (await treeitems.evaluateAll((elements) =>
    elements.map((el) => el.textContent?.replace(/\s+/g, ' ').trim()),
  )).filter((t): t is string => Boolean(t));

  expect(names.length).toBeGreaterThan(1);
  const sorted = [...names].sort((a, b) => normalized(a).localeCompare(normalized(b), 'en-GB'));
  expect(names.map(normalized)).toEqual(sorted.map(normalized));

  await closeDialog(dialog);
  await page.close();
});

test('PAC2-4700-TC-015 base: Campaign compose controls open read-only', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });

  const dialog = await openQuickSend(page);

  // Confirmed 2026-09-18: the Campaign tab already has a default campaign
  // selected when Quick Send opens (no need to pick one via the "(click to
  // change)" picker). The compose controls are identified by stable `title`
  // attributes, not by the original guessed labels/regex.
  const controls: Array<{ title: string; label: string }> = [
    { title: 'Healthcare resources and links', label: 'Resources' },
    { title: 'Create a custom button for your email', label: 'Button' },
    { title: 'Insert professional email templates', label: 'Templates' },
    { title: 'Copy your Email text into the SMS template', label: 'Copy to SMS' },
  ];

  for (const { title, label } of controls) {
    const control = dialog.getByTitle(title, { exact: true }).filter({ visible: true });
    await expect(control).toBeVisible({ timeout: 10_000 });
    await expect(control).toHaveText(label);
  }

  await closeDialog(dialog);
  await page.close();
});

test('PAC2-4700 base walkthrough: complete read-only Quick Send flow', async ({ authenticatedContext }) => {
  test.setTimeout(5 * 60_000);
  const page = await authenticatedContext.newPage();

  await test.step('Open Quick Send for the confirmed patient', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  });
  const dialog = await openQuickSend(page);

  await test.step('Review Campaign compose controls', async () => {
    for (const title of [
      'Healthcare resources and links',
      'Create a custom button for your email',
      'Insert professional email templates',
      'Copy your Email text into the SMS template',
    ]) {
      await expect(dialog.getByTitle(title, { exact: true }).filter({ visible: true })).toBeVisible();
    }
  });

  await test.step('Review Campaign sorting', async () => {
    await openCampaignPicker(dialog);
    const sortDropdown = dialog.locator('.sort-dropdown');
    await expect(sortDropdown).toBeVisible();
    await sortDropdown.click();
    const panel = page.locator('.p-dropdown-panel, .p-dropdown-items-wrapper, [role="listbox"]').filter({ visible: true }).first();
    await expect(panel).toBeVisible();
    await panel.locator('li, [role="option"]').filter({ hasText: 'A - Z' }).click();
    await expect(sortDropdown).toContainText('A - Z');
    await dialog.getByText('(click to change)', { exact: true }).click();
  });

  await test.step('Review Contact Details without adding or deleting data', async () => {
    await dialog.getByRole('button', { name: 'View Patient Details', exact: true }).click();
    await expect(dialog.getByText('Contact Details', { exact: true }).filter({ visible: true })).toBeVisible();
    for (const labelText of ['Number', 'Email']) {
      const label = dialog.getByText(labelText, { exact: true }).filter({ visible: true }).first();
      const dropdown = label.locator('..').locator('.p-dropdown');
      await dropdown.click();
      const panel = page.locator('.p-dropdown-panel').filter({ visible: true });
      await expect(panel).toBeVisible();
      await dropdown.click();
      await expect(panel).toBeHidden();
    }
  });

  await test.step('Review Patient Information search and Significant Info categories', async () => {
    const viewPatientDetails = dialog.getByRole('button', { name: 'View Patient Details', exact: true });
    if (await viewPatientDetails.isVisible()) await viewPatientDetails.click();
    const searchAllTabs = dialog.getByPlaceholder(/search all tabs/i);
    await expect(searchAllTabs).toBeVisible();
    await searchAllTabs.fill('blood');
    await searchAllTabs.clear();

    const significantInfo = dialog.getByText('Significant Info', { exact: true }).filter({ visible: true });
    await significantInfo.click();
    for (const category of [
      'Allergies',
      'Active Medications',
      'Past Medications',
      'Appointments',
      'Active Problems',
      'Significant Past Problems',
      'Test Results',
      'Attachments',
    ]) {
      const control = dialog.getByText(category, { exact: true }).filter({ visible: true }).first();
      await expect(control).toBeVisible();
      await control.click();
    }
  });

  await test.step('Review Files and Booking Link surfaces', async () => {
    await dialog.getByRole('button', { name: 'tab-Files', exact: true }).click();
    await expect(dialog.getByText('Add files from patient record', { exact: true })).toBeVisible();

    await dialog.getByRole('button', { name: 'tab-Booking Link', exact: true }).click();
    await expect(dialog.getByText('Booking Link', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  });

  await closeDialog(dialog);
  await page.close();
});
