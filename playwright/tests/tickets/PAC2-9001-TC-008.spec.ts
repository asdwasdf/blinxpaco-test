import { expect, test } from '../../fixtures/auth-fixtures.js';
import { ConfigurationSessionsPage } from '../../pages/ConfigurationSessionsPage.js';

// PAC2-9001 — TC-008: Remove/Archive Session (Admin-only)
// Source: PAC2-9001 MANUAL_EXECUTE rev-2 (Pass for Admin; non-Admin NOT verified).
// Expected: PASS — Admin sees "Archive" in Configuration → Sessions row kebab, can click Archive.
// Mutation note: this spec does NOT confirm Archive (read-only verification of menu presence).
// Confirming/canceling the archive action is out of scope; requires tester approval + cleanup.

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const FB_BASE = `${BASE_URL}/paco-connect/feature-branch/pac2-9001`;
const SESSION_NAME = '8871 Testing';
const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

test.describe.serial('PAC2-9001 TC-008 — Archive session from Configuration kebab (Admin)', () => {
  test('Configuration → Sessions row kebab shows Archive for Admin', async ({ authenticatedPage }) => {
    test.setTimeout(180_000);
    const page = authenticatedPage;
    const sessions = new ConfigurationSessionsPage(page);

    await page.goto(`${FB_BASE}/configuration`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);

    // Navigate Configuration → Appointment Books → Sessions
    await page.getByRole('menuitem', { name: 'Appointment Books' }).click({ force: true });
    await wait();
    await page.getByRole('menuitem', { name: 'Sessions' }).click({ force: true });
    await wait(3000);

    // Wait for table to load
    await expect(page.getByText(/Loading sessions/i).first()).toBeHidden({ timeout: 60_000 });

    // Search for the test session
    await sessions.searchInput.fill(SESSION_NAME);
    await wait(3000);

    const row = page.getByRole('row', { name: new RegExp(SESSION_NAME) });
    await expect(row).toBeVisible({ timeout: 30_000 });

    // Open row kebab
    await sessions.rowKebab(SESSION_NAME).click({ force: true });
    await wait();

    const archiveItem = sessions.kebabMenuItem('Archive');
    await expect(archiveItem).toBeVisible({ timeout: 15_000 });
    // Read-only verification: do NOT click Archive (mutation not approved in this scope)
    expect(await archiveItem.isEnabled()).toBe(true);
  });
});
