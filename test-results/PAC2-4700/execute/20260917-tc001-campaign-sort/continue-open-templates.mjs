import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile missing');
const dialog = page.getByRole('dialog').filter({ hasText: /Templates/ }).last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const templates = dialog.getByText(/^Templates$/i).first();
await templates.click();
await page.getByText(/A\s*[–-]\s*Z/i).first().waitFor({ state: 'visible', timeout: 15_000 });
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const redact = (value) => clean(value).replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]');
  return {
    controls: [...document.querySelectorAll('button, [role="button"], [role="option"], [role="menuitem"], [role="tab"], [role="combobox"]')]
      .filter(visible)
      .map((element) => redact(element.getAttribute('aria-label') || element.textContent))
      .filter((value) => value && /template|campaign|booking|health|By date|A\s*[–-]\s*Z|Z\s*[–-]\s*A|message type/i.test(value))
      .slice(0, 100),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
