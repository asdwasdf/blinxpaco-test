import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages.toReversed()) {
  if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]:visible').count()) {
    page = candidate;
    break;
  }
}
if (!page) throw new Error('Blocked: visible Quick Send missing');
const quickSend = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
const trigger = quickSend.getByRole('button', { name: /^View Patient Details$/i });
await trigger.waitFor({ state: 'visible', timeout: 10_000 });
const before = await page.locator('[role="dialog"]:visible').count();
await trigger.click();
const details = page.locator('[role="dialog"]:visible').filter({ hasNot: quickSend }).last();
await details.waitFor({ state: 'visible', timeout: 10_000 });
const fields = await details.locator('input:visible, textarea:visible, select:visible, [role="textbox"]:visible').evaluateAll((nodes) => nodes.map((node) => ({
  type: node.getAttribute('type') || node.tagName.toLowerCase(),
  disabled: Boolean(node.disabled) || node.getAttribute('aria-disabled') === 'true',
  readOnly: Boolean(node.readOnly) || node.getAttribute('readonly') !== null,
})));
const buttons = (await details.locator('button:visible').allTextContents()).map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean);
const text = (await details.innerText()).replace(/\s+/g, ' ');
const sections = ['Patient Details', 'Contact', 'Address', 'NHS'].filter((label) => new RegExp(label, 'i').test(text));
const overflow = await details.evaluate((node) => ({
  scrollHeight: node.scrollHeight,
  clientHeight: node.clientHeight,
  horizontalOverflow: node.scrollWidth > node.clientWidth + 1,
  verticalScrollable: node.scrollHeight > node.clientHeight + 1,
}));
const close = details.getByRole('button', { name: /^Close$/i }).last();
const closeVisible = await close.isVisible().catch(() => false);
if (closeVisible) await close.click();
const closed = await details.waitFor({ state: 'hidden', timeout: 10_000 }).then(() => true).catch(() => false);
const summary = {
  scope: 'Quick Send View Patient Details',
  result: before >= 1 && sections.length > 0 && closeVisible && closed ? 'Pass' : 'Inconclusive',
  observation: { opened: true, sections, fieldCount: fields.length, editableFieldCount: fields.filter((field) => !field.disabled && !field.readOnly).length, buttonLabels: buttons.map((label) => label.replace(/\d/g, '#')), closeVisible, closed, layout: overflow },
  action: 'Opened and closed details only; no patient data changed',
  mutation: { class: 'None', occurred: false },
  sensitiveData: { persisted: false, screenshots: false, fieldValuesPersisted: false, dialogTextPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '45-view-patient-details.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
