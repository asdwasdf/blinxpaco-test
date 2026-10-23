# Workflow: Organisation Services

- Classification: `Observed: dev, Blinx Deployment, 2026-10-21`
- Aliases: `Services`
- Coverage: `Partial (read-only + unsaved draft)` — chỉ `Add`/`Remove` draft và reload discard; global `Save` và persisted CRUD chưa thử
- Confidence: `Medium`

## Business context observed

- Visible purpose (`Observed`): màn danh sách service với fields chỉnh sửa, `Add Another`, `Remove service` và global `Save`.
- `Unverified hypothesis`: service có thể dùng lại trong module khác; consumer chưa verified.
- Actor/role: `Blinx Deployment`
- Required context: authenticated `Blinx Deployment` role, dev environment
- Starting data state: 4 editable service rows có sẵn (values không record)
- Entities and statuses: service drafts (unsaved) và persisted services (CRUD chưa thử)

## Entry

1. `Configuration` → `Organisation` → `Services` (visible submenu)
2. Route `/paco/configuration/organisation/services`; heading `Services`, `Search Services...`

## Read-only flow

1. **Action:** vào Services list
   - **Transition:** render 4 editable rows, mỗi row có `Service ID` (maxlength 15), `Service Name` (maxlength 255), `Case Type` (rendered dropdown có native hidden select), `Remove service` button; footer `Add Another`, `Save`
   - **Observed result:** global `Save` enabled với baseline; không native required trên inputs đã inspect
   - **Evidence:** ledger #15

## Decision points

- **Add new service:**
  - **Unsaved draft:** Add Another tạo row mới, không persist qua reload
  - **Persisted create:** global Save chưa thử (OQ-052 blocker)
  
- **Service ID validation:**
  - **Numeric input:** alphabetic/hyphen chars lọc ra, pattern `[0-9]*`
  - **Length boundary:** 16 digits giữ 15 ký tự (maxlength)

- **Service Name validation:**
  - **Length boundary:** 256 ký tự giữ 255 (maxlength)

## End and exceptional states

- End state observed: Services list với 4 baseline rows, không owned draft
- Empty/loading/error states: chưa map
- Cross-feature handoff: consumer chưa verified

## Safety boundary

- Last safe read-only state: Services list loaded, 4 baseline rows
- Approval stop: global `Save` (write footprint trên shared list chưa xác lập)
- Actions not performed: Save, persisted CRUD, Case Type selection/Save, edit existing row, remove persisted service
- Mutation: see `## Mutation coverage`

## Required test data

- Owned synthetic data (`QA-test-<run-id>-<n>`):
  - Service Name: `QA-test-auto-20261021-1359-5` (bắt buộc có prefix `QA-test`)
  - Service ID: numeric synthetic `13595` (chỉ client validation draft, valid domain chưa chứng minh)
- Pre-existing data needed: không (unsaved draft experiment)

## Interactive flow (owned test data)

1. **Action:** `Add Another` → nhập owned Service ID numeric `13595`, Name `QA-test-auto-20261021-1359-5`, không chọn `Case Type`
   - **Result / state after:** draft row thứ 5 xuất hiện, ownership verified bằng exact Name
   - **Persistence after reload:** không persist — reload discard draft, trả về 4 baseline rows
   - **Evidence / ledger ref:** ledger #15, `services-draft-check.js` (`afterAdd: 5`, `afterReload: 4`, `ownedInputs: 0`)

2. **Action:** `Remove service` trên owned unsaved draft
   - **Result / state after:** owned row biến mất, trả về 4 baseline rows
   - **Persistence after reload:** N/A (Remove chỉ unsaved draft)
   - **Evidence / ledger ref:** `services-draft-check.js` (`afterRemove: 4`)

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| Service ID pattern | `QA-test-a1359-5` | lọc thành `13595` (chỉ giữ numeric) | N/A (no submit) | Client validation — Observed |
| Service ID maxlength | 16 digits | giữ 15 ký tự | N/A | Client validation — Observed |
| Service Name maxlength | 256 chars với prefix | giữ 255 ký tự | N/A | Client validation — Observed |
| Case Type | opened rendered dropdown | 14 option labels (không chọn); `Not set` trong native hidden select không đại diện danh sách popup | N/A | Observed |

## Cross-feature relationships

- Chưa verified receiver/consumer nào; không Observed relationship

## Anomalies and unverified behavior

- Anomalies / possible defects: không
- Unverified behavior and blockers:
  - `OQ-052`: global `Save` footprint trên shared service list chưa xác lập; không biết Save có scope riêng owned draft hay write toàn bộ rows
  - Server validation rules (required, unique ID, valid ID domain, Case Type constraint) chưa biết
  - Persisted service CRUD (create/edit/remove existing) chưa thử
  - Case Type selection effect và consumer chưa verified
  - `Unverified hypothesis`: service có downstream mapping; chưa có receiving-side evidence cho module nào.

## Mutation coverage

