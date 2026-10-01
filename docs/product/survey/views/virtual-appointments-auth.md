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
last_observed: 2026-10-01
relationships: []
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

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `Virtual Appointments` chuyển tới `/web-chat/?rd=/appointments/` hiển thị `Welcome Back` / `Log in` dù phiên PACO còn hiệu lực.

Gap / Open Question:

- Web Chat & Video yêu cầu đăng nhập riêng; `Media Library`, `Outstanding Reviews` chưa khám phá được khi chưa có tester login.

## Tester notes

[Protected area]
