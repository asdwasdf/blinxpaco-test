# Automation: PAC2-8384

**Input Revision:** 1
**Environment:** dev
**Updated:** 2026-09-25T13:40:00+07:00

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| PAC2-8384-TC-001 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-8384-TC-002 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-8384-TC-003 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-8384-TC-004 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-8384-TC-005 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-8384-TC-006 | Yes | valid | Confirmed | Yes | Allowed for observation only; business assertion blocked |
| PAC2-8384-TC-007 | Yes | valid | Candidate for proposed toolbar control | Yes | Blocked |

`evaluateUiLocationGate()` inputs pass for TC-001–TC-006: valid location artifact, confirmed sidebar route, ordered entry path, controlled context, role and test-data category are present. TC-007 is blocked because the proposed toolbar entry path is not `Confirmed`.

## Assessment

| Test Case | Decision | Reason | Mutation | Approval |
|---|---|---|---|---|
| PAC2-8384-TC-001 | Later | High-value check, but one manual run must first prove the Book A setup and cleanup path. | Temporary | Granted for this run |
| PAC2-8384-TC-002 | Worth automating | Critical multi-book union regression; deterministic A/B labels give a narrow, repeatable assertion after setup is proven. | Temporary | Granted for this run |
| PAC2-8384-TC-003 | Later | Five option lists require deterministic entity assignment and option provenance not yet demonstrated. | Temporary | Granted for this run |
| PAC2-8384-TC-004 | Later | Rendered-result mapping and empty-slot rules are not sufficiently specified beyond `Appointment Type`. | Temporary | Granted for this run |
| PAC2-8384-TC-005 | Worth automating | Confirmed regression rule and stable A/B appointment-type labels support repeatable assertions after deterministic appointments exist. | Temporary | Granted for this run |
| PAC2-8384-TC-006 | Blocked | Expected loading/empty behavior remains `Inferred`; automation must not create a business verdict. | Temporary | Setup approved; assertion unconfirmed |
| PAC2-8384-TC-007 | Blocked | Expected toolbar control and locator remain `Inferred` and unconfirmed. | None | Not required |

## Minimum Safe Automation

- Automate only TC-002 and TC-005 after one successful manual controlled-data execution proves setup, entity resolution and cleanup.
- Keep setup and cleanup manual for the first run. Do not create a data factory before the UI-safe creation/archive-or-delete flow is observed.
- Reuse one A/B dataset for both candidates; do not automate TC-001 separately because TC-002 already exercises both location options.
- Runtime mutation requires exact run scope, allowed hostname `blinx.dev.blinxpaco-np.com`, `PACO_ALLOW_MUTATION=true`, and a redacted mutation ledger.
- Delete requires separate destructive guard only if the implemented gate classifies that cleanup as `Destructive`; otherwise use the approved archive fallback.

## Plugin-first Execution

**Direct execution result:** Fail
**Why code is/is not valuable:** TC-002 có defect tái hiện được với mapping A/B tin cậy và expected result `Confirmed`; regression automation có giá trị sau khi chuẩn hóa setup/cleanup. Chưa viết code trong run này vì cleanup cần destructive UI flow và TC-005 chưa có deterministic appointment data.

### Manual verdicts — `PAC2-8384-20260925-manual-03`

| Test Case | Result | Observation |
|---|---|---|
| PAC2-8384-TC-001 | Not Run | Không tách riêng single-book `Location` inspection trong run cuối. |
| PAC2-8384-TC-002 | Fail | Chỉ Book A+B được chọn; Session A+B đều render `Temi PCN`, nhưng `Filters` → `Location` trả `No results found`. Vi phạm REQ-PAC2-8384-002 đã `Confirmed`. |
| PAC2-8384-TC-003 | Inconclusive | `Healthcare Professional` có `Gareth Bartlett`; `Slot Type` có `First Contact Physio - eGPlearning`; `Session Name` có A+B. `Location` rỗng; `Patient` và `Appointment Type` chưa được exercise. |
| PAC2-8384-TC-004 | Inconclusive | Chọn Session A làm kết quả giảm từ 2 session/60 available xuống 1 session/48 available và chỉ Session A render. Các filter còn lại chưa áp dụng đầy đủ. |
| PAC2-8384-TC-005 | Not Run | Không tạo deterministic appointment/appointment-type data. |
| PAC2-8384-TC-006 | Inconclusive | Chỉ quan sát empty presentation; requirement vẫn `Inferred`, không verdict business. |
| PAC2-8384-TC-007 | Not Run | Proposed toolbar control vẫn `Inferred`. |

