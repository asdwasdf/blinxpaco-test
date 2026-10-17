# TASK: Refactor Paco Autonomous QA — MCP-first to CLI-first

## 1. Mục tiêu chính
Tôi đã xây dựng hệ thống Autonomous QA cho Paco với các skills:

- `paco-ticket`
- `paco-requirements`
- `paco-explore`
- `paco-test-design`
- `paco-playwright`
- `paco-report`
- `paco-discover`
- `paco-verify-flow`
- `paco-video-flow`

Hiện tại hệ thống dùng Playwright MCP quá nhiều, đặc biệt trong `MANUAL_EXECUTE`, khiến quá trình testing rất chậm.

**Tôi muốn Claude trở thành một QA Tester tự chủ, hiểu Paco, tự thiết kế test, tự thực thi, tìm bugs, điều tra lỗi và học từ các ticket đã làm.**

Hãy chuyển kiến trúc từ MCP-first sang **CLI-first**, lấy execution pattern của `paco-video-flow` làm tham chiếu:

`Understand → Generate Playwright Spec → Execute CLI → Diagnose → Report → Learn`

### Nguyên tắc cốt lõi

- Claude chịu trách nhiệm QA reasoning.
- Playwright CLI chịu trách nhiệm thực thi phần lớn các test flows.
- Playwright MCP chỉ dùng khi cần khám phá UI chưa biết, xác minh locator, xử lý unexpected states hoặc điều tra lỗi.
- Product knowledge graph phải được sử dụng lại ở những ticket tiếp theo.
- Không được giảm test coverage hay chất lượng evidence để tăng tốc độ.
- Không được nới lỏng bất kỳ safety guard nào.

**Yêu cầu: Thực sự implement trong repository, không chỉ chỉnh `SKILL.md` hoặc viết design document.**

## 2. Audit toàn bộ kiến trúc hiện tại

Trước khi sửa, hãy đọc và kiểm tra:

- `CLAUDE.md`
- `paco.config.yaml`
- Toàn bộ 9 Paco skills.
- `docs/standards/`
- `docs/templates/`
- `docs/product/feature-map.md`
- `docs/product/workflows/`
- `docs/product/survey/`
- `playwright/pages/`
- Playwright configuration.
- Workflow state machine.
- Manifest/checkpoint schemas.
- Runtime safety guards.
- Existing unit/integration tests.

Đặc biệt tìm tất cả dependencies đang bắt buộc:

`MANUAL_EXECUTE → AUTOMATE → AUTOMATION_EXECUTE`

Kiểm tra:

- `reconcileManifest()`
- `applyPlaywrightOutcome()`
- `ChildSkillOutcome`
- `playwright_cases`
- Phase transition validators
- Report prerequisites
- Mutation authorization
- Artifact ownership
- Stale propagation

Không giả định implementation path khi chưa kiểm tra repository.

## 3. Workflow mới

Thiết kế CLI-first pipeline:

`INGEST → ANALYZE → LOCATE → TEST_DESIGN → AUTOMATE → AUTOMATION_EXECUTE → DIAGNOSE (when needed) → REPORT → COMPLETE`

Giữ `DISCOVER` initialization nếu workflow hiện tại yêu cầu.

`EXPLORE` và manual MCP investigation trở thành các bước có điều kiện thay vì bắt buộc cho mọi ticket.

Nếu cần thêm phase `DIAGNOSE`, hãy cập nhật state machine, schemas, validators và resume logic đồng bộ.

Nếu có thể thực hiện diagnosis như sub-state hoặc bounded corrective loop mà không thêm phase mới, ưu tiên phương án ít phá backward compatibility hơn.

### ANALYZE

Claude phải:

- Đọc ticket, acceptance criteria, attachments và video.
- Hiểu expected behavior.
- Truy xuất product knowledge liên quan.
- Phân biệt requirement với observed behavior.
- Không tự tạo expected result chỉ dựa trên UI hiện tại.

