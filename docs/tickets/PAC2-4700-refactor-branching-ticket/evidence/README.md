# Evidence — PAC2-4700 parity retest

**Ngày chụp:** 2026-09-19  
**Role:** `Super Admin GB`  
**Patient context:** shared test patient, NHS hiển thị kết thúc `709 86`  
**Method:** thao tác trực tiếp bằng Playwright plugin; không click `Save`, `Send Now` hoặc `Schedule` trong evidence pass.

> Screenshot là evidence cho trạng thái UI tại một thời điểm. Các nhận xét performance chỉ dựa trên runtime measurement đã ghi trong `automation.md`, không suy ra từ ảnh tĩnh.

## Evidence index

| ID | Environment | File | Mô tả và claim được hỗ trợ |
|---|---|---|---|
| IMG-01 | BRANCH-OS | `20260919-branch-os-compose.png` | `Campaign` compose của shared patient. Campaign hiện tại render SMS compose và action `Copy to Email`; hỗ trợ kết luận OS không mặc định mở Email trong sample này. Campaign picker đang ở `A - Z`, cho thấy cùng nhóm sort option được dùng trên OS. Header hiển thị `DOB: Unknown (Unknown)`. |
| IMG-02 | BRANCH-OS | `20260919-branch-os-files.png` | Surface `Files` trong Quick Send. Dùng đối chiếu availability/loading state với Connect và GP; không có upload hoặc record video. |
| IMG-03 | BRANCH-OS | `20260919-branch-os-booking-link.png` | `Booking Link` render `Date & Time`, `Refresh Availability`, bốn group `Face to Face`, `Phone`, `Video`, `Web Chat Slot Type(s)`, cùng clinician/location ở phần dưới. Header đồng thời ghi `DOB: Unknown (Unknown)`. |
| IMG-04 | BRANCH-CONNECT | `20260919-connect-files.png` | Connect `Files` surface tại thời điểm chụp. Dropdown patient-record file còn hiển thị `Loading...`; runtime sau đó đạt expected state khoảng `6127ms`, vì vậy đây là transient loading evidence, không phải bằng chứng permaload. |
| IMG-05 | BRANCH-CONNECT | `20260919-connect-booking-link.png` | Connect `Booking Link` render đủ bốn slot-type group, `Select Clinician(s)` và `Select Location(s)`. Text/controls hiển thị centered trong sample hiện tại; claim “Connect words are not centred” không tái lập. |
| IMG-06 | BRANCH-GP | `20260919-gp-files.png` | GP `Files` surface đạt expected UI trong wait tối đa 5 giây; không tái lập trạng thái permaload được báo trước đó. Không upload file. |
| IMG-07 | BRANCH-GP | `20260919-gp-booking-link.png` | GP `Booking Link` render đủ bốn slot-type group, clinician/location và date/time surface. Header hiển thị DOB đúng `15/03/2024 (2 years old)`. |
| IMG-08 | BRANCH-GP | `20260919-gp-email.png` | GP campaign compose sau khi enable local Email channel: `To` hiển thị `qa.pac2.4700.fixed@example.com (Home)` cùng số điện thoại. Chứng minh patient có email option; bác bỏ claim “GP has no patient email” trong current data state. Đây là local compose state, không `Save`. |

## Runtime evidence đi kèm

| Claim | Kết quả | Evidence/runtime |
|---|---|---|
| GP `Health Forms` chậm hơn Connect | **Không tái lập** | GP `1969ms`; Connect `1942ms`; OS `1990ms`. Một spot sample, chưa đủ kết luận performance rộng. |
| GP `Files` permaload | **Không tái lập** | GP đạt expected surface trong wait ≤5s. |
| Connect `Files` loading | **Observed transient** | Connect đạt expected state khoảng `6127ms`; `IMG-04` ghi lại loading state trước khi hoàn tất. |
| Connect/GP không có patient email | **Không tái lập** | GP email hiện trong `IMG-08`; runtime Connect cũng expose email option trong cùng patient state. OS dùng `michael@blinxsolutions.com`, cho thấy dataset/contact value khác nhau. |
| OS mặc định Email, Connect/GP mặc định SMS | **Không tái lập** | Cùng campaign hiện SMS compose trên cả ba target; OS evidence `IMG-01`, GP trước khi enable Email là SMS. |
| Booking Link controls khác nhau | **Không tái lập** | `IMG-03`, `IMG-05`, `IMG-07`: cả ba branch render cùng bốn slot-type group và clinician/location controls. STD-08 đã `Pass` trên cả BASE-OS, BRANCH-OS, BRANCH-CONNECT, BRANCH-GP. |
| Booking Link text không centered trên Connect | **Không tái lập** | `IMG-05` cho thấy heading và control layout centered trong viewport hiện tại. |
| DOB parity | **Khác biệt Confirmed** | OS/BASE samples hiện `Unknown (Unknown)`; GP `IMG-07` hiện `15/03/2024 (2 years old)`. Connect từng có cả hai state theo entry/session, nên Connect-specific conclusion cần controlled rerun. |
| Mapped `Virtual Mental Health…` slot | **Inconclusive** | Current campaign không expose fixture này. Không suy diễn từ slot controls trống và không tự cấu hình mapping. |
| Sorting grey-box theme / dropdown persistence / saved-campaign speed / `Test Results` inner scroll | **Inconclusive** | Chưa có matching fixed-viewport evidence hoặc repeated controlled samples. |

## Evidence hygiene

- Screenshot login vô tình chụp sau khi OS session hết hạn đã bị xóa ngay vì chứa credential autofill; không đưa vào evidence set.
- Không có credential, auth state hoặc reusable token được ghi vào tài liệu này.
- Không upload/import, không `Save`, không `Send Now`, không `Schedule` trong evidence pass.
