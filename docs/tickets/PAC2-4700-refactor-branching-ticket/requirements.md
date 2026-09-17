# Requirements: PAC2-4700

**Input Revision:** 1
**Generated:** 2026-09-17T18:45:00+07:00
**Status:** Active

## Source Summary

Ticket `PAC2-4700` là branching ticket từ `4683`, dùng để giữ feature branch `pac2-4700-qs-only` và kiểm UI refactor/consistency. Mục tiêu: chuẩn hóa core UI (Storybook wrapper gần PrimeReact), giảm global-style pollution; QA tập trung regression lớn trên `inputs`, `dropdowns`, `checkboxes`, forms, email templates, attachments, booking-link controls.

Scope QA hiện tại (user): 3 app trên feature branch — PACO OS/24, PACO Connect, GP Supergrid. `Ticket Outcome` placeholder. Acceptance Criteria rộng (consistency + no major regression + document intentional differences + approve before merge). QA notes liệt kê nhiều inconsistency cross-env kèm IMG-01..04 / VID-01..04; checklist còn `IMG-05` thiếu file.

## Atomic Requirements

### REQ-PAC2-4700-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Cross-app UI consistency — core controls
**Search Terms/Aliases:** `dropdown`, `checkbox`, `input`, form, `email template`, attachments, `booking link`, Storybook, PrimeReact
**Known Location:** Unknown (feature branch URLs đã có; exact screen TBD at LOCATE)
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Present (broad)

**Preconditions:**
- User mở feature branch `pac2-4700-qs-only` trên OS/24, Connect, GP.
- Feature liên quan QS / campaign / patient profile / booking links nằm trong phạm vi ticket.

**Expected Behavior:**
Core UI elements (`inputs`, `dropdowns`, `checkboxes`, forms) behave và render consistent across OS, GP, Connect (và PC24 nếu có). Không có major visual hoặc functional regression.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:24-29`, `:31-35`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** Chưa có (ANALYZE only)
**Related Tests:** Chưa thiết kế
**Notes:** AC không định nghĩa “major regression” cụ thể; PC24 trong AC nhưng scope user hiện tại là 3 app (OS/Connect/GP).

---

### REQ-PAC2-4700-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Email templates / attachments / booking-link controls — no major regression
**Search Terms/Aliases:** `email template`, attachments, `booking link`, `No available options`, scheduler-link popup
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Present (broad)

**Preconditions:**
- Màn hình có email template selection, attachments panel, booking-link controls trên từng app.

**Expected Behavior:**
Email templates, attachments, booking-link controls không có major visual/functional regression so với expected consistent behavior.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:26-27`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** Chưa có
**Related Tests:** Chưa thiết kế
**Notes:** QA notes cho thấy behavior hiện tại chưa consistent; expected “đúng” chưa BA/PO confirm.

---

### REQ-PAC2-4700-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Intentional environment differences — documentation
**Search Terms/Aliases:** intentional differences, OS dataset, default template
**Known Location:** N/A (documentation gate)
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Present

**Preconditions:**
- Có khác biệt giữa environments được coi là intentional.

**Expected Behavior:**
Mọi intentional difference giữa OS / GP / Connect / PC24 phải được document. Không document → không chấp nhận như “pass by exception” im lặng.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:28`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** Chưa có
**Related Tests:** Chưa thiết kế
**Notes:** Nhiều QA findings hiện là Open Question về intentional vs bug.

---

### REQ-PAC2-4700-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Merge gate — feature branch review
**Search Terms/Aliases:** feature branch, `pac2-4700-qs-only`, merge approval
**Known Location:** N/A (process)
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Present

**Preconditions:**
- Feature branch sẵn sàng merge.

**Expected Behavior:**
Feature branches reviewed và approved trước khi merge.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:29`, `:37-44`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** Chưa có
**Related Tests:** Không automate process gate
**Notes:** ETA approval phụ thuộc Michael Ramella (ticket narrative).

---

