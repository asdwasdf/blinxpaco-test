import { chromium } from '@playwright/test';

const base = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = context?.pages().find((candidate) => candidate.url().startsWith(base));
if (!page) throw new Error('Blocked: Connect feature-branch page not open');
await page.bringToFront();
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  return {
    url: location.href,
    title: document.title,
    inputs: [...document.querySelectorAll('input')].filter(visible).map((element) => ({
      placeholder: element.getAttribute('placeholder'),
      ariaLabel: element.getAttribute('aria-label'),
      type: element.type,
    })),
    controls: [...document.querySelectorAll('button, a, [role="button"], [aria-label]')]
      .filter(visible)
      .map((element) => clean(element.getAttribute('aria-label') || element.textContent))
      .filter(Boolean)
      .slice(0, 60),
    body: clean(document.body?.innerText).slice(0, 1000),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
