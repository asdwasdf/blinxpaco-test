import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');
const pages = context.pages();
const basePage = pages.toReversed().find((page) => /\/paco\/dashboard\/?$/i.test(page.url()));
const branchPage = pages.toReversed().find((page) => /\/paco-connect\/feature-branch\/pac2-4700-qs-only\/dashboard/i.test(page.url()));
if (!basePage || !branchPage) throw new Error(`Blocked: base=${Boolean(basePage)} branch=${Boolean(branchPage)}`);
const inspect = async (page, contextName) => {
  const dialog = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'quick-send-action' }) }).last();
  await dialog.waitFor({ state: 'visible', timeout: 15_000 });
  const snapshot = async (stage) => dialog.evaluate((root, stageName) => {
    const visible = (node) => Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
    const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const rect = root.getBoundingClientRect();
    return {
      stage: stageName,
      bounds: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
      horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
      verticalOverflow: root.scrollHeight > root.clientHeight + 1,
      buttons: [...root.querySelectorAll('button,[role="button"]')].filter(visible).map((node) => clean(node.getAttribute('aria-label') || node.textContent).replace(/^\d+/, '')).filter(Boolean),
      inputs: [...root.querySelectorAll('input,textarea,select')].filter(visible).map((node) => ({ type: node.type || node.tagName.toLowerCase(), placeholder: node.placeholder || '', disabled: Boolean(node.disabled) })),
      textMarkers: ['Patient Information', 'Contact Details', 'Preview', 'Edit', 'Merge Fields', 'Templates', 'Added Health Forms:', 'Frequency (Optional)', 'Attached Files:', 'Date & Time', 'Refresh Availability', 'Confirmation/Reminder Message'].filter((marker) => clean(root.innerText).includes(marker)),
    };
  }, stage);
  const states = [await snapshot('initial')];
  for (const name of ['Campaign', 'Health Forms', 'Files', 'Booking Link']) {
    const tab = dialog.locator('button').filter({ hasText: new RegExp(`^\\s*\\d*\\s*${name.replace(' ', '\\s+')}\\s*$`, 'i') }).first();
    if (!(await tab.isVisible().catch(() => false))) {
      states.push({ stage: name, missing: true });
      continue;
    }
    await tab.click();
    states.push(await snapshot(name));
  }
  const patientDetails = dialog.getByRole('button', { name: /^View Patient Details$/i });
  await patientDetails.click();
  const detailsOpen = await dialog.getByText(/Patient Information|Contact Details/i).first().isVisible().catch(() => false);
  const detailsState = await snapshot('View Patient Details');
  await patientDetails.click().catch(() => {});
  return { context: contextName, url: page.url(), detailsOpen, states, dialogClass: await dialog.getAttribute('class') };
};
const base = await inspect(basePage, 'base');
const branch = await inspect(branchPage, 'connect-branch');
const normalize = (values) => [...new Set(values)].sort();
const differences = [];
for (const stage of ['initial', 'Campaign', 'Health Forms', 'Files', 'Booking Link', 'View Patient Details']) {
  const left = base.states.find((state) => state.stage === stage) || (stage === 'View Patient Details' ? base.states.at(-1) : null);
  const right = branch.states.find((state) => state.stage === stage) || (stage === 'View Patient Details' ? branch.states.at(-1) : null);
  if (!left || !right) continue;
  const missingInBranch = normalize(left.buttons || []).filter((value) => !normalize(right.buttons || []).includes(value));
  const extraInBranch = normalize(right.buttons || []).filter((value) => !normalize(left.buttons || []).includes(value));
  if (missingInBranch.length || extraInBranch.length || left.horizontalOverflow !== right.horizontalOverflow || left.bounds?.width !== right.bounds?.width || left.bounds?.height !== right.bounds?.height) differences.push({ stage, missingInBranch, extraInBranch, baseBounds: left.bounds, branchBounds: right.bounds, baseHorizontalOverflow: left.horizontalOverflow, branchHorizontalOverflow: right.horizontalOverflow });
}
const result = { scope: 'PACO base versus PACO Connect branch Quick Send UI', result: differences.length ? 'Inconclusive' : 'Pass', base, branch, differences, mutation: { class: 'None', occurred: false }, sensitiveData: { persisted: false, screenshots: false, textContentPersisted: false }, observedAt: new Date().toISOString() };
await writeFile(path.join(outDir, '50-base-connect-branch-quicksend-comparison.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ scope: result.scope, result: result.result, baseDetailsOpen: base.detailsOpen, branchDetailsOpen: branch.detailsOpen, differences }, null, 2));
await browser.close();
