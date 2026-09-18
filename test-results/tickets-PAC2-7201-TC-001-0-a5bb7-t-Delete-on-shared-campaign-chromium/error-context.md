# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tickets/PAC2-7201-TC-001-002.spec.ts >> PAC2-7201-TC-001: Creator retains Edit+Delete after share >> Creator org (Blinx Demo Site) has Edit+Delete on shared campaign
- Location: playwright/tests/tickets/PAC2-7201-TC-001-002.spec.ts:168:5

# Error details

```
Error: Missing PACO_MUTATION_APPROVAL_JSON
```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - generic [ref=f3e2]:
    - img "Blinx Logo" [ref=f3e4]
    - generic [ref=f3e5]:
      - generic [ref=f3e6]:
        - heading "Welcome Back" [level=2] [ref=f3e7]
        - paragraph [ref=f3e8]: Welcome back to Communications Hub.
      - generic [ref=f3e9]:
        - button "Sign In" [ref=f3e10] [cursor=pointer]
        - generic [ref=f3e11] [cursor=pointer]: Username and Password -->
        - generic [ref=f3e14]:
          - link "Terms & Conditions" [ref=f3e15] [cursor=pointer]:
            - /url: "#"
          - text: "|"
          - link "Privacy Policy" [ref=f3e16] [cursor=pointer]:
            - /url: /commshub/privacy-policy
  - generic [ref=f3e18]:
    - text: Powered by
    - img "Blinx Logo" [ref=f3e19]
