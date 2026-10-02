import { expect, test } from '../../fixtures/auth-fixtures.js';
import type { Locator, Page } from '@playwright/test';
import { loadConfig } from '../../../scripts/load-config.js';
import { evaluateMutationGate, type MutationRunScope, type WorkflowMutationAuthorization } from '../../../scripts/mutation-gate.js';

// PAC2-8241 — Appointment Book session editor. Locators reused from manual record
// test-results/PAC2-8241/manual/r1/*.js (MANUAL_EXECUTE 2026-10-02).
// TC-001 and TC-007 encode Confirmed expected behaviour and are expected to fail while the defect exists.

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const BOOK_URL = `${BASE_URL}/paco-connect/appointment-book`;
const CONFIG_URL = `${BASE_URL}/paco-connect/configuration`;
const RUN_ID = 'PAC2-8241-automation';
const TICKET = 'PAC2-8241';
const CASE_IDS = ['PAC2-8241-TC-001', 'PAC2-8241-TC-002', 'PAC2-8241-TC-003', 'PAC2-8241-TC-007'];
const ACTION = 'qa-auto-session-create-update-delete';
const FINGERPRINT = 'session=QA-AUTO-PAC2-8241-*;book=111 PC24;location=Temi PCN;no-booking;no-notify';

const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 13).replace('T', '-');
const SESSION_NAME = `QA-AUTO-PAC2-8241-${stamp}`;
const NAME_RE = new RegExp(`Session Name ${SESSION_NAME}`);
const SLOT_COUNT = 48; // 08:00–16:00, 10 min
const BOUNDARY_MSG = /Slots must sit inside the session/;

const authorization: WorkflowMutationAuthorization = {
  source: 'paco-execution-first-workflow',
  product: 'Paco',
  environment: 'dev',
  ticket_key: TICKET,
  case_ids: CASE_IDS,
  actions: [ACTION],
  test_data_fingerprint: FINGERPRINT,
};

function requireMutationGate(caseId: string, currentUrl: string): void {
  const scope: MutationRunScope = {
    run_id: RUN_ID,
    environment: 'dev',
    current_url: currentUrl,
    ticket_key: TICKET,
    case_id: caseId,
    action: ACTION,
    test_data_fingerprint: FINGERPRINT,
    mutation_class: 'Persistent',
  };
  const gate = evaluateMutationGate(
    scope,
    null,
    { PACO_ALLOW_MUTATION: process.env.PACO_ALLOW_MUTATION },
    new Date().toISOString(),
    loadConfig().safety,
    authorization,
  );
  if (!gate.allowed) throw new Error(`Blocked: mutation not allowed — ${gate.reason}`);
}

function assertTargetHost(page: Page): void {
  expect(new URL(page.url()).hostname).toBe(new URL(BASE_URL).hostname);
}

let page: Page;
// Tester requested slower pacing: PrimeReact dropdowns re-render and detach options when clicked too fast.
const STEP_MS = Number(process.env.PACO_STEP_MS ?? 1000);
const settle = (ms = STEP_MS) => page.waitForTimeout(ms);

async function openFieldDropdown(label: string): Promise<void> {
  // Label's decorative `pi-spinner` icon always spins; the real control is the PrimeReact multiselect/dropdown beside it.
  const field = page.getByText(label, { exact: true }).locator('xpath=..')
    .locator('[data-pc-name="multiselect"], [data-pc-name="dropdown"]').first();
  await expect(field).not.toHaveAttribute('aria-busy', 'true', { timeout: 60_000 });
  await settle();
  // Control keeps re-rendering (never "stable"), so no scrollIntoView; force click as in manual record.
  await field.click({ force: true, timeout: 15_000 });
}
let created = false;

const header = () => page.getByRole('button', { name: NAME_RE }).first();
const region = () => page.getByRole('region', { name: new RegExp(SESSION_NAME) });
const dialog = () => page.getByRole('dialog');
const slotItems = () => dialog().locator('[aria-label=slot-item]');

