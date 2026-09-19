import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com/paco/';
const PHONE = '07704232052';
const EMAIL = 'qa.pac2.4700.4232052@example.com';

async function openQuickSend(page: Page): Promise<Locator> {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  const search = page.getByPlaceholder('Search patients by name or NHS number', { exact: true });
  await expect(search).toBeVisible({ timeout: 30_000 });
  await search.fill('Michael Ramella');
  const row = page.locator('div')
    .filter({ hasText: '709 86' })
    .filter({ has: page.getByRole('button', { name: 'Patient actions menu', exact: true }) })
    .last();
  await expect(row).toBeVisible({ timeout: 30_000 });
  await row.getByRole('button', { name: 'Patient actions menu', exact: true }).click();
  await page.locator('[role="menuitem"], li').filter({ hasText: 'Quick Send' }).filter({ visible: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'View Patient Details', exact: true }).click();
  return dialog;
}

async function cleanup(page: Page, dialog: Locator, labelText: 'Number' | 'Email', value: string): Promise<void> {
  const label = dialog.getByText(labelText, { exact: true }).filter({ visible: true }).first();
  const dropdown = label.locator('..').locator('.p-dropdown');
  await dropdown.click();
  const panel = page.locator('.p-dropdown-panel').filter({ visible: true });
  await expect(panel).toBeVisible();
  const option = panel.locator('li').filter({ hasText: value });
  await expect(option).toHaveCount(1);
  const remove = option.locator('img').last();
  await expect(remove).toBeVisible();
  await remove.click();
  const confirm = page.getByRole('button', { name: /confirm|delete|yes/i }).filter({ visible: true });
  if (await confirm.count()) await confirm.last().click();
  await expect(page.getByText(value, { exact: true }).filter({ visible: true })).toHaveCount(0, { timeout: 20_000 });
  console.log(`CLEANED_${labelText.toUpperCase()}=${value}`);
}

test('PAC2-4700 cleanup contacts left by interrupted run', async ({ authenticatedContext }) => {
  test.setTimeout(3 * 60_000);
  const page = await authenticatedContext.newPage();
  const dialog = await openQuickSend(page);
  await cleanup(page, dialog, 'Number', PHONE);
  await cleanup(page, dialog, 'Email', EMAIL);
  await page.close();
});