### LOCATE

- Tra product graph và feature map trước.
- Tái sử dụng verified routes và page objects.
- Xác minh knowledge chưa stale.
- Chỉ sử dụng Playwright MCP khi cần tìm route/locator chưa biết.
- Không khám phá lại toàn bộ feature nếu đã có durable evidence phù hợp.
- Giữ bounded investigation, environment, role và auth checks.

### TEST_DESIGN

Claude phải thiết kế test như một QA Engineer có kinh nghiệm.

Bao gồm khi phù hợp:

- Happy paths.
- Negative cases.
- Boundary values.
- Field validations.
- State transitions.
- Permissions/roles.
- Error handling.
- Historical defect regression.
- Cross-feature regression.
- Edge cases.

Bắt buộc tra:

- Product graph.
- Matching workflows.
- Historical defects.
- Related feature dependencies.
- Previous test evidence.

Mỗi test case phải có expected-result basis và provenance.

Nếu expected result chưa đủ cơ sở, đánh dấu exploratory investigation thay vì tự tạo assertion.

### AUTOMATE

Đây là thay đổi quan trọng nhất.

**Generate Playwright standalone `.spec.ts` trước khi thực hiện manual MCP testing.**

Không yêu cầu manual result `Pass`/`Fail` trước khi generate.

Sử dụng:

- Requirements.
- Versioned test cases.
- Verified routes.
- Existing page objects.
- Product graph.
- Workflow knowledge.
- Video flow notes.
- Historical regression patterns.

Yêu cầu với mỗi spec:

- Stable case ID.
- Standalone executable.
- Page objects từ `playwright/pages/`.
- Verified locators.
- Observable waits.
- Sourced assertions.
- Test data isolation.
- Runtime mutation guards.
- Evidence.
- Cleanup/leftover handling.
- Environment/role verification.

Nếu thiếu locator hoặc UI precondition, chạy bounded MCP investigation đúng phần thiếu rồi quay lại generate.

Không dùng MCP để replay toàn bộ flow đã biết.

### AUTOMATION_EXECUTE

Chạy Playwright CLI trực tiếp.

Đây là execution path chính.

Collect:

- Case ID.
- Execution timestamp.
- Environment/role.
- Expected basis.
- Actual observed behavior.
- Assertion result.
- Runner status.
- Trace/screenshots when useful.
- Mutation ledger.
- Cleanup results.

Phân loại riêng:

1. Matched product behavior.
2. Product behavior mismatch.
3. Automation defect.
4. Setup/authentication failure.
5. Inconclusive execution.

Không kết luận product `Fail` chỉ vì CLI exit code khác 0.

Không kết luận product `Pass` chỉ vì script chạy thành công nếu assertion chưa chứng minh đúng requirement.

### DIAGNOSE

Khi xuất hiện unexpected failure:

- Kiểm tra locator.
- Kiểm tra waits.
- Kiểm tra setup/preconditions.
- Kiểm tra test data.
- Kiểm tra actual UI behavior.
- Chạy diagnostic attempts: same data, clean data, fresh page/session và control path theo chuẩn hiện tại.
- Ghi evidence từng attempt.
- Không retry mutation khi trạng thái side effect chưa rõ.
- Dùng MCP chỉ khi CLI evidence không đủ.
- Không sửa assertion để che giấu product defect.
- Flaky/inconsistent outcome phải là `Inconclusive` nếu chưa đủ bằng chứng kết luận.

Giữ kết quả product độc lập với automation technical result.

### REPORT

Cập nhật reporting để chấp nhận product result được xác minh qua Playwright CLI.

Không còn yêu cầu bắt buộc manual MCP result.

Vẫn giữ hai phần:

**Product Result**

- `Pass`
- `Fail`
- `Blocked`
- `Not Run`
- `Inconclusive`

**Automation Verification**

- Runner status.
- Assertion verification.
- Automation defect.
- Setup/auth failure.
- Diagnostic outcome.

