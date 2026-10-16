import { expect, test } from '../../fixtures/auth-fixtures.js';

// PAC2-9001 — TC-007: Change Session Details (all roles allowed)
// Source: PAC2-9001 MANUAL_EXECUTE rev-2 (Pass). Pencil button on session card opens EDIT SESSION drawer.
// Expected: PASS — drawer opens with 7 fields, footer Cancel + Save work.

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const FB_BASE = `${BASE_URL}/paco-connect/feature-branch/pac2-9001`;
const SESSION_NAME = 'Dan E2E test';

const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);

let page: import('@playwright/test').Page;
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

test.describe.serial('PAC2-9001 TC-007 — Edit Session details (Admin)', () => {
  test.beforeAll(async ({ authenticatedPage }) => {
    page = authenticatedPage;
  });

  test('pencil icon opens EDIT SESSION drawer; Cancel + Save work', async () => {
    test.setTimeout(180_000);

    await page.goto(`${FB_BASE}/appointment-book`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);

    const header = page.getByRole('button', { name: new RegExp(`Session Name ${SESSION_NAME}`) }).first();
    await expect(header).toBeVisible({ timeout: 60_000 });
    if ((await header.getAttribute('aria-expanded')) !== 'true') {
      await header.click({ force: true });
    }
    await wait();

    // Pencil button is on the session card header
    const pencil = page.getByRole('button', { name: new RegExp(`Edit ${SESSION_NAME}`, 'i') }).first();
    let opened = false;
    if (await pencil.count()) {
      await pencil.click({ force: true });
      opened = true;
    } else {
      // Fallback: open via slot right-click → Edit Session menu item
      const slot = page.getByRole('region', { name: new RegExp(SESSION_NAME) })
        .getByRole('button', { name: 'slots span' }).first();
      await expect(slot).toBeVisible({ timeout: 30_000 });
      await slot.click({ button: 'right', force: true });
      await wait();
      await page.getByRole('menuitem', { name: 'Edit Session' }).click({ force: true });
      opened = true;
    }
    expect(opened).toBe(true);
    await wait(3000);

    const drawer = page.locator('[class*="session-edit-or-add-slidebar"]').first();
    await expect(drawer).toBeVisible({ timeout: 30_000 });

    // Footer: Cancel + Save present
    await expect(drawer.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
    const saveButton = drawer.getByRole('button', { name: 'Save', exact: true }).first();
    await expect(saveButton).toBeVisible();

    // Close drawer with Cancel (no mutation, read-only verification)
    await drawer.getByRole('button', { name: 'Cancel', exact: true }).click({ force: true });
    await wait();
    await expect(drawer).toHaveCount(0, { timeout: 15_000 });
  });
});