## Automated Tests

| Test Case | Source | Requirement Basis | Status |
|---|---|---|---|
| PAC2-8384-TC-002 | Not created | REQ-PAC2-8384-002 / `ticket.md:13` | Not Implemented — manual proof required |
| PAC2-8384-TC-005 | Not created | REQ-PAC2-8384-005 / `ticket.md:31-35` | Not Implemented — deterministic data required |

## Execution History

| Run | Result | Environment | Role | Revision | Evidence |
|---|---|---|---|---|---|
| Automation review 20260925-1040 | Not Run | dev | `Super Admin GB` | 1 | Artifact review only; no browser execution |
| `PAC2-8384-20260925-manual-01` | Blocked | dev | `Super Admin GB` | 1 | Plugin observation 2026-09-25 10:55–11:04 +07:00; setup and cleanup route validated, no test-case verdict |
| `PAC2-8384-20260925-manual-02` | Blocked | dev | `Super Admin GB` | 1 | Dropdown interaction mất drawer; Book A/B `-02` archived; không có session saved |
| `PAC2-8384-20260925-manual-03` | Fail | dev | `Super Admin GB` | 1 | Plugin observation 2026-09-25; controlled Book A/B + Session A/B mapping; TC-002 failed, TC-003/004 inconclusive, TC-005 not run; raw browser evidence local only |

## Mutation and Cleanup

**Occurred:** Yes
**Class:** Destructive cleanup of owned temporary data
**Approval Scope:** Approved dev run; create two isolated books and associated controlled filter data; cleanup by delete when verified safe, otherwise archive. Clinician fallback `Dr Gareth Bartlett` was separately approved.
**Cleanup:** Completed. `PAC2-8384 Session A 20260925-03` and `PAC2-8384 Session B 20260925-03`, including generated occurrences, were permanently deleted through scoped UI confirmations. `PAC2-8384 Book A 20260925-03` and `PAC2-8384 Book B 20260925-03` were archived. Active searches returned no matching sessions or books.
**Leftover Identifiers:** Archived Book A/B records remain in history/analytics by product design. Không còn active controlled session/book. Một CSV “affected records” download phát sinh khi kiểm tra archive blocker; giữ local-only, không promote.

## Blockers and Warnings

- Defect candidate: TC-002 `Fail` — controlled sessions của cả hai selected books đều hiển thị `Temi PCN`, nhưng `Location` trả `No results found`.
- Dataset chỉ có một shared location và một shared slot type/clinician; không chứng minh union của distinct A/B values như test design ban đầu, nhưng đủ chứng minh multi-book input không được trả rỗng theo REQ-PAC2-8384-002.
- `Michael Ramella` không resolve được làm clinician trong tested locations; dùng approved `Dr Gareth Bartlett`. Không tạo patient/appointment data.
- TC-003 và TC-004 chỉ partial, giữ `Inconclusive`; TC-005 `Not Run`.
- Cleanup bằng archive template bị chặn bởi `Session Can't Be Archived`; scoped permanent delete của owned sessions thành công, sau đó books được archive.
- REQ-PAC2-8384-006 và REQ-PAC2-8384-007 vẫn `Inferred`; không automated verdict.
- Appointment Book UI render dù transport status `404`; technical warning, không phải product failure.
- Raw browser evidence và downloaded affected-record CSV giữ local-only; promote chỉ sau review/redact trước `REPORT`.

## Tester notes

[Protected area]
