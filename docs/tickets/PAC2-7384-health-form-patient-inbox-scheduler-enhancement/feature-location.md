# Feature Location: PAC2-7384

**Input Revision:** 1
**Generated:** 2026-10-13T16:02:00Z
**Status:** Inconclusive — partial (scheduler host landing confirmed `Link Error`; awaiting tester token/recipient. Paco Connect inbox location still TODO.)

## Environment

- Scheduler feature branch host: `https://dev.blinxscheduler-np.com/feature-branch/pac2-7384/`
- Paco dev (Connect inbox surface): `https://blinx.dev.blinxpaco-np.com`
- Both in `paco.config.yaml safety.allowedHosts` (allowlist update uncommitted).

## Role

- Scheduler: patient, no PACO login (open access per `workflows/patient-facing-scheduler.md`).
- Connect inbox: not yet authenticated in current browser tab. Pending manual login by tester per `scripts/manual-login.md` rules.

## Read-only mode

Yes (LOCATE only navigates and reads; no mutation).

## Search order used

1. Requirements-derived search terms/aliases loaded from `requirements.md`:
   - REQ-001: `expand`, `expandable`, `collapse`, `HF`, `detail view`, `read more`, `show more`
   - REQ-002: `conversational`, `conversation view`, `HF alongside chat`, `inline HF`, `remove view`, `legacy view`, `HF view mode`
   - REQ-003: `mobile`, `submitted HF`, `chat bubble`, `thick bar`, `responsive`, `viewport`
2. `docs/product/feature-map.md` consulted → Module `Patient-facing Scheduler (external host *.blinxscheduler-np.com)` provides previously validated routing for `Patient Self Booking`: `/patient-self-booking/` and `/feature-branch/<ticket-branch>/patient-self-booking/`. Tickets cited: PAC2-8552, PAC2-1805. Connect inbox route: `/health-forms/responses/` per `workflows/health-forms.md` `[Observed]`.
3. Reusable-route validation attempted against scheduler feature branch.

## Routes probed in this run (raw evidence)

| View | URL | Title | Result | Snapshot path |
|------|-----|-------|--------|----------------|
| 1 | `https://dev.blinxscheduler-np.com/feature-branch/pac2-7384/` | Blinx Scheduler | `Link Error` page rendered. Heading: `Link Error`. Body: `No token found. Your link may have expired — please use the most recent link your healthcare team sent you.` | `test-results/PAC2-7384/locate/run-20261013-1602/01-scheduler-link-error.png` |
| 2 | `https://dev.blinxscheduler-np.com/feature-branch/pac2-7384/patient-self-booking/` | Blinx Scheduler | Same `Link Error` page — feature-branch base path scopes tokens per patient; no token → Link Error regardless of sub-path. | `test-results/PAC2-7384/locate/run-20261013-1602/02-scheduler-patient-self-booking-link-error.png` |

## Observations

- Scheduler feature branch enforces per-patient token gate at root and any sub-path tried. No public UI shell exposed without token.
- Reusable-route claim from prior tickets (PAC2-1805, PAC2-8552) is consistent: feature-branch without token → `Link Error`.
- No way to enumerate Scheduler chat shell, HF view modes, or mobile-rendered submitted HF without a token. Any further scheduler LOCATE work requires a per-patient tokenized URL.

## Candidates

| Candidate | Where | Source | Status |
|-----------|-------|--------|--------|
| C1 | `https://dev.blinxscheduler-np.com/feature-branch/pac2-7384/<token>/` (full path uses a single token segment after `/pac2-7384/`) | Per `workflows/patient-facing-scheduler.md` `[Observed]` and PAC2-1805 feature-location | Awaiting tester to provide a tokenized link (preference: synthetic patient per CLAUDE.md safe data rules). |
| C2 | Paco Connect Inbox `/health-forms/responses/` on `blinx.dev.blinxpaco-np.com` | `workflows/health-forms.md` `[Observed]`; PAC2-4399 feature-location | Awaiting manual login by tester in current Playwright tab. |

## Rejected paths (this run, dependency revision = source SHA 0d33b40e…, allowlist updated 2026-10-13)

- Root path `/feature-branch/pac2-7384/` and `/feature-branch/pac2-7384/patient-self-booking/` both return `Link Error`. Re-trying these will keep the same result unless a token is appended; do not re-visit in next LOCATE attempt without token.
- No lateral routes (`/admin`, `/login`, `/api/...`) probed — out of scope and not feature-specific; reservation unknown.

## Budget

- Eligible: 12 meaningful views, 15 elapsed minutes (per `docs/standards/feature-location.md` and `paco.config.yaml defaults`).
- Used: 2 meaningful views, ~2 minutes elapsed (run aborted by tester mid-scan to provide token).
- Remaining: 10 views, ~13 minutes.

## Recommended next action

1. Tester provides one tokenized scheduler link via ChatReply or by editing `status.md` once generated. Token must point to a synthetic patient on the dev environment per CLAUDE.md (no real PII, recipient `fiona.nguyen@blinxsolutions.com` if email-forwarded; SMS unapproved → ask first).
2. While waiting, switch to Connect inbox LOCATE: navigate current tab to `https://blinx.dev.blinxpaco-np.com/health-forms/responses/` after tester completes manual PACO login. Enumerate HF view modes (`View By Patient`, `View By Health Form`, `View Form` dialog, `More Actions`).
3. Resume scheduler LOCATE after token is supplied. Capture entry path, HF view modes on scheduler, mobile responsive observation (resize in same tab or new tab with same session).

## Mutation boundary

- This LOCATE run made zero mutations.
- All navigations were GETs to read-only pages with no stateful side-effects (`Link Error` page is static content).

## Tester notes
