import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
const page = pages.toReversed().find(() => true);
if (!page) throw new Error('No patient page');
const rows = [];
for (const modal of await page.locator('[role="dialog"]:visible').all()) {
  const isQuick = await modal.evaluate((node) => node.classList.contains('quick-send-dialog'));
  if (isQuick) continue;
  rows.push({
    headings: (await modal.locator('h1,h2,h3,h4,[role="heading"]').allTextContents()).map((v) => v.replace(/\s+/g, ' ').trim()).filter(Boolean),
    buttons: (await modal.locator('button:visible').allTextContents()).map((v) => v.replace(/\s+/g, ' ').trim()).filter(Boolean),
    text: (await modal.innerText()).replace(/\s+/g, ' ').replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[number]').slice(0, 800),
  });
}
console.log(JSON.stringify(rows, null, 2));
await browser.close();
