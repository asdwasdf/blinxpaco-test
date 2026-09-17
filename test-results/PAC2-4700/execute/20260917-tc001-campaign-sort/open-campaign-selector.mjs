import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile missing');
const dialog = page.getByRole('dialog').filter({ hasText: /click to change/i }).last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const trigger = dialog.getByText(/click to change/i).first();
await trigger.waitFor({ state: 'visible', timeout: 10_000 });
await trigger.click();
const az = page.getByText(/^A\s*[–-]\s*Z$/i).first();
await az.waitFor({ state: 'visible', timeout: 15_000 });
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  return [...document.querySelectorAll('button, [role="button"], [role="option"], [role="menuitem"], li, span')]
    .filter(visible)
    .map((element) => clean(element.getAttribute('aria-label') || element.textContent))
    .filter((value) => value && value.length < 150 && /By date|A\s*[–-]\s*Z|Z\s*[–-]\s*A|message type|Booking Links|Health Forms/i.test(value))
    .slice(0, 100);
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