Báo cáo đầy đủ:

- Requirement coverage.
- Case results.
- Defects.
- Reproduction steps.
- Evidence.
- Limitations.
- Mutation/cleanup.
- Unresolved questions.

### LEARN

Sau ticket, agent phải cập nhật knowledge để lần sau test thông minh hơn.

Tận dụng cơ chế knowledge sync hiện tại trong `paco-explore` và `paco-report`.

Cập nhật:

- Verified product workflows.
- Related feature relationships.
- Historical defect patterns.
- Regression risks.
- Feature routes.
- Useful testing strategies.
- Unresolved questions.
- Knowledge conflicts.
- Provenance.

Không biến observed buggy behavior thành expected business rule.

Không tự nâng `Observed` hoặc `Inferred` thành `Confirmed`.

## 4. Các skills cần chỉnh sửa

### `paco-ticket`

- Chuyển orchestration sang CLI-first.
- Loại bỏ dependency bắt buộc manual MCP trước automation.
- Hỗ trợ bounded diagnosis.
- Cho phép conditional `EXPLORE`.
- Giữ stable case IDs, artifact validation và checkpoints.
- Bảo vệ ticket cũ đang dùng MCP-first.

### `paco-playwright`

- `generate`: chạy trước product execution.
- `cli`: thực thi product test chính.
- `manual`: fallback/diagnostics.
- Cho phép CLI-derived Product Result có evidence.
- Giữ mutation gate, cleanup, diagnostics.
- Giữ tách biệt product result và automation result.

### `paco-test-design`

- Bắt buộc sử dụng knowledge graph.
- Bổ sung risk-based regression từ historical defects.
- Phân biệt executable cases và exploratory investigations.
- Không tăng số lượng test case một cách máy móc.

### `paco-report`

- Hỗ trợ CLI-first test evidence.
- Không bắt buộc manual MCP records.
- Đồng bộ product knowledge.
- Không sửa kết quả product chỉ dựa vào runner exit status.

### `paco-explore`

- Giữ nguyên survey/discovery behavior.
- Tái sử dụng verified knowledge.
- Chỉ điều tra phần UI thiếu hoặc stale.
- Không lặp discovery không cần thiết.

### `paco-video-flow`

Giữ pattern:

`Video → Frames → Understand Flow → Generate Spec → CLI`

Nhưng đồng bộ với pipeline:

- Spec ownership.
- Authorization.
- Expected assertion basis.
- Evidence preservation.
- Checkpoint handling.

Không dùng `APPROVED` flag để bypass runtime safety gate.

Không coi lỗi được quay trong video là expected behavior đúng.

### `paco-discover` / `paco-verify-flow`

Giữ nguyên discovery architecture:

- Product tree map.
- UI states.
- Relationships.
- Mutation reservations.
- Authorization.
- Discovery checkpoints.
- Ledger.
- Provenance.

Chỉ chỉnh nếu cần tích hợp hoặc sửa lỗi tương thích.

## 5. Performance Optimization

Mục tiêu là giảm đáng kể số MCP round-trips.

- Known flows chạy bằng CLI.
- Reuse page objects.
- Không snapshot lặp lại cùng state.
- Không trả full DOM/HTML/log vào context.
- Dùng files lưu evidence.
- Ưu tiên observable waits.
- Giữ pacing khi cần cho PrimeReact controls.
- Không bắt buộc fixed sleep sau mọi thao tác nếu control đã ổn định.
- Chỉ MCP investigation khi thiếu thông tin.

Đừng đánh đổi test stability lấy tốc độ.

## 6. Safety Requirements

**Non-negotiable.**

