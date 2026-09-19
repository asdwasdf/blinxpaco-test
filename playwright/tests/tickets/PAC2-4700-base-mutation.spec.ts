import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';
import { evaluateMutationGate, type MutationApproval, type MutationRunScope } from '../../../scripts/mutation-gate.js';

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com/paco/';
const RUN_ID = 'PAC2-4700-base-actions-2026-09-18';
const CASE_ID = 'PAC2-4700-HUMAN-FLOW';
const PHONE = '07704700470';
const EMAIL = 'qa.pac2.4700.fixed@example.com';
const FILE = 'qa-pac2-4700-fixed.txt';
const CAMPAIGN = 'QA PAC2-4700 BASE 20260918';
const FINGERPRINT = `phone=${PHONE};email=${EMAIL};file=${FILE};campaign=${CAMPAIGN}`;

function approvals(): MutationApproval[] {
  const raw = process.env.PACO_MUTATION_APPROVAL_JSON;
  if (!raw) throw new Error('Blocked: PACO_MUTATION_APPROVAL_JSON is required');
  return JSON.parse(raw) as MutationApproval[];
}

function requireApproval(action: string, mutationClass: 'Persistent' | 'Destructive'): void {
  const approval = approvals().find((candidate) =>
    candidate.actions.includes(action) && candidate.mutation_class === mutationClass,
  ) ?? null;
  const scope: MutationRunScope = {
    run_id: RUN_ID,
    environment: 'dev',
    ticket_key: 'PAC2-4700',
    case_id: CASE_ID,
    action,
    test_data_fingerprint: FINGERPRINT,
    mutation_class: mutationClass,
  };
  const gate = evaluateMutationGate(
    scope,
    approval,
    {
      PACO_ALLOW_MUTATION: process.env.PACO_ALLOW_MUTATION,
      PACO_ALLOW_DESTRUCTIVE: process.env.PACO_ALLOW_DESTRUCTIVE,
    },
    new Date().toISOString(),
  );
  if (!gate.allowed) throw new Error(`Blocked: mutation not allowed — ${gate.reason}`);
}

function assertPacoOs(page: Page, checkpoint: string): void {
  if (!page.url().startsWith(BASE_URL)) {
    throw new Error(`Blocked: left PACO OS at ${checkpoint}: ${page.url()}`);
  }
}

async function openQuickSend(page: Page): Promise<Locator> {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  assertPacoOs(page, 'dashboard');
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
  const dialog = page.getByRole('dialog', { name: /Quick Send rocket icon/ });
  await expect(dialog).toBeVisible({ timeout: 15_000 });
  assertPacoOs(page, 'quick-send');
  return dialog;
}

async function openPatientDetails(dialog: Locator): Promise<void> {
  const open = dialog.getByRole('button', { name: 'View Patient Details', exact: true });
  if (await open.isVisible()) await open.click();
  await expect(dialog.getByText('Contact Details', { exact: true }).filter({ visible: true })).toBeVisible();
}

async function dropdownFor(dialog: Locator, label: 'Number' | 'Email'): Promise<Locator> {
  const text = dialog.getByText(label, { exact: true }).filter({ visible: true }).first();
  return text.locator('..').locator('.p-dropdown');
}

async function optionFor(page: Page, value: string): Promise<Locator> {
  const panel = page.locator('.p-dropdown-panel').filter({ visible: true });
  await expect(panel).toBeVisible({ timeout: 10_000 });
  return panel.locator('li, [role="option"]').filter({ hasText: value });
}

async function deleteContactIfPresent(page: Page, dialog: Locator, label: 'Number' | 'Email', value: string): Promise<void> {
  const dropdown = await dropdownFor(dialog, label);
  if (!await page.locator('.p-dropdown-panel').filter({ visible: true }).isVisible()) await dropdown.click();
  const option = await optionFor(page, value);
  if (await option.count()) {
    const remove = option.first().locator('img').last();
    await expect(remove).toBeVisible({ timeout: 10_000 });
    await remove.click();
    const confirm = page.getByRole('button', { name: /confirm|delete|yes/i }).filter({ visible: true });
    if (await confirm.count()) await confirm.last().click();
  } else {
    await dropdown.click();
  }

  if (!await page.locator('.p-dropdown-panel').filter({ visible: true }).isVisible()) await dropdown.click();
  await expect((await optionFor(page, value))).toHaveCount(0, { timeout: 20_000 });
  await dropdown.click();
}

async function addContact(page: Page, dialog: Locator, label: 'Number' | 'Email', value: string): Promise<void> {
  const dropdown = await dropdownFor(dialog, label);
  await dropdown.click();
  await page.getByText(label === 'Number' ? /add new number/i : /add new email/i).filter({ visible: true }).click();
  const title = page.getByText(`Enter ${label}`, { exact: true }).filter({ visible: true });
  await expect(title).toBeVisible();
  const modal = title.locator('xpath=ancestor::*[@role="dialog"][1]');
  await modal.getByRole('textbox').first().fill(value);
  const type = modal.locator('.p-dropdown');
  if (await type.count()) {
    await type.click();
    await page.locator('.p-dropdown-panel').filter({ visible: true }).getByText('Home', { exact: true }).click();
  }
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(title).toBeHidden({ timeout: 20_000 });

  await dropdown.click();
  await expect((await optionFor(page, value))).toHaveCount(1);
  await dropdown.click();
}

