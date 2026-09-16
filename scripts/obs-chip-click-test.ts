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
    const path = `test-results/product-survey/batch32/obs-click-${String(step).padStart(2, '0')}-${label}.png`;
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
    const obsDetail = text.match(/CONSULTATION OBSERVATIONS[\s\S]{0,500}/)?.[0].slice(0, 400) || '';
    return { obs, clin, dna, obsDetail };
  };

  const printMetrics = (label: string, m: Awaited<ReturnType<typeof getMetrics>>) => {
    console.log(`\n${label}:`);
    console.log(`  Clinician: "${m.clin}"`);
    console.log(`  DNA:       "${m.dna}"`);
    console.log(`  Obs:       "${m.obs}"`);
    console.log(`  Obs detail: ${m.obsDetail.slice(0, 150)}`);
  };

  await shot('01-baseline');
  const baseline = await getMetrics();
  printMetrics('Baseline', baseline);

  // Enumerate all observation chips with full details
  const obsChips = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const obsRow = chips.filter(c => {
      const rect = c.getBoundingClientRect();
      return rect.y > 100 && rect.y < 300; // Y ≈ 190
    });
    return obsRow.map(c => {
      const svg = c.querySelector('svg');
      return {
        text: c.textContent?.trim() || '',
        ariaLabel: (c as HTMLElement).ariaLabel || '',
        classes: Array.from(c.classList),
        hasSvg: !!svg,
        svgHtml: svg?.outerHTML?.slice(0, 100) || '',
        rect: (() => { const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.w, h: r.h }; })(),
      };
    });
  });
  console.log('\nObservation chips:');
  obsChips.forEach((c, i) => {
    console.log(`  [${i}] "${c.text}" | ariaLabel="${c.ariaLabel}" | svg=${c.hasSvg} | rect=(${c.rect.x},${c.rect.y}) ${c.rect.w}×${c.rect.h}`);
    console.log(`      svg: ${c.svgHtml}`);
    console.log(`      classes: ${c.classes.filter(c => c.includes('MuiChip') || c.includes('selected') || c.includes('outlined')).join(', ')}`);
  });

  // ── Click first observation chip (Blood Pressure) ─────────────
  console.log('\n\n═══ CLICKING BLOOD PRESSURE CHIP ═══');

  // First scroll to the observation section — find "CONSULTATION OBSERVATIONS" heading
  const obsHeading = page.locator('h2, h3', { hasText: 'CONSULTATION OBSERVATIONS' });
  const obsHeadingVisible = await obsHeading.isVisible().catch(() => false);
  console.log(`"CONSULTATION OBSERVATIONS" heading visible: ${obsHeadingVisible}`);
  if (obsHeadingVisible) {
    await obsHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }

  const bpChip = page.locator('.MuiChip-root', { hasText: 'blood pressure' }).first();
  const bpVisible = await bpChip.isVisible();
  console.log(`Blood Pressure chip visible after scroll: ${bpVisible}`);
  await shot('02-before-bp-click');

  // Get chip state before
  const bpStateBefore = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const bp = chips.find(c => c.textContent?.trim().toLowerCase().includes('blood pressure'));
    if (!bp) return null;
    return {
      classes: Array.from(bp.classList).filter(c => c.includes('selected') || c.includes('outlined')),
      ariaPressed: (bp as HTMLElement).ariaPressed || '',
      rect: (() => { const r = bp.getBoundingClientRect(); return { y: r.y, h: r.h }; })(),
    };
  });
  console.log(`BP chip state before: ${JSON.stringify(bpStateBefore)}`);

  // Click via JS to avoid scroll/overlay issues
  const clicked = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const bp = chips.find(c => c.textContent?.trim().toLowerCase().includes('blood pressure'));
    if (!bp) return false;
    (bp as HTMLElement).click();
    return true;
  });
  console.log(`BP chip clicked via JS: ${clicked}`);
  await page.waitForTimeout(1500);
  await shot('03-after-bp-click');

  const afterClick = await getMetrics();
  printMetrics('After BP click', afterClick);

  const bpStateAfter = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const bp = chips.find(c => c.textContent?.trim().toLowerCase().includes('blood pressure'));
    if (!bp) return null;
    return {
      classes: Array.from(bp.classList).filter(c => c.includes('selected') || c.includes('outlined')),
      ariaPressed: (bp as HTMLElement).ariaPressed || '',
    };
  });
  console.log(`BP chip state after: ${JSON.stringify(bpStateAfter)}`);

  // Click again to restore
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const bp = chips.find(c => c.textContent?.trim().toLowerCase().includes('blood pressure'));
    if (bp) (bp as HTMLElement).click();
  });
  await page.waitForTimeout(1500);
  await shot('04-after-bp-click-2');

  const afterRestore = await getMetrics();
  printMetrics('After BP restore click', afterRestore);

  // ── "Select All" behavior ─────────────────────────────────────
  console.log('\n\n═══ SELECT ALL / DESELECT ALL ═══');
  const selectAll = page.locator('.MuiChip-root', { hasText: 'Select All' });
  if (await selectAll.isVisible()) {
    console.log('"Select All" visible — clicking');
    await selectAll.click();
    await page.waitForTimeout(1500);
    await shot('05-after-select-all');

    const afterSelectAll = await getMetrics();
    printMetrics('After Select All', afterSelectAll);
  } else {
    const deselectAll = page.locator('.MuiChip-root', { hasText: 'Deselect All' });
    console.log('"Deselect All" visible — clicking');
    await deselectAll.click();
    await page.waitForTimeout(1500);
    await shot('05-after-deselect-all');

    const afterDeselectAll = await getMetrics();
    printMetrics('After Deselect All', afterDeselectAll);
  }

  await shot('06-final');
  console.log('\n✅ Obs chip click test complete');
  await browser.close();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
