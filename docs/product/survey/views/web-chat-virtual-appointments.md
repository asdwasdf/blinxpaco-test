---
id: web-chat-virtual-appointments
title: Web Chat and Video Virtual Appointments
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/web-chat/appointments/, /]
controls: []
verified_by: []
last_observed: 2026-09-19
---

# Web Chat and Video Virtual Appointments

## Purpose and context

`Observed`: sidebar `Web Chat & Video` → `Virtual Appointments` opens `/web-chat/appointments/` and starts an authentication redirect before appointment content becomes available.

## Entry and transitions

The initial page showed the Paco shell and a loading indicator. It then completed an authentication callback at the site root and landed on an NHS home page rather than returning to `Virtual Appointments`. No appointment list, empty state, or error message was shown. Callback query values are omitted.

## Execution guidance

- Safe steps: open `Virtual Appointments`, observe redirect destination, and record only redacted route/state transitions.
- Stop before starting calls, joining appointments, messaging, or any unknown external action.
- Never persist or report callback codes, state parameters, tokens, cookies, or headers.

## Automation guidance

- Stable landmarks before redirect: `/web-chat/appointments/`, title `Web Chat & Video`, and loading indicator.
- Wait for a terminal appointment, login, home, or error state; do not treat redirect completion as feature success.
- Authentication depends on external SSO/session state.
- No trusted basis exists for expected appointments or correct post-auth destination.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, 2026-09-19. Authentication callback values redacted. Mutation: `None`.

## Open questions

- Why callback lands at site root, whether a second navigation is required, and whether appointment access needs additional authorization remain unresolved.

## Tester notes

[Protected area]
