# Workflow: Organisation Skills

- Classification: `[Observed: dev, Blinx Deployment, 2026-10-21]`
- Aliases: `Skills`, `Add Skill`, `Edit Skill`, `Copy Skill`, `Archive Skill`
- Coverage: `Partial (interactive)` — 8/14 nhánh có end state; không đại diện toàn app.
- Confidence: `Medium`
- Last verified: `2026-10-21`
- Provenance chung: `product-explore/auto-20261021-1359/ledger.md#2` đến `#7`, và `#11` cho Staff Profile picker, local tại `test-results/`.

## Business context observed

- `[Observed; #2]` Actor `Blinx Deployment` mở được danh sách `Skills` thuộc `Configuration` → `Organisation`.
- `[Observed; #2, #4]` Entity có `Name`, `Assign Pathways`, `SNOMED code`, `RBAC skill`; grid có `Actions`, `Name`, `Created By`, `Pathways`, `RBAC Skill`, `Snomed CT Code`.
- `[Unverified hypothesis; #2]` Skill là cấu hình dùng lại cho pathway/phân quyền; tác động hai domain này và ý định nghiệp vụ chưa chứng minh. `[Observed; #11]` Downstream availability trong Staff Profile picker đã quan sát riêng.
- `[Observed; #3–#7]` Dữ liệu tự tạo trải qua create, edit, copy, archive; không chọn/sửa record có sẵn.

## Entry

1. `[Observed; #1–#2]` `/paco/dashboard` → sidebar `Configuration` → `Organisation` → `Skills`.
2. `[Observed; #2]` Route `/paco/configuration/organisation/skills`; landmarks `Configuration`, `Skills`, `Search Skills...`.

## Read-only flow

1. `[Observed; #2]` Nhập tên vào `Search Skills...`; chờ grid filter xong. Đếm row ngay sau fill có thể vẫn là state cũ.
2. `[Observed; #2]` Header icon menu → `Add Skill`: dialog `Name`, `Assign Pathways`, `SNOMED code`, `RBAC skill`, `Confirm`, `Close`.
3. `[Observed; #4]` Owned row menu: `Edit`, `Copy`, `View Audit`, `Archive`.
4. `[Observed; #4–#6]` `Edit`/`Copy` mở drawer `complementary`, không phải dialog; footer `Cancel`/`Save`.

## Decision points

- `[Observed; #3]` Add với Name rỗng: `Confirm` disabled; whitespace-only lại enabled. Không submit whitespace vì record phải có tiền tố `QA-test`.
- `[Observed; #5]` Duplicate: dialog còn mở, alert `Resource already exist` / `The resource you are trying to add already exists`.
- `[Observed; #4]` Edit → `Cancel`: tên gốc giữ nguyên khi mở lại; `Save`: tên mới còn sau reload.
- `[Observed; #5]` Copy prefill tên gốc; tên được nhập bị nối thêm ` copy` khi lưu. Kiểm tra exact text, không dựa substring search.
- `[Observed; #7]` Archive → `Cancel` giữ row; `Confirm` bỏ row khỏi active grid.

## End and exceptional states

- `[Observed; #3]` Create: toast `Success` / `Skill added successfully`, dialog đóng, row mới xuất hiện.
- `[Observed; #5]` Duplicate bị từ chối; UI-triggered `POST /api/care-professional-speciality-types` trả 400. Unique-name control trả 201 và còn sau reload. Chỉ quan sát metadata, không gọi endpoint trực tiếp.
- `[Observed; #7]` Archive: dialog `Archive Skill`, câu `Are you sure you want to archive this skill?`; toast lại ghi `Skill deleted successfully`.
- `[Open Question; #6]` `View Audit` chưa thấy audit panel trong hai lần kiểm tra; thời điểm hoàn tất chưa xác lập. `Inconclusive`, chưa gọi defect.

## Safety boundary

- `[Observed; #3–#7]` Chỉ HTTPS exact configured dev host, environment `dev`; guard trước từng submit/copy/archive.
- Không chỉnh organisation, pathway, RBAC hoặc record dùng chung. Không email/SMS/upload/download trong run này.
- Cleanup bằng `Archive` riêng từng owned row. Không thấy hard-delete/Restore/archive browser; không khẳng định dữ liệu bị xóa vật lý.

