/**
 * PAC2-4837 — TC-001: Verify Resync Action for Stuck Forms (regression guard).
 *
 * Source: docs/tickets/PAC2-4837-blank-patient-record-status-causing-failure-to-resync-hf/test-results-manual.md (2026-10-15)
 * Manual result: **Fail** (3+ attempts). No Resync action exposed in form detail UI.
 * This spec encodes the ticket's expected requirement: when opening a form with
 * "not synced" badge, the More Actions menu must contain a Resync / Re-sync action.
 * If the product defect is unresolved, the spec fails on the product assertion,
 * proving the bug. If the fix lands, the spec passes.
 *
 * Mutation: none (read-only navigation + menu inspection).
 */
import { expect, test } from '../../fixtures/page-fixtures.js';

const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const MODAL_SETTLE_MS = Number(process.env.PACO_MODAL_SETTLE_MS ?? 3000);
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

test.describe.serial('PAC2-4837 — TC-001: Resync action for stuck forms (regression guard)', () => {
  test.setTimeout(180_000);

  test('Classic Inbox: opening a "not synced" form exposes Resync in More Actions', async ({
    authenticatedPage,
    healthForms,
  }) => {
    const page = authenticatedPage;

    // ── Open Classic Inbox ────────────────────────────────────────────────
    await healthForms.goto(healthForms.classicInboxUrl);
    expect(new URL(page.url()).hostname).toBe('blinx.dev.blinxpaco-np.com');

    // ── Filter to "Not Synced to PR" ──────────────────────────────────────
    const filter = healthForms.notSyncedFilterButton();
    await expect(filter).toBeVisible({ timeout: 15_000 });
    await filter.click();
    await wait(MODAL_SETTLE_MS);

    // ── Open first form via "Review Form" cell ────────────────────────────
    const reviewCell = healthForms.reviewFormCell();
    await expect(reviewCell).toBeVisible({ timeout: 15_000 });
    await reviewCell.click();
    await wait(MODAL_SETTLE_MS);

    // ── Form detail dialog (MUI) must be open ─────────────────────────────
    const dialog = healthForms.formDetailDialog;
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await wait(MODAL_SETTLE_MS);

    // ── Click "More Actions" toggle to open action menu ───────────────────
    const moreBtn = healthForms.moreActionsButton();
    await expect(moreBtn).toBeVisible({ timeout: 5_000 });
    await moreBtn.click();
    await wait(MODAL_SETTLE_MS);

    // ── Assert Resync / Re-sync menu item exists ──────────────────────────
    // The ticket requires the fix to expose a Resync or "Re-sync to Patient
    // Record" item inside the More Actions menu. If absent, the spec fails on
    // the product assertion, proving the bug from manual 2026-10-15.
    const resyncItem = healthForms.resyncMenuItem();
    await expect(resyncItem).toBeVisible({ timeout: 5_000 });
  });
});
