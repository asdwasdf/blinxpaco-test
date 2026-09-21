---
id: health-form-inbox
title: Health Form Inbox
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - health-forms-submenu
controls:
  - name: Filters
    kind: filter
  - name: All
    kind: filter
  - name: Incomplete
    kind: filter
  - name: Overdue
    kind: filter
  - name: Completed
    kind: filter
  - name: Awaiting Review
    kind: filter
verified_by: []
last_observed: 2026-09-20
---

# Health Form Inbox

## Purpose and context

`Observed`: `Health Forms` → `Inbox` opens `/health-forms/responses/` for role `Super Admin GB` in dev.

## Entry and transitions

Default state exposes periodic refresh status, filters, selectable summary regions and response categories. The two completed-response grids each exposed 21 structural rows and six sortable/utility column headers, but those headers had no accessible text or `aria-label`; their meaning could not be verified safely without inspecting response data. `Total Sent to Patient` was the selected summary state. Read-only selection coverage included `Incomplete`, `Overdue from Patient`, `Completed by Patient`, and `Reviewed`, with the visual selection border moving to each chosen summary before `Total Sent to Patient` was restored. `Incomplete`, `Completed by Patient`, and `Reviewed` retained 78 structural rows; `Overdue from Patient` produced 63. These DOM counts span multiple grids and are not response totals. Completed responses include alarm/no-alarm sections. Business counts and response contents are omitted.

Opening `Filters` displayed an `Inbox Filters` drawer with `Date Range`, `Health Form`, `Reviewers`, `Tags`, `Patient(s) Search`, `Alert Status`, and `Clear All`. `Date Range` exposed presets from `Today` through `Last Year` plus `All time`, paired calendars, `Cancel`, and enabled `Apply` while current state remained `All Time`. `Cancel` closed the picker; drawer `Close` dismissed it without changing values. Selecting the `Incomplete` status changed the grid state, then selecting `All` restored the default. The filtered DOM contained 82 visible structural `role=row` elements across multiple grids; this is not a response total.

Opening the `Selected` organisation control exposed a searchable list with `Select All`, organisation choices, `Cancel`, and disabled `Apply`. `Cancel` closed it unchanged. Organisation names and codes are omitted.

`View By Patient` and `View By Health Form` switched grouping structures, then `View By Patient` was restored. `Expand All` and `Collapse All` were exercised without opening an individual response. The adjacent unlabeled expand control entered a focused `All Health Forms` grid view that hid summary regions; its matching collapse control restored the default layout. The visible grid `Columns` panel exposed field visibility toggles and was closed unchanged.

A synthetic no-match grid search reduced 78 structural `role=row` elements to 45 without an explicit empty-state message; clearing restored 78. In the visible `All Health Forms` grid, representative sorting on `Patient Name`, `Health Form Name`, and `Patient ID` each cycled `none` → `ascending` → `descending` → `none`, restoring the original unsorted state after each field. Status coverage included `Completed`, `Awaiting Review`, and `Reviewed`, then `All` restored the default. `Awaiting Review` produced 60 structural rows; `Reviewed` exposed `Reviewed (synced)` and `Reviewed (not synced)` branches. Earlier `Overdue` produced 63 structural rows. These DOM counts span multiple grids and are not response totals.

The grid `Filters` panel exposed a broad field list spanning alert, patient, organisation, form, status, reviewer, appointment, review timing, score, and record-sync metadata. Hovering the visible grid information icon exposed the tooltip `Synced to Primary Care Patient Record`, clarifying the adjacent sync indicator without opening a record. It was closed without editing filter values. Within `Inbox Filters`, opening `Health Form` and `Reviewers` exposed eight options each; both lists were closed without selection. `Tags` exposed two top-level branches, `Active Tags` and `Archived Tags`, with no checked item. `Patient(s) Search` opened an empty listbox before any query. `Alert Status` independently toggled `Alarm Triggered` and `No Alarm Triggered`; each was restored so both remained checked before closing. Structural row count remained unchanged during these drawer-only toggles. Controls were closed without retained selection or input. Option values are omitted because they contain shared form and staff identity data. No response record, patient field, `Clear All`, refresh, or unlabeled action was used.

## Execution guidance

- Treat form responses, patient details and counts as sensitive.
- Use labeled filters only during read-only exploration.
- Confirm action semantics before opening records or using unlabeled controls.

## Automation guidance

- Stable landmarks: route, summary/category labels and refresh status.
- Wait for refresh/grid state; do not assert live counts without controlled data.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Summary selection covered `Incomplete`, `Overdue from Patient`, `Completed by Patient`, and `Reviewed`, then restored `Total Sent to Patient`; only `Overdue from Patient` changed the observed structural row count. `Inbox Filters` and its `Date Range` picker opened and closed unchanged; status transitions covered `Incomplete`, `Overdue`, `Completed`, `Awaiting Review`, and `Reviewed`, then restored `All`; organisation selector opened and was cancelled unchanged. Grouping switched to health form and restored to patient; groups expanded/collapsed; focused `All Health Forms` grid view opened and restored; grid `Columns` and `Filters` panels opened and closed unchanged. `Health Form`, `Reviewers`, `Tags`, and `Patient(s) Search` controls opened and closed without selection. Both `Alert Status` checkboxes were toggled independently and restored checked. Synthetic no-match search reduced structural rows without an explicit empty state and was cleared. `Patient Name`, `Health Form Name`, and `Patient ID` sorts each cycled ascending, descending, then restored unsorted. Visible grid info tooltip identified sync status as `Synced to Primary Care Patient Record`. Counts, option values, organisation identifiers, grid contents, and patient data excluded. Mutation: `None`.

## Open questions

- Record actions, refresh behavior, and individual drawer filter semantics remain unverified.
- Meaning of hidden versus visible grid fields lacks trusted expected-behavior documentation.
- Completed-response grid column headers lack accessible text/labels, so their semantics remain unidentified and may present an accessibility gap.

## Tester notes

[Protected area]
