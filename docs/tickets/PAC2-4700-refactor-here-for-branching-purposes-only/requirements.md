# Requirements: PAC2-4700

**Input Revision:** 1
**Generated:** 2026-09-23T19:44:05+07:00
**Status:** Active

## Source Summary

Ticket `PAC2-4700` là nhánh refactor tách sạch từ `PAC2-4683`. Mục đích được mô tả là dọn global CSS, bọc PrimeReact thành Storybook `Bx*` components, và đồng bộ styling `Quick Send` / form controls trên bốn consumer: `Connect`, `GP` (Supergrid), `PC24`/`OS`, `Rocketbar`. Intent **không** phải sửa UX, visual design, mobile, hay layout; QA được yêu cầu chỉ bắt **major visual or functional breakages** so với môi trường `PAC2-4683`, không góp ý cải tiến.

`Acceptance criteria` Jira: `Not provided`. Hướng dẫn QA chính nằm trong comment Matthew Ruddick 2026-02-12 và Katie Sparrow 2026-04-27. Comment Beth Green 2026-09-11 và 2026-09-17 cộng video/PNG là observation hiện tại trên feature branch `pac2-4700-qs-only`, **không** tự thành expected result.

## Video Coverage

**Timelines:**
- `docs/tickets/PAC2-4700-refactor-here-for-branching-purposes-only/video/126598-connect-rocketbar/timeline.md` — Connect, ~300s, 155 frames
- `docs/tickets/PAC2-4700-refactor-here-for-branching-purposes-only/video/126599-gp-rocketbar/timeline.md` — GP, ~291s, 150 frames
- `docs/tickets/PAC2-4700-refactor-here-for-branching-purposes-only/video/126597-os-rocketbar/timeline.md` — OS, ~193s, 106 frames
- `docs/tickets/PAC2-4700-refactor-here-for-branching-purposes-only/video/127147-screen-sharing/timeline.md` — OS dropdown overlay, ~19s, 10 frames
- `docs/tickets/PAC2-4700-refactor-here-for-branching-purposes-only/video/101185-screen-recording/timeline.md` — Storybook consistency recording, ~76s, reviewed
- `docs/tickets/PAC2-4700-refactor-here-for-branching-purposes-only/video/101186-screen-recording/timeline.md` — Storybook consistency recording, ~70s, reviewed
- `docs/tickets/PAC2-4700-refactor-here-for-branching-purposes-only/video/101187-screen-recording/timeline.md` — Storybook consistency recording, ~47s, reviewed
- `docs/tickets/PAC2-4700-refactor-here-for-branching-purposes-only/video/101694-screen-recording/timeline.md` — Storybook consistency recording, ~33s, reviewed

**Contact sheets:** cùng thư mục `contact-sheet.webp`.

Đã ingest/review đủ 8/8 video. Bốn `.mov` 2026-02 cho thấy các flow `Quick Send`, patient details, campaign/sort, `Health Forms`, `Files`, `Booking Link` và scheduler prompt; environment/role không được suy diễn, chỉ dùng làm Observed supporting evidence. Không phát sinh requirement mới.

Frame chứa patient identifier, NHS number, email — local evidence, not shareable.

Map frame/PNG → requirement:

| Evidence | Claim | REQ |
|---|---|---|
| Connect video ~13:54 2026-09-11, `Scheduler Link Required` overlay | Connect hiện popup scheduler-link khi campaign có `{{scheduler_link}}` | REQ-013 |
| GP video attachments `Loading...` | GP documents/attachments có thể treo loading | REQ-011 |
| OS video `Booking Link` + chip `Virtual Mental Health Re...` vs PNG 127148 empty slots | Slot type mapping không đồng nhất OS/GP vs Connect | REQ-012 |
| 127147 overlay dropdown vẫn mở khi click campaign/email | OS dropdown panel persist | REQ-014 |
| PNG 127144 grey GP sort vs 127142 Connect/OS | Sort option list match nhưng theming GP khác | REQ-010 |
| PNG 127146 OS email `michael@...` vs Connect `tony.do@...` (comment) | Default email khác OS | REQ-009 |
| PNG 127143 OS `Attachments` `No available options` | OS không load attachment | REQ-011 |

