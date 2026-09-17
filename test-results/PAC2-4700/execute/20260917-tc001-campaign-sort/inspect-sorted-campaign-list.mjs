import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const redact = (value) => clean(value).replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]');
  const heading = [...document.querySelectorAll('*')].find((element) => visible(element) && clean(element.textContent) === 'Select Campaign');
  const ancestors = [];
  for (let element = heading; element && ancestors.length < 7; element = element.parentElement) {
    const rect = element.getBoundingClientRect();
    ancestors.push({
      tag: element.tagName,
      cls: String(element.className || '').slice(0, 180),
      text: redact(element.textContent).slice(0, 3000),
      children: [...element.children].map((child) => ({ tag: child.tagName, cls: String(child.className || '').slice(0, 140), text: redact(child.textContent).slice(0, 300) })),
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
    });
  }
  return ancestors;
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
