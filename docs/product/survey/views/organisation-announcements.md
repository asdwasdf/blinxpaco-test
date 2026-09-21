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
last_observed: 2026-09-19
---

# Organisation Announcements

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Announcements` configures `Welcome Message` and `Service Updates` announcements for selected locations.

## Entry and transitions

Expanded `Welcome Message` contains rich-text editors, `Apply to locations` selectors, `Add another`, `Delete`, and page-level `Save`. Selecting `Service Updates` collapsed `Welcome Message` and expanded a separate service-update editor with the same visible mutation boundary: rich-text editing, `Add another`, `Delete`, and page-level `Save`. Selecting `Service Updates` again collapsed it. Existing message content and location names are omitted. No editor or selector was changed.

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

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. Content and location values redacted. Mutation: `None`.

## Open questions

- Scheduling/display lifecycle, field validation, and save behavior remain unobserved.

## Tester notes

[Protected area]
