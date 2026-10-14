# Exploration: PAC2-8611

**Input Revision:** 1
**Environment:** `dev`
**Role:** `Super User`
**Observed:** 2026-10-02
**Scope:** PACO Assist Chat permission boundary

## Starting state

- Authenticated feature-branch patient profile for tester-selected patient; patient identifiers redacted.
- Entry verified through patient context: top-bar `More options` → `PACO Assist`.

## Observed behavior

1. `PACO Assist` opens as a side panel in patient profile. `[Observed: dev, Super User, 2026-10-02]`
2. Default summary state offers `Summarise Patient Record` and domain shortcuts including `Medications` and `Recent Activity & Encounters`. `[Observed: dev, Super User, 2026-10-02]`
3. `Switch to Chat` changes panel to chat mode. `[Observed: dev, Super User, 2026-10-02]`
4. Chat mode shows textbox `Ask a question about this patient...`, `Start new chat`, `Conversation history`, and an introductory response. `[Observed: dev, Super User, 2026-10-02]`
5. No prompt was submitted during `EXPLORE`; sending a question is reserved for ticket cases in `MANUAL_EXECUTE`.

## Requirement-derived logic

- PACO Assist Chat may answer only within current user's per-domain permission scope. `[Confirmed]` — PAC2-8611/requirements.md (REQ-8611-003)
- User without appointments permission must be stopped when asking `Does this patient have any upcoming appointments?`. `[Confirmed]` — PAC2-8611/requirements.md
- User without medicines/prescribing permission must be stopped when asking `Does this patient have any active permissions?` or `Is this patient on any NSAIDs?`. `[Confirmed]` — tester clarification, PAC2-8611/requirements.md
- Role `Super User` can access patient/chat but tester confirms it lacks medication permission. `[Confirmed]` — tester clarification, 2026-10-02

## Mutation boundary

- Submitting a chat prompt may create conversation history and invoke backend processing. Not performed in `EXPLORE`; authorized ticket-scoped execution belongs to `MANUAL_EXECUTE`.

## Possible defects and risks

- Direct `/paco-talk/` route returns `Page Not Found`; valid entry is patient-context `PACO Assist`. `[Observed]`
- Summary UI visibly exposes a `Medications` shortcut even for this role; visibility alone does not prove data disclosure. Manual prompt execution must verify response content. `[Observed / Open Question]`

## Suggested coverage

- Negative appointments question with role lacking appointments permission.
- Negative medication questions with confirmed `Super User` medication restriction.
- Safe/control question in a permitted domain to distinguish global chat failure from domain-specific refusal.
- Verify denial does not reveal restricted facts, not only that response contains refusal wording.

## Open questions

- Does current `Super User` also lack appointments permission, or only medicines/prescribing permission?
- Which permitted domain should serve as control path for this role?
- Does the tester-selected patient contain appointment and medication data sufficient to detect leakage without recording PII?

## Tester notes

