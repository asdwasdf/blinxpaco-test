import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile missing');

const sortWidget = page.locator('.sort-dropdown').filter({ hasText: /By message type|By date|A\s*[–-]\s*Z/i }).first();
await sortWidget.waitFor({ state: 'visible', timeout: 10_000 });
await sortWidget.locator('[role="button"]').click();
const sortOptions = page.getByRole('option');
await sortOptions.first().waitFor({ state: 'visible', timeout: 10_000 });
const options = await sortOptions.allTextContents();
const az = sortOptions.filter({ hasText: /^A\s*[–-]\s*Z$/i }).first();
if (!(await az.isVisible().catch(() => false))) throw new Error(`Blocked: A–Z missing; options=${JSON.stringify(options)}`);
await az.click();
await page.waitForTimeout(300);
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const select = [...document.querySelectorAll('select')].find((element) => visible(element) && /A\s*[–-]\s*Z/i.test(element.innerText));
  const headers = [...document.querySelectorAll('[role="button"].campaign-option-category-header')].filter(visible);
  const rows = headers.flatMap((header) => {
    const category = clean(header.textContent);
    const parent = header.parentElement;
    const candidates = [...(parent?.querySelectorAll('button, [role="option"], li, [class*="campaign-option"]') || [])]
      .filter((element) => visible(element) && element !== header && !element.classList.contains('campaign-option-category-header'))
      .map((element) => clean(element.textContent))
      .filter((text) => text && text.length < 160);
    return [{ category, campaigns: [...new Set(candidates)] }];
  });
  return {
    selected: select?.selectedOptions?.[0]?.textContent?.trim(),
    options: [...(select?.options || [])].map((option) => clean(option.textContent)),
    categories: rows,
    pickerText: clean(headers[0]?.closest('[class*="campaign"]')?.textContent || '').slice(0, 5000),
  };
});

const allNames = state.categories.flatMap(({ campaigns }) => campaigns);
const normalized = allNames.map((value) => value.toLocaleLowerCase('en-GB'));
const globallySorted = normalized.length >= 2 && normalized.every((value, index) => index === 0 || normalized[index - 1].localeCompare(value, 'en-GB', { numeric: true }) <= 0);
const summary = {
  caseId: 'PAC2-4700-TC-001',
  app: 'PACO Connect → Quick Send',
  result: allNames.length < 2 ? 'Inconclusive' : globallySorted ? 'Pass' : 'Fail',
  reason: allNames.length < 2 ? 'A–Z selected; campaign rows not identified' : globallySorted ? 'Visible campaigns sorted ascending' : 'Visible campaigns are not globally sorted ascending',
  mutation: { class: 'Temporary', occurred: true, action: 'A–Z sort only' },
  sort: { selected: state.selected, options: state.options },
  campaignCountChecked: allNames.length,
  campaignNames: allNames,
  categories: state.categories.map(({ category, campaigns }) => ({ category, count: campaigns.length })),
  sensitiveData: { persisted: false, screenshots: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '28-tc001-connect-sort-result.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
