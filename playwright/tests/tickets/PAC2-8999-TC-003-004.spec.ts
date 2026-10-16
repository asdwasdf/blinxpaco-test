/**
 * PAC2-8999 — TC-003, TC-004 (FAIL-encoded diagnostic):
 * Cancel menuitem in Calendar Day view Appointment Details sidebar is a no-op
 * on dev build `pac2-8999`. Repro: 3 attempts (regular click, dispatchEvent
 * MouseEvent, getByRole), 4 indicators (dialog / network / sidebar state /
 * calendar slot) all no-op. No audit row written.
 *
 * Source: docs/tickets/PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/manual-test.md
 * Step 5-8 (2026-10-15 14:49).
 *
 * This spec is FAIL-encoded: it asserts the product bug is REPRODUCED (no API
 * call, no audit row). It will fail if dev fixes the handler — which is the
 * intended pass condition once the defect is resolved.
 *
 * Test data: spec self-contains — it books a fresh `Floy adhoc` slot via Quick
 * Book before exercising cancel (orphan cleanup not in agent scope, 2026-10-15
 * tester decision). Each run creates 1 new orphan at the booked slot time.
 * Pre-existing test patient `Floy adhoc` NHS 76835143 + session
 * `PAC2-7786 Temi PCN` 15/10/2026 are pre-existing on dev and not created by
 * this spec.
 */
import { expect, test } from '../../fixtures/page-fixtures.js';

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const FB_CONNECT = `${BASE_URL}/paco-connect/feature-branch/pac2-8999`;
const FB_PACO = `${BASE_URL}/paco/feature-branch/pac2-8999`;
const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const MODAL_SETTLE_MS = Number(process.env.PACO_MODAL_SETTLE_MS ?? 3000);
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

/** Find any free slot in the named session for the given day. */
async function pickFreeSlot(
  page: import('@playwright/test').Page,
  sessionName: string,
  dayIso: string,
): Promise<import('@playwright/test').Locator | null> {
  const dateInput = page.locator('input[type="date"]').first();
  if (await dateInput.count()) {
    await dateInput.fill(dayIso);
    await dateInput.press('Enter');
    await wait(MODAL_SETTLE_MS);
  } else {
    await page.getByRole('button', { name: new RegExp(dayIso) }).first().click({ force: true }).catch(() => undefined);
    await wait(MODAL_SETTLE_MS);
  }
  const session = page.getByRole('region', { name: new RegExp(sessionName) });
  const slots = session.getByRole('button', { name: 'slots span' });
  const count = await slots.count();
  for (let i = 0; i < count; i++) {
    const s = slots.nth(i);
    const txt = (await s.textContent() ?? '').trim();
    if (!/adhoc|Floy|Joh|Doe|Bravo/i.test(txt)) return s;
  }
  return null;
}

/** Locate the first Floy adhoc booked slot (prefers freshest: re-renders by index order). */
async function findBookedSlot(
  page: import('@playwright/test').Page,
  sessionName: string,
  dayIso: string,
): Promise<import('@playwright/test').Locator | null> {
  const dateInput = page.locator('input[type="date"]').first();
  if (await dateInput.count()) {
    await dateInput.fill(dayIso);
    await dateInput.press('Enter');
    await wait(MODAL_SETTLE_MS);
  } else {
    await page.getByRole('button', { name: new RegExp(dayIso) }).first().click({ force: true }).catch(() => undefined);
    await wait(MODAL_SETTLE_MS);
  }
  const session = page.getByRole('region', { name: new RegExp(sessionName) });
  const slots = session.getByRole('button', { name: 'slots span' });
  const count = await slots.count();
  for (let i = 0; i < count; i++) {
    const s = slots.nth(i);
    const txt = (await s.textContent() ?? '').trim();
    if (/adhoc|Floy/i.test(txt)) return s;
  }
  return null;
}

/** Self-contained precondition: book a fresh Floy adhoc slot so TC-003/004 have a target. */
async function ensureFloyBooked(
  page: import('@playwright/test').Page,
  appointmentBook: import('../../pages/AppointmentBookPage.js').AppointmentBookPage,
  sessionName: string,
  dayIso: string,
): Promise<{ ok: true; slot: import('@playwright/test').Locator } | { ok: false; reason: string }> {
  await page.goto(`${FB_CONNECT}/appointment-book`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);

  // Try to find an existing Floy slot first (cheaper than re-booking).
  const existing = await findBookedSlot(page, sessionName, dayIso);
  if (existing) return { ok: true, slot: existing };

  // Otherwise book a new slot.
  const free = await pickFreeSlot(page, sessionName, dayIso);
  if (!free) return { ok: false, reason: 'no free slot available in session' };
  await free.click({ force: true });
  await expect(appointmentBook.quickBookDialog).toBeVisible({ timeout: 15_000 });
  await wait(MODAL_SETTLE_MS);
  await appointmentBook.quickBookPatientSearch.fill('Floy');
  await wait(MODAL_SETTLE_MS);
  const row = appointmentBook.quickBookPatientRow('76835143');
  await expect(row.first()).toBeVisible({ timeout: 10_000 });
  await row.first().click();
  await wait();
  await appointmentBook.quickBookConfirmButton.click();
  await wait(MODAL_SETTLE_MS);
  await appointmentBook.quickBookConfirmButton.click();
  await wait(MODAL_SETTLE_MS);
  await expect(appointmentBook.quickBookDialog).toBeHidden({ timeout: 15_000 }).catch(() => undefined);
  await wait(MODAL_SETTLE_MS);

  // Re-locate after refresh.
  const booked = await findBookedSlot(page, sessionName, dayIso);
  if (!booked) return { ok: false, reason: 'book succeeded but slot not visible after refresh' };
  return { ok: true, slot: booked };
}

