import type { Locator } from '@playwright/test';
import { evaluateMutationGate } from '../../../scripts/mutation-gate.js';
import { expect, test } from '../../fixtures/auth-fixtures.js';
import {
  classifySchedulerPopupStages,
  PAC2_5776_TC_004_SCOPE,
  parseGuidedApproval,
} from '../../support/paco-5776-guided.js';

async function requireUnique(locator: Locator, label: string): Promise<Locator> {
  const count = await locator.count();
  if (count !== 1) throw new Error(`Blocked: expected one ${label}, found ${count}`);
  return locator;
}

async function observeUniquePopup(locator: Locator): Promise<boolean> {
  const count = await locator.count();
  if (count > 1) throw new Error(`Blocked: expected at most one Scheduler Link Required popup, found ${count}`);
  return count === 1 && locator.isVisible();
}

test('PAC2-5776-TC-004 guided: booking link trước, health form sau', async ({ authenticatedPage }) => {
  test.setTimeout(15 * 60_000);
  const approval = parseGuidedApproval(process.env.PACO_MUTATION_APPROVAL_JSON);
  const decision = evaluateMutationGate(
    PAC2_5776_TC_004_SCOPE,
    {
      run_id: approval.scope.run_id,
      environment: approval.scope.environment,
      ticket_key: approval.scope.ticket_key,
      case_ids: [approval.scope.case_id],
      actions: [approval.scope.action],
      test_data_fingerprint: approval.scope.test_data_fingerprint,
      mutation_class: 'Persistent',
      approved_at: '2026-09-10T00:00:00Z',
      expires_at: null,
    },
    process.env,
    new Date().toISOString(),
  );
  if (!decision.allowed) throw new Error(`Blocked: ${decision.reason}`);

  const page = authenticatedPage;

  await page.context().addInitScript(() => {
    document.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest('button, a, [role="button"]') as HTMLElement | null;
      const label = target?.innerText?.trim() ?? target?.getAttribute('aria-label') ?? '';
      if (/^(Send|Save)$|Set as default template/i.test(label)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.alert(`Blocked by PAC2-5776 guided test: ${label}`);
      }
    }, true);
  });

  const patient = await requireUnique(
    page.getByText('katie sparrow', { exact: true }),
    'patient named katie sparrow',
  );
  await expect(patient).toBeVisible();

  const patientRow = await requireUnique(
    page.getByRole('row').filter({ has: patient }),
    'row for patient katie sparrow',
  );
  await (await requireUnique(
    patientRow.getByRole('button', { name: 'Patient actions', exact: true }),
    'Patient actions button for katie sparrow',
  )).click();
  await (await requireUnique(
    page.getByRole('menuitem', { name: 'Quick Send', exact: true }),
    'Quick Send menu item',
  )).click();

  await (await requireUnique(
    page.getByRole('button', { name: 'Booking Link', exact: true }),
    'Booking Link button',
  )).click();
  await (await requireUnique(
    page.getByRole('checkbox', { name: 'Virtual Mental Health', exact: true }),
    'Virtual Mental Health checkbox',
  )).check();

  const schedulerPopup = page.getByText('Scheduler Link Required', { exact: true });
  const afterBookingLink = await observeUniquePopup(schedulerPopup);
  await page.screenshot({
    path: 'test-results/PAC2-5776-TC-004-after-booking-link.png',
    fullPage: true,
  });
  if (afterBookingLink) {
    await (await requireUnique(
      page.getByRole('button', { name: 'Add at End', exact: true }),
      'Add at End button for Booking Link',
    )).click();
  }

  await expect(await requireUnique(
    page
      .getByText('{{{scheduler_link}}}', { exact: true })
      .or(page.getByRole('link', { name: 'Virtual Mental Health', exact: true }))
      .or(page.getByRole('button', { name: 'Virtual Mental Health', exact: true })),
    'Booking Link evidence in the Quick Send draft',
  )).toBeVisible();

  await (await requireUnique(
    page.getByRole('button', { name: 'Health Forms', exact: true }),
    'Health Forms button',
  )).click();
  await (await requireUnique(
    page.getByRole('checkbox', { name: 'sleep ap', exact: true }),
    'sleep ap checkbox',
  )).check();
  await (await requireUnique(
    page.getByRole('button', { name: 'Add at End', exact: true }),
    'Add at End button for Health Form',
  )).click();

  const afterHealthForm = await observeUniquePopup(schedulerPopup);
  await page.screenshot({
    path: 'test-results/PAC2-5776-TC-004-after-health-form.png',
    fullPage: true,
  });

  console.log(classifySchedulerPopupStages({ afterBookingLink, afterHealthForm }));
});
