---
name: paco-requirements
description: Use when analyzing selected Paco ticket sources into atomic requirements with classification and provenance.
---

# Paco Requirements

## Scope and dependencies
`ANALYZE` only. Require selected ticket, `ticket.md`, revision, output directory, and valid `INGEST`. Read knowledge/traceability standards and `docs/templates/requirements.md`. Do not browse Paco, design full tests, conclude fix status, or orchestrate later phases.

## Ownership
Write only `requirements.md`; `ticket/**` is read-only. Preserve final `## Tester notes` or stop.

## Workflow
1. Read primary and relevant supporting source. Khi ticket có `.mp4`/`.webm`, chạy `npm run video:ingest -- <input> <docs/tickets/<ticket>/video>`, review contact sheet/timeline theo frame và coi video là requirement source; không bỏ qua vì model không phát video trực tiếp.
2. Summarize in Vietnamese; keep UI terms in backticks.
3. Split observable claims into stable atomic IDs.
4. Classify `Confirmed`, `Observed`, or `Inferred`; track missing knowledge as `Open Question`.
5. Record lifecycle, exact source/revision, dates, basis, evidence, and related tests.
6. For UI scope, extract exact feature terms, reasonable spelling aliases, actor/context, trigger nouns, target nouns, and known location or `Unknown`. Aliases support search only; never mark a route `Observed` without browser evidence.
7. Optionally read matching `docs/product/workflows/*.md` for search terms, actor/context, prerequisite and open-question hints. Survey workflow is not a requirement source: never create a requirement, expected behavior or `Confirmed` claim from it; record any conflict with ticket sources instead.
8. Keep missing Acceptance Criteria and OCR uncertainty explicit. Mark conflict `Disputed`; never silently choose a source.
9. Compare before write; preserve IDs and deduplicate sources/questions.

## Direct invocation, stop, outcome
Write only owned artifact and return checkpoint proposal; never edit manifest/status or call next skill. Missing source is `Blocked`; technical/merge error is `Failed`; ambiguity may warn. Return `ChildSkillOutcome` v1 with artifact action/checksum, counts, mutation `None`, sensitive-data status, blockers/warnings, and recommended next phase.
