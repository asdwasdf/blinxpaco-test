import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
for (const [pageIndex, page] of browser.contexts()[0].pages().entries()) {
  if (!/\/paco\/patient-profile\//i.test(page.url())) continue;
  const dialogs = await page.locator('[role="dialog"]:visible').evaluateAll((nodes) => nodes.map((node, index) => ({
    index,
    cls: String(node.className).replace(/\s+/g, ' ').slice(0, 180),
    zIndex: getComputedStyle(node).zIndex,
    ariaLabel: node.getAttribute('aria-label'),
    headings: [...node.querySelectorAll('h1,h2,h3,h4,[role="heading"]')].map((item) => (item.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 3),
    buttons: [...node.querySelectorAll('button')].filter((item) => item.offsetWidth || item.offsetHeight).map((item) => item.getAttribute('aria-label') || (item.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 10),
  })));
  console.log(JSON.stringify({ pageIndex, title: await page.title(), dialogCount: dialogs.length, dialogs }, null, 2));
}
await browser.close();
