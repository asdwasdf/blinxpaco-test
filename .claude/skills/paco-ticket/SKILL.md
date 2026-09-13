---
name: paco-ticket
description: Use when processing one explicitly selected Paco ticket through file-backed QA phases or resuming its checkpoint.
---

# Paco Ticket Orchestrator

## Scope
Process one user-selected ticket. Never scan, crawl, or auto-select tickets.

## Dependencies
Read `paco.config.yaml`, workflow/data/evidence standards, and `docs/tickets/README.md`. Require ticket selection; optional target phase, environment, and run scope. Never guess role, approval, auth validity, or expected result.

## Ownership
Only this skill writes `manifest.yaml` and `status.md`. `ticket/**` is read-only. Verify child artifact before checkpoint. Preserve final `## Tester notes`; stop on unsafe merge.

## Workflow
1. Resolve exactly one ticket; validate regex, confinement, duplicate key, and `ticket.md`.
2. Hash raw source bytes; reconcile revision and classify semantic location changes from `ANALYZE`. Call `markFeatureLocationStale(manifest, changes, now)` before generic stale propagation, then reconcile artifact checksums and legacy v1 manifests without deleting checkpoint history.
3. Resume first valid unfinished phase or validate requested phase. `LOCATE` is required unless a non-UI scope records an exact skip reason.
4. Default browser action to read-only; enforce scoped approval and runtime guards for mutation.
5. Route one child: `ANALYZE` to `paco-requirements`; `LOCATE` to `paco-explore` mode `locate`; `EXPLORE` to `paco-explore` mode `observe`; `TEST_DESIGN` to `paco-test-design`; automation phases to `paco-playwright`; `REPORT` to `paco-report`.
6. For `LOCATE`, require environment, role, valid manual auth and read-only mode; treat tester location clue as optional. Check `feature-map.md` first, validate reusable route in 1–3 meaningful views, otherwise scan from dashboard within 12 views/15 minutes.
7. Validate `ChildSkillOutcome`, phase-mode ownership, path, existence, checksum, budget and zero mutation.
8. Only after verification, atomically update manifest/status and append checkpoint. Preserve candidate/rejected paths; do not repeat a rejected path when dependencies are unchanged.

Automation is optional. Never enter `EXECUTE` with stale dependencies.

## Stop, idempotency, outcome
`Blocked` for missing source/auth/approval/input; `Failed` for technical/artifact errors. Never expand scope or approval. Do not rerun valid phases, reassign stable IDs, delete history, duplicate sources/questions, or overwrite notes. Return ticket/revision/phase/outcome, artifacts, blockers/warnings, and exact next action. Never persist credential, auth state, or reusable approval.
