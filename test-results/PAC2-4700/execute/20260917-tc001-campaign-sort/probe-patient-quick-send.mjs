import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const target = 'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/dashboard';
await mkdir(outDir, { recursive: true });

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');
let page = context.pages().find((candidate) => /blinx\.dev\.blinxpaco-np\.com\/paco-connect/i.test(candidate.url()));
if (!page) page = await context.newPage();

await page.bringToFront();
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
if (/\/login/i.test(page.url())) throw new Error('Blocked: Authentication expired');
await page.waitForFunction(() => (document.body?.innerText || '').length > 200, null, { timeout: 45_000 });

const expand = page.getByRole('button', { name: /Expand sidebar/i });
if (await expand.first().isVisible().catch(() => false)) await expand.first().click();

const patients = page.getByText(/^Patients$/i).first();
await patients.waitFor({ state: 'visible', timeout: 10_000 });
await patients.click();
await page.waitForTimeout(500);

const patientSearch = page.getByText(/^Patient Search$/i).first();
if (await patientSearch.isVisible().catch(() => false)) await patientSearch.click();
await page.waitForLoadState('domcontentloaded').catch(() => {});
await page.waitForFunction(
  () => /Patient Search|Search patients|Quick Send/i.test(document.body?.innerText || ''),
  null,
  { timeout: 30_000 },
);

const inventory = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const controls = [...document.querySelectorAll('button, a, input, [role="button"], [role="tab"]')]
    .filter((element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length)
    .map((element) => ({
      tag: element.tagName,
      type: element.getAttribute('type'),
      label: clean(element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent).slice(0, 100),
    }))
    .filter(({ label }) => label && /search|filter|patient|quick send|quick/i.test(label))
    .slice(0, 30);
  return {
    url: location.href,
    heading: clean(document.querySelector('h1, h2, [role="heading"]')?.textContent).slice(0, 100),
    controls,
    hasQuickSend: /Quick Send/i.test(document.body?.innerText || ''),
  };
});

const summary = {
  caseId: 'PAC2-4700-TC-001-entry-probe',
  app: 'PACO Connect',
  result: inventory.hasQuickSend ? 'Observed' : 'Blocked',
  mutation: { class: 'None', occurred: false },
  inventory,
  reason: inventory.hasQuickSend
    ? 'Quick Send visible from patient flow'
    : 'Patient flow reached; Quick Send requires selecting or searching a patient',
  sensitiveData: { persisted: false, screenshots: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '25-patient-quick-send-entry.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
