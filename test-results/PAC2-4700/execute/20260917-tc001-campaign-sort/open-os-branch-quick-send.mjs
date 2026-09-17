import { chromium } from '@playwright/test';

const target = 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/patient-search';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no browser context');
const page = await context.newPage();
await page.setViewportSize({ width: 1920, height: 945 });
await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.getByText(/Patient Search/i).first().waitFor({ state: 'visible', timeout: 45_000 });
const inputs = page.locator('input:visible');
let search = page.getByPlaceholder(/Search/i).first();
if (!(await search.isEditable().catch(() => false))) {
  for (let index = 0; index < await inputs.count(); index += 1) {
    if (await inputs.nth(index).isEditable().catch(() => false)) { search = inputs.nth(index); break; }
  }
}
if (!(await search.isEditable().catch(() => false))) throw new Error('Blocked: patient search input missing');
await search.fill('');
await search.pressSequentially(['Michael', 'Ramella'].join(' '), { delay: 40 });
const result = page.locator('tr:visible, [role="row"]:visible, div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
await result.waitFor({ state: 'visible', timeout: 30_000 });
await result.click();
await page.waitForURL(/\/paco\/feature-branch\/pac2-4700-qs-only\/patient-profile\//i, { timeout: 30_000 });
const flag = page.getByRole('dialog').filter({ hasText: /Patient Flag Information/i }).last();
await flag.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
if (await flag.isVisible().catch(() => false)) {
  await flag.getByRole('button', { name: /^Close$/i }).last().click();
  await flag.waitFor({ state: 'hidden', timeout: 15_000 });
}
const actions = page.getByRole('button', { name: /Patient actions/i }).first();
await actions.waitFor({ state: 'visible', timeout: 45_000 });
await actions.click();
const quick = page.getByText(/^Quick Send$/i).first();
await quick.waitFor({ state: 'visible', timeout: 15_000 });
await quick.click();
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 30_000 });
await page.evaluate(() => { document.title = 'PAC2-4700 OS BRANCH'; });
console.log(JSON.stringify({ result: 'Pass', branchRetained: /feature-branch\/pac2-4700-qs-only/i.test(page.url()), url: page.url().replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]'), quickSendVisible: true }, null, 2));
await browser.close();
