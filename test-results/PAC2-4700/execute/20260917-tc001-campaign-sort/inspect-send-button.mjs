import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const controls = await dialog.locator('button:visible').evaluateAll((nodes) => nodes.map((node, index) => ({
  index,
  text: (node.textContent || '').replace(/\s+/g, ' ').trim().replace(/^\d+/, ''),
  ariaLabel: node.getAttribute('aria-label'),
  title: node.getAttribute('title'),
  type: node.type,
  disabled: node.disabled,
  cls: String(node.className).slice(0, 180),
  html: node.outerHTML.replace(/>[\s\S]*</, '><').slice(0, 400),
})));
console.log(JSON.stringify(controls, null, 2));
await browser.close();
