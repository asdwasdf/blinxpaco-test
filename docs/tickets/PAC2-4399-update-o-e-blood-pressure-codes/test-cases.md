# Test Cases: PAC2-4399

**Input Revision:** 1
**Design Maturity:** Preliminary
**Generated:** 2026-09-22

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-4399-001 | PAC2-4399-TC-001 | E2E filing + target code | Filing flow, safe fixture, EMIS result access |
| REQ-PAC2-4399-002 | PAC2-4399-TC-002 | Migration/config evidence | Redacted trusted DB query/export; approved scope |
| REQ-PAC2-4399-003 | PAC2-4399-TC-003 | Value preservation | Input/result representation, safe fixture, EMIS result access |

## Cases

### PAC2-4399-TC-001 — File blood-pressure reading with the confirmed target code

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-PAC2-4399-001
**Expected-result basis:** Tester-confirmed code pair `ConceptID 75367002` + `DescriptionID 1495437014`; ticket comments `ticket.md:48-76`; ticket has no Acceptance Criteria
**UI-dependent:** Yes
**Feature Location:** Blocked — `feature-location.md` confirms `Code Rule Config`, but not the patient filing flow
**Entry Path:** Known prefix: dashboard → `Patient Search` → `Care Navigation` → `Patient Profile Search`; next patient action unknown
**Context:** patient clinical filing flow
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:**
- QA identifies exact action/flow to enter a blood-pressure reading.
- Approved safe dev test fixture exists.
- EMIS integration/result view is available to tester.
- Per-run mutation approval is recorded with cleanup plan.
**Test Data Category:** approved non-production test patient; valid blood-pressure values
**Test Data:** Do not record patient identifier. Values must be supplied/approved by QA.
**Mutation Class:** Persistent
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open the QA-confirmed patient flow using the approved fixture. | Exact entry landmark appears; no unrelated patient record is selected. |
| 2 | Enter QA-approved blood-pressure values and perform the approved filing action. | Filing outcome is observable; capture redacted evidence. |
| 3 | Inspect the approved EMIS/result surface. | Filed clinical code is `ConceptID 75367002` and `DescriptionID 1495437014`; not `1572871000006101` or `163020007`. |

**Postconditions:** Filed test record is known and traceable in mutation ledger.
**Cleanup:** Use QA-approved cleanup only. Verify cleanup; if unavailable/fails, record redacted residual identifier and do not attempt destructive cleanup.
**Automation:** Blocked — location incomplete; persistent mutation; EMIS assertion requires trusted accessible result.
**Evidence:** Redacted durable screenshot/trace after execution; source `ticket.md:48-76`.
**Execution History:** Not Run.

### PAC2-4399-TC-002 — Verify migration scope with trusted database/config evidence

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-PAC2-4399-002
**Expected-result basis:** Tester-confirmed target pair; ticket mapping discussion `ticket.md:52-72`; migration scope remains disputed
**UI-dependent:** No
**Feature Location:** Not applicable — Paco black-box UI cannot inspect database records
**Entry Path:** Not applicable
**Context:** approved migration/config evidence
**Environment:** Dev scope unless QA explicitly expands scope
**Role:** DB reviewer/developer-provided evidence
**Preconditions:**
- DB reviewer provides redacted, timestamped query/export.
- QA confirms whether all `163020007` records or a defined subset are in scope.
- Evidence identifies source dataset/table and environment without secrets/PII.
**Test Data Category:** redacted configuration/migration evidence
**Test Data:** No raw query credentials, patient data, or unrestricted exports.
**Mutation Class:** None
**Approval Required:** No for reviewed evidence; DB mutation is outside this test.

| Step | Action | Expected Result |
|---|---|---|
| 1 | Review the approved redacted before/after query/export for the defined scope. | Scope and environment are explicit; evidence is timestamped. |
| 2 | Compare mapped records against confirmed target pair. | Every in-scope migrated record maps to `75367002` / `1495437014`. |
| 3 | Review exception/legacy counts. | No unexplained in-scope `163020007` or `1572871000006101` mapping remains; any approved exception is enumerated. |

**Postconditions:** Evidence retained/redacted per policy.
**Cleanup:** None.
**Automation:** Blocked — no approved database access; do not probe private APIs.
**Evidence:** Redacted query/export promoted to `evidence/` only after review.
**Execution History:** Not Run.

### PAC2-4399-TC-003 — Preserve blood-pressure values while changing clinical code

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-4399-003
**Expected-result basis:** Inferred from ticket purpose `ticket.md:14`; expected systolic/diastolic representation is not specified
**UI-dependent:** Yes
**Feature Location:** Blocked — same unresolved patient filing flow as TC-001
**Entry Path:** Known prefix: dashboard → `Patient Search` → `Care Navigation`; subsequent action unknown
**Context:** patient clinical filing flow
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:**
- All TC-001 preconditions.
- QA confirms expected representation of systolic/diastolic values in EMIS.
**Test Data Category:** approved non-production test patient; distinct valid input pair
**Test Data:** Values supplied by QA; no patient identifier in artifact.
**Mutation Class:** Persistent
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | File QA-approved systolic/diastolic input through confirmed flow. | Filing completes under approved scope. |
| 2 | Inspect approved result surface. | Values match the QA-confirmed representation; no loss, swap, or duplicate. |
| 3 | Inspect associated clinical code. | Associated code matches `75367002` / `1495437014`. |

**Postconditions:** Filed test record is known in mutation ledger.
**Cleanup:** Same approved cleanup as TC-001; report residual data if cleanup fails.
**Automation:** Blocked — expected value representation is Inferred; no automation assertion based solely on it.
**Evidence:** Redacted before/input/result evidence after execution.
**Execution History:** Not Run.

## Open Questions and Blockers

1. QA must name the exact patient action/flow for blood-pressure entry. `Quick Form`, `Care Navigator`, and `Quick Send` were observed but not opened because side effects are unknown.
2. QA must provide/approve safe fixture category, exact values, mutation approval, and cleanup method for TC-001/003.
3. Tester must have approved access to the EMIS/result surface that exposes the code pair.
4. DB reviewer must define migration scope: all `163020007` versus a specific `DescriptionID` mapping; then provide redacted query/export for TC-002.
5. BA/PO/domain owner should confirm the EMIS representation of systolic/diastolic values; TC-003 stays Inferred until then.

## Tester notes