test.describe.serial('PAC2-8999 — TC-003/004 DIAGNOSTIC: Cancel menuitem is no-op (defect reproduction)', () => {
  test.setTimeout(300_000);

  test('clicking Cancel in Mark-as menu produces no dialog, no API call, no audit row', async ({
    authenticatedPage,
    appointmentBook,
  }) => {
    const page = authenticatedPage;
    const sessionName = 'PAC2-7786 Temi PCN';
    const dayIso = '2026-10-15';

    // ── Self-contained precondition: ensure Floy adhoc has a booked slot ──
    const pre = await ensureFloyBooked(page, appointmentBook, sessionName, dayIso);
    if (!pre.ok) {
      test.skip(true, `Skipped: precondition failed — ${pre.reason}. Re-run after dev seeds a free slot.`);
      return;
    }

    // ── Open Appointment Details sidebar ─────────────────────────────────
    await pre.slot.click({ force: true });
    await expect(appointmentBook.appointmentSidebar).toBeVisible({ timeout: 15_000 });
    await wait(MODAL_SETTLE_MS);

    // ── Open Mark as: menu ───────────────────────────────────────────────
    await appointmentBook.markAsButton.click();
    await wait();
    await expect(appointmentBook.cancelMenuItem.first()).toBeVisible({ timeout: 5_000 });

    // ── Capture network baseline ─────────────────────────────────────────
    const cancelRequests: { url: string; method: string; postData: string | null }[] = [];
    const onRequest = (req: import('@playwright/test').Request) => {
      const url = req.url();
      if (/\/api\/appointments\/.+\/(cancel|status|patch|update)/i.test(url)) {
        cancelRequests.push({ url, method: req.method(), postData: req.postData() });
      }
    };
    page.on('request', onRequest);

    // ── Attempt 1: regular click ─────────────────────────────────────────
    await appointmentBook.cancelMenuItem.first().click({ force: true });
    await wait(3000);

    // ── Attempt 2: getByRole('menuitem') by accessible name ──────────────
    const cancelAgain = page.getByRole('menuitem', { name: /Cancel Appointment|^Cancel$/ });
    if (await cancelAgain.count()) {
      await cancelAgain.first().click({ force: true });
      await wait(3000);
    }

    // ── Attempt 3: synthetic dispatchEvent on stable DOM id slot ─────────
    const result = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[role="menuitem"]'))
        .filter((el) => /Cancel/i.test((el.textContent ?? '').trim())) as HTMLElement[];
      if (!items.length) return { found: false };
      const target = items[0];
      const rect = target.getBoundingClientRect();
      ['mousedown', 'mouseup', 'click'].forEach((type) => {
        target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: rect.x + 5, clientY: rect.y + 5 }));
      });
      return { found: true, id: target.id, text: (target.textContent ?? '').trim() };
    });
    console.log(`[TC-003] attempt 3 dispatchEvent → found=${result.found} id=${result.id ?? ''} text=${result.text ?? ''}`);
    await wait(3000);

    page.off('request', onRequest);

    // ── TC-004: no confirmation dialog appeared ──────────────────────────
    const dialogsAfter = await page.getByRole('dialog', { name: /Cancel|Confirm|Reason/i }).count();
    expect(dialogsAfter).toBe(0);

    // ── Indicator: no API mutation request for cancel ─────────────────────
    expect(cancelRequests.length).toBe(0);

    // ── Indicator: sidebar `Mark as:` still shows "Select Patient Status" ─
    const sidebarStillOpen = await appointmentBook.appointmentSidebar.isVisible().catch(() => false);
    expect(sidebarStillOpen).toBe(true);
    const markAsSelect = appointmentBook.appointmentSidebar.getByText(/Select Patient Status|patient-status-button/i);
    await expect(markAsSelect.first()).toBeVisible();

    // ── TC-003: audit row for cancellation is absent ─────────────────────
    await page.goto(`${FB_PACO}/patient-search`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const patientSearchInput = page.getByPlaceholder(/search patient by name|nhs/i);
    await expect(patientSearchInput).toBeVisible({ timeout: 15_000 });
    await patientSearchInput.fill('adhoc');
    await wait(MODAL_SETTLE_MS);
    const adhocRow = page
      .locator('div')
      .filter({ hasText: /76835143|Floy adhoc/ })
      .filter({ has: page.getByRole('button', { name: /Patient actions menu/i }) })
      .last();
    await expect(adhocRow).toBeVisible({ timeout: 10_000 });
    await adhocRow.getByRole('button', { name: /Patient actions menu/i }).click();
    await wait();
    await page.getByRole('menuitem', { name: 'View Audit', exact: true }).click();
    await expect(appointmentBook.auditDialog).toBeVisible({ timeout: 15_000 });
    await wait(MODAL_SETTLE_MS);

    await appointmentBook.auditSearch.fill('cancel');
    await wait(MODAL_SETTLE_MS);
    const cancelRows = appointmentBook.auditDialog
      .locator('[col-id="summary"], .ag-cell[col-id="summary"]')
      .filter({ hasText: /cancel/i });
    expect(await cancelRows.count()).toBe(0);
  });
});