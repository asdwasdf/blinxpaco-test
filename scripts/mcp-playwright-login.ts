/**
 * Wrapper: auto-login rồi spawn @playwright/mcp
 * Chạy: npx ts-node scripts/mcp-playwright-login.ts <admin|user|plugin>
 */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import path from 'node:path';

import { loadCredentials, loadAdminCredentials } from './load-credentials.js';

const CREDS = {
  admin:  { ...loadAdminCredentials() },
  user:   { ...loadCredentials() },
  plugin: { ...loadCredentials() },
} as const;

const PROFILE_DIRS = {
  admin:  'playwright/.mcp-browsers/admin',
  user:   'playwright/.mcp-browsers/user',
  plugin: 'playwright/.mcp-browsers/plugin',
} as const;

const STORAGE_FILES = {
  admin:  'playwright/.auth/admin-session.json',
  user:   'playwright/.auth/user-session.json',
  plugin: 'playwright/.auth/plugin-session.json',
} as const;

const MCP_PORTS = {
  admin:  3100,
  user:   3101,
  plugin: 3102,
} as const;

type Role = keyof typeof CREDS;
const role = (process.argv[2] ?? 'user') as Role;
if (!CREDS[role]) { console.error('Usage: ts-node mcp-playwright-login.ts <admin|user|plugin>'); process.exit(1); }

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const storageFile = STORAGE_FILES[role];

async function loginAndExport() {
  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Login
  await page.goto(`${BASE_URL}/paco/login`);
  await page.waitForURL(/paco\/login/, { timeout: 10_000 });
  await page.getByRole('textbox', { name: 'User Name' }).fill(CREDS[role].username);
  await page.getByRole('textbox', { name: 'Password' }).fill(CREDS[role].password);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();

  // Location-role picker nếu có redirect tới trang này
  if (page.url().includes('location-roles')) {
    await page.waitForSelector('.p-dropdown', { timeout: 5_000 });
    await page.locator('.p-dropdown').first().click();
    await page.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await page.getByRole('option', { name: 'General Practice (Demo Site)' }).click();
    await page.locator('.p-dropdown').nth(1).click();
    await page.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await page.getByRole('option', { name: 'test again - old location' }).click();
    await page.locator('.p-dropdown').nth(2).click();
    await page.waitForSelector('[role="listbox"]', { timeout: 5_000 });
    await page.getByRole('option', { name: 'Blinx Deployment' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    // Chờ redirect sau khi click Next
    await page.waitForLoadState('networkidle', { timeout: 15_000 });
  }
  console.log(`[${role}] Logged in, exporting storage state...`);

  await ctx.storageState({ path: storageFile });
  await browser.close();
  console.log(`[${role}] Saved to ${storageFile}`);
}

async function main() {
  // Login + export storage state
  await loginAndExport();

  // Spawn @playwright/mcp
  const port = MCP_PORTS[role];
  const profileDir = PROFILE_DIRS[role];
  const mcp = spawn('npx', [
    '@playwright/mcp@latest',
    '--user-data-dir', profileDir,
    '--storage-state', storageFile,
    '--port', String(port),
  ], { stdio: 'inherit', cwd: process.cwd() });

  mcp.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((e) => { console.error(e); process.exit(1); });
