import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';

test.setTimeout(2 * 60_000);

const BRANCH_URL = 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard';
const PATIENT_QUERY = 'Michael Ramella';
const PATIENT_NHS_DISPLAY = '709 86';

async function one(locator: Locator, label: string): Promise<Locator> {
  const count = await locator.count();
  if (count !== 1) throw new Error(`Blocked: expected one ${label}, found ${count}`);
  return locator;
}

async function openQuickSend(page: Page, url: string): Promise<Locator> {
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const search = page.getByPlaceholder('Search patients by name or NHS number', { exact: true });
  await expect(search).toBeVisible({ timeout: 30_000 });
  await search.fill(PATIENT_QUERY);

  const patientResult = page
    .locator('div')
    .filter({ hasText: PATIENT_NHS_DISPLAY })
    .filter({ has: page.getByRole('button', { name: 'Patient actions menu', exact: true }) })
    .last();
  await expect(patientResult).toBeVisible({ timeout: 15_000 });

  await (await one(
    patientResult.getByRole('button', { name: 'Patient actions menu', exact: true }),
    'Patient actions menu',
  )).click();
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

async function openPatientDetails(dialog: Locator): Promise<void> {
  await dialog.getByRole('button', { name: 'View Patient Details', exact: true }).click();
  await expect(dialog.getByText('Contact Details', { exact: true }).filter({ visible: true })).toBeVisible();
}

test('PAC2-4700-TC-006 branch: Campaign picker sorts A-Z', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  const dialog = await openQuickSend(page, BRANCH_URL);

  await dialog.getByText('(click to change)', { exact: true }).click();
  const sort = dialog.locator('.sort-dropdown');
  await sort.click();
  const panel = page.locator('.p-dropdown-panel, [role="listbox"]').filter({ visible: true }).first();
  await expect(panel).toBeVisible();
  await panel.locator('li, [role="option"]').filter({ hasText: 'A - Z' }).click();
  await expect(sort).toContainText('A - Z');

  const items = dialog.locator('[role="treeitem"]').filter({ visible: true });
  await expect(items.first()).toBeVisible();
  const names = (await items.allTextContents()).map((value) => value.replace(/\s+/g, ' ').trim());
  const expected = [...names].sort((left, right) => left.localeCompare(right, 'en', { sensitivity: 'base' }));
  expect(names).toEqual(expected);

  await closeDialog(dialog);
  await page.close();
});

for (const contact of [
  { id: 'PAC2-4700-TC-011', label: 'Number', add: /add new number/i, modal: 'Enter Number' },
  { id: 'PAC2-4700-TC-014', label: 'Email', add: /add new email/i, modal: 'Enter Email' },
]) {
  test(`${contact.id} branch: ${contact.label} dropdown and add modal open read-only`, async ({ authenticatedContext }) => {
    const page = await authenticatedContext.newPage();
    const dialog = await openQuickSend(page, BRANCH_URL);
    await openPatientDetails(dialog);

    const label = dialog.getByText(contact.label, { exact: true }).filter({ visible: true }).first();
    await label.locator('..').locator('.p-dropdown').click();
    const add = page.getByText(contact.add).filter({ visible: true });
    await expect(add).toBeVisible();
    await add.click();

    const modal = page.getByText(contact.modal, { exact: true }).filter({ visible: true });
    await expect(modal).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).filter({ visible: true }).click();
    await expect(modal).toBeHidden();

    await closeDialog(dialog);
    await page.close();
  });
}

test('PAC2-4700-TC-015 branch: Campaign compose controls open read-only', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  const dialog = await openQuickSend(page, BRANCH_URL);

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

test('PAC2-4700-TC-016 branch: Significant Info categories are readable', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  const dialog = await openQuickSend(page, BRANCH_URL);

  const viewPatientDetails = dialog.getByRole('button', {
    name: 'View Patient Details',
    exact: true,
  });
  await expect(viewPatientDetails).toBeVisible({ timeout: 10_000 });
  await viewPatientDetails.click();

  const significantInfo = dialog.getByText('Significant Info', { exact: true }).filter({ visible: true });
  await expect(significantInfo).toBeVisible({ timeout: 10_000 });
  await significantInfo.click();

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
