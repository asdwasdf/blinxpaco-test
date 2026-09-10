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
- `Create`, `Update`, `Delete`, `Submit`, `Approve`, `Reject`
- Upload, import, gửi dữ liệu
- Bất kỳ action có side effect

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

## Workflow State

- Manifest: `docs/tickets/<ticket-folder>/manifest.yaml`
- Status: `docs/tickets/<ticket-folder>/status.md`
- Checkpoint cho resume sau khi hết token/context
- Input revision tracking bằng SHA-256 checksum
- Stale propagation khi source thay đổi

## Knowledge và Result

- Phân biệt `Confirmed`, `Observed`, `Inferred`, `Open Question`; mọi claim có provenance
- Result chỉ dùng `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`
- Automation tùy chọn; không automate assertion chỉ dựa trên `Inferred`

## Protected Content

Mọi artifact có khu vực `## Tester notes` được bảo vệ. Skill không được ghi đè; merge conflict phải dừng và báo.

## Skills

Orchestrator: `paco-ticket`
Phase skills: `paco-requirements`, `paco-explore`, `paco-test-design`, `paco-playwright`, `paco-report`

Child skill gọi trực tiếp chỉ ghi artifact thuộc ownership và trả checkpoint proposal; chỉ `paco-ticket` cập nhật manifest/status.

Chi tiết: `docs/standards/`

## References

- Design spec: `docs/superpowers/specs/2026-09-09-paco-qa-skills-design.md`
- Standards: `docs/standards/`
- Templates: `docs/templates/`
