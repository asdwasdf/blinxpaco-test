import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.join(process.cwd(), 'test-results/product-survey/batch28');
const BASE = 'https://blinx.dev.blinxpaco-np.com';
const CDP = 'http://127.0.0.1:9222';

fs.mkdirSync(OUT_DIR, { recursive: true });

async function save(page: any, name: string) {
  const buf = await page.screenshot({ fullPage: true });
  fs.writeFileSync(path.join(OUT_DIR, `${name}.png`), buf);
  console.log(`[saved] ${name}.png`);
}

async function main() {
  const browser = await chromium.connectOverCDP(CDP);
  const ctx = browser.contexts()[0] ?? await browser.newContext();
  const page = ctx.pages()[0] ?? await ctx.newPage();

  // 1. Go to Patient Search and find a patient with data
  await page.goto(BASE + '/paco/patient-search');
  await page.waitForTimeout(3000);

  // Search for patient with data
  const searchInput = page.locator('input[placeholder*="Search Patients"]').first();
  if (await searchInput.count() > 0) {
    await searchInput.fill('Abbott');
    await page.waitForTimeout(1500);
  }

  // Click first row Actions
  const firstRow = page.locator('table tbody tr').first();
  if (await firstRow.count() > 0) {
    const actionsCell = firstRow.locator('td').last();
    await actionsCell.click();
    await page.waitForTimeout(800);
    const profileItem = page.getByText('Profile');
    if (await profileItem.count() > 0) {
      await profileItem.click();
      await page.waitForTimeout(3000);
      await save(page, '01-patient-profile-dashboard');
    }
  }

  // Timeline tab
  const timelineTab = page.getByRole('tab', { name: 'Timeline', exact: true });
  if (await timelineTab.count() > 0) {
    await timelineTab.click();
    await page.waitForTimeout(2000);
    await save(page, '02-timeline');
  }

  // Coding tab
  const codingTab = page.getByRole('tab', { name: 'Coding', exact: true });
  if (await codingTab.count() > 0) {
    await codingTab.click();
    await page.waitForTimeout(2000);
    await save(page, '03-coding');
  }

  // Documents tab
  const docsTab = page.getByRole('tab', { name: 'Documents', exact: true });
  if (await docsTab.count() > 0) {
    await docsTab.click();
    await page.waitForTimeout(2000);
    await save(page, '04-documents');
  }

  // Investigations tab
  const invTab = page.getByRole('tab', { name: 'Investigations', exact: true });
  if (await invTab.count() > 0) {
    await invTab.click();
    await page.waitForTimeout(2000);
    await save(page, '05-investigations');
  }

  // Payments tab
  const payTab = page.getByRole('tab', { name: 'Payments', exact: true });
  if (await payTab.count() > 0) {
    await payTab.click();
    await page.waitForTimeout(2000);
    await save(page, '06-payments');
  }

  // 2. Health Forms > Designer V2
  await page.goto(BASE + '/paco/health-forms');
  await page.waitForTimeout(4000);
  await save(page, '07-health-forms-designer-v2');

  // Click first row
  const firstFormRow = page.locator('table tbody tr').first();
  if (await firstFormRow.count() > 0) {
    const rowText = await firstFormRow.innerText().catch(() => '');
    console.log(`[form row] ${rowText.slice(0, 80)}`);
    await firstFormRow.click();
    await page.waitForTimeout(2000);
    await save(page, '08-health-forms-designer-v2-row-click');
  }

  // 3. Health Forms > Designer (old)
  await page.goto(BASE + '/health-forms/builder/');
  await page.waitForTimeout(4000);
  await save(page, '09-health-forms-designer-old');

  // 4. Health Forms > Inbox deep-dive (try the All Health Forms panel)
  await page.goto(BASE + '/health-forms/responses/');
  await page.waitForTimeout(4000);
  await save(page, '10-health-forms-inbox');

  // 5. My Case deep-dive
  await page.goto(BASE + '/paco/my-case');
  await page.waitForTimeout(4000);
  await save(page, '11-my-case');

  console.log('\nBatch 28 hoàn tất.');
  await browser.close();
}

main().catch(e => { console.error(e.message); process.exit(1); });
