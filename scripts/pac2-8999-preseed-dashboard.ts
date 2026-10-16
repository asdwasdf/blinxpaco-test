/**
 * PAC2-8999 — preseed dashboard tab helper.
 *
 * Workaround for auth-fixtures.ts which requires exactly one tab on `/paco/dashboard`.
 * Connects to the manual-login CDP browser (port 9222) and navigates the first
 * non-omnibox page to the dashboard so the fixture's dashboardPages filter finds
 * exactly one tab.
 *
 * Idempotent: if the first page is already on `/paco/dashboard`, no-op.
 * Usage:  node --loader ts-node/esm scripts/pac2-8999-preseed-dashboard.ts
 */
import { chromium } from '@playwright/test';

const CDP = 'http://127.0.0.1:9222';
const DASHBOARD = 'https://blinx.dev.blinxpaco-np.com/paco/dashboard';

async function main(): Promise<void> {
  const browser = await chromium.connectOverCDP(CDP);
  const contexts = browser.contexts();
  if (contexts.length !== 1) throw new Error(`expected one context, found ${contexts.length}`);
  const ctx = contexts[0];
  const pages = ctx.pages();
  const realPages = pages.filter((p) => !p.url().startsWith('chrome://'));
  if (realPages.length === 0) throw new Error('no real pages in CDP browser');

  const page = realPages[0];
  const url = page.url();
  if (url.startsWith(DASHBOARD)) {
    console.log(`Already on dashboard: ${url}`);
    return;
  }
  console.log(`Navigating ${url} → ${DASHBOARD}`);
  await page.goto(DASHBOARD, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  console.log(`Now on: ${page.url()}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});