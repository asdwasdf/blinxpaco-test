---
id: manager-dashboard
title: Manager Dashboard
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/dashboard/manager-dashboards/overview
controls:
  - name: Org Tasks
    kind: tab
  - name: Staff Performance
    kind: tab
  - name: Org Stats
    kind: tab
  - name: All Patients
    kind: tab
  - name: CQC Readiness
    kind: tab
  - name: Message Outbox
    kind: tab
  - name: Comms Analytics
    kind: tab
  - name: Scroll tabs left
    kind: action
  - name: Scroll tabs right
    kind: action
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-manager-1
    from: dashboards-submenu
    to: manager-dashboard
    trigger: Manager dashboard
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Manager Dashboard

## Purpose and context

`Observed`: Manager-level dashboard with organization metrics and analytics.

## Entry

1. Dashboard → Dashboards → Manager
2. URL: `/paco/dashboard/manager-dashboards/overview`

## Tabs

1. **Org Tasks** (selected) - Organization tasks view
2. **Staff Performance** - Staff performance metrics
3. **Org Stats** - Organization statistics
4. **All Patients** - Patient list view
5. **CQC Readiness** - Care Quality Commission readiness
6. **Message Outbox** - Message tracking
7. **Comms Analytics** - Communication analytics

## Controls

- Tab navigation with scroll buttons
- All tabs visible (no overflow)

## Observations

- Comprehensive manager dashboard with 7 tabs
- Covers operations, staff, patients, compliance, and communications

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T04:09:49Z

## Tester notes

## Tab: Staff Performance
- URL: /paco/dashboard/manager-dashboards/staff
- Heading: "Staff Performance"
- Description: "Real-time view of all clinician time plans and daily progress"
- Filters:
  - On Track (3)
  - Ahead (1)
  - Behind (1)
  - Off Shift (1)
- Search clinicians textbox
- Staff list with multiple entries

## Tab: Org Stats
- URL: /paco/dashboard/manager-dashboards/stats
- Multiple stat cards visible

## Tab: All Patients
- URL: /paco/dashboard/manager-dashboards/patients
- Loading state: "Loading patients and risk scores..."

## Tab: CQC Readiness
- URL: /paco/dashboard/manager-dashboards/cqc
- Sub-sections: CQC Readiness, Complaints (2)
- Multiple entries visible

## Tab: Message Outbox
- URL: /paco/dashboard/manager-dashboards/comms-outbox
- Empty panel (no content loaded)

## Tab: Comms Analytics
- URL: /paco/dashboard/manager-dashboards/comms-analytics
- Empty panel (no content loaded)

## Manager Dashboard Summary

All 7 tabs explored:
1. Org Tasks - (default, not detailed)
2. Staff Performance - ✓ Staff tracking with status filters
3. Org Stats - ✓ Stats cards
4. All Patients - Loading state
5. CQC Readiness - ✓ Compliance tracking with Complaints
6. Message Outbox - Empty
7. Comms Analytics - Empty
