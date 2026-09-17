import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const target = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/';
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');
const page = await context.newPage();
await page.setViewportSize({ width: 1920, height: 945 });
await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
await search.waitFor({ state: 'visible', timeout: 45_000 });
await search.click();
await search.fill('');
await search.pressSequentially(['Michael', 'Ramella'].join(' '), { delay: 40 });
const row = page.locator('div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
await row.waitFor({ state: 'visible', timeout: 30_000 });
const controls = await row.locator('button:visible,[role="button"]:visible').evaluateAll((nodes) => nodes.map((node, index) => ({
  index,
  ariaLabel: node.getAttribute('aria-label'),
  title: node.getAttribute('title'),
  text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
  className: String(node.className).slice(0, 160),
})));
const actions = row.getByRole('button', { name: /^Patient actions menu$/i });
if (!(await actions.isVisible().catch(() => false))) throw new Error(`Blocked: patient actions control missing; controls=${JSON.stringify(controls)}`);
const beforeUrl = page.url();
await actions.click();
let quickSend = page.getByRole('menuitem', { name: /^Quick Send$/i }).first();
if (!(await quickSend.isVisible().catch(() => false))) quickSend = page.getByText(/^Quick Send$/i).first();
await quickSend.waitFor({ state: 'visible', timeout: 15_000 });
await quickSend.click();
const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
await dialog.waitFor({ state: 'visible', timeout: 30_000 });
const afterUrl = page.url();
const tabs = (await dialog.locator('button:visible').allTextContents()).map((value) => value.replace(/\s+/g, ' ').trim()).filter((value) => /Campaign|Health Forms|Files|Booking Link|Save/.test(value));
const result = {
  scope: 'PACO Connect feature branch patient-search plus to Quick Send',
  result: afterUrl === beforeUrl && /paco-connect\/feature-branch\/pac2-4700-qs-only/i.test(afterUrl) ? 'Pass' : 'Fail',
  observation: {
    patientRowControlCount: controls.length,
    patientActionsControlMetadata: controls.find(({ ariaLabel }) => ariaLabel === 'Patient actions menu') || null,
    quickSendOpened: true,
    routeChanged: afterUrl !== beforeUrl,
    branchRetained: /paco-connect\/feature-branch\/pac2-4700-qs-only/i.test(afterUrl),
    tabs,
  },
  mutation: { class: 'None', occurred: false },
  sensitiveData: { persisted: false, screenshots: false, patientIdentityPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '48-connect-branch-plus-quicksend.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
