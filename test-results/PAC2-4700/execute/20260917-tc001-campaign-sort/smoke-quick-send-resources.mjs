import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: Quick Send page missing');
await page.bringToFront();

await page.setViewportSize({ width: 1920, height: 945 });
await page.waitForTimeout(300);
const quickSend = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await quickSend.waitFor({ state: 'visible', timeout: 10_000 });

// Close open Campaign picker without changing selected campaign.
const campaignButton = quickSend.locator('button').filter({ hasText: /^Campaign$/i }).first();
if (await page.getByText(/^Select Campaign$/i).isVisible().catch(() => false)) {
  await campaignButton.click();
}

const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text().slice(0, 500));
});
page.on('pageerror', (error) => pageErrors.push(error.message.slice(0, 500)));

const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
const redact = (value) => clean(value)
  .replace(/Michael\s+Ramella/gi, '[patient]')
  .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]')
  .replace(/\b(?:\d[\s-]?){10,}\b/g, '[number]');

async function inspectTab(label) {
  const button = quickSend.locator('button').filter({ hasText: new RegExp(`^(?:\\d+)?${label}$`, 'i') }).first();
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  await button.click();
  await page.waitForTimeout(300);
  return quickSend.evaluate((root, tabLabel) => {
    const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const isVisible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;
    const dialogRect = root.getBoundingClientRect();
    const active = [...root.querySelectorAll('button')].find((element) => cleanText(element.textContent).replace(/^\d+/, '') === tabLabel && element.className.includes('active'));
    const genericSidebars = [...root.querySelectorAll('[class*="qs_generic_sidebar_container"]')]
      .filter(isVisible)
      .map((element) => cleanText(element.innerText).slice(0, 1200));
    const controls = [...root.querySelectorAll('button, input, [role="button"], [role="treeitem"], [role="option"]')]
      .filter(isVisible)
      .map((element) => cleanText(element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent))
      .filter(Boolean)
      .filter((text) => text.length < 160)
      .slice(0, 120);
    const outside = [...root.querySelectorAll('button, input, [role="button"]')]
      .filter(isVisible)
      .map((element) => ({ element, rect: element.getBoundingClientRect(), label: cleanText(element.getAttribute('aria-label') || element.textContent) }))
      .filter(({ rect }) => rect.right > innerWidth + 1 || rect.left < -1 || rect.bottom > innerHeight + 1 || rect.top < -1)
      .map(({ label, rect }) => ({ label: label.slice(0, 80), rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } }));
    return {
      tab: tabLabel,
      active: Boolean(active),
      dialogRect: { x: dialogRect.x, y: dialogRect.y, width: dialogRect.width, height: dialogRect.height },
      sidebars: genericSidebars,
      controls,
      outsideViewportControls: outside,
      horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
      verticalOverflow: root.scrollHeight > root.clientHeight + 1,
    };
  }, label);
}

const desktop = [];
for (const label of ['Health Forms', 'Booking Link', 'Campaign']) desktop.push(await inspectTab(label));

const suspicious = desktop.some((item) => item.outsideViewportControls.length || item.horizontalOverflow || !item.active);
let screenshot = null;
if (suspicious) {
  screenshot = path.join(outDir, 'PAC2-4700-QUICKSEND-layout-20260917.png');
  await page.screenshot({
    path: screenshot,
    mask: [quickSend.locator('.p-dialog-header'), quickSend.locator('.quicksend__main-row')],
    maskColor: '#202020',
  });
}

const sanitizeTab = (item) => ({
  ...item,
  sidebars: item.sidebars.map(redact),
  controls: item.controls.map(redact),
  outsideViewportControls: item.outsideViewportControls.map((control) => ({ ...control, label: redact(control.label) })),
});
const summary = {
  scope: 'Quick Send read-only resource smoke',
  result: suspicious ? 'Fail' : 'Pass',
  desktop: desktop.map(sanitizeTab),
  consoleErrors: [...new Set(consoleErrors)].slice(0, 20),
  pageErrors: [...new Set(pageErrors)].slice(0, 20),
  screenshot: screenshot ? path.basename(screenshot) : null,
  mutation: { occurred: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '30-quick-send-resource-smoke.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({
  result: summary.result,
  desktop: summary.desktop.map(({ tab, active, horizontalOverflow, outsideViewportControls }) => ({ tab, active, horizontalOverflow, outside: outsideViewportControls.length })),
  consoleErrors: summary.consoleErrors,
  pageErrors: summary.pageErrors,
  screenshot: summary.screenshot,
}, null, 2));
await browser.close();
