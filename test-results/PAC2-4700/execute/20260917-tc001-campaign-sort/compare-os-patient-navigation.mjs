import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const targets = [
  { key: 'base', url: 'https://blinx.dev.blinxpaco-np.com/paco/patient-search' },
  { key: 'branch', url: 'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/patient-search' },
];
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no browser context');
const results = [];
for (const target of targets) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 945 });
  await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const heading = page.getByText(/Patient Search/i).first();
  await heading.waitFor({ state: 'visible', timeout: 45_000 });
  const inputs = page.locator('input:visible');
  const inputMeta = await inputs.evaluateAll((nodes) => nodes.map((node, index) => ({ index, placeholder: node.placeholder, type: node.type, ariaLabel: node.getAttribute('aria-label') })));
  let search = page.getByPlaceholder(/Search/i).first();
  if (!(await search.isEditable().catch(() => false))) search = inputs.filter({ has: page.locator('xpath=self::*[@type="text"]') }).first();
  if (!(await search.isEditable().catch(() => false))) {
    results.push({ key: target.key, result: 'Blocked', reason: 'No editable patient search field', entryUrl: target.url, inputMeta });
    await page.close();
    continue;
  }
  await search.fill('');
  await search.pressSequentially(['Michael', 'Ramella'].join(' '), { delay: 40 });
  const result = page.locator('tr:visible, [role="row"]:visible, div[class*="patient-row"]:visible').filter({ hasText: /Michael\s+Ramella|Ramella,\s*Michael/i }).first();
  await result.waitFor({ state: 'visible', timeout: 30_000 });
  const href = await result.locator('a').first().getAttribute('href').catch(() => null);
  await result.click();
  await page.waitForURL(/patient-profile/i, { timeout: 30_000 });
  const finalUrl = page.url();
  results.push({
    key: target.key,
    result: 'Pass',
    entryUrl: target.url,
    rowHref: href?.replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]') || null,
    finalUrl: finalUrl.replace(/patient-profile\/[0-9a-f-]+/i, 'patient-profile/[redacted]'),
    branchRetained: /feature-branch\/pac2-4700-qs-only/i.test(finalUrl),
    patientProfileVisible: await page.getByRole('button', { name: /Patient actions/i }).isVisible().catch(() => false),
  });
  await page.close();
}
await writeFile(path.join(outDir, '47-os-base-branch-patient-navigation.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
