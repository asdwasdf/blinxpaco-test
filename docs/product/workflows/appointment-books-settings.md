# Workflow: Appointment Books source

- Classification: `[Observed: dev, Super Admin GB, 2026-10-22]`
- Aliases: `Configuration`, `Appointment Books`, `Add Appointment Book`, `Edit Appointment Book`
- Coverage: `Partial (interactive)` — 8/12 bounded branches; không cộng với schedule/selector coverage.
- Confidence: `Medium`
- Provenance cho mọi observation dưới đây: `product-explore/auto-20261022-1742/ledger.md#3`.

## Business context observed

- Source quản lý tên book; `Appointment Book` schedule selector nhận Create, rename và Archive của owned source.
- Actor/context đã verified: `Super Admin GB`, configured dev host. Không kiểm permission matrix.
- Grid có `Organisations`, `Owned Organisation`, `Appointment Book Name`, `Created Date`, `Created By`, `Actions`; row menu có `Edit`, `View Audit`, `Archive`.

## Entry

1. Mở known `/paco-connect/configuration/`; hover `Appointment Books` trong configuration navigation.
2. Chọn child link `Appointment Books`; route `/paco-connect/configuration/#appointment-books`.
3. Chờ actual-role header và grid/search `Search Appointment Book...`; document HTTP `404` không tự chứng minh app lỗi.

## Read-only flow

- Search query có thể retained sau reload nhưng exact owned row chưa render; `Enter` không khôi phục, clear/retype từng làm row hiện lại. Không dùng query hoặc initial row absence làm persistence/ownership proof.
- Scope action bằng exact owned name và đúng grid row; chỉ click khi action control unique. Transient duplicate buttons từng gây strict locator error; không dùng arbitrary first row hoặc retry saved mutation.

## Decision points

- New form: `Name` required; `Shared Organisations` combobox, `Cancel`, `Save`, `Close`.
- Owned editor: `Name`, `Shared Organisations`, `Cancel`, `Save`. Fresh editor hiển thị current organisation dù Create không chọn sharing; sharing semantics chưa established.
- `Archive Appointment Book`: `Close`, `Cancel`, `Continue`; dialog không in target name nên phải giữ liên kết với exact owned row đã mở.

## End and exceptional states

- Create đóng drawer, alert `Appointment book created`; Archive đóng dialog, alert `Appointment book archived`.
- Archive copy: `Archiving will hide this appointment book from future use. Past records will remain available and continue to appear in analytics.` Chỉ observed copy; chưa kiểm past-record/analytics retention.
- Search anomaly và render delay không đủ kết luận product defect; OQ-071.

## Safety boundary

- Chỉ scoped owned-row Create/rename/Archive trên `QA-test` của run hiện tại; guard configured HTTPS dev và actual role trước mỗi saved action.
- Không sửa existing records, thay sharing, tạo session/booking, chọn schedule book, `Export` hoặc dùng private APIs.
- `whole-list`/`unknown-scope` cần tester authorization; source lifecycle không mở các decisions pending.

## Required test data

- Một owned name `QA-test-<run-id>-book-1`, rename thêm `-edited`; không patient, session, recipient hoặc file.
- Cleanup bằng UI `Archive`; không restore/hard delete để chứng minh retention.

## Interactive flow (owned test data)

1. Add blank form rồi `Cancel`: drawer đóng, không saved record.
2. Blank `Save`: native required validation giữ form; minimal Name `Save`: owned row xuất hiện.
3. Reload và fresh exact owned `Edit`: Name retained, chứng minh Create persistence.
4. Sửa draft Name rồi `Cancel`; fresh reopen giữ original. Rename rồi `Save`, reload/fresh editor giữ edited Name; Save chỉ dispatch một lần dù later locator error.
5. Fresh schedule selector: created original xuất hiện unselected; sau rename original absent/edited present. Không click option hoặc `Done`; clear query rồi `Close`.
6. Exact owned row `Archive` → inspected dialog → `Continue`: toast và row removal; fresh source reload không thấy original/edited trong rendered rows, fresh receiver base-token search báo `No appointment books found`. Selection baseline unchanged.

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| `Name` required | Blank | `Please fill out this field.`; form giữ mở | Có, native browser | `Observed` |
| Duplicate / boundary / server rules | Chưa thử | DOM không có `maxLength` không chứng minh server unbounded | Chưa biết | `Open Question` |

## Cross-feature relationships

