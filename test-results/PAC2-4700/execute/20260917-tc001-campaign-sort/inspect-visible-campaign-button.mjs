import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const buttons = page.locator('button').filter({ hasText: /^Campaign$/i });
let index = -1;
for (let i = 0; i < await buttons.count(); i += 1) if (await buttons.nth(i).isVisible().catch(() => false)) { index = i; break; }
if (index < 0) throw new Error('Visible Campaign button missing');
const state = await buttons.nth(index).evaluate((node) => {
  const safe = (element) => element ? {
    tag: element.tagName,
    cls: String(element.className || '').slice(0, 240),
    role: element.getAttribute('role'),
    ariaLabel: element.getAttribute('aria-label'),
    ariaExpanded: element.getAttribute('aria-expanded'),
    ariaControls: element.getAttribute('aria-controls'),
    disabled: element.disabled || element.getAttribute('aria-disabled'),
    testid: element.getAttribute('data-testid'),
    text: (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200),
  } : null;
  return {
    button: safe(node),
    parent: safe(node.parentElement),
    grandparent: safe(node.parentElement?.parentElement),
    parentChildren: [...(node.parentElement?.children || [])].map(safe),
    grandparentChildren: [...(node.parentElement?.parentElement?.children || [])].map(safe),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
