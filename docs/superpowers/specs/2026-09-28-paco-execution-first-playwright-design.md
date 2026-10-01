# Thiết kế execution-first Playwright cho Paco QA

- **Ngày:** 2026-09-28
- **Trạng thái:** Đã được người dùng duyệt ngày 2026-09-28
- **Phạm vi:** Thay đổi workflow và bộ skill QA Paco

## 1. Mục tiêu

Giảm việc Claude Playwright MCP phải đọc và khám phá lại flow ở mỗi lần test. MCP được dùng để khám phá và chạy manual kỹ một lần; sau đó workflow phải tạo Playwright test chạy độc lập bằng CLI cho mọi test case có manual result đủ điều kiện.

Success criteria:

1. Mọi case có manual result `Pass` hoặc `Fail` đều có `.spec.ts` tương ứng.
2. Case `Inconclusive` do intermittent/flaky có regression spec lặp đủ lần để thu evidence, nhưng không encode kết luận chưa được xác nhận.
3. Spec được chạy ngay bằng Playwright CLI sau khi tạo.
4. Lần chạy sau có thể dùng spec mà không cần MCP khám phá lại route, locator và flow.
5. Báo cáo tách product result khỏi automation verification result.
6. Manual `Fail` chỉ được ghi sau protocol kiểm chứng nghiêm ngặt, tránh false negative do setup, state, timing hoặc thao tác thiếu.

## 2. Quyết định đã duyệt

- Chọn workflow đổi thứ tự phase, không quay ngược state machine và không gộp manual execution với automation.
- Test có side effect được phép sinh spec và chạy CLI tự động trong workflow QA Paco mà không hỏi lại từng lần.
- Authorization trên không cho phép mở rộng ngoài ticket, test case, environment, role và test data đã xác định.
- Spec phải dùng dữ liệu test an toàn; cleanup khi khả thi; ghi rõ leftovers nếu cleanup thất bại.
- `Blocked` và `Not Run` không bắt buộc có spec.
- Không tạo assertion về product correctness chỉ dựa trên knowledge `Inferred`.
- Sau khi sinh spec, workflow bắt buộc chạy CLI và lưu result/evidence.

## 3. State machine mới

```text
DISCOVER
  → INGEST
  → ANALYZE
  → LOCATE
  → EXPLORE
  → TEST_DESIGN
  → MANUAL_EXECUTE
  → AUTOMATE
  → AUTOMATION_EXECUTE
  → REPORT
  → COMPLETE
```

Các phase `AUTOMATION_REVIEW` và `EXECUTE` cũ bị thay thế:

- Giá trị automation không còn là gate cho việc tạo spec sau manual execution.
- Việc đánh giá feasibility được thực hiện trong `AUTOMATE`, nhưng chỉ có thể skip từng case vì lý do hợp lệ: manual result là `Blocked`/`Not Run`, expected behavior chưa đủ cơ sở để assertion, hoặc không thể tạo executable setup an toàn. Mọi skip phải được ghi rõ.
- `EXECUTE` được tách thành `MANUAL_EXECUTE` và `AUTOMATION_EXECUTE` để result không bị trộn và resume đúng bước.

## 4. Trách nhiệm phase

### 4.1. `MANUAL_EXECUTE`

Claude Playwright MCP chạy từng test case theo protocol tại mục 5. Artifact phải lưu:

- Test case ID và requirement mapping.
- Environment, role, precondition và test-data identity đã redact.
- Route, locator, interaction sequence và observable waits đã dùng.
- Result: `Pass`, `Fail`, `Blocked`, `Not Run` hoặc `Inconclusive`.
- Evidence cho từng attempt và control path.
- Mutation, cleanup và leftovers.
- Basis của expected result: `Confirmed`, `Observed`, `Inferred` hoặc `Open Question`.

`MANUAL_EXECUTE` không viết `.spec.ts`.

### 4.2. `AUTOMATE`

Tạo Playwright `.spec.ts` chạy độc lập từ durable knowledge của `MANUAL_EXECUTE`:

- `Pass`: encode expected behavior đã quan sát/xác nhận.
- `Fail`: encode expected behavior đúng theo requirement. Spec được kỳ vọng fail nếu product defect vẫn còn.
- `Inconclusive` intermittent/flaky: tạo diagnostic regression spec chạy lặp, thu outcome từng attempt; không dùng một assertion chưa đủ căn cứ để tuyên bố product `Pass`/`Fail`.
- `Blocked`/`Not Run`: không bắt buộc tạo spec; ghi lý do.

Spec phải dùng route/locator/precondition đã lưu, không gọi MCP để khám phá lại trừ khi durable data thiếu hoặc stale. Mỗi spec có mapping về ticket/test case và không dùng fixed sleep hay private API bypass.

### 4.3. `AUTOMATION_EXECUTE`

Chạy spec vừa tạo bằng Playwright CLI đúng ticket/test scope. Artifact phải lưu:

- Command/scope đã chạy.
- Exit status.
- Result theo từng case.
- Phân loại mismatch: product behavior, automation defect, setup/auth, hoặc inconclusive.
- Trace/screenshot/video/report reference theo cấu hình.
- Mutation, cleanup và leftovers.

Automation result không được ghi đè manual product result.

### 4.4. `REPORT`

Tách hai phần:

1. **Product result:** kết luận từ manual execution đã kiểm chứng.
2. **Automation verification:** spec có chạy được không, kết quả có khớp manual observation không, và có automation defect hay flaky signal không.

Manual `Fail` + CLI `Fail` đúng assertion là defect được tái hiện, không phải automation failure. CLI fail do locator/setup/auth là automation verification failure và không tự chứng minh product defect.

## 5. Protocol manual execution bắt buộc

Mỗi test case phải:

1. Xác nhận đúng environment, role, precondition và test data trước khi thao tác.
2. Thực hiện đầy đủ từng step; không suy đoán result từ UI trung gian.
3. Kiểm tra observable UI result và persisted state sau reload/navigation; kiểm tra network/API chỉ khi cần phân biệt nguyên nhân và không bypass UI behavior cần test.
4. Thu evidence, timestamp và dữ liệu đã redact cho từng attempt.
5. Đối chiếu acceptance criteria và expected-result provenance trước khi kết luận.

Nếu attempt đầu `Fail`:

1. Chạy lại tối thiểu ba attempt có mục đích:
   - cùng dữ liệu và precondition;
   - dữ liệu mới/sạch;
   - fresh page hoặc fresh authenticated session khi phù hợp.
2. Chạy control path gần nhất để loại lỗi setup, quyền, stale state, timing hoặc test data.
3. Chỉ kết luận `Fail` khi lỗi tái hiện ổn định hoặc có evidence xác định nguyên nhân product.
4. Nếu fail rồi pass, hoặc outcome không ổn định, dùng `Inconclusive`; ghi intermittent/flaky signal và toàn bộ attempt.
5. Không retry mù để tìm một lần pass; mỗi retry phải có mục đích chẩn đoán được ghi lại.

Trước khi hoàn tất phase, phải rà toàn bộ acceptance criteria, requirement mapping và test case inventory để phát hiện case/step bị bỏ sót.

## 6. Safety và side effect

Authorization đã duyệt cho phép `Create`, `Update`, `Delete`, `Submit`, `Approve`, `Reject`, upload/import và các side effect cần thiết khi chúng nằm trong test case của ticket và được chạy ở configured dev environment.

Guard vẫn bắt buộc:

- Chặn production và unknown host.
- Không mở rộng scope sang flow ngoài ticket.
- Dùng test data/recipient riêng, tránh dữ liệu thật.
- Cleanup khi khả thi; cleanup failure phải được ghi và báo.
- Ghi mutation ledger đã redact.
- Không lưu credential, cookie, token, auth header hoặc serialized auth state.
- Destructive action không cần thiết cho expected result vẫn bị cấm.

## 7. Artifact và ownership

