---
id: comms-hub-submenu
title: Comms Hub Navigation
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Template Manager
    kind: navigation
  - name: Campaign Manager
    kind: navigation
  - name: Patient Manager
    kind: navigation
  - name: Analytics
    kind: navigation
  - name: Configuration
    kind: navigation
  - name: Search Patients
    kind: search
  - name: Notifications
    kind: panel
verified_by: []
last_observed: 2026-09-21
---

# Comms Hub Navigation

## Purpose and context

`Observed`: Paco exposes external Communications Hub navigation for role `Super Admin GB`; authenticated external dashboard is available at `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/`.

## Entry and transitions

1. Expand Paco global sidebar.
2. Expand `Comms Hub`.
3. Paco children: `Template Manager`, `Campaign Manager`, `Patient Manager`.
4. Authenticate manually on approved external dev host.
5. External dashboard cards: `Template Manager`, `Patient Manager`, `Campaign Manager`, `Analytics`, and `Configuration`.

The authenticated external dashboard also exposes global `Search Patients...` and a home-organisation selector. A synthetic no-match query caused no visible result or explicit empty state and was cleared. The organisation selector opened a two-option list with the current home organisation marked selected; it was closed by toggling the selector without choosing another organisation. Organisation names/codes are omitted from reusable evidence. Each dashboard card was validated through its target module during this survey. Authentication expiry redirects to `/commshub/login?loggedout=true&msg=error-at-axios-interceptor`; manual login restores the dashboard.

External navigation contains Comms Hub children `Template Manager`, `Campaign Manager`, `Patient Manager`, `Analytics`, and `Configuration`, targeting `/commshub/template-builder`, `/commshub/campaign-manager`, `/commshub/patient-management`, `/commshub/analytics`, and `/commshub/configuration`. At 1536×730 the slideout content sat off-screen (`x < 0`) and stale toggle/close references timed out. At 1920×1080, the visible `.navigation-toggle` opened the sidebar normally; the `Comms Hub` wrapper then expanded successfully and exposed all five children. No forced click or DOM mutation was used.

Global `Notifications` panel shows `Active`, `Dismissed`, and `All` tabs plus `Clear All`. Current empty state says `You are up to date` and `You currently have no notifcations to review`. The header notification bell closed and reopened the panel successfully, restoring the `Active` empty state. The apparent header-row close target, `Dismissed`, and `All` remain blocked by a decorative `background-img boat-img` intercepting pointer events; no force-click was used. `Clear All` was not used because it is a side-effect boundary.

## Execution guidance

- Confirm external dev hostname is approved before continuing.
- Authenticate manually; never request or store credentials.
- Keep patient and organisation data out of reusable evidence.

## Automation guidance

- Stable landmarks: submenu labels and destination hostname.
- External authentication must remain manual.
- Do not automate cross-host assertions until domain scope and session behavior are confirmed.

## Evidence

Accessibility observation, Paco and authenticated external Comms Hub dev, `Super Admin GB`, 2026-09-21. Five external dashboard cards inventoried and target modules validated; synthetic global patient no-match cleared; home-organisation selector opened and closed unchanged; notification empty state observed. Sidebar opened through `.navigation-toggle`; `Comms Hub` expanded and five child routes verified. `Dismissed` click was intercepted by decorative overlay. Mutation: `None`; no PII or organisation values retained.

## Open questions

- Global patient-search trigger and matching semantics remain unknown because synthetic input produced no visible result state.
- Expected session duration and `error-at-axios-interceptor` expiry behavior remain undocumented.
- `Dismissed` and `All` notification-tab behavior remains blocked by decorative overlay interception; `Clear All` semantics were not tested.
- Sidebar responsiveness below 1920×1080 remains unclear: at 1536×730 content was off-screen, while 1920×1080 exposed a working `.navigation-toggle` and normal submenu expansion.

## Tester notes

[Protected area]
