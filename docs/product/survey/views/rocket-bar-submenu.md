---
id: rocket-bar-submenu
title: Rocket Bar Navigation
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Launch Rocket Bar
    kind: external-action
  - name: Download Rocket Bar
    kind: download
verified_by: []
last_observed: 2026-09-19
---

# Rocket Bar Navigation

## Purpose and context

`Observed`: expanding global `Rocket Bar` exposes `Launch Rocket Bar` and `Download Rocket Bar`.

## Entry and transitions

Neither action was used during general survey. Launch target, installer format and download side effects remain unknown.

## Execution guidance

- Confirm approved host/application and workstation impact before launch.
- Confirm artifact destination and security review before download.
- Do not execute installers during navigation survey.

## Automation guidance

- Stable landmarks: exact submenu labels.
- Browser automation should verify links only after destination rules are confirmed; do not install software.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. No launch, download or mutation.

## Open questions

- Launch destination and downloaded artifact behavior remain unverified.

## Tester notes

[Protected area]
