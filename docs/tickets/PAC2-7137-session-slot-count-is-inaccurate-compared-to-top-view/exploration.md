# Exploration: PAC2-7137

**Input Revision:** 1  
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)  
**Role:** `Super Admin GB`  
**Observed:** 2026-09-30  
**Status:** Complete with warnings

## Scope

Read-only observation tại tester-provided ticket baseline `/paco-connect/feature-branch/pac2-7137/appointment-book`: cấu trúc `Day`/`Week`, summary `Sessions`/`Booked`/`Available`, session/detail area, appointment-book selector. QA xác nhận `PAC2-8384 Manual Book A/B` là safe test books. Không chỉnh slot/session hoặc tạo booking. Các observation dưới đây đã được revalidate trên feature branch; default route chỉ còn là control path.

## Observations

### OBS-PAC2-7137-001

**Classification:** Observed  
**Location/URL:** default dev `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`  
**Action:** Mở feature root từ confirmed entry path.  
**Observed Behavior:** `Day` view ngày 2026-09-30 hiển thị `Sessions 0`, `Booked 0`, `Available 0`, `LIVE 0` và `No available sessions.`.  
**Requirement Links:** REQ-PAC2-7137-001, REQ-PAC2-7137-002  
**Evidence:** local snapshot `.playwright-mcp/page-2026-09-30T12-37-41-546Z.yml`; dev feature branch; `Super Admin GB`  
**Sensitive Data Review:** Local only.

### OBS-PAC2-7137-002

**Classification:** Observed  
**Location/URL:** default dev `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`  
**Action:** Mở `Appt. Book` selector; chỉ xem; đóng bằng `Close`.  
**Observed Behavior:** Dialog `Select Appointment Books` có search và danh sách; current selections là hai `PAC2-8384` test books. QA xác nhận hai books này safe.  
**Requirement Links:** REQ-PAC2-7137-001, REQ-PAC2-7137-002, REQ-PAC2-7137-003  
**Evidence:** local snapshots `.playwright-mcp/page-2026-09-30T12-08-12-491Z.yml`, `.playwright-mcp/page-2026-09-30T12-08-31-517Z.yml`  
**Sensitive Data Review:** Selector list không được promote.

### OBS-PAC2-7137-003

**Classification:** Observed  
**Location/URL:** default dev `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=week`  
**Action:** Chuyển read-only sang `Week`.  
**Observed Behavior:** Tuần 2026-09-28 đến 2026-10-04 có summary `Booked 0`, `Available 6`; Tuesday 29/9 có daily count 0/6; hourly row 14:00 có `Booked 0`, `Available 6`; các ngày/giờ khác hiển thị 0. Summary tuần, summary ngày và hourly detail đều nhất quán cho state này.  
**Requirement Links:** REQ-PAC2-7137-001, REQ-PAC2-7137-002  
**Evidence:** local snapshot `.playwright-mcp/page-2026-09-30T12-45-33-660Z.yml`; feature branch  
**Sensitive Data Review:** None in claim.

### OBS-PAC2-7137-004

**Classification:** Observed  
**Location/URL:** default dev `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`  
**Action:** Chuyển `Day`, dùng `Previous` tới 2026-09-29.  
**Observed Behavior:** Summary hiển thị `Sessions 1`, `Booked 0`, `Available 6`, `LIVE 0`. Một expanded session 08:00–09:00 có sáu slot 10 phút tại 08:00, 08:10, 08:20, 08:30, 08:40, 08:50; clinician column hiển thị `booked 0`, `available 6`. Summary và detail khớp cho state hiện tại.  
**Requirement Links:** REQ-PAC2-7137-001, REQ-PAC2-7137-002  
**Evidence:** local snapshot `.playwright-mcp/page-2026-09-30T12-44-34-206Z.yml`; feature branch; previous default-route screenshot retained only as historical raw evidence  
**Sensitive Data Review:** Screenshot local only; không promote vì có context labels.

### OBS-PAC2-7137-005

**Classification:** Observed  
**Location/URL:** default dev appointment book  
**Action:** Đọc accessibility tree.  
**Observed Behavior:** Stable labels gồm `Active sessions today`, `Booked`, `Available`, `LIVE`, `Day`, `Week`, `Month`, `Year`, `Previous`, `Next`, `slots span`, session region name và hourly summary.  
**Requirement Links:** REQ-PAC2-7137-001, REQ-PAC2-7137-002  
**Evidence:** local snapshots nêu trên  
**Sensitive Data Review:** Stable generic labels only.

## Mismatches and Possible Defects

- Không thấy mismatch trong read-only baseline: `Available 6` khớp sáu slot ở `Day`; `Week` summary/day/hourly đều bằng 6.
- Chưa exercise booking, multi-holder hoặc non-bookable state; không kết luận fix status cho các nhánh đó.
- PAC2-7137 feature-branch route render đúng feature UI sau observable wait; một lần navigation ban đầu redirect qua role selection/dashboard do transient session/status flow, retry từ authenticated dashboard thành công. Không dùng initial response/loading state làm product result.
- Default route và feature branch cùng cho baseline counts 0/6, nhưng ticket execution phải dùng feature branch; default route chỉ là control path.

## Actions Not Taken

- Không click slot vì có thể mở booking/edit action.
- Không mở `Quick Book`, `Group Send`, `Export` hoặc `Filters`.
- Không toggle `Bookable`, save, block session, tạo booking hoặc thay appointment-book selection.

## Suggested Coverage

- Baseline `Day`/`Week`: summary đối chiếu slot/hourly/detail totals.
- Multi-holder appointment: QA xác nhận expected `Booked` là 1 appointment, không nhân theo holder.
- Non-bookable slot: xác nhận slot vẫn hiển thị blocked; `Available` inclusion vẫn là Open Question nên không assert count rule.
- Empty state: summary counts bằng 0.
- Filtered state sau khi có trusted expected basis.

## Blockers and Open Questions

- Open Question: non-bookable slots có được tính vào `Available` không; không dùng làm fail assertion.
- Execution data hiện có: safe books `PAC2-8384 Manual Book A/B`, session-bearing date 2026-09-29, một 08:00–09:00 session với sáu slots.
- Mutation cleanup expectation: hoàn nguyên slot về original `Bookable` state; không tạo patient booking trừ khi có safe patient data riêng.
- Exact next action: design cases; mark non-bookable count rule `Blocked`/`Not Run` nếu vẫn thiếu domain confirmation.

## Tester notes
