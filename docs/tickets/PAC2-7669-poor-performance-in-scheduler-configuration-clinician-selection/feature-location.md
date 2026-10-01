# PAC2-7669 — Feature Location

**Ticket:** PAC2-7669
**Date:** 2026-10-01
**Role:** Super Admin GB
**Environment:** dev

## Verified Route

1. Click `Configuration` sidebar icon
2. Click `Appointment Books` menu item (expand)
3. Click `Scheduler` tree item

**Final URL:** `https://blinx.dev.blinxpaco-np.com/configuration/#scheduler-config`
**Route fragment:** `#scheduler-config`

## Landmarks

- Heading: `Scheduler Config`
- Control: `Select Campaign` combobox
- Loading indicator: progressbar

## Context

- Current org: `General Practice (Demo Site)`
- Page loads with `Select Campaign` combobox + progress indicator
- Clinician selection expected inside this page after campaign selection

## Entry Path (1 meaningful view)

Dashboard → Configuration → Appointment Books → Scheduler

## QA Notes

- Proxy requirement: ticket mentions issue occurs with proxy enabled (EMIS + PACO Connect)
- Test org: `General Practice (Demo Site)` may be EMIS
- PACO Connect org needed for second test scope

## Tester notes

[Protected area]