### REQ-PAC2-4700-005

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Email template selection — cross-app entry consistency
**Search Terms/Aliases:** email template, email dropdown, `michael@blinxsolutions.com`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** QA notes: “All three areas now open the email template first” — suy ra expected = cả 3 app mở email template selection trước khi gửi/compose. AC không nêu rõ.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- User vào luồng chọn email template trên OS, Connect, GP.

**Expected Behavior:**
Cả 3 app mở email template selection trước (cùng thứ tự UX).

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:51-53`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** IMG-01 (OS email dropdown); VID chưa transcribe
**Related Tests:** Chưa thiết kế
**Notes:** Cần confirm “open first” là AC hay chỉ observed improvement.

---

### REQ-PAC2-4700-006

**Classification:** Inferred
**Lifecycle:** Disputed
**Feature/Scope:** Email address / dataset parity OS vs GP/Connect
**Search Terms/Aliases:** email dropdown, email address list, dataset
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** QA: OS list khác email (`michael@blinxsolutions.com` trên IMG-01) so với 2 env kia; ticket hỏi “Is OS using a different data set?”. Không thể chọn expected (same dataset vs intentional different) từ AC.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Mở email template/address dropdown trên OS, GP, Connect với cùng test context nếu có thể.

**Expected Behavior:**
[Disputed] Hoặc (A) OS dùng cùng dataset → list address parity; hoặc (B) OS intentional different dataset → document theo REQ-003. Chưa chọn.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:53-58`; IMG-01
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** IMG-01 — OS email dropdown show `michael@blinxsolutions.com`
**Related Tests:** Chưa thiết kế
**Notes:** Open Question #1; không automate assertion từ Inferred/Disputed.

---

### REQ-PAC2-4700-007

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Campaign sorting options — parity
**Search Terms/Aliases:** sorting, `By date (descending)`, `By date (ascending)`, `By message type`, `A–Z`, `Z–A`, campaign screen
**Known Location:** Unknown (campaign screen)
**Actor/Role:** Unknown
**Inference Basis:** QA: sorting options “now match” nhưng GP có grey-box theme khác; GP/OS có extra `Z–A` không có ở Connect. Expected chuẩn hóa options + theme chưa AC confirm.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Mở campaign sorting dropdown trên OS, Connect, GP.

**Expected Behavior:**
Sorting option set và visual theme consistent across apps; nếu `Z–A` intentional chỉ một số app thì document (REQ-003).

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:59-63`, `:103`, `:115`, `:128`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** IMG-02 — GP sorting dropdown grey highlight; options By date desc/asc, By message type, A–Z, Z–A
**Related Tests:** Chưa thiết kế
**Notes:** Disputed giữa “match” vs “GP has extra Z–A”.

---

### REQ-PAC2-4700-008

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Dropdown persistence behavior
**Search Terms/Aliases:** dropdown persistence, dropdown boxes persist
**Known Location:** Unknown (OS vs Connect/GP)
**Actor/Role:** Unknown
**Inference Basis:** QA: OS dropdown boxes persist khác Connect/GP (VID-01). Expected = same close/open persistence model across apps [cần confirm].
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Mở/đóng dropdown tương tự trên OS, Connect, GP.

**Expected Behavior:**
Dropdown open/close/persistence behavior consistent; OS không “persist boxes” lệch so với Connect/GP trừ khi intentional + documented.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:65-69`, `:129`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** VID-01 (00:19) — chưa transcribe frame-by-frame
**Related Tests:** Chưa thiết kế
**Notes:** Cần LOCATE + observe để định nghĩa “persist” observable.

---

### REQ-PAC2-4700-009

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Attachments / documents availability & empty state
**Search Terms/Aliases:** Attachments, `No available options`, documents, permaloading
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** QA: attachments hiện GP/Connect, OS empty `No available options` (IMG-03); GP documents “permaloading”; OS báo no options. Expected empty/loading state + API parity chưa confirm.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Patient/context có (hoặc không có) attachments/documents; so sánh cùng role nếu được.

