---
id: quick-send
title: Quick Send (Comms Hub)
roles:
  - Super Admin GB
environment: dev
status: Observed
routes: []
controls:
  - name: Template Manager
    kind: navigation
    mutation: true
  - name: Campaign Manager
    kind: navigation
    mutation: true
  - name: Patient Manager
    kind: navigation
verified_by: []
last_observed: 2026-10-06
relationships: []
---

# Quick Send (Comms Hub)

## Purpose and context

`Observed`: Quick Send is the Comms Hub navigation with template and campaign management.

## Entry

1. Dashboard → Quick Send submenu

## Submenu Items

1. **Template Manager** - mutation boundary (create/edit templates)
2. **Campaign Manager** - mutation boundary (create campaigns)
3. **Patient Manager** - manage patient communications

## Observations

- Quick Send provides access to NHS Comms Hub features
- Same as navigating to NHS Comms Hub directly
- Template and Campaign creation are mutation boundaries

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T06:25:12Z

## Tester notes
