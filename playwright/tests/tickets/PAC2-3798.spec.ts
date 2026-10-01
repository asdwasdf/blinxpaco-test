import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';

const ANALYSER_URL = 'https://pac2-3798.dev.blinxpaco-np.com/patient-analyser/';
const LEGACY_REPORT = 'Test - Male in Advanced Search';

test.describe.configure({ mode: 'serial' });
test.setTimeout(2 * 60_000);

async function openAnalyser(page: Page): Promise<void> {
  await page.goto(ANALYSER_URL, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle('Patient & Medication Analyser');
  await expect(page.getByRole('tab', { name: 'Patient Details', exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/Rows Loaded$/, { exact: false }).first()).toBeVisible({ timeout: 30_000 });
}

async function selectTab(page: Page, name: string): Promise<void> {
  await page.getByRole('tab', { name, exact: true }).click();
  await expect(page.getByRole('tab', { name, exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText(/Rows Loaded$/, { exact: false }).first()).toBeVisible({ timeout: 30_000 });
}

async function openColumns(page: Page): Promise<Locator> {
  const tab = page.getByRole('tab', { name: 'Columns', exact: true });
  await tab.click();
  const panel = page.getByRole('tabpanel', { name: 'Columns', exact: true });
  await expect(panel).toBeVisible();
  return panel;
}

async function openSavedReport(page: Page): Promise<boolean> {
  const report = page.getByText(LEGACY_REPORT, { exact: true }).first();
  if (!await report.isVisible().catch(() => false)) return false;
  await report.click();
  await expect(page.getByText(`Viewing Report: ${LEGACY_REPORT}`, { exact: false })).toBeVisible({ timeout: 30_000 });
  return true;
}

async function closeVisibleDialog(page: Page, name?: string): Promise<void> {
  const dialog = name ? page.getByRole('dialog', { name }) : page.getByRole('dialog').last();
  if (!await dialog.isVisible().catch(() => false)) return;
  const close = dialog.locator('.ag-panel-title-bar-button, .btn--modal-close, button').first();
  await close.click();
  await expect(dialog).toBeHidden();
}

test('PAC2-3798-TC-001/002: report and Advanced Search controls are available', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);
  await expect(page.getByRole('button', { name: 'New', exact: true })).toBeVisible();
  await selectTab(page, 'Patient Analyser');
  await expect(page.getByRole('button', { name: /Advanced Search/ })).toBeVisible();
  await page.close();
});

test('PAC2-3798-TC-003: grid sort does not request patient count again', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);

  const operations: string[] = [];
  page.on('request', (request) => {
    if (!request.url().includes('lambda-url')) return;
    const body = request.postData() ?? '';
    if (body.includes('getDataForAnalyticsAgGrid')) operations.push('grid');
    if (body.includes('GetPatientCount')) operations.push('count');
  });

  const header = page.locator('.ag-header-cell[col-id="patient_nhsnumber"]').first();
  await expect(header).toBeVisible({ timeout: 30_000 });
  await header.click();
  await expect.poll(() => operations.includes('grid')).toBe(true);
  await page.waitForTimeout(750);
  expect(operations).not.toContain('count');
  await page.close();
});

test('PAC2-3798-TC-004: all analyser grids render structural controls', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);
  for (const tab of ['Patient Details', 'Patient Analyser', 'Medication Analyser']) {
    await selectTab(page, tab);
    await expect(page.locator('.ag-root').first()).toBeVisible();
    await openColumns(page);
    await expect(page.getByRole('tab', { name: 'Filters', exact: true })).toBeVisible();
  }
  await page.close();
});

test('PAC2-3798-TC-005: numeric Age cell creates a range chart', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);
  const scroll = page.locator('.ag-body-horizontal-scroll-viewport').first();
  await scroll.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
  const age = page.locator('.ag-cell[col-id="patient_patientage_for_current_date"]').first();
  await expect(age).toBeVisible({ timeout: 30_000 });
  await age.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Chart Range', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Column', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Grouped', exact: true }).click();
  const chart = page.getByRole('dialog', { name: 'Range Chart' });
  await expect(chart).toBeVisible();
  await expect(chart.getByRole('figure', { name: /chart, 1 series/i })).toBeVisible();
  await closeVisibleDialog(page, 'Range Chart');
  await page.close();
});

