import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const text = page.getByText(/click to change/i).first();
await text.waitFor({ state: 'visible', timeout: 10_000 });
const state = await text.evaluate((node) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const output = [];
  for (let element = node; element && output.length < 7; element = element.parentElement) {
    const rect = element.getBoundingClientRect();
    output.push({
      tag: element.tagName,
      role: element.getAttribute('role'),
      cls: String(element.className || '').slice(0, 180),
      text: clean(element.textContent).slice(0, 300),
      aria: element.getAttribute('aria-label'),
      expanded: element.getAttribute('aria-expanded'),
      popup: element.getAttribute('aria-haspopup'),
      tabindex: element.getAttribute('tabindex'),
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
    });
  }
  return output;
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
