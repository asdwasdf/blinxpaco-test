import type { Locator } from '@playwright/test';
import { evaluateMutationGate } from '../../../scripts/mutation-gate.js';
import { expect, test } from '../../fixtures/auth-fixtures.js';
import {
  classifySchedulerPopupStages,
  PAC2_5776_TC_004_SCOPE,
  parseGuidedApproval,
} from '../../support/paco-5776-guided.js';

async function requireUnique(locator: Locator, label: string): Promise<Locator> {
  try {
    await expect(locator).toHaveCount(1);
  } catch {
    const count = await locator.count();
    throw new Error(`Blocked: expected one ${label}, found ${count}`);
  }
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

  const patientSearch = await requireUnique(
    page.getByPlaceholder('Search patients by name or NHS number', { exact: true }),
    'patient search input',
  );
  await patientSearch.fill('katie sparrow');

  const approvedNhs = await requireUnique(
    page.getByText('NHS No: 222 222 9537', { exact: true }),
    'approved NHS number 222 222 9537',
  );
  const patientRow = await requireUnique(
    approvedNhs.locator('xpath=ancestor::div[contains(@class, "_patient-row_")][1]'),
    'patient row for approved NHS number 222 222 9537',
  );
  await expect(await requireUnique(
    patientRow.getByText('Katie Sparrow', { exact: true }),
    'patient named Katie Sparrow in approved patient row',
  )).toBeVisible();

  await (await requireUnique(
    patientRow.getByRole('button', { name: 'Patient actions menu', exact: true }),
    'Patient actions menu button for approved patient',
  )).click();
  await (await requireUnique(
    page.getByRole('menuitem', { name: 'Quick Send', exact: true }),
    'Quick Send menu item',
  )).click();

  const dialog = await requireUnique(page.getByRole('dialog'), 'Quick Send dialog');
  await page.waitForTimeout(7_000);
  const selectedTemplate = dialog
    .getByText('General Patient Message', { exact: true })
    .filter({ visible: true });
  if (await selectedTemplate.count() === 0) {
    const changeTemplate = dialog.getByText('(click to change)', { exact: true });
    const chooseTemplate = dialog.getByText('Choose template', { exact: true });
    await (await requireUnique(
      await changeTemplate.count() === 1 ? changeTemplate : chooseTemplate,
      'template picker control',
    )).click();
    await (await requireUnique(
      page.getByText('General Patient Message', { exact: true }).filter({ visible: true }),
      'visible General Patient Message template',
    )).click();
  }
  await expect(await requireUnique(
    dialog.getByText('General Patient Message', { exact: true }).filter({ visible: true }),
    'visible selected General Patient Message template',
  )).toBeVisible({ timeout: 7_000 });

  const bookingLinkTab = await requireUnique(
    page.getByRole('button', { name: 'tab-Booking Link', exact: true }),
    'Booking Link button',
  );
  if ((await bookingLinkTab.getAttribute('class'))?.includes('__disabled_')) {
    throw new Error(
      'Blocked: Booking Link is disabled because no campaign/template is selected; approved scope does not identify one',
    );
  }
  await bookingLinkTab.click();
  const bookingComboboxes = page.getByRole('dialog').getByRole('combobox');
  await expect(bookingComboboxes).toHaveCount(6);
  let selectedApprovedSlot = false;
  for (const index of [0, 1, 2, 3]) {
    const trigger = bookingComboboxes
      .nth(index)
      .locator('xpath=ancestor::div[@data-pc-name="multiselect"][1]')
      .locator('[data-pc-section="trigger"]');
    await expect(trigger).toHaveCount(1);
    await trigger.click({ timeout: 7_000 });

    const picker = page.locator('.p-multiselect-panel:visible');
    await expect(picker).toBeVisible({ timeout: 7_000 });
    const approvedSlot = picker.getByRole('option', {
      name: 'Adult Phlebotomy paco-connect',
      exact: true,
    });
    const approvedSlotCount = await approvedSlot.count();
    if (approvedSlotCount > 1) {
      throw new Error(`Blocked: expected at most one Adult Phlebotomy paco-connect booking slot, found ${approvedSlotCount}`);
    }
    if (approvedSlotCount === 1) {
      await approvedSlot.click();
      selectedApprovedSlot = true;
    }
    if (await picker.isVisible()) await trigger.click({ timeout: 7_000 });
    await expect(picker).toBeHidden({ timeout: 7_000 });
    if (selectedApprovedSlot) break;
  }
  if (!selectedApprovedSlot) {
    throw new Error('Blocked: approved booking slot Adult Phlebotomy paco-connect is unavailable');
  }

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

  await expect(dialog).toContainText('{{{scheduler_link}}}');

  await (await requireUnique(
    page.getByRole('button', { name: 'tab-Health Forms', exact: true }),
    'Health Forms button',
  )).click();
  await (await requireUnique(
    page.getByText('Add Health Form(s)', { exact: true }),
    'Add Health Form(s) control',
  )).click();
  const healthFormDropdown = await requireUnique(
    page.getByRole('dialog').locator('.p-dropdown').filter({ hasText: 'Select Health Form' }),
    'Select Health Form dropdown',
  );
  await healthFormDropdown.click({ timeout: 7_000 });
  const healthFormSearch = await requireUnique(
    page.getByRole('textbox', { name: 'Search...', exact: true }),
    'Health Form search input',
  );
  await healthFormSearch.fill('sleep ap');
  const sleepAp = await requireUnique(
    page.getByText('Sleep Ap', { exact: true }),
    'Sleep Ap Health Form',
  );
  await expect(sleepAp).toBeVisible({ timeout: 7_000 });
  await sleepAp.click();
  await expect(dialog.getByText('Added Health Forms:', { exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Sleep Ap', exact: true })).toBeVisible();

  const afterHealthForm = await observeUniquePopup(schedulerPopup);
  await page.screenshot({
    path: 'test-results/PAC2-5776-TC-004-after-health-form.png',
    fullPage: true,
  });

  console.log(classifySchedulerPopupStages({ afterBookingLink, afterHealthForm }));
});
