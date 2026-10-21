# Requirements: PAC2-3934

**Input Revision:** 1
**Generated:** 2026-10-18T02:30:00Z
**Status:** Active

## Source Summary

PACO Connect — cho phép file health form vào record bệnh nhân khi logged-in org (A) và patient org (B) khác nhau, miễn user có access/permission hợp lệ; không bắt buộc health form share cho cả hai org. Trước đó: submit form fail nếu form không share cho cả A và B, ngăn cản filing xuyên federation.

Scope: backend (`nhs-supergrid-be#2752`) và frontend (`paco-connect-fe`); theo Mustafa review, AC4 hiện bị khử bằng logic tautology.

## Video Coverage

**Timeline:** N/A — 14 attachments chưa download (chưa có pipeline). Muốn analyze frame, dispatch subagent `model: sonnet` qua `paco-video-flow`.
**Contact Sheet:** N/A

| Behavior/frame | → Requirement | → Open Question |
|---|---|---|
| `3934 AC1 - Fail.mp4` (AC1 reproducer) | REQ-1 | — |
| `3934 - Fail.mp4` (March 17) | — | OQ-3 (gần AC1 — fail) |
| `image-20260312-181725.png`, `image-20260312-151741.png` | — | OQ-1 (screenshot) |
| `20260515-1411-29.5707598.mp4` (session blocker fix) | — | OQ-1 (darcio, cross-org prep) |

## Atomic Requirements

### REQ-3934-001 — Filing cross-org on user action

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** PACO Connect — health-form cross-org filing
**Search Terms/Aliases:** `cross-org filing`, `file health form`, `consultation`, `PACO Connect`, `organisation A / organisation B`
**Known Location:** `https://pac2-3934.dev.blinxpaco-np.com/paco-connect/` (per Multiple Test URL)
**Actor/Role:** PACO Connect user logged into one organisation, completing consultation for patient from another org (e.g., cross-PCN clinician)
**Acceptance Criteria Status:** Present

**Preconditions:**
- Đăng nhập PACO Connect dưới `Organisation A`.
- Patient đang xem/chọn thuộc `Organisation B`.
- Có health form thuộc `Organisation A` (có thể không share sang B).
- User có quyền access + permission hợp lệ giữa A và B (per AC4).

**Expected Behavior:**
Health form sau khi complete + submit, phải file thành công vào record của bệnh nhân ở `Organisation B`. Form file dựa trên patient organisation chứ không phải requesting-org path hiện đang fall back vào form/response org.

**Provenance:**
- **Source:** `ticket/PAC2-3934-.../ticket.md` Acceptance Criteria #1
- **Input Revision:** 1
- **First Recorded:** 2026-10-18T02:30:00Z
- **Last Verified:** 2026-10-18T02:30:00Z

**Evidence:** Ticket Description, AC1, code comment từ Mustafa về `nhs-supergrid-be#2752` (PR backend)
**Related Tests:** REQ-3934-002 (same path, edge); video `3934 AC1 - Fail.mp4` (pre-fix repro)
**Notes:** Không yêu cầu form share cho cả hai org. PR nhs-supergrid-be#2752 còn `Requesting changes`; chưa merge.

---

### REQ-3934-002 — Filing when form owned by requesting org only

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Cross-org form ownership semantics
**Search Terms/Aliases:** `form ownership`, `shared organisations`, `fallback to patient org`
**Known Location:** Same as REQ-1
**Actor/Role:** PACO Connect user (cross-org)
**Acceptance Criteria Status:** Present

**Preconditions:**
- Health form chỉ tồn tại dưới `Organisation A`.
- Form KHÔNG được share với `Organisation B`.
- User đang submit form cho bệnh nhân thuộc `Organisation B`.

**Expected Behavior:**
Hệ thống vẫn cho phép filing — reference theo patient organisation thay vì reject vì form ownership. Đây chính là điểm PR `nhs-supergrid-be#2752` đang fix: bỏ fall back sang form/response org khi patient row missing.

**Provenance:**
- **Source:** ticket.md AC2
- **Input Revision:** 1
- **First Recorded:** 2026-10-18T02:30:00Z
- **Last Verified:** 2026-10-18T02:30:00Z

**Evidence:** AC2, Mustafa review ("Do not fall back to the form/response org…")
**Related Tests:** REQ-1, code test "missing-patient path" (yêu cầu của Mustafa)
**Notes:** Mustafa yêu cầu thêm test cho missing-patient path.

