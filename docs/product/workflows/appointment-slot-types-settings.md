# Workflow: Appointment Slot Types source

- Classification: `[Observed: dev, Super Admin GB, 2026-10-22]`
- Aliases: `Slot Types`, `Add Slot Type`, `Edit Slot Type`, `Archive Slot Type`
- Coverage: `Partial (interactive)` — **7/14 bounded branches**.
- Confidence: `Medium`
- Source: `product-explore/auto-20261022-1742/ledger.md#6`.

## Business context observed

- Configuration quản lý named Slot Types; owned source xuất hiện trong `Assigned Slot Types` của fresh `Add Session`.
- Actual header `Super Admin GB` verified; chưa kiểm permission matrix hoặc saved Session scheduling.

## Entry và read-only flow

1. `Configuration` → button `Appointment Books` → region cùng tên → `Slot Types`.
2. Route `/paco-connect/configuration/#service-types`; grid headers gồm `Slot Type`, `Service Setting`, `Context Type`, `National Slot Category`, `Required Skills`, `Required Attributes`, `Created Date`, `Created By`, `Actions`.
3. Mở Add speed-dial trước khi chọn `Add Slot Type`; hidden menu text không là clickable control.
4. Owned row menu có `Edit`, `View Audit`, `Archive`. Existing row chỉ dùng đọc menu labels, không chọn action.

## Required test data và safety boundary

- Chỉ Name tiền tố `QA-test` do current run tạo; minimal Create giữ defaults, không chọn existing skills, attributes, health forms hoặc shared assignments.
- Mỗi saved action kiểm configured HTTPS dev host, actual role và exact owned target; ghi ledger trước action, reconcile outcome chưa rõ trước retry.
- Cleanup bằng UI `Archive` trên exact owned row; không restore archived fixture từ run trước để tăng coverage.

## Interactive flow (owned test data)

1. `Add Slot Type` có `Name`, `Service Setting`, `Context Type`, `National Slot Category`, `Required Skills`, `Required Attributes`, `Assigned Health Forms(s)`, `Foreground Colour`, `Background Colour`, `Icon`, `Preview`, `Bookable`, `Billable (paid)`, `Cancel`, `Save`.
2. Initial `National Slot Category` disabled; `Bookable` checked, `Billable (paid)` unchecked. Chưa đổi các controls này.
3. Blank Add/Cancel đóng drawer. Minimal owned Name/Save đóng drawer, hiện success alert; persistence kiểm bằng reload rồi fresh exact owned editor.
4. Owned rename draft/Cancel không giữ draft trong fresh editor. Rename/Save giữ edited Name qua reload/fresh editor.
5. Fresh `Add Session` → `Assigned Slot Types` có owned option sau Create; sau rename original absent, edited present. Không chọn option hoặc Save Session.
6. Owned `Archive` mở `Archive Slot Type`; `Continue` đóng dialog. Fresh source supporting readback và fresh Session picker không còn original/edited; picker hiện `No results found`.
7. Clear source/picker queries, đóng clean Session Add. Cleanup `Done` theo UI Archive; không active leftover.

## Validation behavior

- `Name` không có native `required` attribute trong Add đã kiểm; không suy Name optional phía server.
- Empty submit, duplicate, format/boundary và server validation chưa thử.

## State và persistence

- Create và rename verified bằng reload/fresh owned editor, không dựa riêng success alert.
- Archive copy: `Archiving will hide this slot type from future use. Past records will remain available and continue to appear in analytics.` Đây UI copy, chưa proof retained records/analytics hoặc hard deletion.
- Archive availability removal verified bằng fresh receiver exact empty result; source rendered-row absence chỉ supporting evidence vì search readiness chưa rõ.

## Cross-feature relationships

- `Slot Types source` → `Appointment Sessions source / Assigned Slot Types`: một unique relationship, ba trigger observations: Create present/unselected; rename original absent/edited present; Archive cả hai absent và `No results found`.
- Fresh unsaved Session picker không chọn option; không saved Session, booking hoặc downstream schedule effect.
- Provenance: `product-explore/auto-20261022-1742/ledger.md#6`, `slot-types-observation.json`.

