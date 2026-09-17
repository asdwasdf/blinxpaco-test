import { chromium } from '@playwright/test';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = context?.pages().find((candidate) => /blinx\.dev\.blinxpaco-np\.com\/paco(?:\/|$)/i.test(candidate.url()));
if (!page) throw new Error('No Paco page');
await page.bringToFront();
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const labels = [...document.querySelectorAll('button, a, [role="button"], [role="tab"], [role="menuitem"], [aria-label]')]
    .filter(visible)
    .map((element) => clean(element.getAttribute('aria-label') || element.textContent))
    .filter((value) => value && !/Michael|Ramella|NHS|phone|email|address/i.test(value))
    .slice(0, 80);
  const text = clean(document.body?.innerText)
    .replace(/Michael\s+Ramella/gi, '[patient]')
    .replace(/\b\d{10}\b/g, '[redacted]');
  return { url: location.href, title: document.title, labels, body: text.slice(0, 1800) };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
