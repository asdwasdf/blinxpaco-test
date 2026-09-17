import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const dialog = page.getByRole('dialog').filter({ hasText: /Resources/ }).last();
const button = dialog.getByRole('button', { name: /^Campaign$/i }).first();
const state = await button.evaluate((node) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const encode = (element) => ({
    tag: element?.tagName,
    role: element?.getAttribute('role'),
    aria: element?.getAttribute('aria-label'),
    testid: element?.getAttribute('data-testid'),
    cls: String(element?.className || '').slice(0, 180),
    text: clean(element?.textContent).slice(0, 300),
    html: element?.outerHTML.slice(0, 1200),
  });
  return {
    button: encode(node),
    parent: encode(node.parentElement),
    grandparent: encode(node.parentElement?.parentElement),
    siblings: [...(node.parentElement?.children || [])].map(encode),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
