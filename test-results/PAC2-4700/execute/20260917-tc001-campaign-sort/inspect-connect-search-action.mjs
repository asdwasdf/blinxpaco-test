import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((page) => /paco-connect\/feature-branch\/pac2-4700-qs-only/i.test(page.url())) || [];
const page = pages.at(-1);
if (!page) throw new Error('Connect branch page missing');
const visible = await page.locator('button:visible,[role="button"]:visible,[role="menuitem"]:visible,[role="dialog"]:visible').evaluateAll((nodes) => nodes.map((node, index) => ({
  index, tag: node.tagName, role: node.getAttribute('role'), ariaLabel: node.getAttribute('aria-label'), title: node.getAttribute('title'), text: (node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120), cls: String(node.className).slice(0, 140),
})).filter(({ text, ariaLabel, title }) => /Quick Send|Patient actions|Message|Send|Close|Michael|Ramella/i.test([text, ariaLabel, title].filter(Boolean).join(' '))));
console.log(JSON.stringify({ url: page.url(), visible }, null, 2));
await browser.close();