- `paco-ticket`: duy nhất cập nhật `manifest.yaml` và `status.md`; enforce state transition/gate.
- `paco-playwright`: sở hữu manual execution record, `automation.md`, selected `.spec.ts`, CLI result và raw `test-results/`.
- `paco-report`: tổng hợp product result và automation verification; không đổi result nguồn.
- `## Tester notes`: luôn được bảo vệ.

`automation.md` cần mapping tối thiểu:

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|

## 8. Resume, validation và migration

### Gate

- Không vào `AUTOMATE` nếu `MANUAL_EXECUTE` chưa hoàn thành hoặc dependency stale.
- Không hoàn thành `AUTOMATE` nếu case `Pass`/`Fail` thiếu spec.
- Case `Inconclusive` intermittent/flaky phải có diagnostic spec hoặc blocker cụ thể.
- Không vào `REPORT` nếu spec mới chưa qua `AUTOMATION_EXECUTE`, trừ blocker kỹ thuật được ghi rõ.
- `COMPLETE` không yêu cầu product pass; yêu cầu mọi case và automation artifact đã được xử lý hoặc có lý do hợp lệ.

### Migration manifest cũ

- Giữ nguyên checkpoint history.
- Map `EXECUTE` cũ sang `MANUAL_EXECUTE` khi evidence cho thấy plugin/manual execution; nếu không phân biệt được, đánh dấu cần reconcile.
- Existing `.spec.ts` được reconcile vào `AUTOMATE` theo checksum và case mapping.
- Existing CLI run được reconcile vào `AUTOMATION_EXECUTE` chỉ khi scope/result provenance rõ.
- `AUTOMATION_REVIEW` cũ được lưu lịch sử nhưng không còn là phase gate.
- Không tự coi workflow cũ `COMPLETE` là đáp ứng rule mới; chỉ yêu cầu backfill khi ticket được resume hoặc người dùng yêu cầu migration.

## 9. Error handling

- Auth hết hạn: `Blocked`, không phải product `Fail`.
- MCP/browser/runner lỗi: phase `Failed` hoặc `Blocked` tùy khả năng retry; không đổi product result.
- Locator stale trong CLI: automation defect; sửa spec từ durable evidence hoặc quay lại MCP có giới hạn nếu UI thực sự đổi.
- Expected result chỉ `Inferred`: không assertion correctness; hỏi QA sớm hoặc tạo diagnostic observation.
- Cleanup thất bại: ghi leftovers, dừng destructive continuation khi có nguy cơ tích lũy dữ liệu.
- Manual/CLI mismatch: giữ cả hai result, điều tra nguyên nhân, không tự chọn result thuận lợi.

## 10. Kiểm thử thay đổi bộ skill

Cần có runnable checks tối thiểu:

1. Workflow mới chọn đúng phase đầu tiên chưa hoàn thành.
2. `Pass`/`Fail` thiếu spec làm `AUTOMATE` chưa hoàn thành.
3. `Blocked`/`Not Run` có lý do được phép không có spec.
4. `Inconclusive` intermittent thiếu diagnostic spec/blocker bị từ chối.
5. `REPORT` bị chặn khi chưa chạy CLI.
6. Manual `Fail` không bị đổi thành automation failure khi CLI fail đúng assertion.
7. Mutation chạy được trên configured dev host, bị chặn trên production/unknown host.
8. Migration giữ checkpoint history và không ghi đè `## Tester notes`.
9. Source revision thay đổi làm các phase phụ thuộc stale.
10. Direct child-skill invocation chỉ ghi artifact thuộc ownership, không tự cập nhật manifest/status.

## 11. Files dự kiến thay đổi

Tối thiểu:

- `.claude/skills/paco-ticket/SKILL.md`
- `.claude/skills/paco-playwright/SKILL.md`
- `.claude/skills/paco-report/SKILL.md`
- `docs/standards/workflow-and-checkpoints.md`
- `docs/templates/manifest.yaml`
- `docs/templates/status.md`
- `docs/templates/automation.md`
- `scripts/manifest-utils.ts`
- Tests workflow/manifest liên quan
- `CLAUDE.md` để cập nhật phase list

Các template/result artifact khác chỉ sửa khi validation hoặc ownership thực tế yêu cầu.