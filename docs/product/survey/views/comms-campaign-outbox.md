---
id: comms-campaign-outbox
title: Communications Hub Campaign Outbox
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - comms-campaign-manager
controls:
  - name: Search campaigns
    kind: search
  - name: Date Range
    kind: filter
  - name: Campaign selector
    kind: filter
  - name: Resend
    kind: mutation
  - name: Pause/Unpause
    kind: mutation
  - name: Export to CSV
    kind: download
verified_by: []
last_observed: 2026-09-21
---

# Communications Hub Campaign Outbox

## Purpose and context

`Observed`: `Campaign Manager` → `Campaign Outbox` opens `/commshub/campaign-outbox` in external Comms Hub dev.

## Entry and transitions

Landing state exposes a date range, campaign selector, campaign list search and a communication area that prompts `Select a Campaign to view communication`. A synthetic no-match `Search campaigns...` query was entered and cleared. It caused no observable reduction in the rendered campaign list, so trigger/matching semantics remain unknown.

The date picker exposed presets `All Time`, `Today`, `Yesterday`, `Last 7 Days`, `Last 30 Days`, `Next 30 Days`, `This Week`, `Next 2 Weeks`, `Month To Date`, `This Month`, `This Year`, `Year to Date`, `Financial Year`, and `Custom Range`, plus dual calendars and `Cancel`/`Apply`. It was cancelled unchanged.

No campaign was selected because doing so could reveal patient communication data. Communication search, grid panels and report controls were therefore not exercised. `Resend`, `Pause/Unpause`, report `Save`, exports and related confirmation actions are mutation/download boundaries and were not used.

## Execution guidance

- Treat campaign names, communication rows, recipients and organisation context as sensitive.
- Synthetic campaign search and date-picker inspection are read-only; restore temporary state.
- Stop before `Resend`, `Pause/Unpause`, report `Save`, export or any confirmation without explicit approval, controlled recipient data and cleanup.

## Automation guidance

- Stable landmarks: `/commshub/campaign-outbox`, breadcrumb, `Campaigns`, `Search campaigns...`, and `Select a Campaign to view communication`.
- Do not select a live campaign or assert live counts without controlled fixtures.

## Evidence

Accessibility and targeted DOM observation, external Comms Hub dev, authenticated session associated with Paco `Super Admin GB`, 2026-09-21. Synthetic no-match campaign search cleared; date presets/calendars inspected and cancelled unchanged. Mutation: `None`; no campaign, patient, communication, organisation or live-count values retained.

## Open questions

- Campaign search matching/trigger behavior remains unknown because synthetic input did not visibly reduce the list.
- Communication grid, report loading/saving, applied date filtering, export contents, resend and pause behavior remain unverified.

## Tester notes

[Protected area]
