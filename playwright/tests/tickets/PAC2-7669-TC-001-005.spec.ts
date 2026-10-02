import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';
import { loadConfig } from '../../../scripts/load-config.js';
import { evaluateMutationGate, type MutationRunScope, type WorkflowMutationAuthorization } from '../../../scripts/mutation-gate.js';

const BASE_URL = 'https://pac2-7669.dev.blinxpaco-np.com';
const REVISION = '119562275d74aa7562cfe99a27e0502e86c3716aa377a6e0404f1c14f7bce99f';
const RUN_ID = 'PAC2-7669-automation';
const CASE_IDS = ['TC-7669-001', 'TC-7669-002', 'TC-7669-003', 'TC-7669-004', 'TC-7669-005'];
const ACTION = 'draft-clinician-selection';
const FINGERPRINT = 'template=11114,9147;mode=draft-only;cleanup=cancel';
const MAX_SIGNIFICANT_DELAY_MS = 5_000;

const authorization: WorkflowMutationAuthorization = {
  source: 'paco-execution-first-workflow',
  product: 'Paco',
  environment: 'dev',
  ticket_key: 'PAC2-7669',
  case_ids: CASE_IDS,
  actions: [ACTION],
  test_data_fingerprint: FINGERPRINT,
};

function requireMutationGate(caseId: string, currentUrl: string): void {
  const scope: MutationRunScope = {
    run_id: RUN_ID,
    environment: 'dev',
    current_url: currentUrl,
    ticket_key: 'PAC2-7669',
    case_id: caseId,
    action: ACTION,
    test_data_fingerprint: FINGERPRINT,
    mutation_class: 'Temporary',
  };
  const gate = evaluateMutationGate(
    scope,
    null,
    { PACO_ALLOW_MUTATION: process.env.PACO_ALLOW_MUTATION },
    new Date().toISOString(),
    loadConfig().safety,
    authorization,
  );
  if (!gate.allowed) throw new Error(`Blocked: mutation not allowed — ${gate.reason}`);
}

function assertTargetHost(page: Page): void {
  expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);
}

async function openScheduler(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/configuration/`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  assertTargetHost(page);
  await expect(page.getByText('Scheduler Config', { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByPlaceholder('Search Templates...')).toBeVisible({ timeout: 30_000 });
}

async function openMapping(page: Page, templateId: string, templateName: string): Promise<Locator> {
  await page.getByPlaceholder('Search Templates...').fill(templateName);
  const template = page.locator(`[data-template-id="${templateId}"]`);
  await expect(template).toBeVisible();
  await template.click();
  await template.getByRole('button', { name: 'Edit', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Edit Connections' })).toBeVisible();
  await expect(dialog.getByRole('combobox', { name: 'Select a clinician' })).toBeVisible();
  return dialog;
}

async function selectClinician(page: Page, dialog: Locator, clinician: RegExp): Promise<number> {
  await dialog.getByRole('button', { name: 'Open' }).click();
  const option = page.getByRole('option', { name: clinician }).first();
  await expect(option).toBeVisible();
  const start = performance.now();
  await option.click();
  await expect(dialog.locator('.chip-label').filter({ hasText: clinician })).toBeVisible({
    timeout: MAX_SIGNIFICANT_DELAY_MS,
  });
  return performance.now() - start;
}

async function removeClinician(dialog: Locator, clinician: RegExp): Promise<void> {
  const chip = dialog.locator('.chip-label').filter({ hasText: clinician });
  await chip.locator('svg[data-icon="xmark"]').click();
  await expect(chip).toHaveCount(0);
}

async function cancelDraft(page: Page, dialog: Locator): Promise<void> {
  await page.keyboard.press('Escape');
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(dialog).toBeHidden();
}

async function expectResponsive(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(() => document.title)).toBe('Scheduler Configuration');
}

test.describe.serial('PAC2-7669 clinician selection performance', () => {
  test.beforeEach(async ({ authenticatedContext }) => {
    requireMutationGate('TC-7669-001', `${BASE_URL}/configuration/`);
    const pages = authenticatedContext.pages();
    if (pages.length === 0) throw new Error('Blocked: authenticated browser has no page');
  });

  test('TC-7669-001/002/003/004 — EMIS selection stays responsive', async ({ authenticatedContext }) => {
    test.setTimeout(90_000);
    const page = authenticatedContext.pages()[0];
    await openScheduler(page);
    const dialog = await openMapping(page, '11114', 'Blood Test FJ');
    await expect(dialog.getByRole('gridcell', { name: 'Same Day GP Appt', exact: true })).toBeVisible();

    try {
      for (const clinician of [/^Mr Jamal Syed/, /^14sepmike wong/, /^Mr Jamal Syed/]) {
        const elapsed = await selectClinician(page, dialog, clinician);
        expect(elapsed, `selection exceeded old 5-second lower baseline: ${elapsed}ms`).toBeLessThan(MAX_SIGNIFICANT_DELAY_MS);
        await expectResponsive(page);
        await removeClinician(dialog, clinician);
      }
    } finally {
      await cancelDraft(page, dialog);
    }

    const reopened = await openMapping(page, '11114', 'Blood Test FJ');
    await expect(reopened.locator('.chip-label')).toHaveCount(0);
    await cancelDraft(page, reopened);
    console.log(`REVISION=${REVISION}; EMIS cleanup verified`);
  });

  test('TC-7669-001/002/003/005 — PACO Connect selection stays responsive', async ({ authenticatedContext }) => {
    test.setTimeout(90_000);
    const page = authenticatedContext.pages()[0];
    await openScheduler(page);
    const dialog = await openMapping(page, '9147', 'Blood Test Due - Boot Camp 240225');
    await expect(dialog.getByRole('gridcell', { name: 'Blood Test', exact: true })).toBeVisible();
    const baseline = await dialog.locator('.chip-label').allTextContents();

    try {
      for (const clinician of [/^14sepmike wong/, /^17 Jul 17 Jul/, /^3 jan mike 2/]) {
        const elapsed = await selectClinician(page, dialog, clinician);
        expect(elapsed, `selection exceeded old 5-second lower baseline: ${elapsed}ms`).toBeLessThan(MAX_SIGNIFICANT_DELAY_MS);
        await expectResponsive(page);
        await removeClinician(dialog, clinician);
      }
    } finally {
      await cancelDraft(page, dialog);
    }

    const reopened = await openMapping(page, '9147', 'Blood Test Due - Boot Camp 240225');
    expect(await reopened.locator('.chip-label').allTextContents()).toEqual(baseline);
    await cancelDraft(page, reopened);
    console.log(`REVISION=${REVISION}; PACO Connect cleanup verified`);
  });
});
