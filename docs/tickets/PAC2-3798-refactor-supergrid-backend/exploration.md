# Exploration: PAC2-3798

**Input Revision:** 1
**Environment:** dev
**Role:** `Super Admin GB`
**Observed:** 2026-09-21
**Scope:** Read-only observation at confirmed `/patient-analyser/` location

## Observed behavior

- `[Observed: dev, Super Admin GB, 2026-09-21]` Opening `Patient Analyser` changes the selected tab from `Patient Details` to `Patient Analyser` without changing URL. The shell exposes `Date Range` with `All Time`, report panel, `Advanced Search`, observation count, patient count, grid, `Columns`, and `Filters`.
- `[Observed: dev, Super Admin GB, 2026-09-21]` On the selected `Patient Analyser` tab, the visible grid structural headers are `Full Name`, `Gender`, `Observation Effective Date`, `Observation Term`, and `Observation Type`; data values were not retained.
- `[Observed: dev, Super Admin GB, 2026-09-21]` The analyser shows a transient `Loading...` state. A populated `Observations:` count, `Patients:` count, and a rows-loaded footer subsequently appear. This supports the ticket's separate-count area as UI structure only; it does not establish timing/performance behavior or intended count semantics.
- `[Observed: dev, Super Admin GB, 2026-09-21]` `Advanced Search 0` opens modal `Advanced Patient Search`. Visible read-only landmarks: `Tutorial`, tabs `Analyse` and `Import`, `Reference Report(s)` combobox, `Query builder`, `Add Rule Group`, `Deleted Patients Excluded`, `Cancel`, and `Search`.
- `[Observed: dev, Super Admin GB, 2026-09-21]` Closing the modal with `Cancel` restores the analyser without a visible search-count change.
- `[Observed: dev, Super Admin GB, 2026-09-21]` Global navigation `Analytics & Reports` → `Patient Analyser` points to `/patient-analyser-new/`, which rendered `404 Not Found` on the PAC2-3798 demo host. Direct ticket route `/patient-analyser/` remains usable.
- `[Observed: dev, Super Admin GB, 2026-09-21]` `Columns` exposes `Pivot Mode`, a searchable tree labeled `Column List 81 Columns`, `Row Groups`, and `Values`; current visible value is `avg(Age (Current))`. No setting was changed.
- `[Observed: dev, Super Admin GB, 2026-09-21]` `Filters` exposes a searchable area labeled `Filter List 80 Filters`. No filter was applied.
- `[Observed: dev, Super Admin GB, 2026-09-21]` Switching from `Patient Analyser` to `Patient Details` retains `/patient-analyser/` and the unsaved-report shell. `Patient Details` renders its own patient-count/grid loading landmarks.
- `[Observed: dev, Super Admin GB, 2026-09-21]` Browser console reports an incompatible AG Grid/AG Charts Enterprise license key while this analyser loads. UI impact on graph behavior is unverified.
- `[Observed: dev, Super Admin GB, 2026-09-21]` With approved temporary scope `PAC2-3798-TC-006`, enabling `Pivot Mode` checks its column-panel control, adds `Column Labels`, opens helper dialog `Pivot Mode`, and begins a report fetch without a browser navigation. The helper shows preview grid headings `Groups`, `Pivot field - Value 1`, and `Pivot field - Value 2...`; steps to choose group/pivot/value/function fields; and disabled `Pivot` button until required selections exist. No field was selected and no pivot was executed.
- `[Observed: dev, Super Admin GB, 2026-09-21]` The helper was closed without selection, then the approved `Disable Pivot Mode` action restored an unchecked control and removed `Column Labels`. No saved report, field selection, or pivot execution remains.
- `[Observed: dev, Super Admin GB, 2026-09-21]` Reopening the helper, `Choose fields to group by` exposes the available column list, including `Actions` and `Diary` fields. The dialog displays `Invalid License`; this matches the AG Charts Enterprise license console error. No option was selected. The helper was closed and `Pivot Mode` disabled again.
- `[Observed: dev, Super Admin GB, 2026-09-21]` `Medication Analyser` opens in the same unsaved-report shell and exposes `Advanced Search`, prescription/patient count landmarks, grid, `Columns`, and `Filters`. Its filter panel exposes `Filter List 88 Filters`, including medication/prescribing-related fields. No filter, column, or row action was changed.
- `[Observed: dev, Super Admin GB, 2026-09-21]` Expanded `Analytics & Reports` exposes, in visible order: `Capacity & Demand`, `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details`, `Comms Analytics`, `Reports`. Target order/replacement labels are absent from the ticket, so this is baseline only. `QOF Registers` remains visible.
- `[Observed: dev, Super Admin GB, 2026-09-21]` Activating `Comms Analytics` initially redirected the authenticated Paco session to `/commshub/login?loggedout=true&msg=error-at-axios-interceptor`, which shows `Welcome Back` and `Sign In`. After tester manual login, `Comms Hub` home and `Analytics` are available. `Comms Analytics` exposes campaign grid controls including `Export to CSV`; no export was generated because CSV schema, approved evidence/delete path, and exact approval scope remain absent.
- `[Observed: dev, Super Admin GB, 2026-09-21]` `Campaign Manager` exposes `Create Campaign`, `Campaign Outbox`, campaign-status filters, and grid controls. `Campaign Outbox` is reachable. No campaign, recipient selection, or send action was performed because no verified test destination or rollback plan was supplied.
- `[Observed: dev, Super Admin GB, 2026-09-21]` With approved temporary scope `PAC2-3798-TC-010`, activating `Export to CSV` on `Comms Analytics` issued one export request and received HTTP `200` with redacted response metadata `success=true`. The response was JSON, not an observable browser download; no CSV file was retained. CSV column/schema correctness is therefore `Inconclusive` until the product supplies the expected export contract.
- `[Observed: dev, Super Admin GB, 2026-09-21]` `Advanced Patient Search` `Import` expands options `Patient List`, `JSON Search`, and `XML Search`. No import was selected, no file was uploaded, and `Cancel` restored the analyser. Legacy-search migration remains untested because no deprecated saved search/mapping was supplied.

