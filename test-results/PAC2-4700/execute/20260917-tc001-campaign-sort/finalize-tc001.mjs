import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: Quick Send page missing');

const names = (await page.getByRole('treeitem').allTextContents())
  .map((value) => value.replace(/\s+/g, ' ').trim())
  .filter((value) => value && !/^Show \d+ more\.\.\.$/i.test(value));
const normalized = names.map((value) => value.toLocaleLowerCase('en-GB'));
const inversions = names.flatMap((value, index) => {
  if (!index) return [];
  return normalized[index - 1].localeCompare(normalized[index], 'en-GB', { numeric: true }) <= 0
    ? []
    : [{ index, previous: names[index - 1], current: value }];
});
const selectedSort = await page.locator('.sort-dropdown .p-dropdown-label').first().textContent();
const result = names.length >= 3 && inversions.length === 0 ? 'Pass' : names.length < 3 ? 'Inconclusive' : 'Fail';
const summary = {
  caseId: 'PAC2-4700-TC-001',
  app: 'PACO Connect → patient → Quick Send → Select Campaign',
  result,
  reason: result === 'Pass' ? `${names.length} visible campaigns sorted ascending` : result === 'Fail' ? `${inversions.length} ordering inversion(s)` : 'Fewer than 3 visible campaign rows',
  sort: { selected: selectedSort?.trim(), expected: 'A - Z' },
  campaignCountChecked: names.length,
  firstFive: names.slice(0, 5),
  lastFive: names.slice(-5),
  inversions,
  mutation: { class: 'Temporary', occurred: true, action: 'A–Z sort only' },
  sensitiveData: { persisted: false, screenshots: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '29-tc001-final-result.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
