# Automation: PAC2-7201

**Input Revision:** 1
**Environment:** dev — `https://nhs-comms-hub-dev.blinxhealthcare.com`
**Updated:** 2026-09-14
**Owner:** paco-playwright

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| PAC2-7201-TC-001 | Yes | Valid | Confirmed | Yes | **Allowed** |
| PAC2-7201-TC-002 | Yes | Valid | Confirmed | Yes | **Allowed** |

- Feature location: `Comms Hub > Campaign Manager`, URL `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager`
- Evidence: `feature-location.md` (sha256 835df4dc..., confirmed by tester route)
- Role: `blinx_johnny.bravo`, home org = `General Practice (Blinx Demo Site) (YGMQJ)`, view access = `Redmoor Liverpool (Non-OBE) (M85065)`

## Assessment

| Test Case | Decision | Reason | Mutation | Approval |
|---|---|---|---|---|
| PAC2-7201-TC-001 | **Yes** | Location Confirmed, role known, expected-result Confirmed (product design text: "will NOT be able to edit" → creator retains edit) | Persistent (Create campaign + Share) | Required |
| PAC2-7201-TC-002 | **Yes** | Location Confirmed, role known, expected-result Confirmed (same product text) | None | Not required |

## Automated Tests

| Test Case | Source | Requirement Basis | Status |
|---|---|---|---|
| PAC2-7201-TC-001 | `playwright/tests/tickets/PAC2-7201-TC-001-002.spec.ts` | REQ-PAC2-7201-003 (OBS-PAC2-7201-001 design text) | Implemented |
| PAC2-7201-TC-002 | `playwright/tests/tickets/PAC2-7201-TC-001-002.spec.ts` | REQ-PAC2-7201-003 (OBS-PAC2-7201-001 design text) | Implemented |

## Execution History

| Run | Result | Environment | Role | Revision | Evidence |
|---|---|---|---|---|---|
| PAC2-7201-TC-001-auto-2026-09-14 | **Not Run** | dev | blinx_johnny.bravo | 1 | Pending |
| PAC2-7201-TC-002-auto-2026-09-14 | **Not Run** | dev | blinx_johnny.bravo | 1 | Pending |

> Ad-hoc execution from EXPLORE (OBS-PAC2-7201-004): TC-001 → Pass (creator had Edit+Delete), TC-002 → Fail (Redmoor also had Edit+Delete — bug confirmed). Formal execution pending mutation approval.

## Mutation and Cleanup

**Occurred:** TC-001: Yes (campaign create + share); TC-002: No

**Class:** TC-001: Persistent; TC-002: None

**Approval Scope:** TC-001 requires `PACO_ALLOW_MUTATION=true` + `PACO_MUTATION_APPROVAL_JSON` matching `PAC2-7201_TC_001_SCOPE` in `playwright/support/pac7201-mutation.ts`

**Cleanup:**
- TC-001 creates campaign `PAC2-7201-TEST-BDS-to-Redmoor-edited` (Quick Send, shared to Redmoor Liverpool)
- Previous campaign with same name exists from EXPLORE phase (OBS-PAC2-7201-004); test reuses it if present
- Cleanup method: set campaign status to `Paused` via UI (non-destructive); if `Pause` does not respond (known issue with Quick Send type), leave campaign and document identifier — do NOT delete without separate destructive approval
- Leftover identifier (redacted): `PAC2-7201-TEST-BDS-to-Redmoor-edited`, creator org `General Practice (Blinx Demo Site) (YGMQJ)`, shared to `Redmoor Liverpool (Non-OBE) (M85065)`

**Leftover Identifiers:** `PAC2-7201-TEST-BDS-to-Redmoor-edited` (campaign name — redacted from logs)

## Blockers and Warnings

- **Auth:** Browser must be running with CDP on port 9222 (`npm run auth:login`); redirect to login = `Blocked: Authentication expired`
- **TC-001 Mutation Approval:** Requires `PACO_ALLOW_MUTATION=true` env var AND `PACO_MUTATION_APPROVAL_JSON` matching exact scope from `pac7201-mutation.ts`
- **Locator stability:** Icon action buttons use `title`/`aria-label` attributes (e.g., `[title="Edit"]`); these were not explicitly verified via probe — if selectors fail, use role-based fallback or run a scoped probe first
- **Dropdown instability:** `Viewing data for` dropdown may close unexpectedly when clicking off-center — test uses `role=menuitem` targeting org name; if flaky, use direct URL with org context parameter if available
- **Quick Send type:** Campaign from EXPLORE phase and test campaign are both `Quick Send` type — `Pause` button behavior is unknown (did not respond in prior observation); do not treat absence of `Pause` as failure
- **Pre-existing campaign reuse:** TC-002 may reuse `PAC2-7201-TEST-BDS-to-Redmoor-edited` created in EXPLORE — if no such campaign exists, TC-001 must run first to create it

## Run Commands

```bash
# Read-only list (no execution)
npx playwright test --config=playwright.config.ts --list playwright/tests/tickets/PAC2-7201-TC-001-002.spec.ts

# TC-001: requires mutation approval
PACO_ALLOW_MUTATION=true PACO_MUTATION_APPROVAL_JSON='{"run_id":"PAC2-7201-TC-001-auto-2026-09-14","environment":"dev","ticket_key":"PAC2-7201","case_ids":["PAC2-7201-TC-001"],"actions":["Create Quick Send campaign at Blinx Demo Site, share to Redmoor Liverpool, verify creator retains Edit+Delete"],"test_data_fingerprint":"creator=Blinx Demo Site;shared_to=Redmoor Liverpool;campaign_type=Quick Send","mutation_class":"Persistent","approved_at":"2026-09-14T00:00:00.000Z","expires_at":null}' \
  npx playwright test --config=playwright.config.ts playwright/tests/tickets/PAC2-7201-TC-001-002.spec.ts --grep "TC-001"

# TC-002: read-only, no approval needed
npx playwright test --config=playwright.config.ts playwright/tests/tickets/PAC2-7201-TC-001-002.spec.ts --grep "TC-002"

# Both sequentially (requires mutation approval for TC-001)
PACO_ALLOW_MUTATION=true PACO_MUTATION_APPROVAL_JSON='{"run_id":"PAC2-7201-TC-001-auto-2026-09-14","environment":"dev","ticket_key":"PAC2-7201","case_ids":["PAC2-7201-TC-001"],"actions":["Create Quick Send campaign at Blinx Demo Site, share to Redmoor Liverpool, verify creator retains Edit+Delete"],"test_data_fingerprint":"creator=Blinx Demo Site;shared_to=Redmoor Liverpool;campaign_type=Quick Send","mutation_class":"Persistent","approved_at":"2026-09-14T00:00:00.000Z","expires_at":null}' \
  npx playwright test --config=playwright.config.ts playwright/tests/tickets/PAC2-7201-TC-001-002.spec.ts
```

## Expected Results

| Case | Expected | Notes |
|---|---|---|
| TC-001 | **Pass** | Creator should have Edit+Delete — test asserts they are present |
| TC-002 | **Fail** | Shared-to org currently has Edit+Delete (bug); test asserts they are absent — if Edit/Delete are visible, assertion fails = bug captured correctly |

> TC-002 "failing" is the correct test outcome — it means the bug is present and the test is working as a regression detector.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
