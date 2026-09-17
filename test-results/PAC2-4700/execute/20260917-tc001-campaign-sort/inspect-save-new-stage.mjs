import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const visible = page.locator('[role="dialog"]:visible');
const count = await visible.count();
const out = [];
for (let i = 0; i < count; i += 1) {
  const root = visible.nth(i);
  out.push({
    text: (await root.innerText()).replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[number]').replace(/\s+/g, ' ').trim().slice(0, 1500),
    buttons: await root.locator('button:visible').allTextContents(),
    inputs: await root.locator('input:visible').count(),
  });
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
