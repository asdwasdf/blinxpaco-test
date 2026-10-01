---
id: media-library
title: Media Library
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Log in
    kind: unknown
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Media Library

## Purpose and context

`Observed`: `Web Chat & Video` → `Media Library` opens `/web-chat/media-library/`.

## Entry and transitions

Reverified on 2026-09-22: direct navigation redirected from `/web-chat/media-library/` to `/web-chat/?rd=/media-library/` and displayed a `Welcome Back` Web & Video Chat authentication handoff with `Log in`, `Terms of Service`, and `Privacy Policy`. No media-library controls or content appeared after a bounded wait. `Log in` was not used because it may begin a separate authentication flow. Mutation: `None`.

## Execution guidance

- Confirm expected loading time and authentication requirements before further testing.
- Loading state may indicate async resource fetch or permission check.

## Automation guidance

- Stable landmarks: route, page title `Web Chat & Video`.
- Wait strategy for content appearance needs verification.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. Redirect reached a secondary `Welcome Back` login handoff rather than Media Library content. Authentication and organisation values omitted. Mutation: `None`.

## Open questions

- Does Media Library require additional authentication or role-specific permission?
- Is persistent loading state expected behavior or environment issue?

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `Media Library` chuyển `/web-chat/media-library/` → `/web-chat/?rd=/media-library/` → SSO Microsoft (`login.microsoftonline.com`).

Gap / Open Question:

- Web Chat & Video cần SSO Microsoft riêng; agent không đăng nhập, không lưu URL SAML.

## Tester notes

[Protected area]
