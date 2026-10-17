---
name: paco-playwright
description: Use when manually executing, generating, or running standalone Paco Playwright cases within the selected ticket scope.
---

# Paco Playwright

## Scope and dependencies
Only `MANUAL_EXECUTE`, `AUTOMATE`, or `AUTOMATION_EXECUTE`. Require selected valid cases, environment, role, current revision, valid local browser-auth state, and a valid `feature-location.md` for every UI-dependent case. Call `evaluateUiLocationGate()` before UI work. Read feature-location, workflow, data-safety and evidence standards plus `docs/templates/automation.md`. Missing/expired auth is `Blocked: Authentication expired`; direct tester to `npm run auth:login`. Never request credentials, read serialized auth state, infer expected behavior, broaden scope, or automate assertions based only on `Inferred`/`Open Question` knowledge.

## Ownership
Own `automation.md`, selected Playwright source, and structured `playwright_cases` proposals. Raw runner output stays in `test-results/`; durable reviewed/redacted evidence is promoted for `REPORT`. Preserve final `## Tester notes`. Never update `manifest.yaml` or `status.md`.

## Modes

### `MANUAL_EXECUTE` — mode `manual`

1. Dùng Claude Playwright MCP chạy từng case đúng environment, role, precondition và safe test data. Ghi route, role locator, sequence, observable wait, expected basis, timestamp và evidence từng attempt.
2. Kiểm tra UI result và persisted state sau reload/navigation. Dùng network observation chỉ để phân biệt nguyên nhân; không bypass UI behavior cần test.
3. Attempt đầu `Fail` phải chạy lại tối thiểu ba diagnostic attempts: cùng dữ liệu, dữ liệu mới/sạch, fresh page/session; thêm control path gần nhất. Mỗi retry phải có mục đích và evidence. Chỉ ghi `Fail` khi tái hiện ổn định hoặc evidence xác định product cause.
4. Fail rồi pass/outcome không ổn định là `Inconclusive`, không ép thành `Fail`. `Blocked`/`Not Run` phải có reason. Trước khi hoàn thành, rà acceptance criteria, requirement mapping và toàn bộ case inventory để tránh bỏ case/step.
5. Trả structured `playwright_cases[].manual`; không tạo spec trong phase này.
6. Giữ output browser gọn: case đã biết rõ expected thì `browser_run_code`/`browser_evaluate` chỉ `return` giá trị cần assert (text, count, status, error); snapshot đầy đủ khi state mới/không như kỳ vọng hoặc khi điều tra `Fail`. Log/DOM lớn cần làm evidence thì ghi file và chỉ trả path + tóm tắt. Đoạn code dài dùng lại nhiều lần thì viết ra file rồi chạy, không dán lại vào context.

### `AUTOMATE` — mode `generate`

1. Tạo standalone `.spec.ts` cho mọi manual `Pass`/`Fail`. `Fail` encode expected requirement nên spec được phép fail đúng product assertion khi defect còn tồn tại.
2. Intermittent/flaky `Inconclusive` tạo diagnostic repeat spec nhưng không encode unsupported correctness conclusion. `Blocked`/`Not Run` được skip chỉ với reason.
3. Tái dùng durable route/locator/precondition từ manual record; không dùng MCP khám phá lại. Nếu dữ liệu thiếu/stale, trả blocker để orchestrator quay lại bounded manual investigation.
4. Prefer Chromium, role locators, observable waits và sourced assertions. Không private API bypass hoặc assertion chỉ từ `Inferred`.
   - Pacing (tester yêu cầu 2026-10-02): Paco UI (PrimeReact dropdown/multiselect, modal tải slot) re-render chậm, click quá nhanh làm option detach. Mọi spec có `settle()` = `page.waitForTimeout(Number(process.env.PACO_STEP_MS ?? 1000))` sau mỗi `click`/`fill`/`press`, và chờ thêm ~3s sau khi mở modal/list tải dữ liệu, kết hợp với observable wait (không thay thế assertion).
5. Page objects: spec sinh ra phải import từ `playwright/pages/` trước (xem `playwright/pages/README.md`); locator mới đã xác minh thì thêm vào page object đúng khu vực kèm comment `Source:`, không viết inline. Page object không assert kết quả nghiệp vụ.
6. Đặt spec dưới `playwright/tests/tickets/`; filename phải chứa stable case ID. Trả spec trong artifact list với checksum cùng structured `playwright_cases[].automation` gồm spec path, diagnostic flag, reason và input revision.

### `AUTOMATION_EXECUTE` — mode `cli`

1. Chạy Playwright CLI ngay, đúng ticket/test scope; không dùng MCP.
2. Ghi exit status, case result và phân loại: `Matched product result`, `Product behavior mismatch`, `Automation defect`, `Setup or authentication failure`, hoặc `Inconclusive`.
3. CLI fail đúng expected product assertion tái hiện manual `Fail`; không phải automation defect. Locator/auth/setup failure không chứng minh product `Fail`. Không sửa product result từ automation result.
4. Trả structured `playwright_cases[].run`; evidence cần report phải durable/redacted.

## Mutation Mode

Read `manifest.yaml:mutationMode` before any side effect. If `auto`:
- Skip all approval prompts and skip the legacy `PACO_ALLOW_MUTATION` / `PACO_ALLOW_DESTRUCTIVE` env var checks for this ticket.
- Still enforce: hostname matches allowlist, safe recipient/data (no real PII), SMS requires explicit tester confirmation, production/unknown host is blocked, mutation ledger, cleanup khi khả thi và ghi `leftover` khi cleanup fail.
- If both `manifest.yaml:mutationMode=auto` and `status.md:Mutation Policy=APPROVED` exist, prefer manifest and record ledger `source=manifest` once.

If `manual` or missing: pass `mutationMode` (read from `manifest.yaml`) into `evaluateMutationGate()`; legacy behavior — require `PACO_ALLOW_MUTATION=true` and `PACO_ALLOW_DESTRUCTIVE=true` for destructive actions and ask the tester per case.

Record result chỉ bằng `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`. Raw output ở `test-results/`; không lưu credential, cookie, token, header hoặc auth state.

## Direct invocation, stop, outcome
Write only owned artifact/source and return `ChildSkillOutcome` v1 with structured cases, checksums, counts, mutation/cleanup, sensitive-data status, blockers/warnings and recommended next phase. Stale dependency/auth/data is `Blocked`; runner fault is `Failed`. Never call another skill or update workflow checkpoint.