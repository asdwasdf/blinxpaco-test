import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const quick = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await quick.locator('button').filter({ hasText: /^(?:\d+)?Health Forms$/i }).first().click();
const dropdown = quick.locator('.p-dropdown').filter({ hasText: /^Select Health Form$/i }).first();
const before = await dropdown.evaluate((node) => ({ cls: node.className, ariaDisabled: node.getAttribute('aria-disabled'), tabindex: node.getAttribute('tabindex'), rect: node.getBoundingClientRect().toJSON() }));
await dropdown.click({ force: true });
await page.waitForTimeout(600);
const candidates = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  return [...document.querySelectorAll('body *')]
    .filter((node) => /Sleep Ap|14 Dec patient dynamic/i.test(clean(node.textContent)) && ![...node.children].some((child) => /Sleep Ap|14 Dec patient dynamic/i.test(clean(child.textContent))))
    .map((node) => { const rect = node.getBoundingClientRect(); return { tag: node.tagName, cls: String(node.className).slice(0, 180), text: clean(node.textContent).slice(0, 200), rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, display: getComputedStyle(node).display, visibility: getComputedStyle(node).visibility }; })
    .slice(0, 50);
});
const overlays = await page.locator('[class*="dropdown"], [class*="overlay"], [role="listbox"]').evaluateAll((nodes) => nodes.map((node) => { const rect = node.getBoundingClientRect(); return { cls: String(node.className).slice(0, 180), role: node.getAttribute('role'), text: (node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 300), rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, display: getComputedStyle(node).display }; }).filter((item) => item.text || item.role).slice(-30));
console.log(JSON.stringify({ before, candidates, overlays }, null, 2));
await browser.close();
