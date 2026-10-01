# QA Report: PAC2-4700

**Input Revision:** 1  
**Environment:** dev — baseline `/paco/dashboard` (`PAC2-4683`), Connect branch, OS branch, GP branch  
**Role:** `Super Admin GB`; authenticated GP user  
**Run/Scope:** `20260923-plugin-qs`, `20260923-plugin-ramella`, `20260923-plugin-gp-ramella`, `20260923-plugin-three-link-deep`, `20260924-plugin-quick-send-no-send`; read-only  
**Generated:** 2026-09-24  
**Overall:** Inconclusive

## Scope and Limitations

Đã kiểm tra read-only `Quick Send` trên baseline, Connect, OS và GP; `Quick Form` trên GP; route `Rocket Bar`; 8/8 video nguồn. Baseline live được tester xác nhận là `PAC2-4683`.

Không thực hiện `Save`, `Send`, `Schedule`, chọn campaign/slot/form/file hoặc mutation khác. Focused rerun 2026-09-24 xác nhận baseline, OS và GP mở `Quick Send`; `Files` thoát loading và hiện `Select Attachment`. Baseline/OS mặc định `Email`; GP mặc định `SMS` với campaign khác. Connect reproduce hai lần việc chọn patient từ branch dashboard nhưng điều hướng sang baseline patient profile, nên so sánh Connect trong run mới là Inconclusive. `Rocket Bar` không chạy được vì máy test thiếu desktop protocol handler. Không có mapped campaign đã duyệt cho `TC-013`; expected của `TC-010`..`015` chỉ `Inferred`/Disputed nên không kết luận Pass/Fail.

## Results

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| `PAC2-4700-TC-001` | Pass | `REQ-PAC2-4700-001/002/005/006` — Confirmed, ticket QA focus | `automation.md` runs `20260923-plugin-qs`, `20260923-plugin-ramella` | None; `Close` hoàn tất |
| `PAC2-4700-TC-002` | Pass | `REQ-PAC2-4700-003/006` — Confirmed, ticket QA focus | `automation.md` run `20260923-plugin-qs` | None; `Close` hoàn tất |
| `PAC2-4700-TC-003` | Pass | `REQ-PAC2-4700-004/005` — Confirmed, ticket QA focus | `automation.md` run `20260923-plugin-qs` | None; `Close` hoàn tất |
| `PAC2-4700-TC-004` | Pass | `REQ-PAC2-4700-007` — Confirmed, ticket Quick form scope | `automation.md` run `20260923-plugin-gp-ramella` | None; không chọn form; `Close` hoàn tất |
| `PAC2-4700-TC-005` | Pass | `REQ-PAC2-4700-008` — Confirmed, consumer-app coverage | `automation.md` run `20260923-plugin-gp-ramella` | None; `Close` hoàn tất |
| `PAC2-4700-TC-006` | Blocked | `REQ-PAC2-4700-008` — Confirmed, Rocketbar consumer | `automation.md` run `20260923-plugin-gp-ramella` | None; external handler absent |
| `PAC2-4700-TC-010` | Inconclusive | `REQ-PAC2-4700-009` — Inferred from ticket discussion/media | `automation.md` run `20260923-plugin-ramella` | None; `Close` hoàn tất |
| `PAC2-4700-TC-011` | Inconclusive | `REQ-PAC2-4700-010` — Inferred from ticket discussion/media | `automation.md` run `20260923-plugin-qs` | None; `Close` hoàn tất |
| `PAC2-4700-TC-012` | Inconclusive | `REQ-PAC2-4700-011` — Inferred from ticket discussion/media | `automation.md` run `20260923-plugin-ramella` | None; không add file; `Close` hoàn tất |
| `PAC2-4700-TC-013` | Blocked | `REQ-PAC2-4700-012` — Inferred; thiếu mapped campaign | `automation.md` run `20260923-plugin-ramella` | None; không chọn campaign/slot |
| `PAC2-4700-TC-014` | Inconclusive | `REQ-PAC2-4700-013` — Inferred, Disputed | `automation.md` runs `20260923-plugin-qs`, `20260923-plugin-ramella` | None; `Close` hoàn tất |
| `PAC2-4700-TC-015` | Inconclusive | `REQ-PAC2-4700-014` — Inferred | `automation.md` run `20260923-plugin-qs` | None; không chọn campaign; `Close` hoàn tất |

**Tổng:** 5 Pass · 0 Fail · 2 Blocked · 5 Inconclusive · 0 Not Run.

## Defects

Không tạo defect. Không có `Fail` với expected basis rõ và precondition đầy đủ.

## Blockers and Open Questions

1. `TC-006`: route GP sidebar → `Rocket Bar` → `Launch Rocket Bar` đã Confirmed; máy test thiếu handler cho `blinx-paco-rocket://`. Đây là blocker environment/integration, không phải product Fail.
2. `TC-013`: cần campaign có mapped EMIS slot được duyệt để so sánh cùng state.
3. `TC-010`..`015`: Jira AC trống; expected vẫn `Inferred`; `REQ-PAC2-4700-013` còn Disputed.
4. Optional coverage sâu cho `TC-012`: patient fixture có documents thực tế; picker hiện tại empty.
5. Connect branch: chọn cùng patient từ branch dashboard reproduce hai lần việc chuyển sang baseline `/paco/patient-profile/...`; cần QA xác nhận branch-context retention là expected trước khi tạo defect.

## Video Coverage

Đã ingest và review 8/8 video (`.mp4` + `.mov`). Timeline/contact sheet map tới patient details, campaign/sort, `Health Forms`, `Files`, `Booking Link`, scheduler prompt và consumer contexts Connect/GP/OS/Rocketbar. Bốn MOV bổ sung chỉ củng cố flow đã biết; không tạo requirement mới. Environment/role của MOV không xác định nên chỉ dùng làm Observed supporting evidence.

## Mutation Ledger and Durable Evidence

Mutation ledger: **None**. Cleanup: đóng dialog trên từng host; không có draft/server change hoặc leftover identifier.

Không có durable screenshot/trace được promote. Evidence thực thi nằm trong `automation.md`; raw screenshots/frames có patient identifiers nên giữ local, không share. Video timelines dưới `video/` là artifact ingest local có cảnh báo PII.

## Automation Decision

**Not worth automating trong run này.** `TC-001`..`003` có thể automate Later bằng smoke nhỏ, locator ổn định, không pixel-diff. Không automate `TC-010`..`015` khi expected chỉ `Inferred`/Disputed; `TC-006` phụ thuộc desktop app; `TC-013` thiếu fixture.

## Regression Recommendations

- Sau khi có desktop Rocket Bar handler, chạy lại `TC-006` read-only trên cùng branch.
- Khi có mapped campaign và patient documents, chạy lại `TC-012`/`013` cùng state trên baseline/Connect/OS/GP.
- Nếu QA xác nhận expected cho `REQ-PAC2-4700-009`..`014`, nâng test basis trước khi thêm assertion automation.

## Product Knowledge Proposals

Không promote route/product knowledge trong report này. Route đã quan sát có context chứa patient data và chưa cần thay đổi product graph để kết luận ticket.

## Sensitive Data Review

Patient identifiers xuất hiện trong raw browser evidence và extracted video frames. Không copy NHS, phone, email hoặc patient value vào report. Evidence nhạy cảm giữ local; không share. Không đọc/lưu credentials, cookies, tokens hoặc auth state.

## Tester notes

[Protected area]
