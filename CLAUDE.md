# Paco QA Project

Black-box QA workflow cho Paco, chỉ có website và ticket.

## Phạm vi

- Chỉ Paco: `https://blinx.dev.blinxpaco-np.com/paco/dashboard`
- Input: ticket source tại `ticket/<TICKET-ID>-<short-title>/ticket.md`
- Output: artifact tại `docs/tickets/<cùng-folder>/`

## Ngôn ngữ

- Prose: tiếng Việt
- UI terms (field, button, role, status): English trong `backtick`

## Safety Policy

Mặc định **read-only**: điều hướng, xem, search, filter, sort, pagination.

**Phải hỏi trước:**

- Upload, import, gửi dữ liệu
- Bất kỳ action có side effect

Ngoại lệ đã được duyệt: `MANUAL_EXECUTE` và generated standalone Playwright spec được tự chạy side effect đúng ticket/case/action/test-data scope; riêng `paco-verify-flow` (do `paco-discover` điều phối) được tự chạy side effect cho mutation candidate đã reserve, đúng run/action/class/test-data/recipient trong authorization tester cấp ngoài agent, không cần ticket/case hay hỏi lại từng action. Chỉ trên configured dev host; vẫn bắt buộc runtime guard, safe data/recipient, mutation ledger và cleanup. Agent không tự bật guard hay tự cấp authorization. `locate`/`observe`/`survey` giữ read-only; production/unknown host luôn bị chặn.

## Ticket Convention

- Pattern: `<TICKET-ID>-<short-title>`
- Example: `PAC2-5776-intermittent-scheduler-link-needed-popup`
- Prefix có thể là `PAC2`, không giả định `PACO`
- Primary source: `ticket.md` (bắt buộc)
- Output: `docs/tickets/<cùng-tên-folder>/`

## Authentication

- Người dùng đăng nhập thủ công
- Không lưu credentials trong skill/docs/test code
- Playwright auth state: local tại `playwright/.auth/`, Git ignored

## Jira Import

- URL `https://blinxsolutions.atlassian.net/browse/<TICKET-ID>` là yêu cầu import đúng một Jira issue vào `ticket/` bằng `npm run jira:import -- <URL>`.
- Jira dùng dedicated persistent Chrome profile local tại `playwright/.auth/jira-chrome-profile/`, Git ignored; người dùng đăng nhập thủ công khi session hết hạn.
- Không export, đọc, ghi, reuse hoặc report credentials, cookies, tokens, headers, hay serialized auth state; profile chỉ được Chrome dùng cục bộ.
- Folder cùng ticket key đã tồn tại thì dừng; không merge/overwrite.
- Import thành công không tự chạy `paco-ticket`; workflow QA cần yêu cầu riêng.

## Workflow State

- Manifest: `docs/tickets/<ticket-folder>/manifest.yaml`
- Status: `docs/tickets/<ticket-folder>/status.md`
- Checkpoint cho resume sau khi hết token/context
- Input revision tracking bằng SHA-256 checksum
- Stale propagation khi source thay đổi
- Workflow: `DISCOVER → INGEST → ANALYZE → LOCATE → EXPLORE → TEST_DESIGN → MANUAL_EXECUTE → AUTOMATE → AUTOMATION_EXECUTE → REPORT → COMPLETE`
- `LOCATE` yêu cầu `environment`, `role`, manual auth và read-only mode; location clue từ tester là tùy chọn
- `LOCATE` tra reusable route trước, rồi bounded scan tối đa 12 meaningful views hoặc 15 phút
- `MANUAL_EXECUTE` phải kiểm tra kỹ từng case. Attempt đầu `Fail` cần tối thiểu ba diagnostic retries (same data, clean data, fresh page/session), control path và evidence; fail/pass không ổn định là `Inconclusive`.
- `AUTOMATE` bắt buộc tạo standalone `.spec.ts` cho mọi manual `Pass`/`Fail`; intermittent `Inconclusive` cần diagnostic spec hoặc blocker.
- `AUTOMATION_EXECUTE` chạy Playwright CLI ngay. Product result và automation verification luôn tách biệt; CLI không được ghi đè manual result.

## Knowledge và Result

- Phân biệt `Confirmed`, `Observed`, `Inferred`, `Open Question`; mọi claim có provenance
- Result chỉ dùng `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`
- Automation bắt buộc sau manual `Pass`/`Fail`; không automate assertion chỉ dựa trên `Inferred`

## Protected Content

Mọi artifact có khu vực `## Tester notes` được bảo vệ. Skill không được ghi đè; merge conflict phải dừng và báo.

## Skills

Orchestrator: `paco-ticket`
Phase skills: `paco-requirements`, `paco-explore`, `paco-test-design`, `paco-playwright`, `paco-report`

Product discovery ngoài ticket: orchestrator `paco-discover` (state qua `npm run paco:discover`), child `paco-explore` mode `survey` (read-only) và `paco-verify-flow` (mutation đã reserve). Child chỉ trả `DiscoveryChildOutcome`; chỉ `paco-discover` cập nhật discovery checkpoint.

Child skill gọi trực tiếp chỉ ghi artifact thuộc ownership và trả checkpoint proposal; chỉ `paco-ticket` cập nhật manifest/status.

**IMPORTANT**: NEVER spawn Paco skills với `isolation: "worktree"`. Tất cả artifacts và Playwright tests phải viết vào main repo (`/home/nhatpham/blinxpaco-test/`), không vào `.claude/worktrees/`.

Chi tiết: `docs/standards/`

## References

- Base design spec: `docs/superpowers/specs/2026-09-09-paco-qa-skills-design.md`
- Execution-first Playwright spec: `docs/superpowers/specs/2026-09-28-paco-execution-first-playwright-design.md`
- Standards: `docs/standards/`
- Templates: `docs/templates/`
