# Requirements: PAC2-4399

**Input Revision:** 2
**Generated:** 2026-09-29
**Status:** Disputed

## Source Summary

Ticket yêu cầu cập nhật mã SNOMED dùng khi Paco filing blood-pressure readings vào EMIS. Description ban đầu nói Paco đang dùng `Concept ID 1572871000006101` / `Description ID 1572871000006117`, mã này không có trong EMIS selector, và nêu `Concept ID 163020007` / `Description ID 254063019` là lựa chọn gần nhất. Điều tra sau đó cho biết dữ liệu đã được chuyển sang `163020007`, nhưng chính mã này đã deprecated. Chuỗi comment mới nhất đề xuất chuyển sang `Concept ID 75367002` (`Blood pressure (observable entity)`) với `Description ID 1495437014`.

Ticket không có `Acceptance criteria`. Nguồn chứa mâu thuẫn về việc có cần DB change hay không và chưa xác định rõ phạm vi record phải migrate. Vì vậy expected behavior bên dưới chỉ là `Inferred`, chưa đủ để kết luận fix hoặc automate assertion.

## Video Coverage

**Timeline:** `docs/tickets/PAC2-4399-update-o-e-blood-pressure-codes/video/timeline.md`
**Contact Sheet:** `docs/tickets/PAC2-4399-update-o-e-blood-pressure-codes/video/contact-sheet.webp`

Video mới ngày 2026-09-29 quan sát trên dev, role `Super Admin GB`, minh họa `Health Form Designer`, component `Blood Pressure`, combined O/E label/tooltip, form diary/one-off và inputs `SYS`/`DIA`. Video không mở EMIS, không file response vào Patient Record, không hiển thị `ConceptID`/`DescriptionID`, payload hoặc DB mapping; vì vậy chỉ bổ sung location/setup evidence, không xác nhận fix.

Attachment `attachments/101896-image-27.png` cho thấy SNOMED concept code `163020007`, class `Clinical Finding`, validity `Deprecated`, valid end `31-Jan-2021`; đây là supporting source, không chứng minh behavior của Paco.

## Atomic Requirements

### REQ-PAC2-4399-001

**Classification:** Inferred
**Lifecycle:** Disputed
**Feature/Scope:** Mã SNOMED dùng khi filing blood-pressure readings vào EMIS
**Search Terms/Aliases:** `Blood Pressure`, `Blood Pressure Reading`, `O/E - blood pressure`, `O/E - blood pressure reading`, `O/E - BP reading`, `On examination - blood pressure reading`, `SNOMED`, `ConceptID`, `DescriptionID`, `org_web_question_props`
**Known Location:** `[Observed]` dev `Health Form Designer`; video chỉ xác nhận builder/setup, không xác nhận EMIS result surface
**Actor/Role:** `Super Admin GB` trong video; filing/integration role requirement vẫn Unknown
**Inference Basis:** Comment ngày 2026-08-19 đề xuất `75367002`; comment mới nhất ngày 2026-08-20 chỉ định `DescriptionID 1495437014`; không phải Acceptance Criteria hoặc BA/PO confirmation được định danh rõ.
**Observation Context:** `[Observed: dev, Super Admin GB, 2026-09-29]` Video frames `0047`, `0070`, `0095`, `0100` show blood-pressure builder configuration but no code IDs or EMIS result.
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Paco có flow filing systolic/diastolic blood-pressure readings vào EMIS.
- Integration/environment hỗ trợ kiểm tra clinical code đã filed.

**Expected Behavior:**
Khi Paco filing blood-pressure readings, clinical code đích được suy luận là `Concept ID 75367002` với `Description ID 1495437014`, thay vì deprecated/unavailable codes `1572871000006101` hoặc `163020007`.

**Provenance:**
- **Source:** `ticket/PAC2-4399-update-o-e-blood-pressure-codes/ticket.md:14`, `:48-76`, `:82-100`
- **Input Revision:** 2
- **First Recorded:** 2026-09-22
- **Last Verified:** 2026-09-29

**Evidence:** `ticket/PAC2-4399-update-o-e-blood-pressure-codes/attachments/101896-image-27.png`
**Related Tests:** Chưa thiết kế
**Notes:** Cần xác nhận cặp code đích và điểm quan sát kết quả trong EMIS trước khi dùng làm expected result.

---

### REQ-PAC2-4399-002

**Classification:** Inferred
**Lifecycle:** Disputed
**Feature/Scope:** Migration/correction dữ liệu cấu hình blood-pressure code hiện có
**Search Terms/Aliases:** `org_web_question_props`, `migrate`, `163020007`, `75367002`, `254064013`, `254063019`, `2667419011`, `254065014`, `125176019`, `1495437014`
**Known Location:** Unknown; có thể là non-UI configuration/data scope
**Actor/Role:** Unknown
**Inference Basis:** Developer hỏi liệu có migrate toàn bộ `163020007` bất kể `DescriptionID`; trả lời chỉ cung cấp `DescriptionID 1495437014`, chưa xác nhận rõ phạm vi record hoặc cơ chế migration.
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có record/config hiện dùng `ConceptID 163020007` hoặc legacy `1572871000006101`.
- Phạm vi environment/organisation và rollback được xác nhận.

