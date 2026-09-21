---
id: comms-hub-configuration
title: Comms Hub Configuration
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - external-dashboard
controls:
  - name: Clear Selections
    kind: mutation
  - name: Save
    kind: mutation
  - name: Search tags
    kind: read-only
verified_by: []
last_observed: 2026-09-21
---

# Comms Hub Configuration

## Purpose and context

`Observed`: External Communications Hub → Configuration opens `/commshub/commshub/configuration`.

## Entry and transitions

Page title `Communications Hub`, breadcrumb `Communications Hub → Comms Hub → Configuration`. Section heading `CAMPAIGN TAG CONFIG`.

Controls: `Clear Selections` (mutation), `Save` (mutation), `Search tags...` (read-only search). A synthetic no-match query caused no observable reduction in the rendered tag list; the query was cleared. This suggests search behavior may require an additional trigger or may not filter client-side, but expected behavior remains unknown. The `Configuration` side-panel expansion control was toggled open and closed; the tag search remained visible and no tag became selected.

Editable form fields observed:
- `Tag Name`
- `From Date` and `To Date`: calendar pickers with month/year selection and day grid; each was opened and dismissed unchanged
- `Dynamic Date Range?`: `Today`, `Yesterday`, `This week`, `Last week`, `This month`, `Last month`, `Last 12 months`, `This year`, `Last Year`, `Year to date`, `This financial year`, `Last financial year`
- `Gender`: `Both`, `Male`, `Female`
- `Age Range? (Min-Max)`
- `1st Send Contact Preference`: `No Preference`, `Email`, `SMS`; noted as affecting scheduled campaigns only
- `Additional Send Contact Preference`: `No Preference`, `Email`, `SMS`; noted as affecting scheduled campaigns only
- Expandable accordions:
  - `Email Configuration`
  - `SMS Configuration`
  - `Email Exclusion Codes`
  - `SMS Exclusion Codes`
  - `Email Search Codes`
  - `SMS Search Codes`
- `Stop Sending After`: optional message-count input
- Alternative scheduled-campaign stop conditions:
  - `Patient has booked appointment (Scheduled only)`
  - `Health Form completed (Scheduled only)`

Existing campaign tags visible in UI but omitted per data-safety policy. Each additive section was inspected separately from a fresh reload because expansion creates unsaved draft UI:
- `Email Configuration` and `SMS Configuration` each create a draft `1st Send` block with delete control and `Search snomed code...`.
- `Email Exclusion Codes`, `SMS Exclusion Codes`, `Email Search Codes`, and `SMS Search Codes` each create a draft SNOMED search row with delete control.

After every inspection, direct reload restored the initial state instead of using `Clear Selections` or `Save`. Both contact-preference option lists, the dynamic-date options and the gender options were opened and dismissed with `Escape` without changing defaults. `From Date` and `To Date` calendars were also opened and dismissed without selecting a day. Both scheduled-campaign stop-condition checkboxes were toggled on individually, then immediately toggled off; final state was unchecked. Draft-only field checks entered an inverted age range (`35`–`18`) and message count `0`: neither produced inline/native validation before persistence, and `Save` remained enabled. All values were immediately cleared and the final form state was verified empty. No code, existing tag or persistence action was used.

## Execution guidance

- Existing tag configuration must not be altered without explicit approval and backup plan.
- `Save` persists configuration changes immediately.
- `Clear Selections` resets draft state; verify whether this action is reversible or alters saved config.
- Search is read-only. Accordion expansion can create unsaved draft blocks; reload instead of `Clear Selections` or `Save` when restoring state.
- Campaign tag demographic/preference/exclusion rules are domain-sensitive; do not create test tags without known cleanup path.

## Automation guidance

- Stable landmarks: route, breadcrumb, section heading `CAMPAIGN TAG CONFIG`, form field labels.
- Mutation tests require controlled synthetic tag with known cleanup path.
- Accordion expansion creates draft UI; automation must reload or use an explicitly approved reset path before leaving.

## Evidence

Accessibility observation, external Comms Hub dev, authenticated session associated with Paco `Super Admin GB`, 2026-09-21. Synthetic tag search produced no observable list change and was cleared. All six additive configuration/code sections were inspected one at a time without persistence, with reload after each to restore initial state. Both stop-condition checkboxes were toggled on then off and verified restored unchecked. Inverted age range and zero message-count drafts showed no pre-save validation; all inputs were cleared and verified empty. Mutation: `None`; no `Save`; tag names/values omitted per data-safety policy.

## Open questions

- Does `Clear Selections` only reset UI state, or does it alter saved configuration?
- What is minimum required data for creating a test campaign tag?
- Is tag deletion available, and if so, how is it accessed?
- Do exclusion/search code fields accept test/synthetic values, or must they match production code sets?
- Does accordion-created draft state persist anywhere before `Save`, and is `Clear Selections` the intended safe reset? Reload restored the visible initial state, but persistence semantics remain unknown.

## Tester notes

[Protected area]
