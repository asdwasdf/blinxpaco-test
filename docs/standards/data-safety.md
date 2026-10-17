# Data Safety Standards

## Mutation Classes

- `None`: read-only, mặc định được phép
- `Temporary`: có cleanup tin cậy, cần approval
- `Persistent`: để lại dữ liệu, cần approval per-run
- `Destructive`: delete/bulk/hard-to-undo, cần approval riêng
- `Unknown`: xử lý như persistent

## Dev Authorization

Trên environment `dev` và hostname nằm trong `paco.config.yaml` safety allowlist, approved test scope hoặc `paco-verify-flow` với authorization discovery tester cấp được phép `Create`, `Update`, `Save`, `Submit`, `Send`, `Delete`, `Approve`, `Reject`, upload, import, download và relevant external dev flow. Production hoặc unknown host luôn bị chặn.

`Send` cần test recipient/destination đã xác minh. Thiếu domain rule, expected result hoặc safe test data phải Ask QA early; không đoán. Mọi mutation ghi ledger đã redact và cleanup khi không phá dữ liệu nền.

### `auto` mutation mode (default trên configured dev host)

Khi `manifest.yaml:mutationMode === 'auto'` (set by `applyTicketMutationMode()` on intake khi host thuộc `safety.allowedHosts` hoặc `safety.externalDevHosts` của dev), mutations là QA operation bình thường, không phải action cần approval từng case:

- `MANUAL_EXECUTE`, standalone Playwright spec, `paco-verify-flow` reserved mutation, `paco-video-flow` direct run, `paco-discover` survey mutation — tất cả chạy CRUD/submit/send/cleanup trên owned test data (`QA-test` prefix) mà không cần hỏi lại từng action.
- Manifest authorization là primary gate. Mỗi mutation vẫn phải pass `evaluateMutationGate()` runtime check.
- Safety thật vẫn enforce: hostname allowlist, safe test data (no real PII, `QA-test` prefix), approved recipient (`fiona.nguyen@blinxsolutions.com` cho email; SMS cần explicit tester confirmation từng lần), production/unknown host blocked, mutation ledger đã redact, cleanup on pass/fail, leftover log on cleanup fail.
- Destructive mutation, bulk delete, hay side effect ngoài test scope vẫn cần reservation riêng (qua `paco-verify-flow` cho discovery, qua `Mutation Policy: APPROVED` trong `status.md` cho ticket).

### `manual` mutation mode (legacy fallback)

Khi `manifest.yaml:mutationMode` vắng mặt hoặc bằng `manual` (host ngoài allowlist, hoặc tester/intake force), giữ legacy behavior:
- Hỏi tester per case cho mỗi mutation class khác `None`.
- Env var guards còn áp dụng như runtime safety.

## Safety Gates

### Design-time
- Test case ghi mutation class
- Automation assessment ghi approval status

### Runtime
Trong `auto` mode: `manifest.yaml:mutationMode === 'auto'` là authorization chính. Gate `evaluateMutationGate()` enforce hostname, data, recipient, ledger, cleanup. Env var guards là optional local safety override, không phải primary gate.

Trong `manual` mode: env var guards còn là primary runtime gate:
- `PACO_ALLOW_MUTATION=true` cho persistent
- `PACO_ALLOW_DESTRUCTIVE=true` cho destructive
- Mặc định: tắt
- Không thay thế approval; chỉ là guard bổ sung

Cả hai mode: production/unknown host luôn hard block bất kể env var.

## Approval Request Template

```markdown
## Mutation Approval Request

**Environment:** [dev/staging/prod]
**Ticket:** [TICKET-ID]
**Test case:** [TC-ID và title]

**Expected side effects:**
- [Liệt kê từng action và kết quả]
- [Bao gồm notification/email/send nếu có]

**Test data:**
- [Data cụ thể sẽ dùng]

**Cleanup method:**
- [Cách cleanup]
- [Verification cleanup thành công]

**Destructive actions:** [Yes/No]
**Manual rollback needed:** [Yes/No]
```

## Cleanup Requirements

- Mutation test case phải nêu cleanup step
- Cleanup failure → ghi identifier của data còn lại
- Không tự mở rộng sang destructive cleanup chưa được phép
