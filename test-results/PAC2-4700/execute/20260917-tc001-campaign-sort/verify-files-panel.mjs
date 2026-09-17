import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: Quick Send page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const files = dialog.locator('button').filter({ hasText: /^(?:\d+)?Files$/i }).first();
await files.click();
await files.evaluate((button) => {
  if (!button.className.includes('active')) throw new Error('Files tab did not become active');
});

const state = await dialog.evaluate((root) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const visible = (element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  const bounds = root.getBoundingClientRect();
  const controls = [...root.querySelectorAll('button, input, [role="button"]')]
    .filter(visible)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        label: clean(element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent).slice(0, 100),
        type: element.getAttribute('type'),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      };
    })
    .filter(({ label }) => label);
  const main = root.querySelector('.quicksend__main-content');
  return {
    dialogRect: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
    active: [...root.querySelectorAll('button')].some((button) => clean(button.textContent).replace(/^\d+/, '') === 'Files' && button.className.includes('active')),
    controls,
    horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
    mainScroll: main ? { scrollHeight: main.scrollHeight, clientHeight: main.clientHeight, overflowY: getComputedStyle(main).overflowY } : null,
    outsideViewportControls: controls.filter(({ rect }) => rect.left < -1 || rect.top < -1 || rect.right > innerWidth + 1 || rect.bottom > innerHeight + 1),
  };
});
const uploadInputs = await dialog.locator('input[type="file"]').count();
const summary = {
  area: 'Quick Send → Files',
  result: state.active && !state.horizontalOverflow ? 'Pass' : 'Fail',
  ...state,
  uploadInputsObserved: uploadInputs,
  action: 'Panel opened only; no file selected or uploaded',
  mutation: { occurred: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '32-files-panel-verification.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({
  area: summary.area,
  result: summary.result,
  active: summary.active,
  horizontalOverflow: summary.horizontalOverflow,
  outside: summary.outsideViewportControls.length,
  uploadInputsObserved: summary.uploadInputsObserved,
}, null, 2));
await browser.close();
