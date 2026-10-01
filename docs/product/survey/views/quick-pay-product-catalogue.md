---
id: quick-pay-product-catalogue
title: Quick Pay Product Catalogue
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco-connect/quick-pay/products]
controls:
  - { name: Search..., kind: read-only }
  - { name: Create New Product, kind: mutation }
  - { name: Columns, kind: read-only }
  - { name: Filters, kind: read-only }
  - { name: Action, kind: unknown }
verified_by: []
last_observed: 2026-09-22
---

# Quick Pay Product Catalogue

## Purpose and context

`Observed`: `Configuration` → `Quick Pay` → `Product Catalogue` navigates to a PACO Connect Quick Pay route.

## Entry and transitions

Reverified after manual authentication on 2026-09-22: although navigation reported HTTP 404, the page rendered a `Products` grid with `Name`, `Pricing`, `Status`, `Created`, and `Action`, plus `Search...`, `Columns`, `Filters`, and `Create New Product`. Product names, prices, statuses, dates, and counts are omitted. A synthetic no-match page search removed all body rows while retaining headers and controls; no explicit empty-state message appeared. Clearing restored product rows. Opening `Columns` exposed all five checked fields, a searchable column list, and an empty `Row Groups` drop area. A synthetic no-match column search temporarily emptied the list; clearing restored every field. Opening `Filters` exposed searchable entries for the same five fields. A synthetic no-match search temporarily emptied the list; clearing restored it. Both panels were closed without changing visibility, grouping, or applying filters. `Create New Product`, row selection, and `Action` were not used. Mutation: `None`. Mutation: `None`.

## Execution guidance

- Safe steps: open route and record HTTP status plus visible loading/error state.
- Do not infer product-management behavior from the route name.
- Capture route, HTTP status, page title, and accessibility state.

## Automation guidance

- Stable landmarks currently limited to route and page title `PACO Connect`.
- Wait for catalogue content or explicit terminal error; persistent `Loading` is not success.
- Expected authorization and route availability lack trusted basis.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22 after manual authentication. HTTP 404 coexisted with a rendered product grid; page search, `Columns`, and `Filters` synthetic no-match/restore states were inspected without changing grid configuration. Product data redacted. Mutation: `None`.

## Open questions

- Whether route is stale, unavailable in dev, permission-dependent, or defective remains unresolved.

## Tester notes

[Protected area]
