import { chromium } from '@playwright/test';
const base = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => candidate.url().startsWith(base));
if (!page) throw new Error('Connect page missing');
const state = await page.evaluate(() => ({
  scrollY,
  scrollingElement: {
    top: document.scrollingElement?.scrollTop,
    height: document.scrollingElement?.scrollHeight,
    client: document.scrollingElement?.clientHeight,
  },
  scrollables: [...document.querySelectorAll('*')]
    .filter((element) => element.scrollTop || element.scrollLeft)
    .map((element) => ({ tag: element.tagName, cls: String(element.className || '').slice(0, 100), top: element.scrollTop, left: element.scrollLeft }))
    .slice(0, 20),
}));
console.log(JSON.stringify(state, null, 2));
await browser.close();
