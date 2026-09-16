import { chromium } from 'playwright';

const BASE = 'https://blinx.dev.blinxpaco-np.com';

async function main() {
  console.log('Connecting to Chrome via CDP...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0]?.pages()[0] || await browser.newPage();

  await page.goto(`${BASE}/capacity-demand/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => document.body.innerText.includes('CLINICIAN CAPACITY'),
    { timeout: 20000 }
  );
  console.log('✅ SPA mounted');

  let step = 0;
  const shot = async (label: string) => {
    step++;
    const path = `test-results/product-survey/batch32/reset-test-${String(step).padStart(2, '0')}-${label}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`📸 ${path}`);
  };

  const getState = async () => {
    const dateDisplay = await page.locator('.date-range-picker__input-field--outline').innerText().catch(() => '');
    const body = await page.evaluate(() => document.body.innerText);
    return { dateDisplay, hasData: body.includes('345 Booked Appt.'), noData: body.includes('NO DATA FOUND'), bodySnippet: body.slice(0, 300) };
  };

  // Baseline — capture initial state
  await shot('01-initial-state');
  const initial = await getState();
  console.log(`\nInitial state:`);
  console.log(`  date="${initial.dateDisplay.replace(/\n/g, '|')}"`);
  console.log(`  hasData=${initial.hasData}  noData=${initial.noData}`);

  // Open dropdown and check All Time preset behavior
  await page.evaluate(() => {
    (document.querySelector('.date-range-picker__input-field--outline') as HTMLElement)?.click();
  });
  await page.waitForTimeout(800);

  const dropdownOpen = await page.locator('.rdrStaticRanges').isVisible();
  console.log(`\nDropdown open: ${dropdownOpen}`);
  await shot('02-dropdown-open');

  // Check all 20 presets and their onclick handlers
  const presets = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.rdrStaticRange'));
    return items.map(el => {
      const text = el.textContent?.trim() || '';
      const handler = (el as HTMLElement).onclick;
      // Try to read data attributes
      const ds = { ...(el as HTMLElement).dataset };
      return { text, hasOnClick: !!handler, dataset: ds };
    });
  });
  console.log(`\nPreset count: ${presets.length}`);
  presets.forEach(p => {
    console.log(`  "${p.text}" — onclick=${p.hasOnClick} dataset=${JSON.stringify(p.dataset)}`);
  });

  // Click "All Time" and see what happens
  const allTimeBtn = page.locator('.rdrStaticRange', { hasText: 'All Time' });
  await allTimeBtn.click();
  await page.waitForTimeout(1500);

  // Check: did calendar open or did it directly apply?
  const calOpen = await page.locator('.rdrMonth').first().isVisible().catch(() => false);
  const overlayOpen = await page.locator('.modal-overlay').isVisible().catch(() => false);
  const applyVisible = await page.locator('button', { hasText: 'Apply' }).isVisible().catch(() => false);

  console.log(`\nAfter "All Time" click:`);
  console.log(`  calendar open: ${calOpen}`);
  console.log(`  overlay open: ${overlayOpen}`);
  console.log(`  Apply button: ${applyVisible}`);

  if (calOpen || overlayOpen || applyVisible) {
    // Calendar opened — click Apply
    if (applyVisible) {
      await page.locator('button', { hasText: 'Apply' }).click();
      await page.waitForTimeout(1500);
    } else {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  }

  await page.evaluate(() => {
    const mo = document.querySelector('.modal-overlay') as HTMLElement | null;
    if (mo) mo.style.display = 'none';
  });
  await page.waitForTimeout(300);

  await shot('03-after-all-time');
  const afterAllTime = await getState();
  console.log(`\nAfter "All Time":`);
  console.log(`  date="${afterAllTime.dateDisplay.replace(/\n/g, '|')}"`);
  console.log(`  hasData=${afterAllTime.hasData}  noData=${afterAllTime.noData}`);

  // ── Compare initial vs after ───────────────────────────────────
  console.log('\n── COMPARISON ──');
  const dateChanged = initial.dateDisplay !== afterAllTime.dateDisplay;
  const dataChanged = initial.hasData !== afterAllTime.hasData;
  console.log(`Date display changed: ${dateChanged} ("${initial.dateDisplay.replace(/\n/g,'|')}" → "${afterAllTime.dateDisplay.replace(/\n/g,'|')}")`);
  console.log(`Data state changed: ${dataChanged}`);

  if (initial.hasData && !afterAllTime.hasData && afterAllTime.noData) {
    console.log('✅ "All Time" → NO DATA FOUND (expected — Sep 2026 has no data)');
  } else if (!initial.hasData && !initial.noData) {
    console.log('ℹ️ Initial state already shows data');
  } else if (afterAllTime.hasData) {
    console.log('✅ "All Time" restored data');
  }

  await shot('04-final');
  console.log('\n✅ Test complete');
  await browser.close();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
