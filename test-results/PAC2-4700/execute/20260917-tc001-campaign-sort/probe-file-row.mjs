import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const file = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort/qa-probe.txt');
await writeFile(file, 'Synthetic QA file.\n');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = await context.newPage();
await page.goto('https://blinx.dev.blinxpaco-np.com/paco/dashboard/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
await search.waitFor({ state: 'visible', timeout: 45_000 });
await search.fill('Michael Ramella');
const row = page.locator('div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
await row.waitFor({ state: 'visible', timeout: 30_000 });
await row.getByRole('button', { name: 'Patient actions menu' }).click();
await page.getByRole('menuitem', { name: 'Quick Send', exact: true }).click();
const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
await dialog.waitFor({ state: 'visible', timeout: 30_000 });
await dialog.locator('button').filter({ hasText: /^\s*\d*\s*Files\s*$/i }).first().click();
await dialog.locator('input[type="file"]').first().setInputFiles(file);
const label = dialog.getByText('qa-probe.txt', { exact: true }).first();
await label.waitFor({ state: 'visible', timeout: 10_000 });
const state = await label.evaluate((node) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const chain = [];
  let current = node;
  for (let depth = 0; current && depth < 7; depth += 1, current = current.parentElement) {
    chain.push({ tag: current.tagName, cls: String(current.className || '').slice(0, 200), text: clean(current.textContent).slice(0, 150), buttons: [...current.querySelectorAll('button')].map((button) => ({ text: clean(button.textContent), aria: button.getAttribute('aria-label'), title: button.getAttribute('title'), cls: String(button.className || '').slice(0, 120) })) });
  }
  return chain;
});
console.log(JSON.stringify(state, null, 2));
await page.close();
await browser.close();
