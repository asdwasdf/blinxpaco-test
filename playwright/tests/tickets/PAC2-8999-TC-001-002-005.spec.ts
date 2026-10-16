/**
 * PAC2-8999 — TC-001, TC-002, TC-005 (PASS regression guard):
 * Booking a slot via Quick Book in PACO Connect writes a patient-profile audit
 * entry in PACO; actor matches authenticated user; timestamp near action time.
 *
 * Source: docs/tickets/PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/manual-test.md
 * Step 1-3 (2026-10-15 14:49), dev build `pac2-8999`.
 * Test data: pre-existing on dev — patient `Floy adhoc` NHS 76835143, session `PAC2-7786 Temi PCN` (15/10/2026).
 * Mutation: booking is allowed; orphan left behind if downstream cancel fails (TC-003/004).
 */
import { expect, test } from '../../fixtures/page-fixtures.js';

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const FB_CONNECT = `${BASE_URL}/paco-connect/feature-branch/pac2-8999`;
const FB_PACO = `${BASE_URL}/paco/feature-branch/pac2-8999`;
const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const MODAL_SETTLE_MS = Number(process.env.PACO_MODAL_SETTLE_MS ?? 3000);
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

/** Find a free slot in the named session for the given day. */
async function pickFreeSlot(
  page: import('@playwright/test').Page,
  sessionName: string,
  dayIso: string,
): Promise<import('@playwright/test').Locator | null> {
  // Day view header date input; format YYYY-MM-DD
  const dateInput = page.locator('input[type="date"]').first();
  if (await dateInput.count()) {
    await dateInput.fill(dayIso);
    await dateInput.press('Enter');
    await wait(MODAL_SETTLE_MS);
  } else {
    // Fallback: header date buttons (Day view)
    await page.getByRole('button', { name: new RegExp(dayIso) }).first().click({ force: true }).catch(() => undefined);
    await wait(MODAL_SETTLE_MS);
  }
  const session = page.getByRole('region', { name: new RegExp(sessionName) });
  const slots = session.getByRole('button', { name: 'slots span' });
  const count = await slots.count();
  for (let i = 0; i < count; i++) {
    const s = slots.nth(i);
    const txt = (await s.textContent() ?? '').trim();
    // Free slots render the slot type label; booked slots render patient name.
    if (!/adhoc|Floy|Joh|Doe|Bravo/i.test(txt)) return s;
  }
  return null;
}

test.describe.serial('PAC2-8999 — TC-001/002/005: Booking writes patient-profile audit (regression guard)', () => {
  test.setTimeout(300_000);

  test('book slot via Quick Book writes 2 audit rows with matching actor and timestamp', async ({
    authenticatedPage,
    appointmentBook,
  }) => {
    const page = authenticatedPage;

    // ── Open Appointment Book (PACO Connect feature branch) ──────────────
    await page.goto(`${FB_CONNECT}/appointment-book`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);

    const sessionName = 'PAC2-7786 Temi PCN';
    const dayIso = '2026-10-15';

    // ── Click a free slot to open Quick Book dialog ──────────────────────
    const slot = await pickFreeSlot(page, sessionName, dayIso);
    test.skip(!slot, `Skipped: no free slot found on ${dayIso} session ${sessionName} (test data drifted).`);
    await slot!.click({ force: true });
    await expect(appointmentBook.quickBookDialog).toBeVisible({ timeout: 15_000 });
    await wait(MODAL_SETTLE_MS);

    // ── Pick patient (pre-existing on dev) ───────────────────────────────
    await appointmentBook.quickBookPatientSearch.fill('Floy');
    await wait(MODAL_SETTLE_MS);
    const row = appointmentBook.quickBookPatientRow('76835143');
    await expect(row.first()).toBeVisible({ timeout: 10_000 });
    await row.first().click();
    await wait();

    // ── Confirm booking (Recommended Appointment dialog) ────────────────
    await appointmentBook.quickBookConfirmButton.click();
    await wait(MODAL_SETTLE_MS);
    await appointmentBook.quickBookConfirmButton.click();
    await wait(MODAL_SETTLE_MS);
    // Quick Book dialog should close after success
    await expect(appointmentBook.quickBookDialog).toBeHidden({ timeout: 15_000 }).catch(() => undefined);
    await wait(MODAL_SETTLE_MS);

    // ── Capture audit timestamp window ──────────────────────────────────
    const bookingWindowStart = Date.now();

    // ── Switch to PACO Patient Search → View Audit ───────────────────────
    await page.goto(`${FB_PACO}/patient-search`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const patientSearchInput = page.getByPlaceholder(/search patient by name|nhs/i);
    await expect(patientSearchInput).toBeVisible({ timeout: 15_000 });
    await patientSearchInput.fill('adhoc');
    await wait(MODAL_SETTLE_MS);

    // Row action menu → View Audit
    const adhocRow = page
      .locator('div')
      .filter({ hasText: /76835143|Floy adhoc/ })
      .filter({ has: page.getByRole('button', { name: /Patient actions menu/i }) })
      .last();
    await expect(adhocRow).toBeVisible({ timeout: 10_000 });
    const adhocMenu = adhocRow.getByRole('button', { name: /Patient actions menu/i });
    await adhocMenu.click();
    await wait();
    await page.getByRole('menuitem', { name: 'View Audit', exact: true }).click();
    await expect(appointmentBook.auditDialog).toBeVisible({ timeout: 15_000 });
    await wait(MODAL_SETTLE_MS);

    // ── TC-001/002: Two new booking rows appear ─────────────────────────
    await appointmentBook.auditSearch.fill('Booked appointment');
    await wait(MODAL_SETTLE_MS);

    const summaryCells = appointmentBook.auditDialog
      .locator('[col-id="summary"], .ag-cell[col-id="summary"]')
      .filter({ hasText: /Booked appointment/i });
    const rowCount = await summaryCells.count();
    expect(rowCount).toBeGreaterThanOrEqual(2);

    // ── TC-002: Actor column matches authenticated user (Johnny Bravo) ──
    const actorCells = appointmentBook.auditDialog
      .locator('[col-id="user"], .ag-cell[col-id="user"]')
      .filter({ hasText: /Bravo|Joh/i });
    expect(await actorCells.count()).toBeGreaterThanOrEqual(2);

    // ── TC-005: Timestamp near action time (within 5 min) ────────────────
    const timeCells = appointmentBook.auditDialog
      .locator('[col-id="date"], .ag-cell[col-id="date"]')
      .filter({ visible: true });
    const firstTimeText = (await timeCells.first().textContent() ?? '').trim();
    const parsed = Date.parse(firstTimeText);
    expect(Number.isFinite(parsed)).toBe(true);
    const delta = Math.abs(parsed - bookingWindowStart);
    expect(delta).toBeLessThan(5 * 60 * 1000);
  });
});