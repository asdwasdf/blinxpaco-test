---
id: quick-pay-accounts
title: Quick Pay Accounts
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco-connect/quick-pay/accounts]
controls:
  - { name: Connect New Account, kind: mutation }
  - { name: Columns, kind: read-only }
  - { name: Filters, kind: read-only }
  - { name: Action, kind: unknown }
verified_by: []
last_observed: 2026-09-22
---

# Quick Pay Accounts

## Purpose and context

`Observed`: `Configuration` → `Quick Pay` → `Accounts` navigates to a PACO Connect Quick Pay route.

## Entry and transitions

Reverified after manual authentication on 2026-09-22: although navigation reported HTTP 404, the page rendered an `Accounts` grid with `Account`, `Status`, `Available Balance`, `Pending Balance`, `Connected Date`, and `Action`, plus `Columns`, `Filters`, and `Connect New Account`. Account identity, balances, dates, and status values are omitted.

Opening `Columns` exposed all six checked fields, a searchable column list, and an empty `Row Groups` drop area. A synthetic no-match column search temporarily emptied the list; clearing restored all fields. Opening `Filters` exposed searchable entries for the same six fields. A synthetic no-match search temporarily emptied that list; clearing restored it. Both panels were closed without changing visibility, grouping, or applying filters. `Connect New Account`, row selection, and `Action` were not used because their side-effect or persistence boundary was not established. Mutation: `None`.

## Execution guidance

- Safe steps: open route and record HTTP status plus visible loading/error state.
- Do not infer account-management behavior from the route name.
- Capture route, HTTP status, page title, and accessibility state.

## Automation guidance

- Stable landmarks currently limited to route and page title `PACO Connect`.
- Wait for account content or explicit terminal error; persistent `Loading` is not success.
- Expected authorization and route availability lack trusted basis.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22 after manual authentication. HTTP 404 coexisted with a rendered account grid; `Columns` and `Filters` inventories plus synthetic no-match/restore states were inspected. Account data redacted. Mutation: `None`.

## Open questions

- Whether route is stale, unavailable in dev, permission-dependent, or defective remains unresolved.

## Tester notes

[Protected area]
