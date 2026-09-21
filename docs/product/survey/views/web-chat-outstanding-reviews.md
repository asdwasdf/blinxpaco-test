---
id: web-chat-outstanding-reviews
title: Web Chat and Video Outstanding Reviews
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/web-chat/review/, /web-chat/?rd=/review/]
controls:
  - { name: Log in, kind: external }
verified_by: []
last_observed: 2026-09-19
---

# Web Chat and Video Outstanding Reviews

## Purpose and context

`Observed`: sidebar `Web Chat & Video` → `Outstanding Reviews` attempts to open the review area.

## Entry and transitions

`/web-chat/review/` first showed the Paco shell and a loading indicator, then redirected to `/web-chat/?rd=/review/`. The terminal state was a `Welcome Back` login page with `Log in`, `Terms of Service`, and `Privacy Policy`; no review records or explicit access error appeared. `Log in` was not used because it starts an external authentication action.

## Execution guidance

- Safe steps: open `Outstanding Reviews` and record the redacted route/state transition.
- Stop before `Log in`, review actions, messaging, or any unknown external action.
- Never persist or report authentication codes, tokens, cookies, or headers.

## Automation guidance

- Stable landmarks: `/web-chat/review/`, redirect parameter `/review/`, `Welcome Back`, and `Log in`.
- Wait for review content, login, or explicit error; do not treat loading or login as feature success.
- Access depends on a separate Web Chat authentication context.
- No trusted basis exists for expected reviews or post-login behavior.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, 2026-09-19. Authentication details omitted. Mutation: `None`.

## Open questions

- Required Web Chat authentication, review visibility, review actions, and empty/error states remain unverified.

## Tester notes

[Protected area]
