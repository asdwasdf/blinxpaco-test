# Workflow: Organisation Locations

- Classification: `Observed: dev, Blinx Deployment, 2026-10-21`; không phải requirement hoặc product verdict.
- Aliases: `Locations`, `Add Location`, `Enter Address`.
- Coverage: `Partial (interactive)` — 7/12 nhánh trong inventory giới hạn có end state; 5 nhánh `Skipped`. Không toàn bộ feature hoặc `Complete`.
- Confidence: `Medium` trong scope đã chạy; cleanup `Done: UI Archive` và Add draft đã discard, read-only recheck `2026-10-21T20:00:15.316Z`. Browser tiếp theo `Blocked` bởi latest connector notice sau Sharing Agreements menu; current UI chưa recheck.

## Business context observed

- `[Observed; ledger #3,#7–11]` UI cho phép tạo và sửa một `Location` có Name, Address, Contact Number, Email; owned record xuất hiện trong grid sau reload.
- Actor: `Blinx Deployment`, environment `dev`. Resume auth dùng existing helper rồi chọn visible role/location; chưa xác lập organisation context liên tục với trước disconnect. Exact owned row đã reconcile trước cleanup, không chứng minh context hoặc role khác — ledger #13–14.
- Starting data: grid có dữ liệu dùng chung; không sửa row có sẵn. Rendered fragments không phải dataset total.
- `[Observed; ledger #8,#14]` Owned Actions có `Edit`, `View Audit`, `Archive`. Chưa thấy explicit status field; cleanup chỉ chứng minh row biến mất khỏi searched grid sau UI Archive/reload, không phải `Archived` status-cell hoặc retention proof.

## Entry

1. Mở visible `Configuration` → `Organisation` → `Locations`.
2. Route đã quan sát: `/paco/configuration/organisation/locations`.
3. Landmark: heading `Locations`, search `Search Locations...`, grid headers `Assigned Staff`, `Name`, `Address`, `Contact Number`, `Email Address`, `Created Date`, `Created By`, `Updated Date`, `Actions`.

Nguồn: `product-explore/auto-20261021-1844/ledger.md#3`.

## Read-only flow

1. Chờ loading progress biến mất; search tên owned record.
2. Kiểm exact Name trong rendered grid, không lấy rendered row count làm tổng dữ liệu.
3. Mở Actions đúng owned row; `Edit` phải chờ Name hydrate trước khi fill.
4. Reopen nested `Enter Address` để đọc từng field. Parent summary không thay field-level readback.

Nguồn: ledger #7–11. Không dùng script tồn tại làm bằng chứng execution; kết quả tool đã ghi trong ledger và `ui-observations.json`.

## Decision points

- `[Observed; ledger #4,#6]` `Save` với Email trống giữ parent mở, native message `Please fill out this field.`. Khi contacts hợp lệ nhưng Address trống, custom message `Address is required`.
- `[Observed; ledger #7]` Nested `Confirm` disabled khi trống, enabled sau riêng `Address Line 1`; chưa submit address chỉ có Line1, không suy City/County/Postcode optional.
- `[Observed; ledger #8–10]` Grid có County, parent Address summary không hiện County; nested reopen xác nhận County còn persisted. Chưa có data-loss evidence hoặc display intent.
- `[Observed; ledger #9–10]` Nested `Cancel`/`Close` giữ City draft khi reopen trong cùng parent. Parent `Close`, reload và fresh reopen trả persisted City gốc. Parent `Save` sau nested Cancel chưa chạy; intent/root cause vẫn `Open Question` (`OQ-058`).

## End and exceptional states

- `[Observed; ledger #7,#11]` Create/update đóng dialog; search/reload/reopen xác nhận owned Name và Address fields.
- `[Observed; ledger #8]` Parent `Edit` có hydration delay; owned-name guard dừng trước fill khi chưa đúng Name. Không chứng minh wrong-record mutation hoặc product defect.
- `[Observed; ledger #11,#13–19]` Connection notice đầu sau update readback recover cho auth/reconciliation/cleanup. Notice thứ hai sau Add Close recover qua dashboard/role và cleaned/cancelled row readback0/dialogs0 tại20:00:15.316Z. Latest `CONNECTION_CLOSED` / `Connection closed` sau Sharing Agreements Column Menu chưa có current UI/auth recheck; notice timestamp không có, không suy backend lỗi.
- `[Observed; ledger #14–15]` Archive Cancel giữ row sau reload; Confirm một lần làm owned row0 sau reload. Add Name-only draft Close/no Save có row0 sau reload. Server error, audit completion và downstream effect chưa có end state.

## Safety boundary

