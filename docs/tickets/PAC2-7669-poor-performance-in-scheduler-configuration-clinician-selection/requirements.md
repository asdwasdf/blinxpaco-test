# PAC2-7669 — Requirements

**Ticket:** PAC2-7669 — Poor Performance in Scheduler Configuration Clinician Selection
**Source revision:** `119562275d74aa7562cfe99a27e0502e86c3716aa377a6e0404f1c14f7bce99f`
**Date:** 2026-10-01

## Summary

Khi proxy được bật, việc chọn clinician trong `Scheduler Configuration` có thể chậm 5–10 giây, làm trang freeze/crash hoặc hiện `waiting for this page to respond`. Ticket yêu cầu loại bỏ hoặc giảm đáng kể độ trễ cho cả `EMIS` và `PACO Connect`.

## Source claims

- `[Confirmed]` Ticket mô tả baseline lỗi 5–10 giây và yêu cầu loại bỏ hoặc giảm đáng kể độ trễ.
- `[Confirmed]` Ticket yêu cầu không xuất hiện popup `waiting for this page to respond` khi chọn clinician.
- `[Confirmed]` Ticket ghi nhận lỗi có thể freeze/crash và ảnh hưởng cả `EMIS` lẫn `PACO Connect`.
- `[Confirmed]` Dev comment ngày 2026-09-09 nói đã sửa memory leak và redundant API fetching, rồi test trên feature branch. Đây là fix claim, không phải QA result.
- `[Inferred]` Comment điều tra nêu proxy DB views thiếu index cùng row-by-row session fetching và render work là root-cause analysis; ticket không xác nhận production diagnosis cuối cùng.

## Observable Requirements

### REQ-7669-001: Clinician Selection Performance

- **Classification:** `Confirmed` từ Jira description.
- **Trigger:** Chọn clinician trong `Scheduler Configuration` khi proxy enabled.
- **Expected:** Độ trễ 5–10 giây được loại bỏ hoặc giảm đáng kể.
- **Coverage:** Cả `EMIS` và `PACO Connect` slots.
- **Lưu ý:** Ticket không đặt SLA `< 1 giây` hoặc benchmark tuyệt đối khác.

### REQ-7669-002: No Page Timeout

- **Classification:** `Confirmed` từ Jira description.
- **Trigger:** Chọn clinician trong `Scheduler Configuration`.
- **Expected:** Không xuất hiện popup `waiting for this page to respond`; UI tiếp tục phản hồi.

### REQ-7669-003: No Freeze or Crash

- **Classification:** `Confirmed` từ Jira description.
- **Trigger:** Chọn clinician, gồm nhiều selection liên tiếp.
- **Expected:** Trang không freeze hoặc crash.

## Constraints và scope

- Target QA: `https://pac2-7669.dev.blinxpaco-np.com`.
- Role quan sát: `Blinx Deployment`; tester xác nhận quyền tương đương admin.
- Test cả `EMIS` và `PACO Connect` trên configured dev host.
- Đo click-to-visible-selection và quan sát browser responsiveness.
- Draft selection là mutation `Temporary`; không bấm `Save`, đóng bằng `Cancel`, rồi xác minh persisted state không đổi.

## Open Questions

- Ticket không cung cấp SLA tuyệt đối ngoài yêu cầu giảm đáng kể baseline 5–10 giây.
- Proxy-enabled state được nêu trong ticket nhưng không có UI indicator độc lập để QA xác minh.

## Tester notes

[Protected area]