test('PAC2-3798-TC-006 and DEV-COMMENT-01: Pivot Mode helper exits to standard grid', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);
  await selectTab(page, 'Patient Analyser');
  const columns = await openColumns(page);
  const pivot = columns.getByRole('checkbox', { name: 'Pivot Mode', exact: true });
  await pivot.check();
  const helper = page.getByRole('dialog', { name: 'Pivot Mode' });
  await expect(helper).toBeVisible();
  await closeVisibleDialog(page, 'Pivot Mode');
  await expect(pivot).not.toBeChecked();
  await expect(page.locator('.ag-root').first()).toBeVisible();
  await page.close();
});

test('PAC2-3798-TC-007: legacy Advanced Search loads into current editor', async ({ authenticatedContext }, testInfo) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);
  await selectTab(page, 'Patient Analyser');
  if (!await openSavedReport(page)) testInfo.skip(true, `Fixture unavailable: ${LEGACY_REPORT}`);
  await page.getByRole('button', { name: /Advanced Search/ }).click();
  const editor = page.getByRole('dialog').last();
  await expect(editor.getByText('Demographic Type Rule', { exact: true })).toBeVisible();
  await expect(editor.getByText('Gender Description', { exact: true })).toBeVisible();
  await expect(editor.getByText('Male', { exact: true })).toBeVisible();
  await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.close();
});

test('PAC2-3798-TC-008: saved report URL anchor reloads same report', async ({ authenticatedContext }, testInfo) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);
  await selectTab(page, 'Patient Analyser');
  if (!await openSavedReport(page)) testInfo.skip(true, `Fixture unavailable: ${LEGACY_REPORT}`);
  const reportUrl = page.url();
  expect(new URL(reportUrl).hash).toMatch(/^#.+/);
  await page.goto(reportUrl, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(`Viewing Report: ${LEGACY_REPORT}`, { exact: false })).toBeVisible({ timeout: 30_000 });
  await page.close();
});

test('PAC2-3798-TC-009: Analytics navigation has current labels only', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await page.goto('https://pac2-3798.dev.blinxpaco-np.com/analytics-home/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Capacity & Demand', { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Patient & Meds Analyser', { exact: true })).toBeVisible();
  await expect(page.getByText(/QOF/i, { exact: false })).toHaveCount(0);
  await page.close();
});

test('DEV-COMMENT-02: checkbox header has no menu; data column sorts', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);
  const checkbox = page.locator('.ag-header-cell[col-id="ag-Grid-SelectionColumn"]').first();
  await expect(checkbox).toBeVisible({ timeout: 30_000 });
  await expect(checkbox.locator('.ag-header-cell-menu-button')).toHaveCount(0);
  const header = page.locator('.ag-header-cell[col-id="patient_nhsnumber"]').first();
  await header.click();
  await expect(header).toHaveAttribute('aria-sort', /ascending|descending/);
  await expect(page.getByText(/Rows Loaded$/, { exact: false }).first()).toBeVisible();
  await page.close();
});

test('DEV-COMMENT-03: Reports collapse retains footer and horizontal scrolling', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.newPage();
  await openAnalyser(page);
  await selectTab(page, 'Medication Analyser');
  const footer = page.getByText(/Rows Loaded$/, { exact: false }).first();
  const viewport = page.locator('.ag-body-horizontal-scroll-viewport').first();
  await expect(footer).toBeVisible({ timeout: 30_000 });
  await expect(viewport).toBeVisible();
  await page.locator('.report-container [data-testid="ChevronLeftIcon"], .report-container [data-testid="ChevronRightIcon"]').first().click();
  await expect(footer).toBeVisible();
  const position = await viewport.evaluate((element) => {
    element.scrollLeft = Math.min(500, element.scrollWidth - element.clientWidth);
    return element.scrollLeft;
  });
  expect(position).toBeGreaterThan(0);
  await page.close();
});

test('PAC2-3798-TC-010: CSV regression', ({}, testInfo) => {
  testInfo.skip(true, 'Comms Hub is outside PAC2-3798 scope.');
});

test('PAC2-3798-TC-011: Send to Comms Hub regression', ({}, testInfo) => {
  testInfo.skip(true, 'Comms Hub is outside PAC2-3798 scope.');
});
