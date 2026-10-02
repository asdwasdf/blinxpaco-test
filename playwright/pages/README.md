# Page objects dùng chung cho spec Paco

## Mục đích

Gom locator và thao tác UI lặp lại giữa các spec ticket vào một chỗ, để spec mới không phải viết lại selector. Mỗi class ứng với một khu vực UI:

| File | Khu vực |
|---|---|
| `AppShell.ts` | Landmark `main`, dialog, toast, `Set your status` prompt, điều hướng |
| `QuickSendPage.ts` | Tìm patient trên dashboard, mở `Quick Send`, các control trong dialog |
| `HealthFormsPage.ts` | Tab `Health Forms`, `Booking Link`, `Files` trong `Quick Send` |
| `AppointmentBookPage.ts` | Appointment Book và slot editor (`Edit Session`) |
| `SchedulerConfigPage.ts` | Scheduler Configuration: template mapping, tạo session |
| `CommsHubPage.ts` | Comms Hub campaign manager (đổi org, row, action) |

Fixture `playwright/fixtures/page-fixtures.ts` mở rộng `auth-fixtures` và expose các page object gắn với `authenticatedPage`. Spec dùng `authenticatedContext.newPage()` thì tự `new QuickSendPage(page)`.

## Quy tắc

- Page object chỉ chứa locator và thao tác. Không `expect` kết quả nghiệp vụ; assertion nằm trong spec. Chờ điều kiện quan sát được (visible/count) thì được; không `waitForTimeout`.
- Ưu tiên `getByRole`, `getByLabel`, `getByText`; selector CSS chỉ khi đã có trong run đã xác minh.

## Thêm locator mới

1. Locator phải xuất phát từ một lần chạy thật đã xác minh (manual record hoặc spec đã chạy), không phải suy đoán. Không thêm locator dựa trên `Inferred`/`Open Question`.
2. Thêm vào class đúng khu vực, kèm comment một dòng: `Source: <spec hoặc test-results path>`.
3. Nếu locator xuất hiện ở spec cũ, giữ nguyên spec cũ đến khi có lý do refactor; spec mới import từ `playwright/pages/`.
4. Export class mới trong `index.ts`; nếu cần, thêm vào `page-fixtures.ts`.

## Quy ước đặt tên

- Class: `<Khu vực>Page` (riêng shell là `AppShell`).
- Locator không tham số là getter (`get patientSearch()`); có tham số là method trả `Locator` (`patientResult(nhsDisplay)`).
- Action là method `async` có động từ (`openFor`, `close`). Tên bằng tiếng Anh, giữ nguyên UI text trong chuỗi.
- Tham số `dialog: Locator` mặc định `this.dialog` khi chỉ có một dialog.

## Chưa có

- Nút chọn `Admin` trong modal `Set your status`: chưa spec nào dùng, nên chưa đưa vào. Thêm sau khi xác minh qua một lần chạy.
