import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const { qaCampaignName } = JSON.parse(await readFile(path.join(outDir, '42-save-new-qa-campaign.json'), 'utf8'));
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages().filter((candidate) => /\/paco\/patient-profile\//i.test(candidate.url())) || [];
let page;
for (const candidate of pages.toReversed()) if (await candidate.locator('[role="dialog"][class*="quick-send-dialog"]:visible').count()) { page = candidate; break; }
if (!page) throw new Error('Blocked: visible Quick Send missing');
const dialog = page.locator('[role="dialog"][class*="quick-send-dialog"]').last();
const currentTitle = (await dialog.getByText(/\(click to change\)/i).first().locator('xpath=..').innerText()).replace(/\(click to change\)/i, '').replace(/\s+/g, ' ').trim();
const toasts = await page.locator('.p-toast-message:visible').allTextContents();
await dialog.getByText(/\(click to change\)/i).first().click();
const sort = page.locator('.sort-dropdown').first();
await sort.waitFor({ state: 'visible', timeout: 15_000 });
const search = page.locator('input[placeholder*="Search" i]:visible').last();
if (await search.isEditable().catch(() => false)) await search.fill(qaCampaignName);
const exact = page.getByText(qaCampaignName, { exact: true });
const qaMatches = await exact.count();
console.log(JSON.stringify({ currentIsQa: currentTitle === qaCampaignName, qaCampaignFound: qaMatches > 0, qaMatchCount: qaMatches, visibleToastCategory: toasts.some((value) => /success/i.test(value)) ? 'Success' : toasts.length ? 'Other' : 'None' }, null, 2));
await browser.close();
