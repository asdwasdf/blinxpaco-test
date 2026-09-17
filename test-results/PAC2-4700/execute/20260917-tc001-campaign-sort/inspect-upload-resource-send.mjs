import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
const redact = (value) => clean(value).replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]').replace(/\b(?:\d[\s-]?){10,}\b/g, '[number]');
const inspect = async (stage) => {
  const state = await dialog.evaluate((root) => {
    const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const visible = (element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    return {
      buttons: [...root.querySelectorAll('button,[role="button"]')].filter(visible).map((node) => cleanText(node.getAttribute('aria-label') || node.textContent)).filter(Boolean).map((value) => value.replace(/^\d+/, '')).slice(0, 100),
      checkboxes: [...root.querySelectorAll('input[type="checkbox"],[role="checkbox"]')].map((node) => ({ checked: node.checked ?? node.getAttribute('aria-checked'), label: cleanText(node.getAttribute('aria-label') || node.parentElement?.textContent) })).slice(0, 40),
      files: [...root.querySelectorAll('input[type="file"]')].map((node) => ({ accept: node.accept, multiple: node.multiple, disabled: node.disabled })),
      text: cleanText(root.innerText).slice(0, 1500),
    };
  });
  console.log(JSON.stringify({ stage, ...state, text: redact(state.text) }, null, 2));
};
const files = dialog.locator('button').filter({ hasText: /^(?:\d+)?Files$/i }).first();
await files.click();
await inspect('files');
const resources = dialog.getByRole('button', { name: /^Resources$/i }).first();
if (await resources.isVisible().catch(() => false)) {
  await resources.click();
  await page.waitForTimeout(300);
  await inspect('resources-open');
  await page.keyboard.press('Escape');
}
await browser.close();
