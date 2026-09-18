import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';

test.setTimeout(2 * 60_000);

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com/paco/';
const BRANCH_URL = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/';
const PATIENT_QUERY = 'Michael Ramella';
const PATIENT_NHS = '70986';

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

  const patientNhs = await one(
    page.getByText(new RegExp(`NHS(?: No)?:\\s*${PATIENT_NHS}`)),
    `patient NHS ${PATIENT_NHS}`,
  );
  const patientRow = await one(
    patientNhs.locator('xpath=ancestor::div[contains(@class, "_patient-row_")][1]'),
    'approved patient row',
  );
  await (await one(
    patientRow.getByRole('button', { name: 'Patient actions menu', exact: true }),
    'Patient actions menu',
  )).click();
  await (await one(
    page.getByRole('menuitem', { name: 'Quick Send', exact: true }),
    'Quick Send menu item',
  )).click();

  const dialog = await one(page.getByRole('dialog'), 'Quick Send dialog');
  await expect(dialog).toBeVisible();
  return dialog;
}

async function closeDialog(dialog: Locator): Promise<void> {
  const close = dialog.getByRole('button', { name: /close/i });
  if (await close.count()) await close.first().click();
}

async function openCampaignPicker(dialog: Locator): Promise<void> {
  const change = dialog.getByText('(click to change)', { exact: true });
  const choose = dialog.getByText('Choose template', { exact: true });
  await (await one(
    await change.count() === 1 ? change : choose,
    'campaign picker control',
  )).click();
}

async function visibleText(locator: Locator): Promise<string[]> {
  return locator.evaluateAll((elements) =>
    elements
      .filter((element) => (element as HTMLElement).offsetParent !== null)
      .map((element) => element.textContent?.trim() ?? '')
      .filter(Boolean),
  );
}

function normalized(value: string): string {
  return value.normalize('NFKD').toLocaleLowerCase('en-GB');
}

for (const environment of [
  { name: 'base', url: BASE_URL },
  { name: 'branch', url: BRANCH_URL },
]) {
  test(`PAC2-4700-TC-006 ${environment.name}: Campaign sort A-Z`, async ({ authenticatedContext }) => {
    const page = await authenticatedContext.newPage();
    const dialog = await openQuickSend(page, environment.url);
    await openCampaignPicker(dialog);

    const sort = await one(
      page.getByRole('combobox').filter({ hasText: /By date|A.?Z|Z.?A/i }).filter({ visible: true }),
      'campaign sort dropdown',
    );
    await sort.click();
    await (await one(page.getByRole('option', { name: /A.?Z/i }), 'A-Z sort option')).click();

    const names = await visibleText(page.getByRole('option'));
    expect(names.length).toBeGreaterThan(1);
    expect(names.map(normalized)).toEqual([...names].map(normalized).sort((a, b) => a.localeCompare(b, 'en-GB')));

    await closeDialog(dialog);
    await page.close();
  });
}

test('PAC2-4700-TC-015 branch: Campaign compose controls open read-only', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  const dialog = await openQuickSend(page, BRANCH_URL);
  await openCampaignPicker(dialog);

  const campaign = page.getByText('6 July - Test Case 1', { exact: true }).filter({ visible: true });
  await (await one(campaign, 'observed campaign')).click();

  const mergeControl = dialog.getByRole('button', { name: /merge fields|add content/i });
  await (await one(mergeControl, 'Merge Fields control')).click();
  await expect(page.getByText('Merge Fields', { exact: true }).filter({ visible: true })).toBeVisible();

  for (const label of ['Copy to Email', 'Button', 'Templates', 'Resources']) {
    const control = dialog.getByText(label, { exact: true }).filter({ visible: true });
    await expect(control).toHaveCount(1);
  }

  await closeDialog(dialog);
  await page.close();
});

test('PAC2-4700-TC-016 branch: Significant Info categories are readable', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  const dialog = await openQuickSend(page, BRANCH_URL);

  await (await one(
    dialog.getByRole('button', { name: /patient information/i }),
    'Patient Information button',
  )).click();
  await expect(dialog.getByText('Significant Info', { exact: true })).toBeVisible();

  for (const category of [
    'PACO Registers',
    'Allergies',
    'Active Medications',
    'Past Medications',
    'Appointments',
    'Active Problems',
    'Significant Past Problems',
    'Test Results',
  ]) {
    const control = dialog.getByText(category, { exact: true });
    await expect(control).toHaveCount(1);
    await control.click();
  }

  await closeDialog(dialog);
  await page.close();
});