```

# Test source

```ts
  1   | /**
  2   |  * PAC2-7201: Shared Campaign Edit Permission Bug
  3   |  *
  4   |  * TC-001: Creator org (Blinx Demo Site) retains Edit/Delete after share
  5   |  * TC-002: Shared-to org (Redmoor Liverpool) must NOT have Edit/Delete
  6   |  *
  7   |  * Expected: TC-001 Pass, TC-002 Fail (bug: Redmoor has Edit/Delete when it shouldn't)
  8   |  *
  9   |  * Auth: uses CDP to connect to manual login browser (npm run auth:login)
  10  |  * Mutation: TC-001 requires PACO_ALLOW_MUTATION=true + approval JSON
  11  |  */
  12  | 
  13  | import { test as base, type Page, type Locator, expect } from '@playwright/test';
  14  | import {
  15  |   cdpEndpoint,
  16  |   isAuthenticationUrl,
  17  |   PACO_CDP_PORT,
  18  | } from '../../../scripts/playwright-login.js';
  19  | import {
  20  |   PAC2_7201_TC_001_SCOPE,
  21  |   PAC2_7201_TC_002_SCOPE,
  22  | } from '../../support/pac7201-mutation.js';
  23  | import { evaluateMutationGate } from '../../../scripts/mutation-gate.js';
  24  | import type { MutationApproval, MutationRunScope } from '../../../scripts/mutation-gate.js';
  25  | 
  26  | const CAMPAIGN_MANAGER_URL =
  27  |   'https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager';
  28  | 
  29  | const CAMPAIGN_NAME = 'PAC2-7201-TEST-BDS-to-Redmoor-edited';
  30  | const CREATOR_ORG_DISPLAY = 'Blinx Demo Site';
  31  | const SHARED_TO_ORG_DISPLAY = 'Redmoor Liverpool';
  32  | 
  33  | // ── Auth fixture ──────────────────────────────────────────────────────────────
  34  | 
  35  | type AuthFixtures = { authenticatedPage: Page };
  36  | 
  37  | const test = base.extend<AuthFixtures>({
  38  |   authenticatedPage: async ({}, use, testInfo) => {
  39  |     const { chromium } = await import('@playwright/test');
  40  |     let browser;
  41  |     try {
  42  |       browser = await chromium.connectOverCDP(cdpEndpoint(PACO_CDP_PORT));
  43  |     } catch {
  44  |       testInfo.annotations.push({
  45  |         type: 'blocker',
  46  |         description: 'Login browser not running. Run: npm run auth:login',
  47  |       });
  48  |       throw new Error(
  49  |         'Blocked: Login browser not running. Run: npm run auth:login',
  50  |       );
  51  |     }
  52  | 
  53  |     const contexts = browser.contexts();
  54  |     if (contexts.length !== 1) {
  55  |       throw new Error(
  56  |         `Blocked: expected one login browser context, found ${contexts.length}`,
  57  |       );
  58  |     }
  59  | 
  60  |     const ctx = contexts[0];
  61  |     const pages = ctx.pages();
  62  |     if (pages.length === 0) {
  63  |       throw new Error('Blocked: no pages found in CDP browser context');
  64  |     }
  65  | 
  66  |     const candidate = pages[0];
  67  | 
  68  |     // Navigate to Comms Hub to verify auth; redirected-to-login = Blocked
  69  |     try {
  70  |       await candidate.goto(CAMPAIGN_MANAGER_URL, {
  71  |         timeout: 15_000,
  72  |         waitUntil: 'domcontentloaded',
  73  |       });
  74  |     } catch {
  75  |       // timeout/redirect on cross-origin auth is expected; check URL below
  76  |     }
  77  | 
  78  |     if (isAuthenticationUrl(candidate.url())) {
  79  |       throw new Error(
  80  |         'Blocked: Authentication not valid for Comms Hub origin. ' +
  81  |         'Log in manually at https://nhs-comms-hub-dev.blinxhealthcare.com, ' +
  82  |         'keep browser open, then re-run.',
  83  |       );
  84  |     }
  85  | 
  86  |     await use(candidate);
  87  |   },
  88  | });
  89  | 
  90  | // ── Mutation approval parse ──────────────────────────────────────────────────
  91  | 
  92  | function parseApproval(): MutationApproval {
  93  |   const raw = process.env.PACO_MUTATION_APPROVAL_JSON;
> 94  |   if (!raw) throw new Error('Missing PACO_MUTATION_APPROVAL_JSON');
      |                   ^ Error: Missing PACO_MUTATION_APPROVAL_JSON
  95  |   try {
  96  |     return JSON.parse(raw) as MutationApproval;
  97  |   } catch {
  98  |     throw new Error('Invalid PACO_MUTATION_APPROVAL_JSON');
  99  |   }
  100 | }
  101 | 
  102 | // ── Helper: switch Viewing data for org ──────────────────────────────────────
  103 | 
  104 | async function switchToOrg(page: Page, targetOrg: string): Promise<void> {
  105 |   // Open the "Viewing data for" dropdown
  106 |   const dropdown = page.getByText('Viewing data for', { exact: true });
  107 |   await dropdown.click();
  108 | 
  109 |   // Wait for dropdown menu to appear
  110 |   await page.waitForSelector('role=menu', { timeout: 5000 });
  111 | 
  112 |   // Click the target org option
  113 |   const orgOption = page
  114 |     .getByRole('menuitem', { name: new RegExp(targetOrg, 'i') })
  115 |     .first();
  116 |   await orgOption.click();
  117 | 
  118 |   // Wait for content to reload
  119 |   await page.waitForLoadState('networkidle');
  120 | }
  121 | 
  122 | // ── Helper: find campaign row ───────────────────────────────────────────────
  123 | 
  124 | async function findCampaignRow(
  125 |   page: Page,
  126 |   campaignName: string,
  127 | ): Promise<Locator> {
  128 |   await page.waitForSelector('table');
  129 |   const row = page
  130 |     .locator('tbody tr, table tr')
  131 |     .filter({ hasText: campaignName })
  132 |     .first();
  133 |   await expect(row).toBeVisible({ timeout: 10_000 });
  134 |   return row;
  135 | }
  136 | 
  137 | // ── Helper: get action buttons from a campaign row ─────────────────────────
  138 | 
  139 | interface CampaignActions {
  140 |   performance: Locator;
  141 |   view: Locator;
  142 |   edit: Locator;
  143 |   delete: Locator;
  144 | }
  145 | 
  146 | function getActionButtons(row: Locator): CampaignActions {
  147 |   return {
  148 |     performance: row.locator('[title="Performance"]').first(),
  149 |     view: row.locator('[title="View"]').first(),
  150 |     edit: row
  151 |       .locator(
  152 |         '[title="Edit"], [aria-label*="Edit" i], button[title*="dit"]',
  153 |       )
  154 |       .first(),
  155 |     delete: row
  156 |       .locator(
  157 |         '[title="Delete"], [aria-label*="Delete" i], button[title*="el"]',
  158 |       )
  159 |       .first(),
  160 |   };
  161 | }
  162 | 
  163 | // ── TC-001: Creator retains Edit+Delete ─────────────────────────────────────
  164 | 
  165 | test.describe.serial(
  166 |   'PAC2-7201-TC-001: Creator retains Edit+Delete after share',
  167 |   () => {
  168 |     test(
  169 |       'Creator org (Blinx Demo Site) has Edit+Delete on shared campaign',
  170 |       async ({ authenticatedPage: page }) => {
  171 |         test.setTimeout(5 * 60_000);
  172 | 
  173 |         // ── Mutation gate ───────────────────────────────────────────────────
  174 |         const approval: MutationApproval = parseApproval();
  175 |         const scope: MutationRunScope = PAC2_7201_TC_001_SCOPE;
  176 |         const gate = evaluateMutationGate(
  177 |           scope,
  178 |           approval,
  179 |           { PACO_ALLOW_MUTATION: process.env.PACO_ALLOW_MUTATION },
  180 |           new Date().toISOString(),
  181 |         );
  182 |         if (!gate.allowed) {
  183 |           throw new Error(`Blocked: mutation not allowed — ${gate.reason}`);
  184 |         }
  185 | 
  186 |         // ── Find campaign row ──────────────────────────────────────────────
  187 |         const row = await findCampaignRow(page, CAMPAIGN_NAME);
  188 | 
  189 |         // ── Assert: creator has Performance + Edit + Delete ──────────────────
  190 |         const actions = getActionButtons(row);
  191 | 
  192 |         await expect(actions.performance).toBeVisible({ timeout: 5000 });
  193 |         await expect(actions.edit).toBeVisible({ timeout: 5000 });
  194 |         await expect(actions.delete).toBeVisible({ timeout: 5000 });
```