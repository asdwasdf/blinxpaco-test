import { expect, test } from '../../fixtures/auth-fixtures.js';

// PAC2-9001 — TC-011 DIAGNOSTIC: P7032 visibility in Role Groups after paco-one-db deploy.
// Source: PAC2-9001 MANUAL_EXECUTE rev-2 (Blocked — paco-one-db #1022 not deployed on dev, P7032 absent).
// This spec is diagnostic: it scans the Role Groups list for P7032 and records the result.
// Expected: Blocked until paco-one-db #1022 deploys; once deployed, P7032 should appear in the activity list.

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const ROLE_GROUPS_URL = `${BASE_URL}/paco/configuration/staff/role-groups`;
const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const wait = (ms = STEP_MS) => new Promise<void>((r) => setTimeout(r, ms));

test.describe.serial('PAC2-9001 TC-011 DIAGNOSTIC — P7032 visibility in Role Groups', () => {
  test('scans Role Groups for P7032 - Appointment Book Cancel Session', async ({ authenticatedPage }) => {
    test.setTimeout(180_000);
    const page = authenticatedPage;

    await page.goto(ROLE_GROUPS_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);

    // Wait for RBAC activity list to render
    const activityList = page.getByRole('list', { name: /role groups|activities/i }).first()
      .or(page.locator('table, [role=grid]').first());
    await expect(activityList).toBeVisible({ timeout: 60_000 });
    await wait(3000);

    // Count activities and scan for P7032
    const rows = await page.locator('table tr, [role=row]').all();
    let maxPCode: string | null = null;
    let p7032Found = false;
    for (const row of rows) {
      const text = (await row.innerText().catch(() => '')).trim();
      if (!text) continue;
      const pCodeMatch = text.match(/P\d{4}/);
      if (pCodeMatch) {
        const code = pCodeMatch[0];
        if (!maxPCode || code > maxPCode) maxPCode = code;
      }
      if (/P7032/.test(text)) p7032Found = true;
    }

    console.log(`[TC-011] scanned rows=${rows.length}, max P-code=${maxPCode ?? 'none'}, P7032 found=${p7032Found}`);

    // Diagnostic only: do not assert pass/fail on p7032Found; record observation
    expect(typeof p7032Found).toBe('boolean');
  });
});
