import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Patient profile missing');
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  const heading = [...document.querySelectorAll('p')].find((element) => visible(element) && clean(element.textContent) === 'Select Campaign');
  const root = heading?.parentElement;
  const listRoot = root?.children?.[2];
  if (!listRoot) return [];
  return [...listRoot.querySelectorAll('*')]
    .filter(visible)
    .map((element) => ({
      tag: element.tagName,
      role: element.getAttribute('role'),
      cls: String(element.className || '').slice(0, 180),
      text: clean(element.textContent).slice(0, 240),
      children: element.children.length,
    }))
    .filter(({ text }) => text && text.length < 180)
    .slice(0, 160);
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
