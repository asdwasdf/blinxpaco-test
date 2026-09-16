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
    const path = `test-results/product-survey/batch32/cd-${String(step).padStart(2, '0')}-${label}.png`;
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

  // ── PART 1: "5 Clinicians Selected" EXPAND ─────────────────
  console.log('\n\n═══ PART 1: CLINICIANS SELECTED EXPAND ═══');

  // Find "Clinicians Selected" element
  const clinExpandEl = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    for (const el of all) {
      if (el.textContent?.trim() === 'Clinicians Selected') {
        return { tag: el.tagName, classes: el.className.toString().slice(0, 200) };
      }
    }
    return null;
  });
  console.log(`"Clinicians Selected" element: ${JSON.stringify(clinExpandEl)}`);

  // Scroll to Clinicians section (role chips are at Y≈410)
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }));
  await page.waitForTimeout(500);

  const clinTextEl = page.locator('text=Clinicians Selected');
  const clinVisible = await clinTextEl.isVisible().catch(() => false);
  console.log(`"Clinicians Selected" visible after scroll: ${clinVisible}`);
  await shot('02-before-clin-expand');

  if (clinVisible) {
    await clinTextEl.click();
    await page.waitForTimeout(1000);
    await shot('03-after-clin-expand');

    const expandedText = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      for (const el of all) {
        if (el.textContent?.trim() === 'Clinicians Selected') {
          const parent = el.parentElement;
          const grandparent = parent?.parentElement;
          return {
            parentText: parent?.textContent?.trim().slice(0, 300),
            grandText: grandparent?.textContent?.trim().slice(0, 300),
          };
        }
      }
      return null;
    });
    console.log('After click:', JSON.stringify(expandedText, null, 2));
  }

  // ── PART 2: "5 Sessions Selected" EXPAND ────────────────────
  console.log('\n\n═══ PART 2: SESSIONS SELECTED EXPAND ═══');

  // Sessions chips are at Y≈560 (below fold)
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
  await page.waitForTimeout(500);

  const sessionsText = page.locator('text=Sessions Selected');
  const sessionsVisible = await sessionsText.isVisible().catch(() => false);
  console.log(`"Sessions Selected" visible after scroll: ${sessionsVisible}`);
  await shot('04-before-sessions-expand');

  if (sessionsVisible) {
    await sessionsText.click();
    await page.waitForTimeout(1000);
    await shot('05-after-sessions-expand');

    const sessionDetails = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      for (const el of all) {
        if (el.textContent?.trim() === 'Sessions Selected') {
          const parent = el.parentElement;
          const grandparent = parent?.parentElement;
          return {
            parentText: parent?.textContent?.trim().slice(0, 300),
            parentHTML: parent?.innerHTML?.slice(0, 500) || '',
          };
        }
      }
      return null;
    });
    console.log('Session expand:', JSON.stringify(sessionDetails, null, 2));
  }

  // ── PART 3: CARD INFO BUTTONS ───────────────────────────────
  console.log('\n\n═══ PART 3: CARD INFO BUTTONS ═══');

  // Scroll back to top for info buttons
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);

  const infoButtons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('[aria-label*="This card is an overview"]'));
    return btns.map(b => ({
      ariaLabel: (b as HTMLElement).ariaLabel?.slice(0, 100) || '',
      rect: (() => { const r = b.getBoundingClientRect(); return `(${Math.round(r.x)},${Math.round(r.y)}) ${Math.round(r.width)}×${Math.round(r.height)}`; })(),
    }));
  });
  console.log(`\nInfo buttons: ${infoButtons.length}`);
  infoButtons.forEach(b => console.log(`  "${b.ariaLabel.slice(0, 60)}..." | ${b.rect}`));

  if (infoButtons.length > 0) {
    const firstInfo = page.locator('[aria-label*="This card is an overview"]').first();
    await firstInfo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await firstInfo.click();
    await page.waitForTimeout(800);
    await shot('06-after-info-click');

    const infoPopup = await page.evaluate(() => {
      const popups = Array.from(document.querySelectorAll('[role="dialog"], [role="tooltip"], [class*="popover"], [class*="info"], [class*="tooltip"]'));
      return popups.map(p => ({
        tag: p.tagName,
        classes: p.className.toString().slice(0, 100),
        text: p.textContent?.trim().slice(0, 200),
        rect: (() => { const r = p.getBoundingClientRect(); return `(${Math.round(r.x)},${Math.round(r.y)}) ${Math.round(r.width)}×${Math.round(r.height)}`; })(),
      })).filter(p => p.rect.includes('0') === false);
    });
    console.log(`Popups/tooltips after click: ${infoPopup.length}`);
    infoPopup.slice(0, 3).forEach(p => console.log(`  ${p.tag} "${p.text.slice(0, 80)}" | ${p.rect}`));

    // Close the popup
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // ── PART 4: CHART INTERACTION ────────────────────────────────
  console.log('\n\n═══ PART 4: CHART INTERACTION ═══');

  // Scroll to a chart and find interactive chart elements
  const chartContainers = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg'));
    const chartSvgs = svgs.filter(s => {
      const pathCount = s.querySelectorAll('path').length;
      const rectCount = s.querySelectorAll('rect').length;
      return pathCount > 5 || rectCount > 10;
    });
    return chartSvgs.map(s => ({
      className: s.className?.baseVal || '',
      pathCount: s.querySelectorAll('path').length,
      rectCount: s.querySelectorAll('rect').length,
      rect: (() => { const r = s.getBoundingClientRect(); return `(${Math.round(r.x)},${Math.round(r.y)}) ${Math.round(r.width)}×${Math.round(r.height)}`; })(),
    }));
  });
  console.log(`\nChart SVGs: ${chartContainers.length}`);
  chartContainers.slice(0, 5).forEach(c => console.log(`  ${c.className} paths=${c.pathCount} rects=${c.rectCount} | ${c.rect}`));

  // Find clickable chart elements
  const chartClickables = await page.evaluate(() => {
    const clickables = Array.from(document.querySelectorAll('svg path, svg rect, svg circle'));
    return clickables.slice(0, 10).map(c => ({
      tag: c.tagName,
      className: c.className?.baseVal || c.className || '',
      fill: (c as SVGElement).getAttribute('fill') || '',
      stroke: (c as SVGElement).getAttribute('stroke') || '',
    }));
  });
  console.log(`\nChart clickable elements:`, JSON.stringify(chartClickables.slice(0, 5), null, 2));

  // Scroll to chart area
  const apptDurationHeading = page.locator('text=APPT. DURATION');
  if (await apptDurationHeading.isVisible().catch(() => false)) {
    await apptDurationHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await shot('07-chart-area');
  }

  // ── PART 5: MORE OPTIONS MENU ────────────────────────────────
  console.log('\n\n═══ PART 5: MORE OPTIONS MENU ═══');

  const moreOptions = page.locator('[aria-label="More options"]');
  const moreVisible = await moreOptions.isVisible().catch(() => false);
  console.log(`"More options" visible: ${moreVisible}`);
  await shot('08-before-more-options');

  if (moreVisible) {
    await moreOptions.click();
    await page.waitForTimeout(800);
    await shot('09-more-options-open');

    const menuItems = await page.evaluate(() => {
      const menus = Array.from(document.querySelectorAll('[role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'));
      return menus.map(m => ({
        role: m.getAttribute('role'),
        text: m.textContent?.trim().slice(0, 100),
        ariaLabel: (m as HTMLElement).ariaLabel || '',
        disabled: (m as HTMLElement).disabled || false,
      }));
    });
    console.log(`\nMenu items (${menuItems.length}):`);
    menuItems.forEach(m => console.log(`  role="${m.role}" "${m.text}" ariaLabel="${m.ariaLabel}" disabled=${m.disabled}`));

    // Close menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // ── PART 6: APPOINTMENT TYPE CHIPS ─────────────────────────
  console.log('\n\n═══ PART 6: APPOINTMENT TYPE CHIPS ═══');

  // Appointment chips are at Y≈560
  const apptChips = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
    const apptRow = chips.filter(c => {
      const r = c.getBoundingClientRect();
      return r.y > 400 && r.y < 700;
    });
    return apptRow.map(c => ({
      text: c.textContent?.trim() || '',
      hasDelete: !!c.querySelector('[class*="deleteIcon"]'),
      classes: Array.from(c.classList).filter(cl => cl.includes('selected') || cl.includes('outlined')).join(', ') || 'none',
    }));
  });
  console.log(`\nAppointment type chips:`);
  apptChips.forEach(c => console.log(`  "${c.text}" delete=${c.hasDelete} selected=${c.classes}`));

  // Remove one appointment chip
  if (apptChips.length > 0) {
    const firstApptChip = apptChips.find(c => c.hasDelete);
    if (firstApptChip) {
      const removed = await page.evaluate(() => {
        const chips = Array.from(document.querySelectorAll('.MuiChip-root'));
        const apptRow = chips.filter(c => {
          const r = c.getBoundingClientRect();
          return r.y > 400 && r.y < 700;
        });
        const first = apptRow.find(c => c.querySelector('[class*="deleteIcon"]'));
        if (!first) return 'not found';
        const del = first.querySelector('[class*="deleteIcon"]') as HTMLElement;
        del.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        return first.textContent?.trim() || '';
      });
      console.log(`Removed appointment chip: "${removed}"`);
      await page.waitForTimeout(1500);
      await shot('10-after-appt-remove');
    }
  }

  // ── PART 7: CARD HEADINGS & EXPAND ─────────────────────────
  console.log('\n\n═══ PART 7: CARD EXPANSION STATE ═══');

  // Check for expand/collapse buttons in card headers
  const cardExpandControls = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3, h4'));
    return headings.map(h => ({
      tag: h.tagName,
      text: h.textContent?.trim() || '',
      classes: h.className.toString().slice(0, 100),
      hasClickHandler: !!(h as HTMLElement).onclick,
    }));
  });
  console.log(`\nCard headings:`);
  cardExpandControls.forEach(h => console.log(`  ${h.tag} "${h.text}" class=${h.classes.slice(0, 80)} onclick=${h.hasClickHandler}`));

  // Check for expand buttons near card headers
  const expandBtns = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.map(b => ({
      text: b.textContent?.trim().slice(0, 50),
      ariaLabel: (b as HTMLButtonElement).ariaLabel || '',
      ariaExpanded: (b as HTMLButtonElement).ariaExpanded || '',
    })).filter(b => b.text || b.ariaLabel);
  });
  console.log(`\nAll labeled buttons:`);
  expandBtns.slice(0, 20).forEach(b => console.log(`  text="${b.text}" ariaLabel="${b.ariaLabel}" ariaExpanded="${b.ariaExpanded}"`));

  await shot('11-final');
  console.log('\n✅ Card/chart interaction test complete');
  await browser.close();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
