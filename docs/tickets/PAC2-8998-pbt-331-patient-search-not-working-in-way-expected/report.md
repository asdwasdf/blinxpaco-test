# QA Report: PAC2-8998

**Input Revision:** 1
**Environment:** dev (feature-branch `pac2-8998`)
**Role:** Super Admin GB (Test Fiona Nguyen)
**Org:** General Practice (Demo Site) — 78,974 patients
**Run/Scope:** PAC2-8998/manual/r1 (12 active TC + 1 skipped)
**Generated:** 2026-10-13
**Overall:** **Pass**

## Scope and Limitations

**Tested:** 12 active test cases covering REQ-001..009 (minus REQ-003/TC-006). Manual execution via Claude Playwright MCP on dev feature-branch `pac2-8998` with role Super Admin GB.

**Not tested (limitations):**
- **TC-006 (REQ-003 2-word first name):** Skipped. Dev seed has no patient with 2-word first name; tester chose read-only scope (no `Create new patient` mutation). Covered by Tony's 15,000 patient prod sweep (`ticket.md:64-65`).
- **Receptionist/Clinician/Admin role access:** Not verified. Only Super Admin GB tested per tester-confirmed read-only scope.
- **Mutation paths:** Out of scope (read-only run). `Create new patient`, `Filters`, `Patient actions menu`, `Include deleted patients` toggle, row click, profile open — not exercised.
- **Prod / staging:** Out of scope (dev feature-branch only).

## Results

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| PAC2-8998-TC-001 | Pass | REQ-001 Confirmed (`ticket.md:55-56`) | `evidence/manual-r1.json` TC-001; heading `Patient Search (1)` with `phoebe  smitham` (two spaces) | None / N/A |
| PAC2-8998-TC-002 | Pass | REQ-002 Confirmed (`ticket.md:55-56`) | TC-002; heading (1) with `phoebe smitham` | None / N/A |
| PAC2-8998-TC-003 | Pass | REQ-002 Confirmed (middle+surname matching, `ticket.md:60-62`) | TC-003; heading (1) with `Eileen Smitham` (EILEEN is middle name) | None / N/A |
| PAC2-8998-TC-004 | Pass | REQ-002 Confirmed (full-name any-order, `ticket.md:60-62`) | TC-004; heading (1) with `phoebe eileen smitham` | None / N/A |
| PAC2-8998-TC-005 | Pass | REQ-002 Confirmed (NHS field, `ticket.md:64-65`) | TC-005; heading (1) with `9449307539` | None / N/A |
| PAC2-8998-TC-006 | **Skipped** | REQ-003 Confirmed but no dev data; covered by Tony 15k prod sweep | `evidence/manual-r1.json` TC-006 skip_reason | None / N/A |
| PAC2-8998-TC-007 | Pass | REQ-004 Confirmed (`ticket.md:60`) | TC-007; heading (1) with `Smitham, Phoebe` | None / N/A |
| PAC2-8998-TC-008 | Pass | REQ-005 Confirmed (`ticket.md:90-92`) | TC-008; heading (1) with `phoebe ` (trailing space) | None / N/A |
| PAC2-8998-TC-009 | Pass | REQ-005 Confirmed (`ticket.md:90-92`) | TC-009; heading (1) with `smitham,` (trailing comma) | None / N/A |
| PAC2-8998-TC-010 | Pass | REQ-006 Confirmed (`ticket.md:72-73, 80`) | TC-010; top-bar label `Results (50)` with 50 items (`name1000`..`name10045`) | None / N/A |
| PAC2-8998-TC-011 | Pass | REQ-007 Confirmed (`ticket.md:72-80`) | TC-011; PDS heading `Patient Search (5,023)` total match; max 48 unique first names across AG Grid virtual scroll | None / N/A |
| PAC2-8998-TC-012a | Pass | REQ-008 Confirmed (`ticket.md:55, 64-65`) | TC-012a; heading (1) with `Smitham` | None / N/A |
| PAC2-8998-TC-012b | Pass | REQ-008 Confirmed | TC-012b; heading (1) with `Phoebe` | None / N/A |
| PAC2-8998-TC-012c | Pass | REQ-008 Confirmed (partial surname) | TC-012c; heading (46) with `Smith`; PHOEBE EILEEN SMITHAM in result | None / N/A |
| PAC2-8998-TC-012d | Pass | REQ-008 Confirmed (partial NHS) | TC-012d; heading (169) with `944`; PHOEBE NHS 944 930 7539 contains `944` (in result set; off-viewport at first row) | None / N/A |
| PAC2-8998-TC-013 | Pass | REQ-009 Confirmed (`ticket.md:96-97`) | TC-013; 0 search-related console errors. 9 pre-existing: 8x webchat/agent/appointments 403 + 1x phone-calling asset 404 | None / N/A |

**Total: 12 Pass / 1 Skipped / 0 Fail / 0 Inconclusive.**

## Defects

None created — no product Fail observed.

The PR #7376 fix delivers the contracted behavior:
- Tokenise by `,`/space (single or multiple) — REQ-001
- Each token matches first/middle/surname in any order (logical AND) — REQ-002
- Comma-separated `Surname, First` works — REQ-004
- Trailing separator (space or comma) is ignored — REQ-005
- Cap 50 results on top-bar dropdown (`Results (50)` label) — REQ-006
- Cap 50 results on PDS panel (heading `Patient Search (N)` shows total; AG Grid virtual scroll caps visible) — REQ-007
- No regression on existing queries (single first, single last, partial name, NHS) — REQ-008
- No search-related console errors — REQ-009

## Blockers and Open Questions

