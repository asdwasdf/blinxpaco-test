# Requirements: PAC2-7384

**Input Revision:** 1
**Generated:** 2026-10-13T15:55:00Z
**Status:** Active

## Source Summary

PAC2-7384 "Health form patient inbox - scheduler enhancement" — bộ 3 enhancement/fix do Gareth đặt ra trên luồng scheduler + health form. Không có Acceptance Criteria riêng trong `ticket.md`; sau trao đổi với tester ngày 2026-10-13, 3 bullet dưới đây được dùng làm AC (mỗi bullet = 1 requirement ID). Scope ghi nhận span 3 surface: `patient-facing-scheduler-booking` (host `dev.blinxscheduler-np.com/feature-branch/pac2-7384/`), `paco-connect-inbox` (host Paco dev), và `mobile-responsive-cross-surface` (resize/UA mobile áp dụng cho mọi surface render submitted HF).

Ba bullet từ `ticket.md`:
1. **Expandable HF for detail view** — HF hiện tại trên scheduler có chế độ xem tóm tắt; cần cho phép expand/collapse để xem toàn bộ HF chi tiết.
2. **Remove confusing HF views; prefer conversational view of HF alongside chat** — hiện có nhiều cách xem HF gây rối; ưu tiên hiển thị HF theo kiểu conversational đặt cạnh/đan xen với chat.
3. **Bug: mobile view of submitted HF shows thick bar instead of chat bubble** — view submitted HF trên mobile (resize / mobile UA) đang render thành "thick bar" thay vì chat bubble như mong đợi.

**Source SHA-256:** `0d33b40e549e446b3e5df28bfe48ea6fcd9dcf9b202dc1c3cf4b5a843d13a7d5` (computed 2026-10-13).

## Video Coverage

**Timeline:** N/A (ticket không có video đính kèm)
**Contact Sheet:** N/A

Không có video source; requirements suy ra trực tiếp từ text description. Mọi hành vi UI/HF view mode hiện hữu cần `EXPLORE` phase ghi nhận bằng `Observed` evidence.

## Atomic Requirements

### REQ-PAC2-7384-001 — Expandable HF for detail view (scheduler)

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient-facing Scheduler — HF (Health Form) display
**Search Terms/Aliases:** `expand`, `expandable`, `collapse`, `HF`, `health form`, `detail view`, `read more`, `view more`, `show more`, `view detail`, `view full`
**Known Location:** Scheduler feature branch `dev.blinxscheduler-np.com/feature-branch/pac2-7384/`; exact route Unknown (chưa LOCATE)
**Actor/Role:** Patient (không đăng nhập PACO) — context theo `patient-facing-scheduler.md` `[Observed]`
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present (3-bullet AC từ ticket description, tester xác nhận 2026-10-13)

**Preconditions:**
- Patient có scheduler link hợp lệ (tokenized) cho phiên.
- HF đã được attach/sent trước đó trong luồng (shared campaign → scheduler link — pattern PAC2-6982).
- Bệnh nhân đang ở view có HF liên quan (chat / conversational view).

**Expected Behavior:**
- HF render ở chế độ summary mặc định (không full content).
- Có control rõ ràng (button/link/aria control) để expand/collapse HF nhìn thấy toàn bộ nội dung form.
- Sau expand, control chuyển sang collapse (hoặc reciprocal) để quay lại summary.
- State expanded/collapsed không phá vỡ luồng chat xung quanh (nếu HF ở conversational view — xem REQ-002).
- Mỗi lượt expand/collapse là deterministic và idempotent; không gọi network ngoài fetch detail HF nếu cần (lazy-load được chấp nhận nếu không làm UI nhảy).

**Provenance:**
- **Source:** `ticket/PAC2-7384-.../ticket.md` description bullet 1
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13 (from text only — UI verification chưa chạy)

