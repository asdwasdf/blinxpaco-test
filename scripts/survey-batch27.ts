import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.join(process.cwd(), 'test-results/product-survey/batch27');
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

  // 1. Patient Analyser — full tabbed app
  await page.goto(BASE + '/patient-analyser-new/');
  await page.waitForTimeout(4000);
  await save(page, '01-patient-analyser-default');

  // Click MEDICATION ANALYSER tab (role=tab, exact match)
  const medTab = page.getByRole('tab', { name: 'Medication Analyser', exact: true });
  if (await medTab.count() > 0) {
    await medTab.click();
    await page.waitForTimeout(2000);
    await save(page, '02-medication-analyser');
  }

  // Click QOF REGISTERS tab
  const qofTab = page.getByRole('tab', { name: 'QOF Registers', exact: true });
  if (await qofTab.count() > 0) {
    await qofTab.click();
    await page.waitForTimeout(2000);
    await save(page, '03-qof-registers');
  }

  // Click PATIENT DETAILS tab
  const detailsTab = page.getByRole('tab', { name: 'Patient Details', exact: true });
  if (await detailsTab.count() > 0) {
    await detailsTab.click();
    await page.waitForTimeout(2000);
    await save(page, '04-patient-details');
  }

  // Back to PATIENT ANALYSER tab
  const patientTab = page.getByRole('tab', { name: 'Patient Analyser', exact: true });
  if (await patientTab.count() > 0) {
    await patientTab.click();
    await page.waitForTimeout(1500);
  }

  // Try a search on PATIENT ANALYSER
  const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"]').first();
  if (await searchInput.count() > 0) {
    await searchInput.fill('Abbott');
    await page.waitForTimeout(2000);
    await save(page, '05-patient-analyser-search');
  }

  // 2. Manager Dashboard — deeper tabs
  await page.goto(BASE + '/paco/dashboard/manager-dashboards/overview');
  await page.waitForTimeout(3000);

  // Click CQC Readying
  const cqc = page.getByText('CQC Readying');
  if (await cqc.count() > 0) {
    await cqc.click();
    await page.waitForTimeout(2000);
    await save(page, '06-cqc-readying');
  }

  // Click Staff Performance row
  const staffPerf = page.getByText('Staff Performance');
  if (await staffPerf.count() > 0) {
    await staffPerf.click();
    await page.waitForTimeout(2000);
    await save(page, '07-staff-performance');
  }

  // 3. Virtual Appointments deep-dive
  await page.goto(BASE + '/web-chat/appointments/');
  await page.waitForTimeout(3000);
  await save(page, '08-virtual-appointments');

  // Try filtering
  const onDemandFilter = page.getByText('On Demand Appointments');
  if (await onDemandFilter.count() > 0) {
    await onDemandFilter.click();
    await page.waitForTimeout(1500);
    await save(page, '09-virtual-appointments-on-demand');
  }

  // 4. Appointment Book deep-dive
  await page.goto(BASE + '/paco-connect/appointment-book');
  await page.waitForTimeout(3000);
  await save(page, '10-appointment-book');

  // 5. Reports (Analytics & Reports > Reports)
  await page.goto(BASE + '/paco/analytics-reports/scr-reports');
  await page.waitForTimeout(3000);
  await save(page, '11-scr-reports');

  console.log('\nBatch 27 hoàn tất.');
  await browser.close();
}

main().catch(e => { console.error(e.message); process.exit(1); });
