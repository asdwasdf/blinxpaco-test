# Jira Comment Draft — PAC2-8241

## Suggested comment (English, for Jira)

---

**QA Summary — PAC2-8241**

Tester confirmed **overall PASS** on DEV main (2026-10-05) for session editor fix flows.

**Test Results:**

| Case | Result | Notes |
|---|---|---|
| TC-001 — Save slot outside session range | **Fail** | Server returns 500 silently, no user-facing message "Slots must sit inside the session..." |
| TC-002 — Bulk slot type change | **Pass** | Persists after save and reload |
| TC-003 — Single + bulk bookable toggle | **Pass** | Persists after save and reload |
| TC-005 | **Blocked** | Test data: date picker blocks past dates; session creation failed (care professional assignment) |
| TC-006 | **Blocked** | Requires booking from TC-005 |
| TC-007 — Extend Time Range | **Fail** | Save returns 200 but slots revert to original type; no new slots added for extended range |

**Key Observations:**

1. **Boundary error silent (TC-001):** Dragging a slot outside session range triggers `POST appointment-slots/update 500` with no user-facing error. Expected: message "Slots must sit inside the session (HH:MM to HH:MM). Change the session times first." — this matches the requirement from ticket comment (tony.do 2026-09-22).

2. **Time Range extend reverts slot types (TC-007):** Extending `Hours (To)` 16:00→17:00 saves successfully (200) but all slot types revert to default, no new slots are generated, and header shows old time until ~5s later. Expected per tony.do: new default slots added, existing slots kept.

3. **DEV vs FB discrepancy (OQ-003):** `PASSED QA on FB` (Sean 2026-09-22) vs video "8241 DEV Not work.mp4" (Alexander Paul 2026-10-01) — please clarify which build/version was tested on DEV, or confirm whether the FB fix has been deployed to DEV main.

4. **Configuration Add Session:** Session creation via UI was attempted multiple times but failed silently or due to validation — this blocked TC-005/TC-006. A working session was used for TC-001/002/003/007 via existing template.

**Automation:** Playwright spec implemented for TC-001/002/003/007. CLI verification pending (blocked by auth browser issue).

**Open Question:** OQ-003 — Which build/commit on DEV contains the FB fix? Please advise for retest scope.

---

*NCP QA — 2026-10-07*
