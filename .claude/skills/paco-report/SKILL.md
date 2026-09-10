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
2. Link requirement basis, revision, environment, role, evidence, mutation, cleanup, and leftovers.
3. Create defect only with clear expected basis and met precondition; otherwise document limitation/question.
4. May add provenance/evidence, observation, open question, last-verified date, and change-log entry.
5. Ask before changing meaning, resolving conflict, promoting `Confirmed`, or marking `Reviewed`, `Retired`, or `Superseded`.
6. Redact sensitive data; never copy auth state or secrets.

## Direct invocation, stop, outcome
Write only owned artifacts and return proposal; never update manifest/status or call next skill. Missing evidence/basis yields `Incomplete`/`Inconclusive`; unsafe merge is `Failed`. Deduplicate and preserve history. Return `ChildSkillOutcome` v1 with checksums/counts, mutation/cleanup, redaction, blockers/warnings, and recommended `COMPLETE` or corrective phase.