async function openBook(): Promise<void> {
  await page.goto(BOOK_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  assertTargetHost(page);
  await expandSession();
}

async function expandSession(): Promise<void> {
  await expect(header()).toBeVisible({ timeout: 60_000 });
  if ((await header().getAttribute('aria-expanded')) !== 'true') await header().click({ force: true });
  await expect(region().getByRole('button', { name: 'slots span' }).first()).toBeVisible({ timeout: 30_000 });
}

async function dashboardSlots(): Promise<string[]> {
  await expandSession();
  return region().getByRole('button', { name: 'slots span' }).allInnerTexts();
}

async function openSlotEditor(): Promise<Locator> {
  await expandSession();
  await region().getByRole('button', { name: 'slots span' }).nth(2).click({ button: 'right', force: true });
  await settle();
  await page.getByRole('menuitem', { name: 'Edit Session' }).click({ force: true });
  await settle();
  await expect(dialog().getByText('Session ends at:')).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => slotItems().count(), { timeout: 30_000 }).toBeGreaterThan(0);
  await settle(3000);
  if (await dialog().getByRole('button', { name: 'Undo' }).count()) {
    await dialog().getByRole('button', { name: 'Undo' }).click();
    await settle();
  }
  return dialog();
}

async function closeSlotEditor(): Promise<void> {
  if (await dialog().count()) await dialog().getByRole('button', { name: 'Close' }).click({ force: true });
  await expect(dialog()).toHaveCount(0);
}

async function dialogText(): Promise<string> {
  return dialog().innerText();
}

const count = (text: string, re: RegExp) => (text.match(re) ?? []).length;

async function saveSlotEditor(): Promise<number> {
  const resp = page.waitForResponse((r) => /slots\/update/.test(r.url()) && r.request().method() !== 'GET', { timeout: 30_000 });
  await dialog().getByRole('button', { name: 'Save', exact: true }).last().click({ force: true });
  await settle();
  return (await resp).status();
}

async function selectAllAndOpenActions(): Promise<void> {
  await dialog().getByRole('checkbox').first().evaluate((e) => (e as HTMLElement).click());
  await settle();
  await dialog().getByRole('button', { name: 'Actions' }).click({ force: true });
  await settle();
  await expect(page.getByRole('checkbox', { name: 'Bookable' }).last()).toBeVisible();
}

async function bulkSlotType(type: string): Promise<void> {
  await selectAllAndOpenActions();
  await page.locator('.p-dropdown[class*="preview-modal__dropdown"]').last().click({ force: true });
  await settle();
  await page.getByRole('option', { name: type, exact: true }).click({ force: true });
  await settle();
  await page.getByRole('button', { name: 'Save' }).first().click({ force: true });
  await settle();
  await expect.poll(async () => count(await dialogText(), new RegExp(`${type} \\| 10 min`, 'g'))).toBeGreaterThanOrEqual(SLOT_COUNT - 1);
}

async function bulkBookable(want: boolean): Promise<void> {
  await selectAllAndOpenActions();
  const cb = page.getByRole('checkbox', { name: 'Bookable' }).last();
  if ((await cb.isChecked()) !== want) await cb.click({ force: true });
  await page.getByRole('button', { name: 'Save' }).first().click({ force: true });
  await settle();
}

