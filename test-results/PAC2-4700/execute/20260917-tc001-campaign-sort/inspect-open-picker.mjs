import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  return [...document.querySelectorAll('button, input, [role="button"], [role="combobox"], [role="listbox"], [role="option"], select')]
    .filter(visible)
    .map((element, index) => ({
      index,
      tag: element.tagName,
      role: element.getAttribute('role'),
      label: clean(element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent).replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]').slice(0, 180),
      expanded: element.getAttribute('aria-expanded'),
      popup: element.getAttribute('aria-haspopup'),
      cls: String(element.className || '').slice(0, 160),
    }))
    .filter(({ label, role }) => /Select Campaign|By message type|Booking Links|Health Forms|Favourites|General News|Guidance/i.test(label) || ['combobox', 'listbox', 'option'].includes(role))
    .slice(0, 100);
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
