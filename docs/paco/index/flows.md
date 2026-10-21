# Flows Index

Auto-generated from replay batches. Do not edit manually.

| Flow Slug | Module | Roles | Scenarios | Source Tickets | Verified |
|---|---|---|---|---|---|
| cross-org-health-form-filing | PACO Connect | Clinician (cross-org) | S1-S5 reconstructed (Not Run live) | PAC2-3934 | ⛔ blocked (consultation screen not accessible on dev chung) |
| paco-connect-tab-selector | PACO Connect | Super Admin GB | S1-S3 (Dashboard ↔ Appointment Book tab spacing) | PAC2-6983 | ✅ verified via Video 3 evidence (Sean Huynh PASSED QA 2026-10-08) |
| pac2-6997-appointment-book-patient-status-filter | Appointment Book | Blinx Deployment | SC-001 (Patient Status whitelist — verified live: Oct 12 Booked 2 → deselect all → 0; Did Not Attend=2, Appt Cancelled=2 → confirming no-status hidden); SC-002, SC-003 (Not Run) | PAC2-6997 | ✅ verified live 2026-10-18 (whitelist logic confirmed: no-status bookings only show when no specific Patient Status selected) |
| pac2-7144-care-nav-buttons-inactive | Care Navigation | Blinx Deployment | S1 (patient care nav buttons — greyed out pre-fix, clickable post-fix; verified via video: Sean Huynh PASSED QA 2026-10-07) | PAC2-7144 | ✅ verified via video evidence (Sean Huynh PASSED QA 2026-10-07) |
| pac2-6996-appointment-book-patient-filter | Appointment Book | Blinx Deployment | SC-001 (verify no blank filter under Patient Name) | PAC2-6996 | ✅ verified live replay 2026-10-18 (Patient filter renders search input + "No results found") |
| pac2-7150-session-extend-earlier | Appointment Book | Super Admin GB / Session holder | SC-001 (shaded hour → "Start session at [time]" prompt); SC-002 (extend both ends, cancel/accept); SC-003 (from Appointment Book panel + clash detection) | PAC2-7150 | ✅ verified via video (Sean Huynh PASSED QA on FB + DEV 2026-10-07) |
| pac2-7161-sidebar-tooltip-expand | PACO Connect / Appointment Book | Blinx Deployment | SC-001 (sidebar expand → labels display for all nav items); Sean Huynh PASSED QA FB + Daniel Farley approved 2026-10-07 | PAC2-7161 | ✅ verified live + video evidence (2026-10-18) |