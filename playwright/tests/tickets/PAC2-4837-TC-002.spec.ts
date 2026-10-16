/**
 * PAC2-4837 — TC-002: Verify Patient Record Status field (New Inbox).
 *
 * Source: docs/tickets/PAC2-4837-blank-patient-record-status-causing-failure-to-resync-hf/test-results-manual.md (2026-10-15)
 * Manual result: **Pass (New Inbox)**. New Inbox grid has a "Save Status" column
 * that displays "Not Saved" for stuck forms. Classic Inbox form detail does not
 * show this field, so this spec targets the New Inbox only.
 *
 * Mutation: none (read-only navigation + grid inspection).
 */
import { expect, test } from '../../fixtures/page-fixtures.js';

const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const MODAL_SETTLE_MS = Number(process.env.PACO_MODAL_SETTLE_MS ?? 3000);
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

test.describe.serial('PAC2-4837 — TC-002: New Inbox shows Patient Record Status (regression guard)', () => {
  test.setTimeout(180_000);

  test('New Inbox grid exposes "Save Status" column with "Not Saved" value for stuck forms', async ({
    authenticatedPage,
    healthForms,
  }) => {
    const page = authenticatedPage;

    // ── Open New Health Form Inbox (beta) ─────────────────────────────────
    await healthForms.goto(healthForms.newInboxUrl);
    expect(new URL(page.url()).hostname).toBe('blinx.dev.blinxpaco-np.com');
    await wait(MODAL_SETTLE_MS);

    // ── "Save Status" column must be present in the grid header ───────────
    const header = healthForms.saveStatusColumnHeader();
    await expect(header).toBeVisible({ timeout: 15_000 });

    // ── Click the "Not Saved" bucket chip in the stats panel ──────────────
    // The New Inbox stats panel exposes a "Not Saved" bucket count. Clicking
    // it filters the grid to only show stuck forms.
    const notSavedBucket = page.getByText(/^Not Saved\s*\(\d[\d,]*\)$/).first();
    await expect(notSavedBucket).toBeVisible({ timeout: 10_000 });
    await notSavedBucket.click();
    await wait(MODAL_SETTLE_MS);

    // ── Assert at least one grid row has Save Status = "Not Saved" ────────
    const saveStatusCells = page
      .getByRole('gridcell')
      .filter({ hasText: /^Not Saved$/i });
    await expect(saveStatusCells.first()).toBeVisible({ timeout: 15_000 });

    // Verify there are multiple rows showing the stuck status (bucket is
    // not empty by design; this protects against the column silently dropping
    // its value for all rows).
    const count = await saveStatusCells.count();
    expect(count).toBeGreaterThan(0);
  });
});