## Mutation boundary

- Not performed: `New`, `Save`, `Search`, `Analyse`, `Import`, `Add Rule Group`, report selection, row selection/actions, `Expand All`, `Collapse All`, column/filter changes, `send to comms hub`, CSV generation.
- Reason: these actions may create/update report/search state, change persistent configuration, select patient data, send external communication, or download data. No mutation approval, safe test data, recipient/destination, or expected-result rule was supplied.

## Mismatch and risk

- `[Observed]` Navigation mismatch: demo-host sidebar target `/patient-analyser-new/` is unavailable (`404`), while ticket demo route `/patient-analyser/` works. This is a candidate regression/location issue; ticket source does not state the intended navigation route.
- `[Open Question]` No saved old `advanced search` is available. Migration behavior cannot be observed.
- `[Open Question]` No pivot control/helper modal was visible in current read-only scope. Column eligibility and expected pivot behavior lack a trusted rule.
- `[Open Question]` The target tab order and replacement label for `C&D with observations` are absent from the ticket.
- `[Open Question]` Separate count loading has no performance threshold or expected loading-state rule.

## Suggested coverage

- Use approved saved old/new reports to compare URL anchors, no-refresh create/clear flows, and migration behavior.
- Test `pivot mode` only after QA supplies eligible/ineligible column rules and safe report data.
- Re-check sidebar navigation against the intended demo route.
- Test `send to comms hub` and CSV only with separate mutation approval; `send to comms hub` also needs verified test recipient/destination.

## Evidence

- Local Playwright accessibility observations, dev, `Super Admin GB`, 2026-09-21; no screenshot promoted because grid/modal contained patient/NHS data.
- Mutation: `None`.

## Tester notes

