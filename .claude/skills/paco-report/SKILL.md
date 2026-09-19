---
name: paco-report
description: Use when compiling versioned Paco QA results, evidence, defects, limitations, and safe knowledge proposals.
---

# Paco Report

## Scope and dependencies
`REPORT` only. Require selected ticket/revision, versioned requirements, results, environment/role, evidence references, and cleanup state. Read traceability/evidence/knowledge standards and report/defect/open-question templates. Do not rerun tests, resolve unsupported conflicts, publish externally, or silently promote facts.

## Ownership
Own `report.md`, `defects/**`, curated `evidence/**`, and product change log; preserve final `## Tester notes`.

## Workflow
1. Report scope and result as `Pass`, `Fail`, `Blocked`, `Not Run`, or `Inconclusive`.
2. Link requirement basis, revision, environment, role, durable evidence, mutation ledger, cleanup, and leftovers. Promote reviewed/redacted evidence từ `test-results/` vào `docs/tickets/<ticket-folder>/evidence/`; report hoàn tất không được phụ thuộc raw path tạm.
3. Create defect only with clear expected basis and met precondition; otherwise document limitation/question.
4. May add provenance/evidence, observation, open question, last-verified date, and change-log entry.
5. Khi route verified và evidence đã redact, có thể promote bằng allowlist `toSafeFeatureMapEntry()`: feature, ordered entry, observed role, environment, source ticket, last verified và aliases; classification luôn `Observed`.
6. Không promote patient/NHS identifier, credential/auth detail, ticket test data, clinical/message content, generated class hoặc fragile locator.
7. Ask before changing meaning, resolving conflict, promoting `Confirmed`, or marking `Reviewed`, `Retired`, or `Superseded`.
8. Redact sensitive data; never copy auth state or secrets.
9. Report video-to-requirement coverage, unresolved Ask QA early blockers, và automation decision `Worth automating` hoặc `Not worth automating`. Promote safe confirmed route/view Markdown rồi regenerate product graph.

## Direct invocation, stop, outcome
Write only owned artifacts and return proposal; never update manifest/status or call next skill. Missing evidence/basis yields `Incomplete`/`Inconclusive`; unsafe merge is `Failed`. Deduplicate and preserve history. Return `ChildSkillOutcome` v1 with checksums/counts, mutation/cleanup, redaction, blockers/warnings, and recommended `COMPLETE` or corrective phase.
