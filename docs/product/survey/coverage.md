# Survey Coverage

## Super Admin GB — dev

- Status: `In Progress`
- Last observed: `2026-09-21`
- Structured views: 62
- Visited states: dashboard and staff availability; Manager/Clinician dashboards; analytics/report states; Comms Hub; Health Forms; Patients; Case Load Management; Configuration; Web Chat & Video; failed global routes
- Pending queue: read-only completeness audit of remaining sidebar/submenu/dialog/tab/filter/pagination states
- Blockers: `Connect` and several PACO Connect routes return HTTP 404/loading; `Reports` targets unauthorized `SCR`; selected pages remain loading/blank; external Comms Hub notification tabs are blocked by an overlay
- Mutation: no mutation in this checkpoint; one earlier create/delete fingerprint remains recorded in the mutation ledger
- Resume: `docs/product/survey/roles/super-admin-gb-checkpoint.yaml`

Legacy narrative survey remains in `docs/product/paco-overview.md` and `docs/product/workflows/`. Structured graph migration proceeds incrementally; legacy observations are not automatically promoted.
