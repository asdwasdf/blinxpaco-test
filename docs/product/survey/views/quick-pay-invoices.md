---
id: quick-pay-invoices
title: Quick Pay Invoices
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco-connect/quick-pay/invoices
controls:
  - name: Search patients...
    kind: read-only
  - name: Create New Invoice
    kind: mutation
  - name: Columns
    kind: read-only
  - name: Filters
    kind: read-only
  - name: Action
    kind: unknown
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Quick Pay Invoices

## Purpose and context

`Observed`: `Quick Pay` → `Invoices` displays an invoice grid in the PACO Connect shell.

## Entry and transitions

Although navigation reported HTTP 404, the page rendered `Invoices` with `Search patients...`, `Create New Invoice`, `Columns`, and `Filters`. Grid columns were `Patient`, `Total`, `Amount Paid`, `Credit Amount`, `Amount Remaining`, `Credit Reason`, `Credit Issued Date`, `Status`, and `Action`.

A synthetic no-match query in `Search patients...` left the accessible rows unchanged and produced no explicit empty-state message, so the current search matching behavior could not be established. Clearing restored the same visible structure.

Opening `Columns` exposed 15 fields: `Total`, `Amount Paid`, `Credit Amount`, `Amount Remaining`, `Credit Reason`, `Credit Issued Date`, `Status`, `Payment Type`, `Invoice Number`, `Patient`, `Patient Email`, `Due`, `Invoice Created`, `Finilization` (UI spelling), and `Action`. `Total` was unchecked and present in `Row Groups`; the other fields were checked. A synthetic no-match column search temporarily emptied the list; clearing restored it. Opening `Filters` exposed searchable entries for 14 fields: every `Columns` field except `Action`. A synthetic no-match search temporarily emptied the filter-entry list; clearing restored it. Both panels were closed without changing visibility, grouping, sort, or applying filters. Patient identities, monetary values, dates, statuses, and counts are omitted. `Create New Invoice`, row selection, and `Action` were not used. Mutation: `None`. Mutation: `None`.

## Execution guidance

- Safe steps: open the page, inspect redacted grid structure, search with synthetic non-sensitive text, and inspect known read-only grid panels.
- Stop before `Create New Invoice`, row selection, or `Action` until their persistence boundary is established.
- Capture route, HTTP status, headings, column structure, and redacted empty/error state.

## Automation guidance

- Stable landmarks: route, heading `Invoices`, `Search patients...`, and grid headers.
- Wait for invoice rows or an explicit terminal state; HTTP 404 alone does not prove the UI failed because content rendered in this observation.
- Invoice and patient data are organisation-specific and sensitive.
- No trusted basis exists for expected rows, amounts, status, or search behavior.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, 2026-09-22. HTTP 404 coexisted with a rendered invoice grid; page-search behavior, the 15-field `Columns` inventory with pre-existing `Total` grouping, and the 14-field `Filters` inventory were inspected without changing state. All patient and invoice values redacted. Mutation: `None`.

## Open questions

- Search matching behavior, grid-panel states, invoice details, `Action`, creation, credit lifecycle, and persistence remain unverified.

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `Quick Pay` điều hướng trực tiếp tới `/paco-connect/quick-pay/invoices` (PACO Connect). Heading `Invoices`; tab `Invoices`/`Product Catalogue`/`Accounts`; panel `Columns`/`Filters`.

Gap / Open Question:

- Document trả HTTP 404 trong khi SPA vẫn render `Invoices` (Observed; ý định chưa rõ).

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- Click tab `Filters`/`Columns` không thấy overlay hay URL đổi sau 1.5s (selector có thể chưa khớp panel inline).

## Tester notes

[Protected area]
