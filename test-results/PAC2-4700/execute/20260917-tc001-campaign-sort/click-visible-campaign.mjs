import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile missing');
const buttons = page.locator('button').filter({ hasText: /^Campaign$/i });
let campaign;
for (let index = 0; index < await buttons.count(); index += 1) {
  const candidate = buttons.nth(index);
  if (await candidate.isVisible().catch(() => false)) {
    campaign = candidate;
    break;
  }
}
if (!campaign) throw new Error('Blocked: visible Campaign button missing');
await campaign.click();
await page.waitForTimeout(500);
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  return {
    sortTexts: [...document.querySelectorAll('button, [role="button"], [role="option"], [role="menuitem"], li, span')]
      .filter(visible)
      .map((element) => clean(element.getAttribute('aria-label') || element.textContent))
      .filter((value) => /By date|A\s*[–-]\s*Z|Z\s*[–-]\s*A|message type/i.test(value))
      .filter((value) => value.length < 150)
      .slice(0, 80),
    text: clean(document.querySelector('[role="dialog"]:last-of-type')?.innerText || '').replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]').slice(-1200),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
