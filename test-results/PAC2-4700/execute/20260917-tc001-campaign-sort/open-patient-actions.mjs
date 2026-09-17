import { chromium } from '@playwright/test';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = context?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile not open');
await page.bringToFront();
await page.getByRole('button', { name: /Patient actions/i }).click();
const quickSend = page.getByText(/^Quick Send$/i).first();
await quickSend.waitFor({ state: 'visible', timeout: 10_000 });
await quickSend.click();
await page.waitForFunction(() => /Booking Links\s*&\s*Health Forms/i.test(document.body?.innerText || ''), null, { timeout: 30_000 });
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  return {
    url: location.href.replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]'),
    controls: [...document.querySelectorAll('button, [role="button"], [role="combobox"], [role="tab"]')]
      .filter(visible)
      .map((element) => clean(element.getAttribute('aria-label') || element.textContent))
      .filter((value) => /Booking Links|Health Forms|Campaign|Quick Send|Templates/i.test(value))
      .slice(0, 30),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
