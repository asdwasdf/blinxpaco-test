---
name: paco-explore
description: Use when exploring selected Paco scope through authorized read-only browser observation and evidence capture.
---

# Paco Explore

## Scope and dependencies
`EXPLORE` only. Require selected ticket, valid requirements, environment, manual-auth status, and role when permissions matter. Read data-safety/evidence/knowledge standards and `docs/templates/exploration.md`. Do not crawl, mutate data, treat behavior as intent, design full suites, or orchestrate phases.

## Ownership
Write only `exploration.md`; preserve final `## Tester notes`. Evidence is curated reference, never auth state.

## Workflow
1. Record environment, role label, scope, and timestamp.
2. Navigate, view, search, filter, sort, paginate, or open clearly read-only detail only.
3. Stop before `Create`, `Update`, `Delete`, `Submit`, `Approve`, `Reject`, upload, import, send, or unclear action.
4. Record `Observed` behavior apart from intent with URL and redacted evidence.
5. Record unperformed actions, mismatches, possible defects, and suggested coverage.
6. Never probe private APIs or retain unnecessary bodies, headers, cookies, tokens, or personal data.

## Direct invocation, stop, outcome
Write only owned artifact and return checkpoint proposal; never update manifest/status or call next skill. Missing/expired auth, unknown required role, or mutation boundary is `Blocked`; browser/write fault is `Failed`; weak evidence is `Inconclusive`. Return `ChildSkillOutcome` v1 with checksum, mutation/cleanup, redaction, blockers/warnings, and next phase.
