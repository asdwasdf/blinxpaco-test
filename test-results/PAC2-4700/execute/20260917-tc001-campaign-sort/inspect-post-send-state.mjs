import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const redact = (value) => (value || '').replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[number]').replace(/\s+/g, ' ').trim();
const quick = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
const quickVisible = await quick.isVisible().catch(() => false);
const toasts = (await page.locator('.p-toast-message:visible').allTextContents()).map(redact);
const dialogs = [];
const count = await page.locator('[role="dialog"]:visible').count();
for (let index = 0; index < count; index += 1) {
  const dialog = page.locator('[role="dialog"]:visible').nth(index);
  dialogs.push({
    quickSend: await dialog.evaluate((node) => node.className.includes('quick-send-dialog')),
    text: redact(await dialog.innerText()).slice(0, 1400),
    buttons: (await dialog.locator('button:visible').allTextContents()).map(redact).filter(Boolean),
  });
}
console.log(JSON.stringify({ quickVisible, toasts, dialogs }, null, 2));
await browser.close();
