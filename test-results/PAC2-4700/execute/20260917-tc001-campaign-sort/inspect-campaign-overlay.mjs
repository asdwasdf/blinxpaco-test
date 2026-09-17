import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const redact = (value) => clean(value).replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]');
  return [...document.querySelectorAll('body > *, [role="listbox"], [role="menu"], .p-overlaypanel, .p-menu, .p-dropdown-panel')]
    .filter(visible)
    .map((element) => ({
      tag: element.tagName,
      role: element.getAttribute('role'),
      cls: String(element.className || '').slice(0, 120),
      text: redact(element.innerText).slice(0, 1800),
      rect: (() => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })(),
    }))
    .filter(({ text }) => /By date|A\s*[–-]\s*Z|Z\s*[–-]\s*A|message type|Booking Links|Campaign/i.test(text))
    .slice(-30);
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
