# Exploration: PAC2-6982

**Input Revision:** 1
**Environment:** `dev` — Paco và configured external Comms Hub
**Role:** `Admin` (QA-provided)
**Observed:** 2026-10-01
**Mode:** read-only

## Scope

Quan sát surface cần cho shared campaign có `Health Form` do child practice tạo, trước mutation. Không đánh giá fix và không tạo/gửi campaign trong phase này.

## Observed routes and context

- Paco: `/health-forms/builder/`, title `Health Forms`.
- Comms Hub: `/commshub/campaign-manager`, authenticated external dev host.
- Organisation tree: `General Practice (Demo Site) (YGMQJ)` → `Redmoor Liverpool (Non-OBE) (M85065)` → `3ST (M85055)`, `Primary Care 24 (Y05825)`.
- Campaign Manager có `Create Campaign`, `Campaign Outbox`, `Search campaigns`, `Clear Filters`, `Shared Campaigns`, ownership/sharing columns.
- Health Forms grid có `Health Form Name`, `Created By Organisation`, `Shared To Organisation(s)`, `Archived`, `Editable`, `Actions`.

## Existing form candidates

Trong authenticated Health Forms context, nhiều active/editable form hiển thị `Created By Organisation` và `Shared To Organisation(s)` là `-`. Ví dụ structural candidate `Healthform Inbox Testing` là `Active`, `Editable: Yes`; dấu `-` không đủ chứng minh organisation creator hoặc no-share rule cho child practice.

Không mở `Actions`, không sửa form, không đổi health-form organisation context. Không chọn form làm test data cho đến khi current child context/ownership được xác minh.

## Observed read-only behavior

- `Viewing data for` mở hierarchy tree và có `Apply`; đóng lại không apply khi inspect.
- Search campaign theo candidate tester cung cấp không lộ matching row; không kết luận record không tồn tại.
- Campaign groups có `Non-Shared Campaigns` và `Shared Campaigns`; structural group counts là dynamic, không dùng làm expected result.
- Full patient scheduler/login route chưa có vì chưa tạo campaign/link.

## Requirement relation

- REQ-PAC2-6982-001: patient login qua scheduler link chưa chạy.
- REQ-PAC2-6982-002: form accessibility khi child là creator nhưng không `Shared To` chưa chạy.
- Ticket expected behavior giữ `Confirmed` từ source; observation hiện tại không chứng minh `Pass` hoặc `Fail`.

## Mutation boundary

Mutation bắt đầu khi đổi organisation context bằng `Apply`, mở/tiến hành `Create Campaign`, thêm form/patient, lưu draft hoặc `Send`. QA đã chấp thuận campaign test riêng trong ticket scope, nhưng mutation chỉ thực hiện tại `MANUAL_EXECUTE` sau test design, runtime guard, exact action/data fingerprint, ledger và cleanup.

Không sửa campaign nền. `Send` chỉ dùng patient/recipient test đã xác minh an toàn; “ai cũng được” không phải safe-recipient verification.

## Gaps and suggested coverage

1. Chọn parent `Redmoor Liverpool`, child `Primary Care 24` hoặc `3ST` trong controlled setup.
2. Xác minh một existing active form được child tạo và không `Shared To` chính child. Nếu không có, cần tạo synthetic form ở child trước campaign.
3. Tạo separate shared campaign ở parent, attach form, target child, dùng safe test patient.
4. Lấy scheduler link bằng supported UI flow; test login và open form.
5. Control path: cùng flow với form có valid `Shared To`, nếu domain setup cho phép.
6. Nếu attempt đầu fail, thực hiện same data, clean data, fresh session và control path theo workflow gate.

## Safety and evidence

- Mutation: `None`; cleanup: không áp dụng.
- Không lưu credentials, cookie, token, scheduler link, patient identifier hoặc row data nhạy cảm.
- Evidence hiện chỉ là live structural UI observation; cần durable/redacted case evidence khi manual execute.

## Tester notes
