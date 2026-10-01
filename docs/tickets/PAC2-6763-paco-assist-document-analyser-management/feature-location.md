# Feature Location: PAC2-6763

**Input Revision:** 1
**Environment:** `https://pac2-6763-send-key.dev.blinxpaco-np.com`
**Role:** `Super Admin GB`
**Observed:** 2026-09-28T12:01:47.370Z
**Status:** Located
**Budget:** 7/12 views; 10/15 minutes

## Search clues

- Tester-confirmed exact scope: upload document on feature branch `PAC2-6763-send-key`; original `PAC2-6763` is context only.
- Exact terms: `Upload`, `Documents`, document upload, patient attachments, document inbox.
- Reusable product-survey hint: `Patient Search` → patient `Profile` → `Documents` → `Upload`.
- Branch noun: `send key`.

## Confirmed entry path

Current-run validation hoàn tất trên feature branch bằng read-only actions:

1. Starting state: authenticated feature-branch `/paco/dashboard`
   - Landmark/control: `Patient Search` sidebar entry
   - Read-only action: Open direct route `/paco/patient-search` after sidebar image click did not navigate
   - Resulting state: `Patient Search (78,820)` grid loaded
   - Context dependency: authenticated `Super Admin GB`
2. `Patient Search`
   - Landmark/control: row with `Registration Type` = `Test Patient`
   - Read-only action: Open row `Actions`
   - Resulting state: menu with `Profile` and `View`
   - Context dependency: safe synthetic test-patient row; identity omitted from artifact
3. Row `Actions` → `Profile`
   - Landmark/control: patient-profile tablist
   - Read-only action: Open `Profile`
   - Resulting state: patient profile dashboard
4. Tab `Documents`
   - Landmark/control: exact `Documents` tab
   - Read-only action: Open tab
   - Resulting state: `/paco/patient-profile/<redacted>/documents`
5. Stop at `Upload`
   - Landmark/control: visible `Upload` drop area beside `No review needed`
   - Resulting state: patient-specific document list
   - Mutation boundary: no file selected or uploaded during `LOCATE`.

Tester-provided additional route, subsequently current-run verified read-only:

1. Direct route `/paco/inbox`
2. `Document Inbox`
3. Sidebar `Upload a document`
4. Dialog `Upload document to inbox`
5. Stop before `Choose a document (PDF, image, Word…)` / `Upload & analyse` mutation.

## Context requirements

- Feature-branch host: `pac2-6763-send-key.dev.blinxpaco-np.com`.
- Authenticated PACO session in the current Claude Playwright plugin tab.
- Role: `Super Admin GB`.
- Safe demo patient visible to this role; no patient identifier may enter shared artifact.
- `Documents` permission with visible `Upload` control.
- Safe synthetic, non-clinical document is required only for later `MANUAL_EXECUTE`.

## Candidate and rejected paths

- Verified: `/paco/patient-search` → safe `Test Patient` row `Actions` → `Profile` → `Documents` → `Upload`.
- Rejected navigation action: dashboard `Patient Search` image click remained on `/paco/dashboard`; direct route succeeded.
- Rejected: `/paco/dashboard` → `More options` → `PACO Assist`; wrong route for tester-confirmed upload scope.
- Historical blocker resolved: authentication was restored before current-run validation.

## Observed landmarks

- Authenticated `/paco/patient-search` showed heading `Patient Search (78,820)` and an `Actions` column.
- A synthetic row explicitly marked `Test Patient` exposed `Actions` → `Profile`.
- Patient profile exposed the exact `Documents` tab.
- `Documents` showed `Upload`, `No review needed`, `Showing 0/0 documents`, and `There are no patient attachments`.

## Evidence

- Current plugin browser observation, 2026-09-28T12:00:23Z–12:01:47Z, feature-branch environment. No credential, token, signed URL, patient identifier or auth-state content persisted.
- Reusable route hint: `docs/product/workflows/patient-profile.md:18-35`; current branch independently re-validated.

## Automation hints

- Wait for authenticated `/paco/patient-search`.
- Use accessible `Search Patients`, row action `Profile`, tab `Documents`, and button `Upload` only after current-run validation.
- Do not embed patient identifier; provide safe fixture through runtime configuration.

## Blockers and next action

- Blocker: Không có cho `LOCATE`.
- Next action: `EXPLORE` read-only tại `Documents`; quan sát upload entry và dừng trước file selection/upload mutation.

## Tester notes

[Protected area]
