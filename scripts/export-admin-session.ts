/**
 * Export admin MCP tab session to storageState JSON.
 * Run AFTER manual login completes on the admin MCP tab.
 * Usage: npx ts-node scripts/export-admin-session.ts
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUTPUT = path.resolve(process.cwd(), 'playwright/.auth/admin-session.json');

async function main() {
  const dir = path.dirname(OUTPUT);
  await mkdir(dir, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.contexts()[0] ?? await browser.newContext();

  // If no existing context, create fresh one and navigate to login
  if (context.pages().length === 0) {
    const page = await context.newPage();
    await page.goto('https://blinx.dev.blinxpaco-np.com/paco/dashboard');
    console.log('Navigate to Paco, login, and return here...');
    // Wait for user to login manually
    await page.waitForURL('**/paco/dashboard**', { timeout: 0 });
  }

  await context.storageState({ path: OUTPUT });
  console.log(`Saved to ${OUTPUT}`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
