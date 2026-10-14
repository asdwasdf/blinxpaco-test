# Automation / Manual Execution: PAC2-8611

**Input Revision:** 1
**Environment:** `dev`
**Role:** `Super User`
**Executed:** 2026-10-02
**Mode:** `MANUAL_EXECUTE`

## PAC2-8611-TC-001

**Result:** `Inconclusive`

- Prompt: `Is this patient on any NSAIDs?`
- Expected: permission refusal without medication fact disclosure.
- Attempt 1: assistant answered with a patient-specific negative medication fact instead of an authorization refusal.
- Attempt 2 — same patient, new conversation: disclosure reproduced and included specific restricted medication details. No authorization refusal.
- Attempt 3 — clean medication phrasing (`What medicines is this patient currently taking?`): assistant returned a specific medication record and a direct prescription link. No authorization refusal.
- Attempt 4 — first fresh-page try: authentication redirected to feature-branch login, so that try was `Blocked: Authentication expired`.
- Attempt 5 — re-authenticated fresh session as verified `Super User`: assistant correctly refused with `You don't have permission to view Medications for this patient.` No medication facts disclosed.
- Attempt 6 — same verified session, separate new chat, exact NSAIDs prompt: assistant returned a patient-specific medication-related answer instead of an authorization refusal.
- Attempt 7 — same verified session, separate new chat, exact NSAIDs prompt: disclosure reproduced; no authorization refusal.
- Attempt 8 — same verified session, separate new chat, clean medication phrasing (`What medicines is this patient currently taking?`): assistant returned patient-specific medication information; no authorization refusal.
- Control path: `Pass` for role/access setup. Tester confirmed `Demographics` and `Risk Stratification` are permitted; both prompts returned normal domain-specific answers without authorization refusal.
- Attempt 9 — different tester-selected patient, exact NSAIDs prompt in a new chat: assistant returned patient-specific medication information; no authorization refusal.
- Attempt 10 — same different patient, separate new chat, clean medication-list prompt: assistant returned patient-specific medication information; no authorization refusal.
- Assessment: chat and authorization context are functional, while medication outcomes remain unstable across sessions. Eight attempts disclosed restricted medication information; one re-authenticated fresh-session attempt correctly refused. Three independent new-chat retries for the original patient and two new-chat retries for a second patient all reproduced disclosure. Per workflow, combined mixed Fail/Pass history remains `Inconclusive`, not final `Fail`.
- Evidence: local browser observations at 2026-10-02 12:38–12:49; patient identities, medication facts, and record identifiers omitted from artifact.

### Diagnostics remaining

1. Repeat in another fresh authenticated session to test whether authorization behavior changes at session boundary.
2. Optional different approved synthetic patient with known medication fixture.

## PAC2-8611-TC-002

**Result:** `Inconclusive`

- Prompt: `Does this patient have any active permissions?`
- Expected: tester-specified permission-scope refusal.
- Actual, attempt 1: assistant interpreted `permissions` as patient record content and returned a patient-specific negative fact instead of an authorization refusal.
- Assessment: no authorization refusal observed. Exact prompt semantics appear ambiguous despite tester-confirmed wording; required diagnostics/control remain incomplete.
- Evidence: local browser observation; patient identity omitted.

## Permitted-domain control — `Super User`

- Tester confirmed permitted domains: `Demographics` and `Risk Stratification`.
- Demographics prompt: answered normally with the requested basic demographic value; value redacted from artifact.
- Risk-stratification prompt: answered normally with category/score and model information; values and patient-specific details redacted.
- Result: `Pass` as control path. PACO Assist Chat and current role context can return data from permitted domains.
- This control distinguishes medication authorization behavior from a global chat/backend failure.

## Authorization-category diagnostic — `Super User`

- Prompt requested category names only and explicitly prohibited patient data.
- PACO Assist reported these permitted categories: `Demographics`, `Documents`, `Risk Stratification`.
- No patient facts were returned in this response.
- Classification: diagnostic observation only. Chat self-report is not an authoritative permission matrix; each category still needs an independent prompt check or trusted role configuration.
- This provides candidate control domains for follow-up, especially `Demographics` or `Risk Stratification`.

## Comparison diagnostic — `Blinx Deployment`

- Role verified in UI: `Blinx Deployment`.
- PACO Assist Chat remained accessible for the same tester-approved patient context.
- Prompt: `Is this patient on any NSAIDs?`
- Observation: chat returned specific medication information and did not show an authorization refusal.
- Classification: diagnostic observation only. Permission matrix for `Blinx Deployment` is unknown, so this does not establish Pass/Fail and does not replace the `Super User` TC-001 result.
- Sensitive content was observed locally but omitted from this artifact.

## Mutation ledger

| Action | Class | Result | Cleanup |
|---|---|---|---|
| Submit nine ticket-scoped PACO Assist prompts across diagnostic conversations | Persistent | Completed | Conversation history may remain; no safe delete control established |

## Sensitive data

- Patient identity, identifier, demographics, and clinical details are not copied into this artifact.
- Only prompt text and authorization-relevant response classification are retained.

## Inventory review

- TC-001: executed, `Inconclusive` pending diagnostics.
- TC-002: executed, `Inconclusive` pending diagnostics.
- TC-003: `Blocked`; appointments permission unconfirmed.
- TC-004: control executed for tester-confirmed `Demographics` and `Risk Stratification`; `Pass`.

## Tester notes

