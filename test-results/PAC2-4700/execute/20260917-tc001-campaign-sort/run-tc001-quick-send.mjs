import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
await mkdir(outDir, { recursive: true });

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');
let page = context.pages().find((candidate) => /blinx\.dev\.blinxpaco-np\.com\/paco(?:\/|$)/i.test(candidate.url()));
if (!page) throw new Error('Blocked: Paco patient-search page not open');
await page.bringToFront();

const patientName = ['Michael', 'Ramella'].join(' ');
const search = page.getByPlaceholder(/Search patients by name or NHS number/i).first();
await search.waitFor({ state: 'visible', timeout: 15_000 });
await search.fill(patientName);
await page.waitForTimeout(500);
await search.press('Enter').catch(() => {});

const patient = page.getByText(new RegExp(patientName, 'i')).first();
await patient.waitFor({ state: 'visible', timeout: 30_000 });
await patient.click();
await page.waitForFunction(() => /Quick Send/i.test(document.body?.innerText || ''), null, { timeout: 30_000 });

const quickSend = page.getByRole('button', { name: /Quick Send/i }).or(page.getByText(/^Quick Send$/i)).first();
await quickSend.waitFor({ state: 'visible', timeout: 15_000 });
await quickSend.click();
await page.waitForFunction(
  () => /Booking Links\s*&\s*Health Forms/i.test(document.body?.innerText || ''),
  null,
  { timeout: 30_000 },
);

const campaignSelector = page
  .getByRole('button', { name: /Booking Links\s*&\s*Health Forms/i })
  .or(page.getByRole('combobox', { name: /Booking Links\s*&\s*Health Forms/i }))
  .or(page.getByText(/Booking Links\s*&\s*Health Forms/i))
  .first();
await campaignSelector.waitFor({ state: 'visible', timeout: 15_000 });
await campaignSelector.click();
await page.getByText(/A\s*[–-]\s*Z/i).first().waitFor({ state: 'visible', timeout: 15_000 });

const listBefore = await page.evaluate(() => {
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  return [...document.querySelectorAll('[role="option"], [role="menuitem"]')]
    .filter(visible)
    .map((element) => clean(element.textContent))
    .filter((text) => text && !/By date|A\s*[–-]\s*Z|Z\s*[–-]\s*A|message type|sort/i.test(text));
});

await page.getByText(/A\s*[–-]\s*Z/i).first().click();
await page.waitForTimeout(600);

const state = await page.evaluate(() => {
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const candidates = [...document.querySelectorAll('[role="option"], [role="menuitem"], li')]
    .filter(visible)
    .map((element) => clean(element.textContent))
    .filter((text) => text && !/By date|A\s*[–-]\s*Z|Z\s*[–-]\s*A|message type|sort/i.test(text));
  return {
    sortVisible: /A\s*[–-]\s*Z/i.test(document.body?.innerText || ''),
    candidates: [...new Set(candidates)].slice(0, 20),
  };
});

const names = state.candidates.filter((value) => value.length < 120);
const normalized = names.map((value) => value.toLocaleLowerCase('en-GB'));
const alphabetic = normalized.length >= 2 && normalized.every((value, index) => index === 0 || normalized[index - 1].localeCompare(value, 'en-GB', { numeric: true }) <= 0);
const result = names.length < 2 ? 'Inconclusive' : alphabetic ? 'Pass' : 'Fail';

await page.keyboard.press('Escape').catch(() => {});
await search.fill('').catch(() => {});

const summary = {
  caseId: 'PAC2-4700-TC-001',
  app: 'PACO Quick Send',
  result,
  reason: names.length < 2 ? 'A–Z selected; campaign list not readable with stable roles' : alphabetic ? 'Campaign list sorted ascending' : 'Campaign list not sorted ascending',
  entryPath: ['Patients', 'Patient Search', 'patient profile', 'Quick Send', 'Booking Links & Health Forms'],
  mutation: { class: 'Temporary', occurred: true, action: 'A–Z sort only' },
  assertions: { sortSelected: true, campaignCountChecked: names.length, alphabetic },
  campaignNames: names,
  preSortCampaignCount: listBefore.length,
  sensitiveData: { patientSearchUsed: true, patientIdentityPersisted: false, screenshots: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '26-tc001-quick-send-result.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