test.describe.serial('PAC2-8241 session editor', () => {
  test.beforeAll(async ({ authenticatedPage }) => {
    page = authenticatedPage;
  });

  test('setup — create QA-AUTO session 08:00–16:00 today', async () => {
    test.setTimeout(240_000);
    await page.goto(CONFIG_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    assertTargetHost(page);
    requireMutationGate(CASE_IDS[1], page.url());
    const heading = page.getByRole('heading', { name: 'Add Session' });
    const closeDropdown = async () => { await heading.click({ force: true }); await settle(); };
    await page.locator('.p-speeddial-button').waitFor({ timeout: 90_000 });
    await expect(page.getByText('Loading sessions').first()).toBeHidden({ timeout: 90_000 });
    // Speed-dial button never reports visible to Playwright; manual record used DOM clicks (create-past.js).
    await page.evaluate(() => (document.querySelector('.p-speeddial-button') as HTMLElement).click());
    await settle();
    await page.evaluate(() => (document.querySelector('a[aria-label="Add"]') as HTMLElement).click());
    await settle();
    console.log('[setup] form opened');
    await page.locator('#slide-bar-right__name__id').fill(SESSION_NAME);
    await settle();
    await page.getByRole('button', { name: 'Frequency' }).click({ force: true });
    await settle();
    await page.getByRole('textbox', { name: 'Hours (From)' }).fill('08:00');
    await settle();
    await page.getByRole('textbox', { name: 'Hours (To)' }).fill('16:00');
    console.log('[setup] hours set');
    await settle();
    await closeDropdown();
    await page.locator('#selected-slot-types__ids').click({ force: true });
    await settle();
    await page.getByRole('option', { name: 'Dermatology Clinic', exact: true }).click({ force: true });
    await settle();
    await page.getByRole('option', { name: 'Test Billable', exact: true }).click({ force: true });
    console.log('[setup] slot types set');
    await settle();
    await closeDropdown();
    await openFieldDropdown('Assigned Appointment Book');
    await settle();
    await page.getByRole('option', { name: '111 PC24', exact: true }).click({ force: true });
    console.log('[setup] book set');
    await settle();
    await closeDropdown();
    await openFieldDropdown('Location 1');
    await settle();
    await page.getByRole('option', { name: 'Temi PCN', exact: true }).click({ force: true });
    console.log('[setup] location set');
    await settle();
    await closeDropdown();
    const resp = page.waitForResponse((r) => /session/i.test(r.url()) && r.request().method() === 'POST', { timeout: 30_000 });
    await page.getByRole('button', { name: 'submit-changes' }).click({ force: true });
    await settle();
    expect((await resp).status()).toBeLessThan(300);
    created = true;
    await expect(heading).toHaveCount(0, { timeout: 30_000 });

    await openBook();
    expect(await dashboardSlots()).toHaveLength(SLOT_COUNT);
  });

  test('PAC2-8241-TC-002 — bulk slot type persists after reopen and fresh reload', async () => {
    test.setTimeout(180_000);
    test.skip(!created, 'Blocked: setup session not created');
    requireMutationGate('PAC2-8241-TC-002', page.url());
    await openSlotEditor();
    await bulkSlotType('Test Billable');
    expect(await saveSlotEditor()).toBe(200);
    await expect(dialog()).toHaveCount(0, { timeout: 30_000 });
    await expect.poll(async () => count((await dashboardSlots()).join('\n'), /Test Billable/g)).toBe(SLOT_COUNT);

    await openSlotEditor();
    expect(count(await dialogText(), /Test Billable \| 10 min/g)).toBe(SLOT_COUNT);
    await closeSlotEditor();

    await page.reload();
    await openSlotEditor();
    const t = await dialogText();
    expect(count(t, /Test Billable \| 10 min/g)).toBe(SLOT_COUNT);
    expect(count(t, /Dermatology Clinic \| 10 min/g)).toBe(0);
    await closeSlotEditor();
  });

  test('PAC2-8241-TC-003 — single Empty/Non-bookable and bulk Bookable toggle persist', async () => {
    test.setTimeout(240_000);
    test.skip(!created, 'Blocked: setup session not created');
    requireMutationGate('PAC2-8241-TC-003', page.url());
    await openSlotEditor();
    // slot 1 (08:00) → not bookable; slot 2 (08:10) → Empty Slot Type.
    // Per-slot menu = unlabeled button in slot-item → panel `.…preview-modal__dropdown_single_sl…` (verified 2026-10-02).
    const singlePanel = () => page.locator('[class*="preview-modal__dropdown_single_sl"]').last();
    await slotItems().nth(0).getByRole('button').last().click({ force: true });
    await settle();
    await expect(singlePanel()).toBeVisible();
    await singlePanel().locator('#bookable-type').click({ force: true, timeout: 15_000 });
    await settle();
    await singlePanel().getByRole('button', { name: 'Save' }).click({ force: true, timeout: 15_000 });
    await settle();
    console.log('[TC-003] after non-bookable:', count(await dialogText(), /NON-BOOKABLE/gi));
    await slotItems().nth(1).getByRole('button').last().click({ force: true });
    await settle();
    await expect(singlePanel()).toBeVisible();
    await singlePanel().getByText('Empty Slot Type', { exact: true }).click({ force: true, timeout: 15_000 });
    await settle();
    console.log('[TC-003] after empty:', count(await dialogText(), /NON-BOOKABLE/gi), count(await dialogText(), /Empty Slot/g));
    await expect.poll(async () => count(await dialogText(), /NON-BOOKABLE/gi)).toBe(1);
    expect(await saveSlotEditor()).toBe(200);
    await expect(dialog()).toHaveCount(0, { timeout: 30_000 });

    await page.reload();
    await openSlotEditor();
    let t = await dialogText();
    expect(count(t, /NON-BOOKABLE/gi)).toBe(1);
    expect(count(t, /Empty Slot/g)).toBeGreaterThanOrEqual(1);

    await bulkBookable(false);
    await expect.poll(async () => count(await dialogText(), /NON-BOOKABLE/gi)).toBeGreaterThanOrEqual(SLOT_COUNT - 1);
    expect(await saveSlotEditor()).toBe(200);
    await page.reload();
    await openSlotEditor();
    await bulkBookable(true);
    expect(await saveSlotEditor()).toBe(200);

    await page.reload();
    await openSlotEditor();
    t = await dialogText();
    expect(count(t, /NON-BOOKABLE/gi)).toBe(0);
    expect(count(t, /Test Billable \| 10 min/g)).toBe(SLOT_COUNT - 1);
    await closeSlotEditor();
  });

  test('PAC2-8241-TC-001 — slot past session end shows boundary error and is not saved', async () => {
    test.setTimeout(180_000);
    test.skip(!created, 'Blocked: setup session not created');
    requireMutationGate('PAC2-8241-TC-001', page.url());
    const before = await dashboardSlots();
    await openSlotEditor();
    const box = await page.evaluate(([a, b]) => {
      const d = document.querySelector('[role=dialog]')!;
      const labels = [...d.querySelectorAll('.rbc-label')] as HTMLElement[];
      const la = labels.find((e) => e.innerText.trim() === a)!;
      la.scrollIntoView({ block: 'center' });
      const lb = labels.find((e) => e.innerText.trim() === b)!;
      const col = d.querySelector('.rbc-day-slot')!.getBoundingClientRect();
      return { x: col.left + col.width / 2, y1: la.getBoundingClientRect().top + 4, y2: lb.getBoundingClientRect().top + 2 };
    }, ['16:00', '16:10']);
    await page.mouse.move(box.x, box.y1);
    await page.mouse.down();
    await page.mouse.move(box.x, (box.y1 + box.y2) / 2, { steps: 4 });
    await page.mouse.move(box.x, box.y2, { steps: 4 });
    await page.mouse.up();

    // Confirmed (tony.do 2026-09-22): boundary error toast; invalid slot never persisted.
    await expect.soft(page.locator('.p-toast-message').filter({ hasText: BOUNDARY_MSG })).toBeVisible({ timeout: 10_000 });
    if (await dialog().getByRole('button', { name: 'Save', exact: true }).isEnabled()) {
      const status = await saveSlotEditor();
      expect.soft(status, 'failed save must not be a silent server error').toBeLessThan(500);
      await expect.soft(page.locator('.p-toast-message')).toContainText(/error|session/i, { timeout: 10_000 });
    }
    if (await dialog().count()) {
      if (await dialog().getByRole('button', { name: 'Undo' }).count()) await dialog().getByRole('button', { name: 'Undo' }).click();
      await closeSlotEditor();
    }
    await page.reload();
    const after = await dashboardSlots();
    expect(after).toHaveLength(before.length);
    await openSlotEditor();
    await expect(dialog().getByText('Session ends at:')).toContainText(/16:00/);
    await closeSlotEditor();
  });

  test('PAC2-8241-TC-007 — extend Time Range adds default slots, keeps existing, updates immediately', async () => {
    test.setTimeout(180_000);
    test.skip(!created, 'Blocked: setup session not created');
    requireMutationGate('PAC2-8241-TC-007', page.url());
    await openBook();
    const beforeTb = count((await dashboardSlots()).join('\n'), /Test Billable/g);

    await header().getByRole('button').first().click({ force: true });
    await settle();
    await expect(page.getByRole('heading', { name: 'Edit Session' })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Time Range' }).click({ force: true });
    await settle();
    const to = page.getByRole('textbox', { name: 'Hours (To)' });
    await to.click({ force: true });
    await settle();
    await to.fill('17:00');
    await settle();
    await page.keyboard.press('Tab');
    await settle();
    const resp = page.waitForResponse((r) => /sessions\/update/.test(r.url()) && r.request().method() !== 'GET', { timeout: 30_000 });
    await page.getByRole('button', { name: 'submit-changes' }).click({ force: true });
    await settle();
    expect.soft((await resp).status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Edit Session' })).toHaveCount(0, { timeout: 30_000 });

    // Confirmed (tony.do 2026-09-22; Sean 2026-09-20): header + new slots on first save, existing slots kept.
    await expect.soft(header()).toContainText('08:00 - 17:00', { timeout: 3_000 });
    await expect.poll(async () => (await dashboardSlots()).length, { timeout: 15_000 }).toBe(SLOT_COUNT + 6);
    expect(count((await dashboardSlots()).join('\n'), /Test Billable/g)).toBeGreaterThanOrEqual(beforeTb);

    await page.reload();
    expect(await dashboardSlots()).toHaveLength(SLOT_COUNT + 6);
  });

  test.afterAll(async () => {
    test.setTimeout(300_000);
    if (!page) return;
    try {
      await cleanupSession();
    } finally {
      // Auth fixture requires the login tab to be on dashboard for the next run.
      await page.goto(`${BASE_URL}/paco/dashboard`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    }
  });

  async function searchSession(): Promise<void> {
    await page.goto(CONFIG_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    assertTargetHost(page);
    await page.locator('.p-speeddial-button').waitFor({ timeout: 90_000 });
    await expect(page.getByText('Loading sessions').first()).toBeHidden({ timeout: 90_000 });
    await page.getByRole('textbox', { name: 'Search Session...' }).fill(SESSION_NAME);
    await settle(3000);
  }

  async function cleanupSession(): Promise<void> {
    if (!created) return;
    // Cleanup (verified 2026-10-02): ag-grid pinned-right icon button → `Delete` → tick
    // `I understand this is permanent` (.p-checkbox) → `Continue` → POST sessions/deleteSessionById.
    // Grid does not refresh after delete, so verify after reload.
    requireMutationGate(CASE_IDS[1], CONFIG_URL);
    await searchSession();
    const row = page.getByRole('row').filter({ hasText: SESSION_NAME });
    await expect(row.first()).toBeVisible({ timeout: 30_000 });
    const rowId = await row.first().getAttribute('row-id');
    await page.locator(`.ag-pinned-right-cols-container [row-id="${rowId}"] button`).first().click({ force: true });
    await settle();
    await page.getByRole('menuitem', { name: 'Delete' }).click({ force: true });
    await settle();
    const modal = page.locator('[class*=deleteSessionModal]');
    await modal.locator('.p-checkbox').first().click({ force: true });
    await settle();
    await expect(modal.locator('input[type=checkbox]').first()).toBeChecked();
    const resp = page.waitForResponse((r) => /sessions\/deleteSessionById/.test(r.url()), { timeout: 30_000 });
    await modal.getByRole('button', { name: 'Continue' }).click({ force: true });
    expect((await resp).status()).toBe(200);
    await searchSession();
    await expect(page.getByRole('row').filter({ hasText: SESSION_NAME })).toHaveCount(0);
    created = false;
    console.log(`[PAC2-8241] cleanup deleted ${SESSION_NAME}`);
  }
});