- `Appointment Books source` → `Appointment Book / Select Appointment Books`: Create làm exact owned option xuất hiện, rename thay original bằng edited, Archive làm cả hai absent trong fresh picker. Một unique relationship, ba trigger observations; không booking/clinical relationship. `[Observed]` — `product-explore/auto-20261022-1742/ledger.md#3`.

## Anomalies and unverified behavior

- Source search/filter correctness `Inconclusive`; source row absence chỉ supporting evidence, independent receiver empty mới bổ sung cleanup proof. OQ-071.
- `Archive` đã verified availability removal qua fresh UI; archived record retention, restore, past records và analytics chưa kiểm.
- `View Audit`, explicit sharing change, `Export`, Archive/Cancel, duplicate/boundary/server validation chưa chạy.

## Mutation coverage

| Workflow branch | Status | Validation / transition observed | Persistence verified | Cleanup |
|---|---|---|---|---|
| Add / Cancel | Performed | Blank form đóng | Không saved record | Done |
| Blank Name / Save | Performed | Native required block | N/A | Done |
| Create / readback | Performed | Drawer đóng, owned row | Reload + fresh editor | Done qua Archive |
| Edit / Cancel | Performed | Draft discarded | Fresh editor original | Done |
| Edit / Save | Performed | Renamed source | Reload + fresh editor | Done qua Archive |
| Create / selector receiver | Performed | Exact original unselected | Fresh related view | Query clear / Close |
| Rename / selector receiver | Performed | Original absent, edited present | Fresh related view | Query clear / Close |
| Archive / Continue / receiver | Performed | Dialog đóng; source và picker absent | Source reload + fresh receiver empty | Done, không hard delete |
| Archive / Cancel | Skipped | Deferred sau main lifecycle | Chưa kiểm | N/A |
| View Audit | Skipped | Không cần cho main lifecycle; deferred | Chưa kiểm | N/A |
| Shared Organisations change | Skipped | Sharing footprint chưa established | Chưa kiểm | N/A |
| Export | Skipped | Chưa có owned-only export scope | Chưa kiểm | N/A |

- Branches exercised / found: **8/12**, bounded interaction map, không whole-feature inventory.
- 3 saved mutations có UI persistence proof: Create, rename, Archive. 1 record đã Archive, 0 active leftovers; hệ thống có thể retain theo copy, không hard-delete claim.
- Dimensions: navigation `done`; main workflow, branches/states, mutation, validation, persistence, relationships, errors/edge `partial` do các nhánh và retention/rules chưa kiểm.

## Execution guidance

- Reuse route, actual-role/loading waits; dùng owned synthetic Name, không sửa current organisation/sharing.
- Sau saved action có outcome chưa rõ: read-only reconcile exact owned source/fresh editor/receiver trước retry.
- Cleanup Archive cuối; giữ query blank, dialogs/drawers đóng và schedule selection unchanged.

## Automation guidance

- Scope Add/Edit bằng complementary heading, Archive bằng named dialog, receiver bằng `Select Appointment Books` và listbox `Appointment books`.
- Chờ selected option settled trước baseline; so labels chỉ trong memory, không persist existing names.
- Toast/HTTP status không là persistence assertion. Search filtering, sharing, retention và permission cần trusted expected basis riêng.

## Provenance and gaps

- Evidence: `product-explore/auto-20261022-1742/ledger.md#3`, `book-source-observation.json`, `book-cleanup-readback.js`.
- OQ-071: source query/filter semantics; không chốt các pending mutation decisions.
- Resume: main lifecycle đã cleanup; không replay mutation scripts hoặc restore archived source. Rescore independent frontier.

## Saved Session prerequisite pass — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-2011/ledger.md#3–4`; historical 8/12 giữ riêng.

- Fresh Name-only Book Create retained qua reload/fresh editor; exact owned option chọn được trong `Assigned Appointment Book`, saved Session fresh editor retained assignment. Sau Session template Delete, exact own Book Archive; fresh source và Session picker absent/`No results found`.
- **Cross-feature relationships:** Book→Session picker là new unique relationship với hai triggers Create/Archive. Book→schedule selector Archive absence cũng reverified bằng `No appointment books found`, settled selection unchanged; không new edge hoặc generated-occurrence cleanup proof.
- **Mutation coverage:** 3/3 bounded prerequisite branches: Create/readback; Create→Session receiver; Archive→source/fresh receivers. Hai persisted Book mutations, Create và Archive; cleanup availability `Done`, archived retention chưa kiểm. Không replay historical rename/sharing/Export branches; run này không chọn existing assignment hoặc schedule book.

## Tester notes

