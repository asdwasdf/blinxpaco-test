import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const dialog = page.getByRole('dialog').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const state = await dialog.evaluate((root) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  return {
    text: clean(root.innerText).replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b\d{10}\b/g, '[redacted]').slice(0, 1400),
    controls: [...root.querySelectorAll('button, input, [role="button"], [role="combobox"], [role="tab"], [aria-label]')]
      .filter(visible)
      .map((element) => ({
        tag: element.tagName,
        role: element.getAttribute('role'),
        label: clean(element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent),
      }))
      .filter(({ label }) => label)
      .slice(0, 50),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
