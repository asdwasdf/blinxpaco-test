import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
const tab = dialog.locator('button').filter({ hasText: /^(?:\d+)?Health Forms$/i }).first();
await tab.click();
const state = await dialog.evaluate((root) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  return {
    controls: [...root.querySelectorAll('button,input,[role="button"],[role="checkbox"],[role="option"],[role="treeitem"]')].filter(visible).map((node, index) => ({ index, tag: node.tagName, role: node.getAttribute('role'), type: node.getAttribute('type'), checked: node.checked ?? node.getAttribute('aria-checked'), label: clean(node.getAttribute('aria-label') || node.textContent).slice(0, 120), cls: String(node.className).slice(0, 140) })).slice(0, 120),
    text: clean(root.innerText).slice(0, 1800),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
