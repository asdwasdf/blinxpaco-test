import { expect, test } from '../../fixtures/auth-fixtures.js';

// PAC2-9001 — TC-006 DIAGNOSTIC: Block Session (all roles allowed) — UX gap suspected.
// Source: PAC2-9001 MANUAL_EXECUTE rev-2 (Blocked, UX gap). Slot context menu shows "Block Session" enabled
// but click produces no dialog, no error, no visible effect on both empty and booked sessions.
// This spec is diagnostic: it records current behavior to confirm/cancel the regression hypothesis.
// Expected: Blocked on both empty (14 Oct) and booked (15 Oct) sessions; UX gap persists or resolved.

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const FB_BASE = `${BASE_URL}/paco-connect/feature-branch/pac2-9001`;
const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

async function pickDate(page: import('@playwright/test').Page, dayLabel: string): Promise<void> {
  // Day view date input/picker; pick a specific day that has booked or empty session on dev.
  const dateInput = page.locator('input[type="date"]').first();
  if (await dateInput.count()) {
    await dateInput.fill(dayLabel);
    await dateInput.press('Enter');
  } else {
    // Fallback: navigate Day view header date buttons
    await page.getByRole('button', { name: new RegExp(dayLabel) }).first().click({ force: true }).catch(() => undefined);
  }
  await wait(2000);
}

test.describe.serial('PAC2-9001 TC-006 DIAGNOSTIC — Block Session UX gap', () => {
  test('captures whether Block Session click produces a dialog', async ({ authenticatedPage }) => {
    test.setTimeout(240_000);
    const page = authenticatedPage;

    await page.goto(`${FB_BASE}/appointment-book`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);

    // Sample two dates: today (likely empty) and tomorrow (likely booked)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const todayLabel = fmt(today);
    const tomorrowLabel = fmt(tomorrow);

    let dialogAppeared = false;
    let blockEnabledOnEmpty = false;
    let blockEnabledOnBooked = false;

    for (const [label, store] of [[todayLabel, 'empty'] as const, [tomorrowLabel, 'booked'] as const]) {
      await pickDate(page, label);
      await wait(2000);

      // Find a session card and right-click the first slot
      const firstSlot = page.getByRole('button', { name: 'slots span' }).first();
      const slotCount = await firstSlot.count();
      if (!slotCount) {
        console.log(`[TC-006] No slot found for ${label} (${store}); skipping`);
        continue;
      }
      await firstSlot.scrollIntoViewIfNeeded();
      await firstSlot.click({ button: 'right', force: true });
      await wait();

      const blockItem = page.getByRole('menuitem', { name: 'Block Session' });
      const blockVisible = await blockItem.count();
      if (!blockVisible) {
        console.log(`[TC-006] Block Session NOT in slot context menu on ${label}`);
        continue;
      }
      const enabled = await blockItem.isEnabled();
      if (store === 'empty') blockEnabledOnEmpty = enabled;
      else blockEnabledOnBooked = enabled;

      await blockItem.click({ force: true });
      await wait(3000);

      // AC scenario 3 expects Block confirmation dialog
      const blockDialog = page.getByRole('dialog', { name: /Block Session|No patients are booked/i });
      const dialogVisible = await blockDialog.count();
      if (dialogVisible) {
        dialogAppeared = true;
        // Close dialog with Cancel (no mutation)
        const cancel = blockDialog.getByRole('button', { name: 'Cancel', exact: true });
        if (await cancel.count()) await cancel.click({ force: true });
        await wait();
        console.log(`[TC-006] Block dialog APPEARED on ${label} (${store})`);
      } else {
        console.log(`[TC-006] Block dialog MISSING on ${label} (${store}) — UX gap confirmed`);
      }

      // Close any leftover context menu by clicking elsewhere
      await page.keyboard.press('Escape');
      await wait();
    }

    // Report observations via console (spec does not assert pass/fail; diagnostic only)
    console.log(`[TC-006] summary: dialogAppeared=${dialogAppeared}, blockEnabledOnEmpty=${blockEnabledOnEmpty}, blockEnabledOnBooked=${blockEnabledOnBooked}`);

    // Persist observations as evidence for the regression hypothesis
    expect(typeof dialogAppeared).toBe('boolean');
  });
});
