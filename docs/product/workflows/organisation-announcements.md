# Workflow: Organisation Announcements

- Classification: `Observed: dev, Blinx Deployment, 2026-10-21`; read-only cleanup reconciliation `2026-10-22`, không requirement hoặc product verdict.
- Aliases: `Announcements`, `Welcome Message`, `Service Updates`, `Apply to locations`.
- Coverage: `Partial (interactive)` — 4/8 nhánh giới hạn có end state, 4 `Skipped`; chỉ own unsaved drafts. Không `Complete` hoặc `deep`.
- Confidence: `Low`; saved lifecycle, validation, write footprint và delivery chưa xác lập.

## Business context observed

- `[Observed; ledger #5–6]` Root có hai accordion `Welcome Message`, `Service Updates` và một page-level `Save`. `Welcome Message` mặc định expanded, hai existing rich-text blocks; `Service Updates` có một block trong context đã thử. Không copy existing content hoặc location names.
- Actor: `Blinx Deployment`, environment `dev`, auth/role verified trong pre-flight của run2259.
- `[Unverified hypothesis]` Feature có thể quản lý nội dung thông báo và áp dụng theo location. Tên/controls không chứng minh publishing, recipients, triggers hoặc consumer.
- `[Open Question; OQ-061]` Một `Save` dùng chung có thể ảnh hưởng nhiều blocks; chưa xác lập owned persisted target, write footprint hoặc safe cleanup. Không bấm `Save`.

## Entry

1. Từ `Configuration`, `Organisation`, chọn visible `Announcements`.
2. Route observed: `/paco/configuration/organisation/announcements`.
3. Chờ heading `Announcements`, accordion labels và page-level `Save`.

Nguồn: `product-explore/auto-20261021-2259/ledger.md#5–6`; entry measured `2026-10-21T23:05:18.768Z`.

## Read-only flow

1. Root mở `Welcome Message`; quan sát hai existing rich-text blocks, toolbar, `Add another`, `Delete`, location picker. Không sửa existing block — ledger #6.
2. Mở `Service Updates`; `Welcome Message` collapsed, `Service Updates` expanded, một visible rich-text editor và label `Apply to locations` — measurements `23:05:57.829Z`, `23:06:17.088Z`.
3. Mở location picker, chỉ đọc bounded count: 285 rendered options; không dataset-total proof, không copy labels hoặc select option/checkbox. `Escape` immediate chưa đóng; click heading rồi wait, picker closed tại `23:07:10.257Z` — ledger #6.

## Decision points

- Hai accordions có content riêng; controls giống nhau không chứng minh cùng persistence/delivery semantics.
- `Add another` trong `Service Updates` đã tạo empty editor riêng. Chỉ fill khi editor count tăng từ baseline1 lên2 và new editor empty; nếu khác, dừng trước input.
- Chỉ `Delete` khi ancestor chứa unique owned text, một editor và một `Delete`; không xóa theo index hoặc existing content.
- Global `Save`, existing location associations và delivery không thuộc owned draft scope; dừng trước shared write/recipient effect.

## End and exceptional states

- Own Add/Delete trở lại baseline một editor; fresh reload/reopen không còn exact owned text — `23:08:43.325Z`, ledger #8.
- Own Add/reload không `Save`/`Delete` cũng trở lại baseline một editor, exact owned text0/dialogs0 — `23:09:25.321Z`, ledger #9.
- Không empty/loading/error/validation-submit hoặc saved lifecycle end state. Không `Possible defect`, product verdict hoặc HTTP-based persistence claim.

## Safety boundary

- Chỉ own new synthetic unsaved `Service Updates` draft; existing blocks untouched, không chọn location hoặc bấm page-level `Save`.
- Không send/publish/broadcast, link/image/upload, patient mutation hoặc private API.
- Runtime exact configured HTTPS dev host/environment/role guard và pre-action ledger bắt buộc. Shared/unknown ownership hoặc recipients ngoài approved scope cần tester/domain basis.
- `[Observed; ledger #10]` Hai own drafts đã discard; không pending owned draft/Save/dialog tại last readback. UI absence không chứng minh không từng có backend object hoặc hard deletion.

