# PAC2-8871 Exploration

## Environment

| Field | Value |
|-------|-------|
| Environment | dev |
| Role | Super Admin GB |
| Practice | General Practice (Demo Site) |
| Timestamp | 2026-10-07T01:49 |

## Location

- **URL:** `https://blinx.dev.blinxpaco-np.com/paco-connect/configuration`
- **Entry path:** `/paco/dashboard` → sidebar `Appointment Book` → `Appointment Settings`

## Session Grid Structure

### Columns
- `Session Name`
- `Assigned Slot types`
- `Actions`

### Row Types

| Row Type | Naming Pattern | Icon | Example |
|----------|---------------|------|---------|
| Folder Template | `<name> (Template — N sessions)` | `▾` | `APTEST1 (Template — 1 session)` |
| Individual Session | `<name>` | `▸` | `APTEST1` |
| Standalone Session | `<name>` | `▸` | `Dev Book` |

### Folder Behavior

- Click folder row → selects it (highlighted)
- Click `▾` icon → toggles expand/collapse
- Expanded folder shows child sessions indented below parent
- `▸` icon = collapsed, `▾` icon = expanded

## Observed Session Template Folders

| Session Name | Child Sessions | Assigned Slot Types |
|-------------|---------------|-------------------|
| AP 8871 QA REGRES (Template — 2 sessions) | 2 | Test Billable, Chester slot type, [Bootcamp] Phlebotomy, Coil Fitting, Spirometry |
| APTEST1 (Template — 1 session) | 1 | Sean Test 7366, [Bootcamp] Phlebotomy, Coil Fitting, Spirometry |
| AP8862 QA (Template — 1 session) | 1 | PC24 Test |
| ABCDE 7081 (Template — 3 sessions) | 3 | test by handsome mike, Test Billable, Test Slot Type - Phlebotomy, PC24 GP Test, PC24 Nurse Test |
| AP Dupe Session Test (Template — 3 sessions) | 3 | PC24 Nurse Test, PC24 GP Test |
| AP ABC (Template — 1 session) | 1 | Test Slot Type - Phlebotomy, PC24 Test, PC24 GP Test, PC24 Nurse Test |

## Actions Menu

From grid `Actions` column button → menu:
- `Edit` - Opens Edit Session drawer
- `View Audit` - Opens audit view
- `Archive` - Archives session
- `Clone` - Clones session
- Other actions may appear based on session state

## Edit Session Drawer

Opens when clicking `Edit` action. Contains:
- `Time Range` section
- `Frequency` section (collapsed)
- `Hours (From/To)` fields
- `Start Date` / `End Date` fields
- `Save` button

## Session Preview

Opens via `Preview` action (if available):
- Shows slot schedule
- Allows slot type/time changes
- `Save` button to persist changes

## Bug Context

Per video evidence (128887):
- **Working:** Changing length/clinician/location orphans session from folder
- **Broken:** Changing slot times/types via Edit Session/Session Preview saves but doesn't orphan

Per QA feedback (128919):
- Original fix passes: Preview Session now removes session from folder
- Regression concern: Clash menu not appearing when sessions overlap

## Open Questions

1. Does the Edit Session drawer have a Preview tab similar to the standalone Preview action?
2. What's the exact behavior difference between Edit Session and Session Preview for slot changes?
3. Is the clash menu regression a separate issue (PAC2-8867) or related to 8871 fix?

## Related Exploration

- PAC2-8867 explores related folder behavior
- PAC2-7081 introduced the orphaning feature

## Tester notes

[Protected area]
