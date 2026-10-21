---
name: paco-discover
description: Use when running autonomous, bounded, resumable Paco product discovery for one role in the current Claude Playwright plugin tab, outside any ticket.
---

# Paco Discover

Orchestrator cấp cha cho product discovery ngoài ticket. Chỉ skill này điều khiển vòng lặp, chọn task, lưu checkpoint và gọi child. Không ghi `docs/tickets/**/manifest.yaml` hoặc `status.md`; không thay `paco-ticket`.

## Điều kiện bắt đầu

- Cần `environment`, `role`, `run_id` và tab Claude Playwright plugin đã đăng nhập. Dùng plugin-first; không mở browser riêng, không CDP fallback, không private API. Không đọc, copy, ghi hoặc report credentials, cookies, tokens, headers hay auth state.
- CLI `npm run paco:discover` chỉ quản lý state. CLI không xác nhận đăng nhập; skill phải tự xác minh trang authenticated và đúng role trên tab trước task đầu và sau mỗi resume.

**Auto-login pre-flight (before init/resume):**
1. Run `CHECK_AUTH_SCRIPT` from `scripts/paco-auth-helper.ts` via `browser_evaluate`. If `authenticated: true` → proceed.
2. If `authenticated: false`, call `buildFullLoginScript()` from `scripts/paco-auth-helper.ts` via `browser_evaluate`. Retry `CHECK_AUTH_SCRIPT`.
3. If still unauthenticated, direct tester to `npm run auth:login`; stop until tester confirms.
- Discovery không có ticket `manifest.yaml`. Mutation trong discovery chỉ chạy khi đủ cả ba (đều do tester cấp ngoài agent): checkpoint init với `--allow-mutation` (thiếu flag → planner không bao giờ chọn task `mutation`), `PACO_ALLOW_MUTATION=true` trong shell chạy CLI (destructive thêm `PACO_ALLOW_DESTRUCTIVE=true`), và authorization JSON theo `DiscoveryAuthorization` dưới `playwright/.auth/discovery-authorizations/` khớp run/action/class/test-data fingerprint/ownership_ref. Mutations là thao tác khám phá bình thường khi đủ điều kiện; không hỏi lại từng action.
- **Ask QA early:** khi bắt đầu run, nếu tester muốn khám phá có mutation thì nhắc một lần đủ ba điều kiện trên. Khi survey trả candidates, gom tất cả candidate `pending` (action, class, fingerprint, ownership_ref, recipient) thành một danh sách để tester cấp authorization theo lô, thay vì để từng task bị `blocked` im lặng. Không tự ghi authorization hay bật guard.
- Không có ý định reserve/ticket mà tester chỉ muốn đào sâu một feature: dùng `paco-explore` mode `interact` (ngoài vòng lặp này, không sửa checkpoint).

Safety still enforced in `auto` mode: hostname allowlist, safe test data (no real PII, `QA-test` prefix on records this run creates; historical `QA-AUTO` accepted), approved recipient for `SEND` (`fiona.nguyen@blinxsolutions.com` for email; SMS requires explicit tester confirmation each time), production/unknown host blocked, mutation ledger written with redacted before/after state, cleanup owned records on success, leftover log on cleanup fail. External authorization from tester is still required for destructive mutations and for SMS.

**Guard ownership:** Không tự bật `PACO_ALLOW_MUTATION` / `PACO_ALLOW_DESTRUCTIVE`, không tự ghi `manifest.yaml` ngoài `applyTicketMutationMode()`, không tự cấp authorization. Tester cấp authorization destructive riêng cho từng run khi `VERIFY_FLOW` chuẩn bị thực thi destructive mutation.

## Vòng lặp

1. Lần đầu: `npm run paco:discover -- init --environment <env> --role "<role>" [--run-id <id>] [--max-states N --max-actions N --max-minutes N] [--allow-mutation] [--legacy <checkpoint cũ>]`. Resume: `status`, rồi `resume` nếu `paused`/`blocked_auth`/`paused_budget` (budget cần limit cao hơn).
2. Nếu `status` có `pending_mutations`: không làm task mới. Quan sát read-only trên tab và chạy `reconcile --reservation <id> --status observed|indeterminate --evidence <ref> [--after <state>]`. Không chắc action đã xảy ra hay chưa → `indeterminate`; không retry tự động.
3. `next` xem task kế tiếp. Không còn task → dừng. Task read-only: `start`. Task mutation: lấy URL hiện tại từ plugin tab rồi `start --current-url <url> --authorization <file tester cấp>`. Gate từ chối → CLI ghi task `blocked` cùng gap; quay lại bước 3 để planner chọn branch an toàn khác. Chỉ `requeue --task <id> --reason "<lý do>"` khi tester đã cấp authorization/guard mới; task đã có reservation không được requeue.
4. `start` trả `mode`, `task`, `revision`, `reservation_id`. Gọi `paco-explore` mode `survey` cho `SURVEY` hoặc `paco-verify-flow` cho `VERIFY_FLOW`, truyền đúng identity, task, revision và reservation; với `VERIFY_FLOW` truyền thêm candidate đã reserve (từ `status`/checkpoint: action, class, `test_data_fingerprint`, `ownership_ref`, recipient/destination) và đường dẫn authorization đã dùng cho `start`. Child chỉ trả `DiscoveryChildOutcome` JSON vào `test-results/product-survey/<run-id>/outcomes/<outcome-id>.json`.
5. `apply --outcome <file>`. Parent validate identity/revision/reservation, ownership, checksum, symlink, `## Tester notes`, redaction trước khi commit checkpoint. Lỗi validate → không sửa child artifact thay child; ghi gap và dừng task đó.
6. Khi survey view Markdown đổi: `npm run graph:generate`.
7. Task `mutation` xếp sau `module/branch/handoff/transition`; nếu run kết thúc do budget mà còn candidate `pending`, báo rõ và đề xuất `resume` với limit cao hơn thay vì coi là đã khám phá.
8. Lặp lại tới khi `next` trả `task: null`: CLI ghi `paused_budget` khi hết budget hoặc `exhausted` khi không còn task có provenance. Cả hai đều không phải bằng chứng đã bao phủ toàn Paco.
9. Child crash/mất context khi task đang `exploring`: `abandon --task <id> --reason "<lý do>"` (không dùng cho task đã reserve mutation — dùng `reconcile`). `pause`/`resume` bị từ chối khi còn task đang chạy.

## Blocker

- Auth hết hạn: điều hướng tab hiện tại tới `/paco/login`, child trả `auth_expired: true` và `Blocked: Authentication expired`, parent `apply` rồi dừng. Yêu cầu tester login/SSO/MFA thủ công; sau khi tester báo xong, xác minh trang authenticated và role rồi `resume`. Không tuyên bố có thể chạy tiếp unattended.
- Đổi role là thủ công, dùng run/checkpoint riêng.
- Task/candidate bị chặn không chặn branch độc lập; auth hoặc thiếu quyền toàn cục dừng mọi browser work của run.

## Kết quả

Báo run/role, revision, states đã thăm, relationships, gaps, mutation coverage (candidates: executed / blocked + lý do / pending chưa authorization / chưa chạy do budget; persistence quan sát; cleanup), mutation ledger (pending/indeterminate/leftovers), budget đã dùng và lệnh resume chính xác. `Observed`/`Verified-by-Mutation` là hành vi hiện tại, không phải requirement hay expected result.
