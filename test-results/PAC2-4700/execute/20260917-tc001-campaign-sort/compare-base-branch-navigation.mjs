import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const patientIdPattern = /patient-profile\/[0-9a-f-]+/i;
const targets = [
  { key: 'os-base', url: 'https://blinx.dev.blinxpaco-np.com/paco/patient-search' },
  { key: 'os-branch', url: 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/patient-search' },
  { key: 'connect-base', url: 'https://blinx.dev.blinxpaco-np.com/paco-connect/' },
  { key: 'connect-branch', url: 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/' },
  { key: 'gp-base', url: 'https://blinx.dev.blinxpaco-np.com/' },
  { key: 'gp-branch', url: 'https://pac2-4700-qs-only.dev.blinxpaco-np.com/feature-branch/pac2-4700-qs-only/' },
];
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no browser context');
const results = [];
for (const target of targets) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 945 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message.slice(0, 200)));
  let navigationError = null;
  try { await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45_000 }); } catch (error) { navigationError = error.message.split('\n')[0]; }
  await page.locator('body').waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
  const finalUrl = page.url();
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const navLabels = (await page.locator('nav a:visible, aside a:visible, nav button:visible, aside button:visible').allTextContents()).map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 30);
  const inputs = await page.locator('input:visible').evaluateAll((nodes) => nodes.map((node) => ({ type: node.type, placeholder: node.placeholder || '', ariaLabel: node.getAttribute('aria-label') || '' })).slice(0, 20));
  const buttons = (await page.locator('button:visible').allTextContents()).map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 30);
  const root = await page.locator('#root, #app, body > div').first().evaluate((node) => ({ width: node.getBoundingClientRect().width, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth })).catch(() => null);
  results.push({
    key: target.key,
    requestedUrl: target.url,
    finalUrl: finalUrl.replace(patientIdPattern, 'patient-profile/[redacted]'),
    branchRetained: target.key.includes('branch') ? /pac2-4700-qs-only/i.test(finalUrl) : null,
    login: /\/login(?:[/?#]|$)/i.test(finalUrl),
    title: await page.title(),
    bodyEmpty: !bodyText.trim(),
    notFound: /404|page not found|does not exist/i.test(bodyText),
    navigationError,
    pageErrors: [...new Set(errors)],
    navLabels,
    inputs,
    buttons,
    horizontalOverflow: root ? root.scrollWidth > root.clientWidth + 1 : null,
  });
  await page.close();
}
await writeFile(path.join(outDir, '46-base-branch-entry-comparison.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results.map(({ navLabels, inputs, buttons, ...result }) => ({ ...result, navControlCount: navLabels.length, inputCount: inputs.length, buttonCount: buttons.length })), null, 2));
await browser.close();
