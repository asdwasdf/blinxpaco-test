---
id: manager-dashboard
title: Manager Dashboard
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Org Tasks
    kind: tab
  - name: Staff Performance
    kind: tab
  - name: Org Stats
    kind: tab
  - name: All Patients
    kind: tab
  - name: CQC Readiness
    kind: tab
  - name: Message Outbox
    kind: tab
  - name: Comms Analytics
    kind: tab
  - name: Search clinicians...
    kind: search
verified_by: []
last_observed: 2026-09-19
---

# Manager Dashboard

## Purpose and context

`Observed`: manager overview at `/paco/dashboard/manager-dashboards/overview` for role `Super Admin GB` in dev. It exposes organisation tasks, staff performance, organisation statistics, patients, CQC readiness, message outbox and communications analytics.

## Entry and transitions

1. `Dashboard` → expand sidebar.
2. Expand `Dashboards`.
3. Select `Manager`.
4. Tabs use distinct routes, including `/staff` and `/stats`.

`Org Tasks` displays period controls `Day`, `Week`, `Month`, and `Year`; `Day` was initially active. Selecting `Week` changed the active period while preserving the task, `Case Outcomes`, and `Staff Workload` landmarks. After resizing the viewport to avoid sidebar pointer interception, selecting `Day` restored the initial period.

`Staff Performance` displays status filters (`On Track`, `Ahead`, `Behind`, `Off Shift`), clinician search, time plans, progress and PACO activity. A synthetic no-match value in `Search clinicians...` produced no explicit empty-state message; clearing the field restored the initial page. `Org Stats` displays period filters `Today`, `This Week`, `This Month`, `3 Months`, `6 Months`, and `12 Months`, plus contact-channel, consultation-type, task-overview, and clinician-activity sections. Selecting `This Week` changed the active period while preserving section landmarks; selecting `Today` restored the initial period. `All Patients` transitioned from `Loading patients and risk scores...` to `Failed to load data`; no patient data was inspected.

`CQC Readiness` displays recorded-position progress across `Safe`, `Effective`, `Caring`, `Responsive`, and `Well-Led`. Expanding `Safe` exposed quality-statement rows and mutation boundaries including `Enter figure`, `Update figure`, and `Upload`; collapsing it restored the summary. The `Complaints` subtab provides `List view`, `Board view`, search, sorting, status summaries, and `Log New Complaint`. Synthetic no-match search removed complaint cards without an explicit global empty-state message; clearing search restored them. Complaint subjects, owners, patients, and other organisation data were excluded from reusable evidence.

`Message Outbox` exposes a date-range control, `Export`, search, and a grid with `NHS number`, `Message`, `Campaign`, `Source`, `Channel`, `Patient`, `Sent by`, and `Status` headers. Synthetic no-match search reduced 201 visible structural rows to the header-only row without an explicit empty-state message; clearing restored 201 structural rows. Counts are DOM rows, not message totals. `Comms Analytics` exposes campaign/date filters, `Export PDF`, chart controls, language and campaign grids, and explicit zero-data messages for the observed period. Switching `Running total` to `Per period` changed the pressed state; switching back restored the default. `Budget settings` and export actions were not used.

Values and identities are organisation data and are intentionally omitted from reusable evidence.

## Execution guidance

- Authenticate manually as the required role.
- Wait for tablist, then use exact tab names.
- Tabs are read-only navigation; status buttons appear filter-shaped.
- Capture only headings/control structure, not clinician or patient data.

## Automation guidance

- Stable landmarks: manager route, tablist and exact tab labels.
- Wait for selected tab and route change instead of fixed sleep.
- Do not assert changing organisation counts without trusted ticket basis.

## Evidence

Accessibility snapshots and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. `Org Tasks` period transitioned `Day` → `Week` → `Day`; dashboard landmarks remained present. `Staff Performance` clinician no-match search showed no explicit empty state and cleared cleanly. `Org Stats` transitioned `Today` → `This Week` → `Today`. `All Patients` ended in `Failed to load data`. `CQC Readiness` `Safe` section expanded and collapsed; `Complaints` no-match search removed cards and cleared cleanly. `Message Outbox` no-match search changed 201 visible structural rows to one header row and restored them. `Comms Analytics` transitioned `Running total` → `Per period` → `Running total`. Mutation: `None`.

## Open questions

- Whether every status button is filter-only remains `Observed`, not product intent.
- Expected `All Patients` availability and failure cause remain unresolved; current observation alone does not establish a defect.

## Tester notes

[Protected area]