## Required test data

- Rich-text synthetic `QA-test-<run-id>-<n>` trong new empty editor; không real PII/contacts.
- Existing blocks chỉ read-only. Saved announcement prerequisites/cleanup/recipients chưa rõ; không dùng shared content để lấp dependency.

## Interactive flow (owned test data)

1. **Add/Delete/reload** — ledger #7–8:
   - Pre-action ghi own draft/cleanup và exact host/role guard.
   - `Add another` trong `Service Updates`: baseline1→2 editors, new editor empty; fill unique synthetic text, exact readback matched tại `23:07:57.733Z`.
   - Scope `Delete` theo unique owned text/one-editor/one-button ancestor; không bấm shared `Save`.
   - Sau `Delete`: editors1; fresh reload/reopen: editors1/owned text0/dialogs0 tại `23:08:43.325Z`. Cleanup `Done` cho own unsaved draft, không server-delete proof.
2. **Add/reload-discard** — ledger #9:
   - New empty own editor từ baseline1→2, fill unique synthetic text.
   - Fresh reload không `Save` hoặc `Delete`, reopen `Service Updates`: editors1/owned text0/dialogs0 tại `23:09:25.321Z`.
   - Reload-discard observed; không saved-announcement persistence claim.

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| New rich-text draft | Synthetic text, không submit | Exact owned text readback matched | Not Run | Observed, ledger #7/#9 |
| Required/format/boundary/duplicate và Save validation | Không submit | Trusted rules/message chưa xác lập | Not Run | Open Question, OQ-061 |

## State and persistence

- Own unsaved draft hiện sau `Add another`/fill, mất sau scoped `Delete` hoặc fresh reload; baseline một Service editor sau reload/reopen — ledger #7–10.
- Persistence dimension chỉ `partial` cho draft-discard/cleanup UI proof. Saved announcement create/update/delete, server storage và publishing: `Not Run`.
- Existing content equality toàn bộ, hard deletion hoặc full DB absence không verified.

## Cross-feature relationships

- `Not Run`: không source Save/mutation hoặc receiver probe; không observed edge.
- Populated `Apply to locations` picker chỉ là observed UI, không dependency, assignment persistence hoặc delivery proof. Location selection không đổi.

## Anomalies and unverified behavior

- Chưa có `Possible defect`; immediate Escape không đóng picker không đủ expected basis để kết luận lỗi.
- OQ-061: shared `Save` write footprint, scoped owned persisted target, validation rules, location effect, recipients/triggers, lifecycle và cleanup chưa rõ.
- Rich-text toolbar formatting/link/table/image controls visible nhưng end states chưa exercise; không claim support/persistence đầy đủ.

## Mutation coverage

Inventory giới hạn theo workflow branch/end state; không toàn bộ feature hoặc mỗi toolbar click.

| Workflow branch | Status | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Root và accordion navigation | Performed | — | Không submit | Welcome expanded, chuyển Service expanded | Display only | N/A |
| Read-only Apply to locations picker | Performed | — | Không select/submit | Open/read count/close | Not Run | Picker closed |
| Own Service Add/Delete/reload | Performed | — | New empty editor/exact synthetic readback; không domain validation | Baseline1→own draft2→Delete1 | Fresh reload/reopen baseline1/own text0 | Done: own draft discarded |
| Own Service Add/reload-discard | Performed | — | New empty editor/exact synthetic readback; không submit | Baseline1→own draft2→reload1 | Fresh reload/reopen own text0 | Done: own draft discarded |
| Welcome own draft/formatting | Skipped | Bounded experiment chỉ Service Updates; chưa exercise riêng Welcome/toolbar | Not Run | Controls visible, chưa end state | Not Run | N/A |
| Shared Save validation/persistence | Skipped | OQ-061 write footprint/recipients chưa rõ | Not Run | Save visible, không click | Not Run | N/A |
| Persisted own update/delete | Skipped | Chưa có safe saved owned target/cleanup | Not Run | Chưa xác lập | Not Run | N/A |
| Receiver/delivery | Skipped | OQ-061 recipients/triggers chưa rõ; no source Save | Not Run | Chưa probe | Not Run | N/A |