**Expected Behavior:**
Attachments/documents availability và empty/loading states consistent; empty state rõ (`No available options` vs infinite loading). Nếu OS empty do data khác → document (REQ-003 / OQ dataset).

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:71-75`, `:104`, `:117`, `:130`, `:141`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** IMG-03 — OS Attachments `No available options`
**Related Tests:** Chưa thiết kế
**Notes:** Không assert Pass chỉ từ Inferred; cần BA + live observe.

---

### REQ-PAC2-4700-010

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** EMIS slot-type mapping display
**Search Terms/Aliases:** EMIS, slot type, `Virtual Mental Health`, appointment slots, Booking Links
**Known Location:** Unknown (slot-type / booking links UI)
**Actor/Role:** Unknown
**Inference Basis:** QA: Connect show mapped slot; OS/GP empty; text centred đúng. Expected = mapping hiện trên mọi env [cần confirm] hoặc document intentional.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Config/mapping EMIS slot type tồn tại cho test campaign/context.

**Expected Behavior:**
Mapped EMIS slot type hiển thị đúng trên OS, GP, Connect; text alignment centred consistent (QA ghi centred là correct).

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:77-81`, `:131`, `:142`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** IMG-04 — OS/GP empty slot fields vs Connect mapped “Virtual Mental Health…”
**Related Tests:** Chưa thiết kế
**Notes:** Có thể data/integration issue không chỉ UI refactor.

---

### REQ-PAC2-4700-011

**Classification:** Inferred
**Lifecycle:** Disputed
**Feature/Scope:** Default campaign template (SMS vs email) + patient email visibility
**Search Terms/Aliases:** SMS template, email template, patient email, default campaign template
**Known Location:** Unknown (campaign compose)
**Actor/Role:** Unknown
**Inference Basis:** Key finding: Connect/GP default SMS, no patient email; OS default email + show patient email. Expected default chưa AC; recommended QA focus confirm expected.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Tạo/mở campaign compose trên 3 app với patient có/không có email.

**Expected Behavior:**
[Disputed] Default template và patient-email visibility phải khớp expected product rule (chưa xác nhận). Không tự chọn SMS-default hay email-default.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:91-92`, `:102`, `:114`, `:127`, `:139`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** VID-02..04 (chưa transcribe)
**Related Tests:** Chưa thiết kế
**Notes:** Open Question #2 — blocker cho expected-result automation.

---

### REQ-PAC2-4700-012

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Booking Links page — text alignment
**Search Terms/Aliases:** Booking Links, centred, centered text
**Known Location:** Unknown (`Booking Links` page)
**Actor/Role:** Unknown
**Inference Basis:** QA: OS/GP words centred; Connect not. QA ghi centred là correct (slot text) và recommend standardise Booking Links alignment.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Mở `Booking Links` page trên 3 app.

**Expected Behavior:**
Booking Links text alignment consistent (centred) across OS, GP, Connect.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:95`, `:108`, `:118`, `:133`, `:144`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** VID-02..04
**Related Tests:** Chưa thiết kế
**Notes:** —

---

### REQ-PAC2-4700-013

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Scheduler-link popup presence
**Search Terms/Aliases:** scheduler-link popup, scheduler link, booking link popup
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** QA: popup missing trên Connect dù link present; cũng absent OS/GP. Ticket không nói popup phải có; có thể related PAC2-5776 domain. Expected cần confirm.
**Acceptance Criteria Status:** Ambiguous / Missing detail

**Preconditions:**
- Booking/scheduler link present trên campaign/UI.

**Expected Behavior:**
[Inferred/Open] Nếu product expect scheduler-link popup khi link present → popup phải xuất hiện và tương tác được trên mọi app. Nếu không expect → document absence.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:96`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** VID-02
**Related Tests:** Chưa thiết kế
**Notes:** Có thể ngoài “consistency-only” pass; ghi Open Question.

---

### REQ-PAC2-4700-014

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Patient-profile side panel cards + Test Results scroll
**Search Terms/Aliases:** patient profile, side panel, documents cards, Test Results, scroll area
**Known Location:** Unknown (patient-profile side panel)
**Actor/Role:** Unknown
**Inference Basis:** QA: OS cards look different; Test Results thiếu individual scroll area so với GP/Connect. Recommend standardise.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Mở patient-profile side panel / Test Results trên 3 app.

**Expected Behavior:**
Patient-profile cards và Test Results scrolling behavior consistent across apps, trừ intentional documented differences.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:116-119`, `:134`, `:144`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** VID-04
**Related Tests:** Chưa thiết kế
**Notes:** Product workflow `patient-profile` chỉ gợi search terms; không tạo Confirmed từ đó.

