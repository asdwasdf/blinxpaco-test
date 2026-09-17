import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => candidate.url().includes('pac2-4700-qs-only.dev.blinxpaco-np.com'));
if (!page) throw new Error('GP feature-branch page missing');
if (/\/login/i.test(page.url())) throw new Error('Authentication expired');

const samples = [];
for (const delay of [0, 5000, 10000]) {
  if (delay) await page.waitForTimeout(delay);
  samples.push(await page.evaluate(() => {
    const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const body = clean(document.body?.innerText);
    return {
      observedAt: new Date().toISOString(),
      title: document.title,
      path: location.pathname,
      bodyLength: body.length,
      bodyMarkers: {
        schedulerConfig: body.includes('SCHEDULER CONFIG'),
        selectCampaignTemplate: body.includes('Select Campaign Template'),
        open: /(^|\s)Open($|\s)/.test(body),
      },
      selectCount: document.querySelectorAll('select').length,
      comboboxCount: document.querySelectorAll('[role="combobox"]').length,
      buttonCount: document.querySelectorAll('button').length,
      inputCount: document.querySelectorAll('input').length,
      iframeCount: document.querySelectorAll('iframe').length,
      scriptSources: [...document.scripts].map((script) => script.src).filter(Boolean).map((src) => {
        try { return new URL(src).pathname; } catch { return ''; }
      }).filter(Boolean),
    };
  }));
}

await writeFile(path.join(outDir, 'stability-samples.json'), JSON.stringify({ mutationOccurred: false, samples }, null, 2));
console.log(JSON.stringify(samples, null, 2));
process.exit(0);
