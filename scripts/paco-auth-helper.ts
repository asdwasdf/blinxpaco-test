/**
 * Shared auto-login helper for Claude Playwright MCP sessions.
 * Reads credentials from .env, generates a self-contained login JS snippet,
 * and provides helpers to check auth state and invoke login.
 *
 * Usage in MCP context (browser_evaluate):
 *   const { buildLoginScript, checkAuthScript } = await import('./scripts/paco-auth-helper.js');
 *   // Check if already authenticated
 *   const result = await page.evaluate(buildLoginScript());
 *
 * Usage in Node.js (e.g., mcp-playwright-login.ts):
 *   import { loadCredentials, buildMcpLoginScript } from './scripts/paco-auth-helper.js';
 */

import { loadCredentials, buildMcpLoginScript, loadAdminCredentials } from './load-credentials.js';
export { loadCredentials, loadAdminCredentials, buildMcpLoginScript, type PacoCredentials, type PacoAdminCredentials } from './load-credentials.js';

// Base URL for PACO
export const PACO_LOGIN_PATH = '/paco/login';
export const PACO_DASHBOARD_PATH = '/paco/dashboard';

/** Check if current page is already authenticated (not on login/location-roles). */
export const CHECK_AUTH_SCRIPT = `
(() => {
  const u = window.location.href;
  if (u.includes('/paco/login') || u.includes('/paco/location-roles')) {
    return { authenticated: false, url: u };
  }
  return { authenticated: true, url: u };
})()
`;

/** Navigate to PACO login page. */
export function buildNavigateToLoginScript(baseUrl: string): string {
  return `window.location.href = '${baseUrl}${PACO_LOGIN_PATH}'`;
}

/**
 * Full auto-login: navigate + fill + submit + select org/location/role.
 * Run via browser_evaluate; call from the MCP tab.
 */
export function buildFullLoginScript(): string {
  return buildMcpLoginScript(loadCredentials());
}

/** Default credentials from env (for reference — never log this). */
export function getDefaultLoginInfo() {
  try {
    const c = loadCredentials();
    return { username: c.username, org: c.org, location: c.location, role: c.role };
  } catch {
    return null;
  }
}