## Required test data

- Tên synthetic dạng `QA-test-<run-id>-<n>`; prefix giữ cả sau rename/copy.
- `[Observed; #3]` Create tối thiểu chỉ cần Name trong lần chạy này; các field khác không chọn.
- `[Open Question]` Mapping pathway/SNOMED/RBAC cần owned prerequisite và rule domain; chưa chọn option dùng chung để thử.

## Interactive flow (owned test data)

1. `[Observed; #3]` Add → Name hợp lệ → `Confirm` → toast thành công → grid → reload/search vẫn có.
2. `[Observed; #4]` Edit → đổi Name → `Cancel` → reopen vẫn tên gốc. Edit lại → rename → `Save` → reload/search vẫn tên mới.
3. `[Observed; #5]` Add trùng Name → bị từ chối; đổi sang tên unique trong cùng form → create được, reload còn.
4. `[Observed; #5]` Copy → đổi Name → `Save` → reload thấy tên với suffix ` copy` tự nối.
5. `[Observed; #7]` Archive từng record → verify row biến mất; reload + search prefix toàn run không còn active row.

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| Add Name rỗng | Empty | `Confirm` disabled | Có, UI | `Observed; #2–#3` |
| Add Name whitespace | 3 spaces, không submit | `Confirm` enabled | Chưa biết server | `Observed; #3` |
| Add Name duplicate | Tên owned đã tồn tại | `Resource already exist` / `The resource you are trying to add already exists` | Có, dialog giữ mở, không thêm row | `Observed; #5` |
| Edit Name rỗng | Empty, không submit | `Save` enabled, khác Add | Chưa biết server | `Observed; #4` |
| Name boundary/format | Chưa thử max length/ký tự đặc biệt | Chưa biết rule | Chưa biết | `Open Question` |

## Cross-feature relationships

- `[Inferred; #2, #6]` `Skills` có `Assign Pathways` picker với 215 option tại thời điểm mở; chưa select/save hoặc thấy effect phía Pathways. Không ghi thành relationship `Observed`.
- `[Observed; #11]` Create owned Skill → fresh unsaved Staff Profile `Skill Capabilities` picker có exact Name; rename → tên mới thay tên cũ; Archive → cả hai tên không còn trong fresh picker. Không chọn/lưu Staff Profile, không chứng minh persisted assignment.
- `[Open Question]` Rename/archive ảnh hưởng saved staff assignment, pathway/RBAC/session thế nào? `Pathways Config` hiện Blocked (`OQ-049`).

## Anomalies and unverified behavior

- `[Observed; #3–#4]` Add/Edit khác disabled state khi Name rỗng; chưa submit empty Edit nên chưa có defect.
- `[Observed; #5]` Copy tự thêm ` copy` dù Name đã đổi; chưa có requirement chứng minh sai.
- `[Observed; #7]` UI gọi `Archive`, toast gọi `deleted`; retention/Restore chưa biết.
- `[Not reproduced 2026-10-21; #5]` Duplicate ban đầu chưa thấy alert do đọc state quá sớm. Fresh reload có alert; không giữ giả thuyết silent-failure thành defect.
- `[Open Question; #6]` Audit end state, safe mapping prerequisites, empty/whitespace server validation và archive retention.

## Mutation coverage

