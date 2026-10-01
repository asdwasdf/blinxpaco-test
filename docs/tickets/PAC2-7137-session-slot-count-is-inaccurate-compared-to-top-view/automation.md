# Automation: PAC2-7137

**Input Revision:** 1  
**Environment:** dev  
**Role:** `Super Admin GB`  
**Updated:** 2026-09-30

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| PAC2-7137-TC-001 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-7137-TC-002 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-7137-TC-003 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-7137-TC-004 | Yes | valid | Confirmed | Yes — persisted historical scenario `111 PC24`, 2026-07-07 có một logical appointment ở hai holder và một appointment riêng | Allowed |
| PAC2-7137-TC-005 | Yes | valid | Confirmed | Yes | Allowed |

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
| PAC2-7137-TC-001 | Pass | 1 | N/A | N/A | N/A | N/A |
| PAC2-7137-TC-002 | Pass | 1 | N/A | N/A | N/A | N/A |
| PAC2-7137-TC-003 | Pass | 1 | N/A | N/A | N/A | N/A |
| PAC2-7137-TC-004 | Fail | 7 | N/A | N/A | N/A | Stable feature-branch defect: hai logical appointments bị hiển thị `Booked 3`; default-route control bị HTTP 404 rồi redirect login |
| PAC2-7137-TC-005 | Pass | 1 | N/A | N/A | N/A | N/A |

## Manual Execution Evidence

| Test Case | Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|---|
| PAC2-7137-TC-001 | manual-1 | initial | Pass | Confirmed | Feature branch `Day` 2026-09-29: summary `Sessions 1`, `Booked 0`, `Available 6`; one session with six slots; raw local snapshot `.playwright-mcp/page-2026-09-30T13-00-55-284Z.yml` |
| PAC2-7137-TC-002 | manual-1 | initial | Pass | Confirmed | Feature branch `Week` 2026-09-28–2026-10-04: top `Booked 0`, `Available 6`; Tuesday 0/6; hourly 14:00 0/6; raw local snapshot `.playwright-mcp/page-2026-09-30T13-01-16-094Z.yml` |
| PAC2-7137-TC-003 | manual-1 | initial | Pass | Confirmed consistency requirement | Feature branch `Day` 2026-09-30: `Sessions 0`, `Booked 0`, `Available 0`, `LIVE 0`, `No available sessions.`; raw local snapshot `.playwright-mcp/page-2026-09-30T13-01-57-706Z.yml` |
| PAC2-7137-TC-004 | manual-1 | approved patient lookup | Blocked | Confirmed by QA | `Quick Book` search for QA-approved synthetic patient produced no selectable result with exact/full and first-name search, including `Within Organisations Hierarchy`; global filter also returned no matching session. Raw local snapshots `.playwright-mcp/page-2026-09-30T13-19-05-689Z.yml`, `.playwright-mcp/page-2026-09-30T13-19-55-414Z.yml`, `.playwright-mcp/page-2026-09-30T13-20-42-728Z.yml` |
| PAC2-7137-TC-004 | manual-2 | exact-name `Patient Search` lookup | Blocked | Confirmed by QA | Read-only `Patient Search` tại approved `Super Admin GB` context trả về đúng 2 hồ sơ exact-name `Michael Ramella`; discriminator lần lượt là Hospital Number `500983` và NHS test number `100 001 9932`. Do có hai match, không chọn hoặc mở hồ sơ; không mutation. Raw local snapshot `.playwright-mcp/page-2026-09-30T13-31-05-057Z.yml` chứa thêm personal fields nên giữ local, không promote. |
| PAC2-7137-TC-004 | manual-3 | guarded direct-slot setup | Blocked | Confirmed by QA | Exact feature URL và safe book/date/session reverified; baseline `Booked 0`, `Available 6`. Quick Book search bằng Hospital Number `500983` resolve duy nhất `Michael Ramella` với displayed NHS No `70986`. Direct 08:00 slot booking preselected session `PAC2-8552 QA 8384 FUTURE 20260929`, but session có đúng một holder (`Dr Gareth Bartlett`) và booking UI không có control thêm holder thứ hai. Dừng trước enabled `Book Appointment`; đóng dialog; không mutation. Raw local snapshots `.playwright-mcp/page-2026-09-30T13-43-43-048Z.yml`, `.playwright-mcp/page-2026-09-30T13-44-30-940Z.yml`, `.playwright-mcp/page-2026-09-30T13-47-52-100Z.yml`, `.playwright-mcp/page-2026-09-30T13-48-10-030Z.yml`. |
| PAC2-7137-TC-004 | manual-4 | historical persisted data | Fail | Confirmed by QA | Video source `117731` xác định setup cũ tại `111 PC24`, 2026-07-07. Current feature branch hiển thị `Sessions 4`, `Booked 3`, `Available 142`. `Mr James Kite` 08:00–08:10 xuất hiện dưới `Chloe Stephens` và `Prof Jayde Turner 💜` với cùng patient/time/type/location, là một logical appointment; row 08:10–08:20 là appointment thứ hai. Expected `Booked 2`, actual `3`. Evidence `docs/.../video/117731-20260706-2227-10.5886819/contact-sheet.webp`, `pac2-7137-appointment-detail.yml`, `pac2-7137-second-appointment-detail.yml`, `pac2-7137-third-appointment-detail.yml`, `pac2-7137-7jul-pc24-current.yml`. |
| PAC2-7137-TC-004 | manual-5 | same data / Day→Week→Day | Fail | Confirmed by QA | `Week` tổng `Booked 28`; Tuesday 7/7 hiển thị `Booked 2`, nhưng quay lại `Day` cùng ngày vẫn `Booked 3`. Detail vẫn có hai holder occurrences lúc 08:00 và một appointment 08:10. Evidence `pac2-7137-week-live-full.yml`, `pac2-7137-tc004-same-data-retry.yml`. |
| PAC2-7137-TC-004 | manual-6 | fresh navigation | Fail | Confirmed by QA | Navigate lại exact feature URL, giữ book `111 PC24`; chọn 2026-07-07. Kết quả ổn định: `Sessions 4`, `Booked 3`, `Available 142`; cùng ba holder occurrences. Evidence `pac2-7137-tc004-fresh-navigation-7jul.yml`. |
| PAC2-7137-TC-004 | manual-7 | fresh tab/session context | Fail | Confirmed by QA | Tab mới trên exact feature URL; chọn `111 PC24`, 2026-07-07. Kết quả vẫn `Sessions 4`, `Booked 3`, `Available 142`; cùng hai logical appointments. Evidence `pac2-7137-tc004-fresh-tab-7jul.yml`. |
| PAC2-7137-TC-004 | control-1 | default route | Blocked | Diagnostic control only | `/paco-connect/appointment-book?viewAs=agenda` trả HTTP 404 rồi redirect `/paco/login`; không thể so sánh product count trên control route. Evidence `pac2-7137-tc004-default-route-control.yml`. |
| PAC2-7137-TC-005 | manual-1 | initial | Pass | Confirmed visibility requirement | Slot 08:00 được chuyển non-bookable, vẫn hiện trong session với `not bookable`/`Non-bookable`; raw local snapshot `.playwright-mcp/page-2026-09-30T12-58-53-919Z.yml`; cleanup verified `.playwright-mcp/page-2026-09-30T12-59-55-126Z.yml` |

