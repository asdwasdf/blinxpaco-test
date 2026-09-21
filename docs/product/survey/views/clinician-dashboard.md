---
id: clinician-dashboard
title: Clinician Dashboard
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Mi Tasks
    kind: tab
  - name: Mi Time
    kind: tab
  - name: Mi Stats
    kind: tab
  - name: Mi Patients
    kind: tab
verified_by: []
last_observed: 2026-09-19
---

# Clinician Dashboard

## Purpose and context

`Observed`: clinician dashboard at `/paco/dashboard/clinician-dashboards/main` for role `Super Admin GB` in dev.

## Entry and transitions

1. Expand `Dashboards` from the global navigation.
2. Select `Clinician`.
3. Default selected tab is `Mi Tasks`.

Visible tabs are `Mi Tasks`, `Mi Time`, `Mi Stats` and `Mi Patients`.

`Mi Tasks` contains configurable dashboard cards for appointments, prescriptions, tasks, test results, documents, service updates, breaches, health-form inbox, tagged comments, consultation metrics, and paused cases. `Up Next` opens an overlay panel; `Escape` closed it. `Customise Dashboard`, document rows, links, `Refresh`, and card resize controls were not used. Visible document names and operational content were treated as organisation data and excluded from reusable evidence.

`Mi Time` opens `/planner` with `Block list`, `Timeline`, `Today`, schedule-category summaries, and `Mi Time Configuration`. Switching to `Timeline` changed the schedule presentation and removed the block-list `View Details` buttons; switching back restored `Block list`. No schedule item or configuration control was opened.

`Mi Stats` opens `/stats` with a period selector and sections for patient/consultation overview, prescriptions, digital communications, conditions, and most-seen patients. Opening the default `Month` selector exposed `Day`, `Week`, `Month`, `3 Months`, `6 Months`, and `12 Months`; selecting `Week` changed the period, then `Month` restored the default. Metric values and patient identities are omitted.

`Mi Patients` opens `/patients` but remained at `Loading patients and risk scores...` after an additional three-second wait. No patient data became visible.

## Execution guidance

- Authenticate manually as the required role.
- Wait for the tablist and selected `Mi Tasks` state.
- Avoid retaining task, staff or patient content in reusable evidence.

## Automation guidance

- Stable landmarks: clinician route and exact tab labels.
- Wait for selected-tab state and route changes instead of fixed sleeps.
- Do not assert task or patient values without trusted ticket requirements.

## Evidence

Accessibility and targeted UI observation, dev, `Super Admin GB`, 2026-09-19/20. `Mi Tasks` `Up Next` overlay opened and closed with `Escape`; `Mi Time` transitioned `Block list` → `Timeline` → `Block list`; `Mi Stats` transitioned `Month` → `Week` → `Month`; `Mi Patients` remained loading. Mutation: `None`; PII and organisation content excluded.

## Open questions

- `Mi Tasks` card details, customisation, links, refresh behavior, and card-level filters remain unobserved.
- Whether persistent `Mi Patients` loading is expected, data-dependent, or a defect remains unresolved.

## Tester notes

[Protected area]