- Chỉ configured dev hosts.
- Production/unknown hosts luôn bị chặn.
- Không tự bật `PACO_ALLOW_MUTATION`.
- Không tự bật `PACO_ALLOW_DESTRUCTIVE`.
- Không tự tạo hoặc mở rộng authorization.
- Mọi side effect phải pass runtime mutation gate.
- Scope theo ticket/case/action/test-data.
- Chỉ dùng safe `QA-test` data.
- Không dùng real patient PII.
- Email chỉ gửi recipient đã được phê duyệt.
- SMS yêu cầu authorization phù hợp.
- Mutation ledger bắt buộc.
- Cleanup/leftovers bắt buộc.
- Không đọc hoặc lưu credentials/cookies/tokens/headers/auth state.
- Không tự giả định CLI dùng được auth của MCP tab.
- Giữ manual authentication.

**Never spawn Paco skills with `isolation: "worktree"`.**

Mọi artifacts và Playwright tests phải ở main repository.

Không ghi đè `## Tester notes`.

## 7. Runtime Implementation

Không chỉ sửa instructions.

Cập nhật implementation cần thiết:

- Workflow state machine.
- Transition validation.
- Manifest schema.
- Checkpoint logic.
- `ChildSkillOutcome`.
- `playwright_cases` schema.
- `applyPlaywrightOutcome()`.
- Execution result aggregation.
- Evidence validation.
- Source checksums.
- Stale propagation.
- Report prerequisites.
- CLI runner.
- Documentation/tests.

Đảm bảo backward compatibility.

Ưu tiên thêm `executionMode: cli_first` cho ticket mới và giữ existing MCP-first runs.

Không tự rewrite old execution histories.

## 8. Tests bắt buộc

Bổ sung automated tests để xác minh:

1. Ticket mới có đủ knowledge thực thi CLI-first mà không cần manual MCP.
2. Missing locator kích hoạt bounded investigation.
3. Product mismatch được điều tra đúng.
4. Locator failure không trở thành product `Fail`.
5. Auth failure được đánh dấu `Blocked`.
6. Flaky execution được đánh dấu `Inconclusive`.
7. Unauthorized mutation bị chặn.
8. Existing checkpoints không bị phá.
9. Product knowledge sync hoạt động.
10. `paco-video-flow` tương thích pipeline mới.

Chạy unit tests, integration tests và repository validators.

Không cần chạy browser mutation thực tế nếu chưa có authorization.

## 9. Benchmark

Thiết lập benchmark so sánh cùng một flow:

- MCP-first.
- CLI-first.

Đo:

- Total execution time.
- MCP tool calls.
- Model/tool round-trips.
- Browser execution duration.
- Fixed wait duration.
- Evidence completeness.
- Outcome consistency.

Không bịa kết quả benchmark.

Nếu không có môi trường/auth để chạy, cung cấp benchmark harness và ghi `Not Run`.

## 10. Implementation Instructions

Hãy thực hiện tuần tự:

1. Audit toàn bộ dependencies.
2. Xác định minimal migration plan.
3. Implement runtime CLI-first.
4. Update related skills.
5. Update schemas/validators/checkpoints.
6. Update documentation.
7. Add/modify tests.
8. Run validation.
9. Fix regressions.
10. Report changes and remaining blockers.

Không dừng lại ở design phase.

Không chỉ chỉnh Markdown.

Không rewrite toàn bộ project nếu có thể tái sử dụng existing architecture.

Không tự thay đổi business rules.

Không mở rộng safety authorization.

## Definition of Done

Hệ thống phải cho phép workflow:

**Tôi giao ticket → Claude hiểu ticket và Paco → Claude tự thiết kế test → Claude generate `.spec.ts` → Playwright CLI chạy → Claude điều tra lỗi → QA report → Product knowledge update.**

Không bắt buộc Claude phải chạy manual MCP cho tất cả test cases trước khi tạo automation.

Chỉ dùng Playwright MCP khi cần khám phá hoặc điều tra.

Giữ toàn bộ safety, traceability, checkpoints và knowledge graph hiện có.

**Ưu tiên hàng đầu: biến Claude thành Autonomous QA Tester thực sự, thay vì một agent dành phần lớn thời gian thao tác Playwright MCP.**