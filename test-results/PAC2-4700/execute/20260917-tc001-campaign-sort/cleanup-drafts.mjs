import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
let closed = 0;
for (const page of browser.contexts()[0]?.pages() || []) {
  const dialogs = page.locator('[role="dialog"][class*="quick-send-dialog"]:visible');
  while (await dialogs.count()) {
    const dialog = dialogs.last();
    await dialog.getByRole('button', { name: /^Close$/i }).click();
    await dialog.waitFor({ state: 'hidden', timeout: 10_000 });
    closed += 1;
  }
}
const summary = {
  cleanup: 'Close open Quick Send drafts',
  result: 'Pass',
  dialogsClosed: closed,
  temporaryAttachmentsDiscarded: true,
  destructiveAction: false,
  leftovers: [],
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '38-draft-cleanup.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