**Evidence:** None (UI chưa khám phá)
**Related Tests:** TBD (test design phase)
**Notes:**
- "summary → full detail" expand có thể đã tồn tại; AC dùng để xác nhận behavior còn đúng sau refactor.
- Cần xác minh loại control (button vs. inline click region) và a11y (`aria-expanded`).
- Không rõ có bao nhiêu view mode HF hiện tại; liên quan REQ-002.

---

### REQ-PAC2-7384-002 — Remove confusing HF views; prefer conversational HF alongside chat

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient-facing Scheduler + (cân nhắc) Paco Connect inbox
**Search Terms/Aliases:** `conversational`, `conversation view`, `HF alongside chat`, `HF in chat`, `inline HF`, `remove view`, `legacy view`, `HF view mode`, `mode`
**Known Location:**
- Scheduler: `dev.blinxscheduler-np.com/feature-branch/pac2-7384/` (Unknown exact route)
- Connect inbox: `/health-forms/responses/` (theo `health-forms.md` workflow `[Observed]`) — *chỉ áp dụng nếu HF view mode trùng pattern*
**Actor/Role:** Patient (scheduler) / `Super Admin GB` hoặc staff (Connect inbox review) — cần confirm trong EXPLORE
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present

**Preconditions:**
- Đã xác định danh sách view mode HF hiện đang hiển thị (qua EXPLORE).
- Có baseline screenshot từng view mode để đối chiếu removed/kept.

**Expected Behavior:**
- Scheduler chỉ render HF theo kiểu conversational (HF hiển thị như một phần tử/turn trong chat thread, không phải panel riêng tách khỏi chat).
- Mọi view mode HF khác trên scheduler (vd. sidebar, modal, tab) phải bị loại bỏ / ẩn đi / deprecated; user không còn đường vào từ UI production.
- Nếu áp dụng cho Connect inbox: HF response review vẫn cho phép `View Form` read-only (pattern PAC2-4399); "confusing view" cụ thể ở đây cần xác định trong EXPLORE.
- Không phá vỡ các entry point đang hoạt động (`Inbox`, `Designer`, `Designer V2` per `health-forms.md`).

**Provenance:**
- **Source:** `ticket/PAC2-7384-.../ticket.md` description bullet 2
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13 (text only)

**Evidence:** None
**Related Tests:** TBD
**Notes:**
- Ticket mô tả "remove confusing HF views" — số lượng view và tên gọi cần EXPLORE xác nhận trước khi viết case.
- Có nguy cơ overlap với REQ-001 (expandable HF trong conversational view).
- "Conversational view" có thể là 1 surface mới; cần screenshot baseline.

---

### REQ-PAC2-7384-003 — Mobile view: submitted HF renders as chat bubble, not thick bar

**Classification:** Confirmed (defect, expected behavior theo ticket)
**Lifecycle:** Active
**Feature/Scope:** Mobile responsive — any surface render submitted HF (scheduler feature branch primary; Connect inbox secondary)
**Search Terms/Aliases:** `mobile`, `submitted HF`, `submitted health form`, `chat bubble`, `bubble`, `thick bar`, `bar`, `responsive`, `viewport`, `@media (max-width:)`
**Known Location:**
- Primary: `dev.blinxscheduler-np.com/feature-branch/pac2-7384/` — patient view submitted HF, mobile viewport
- Secondary: Paco Connect Inbox, mobile view (nếu staff mobile dùng inbox để review submitted HF)
**Actor/Role:** Patient (scheduler); staff mobile (nếu áp dụng Connect)
**Inference Basis:** N/A (defect rõ ràng)
**Observation Context:** N/A (defect chưa reproduce)
**Acceptance Criteria Status:** Present

**Preconditions:**
- HF đã submitted bởi patient.
- Browser/viewport ở mobile breakpoint (cần xác định breakpoint cụ thể trong EXPLORE — vd. iPhone SE 375×667, Pixel 360×640).
- HF đang hiển thị ở view conversational (REQ-002) hoặc view tương đương patient-facing.

