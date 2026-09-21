---
id: web-chat-video-submenu
title: Web Chat & Video Navigation
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Virtual Appointments
    kind: navigation
  - name: Media Library
    kind: navigation
verified_by: []
last_observed: 2026-09-19
---

# Web Chat & Video Navigation

## Purpose and context

`Observed`: expanding `Web Chat & Video` exposes `Virtual Appointments` and `Media Library`.

## Entry and transitions

`Virtual Appointments` opens `/web-chat/appointments/`, then redirects to Microsoft authentication after the page shell loads. `Media Library` was not reached before session expiry.

## Execution guidance

- Authentication is manual in the Playwright tab.
- Do not store Microsoft or PACO credentials.
- Confirm approved test appointment/media data before mutations.

## Automation guidance

- Stable landmarks: submenu labels and `/web-chat/appointments/` route.
- Keep SSO manual; do not automate credentials.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. No mutation or PII retained.

## Open questions

- Virtual appointment and media workflows remain blocked by expired SSO session.

## Tester notes

[Protected area]
