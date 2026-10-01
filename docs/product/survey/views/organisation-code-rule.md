---
id: organisation-code-rule
title: Organisation Code Rule
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /configuration/#code-rules-config
controls:
  - name: Search Snomed Code
    kind: read-only
  - name: Submit
    kind: mutation
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Organisation Code Rule

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Code Rule` hands off from Paco configuration to the legacy `/configuration/#code-rules-config` page titled `Code Rule Config`.

## Entry and transitions

The page exposes `Search Snomed Code`, a `Create or update rules:` section, rule-builder content, and `Submit`. After clean navigation, the legacy shell transitioned correctly to `Code Rule Config`; direct hash changes from another legacy view can temporarily retain stale page content until full navigation completes. Reverified on 2026-09-22: a synthetic no-match search produced no visible listbox, result row, or explicit empty-state message; the rule-builder area and enabled `Submit` remained present. Clearing restored the initial state. No rule was selected, created, updated, or submitted. Mutation: `None`.

## Execution guidance

- Setup: authenticated `Super Admin GB` context and selected organisation.
- Safe steps: open the page and inspect visible labels; use search only with an approved non-sensitive code if needed.
- Stop and request approval before selecting values that form a draft rule or clicking `Submit`.
- Capture the handoff route, page title, section heading, and any redacted empty/error state.

## Automation guidance

- Stable landmarks: `/configuration/#code-rules-config`, page title `Code Rule Config`, `Search Snomed Code`, `Create or update rules:`, `Submit`.
- Wait for title transition from the initial legacy shell to `Code Rule Config`.
- Rule options depend on organisation configuration and SNOMED data.
- No trusted basis yet for rule semantics, validation, or successful submission result.

## Evidence

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. Synthetic no-match search produced no explicit result state; rule-builder content and enabled `Submit` remained visible, then search was cleared. Mutation: `None`.

## Open questions

- Rule operands and generated paragraph were not accessible enough to classify.
- Validation, duplicate handling, and persistence behavior remain unobserved.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `Code Rule` trong Configuration chuyển sang app `/configuration/`; không thấy heading sau 4s.

Gap / Open Question:

- Rời `/paco` sang app cấu hình legacy; nội dung chưa quan sát được.

## Tester notes

[Protected area]
