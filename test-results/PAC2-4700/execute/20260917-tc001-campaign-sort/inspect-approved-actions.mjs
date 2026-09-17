import { chromium } from '@playwright/test';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });

const summarize = async () => page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  const redact = (value) => clean(value)
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]')
    .replace(/\b(?:\d[\s-]?){10,}\b/g, '[number]');
  const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter(visible);
  return dialogs.map((root) => ({
    cls: String(root.className).slice(0, 120),
    heading: [...root.querySelectorAll('h1,h2,h3,h4,[role="heading"]')].filter(visible).map((node) => redact(node.textContent)).filter(Boolean).slice(0, 10),
    buttons: [...root.querySelectorAll('button,[role="button"]')].filter(visible).map((node) => redact(node.getAttribute('aria-label') || node.textContent)).filter(Boolean).map((value) => value.replace(/^\d+/, '')).slice(0, 80),
    fields: [...root.querySelectorAll('input,textarea,select')].filter(visible).map((node) => ({ type: node.type, name: node.name || null, placeholder: redact(node.placeholder), ariaLabel: redact(node.getAttribute('aria-label')) })).slice(0, 40),
    text: redact(root.innerText).slice(0, 1200),
  }));
});

const campaign = dialog.locator('button').filter({ hasText: /^(?:\d+)?Campaign$/i }).first();
await campaign.click();
await page.waitForTimeout(400);
console.log(JSON.stringify({ stage: 'campaign-panel', dialogs: await summarize() }, null, 2));

const save = dialog.getByRole('button', { name: /^Save$/i }).last();
await save.click();
await page.waitForTimeout(400);
console.log(JSON.stringify({ stage: 'after-save-control', dialogs: await summarize() }, null, 2));
await browser.close();
