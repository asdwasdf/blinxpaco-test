---
name: paco-report
description: Use when compiling versioned Paco QA product results, automation verification, evidence, defects, and safe knowledge proposals.
---

# Paco Report

## Scope and dependencies
`REPORT` only. Require selected ticket/revision, versioned requirements, completed manual records, automation implementation/CLI records or explicit blockers, environment/role, durable evidence and cleanup state. Read traceability/evidence/knowledge standards and report/defect/open-question templates. Do not rerun tests, resolve unsupported conflicts, publish externally or silently promote facts.

## Ownership
Own `report.md`, `defects/**`, curated `evidence/**`, product change log, and the ticket-derived knowledge in `docs/product/feature-map.md`, `docs/product/workflows/<module>.md` (section `## Logic từ ticket`) and `docs/product/open-questions.md`. Preserve final `## Tester notes`. Never update manifest/status or source execution records.

## Workflow
1. Report scope using only `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`.
2. Include separate `## Product Result` and `## Automation Verification` sections. Product Result comes from verified manual execution. Automation Verification states whether each spec ran, matched observation, exposed product mismatch, had automation defect, or was blocked by setup/auth.
3. Never overwrite or reinterpret manual product result from CLI result. CLI `Fail` on the expected product assertion supports reproduction of manual `Fail`; it is not an automation failure. Locator/auth/setup failure does not prove product `Fail`.
4. Link requirement basis, revision, environment, role, attempt/control-path evidence, standalone spec, CLI evidence, mutation ledger, cleanup and leftovers. Promote reviewed/redacted evidence from `test-results/` to `docs/tickets/<ticket-folder>/evidence/`; final report must not depend on temporary raw paths.
5. Create defect only with clear expected basis, met precondition and verified product evidence. Otherwise record limitation/open question or `Inconclusive`.
6. **Knowledge sync is mandatory before recommending `COMPLETE`.** Logic/route were already synced during `LOCATE`/`EXPLORE` (`paco-explore`); here finalize them: in `docs/product/feature-map.md` update `Defect đã biết` (ticket + one line), `Last verified` and the `Ticket → feature` row with the final result; in `docs/product/workflows/<module>.md` `## Logic từ ticket` add defects with result Pass/Fail/Blocked/Not Run/Inconclusive and any behavior newly learned in `MANUAL_EXECUTE`; close/update entries in `open-questions.md`; dated `change-log.md` line. If the earlier sync is missing, perform it now and flag a warning. Keep classification + provenance; never upgrade `Observed`/`Inferred` to `Confirmed`; unsafe merge is a blocker, not a skip. Report synced files + checksums.
7. Never promote patient/NHS identifier, credential/auth detail, ticket test data, clinical/message content, generated class or fragile locator. Ask before changing meaning, resolving conflict, promoting `Confirmed`, or marking `Reviewed`, `Retired`, `Superseded`.
8. Report acceptance-criteria coverage, skipped/blocked cases, intermittent signals, automation coverage and mismatch classification. Regenerate product graph only after safe route/view promotion.

## Direct invocation, stop, outcome
Write only owned artifacts and return proposal; never update manifest/status or call next skill. Missing evidence/basis yields `Incomplete`/`Inconclusive`; unsafe merge is `Failed`. Deduplicate and preserve history. Return `ChildSkillOutcome` v1 with checksums/counts, mutation/cleanup, redaction, blockers/warnings and recommended `COMPLETE` or corrective phase.