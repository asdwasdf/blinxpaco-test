import { chromium } from '@playwright/test';

const expected = process.env.EXPECT_CONTEXT;
if (!['base', 'branch'].includes(expected)) throw new Error('EXPECT_CONTEXT=base|branch required');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((page) => /\/patient-profile\//i.test(page.url())) || [];
const page = pages.toReversed().find((candidate) => expected === 'branch' ? /feature-branch\/pac2-4700-qs-only/i.test(candidate.url()) : !/feature-branch\/pac2-4700-qs-only/i.test(candidate.url()));
if (!page) throw new Error(`Blocked: ${expected} patient page missing`);
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 15_000 });
const state = await dialog.evaluate((root) => {
  const visible = (node) => Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const rect = root.getBoundingClientRect();
  return {
    dialog: { width: Math.round(rect.width), height: Math.round(rect.height), x: Math.round(rect.x), y: Math.round(rect.y), horizontalOverflow: root.scrollWidth > root.clientWidth + 1, verticalOverflow: root.scrollHeight > root.clientHeight + 1 },
    buttons: [...root.querySelectorAll('button,[role="button"]')].filter(visible).map((node) => clean(node.getAttribute('aria-label') || node.textContent).replace(/^\d+/, '')).filter(Boolean),
    inputs: [...root.querySelectorAll('input,textarea,select')].filter(visible).map((node) => ({ type: node.type || node.tagName.toLowerCase(), placeholder: node.placeholder || '', disabled: Boolean(node.disabled), invalid: node.getAttribute('aria-invalid') })),
    tabs: [...root.querySelectorAll('button')].filter(visible).map((node) => clean(node.textContent)).filter((label) => /Campaign|Health Forms|Files|Booking Link|Save/.test(label)),
  };
});
console.log(JSON.stringify({ context: expected, url: page.url().replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]'), ...state }, null, 2));
await browser.close();
