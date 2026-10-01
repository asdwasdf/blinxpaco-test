# Feature Location: PAC2-4399

**Input Revision:** 1
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)
**Role:** `Super Admin GB`
**Located:** 2026-09-22
**Status:** Confirmed with warnings
**Mutation:** None

## Scope

- UI/config candidate: nơi quản lý organisation SNOMED code rules.
- End-to-end filing flow: chưa locate được bằng read-only navigation vì cần safe patient/test-flow context.
- DB migration verification: non-UI; không có route Paco black-box để inspect database records.

## Product Graph Lookup

`docs/product/survey/graph.json` và canonical survey view ghi route reusable:

- `Configuration` → `Organisation` → `Code Rule`
- Route: `/configuration/#code-rules-config`
- Landmarks: `Code Rule Config`, `Search Snomed Code`, `Create or update rules:`, `Submit`
- Source hint: `docs/product/survey/views/organisation-code-rule.md`

Graph cũng ghi `Capacity & Demand` có consultation-observation filter; workflow survey từng quan sát chip `O/E - blood pressure reading`. Route này là analytics, không phải nơi filing hoặc quản lý mapping, nên không chọn làm feature root.

## Verified Entry Path

1. Authenticated Paco dev dashboard với role `Super Admin GB`.
2. Mở `Configuration`.
3. Chọn `Organisation` → `Code Rule`.
4. Xác nhận handoff tới `https://blinx.dev.blinxpaco-np.com/configuration/#code-rules-config`.
5. Xác nhận page title `Code Rule Config` và landmarks `Search Snomed Code`, `Create or update rules:`.
6. Dừng trước việc chọn rule/value hoặc `Submit` vì đây là mutation boundary.

Direct route trên được re-verify trong browser hiện tại; auth còn hợp lệ.

## Candidate Routes

### 1. `Code Rule Config` — Confirmed UI/config root

- Route: `/configuration/#code-rules-config`
- Context: selected organisation; `Super Admin GB`
- Confidence: High cho navigation/location; Low cho relevance trực tiếp tới hard-coded blood-pressure mapping.
- Last safe state: landing page và empty search state.
- Mutation boundary: chọn value tạo draft rule; `Submit`.

### 2. Patient filing flow — Useful candidate, unresolved

- Likely entry hint: `Patient Search` → patient context; exact blood-pressure input/health-form/case flow chưa được source hoặc survey xác nhận.
- Không mở patient record trong LOCATE vì chưa có approved safe test patient; tránh PII và accidental workflow mutation.
- Exact next dependency: QA cung cấp safe test patient category và entry-flow clue, hoặc xác nhận dùng một known test fixture.

### 3. `Capacity & Demand` — Rejected for primary route

- Route hint: `/capacity-demand/`.
- Relevance: analytics filter từng có `O/E - blood pressure reading`.
- Rejection reason: chỉ hiển thị aggregate observation analytics; không filing reading, không inspect clinical code pair, không quản lý migration.
- Dependency revision: ticket input revision 1; không lặp lại nếu source/location clues không đổi.

## Non-UI Verification Exception

REQ-PAC2-4399-002 liên quan DB/config migration. Paco black-box UI không cung cấp database-level evidence để chứng minh mọi record `163020007` đã chuyển sang `75367002` / `1495437014`. Phần này cần một trusted DB query/export hoặc developer evidence ngoài UI; không probe private API.

## Budget

- Meaningful views used: 2/12
  1. Authenticated dashboard/auth validation.
  2. `Code Rule Config` verified root.
- Elapsed: khoảng 3/15 phút.
- Mutation performed: None.

## Warnings and Blockers

- Confirmed target pair do tester cung cấp: `ConceptID 75367002` + `DescriptionID 1495437014`.
- UI config root chưa chứng minh mapping này nằm trong `Code Rule Config`; chỉ location/navigation được xác nhận.
- End-to-end filing route bị blocked bởi thiếu safe test patient/test-data category và exact entry flow.
- DB migration verification không khả dụng qua black-box Paco UI.
- Không có business assertion hoặc fix-status conclusion trong LOCATE.

## Exact Next Action

QA cung cấp safe dev test patient category/fixture và clue cho flow nhập blood pressure. Sau đó chạy `EXPLORE` read-only tới mutation boundary; xin approval riêng trước khi create/update/submit reading. Song song, yêu cầu developer/DB reviewer cung cấp redacted query evidence cho migration scope.

## Tester notes