---

### REQ-3934-003 — Same-org filing stays unchanged

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Regression guard — same-org filing
**Search Terms/Aliases:** `regression same-org`, `unchanged behavior`
**Known Location:** Same as REQ-1
**Actor/Role:** PACO user (same org)
**Acceptance Criteria Status:** Present

**Preconditions:**
- User submit health form cho bệnh nhân đúng org của mình (logged-in org ≡ patient org).

**Expected Behavior:**
Behavior không đổi; form file thành công như cũ. Đây là regression baseline.

**Provenance:**
- **Source:** ticket.md AC3
- **Input Revision:** 1
- **First Recorded:** 2026-10-18T02:30:00Z
- **Last Verified:** 2026-10-18T02:30:00Z

**Evidence:** AC3
**Related Tests:** REQ-1, REQ-2 (cross-check that same-org path is not broken)
**Notes:** Test phải chạy được trên cả instance single-org để sanity-check baseline trước khi thử cross-org.

---

### REQ-3934-004 — Error message distinguishes permission failure from org mismatch

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Cross-org auth error UX
**Search Terms/Aliases:** `error message`, `permission denied`, `cross-org authorisation`
**Known Location:** Same as REQ-1
**Actor/Role:** PACO Connect user
**Acceptance Criteria Status:** Present

**Preconditions:**
- Access không hợp lệ hoặc bị revoke giữa hai org (user không còn quyền).

**Expected Behavior:**
Hệ thống hiển thị error message rõ ràng, phân biệt "fail do permission/connection" với "fail do organisational mismatch". Message phải actionable cho tester/end user (không phải lỗi generic).

**Provenance:**
- **Source:** ticket.md AC4
- **Input Revision:** 1
- **First Recorded:** 2026-10-18T02:30:00Z
- **Last Verified:** 2026-10-18T02:30:00Z

**Evidence:** AC4, Mustafa: "The cross-org authorisation check is a tautology (`patientOrganisationGuid === patientOrganisationGuid`) so AC4 never runs" → bug ngăn AC4 chạy đã được raise; cần xác minh sau khi fix tautology.
**Related Tests:** REQ-1 (AC4 phụ thuộc logic ở REQ-1), test `denied user` (Mustafa requirement)
**Notes:** Đây là điểm Mustafa flag là đang bị nullify trong PR backend hiện tại.

---

## Ambiguities and Conflicts

- Mustafa review đặt ba blocker requirements cho PR `nhs-supergrid-be#2752` (full-PK lookup, no fall-back, fix tautology). Không rõ PR hiện đang ở trạng thái nào sau "Requesting changes" — chờ update từ author. Comments gốc không có reply trong snapshot.
- AC4 wording ("appropriate error message") mơ hồ về UX, nhưng ticket nói rõ "Will this ticket have any UX or UI changes? No" → error message có thể là mã lỗi/notification internal, không phải redesign UI.

## Open Questions

- OQ-1: 14 attachments metadata-only — chưa download. Để xác minh repro AC1 hiện đã fix hay chưa, cần xem `3934 AC1 - Fail.mp4` + so với current behavior; dispatch subagent `model: sonnet` nếu user yêu cầu.
- OQ-2: Trạng thái hiện tại của `nhs-supergrid-be#2752` sau "Requesting changes" — chưa thấy activity cập nhật trong snapshot. Có thể PR đã re-commit hoặc vẫn pending.
- OQ-3: Screenshot `image-20260312-181725.png` / `image-20260312-151741.png` (Mar 12) là state gì — pre-fix hay diagram?
- OQ-4: Các PR khác (`nhs-supergrid-fe#4885`, `paco-connect-fe#2520`) đã đóng chưa?
- OQ-5: Nhiều `Show more comments` chưa expand — có thể có comment ghi rõ test env requirement (login/password cho cross-org test user, 2 org demo accounts).
- OQ-6: Host `https://pac2-3934.dev.blinxpaco-np.com/` chưa có trong `allowedHosts`/`externalDevHosts` của `paco.config.yaml` — cần user (Fiona Nguyen) confirm host này đã được duyệt chưa để bật live replay.

---

## Tester notes

[Tester protected. Host chưa whitelist → replay live blocked. Mọi manual verification tạm dừng ở artifacts + code review cho đến khi host được add vào `paco.config.yaml`.]
