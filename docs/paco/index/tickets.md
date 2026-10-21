# Tickets Index

Auto-generated from replay batches. Do not edit manually.

| Ticket Key | Summary | Status | Result | Flow | Batch |
|---|---|---|---|---|---|
| PAC2-7136 | PACO Connect - Dark Mode Text is too dark on Group Quick Send | Done | verified (dark mode text contrast confirmed on Comms Hub; white text on dark bg) | — | pac2-7136-replay |
| PAC2-7138 | PACO Connect - Dark Mode resets to Light Mode when refreshing browser | Done | verified (fix deployed; theme persists via localStorage['selected-ui-theme']; light↔dark retained after refresh) | — | pac2-7138-replay |
| PAC2-3934 | Allow Health Form Filing Across Different Organisations in PACO Connect | Open | blocked (consultation screen not accessible on dev chung; PAC2-5445 + host whitelist) | cross-org-health-form-filing | pac2-3934-replay |
| PAC2-6983 | Dashboard/Appointment Book selector not pixel perfect | Done | verified (fix deployed on dev 2026-10-08; pixel-perfect spacing after fix; Video 3 evidence) | paco-connect-tab-selector | pac2-6983-replay |
| PAC2-6996 | A25 - Blank filter appearing under Patient Name in filter menu | Done | verified (fix deployed on dev 2026-10-07; Patient filter now shows search input + "No results found"; no blank option) | pac2-6996-appointment-book-patient-filter | pac2-6996-replay |
| PAC2-6997 | A26 - Status filter showing patients with no status alongside filtered results | Done | verified (live: Oct 12 Booked 2; deselect all Patient Status → Booked 0; only Did Not Attend/Appointment Cancelled=2 match — confirming no-status bookings hidden when specific Patient Status selected; filter whitelist confirmed) | pac2-6997-appointment-book-patient-status-filter | pac2-6997-single |
| PAC2-7129 | Menu opening below screen level | Done | verified (menu dropdown renders at correct position within viewport; PAC2-7081 Epic mop-up; DEV 2026-10-18) | — | pac2-7129 |
| PAC2-7132 | PACO Connect - 5 Minute Slots - Patient Name needs shifting right | Done | verified (fix deployed; QA PASS on FB + DEV 2026-10-07; visual layout verified via video evidence; no pixel spec) | — | pac2-7132-single |
| PAC2-7144 | Care nav buttons inactive despite care nav being enabled in settings | Done | partial (fix verified via video: buttons greyed out pre-fix, clickable post-fix; Sean Huynh PASSED QA 2026-10-07; live replay PARTIAL: buttons intermittent on dev main, no test patient in scope) | pac2-7144-care-nav-buttons-inactive | pac2-7144-single |
| PAC2-7150 | PACO Connect - Can't make sessions earlier | Done | verified (fix deployed; 3 test cases PASSED on FB + DEV; shaded hour zone allows earlier slot, "Start session at [time]" prompt, extend both ends, clash detection) | pac2-7150-session-extend-earlier | pac2-7150-single |
| PAC2-7164 | Selected appointment slots remain highlighted after saving edits from Action menu | Done | verified (fix deployed; QA PASSED on DEV + prod 08/10; slots auto-deselect after Save) | — | pac2-7164-replay |
| PAC2-7165 | Live appointment filter does not update correctly in Year View | Done | verified (Year Live = 23, not 0; fix confirmed; partial: no monthly Live breakdown in Year grid) | — | PAC2-7165-single |