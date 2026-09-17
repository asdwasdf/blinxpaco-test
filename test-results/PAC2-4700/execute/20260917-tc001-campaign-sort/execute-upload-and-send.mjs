import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const uploadPath = path.join(outDir, 'qa-upload.txt');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const files = dialog.locator('button').filter({ hasText: /^(?:\d+)?Files$/i }).first();
await files.click();
const input = dialog.locator('input[type="file"]').first();
await input.setInputFiles(uploadPath);
await page.waitForTimeout(500);
const uploadedVisible = await dialog.getByText(/qa-upload\.txt/i).isVisible().catch(() => false);
const filesBadge = (await files.innerText()).replace(/\s+/g, ' ').trim();

const action = dialog.getByRole('button', { name: 'quick-send-action' });
await action.click();
await page.waitForTimeout(500);
const visibleDialogs = page.getByRole('dialog').filter({ visible: true });
const dialogCount = await page.locator('[role="dialog"]:visible').count();
const nonQuick = [];
for (let index = 0; index < dialogCount; index += 1) {
  const modal = page.locator('[role="dialog"]:visible').nth(index);
  if (!(await modal.evaluate((node) => node.className.includes('quick-send-dialog')))) {
    nonQuick.push({
      text: (await modal.innerText()).replace(/\s+/g, ' ').trim().slice(0, 1000),
      buttons: (await modal.locator('button:visible').allTextContents()).map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean),
    });
  }
}
const summary = {
  scope: 'Quick Send upload and send confirmation',
  upload: { attempted: true, syntheticFile: 'qa-upload.txt', visibleAfterSelection: uploadedVisible, filesControlText: filesBadge },
  send: { actionClicked: true, confirmationDialogs: nonQuick.map((item) => ({ buttons: item.buttons, textCategory: item.text ? 'present-redacted' : 'empty' })) },
  mutation: { occurred: uploadedVisible, class: 'Temporary until send confirmation', action: 'Synthetic file selected' },
  sensitiveData: { persisted: false, screenshots: false, dialogTextPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '35-upload-send-confirmation-state.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ ...summary, diagnosticDialogs: nonQuick }, null, 2));
await browser.close();
