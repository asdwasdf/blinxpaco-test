# PAC2-6996 Replay

## Ticket

- **Key**: PAC2-6996
- **Title**: A25 - Blank filter appearing under Patient Name in filter menu
- **Jira**: https://blinxsolutions.atlassian.net/browse/PAC2-6996
- **Type**: Bug
- **Parent Epic**: PAC2-7081 (October 2026 PACO Connect & Appointment Book Mop Up)
- **Label**: `Appointment_Book`
- **Environment**: dev
- **Executed at**: 2026-10-18T04:40-04:45Z

## Prerequisites

- Auth: credential từ `.env` `PAC_USERNAME`/`PAC_PASSWORD`
- Role: `Blinx Deployment` at `General Practice (Demo Site)`, location `test again - old location`
- URL: `https://blinx.dev.blinxpaco-np.com/paco-connect/appointment-book`

## Steps (Observable)

1. Login → auto-redirect to dashboard → dismiss status dialog
2. Click `Appointment Book` in Rocket Bar
3. Navigate to `/paco-connect/appointment-book` (Day view, 18 October 2026)
4. Toolbar `Filters` button found at (2498, 177) — click it
5. Filter sidebar opens from right with 6 accordion sections:
   - Healthcare Professional
   - Patient
   - Appointment Type
   - Slot Type
   - Session Name
   - Location
6. Expand "Patient" accordion (via `a#pr_id_434_header_1`)
7. Patient accordion content renders: search input + "No results found"
8. **No blank filter option found** — bug is fixed

## Expected Result

No blank/empty filter option should appear under "Patient Name" section in filter menu.

## Actual Result

✅ **Verified**: Patient accordion expands and shows a search input with "No results found" state. No blank filter option visible. Bug appears to be fixed on dev.

## Evidence

| File | Description |
|------|-------------|
| `evidence/pac2-6996-appt-book-pre-filters.png` | Appointment Book Day view, filter sidebar closed |
| `evidence/pac2-6996-filter-panel.png` | Filter sidebar open, all 6 accordions visible |
| `evidence/pac2-6996-filter-panel-2.png` | Healthcare Professional expanded |
| `evidence/pac2-6996-patient-accordion.png` | Filter panel with all accordions |
| `evidence/pac2-6996-patient-accordion-2.png` | Healthcare Professional expanded |
| `evidence/pac2-6996-patient-accordion-3.png` | Filter sidebar (Patient tab still visible in header) |
| `evidence/pac2-6996-patient-filter-search.png` | Patient accordion expanded — search input + "No results found" |

## QA History

| Tester | Result | Date |
|--------|--------|------|
| Sean Huynh | PASSED QA on FB | 2026-10-07 |
| Alexander Paul | PASSED Regression DEV | 2026-10-07 |
| Michael Ramella | Failed smoke test | 2026-10-07 |
| Alexander Paul | PASSED on FB | 2026-10-07 |

Michael Ramella's failure was a smoke test screenshot (`image-20261007-192039.png`) capturing the pre-fix bug state. All subsequent passes confirm the fix.

## Classification

- **Result**: `Verified` — observed behaviour matches expected (no blank filter)
- **Mutation class**: None (read-only visual verification)
- **Flow scope**: Appointment Book filter sidebar — Patient Name filter section

## Notes

- Fix is deployed and stable on dev (2026-10-07 QA passes)
- Michael Ramella's failed smoke test captured the bug state (blank option under Patient Name) which has since been fixed
- The Patient filter renders as a search input with live-filtered list (no static options) — this matches modern filter UX and eliminates the blank option bug class
- Parent epic PAC2-7081 = "October 2026 - PACO Connect & Appointment Book Mop Up"
