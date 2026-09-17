import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const quick = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await quick.locator('button').filter({ hasText: /^(?:\d+)?Health Forms$/i }).first().click();
await quick.getByText(/^Select Health Form$/i).click();
await page.waitForTimeout(500);
const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
const out = [];
for (const selector of ['[role="dialog"]:visible', '.p-overlaypanel:visible', '.p-dropdown-panel:visible', '.p-sidebar:visible']) {
  const nodes = page.locator(selector);
  for (let index = 0; index < await nodes.count(); index += 1) {
    const node = nodes.nth(index);
    out.push({
      selector,
      text: clean(await node.innerText()).slice(0, 1600),
      controls: await node.locator('button:visible,input:visible,[role="option"]:visible,[role="treeitem"]:visible,[role="checkbox"]:visible').evaluateAll((els) => els.map((el) => ({ tag: el.tagName, role: el.getAttribute('role'), type: el.getAttribute('type'), label: (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120) }))).catch(() => []),
    });
  }
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
