---
id: rocket-bar
title: Rocket Bar
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/]
controls:
  - { name: Launch Rocket Bar, kind: external }
  - { name: Download Rocket Bar, kind: download }
verified_by: []
last_observed: 2026-09-19
---

# Rocket Bar

## Purpose and context

`Observed`: selecting sidebar `Rocket Bar` opens a small action menu for launching or downloading Rocket Bar.

## Entry and transitions

The menu contained `Launch Rocket Bar` and `Download Rocket Bar`. Neither action was used because launch behavior is external/unknown and download creates a local side effect.

## Execution guidance

- Safe steps: open the sidebar menu and inspect action labels only.
- Stop before `Launch Rocket Bar` or `Download Rocket Bar` without explicit approval and a defined test target.
- Capture route, menu labels, and unopened action state.

## Automation guidance

- Stable landmarks: sidebar label `Rocket Bar`, `Launch Rocket Bar`, and `Download Rocket Bar`.
- Assert menu visibility only; do not automate launch/download under default read-only survey scope.
- Launch behavior may depend on locally installed software; download behavior changes local files.
- No trusted basis exists for expected package, version, launch protocol, or destination.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. Launch and download actions not invoked. Mutation: `None`.

## Open questions

- Launch protocol, installation detection, supported platforms, download artifact, versioning, and failure states remain unverified.

## Tester notes

[Protected area]