- Direct `autonomous` exception cho phép owned `QA-test` Create/Update/Archive trên configured dev host; không cần hỏi lại từng action đúng scope. Connection hiện chặn execution, không phải thiếu approval cho owned Archive.
- Mỗi mutation phải qua runtime host/environment/owned-target guard và pre-action ledger. Không đoán effect của action chưa map.
- Không sửa/xóa/gửi trên pre-existing/shared Location, staff, organisation hoặc real patient. Staff/sharing assignment chưa chạy vì chưa có owned dependency và write footprint an toàn.
- Email chỉ recipient được duyệt trong `CLAUDE.md`; SMS cần tester xác nhận. Không send/invite/call trong run này.
- Không private API, app source, credentials, cookies, tokens hoặc auth-state readback. Ticket/discovery checkpoints không cập nhật.

## Required test data

- Name theo `QA-test-<run-id>-<n>`; update giữ prefix và ownership của run.
- Address synthetic; Line1/City/County/Postcode dùng giá trị test trong ledger; Line2 ban đầu trống rồi được cập nhật. Không dùng địa chỉ bệnh nhân thật hoặc lookup.
- Contact Number synthetic trong reserved test range, nhập qua keyboard UI rồi exact readback; không SMS/call.
- Email đúng recipient được duyệt; values cụ thể và exact current owned Name chỉ nằm trong local ledger/checkpoint.
- Assigned Staff và Shared Organisation để trống. Persisted assignment cần safe owned prerequisite riêng; không chọn existing record để lấp field.

## Interactive flow (owned test data)

1. `Add Location` mở parent `Location`: Name, Address control, Contact Number/country selector, Email, Assigned Staff picker, Shared Organisation listbox, `Save`, `Close` — ledger #3.
2. Owned Name + Email trống, `Save` một lần: parent giữ mở và native Email-required message — ledger #4.
3. Kiểm client constraints của Name/Email/phone, khôi phục valid owned Name/approved Email; keyboard nhập phone và exact readback. Không Save invalid recipient/unnamed data — ledger #5.
4. Mở `Enter Address`, quan sát fields và Cancel rỗng. Parent Save với Address trống bị custom validation — ledger #5–6.
5. Fill synthetic Line1, City, County, Postcode; Line2 trống. Quan sát Confirm gating, `Confirm` rồi scoped parent `Save`. Search và fresh reload thấy exact owned row1 — ledger #7, `address-create.js` result.
6. Mở owned `Edit`, chờ Name hydrate. Nested reopen xác nhận saved Address fields. Đổi City draft rồi nested Cancel/reopen; đổi parent Name draft rồi Close/reload, original1/cancelled0 — ledger #8–9.
7. Fresh parent reopen xác nhận persisted City/County; thử nested Cancel và Close với City draft khác nhau. Cùng parent giữ draft; parent Close/reload/reopen trả City gốc. Không parent Save trong diagnostic — ledger #10, `address-cancel-check.js` result.
8. Explicit Address Confirm với City/Line2 mới, đổi owned Name, scoped parent Save một lần. Reload/search/reopen: renamed1/original0, các Address fields đúng, phone/email unchanged, dialogs0 — ledger #11, `edit-save.js` result.
9. Connection failure sau update readback. Reconnect/auth `2026-10-21T19:24:22Z`, read-only reconcile exact owned edited Name với Assigned Staff/Shared Organisation trống — ledger #13.
10. Archive cleanup: Cancel prompt/reload giữ owned row; Edit read-only xác nhận assignment/share trống, Close. Reopen Actions → Archive prompt đúng warning, confirm1lần. Owned row0 ngay sau và fresh reload — ledger #14, `archive-cleanup.js` result.
11. Add dialog Close discard: header menu `Add Location` (unique visible text sau menuitem locator timeout), owned draft Name, không contacts/assignment/share, không Save. Close/reload/search: cancelledExactRows0/archivedExactRows0 — ledger #15, result 19:29:44.628Z.
12. Connection renewed sau Add Close readback; checkpoint paused — ledger #16. Sau resume, existing helper auth/visible role/location verified; read-only exact cleaned/cancelled Names0/dialogs0 tại20:00:15.316Z — ledger #17. Không replay mutation. Latest notice sau Sharing Agreements menu chặn current UI recheck — ledger #18–19.

## Validation behavior

