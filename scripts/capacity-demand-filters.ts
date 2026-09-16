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

  // Scroll into view first
  await dateContainer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Grab displayed text before
  const dateBefore = await dateContainer.innerText();
  console.log(`Date before click: "${dateBefore.trim()}"`);
  await shot('02-before-date-click');

  // Click with JS dispatch to ensure event fires
  await page.evaluate(() => {
    const el = document.querySelector('.date-range-picker__input-field--outline') as HTMLElement;
    if (el) el.click();
  });
  await page.waitForTimeout(1000);

  console.log(`Dropdown open: ${await page.locator('.rdrStaticRanges').isVisible()}`);
  await shot('03-date-dropdown-open');

  if (!(await page.locator('.rdrStaticRanges').isVisible())) {
    console.log('Note: dropdown did not open — this may indicate page state changed or SPA needs fresh navigation');
  }

  // Count presets
  const presets = page.locator('.rdrStaticRange');
  const presetCount = await presets.count();
  console.log(`Preset count: ${presetCount}`);
  const presetTexts = await presets.allInnerTexts();
  console.log(`Presets: ${presetTexts.map(t => t.trim()).join(', ')}`);

  // Select "This Month" if dropdown is open
  if (await page.locator('.rdrStaticRanges').isVisible()) {
    const thisMonthBtn = page.locator('.rdrStaticRange', { hasText: 'This Month' });
    const thisMonthVisible = await thisMonthBtn.isVisible();
    console.log(`"This Month" visible: ${thisMonthVisible}`);
    if (thisMonthVisible) {
      await thisMonthBtn.click();
      await page.waitForTimeout(1000);
      await shot('04-after-this-month');
      const dateAfter = await dateContainer.innerText();
      console.log(`Date after "This Month": "${dateAfter.trim()}"`);
      // Dismiss the calendar that just opened — press Escape, then force-close if needed
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      // If calendar still visible, force-hide it
      const rdrMonthsVisible = await page.locator('.rdrMonth').first().isVisible().catch(() => false);
      if (rdrMonthsVisible) {
        await page.evaluate(() => {
          const m = document.querySelector('.modal-overlay') as HTMLElement | null;
          if (m) m.style.display = 'none';
          const cal = document.querySelector('.rdrCalendarWrapper') as HTMLElement | null;
          if (cal) cal.style.display = 'none';
        });
        await page.waitForTimeout(500);
      }
    }
  } else {
    console.log('Dropdown not open — skipping "This Month" selection');
  }

  // ── 2. CLINICIAN ROLE CHIPS ────────────────────────────────────
  // First: close the date dropdown by pressing Escape
  console.log('Closing date dropdown...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Dismiss any modal overlay — click at center-right to avoid sidebar button intercept
  const modal = page.locator('.modal-overlay');
  if (await modal.isVisible()) {
    console.log('Modal overlay present — force-close via JS');
    // Force remove the datepicker calendar overlay via JS
    await page.evaluate(() => {
      const overlay = document.querySelector('.modal-overlay') as HTMLElement | null;
      if (overlay) overlay.style.display = 'none';
      const rdrMonth = document.querySelector('.rdrMonth') as HTMLElement | null;
      if (rdrMonth) rdrMonth.style.display = 'none';
    });
    await page.waitForTimeout(500);
  }

  await shot('05-before-role-toggle');

  const roleChips = page.locator('.MuiChip-root', { hasText: /^(Nurse|Doctor|Unallocated|Pharmacist|Mental Health Practitioner|Admin)$/ });
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

  // Close any open date picker first
  const datePickerOpen = await page.locator('.rdrStaticRanges, .rdrMonth, .modal-container-date-range').first().isVisible().catch(() => false);
  if (datePickerOpen) {
    console.log('Date picker still open — closing via Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // List all MuiChip-root chips
  const allChips = page.locator('.MuiChip-root');
  const allChipCount = await allChips.count();
  console.log(`Total MuiChip-root count: ${allChipCount}`);
  for (let i = 0; i < allChipCount; i++) {
    const txt = await allChips.nth(i).innerText();
    console.log(`  Chip ${i + 1}: "${txt.trim()}"`);
  }

  await shot('07-all-chips-visible');

  // Click "O/E - Blood Pressure Reading" chip
  const obsChip = page.locator('.MuiChip-root', { hasText: 'Blood Pressure' }).first();
  const obsVisible = await obsChip.isVisible().catch(() => false);
  console.log(`"Blood Pressure" chip visible: ${obsVisible}`);
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
