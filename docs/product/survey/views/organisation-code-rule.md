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
last_observed: 2026-09-19
---

# Organisation Code Rule

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Code Rule` hands off from Paco configuration to the legacy `/configuration/#code-rules-config` page titled `Code Rule Config`.

## Entry and transitions

The page exposes `Search Snomed Code`, a `Create or update rules:` section, `Add Item`, and `Submit`. After a clean dashboard reload, the legacy shell transitioned correctly to `Code Rule Config`; direct hash changes from another legacy view can temporarily retain stale page content until full navigation completes. A synthetic no-match search produced no visible listbox or explicit empty-state message; clearing it restored the initial state. No rule was selected, created, updated, or submitted.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search produced no explicit result state; clean navigation was required after stale legacy hash content. Mutation: `None`.

## Open questions

- Rule operands and generated paragraph were not accessible enough to classify.
- Validation, duplicate handling, and persistence behavior remain unobserved.

## Tester notes

[Protected area]
