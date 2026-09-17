import { chromium } from '@playwright/test';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
for (const page of browser.contexts()[0].pages()) {
  if (!/feature-branch\/pac2-4700-qs-only\/.*patient-profile/i.test(page.url())) continue;
  const body = await page.locator('body').innerText().catch(() => '');
  const controls = await page.locator('button:visible,a:visible,input:visible').evaluateAll((nodes) => nodes.map((node) => (node.getAttribute('aria-label') || node.getAttribute('placeholder') || node.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 50));
  console.log(JSON.stringify({
    url: page.url().replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]'),
    title: await page.title(),
    bodyCategory: body ? body.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]').replace(/\b(?:\d[\s-]?){6,}\b/g, '[number]').slice(0, 500) : 'empty',
    controls,
  }, null, 2));
}
await browser.close();
