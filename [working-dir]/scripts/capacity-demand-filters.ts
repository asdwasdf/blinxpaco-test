import { chromium } from 'playwright';

const BASE = 'https://blinx.dev.blinxpaco-np.com';
const CAPACITY_DEMAND = '/capacity-demand/';

async function main() {
  console.log('Connecting to existing Chrome via CDP...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  console.log('Connected.');

  const ctx = browser.contexts()[0];
  if (!ctx) {
    console.error('No browser context found');
    await browser.close();
    process.exit(1);
  }

  const existingPages = ctx.pages();
  const page = existingPages.length > 0 ? existingPages[0] : await ctx.newPage();

  console.log('Navigating to Capacity & Demand...');
  await page.goto(`${BASE}${CAPACITY_DEMAND}`, { waitUntil: 'domcontentloaded' });

  console.log('Waiting for SPA mount (CLINICIAN CAPACITY in DOM)...');
  try {
    await page.waitForFunction(
      () => document.body.innerText.includes('CLINICIAN CAPACITY'),
      { timeout: 20000 }
    );
    console.log('✅ SPA mounted');
  } catch {
    console.error('❌ SPA did not mount within 20s');
    await page.screenshot({ path: 'test-results/product-survey/batch32/err-no-spa-mount.png' });
    await browser.close();
    process.exit(1);
  }

  // Helper to screenshot with label
  let step = 0;
  const shot = async (label: string) => {
    step++;
    const path = `test-results/product-survey/batch32/filter-test-${String(step).padStart(2, '0')}-${label}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`📸 ${path}`);
  };

  await shot('01-initial-state');

  // ── 1. DATE RANGE ──────────────────────────────────────────────
  console.log('\n── DATE RANGE ──');

  // Click date-range container to open dropdown
  const dateContainer = page.locator('.date-range-picker__input-field--outline');
  const dateVisible = await dateContainer.isVisible();
  console.log(`Date container visible: ${dateVisible}`);
  if (!dateVisible) {
    console.error('❌ Date container not visible');
    await browser.close();
    process.exit(1);
  }

  // Grab displayed text before
  const dateBefore = await dateContainer.innerText();
  console.log(`Date before click: "${dateBefore.trim()}"`);
  await shot('02-before-date-click');

  await dateContainer.click();
  await page.waitForTimeout(500);

  const dropdownOpen = await page.locator('.rdrStaticRanges').isVisible();
  console.log(`Dropdown open: ${dropdownOpen}`);
  await shot('03-date-dropdown-open');

  if (!dropdownOpen) {
    console.error('❌ Dropdown did not open');
    await browser.close();
    process.exit(1);
  }

  // Count presets
  const presets = page.locator('.rdrStaticRange');
  const presetCount = await presets.count();
  console.log(`Preset count: ${presetCount}`);
  const presetTexts = await presets.allInnerTexts();
  console.log(`Presets: ${presetTexts.map(t => t.trim()).join(', ')}`);

  // Select "This Month"
  const thisMonthBtn = page.locator('.rdrStaticRange', { hasText: 'This Month' });
  const thisMonthVisible = await thisMonthBtn.isVisible();
  console.log(`"This Month" visible: ${thisMonthVisible}`);
  if (thisMonthVisible) {
    await thisMonthBtn.click();
    await page.waitForTimeout(800);
    await shot('04-after-this-month');
    const dateAfter = await dateContainer.innerText();
    console.log(`Date after "This Month": "${dateAfter.trim()}"`);
  } else {
    // Close dropdown by clicking outside
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // ── 2. CLINICIAN ROLE CHIPS ────────────────────────────────────
  console.log('\n── CLINICIAN ROLE CHIPS ──');

  const roleChips = page.locator('.MuiChip-root', { hasText: /^(Nurse|Doctor|Unallocated|Pharmacist|Mental Health Practitioner|Admin)$/ });
  const roleCount = await roleChips.count();
  console.log(`Role chip count: ${roleCount}`);
  for (let i = 0; i < roleCount; i++) {
    const txt = await roleChips.nth(i).innerText();
    console.log(`  Role chip ${i + 1}: "${txt.trim()}"`);
  }

  await shot('05-before-role-toggle');

  // Click "Doctor" chip
  const doctorChip = page.locator('.MuiChip-root', { hasText: 'Doctor' });
  const doctorVisible = await doctorChip.isVisible();
  console.log(`Doctor chip visible: ${doctorVisible}`);
  if (doctorVisible) {
    await doctorChip.click();
    await page.waitForTimeout(800);
    await shot('06-after-doctor-toggle');
    const doctorSelected = await doctorChip.getAttribute('class') || '';
    console.log(`Doctor chip class after click: "${doctorSelected}"`);
  }

  // ── 3. OBSERVATION CHIPS ───────────────────────────────────────
  console.log('\n── OBSERVATION CHIPS ──');

  // First re-select All Time to get clean state
  await dateContainer.click();
  await page.waitForTimeout(500);
  const allTimeBtn = page.locator('.rdrStaticRange', { hasText: 'All Time' });
  if (await allTimeBtn.isVisible()) {
    await allTimeBtn.click();
    await page.waitForTimeout(800);
  }

  // Observation chips have different text (e.g., "O/E - Blood Pressure Reading")
  const allChips = page.locator('.MuiChip-root');
  const allChipCount = await allChips.count();
  console.log(`Total MuiChip-root count: ${allChipCount}`);
  for (let i = 0; i < allChipCount; i++) {
    const txt = await allChips.nth(i).innerText();
    console.log(`  Chip ${i + 1}: "${txt.trim()}"`);
  }

  await shot('07-all-chips-visible');

  // Click first observation chip (non-role one)
  const obsChip = page.locator('.MuiChip-root', { hasText: 'Blood Pressure' }).first();
  const obsVisible = await obsChip.isVisible().catch(() => false);
  console.log(`Observation chip "Blood Pressure" visible: ${obsVisible}`);
  if (obsVisible) {
    await obsChip.click();
    await page.waitForTimeout(800);
    await shot('08-after-obs-toggle');
  }

  // ── FINAL STATE ────────────────────────────────────────────────
  console.log('\n── FINAL STATE ──');
  await shot('09-final-state');

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body text excerpt (first 500 chars):');
  console.log(bodyText.slice(0, 500));

  console.log('\n✅ Filter interaction test complete');
  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
