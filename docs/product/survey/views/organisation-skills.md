---
id: organisation-skills
title: Organisation Skills
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/organisation/skills
controls:
  - name: Search Skills...
    kind: read-only
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Organisation Skills

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Skills` opens a skills register associated with organisation configuration.

## Entry and transitions

The grid exposes `Actions`, `Name`, `Created By`, `Pathways`, `RBAC Skill`, and `Snomed CT Code`. `Search Skills...` is the visible read-only filter. A synthetic no-match query removed all data rows while retaining the grid header/action structure; no explicit empty-state label or pagination summary appeared. Clearing the query restored skill rows.

On 2026-09-22, `Created By` sorting cycled ascending → descending → none. Its keyboard-opened column menu exposed `general`, `filter`, and `columns`. The value filter listed distinct timestamp values; a synthetic no-match produced explicit `No matches.`, then clearing restored all values. The columns panel listed five named fields plus one unlabeled action column. The menu was dismissed without applying a filter, changing visibility, pinning, sizing, or resetting columns. Skill rows and `Actions` were not opened because their persistence boundary was not established. Mutation: `None`.

## Execution guidance

- Setup: authenticated `Super Admin GB` context and selected organisation.
- Safe steps: open page, inspect headings/columns, use search only with non-sensitive text.
- Stop before any control under `Actions` or any create/edit/delete flow.
- Capture route, heading, redacted column structure, and empty/loading/error state if encountered.

## Automation guidance

- Stable landmarks: route, `Skills` heading, `Search Skills...`, grid column headers.
- Wait for grid rows or an explicit empty state after navigation/search.
- Rows depend on selected organisation and current configuration.
- No trusted basis yet for expected row count, skill names, or mappings.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, reverified 2026-09-22. `Created By` sort cycled ascending/descending/none; its filter search produced `No matches.` and was cleared; column inventory was inspected unchanged. Record values omitted. Mutation: `None`.

## Open questions

- Meaning and safety of row `Actions` remain unverified.
- Relationship among `Pathways`, `RBAC Skill`, and `Snomed CT Code` is not confirmed by trusted requirements.

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/organisation/skills`: heading `Skills`; không thấy row hay control mutation sau 2.5s.

Gap / Open Question:

- Chưa phân biệt được empty với tải chậm.

## Tester notes

[Protected area]
