---
id: health-forms-designer-v2
title: Health Forms Designer V2
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Create new SPN
    kind: mutation
  - name: Create new health forms
    kind: mutation
  - name: Create new consultation
    kind: mutation
  - name: Create new case form
    kind: mutation
  - name: Search Templates
    kind: read-only
  - name: Filters
    kind: read-only
verified_by: []
last_observed: 2026-10-01
---

# Health Forms Designer V2

## Purpose and context

`Observed`: `Health Forms` → `Designer V2` opens `/paco/health-forms`.

## Entry and transitions

Page heading `Health Form Templates` with create menu dropdown exposing four template types: `Create new SPN` (`/paco/health-forms/create-spn-form`), `Create new health forms` (`/paco/health-forms/create-health-form-template`), `Create new consultation` (`/paco/health-forms/create-consultation-template`), `Create new case form` (`/paco/health-forms/create-case-form`).

Grid finishes loading and exposes columns `Archived`, `Editable`, `Name`, `Type`, `Created date`, `Created by`, `Updated date`, `Updated by`, `Archived date`, and `Actions`. A synthetic no-match search reduced 51 structural `role=row` elements to three structural rows without an explicit empty-state message; clearing restored the grid. Structural counts are not template totals.

Opening `Filters` exposed a drawer with `Date Range`, `Type`, `Clear all`, `Cancel`, and `Save`. Opening `Type` exposed the current available option `case_form`; it was closed without selection. `Date Range` exposed presets from `Today` through `All time`, relative-day fields, and paired `From`/`To` calendars. Its `Apply` remained disabled; both picker and drawer were cancelled unchanged. Sorting changed the active column from default `Updated date` descending to `Name` ascending, then restored `Updated date` descending. Existing template rows and `Actions` were not opened during the 2026-09-20 survey. `[Observed: dev, Super Admin GB, 2026-09-30]` A populated row's pinned `Actions` menu exposed `View`, `Edit`, `Copy`, `View Audit`, `Archive`. `View` opened a dialog containing an empty patient-details preview/form: required `Patient Given Name`, `Patient Surname`, `Patient Condition Summary`; optional `NHS Number`, `Patient Gender`, `Patient DOB`, `Mobile Phone`, `Home Phone`, `Email Address`; `Create` was disabled while required fields were empty. Closed with `Close`, no input or submission. `View Audit` on the same row returned to the template grid with no visible dialog, drawer or route change in this observation; expected audit behavior remains unknown. `Edit`, `Copy`, `Archive` were not selected. Never assume `View` is a read-only template detail: it presents patient fields and a `Create` boundary.

## Execution guidance

- Treat existing templates as shared production data; do not edit/delete without explicit approval and rollback plan.
- New template creation persists immediately; requires unique synthetic name, known template type and cleanup verification.
- Search/filter/sort are read-only and safe for general survey. `View` opens a patient-data form; close before entering information or pressing `Create` unless a controlled case, recipient/data rule, mutation gate, ledger and cleanup are ready.

## Automation guidance

- Stable landmarks: route, heading `Health Form Templates`, create menu, grid structure.
- Mutation tests require controlled synthetic template with known cleanup path.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Grid loaded; synthetic no-match search changed 51 structural rows to three and cleared cleanly. `Filters`, `Type`, and `Date Range` opened and closed unchanged; sort changed to `Name` ascending and restored to `Updated date` descending. Mutation: `None`; template names, creators, and organisation context excluded.

`[Observed: dev, Super Admin GB, 2026-09-30]` Row menu and `View` dialog inspected. Raw local screenshot under `.playwright-mcp/` stays unshared; no patient data entered. `View Audit` selected once without observable state change. Mutation: `None`.

`[Observed: dev, Super Admin GB, 2026-10-01]`

### Form Editor (Designer V2)

Opening a Health Form template opens `/health-forms/builder/editor/` with title `Edit Health Form`. Warning dialog appears for forms already sent: "You are editing a Health Form that has already been sent to a patient or is currently awaiting review. Any changes you make will affect all versions of this form."

**Form Title field:** Text input at top, editable.

**Settings panel:**
- Health Form Type (dropdown)
- Diary Frequency (Optional)
- Select Default Reviewers (combobox slot types clinician)
- View Tag List
- Add Total Health Form Score to Patient Record (checkbox + SNOMED Code combobox)
- Default Booking Settings
  - Use a Timed Session? (checkbox)
  - Slot Types
  - First available slot message
- Save to Record Without Review (checkbox)

**Toolbox fields:**
- Blood Pressure, Multi Blood Pressure, BMI (medical)
- Header Text, Paragraph, Line Break (layout)
- Text Input, Multi-line Input, Number Input Unit (input)
- Dropdown, Multiple Choice, Checkboxes, Range (choice)
- Date, Email, Phone Number (specialized input)
- File Upload, Image, Video (media)
- Rating, Signature, Website (interactive)
- Two Column Row, Three Columns Row (layout)
- Dynamic Consultation (integration)
- Organisation Logo, Organisation Header, Organisation Footer (branding)

**Actions:** Preview Form, Save Form

**Designer V1** (`/health-forms/builder/`): Lists templates with columns `Health Form type`, `Health Form Reviewer`, `Health Form Name`, `Created Date`, `Created By`, `Created By Organisation`, `Shared To Organisation(s)`, `Updated Date`, `Updated By`, `Archived`, `Archived Date`, `Editable`, `Actions`. Same template list as V2. Type shows "Scheduled One-Off" for all visible templates. Archived shows "Active" vs "Archived".

## Open questions

- Explicit no-match behavior beyond structural row reduction remains unspecified.
- Each template type's mandatory fields and workflow steps remain unspecified.
- Archive/restore semantics and whether deletion is permanent remain unspecified.
- `View Audit` produced no observable UI change for the sampled row on 2026-09-30. Whether this is an unavailable action, silent failure, or another behavior needs confirmation; no expected behavior asserted.

## Tester notes

[Protected area]
