---
id: comms-hub-submenu
title: Comms Hub
roles:
  - Super Admin GB
environment: dev
status: Observed
routes: []
controls: []
verified_by: []
last_observed: 2026-10-06
relationships: []
---

# Comms Hub

## Purpose and context

`Observed`: Communication hub navigation from PACO dashboard.

## Entry

1. Dashboard → Comms Hub submenu

## Submenu Items

1. **Template Manager** — requires separate Microsoft SSO login
2. **Campaign Manager** — not clicked
3. **Patient Manager** — not clicked
4. **Quick Send** — icon visible in sidebar

## Observations

- Comms Hub submenu opens on click
- Template Manager redirects to Microsoft SAML2 SSO (login.microsoftonline.com)
- SSO login required but not available in current session
- Quick Send icon visible (not explored)

## Gap

- Template Manager, Campaign Manager, Patient Manager require separate SSO - not testable without separate auth

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:06:41Z

## Tester notes
