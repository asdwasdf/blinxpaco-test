/**
 * Auto-login helper for NHS Comms Hub Dev via Playwright MCP.
 *
 * Credentials sourced from .env (same PAC_USERNAME/PAC_PASSWORD as PACO).
 * Never log credential values.
 *
 * Usage via browser_evaluate in MCP tab:
 *   const result = await page.evaluate(buildCommsHubLoginScript());
 *
 * Usage via Node.js (standalone):
 *   npx ts-node scripts/comms-hub-auth-helper.ts
 */

export const COMMS_HUB_BASE_URL = 'https://nhs-comms-hub-dev.blinxhealthcare.com';
export const COMMS_HUB_LOGIN_PATH = '/commshub/login';
export const COMMS_HUB_DASHBOARD_PATH = '/commshub/';

/** Check if current page is already authenticated for Comms Hub. */
export const CHECK_AUTH_SCRIPT = `
(() => {
  const u = window.location.href;
  // Authenticated if on Comms Hub domain (base domain is the app root)
  if (u.includes('nhs-comms-hub-dev.blinxhealthcare.com') && !u.includes('/commshub/login')) {
    // Confirm with org/dashboard indicators
    const text = document.body.innerText || '';
    if (text.includes('General Practice') || text.includes('Communications Hub') || text.includes('Fiona')) {
      return { authenticated: true, url: u };
    }
  }
  return { authenticated: false, url: u };
})()
`;

/** Navigate to Comms Hub login page. */
export function buildNavigateToLoginScript(): string {
  return `window.location.href = '${COMMS_HUB_BASE_URL}${COMMS_HUB_LOGIN_PATH}'`;
}

/**
 * Full auto-login: expand username/password form, fill creds, submit, verify.
 * Run via browser_evaluate in MCP tab.
 */
export function buildCommsHubLoginScript(username: string, password: string): string {
  return `
(async function() {
  function setReactValue(el, val) {
    const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    native.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  // Step 1: Clear any stale auth (navigate to login, clear session)
  window.location.href = '${COMMS_HUB_BASE_URL}${COMMS_HUB_LOGIN_PATH}';
  await wait(2000);

  // Step 2: Click "Username and Password" link to expand the form
  const credsLink = Array.from(document.querySelectorAll('*')).find(
    el => (el.innerText||'').includes('Username and Password') && !el.querySelector('input')
  );
  if (credsLink) credsLink.click();
  await wait(1000);

  // Step 3: Fill username and password
  const usernameInput = document.querySelector('input[placeholder="Username"]');
  const passwordInput = document.querySelector('input[type="password"]');
  if (!usernameInput || !passwordInput) {
    // Fallback: first text input is username, first password input is password
    const inputs = Array.from(document.querySelectorAll('input'));
    const u = inputs.find(i => i.type === 'text');
    const p = inputs.find(i => i.type === 'password');
    if (u) setReactValue(u, '${username}');
    if (p) setReactValue(p, '${password}');
  } else {
    setReactValue(usernameInput, '${username}');
    setReactValue(passwordInput, '${password}');
  }
  await wait(300);

  // Step 4: Submit
  const btn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText||'').trim().toLowerCase().includes('sign in'));
  if (btn) btn.click();

  // Step 5: Wait for redirect
  await wait(3000);

  const url = window.location.href;
  if (url.includes('/commshub/login')) {
    return { step: 'login_failed', url };
  }
  return { step: 'done', url };
})();
`;
}

/** Verify authenticated state after login. */
export function buildVerifyAuthScript(): string {
  return `
(() => {
  const u = window.location.href;
  if (u.includes('nhs-comms-hub-dev.blinxhealthcare.com') && !u.includes('/commshub/login')) {
    const text = document.body.innerText || '';
    if (text.includes('General Practice') || text.includes('Communications Hub') || text.includes('Fiona')) {
      return { authenticated: true, url: u };
    }
  }
  return { authenticated: false, url: u };
})()
`;
}

/** Convenience: load credentials from env and build full login script. */
export function buildFullLoginScript(): string {
  const username = process.env.PAC_USERNAME;
  const password = process.env.PAC_PASSWORD;
  if (!username || !password) throw new Error('Missing PAC_USERNAME or PAC_PASSWORD in .env');
  return buildCommsHubLoginScript(username, password);
}
