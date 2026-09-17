import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /blinx\.dev\.blinxpaco-np\.com/i.test(candidate.url()) && !/commshub/i.test(candidate.url()));
if (!page) throw new Error('Paco page missing');
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const redact = (value) => clean(value)
    .replace(/Michael\s+Ramella/gi, '[patient]')
    .replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]');
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  return {
    url: location.href.replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]'),
    dialogs: [...document.querySelectorAll('[role="dialog"], .p-dialog')].filter(visible).map((element) => redact(element.innerText).slice(0, 700)),
    controls: [...document.querySelectorAll('button, a, input, [role="button"], [role="tab"], [role="combobox"], [aria-label]')]
      .filter(visible)
      .map((element) => redact(element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent))
      .filter((value) => value && /send|booking|health|campaign|template|message|close|patient action/i.test(value))
      .slice(0, 80),
    body: redact(document.body?.innerText).slice(0, 1600),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