| Field / rule | Check đã chạy | Kết quả | Giới hạn |
|---|---|---|---|
| Name | Native required, empty/whitespace validity | Empty invalid; whitespace valid; Save vẫn enabled khi empty | Không submit empty/whitespace Name; server trim/required chưa biết |
| Email required | Save với Email trống trên owned draft | `Please fill out this field.`, parent giữ mở | Native rejection, không proof server rule |
| Email format | Text invalid, blur/native validity | Input type text, native valid, aria-invalid chưa set | Không Save invalid recipient; business acceptance chưa biết |
| Contact Number | Native required/type tel; text/fill/keyboard readback | Non-digits bị format bỏ; fill không giữ digits, keyboard giữ số synthetic | Không malformed-phone Save hoặc SMS/call |
| Address required | Parent Save khi Address trống | `Address is required`, parent giữ mở | Custom validation; native Address inputs không required |
| Address Confirm | Empty rồi lần lượt fill synthetic fields | Disabled empty, enabled sau Line1; vẫn enabled sau fields khác | Chỉ client gating; address tối thiểu chưa Save |
| Duplicate/length/server invalid | Chưa chạy | `Not Run` | `OQ-059`; không biến native attributes thành server rule |

Nguồn: ledger #4–7, `ui-observations.json#validation`.

## State and persistence

- Create: fresh reload/search exact owned Name1; nested reopen sau đó xác nhận full Address — ledger #7,#9.
- Parent Close: cancelled Name0/original1 sau reload; fresh nested readback trả persisted City gốc — ledger #9–10.
- Update: rename/City/Line2 persisted sau reload/reopen; Line1/County/Postcode và contacts giữ nguyên — ledger #11.
- Archive: owned row0 ngay sau confirm và fresh reload; retention/Restore chưa verified, không hard deletion proof — ledger #14.
- Add Close: draft discard, không persisted row sau reload — ledger #15.
- Latest Locations read-only recheck `2026-10-21T20:00:15.316Z`: archived-target và cancelled-draft exact rows đều0, dialogs0/roleVerifiedtrue — ledger #17. UI Archive đã thực hiện; không observed `Archived` status cell. Latest connector notice xảy ra sau Sharing Agreements menu, chưa recheck state sau notice đó.

## Cross-feature relationships

- `Not Run`: chưa có receiver probe hoặc observed edge. Assigned Staff/Shared Organisation controls là source-side landmarks, không chứng minh downstream behavior.
- Location được dùng trong context/pickers khác vẫn là `Unverified hypothesis`; không suy từ tên giống nhau. Cleanup đã xong, source không còn trong searched grid; không restore/create lại chỉ để lấy receiver coverage.
- `View Audit` là action chưa mở; không tự coi là cross-feature handoff.

## Anomalies and unverified behavior

- Nested Address buffer retention và County summary khác grid giữ classification `Observed / Open Question`, không `Possible defect` hoặc product Fail. Fresh-parent diagnostic đã chạy; selective console/network diagnosis chưa chạy, intent/root cause chưa xác lập.
- Audit, retention/Restore, assignment/sharing, duplicate/server-invalid/boundary rules, server error states và receiver còn thiếu. Add Close và Archive Cancel/Confirm đã có end state; không còn cleanup pending theo latest readback.
- Delete/Clone/upload/import/download/send/restore không thấy trong bounded action map đã đọc; không khẳng định toàn feature không hỗ trợ.

## Mutation coverage

Inventory giới hạn theo các workflow/nhánh UI và validation/relationship scope đã lập; không mỗi click là một nhánh, không claim mọi nhánh sản phẩm đã được tìm thấy.

| Workflow branch | Status | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Minimal valid create với synthetic Address | Performed | — | Native/custom requirements đã xử lý | Add → Confirm Address → Save → owned grid row | Fresh reload/search; nested reopen fields | Done |
| Required-field rejection và client constraints | Performed | — | Empty Email/Address rejected; Name/Email/phone/gating client checks | Save giữ parent mở với exact message; valid data khôi phục | Client/validation end state; không server-invalid persistence claim | N/A |
| Parent Edit Close discard | Performed | — | Owned Name guard | Name draft → Close → original Name | Reload/search original1/cancelled0; fresh City gốc | N/A |
| Nested Address Cancel/Close buffer diagnostic | Performed | — | Không parent Save trong diagnostic | Same-parent draft retained; parent Close discard | Fresh reload/reopen trả persisted City gốc | N/A |
| Explicit Confirm + Save update Name/City/Line2 | Performed | — | Contacts và assignment/sharing guard | Edit → Confirm → Save → renamed row | Reload/reopen field readback; contacts match | Done |
| Add dialog Close discard | Performed | — | Draft Name; không contacts/assignment/share | Close → reload/search | cancelledExactRows0/archivedExactRows0/dialogs0 | N/A |
| View Audit end state | Skipped | Source UI Archived, không create/restore lại | Chưa thử | Action visible | Not Run | N/A |
| Archive Cancel/Confirm và cleanup | Performed | — | Edit read-only xác nhận assignment/share trống | Cancel/reload giữ row; confirm1 → owned row0 | Immediately và fresh reload/search | Done |
| Assigned Staff persisted assignment | Skipped | Chưa có owned safe staff dependency; shared target bị chặn | Chưa thử | Picker visible | Not Run | N/A |
| Shared Organisation persisted selection | Skipped | Shared organisation/write footprint chưa an toàn | Chưa thử | Listbox visible | Not Run | N/A |
| Duplicate/server-invalid/boundary validation | Skipped | Không submit unnamed/unapproved recipient | Native checks không thay server rules | Chưa có server end state | Not Run | N/A |
| Cross-feature receiver effect | Skipped | Source Archived; không restore lại, receiver chưa xác lập | Chưa thử | Chưa observed handoff/edge | Not Run | N/A |

