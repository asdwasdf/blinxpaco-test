import { test as base, type Page } from '@playwright/test';

/**
 * Dev auto-login for PACO Connect.
 * Reads credentials from environment variables (PAC_USERNAME, PAC_PASSWORD, etc.)
 * Org: General Practice (Demo Site) | Role: Blinx Deployment
 *
 * Usage in Playwright tests:
 *   test.use(devAutoLogin(page, targetUrl));
 */
export function devAutoLogin(page: Page, targetUrl: string) {
  return base('dev-auto-login', async ({ page: p }) => {
    await p.goto(targetUrl);
    await p.waitForURL(/paco\/login/, { timeout: 10_000 });

    const username = process.env.PAC_USERNAME;
    const password = process.env.PAC_PASSWORD;
    if (!username || !password) throw new Error('Missing PAC_USERNAME or PAC_PASSWORD in .env');

    // Login form — use React-compatible value setter
    await p.evaluate(([u, pw]) => {
      const setValue = (el: HTMLInputElement, val: string) => {
        const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
        native.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      const user = document.getElementById('username') as HTMLInputElement;
      const pass = document.getElementById('password') as HTMLInputElement;
      if (user) setValue(user, u);
      if (pass) setValue(pass, pw);
    }, [username, password]);
    await p.getByRole('button', { name: 'Log in', exact: true }).click();

    // Location/role picker
    await p.waitForURL(/paco\/location-roles/, { timeout: 10_000 });

    const org = process.env.PAC_ORG ?? 'General Practice (Demo Site)';
    const location = process.env.PAC_LOCATION ?? 'test again - old location';
    const role = process.env.PAC_ROLE ?? 'Blinx Deployment';

    // Organisation
    await p.locator('.p-dropdown').first().click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole('option', { name: org }).click();

    // Location
    await p.locator('.p-dropdown').nth(1).click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole('option', { name: location }).click();

    // Role
    await p.locator('.p-dropdown').nth(2).click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole('option', { name: role }).click();

    // Next
    await p.waitForTimeout(500);
    await p.getByRole('button', { name: 'Next' }).click();

    await p.waitForURL(targetUrl, { timeout: 15_000 });
  });
}
