import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_DIR = path.join(process.cwd(), 'playwright/.auth');
const OUT_DIR = path.join(process.cwd(), 'test-results/product-survey/batch26');
const BASE = 'https://blinx.dev.blinxpaco-np.com';
const CDP = 'http://127.0.0.1:9222';

fs.mkdirSync(OUT_DIR, { recursive: true });

async function save(page: any, name: string) {
  const buf = await page.screenshot({ fullPage: true });
  fs.writeFileSync(path.join(OUT_DIR, `${name}.png`), buf);
  console.log(`[saved] ${name}.png`);
}

async function main() {
  // Connect to the already-running authenticated browser via CDP
  const endpoint = await fetch(`${CDP}/json/version`).then(r => r.json()).catch(() => null);
  if (!endpoint) throw new Error('CDP không kết nối được. Chạy "npm run auth:login" trước và giữ browser mở.');

  const browser = await chromium.connectOverCDP(CDP);
  const ctx = browser.contexts()[0] ?? await browser.newContext();
  const page = ctx.pages()[0] ?? await ctx.newPage();

  // Verify we're at the dashboard
  await page.goto(BASE + '/paco/dashboard');
  await page.waitForTimeout(2000);
  await save(page, '01-dashboard');

  // Configuration > Clinical Config > Document Templates
  await page.goto(BASE + '/paco/configuration/clinical-config/document-templates');
  await page.waitForTimeout(3000);
  await save(page, '02-document-templates');

  // Click first row (verify selection doesn't mutate)
  const firstRow = page.locator('table tbody tr').first();
  if (await firstRow.count() > 0) {
    const rowText = await firstRow.innerText();
    console.log(`[clicking row] ${rowText.slice(0, 80)}`);
    await firstRow.click();
    await page.waitForTimeout(1500);
    await save(page, '03-document-templates-row-click');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // Consultation Templates
  await page.goto(BASE + '/paco/configuration/clinical-config/consultation-templates');
  await page.waitForTimeout(3000);
  await save(page, '04-consultation-templates');

  // Capacity & Demand
  await page.goto(BASE + '/capacity-demand/');
  await page.waitForTimeout(4000);
  await save(page, '05-capacity-demand');

  // Manager Dashboard
  await page.goto(BASE + '/paco/dashboard/manager-dashboards/overview');
  await page.waitForTimeout(3000);
  await save(page, '06-manager-dashboard');

  // Comms Hub Template Builder (external)
  await page.goto('https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/template-builder');
  await page.waitForTimeout(4000);
  await save(page, '07-comms-template-builder');

  // Comms Hub Campaign Manager
  await page.goto('https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager');
  await page.waitForTimeout(4000);
  await save(page, '08-comms-campaign-manager');

  // Patient Profile > Timeline detail
  await page.goto(BASE + '/paco/patient-search');
  await page.waitForTimeout(3000);
  const firstSearchRow = page.locator('table tbody tr').first();
  if (await firstSearchRow.count() > 0) {
    const name = await firstSearchRow.locator('td').nth(3).innerText().catch(() => 'unknown');
    console.log(`[patient] ${name}`);
    const actions = firstSearchRow.locator('[role="button"], button, [class*="action"]');
    // Open Actions menu via the actions cell
    const actionsCell = firstSearchRow.locator('td').last();
    await actionsCell.click();
    await page.waitForTimeout(1000);
    const profileItem = page.getByText('Profile');
    if (await profileItem.count() > 0) {
      await profileItem.click();
      await page.waitForTimeout(3000);
      await save(page, '09-patient-profile-dashboard');
    }
  }

  console.log('\nBatch 26 hoàn tất.');
  await browser.close();
}

main().catch(e => { console.error(e.message); process.exit(1); });
