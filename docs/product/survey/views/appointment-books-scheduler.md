---
id: appointment-books-scheduler
title: Appointment Books Scheduler Configuration
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/configuration/#scheduler-config]
controls:
  - { name: Select Campaign, kind: unknown }
  - { name: Search..., kind: read-only }
verified_by: []
last_observed: 2026-09-22
---

# Appointment Books Scheduler Configuration

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `Scheduler` opens the legacy `Scheduler Configuration` page.

## Entry and transitions

The page displayed `Scheduler Config`, `Select Campaign`, `Search Templates...`, `Search Slot Type...`, and a success notification stating that PACO Connect slot types loaded. Opening `Select Campaign` previously exposed a listbox with 4,137 options. On 2026-09-22, a synthetic no-match campaign query produced explicit `No options`; `Escape` dismissed the list without selection. Synthetic no-match values were also entered then cleared in `Search Templates...` and `Search Slot Type...`; neither visibly reduced the rendered lists, indicating those fields may require another trigger or their filtering behavior may be unavailable. Campaign, template, slot-type, and organisation-specific values are omitted. No field or selector value was retained. Mutation: `None`.

## Execution guidance

- Safe steps: open the page and inspect headings, load state, and visible controls.
- Treat template/slot-type search as read-only; campaign list may be opened and dismissed, but stop before selecting a campaign until its persistence behavior is known.
- Capture route, title, load state, and redacted control structure.

## Automation guidance

- Stable landmarks: route fragment `#scheduler-config`, title `Scheduler Configuration`, and heading `Scheduler Config`.
- Wait for slot-type load completion or explicit error state.
- Campaign and slot-type values depend on organisation configuration.
- No trusted basis exists for expected campaigns, slot types, or selection behavior.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, reverified 2026-09-22. Campaign synthetic no-match produced `No options` and was dismissed without selection. Template and slot-type synthetic searches produced no observable list reduction and were cleared. Organisation, campaign, template, and slot-type values redacted. Mutation: `None`.

## Open questions

- Campaign selection behavior, scheduler rules, non-search empty/error states, and persistence boundary remain unverified.
- `Search Templates...` and `Search Slot Type...` accepted input but produced no observable filtering; expected trigger and behavior remain open questions.

## Tester notes

[Protected area]
