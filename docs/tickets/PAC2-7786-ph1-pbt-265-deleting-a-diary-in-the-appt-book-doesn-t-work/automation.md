# PAC2-7786 — Manual Execution Results

**Ngày:** 2026-10-01  
**Input Revision:** 1  
**Environment:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`  
**Role hiển thị:** `Super Admin GB`  
**Route:** `/configuration`

## Execution Summary

| Case ID | Result | Actual result | Evidence |
|---|---|---|---|
| `PAC2-7786-TC-001` | `Fail` | Session đủ điều kiện được tạo, nhưng menu không có `Delete Session`; `Cancel Session` chỉ chuyển record sang `Removed`, không xóa hoàn toàn. | UI search trước/sau refresh; menu labels ghi dưới đây |
| `PAC2-7786-TC-002` | `Blocked` | Không có approved synthetic patient/booking context để tạo booked appointment mà không dùng PII thật. | Safe-data gate |
| `PAC2-7786-TC-003` | `Fail` | Record run-owned ở `Removed` vẫn không có đường xóa; menu chỉ có `Edit`, `View Audit`, `Restore`, `Clone`; `Cancel Session` và `Block Session` disabled. | `evidence/PAC2-7786-TC-003-005-removed-menu-20261001.png` |
| `PAC2-7786-TC-004` | `Fail` | `Cancel Session` có dialog trước mutation và `Back` giữ record, nhưng confirm chỉ archive sang `Removed`; không thực hiện deletion theo requirement. | UI confirmation và persisted search sau refresh |
| `PAC2-7786-TC-005` | `Inconclusive` | Diagnostic matrix xác nhận `Delete Session` vắng mặt; rule coexist/replace với `Block Session` vẫn `Disputed`. | Active/Removed menu observations |

## Dữ liệu và setup

- Identifier run-owned: `QA-AUTO-PAC2-7786-TC001-20261001-1510`.
- Dependencies test-safe đã chọn: `Test Appt Book`, `Test Location 1`, `Dermatology Clinic`, care professional test `PAC1-6603 DM`.
- Date: `01/10/2026`; `Thursday`; `Daily`; `08:00:00`–`16:00:00`; `10 minutes`.
- UI tạo record thành công; grid hiển thị `(Template — 2 sessions)` và `48` bookable slots được dialog `Block Session` báo.
- Không dùng patient data, email, SMS, upload hoặc import.

## PAC2-7786-TC-001

**Expected basis:** `REQ-PAC2-7786-001`, ticket yêu cầu session đủ điều kiện được xóa hoàn toàn.

### Attempts và control

1. **Primary / same data:** Mở menu run-owned active record. Observed `Edit`, `View Audit`, `Clone`, `Cancel Session`, `Block Session`; không có `Delete Session`.
2. **Fresh page/session:** Reload trực tiếp feature route, search lại đúng identifier. Menu vẫn không có `Delete Session`.
3. **Changed persisted state:** Dùng `Cancel Session` với reason `Clinic/session cancelled`; record biến mất khỏi `Active` nhưng xuất hiện trong `Removed`. Menu `Removed` vẫn không có `Delete Session`.
4. **Control path:** `Restore` thành công đưa record về `Active`; `Block Session` mở confirmation bình thường, chứng minh row/action association và mutation permission hoạt động. Chọn `Cancel`, record vẫn tồn tại sau reload.

**Kết luận:** `Fail` ổn định. Không có entry action để hoàn tất deletion; archive không đáp ứng yêu cầu xóa hoàn toàn.

## Deep-dive: expanded child sessions

- Mở rộng template xác nhận có đúng `2` child session rows riêng biệt.
- Menu của cả hai child rows giống template: `Edit`, `View Audit`, `Clone`, `Cancel Session`, `Block Session`; không có `Delete Session`.
- `Cancel Session` trên child row mở confirmation trước mutation và báo không có appointment booked.
- `Block Session` trên child row mở dialog: `No patients are booked into this session. This will make all 48 bookable slots non-bookable. No appointments will be cancelled.` Chọn `Cancel`; không mutation.
- Network observation qua UI:
  - child session appointments trả danh sách rỗng;
  - `check-editable` trả `editable: true` và code rỗng;
  - action menu vẫn không render `Delete Session`.
- `Edit` child row không mở route/drawer observable; không có hidden delete control được phát hiện.
- Durable evidence: `evidence/PAC2-7786-TC-001-004-005-child-active-menu-20261001.png`.

Deep-dive loại trừ hai khả năng: action chỉ nằm ở child row, hoặc action bị ẩn do booking/non-editable state. Product `Fail` cho `TC-001`/`TC-004` vẫn giữ.

## Deep-dive: deployed frontend action wiring

Phân tích các public JavaScript assets đã tải bởi đúng feature branch, không đọc auth state và không gọi private API trực tiếp:

- `useSessionRemoval-7DMlmp3u.js` triển khai đầy đủ flow `Remove Session`: kiểm tra future bookings, cảnh báo khi có booking, confirmation có reason, remove mutation, success/error handling và restore.
- Configuration bundle `index-0ZKoXl8v.js` import `useSessionRemoval`, nhưng chỉ destructure `startRestoreSession`; `startRemoveSession` không được lấy ra hoặc nối vào row action.
- `Actions` renderer chỉ thêm `Cancel Session` và `Block Session`. Generic archive item chỉ được render khi `session_archived_date` tồn tại, được đổi label thành `Restore`, và handler `Archive` cũng chuyển sang gọi restore.
- Predicate ownership/archive chỉ disable `Cancel Session`/`Block Session` cho archived hoặc foreign-organisation rows; predicate này không tạo `Remove Session` cho active eligible row.
- `SessionActionRunner-Xm7GwMFv.js` chỉ dispatch `cancel`, `block`, hoặc message; không dispatch remove.

**Confirmed technical cause trong deployed frontend:** remove hook tồn tại nhưng configuration action wiring không expose `startRemoveSession`. Đây là omission/unreachable UI path, không phải booking, editability, template/child, archived-state hay role-menu predicate đã quan sát. Label triển khai là `Remove Session`, trong khi ticket dùng `Delete Session`; khác label không giải thích defect vì không label nào được render.

### Public-asset verification bổ sung

- Hai source-map URL tương ứng `index-0ZKoXl8v.js.map` và `useSessionRemoval-7DMlmp3u.js.map` đều trả HTTP `404`; không có source map công khai để truy ngược filename/line hoặc `sourcesContent`.
- Bundled test `useSessionRemoval.test-GioCJHms.js` có 9 named cases quan sát được, cover:
  - từ chối remove khi có future bookings và hướng người dùng dùng `Cancel Session`;
  - gửi `allowFutureDates: true` cùng selected archive reason khi confirm;
  - disable `Remove` cho tới khi chọn reason;
  - không mở dialog khi pre-check lỗi;
  - restore removed session;
  - permission refusal cho remove, restore và pre-check;
  - invalidation session appointments, appointment counts và session detail sau remove.
- Permission error được test với `403`/`BX_ERR_FORBIDDEN`; user-facing suffix là `You do not have permission to make this change. Ask an Appointment Book Admin.`
- Static contract từ bundle, không phải runtime endpoint test:
  - pre-check nhận `bx_session_uuid`, trả `has_future_bookings` và `future_bookings_count`;
  - remove nhận `bx_session_uuid`, `allowFutureDates: true`, `archiveReason`;
  - restore nhận `bx_session_uuid`.
- Hook định nghĩa 8 reason options: IDs `1`–`7` và `99`; không phải 9.
- Không tìm thấy public build timestamp, version, commit SHA hoặc session-removal feature flag trong các assets đã trace.
- Không đủ evidence để gọi đây là branch-only regression: chưa có authenticated/public-equivalent baseline bundle comparison. Kết luận giới hạn ở feature branch đang test.

Nguồn raw diagnostic: `test-results/PAC2-7786/manual/20261001-1510/removal-code-context.json`, `useSessionRemoval-bundle.json` và public assets nêu trên. Không promote toàn bộ minified bundle vào durable docs.

## PAC2-7786-TC-002

**Result:** `Blocked`.

Không tìm thấy approved synthetic patient/booking context trong run. Tạo booking bằng patient hiện hữu có nguy cơ dùng PII thật, nên dừng theo safe-data gate. Không mutation booking được thực hiện.

## PAC2-7786-TC-003

**Expected basis:** `REQ-PAC2-7786-003`, archived state không được ngăn eligible deletion.

- Run-owned record được đưa vào `Removed` bằng supported `Cancel Session` action.
- `Removed` menu: `Edit`, `View Audit`, `Restore`, `Clone`; `Cancel Session` và `Block Session` disabled; không có `Delete Session`.
- Reload và search vẫn thấy record trong `Removed` trước restore.

**Kết luận:** `Fail`. Không có đường xóa archived/removed record, nên không thể đạt persisted absence.

## PAC2-7786-TC-004

**Expected basis:** `REQ-PAC2-7786-004`, confirmation phải xảy ra trước mutation; cancel giữ nguyên; confirm cuối phải xóa.

- `Cancel Session` mở dialog trước mutation.
- `Back` đóng dialog; reload giữ record trong `Active`.
- Confirm với reason `Clinic/session cancelled` chỉ chuyển record sang `Removed`.
- `Restore` đưa record về `Active`.
- `Block Session` mở dialog: `No patients are booked into this session. This will make all 48 bookable slots non-bookable.` Chọn `Cancel`; reload giữ record.

**Kết luận:** `Fail`. Confirmation/cancel ordering hoạt động, nhưng confirmed action không xóa record theo expected requirement.

## PAC2-7786-TC-005 — Observation matrix

| State | Enabled labels | Disabled labels | `Delete Session` |
|---|---|---|---|
| `Active` template | `Edit`, `View Audit`, `Clone`, `Cancel Session`, `Block Session` | None observed | Không có |
| `Active` child 1 | `Edit`, `View Audit`, `Clone`, `Cancel Session`, `Block Session` | None observed | Không có |
| `Active` child 2 | `Edit`, `View Audit`, `Clone`, `Cancel Session`, `Block Session` | None observed | Không có |
| `Removed` template | `Edit`, `View Audit`, `Restore`, `Clone` | `Cancel Session`, `Block Session` | Không có |

**Kết luận:** `Inconclusive` theo test design. Observation chắc chắn; product rule coexist/replace chưa có trusted decision.

## Mutation ledger và cleanup

| Time | Object | Mutation | Result | Cleanup/verification |
|---|---|---|---|---|
| 2026-10-01 15:16 | Run-owned session template | `Create` | Thành công | Record tồn tại trong `Active` sau search/refresh |
| 2026-10-01 15:21 | Same record | `Cancel Session` / archive | Thành công | Record chuyển sang `Removed` |
| 2026-10-01 15:22 | Same record | `Restore` | Thành công | Record trở lại `Active` |
| 2026-10-01 15:23 | Same record | Mở `Block Session`, chọn `Cancel` | Không mutation | Record vẫn ở `Active` sau reload |

- Cleanup bằng deletion không khả dụng vì defect đang test.
- **Leftover:** một run-owned active session template, identifier đã redact: `QA-AUTO-PAC2-7786-TC001-…-1510`.
- Không sửa/xóa record có sẵn.

## Inventory review

- Đã review đủ 5 stable case IDs.
- `TC-001`, `TC-003`, `TC-004`: product `Fail` với retries/control evidence.
- `TC-002`: `Blocked` do safe synthetic booking setup thiếu.
- `TC-005`: `Inconclusive` đúng disputed expected-result basis.

## Tester notes

[Protected area]
