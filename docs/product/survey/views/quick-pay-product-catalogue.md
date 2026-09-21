---
id: quick-pay-product-catalogue
title: Quick Pay Product Catalogue
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco-connect/quick-pay/products]
controls: []
verified_by: []
last_observed: 2026-09-19
---

# Quick Pay Product Catalogue

## Purpose and context

`Observed`: `Configuration` → `Quick Pay` → `Product Catalogue` navigates to a PACO Connect Quick Pay route.

## Entry and transitions

The route returned HTTP 404 and exposed only a `Loading` status in the accessibility tree. No product list, empty state, or actionable control became available.

## Execution guidance

- Safe steps: open route and record HTTP status plus visible loading/error state.
- Do not infer product-management behavior from the route name.
- Capture route, HTTP status, page title, and accessibility state.

## Automation guidance

- Stable landmarks currently limited to route and page title `PACO Connect`.
- Wait for catalogue content or explicit terminal error; persistent `Loading` is not success.
- Expected authorization and route availability lack trusted basis.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, 2026-09-19. HTTP 404 with `Loading`-only state. Mutation: `None`.

## Open questions

- Whether route is stale, unavailable in dev, permission-dependent, or defective remains unresolved.

## Tester notes

[Protected area]