- Branches exercised/found: **4/8**, **4 Skipped**, `Partial (interactive)` — ledger #5–10.
- Còn thiếu: Welcome/formatting, trusted validation, saved lifecycle/cleanup, location effect và delivery/receiver. Không bấm shared `Save` để ép coverage.

### Coverage dimensions

| Dimension | Status | Scope / limitation |
|---|---|---|
| navigation | done | Visible entry/root/accordions |
| main_workflow | partial | Own unsaved drafts only; saved lifecycle chưa biết |
| branches_states | partial | 4/8 bounded branches có end state |
| mutation | partial | Own unsaved draft Add/fill/Delete; no saved records |
| validation | none | Không submit hoặc trusted business validation |
| persistence | partial | Draft reload-discard/cleanup only |
| relationships | none | Không source/receiver evidence |
| errors_edge | none | Không feature error/edge coverage |

## Execution guidance

1. Exact configured dev HTTPS host, auth và actual role `Blinx Deployment`; role khác chưa verified.
2. Read-only root/accordions/picker; không copy existing content/location values.
3. Own draft flow cần empty new editor, unique synthetic text, scoped `Delete`, guard và pre-action ledger; fresh reload/reopen cleanup.
4. Dừng trước shared `Save`, existing block edit/delete, unknown location/recipient/publish effect; hỏi khi muốn vượt boundary, tiếp feature an toàn khác.

## Automation guidance

- Landmarks: heading `Announcements`, accordions `Welcome Message`/`Service Updates`, `Add another`, `Delete`, `Apply to locations`, `Save`.
- Wait actual region visible, baseline/new editor count và empty value; own Delete scope bằng unique text/one-editor/one-button, không index existing block.
- Không hardcode observed rendered option count hoặc existing block count thành product requirement. Không assert saved lifecycle/delivery/validation từ draft observation.

## Provenance and gaps

- Source: `product-explore/auto-20261021-2259/ledger.md#5–10`, local `ui-observations.json#announcements`; `Observed`, không `Confirmed`.
- Observed UTC: entry `2026-10-21T23:05:18.768Z`; draft cleanup `2026-10-21T23:09:25.321Z`; latest read-only cleanup reconciliation `2026-10-22T01:07:48.305Z`.
- `[Observed; ledger #12; resume-preflight-20261022-0103/ledger.md#4]` Sau auth/role recovery, Service Updates baseline1 editor/exact two own text matches0/0/dialogs0/roletrue; `Save` visible nhưng không click. Không replay Add/Delete hoặc persisted lifecycle; organisation continuity qua re-auth chưa independently established. Hai own drafts discarded theo prior cleanup, known new leftovers0; không hard-delete/toàn DB absence proof.
- `[Observed; ledger #11–13]` Connector pause sau `23:09:25.321Z` được recover cho final sweep. Run2259 đóng `done` tại `2026-10-22T01:12:45.669Z` do elapsed133/120, không thêm feature/state hoặc Complete/deep/product verdict. Sau sweep, latest Playwright plugin/user `CONNECTION_CLOSED` notice lại chặn current UI/auth recheck; notice timestamp null, không browser action sau latest notice. Final measured cleanup sweep `Pass` chỉ read-only scope; current recheck `Blocked`, không current-state guarantee.
- Resume theo `docs/product/explore/autonomous-state.yaml`; fresh run chỉ sau reconnect/auth/role/read-only reconciliation, không reopen closed2259. Autonomous checkpoint riêng, ticket/discovery không đổi. OQ-061 còn Open; không retry shared `Save` khi basis chưa đổi.

## Tester notes