- Branches exercised / found: **7/12** trong inventory giới hạn; **5 Skipped**. Cleanup **Done**, không Complete.
- Parent Save sau nested Cancel/Close, retention/Restore và các nhánh Skipped vẫn chưa verified.

### Coverage dimensions

| Dimension | Status | Scope / limitation |
|---|---|---|
| navigation | done | Visible menu/root/owned form verified |
| main_workflow | done | Owned create/update/cleanup đã có end state, không toàn bộ branches |
| branches_states | partial | Cancel/validation/Add Close/Archive observed; audit/assignment/other branches còn thiếu |
| mutation | partial | Create/update/UI Archive verified; assignment/sharing chưa chạy |
| validation | partial | Client/native/custom checks; server invalid/duplicate/boundary chưa verified |
| persistence | partial | Create/update/discard/Archive readback verified; retention/downstream chưa thử |
| relationships | none | Không receiver probe hoặc edge hai phía |
| errors_edge | partial | Validation và fresh-parent diagnostic; chưa selective diagnosis hoặc server error coverage |

## Execution guidance

1. Reconnect Claude Playwright plugin; verify configured dev host, auth bằng existing helper, role và Locations landmark. Không đọc credentials/auth state.
2. Read-only search exact cleaned Name và cancelled draft từ autonomous checkpoint/ledger nếu cần sau latest notice; latest Locations recheck20:00:15.316Z thấy cả hai0/dialogs0/roleVerifiedtrue. Không replay Create/Save/Archive hoặc restore source.
3. Cleanup run này đã `Done: UI Archive`; không restore/create lại để lấy audit/receiver coverage. Với future owned run, map đúng prompt, kiểm assignment/sharing footprint, ghi ledger/guard trước Cancel/Confirm; fresh reload/search là proof, không suy từ feature khác.
4. Nếu row bất ngờ hiện hoặc outcome không rõ, giữ read-only và ghi mismatch/indeterminate; không blind retry. Không chỉnh existing/shared record để tiếp tục.
5. Evidence ưu tiên text: exact owned-row counts, messages, status nếu visible, dialog counts và reload/reopen field readback; redact identity/PII. Không cần screenshot hàng loạt.

## Automation guidance

- Dùng observed UI labels `Locations`, `Search Locations...`, `Location`, `Enter Address`, `Save`, `Close`, `Confirm`, `Cancel`; không bake DOM layout/row index hoặc record ID vào reusable guidance.
- Chờ grid loading xong, exact owned row duy nhất và Name hydrate trong editor trước fill. Sau Save, chờ dialog đóng hoặc exact validation state; timeout không tự thành product Fail.
- Sau action chưa rõ outcome, read-only reconcile trước retry. Save completion/HTTP2xx không thay reload/reopen.
- Assertions thiếu trusted basis: Cancel intent, County display format, server rules, Archive/receiver semantics. Không tạo expected result chỉ từ observation.

## Provenance and gaps

- Run: `auto-20261021-1844`, start `2026-10-21T18:44:02.999Z`; latest Locations recheck `2026-10-21T20:00:15.316Z` (exact cleaned/cancelled Names0/dialogs0/roleVerifiedtrue).
- Evidence: `product-explore/auto-20261021-1844/ledger.md#3–19`, local `ui-observations.json`; executed script results ghi ledger #7,#9–11,#14–15; latest read-only reconciliation #17.
- Questions: `OQ-058` (nested buffer/parent Save intent), `OQ-059` (trusted validation rules).
- Notice đầu sau update readback18:57:58.001Z recovered qua auth/cleanup; notice thứ hai sau Add Close19:29:44.628Z recovered qua read-only reconciliation20:00:15.316Z. Latest notice sau Sharing Agreements menu snapshot chưa recheck. Cả ba notice không có timestamp riêng; không gán timestamp của UI action cho notice.
- Chỉ autonomous checkpoint cập nhật; ticket/discovery checkpoints không đổi. Reusable knowledge không thay live reconciliation.

## Tester notes
