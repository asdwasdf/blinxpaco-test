# Requirements: PAC2-8611

**Input Revision:** 1
**Generated:** 2026-10-02
**Status:** Active

## Source Summary

Assist Chat (Patient Records Agent v4 — route `POST /api/v1/patient-records-agent/:person_id`) chỉ kiểm tra một upstream call duy nhất: `getPatientDemographics(person_id)` tới paco24. Nếu trả 2xx, agent đọc toàn bộ clinical record trực tiếp từ shared DB qua knex, chỉ scope bởi `person_id/nhs_number` — bypass paco24's per-domain endpoints. Điều này bypass 3 controls: (1) patient consent/dissent, (2) per-module sharing-agreement scoping, (3) per-domain RBAC action keys.

## Video Coverage

N/A — static code review ticket, không có video.

## Atomic Requirements

### REQ-8611-001

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Assist Chat / Patient Records Agent — consent gate
**Search Terms/Aliases:** `assist chat`, `patient records agent`, `paco-assistant`, `consent`, `opt-out`, `dissent`
**Known Location:** `POST /api/v1/patient-records-agent/:person_id`; controller `app/src/api/v1/patient-records-agent/controller.ts:81-85`
**Actor/Role:** Any authenticated user
**Inference Basis:** N/A
**Observation Context:** Static code review — paco-assistant repo
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Patient đã opt-out việc share data với org của user
- User đã authenticated với org đó

**Expected Behavior:**
- Hệ thống phải **từ chối/trả lỗi** khi user hỏi về bất kỳ domain nào của patient đã opt-out
- Không được trả lời bằng direct DB read bypass paco24

**Provenance:**
- **Source:** ticket.md, lines 13-14
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** N/A (static code review)

**Evidence:** `app/src/api/v1/patient-records-agent/controller.ts:81-85` (single gate); `app/src/core/agents/patient-records-agent.v4-windowed.ts:264,277,366-367` (direct DB reads)
**Related Tests:** TBD

---

### REQ-8611-002

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Assist Chat / Patient Records Agent — sharing agreement scoping
**Search Terms/Aliases:** `assist chat`, `sharing agreement`, `cross-org`, `sharing scope`, `validateOrgAccess`
**Known Location:** `POST /api/v1/patient-records-agent/:person_id`; direct DB reads in `patient-records-agent.v4-windowed.ts`
**Actor/Role:** Any authenticated user
**Inference Basis:** N/A
**Observation Context:** Static code review — paco-assistant repo
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Org A có sharing agreement với Org B chỉ cho medications (không có consultations)
- User thuộc Org A

**Expected Behavior:**
- Hỏi về medications → được phép (trong sharing scope)
- Hỏi về consultations → phải **từ chối/trả lỗi** (ngoài sharing scope)
- Direct DB reads hiện tại không apply sharing predicate

**Provenance:**
- **Source:** ticket.md, lines 13-14
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** N/A (static code review)

**Evidence:** `app/src/core/agents/patient-records-agent.v4-windowed.ts` (direct DB reads, no sharing predicate); paco24 `validateOrgAccess` in `apps/backend/src/routes/patient/utils.ts`
**Related Tests:** TBD

---

### REQ-8611-003

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Assist Chat / Patient Records Agent — per-domain RBAC
**Search Terms/Aliases:** `assist chat`, `RBAC`, `per-domain permission`, `action key`, `PATIENT_PROFILE_VIEW`, `CONSULTATION_VIEW`, `MEDICATIONS_VIEW`
**Known Location:** `POST /api/v1/patient-records-agent/:person_id`; `app/src/api/v1/patient-records-agent/controller.ts:81-85`
**Actor/Role:** Any authenticated user với org membership nhưng thiếu domain-specific permissions
**Inference Basis:** N/A
**Observation Context:** Static code review — paco-assistant repo
**Acceptance Criteria Status:** Missing

