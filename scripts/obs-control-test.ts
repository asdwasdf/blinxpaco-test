import { chromium } from 'playwright';

const BASE = 'https://blinx.dev.blinxpaco-np.com';

async function main() {
  console.log('Connecting...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0]?.pages()[0] || await browser.newPage();

  await page.goto(`${BASE}/capacity-demand/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.innerText.includes('CLINICIAN CAPACITY'), { timeout: 20000 });
  console.log('✅ SPA mounted');

  let step = 0;
  const shot = async (label: string) => {
    step++;
    const path = `test-results/product-survey/batch32/obs-ctrl-${String(step).padStart(2, '0')}-${label}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`📸 ${path}`);
  };

  // Reset to All Time
  await page.evaluate(() => {
    (document.querySelector('.date-range-picker__input-field--outline') as HTMLElement)?.click();
  });
  await page.waitForTimeout(800);
  await page.locator('.rdrStaticRange', { hasText: 'All Time' }).click();
  await page.waitForTimeout(500);
  if (await page.locator('button', { hasText: 'Apply' }).isVisible().catch(() => false)) {
    await page.locator('button', { hasText: 'Apply' }).click();
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const mo = document.querySelector('.modal-overlay') as HTMLElement | null;
    if (mo) mo.style.display = 'none';
  });
  await page.waitForTimeout(300);

  const getMetrics = async () => {
    const text = await page.evaluate(() => document.body.innerText);
    const obs = text.match(/(\d+)\s+Observations?\s+Selected/)?.[0] || '';
    const clin = text.match(/(\d+)\s+Booked Appt\.\s+of\s+(\d+)\s+Total Appt\./)?.[0] || '';
    const dna = text.match(/(\d+)\s+DNA.*?\(?([\d.]+)%\s+loss\)?/s)?.[0] || '';
    const obsDetail = text.match(/CONSULTATION OBSERVATIONS[\s\S]{0,600}/)?.[0].slice(0, 400) || '';
    return { obs, clin, dna, obsDetail };
  };

  const printMetrics = (label: string, m: Awaited<ReturnType<typeof getMetrics>>) => {
    console.log(`\n${label}:`);
    console.log(`  Clinician: "${m.clin}"`);
    console.log(`  DNA:       "${m.dna}"`);
    console.log(`  Obs:       "${m.obs}"`);
    console.log(`  Obs detail: ${m.obsDetail.slice(0, 200)}`);
  };

  await shot('01-baseline');
  const baseline = await getMetrics();
  printMetrics('Baseline', baseline);

  // ── PART 1: REMOVE OBSERVATION CHIP (click X) ──────────────────
  console.log('\n\n═══ PART 1: REMOVE OBSERVATION (click X / delete icon) ═══');

  // Find the delete icon inside the Blood Pressure chip
  const deleteIconClicked = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const bp = chips.find(c => c.textContent?.trim().toLowerCase().includes('blood pressure'));
    if (!bp) return 'chip not found';
    const deleteIcon = bp.querySelector('[class*="deleteIcon"]') as HTMLElement | null;
    if (!deleteIcon) return 'delete icon not found';
    deleteIcon.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    return 'clicked';
  });
  console.log(`Delete icon click result: ${deleteIconClicked}`);
  await page.waitForTimeout(1500);
  await shot('02-after-delete-bp');

  const afterDelete = await getMetrics();
  printMetrics('After BP delete', afterDelete);

  // ── PART 2: SEARCH + ADD OBSERVATION ───────────────────────────
  console.log('\n\n═══ PART 2: SEARCH + ADD OBSERVATION ═══');

  // Find the observation search combobox
  const obsSearch = page.locator('input[placeholder="Search observation"]');
  const obsSearchVisible = await obsSearch.isVisible().catch(() => false);
  console.log(`Observation search input visible: ${obsSearchVisible}`);

  if (obsSearchVisible) {
    // Click to focus
    await obsSearch.click();
    await page.waitForTimeout(300);
    await shot('03-obs-search-focused');

    // Type "blood" to search
    await obsSearch.type('blood');
    await page.waitForTimeout(500);
    await shot('04-obs-search-typing');

    // Check for dropdown options
    const searchResults = await page.evaluate(() => {
      const input = document.querySelector('input[placeholder="Search observation"]') as HTMLInputElement;
      if (!input) return [];
      // PrimeReact combobox typically shows options in a dropdown
      const dropdown = document.querySelector('[role="listbox"], [class*="p-combobox"], [class*="combobox"]');
      if (!dropdown) return [];
      const items = Array.from(dropdown.querySelectorAll('[role="option"], [class*="option"]'));
      return items.map(i => ({
        text: i.textContent?.trim() || '',
        role: i.getAttribute('role') || '',
      }));
    });
    console.log(`Search results: ${JSON.stringify(searchResults)}`);

    // Press Enter or click first result
    await obsSearch.press('Enter');
    await page.waitForTimeout(500);

    // Clear search
    await obsSearch.clear();
    await page.waitForTimeout(300);

    const afterAdd = await getMetrics();
    printMetrics('After re-adding BP', afterAdd);
  } else {
    // Try clicking the "Open" button found earlier (aria-label="Open")
    const openBtn = page.locator('[aria-label="Open"]');
    const openVisible = await openBtn.isVisible().catch(() => false);
    console.log(`"Open" button visible: ${openVisible}`);
    if (openVisible) {
      await openBtn.click();
      await page.waitForTimeout(500);
      await shot('05-obs-dropdown-open');
    }
  }

  // ── PART 3: OBSERVATION COMBOBOX INTERACTION ─────────────────
  console.log('\n\n═══ PART 3: OBSERVATION COMBOBOX DETAILS ═══');

  // Get full combobox state
  const comboboxInfo = await page.evaluate(() => {
    const input = document.querySelector('input[placeholder="Search observation"]') as HTMLInputElement;
    if (!input) return null;
    const wrapper = input.closest('[class*="chip"], [class*="observation"], [class*="combo"]');
    return {
      value: input.value,
      placeholder: input.placeholder,
      disabled: input.disabled,
      ariaExpanded: input.getAttribute('aria-expanded'),
      ariaOwns: input.getAttribute('aria-owns'),
      wrapperClasses: wrapper ? wrapper.className.toString().slice(0, 200) : 'not found',
      parentClasses: wrapper?.parentElement?.className.toString().slice(0, 200) || '',
    };
  });
  console.log(`Combobox info: ${JSON.stringify(comboboxInfo, null, 2)}`);

  // Try clicking the input and typing
  if (obsSearchVisible) {
    await obsSearch.click();
    await page.waitForTimeout(300);

    // Type something and wait for dropdown
    await obsSearch.type('pulse');
    await page.waitForTimeout(1000);
    await shot('06-obs-search-pulse');

    // Get dropdown options after typing
    const pulseResults = await page.evaluate(() => {
      const options: Array<{text: string, rect: string}> = [];
      // Look for various dropdown patterns
      const patterns = [
        '[role="listbox"]',
        '[class*="p-component-listbox"]',
        '[class*="listbox"]',
        '[class*="dropdown"]',
        '[class*="suggestion"]',
      ];
      patterns.forEach(sel => {
        const els = document.querySelectorAll(sel);
        els.forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            const items = Array.from(el.querySelectorAll('[role="option"], li, [class*="option"]'));
            items.forEach(item => {
              const itemR = item.getBoundingClientRect();
              if (itemR.width > 0) {
                options.push({
                  text: item.textContent?.trim().slice(0, 100) || '',
                  rect: `(${Math.round(itemR.x)},${Math.round(itemR.y)}) ${Math.round(itemR.width)}×${Math.round(itemR.height)}`,
                });
              }
            });
          }
        });
      });
      return options;
    });
    console.log(`Dropdown options: ${JSON.stringify(pulseResults)}`);

    await obsSearch.clear();
    await page.waitForTimeout(300);
  }

  // ── PART 4: REMOVE ANOTHER OBSERVATION ──────────────────────
  console.log('\n\n═══ PART 4: REMOVE PULSE RATE ═══');

  // Click the X on Pulse rate chip
  const pulseDeleted = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const pulse = chips.find(c => c.textContent?.trim().toLowerCase().includes('pulse'));
    if (!pulse) return 'not found';
    const del = pulse.querySelector('[class*="deleteIcon"]') as HTMLElement | null;
    if (del) { del.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); return 'deleted'; }
    return 'no delete icon';
  });
  console.log(`Pulse delete: ${pulseDeleted}`);
  await page.waitForTimeout(1500);
  await shot('07-after-delete-pulse');

  const afterPulseDelete = await getMetrics();
  printMetrics('After Pulse delete', afterPulseDelete);

  // Re-add it
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const pulse = chips.find(c => c.textContent?.trim().toLowerCase().includes('pulse'));
    if (!pulse) return;
    const del = pulse.querySelector('[class*="deleteIcon"]') as HTMLElement | null;
    if (del) del.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(1500);

  await shot('08-final');
  const finalState = await getMetrics();
  printMetrics('Final', finalState);

  console.log('\n\n═══ SUMMARY ═══');
  console.log(`Baseline obs: "${baseline.obs}"`);
  console.log(`After BP delete: "${afterDelete.obs}"`);
  console.log(`After Pulse delete: "${afterPulseDelete.obs}"`);
  const bpChanged = baseline.obs !== afterDelete.obs;
  const pulseChanged = afterDelete.obs !== afterPulseDelete.obs;
  console.log(`BP delete changed obs count: ${bpChanged} (was "${baseline.obs}" → now "${afterDelete.obs}")`);
  console.log(`Pulse delete changed obs count: ${pulseChanged} (was "${afterDelete.obs}" → now "${afterPulseDelete.obs}")`);

  if (bpChanged) console.log('✅ Observation chips are removable (clicking X works)');
  else console.log('⚠️  Observation chips did NOT change after delete click');

  console.log('\n✅ Obs control test complete');
  await browser.close();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