## Atomic Requirements

### REQ-PAC2-4700-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Phạm vi QA cho refactor `Quick Send` / form controls
**Search Terms/Aliases:** `Quick Send`, `QS`, `major visual or functional breakages`, `PAC2-4683`
**Known Location:** Unknown — feature-branch URLs trong comment, chưa verify browser trong phase này
**Actor/Role:** Unknown (video observation: `Super Admin GB`, không phải ticket AC)
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing (Jira AC trống; hướng dẫn QA trong comment)

**Preconditions:**
- Có môi trường baseline `PAC2-4683` và feature branch `PAC2-4700` cho consumer được test.
- Cùng role, viewport, patient/campaign fixture khi so sánh.

**Expected Behavior:**
QA chỉ ghi **major visual or functional breakages** của `Quick Send` và form controls trên từng consuming app so với môi trường `PAC2-4683`. Không ghi nhận UI/UX improvement hay suggestion.

**Provenance:**
- **Source:** `ticket.md` comment Matthew 2026-02-12 (`QA Focus / What to Test`); Katie 2026-04-27
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** Ticket comments; không AC Jira
**Related Tests:** Chưa thiết kế
**Notes:** Baseline URL `PAC2-4683` chưa được ticket chốt (Open Question).

---

### REQ-PAC2-4700-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Visual integrity của form primitives trên consumer
**Search Terms/Aliases:** `Text Input`, `Textarea`, `Dropdown`, `Multi Select`, `Checkbox`, `Radio Button`, `avatar`
**Known Location:** Unknown; ticket nói changes span all files/pages trên Connect, GP, PC24, Rocketbar
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Mở màn hình dùng các control trên (đặc biệt `Quick Send`).

**Expected Behavior:**
`input`, `textarea`, `dropdown`, `multiselect`, `checkbox`, `radio`, `avatar` không bị broken sizing, missing border, hoặc alignment sai so với baseline `PAC2-4683`.

**Provenance:**
- **Source:** `ticket.md` QA Focus list (Matthew 2026-02-12; Katie 2026-04-27)
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** Ticket text
**Related Tests:** Chưa thiết kế
**Notes:** Pixel-perfect không thuộc scope; chỉ major breakage.

---

### REQ-PAC2-4700-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Dropdown selection behaviour
**Search Terms/Aliases:** `Dropdown`, `selected value`, `PrimeReact dropdown`, `Bx*`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có dropdown có option chọn được (campaign sort, email, slot type, v.v.).

**Expected Behavior:**
Chọn option thành công; giá trị đã chọn hiển thị đúng trên control. Không regression so với `PAC2-4683`.

**Provenance:**
- **Source:** `ticket.md` `Dropdown issues`
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** Ticket text; overlay persist trên OS là observation riêng (REQ-014)
**Related Tests:** Chưa thiết kế
**Notes:** —

---

### REQ-PAC2-4700-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Checkbox / radio interaction
**Search Terms/Aliases:** `Checkbox`, `Radio Button`, `checked state`, `tick`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có checkbox/radio trên form trong phạm vi consumer.

**Expected Behavior:**
Checked state cập nhật khi tương tác; tick visible khi checked. Không regression so với `PAC2-4683`.

**Provenance:**
- **Source:** `ticket.md` `Checkbox / radio issues`
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** Ticket text
**Related Tests:** Chưa thiết kế
**Notes:** —

---

### REQ-PAC2-4700-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Interactive styling states
**Search Terms/Aliases:** `hover`, `focus`, `checked`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Control hỗ trợ hover/focus/checked trên desktop.

**Expected Behavior:**
Không mất hoặc sai hoàn toàn hover / focus / checked so với `PAC2-4683` (major regression only).

**Provenance:**
- **Source:** `ticket.md` `Styling regressions`
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** Ticket text; PNG 127144 grey GP sort panel là observation theming, chưa đủ để Confirmed fail
**Related Tests:** Chưa thiết kế
**Notes:** —

---

