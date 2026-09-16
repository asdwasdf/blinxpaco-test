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
    const path = `test-results/product-survey/batch32/obs-toggle-${String(step).padStart(2, '0')}-${label}.png`;
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
    const cal = document.querySelector('.rdrCalendarWrapper, .modal-container-date-range') as HTMLElement | null;
    if (cal) cal.style.display = 'none';
  });
  await page.waitForTimeout(300);

  const getMetrics = async () => {
    const text = await page.evaluate(() => document.body.innerText);
    const obsMatch = text.match(/(\d+)\s+Observations?\s+Selected/);
    const obsText = text.match(/CONSULTATION OBSERVATIONS[\s\S]{0,200}/)?.[0].slice(0, 300) || '';
    const dnaText = text.match(/(\d+)\s+DNA.*?\(?([\d.]+)%\s+loss\)?/s)?.[0] || '';
    const clinText = text.match(/(\d+)\s+Booked Appt\.\s+of\s+(\d+)\s+Total Appt\./)?.[0] || '';
    return { obs: obsMatch?.[0] || '', obsText, dna: dnaText, clin: clinText };
  };

  const getChipRows = async () => {
    return page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
      const byY = new Map<number, typeof chips>();
      chips.forEach(c => {
        const y = Math.round(c.getBoundingClientRect().y / 10) * 10;
        if (!byY.has(y)) byY.set(y, []);
        byY.get(y)!.push(c);
      });
      return Array.from(byY.entries()).map(([y, cs]) => ({
        y,
        chips: cs.map(c => ({
          text: c.textContent?.trim() || '',
          hasDeleteIcon: !!c.querySelector('.MuiChip-deleteIcon'),
          classes: c.className.toString(),
        })),
      })).sort((a, b) => a.y - b.y);
    });
  };

  await shot('01-baseline');
  const baseline = await getMetrics();
  const baselineRows = await getChipRows();
  console.log('\nBaseline:');
  console.log(`  Clinician: "${baseline.clin}"`);
  console.log(`  DNA:       "${baseline.dna}"`);
  console.log(`  Obs:       "${baseline.obs}"`);
  console.log(`  Obs section: ${baseline.obsText.slice(0, 100)}`);
  console.log('\nChip rows:');
  baselineRows.forEach(r => {
    console.log(`  Y≈${r.y}: ${r.chips.map(c => `"${c.text}"${c.hasDeleteIcon ? ' [has X]' : ''}`).join(', ')}`);
  });

  // ── PART 1: DESELECT ALL ──────────────────────────────────────
  console.log('\n\n═══ PART 1: DESELECT ALL ═══');
  await shot('02-before-deselect-all');

  const deselectAll = page.locator('.MuiChip-root', { hasText: 'Deselect All' });
  const deselectVisible = await deselectAll.isVisible();
  console.log(`"Deselect All" visible: ${deselectVisible}`);
  if (deselectVisible) {
    await deselectAll.click();
    await page.waitForTimeout(1500);
    await shot('03-after-deselect-all');

    const afterDeselect = await getMetrics();
    const afterRows = await getChipRows();
    console.log('\nAfter Deselect All:');
    console.log(`  Clinician: "${afterDeselect.clin}"`);
    console.log(`  Obs:       "${afterDeselect.obs}"`);
    console.log('\nChip rows after deselect:');
    afterRows.forEach(r => {
      console.log(`  Y≈${r.y}: ${r.chips.map(c => `"${c.text}"${c.hasDeleteIcon ? ' [has X]' : ''}`).join(', ')}`);
    });
  }

  // ── PART 2: REMOVE SPECIFIC OBSERVATION CHIP ─────────────────
  console.log('\n\n═══ PART 2: REMOVE OBSERVATION CHIP ═══');

  // Find observation chips (they have delete icons and non-empty text)
  const obsRows = await getChipRows();
  // Row with observations is Y≈190 or nearby
  const obsRow = obsRows.find(r => r.chips.some(c => c.hasDeleteIcon && c.text.includes('blood pressure')));
  console.log(`Observation row Y: ${obsRow?.y}`);
  if (obsRow) {
    const obsChip = obsRow.chips.find(c => c.text.includes('blood pressure'));
    console.log(`Blood pressure chip: "${obsChip?.text}", has X: ${obsChip?.hasDeleteIcon}`);

    // Click the delete icon inside the chip
    const bpChipIndex = baselineRows
      .find(r => r.y === obsRow.y)
      ?.chips.findIndex(c => c.text.includes('blood pressure')) ?? -1;

    if (bpChipIndex >= 0) {
      // Get the chip's row index to find nth chip
      const allChips = page.locator('.MuiChip-root');
      const allChipsCount = await allChips.count();

      // Find the chip element and its delete icon
      const deleteIconClicked = await page.evaluate((idx) => {
        const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
        const chip = chips[idx];
        if (!chip) return false;
        const deleteIcon = chip.querySelector('.MuiChip-deleteIcon') as HTMLElement | null;
        if (deleteIcon) {
          deleteIcon.click();
          return true;
        }
        return false;
      }, 0);

      console.log(`Delete icon clicked via JS: ${deleteIconClicked}`);
      await page.waitForTimeout(1500);
      await shot('04-after-remove-bp');

      const afterRemove = await getMetrics();
      console.log('\nAfter removing Blood Pressure:');
      console.log(`  Obs: "${afterRemove.obs}"`);
      console.log(`  Obs section: ${afterRemove.obsText.slice(0, 200)}`);

      // Re-add it — click the chip itself (not the delete icon)
      const bpChip = page.locator('.MuiChip-root', { hasText: 'blood pressure' });
      if (await bpChip.isVisible().catch(() => false)) {
        await bpChip.click();
        await page.waitForTimeout(1500);
        await shot('05-after-readd-bp');
      } else {
        console.log('BP chip not visible after removal — may have been fully deselected');
        await page.waitForTimeout(500);
      }
    }
  }

  // ── PART 3: APPOINTMENT TYPE CHIPS ────────────────────────────
  console.log('\n\n═══ PART 3: APPOINTMENT TYPE CHIPS ═══');
  const apptRow = await getChipRows();
  apptRow.forEach(r => {
    console.log(`  Y≈${r.y}: ${r.chips.map(c => `"${c.text}"`).join(', ')}`);
  });

  // ── PART 4: CARD EXPAND/COLLAPSE ────────────────────────────
  console.log('\n\n═══ PART 4: CARD EXPANSION TEST ═══');

  // Click "More options" button
  const moreOptions = page.locator('[aria-label="More options"]');
  const moreOptionsVisible = await moreOptions.isVisible().catch(() => false);
  console.log(`"More options" visible: ${moreOptionsVisible}`);
  if (moreOptionsVisible) {
    await moreOptions.click();
    await page.waitForTimeout(800);
    await shot('06-more-options-open');

    const menuItems = await page.evaluate(() => {
      const menus = Array.from(document.querySelectorAll('[role="menu"], [role="menuitem"], [role="menuitemcheckbox"]'));
      return menus.map(m => ({
        role: m.getAttribute('role'),
        text: m.textContent?.trim().slice(0, 80),
        ariaLabel: (m as HTMLElement).ariaLabel || '',
      })).slice(0, 20);
    });
    console.log(`Menu items:`, JSON.stringify(menuItems, null, 2));
  }

  // Close menu
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // ── PART 5: "5 Clinicians Selected" EXPAND ───────────────────
  console.log('\n\n═══ PART 5: CLINICIANS SELECTED EXPAND ═══');
  const clinExpand = page.locator('text=Clinicians Selected');
  const clinExpandVisible = await clinExpand.isVisible().catch(() => false);
  console.log(`"Clinicians Selected" visible: ${clinExpandVisible}`);
  if (clinExpandVisible) {
    await clinExpand.click();
    await page.waitForTimeout(800);
    await shot('07-clinicians-expanded');

    const expandedContent = await page.evaluate(() => {
      const text = document.body.innerText;
      const idx = text.indexOf('Clinicians Selected');
      return text.slice(idx, idx + 500);
    });
    console.log(`Expanded content: "${expandedContent.slice(0, 200)}"`);
  }

  await shot('08-final');
  console.log('\n✅ Obs toggle test complete');
  await browser.close();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
