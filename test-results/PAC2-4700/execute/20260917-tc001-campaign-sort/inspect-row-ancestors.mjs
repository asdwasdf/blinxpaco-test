import { chromium } from '@playwright/test';
const base = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => candidate.url().startsWith(base));
if (!page) throw new Error('Connect page missing');
const state = await page.evaluate(() => {
  const row = document.querySelector('div[class*="patient-row"]');
  const chain = [];
  for (let node = row; node && chain.length < 10; node = node.parentElement) {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    chain.push({
      tag: node.tagName,
      cls: String(node.className || '').slice(0, 120),
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      display: style.display,
      position: style.position,
      transform: style.transform,
      translate: style.translate,
      top: style.top,
      overflow: style.overflow,
      visibility: style.visibility,
      opacity: style.opacity,
    });
  }
  return chain;
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