### REQ-PAC2-4700-006

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Form control tương tác
**Search Terms/Aliases:** `form behaviour`, `not responding`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Control enabled, không bị overlay chặn (xem REQ-014).

**Expected Behavior:**
Component phản hồi tương tác người dùng; không đơ so với `PAC2-4683`.

**Provenance:**
- **Source:** `ticket.md` `General form behaviour`
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** Ticket text
**Related Tests:** Chưa thiết kế
**Notes:** —

---

### REQ-PAC2-4700-007

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Quick Form` sau bump version
**Search Terms/Aliases:** `Quick Form`, `Quick Send`, packaged styles
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Consumer dùng version `Quick Form` được ticket bump.

**Expected Behavior:**
`Quick Form` không broken hoặc unexpected so với `PAC2-4683` sau khi nâng version để tránh old styles.

**Provenance:**
- **Source:** `ticket.md` `Quick form` bullet
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** Ticket text
**Related Tests:** Chưa thiết kế
**Notes:** Entry path `Quick Form` vs `Quick Send` chưa tách trong ticket.

---

### REQ-PAC2-4700-008

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Cross-consumer coverage
**Search Terms/Aliases:** `Connect`, `GP`, `Supergrid`, `PC24`, `OS`, `Rocketbar`, `Storybook`
**Known Location:** Feature-branch clues (chưa Observed bởi phase này): Connect `paco-connect/feature-branch/pac2-4700-qs-only`; GP `pac2-4700-qs-only.dev.blinxpaco-np.com`; OS `paco/feature-branch/pac2-4700-qs-only`; Rocketbar không có preview URL
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Mỗi consumer có môi trường test được duyệt.

**Expected Behavior:**
Thorough testing trên **mỗi** consuming app (Connect, GP, PC24/OS, Rocketbar) cho QS và app xung quanh; breakage major phải bắt được trên consumer đó, không chỉ một app.

**Provenance:**
- **Source:** `ticket.md` Matthew 2026-02-12; Ammar 2026-09-11 (Rocketbar không có feature-branch deploy)
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** Ticket comments
**Related Tests:** Chưa thiết kế
**Notes:** Rocketbar hiện không có preview — Open Question.

---

### REQ-PAC2-4700-009

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** `Quick Send` default channel / patient email
**Search Terms/Aliases:** `Send as`, `Email`, `SMS`, `To:`
**Known Location:** `Quick Send` dialog; video Connect/GP/OS
**Actor/Role:** Unknown
**Inference Basis:** Beth yêu cầu consistency across 3 places; 2026-09-17 “All 3 areas now open email template first” nhưng OS listed email khác. Không có AC chốt default SMS vs email.
**Observation Context:** Video/PNG 2026-09-11 và 2026-09-17, feature branch `pac2-4700-qs-only`, role `Super Admin GB` trên recording — observation hiện tại, không phải expected Confirmed
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Cùng patient fixture trên Connect/GP/OS.
- Patient có hoặc không có email phải được chốt (data vs product).

**Expected Behavior:**
Cùng patient/state, default template channel và listed email không lệch giữa consumer trừ khi khác dataset đã xác nhận.

**Provenance:**
- **Source:** `ticket.md` Beth 2026-09-11, 2026-09-17; PNG `127146-image-20260917-100814.png`
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** `attachments/127146-image-20260917-100814.png`; Connect/GP/OS videos
**Related Tests:** Chưa thiết kế
**Notes:** Open Question: OS dùng dataset khác GP/Connect? Không Fail cho tới khi cùng fixture được xác nhận.

---

### REQ-PAC2-4700-010

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Campaign sort options trong `Select Campaign`
**Search Terms/Aliases:** `By date (descending)`, `By date (ascending)`, `By message type`, `A - Z`, `Z - A`
**Known Location:** `Quick Send` → `Select Campaign` sort control
**Actor/Role:** Unknown
**Inference Basis:** Consistency intent; Beth 2026-09-17 “Sorting options now match” nhưng GP grey box theming
**Observation Context:** PNG 127144 GP vs 127142 Connect/OS; video 127147 OS
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Mở `Select Campaign` sort dropdown.

**Expected Behavior:**
Cùng tập sort option trên Connect/GP/OS; control usable. Theming khác biệt chỉ Fail nếu được chốt là major visual breakage vs 4683.

**Provenance:**
- **Source:** `ticket.md` Beth 2026-09-11 / 2026-09-17; PNG 127144, 127142
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** `attachments/127144-image-20260917-100959.png`, `attachments/127142-image-20260917-101016.png`
**Related Tests:** Chưa thiết kế
**Notes:** Grey GP panel: Observed visual diff, chưa Confirmed defect.

---

### REQ-PAC2-4700-011

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Patient documents / `Attachments` trong `Quick Send`
**Search Terms/Aliases:** `Attachments`, `documents`, `No available options`, `Loading...`
**Known Location:** `Quick Send` left panel `Attachments` / patient documents
**Actor/Role:** Unknown
**Inference Basis:** Consistency + QA functional breakage; Beth: Connect có documents, GP permaloading, OS `No available options`
**Observation Context:** GP video attachments `Loading...`; PNG 127143 OS empty
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Cùng patient có document trên baseline.
- Không kết luận Fail nếu fixture không có attachment.

**Expected Behavior:**
Cùng patient: documents/attachments load xong (không perma-load) và hiển thị cùng availability trên Connect/GP/OS, trừ khác dataset đã xác nhận.

**Provenance:**
- **Source:** `ticket.md` Beth 2026-09-11, 2026-09-17; PNG 127143; GP video
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** `attachments/127143-image-20260917-101319.png`; `video/126599-gp-rocketbar`
**Related Tests:** Chưa thiết kế
**Notes:** Cần cùng patient + confirm documents tồn tại trên mỗi backend.

---

### REQ-PAC2-4700-012

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** `Booking Link` EMIS slot types
**Search Terms/Aliases:** `Booking Link`, `Face to Face Slot Type(s)`, `Video Slot Type(s)`, `Refresh Availability`, EMIS
**Known Location:** `Quick Send` tab `Booking Link`
**Actor/Role:** Unknown
**Inference Basis:** Consistency; Beth 2026-09-17 OS/GP không pull mapped EMIS slot, Connect có chip `Virtual Mental Health...`; text centered là improvement ngoài scope Fail
**Observation Context:** PNG 127148 vs 127145
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Campaign/booking link có mapped EMIS slot trên Connect.
- Cùng campaign trên GP/OS.

**Expected Behavior:**
Mapped slot type xuất hiện tương đương trên consumer cùng campaign, không để trống nếu Connect có giá trị và GP/OS cùng config.

**Provenance:**
- **Source:** `ticket.md` Beth 2026-09-17; PNG 127148, 127145
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** `attachments/127148-image-20260917-101412.png`, `attachments/127145-image-20260917-101517.png`
**Related Tests:** Chưa thiết kế
**Notes:** Centered title = good per Beth, không phải fail. Cần confirm cùng campaign mapping.

---

### REQ-PAC2-4700-013

**Classification:** Inferred
**Lifecycle:** Disputed
**Feature/Scope:** `Scheduler Link Required` popup
**Search Terms/Aliases:** `Scheduler Link Required`, `booking link`, `{{scheduler_link}}`, `I'll Choose Where`, `Add at End`
**Known Location:** `Quick Send` editor khi campaign chứa scheduler placeholder
**Actor/Role:** Unknown
**Inference Basis:** Beth: Connect hiện popup dù link present; OS/GP không. Chưa rõ expected: popup khi thiếu link, hay không hiện khi đã có. Mâu thuẫn với PAC2-5776 (popup intermittent).
**Observation Context:** Connect video ~13:54 11/09/2026, campaign `Mike Save Campaign Test`, overlay `Scheduler Link Required`
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Campaign có booking/scheduler placeholder; xác định “link present” nghĩa là gì.

