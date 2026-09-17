import { chromium } from '@playwright/test';

const patientId = '36a5ba9c-5143-4fdd-afa7-162e7b227311';
const candidates = [
  `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/patient-profile/${patientId}/dashboard`,
  `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/paco/patient-profile/${patientId}/dashboard`,
  `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/patient-profile/${patientId}/dashboard`,
  `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/paco/patient-profile/${patientId}/dashboard`,
];
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no authenticated browser context');
const results = [];
for (const url of candidates) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 945 });
  let navigationError = null;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  } catch (error) {
    navigationError = error.message.split('\n')[0];
  }
  const finalUrl = page.url();
  const body = await page.locator('body').innerText({ timeout: 10_000 }).catch(() => '');
  results.push({
    candidate: url.replace(patientId, '[redacted]'),
    finalUrl: finalUrl.replace(patientId, '[redacted]'),
    navigationError,
    login: /\/login(?:[/?#]|$)/i.test(finalUrl),
    notFound: /404|not found|page.*does not exist/i.test(body),
    patientActionsVisible: await page.getByRole('button', { name: /Patient actions/i }).isVisible().catch(() => false),
    branchRetained: /feature-branch\/pac2-4700-qs-only/i.test(finalUrl),
    title: await page.title(),
  });
  await page.close();
}
console.log(JSON.stringify(results, null, 2));
await browser.close();
