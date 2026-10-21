import { test as base, type Page } from "@playwright/test";

/**
 * Admin login flow for PACO Connect.
 * Reads credentials from env (PAC_USERNAME, PAC_PASSWORD, PAC_ORG, PAC_LOCATION, PAC_ROLE).
 * Auto-fills credentials, selects org/location/role, lands on target URL.
 */
export function adminLogin(page: Page, targetUrl: string) {
  return base("admin-login", async ({ page: p }) => {
    const username = process.env.PAC_USERNAME;
    const password = process.env.PAC_PASSWORD;
    if (!username || !password) throw new Error('Missing PAC_USERNAME or PAC_PASSWORD in .env');

    // Step 1: Login page
    await p.goto(targetUrl);
    await p.waitForURL(/paco\/login/, { timeout: 10_000 });

    await p.getByRole("textbox", { name: "User Name" }).fill(username);
    await p.getByRole("textbox", { name: "Password" }).fill(password);
    await p.getByRole("button", { name: "Log in", exact: true }).click();

    // Step 2: Location-role picker
    await p.waitForURL(/paco\/location-roles/, { timeout: 10_000 });

    const org = process.env.PAC_ORG ?? 'General Practice (Demo Site)';
    const location = process.env.PAC_LOCATION ?? 'test again - old location';
    const role = process.env.PAC_ROLE ?? 'Blinx Deployment';

    // Organisation
    const orgTrigger = p.locator(".p-dropdown").first();
    await orgTrigger.click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole("option", { name: org }).click();

    // Location
    const locTrigger = p.locator(".p-dropdown").nth(1);
    await locTrigger.click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole("option", { name: location }).click();

    // Role
    const roleTrigger = p.locator(".p-dropdown").nth(2);
    await roleTrigger.click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole("option", { name: role }).click();

    // Next
    await p.getByRole("button", { name: "Next" }).click();

    // Step 3: Target app
    await p.waitForURL(targetUrl, { timeout: 15_000 });
  });
}
