import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const dialog = page.getByRole('dialog').filter({ hasText: /^Save as new Campaign/i }).last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const fields = await dialog.locator('input').evaluateAll((nodes) => nodes.map((node, index) => ({
  index,
  id: node.id || null,
  name: node.name || null,
  placeholder: node.placeholder || null,
  disabled: node.disabled,
  ariaLabel: node.getAttribute('aria-label'),
  labelledBy: node.getAttribute('aria-labelledby'),
  precedingLabel: node.labels?.[0]?.textContent?.replace(/\s+/g, ' ').trim() || null,
})));
console.log(JSON.stringify(fields, null, 2));
await browser.close();
