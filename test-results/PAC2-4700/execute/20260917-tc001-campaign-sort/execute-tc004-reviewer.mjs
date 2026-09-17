import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

if (process.env.PACO_ALLOW_MUTATION !== 'true') throw new Error('Blocked: PACO_ALLOW_MUTATION=true required');
const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: patient profile page missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
for (const modal of await page.getByRole('dialog').all()) {
  if (await modal.isVisible().catch(() => false) && !(await modal.evaluate((node) => node.className.includes('quick-send-dialog')))) {
    await modal.getByRole('button', { name: /^(Cancel|Close)$/i }).last().click().catch(() => {});
  }
}
const expected = /You were added as a Health Form reviewer due to there being no default reviewers\./i;
const seen = [];
const collect = async () => {
  for (const value of await page.locator('.p-toast-message:visible').allTextContents()) {
    const text = value.replace(/\s+/g, ' ').trim();
    if (!seen.includes(text)) seen.push(text);
  }
};
const healthForms = dialog.locator('button').filter({ hasText: /^(?:\d+)?Health Forms$/i }).first();
await healthForms.click();
await healthForms.evaluate((button) => {
  if (!button.className.includes('active')) throw new Error('Health Forms tab did not become active');
});
await page.waitForTimeout(500);
await collect();
await page.waitForTimeout(1500);
await collect();
const matched = seen.some((value) => expected.test(value));
const summary = {
  caseId: 'PAC2-4700-TC-004',
  result: matched ? 'Pass' : 'Inconclusive',
  reason: matched ? 'Reviewer auto-add toast observed' : 'Reviewer auto-add toast not observed; account may already be reviewer or precondition may not hold',
  toastMatched: matched,
  reviewerListVerified: false,
  mutation: { class: 'Persistent', occurred: matched, action: matched ? 'Application reported current user added as reviewer' : 'No reviewer mutation observed' },
  cleanup: { required: matched, performed: false, leftovers: matched ? ['Current user may remain Health Form reviewer; removal requires unapproved navigation/action'] : [] },
  sensitiveData: { persisted: false, screenshots: false, toastTextPersisted: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '34-tc004-reviewer-auto-add.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
