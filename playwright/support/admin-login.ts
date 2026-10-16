import { test as base, type Page } from "@playwright/test";

/**
 * Admin login flow for PACO Connect.
 * Auto-fills credentials, selects org/location/role, lands on target URL.
 * No token storage — each run does fresh login, always valid.
 */
export function adminLogin(page: Page, targetUrl: string) {
  return base("admin-login", async ({ page: p }) => {
    // Step 1: Login page
    await p.goto(targetUrl);
    await p.waitForURL(/paco\/login/, { timeout: 10_000 });

    await p
      .getByRole("textbox", { name: "User Name" })
      .fill("blinx_johnny.bravo");
    await p.getByRole("textbox", { name: "Password" }).fill("Blinx!82");
    await p.getByRole("button", { name: "Log in", exact: true }).click();

    // Step 2: Location-role picker
    await p.waitForURL(/paco\/location-roles/, { timeout: 10_000 });

    // Organisation
    const orgTrigger = p.locator(".p-dropdown").first();
    await orgTrigger.click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p
      .getByRole("option", { name: "General Practice (Demo Site)" })
      .click();

    // Location (should auto-populate or pick first available)
    const locTrigger = p.locator(".p-dropdown").nth(1);
    await locTrigger.click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    // Pick Firdale Medical Centre as default
    await p.getByRole("option", { name: "test again - old location" }).click();

    // Role
    const roleTrigger = p.locator(".p-dropdown").nth(2);
    await roleTrigger.click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole("option", { name: "Blinx Deployment" }).click();

    // Next
    await p.getByRole("button", { name: "Next" }).click();

    // Step 3: Target app
    await p.waitForURL(targetUrl, { timeout: 15_000 });
  });
}
