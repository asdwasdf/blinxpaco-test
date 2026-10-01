---
name: paco-discover
description: Use when running autonomous, bounded, resumable Paco product discovery for one role in the current Claude Playwright plugin tab, outside any ticket.
---

# Paco Discover

Orchestrator cấp cha cho product discovery ngoài ticket. Chỉ skill này điều khiển vòng lặp, chọn task, lưu checkpoint và gọi child. Không ghi `docs/tickets/**/manifest.yaml` hoặc `status.md`; không thay `paco-ticket`.

## Điều kiện bắt đầu

- Cần `environment`, `role`, `run_id` và tab Claude Playwright plugin đã đăng nhập thủ công. Dùng plugin-first; không mở browser riêng, không CDP fallback, không private API. Không đọc, copy, ghi hoặc report credentials, cookies, tokens, headers hay auth state.
- CLI `npm run paco:discover` chỉ quản lý state. CLI không xác nhận đăng nhập; skill phải tự xác minh trang authenticated và đúng role trên tab trước task đầu và sau mỗi resume.
- Không tự bật `PACO_ALLOW_MUTATION`/`PACO_ALLOW_DESTRUCTIVE` và không tự tạo, sửa hay copy authorization. Mutation chỉ khả dụng khi tester đặt authorization JSON trong `playwright/.auth/discovery-authorizations/` (Git ignored, hiệu lực tối đa 24 giờ) và bật guard từ ngoài. Run migrate từ checkpoint legacy có mutation history thì authorization phải có `legacy_reviewed: true` sau khi tester review ledger cũ.

## Vòng lặp

1. Lần đầu: `npm run paco:discover -- init --environment <env> --role "<role>" [--run-id <id>] [--max-states N --max-actions N --max-minutes N] [--allow-mutation] [--legacy <checkpoint cũ>]`. Resume: `status`, rồi `resume` nếu `paused`/`blocked_auth`/`paused_budget` (budget cần limit cao hơn).
2. Nếu `status` có `pending_mutations`: không làm task mới. Quan sát read-only trên tab và chạy `reconcile --reservation <id> --status observed|indeterminate --evidence <ref> [--after <state>]`. Không chắc action đã xảy ra hay chưa → `indeterminate`; không retry tự động.
3. `next` xem task kế tiếp. Không còn task → dừng. Task read-only: `start`. Task mutation: lấy URL hiện tại từ plugin tab rồi `start --current-url <url> --authorization <file tester cấp>`. Gate từ chối → CLI ghi task `blocked` cùng gap; quay lại bước 3 để planner chọn branch an toàn khác. Chỉ `requeue --task <id> --reason "<lý do>"` khi tester đã cấp authorization/guard mới; task đã có reservation không được requeue.
4. `start` trả `mode`, `task`, `revision`, `reservation_id`. Gọi `paco-explore` mode `survey` cho `SURVEY` hoặc `paco-verify-flow` cho `VERIFY_FLOW`, truyền đúng identity, task, revision và reservation. Child chỉ trả `DiscoveryChildOutcome` JSON vào `test-results/product-survey/<run-id>/outcomes/<outcome-id>.json`.
5. `apply --outcome <file>`. Parent validate identity/revision/reservation, ownership, checksum, symlink, `## Tester notes`, redaction trước khi commit checkpoint. Lỗi validate → không sửa child artifact thay child; ghi gap và dừng task đó.
6. Khi survey view Markdown đổi: `npm run graph:generate`.
7. Lặp lại tới khi `next` trả `task: null`: CLI ghi `paused_budget` khi hết budget hoặc `exhausted` khi không còn task có provenance. Cả hai đều không phải bằng chứng đã bao phủ toàn Paco.
8. Child crash/mất context khi task đang `exploring`: `abandon --task <id> --reason "<lý do>"` (không dùng cho task đã reserve mutation — dùng `reconcile`). `pause`/`resume` bị từ chối khi còn task đang chạy.

## Blocker

- Auth hết hạn: điều hướng tab hiện tại tới `/paco/login`, child trả `auth_expired: true` và `Blocked: Authentication expired`, parent `apply` rồi dừng. Yêu cầu tester login/SSO/MFA thủ công; sau khi tester báo xong, xác minh trang authenticated và role rồi `resume`. Không tuyên bố có thể chạy tiếp unattended.
- Đổi role là thủ công, dùng run/checkpoint riêng.
- Task/candidate bị chặn không chặn branch độc lập; auth hoặc thiếu quyền toàn cục dừng mọi browser work của run.

## Kết quả

Báo run/role, revision, states đã thăm, relationships, gaps, candidates bị chặn, mutation ledger (pending/indeterminate/leftovers), budget đã dùng và lệnh resume chính xác. `Observed`/`Verified-by-Mutation` là hành vi hiện tại, không phải requirement hay expected result.
