# PAC2-7669 — Manual Execution Results

**Ngày:** 2026-10-01  
**Environment:** `dev` — `https://pac2-7669.dev.blinxpaco-np.com`  
**Role hiển thị:** `Blinx Deployment` (tester xác nhận quyền tương đương admin)  
**Route:** `/configuration/`

## Expected-result basis

Ticket mô tả độ trễ trước fix là 5–10 giây, đôi khi freeze/crash hoặc xuất hiện `waiting for this page to respond`. Ticket không cung cấp SLA `< 1 giây`; kết quả dưới đây đánh giá sự giảm đáng kể so với baseline 5–10 giây và tính ổn định của UI.

## Execution Summary

| Case ID | Coverage | Result | Evidence |
|---|---|---|---|
| TC-7669-001 | Chọn clinician, đo thời gian hiển thị chip | `Pass` | EMIS 117.6–149.1 ms; PACO Connect 113.3–143.7 ms trong các diagnostic retries |
| TC-7669-002 | Không browser unresponsive/timeout | `Pass` | UI tiếp tục phản hồi sau từng selection; không quan sát popup `waiting for this page to respond` |
| TC-7669-003 | Nhiều selection liên tiếp | `Pass` | Mỗi nguồn chạy ba lần có mục đích; không freeze/crash |
| TC-7669-004 | EMIS | `Pass` | `Blood Test FJ` → `Same Day GP Appt` (`emis`) |
| TC-7669-005 | PACO Connect | `Pass` | `Blood Test Due - Boot Camp 240225` → `Blood Test` (`PACO-CONNECT`) |

## EMIS

- Mapping: `Blood Test FJ` / `Face to Face` / `Same Day GP Appt`.
- Clinician control ban đầu trống.
- Attempt đo chính xác:
  1. Same mapping, clinician có availability: 149.1 ms.
  2. Dữ liệu khác, clinician không availability: 117.6 ms.
  3. Chọn lại clinician có availability: 134.5 ms.
  4. Control repeat: 120.8 ms.
- UI responsive trong toàn bộ lượt; không popup unresponsive, freeze hoặc crash.
- Evidence: `emis-clinician-selection.png` (SHA-256 `3551ebf4722aaaaabd8d7b1b0305ca05146d2e1acbc7cda4d87520fb0f96d832`).

## PACO Connect

- Mapping: `Blood Test Due - Boot Camp 240225` / `Face to Face` / `Blood Test`.
- Persisted baseline có ba clinician; không đổi baseline.
- Attempt đo chính xác:
  1. Clinician dữ liệu mới: 143.7 ms.
  2. Clinician khác: 122.0 ms.
  3. Same-data repeat: 143.4 ms.
  4. Control repeat: 140.0 ms.
  5. Dữ liệu khác: 113.3 ms.
- UI responsive trong toàn bộ lượt; không popup unresponsive, freeze hoặc crash.
- Baseline evidence: `saved-clinician-state.png` (SHA-256 `76f134d9e12062a342f8cbdd65085ab24ea78fc9dbc1387256c4664567283c9c`).

## Diagnostic note

Hai phép đo ban đầu được đọc ở lượt tool kế tiếp nên cho 8.1 giây và 10.3 giây; số đó gồm độ trễ gọi tool/MCP, không phải click-to-render và không được dùng làm product timing. Các retries dùng `performance.now()` và đợi chip xuất hiện ngay trong cùng browser evaluation, cho kết quả 113.3–149.1 ms ổn định.

## Mutation ledger và cleanup

| Scope | Mutation | Cleanup | Verification |
|---|---|---|---|
| EMIS | `Temporary`: thêm clinician trong draft | Gỡ chip, đóng bằng `Cancel`; không `Save` | Mở lại mapping: không có clinician tạm |
| PACO Connect | `Temporary`: thay đổi clinician trong draft | Đóng bằng `Cancel`; không `Save` | Mở lại mapping: chỉ ba clinician baseline còn lại |

- Không tạo/xóa mapping.
- Không gửi dữ liệu, SMS hoặc appointment.
- Không có leftover.

## Warnings

- `requirements.md` và `test-cases.md` hiện còn claim `< 1 giây` không có nguồn và mutation `None`; kết quả này không dùng claim đó làm expected basis.
- Console có lỗi lịch sử/auth và missing remote asset từ trước; không có bằng chứng các lỗi đó gây lỗi selection trong run này.

## Tester notes

[Protected area]
