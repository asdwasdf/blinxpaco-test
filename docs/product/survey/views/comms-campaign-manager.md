---
id: comms-campaign-manager
title: Communications Hub Campaign Manager
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - comms-hub-submenu
controls:
  - name: Create Campaign
    kind: mutation
  - name: Campaign Outbox
    kind: navigation
  - name: Search campaigns
    kind: search
  - name: Clear Filters
    kind: button
  - name: Columns
    kind: grid-panel
  - name: Filters
    kind: grid-panel
  - name: Campaign Statuses
    kind: filter
  - name: Campaign Types
    kind: filter
verified_by: []
last_observed: 2026-09-21
---

# Communications Hub Campaign Manager

## Purpose and context

`Observed`: external Comms Hub dev exposes campaign management at `/commshub/campaign-manager`.

## Entry and transitions

Landing state contains campaign status/type filters, search, `Viewing data for` context selector, grid controls and `Campaign Outbox`. A synthetic no-match campaign query was entered and cleared without opening campaign rows. `Columns` exposed structural campaign, status, description, type, template, creator/organisation and audit fields; `Filters` exposed searchable per-column controls. Both panels were closed unchanged. The context selector was opened read-only: it exposed `Select All (2)`, two checkbox-backed organisation options, one currently selected option, and `Apply`. It was closed by toggling the selector without changing selection or activating `Apply`; organisation values are omitted.

`Campaign Statuses` offers `All Statuses`, `Draft`, `Inactive`, `Queued`, `In Progress`, `Sent`, `Failed`, `Paused`, `Deleted`, `Available Quick Send`, and `Available Patient-Initiated`. `Campaign Types` offers `All Types`, `Scheduled`, `Quick Send`, and `Patient-initiated`. Representative `Draft` and `Scheduled` filters were applied independently, then restored to `All Statuses` and `All Types`. No campaign row was opened.

`Campaign Outbox` was opened and documented separately. With explicit approval for synthetic mutation excluding real sends, `Create Campaign` was opened without entering data. The wizard exposed steps `Campaign Setup`, `Patient List`, `Date`, and `Review`; required campaign and patient-facing display names; send-method selection; campaign types/tags; optional appointment invitation and Health Form inclusion. `Next` remained disabled. Browser Back restored Campaign Manager. No draft was submitted or persisted. Context `Apply`, exports/downloads and live campaign rows remain untested pending controlled context/data and evidence-path validation.

## Execution guidance

- Confirm test organisation, recipient, campaign data and cleanup before creation or sending.
- Treat campaign grid and organisation context as sensitive.
- Opening `Create Campaign` is non-persistent until required fields advance the wizard; stop before entering data unless synthetic campaign data and cleanup are approved. Never advance to send/review confirmation without a controlled recipient.

## Automation guidance

- Stable landmarks: route, `Create Campaign`, `Campaign Outbox` and search.
- Do not assert dynamic campaign rows, statuses or counts without controlled fixtures.

## Evidence

Accessibility observation, external Comms Hub dev, authenticated session associated with Paco `Super Admin GB`, 2026-09-21. Synthetic no-match search cleared; `Columns` and `Filters` inspected unchanged; representative `Draft` and `Scheduled` filters applied independently, then defaults restored. `Viewing data for` exposed two selectable contexts plus `Select All` and `Apply`, then closed unchanged without applying. `Create Campaign` wizard structure inspected with no input; Browser Back restored landing state. Mutation: `None`; no campaign, template, staff, organisation or live-count values retained.

## Open questions

- Safe recipient, send boundary and cleanup process remain unspecified.
- Campaign Outbox landing/search is covered separately; communication details, context persistence, export contents and campaign details remain unverified.

## Tester notes

[Protected area]
