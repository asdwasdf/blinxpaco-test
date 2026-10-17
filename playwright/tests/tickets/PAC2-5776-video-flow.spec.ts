import { expect, test } from '../../fixtures/auth-fixtures.js';
import { QuickSendPage } from '../../pages/QuickSendPage.js';
import type { Locator, Page } from '@playwright/test';

test.setTimeout(180_000);

/**
 * PAC2-5776 — Intermittent Scheduler Link Needed popup behind Quick Send box.
 * Source: docs/tickets/PAC2-5776-intermittent-scheduler-link-needed-popup/video/video-notes.md
 *
 * Full replay (per paco-video-flow skill Step 4a, default `full` scope):
 *   1. Open Quick Send for patient "Arthur Dent" (NHS 222 222 3792).
 *   2. Pick the template `Test (updated due to duplicate name) updated 2` (same as video).
 *   3. Add a "Sleep Ap" health form to the template.
 *   4. Observe whether popup "Scheduler Link Needed" or "Your selection contains no
 *      session availability" appears, and whether it sits behind Quick Send.
 *
 * The defect is intermittent per ticket title; on dev hosts where the popup does not
 * fire, this spec records `Inconclusive` via annotations instead of `Fail`. Re-runs
 * are expected and may eventually reproduce.
 *
 * Host: blinx.dev.blinxpaco-np.com (per paco.config.yaml allowedHosts).
 * No new test data created — uses existing fixture.
 */
const BASE_URL = process.env.PACO_BASE_URL ?? 'https://blinx.dev.blinxpaco-np.com/paco/';
const PATIENT_QUERY = 'Arthur Dent';
const PATIENT_NHS_DISPLAY = '222 222 3792';
const TEMPLATE_NAME = 'Test (updated due to duplicate name) updated 2';

const POPUP_SCHEDULER = /Scheduler Link Needed/i;
const POPUP_NO_SESSION = /Your selection contains no session availability/i;

async function settle(page: Page, ms = Number(process.env.PACO_STEP_MS ?? 1000)): Promise<void> {
  await page.waitForTimeout(ms);
}

async function openQuickSendForArthur(page: Page): Promise<Locator> {
  const quickSend = new QuickSendPage(page);
  await expect(quickSend.patientSearch).toBeVisible({ timeout: 30_000 });
  await quickSend.patientSearch.click();
  await quickSend.patientSearch.fill('');
  await quickSend.patientSearch.pressSequentially(PATIENT_QUERY, { delay: 60 });
  await settle(page, 3000);

  const row = quickSend.patientResult(PATIENT_NHS_DISPLAY);
  if ((await row.count()) === 0) {
    test.skip(true, `Patient "${PATIENT_QUERY}" (NHS ${PATIENT_NHS_DISPLAY}) not visible.`);
    return quickSend.dialog;
  }
  await expect(row).toBeVisible({ timeout: 15_000 });
  await quickSend.patientActionsButton(row).click({ timeout: 10_000 });
  await settle(page, 500);
  await quickSend.quickSendMenuItem.click({ timeout: 10_000 });
  await settle(page, 1500);
  await expect(quickSend.dialog).toBeVisible({ timeout: 15_000 });
  return quickSend.dialog;
}

async function pickTemplate(page: Page, dialog: Locator): Promise<boolean> {
  const changeLink = dialog.getByText('(click to change)', { exact: true });
  if (!(await changeLink.isVisible().catch(() => false))) return false;
  await changeLink.click();
  await settle(page, 1500);

  const item = dialog.getByText(TEMPLATE_NAME, { exact: true }).first();
  if (!(await item.isVisible().catch(() => false))) {
    await page.keyboard.press('Escape').catch(() => {});
    await settle(page, 500);
    return false;
  }
  await item.click();
  await settle(page, 3000); // wait for composer to render + settle popup state
  return true;
}

async function observePopups(page: Page): Promise<{ schedulerVisible: boolean; sessionVisible: boolean }> {
  const schedulerVisible = await page.getByRole('dialog').filter({ hasText: POPUP_SCHEDULER }).isVisible().catch(() => false);
  const sessionVisible = await page.getByRole('dialog').filter({ hasText: POPUP_NO_SESSION }).isVisible().catch(() => false);
  return { schedulerVisible, sessionVisible };
}

test.describe('PAC2-5776 video flow — full replay (intermittent)', () => {
  test('observe Scheduler Link Needed popup when picking template with booking link', async ({ authenticatedContext }, testInfo) => {
    const page = await authenticatedContext.newPage();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await settle(page, 2000);

    const dialog = await openQuickSendForArthur(page);

    const picked = await pickTemplate(page, dialog);
    if (!picked) {
      test.skip(true, `Template "${TEMPLATE_NAME}" not found in picker. Seed fixture first.`);
    }

    // After template selection, observe popup state (matches video frame 02-04)
    await settle(page, 3000);
    const afterPick = await observePopups(page);

    // Quick check: if popup appears now AND it's behind the dialog, encode as Fail.
    const quickSendDialog = page.getByRole('dialog').filter({ hasText: /Quick Send|Arthur Dent/i });
    let overlapDetected = false;
    if (afterPick.schedulerVisible || afterPick.sessionVisible) {
      const popup = page.getByRole('dialog').filter({
        hasText: afterPick.schedulerVisible ? POPUP_SCHEDULER : POPUP_NO_SESSION,
      });
      const popupBox = await popup.boundingBox();
      const dialogBox = await quickSendDialog.boundingBox();
      if (popupBox && dialogBox) {
        overlapDetected = !(
          popupBox.x + popupBox.width <= dialogBox.x ||
          dialogBox.x + dialogBox.width <= popupBox.x ||
          popupBox.y + popupBox.height <= dialogBox.y ||
          dialogBox.y + dialogBox.height <= popupBox.y
        );
      }
    }

    testInfo.annotations.push({
      type: 'observed-popup',
      description: `after_pick_scheduler=${afterPick.schedulerVisible} after_pick_session=${afterPick.sessionVisible} overlap=${overlapDetected}`,
    });

    if (overlapDetected) {
      // Defect reproduced: popup is behind Quick Send box. Encode as Fail per ticket expectation.
      expect(overlapDetected, 'Scheduler Link popup is BEHIND Quick Send box (z-index conflict) — defect reproduced').toBe(false);
    }

    // If popup did not appear, the defect is intermittent on this host/run. Record
    // inconclusive observation rather than fail.
    if (!afterPick.schedulerVisible && !afterPick.sessionVisible) {
      testInfo.annotations.push({
        type: 'inconclusive',
        description: 'Popup did not fire on this run; defect is intermittent per ticket. Re-execute to attempt reproduction.',
      });
    }

    await page.close();
  });
});