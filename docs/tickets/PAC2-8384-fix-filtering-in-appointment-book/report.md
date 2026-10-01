# QA Report: PAC2-8384

**Input Revision:** 1  
**Environment:** dev — `https://blinx.dev.blinxpaco-np.com`  
**Role:** `Super Admin GB`  
**Run/Scope:** `PAC2-8384-20260925-manual-03`; plugin-first controlled A/B dataset  
**Generated:** 2026-09-25  
**Overall:** Fail

## Scope and Limitations

Đã kiểm tra multi-book filter với hai controlled appointment books và hai controlled sessions trong cùng date range. Book A map tới Session A; Book B map tới Session B. Cả hai session render `Temi PCN`, `Dr Gareth Bartlett`, và `First Contact Physio - eGPlearning`.

Đã inspect `Healthcare Professional`, `Slot Type`, `Session Name`, `Location`; đã apply `Session Name` cho Session A. Không tạo patient/appointment data, nên `Patient` và `Appointment Type` chưa được kiểm tra đầy đủ. Không chạy riêng single-book `Location`. REQ-PAC2-8384-006/007 vẫn `Inferred`, không dùng làm business verdict.

## Results

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| `PAC2-8384-TC-001` | Not Run | `REQ-PAC2-8384-001` — Confirmed, `ticket.md:13` | Không có durable execution evidence | Shared controlled data đã cleanup |
| `PAC2-8384-TC-002` | Fail | `REQ-PAC2-8384-002` — Confirmed, `ticket.md:13` | `automation.md`, run `PAC2-8384-20260925-manual-03`; `defects/PAC2-8384-DEF-001.md` | Sessions deleted; books archived |
| `PAC2-8384-TC-003` | Inconclusive | `REQ-PAC2-8384-003` — Confirmed, `ticket.md:13` | `automation.md`; partial option observations | Sessions deleted; books archived |
| `PAC2-8384-TC-004` | Inconclusive | `REQ-PAC2-8384-004` — Confirmed, `ticket.md:13` | `automation.md`; Session A filter observation | Sessions deleted; books archived |
| `PAC2-8384-TC-005` | Not Run | `REQ-PAC2-8384-005` — Confirmed, `ticket.md:31-35` | Không có deterministic appointment data | Không tạo appointment |
| `PAC2-8384-TC-006` | Inconclusive | `REQ-PAC2-8384-006` — Inferred | `automation.md`; non-verdict observation | Shared controlled data đã cleanup |
| `PAC2-8384-TC-007` | Not Run | `REQ-PAC2-8384-007` — Inferred | Không chạy proposed toolbar behavior | None |

**Tổng:** 0 Pass · 1 Fail · 0 Blocked · 2 Inconclusive · 3 Not Run; 1 exploratory non-verdict Inconclusive.

## Defects

- [`PAC2-8384-DEF-001`](defects/PAC2-8384-DEF-001.md) — Multi-book `Location` filter rỗng dù controlled sessions có visible location.

## Blockers and Open Questions

1. `TC-003`: chưa có patient/appointment data; không đánh giá `Patient` và `Appointment Type` option provenance.
2. `TC-004`: mới apply `Session Name`; chưa apply từng `Location`, `Slot Type`, clinician và patient filter.
3. `TC-005`: cần deterministic appointment/type fixture trước khi execute.
4. REQ-PAC2-8384-006/007 cần BA/PO xác nhận trước business verdict hoặc automation assertion.

## Video Coverage

Đã ingest/review 3/3 video. `126788` map single-book `Location` tới REQ-001/TC-001; `126786` map multi-book `Location` tới REQ-002/TC-002; `126787` map các filter khác và `Appointment Type` tới REQ-003/005, TC-003/005. Video hỗ trợ reported behavior/navigation; environment và role nguồn không xác định nên không tự tạo expected behavior mới.

## Mutation Ledger and Durable Evidence

Run `PAC2-8384-20260925-manual-03`, dev, owned controlled records only. Created Book A/B and Session A/B. Cleanup dùng permanent delete cho owned sessions/occurrences sau khi archive bị chặn; Book A/B archived. Active searches không còn controlled sessions/books. Archived books còn trong history/analytics theo product design.

Không promote screenshot từ raw runs cũ vì chúng không ghi lại controlled failing state. Downloaded affected-record CSV không được promote hoặc đọc; giữ local-only. Durable execution evidence là redacted observation ledger trong `automation.md`, defect artifact và test-run summary.

## Automation Decision

**Worth automating: TC-002**, sau khi chuẩn hóa safe setup/destructive cleanup. Expected result `Confirmed`, defect tái hiện được, locator/filter flow ổn định. **TC-005: Later**, thiếu deterministic appointment data. Không tạo automation trong run này.

## Regression Recommendations

- Thêm focused TC-002 regression với two-book controlled data và assertion `Location` không rỗng khi visible sessions có mapped location.
- Tách setup/cleanup helper chỉ sau khi destructive cleanup guard được chuẩn hóa.
- Chạy lại TC-001, TC-003, TC-004 và TC-005 khi có distinct location/slot/appointment fixtures.

## Product Knowledge Proposals

Không promote semantic product knowledge. Confirmed route đã nằm trong `feature-location.md`; report không thay đổi meaning hoặc classification.

## Sensitive Data Review

Không copy credentials, cookies, tokens, headers, auth state hoặc patient identifiers. Raw browser artifacts và CSV giữ local-only. Report chỉ chứa controlled labels và approved clinician name cần cho traceability.

## Tester notes

[Protected area]
