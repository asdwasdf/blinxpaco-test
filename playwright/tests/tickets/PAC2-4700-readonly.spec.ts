import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';
import { AppShell, QuickSendPage } from '../../pages/index.js';

test.setTimeout(2 * 60_000);

const BRANCH_URL = 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard';
const PATIENT_QUERY = 'Michael Ramella';
const PATIENT_NHS_DISPLAY = '709 86';

async function openQuickSend(page: Page, url: string): Promise<Locator> {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  return new QuickSendPage(page).openFor(PATIENT_QUERY, PATIENT_NHS_DISPLAY);
}

async function openPatientDetails(quickSend: QuickSendPage, dialog: Locator): Promise<void> {
  await quickSend.viewPatientDetailsButton(dialog).click();
  await expect(quickSend.visibleText('Contact Details', dialog)).toBeVisible();
}

test('PAC2-4700-TC-006 branch: Campaign picker sorts A-Z', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  const quickSend = new QuickSendPage(page);
  const dialog = await openQuickSend(page, BRANCH_URL);

  await quickSend.changeTemplateLink(dialog).click();
  const sort = quickSend.sortDropdown(dialog);
  await sort.click();
  const panel = quickSend.dropdownPanel;
  await expect(panel).toBeVisible();
  await panel.locator('li, [role="option"]').filter({ hasText: 'A - Z' }).click();
  await expect(sort).toContainText('A - Z');

  const items = quickSend.campaignItems(dialog);
  await expect(items.first()).toBeVisible();
  const names = (await items.allTextContents()).map((value) => value.replace(/\s+/g, ' ').trim());
  const expected = [...names].sort((left, right) => left.localeCompare(right, 'en', { sensitivity: 'base' }));
  expect(names).toEqual(expected);

  await quickSend.close(dialog);
  await page.close();
});

for (const contact of [
  { id: 'PAC2-4700-TC-011', label: 'Number', add: /add new number/i, modal: 'Enter Number' },
  { id: 'PAC2-4700-TC-014', label: 'Email', add: /add new email/i, modal: 'Enter Email' },
]) {
  test(`${contact.id} branch: ${contact.label} dropdown and add modal open read-only`, async ({ authenticatedContext }) => {
    const page = await authenticatedContext.newPage();
    const quickSend = new QuickSendPage(page);
    const shell = new AppShell(page);
    const dialog = await openQuickSend(page, BRANCH_URL);
    await openPatientDetails(quickSend, dialog);

    await quickSend.contactDropdown(contact.label, dialog).click();
    const add = page.getByText(contact.add).filter({ visible: true });
    await expect(add).toBeVisible();
    await add.click();

    const modal = page.getByText(contact.modal, { exact: true }).filter({ visible: true });
    await expect(modal).toBeVisible();
    await shell.visibleCancelButton.click();
    await expect(modal).toBeHidden();

    await quickSend.close(dialog);
    await page.close();
  });
}

test('PAC2-4700-TC-015 branch: Campaign compose controls open read-only', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  const quickSend = new QuickSendPage(page);
  const dialog = await openQuickSend(page, BRANCH_URL);

  const controls: Array<{ title: string; label: string }> = [
    { title: 'Healthcare resources and links', label: 'Resources' },
    { title: 'Create a custom button for your email', label: 'Button' },
    { title: 'Insert professional email templates', label: 'Templates' },
    { title: 'Copy your Email text into the SMS template', label: 'Copy to SMS' },
  ];

  for (const { title, label } of controls) {
    const control = quickSend.composeControl(title, dialog);
    await expect(control).toBeVisible({ timeout: 10_000 });
    await expect(control).toHaveText(label);
  }

  await quickSend.close(dialog);
  await page.close();
});

test('PAC2-4700-TC-016 branch: Significant Info categories are readable', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  const quickSend = new QuickSendPage(page);
  const dialog = await openQuickSend(page, BRANCH_URL);

  const viewPatientDetails = quickSend.viewPatientDetailsButton(dialog);
  await expect(viewPatientDetails).toBeVisible({ timeout: 10_000 });
  await viewPatientDetails.click();

  const significantInfo = quickSend.visibleText('Significant Info', dialog);
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
    const control = quickSend.visibleText(category, dialog).first();
    await expect(control).toBeVisible({ timeout: 5_000 });
    await control.click();
  }

  await quickSend.close(dialog);
  await page.close();
});
