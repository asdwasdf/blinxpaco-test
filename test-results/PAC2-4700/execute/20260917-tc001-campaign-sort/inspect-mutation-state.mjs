import { chromium } from '@playwright/test';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
await page.bringToFront();
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });

const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
const state = await dialog.evaluate((root) => {
  const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  return {
    buttons: [...root.querySelectorAll('button, [role="button"]')].filter(visible).map((element) => cleanText(element.getAttribute('aria-label') || element.textContent)).filter(Boolean).map((value) => value.replace(/^\d+/, '')).slice(0, 80),
    inputs: [...root.querySelectorAll('input, textarea')].filter(visible).map((element) => ({ type: element.type, placeholder: cleanText(element.placeholder), ariaLabel: cleanText(element.getAttribute('aria-label')), accept: element.accept || null })).slice(0, 40),
    activeTab: [...root.querySelectorAll('button')].filter((element) => element.className.includes('active')).map((element) => cleanText(element.textContent).replace(/^\d+/, '')).filter(Boolean),
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
