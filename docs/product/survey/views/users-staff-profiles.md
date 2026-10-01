---
id: users-staff-profiles
title: Users and Staff Profiles
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/staff/profiles]
controls:
  - { name: Active, kind: read-only }
  - { name: Archived, kind: read-only }
  - { name: My Profile, kind: navigation }
  - { name: Add Care Professional, kind: mutation }
  - { name: Previous, kind: read-only }
  - { name: Next, kind: read-only }
verified_by: []
last_observed: 2026-09-22
---

# Users and Staff Profiles

## Purpose and context

`Observed`: `Configuration` → `Users & Staff` → `Staff Profiles` opens a paginated staff directory with active/archive views and profile navigation.

## Entry and transitions

The grid columns were `First Name`, `Last Name`, `Gender`, `Email`, `Roles`, and `Actions`. Controls included `Active`, `Archived`, `My Profile`, `Add Care Professional`, search, sortable headers, and pagination. The active view reported 587 records across 24 pages, showing 25 records on page 1. The read-only `Archived` filter reported 65 records across 3 pages; page 2 showed records 26–50 with both `Previous` and `Next` enabled. A synthetic no-match search produced `No Rows To Show` and `Showing 0–0 of 0`; clearing it restored results. Sorting `First Name` set `aria-sort=ascending` and reset pagination to page 1. All staff names, contact details, roles, and row actions are omitted.

`Observed` on 2026-09-22: selecting the authenticated user's avatar routed to `Staff Profiles` with a `providerId` query, and `My Profile` opened a dialog with tabs `General`, `Roles & Permissions`, and `Skill Capabilities & Attributes`. `General` exposed editable identity/contact fields plus mutation controls `Upload profile picture`, `Reset password`, and `Save`. `Roles & Permissions` exposed `Team`, required `User Role`, required `Location Selection`, organisation selectors, and a clinical-system-user grid. That grid's `Columns` panel listed `Organisation Name`, `Clinical System - First Name`, `Clinical System - Last Name`, plus one unlabeled column; `Filters` exposed searchable filter entries for the same columns. Panels were inspected without toggling columns or applying filters. `Skill Capabilities & Attributes` exposed two selectors. Tabs were inspected without changing values; `Close` removed the query parameter and restored the staff list.

The page-level view toggle switched the same active staff data from table to cards. Card view exposed an employee count, search, per-card identity metadata, and an unlabeled per-card button; no card or action was opened. Switching back restored the table. Active pagination transitioned page 1 → page 2 (`Showing 26–50 of 587`) → page 1 with URL query `staffPage=2` added then removed.

The active staff grid supported a three-state `First Name` sort: none → ascending → descending → none. Its column menu exposed `Pin Column`, autosize/reset controls, a value filter with search and `(Select All)`/`(Blanks)` plus distinct values, and a columns panel listing `First Name`, `Last Name`, `Gender`, `Email`, `Roles`, `Mobile`, `Created At`, `Updated At`, `Last Logged In`, and `Skills`. No filter, pin, resize, reset, or visibility change was applied.

In `Archived`, each row exposed `View audit` and mutation-shaped `Unarchive`. `View audit` opened an `Audit Trail` dialog. `Made by user` had an explicit no-events state for the sampled archived profile; `Made to user` showed audit cards and enabled export. Read-only controls included search, `Refresh audit trail`, `Table`/`Cards`, source radios, and a date-range picker with presets plus dual calendars. The picker was cancelled; export, refresh, and `Unarchive` were not used. Sensitive audit identities and organisation values were omitted. Mutation: `None`.

## Execution guidance

- Safe steps: open page, inspect redacted grid structure/counts, switch known read-only status tabs, and paginate.
- Stop before `Add Care Professional`, profile/row actions with unknown persistence, or editing staff data.
- Capture route, columns, pagination summary, redacted state, and mutation boundary.

## Automation guidance

- Stable landmarks: route, heading `Staff Profiles`, `Active`, `Archived`, table headers, and pagination summary.
- Wait for a data, empty, or error state before reading counts.
- Staff names, emails, roles, and profiles are sensitive; evidence must remain redacted.
- No trusted basis exists for expected staff records, roles, archive state, or totals.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Active view reported 587 records across 24 pages. Archived view reported 65 records across 3 pages; pagination to page 2 succeeded. Synthetic no-match search and ascending `First Name` sort succeeded. Personal and role data redacted. Mutation: `None`.

## Open questions

- Profile detail safety, row actions, additional sort directions/columns, add/edit/archive lifecycle, and access controls remain unverified.

## Tester notes

[Protected area]
