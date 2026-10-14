---
id: nhs-comms-hub
title: NHS Communications Hub
roles:
  - NHS Staff
environment: dev
status: Observed
routes:
  - https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/
controls: []
verified_by: []
last_observed: 2026-10-06
relationships: []
---

# NHS Communications Hub

## Purpose and context

`Observed`: NHS Communications Hub application for managing patient communications.

## Entry

1. Navigate to `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/`
2. Requires Microsoft SSO authentication

## Header

- App Name: "Communications Hub"
- Organisation: "General Practice (Demo Site) (YGMQJ)"
- Organisation Code: "Primary Care 24 (Y05825)"

## Navigation (Left Sidebar)

1. **Home** → links to PACO (`blinx.dev.blinxpaco-np.com`)
2. **Patient Search** → PACO patient search
3. **Care Navigator** → PACO care navigator
4. **Configuration** → PACO configuration
5. **Dashboard** → PACO Connect dashboard
6. **Settings** → PACO Connect settings
7. **User Management** → `/users`
8. **Log Out**
9. **Version 1.0**

## Main Menu

1. **Template Manager** → `/commshub/commshub/template-builder`
2. **Patient Manager** → `/commshub/commshub/patient-management`
3. **Campaign Manager** → `/commshub/commshub/campaign-manager`
4. **Analytics** → `/commshub/commshub/analytics`
5. **Configuration** → `/commshub/commshub/configuration`

## Notifications

- Status: "You are up to date"
- No notifications to review

## Observations

- Cross-links to PACO (different domain)
- NHS-specific communications management
- Organisation context shown (YGMQJ, Y05825)
- 5 main modules for communications

## Provenance

- Environment: dev (externalDevHosts)
- Role: NHS Staff (authenticated)
- Observed at: 2026-10-06T04:33:25Z

## Tester notes

## NHS Comms Hub Subpages Explored

| Subpage | URL | Status |
|---------|-----|--------|
| Template Manager | `/commshub/template-builder` | ✓ (2 templates, Create Email/SMS) |
| Patient Manager | `/commshub/patient-management` | ✓ (Lists, Patients tabs) |
| Campaign Manager | `/commshub/campaign-manager` | ✓ (Create Campaign, Outbox) |
| Analytics | `/commshub/analytics` | ✓ (Conversion charts) |
| Configuration | `/commshub/configuration` | not explored |

## Cross-links to PACO

NHS Comms Hub links to multiple PACO pages on `blinx.dev.blinxpaco-np.com`:
- Home → PACO dashboard
- Patient Search → PACO patient search
- Care Navigator → PACO care navigator
- Configuration → PACO configuration
- Dashboard → PACO Connect dashboard
- Settings → PACO Connect settings
- User Management → `/users`

## Tester notes
