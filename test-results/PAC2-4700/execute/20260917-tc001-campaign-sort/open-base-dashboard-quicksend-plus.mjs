import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const target = 'https://blinx.dev.blinxpaco-np.com/paco/dashboard/';
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');
const page = await context.newPage();
await page.setViewportSize({ width: 1920, height: 945 });
await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
if (/\/login(?:[/?#]|$)/i.test(page.url())) throw new Error('Blocked: baseline authentication expired');
const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
await search.waitFor({ state: 'visible', timeout: 45_000 });
await search.click();
await search.fill('');
await search.pressSequentially(['Michael', 'Ramella'].join(' '), { delay: 40 });
const row = page.locator('div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
await row.waitFor({ state: 'visible', timeout: 30_000 });
const actions = row.getByRole('button', { name: /^Patient actions menu$/i });
await actions.waitFor({ state: 'visible', timeout: 15_000 });
const beforeUrl = page.url();
await actions.click();
let quickSend = page.getByRole('menuitem', { name: /^Quick Send$/i }).first();
if (!(await quickSend.isVisible().catch(() => false))) quickSend = page.getByText(/^Quick Send$/i).first();
await quickSend.waitFor({ state: 'visible', timeout: 15_000 });
await quickSend.click();
const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
await dialog.waitFor({ state: 'visible', timeout: 30_000 });
const state = await dialog.evaluate((root) => {
  const visible = (node) => Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const rect = root.getBoundingClientRect();
  return {
    bounds: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
    horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
    verticalOverflow: root.scrollHeight > root.clientHeight + 1,
    controls: [...root.querySelectorAll('button,[role="button"]')].filter(visible).map((node) => clean(node.getAttribute('aria-label') || node.textContent).replace(/^\d+/, '')).filter(Boolean),
    tabs: [...root.querySelectorAll('button')].filter(visible).map((node) => clean(node.textContent)).filter((label) => /Campaign|Health Forms|Files|Booking Link|Save/.test(label)),
  };
});
const result = {
  scope: 'PACO base dashboard patient actions to Quick Send', result: page.url() === beforeUrl ? 'Pass' : 'Fail',
  observation: { quickSendOpened: true, routeChanged: page.url() !== beforeUrl, ...state },
  mutation: { class: 'None', occurred: false }, sensitiveData: { persisted: false, screenshots: false, patientIdentityPersisted: false }, observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '49-base-dashboard-plus-quicksend.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
