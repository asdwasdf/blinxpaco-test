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
    const path = `test-results/product-survey/batch32/obs-control-${String(step).padStart(2, '0')}-${label}.png`;
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

  await shot('01-baseline');

  // Find ALL interactive elements in the observation section
  const obsSection = await page.evaluate(() => {
    const body = document.body.innerText;
    const obsIdx = body.indexOf('CONSULTATION OBSERVATIONS');
    const nextIdx = body.indexOf('APPT. DURATION', obsIdx + 1);
    const section = body.slice(obsIdx, nextIdx > 0 ? nextIdx : obsIdx + 2000);
    return section;
  });
  console.log('CONSULTATION OBSERVATIONS section:\n', obsSection.slice(0, 800));

  // Find all clickable elements near observation chips
  const obsControls = await page.evaluate(() => {
    // Find elements containing observation-related text
    const all = Array.from(document.querySelectorAll('*'));
    const results: Array<{tag: string, text: string, ariaLabel: string, rect: string}> = [];

    all.forEach(el => {
      const text = el.textContent?.trim() || '';
      if (text.includes('Observation') && !text.includes('CONSULTATION')) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          results.push({
            tag: el.tagName,
            text: text.slice(0, 100),
            ariaLabel: (el as HTMLElement).ariaLabel || '',
            rect: `(${Math.round(rect.x)},${Math.round(rect.y)}) ${Math.round(rect.width)}×${Math.round(rect.height)}`,
          });
        }
      }
    });
    return results.slice(0, 30);
  });
  console.log('\nObservation-related elements:');
  obsControls.forEach(e => console.log(`  ${e.tag} "${e.text}" | ${e.ariaLabel ? `ariaLabel=${e.ariaLabel}` : ''} | ${e.rect}`));

  // Find all buttons/inputs near Y=186 (observation chip row)
  const nearObsChips = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const obsChips = chips.filter(c => {
      const r = c.getBoundingClientRect();
      return r.y > 150 && r.y < 250;
    });
    const results: Array<{tag: string, text: string, rect: string, classes: string}> = [];
    obsChips.forEach(c => {
      const r = c.getBoundingClientRect();
      // Find siblings and children
      const siblings = Array.from(c.parentElement?.children || []);
      results.push({
        tag: c.tagName,
        text: c.textContent?.trim().slice(0, 80) || '(empty)',
        rect: `(${Math.round(r.x)},${Math.round(r.y)}) ${Math.round(r.width)}×${Math.round(r.height)}`,
        classes: c.className.toString().slice(0, 200),
      });
    });
    return results;
  });
  console.log('\nObservation chip details:');
  nearObsChips.forEach(c => console.log(`  ${c.tag} "${c.text}" | ${c.rect} | ${c.classes.slice(0, 150)}`));

  // Check if there's a separate dropdown/combobox for selecting observations
  const searchOrDropdown = await page.evaluate(() => {
    const selectors = [
      'input[placeholder*="observation" i]',
      'input[placeholder*="Obs" i]',
      'input[placeholder*="search" i]',
      '[role="combobox"]',
      '[role="listbox"]',
      '[role="option"]',
    ];
    const results: Array<{selector: string, found: boolean, count: number, placeholder: string}> = [];
    selectors.forEach(sel => {
      const els = document.querySelectorAll(sel);
      results.push({
        selector: sel,
        found: els.length > 0,
        count: els.length,
        placeholder: els.length > 0 ? (els[0] as HTMLInputElement).placeholder : '',
      });
    });
    return results;
  });
  console.log('\nSearch/dropdown controls:');
  searchOrDropdown.forEach(r => console.log(`  ${r.selector}: found=${r.found} count=${r.count} placeholder="${r.placeholder}"`));

  // Get all unique text content in the obs section to find controls
  const allTextInObsSection = await page.evaluate(() => {
    // Get all text nodes near the CONSULTATION OBSERVATIONS area
    const body = document.body.innerText;
    const obsIdx = body.indexOf('CONSULTATION OBSERVATIONS');
    const nextIdx = body.indexOf('APPT. DURATION', obsIdx + 1);
    const section = body.slice(obsIdx, nextIdx > 0 ? nextIdx : undefined);
    // Get all words
    return section.split(/\s+/).filter(w => w.length > 0);
  });
  console.log('\nAll words in obs section:', allTextInObsSection.slice(0, 80).join(' '));

  // Scroll to observation section and find any buttons/controls
  await page.evaluate(() => {
    const body = document.body;
    const centerX = body.clientWidth / 2;
    const centerY = body.clientHeight / 2;
    // Try scrolling to the middle of the page where observations live
    window.scrollTo({ top: 100, behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  await shot('02-obs-section-scrolled');

  // Find all buttons in the observation section
  const obsButtons = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons
      .filter(b => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })
      .map(b => ({
        text: b.textContent?.trim() || '',
        ariaLabel: (b as HTMLButtonElement).ariaLabel || '',
        rect: (() => { const r = b.getBoundingClientRect(); return `(${Math.round(r.x)},${Math.round(r.y)}) ${Math.round(r.width)}×${Math.round(r.height)}`; })(),
      }))
      .filter(b => b.text.length > 0 || b.ariaLabel.length > 0);
  });
  console.log('\nAll visible buttons:');
  obsButtons.forEach(b => console.log(`  "${b.text}" | ariaLabel="${b.ariaLabel}" | ${b.rect}`));

  // Check the exact DOM structure of observation chips parent
  const obsParentStructure = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const obsChips = chips.filter(c => {
      const r = c.getBoundingClientRect();
      return r.y > 150 && r.y < 250;
    });
    if (obsChips.length === 0) return 'none found';
    const first = obsChips[0];
    const parent = first.parentElement;
    const grandParent = parent?.parentElement;
    return {
      chipTag: first.tagName,
      chipText: first.textContent?.trim(),
      parentTag: parent?.tagName,
      parentClasses: parent?.className.toString().slice(0, 100),
      grandParentTag: grandParent?.tagName,
      grandParentClasses: grandParent?.className.toString().slice(0, 100),
    };
  });
  console.log('\nObservation chip DOM structure:');
  console.log(JSON.stringify(obsParentStructure, null, 2));

  await shot('03-final');
  console.log('\n✅ Find obs control test complete');
  await browser.close();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
