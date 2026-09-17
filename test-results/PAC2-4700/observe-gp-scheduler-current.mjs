import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => candidate.url().includes('pac2-4700-qs-only.dev.blinxpaco-np.com'));
if (!page) throw new Error('GP feature-branch page missing');
const state = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const body = clean(document.body?.innerText);
  return {
    observedAt: new Date().toISOString(),
    url: location.href,
    title: document.title,
    bodyLength: body.length,
    markers: {
      schedulerConfig: body.includes('SCHEDULER CONFIG'),
      selectCampaignTemplate: body.includes('Select Campaign Template'),
      open: /(^|\s)Open($|\s)/.test(body),
    },
    controls: {
      selectCount: document.querySelectorAll('select').length,
      comboboxCount: document.querySelectorAll('[role="combobox"]').length,
      buttonCount: document.querySelectorAll('button').length,
      inputCount: document.querySelectorAll('input').length,
      iframeCount: document.querySelectorAll('iframe').length,
    },
    mutationOccurred: false,
  };
});
await page.screenshot({ path: path.join(outDir, 'PAC2-4700-EXPLORE-gp-scheduler-current.png'), fullPage: false });
await writeFile(path.join(outDir, 'current-state.json'), JSON.stringify(state, null, 2));
console.log(JSON.stringify(state, null, 2));
process.exit(0);
