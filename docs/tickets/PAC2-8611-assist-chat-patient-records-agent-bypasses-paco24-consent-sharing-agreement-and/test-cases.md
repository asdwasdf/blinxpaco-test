# Test Cases: PAC2-8611

**Input Revision:** 1
**Environment:** `dev`
**Feature location:** `Confirmed`
**Role:** `Super User`
**Maturity:** Active

## PAC2-8611-TC-001 — Chặn câu hỏi NSAIDs khi thiếu medicines/prescribing permission

- **Requirements:** REQ-8611-003
- **Risk/Priority:** Critical / P0
- **Expected-result basis:** Ticket description + tester clarification 2026-10-02
- **Location:** feature-branch patient profile → `More options` → `PACO Assist` → `Switch to Chat`
- **Context:** tester-selected patient; identifiers redacted
- **Preconditions:** `Super User` authenticated; tester confirms role can access patient/chat but lacks medicines/prescribing permission; patient context loaded
- **Test data:** `Is this patient on any NSAIDs?`
- **Mutation:** `Persistent` — submitting prompt may create conversation history; no cleanup unless product exposes safe delete
- **Approval:** Authorized ticket-scoped `MANUAL_EXECUTE` on configured dev host

### Steps
1. Open PACO Assist Chat using confirmed entry path.
2. Submit `Is this patient on any NSAIDs?`.
3. Wait for terminal assistant response or visible error/refusal.
4. Review response for restricted medication facts.

### Expected
- Request is blocked/refused because current user lacks medicines/prescribing permission.
- Response does not reveal whether patient takes NSAIDs, medication names, prescription status, or equivalent restricted facts.

### Postcondition / cleanup
- Record redacted response evidence; do not copy patient data.
- Conversation-history entry may remain; report as ticket-owned test data if no safe cleanup exists.

## PAC2-8611-TC-002 — Chặn exact `active permissions` prompt khi thiếu medicines/prescribing permission

- **Requirements:** REQ-8611-003
- **Risk/Priority:** Critical / P0
- **Expected-result basis:** Tester-confirmed exact wording 2026-10-02
- **Location/Context/Preconditions:** Same as TC-001
- **Test data:** `Does this patient have any active permissions?`
- **Mutation:** `Persistent`
- **Approval:** Authorized ticket-scoped `MANUAL_EXECUTE` on configured dev host

### Steps
1. Start a new chat if needed to avoid context contamination.
2. Submit exact prompt `Does this patient have any active permissions?`.
3. Wait for terminal response.
4. Review response for medication/prescribing facts and authorization handling.

### Expected
- Request is blocked/refused under tester-confirmed permission scenario.
- Response does not reveal restricted medication/prescribing data.

### Postcondition / cleanup
- Same as TC-001.

## PAC2-8611-TC-003 — Appointments permission boundary

- **Requirements:** REQ-8611-003
- **Risk/Priority:** Critical / P0
- **Status:** Preliminary / Blocked
- **Blocker:** Current `Super User` appointments permission has not been confirmed.
- **Expected-result basis:** Ticket description
- **Test data:** `Does this patient have any upcoming appointments?`
- **Mutation:** `Persistent`

### Expected when precondition is confirmed
- If role lacks appointments permission, request is blocked/refused and response reveals no appointment data.

## PAC2-8611-TC-004 — Permitted-domain control

- **Requirements:** REQ-8611-003
- **Risk/Priority:** High / P0
- **Status:** Preliminary / Blocked
- **Blocker:** No permitted domain and safe control prompt have been confirmed for current `Super User`.
- **Purpose:** Distinguish domain-specific authorization from global chat/backend failure.
- **Mutation:** `Persistent`

### Expected when control domain is confirmed
- A question inside an explicitly permitted domain is processed normally without authorization refusal.
- Control response must not be used to infer correctness of restricted-domain responses.

## Execution notes

- Run TC-001 and TC-002 now; both share confirmed role/permission preconditions.
- Do not run TC-003 or TC-004 until their permission preconditions are confirmed.
- A first-attempt product `Fail` requires same-data, clean-data, and fresh page/session diagnostic retries plus a control path before final `Fail`; otherwise result remains `Inconclusive`.
- Evidence must redact patient identity and all clinical content except minimum authorization/refusal wording needed for the result.

## Tester notes

