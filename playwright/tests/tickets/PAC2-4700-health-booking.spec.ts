import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';
import { evaluateMutationGate, type MutationApproval } from '../../../scripts/mutation-gate.js';

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com/paco/';
const RUN_ID = 'PAC2-4700-health-booking-2026-09-18';
const CASE_ID = 'PAC2-4700-HUMAN-FLOW';
const FINGERPRINT = 'patient=Michael Ramella NHS display 709 86;health-form=first-visible-QA-safe;booking-link=existing-selected-link';

function requireApproval(action: string): void {
  const raw = process.env.PACO_MUTATION_APPROVAL_JSON;
  if (!raw) throw new Error('Blocked: PACO_MUTATION_APPROVAL_JSON is required');
  const parsed = JSON.parse(raw) as MutationApproval | MutationApproval[];
  const approval = (Array.isArray(parsed) ? parsed : [parsed]).find((item) =>
    item.actions.includes(action) && item.mutation_class === 'Persistent',
  ) ?? null;
  const result = evaluateMutationGate({
    run_id: RUN_ID,
    environment: 'dev',
    ticket_key: 'PAC2-4700',
    case_id: CASE_ID,
    action,
    test_data_fingerprint: FINGERPRINT,
    mutation_class: 'Persistent',
  }, approval, { PACO_ALLOW_MUTATION: process.env.PACO_ALLOW_MUTATION }, new Date().toISOString());
  if (!result.allowed) throw new Error(`Blocked: mutation not allowed — ${result.reason}`);
}

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
  const dialog = page.getByRole('dialog', { name: /Quick Send rocket icon/ });
  await expect(dialog).toBeVisible({ timeout: 15_000 });
  return dialog;
}

async function chooseSchedulerPlacement(page: Page, name: "I'll Choose Where" | 'Add at End'): Promise<void> {
  const prompt = page.getByText('Scheduler Link Required', { exact: true }).filter({ visible: true });
  await expect(prompt).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name, exact: true }).click();
  await expect(prompt).toBeHidden({ timeout: 15_000 });
}

async function assertForbiddenActionsUntouched(dialog: Locator): Promise<void> {
  await expect(dialog.getByRole('button', { name: /Send Now/i })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: /^Schedule$/i })).toHaveCount(0);
}

test.describe.serial('PAC2-4700 Health Form and Booking Link actions', () => {
  test('attach first visible Health Form and save draft', async ({ authenticatedContext }) => {
    test.setTimeout(3 * 60_000);
    requireApproval('health-form-attach-save');
    const page = await authenticatedContext.newPage();
    try {
      const dialog = await openQuickSend(page);
      await dialog.getByRole('button', { name: 'tab-Health Forms', exact: true }).click();
      const selector = dialog.getByText('Select Health Form', { exact: true }).filter({ visible: true });
      await expect(selector).toBeVisible();
      await selector.click();
      const candidate = page.locator('li').filter({ visible: true }).filter({ hasNotText: /^$/ }).first();
      await expect(candidate).toBeVisible();
      const label = (await candidate.innerText()).trim().replace(/\s+/g, ' ').slice(0, 120);
      await candidate.click();
      await expect(dialog.getByText(label, { exact: false }).filter({ visible: true }).first()).toBeVisible({ timeout: 15_000 });
      const save = dialog.getByRole('button', { name: 'Save', exact: true });
      if (await save.isEnabled()) await save.click();
      await assertForbiddenActionsUntouched(dialog);
      console.log(`ATTACHED_HEALTH_FORM=${label}`);
    } finally {
      await page.close();
    }
  });

  for (const placement of ["I'll Choose Where", 'Add at End'] as const) {
    test(`Booking Link: ${placement} and save draft`, async ({ authenticatedContext }) => {
      test.setTimeout(3 * 60_000);
      requireApproval(placement === 'Add at End' ? 'booking-link-add-at-end-save' : 'booking-link-choose-where-save');
      const page = await authenticatedContext.newPage();
      try {
        const dialog = await openQuickSend(page);
        await dialog.getByRole('button', { name: 'tab-Booking Link', exact: true }).click();
        await expect(dialog.getByText('Booking Link', { exact: true }).filter({ visible: true }).first()).toBeVisible();
        const save = dialog.getByRole('button', { name: 'Save', exact: true });
        await expect(save).toBeEnabled();
        await save.click();
        await chooseSchedulerPlacement(page, placement);
        await assertForbiddenActionsUntouched(dialog);
        console.log(`BOOKING_LINK_PLACEMENT=${placement}`);
      } finally {
        await page.close();
      }
    });
  }
});
