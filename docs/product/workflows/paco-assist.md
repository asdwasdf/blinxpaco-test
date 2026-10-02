# Workflow: PACO Assist — Document Inbox và Document Intelligence

- Classification: `[Observed: dev feature branch, Super Admin GB, 2026-10-02]` — logic bên dưới giữ tag riêng từng bullet
- Aliases: `Document Inbox`, `Document Intelligence`, `PACO Assist`, `Upload & analyse`, `document analyser`
- Coverage: `Minimal`
- Confidence: `Low`

File tạo ngày 2026-10-02 để gom logic ticket `PAC2-6763` (scope gốc rộng; run chỉ quan sát inbox và dialog upload). Route xem `feature-map.md` (`Document Inbox — Upload dialog`).

## Business context observed

- Entry quan sát: `/paco/inbox` (`Document Inbox`). `PACO Assist` qua `More options` bị loại cho scope upload. `[Observed]` — PAC2-6763/exploration.md, feature-map.md
- Ticket không có AC chi tiết; scope trong run chưa xác nhận. `[Confirmed]` — PAC2-6763/requirements.md

## Logic từ ticket

### Document Inbox

**Luồng**
1. Mở `/paco/inbox`: board/list toggle, search, counter "need attention". `[Observed]` — PAC2-6763/exploration.md (OBS-004)
2. Cột lifecycle `Analysing` → `Needs review` → `Ready to file` → `Filed & rejected`; card state `Match needed`, `Matched <N>%`, `Analysed`, `Filed`, `Rejected`. `[Observed]` — PAC2-6763/exploration.md (OBS-004)
3. Upload: dialog `Upload document to inbox` có file chooser (PDF, image, Word...), `Source type`/`Source name` tùy chọn, `Cancel`, `Upload & analyse` disabled đến khi chọn file. `[Observed]` — PAC2-6763/exploration.md (OBS-005)

**Business rules**
- Có central document/file inbox cho mỗi organisation, liên kết `S3` và `MESH` mailbox. `[Confirmed]` — PAC2-6763/requirements.md (REQ-001)
- `Document Intelligence` tự xử lý inbound document với HP oversight; nhận diện và hiển thị source/author, bệnh nhân khớp trong org, addressee (clinician/admin), structured summary ngắn cho triage, action cần làm (referral, medication change). `[Confirmed]` — PAC2-6763/requirements.md (REQ-002..006, 010)
- Gợi ý `SNOMED CT`: mỗi code HP phải accept/decline trước khi áp dụng. `[Confirmed]` — PAC2-6763/requirements.md (REQ-007)
- Ghi document và code đã accept vào patient record qua consultation entry hoặc `Admin entry`; `Admin entry` gate bởi ticket phụ thuộc PAC2-7193 (trạng thái chưa rõ). `[Confirmed]` — PAC2-6763/requirements.md (REQ-008, 009)
- Action thuốc: sinh draft prescription qua `PACO Assist`, nhất quán với `Quick Scribe` ở `PACO Talk`. `[Confirmed]` — PAC2-6763/requirements.md (REQ-011)
- Feedback comment: `Clear` đổi thành `Start new chat`; agent điều tra sâu nội dung document thay vì hỏi user; cải thiện response format; cost estimate mỗi chat; conversation history. `[Confirmed]` — PAC2-6763/requirements.md (REQ-012..016)
- Upload ở inbox (có analyse) là flow tập trung cho Document Intelligence; upload trong patient `Documents` là đường riêng. `[Inferred from: exploration, needs confirmation]` — PAC2-6763/exploration.md

**Trạng thái**
- Inbox lifecycle: `Analysing` → `Needs review` → `Ready to file` → `Filed & rejected`. `[Observed]` — PAC2-6763/exploration.md

**Role/permission**
- Role/feature flag bật upload chưa rõ. `[Open Question]` — PAC2-6763/report.md

**Defect đã biết**
- PAC2-6763 · Not Run (TC-001 upload document) · browser file chooser bị mở lặp, tester không cung cấp actual result; không defect, không automate. `[Observed]` — PAC2-6763/report.md

**Open questions**
- Định dạng/dung lượng tối đa, tín hiệu thành công (toast/counter/card), SLA phân tích, cleanup an toàn, role/feature flag upload, `PAC2-7193` đã hoàn thành chưa. `[Open Question]` — PAC2-6763/requirements.md, report.md

## Tester notes

