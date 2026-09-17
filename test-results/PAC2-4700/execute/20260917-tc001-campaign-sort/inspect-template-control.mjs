import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const dialog = page.getByRole('dialog').filter({ hasText: /Templates/ }).last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const state = await dialog.evaluate((root) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const redact = (value) => clean(value).replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]');
  return [...root.querySelectorAll('*')]
    .filter(visible)
    .map((element) => ({
      tag: element.tagName,
      role: element.getAttribute('role'),
      aria: redact(element.getAttribute('aria-label')),
      text: redact(element.textContent),
      cls: String(element.className || '').slice(0, 120),
      expanded: element.getAttribute('aria-expanded'),
      hasPopup: element.getAttribute('aria-haspopup'),
    }))
    .filter(({ text, aria, role, hasPopup }) => /Templates|Select|Campaign/i.test(text) || /Templates|Select|Campaign/i.test(aria) || role === 'combobox' || hasPopup)
    .filter(({ text }) => text.length < 500)
    .slice(0, 80);
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
