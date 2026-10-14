# Feature Location: PAC2-8381

**Input Revision:** 1
**Environment:** `dev` feature branch `pac2-8381`
**Role:** `Super Admin GB`
**Observed:** 2026-10-02T20:56:59.3077055+07:00
**Status:** Confirmed
**Budget:** 3/12 views; 6/15 minutes

## Search clues

- `Appointment Book`, `Appt. Book`, `PACO Connect`, `Audit`, appointment slide panel, `Booked By`, `created this slot`, `booked this appointment`.
- Actor/context: authenticated `Super Admin GB`; existing booked appointment.
- Trigger/target: booked appointment tile → `Appointment Details sidebar`; audit section/tab expected inside appointment detail.

## Confirmed entry path

1. Starting state: authenticated Paco dashboard.
   - Landmark/control: role text `Super Admin GB`; sidebar `Appointment Book`.
   - Read-only action: navigate directly to feature-branch route `/paco-connect/feature-branch/pac2-8381/appointment-book`.
   - Resulting state: `Appointment Book` day view on PAC2-8381 feature branch.
   - Context dependency: manual authenticated session; preserve feature-branch prefix.
2. Starting state: `Appointment Book` day view.
   - Landmark/control: `Day`, date selector, `Booked`, `Available`, `LIVE`, `Quick Book`, `Filters`.
   - Read-only action: choose a date containing existing bookings, then toggle `Booked`.
   - Resulting state: only session columns with booked appointments remain visible.
   - Context dependency: selected `Appt. Book` and date determine records.
3. Starting state: booked-only day view.
   - Landmark/control: existing appointment text inside a session column.
   - Read-only action: open an existing appointment.
   - Resulting state: complementary `Appointment Details sidebar` opens; visible metadata includes `Booked By`.
   - Context dependency: existing appointment data. On observed historical appointment, metadata showed `Booked By: Beth Green`.

## Context requirements

- Authenticated Paco session with role `Super Admin GB`.
- Dev feature branch route must remain `/paco-connect/feature-branch/pac2-8381/appointment-book`.
- Select an `Appt. Book` and date containing existing booking; selected date/book controls appointment availability.
- Existing appointment may contain sensitive patient data; no patient identifier copied into reusable route sync.
- `LOCATE` stayed read-only. No booking, edit, cancellation or audit assertion performed.

## Candidate and rejected paths

- Candidate confirmed: feature-branch `Appointment Book` → date with bookings → `Booked` → existing appointment → `Appointment Details sidebar`.
- Candidate for later `EXPLORE`: audit control/section inside appointment details. On this existing appointment, accessible snapshot exposed appointment metadata and patient tabs but no visible `Audit` control; exact access may depend on appointment state or a different section/layout.
- Rejected: baseline `/paco-connect/appointment-book` as target. It can serve as control only and does not prove PAC2-8381 build.
- Rejected: `Care Navigation` route during `LOCATE`; it is a separate source flow and needs deterministic tile/test data before end-to-end observation.

## Observed landmarks

- Page title `PACO Connect`.
- Route `/paco-connect/feature-branch/pac2-8381/appointment-book`.
- Breadcrumb/button `Appointment Book`.
- View controls `Day`, `Week`, `Month`, `Year`.
- Summary controls `Booked`, `Available`, `LIVE`.
- Buttons `Quick Book`, `Filters`.
- Complementary landmark `Appointment Details sidebar` with heading `Appointment`, date/duration, appointment title, `Patient`, `HCP`, `Appt Type`, `Appt Location`, `Start Time`, `End Time`, `Booked By`.

## Evidence

- Browser observation 2026-10-02, `dev`, `Super Admin GB`; raw Playwright plugin snapshots remain local and contain patient data, therefore not promoted/shareable.
- Route and high-level landmarks are redacted in this document; no credentials, tokens, cookies or patient identifier retained.

## Automation hints

- Navigate using exact feature-branch path; assert URL keeps `/feature-branch/pac2-8381/`.
- Wait for `Appointment Book`, date selector and summary controls instead of document response status.
- Use accessible complementary name `Appointment Details sidebar` and stable metadata labels such as `Booked By`, `Start Time`, `End Time`.
- Appointment lookup requires controlled test data; do not bind automation to historical patient name or date.
- Audit locator remains unresolved and must be captured during `EXPLORE`/manual execution from controlled appointment state.

## Blockers and next action

- Blocker: None for feature location.
- Warning: exact visible `Audit` control was not exposed on the historical appointment inspected; this is a coverage gap, not a product verdict.
- Next action: `EXPLORE` read-only from confirmed route to identify audit access and observable states; stop before booking/edit/cancel mutations.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
