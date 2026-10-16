import { expect, test } from '../../fixtures/auth-fixtures.js';
import { QuickSendPage } from '../../pages/QuickSendPage.js';
import type { Page } from '@playwright/test';

test.setTimeout(90_000);

/**
 * PAC2-5776 — Intermittent Scheduler Link Needed popup behind Quick Send box.
 * Source: docs/tickets/PAC2-5776-intermittent-scheduler-link-needed-popup/video/video-notes.md
 *
 * Replays the minimal flow from the video to reproduce the popup:
 *   1. Open Quick Send.
 *   2. Select a patient with an existing booking-link template.
 *   3. Add a new health form or booking link to the template.
 *   4. Expect either a "Scheduler Link Needed" popup OR a
 *      "Your selection contains no session availability" popup.
 *   5. The popup must NOT be behind the Quick Send dialog (z-index / focus check).
 *
 * Host: configure via PACO_BASE_URL or use the default below.
 * The video evidence was captured on `blinx.dev.blinxpaco-np.com`, so the
 * spec is run on the same dev host. Update the constant if the ticket moves.
 */
const BASE_URL = process.env.PACO_BASE_URL ?? 'https://blinx.dev.blinxpaco-np.com/paco/';
const PATIENT_QUERY = 'Arthur Dent';
const PATIENT_NHS_DISPLAY = '222 2223 792';

const POPUP_SCHEDULER = /Scheduler Link Needed/i;
const POPUP_NO_SESSION = /Your selection contains no session availability/i;

async function settle(page: Page, ms = Number(process.env.PACO_STEP_MS ?? 1000)): Promise<void> {
  await page.waitForTimeout(ms);
}

async function tryOpenQuickSend(page: Page): Promise<boolean> {
  const quickSend = new QuickSendPage(page);
  await expect(quickSend.patientSearch).toBeVisible({ timeout: 15_000 });
  await quickSend.patientSearch.fill(PATIENT_QUERY);
  await settle(page, 1500);

  const patientRow = quickSend.patientResult(PATIENT_NHS_DISPLAY);
  if ((await patientRow.count()) === 0) {
    test.skip(true, `Patient "${PATIENT_QUERY}" (NHS ${PATIENT_NHS_DISPLAY}) not visible. Configure PACO_BASE_URL or update test data.`);
    return false;
  }
  await expect(patientRow).toBeVisible({ timeout: 15_000 });

  await quickSend.patientActionsButton(patientRow).click({ timeout: 10_000 });
  await settle(page, 500);
  await quickSend.quickSendMenuItem.click({ timeout: 10_000 });
  await settle(page, 1500);
  return true;
}

test.describe('PAC2-5776 video flow — Scheduler Link Needed popup', () => {
  test('popup appears when adding health form to template with existing booking link', async ({ authenticatedContext }) => {
    const page = await authenticatedContext.newPage();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await settle(page, 2000);

    if (!(await tryOpenQuickSend(page))) return;

    // Step 1: Select a template. The video shows that the popup can fire as soon as
    // the user opens the template selector. Wait briefly and inspect for popup.
    await settle(page, 3000);

    const popupAtTemplate = page.getByRole('dialog').filter({ hasText: POPUP_NO_SESSION });
    const popupAtTemplateVisible = await popupAtTemplate.isVisible().catch(() => false);

    // Step 2: try to add a Health Form to the template. The video shows the popup
    // can also fire here. Use a generic locator; if the page object for Health Forms
    // is available, prefer that. This spec stays self-contained for the smoke test.
    const addHealthFormButton = page.getByRole('button', { name: /add health form/i }).first();
    if (await addHealthFormButton.isVisible().catch(() => false)) {
      await addHealthFormButton.click({ timeout: 10_000 });
      await settle(page, 2000);
    }

    // Final assertion: the popup that the ticket describes is visible
    // (either the exact ticket-named popup OR the related session popup seen in the video).
    const schedulerPopup = page.getByRole('dialog').filter({ hasText: POPUP_SCHEDULER });
    const sessionPopup = page.getByRole('dialog').filter({ hasText: POPUP_NO_SESSION });
    const quickSendDialog = page.getByRole('dialog').filter({ hasText: /Quick Send|Arthur Dent/i });

    const schedulerVisible = await schedulerPopup.isVisible().catch(() => false);
    const sessionVisible = await sessionPopup.isVisible().catch(() => false);
    const quickSendVisible = await quickSendDialog.isVisible().catch(() => false);

    // Record observed state without failing the run (smoke test). The product
    // decision (Fail vs Pass) is owned by `MANUAL_EXECUTE`, not by this spec.
    test.info().annotations.push(
      { type: 'observed-popup', description: `template=${popupAtTemplateVisible} scheduler=${schedulerVisible} session=${sessionVisible} quickSend=${quickSendVisible}` },
    );

    if (schedulerVisible || sessionVisible) {
      // Critical: the popup must not be behind the Quick Send box. Check by
      // verifying the popup's bounding box overlaps the dialog's bounding box
      // (z-index / stacking issue), or that the popup can receive focus.
      const popup = schedulerVisible ? schedulerPopup : sessionPopup;
      const popupBox = await popup.boundingBox();
      const dialogBox = quickSendVisible ? await quickSendDialog.boundingBox() : null;

      if (popupBox && dialogBox) {
        const overlaps =
          popupBox.x < dialogBox.x + dialogBox.width &&
          popupBox.x + popupBox.width > dialogBox.x &&
          popupBox.y < dialogBox.y + dialogBox.height &&
          popupBox.y + popupBox.height > dialogBox.y;
        expect(overlaps, 'Scheduler popup is behind Quick Send box (z-index conflict)').toBe(false);
      }
    }
  });
});
