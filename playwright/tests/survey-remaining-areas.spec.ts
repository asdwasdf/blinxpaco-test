import { test } from '../fixtures/auth-fixtures.js';
import { getDefaultEnvironment, loadConfig } from '../../scripts/load-config.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

const environment = getDefaultEnvironment(loadConfig());
const outputDir = path.join('test-results', 'product-survey', new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5));
const observations: unknown[] = [];

async function capture(page: import('@playwright/test').Page, name: string) {
  const data = {
    name,
    url: page.url(),
    headings: await page.locator('h1, h2, h3').allTextContents(),
    buttons: (await page.getByRole('button').allTextContents()).filter(Boolean),
    text: (await page.locator('body').innerText()).replace(/\b\d{3} \d{3} \d{4}\b/g, '<redacted>').slice(0, 15_000),
  };
  observations.push(data);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'observations.json'), JSON.stringify(observations, null, 2));
  await page.screenshot({ path: path.join(outputDir, `${String(observations.length).padStart(2, '0')}-${name}.png`), fullPage: true, timeout: 15_000 }).catch(() => undefined);
}

test('survey populated Case Workboard without staff status', async ({ authenticatedContext }) => {
  test.setTimeout(5 * 60_000);
  const pages = authenticatedContext.pages();
  if (pages.length !== 1) throw new Error(`Blocked: expected one browser tab, found ${pages.length}`);
  const page = pages[0];
  page.setDefaultTimeout(7_000);

  await page.goto(`${environment.baseUrl}/paco/workboards?tab=case`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.getByText('Loading workboards...', { exact: true }).waitFor({ state: 'hidden', timeout: 45_000 }).catch(() => undefined);
  await page.waitForTimeout(3_000);
  await capture(page, 'case-workboards-loaded');

  const statusPrompt = page.getByText('Set your status', { exact: true });
  if (await statusPrompt.isVisible().catch(() => false)) {
    console.log(`PACO_SURVEY_OUTPUT=${outputDir}`);
    console.log('PACO_SURVEY_BLOCKED=staff-status-prompt');
    return;
  }

  const candidates = page.getByText(/waiting list/i);
  let opened = false;
  for (let index = 0; index < await candidates.count(); index += 1) {
    if (await candidates.nth(index).isVisible()) {
      await candidates.nth(index).click();
      opened = true;
      break;
    }
  }
  if (!opened) {
    console.log(`PACO_SURVEY_OUTPUT=${outputDir}`);
    console.log('PACO_SURVEY_BLOCKED=no-populated-board-control');
    return;
  }

  await page.waitForTimeout(5_000);
  await capture(page, 'waiting-list-board');

  const listView = page.getByRole('button', { name: 'List View', exact: true });
  if (await listView.isVisible().catch(() => false)) {
    await listView.click();
    await capture(page, 'waiting-list-table');
  }

  const filters = page.getByText('Filters', { exact: true }).last();
  if (await filters.isVisible().catch(() => false)) {
    await filters.click();
    await capture(page, 'case-workboard-filters');
  }

  console.log(`PACO_SURVEY_OUTPUT=${outputDir}`);
});