| ID | Status | Question / Blocker |
|---|---|---|
| OQ-026 | Answered 2026-10-13 | Top-bar = global header search, not Rocket Bar launcher (OQ-026) |
| OQ-027 | Answered 2026-10-13 | Total match UI affordance: PDS = `Patient Search (N)` heading; top-bar = `Results (50)` cap label (no total) |
| OQ-028 | Answered 2026-10-13 | Dev data lacks 2-word first name; TC-006 Skipped with reason |
| OQ-029 | Open | AG Grid virtual-scroll buffer (~48 unique first names) — implementation detail vs user-perceived cap. Low impact |
| — | Open (from ANALYZE) | Role access (Receptionist/Clinician/Admin) not verified on this run. Not blocking if Super Admin GB scope is acceptable. |

## Video Coverage

N/A — ticket has no video/attachments. Source folder contains only 4 Jira comments from Tony.

## Mutation Ledger and Durable Evidence

- **Mutation class:** None (read-only)
- **Cleanup:** Not applicable (no data created/modified)
- **Leftovers:** None

**Durable evidence (promoted to ticket folder):**
- `docs/tickets/PAC2-8998-pbt-331-patient-search-not-working-in-way-expected/evidence/locate-r1.json` (sha256 `8f15be6d...`) — LOCATE run evidence
- `docs/tickets/PAC2-8998-pbt-331-patient-search-not-working-in-way-expected/evidence/manual-r1.json` (sha256 `ef8f4e3a...`) — MANUAL_EXECUTE record (12 cases + 1 skipped)

**Raw run output (test-results/):**
- `test-results/PAC2-8998/manual/r1/automation.md` (sha256 `467400d5...`)
- `test-results/PAC2-8998/manual/r1/evidence.json` (raw, superseded by promoted copy)
- `test-results/PAC2-8998/manual/r1/helper.js` (runner helper, not in durable path)

## Automation Decision

**Recommendation: Worth automating — Phase AUTOMATE + AUTOMATION_EXECUTE**

**Rationale:**
- 12/12 active TC Pass; deterministic expected results; clear assertion basis from Tony comments and PR #7376 scope.
- AG Grid virtual scroll on PDS page requires `settle()` pacing (per workflow rule 2026-10-02: page re-render chậm; `PACO_STEP_MS`).
- Locators verified during MANUAL_EXECUTE: `input[placeholder="Search Patients..."]`, `input[placeholder*="Search patients by name or NHS number"]`, `h1` heading, `ag-body-viewport`, `[role="row"]`, `[role="gridcell"]`.
- Mutation: None → no approval required; safe to automate on dev.
- Pre-existing console errors (webchat 403, asset 404) are NOT search-related; spec should ignore them.

**Spec plan (for AUTOMATE phase):**
- File: `playwright/tests/tickets/PAC2-8998.spec.ts`
- One Playwright spec covering TC-001..TC-013 (consolidate for speed) or 13 individual specs.
- Encoded expected results tie to ticket REQ (no `Inferred` expected).
- TC-006 excluded (skipped); noted in spec with reason.
- Auth: dev feature-branch via `auth-fixtures` (existing `authenticatedPage` from `playwright/fixtures/`).
- New page object: `playwright/pages/PatientSearchPage.ts` with `searchInput`, `firstNameCell`, `nhsCell`, `topBarSearchInput`, `dropdownResultsLabel`. Source: this MANUAL_EXECUTE run.

## Regression Recommendations

- Add `name1` literal query to a future broad-match cap-50 smoke test (covered by TC-010/TC-011 here).
- Continue surfacing AG Grid virtual-scroll cap behavior in cap-related tickets (`OQ-029`).
- Keep TC-006 in mind if/when a two-word first name seed is added to dev; Tony's 15k prod sweep covers it in the meantime.

## Product Knowledge Proposals

**Updated (already applied during this REPORT phase):**
- `docs/product/feature-map.md` — Patient Search entry: added `PAC2-8998` ticket ref; `Last verified: 2026-10-13`; 2 new `[Confirmed]` logic lines for cap 50 (top-bar `Results (50)` label and PDS `Patient Search (N)` heading + AG Grid virtual scroll); 1 new Defect entry Pass; top-bar footer `Include deleted patients` noted; `Ticket → feature` table row added.
- `docs/product/open-questions.md` — added OQ-026..OQ-029; 3 Answered, 1 Open (OQ-029 AG Grid buffer).
- `docs/product/change-log.md` — 2026-10-13 entry added (3 bullet points: feature-map, ticket-table, open-questions).
- `docs/product/workflows/patient-search.md` — **NEW** workflow file with full business context, entry, read-only flow, decision points, end states, safety boundary, execution guidance, and `## Logic từ ticket` section. Classification `[Observed: dev feature-branch, Super Admin GB, 2026-10-13]`.
- `docs/product/workflows/README.md` — added `patient-search.md` row to index.

**No semantic upgrades:** All Confirmed/Observed/Inferred/Open Question classifications preserved per provenance rules. No new `Confirmed` claim made beyond what's in Tony comments.

**No promotion requests:** Route/control observations on dev remain `Observed` per `paco-report` rule 7 (dev route ≠ product intent Confirmed).

## Sensitive Data Review

- **Test data:** Dev seed only. `PHOEBE EILEEN SMITHAM` (DOB 27/09/1947, NHS 944 930 7539, Fetcham/Surrey) and `name{N} surname{N}` literal pattern. These are dev seeded test patients, not real PHI; address and NHS are synthetic.
- **No credentials, cookies, tokens, auth state captured.**
- **Evidence files contain only structured JSON** (TC IDs, queries, observed text, counts) — no screenshots, no PII in redacted form needed beyond dev seed.
- **Safe to share** as-is within Paco team; do not promote to external publication without further review (dev seed pattern could be considered internal).

## Tester notes