| Workflow branch | Status (Performed/Skipped/Not supported) | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Add valid → list | Performed | — | Empty/whitespace UI guard; minimal valid | Dialog → success → row | Reload/search | Done, Archive |
| Add → Close unsaved | Skipped | Chưa chạy riêng | — | Close visible | Không | N/A |
| Add duplicate → reject | Performed | — | Duplicate rejected, message captured | Form giữ mở/error | Không thêm row; unique control reload | Done, control archived |
| Edit → Cancel | Performed | — | Draft rename | Drawer → unchanged | Reopen | Done |
| Edit → Save | Performed | — | Empty Save state, chưa submit empty | Drawer → renamed row | Reload/search | Done, Archive |
| Copy → Save | Performed | — | Tên unique, suffix quan sát | Drawer → copied row | Reload, exact Name kiểm tra khi cleanup | Done, Archive |
| Copy → Cancel | Skipped | Chưa chạy riêng | — | Cancel visible | Không | N/A |
| Assign Pathways → Save → downstream | Skipped | Chưa tạo owned pathway; không sửa shared data | Picker mở, không select | 215 option visible | Không | N/A |
| SNOMED mapping → Save | Skipped | Thiếu rule/safe domain value | Field visible | Chưa thử | Không | N/A |
| RBAC mapping → Save | Skipped | Chưa có owned prerequisite | Field visible | Chưa thử | Không | N/A |
| View Audit → audit state | Skipped | `Inconclusive`, end state chưa thấy | Hai owned records, fresh reload | Menu click, chưa có panel verified | Không | N/A |
| Archive → Cancel | Performed | — | — | Confirm dialog → row giữ nguyên | Cùng view | Done |
| Archive → Confirm | Performed | — | — | Confirm dialog → row absent | Reload + prefix search: 0 | Done, UI archive |
| Create/rename/archive → Staff Profile picker | Performed | — | Exact Name present/new/absent assertions | Source changes → fresh receiver options change | Fresh page/reopened unsaved picker | Done, source Archive, receiver Close |

- Nhánh có end state / nhánh tìm thấy: **8/14**. Validation và downstream coverage còn `partial`; không `Complete`.
- Không thấy SEND/UPLOAD/DOWNLOAD/hard-delete/Restore ở state đã mở; không khẳng định toàn feature không hỗ trợ.
- Cleanup: 4/4 owned records UI Archive (3 ở #7, 1 relationship source ở #11); receiver profile draft Close, không lưu. Final fresh-page sweep #12: 0 active Skills theo prefix toàn run, 0 owned Team/staff và 0 dialog. Archived retention chưa biết.

## Execution guidance

- `[Observed]` Tạo Name synthetic unique, ghi ledger trước action; chỉ target exact owned row.
- Chờ toast/dialog closed/row hoặc request completion; không dùng count trả ngay sau click làm end state.
- Dừng khi cần sửa shared record, recipient chưa duyệt hoặc domain value không rõ.
- Evidence: exact UI message, before/after Name đã redact, reload result, cleanup; không auth data/PII.

## Automation guidance

- `[Observed]` `Skills`, `Search Skills...`, `Add Skill`, `Edit Skill`, `Copy Skill`, `Archive Skill`, `Confirm`, `Cancel`, `Save` là landmarks hữu ích.
- `[Observed]` Add/Archive dùng dialog; Edit/Copy dùng `complementary`. Mở menu và click item trong cùng sequence, chờ target landmark sau click.
- `[Observed]` Copy Name có suffix ` copy`; dùng exact text để cleanup. Script local `skills-diagnostics.js`, `skills-cleanup.js`, `skills-staff-picker.js` giữ runtime guards và runnable assertions; diagnostics/cleanup/relationship đã chạy thành công sau khi sửa locator và exact Name. `final-cleanup-check.js` chạy read-only, full check cuối thành công; baseline Teams 17 chỉ đúng run này.
- Không sinh expected result ticket từ observation; mapping/audit/retention chưa đủ basis cho assertion nghiệp vụ.

## Provenance and gaps

- Environment: `dev`; host `blinx.dev.blinxpaco-np.com`.
- Role: `Blinx Deployment`; không claim role khác.
- Observed at: `2026-10-21`.
- Raw evidence: `test-results/product-explore/auto-20261021-1359/ledger.md#2`–`#7`, `#11`–`#12`; `skills-diagnostics.js`, `skills-cleanup.js`, `skills-staff-picker.js`, `final-cleanup-check.js`.
- Open questions: `OQ-047`, `OQ-048`.
- Resume: không retry Pathways tới khi blocker đổi; ưu tiên nhánh chưa chạy ở frontier. Staff picker relation đã verified bằng observation; saved assignment chưa thử. Skills owned records đã UI Archive.

## Tester notes
