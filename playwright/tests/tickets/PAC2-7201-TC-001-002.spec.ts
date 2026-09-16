/**
 * PAC2-7201: Shared Campaign Edit Permission Bug
 *
 * TC-001: Creator org (Blinx Demo Site) retains Edit/Delete after share
 * TC-002: Shared-to org (Redmoor Liverpool) must NOT have Edit/Delete
 *
 * Expected: TC-001 Pass, TC-002 Fail (bug: Redmoor has Edit/Delete when it shouldn't)
 *
 * Auth: uses CDP to connect to manual login browser (npm run auth:login)
 * Mutation: TC-001 requires PACO_ALLOW_MUTATION=true + approval JSON
 */

import { test as base, type Page, type Locator, expect } from '@playwright/test';
import {
  cdpEndpoint,
  isAuthenticationUrl,
  PACO_CDP_PORT,
} from '../../../scripts/playwright-login.js';
import {
  PAC2_7201_TC_001_SCOPE,
  PAC2_7201_TC_002_SCOPE,
} from '../../support/pac7201-mutation.js';
import { evaluateMutationGate } from '../../../scripts/mutation-gate.js';
import type { MutationApproval, MutationRunScope } from '../../../scripts/mutation-gate.js';

const CAMPAIGN_MANAGER_URL =
  'https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager';

const CAMPAIGN_NAME = 'PAC2-7201-TEST-BDS-to-Redmoor-edited';
const CREATOR_ORG_DISPLAY = 'Blinx Demo Site';
const SHARED_TO_ORG_DISPLAY = 'Redmoor Liverpool';

// ── Auth fixture ──────────────────────────────────────────────────────────────

type AuthFixtures = { authenticatedPage: Page };

const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({}, use, testInfo) => {
    const { chromium } = await import('@playwright/test');
    let browser;
    try {
      browser = await chromium.connectOverCDP(cdpEndpoint(PACO_CDP_PORT));
    } catch {
      testInfo.annotations.push({
        type: 'blocker',
        description: 'Login browser not running. Run: npm run auth:login',
      });
      throw new Error(
        'Blocked: Login browser not running. Run: npm run auth:login',
      );
    }

    const contexts = browser.contexts();
    if (contexts.length !== 1) {
      throw new Error(
        `Blocked: expected one login browser context, found ${contexts.length}`,
      );
    }

    const ctx = contexts[0];
    const pages = ctx.pages();
    if (pages.length === 0) {
      throw new Error('Blocked: no pages found in CDP browser context');
    }

    const candidate = pages[0];

    // Navigate to Comms Hub to verify auth; redirected-to-login = Blocked
    try {
      await candidate.goto(CAMPAIGN_MANAGER_URL, {
        timeout: 15_000,
        waitUntil: 'domcontentloaded',
      });
    } catch {
      // timeout/redirect on cross-origin auth is expected; check URL below
    }

    if (isAuthenticationUrl(candidate.url())) {
      throw new Error(
        'Blocked: Authentication not valid for Comms Hub origin. ' +
        'Log in manually at https://nhs-comms-hub-dev.blinxhealthcare.com, ' +
        'keep browser open, then re-run.',
      );
    }

    await use(candidate);
  },
});

// ── Mutation approval parse ──────────────────────────────────────────────────

function parseApproval(): MutationApproval {
  const raw = process.env.PACO_MUTATION_APPROVAL_JSON;
  if (!raw) throw new Error('Missing PACO_MUTATION_APPROVAL_JSON');
  try {
    return JSON.parse(raw) as MutationApproval;
  } catch {
    throw new Error('Invalid PACO_MUTATION_APPROVAL_JSON');
  }
}

// ── Helper: switch Viewing data for org ──────────────────────────────────────

async function switchToOrg(page: Page, targetOrg: string): Promise<void> {
  // Open the "Viewing data for" dropdown
  const dropdown = page.getByText('Viewing data for', { exact: true });
  await dropdown.click();

  // Wait for dropdown menu to appear
  await page.waitForSelector('role=menu', { timeout: 5000 });

  // Click the target org option
  const orgOption = page
    .getByRole('menuitem', { name: new RegExp(targetOrg, 'i') })
    .first();
  await orgOption.click();

  // Wait for content to reload
  await page.waitForLoadState('networkidle');
}

// ── Helper: find campaign row ───────────────────────────────────────────────

