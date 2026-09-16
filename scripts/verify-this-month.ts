import { chromium } from 'playwright';

const BASE = 'https://blinx.dev.blinxpaco-np.com';

async function main() {
  console.log('Connecting to Chrome via CDP...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0]?.pages()[0] || await browser.newPage();

  console.log('Navigating to Capacity & Demand...');
  await page.goto(`${BASE}/capacity-demand/`, { waitUntil: 'domcontentloaded' });

  console.log('Waiting for SPA mount...');
  await page.waitForFunction(
    () => document.body.innerText.includes('CLINICIAN CAPACITY'),
    { timeout: 20000 }
  );
  console.log('✅ SPA mounted');

  // Helper: screenshot with label
  let step = 0;
  const shot = async (label: string) => {
    step++;
    const path = `test-results/product-survey/batch32/this-month-${String(step).padStart(2, '0')}-${label}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`📸 ${path}`);
  };

  // ── CAPTURE BASELINE ─────────────────────────────────────────
  console.log('\n── CAPTURING BASELINE (All Time) ──');

  await shot('01-baseline');

  const getMetrics = async () => {
    const text = await page.evaluate(() => document.body.innerText);
    const clinicianCap = text.match(/(\d+)\s+Booked Appt\.\s+of\s+(\d+)\s+Total Appt\./s)?.[0] || '';
    const unused = text.match(/(\d+)\s+Unused Appt\./)?.[0] || '';
    const dna = text.match(/(\d+)\s+DNA.*?\(?([\d.]+)%\s+loss\)?/s)?.[0] || '';
    const dateDisplay = await page.locator('.date-range-picker__input-field--outline').innerText().catch(() => '');
    const bodySnippet = text.slice(0, 800);
    return { clinicianCap, unused, dna, dateDisplay, bodySnippet };
  };

  const baseline = await getMetrics();
  console.log(`Date display: ${baseline.dateDisplay.replace(/\n/g, ' | ')}`);
  console.log(`Clinician Cap: ${baseline.clinicianCap}`);
  console.log(`Unused: ${baseline.unused}`);
  console.log(`DNA: ${baseline.dna}`);
  console.log('\nBody snippet:');
  console.log(baseline.bodySnippet);

  await shot('02-baseline-screenshot');

  // ── OPEN DATE DROPDOWN ───────────────────────────────────────
  console.log('\n── OPENING DATE DROPDOWN ──');

  await page.evaluate(() => {
    const el = document.querySelector('.date-range-picker__input-field--outline') as HTMLElement;
    if (el) el.click();
  });
  await page.waitForTimeout(800);

  const dropdownOpen = await page.locator('.rdrStaticRanges').isVisible();
  console.log(`Dropdown open: ${dropdownOpen}`);
  await shot('03-dropdown-open');

  if (!dropdownOpen) {
    console.error('❌ Dropdown did not open');
    await browser.close();
    process.exit(1);
  }

  // ── SELECT "THIS MONTH" ──────────────────────────────────────
  console.log('\n── SELECTING "THIS MONTH" ──');

  const thisMonthBtn = page.locator('.rdrStaticRange', { hasText: 'This Month' });
  const thisMonthVisible = await thisMonthBtn.isVisible();
  console.log(`"This Month" visible: ${thisMonthVisible}`);
  await shot('04-before-this-month');

  if (thisMonthVisible) {
    await thisMonthBtn.click();
    await page.waitForTimeout(1500);
    console.log('After "This Month" click — checking state...');
  }

  // ── INSPECT CALENDAR STATE ───────────────────────────────────
  console.log('\n── CALENDAR STATE ──');

  const rdrMonthsVisible = await page.locator('.rdrMonth').first().isVisible().catch(() => false);
  const modalOverlay = await page.locator('.modal-overlay').isVisible().catch(() => false);
  const dateRangeInput = await page.locator('.date-range-picker__input-field--outline').innerText().catch(() => '');
  const rdrInputValue = await page.locator('.rdrInput').inputValue().catch(() => '');

  console.log(`rdrMonth visible: ${rdrMonthsVisible}`);
  console.log(`modal-overlay visible: ${modalOverlay}`);
  console.log(`Date display after click: ${dateRangeInput.replace(/\n/g, ' | ')}`);
  console.log(`rdrInput value: "${rdrInputValue}"`);

  await shot('05-calendar-open');

  // If calendar is open, read the selected date range
  if (rdrMonthsVisible) {
    const startEnd = await page.locator('.rdrInput').inputValue().catch(() => '');
    console.log(`rdrInput range: "${startEnd}"`);

    // Check what month/year is shown
    const monthLabel = await page.locator('.rdrMonthPicker .rdrMonthsVertical .rdrMonth .rdrDayText').first().innerText().catch(async () => {
      return await page.evaluate(() => {
        const el = document.querySelector('.rdrMonthName');
        return el ? el.textContent : '';
      });
    });
    console.log(`Calendar month label: "${monthLabel}"`);

    // Try to find the Apply button and click it
    const applyBtn = page.locator('button', { hasText: 'Apply' });
    const applyVisible = await applyBtn.isVisible().catch(() => false);
    console.log(`Apply button visible: ${applyVisible}`);

    if (applyVisible) {
      console.log('Clicking Apply...');
      await applyBtn.click();
      await page.waitForTimeout(1500);
      await shot('06-after-apply');
    } else {
      // Try Cancel
      const cancelBtn = page.locator('button', { hasText: 'Cancel' });
      const cancelVisible = await cancelBtn.isVisible().catch(() => false);
      console.log(`Cancel button visible: ${cancelVisible}`);

      // Escape to dismiss
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  }

  // ── CAPTURE AFTER STATE ──────────────────────────────────────
  console.log('\n── CAPTURING AFTER STATE ──');

  await page.waitForTimeout(1000);

  // Force-hide any lingering overlay
  await page.evaluate(() => {
    const mo = document.querySelector('.modal-overlay') as HTMLElement | null;
    if (mo) mo.style.display = 'none';
    const cal = document.querySelector('.rdrCalendarWrapper') as HTMLElement | null;
    if (cal) cal.style.display = 'none';
    const modal = document.querySelector('.modal-container-date-range') as HTMLElement | null;
    if (modal) modal.style.display = 'none';
  });
  await page.waitForTimeout(300);

  const after = await getMetrics();
  const dateDisplayAfter = await page.locator('.date-range-picker__input-field--outline').innerText().catch(() => '');

  console.log(`\nDate display (after): ${dateDisplayAfter.replace(/\n/g, ' | ')}`);
  console.log(`Clinician Cap (after): ${after.clinicianCap}`);
  console.log(`Unused (after): ${after.unused}`);
  console.log(`DNA (after): ${after.dna}`);

  await shot('07-after-state');

  // ── COMPARE ─────────────────────────────────────────────────
  console.log('\n── COMPARISON ──');
  const changed = baseline.clinicianCap !== after.clinicianCap ||
                  baseline.unused !== after.unused ||
                  baseline.dna !== after.dna ||
                  baseline.dateDisplay !== dateDisplayAfter;
  console.log(`Metrics changed: ${changed}`);
  if (changed) {
    console.log(`  Baseline clinician: "${baseline.clinicianCap}"`);
    console.log(`  After clinician:   "${after.clinicianCap}"`);
    console.log(`  Baseline unused:    "${baseline.unused}"`);
    console.log(`  After unused:      "${after.unused}"`);
    console.log(`  Baseline DNA:       "${baseline.dna}"`);
    console.log(`  After DNA:          "${after.dna}"`);
  } else {
    console.log('  ⚠️  No change detected — "This Month" preset may not have applied or calendar needs explicit Apply');
  }

  // ── FINAL ───────────────────────────────────────────────────
  await shot('08-final');

  const finalBody = await page.evaluate(() => document.body.innerText);
  console.log('\nFinal body excerpt:');
  console.log(finalBody.slice(0, 600));

  console.log('\n✅ Verify This Month complete');
  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
