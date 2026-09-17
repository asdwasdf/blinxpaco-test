import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
for (const [pageIndex, page] of browser.contexts()[0].pages().entries()) {
  const dialogs = [];
  for (let index = 0; index < await page.locator('[role="dialog"]:visible').count(); index += 1) {
    const node = page.locator('[role="dialog"]:visible').nth(index);
    dialogs.push({ cls: await node.getAttribute('class'), text: (await node.innerText()).replace(/\s+/g, ' ').trim().slice(0, 700) });
  }
  console.log(JSON.stringify({ pageIndex, url: page.url().replace(/patient(?:-profile)?\/[0-9a-f-]{20,}/i, 'patient/[redacted]'), dialogs }, null, 2));
}
await browser.close();