async function findCampaignRow(
  page: Page,
  campaignName: string,
): Promise<Locator> {
  await page.waitForSelector('table');
  const row = page
    .locator('tbody tr, table tr')
    .filter({ hasText: campaignName })
    .first();
  await expect(row).toBeVisible({ timeout: 10_000 });
  return row;
}

// ── Helper: get action buttons from a campaign row ─────────────────────────

interface CampaignActions {
  performance: Locator;
  view: Locator;
  edit: Locator;
  delete: Locator;
}

function getActionButtons(row: Locator): CampaignActions {
  return {
    performance: row.locator('[title="Performance"]').first(),
    view: row.locator('[title="View"]').first(),
    edit: row
      .locator(
        '[title="Edit"], [aria-label*="Edit" i], button[title*="dit"]',
      )
      .first(),
    delete: row
      .locator(
        '[title="Delete"], [aria-label*="Delete" i], button[title*="el"]',
      )
      .first(),
  };
}

// ── TC-001: Creator retains Edit+Delete ─────────────────────────────────────

test.describe.serial(
  'PAC2-7201-TC-001: Creator retains Edit+Delete after share',
  () => {
    test(
      'Creator org (Blinx Demo Site) has Edit+Delete on shared campaign',
      async ({ authenticatedPage: page }) => {
        test.setTimeout(5 * 60_000);

        // ── Mutation gate ───────────────────────────────────────────────────
        const approval: MutationApproval = parseApproval();
        const scope: MutationRunScope = PAC2_7201_TC_001_SCOPE;
        const gate = evaluateMutationGate(
          scope,
          approval,
          { PACO_ALLOW_MUTATION: process.env.PACO_ALLOW_MUTATION },
          new Date().toISOString(),
        );
        if (!gate.allowed) {
          throw new Error(`Blocked: mutation not allowed — ${gate.reason}`);
        }

        // ── Find campaign row ──────────────────────────────────────────────
        const row = await findCampaignRow(page, CAMPAIGN_NAME);

        // ── Assert: creator has Performance + Edit + Delete ──────────────────
        const actions = getActionButtons(row);

        await expect(actions.performance).toBeVisible({ timeout: 5000 });
        await expect(actions.edit).toBeVisible({ timeout: 5000 });
        await expect(actions.delete).toBeVisible({ timeout: 5000 });

        // View (eye) should not appear for creator
        const viewVisible = await actions.view
          .isVisible()
          .catch(() => false);
        expect(viewVisible).toBe(false);

        console.log('TC-001 Result: PASS — Creator has Edit+Delete as expected');
      },
    );
  },
);

// ── TC-002: Shared-to org must NOT have Edit+Delete ─────────────────────────

test.describe.serial(
  'PAC2-7201-TC-002: Shared-to org must NOT have Edit+Delete',
  () => {
    test(
      'Shared-to org (Redmoor Liverpool) must NOT have Edit or Delete on shared campaign',
      async ({ authenticatedPage: page }) => {
        test.setTimeout(5 * 60_000);

        // ── Mutation gate (read-only) ───────────────────────────────────────
        const scope: MutationRunScope = PAC2_7201_TC_002_SCOPE;
        const gate = evaluateMutationGate(scope, null, {}, new Date().toISOString());
        if (!gate.allowed) {
          throw new Error(`Blocked: ${gate.reason}`);
        }

        // ── Switch to Redmoor Liverpool ────────────────────────────────────
        await switchToOrg(page, SHARED_TO_ORG_DISPLAY);

        // ── Find campaign row ──────────────────────────────────────────────
        const row = await findCampaignRow(page, CAMPAIGN_NAME);

        // ── Assert: shared-to has Performance + View, but NOT Edit/Delete ───
        const actions = getActionButtons(row);

        await expect(actions.performance).toBeVisible({ timeout: 5000 });
        await expect(actions.view).toBeVisible({ timeout: 5000 });

        // Core bug assertion: Edit and Delete must be absent
        const editVisible = await actions.edit
          .isVisible({ timeout: 3000 })
          .catch(() => false);
        const deleteVisible = await actions.delete
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        console.log(
          `TC-002 — Edit visible: ${editVisible}, Delete visible: ${deleteVisible}`,
        );

        // If Edit/Delete are visible, the bug is confirmed → test fails
        expect(editVisible).toBe(false);
        expect(deleteVisible).toBe(false);

        console.log(
          'TC-002 Result: PASS — Shared-to org correctly has no Edit+Delete',
        );
      },
    );
  },
);
