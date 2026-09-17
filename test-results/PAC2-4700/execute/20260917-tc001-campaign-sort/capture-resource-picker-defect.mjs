import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages.toReversed()) {
  if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]').last().isVisible().catch(() => false)) { page = candidate; break; }
}
if (!page) throw new Error('Blocked: visible Quick Send page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.locator('button').filter({ hasText: /^(?:\d+)?Health Forms$/i }).first().click();
const dropdown = dialog.locator('.p-dropdown').filter({ hasText: /^Select Health Form$/i }).first();
await dropdown.click({ force: true });
await page.waitForTimeout(500);
const panelVisible = await page.locator('.p-dropdown-panel:visible, [role="listbox"]:visible').count() > 0;
const screenshot = path.join(outDir, 'PAC2-4700-health-form-selector-no-open-20260917.png');
await page.screenshot({ path: screenshot, mask: [dialog.locator('.p-dialog-header')], maskColor: '#202020' });
const summary = {
  scope: 'Quick Send Health Form resource selector',
  result: panelVisible ? 'Pass' : 'Fail',
  reason: panelVisible ? 'Resource selector opened' : 'Select Health Form control did not open a list after pointer interaction',
  evidence: path.basename(screenshot),
  mutation: { class: 'Temporary draft state', occurred: false },
  cleanup: { required: false, performed: false, leftovers: [] },
  sensitiveData: { patientHeaderMasked: true, screenshotContainsResourceNames: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '37-resource-selection-result.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
