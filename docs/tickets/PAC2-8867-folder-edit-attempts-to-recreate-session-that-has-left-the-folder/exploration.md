# Exploration: PAC2-8867

**EXPLORE completed:** 2026-10-06T14:45:00Z
**Environment:** dev (no feature branch)
**Role:** Admin (Johnny Bravo — Blinx Deployment)
**URL:** https://blinx.dev.blinxpaco-np.com/paco-connect/configuration

## Observed Behavior

### Folder Template Structure

| Element | Observation |
|---|---|
| Template display | `(Template — N sessions)` suffix in grid cell |
| Expand icon | `▾` arrow in grid cell left of name |
| Expand action | Click expands to show child sessions indented below parent |
| Child sessions | Indented rows appear below parent template row |
| Actions menu | Right-click or click action button → menu |
| Grid columns (expanded) | Session Name, Assigned Location, Start Date, End Date, Appointment Book |

### Dev Book Template (Existing Test Data)

| Property | Value |
|---|---|
| Template name | `Dev Book (Template — 4 sessions)` |
| Child sessions | 4 sessions named `Dev Book` |
| Slot type | `Flu Clinic GBTEST1` |
| Location | `Blinx Healthcare` |
| Dates | 09/07/2026, 10/07/2026, 11/07/2026, 12/07/2026 |
| Slot Duration | 10 min |

### Edit Session Drawer (Child Session)

**Opened for:** `Dev Book` child session (row 5, date 09/07/2026)

Fields visible:
- `Session Name: Dev Book`
- `Session Type: Timed Appts`
- `Slot Duration (min): 10`
- `Time Range: button` (expandable)
- `Assigned Slot Types: Flu Clinic GBTEST1`
- `Assigned Appointment Book: 11 oct -2 -21`
- `Service provider: General Practice (Demo Site)`
- `Assigned Locations: Blinx Healthcare`
- `Assigned Staff: Tom Nguyen`

**Note:** `Session Name` is NOT blank for this child session. The blank Session Name in video (frame 4:00) may indicate a different state or bug manifestation.

### Actions Menu (Child Session Row)

```
- Edit
- View Audit
- Archive
- Clone
- Delete
- Cancel session appointments
```

## Bug Flow (from Exploration + Video Evidence)

1. **Setup:** Folder template with ≥2 sessions across dates
2. **Trigger:** Edit one child session → change `Slot Duration`, `Time Range`, or other field → Save → session leaves folder
3. **Folder state:** Session date now "missing" from template
4. **Bug trigger:** Edit parent folder (change time/length) → folder recreates session for that date
5. **Result:** Existing independent session + new folder-created session = **duplicate/clash**
6. **Clash UI:** Options unclear which session each refers to

## Key Questions

1. **DB fix status unknown:** paco-one-db #1000 deployment status not confirmed
2. **Blank Session Name in video:** May indicate session that left folder vs normal child session
3. **Clash tool UI:** Not observed in current exploration — needs mutation

## Open Questions from Analysis

| Question | Impact | Status |
|---|---|---|
| Edit Session dialog Session Name blank — bug or symptom? | Affects test design | Disputed — observed normal Session Name for child session |
| DB #1000 deployed? | Affects bug reproduction | Unknown |
| Clash tool exact UI | Clash resolution test design | Not observed |

## Recommended Next

**TEST_DESIGN** — Create test cases based on:
1. TC-001: Edit child session to leave folder → edit parent folder → verify no duplicate
2. TC-002: Same as above but with multi-clinician scenario
3. TC-003: Edit parent folder after session moved to different date
4. TC-004: Verify clash tool UI clarity (if bug present)

**Note:** No feature branch available. Testing on dev shared environment. Bug may or may not be present depending on DB deployment status.

## Tester Notes