**Control path checked:** Yes — default route trả HTTP 404 rồi redirect login, nên control bị `Blocked`; feature branch vẫn là ticket baseline.  
**Persisted state checked:** PAC2-7137-TC-004: cùng persisted setup tái hiện sau Day/Week/Day, fresh navigation và fresh tab. PAC2-7137-TC-005: sau `Save`, slot vẫn hiện non-bookable; sau restore và fresh navigation, slot 08:00 bookable lại, summary/detail trở lại `Available 6`.  
**Coverage review:** Đã rà đủ PAC2-7137-TC-001..005 và REQ-PAC2-7137-001..004. REQ-PAC2-7137-004 chỉ observation, không quyết định Pass/Fail.

## Automation Implementation

| Test Case | Source | Diagnostic | Input Revision | Status/Reason |
|---|---|---|---:|---|
| PAC2-7137-TC-001 | N/A | No | 1 | Manual `Pass`; cần standalone spec trong `AUTOMATE` |
| PAC2-7137-TC-002 | N/A | No | 1 | Manual `Pass`; cần standalone spec trong `AUTOMATE` |
| PAC2-7137-TC-003 | N/A | No | 1 | Manual `Pass`; cần standalone spec trong `AUTOMATE` |
| PAC2-7137-TC-004 | N/A | No | 1 | Manual `Fail`; cần standalone spec encode expected `Booked 2` trong `AUTOMATE` |
| PAC2-7137-TC-005 | N/A | No | 1 | Manual `Pass`; cần guarded mutation spec trong `AUTOMATE` |

## CLI Verification

| Run | Test Case | Result | Verification | Evidence |
|---|---|---|---|---|
| N/A | N/A | Not Run | N/A | Chưa vào `AUTOMATION_EXECUTE` |

## Mutation and Cleanup

**Occurred:** Yes  
**Class:** Temporary  
**Workflow Scope:** PAC2-7137 / PAC2-7137-TC-005 `Update` one safe slot; PAC2-7137-TC-004 guarded `Create appointment then cleanup` setup was not submitted. Historical TC-004 retest used persisted `111 PC24` data read-only.  
**Runtime Gate:** `workflow_authorized_mutation`; `PACO_ALLOW_MUTATION=true`; hostname `blinx.dev.blinxpaco-np.com`  
**Ledger:** Original `Bookable=true`; changed to `false`; observed slot remained visible as `Non-bookable`; restored `Bookable=true`. Slot identifier retained only in raw run context, not durable artifact.  
**Cleanup:** Completed and verified after `Save` plus fresh navigation; `Available` restored from observed 5 to 6; slot showed bookable check icon.  
**Leftover Identifiers:** None

## Blockers and Warnings

- PAC2-7137-TC-004 `Fail`: persisted historical setup trên current feature branch có hai logical appointments nhưng `Day` summary đếm `Booked 3`. Tái hiện qua same-data retry, fresh navigation và fresh tab. `Week` Tuesday 7/7 hiển thị `Booked 2`, tạo inconsistency giữa views. Default-route control bị HTTP 404/redirect login. Không mutation xảy ra cho TC-004.
- PAC2-7137-TC-005 observation: `Available` giảm 6 → 5 khi slot non-bookable và trở lại 6 sau cleanup. Đây không phải Pass/Fail assertion vì domain rule vẫn Open Question.
- Raw snapshots chứa contextual staff/session labels; giữ local, không promote unredacted vào durable evidence.

## Tester notes
