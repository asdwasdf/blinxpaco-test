import { test as base, type Page } from '@playwright/test';

/**
 * Dev auto-login for PACO Connect.
 * Credentials: blinx_daophuongnguyen28022003+2 / Nguyen28022003@
 * Org: General Practice (Demo Site) | Role: Super Admin GB
 *
 * Usage in Playwright tests:
 *   test.use(devAutoLogin(page, targetUrl));
 */
export function devAutoLogin(page: Page, targetUrl: string) {
  return base('dev-auto-login', async ({ page: p }) => {
    await p.goto(targetUrl);
    await p.waitForURL(/paco\/login/, { timeout: 10_000 });

    // Login form — use React-compatible value setter
    await p.evaluate(() => {
      const setValue = (el: HTMLInputElement, val: string) => {
        const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
        native.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      const user = document.getElementById('username') as HTMLInputElement;
      const pass = document.getElementById('password') as HTMLInputElement;
      if (user) setValue(user, 'blinx_daophuongnguyen28022003+2');
      if (pass) setValue(pass, 'Nguyen28022003@');
    });
    await p.getByRole('button', { name: 'Log in', exact: true }).click();

    // Location/role picker
    await p.waitForURL(/paco\/location-roles/, { timeout: 10_000 });

    // Organisation
    await p.locator('.p-dropdown').first().click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole('option', { name: 'General Practice (Demo Site)' }).click();

    // Location (auto-selects first, or pick GP explicitly)
    await p.locator('.p-dropdown').nth(1).click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole('option', { name: 'General Practice (Demo Site)' }).click();

    // Role
    await p.locator('.p-dropdown').nth(2).click();
    await p.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await p.getByRole('option', { name: 'Super Admin GB' }).click();

    // Next
    await p.waitForTimeout(500);
    await p.getByRole('button', { name: 'Next' }).click();

    await p.waitForURL(targetUrl, { timeout: 15_000 });
  });
}

/**
 * MCP-compatible inline auto-login script.
 * Paste into browser_evaluate after navigating to /paco/login.
 */
export const MCP_AUTO_LOGIN_SCRIPT = `
(async function() {
  const ORG = 'General Practice (Demo Site)';
  const LOC = 'General Practice (Demo Site)';
  const ROLE = 'Super Admin GB';
  const USER = 'blinx_daophuongnguyen28022003+2';
  const PASS = 'Nguyen28022003@';

  function setReactValue(el, val) {
    const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    native.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function clickDropdownByIndex(index) {
    const drops = document.querySelectorAll('.p-dropdown');
    const visible = Array.from(drops).filter(d => { const r = d.getBoundingClientRect(); return r.width > 0; });
    if (visible[index]) visible[index].click();
  }

  function selectOption(text) {
    const opts = document.querySelectorAll('[role="option"]');
    const found = Array.from(opts).find(o => (o.innerText||'').includes(text));
    if (found) found.click();
  }

  // Step 1: Login
  const user = document.getElementById('username');
  const pass = document.getElementById('password');
  if (user) setReactValue(user, USER);
  if (pass) setReactValue(pass, PASS);
  await wait(100);
  const btn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText||'').trim()==='Log in');
  if (btn) btn.click();

  // Step 2: Wait for location page
  await wait(4000);
  if (!window.location.href.includes('location-roles')) return { step: 'login_failed', url: window.location.href };

  // Step 3: Org
  clickDropdownByIndex(0);
  await wait(1000);
  selectOption(ORG);
  await wait(1000);

  // Step 4: Location
  clickDropdownByIndex(1);
  await wait(1000);
  selectOption(LOC);
  await wait(1000);

  // Step 5: Role
  clickDropdownByIndex(2);
  await wait(1000);
  selectOption(ROLE);
  await wait(500);

  // Step 6: Next
  const next = Array.from(document.querySelectorAll('button')).find(b => (b.innerText||'').trim().toLowerCase()==='next');
  if (next) next.click();

  await wait(3000);
  return { step: 'done', url: window.location.href };
})();
`;

/**
 * Standalone credentials object (for reference — NOT for logging)
 */
export const DEV_CREDENTIALS = {
  username: 'blinx_daophuongnguyen28022003+2',
  password: 'Nguyen28022003@',
  org: 'General Practice (Demo Site)',
  role: 'Super Admin GB',
};
