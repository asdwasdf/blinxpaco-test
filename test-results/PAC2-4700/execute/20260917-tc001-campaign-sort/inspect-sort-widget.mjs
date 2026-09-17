import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const select = page.locator('select').filter({ hasText: /By message type|A\s*[–-]\s*Z/i }).first();
await select.waitFor({ state: 'attached', timeout: 10_000 });
const state = await select.evaluate((node) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const encode = (element) => element ? {
    tag: element.tagName,
    role: element.getAttribute('role'),
    cls: String(element.className || '').slice(0, 220),
    text: clean(element.textContent).slice(0, 500),
    ariaLabel: element.getAttribute('aria-label'),
    expanded: element.getAttribute('aria-expanded'),
    controls: element.getAttribute('aria-controls'),
    html: element.outerHTML.slice(0, 1800),
  } : null;
  return { select: encode(node), parent: encode(node.parentElement), grandparent: encode(node.parentElement?.parentElement) };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
