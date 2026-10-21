# Workflow: [Feature]

- Classification: `[Observed: environment, role, YYYY-MM-DD]`
- Aliases: `[UI terms]`
- Coverage: `Partial (read-only) | Partial (interactive) | Complete` — `Complete` only when every supported action was exercised
- Confidence: `Low | Medium | High`

## Business context observed

- Visible purpose:
- Actor/role:
- Required context:
- Starting data state:
- Entities and statuses:

## Entry

1. [Navigation step]
2. [Stable page landmark]

## Read-only flow

1. **Action:** [navigate/view/search/filter/sort/paginate/open known read-only detail]
   - **Transition:** [state change]
   - **Observed result:** [current behavior]
   - **Evidence:** [redacted reference]

## Decision points

- **Visible condition:** [condition]
  - **Branch/state A:** [observed]
  - **Branch/state B:** [observed or Open Question]

## End and exceptional states

- End state observed:
- Empty/loading/error states:
- Cross-feature handoff:

## Safety boundary

- Last safe read-only state:
- Approval stop: [mutation/send/upload/import/external-system/unknown action]
- Actions not performed:
- Mutation: `None` (read-only) or see `## Mutation coverage`

## Required test data

- Owned synthetic data (`QA-test-<run-id>-<n>`), files, recipient:
- Pre-existing data needed (Open Question if unavailable):

## Interactive flow (owned test data)

1. **Action:** [create/submit/update/transition/delete/upload/download]
   - **Result / state after:** [Observed]
   - **Persistence after reload:** [verified / not verified]
   - **Evidence / ledger ref:**

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|

## Cross-feature relationships

- [Feature A → Feature B]: [trigger, observed effect, classification]

## Anomalies and unverified behavior

- Anomalies / possible defects:
- Unverified behavior and blockers:

## Mutation coverage

| Workflow branch | Status (Performed/Skipped/Not supported) | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|

- Branches exercised / found:

- Still needs interaction testing:

## Execution guidance

- Setup/data:
- Safe manual steps:
- Stop and request approval before:
- Evidence to capture:

## Automation guidance

- Stable roles/labels/landmarks:
- Observable waits:
- Data dependencies:
- Assertions lacking trusted expected basis:

## Provenance and gaps

- Environment:
- Role:
- Observed at:
- Raw evidence:
- Open questions:
- Exact resume state:

## Tester notes
