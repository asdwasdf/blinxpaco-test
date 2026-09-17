import { chromium } from '@playwright/test';

const target = 'https://blinx.dev.blinxpaco-np.com/paco/login';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');
const page = await context.newPage();
await page.setViewportSize({ width: 1920, height: 945 });
await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
if (/\/login(?:[/?#]|$)/i.test(page.url())) throw new Error('Blocked: baseline authentication required');
const search = page.getByPlaceholder(/Search(?: patients by name or NHS number)?(?:\.\.\.)?/i).first();
await search.waitFor({ state: 'visible', timeout: 30_000 });
await search.click();
await search.fill('');
await search.pressSequentially(['Michael', 'Ramella'].join(' '), { delay: 40 });
const result = page.locator('div[class*="patient-row"]').filter({ hasText: /Michael\s+Ramella/i }).first();
await result.waitFor({ state: 'visible', timeout: 30_000 });
await result.click();
await page.waitForURL(/\/paco\/patient-profile\//i, { timeout: 30_000 });
const flag = page.getByRole('dialog').filter({ hasText: /Patient Flag Information/i }).last();
await flag.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
if (await flag.isVisible().catch(() => false)) {
  await flag.getByRole('button', { name: /^Close$/i }).last().click();
  await flag.waitFor({ state: 'hidden', timeout: 15_000 });
}
const actions = page.getByRole('button', { name: /Patient actions/i }).first();
await actions.waitFor({ state: 'visible', timeout: 30_000 });
await actions.click();
const quick = page.getByText(/^Quick Send$/i).first();
await quick.waitFor({ state: 'visible', timeout: 15_000 });
await quick.click();
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 30_000 });
await page.evaluate(() => { document.title = 'PAC2-4700 BASELINE'; });
console.log(JSON.stringify({ result: 'Pass', baseline: true, url: page.url().replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]'), quickSendVisible: true }, null, 2));
await browser.close();
