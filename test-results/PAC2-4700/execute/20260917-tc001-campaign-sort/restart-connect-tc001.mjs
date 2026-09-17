import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const target = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/';
const patientName = ['Michael', 'Ramella'].join(' ');
await mkdir(outDir, { recursive: true });

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');
let page = context.pages().find((candidate) => candidate.url().startsWith(target));
if (!page) page = await context.newPage();
await page.bringToFront();
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
if (/\/login/i.test(page.url())) throw new Error('Blocked: Authentication expired');
await page.waitForFunction(() => (document.body?.innerText || '').length > 100, null, { timeout: 45_000 });
if (!locationMatches(page.url(), target)) throw new Error(`Blocked: wrong app URL ${page.url()}`);

await page.evaluate(() => window.scrollTo(0, 0));
const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
await search.waitFor({ state: 'visible', timeout: 20_000 });
await search.click();
await search.fill('');
await search.pressSequentially(patientName, { delay: 40 });
await page.evaluate(() => window.scrollTo(0, 0));

const patientResults = page
  .locator('div[class*="patient-row"]')
  .filter({ hasText: new RegExp(patientName, 'i') });
await patientResults.first().waitFor({ state: 'attached', timeout: 30_000 });
await page.waitForFunction(() => {
  const panel = document.querySelector('.p-overlaypanel');
  const rect = panel?.getBoundingClientRect();
  return rect && rect.y >= 0 && rect.y < innerHeight;
}, null, { timeout: 15_000 });
await patientResults.first().click();
await page.waitForURL(/\/paco\/patient-profile\//i, { timeout: 30_000 });

const flagDialog = page.getByRole('dialog').filter({ hasText: /Patient Flag Information/i }).last();
await flagDialog.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
if (await flagDialog.isVisible().catch(() => false)) {
  await flagDialog.getByRole('button', { name: /^Close$/i }).first().click();
  await flagDialog.waitFor({ state: 'hidden', timeout: 15_000 });
}

const patientActions = page.getByRole('button', { name: /Patient actions/i }).first();
await patientActions.waitFor({ state: 'visible', timeout: 30_000 });
let quickSend = page.getByRole('button', { name: /^Quick Send$/i }).or(page.getByText(/^Quick Send$/i)).first();
if (!(await quickSend.isVisible().catch(() => false))) {
  await patientActions.click();
  quickSend = page.getByText(/^Quick Send$/i).first();
}
await quickSend.waitFor({ state: 'visible', timeout: 15_000 });
await quickSend.click();

const quickSendDialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await quickSendDialog.waitFor({ state: 'visible', timeout: 30_000 });
const campaignButton = quickSendDialog.getByRole('button', { name: /^Campaign$/i }).first();
await campaignButton.waitFor({ state: 'visible', timeout: 15_000 });
await campaignButton.click();

const az = page.getByText(/^A\s*[–-]\s*Z$/i).first();
await az.waitFor({ state: 'visible', timeout: 15_000 });
await az.click();
await page.waitForTimeout(800);

const campaignNames = await page.evaluate(() => {
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const excluded = /^(By date.*|A\s*[–-]\s*Z|Z\s*[–-]\s*A|By message type|Booking Links\s*&\s*Health Forms)$/i;
  return [...new Set(
    [...document.querySelectorAll('[role="option"], [role="menuitem"], [role="listbox"] li')]
      .filter(visible)
      .map((element) => clean(element.textContent))
      .filter((value) => value && value.length < 120 && !excluded.test(value)),
  )].slice(0, 30);
});

const normalized = campaignNames.map((value) => value.toLocaleLowerCase('en-GB'));
const alphabetic = normalized.length >= 2 && normalized.every(
  (value, index) => index === 0 || normalized[index - 1].localeCompare(value, 'en-GB', { numeric: true }) <= 0,
);
const result = campaignNames.length < 2 ? 'Inconclusive' : alphabetic ? 'Pass' : 'Fail';

await page.keyboard.press('Escape').catch(() => {});
const summary = {
  caseId: 'PAC2-4700-TC-001',
  app: 'PACO Connect',
  entryUrl: target,
  finalUrl: redactPatientId(page.url()),
  result,
  reason: campaignNames.length < 2
    ? 'A–Z selected; campaign rows not exposed with stable list roles'
    : alphabetic
      ? 'Campaign list sorted ascending after A–Z selection'
      : 'Campaign list order is not ascending after A–Z selection',
  mutation: { class: 'Temporary', occurred: true, action: 'A–Z sort only' },
  assertions: { sortSelected: true, campaignCountChecked: campaignNames.length, alphabetic },
  campaignNames,
  sensitiveData: { patientSearchUsed: true, patientIdentityPersisted: false, screenshots: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '27-tc001-connect-clean-result.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();

function locationMatches(actual, expected) {
  const url = new URL(actual);
  const base = new URL(expected);
  return url.origin === base.origin && url.pathname.startsWith(base.pathname);
}

function redactPatientId(url) {
  return url.replace(/patient(?:-profile)?\/[0-9a-f-]{20,}/i, 'patient/[redacted]');
}
