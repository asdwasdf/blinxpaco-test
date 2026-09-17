import { chromium } from '@playwright/test';
const base = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => candidate.url().startsWith(base));
if (!page) throw new Error('Connect page missing');
const rows = page.locator('div[class*="patient-row"]');
const layout = [];
for (let index = 0; index < await rows.count(); index += 1) {
  const row = rows.nth(index);
  layout.push({ index, box: await row.boundingBox(), visible: await row.isVisible(), classes: await row.getAttribute('class') });
}
console.log(JSON.stringify({ viewport: page.viewportSize(), rows: layout }, null, 2));
await browser.close();