**Preconditions:**
- User có quyền truy cập patient và sử dụng PACO Assist Chat
- User **không có** quyền của domain được hỏi (`APPOINTMENTS_VIEW`, `MEDICATIONS_VIEW`, `CONSULTATION_VIEW`, v.v.)
- Tester/dev xác nhận role `Super User` được truy cập và sử dụng PACO Assist Chat nhưng không có medication permission

**Expected Behavior:**
- User không có permission liên quan appointments: hỏi `Does this patient have any upcoming appointments?` → phải **bị chặn/từ chối**, không trả appointment data
- User không có medicines/prescribing permission: hỏi `Does this patient have any active permissions?` hoặc `Is this patient on any NSAIDs?` → phải **bị chặn/từ chối**, không trả medication/prescribing data
- Tester xác nhận exact prompt là `Does this patient have any active permissions?`; giữ nguyên wording này trong test
- Hỏi "Any recent consultations?" → phải **từ chối/trả lỗi** nếu user thiếu consultations permission
- Permission phải áp dụng theo domain, không chặn toàn bộ chat: `Super User` vẫn dùng chat được nhưng không được hỏi/nhận medication information khi thiếu medication permission
- PACO Assist Chat chỉ được answer trong permission scope của current user
- Tất cả domains (conditions, observations, procedures, documents, consultations, tasks, measurements) phải respect per-domain action keys

**Provenance:**
- **Source:** ticket.md, lines 15-17
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** N/A (static code review)

**Evidence:** `app/src/api/v1/patient-records-agent/controller.ts:81-85` (only PATIENT_PROFILE_VIEW gate); paco24 per-domain RBAC middleware in `apps/backend/src/middleware/permissionMiddleware.ts:160-253`; tester clarification 2026-10-02 (`Super User` lacks medication permission)
**Related Tests:** TBD

---

### REQ-8611-004

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Assist Chat / Patient Records Agent — safe exception (risk stratification)
**Search Terms/Aliases:** `assist chat`, `risk stratification`, `risk-strat`, `POST /risk-strat/calculate`
**Known Location:** `app/src/core/services/RiskStratification/fetch.ts`
**Actor/Role:** Any authenticated user
**Inference Basis:** N/A
**Observation Context:** Static code review — paco-assistant repo
**Acceptance Criteria Status:** Present (baseline behavior)

**Preconditions:**
- User hỏi về risk stratification

**Expected Behavior:**
- Request routed through paco24's token-authenticated `POST /risk-strat/calculate`
- Inherits consent, sharing, và RBAC controls từ paco24

**Provenance:**
- **Source:** ticket.md, lines 22-23
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** N/A (static code review)

**Evidence:** `app/src/core/services/RiskStratification/fetch.ts`; `apps/backend/src/routes/risk-strat/index.ts:60,88,356,382,423`
**Related Tests:** N/A (baseline/correct behavior)

---

## Ambiguities and Conflicts

| Item | Conflict | Resolution |
|------|----------|------------|
| AC status | Ticket không có acceptance criteria chi tiết | Mark `Missing`; dùng expected behavior từ ticket description |
| Testing approach | Static code review, chưa validated trên running system | Ghi rõ `Inconclusive` cho any product behavior claim |
| Test data | Cần test data với various consent/sharing/RBAC configurations | Open Question: cần tester guidance |

## Open Questions

| Question | Impact | Priority |
|----------|--------|----------|
| Làm sao tạo test data với patient opt-out để verify Gap #1? | Blocked TEST_DESIGN | High |
| Làm sao configure cross-org sharing agreement để verify Gap #2? | Blocked TEST_DESIGN | High |
| Cần account/session role `Super User` trong browser để chạy negative medication case; tester đã xác nhận permission matrix | Blocked MANUAL_EXECUTE nếu chưa switch role | High |
| Có API/token authentication paths cần review không? (`auth.middleware.ts`, `userId: 'api-token'`) | Security concern | Medium |
| PAC2-8611 có environment nào để test không? (dev/staging?) | Blocked LOCATE | High |

## Tester notes

