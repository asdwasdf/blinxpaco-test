# Test Cases: PAC2-6763

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-09-28T12:18:10.842Z

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-6763-017 | PAC2-6763-TC-001 | Organisation-level inbox upload smoke and observable result | Exact supported extensions, size limit, final analysis SLA and cleanup control are unspecified |

## Cases

### PAC2-6763-TC-001 — Upload safe synthetic document vào `Document Inbox`

**Type:** Ticket validation / Smoke
**Risk:** High
**Priority:** P0
**Requirements:** REQ-PAC2-6763-017
**Expected-result basis:** Tester-confirmed upload scope plus `ticket.md` revision 1 context that document/file enters the organisation inbox for processing; exact success/final analysis state remains open
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`, current branch observation 2026-09-28
**Entry Path:** `/paco/inbox` → `Upload a document` → `Upload document to inbox` → `Choose a document (PDF, image, Word…)` → `Upload & analyse`
**Context:** Organisation `Document Inbox`
**Environment:** `https://pac2-6763-send-key.dev.blinxpaco-np.com`
**Role:** `Super Admin GB`
**Preconditions:** Authenticated session; host passes configured dev allowlist; inbox visible; unique test filename absent from current search results; baseline counters recorded
**Test Data Category:** Safe synthetic, non-clinical text document; no PII, patient data, clinical claims or external recipient
**Test Data:** One minimal `.pdf` generated locally with marker `PACO QA PAC2-6763`, unique timestamped filename; optional `Source type` and `Source name` blank
**Mutation Class:** Unknown (upload persists unless a safe cleanup control is available)
**Approval Required:** No repeated prompt — execution-first authorization applies; runtime `PACO_ALLOW_MUTATION=true` and host guard required

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open `/paco/inbox`; record visible baseline counters; search the unique filename. | `Document Inbox` loads; the unique filename is absent before upload. |
| 2 | Click `Upload a document`. | Dialog `Upload document to inbox` opens with file chooser, optional source fields, `Cancel`, and disabled `Upload & analyse`. |
| 3 | Select the safe synthetic `.pdf`; leave optional source fields blank. | Selected filename is shown and `Upload & analyse` becomes available, or a user-visible validation error states why the file is rejected. |
| 4 | Click `Upload & analyse` once. | The UI provides an observable submission result: accepted upload appears in the inbox/search or a clear user-visible failure is shown. No final analyser status is assumed. |
| 5 | Search by the unique filename and observe the card/state for a bounded interval. | If accepted, exactly one matching item is visible with an observable inbox state such as `Analysing`, `Needs review`, or `Ready to file`; status, counter change and timestamp are recorded. If no item appears, record the visible failure/timeout rather than infer success. |
| 6 | Inspect only the new item’s available non-destructive controls to identify cleanup. | Cleanup capability is documented without filing, matching, approving, rejecting or deleting unrelated records. |

**Postconditions:** At most one uniquely identifiable test upload exists; mutation ledger records filename hash/redacted marker, immediate UI result, observed state and cleanup status.
**Cleanup:** If the new item exposes a clearly scoped safe delete/remove action, use it with runtime guard and verify search returns no match. If only workflow-changing actions (`File`, `Reject`, patient match) exist or cleanup is unclear, do not alter the record; mark cleanup `pending`/`not available` and record the redacted unique filename as leftover. Never modify baseline items.
**Automation:** Yes after manual `Pass`/`Fail`; standalone spec with externally supplied auth, runtime host/mutation guard, unique file, bounded state wait and cleanup ledger.
**Evidence:** Redacted screenshot or trace of pre-upload absence, dialog/selected file, immediate result, and matching inbox item/error. Promote durable reviewed evidence before `REPORT`.
**Execution History:** Not Run

## Alternate Entry — Separate Scope

Patient `Profile` → `Documents` → `Upload` is verified but is not merged into PAC2-6763-TC-001. It uploads into a patient-specific document list and exposes `No review needed`; expected lifecycle may differ from organisation-level `Upload & analyse`. Add a separate stable case only if tester expands execution scope to this alternate flow.

## Open Questions and Blockers

- Exact accepted PDF/image/Word extensions and maximum size are not specified.
- Exact immediate success message and eventual analyser SLA are unknown; case asserts only an observable accepted item/state or explicit failure.
- Safe cleanup capability is unknown. Execution may leave one uniquely marked synthetic inbox record.
- `Source type` and `Source name` are optional by observed UI; no assertion about their processing effect.
- No blocker for executing PAC2-6763-TC-001 on the configured feature-branch dev host.

## Tester notes

[Protected area]
