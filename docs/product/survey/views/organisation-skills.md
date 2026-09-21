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
last_observed: 2026-09-19
---

# Organisation Skills

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Skills` opens a skills register associated with organisation configuration.

## Entry and transitions

The grid exposes `Actions`, `Name`, `Created By`, `Pathways`, `RBAC Skill`, and `Snomed CT Code`. `Search Skills...` is the visible read-only filter. A synthetic no-match query removed all data rows while retaining the grid header/action structure; no explicit empty-state label or pagination summary appeared. Clearing the query restored skill rows. Skill rows and action controls were not opened because their persistence boundary was not established.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search removed data rows without an explicit empty-state label or pagination summary; clearing it restored rows. Record values omitted. Mutation: `None`.

## Open questions

- Meaning and safety of row `Actions` remain unverified.
- Relationship among `Pathways`, `RBAC Skill`, and `Snomed CT Code` is not confirmed by trusted requirements.

## Tester notes

[Protected area]
