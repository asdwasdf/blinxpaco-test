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
2. Hash raw source bytes; reconcile revision, stale dependencies, and artifact checksums.
3. Resume first valid unfinished phase or validate requested phase.
4. Default browser action to read-only; enforce scoped approval and runtime guards for mutation.
5. Route one child: `ANALYZE` to `paco-requirements`, `EXPLORE` to `paco-explore`, `TEST_DESIGN` to `paco-test-design`, automation phases to `paco-playwright`, `REPORT` to `paco-report`.
6. Validate `ChildSkillOutcome`, ownership, path, existence, and checksum.
7. Only after verification, atomically update manifest/status and append checkpoint.

Automation is optional. Never enter `EXECUTE` with stale dependencies.

## Stop, idempotency, outcome
`Blocked` for missing source/auth/approval/input; `Failed` for technical/artifact errors. Never expand scope or approval. Do not rerun valid phases, reassign stable IDs, delete history, duplicate sources/questions, or overwrite notes. Return ticket/revision/phase/outcome, artifacts, blockers/warnings, and exact next action. Never persist credential, auth state, or reusable approval.
