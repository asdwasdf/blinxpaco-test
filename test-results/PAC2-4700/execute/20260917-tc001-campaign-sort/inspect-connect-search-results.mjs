import { chromium } from '@playwright/test';

const base = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => candidate.url().startsWith(base));
if (!page) throw new Error('Blocked: Connect page not open');
await page.bringToFront();
const state = await page.evaluate(() => {
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  return [...document.querySelectorAll('body *')]
    .filter(visible)
    .map((element) => ({
      tag: element.tagName,
      role: element.getAttribute('role'),
      cls: String(element.className || '').slice(0, 100),
      text: clean(element.textContent),
    }))
    .filter(({ text }) => /Michael\s+Ramella/i.test(text) && text.length < 500)
    .map(({ tag, role, cls, text }) => ({ tag, role, cls, text: text.replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b\d{10}\b/g, '[redacted]') }))
    .slice(-20);
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
