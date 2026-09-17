const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const ctx = browser.contexts()[0];
  const page = ctx.pages()[0];

  await page.goto('https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager');
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const btn = document.getElementById('discardFiltersModalBtn');
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent && b.textContent.includes('Create Campaign'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);

  // Fill Step 1
  await page.locator('input[placeholder="Enter Campaign Name"]').pressSequentially('Test Survey Campaign', { delay: 80 });
  await page.waitForTimeout(200);
  await page.locator('textarea[placeholder="Patient Facing Campaign Display Name"]').pressSequentially('Patient Survey Display', { delay: 80 });
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const $ = window.$;
    const descInput = document.querySelector('.campaign-description-input');
    if (descInput && $) $(descInput).trigger('input');
    window.newCampaignNameValid = true;
    const smsBtn = document.getElementById('newCampaignSmsBtn');
    if (smsBtn) smsBtn.click();
  });
  await page.waitForTimeout(300);

  await page.evaluate(() => {
    const next = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Next');
    if (next) next.click();
  });
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    if (typeof window.goToCampaignCreatorStep === 'function') {
      window.goToCampaignCreatorStep('PATIENT_LIST');
    }
  });
  await page.waitForTimeout(5000);

  // Hide loader
  await page.evaluate(() => {
    const loader = document.querySelector('.blinx-loader');
    if (loader) loader.style.display = 'none';
  });
  await page.waitForTimeout(500);

  // Full Patient List analysis
  const plFull = await page.evaluate(() => {
    // All inputs
    const inputs = [...document.querySelectorAll('input')].filter(i => {
      if (i.offsetHeight === 0) return false;
      if (window.getComputedStyle(i).visibility === 'hidden') return false;
      return true;
    }).map(i => ({
      placeholder: i.placeholder,
      type: i.type,
      role: i.getAttribute('role'),
      ariaAutocomplete: i.getAttribute('aria-autocomplete'),
      id: i.id,
      name: i.name
    }));

    // All Tail Selects
    const tailSelects = [...document.querySelectorAll('.tail-select')].filter(ts => {
      if (ts.offsetHeight === 0) return false;
      if (window.getComputedStyle(ts).visibility === 'hidden') return false;
      return true;
    }).map(ts => ({
      id: ts.id || ts.className,
      text: ts.innerText.slice(0, 80)
    }));

    // Check for MUI components
    const mui = [...document.querySelectorAll('[class*=Mui]')];

    // Table info
    const agGrid = document.querySelector('.ag-root-wrapper');
    const agCells = document.querySelectorAll('.ag-cell');
    const agRows = document.querySelectorAll('.ag-row');

    return { inputs, tailSelects, muiCount: mui.length, hasAgGrid: !!agGrid, cellCount: agCells.length, rowCount: agRows.length };
  });
  console.log('PL Full analysis:', JSON.stringify(plFull, null, 2));

  // Navigate to Review step
  await page.evaluate(() => {
    if (typeof window.goToCampaignCreatorStep === 'function') {
      window.goToCampaignCreatorStep('REVIEW');
    }
  });
  await page.waitForTimeout(5000);

  // Hide loader
  await page.evaluate(() => {
    const loader = document.querySelector('.blinx-loader');
    if (loader) loader.style.display = 'none';
  });
  await page.waitForTimeout(500);

  const reviewBody = await page.evaluate(() => document.body.innerText);
  console.log('\nReview step body:\n', reviewBody.slice(0, 4000));

  // Review step inputs
  const reviewInputs = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input')].filter(i => {
      if (i.offsetHeight === 0) return false;
      if (window.getComputedStyle(i).visibility === 'hidden') return false;
      return true;
    }).map(i => ({
      placeholder: i.placeholder,
      type: i.type,
      role: i.getAttribute('role'),
      ariaAutocomplete: i.getAttribute('aria-autocomplete'),
      id: i.id
    }));
    const tailSelects = [...document.querySelectorAll('.tail-select')].filter(ts => {
      if (ts.offsetHeight === 0) return false;
      return true;
    }).map(ts => ({ id: ts.id || '', text: ts.innerText.slice(0, 80) }));
    return { inputs, tailSelects };
  });
  console.log('\nReview inputs:', JSON.stringify(reviewInputs, null, 2));

  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
