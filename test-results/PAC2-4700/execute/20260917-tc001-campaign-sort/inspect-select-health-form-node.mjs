import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const quick = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await quick.locator('button').filter({ hasText: /^(?:\d+)?Health Forms$/i }).first().click();
const node = quick.getByText(/^Select Health Form$/i);
const info = await node.evaluate((el) => {
  const summarize = (item) => ({ tag: item.tagName, role: item.getAttribute('role'), cls: String(item.className).slice(0, 180), text: (item.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 300), html: item.outerHTML.slice(0, 900) });
  return { self: summarize(el), parent: summarize(el.parentElement), grandparent: summarize(el.parentElement.parentElement) };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
