# QA Report: PAC2-4399

**Input Revision:** 2
**Environment:** dev
**Role:** `Super Admin GB`
**Run/Scope:** Read-only verification requested by Beth
**Generated:** 2026-09-29
**Overall:** Inconclusive

## Scope and Limitations

Beth xác nhận scope cần kiểm tra là side panel edit của component `Blood Pressure` trong `Health Form Designer`, không phải modal `Health Form Inbox`. Read-only verification xác nhận form `Blood Pressure O/E coding test` có combined O/E option được chọn. Không tạo, update, submit, file, send, query DB/private API, hoặc chạy Playwright test.

Không có quyền EMIS/primary-care record, nên không thể quan sát code đã filed. Ticket vẫn thiếu `Acceptance criteria`; mapping `ConceptID 75367002` + `DescriptionID 1495437014` và migration scope giữ trạng thái `Inferred`/`Disputed`.

## Results

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| Beth O/E configuration check | Pass | Beth clarification; UI configuration observation | `exploration.md` | Read-only; no mutation |
| PAC2-4399-TC-001 | Blocked | REQ-PAC2-4399-001, `Inferred`/`Disputed` | `requirements.md`, `exploration.md` | EMIS/primary-care result access unavailable; no mutation |
| PAC2-4399-TC-002 | Blocked | REQ-PAC2-4399-002, `Inferred`/`Disputed` migration scope | `requirements.md`, `test-cases.md` | Trusted redacted DB evidence missing |
| PAC2-4399-TC-003 | Blocked | REQ-PAC2-4399-003, `Inferred` | `requirements.md`, `exploration.md` | EMIS/primary-care result access unavailable; no mutation |

## Beth O/E Configuration Check

- Path: `Health Form Designer` → `Blood Pressure O/E coding test` → `Edit Health Form` → first `Blood Pressure` component edit sidebar.
- `Record BP readings as: "O/E - blood pressure reading 125/89 mmHg"` visibly selected.
- `Record BP readings as Separate Diastolic and Systolic entries` visibly unselected.
- Result: `Pass` cho verification request của Beth. Không phải confirmation của EMIS mapping/filed result.

## Product Result

- Ticket mapping result: `Blocked`.
- Beth O/E configuration check: `Pass`.

## Automation Verification

Không tạo/runs spec. Ticket expected mapping còn `Inferred`/`Disputed`; EMIS result surface unavailable.

## Defects

Không tạo defect PAC2-4399. HF Inbox modal observation ngoài scope clarification của Beth và không dùng để đánh giá O/E configuration.

## Blockers and Open Questions

1. Không có quyền EMIS/primary-care record để kiểm tra clinical code đã filed.
2. Mapping/filed-result surface chưa được xác nhận; O/E UI selection không đủ chứng minh `ConceptID`/`DescriptionID` đã filed.
3. Migration scope chưa xác định: mọi `ConceptID 163020007` hay subset theo `DescriptionID`.
4. Thiếu timestamped redacted DB query/export cho TC-002; Paco black-box UI không quan sát DB mapping.
5. Expected representation của systolic/diastolic values chưa được BA/PO/domain owner xác nhận. TC-003 không thể dùng assertion `Inferred`.
6. Ticket description, Jira DB-change field, và comment migration mâu thuẫn; không tự giải quyết.

## Video Coverage

Video revision 2 minh họa `Health Form Designer` và blood-pressure setup. Không hiển thị EMIS filing/code result; chỉ hỗ trợ context cho Beth O/E configuration check.

## Mutation Ledger and Durable Evidence

- Mutation: None.
- Cleanup: Not applicable.
- Durable evidence: `exploration.md` records read-only O/E selection verification. Không có EMIS/primary-care evidence. Artifact nguồn PNG chỉ hỗ trợ nhận định `163020007` deprecated; không chứng minh behavior Paco hoặc migration hoàn tất.

## Automation Decision

- TC-001: `Blocked` — thiếu stable entry flow, fixture, EMIS surface, approval, cleanup.
- TC-002: `Not worth automating` — cần trusted DB evidence, ngoài Paco UI; không probe private API/DB.
- TC-003: `Blocked` — expected value behavior chỉ `Inferred`, thêm các blocker TC-001.

## Regression Recommendations

Sau khi blocker được giải quyết, chạy TC-001 và TC-003 manual trước. Chỉ cân nhắc automation TC-001 khi route/locator ổn định, fixture cleanup được chứng minh, và EMIS code result có assertion `Confirmed`/`Observed` an toàn. Giữ TC-002 manual evidence review.

## Product Knowledge Proposals

Không promote product knowledge: `Code Rule Config` route đã tồn tại trong product survey; chưa có evidence liên kết route đó với PAC2-4399 mapping. Patient entry flow chưa xác nhận.

## Sensitive Data Review

Không đưa patient identifier, NHS number, contact data, auth state, token, cookie, query credential hoặc raw EMIS data vào artifacts.

## Tester notes