async function close(page: Page): Promise<void> {
  await page.close();
}

test.describe.serial('PAC2-4700 base mutation actions', () => {
  test('phone add/save cleans up in finally', async ({ authenticatedContext }) => {
    test.setTimeout(3 * 60_000);
    requireApproval('phone-add-save', 'Persistent');
    requireApproval('phone-delete-cleanup', 'Destructive');
    const page = await authenticatedContext.newPage();
    const dialog = await openQuickSend(page);
    await openPatientDetails(dialog);
    try {
      await deleteContactIfPresent(page, dialog, 'Number', PHONE);
      await addContact(page, dialog, 'Number', PHONE);
      console.log(`CREATED_PHONE=${PHONE}`);
    } finally {
      assertPacoOs(page, 'phone-cleanup');
      await deleteContactIfPresent(page, dialog, 'Number', PHONE);
      console.log(`CLEANED_PHONE=${PHONE}`);
      await close(page);
    }
  });

  test('email add/save cleans up in finally', async ({ authenticatedContext }) => {
    test.setTimeout(3 * 60_000);
    requireApproval('email-add-save', 'Persistent');
    requireApproval('email-delete-cleanup', 'Destructive');
    const page = await authenticatedContext.newPage();
    const dialog = await openQuickSend(page);
    await openPatientDetails(dialog);
    try {
      await deleteContactIfPresent(page, dialog, 'Email', EMAIL);
      await addContact(page, dialog, 'Email', EMAIL);
      console.log(`CREATED_EMAIL=${EMAIL}`);
    } finally {
      assertPacoOs(page, 'email-cleanup');
      await deleteContactIfPresent(page, dialog, 'Email', EMAIL);
      console.log(`CLEANED_EMAIL=${EMAIL}`);
      await close(page);
    }
  });

  test('file upload removes local draft in finally', async ({ authenticatedContext }) => {
    test.setTimeout(3 * 60_000);
    requireApproval('file-upload-remove', 'Persistent');
    const page = await authenticatedContext.newPage();
    const dialog = await openQuickSend(page);
    let file: Locator | null = null;
    try {
      await dialog.getByRole('button', { name: 'tab-Files', exact: true }).click();
      const input = dialog.locator('input[type="file"]');
      await expect(input).toHaveCount(1);
      await input.setInputFiles({ name: FILE, mimeType: 'text/plain', buffer: Buffer.from('PAC2-4700 QA test file') });
      file = dialog.getByText(FILE, { exact: true });
      await expect(file).toBeVisible();
      console.log(`UPLOADED_FILE=${FILE}`);
    } finally {
      assertPacoOs(page, 'file-cleanup');
      if (file && await file.isVisible()) {
        const row = file.locator('xpath=ancestor::*[self::li or self::div][1]');
        await row.locator('button, [role="button"], img').last().click();
        await expect(file).toBeHidden();
      }
      console.log(`CLEANED_FILE=${FILE}`);
      await close(page);
    }
  });

  test('campaign saves as new without sending or scheduling', async ({ authenticatedContext }) => {
    test.setTimeout(3 * 60_000);
    requireApproval('campaign-save-as-new', 'Persistent');
    const page = await authenticatedContext.newPage();
    const dialog = await openQuickSend(page);
    try {
      await dialog.getByRole('button', { name: 'Edit', exact: true }).click();
      const editable = dialog.locator('textarea, [contenteditable="true"]').filter({ visible: true }).first();
      await editable.pressSequentially(' QA', { delay: 100 });
      const save = dialog.getByRole('button', { name: 'Save', exact: true });
      await expect(save).toBeEnabled();
      await save.click();
      const title = page.getByText('Save Campaign', { exact: true }).filter({ visible: true });
      await expect(title).toBeVisible();
      const modal = title.locator('xpath=ancestor::*[@role="dialog"][1]');
      await modal.getByRole('button').filter({ has: modal.getByRole('heading', { name: 'Save as New', exact: true }) }).click();
      const fields = modal.getByRole('textbox');
      await expect(fields).toHaveCount(2);
      await fields.nth(0).fill(CAMPAIGN);
      await fields.nth(1).fill(CAMPAIGN);
      await modal.getByRole('button', { name: /^save$/i }).click();
      await expect(title).toBeHidden({ timeout: 20_000 });
      console.log(`LEFTOVER_CAMPAIGN=${CAMPAIGN}`);
    } finally {
      assertPacoOs(page, 'campaign-finish');
      await close(page);
    }
  });
});