**Expected Behavior:**
Chưa chốt. Candidate: cùng campaign/state, popup xuất hiện hoặc không xuất hiện **nhất quán** trên Connect/GP/OS theo rule đã xác nhận (thiếu scheduler link vs false positive).

**Provenance:**
- **Source:** `ticket.md` Beth 2026-09-11; Connect video
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** `video/126598-connect-rocketbar` frame ~Quick Send overlay
**Related Tests:** Chưa thiết kế
**Notes:** Không automate expected assertion. Cần QA rule: popup khi nào bắt buộc.

---

### REQ-PAC2-4700-014

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Dropdown overlay dismiss
**Search Terms/Aliases:** `Dropdown`, overlay persist, `Select Campaign`
**Known Location:** OS `Quick Send` sort dropdown — URL clue `paco/feature-branch/pac2-4700-qs-only/dashboard`
**Actor/Role:** Unknown
**Inference Basis:** Beth 2026-09-17 “Dropdown behaviour different in OS … boxes persist”; video 127147 cho thấy panel sort vẫn mở khi tương tác list/email
**Observation Context:** Video 127147, 2026-09-17, OS feature branch
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Mở sort dropdown trên OS và Connect/GP để so sánh.

**Expected Behavior:**
Dropdown panel đóng khi chọn option hoặc click ra ngoài, giống Connect/GP; không che list/email picker.

