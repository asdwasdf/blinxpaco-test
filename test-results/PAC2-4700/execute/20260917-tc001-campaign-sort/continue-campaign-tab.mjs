import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile missing');

const library = page.getByRole('dialog').filter({ hasText: /Email Templates Library/i }).last();
if (await library.isVisible().catch(() => false)) {
  const close = library.getByRole('button', { name: /Close/i }).first();
  if (await close.isVisible().catch(() => false)) await close.click();
  else await page.keyboard.press('Escape');
  await library.waitFor({ state: 'hidden', timeout: 15_000 });
}

const quickSend = page.getByRole('dialog').filter({ hasText: /Campaign/ }).last();
await quickSend.waitFor({ state: 'visible', timeout: 10_000 });
const campaignTab = quickSend.getByRole('tab', { name: /^Campaign$/i }).or(quickSend.getByText(/^Campaign$/i)).first();
await campaignTab.click();

const state = await quickSend.evaluate((root) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  return {
    text: clean(root.innerText).replace(/Michael\s+Ramella/gi, '[patient]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[redacted]').slice(-1600),
    controls: [...root.querySelectorAll('button, input, [role="button"], [role="tab"], [role="combobox"], [aria-label]')]
      .filter(visible)
      .map((element) => ({
        tag: element.tagName,
        role: element.getAttribute('role'),
        label: clean(element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent),
        expanded: element.getAttribute('aria-expanded'),
      }))
      .filter(({ label }) => label && /Campaign|Booking|Health|Select|Choose|sort|date|message/i.test(label))
      .slice(0, 60),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