---

### REQ-PAC2-4700-015

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Performance baselines (Health Forms, saved campaigns, EMIS slots)
**Search Terms/Aliases:** Health Forms, newly saved campaigns, EMIS slot loading, performance
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** QA liệt kê perf khác biệt đáng kể; recommend compare baselines. AC không định SLA.
**Acceptance Criteria Status:** Missing (no SLA)

**Preconditions:**
- Cùng thao tác load Health Forms / saved campaigns / EMIS slots trên 3 app.

**Expected Behavior:**
[Inferred] Không có regression perf “major” so với peer apps hoặc documented baseline. Không có numeric SLA trong ticket → chỉ qualitative / comparative cho đến khi BA set threshold.

**Provenance:**
- **Source:** `ticket/PAC2-4700-refactor-branching-ticket/ticket.md:94`, `:105-107`, `:118`, `:132`, `:143`
- **Input Revision:** 1
- **First Recorded:** 2026-09-17
- **Last Verified:** 2026-09-17

**Evidence:** VID-02..04
**Related Tests:** Chưa thiết kế
**Notes:** Không automate hard assertion không có SLA.

---

## Ambiguities and Conflicts

- `Ticket Outcome` placeholder (`ticket.md:20-22`) — outcome mong muốn chưa có.
- AC rộng/refactor-style; thiếu Pass/Fail cụ thể cho từng control.
- AC nhắc OS, GP, Connect, **PC24**; user scope hiện tại chỉ 3 app (OS/Connect/GP). PC24 out-of-scope session này trừ khi mở rộng.
- Rocket Bar / PACO Talk: không có feature-branch URL (`ticket.md:44`).
- **Disputed:** OS email list / dataset khác GP/Connect (REQ-006) — intentional vs bug.
- **Disputed:** Default SMS (Connect/GP) vs email (OS) + patient email visibility (REQ-011).
- Sorting: “options now match” vs GP/OS extra `Z–A` và GP grey theme (REQ-007).
- Attachments empty OS vs present GP/Connect — data vs UI (REQ-009).
- EMIS mapping chỉ Connect — data/integration vs UI (REQ-010).
- Scheduler-link popup absent mọi app — expected unclear (REQ-013).
- Media: `IMG-05` listed nhưng file thiếu; VID-01..04 chưa transcribe → OCR/video uncertainty.
- QA pass “ignore unrelated bugs” — ranh giới related/unrelated chưa formal.

## Open Questions

1. OS intentional dùng different dataset so với GP/Connect không? (impact REQ-006/009)
2. Expected default campaign template: SMS hay email? Patient email có phải luôn hiện khi có data?
3. `Z–A` sorting bắt buộc trên mọi app hay chỉ một subset? GP grey-box theme chấp nhận?
4. Expected dropdown persistence model (OS vs others) là gì?
5. Attachments/documents: expected API response + empty vs loading UX chuẩn?
6. EMIS slot mapping phải hiện trên OS/GP như Connect không?
7. Scheduler-link popup có thuộc PAC2-4700 acceptance không?
8. Booking Links / patient-profile cards / Test Results scroll — mức “consistent enough” cho Pass?
9. Performance Pass criteria (threshold ms / subjective)?
10. Role/permission nào dùng LOCATE/EXPLORE trên 3 app?
11. PC24 / Rocket Bar / PACO Talk có trong regression scope session này không?
12. `IMG-05` feature-branch links evidence ở đâu? Có cần bổ sung source không?

---

## Tester notes

[Protected area]
