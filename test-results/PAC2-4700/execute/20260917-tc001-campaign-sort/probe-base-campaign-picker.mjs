import { chromium } from '@playwright/test';
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
await dialog.getByText('(click to change)', { exact: true }).click();
await page.locator('.sort-dropdown:visible').waitFor({ state: 'visible', timeout: 15_000 });
const state = await page.evaluate(() => {
  const visible = (node) => node instanceof HTMLElement && !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
  const clean = (text) => (text || '').replace(/\s+/g, ' ').trim();
  const sanitize = (text) => clean(text).replace(/Michael\s+Ramella|Ramella,\s*Michael/gi, '[patient]').replace(/\b(?:\d[\s-]?){8,}\b/g, '[number]').slice(0, 160);
  return [...document.querySelectorAll('button, li, [role], [class*="campaign-option"]')]
    .filter(visible)
    .map((node) => ({ tag: node.tagName, role: node.getAttribute('role'), text: sanitize(node.textContent), cls: String(node.className || '').slice(0, 140), expanded: node.getAttribute('aria-expanded') }))
    .filter(({ text, cls, role }) => /campaign|booking|general patient|favourites|health forms/i.test(`${text} ${cls}`) || ['tree', 'treeitem'].includes(role))
    .slice(0, 120);
});
console.log(JSON.stringify(state, null, 2));
await page.close();
await browser.close();
