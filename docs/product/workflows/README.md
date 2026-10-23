# Product Workflows Registry

Registry cho flow nhiều page/state đã quan sát trực tiếp. Mỗi file mô tả behavior hiện tại để locate, chuẩn bị data, chạy phần read-only và hướng dẫn tester; không mô tả product intent nếu thiếu trusted source.

## Quy ước

- Một feature ổn định dùng một file `<feature>.md`; dùng `docs/templates/workflow.md`.
- Bắt buộc ghi environment, role, timestamp, evidence, starting data state và mutation boundary.
- Merge observation mới theo role/data variant; không ghi đè lịch sử còn đúng.
- Mọi workflow survey giữ classification `Observed`; nhiều observation không tự thành `Confirmed`.
- Ticket có thể dùng workflow làm navigation/setup/data/risk/coverage hint. Requirement và expected result vẫn phải có basis độc lập từ ticket hoặc trusted source.
- Route chứa patient ID, PII, credential, auth state, generated class hoặc fragile locator không được đưa vào registry.
- Raw evidence nằm tại `test-results/product-survey/<run-id>/`; registry chỉ chứa nội dung đã review/redact.

## Index

| File | Module | Ghi chú |
|---|---|---|
| `analytics-reports.md` | Analytics & Reports | Super Admin GB Patient Analyser 5/11: synthetic query apply/reopen, reload retention và cleanup, chưa cohort correctness/saved report. Separate Reports 2/6 denied/OQ-069; historical context và ticket logic giữ riêng |
| `appointment-book.md` | Appointment Book (PACO Connect) | Super Admin GB breadth 7/15, selector 4/7 và draft/filter 5/6 giữ riêng; Quick Book Reset clears gender selection nhưng giữ search/scope, Close/reopen reset draft; Booked filter giữ qua reopen, reload baseline. Owned source receivers verified. Prior boundary 1/4 và Blinx Deployment 4/15 giữ riêng; fixture decision đã answered; owned-query attempt 0/3 bị ngắt connector, draft cần reconcile, chưa saved booking; logic ticket giữ nguyên |
| `appointment-books-settings.md` | Configuration / Appointment Books source | Historical 8/12 lifecycle; later prerequisite 3/3: fresh Create/readback, saved Session assignment và Archive/source/receiver absence. New Book→Session edge; search OQ-071, không sharing/booking mutation |
| `appointment-sessions-settings.md` | Configuration / Sessions | Historical draft 5/9; saved pass 9/15: own Create/readback, required assignments, Edit/Cancel, Archive gate/CSV và template Delete; rename OQ-072, generated-occurrence cleanup Inconclusive OQ-073. Book/Slot receiver retained/cleanup verified |
| `appointment-slot-types-settings.md` | Configuration / Slot Types | Historical 7/14 lifecycle; later prerequisite 3/3: fresh Create, saved Session assignment retained và Archive/source/picker absence. Existing edge reverified; validation/classification deferred, search OQ-071 |
| `admin-sso.md` | Admin, SSO, role context | Super Admin GB Role Groups 3/8 read-only, actual header verified, search/paging baseline restored; shared Save pending. Giữ logic ticket; historical Role Groups 3/8 nhánh Partial (read-only); role verified trước navigation, chưa independently checked tại root; Add/Edit/Save chờ OQ-064 |
| `capacity-demand.md` | Capacity & Demand | Historical date pass 4/9; independent role/card pass 2/5: Doctor grey/non-grey reload retention và info hover/dismiss; hidden Session/observation controls Blocked, chart tooltip Inconclusive; chưa metric correctness |
| `case-load-management.md` | Case Load Management | Super Admin GB breadth 3/8 và independent search/presentation 4/6 giữ riêng: current-board no-match/clear, Case ID/Patient modes/clear, List URL/reload và Card baseline restored. Matching completion Inconclusive; saved board OQ-066 pending. Historical context-unverified 3/9 giữ riêng; không clinical record/mutation. Source: `product-explore/auto-20261023-0000/ledger.md#3` |
| `comms-hub.md` | Comms Hub | Authenticated external pass 4/12 read-only: campaign root/search, Outbox/search; external role chưa verified, no CRUD/Send. Old login-boundary pass giữ riêng, OQ-040 role requirement Open; logic ticket giữ nguyên |
| `rocket-bar.md` | Rocket Bar | Super Admin GB: 1/3 bounded launcher branches; menu open/close, client main workflow Blocked OQ-070, không launch/download/install |
| `user-training-portal.md` | User Portal / Users | Super Admin GB historical 6/10 và independent viewer/FAQ 6/8 giữ riêng: View All/back, guide outer boundary, native video/progress/pop-out, FAQ search/category/reload reset. Guide content Blocked OQ-074, support scope chưa rõ; UI/media/tab cleanup Done. Source: `product-explore/auto-20261023-0000/ledger.md#5` |
| `configuration.md` | Configuration | Có `## Logic từ ticket` (clinician selection, Code Rule Config) |
| `organisation-skills.md` | Configuration / Organisation / Skills | Autonomous 2026-10-21; CRUD, duplicate validation, persistence, UI archive và Staff Profile picker propagation; 8/14 nhánh, partial |
| `organisation-pathways.md` | Configuration / Organisation / Pathways Config | Autonomous 2026-10-21; visible menu tới Page Not Found, fresh tab reproduces; Blocked |
| `organisation-services.md` | Configuration / Organisation / Services | Autonomous 2026-10-21; owned Add/Remove và reload discard; numeric ID/max15, Name/max255; 2/7 nhánh, global Save chưa rõ footprint |
| `practice-profiles.md` | Configuration / Organisation / Practice Profiles | Autonomous 2026-10-21; visible menu tới Page Not Found, fresh tab reproduces; Blocked |
| `organisation-locations.md` | Configuration / Organisation / Locations | Autonomous 2026-10-21; owned create/edit/cancel/Archive/Add Close và UI persistence; Address buffer observation; 7/12 nhánh Partial, cleanup Done; read-only recheck20:00:15.316Z |
| `organisation-dx-priorities.md` | Configuration / Organisation / Dx Priority | Autonomous 2026-10-22; 4/7 Partial (read-only): root/search/Service+Priority pickers; no selection/Add/Remove/shared Save. Owned target/rules/consumer OQ-062; active role after reload OQ-063. Later connector failure, run paused |
| `organisation-announcements.md` | Configuration / Organisation / Announcements | Autonomous 2026-10-21; own unsaved drafts, 4/8 Partial (interactive), shared Save chưa rõ (OQ-061). Read-only cleanup recheck 2026-10-22T01:07:48.305Z; current recheck sau later connector notice Blocked, không saved lifecycle proof |
| `organisation-sharing-agreements.md` | Configuration / Organisation / Sharing Agreements | Autonomous 2026-10-21; 4/5 Partial (read-only), paging navigation Skipped. Columns search/clear và một Autosize/reload; no agreement mutation/domain persistence/receiver. Read-only baseline recheck 2026-10-22T01:08:14.018Z; current recheck sau later connector notice Blocked. OQ-060 |
| `staff-teams.md` | Configuration / Users & Staff / Teams | Autonomous 2026-10-21; unsaved draft discarded on reload; page-wide Save footprint chưa an toàn |
| `staff-profiles.md` | Configuration / Users & Staff / Staff Profiles | Autonomous 2026-10-21; unsaved General/Skill Capabilities form; Skills create/rename/archive reflected in fresh picker; 4/9 nhánh read-only, no profile Create |
| `health-forms.md` | Health Forms | Super Admin GB saved lifecycle 8/14 và independent unsaved Preview 5/7 giữ riêng: Required marker retained sau answer/blur, config reopen và draft discard verified; không response submit. Preview source `product-explore/auto-20261023-0000/ledger.md#8`; V2 Inconclusive, prior 4/8 và Blinx Deployment 8/18 riêng, logic ticket giữ nguyên |
| `paco-assist.md` | PACO Assist (Document Inbox/Intelligence) | Mới 2026-10-02; logic từ ticket |
| `patient-facing-scheduler.md` | Patient-facing Scheduler | Mới 2026-10-02; logic từ ticket |
| `patient-profile.md` | Patient (search, profile, Documents) | Owned Profile receiver hiển thị identity và updated Known As sau Patient Search saved lifecycle; read-only 1/1 bounded receiver branch, chưa Profile mutations. Source `product-explore/auto-20261023-0223/ledger.md#4`; giữ `## Logic từ ticket` |
| `care-navigation.md` | Patients / Care Navigation | Super Admin GB: historical 4/7 và later A-Z result experiment 2/3 riêng; First Name+A/fresh Last Name+A populated, field-switch Inconclusive, reload baseline reset; clinical fixture OQ-065 pending |
| `patient-search.md` | Patient Search (top-bar dropdown + PDS page) | Super Admin GB saved pass 6/9: owned Create và Known As Update reload verified, Close discard và Profile receiver observed; patient retained theo answered fixture decision. Historical 4/7, offline 0/1 và Blinx Deployment 6/15 giữ riêng, OQ-067 không đổi. Source `product-explore/auto-20261023-0223/ledger.md#2–4` |
| `web-chat-video.md` | Web Chat & Video | Super Admin GB: Virtual Appointments `Blocked` tại module Login, 0/1 authenticated-root branch, OQ-068. Coverage role trước giữ riêng: Virtual Appointments 4/8, Media Library 1/3, Outstanding Reviews 2/7 read-only; fixture OQ-065 |

Section `## Logic từ ticket` tổng hợp theo từng feature (`Luồng`, `Business rules`, `Trạng thái`, `Role/permission`, `Defect đã biết`, `Open questions`); mỗi bullet có tag `Confirmed`/`Observed`/`Inferred`/`Open Question` kèm provenance. Tag `Confirmed` ở đây là ý định ghi trong ticket/comment, không phải spec đầy đủ. Tra cứu ngược từ ticket: `docs/product/feature-map.md` mục `Ticket → feature`.

## Dùng khi có ticket

1. Match feature term/alias từ ticket với registry.
2. Re-verify route, role, context và starting state trên environment hiện tại.
3. Chạy các bước read-only có basis rõ.
4. Dừng tại approval stop; nếu chưa có approval, trả hướng dẫn manual cùng evidence cần capture.
5. Không dùng observed end state làm expected result nếu ticket/trusted source không xác nhận.
