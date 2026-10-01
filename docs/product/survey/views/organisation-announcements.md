---
id: organisation-announcements
title: Organisation Announcements
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/organisation/announcements]
controls:
  - { name: Welcome Message, kind: navigation }
  - { name: Service Updates, kind: navigation }
  - { name: Add another, kind: mutation }
  - { name: Delete, kind: destructive }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-22
---

# Organisation Announcements

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Announcements` configures `Welcome Message` and `Service Updates` announcements for selected locations.

## Entry and transitions

Expanded `Welcome Message` contains rich-text editors, `Apply to locations` selectors, `Add another`, `Delete`, and page-level `Save`. Selecting `Service Updates` collapses `Welcome Message` and expands a separate service-update editor. Reverified on 2026-09-22: the service-update editor toolbar exposed `Bold`, `Italic`, `Underline`, `Text Color`, three alignment controls, ordered/unordered list styles, `Insert Link`, `Insert Table`, and `Insert Image`. Its `Apply to locations` selector reported a multi-selection count. `Add another` was enabled; the current block's `Delete` was disabled; page-level `Save` remained the persistence boundary. Selecting `Service Updates` again collapsed it. Existing message content and location names are omitted. No editor, selector, add, delete, or save control was changed. Mutation: `None`.

## Execution guidance

- Safe steps: open page and expand/collapse `Welcome Message` or `Service Updates` without focusing or changing editor/selector values.
- Stop before editing rich text/location selection, `Add another`, `Delete`, or `Save`.
- Capture route, section names, control structure, and redacted state only.

## Automation guidance

- Stable landmarks: route, `Announcements`, `Welcome Message`, `Service Updates`, `Save`.
- Wait for selected section editor and location selector.
- Content and target locations are organisation-specific.
- Expected wording, audience, and publication behavior lack trusted basis.

## Evidence

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. `Welcome Message` was collapsed; `Service Updates` was expanded, its editor toolbar and disabled current-block `Delete` were inspected, then the section was collapsed. Content and location values redacted. Mutation: `None`.

## Open questions

- Scheduling/display lifecycle, field validation, and save behavior remain unobserved.

## Tester notes

[Protected area]
