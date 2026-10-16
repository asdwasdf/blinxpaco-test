import { expect, test } from '../../fixtures/auth-fixtures.js';
import { ConfigurationSessionsPage } from '../../pages/ConfigurationSessionsPage.js';

// PAC2-9001 — TC-009: Cancel session from Configuration → Sessions (Admin-only)
// Source: PAC2-9001 MANUAL_EXECUTE rev-2 (Pass for Admin; OQ-033 RESOLVED — entry point = Config kebab).
// Expected: PASS — Admin sees "Cancel session appointments" in Configuration → Sessions row kebab.
// Mutation note: this spec does NOT confirm cancel (read-only verification of menu presence + enabled state).
// Confirming the cancel action is out of scope; requires tester approval + cleanup of cancelled appointments.

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const FB_BASE = `${BASE_URL}/paco-connect/feature-branch/pac2-9001`;
const SESSION_NAME = 'Dan E2E test';
const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

test.describe.serial('PAC2-9001 TC-009 — Cancel session from Configuration kebab (Admin)', () => {
  test('Configuration → Sessions row kebab shows "Cancel session appointments" for Admin', async ({ authenticatedPage }) => {
    test.setTimeout(180_000);
    const page = authenticatedPage;
    const sessions = new ConfigurationSessionsPage(page);

    await page.goto(`${FB_BASE}/configuration`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);

    await page.getByRole('menuitem', { name: 'Appointment Books' }).click({ force: true });
    await wait();
    await page.getByRole('menuitem', { name: 'Sessions' }).click({ force: true });
    await wait(3000);

    await expect(page.getByText(/Loading sessions/i).first()).toBeHidden({ timeout: 60_000 });

    await sessions.searchInput.fill(SESSION_NAME);
    await wait(3000);

    const row = page.getByRole('row', { name: new RegExp(SESSION_NAME) });
    await expect(row).toBeVisible({ timeout: 30_000 });

    await sessions.rowKebab(SESSION_NAME).click({ force: true });
    await wait();

    const cancelItem = sessions.kebabMenuItem('Cancel session appointments');
    await expect(cancelItem).toBeVisible({ timeout: 15_000 });
    expect(await cancelItem.isEnabled()).toBe(true);
  });
});
