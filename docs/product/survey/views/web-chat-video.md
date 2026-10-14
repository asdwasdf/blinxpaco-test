---
id: web-chat-video
title: Web Chat & Video
roles:
  - Unknown
environment: dev
status: Observed
routes:
  - /web-chat/
controls:
  - name: Log in
    kind: action
  - name: Terms of Service
    kind: link
  - name: Privacy Policy
    kind: link
verified_by: []
last_observed: 2026-10-06
relationships: []
---

# Web Chat & Video

## Purpose and context

`Observed`: Web Chat & Video requires separate login.

## Entry

1. /web-chat/ → Welcome page with login required

## Observations

- Separate login from PACO main app
- "Welcome back to Web & Video Chat. Please enter your details below."
- Terms of Service and Privacy Policy links available
- Multiple console warnings (193) - may indicate configuration issues

## Sub-pages
- Virtual Appointments (loading when accessed from sidebar)
- Media Library (not explored)
- Outstanding Reviews (not explored)

## Gap

- Requires separate login credentials

## Provenance

- Environment: dev
- Observed at: 2026-10-06T06:41:38Z

## Tester notes
