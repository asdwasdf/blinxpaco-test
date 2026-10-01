---
id: user-portal-route-failure
title: User Portal Route Failure
roles:
  - Super Admin GB
environment: dev
status: Open Question
routes:
  - dashboard
controls: []
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-user-portal-route-failure-1
    from: user-portal-route-failure
    destination_hint: site công khai www.blinxhealthcare.com/release-notes/ (tab mới)
    trigger: Release Notes
    relationship: external link
    context: []
    classification: Open Question
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# User Portal Route Failure

## Purpose and context

`Observed`: global `User Portal` opens `/paco-connect/user-training-portal`, which returns HTTP 404 under page title `PACO Connect`.

## Entry and transitions

No portal controls or training workflow were available.

## Execution guidance

- Confirm intended route and role access before further testing.
- Do not infer a product defect from route availability alone.

## Automation guidance

- Do not automate product assertions while route is unavailable.
- Add route availability coverage only after expected behavior is confirmed.

## Evidence

Accessibility observation reverified, dev, `Super Admin GB`, 2026-09-20. `/paco-connect/user-training-portal` still returned HTTP 404 under page title `PACO Connect`. Mutation: `None`; no PII retained.

## Open questions

- Is `/paco-connect/user-training-portal` the intended dev destination?

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `User Portal` mở `/paco-connect/user-training-portal`: heading `User Portal`, tab `User Guides`/`FAQs`/`Technical Support`/`Release Notes`/`Videos`.

Gap / Open Question:

- Document trả HTTP 404 trong khi SPA vẫn render (cùng pattern với Quick Pay).
- `Release Notes` mở tab mới tới site công khai `www.blinxhealthcare.com/release-notes/` (ngoài allowlist); không khám phá.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- Tab `FAQs` hiển thị heading `FAQs`; `Videos` không đổi heading sau 3.5s; `Technical Support` mở tab mới tới login Atlassian service desk (ngoài allowlist, đã đóng).

## Tester notes

[Protected area]