## Anomalies and unverified behavior

- Query retained/early fill sau reload từng chưa hiện owned row; later clear/retype hiện exact row, fresh editor giữ Name. Search readiness/filter semantics `Inconclusive`, nối OQ-071 thay vì tạo duplicate OQ.
- Grid filter từng đổi row index trong lúc action click; failed attempts không Save. Reconcile settled exact owned row trước action tiếp, không chọn first existing row hoặc force click.
- Hidden combobox input trong Session picker bị visible label overlay chặn; visible label-container mở picker bình thường.

## Mutation coverage

| Branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Add / Cancel | Performed | Blank drawer đóng | Không saved record | Done |
| Create / readback | Performed | Owned Name retained | Reload + fresh editor | Done |
| Edit / Cancel | Performed | Draft bỏ, original retained | Fresh editor | Done |
| Rename / readback | Performed | Edited Name retained | Reload + fresh editor | Done |
| Create / Session picker | Performed | Exact original present, unselected | Fresh related view | Done |
| Rename / Session picker | Performed | Original absent, edited present | Fresh related view | Done |
| Archive / Continue / receiver | Performed | Fresh picker exact empty | Source reload supporting + fresh receiver | Done |
| Empty / duplicate / boundary validation | Skipped | Deferred sau main lifecycle | Chưa kiểm | N/A |
| Service classification | Skipped | Domain combinations chưa established | Chưa kiểm | N/A |
| Skills / attributes assignment | Skipped | Không owned prerequisites được chọn | Chưa kiểm | N/A |
| Health-form assignment | Skipped | Không current-run owned active form | Chưa kiểm | N/A |
| Colour / icon / toggle changes | Skipped | Deferred sau main lifecycle | Chưa kiểm | N/A |
| Archive / Cancel | Skipped | Không restore/recreate chỉ để tăng coverage | Chưa kiểm | N/A |
| View Audit | Skipped | Deferred sau main lifecycle | Chưa kiểm | N/A |

**7/14 bounded branches**, 3 persisted business mutations, 1 owned record tạo rồi Archive. Navigation done; main workflow, branches/states, mutation, persistence, relationships, errors/edge partial; validation none. Chưa exhaustive feature coverage.

## Execution và automation guidance

- Chờ actual role/root và settled grid; re-resolve exact owned row index sau filter trước scoped pinned action. Query presence hoặc first rendered rows không chứng minh global search đã settle.
- Drawer scope bằng heading và `Name`; Add cần speed-dial mở. Không replay Create/Save/Archive scripts nếu outcome chưa reconcile.
- Receiver scope `Add Session` → `Assigned Slot Types`, mở visible label-container; search exact synthetic base token, kiểm option counts/empty, clear rồi clean Cancel.
- Scheduling/classification/validation expectations cần trusted basis riêng; observed availability không chứng minh saved Session correctness.

## Provenance and gaps

- `product-explore/auto-20261022-1742/ledger.md#6`, `slot-types-observation.json`, `slot-session-readback.js`.
- Remaining branches ở frontier; archived source không restore/hard delete. Saved Session cần fresh owned prerequisites và scoped cleanup established riêng.

## Saved Session prerequisite pass — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-2011/ledger.md#3`; historical 7/14 giữ riêng.

- Fresh Name/defaults-only Create retained qua reload/fresh editor; exact own Slot Type chọn được trong `Assigned Slot Types`, saved Session fresh Edit retained assignment. Mapping warning chỉ UI copy, chưa notification/Quick Book rule proof.
- Sau Session template Delete, exact own Slot Type Archive; fresh source và fresh Add Session picker absent, exact `No results found`. Không infer generated occurrences removed hoặc analytics retention.
- **Cross-feature relationships:** existing Slot Type→Session edge reverified với Create/Archive, hai triggers, không new unique product edge.
- **Mutation coverage:** 3/3 bounded prerequisite branches: Create/readback; Create→saved Session receiver; Archive→source/fresh picker. Hai persisted Slot Type mutations, Create và Archive; availability cleanup `Done`. Không replay historical rename hoặc thêm classification/assignment/validation coverage.

## Tester notes

