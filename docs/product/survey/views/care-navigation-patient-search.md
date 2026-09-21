---
id: care-navigation-patient-search
title: Care Navigation Patient Profile Search
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - patient-search
controls:
  - name: Search Patients...
    kind: search
  - name: A-Z Search
    kind: navigation
verified_by: []
last_observed: 2026-09-20
---

# Care Navigation Patient Profile Search

## Purpose and context

`Observed`: `Patients` → `Care Navigation` opens `/patient-search/` and displays `Patient Profile Search`.

## Entry and transitions

Landing state exposes `Search Patients...` and `A-Z Search`. `A-Z Search` exposed letters A–Z, a selector with `First Name` and `Last Name`, and initial guidance `Please Select A Letter To Begin Search`. Selecting `Q` under the default `First Name` mode produced explicit `No Results`; returning restored the standard search view. A synthetic no-match query produced explicit `No Patients Found` and `Showing 0 result` states plus `Include deleted patients`. Toggling `Include deleted patients` on retained the zero-result state; it was restored off before clearing search. No patient profile was opened.

## Execution guidance

- Search only approved test patients.
- Treat user, organisation, patient and profile content as sensitive.
- Capture route and control structure only during general survey.

## Automation guidance

- Stable landmarks: `/patient-search/`, `Patient Profile Search`, search input and `A-Z Search`.
- Patient-specific assertions require controlled test data.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-20. `A-Z Search` structure, `First Name`/`Last Name` mode options, and representative `Q` no-result state observed before returning. Synthetic no-match search produced explicit zero-result messaging; `Include deleted patients` toggled on and restored off while zero results remained, then search cleared. Mutation: `None`; no PII retained.

## Open questions

- Patient profile workflow remains unverified; positive-result A-Z behavior requires approved test-patient data.

## Tester notes

[Protected area]
