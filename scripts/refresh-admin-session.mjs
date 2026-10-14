#!/usr/bin/env node
/**
 * Refresh admin-session.json from the MCP admin tab's browser.
 * Run after logging in manually in the MCP admin tab.
 * Usage: node scripts/refresh-admin-session.mjs
 *
 * Reads localStorage/sessionStorage from the MCP browser via CDP port 9223.
 */
import { chromium } from '@playwright/test';

const CDP_PORT = 9223;
const STORAGE_PATH = 'playwright/.auth/admin-session.json';

async function main() {
  let browser;
  try {
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  } catch {
    console.error(`Cannot connect to CDP at port ${CDP_PORT}.`);
    console.error('Make sure the MCP admin tab is open and running.');
    console.error('The MCP browser must already be logged in.');
    process.exit(1);
  }

  const context = browser.contexts()[0];
  if (!context) {
    console.error('No browser context found.');
    process.exit(1);
  }

  const storageState = await context.storageState();
  const fs = await import('node:fs/promises');
  await fs.writeFile(STORAGE_PATH, JSON.stringify(storageState, null, 2));
  console.log(`Saved to ${STORAGE_PATH}`);
  console.log(`  Cookies: ${storageState.cookies.length}`);
  console.log(`  Origins: ${storageState.origins.length}`);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
