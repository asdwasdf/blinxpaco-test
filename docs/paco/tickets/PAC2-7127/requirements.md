# Requirements: PAC2-7127

**Input Revision:** 1
**Generated:** 2026-10-18T05:52:00Z
**Status:** Active

## Source Summary

PACO Connect - Unable to remove "Consultation Ended" Status once selected.

## Comments

- **Sean Huynh 2026-10-07:** "PASSED QA on FB" + screen recording evidence
- **Abbi Russell 2026-10-07:** "pass" + save.mp4 evidence

## Video Coverage

- `ticket/PAC2-7127-paco-connect-unable-to-remove-consultation-ended-status-once-selected/attachments/117324-20260703-0837-49.5047989.mp4` — bug demonstration (date 2026-07-03)
- `ticket/PAC2-7127-paco-connect-unable-to-remove-consultation-ended-status-once-selected/attachments/117325-20260703-0835-20.2549319.mp4` — additional bug capture
- `ticket/PAC2-7127-paco-connect-unable-to-remove-consultation-ended-status-once-selected/attachments/129060-save.mp4` — QA pass evidence (Abbi)
- `ticket/PAC2-7127-paco-connect-unable-to-remove-consultation-ended-status-once-selected/attachments/128962-Screen Recording 2026-10-07 at 3.43.53 PM.mov` — QA pass evidence (Sean)

## Atomic Requirements

### REQ-PAC2-7127-001

**Classification:** Confirmed (from bug description + QA pass)
**Lifecycle:** Active
**Feature/Scope:** PACO Connect > Appointment Book > Patient Status management
**Search Terms/Aliases:** `Consultation Ended`, `reset status`, `patient status`, `Mark as`
**Known Location:** `/paco-connect/appointment-book` (Appointment Book Day view)
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** Dev, QA on feature branch (PAC2-7127), 2026-10-07
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Patient has an appointment in a session
- Patient status is currently "Consultation Ended"

**Expected Behavior:**
- User can change patient status from "Consultation Ended" to any other status (e.g., "Patient Left", "Booked")
- Reset action should clear status locally and persist the change
- No error message "Reset failed, but status cleared locally" should appear
- Status should actually clear and reflect the new selected value

**Provenance:**
- **Source:** PAC2-7127 ticket description + QA comments
- **Input Revision:** 1
- **First Recorded:** 2026-10-18
- **Last Verified:** Not yet (replay pending)

**Evidence:** QA passed with video evidence on feature branch 2026-10-07

---

## Ambiguities and Conflicts

- Acceptance criteria not provided in ticket — expected behavior inferred from description
- Patient status dropdown options not enumerated — unclear which statuses are available for selection
- Reset mechanism (X button, "Select Patient Status" menu, other) not specified

## Open Questions

- Is the fix already merged to dev main, or only on feature branch? QA passed on FB 2026-10-07, but dev main regression not verified.
- Which exact UI control resets/removes a patient status (e.g., X/clear button vs. selecting a different status)?
- What are all available patient status options in the dropdown?
- Does the bug affect all statuses or only "Consultation Ended"?

---
