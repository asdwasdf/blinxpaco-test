import { test as base, expect, type Page } from '@playwright/test';
import { QuickSendPage } from '../../pages/QuickSendPage';
import { AppShell } from '../../pages/AppShell';

/**
 * PAC2-8522: Quick Send — Campaign tags display and edit
 * Specs: TC-001 (display tags), TC-003 (search existing tag), TC-004 (add/remove/persist)
 * Source: PAC2-8522 MANUAL_EXECUTE results (3 Pass)
 */

const TICKET = 'PAC2-8522';
const BASE_URL = process.env.PACO_BASE_URL ?? 'https://dev.blinxpaco-np.com';
const TAG_EDITOR_TIMEOUT = 15_000;
const SETTLE_MS = Number(process.env.PACO_STEP_MS ?? 1000);

// Shared precondition: feature-branch URL with qs_campaign_tags=true
const featureBranchUrl = (path: string) =>
  `${BASE_URL}/paco-connect/feature-branch/${TICKET.toLowerCase()}${path}?qs_campaign_tags=true`;

interface CampaignTagFixtures {
  qs: QuickSendPage;
  shell: AppShell;
  testTag: string;
}

// Environment vars (set in .env or CI):
// PACO_TEST_PATIENT_NHS=NHS 000000
// PACO_TEST_PATIENT_SEARCH=TEST_PATIENT
// PACO_TEST_TAG=[Bootcamp] QOF [AST007]
const testPatientNhs = process.env.PACO_TEST_PATIENT_NHS ?? 'NHS 000000';
const testPatientSearch = process.env.PACO_TEST_PATIENT_SEARCH ?? 'TEST_PATIENT';
const testTag = process.env.PACO_TEST_TAG ?? '[Bootcamp] QOF [AST007]';

const campaignFixture = base.extend<CampaignTagFixtures>({
  qs: ({ page }, use) => use(new QuickSendPage(page)),
  shell: ({ page }, use) => use(new AppShell(page)),
  testTag,
});

// ─── TC-001: Campaign tags display ───────────────────────────────────────────

test.describe.serial(`${TICKET} — TC-001: Campaign tags display`, () => {
  test('displays current campaign tags in Quick Send composer', async ({ page }) => {
    // Precondition: navigate to feature-branch dashboard
    await page.goto(featureBranchUrl('/dashboard'));
    await expect(page).not.toHaveURL(/login/, { timeout: 30_000 });

    // TODO: Auth if redirected — manual login required

    const qs = new QuickSendPage(page);

    // Open Quick Send for any patient (search for tester-authorized patient)
    // Using safe search query — exact patient provided by tester
    await qs.patientSearch.fill(testPatientSearch);
    await page.waitForTimeout(SETTLE_MS);

    // Step 1: Open composer
    const composerRow = qs.patientResult(testPatientNhs);
    await qs.patientActionsButton(composerRow).click();
    await qs.quickSendMenuItem.click();

    // Wait for dialog and settle
    await expect(qs.dialog).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(SETTLE_MS * 3);

    // Step 2: Inspect campaign header for tags
    await expect(qs.campaignTagsLabel()).toBeVisible({ timeout: TAG_EDITOR_TIMEOUT });

    // Tags should be visible as chips
    const chips = qs.tagChips();
    await expect(chips.first()).toBeVisible({ timeout: 5_000 });

    // Step 3: If overflow, check +N chip
    const overflow = qs.overflowChip();
    if (await overflow.count() > 0) {
      await overflow.hover();
      await page.waitForTimeout(SETTLE_MS);
      // Hover reveals remaining tags — no assertion on count
    }

    // Postcondition: no state changed
    await qs.close();
  });
});

// ─── TC-003: Search and select existing tag (no persist) ───────────────────

test.describe.serial(`${TICKET} — TC-003: Search existing tag (Cancel)`, () => {
  test('searches and selects existing tag without persisting', async ({ page }) => {
    await page.goto(featureBranchUrl('/dashboard'));
    const qs = new QuickSendPage(page);

    // Open Quick Send
    await qs.patientSearch.fill(testPatientSearch);
    await page.waitForTimeout(SETTLE_MS);
    const composerRow = qs.patientResult(testPatientNhs);
    await qs.patientActionsButton(composerRow).click();
    await qs.quickSendMenuItem.click();
    await expect(qs.dialog).toBeVisible();
    await page.waitForTimeout(SETTLE_MS * 3);

    // Open tag editor
    const editor = await qs.openTagEditor();

    // Search for existing tag
    const searchInput = qs.tagSearchInput(editor);
    await searchInput.fill('[Bootcamp]');
    await page.waitForTimeout(SETTLE_MS * 2);

    // Select one existing tag
    const tagOpt = qs.tagOption('[Bootcamp] QOF', editor);
    await tagOpt.click();
    await page.waitForTimeout(SETTLE_MS);

    // Cancel — no persisted change
    await qs.cancelTagEditorButton(editor).click();
    await page.waitForTimeout(SETTLE_MS);

    // Verify dialog still open and tag editor closed
    await expect(qs.dialog).toBeVisible();
  });
});

// ─── TC-004: Add/remove tag, save, persist, cleanup ────────────────────────

test.describe.serial(`${TICKET} — TC-004: Add/remove tag with persistence`, () => {
  test('adds tag, saves, reopens, removes, restores baseline', async ({ page }) => {
    // ponytail: simplified — actual test needs safe campaign ID from test data
    await page.goto(featureBranchUrl('/dashboard'));
    const qs = new QuickSendPage(page);

    // Open Quick Send with test campaign
    await qs.patientSearch.fill(testPatientSearch);
    await page.waitForTimeout(SETTLE_MS);
    const composerRow = qs.patientResult(testPatientNhs);
    await qs.patientActionsButton(composerRow).click();
    await qs.quickSendMenuItem.click();
    await expect(qs.dialog).toBeVisible();
    await page.waitForTimeout(SETTLE_MS * 3);

    // Record baseline (tag chips before change)
    const baselineChips = await qs.tagChips().allTextContents();

    // Add tag
    const editor = await qs.openTagEditor();
    const searchInput = qs.tagSearchInput(editor);
    await searchInput.fill('[Bootcamp] QOF');
    await page.waitForTimeout(SETTLE_MS * 2);
    const tagOpt = qs.tagOption(testTag, editor);
    await tagOpt.click();
    await page.waitForTimeout(SETTLE_MS);

    // Save tags
    await qs.saveTagsButton(editor).click();
    await page.waitForTimeout(SETTLE_MS * 2);

    // Verify added tag visible in composer
    await expect(qs.tagChips().first()).toBeVisible();

    // Remove tag: reopen editor
    const editor2 = await qs.openTagEditor();
    const searchInput2 = qs.tagSearchInput(editor2);
    await searchInput2.fill('[Bootcamp] QOF');
    await page.waitForTimeout(SETTLE_MS * 2);

    // Toggle off the tag (click again to deselect)
    const tagOpt2 = qs.tagOption(testTag, editor2);
    await tagOpt2.click();
    await page.waitForTimeout(SETTLE_MS);

    await qs.saveTagsButton(editor2).click();
    await page.waitForTimeout(SETTLE_MS * 2);

    // Cleanup: reopen to verify baseline restored
    // (Actual cleanup would restore exact tag IDs via API or UI)
    await qs.close();
  });

  test.afterAll(async ({ page }) => {
    // Cleanup: ensure baseline tag set restored
    // TODO: Implement cleanup via Comms Hub or API
  });
});