| Workflow branch | Status (Performed/Skipped/Not supported) | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Add→owned draft→Remove | Performed | — | ID numeric filter, maxlength; Name maxlength | Add (5 rows) → Remove (4 rows) | No (unsaved draft) | Remove, reload |
| Add→owned draft→reload discard | Performed | — | Same as above | Add (5 rows) → reload (4 rows, owned inputs 0) | Verified discard (reload check) | Reload |
| Draft→Save persisted | Skipped | OQ-052: global Save footprint trên shared list chưa xác lập | — | — | — | — |
| Edit own persisted→Save | Skipped | No persisted service created | — | — | — | — |
| Case Type selection→Save | Skipped | OQ-052 + consumer chưa verified | 14 options visible | — | — | — |
| Remove own persisted→Save | Skipped | No persisted service created | — | — | — | — |
| Source→downstream | Skipped | Consumer chưa map | — | — | — | — |

- Branches exercised / found: 2 / 7

- Still needs interaction testing: persisted CRUD với scoped/global Save clarification, Case Type selection và downstream consumer mapping

## Execution guidance

- Setup/data: authenticated `Blinx Deployment`, dev environment; synthetic owned Service ID numeric (valid domain chưa verified), Name `QA-test-` prefix
- Safe manual steps: Add Another → nhập owned ID/Name → inspect validation, Case Type options → Remove unsaved draft hoặc reload
- Stop and request approval before: global `Save` (shared list footprint chưa rõ)
- Evidence to capture: row count, input values, Case Type options, reload state

## Automation guidance

- Stable roles/labels/landmarks: heading `Services`, button `Add Another`, `Remove service`, footer `Save`; `Service ID`/`Service Name`/`Case Type` labels
- Observable waits: heading `Services`, row count settled (baseline 4 hoặc sau Add), `Remove service` button xuất hiện/biến mất
- Data dependencies: không (unsaved draft); persisted test cần clarify Save scope
- Assertions lacking trusted expected basis: server validation rules, valid Service ID domain, Case Type constraint, Save behavior

## Provenance and gaps

- Environment: dev (`https://blinx.dev.blinxpaco-np.com`)
- Role: `Blinx Deployment`
- Observed at: 2026-10-21
- Raw evidence: `test-results/product-explore/auto-20261021-1359/ledger.md` #15–#16, `services-draft-check.js`; #16 ghi fresh-page cleanup cuối.
- Check limitation: `caseTypeOptions: ["Not set"]` trong script chỉ đọc native hidden select. Quan sát popup 14 labels được ghi riêng trong ledger #15, không từ array đó.
- Open questions: `OQ-052` (global Save footprint), server validation rules, persisted CRUD, Case Type consumer, downstream mapping
- Exact resume state: Services list `/paco/configuration/organisation/services`, 4 baseline rows, no owned draft, no dialogs; next feature do autonomous checkpoint quyết định

## Saved lifecycle — Super Admin GB, 2026-10-23

- Classification: `Observed`, dev, role `Super Admin GB`; historical `Blinx Deployment` sections above remain separate.
- Authorization: `DEC-shared-list-save` answered; page `Save` permitted for synthetic Services. Historical approval stops above no longer block this authorized scope; whole-list write footprint still unproven.
- Provenance: `product-explore/auto-20261023-0506/ledger.md#10`.
- `Add Another` → owned numeric ID/name, `Case Type` left `Not set` → `Save` → reload: fifth row persisted, exact ID/name and blank Case Type. This input accepted; not proof all numeric IDs valid.
- Rename owned service and choose `Community` → `Save` → reload: edited name and Case Type persisted together. No clinical case created.
- `Remove service` on owned persisted row opens `Delete Confirmation` with exact name, `Cancel` / `Delete`. Confirm `Delete` showed `Item deleted successfully!`; after loading/reload owned row absent, baseline count four, zero dialogs. No extra footer Save needed after confirmed deletion. Footer Save was clicked while confirmation open before confirm; no separate effect established.
- Runnable cleanup check: `test-results/product-explore/auto-20261023-0506/services-cleanup-check.js`, passed. Three persisted changes; cleanup `Done`, no new leftover.

### Current-role mutation coverage

| Branch | Status | Evidence / limitation |
|---|---|---|
| Create with Case Type Not set/reload | Performed | Exact synthetic Name/ID persisted |
| Rename/reload | Performed | Exact edited name persisted |
| Case Type selection/Save/reload | Performed | Community persisted with rename |
| Remove/confirmation/reload | Performed | Success, owned absent, four baseline rows |
| Required/duplicate validation | Skipped | Bounded pass; no message observed |
| Server boundary/ID domain | Skipped | Client-only historical checks not server proof |
| Downstream receiver | Skipped | No UI-supported consumer verified |

- Coverage: `Partial`, 4/7 current-role branches; historical draft denominator not additive.
- Remaining: required/duplicate rules, accepted ID domain, Delete Cancel, consumers and shared Save concurrency footprint. No new defect or relationship claim.

## Tester notes
