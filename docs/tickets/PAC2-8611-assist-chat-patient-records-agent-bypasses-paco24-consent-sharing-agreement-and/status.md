# PAC2-8611 — Status

## Current Phase: LOCATE — Blocked

### Summary
Assist Chat (Patient Records Agent) bypasses paco24 consent, sharing-agreement và per-domain RBAC checks. Single gate only checks org membership via `getPatientDemographics()`, then reads clinical data directly from DB.

### Security Gaps Identified
| Gap | Description | paco24 Control Bypassed |
|-----|-------------|------------------------|
| #1 | Patient consent/dissent (opt-out) | Opt-out patients still readable |
| #2 | Cross-org sharing agreement | Per-module sharing scope not enforced |
| #3 | Per-domain RBAC | Only PATIENT_PROFILE_VIEW required, not per-domain keys (CONSULTATION_VIEW, etc.) |

### Expected Behavior
- User without appointments permission → "Does patient have appointments?" must be **blocked/refused**
- User without medications permission → "Is patient on NSAIDs?" must be **blocked/refused**
- Same for every domain: conditions, observations, procedures, documents, consultations, tasks, measurements

### Safe Exception
Risk stratification already routes through paco24's token-authenticated API.

### Notes
- **Feature branch:** `blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-8611-authorization-context/`
- **Testing approach:** API-level verification (not UI chat)

### ANALYZE Checkpoint
- Requirements extracted: 4 atomic requirements (REQ-8611-001 to 004)
- Gap #1 (consent opt-out), #2 (sharing agreement), #3 (per-domain RBAC), #4 (safe baseline: risk stratification)

### LOCATE Checkpoint
- **Feature Location Confirmed:** PACO Talk → triggers Patient Records Agent
  - Entry: `/paco-talk/?patientId=<id>` → Start Consultation → AI assistant calls Patient Records Agent
  - API: `POST /api/v1/patient-records-agent/:person_id`
- **Environment:** `blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-8611-authorization-context/`
- **Role Confirmed:** Test Fiona Nguyen (Super Admin GB)
- **Issue:** Super Admin có đủ mọi permissions → không test được Gap #3 (per-domain RBAC)

### EXPLORE Checkpoint
- **PACO Talk explored:** Voice transcription tool với AI summarization
  - PACO Assist shows 11 consultation summary sections (Medications, Allergies, etc.)
  - Patient Records Agent called internally when loading patient data
- **Key Finding:** Không có direct chat UI để "hỏi về specific domain"
  - Test approach phải là API-level: call Patient Records Agent API và verify authorization
- **PACO Talk AI features:**
  - Transcription với speaker identification
  - Real-time cues cho 11 consultation sections
  - Không có text input để query patient data

### LOCATE Reconciliation — 2026-10-02
- Auth đã verify trên feature-branch dashboard với role `Test Fiona Nguyen (Super Admin GB)`.
- `/paco/feature-branch/pac2-8611-authorization-context/paco-talk/` trả `Page Not Found`.
- Sidebar không có `PACO Talk`; search `PACO` không trả menu entry.
- Route cũ `/paco-talk` bị đánh dấu stale; `feature-location.md` ghi outcome `Inconclusive`.
- `EXPLORE` bị chặn vì target còn lại là private API; `paco-explore` không probe private API.

### Tester Clarification — 2026-10-02
- Scope chính: PACO Assist Chat chỉ được answer trong permission scope của current user.
- Negative case: role `Super User` truy cập được patient/chat nhưng không có medication permission; câu hỏi medication phải bị từ chối hoặc không tiết lộ medication data.
- `8261` là gõ nhầm; ticket vẫn là `PAC2-8611`.

### Next Action
1. Tester switch/login browser bằng role `Super User` đã xác nhận permission trên.
2. Tester chỉ entry point của PACO Assist Chat nếu không phải `/paco-talk`; route đó hiện trả `Page Not Found`.
3. Dùng synthetic patient có medication data phù hợp để chứng minh hệ thống không leak dữ liệu.

## Tester notes

