---
id: virtual-appointments-auth
title: Virtual Appointments Authentication Boundary
roles:
  - Super Admin GB
environment: dev
status: Open Question
routes:
  - web-chat-video-submenu
controls: []
verified_by: []
last_observed: 2026-09-19
---

# Virtual Appointments Authentication Boundary

## Purpose and context

`Observed`: `Web Chat & Video` → `Virtual Appointments` opens `/web-chat/appointments/`. The Web Chat & Video shell appears, then redirects to Microsoft `Sign in to your account`.

## Entry and transitions

No appointment controls were available before SSO redirect. Authentication credentials were not requested or stored.

## Execution guidance

- Complete login manually in the existing Playwright tab.
- Resume from `/web-chat/appointments/` after authentication.
- Use approved test appointments and participants only.

## Automation guidance

- Keep SSO manual and local.
- Do not automate appointment assertions until an authenticated workflow is observed.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. No mutation or PII retained.

## Open questions

- Required Microsoft account scope and expected appointment permissions remain unverified.

## Tester notes

[Protected area]
