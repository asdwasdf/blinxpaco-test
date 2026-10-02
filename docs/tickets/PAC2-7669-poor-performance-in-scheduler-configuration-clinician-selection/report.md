# QA Report: PAC2-7669

**Input Revision:** `119562275d74aa7562cfe99a27e0502e86c3716aa377a6e0404f1c14f7bce99f`  
**Environment:** `dev` — `https://pac2-7669.dev.blinxpaco-np.com`  
**Role:** `Blinx Deployment` (tester xác nhận quyền tương đương admin)  
**Run/Scope:** Manual execution cho `EMIS` và `PACO Connect`; automation scoped spec  
**Generated:** 2026-10-01  
**Overall Product Result:** `Pass`

## Scope and Limitations

Đã test clinician selection trong `Scheduler Configuration` cho existing `EMIS` và `PACO Connect` mappings trên feature branch PAC2-7669. Ticket yêu cầu loại bỏ hoặc giảm đáng kể baseline delay 5–10 giây và tránh freeze/crash/browser unresponsive popup; ticket không cung cấp SLA `< 1 giây`.

Proxy-enabled state là ticket precondition nhưng không có UI indicator độc lập để QA xác minh. Standalone automation spec đã được tạo và validate, nhưng CLI execution bị chặn vì local authenticated login browser không chạy.

## Product Result

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| TC-7669-001 | `Pass` | REQ-7669-001; giảm đáng kể baseline 5–10 giây | `automation.md`; EMIS 117.6–149.1 ms, PACO Connect 113.3–143.7 ms | `Temporary`; `Cancel`; verified |
| TC-7669-002 | `Pass` | REQ-7669-002; không browser unresponsive popup | `automation.md`; UI responsive qua từng attempt | `Temporary`; `Cancel`; verified |
| TC-7669-003 | `Pass` | REQ-7669-003; không freeze/crash qua repeated selections | `automation.md`; ít nhất ba purposeful attempts mỗi source | `Temporary`; temporary chips removed; verified |
| TC-7669-004 | `Pass` | REQ-7669-001/002/003; `EMIS` coverage | `evidence/TC-7669-004-clinician-selection-20261001.png` SHA-256 `3551ebf4722aaaaabd8d7b1b0305ca05146d2e1acbc7cda4d87520fb0f96d832` | Mở lại mapping: không có clinician tạm |
| TC-7669-005 | `Pass` | REQ-7669-001/002/003; `PACO Connect` coverage | `evidence/TC-7669-005-baseline-state-20261001.png` SHA-256 `76f134d9e12062a342f8cbdd65085ab24ea78fc9dbc1387256c4664567283c9c` | Mở lại mapping: baseline không đổi |

Không quan sát delay 5–10 giây, popup `waiting for this page to respond`, freeze hoặc crash. Hai timing 8.1 và 10.3 giây từ phép đo MCP/tool-call tách rời bị loại vì không phản ánh click-to-render product timing.

## Automation Verification

- Spec: `playwright/tests/tickets/PAC2-7669-TC-001-005.spec.ts`.
- Spec SHA-256: `5108d81daa8bb7eb20ca2d8005ad947e73016d6c6913e159927643ba502f203c`.
- Coverage: 2 Playwright tests map đủ `TC-7669-001..005`.
- Scoped TypeScript check: `Pass`.
- Playwright discovery: `Pass`.
- CLI result: `Blocked` — `Setup or authentication failure`.
- Blocker: `Blocked: Login browser not running. Run npm run auth:login and keep it open.`
- Classification: technical/auth setup blocker; không chứng minh product `Fail` và không thay đổi manual product result `Pass`.

## Defects

Không tạo defect. Không có verified product failure trong scope này.

## Blockers and Open Questions

- Automation CLI chưa xác minh runtime behavior vì authenticated login browser không chạy.
- Ticket không cung cấp absolute performance SLA.
- Proxy-enabled state không có independent UI indicator trong run.

## Video Coverage

Ticket video source minh họa flow `Edit Connections` và clinician selection trên feature branch. Video được ingest thành `video/timeline.md`, contact sheet và frames; manual run hiện tại cung cấp product result.

## Mutation Ledger and Durable Evidence

| Scope | Mutation | Cleanup | Verification |
|---|---|---|---|
| `EMIS` | `Temporary`: clinician selection trong unsaved draft | Gỡ temporary chip; `Cancel`; không `Save` | Mở lại mapping không có clinician tạm |
| `PACO Connect` | `Temporary`: clinician selection trong unsaved draft | Gỡ temporary chip; `Cancel`; không `Save` | Mở lại mapping giữ nguyên baseline |

Không tạo/xóa mapping, không gửi SMS, không tạo appointment, không có leftover. Evidence không chứa credentials, cookies, tokens hoặc auth state.

## Automation Decision

Giữ standalone spec làm regression coverage cho performance regression ở cả hai slot sources. Chạy lại CLI khi local authenticated browser sẵn sàng; technical blocker hiện tại được lưu riêng khỏi product result.

## Regression Recommendations

- Chạy repeated clinician-selection checks cho `EMIS` và `PACO Connect` sau thay đổi proxy/query/rendering.
- Dùng ticket baseline 5–10 giây cho đến khi product owner cung cấp SLA tuyệt đối.
- Luôn cleanup draft bằng `Cancel`; không dùng `Save` cho regression readback này.

## Product Knowledge Proposals

Promote safe reusable direct route `/configuration/` tới `Scheduler Configuration`, role observed `Blinx Deployment`, classification `Observed`, source PAC2-7669, last verified 2026-10-01. Không promote template, clinician, mapping test data hoặc fragile locator.

## Sensitive Data Review

`Redacted/Excluded`: report không chứa patient identifiers, credentials, cookies, tokens, headers hoặc serialized auth state. Mapping labels chỉ được giữ trong ticket artifacts cần traceability; feature map chỉ nhận reusable safe metadata.

## Tester notes

[Protected area]