**Expected Behavior:**
- Submitted HF ở mobile viewport phải render thành chat bubble (hình dạng/phong cách tương đương một turn chat trong conversational view).
- KHÔNG render thành "thick bar" (vạch ngang dày / banner / strip) — đây là defect hiện tại cần fix.
- Visual style của bubble phải nhất quán với bubble chat xung quanh (border-radius, padding, max-width, background tint).
- Tap target (nếu có — vd. expand per REQ-001) đạt tối thiểu 44×44 px (a11y baseline).
- Orientation portrait + landscape đều render đúng.

**Provenance:**
- **Source:** `ticket/PAC2-7384-.../ticket.md` description bullet 3
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** None (defect not yet reproduced — cần `EXPLORE` chạy mobile viewport)
**Related Tests:** TBD
**Notes:**
- Bug xác định: render path của submitted HF ở mobile đang sinh thick bar thay vì bubble. Nguyên nhân có thể là: (a) CSS class bị nhầm cho state submitted, (b) container không áp dụng bubble class khi viewport nhỏ, (c) media query thiếu. Cần EXPLORE + manual reproduce để chốt root cause.
- Cần xác định breakpoint và exact CSS/component path trong EXPLORE để viết automation ổn định.

---

## Ambiguities and Conflicts

- **A1 — REQ-002 surface scope**: ticket ghi "remove confusing HF views (prefer conversational view of HF along with chat)" mà không nói rõ scheduler-only hay cả Connect. Tester 2026-10-13 xác nhận cả 3 surface; Connect inbox pattern (PAC2-4399) hiện KHÔNG mô tả "conversational view" — chỉ có `View Form` read-only dialog. Conflict tiềm ẩn: nếu "conversational" chỉ có ở scheduler, REQ-002 ở Connect có thể không có baseline để remove. Cần EXPLORE xác nhận cụ thể view mode nào "confusing" trên Connect.
- **A2 — "Thick bar" semantic**: ticket không mô tả pixel/visual. Có thể là 1 element DOM cụ thể (vd. `<hr>` styled, hoặc block element full-width) hoặc chỉ là miêu tả cảm tính. Cần capture screenshot "current (broken)" state trong EXPLORE để khóa expected vs actual.
- **A3 — REQ-001 "expandable" baseline**: chưa biết trạng thái hiện tại đã có expand hay chưa; nếu đã có rồi, AC chỉ là "vẫn hoạt động sau refactor" thay vì "thêm mới". EXPLORE sẽ quyết định test case là Pass-guard hay Build-new.

## Open Questions

- **OQ1**: Scheduler feature branch `dev.blinxscheduler-np.com/feature-branch/pac2-7384/` — patient mở được không, cần token, hay open access? Workflow `patient-facing-scheduler.md` ghi "thiếu token → `Link Error`". Nếu cần token, cần tester cung cấp recipient/token an toàn (`fiona.nguyen@blinxsolutions.com` cho email per memory `paco-qa-safe-email-recipient.md`).
- **OQ2**: HF hiện đang có những view mode nào trên scheduler feature branch và Connect inbox? Cần EXPLORE enumerate trước khi viết case "remove".
- **OQ3**: Mobile breakpoint cụ thể nào áp dụng (px width)? Có CSS variable/mixin/shared breakpoint không?
- **OQ4**: "Conversational view" là view mới build trong ticket này hay đã có sẵn ở build trước? Nếu mới, cần spec/AC chi tiết từ BA (Gareth).
- **OQ5**: Submitted HF trên mobile hiện render thành "thick bar" ở state nào (initial load? sau submit? sau expand? sau navigate back)? Có thể là conditional defect theo state.
- **OQ6**: HF data test (form structure, response payload) cần synthetic từ Connect (`QA-AUTO` prefix per CLAUDE.md). Tester confirm có form sẵn để test hay cần tạo mới?
- **OQ7**: "Remove" view mode = hidden/deprecated/hard delete? Có cần giữ lại cho backward-compat không?

## Tester notes
