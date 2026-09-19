# Data Safety Standards

## Mutation Classes

- `None`: read-only, mặc định được phép
- `Temporary`: có cleanup tin cậy, cần approval
- `Persistent`: để lại dữ liệu, cần approval per-run
- `Destructive`: delete/bulk/hard-to-undo, cần approval riêng
- `Unknown`: xử lý như persistent

## Dev Authorization

Trên environment `dev` và hostname nằm trong `paco.config.yaml` safety allowlist, approved test/survey scope được phép `Create`, `Update`, `Save`, `Submit`, `Send`, `Delete`, `Approve`, `Reject`, upload, import, download và relevant external dev flow. Production hoặc unknown host luôn bị chặn.

`Send` cần test recipient/destination đã xác minh. Thiếu domain rule, expected result hoặc safe test data phải Ask QA early; không đoán. Mọi mutation ghi ledger đã redact và cleanup khi không phá dữ liệu nền.

## Safety Gates

### Design-time
- Test case ghi mutation class
- Automation assessment ghi approval status

### Runtime
- Environment variable guards:
  - `PACO_ALLOW_MUTATION=true` cho persistent
  - `PACO_ALLOW_DESTRUCTIVE=true` cho destructive
- Mặc định: tắt
- Không thay thế approval; chỉ là guard bổ sung

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
