import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const candidates = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of candidates.toReversed()) {
  if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]').last().isVisible().catch(() => false)) {
    page = candidate;
    break;
  }
}
if (!page) throw new Error('Blocked: visible Quick Send page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const tab = dialog.locator('button').filter({ hasText: /^(?:\d+)?Health Forms$/i }).first();
await tab.click();
const dropdown = dialog.locator('.p-dropdown').filter({ hasText: /^Select Health Form$/i }).first();
await dropdown.click({ position: { x: 300, y: 20 } });
await dropdown.press('ArrowDown').catch(() => {});
const panel = page.locator('.p-dropdown-panel:visible, [role="listbox"]:visible').last();
await panel.waitFor({ state: 'visible', timeout: 10_000 });
const choices = panel.locator('input[type="checkbox"]:visible, [role="checkbox"]:visible');
const rows = panel.locator('[role="option"]:visible, [role="treeitem"]:visible, li:visible');
let selected = false;
let count = await choices.count();
for (let index = 0; index < count; index += 1) {
  const choice = choices.nth(index);
  const checked = await choice.isChecked().catch(async () => (await choice.getAttribute('aria-checked')) === 'true');
  if (!checked) {
    await choice.click();
    selected = true;
    break;
  }
}
if (!selected) {
  count = await rows.count();
  if (count) {
    await rows.first().click();
    selected = true;
  }
}
const badge = (await tab.innerText()).replace(/\s+/g, ' ').trim();
const summary = {
  scope: 'Quick Send resource selection',
  result: selected ? 'Pass' : 'Inconclusive',
  reason: selected ? 'One available Health Form resource selected' : 'No unchecked selectable Health Form resource found',
  observation: { availableCheckboxes: count, selected, controlTextRecorded: false, tabBadgePresent: /^\d+/.test(badge) },
  mutation: { class: 'Temporary draft state', occurred: selected, action: selected ? 'One Health Form resource selected' : 'None' },
  cleanup: { required: selected, performed: false, leftovers: selected ? ['Selected resource remains in open unsent Quick Send draft'] : [] },
  sensitiveData: { persisted: false, screenshots: false, resourceNamePersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '37-resource-selection-result.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