**Expected Behavior:**
Các record/config thuộc phạm vi được duyệt được cập nhật sang cặp code đích đã xác nhận, không để mapping hỗn hợp hoặc cập nhật nhầm record ngoài phạm vi.

**Provenance:**
- **Source:** `ticket/PAC2-4399-update-o-e-blood-pressure-codes/ticket.md:52-72`, `:82-84`
- **Input Revision:** 2
- **First Recorded:** 2026-09-22
- **Last Verified:** 2026-09-29

**Evidence:** Bảng mapping trong ticket lines 66-72
**Related Tests:** Chưa thiết kế
**Notes:** Requirement này mâu thuẫn với field `Does this require DB changes or API query updates? No – Not required` và Description nói `likely need hard update in the DB`.

---

### REQ-PAC2-4399-003

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Bảo toàn giá trị blood-pressure khi đổi clinical code
**Search Terms/Aliases:** `systolic`, `diastolic`, `blood pressure reading`, `filing`, `EMIS`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** Mục tiêu ticket là cập nhật coding của readings; hợp lý cần giá trị reading vẫn được filed đúng, nhưng source không mô tả format/value behavior.
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có safe test patient và quyền kiểm tra EMIS result.
- Có blood-pressure input hợp lệ.

**Expected Behavior:**
Đổi code không làm thay đổi, mất, đảo hoặc duplicate giá trị blood-pressure được filed.

**Provenance:**
- **Source:** `ticket/PAC2-4399-update-o-e-blood-pressure-codes/ticket.md:14`
- **Input Revision:** 2
- **First Recorded:** 2026-09-22
- **Last Verified:** 2026-09-29

**Evidence:** Không có
**Related Tests:** Chưa thiết kế
**Notes:** Cần product/domain owner xác nhận representation mong đợi của systolic/diastolic readings.

---

## Ambiguities and Conflicts

1. **Code đích:** Description ban đầu nêu `163020007` / `254063019`; comments sau xác định `163020007` deprecated và đề xuất `75367002`. Comment mới nhất cung cấp `1495437014`, nhưng không viết lại đầy đủ cặp `ConceptID` + `DescriptionID` trong cùng câu trả lời. REQ-001 giữ `Disputed`.
2. **Migration scope:** Câu hỏi “migrate all `163020007` (regardless of `DescriptionID`)” chưa có câu trả lời trực tiếp, dù comment mới nhất nói dùng `DescriptionID 1495437014`.
3. **DB change:** Description nói “likely need hard update in the DB”; Jira field nói `No – Not required`; developer comments bàn migration records. Không tự chọn source.
4. **Legacy code:** Developer nói `1572871000006101` không còn được dùng trên `org_web_question_props` ở DEV/UAT/PROD vào 2026-08-07. Chưa có evidence query hoặc timestamped export trong source để kiểm chứng.
5. **Attachment:** Ảnh chứng minh `163020007` deprecated theo nguồn hiển thị, nhưng không xác định hệ thống/URL, thời điểm capture, hoặc code đích.
6. **Video mới:** Video 2026-09-29 chỉ minh họa tạo/cấu hình blood-pressure Health Form; không thực hiện EMIS filing hoặc hiển thị code mapping. Không dùng video để promote expected mapping thành `Confirmed`.
7. **Terminology:** Ticket dùng cả `ConceptId`, `Concept ID`, `DescriptionId`, `DescriptionID`; aliases chỉ dùng cho search, không suy ra schema.

## Open Questions

1. Cặp code đích chính thức có phải chính xác là `ConceptID 75367002` + `DescriptionID 1495437014` không? **Impact:** chặn expected result và execution.
2. Có migrate tất cả record mang `ConceptID 163020007` bất kể `DescriptionID`, hay chỉ mapping cụ thể? **Impact:** chặn phạm vi migration và negative coverage.
3. Ticket thực tế cần DB migration, configuration change, code change, hay chỉ verify thay đổi đã triển khai? **Impact:** quyết định có cần `LOCATE` UI hay skip non-UI với lý do chính xác.
4. Environment và organisation nào nằm trong scope retest? **Impact:** chặn location/execution.
5. QA dùng role nào và entry flow nào để tạo blood-pressure reading? **Impact:** chặn `LOCATE` nếu UI-dependent.
6. Có safe test patient/EMIS integration và quyền xem clinical code đã filed không? **Impact:** chặn end-to-end validation; có thể có side effect/send external data.
7. Expected representation của systolic và diastolic values trong EMIS là gì; một hay nhiều coded entries? **Impact:** chặn validation REQ-003.
8. Có cần verify legacy code `1572871000006101` không còn ở cả DEV/UAT/PROD, hay dev-only black-box scope? **Impact:** tránh mở rộng scope ngoài Paco dev.

---

## Tester notes