**Provenance:**
- **Source:** `ticket.md` Beth 2026-09-17; `video/127147-screen-sharing`
- **Input Revision:** 1
- **First Recorded:** 2026-09-23
- **Last Verified:** 2026-09-23

**Evidence:** `attachments/127147-Screen sharing - 2026-09-17 11_11_44 AM.mp4`; `video/127147-screen-sharing`
**Related Tests:** Chưa thiết kế
**Notes:** Khớp QA Focus dropdown functional breakage nếu tái hiện vs 4683.

---

## Ambiguities and Conflicts

- Jira `Acceptance criteria`: Not provided. QA instruction trong comment ≠ AC chính thức; REQ-001..008 Confirmed **chỉ** ở mức hướng dẫn QA đã viết, không phải product spec đầy đủ.
- Intent “visually silent refactor” vs QA “thorough testing throughout each app” vs Beth test “consistency across 3 places, ignoring bugs for now” — ba lớp mục tiêu, không được gộp thành một expected.
- Default SMS (Beth 2026-09-11 Connect/GP) vs “all 3 open email first” (2026-09-17) — behavior đổi theo thời gian/branch; Disputed current vs intended.
- `Scheduler Link Required` trên Connect khi “link present” — có thể false positive, data, hoặc bug PAC2-5776; Disputed.
- Rocketbar nằm trong phạm vi bốn consumer nhưng không có feature-branch URL (Ammar 2026-09-11).
- Feature link cũ (Feb/Apr: `pac2-4700`, `pac2-4700--2`) vs current `pac2-4700-qs-only` — môi trường test đích chưa được ticket chốt một dòng.
- Baseline đúng: `PAC2-4683` environment (Katie) vs live `blinx.dev.blinxpaco-np.com/paco/dashboard` (memory phiên trước) — không chọn silent.

## Open Questions

1. URL baseline `PAC2-4683` và URL branch bắt buộc cho Connect/GP/OS/Rocketbar lần chạy này?
2. Role và test patient/campaign được duyệt? Video dùng `Super Admin GB` + patient demo; không suy diễn.
3. OS khác email/attachments/slots vì **dataset** hay **product bug**?
4. Rule `Scheduler Link Required`: hiện khi nào? Cùng campaign trên ba app?
5. Rocketbar test được không khi không có preview deploy?
6. `Quick Form` entry path khác `Quick Send` — test cả hai hay chỉ QS modal?
7. Mutation (`Save as new Campaign`, `Send`) có nằm trong scope lần này? Ticket QA visual/functional; Send vẫn cần recipient đã xác minh.

## Location search terms (for LOCATE)

- Exact: `Quick Send`, `Select Campaign`, `Booking Link`, `Health Forms`, `Attachments`, `Scheduler Link Required`, `Save as new Campaign`
- Aliases: `QS`, `Rocketbar`, `patient actions`, `+`
- Actor/context: patient selected; `Quick Send` dialog
- Known location clues (not Observed here): patient search → patient actions `+` → `Quick Send`; Connect/GP/OS feature-branch URLs trên

---

## Tester notes

[Protected area]
