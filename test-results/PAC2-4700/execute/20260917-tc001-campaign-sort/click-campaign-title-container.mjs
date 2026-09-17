import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile missing');
const label = page.getByText(/click to change/i).first();
await label.waitFor({ state: 'visible', timeout: 10_000 });
const trigger = label.locator('..');
await trigger.click();
await page.waitForTimeout(500);
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const redact = (value) => clean(value).replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]');
  return {
    matches: [...document.querySelectorAll('button, input, [role="button"], [role="option"], [role="menuitem"], [role="combobox"], li, h1, h2, h3')]
      .filter(visible)
      .map((element) => redact(element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent))
      .filter((value) => value && /By date|A\s*[–-]\s*Z|Z\s*[–-]\s*A|message type|Booking Links|Health Forms|Campaign|Search/i.test(value))
      .filter((value) => value.length < 200)
      .slice(0, 100),
    dialogTail: redact([...document.querySelectorAll('[role="dialog"]')].filter(visible).at(-1)?.innerText || '').slice(-1800),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
