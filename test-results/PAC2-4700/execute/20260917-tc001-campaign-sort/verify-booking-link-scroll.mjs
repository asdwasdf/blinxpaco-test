import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => /\/paco\/patient-profile\//i.test(candidate.url()));
if (!page) throw new Error('Blocked: Quick Send page missing');
await page.setViewportSize({ width: 1920, height: 945 });
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
await dialog.waitFor({ state: 'visible', timeout: 10_000 });
const booking = dialog.locator('button').filter({ hasText: /^(?:\d+)?Booking Link$/i }).first();
await booking.click();
const confirmation = dialog.getByText(/Confirmation\/Reminder Message/i).first();
await confirmation.waitFor({ state: 'attached', timeout: 15_000 });

const before = await confirmation.evaluate((node) => {
  const rect = node.getBoundingClientRect();
  const ancestors = [];
  for (let element = node.parentElement; element && ancestors.length < 10; element = element.parentElement) {
    const style = getComputedStyle(element);
    if (/(auto|scroll)/.test(style.overflowY) || element.scrollHeight > element.clientHeight + 1) {
      const box = element.getBoundingClientRect();
      ancestors.push({
        cls: String(element.className || '').slice(0, 140),
        overflowY: style.overflowY,
        scrollTop: element.scrollTop,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        rect: { x: box.x, y: box.y, width: box.width, height: box.height },
      });
    }
  }
  return { rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, ancestors };
});

await confirmation.scrollIntoViewIfNeeded();
const after = await confirmation.boundingBox();
const reachable = Boolean(after && after.y >= 0 && after.y + after.height <= 945);
let screenshot = null;
if (!reachable) {
  screenshot = path.join(outDir, 'PAC2-4700-QUICKSEND-booking-link-layout-20260917.png');
  await page.screenshot({
    path: screenshot,
    mask: [dialog.locator('.p-dialog-header'), dialog.locator('[class*="patient"]'), dialog.locator('[class*="contact"]')],
    maskColor: '#202020',
  });
}
const summary = {
  area: 'Quick Send → Booking Link',
  result: reachable ? 'Pass' : 'Fail',
  reason: reachable ? 'Below-fold control reachable through internal scroll' : 'Confirmation/Reminder Message cannot be brought into desktop viewport',
  before,
  after,
  screenshot: screenshot ? path.basename(screenshot) : null,
  mutation: { occurred: false },
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '31-booking-link-scroll-verification.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
