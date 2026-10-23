# Workflow: Health Forms

- Classification: `[Observed: dev, Super Admin GB, 2026-10-23; Blinx Deployment, 2026-10-21]`
- Aliases: `Health Forms`, `Inbox`, `Designer`, `Designer V2`, `Health Form Templates`
- Coverage: `Partial` — các pass riêng: historical 8/18, Super Admin GB saved lifecycle 8/14 và unsaved Preview 5/7; không cộng mẫu số
- Confidence: `Medium`

Các mục từ `Business context observed` đến `Provenance and gaps` giữ context read-only ngày 2026-10-01. Approval stop/locator timing của run cũ không thay thế authorization hoặc observation của autonomous run bên dưới.

## Business context observed

- Visible purpose: gửi, theo dõi và review health form của bệnh nhân; thiết kế form.
- Actor/role: `Super Admin GB`, site `General Practice (Demo Site)`.
- Required context: phiên PACO đã đăng nhập.
- Starting data state: Inbox counters đều 0; Designer có danh sách form.
- Entities and statuses: health form (type, reviewer, archived, editable), response (sent, incomplete, overdue, completed, awaiting review).

## Entry

1. Sidebar `Health Forms` mở submenu `Inbox`, `Designer`, `Designer V2`.
2. `Inbox` → `/health-forms/responses/`; `Designer` → `/health-forms/builder/` (Health Forms app riêng); `Designer V2` → `/paco/health-forms` (`Health Form Templates`, trong PACO).

## Read-only flow

1. **Action:** mở `Inbox`.
   - **Observed result:** `Health Form Inbox`, auto refresh `Refreshing in N seconds`, counters `Total Sent to Patient`/`Incomplete`/`Overdue from Patient`/`Completed by Patient` = 0, `View By Patient`/`View By Health Form`.
2. **Action:** `Filters` trong Inbox.
   - **Transition:** panel `Inbox Filters` (`Date Range` `All time`, `Health Form`, `Reviewers`).
3. **Action:** mở `Designer`.
   - **Observed result:** danh sách form với cột type, reviewer, name, created/updated, shared organisations, archived, editable, actions.

## Decision points

- **Visible condition:** `Designer` vs `Designer V2`.
  - **Branch A:** app Health Forms riêng (`/health-forms/builder/`).
  - **Branch B:** trang trong PACO (`/paco/health-forms`). Quan hệ giữa hai designer: `Open Question`.

## End and exceptional states

- Empty: Inbox không có response.
- Loading: app cần 8–12s để render; title rỗng trong lúc tải.
- Cross-feature handoff: PACO → Health Forms app.

## Safety boundary

- Last safe read-only state: Designer list, Inbox filters panel.
- Approval stop: `New Health Form` (draft, persistence chưa rõ), mọi action gửi form cho bệnh nhân.
- Mutation: `None`

## Execution guidance

- Setup/data: cần form synthetic đã gửi để xem luồng review.
- Safe manual steps: Entry 1–2, Read-only flow 1–3.
- Stop and request approval before: `New Health Form`, gửi form.
- Evidence to capture: counters Inbox, danh sách cột Designer.

## Automation guidance

- Stable roles/labels/landmarks: button `Filters`, `Columns`, `View By Health Form`; text `Health Form Inbox`.
- Observable waits: chờ text `Health Form Inbox` hoặc counters; tránh fixed sleep.
- Data dependencies: response synthetic.
- Assertions lacking trusted expected basis: giá trị counters, khác biệt Designer/Designer V2. `Filters`/`Columns` trong Designer không click được trong 8s ở run này.

## Provenance and gaps

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-01 (run-20261001-085609)
- Raw evidence: `test-results/product-survey/run-20261001-085609/outcomes/`
- Open questions: Designer vs Designer V2; menu row actions trong Designer chưa quan sát.
- Exact resume state: checkpoint run trên, task variant `Switch Inbox View By Health Form` còn queued.

## Autonomous exploration (2026-10-21)

- Classification: `[Observed: dev, Blinx Deployment, 2026-10-21T17:27:45Z]`.
- Nguồn: `product-explore/auto-20261021-1626/ledger.md#2–10` và local `ui-observations.json`. Các bước dưới là observation, không requirement hoặc product verdict.
- Coverage: `Partial (interactive)`, 8/18 nhánh có end state; 20 tracked meaningful states là lower bound. `Designer V2` chỉ là bounded related-view probe.
- Dimensions: `navigation: done`, `main_workflow: done`, `branches_states: partial`, `mutation: partial`, `validation: partial`, `persistence: done`, `relationships: partial`, `errors_edge: partial`. Persistence chỉ bao gồm template/configuration và transition đã chạy, không Clone/response/filing/V2.

### Context, data và actions

- `[Observed]` Entry từ sidebar `Health Forms` / `Designer`, list `/health-forms/builder/`; editor mới `/health-forms/builder/create-new/`, editor source `/health-forms/builder/editor/`. Role `Blinx Deployment` được kiểm trên UI. Nguồn: ledger #2, #5–6.
- `[Observed]` Dữ liệu: một template synthetic owned có tiền tố `QA-test`, một `Text Input` với label/answer trung tính; không patient/clinical identifier. Không chọn organisation chia sẻ, reviewer, tag, slot hoặc clinical code. Nguồn: ledger #3–5.
- `[Observed]` Action map: `New Health Form`/`Clone Health Form` là CREATE; `Save Form`/`Update Form`/component `Save`/`Archive/Unarchive` là UPDATE hoặc lưu draft theo context. Search/filter, mở `Edit Health Form`, `Preview` và breadcrumb dùng để đọc hoặc bỏ draft. Response `Save`/`Submit` không chạy; UI của `Submit` nói gửi tới GP. Không thử upload/send/filing. Nguồn: ledger #3–9.
- `[Observed]` Palette có 29 labels ở create và 28 ở edit; chỉ `Text Input` được exercise. Khác context không tự thành parity requirement. Nguồn: ledger #3, #6.

### Interactive flow và persistence

1. `[Observed]` Nhập `Health Form Title` owned: Title-only vẫn có `Save Form`/`Preview` disabled. Thêm `Text Input`, đặt `Display Label`, bật `Required`, tắt `Record Question/Answer in Patient Record` và `Add Total Health Form Score to Patient Record`, lưu component. Nguồn: ledger #3–4.
2. `[Observed]` `Preview` rỗng hiện required marker; nhập answer synthetic thì marker biến mất. Đóng preview, không response `Save`/`Submit`. Sau reopen source, `Required` vẫn bật. Nguồn: ledger #4–5.
3. `[Observed]` Title rỗng làm `Save` disabled; whitespace vẫn enabled. Khôi phục Title hợp lệ, không submit invalid. Đây chỉ client behavior, server rule còn OQ-056. Nguồn: ledger #4.
4. `[Observed]` `Save Form` một lần mở `Save Health Form`, sharing count 0; `Continue` một lần về list. Reload thấy source `Active`, `Editable` = `Yes`, type `Scheduled One-Off`; reopen còn component/label và các checkbox đã cấu hình. Không suy rule scheduling từ type hoặc radio state. Nguồn: ledger #5.
5. `[Observed]` Rename draft rồi breadcrumb về list giữ Title gốc, không thấy exact cancelled Title. Rename lần khác, `Update Form`, sharing count 0, `Continue`; reload thấy Title mới và original exact rows 0. Nguồn: ledger #6.
6. `[Observed]` `Archive/Unarchive` trên source `Active` có `Cancel`/`Archive`. Sau Archive, source bị che bởi filter mặc định `Active` checked / `Archived` unchecked. Include `Archived` qua `Filters` đọc lại status `Archived` sau reload; rendered absence không phải proof deletion. Attempt Cancel đầu chưa có returned proof riêng, không tính nhánh riêng. Nguồn: ledger #7.
7. `[Observed]` Trên source `Archived`, prompt/button vẫn ghi `Archive`. `Cancel` rồi reload giữ `Archived`; mở lại và confirm `Archive` một lần làm source `Active` sau reload. Re-Archive rồi reload/include `Archived` giữ `Archived`. Wording/effect chưa có trusted intent hoặc root cause (OQ-053). Nguồn: ledger #8.
8. `[Observed]` Final readback: active owned 0, archived retained 1, draft 0, mutation dialogs 0. Hai blank Clone drafts đã bỏ; không Clone `Save` hoặc response `Save`/`Submit`. Cleanup `Done` ở mức UI Archive; hard deletion/retention chưa verified. Scoped prefix choices chỉ có source, không chứng minh absence toàn DB. Nguồn: ledger #9–10; `ui-observations.json#final_reconciliation`.

### Cross-feature relationships

- `[Observed / Open Question]` `Designer V2` mở `/paco/health-forms/`, heading `Health Form Templates`. Lần vào đầu chưa thấy source; fresh reload chờ 20s vẫn không có rendered data rows, console errors 2/page errors 0; same-origin capture chỉ document GET 200. Legacy control vẫn thấy source `Active` lúc probe. Relationship `Inconclusive`, không observed edge hoặc proof source absent; source hiện đã `Archived`. Nguồn: ledger #7; `ui-observations.json#designer_v2`; OQ-055.
- `[Open Question]` Inbox/send/review/filing chưa kiểm vì không có safe owned response/patient context. Không suy handoff từ tên menu. Nguồn: ledger #4, #10; mutation coverage #16–17.

### Unexpected behavior và remaining gaps

- `[Observed / Open Question]` Archived-source `Clone Health Form` mở blank create-new editor hai lần: Title/Dropzone rỗng, source label không có, total-score bật mặc định, `Save Form` disabled. Source `Edit` control vẫn có content và total-score tắt. Không Save clone; persistence `Not Run`, Active-source behavior/root cause chưa biết. Diagnostic window lần hai chỉ captured requests 200, failed requests 0, console/page errors 0; không payload inspection và HTTP200 không chứng minh clone loaded. Nguồn: ledger #9; `ui-observations.json#clone`; OQ-054.
- `[Open Question]` Archive wording (OQ-053), V2 loading/receiving effect (OQ-055), whitespace/server validation (OQ-056) chưa có kết luận product `Pass`/`Fail`. Nguồn: ledger #4, #7–9.
- `[Observed]` Guidance khi resume: reverify connection/auth/role và current state trước interaction; không replay Archive trên retained `Archived` source vì action này đã restore `Active`. Chỉ mutation owned test data trên configured dev host; không shared/real patient data, response submit hoặc SMS. Nguồn: ledger #8–11, direct-exploration safety scope.

## Mutation coverage

Scope bảng: Designer trong autonomous run `auto-20261021-1626`. `Performed` chỉ khi có end state; attempted Clone/V2 không tính completed persisted workflow. `Done` cleanup là UI Archive/discard, không hard deletion. Nguồn `[Observed]`: ledger #3–10.

| Branch | Status | Reason / scope | Validation | Transition | Persistence | Cleanup |
|---|---|---|---|---|---|---|
| Minimal owned create / Save Form / sharing0 / Continue | Performed | Minimal template, không recipient | Title-only actions disabled; một Text Input mở action | Draft, confirmation, Active list | Reload/reopen | Done: source UI Archive |
| Text Input configuration / component Save | Performed | Label trung tính, Required bật, record-question/score tắt | Config readback | Component edit, source reopen | Reopen source còn values | Done: source UI Archive |
| Preview rỗng / answer / close | Performed | Không response Save/Submit | Required marker thay đổi khi answer | Preview đóng | Response Not Run; config readback riêng | Done: preview đóng |
| Title empty / whitespace / restore | Performed | Client-only, không invalid submit | Empty Save disabled; whitespace enabled | Invalid draft, restored valid Title | Invalid persistence Not Run | Done: values khôi phục |
| Rename draft / breadcrumb discard | Performed | Không submit cancelled Title | Draft Title khác source | Editor draft, original list | Original present, cancelled name absent | Done: draft discarded |
| Rename / Update Form / sharing0 / Continue | Performed | Valid owned Title | Reload exact Title | Updated Active source | Reload mới/old exact readback | Done: source UI Archive |
| Active Archive / filter reconciliation | Performed | Cancel đầu chưa có proof riêng | Exact owned source/dialog | Active thành Archived; Active filter che row | Reload/include Archived | Done: UI Archive |
| Archived Cancel / restore / re-Archive | Performed | Button vẫn ghi Archive | Cancel giữ Archived | Archived, Active, Archived | Reload từng transition | Done: active0/retained1 |
| Persisted Clone copy | Skipped | Hai Archived-source attempts blank; không Save | Source Edit control có content; Save disabled | Blank editor, draft bỏ | Not Run | Done: hai drafts discarded |
| Designer / V2 receiving effect | Skipped | V2 chưa load data rows; relation Inconclusive | Legacy control có source; GET200 không đủ | Receiver end state chưa có | Chưa verified | N/A: read-only |
| Invalid/duplicate/length server validation | Skipped | Không invalid submit trước checkpoint | Chỉ client empty/whitespace | Server alternatives chưa chạy | Not Run | N/A |
| Save confirmation dismiss/Cancel | Skipped | Chỉ Continue create/update đã chạy | Chưa thử dismissal | End state chưa verified | Not Run | N/A |
| Scheduled/Diary frequency, booking, clinical settings | Skipped | Chưa exercise domain settings | Chưa thử | Alternatives chưa verified | Not Run | N/A |
| Sharing/default reviewers/tags/permissions | Skipped | Sharing0; không chọn shared recipient | Chưa thử | Assignment chưa verified | Not Run | N/A |
| Other components/media/upload/clinical/layout | Skipped | Chỉ Text Input exercised | Chưa thử | Component workflows khác chưa chạy | Not Run | N/A |
| Preview response Save/Submit/filing | Skipped | Không safe owned patient/response context | Neutral answer only | Không submit/send | Not Run | N/A: không saved response |
| Inbox/send/review handoff | Skipped | Không safe owned response context | Chưa thử | Handoff chưa chạy | Not Run | N/A |
| Component remove/reorder và Active-source Clone | Skipped | Chưa chạy trước context checkpoint | Chưa thử | End states chưa verified | Not Run | N/A |

Summary: **8/18 Performed, 10/18 Skipped**; coverage `Partial (interactive)`, không `Complete`/`deep`. Validation, transitions và persistence chưa chạy nằm rõ ở 10 nhánh Skipped; navigation/palette mapping không được tính như persisted workflow.

## Super Admin GB breadth — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1001/ledger.md#16`. Current-role coverage riêng, không cộng với Designer lifecycle của role trước.

- Entry: verified Paco header → `Health Forms` → `Designer` → `/health-forms/builder/`. Root có form grid và `New Health Form` là link mang role `button`.
- Owned blank editor `/health-forms/builder/create-new/`: textbox `Health Form Title`, placeholder `Enter Form Name`. Title-only giữ `Save Form` disabled; thêm một `Text Input` thì enabled. Tắt total-score recording trong draft, không chọn reviewer/sharing/clinical code.
- Empty Title làm `Save Form` disabled; khôi phục Title owned làm enabled. Đây client gate, không server validation.
- Component editor mở qua edit control. `Save` đóng editor nhưng exact label readback không thành công; không coi Required/recording configuration đã verified hoặc persisted.
- Breadcrumb `Health Form Designer` bỏ draft. Fresh list reload/search không thấy owned Title; fresh `New Health Form` có Title blank. Return list, search blank, không dialog hoặc leftover.
- Không submit `Save Form`/`Continue` vì thời gian còn lại không đủ create/readback/Archive trọn vẹn. Không response `Save`/`Submit`, không sửa historical retained template. Tiếp T5 breadth trước deep revisit.

### Mutation coverage

| Nhánh | Thực hiện | End state hoặc lý do |
|---|---|---|
| Current-role Designer root | `Performed` | Grid/actions render, header role verified |
| Owned draft / Text Input gate | `Performed` | Title-only disabled; component present làm Save enabled |
| Empty Title / valid restore | `Performed` | Disabled rồi enabled, không invalid submit |
| Draft discard / fresh reopen | `Performed` | Owned Title không ở fresh list, editor mới blank, return list |
| Component configuration readback | `Skipped` | Save đóng editor nhưng exact label chưa verified |
| Saved template create/update/Archive | `Skipped` | Original budget không đủ lifecycle và cleanup trọn vẹn |
| Preview validation | `Skipped` | Deferred theo breadth và budget |
| Inbox / Designer V2 handoff | `Skipped` | Không saved owned source/response |

4/8 bounded nhánh, `Partial (interactive — draft only)`. Draft mutations đã discard; saved business mutation, server validation, business transitions/persistence và two-sided relationships chưa chạy. UI reset verified qua reload/reopen; cleanup `Done`, không leftover. Drag/locator timeout phải reconcile component hiện tại trước retry, không replay cả batch.

## Super Admin GB saved lifecycle — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#3–13`. Current-role run riêng; không cộng các mẫu số bounded của run trước hoặc role trước.

- Luồng đã chạy: Designer list → `New Health Form` → Title owned + một `Text Input` → cấu hình → `Save Form` → `Save Health Form` với sharing `0` → `Continue` → fresh list/reopen → rename discard → rename `Update Form`/`Continue` → fresh list → `Archive/Unarchive` → owned confirmation → `Archive` → reload/include `Archived`.
- `Display Label` là rich-text editor; label trung tính, `Required?` bật, `Record Question/Answer in Patient Record` và `Add Total Health Form Score to Patient Record` tắt. Config có exact readback qua draft reopen và saved-source reopen trong fresh tab. Không patient, reviewer, organisation sharing hoặc response submit. Nguồn: ledger #5–9.
- Title-only giữ `Save Form` disabled; một `Text Input` mở action. Rename không `Update Form`, thoát qua breadcrumb rồi reload giữ Title gốc, cancelled Title không có; saved rename có Title mới và không còn Title cũ sau reload. Nguồn: ledger #5,#10–11.
- `Archive` trên exact owned `Active` source persist `Archived` qua reload và filter include `Archived`. Cleanup hoàn tất bằng UI Archive, record vẫn retained; không hard delete. Nguồn: ledger #13.
- Reusable guidance: map center/pinned action theo cùng row, không index. Nếu Actions rỗng, reconcile nguồn đã Save trước, không create/submit lại; fresh tab trong lần này render lại controls sau khi same-tab reload/hover không giúp. Root cause chưa rõ. Rich-text label dùng keyboard replacement rồi reopen kiểm exact text; wrapper component editor có thể còn sau khi nội dung đã đóng. Nguồn: ledger #6,#9.
- `Designer V2` `/paco/health-forms`: verified current-role root, query exact owned Title retained, loading indicator biến mất nhưng grid không data rows. Concurrent resource errors không đủ gán causality; source/receiver relationship `Inconclusive`, không global absence hoặc sync-defect claim. Nguồn: ledger #12; OQ-055.

### Mutation coverage

| Nhánh | Thực hiện | Validation / transition / persistence | Cleanup |
|---|---|---|---|
| Current-role root / owned search | `Performed` | Root/list và exact owned source kiểm bằng UI | `Done`: baseline reload |
| Title-only component gate | `Performed` | Title-only disabled, thêm Text Input enabled; chưa server validation | `Done`: source Archive |
| Component configuration / draft reopen | `Performed` | Exact label, Required on, recording off qua reopen | `Done`: source Archive |
| Create / Save / sharing 0 / list | `Performed` | Draft → Active; exact source sau reload | `Done`: source Archive |
| Saved component configuration reopen | `Performed` | Fresh-tab source giữ exact config | `Done`: source Archive |
| Rename discard | `Performed` | Original còn, cancelled absent sau reload | `Done`: draft discarded |
| Rename save | `Performed` | Edited còn, original/cancelled absent sau reload | `Done`: source Archive |
| Archive persistence | `Performed` | Active → Archived, reload/include Archived | `Done`: retained Archived, không hard delete |
| Designer V2 receiver | `Skipped` | Attempted read-only; receiver không data rows, relationship `Inconclusive` | `N/A` |
| Invalid/duplicate/boundary server validation | `Skipped` | Chỉ Title-only client gate; chưa invalid submit | `N/A` |
| Preview / required-answer validation | `Skipped` | Chưa mở trong run này | `N/A` |
| Unarchive / restore | `Skipped` | Không restore retained source chỉ để thêm coverage | `N/A` |
| Organisation sharing / reviewer assignment | `Skipped` | Sharing 0; không exercise shared target | `N/A` |
| Response submit / Inbox handoff | `Skipped` | Không owned patient/response context | `N/A` |

**8/14 bounded nhánh**, `Partial (interactive)`. Ba business mutations có persisted UI proof: create, rename, Archive; không two-sided relationship hoặc server validation. Components khác, Clone và domain settings ngoài bounded pass, không kết luận coverage toàn feature.

## Super Admin GB unsaved Preview — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0000/ledger.md#7–8`. Independent draft pass; các mẫu số historical giữ riêng.

- New blank editor → owned Title → total-score recording off → một `Text Input`. Locator drag không tạo component; reconcile blank dropzone trước continuation native pointer movement, sau đó placeholder mất và `Preview Form` enabled. Không synthetic event dispatch hoặc force.
- Toolbar hiện dùng SVG `pen-to-square`, `trash`, `grip-vertical`; hover badge rồi mở exact Edit. Neutral label, `Required?` on, `Record Question/Answer in Patient Record` off và total-score off giữ qua component `Save`/reopen trong unsaved draft.
- Expandable sidebar từng chặn label click; native keyboard focus/Space đổi đúng owned checkbox, readback trước Save. Đây alternate UI path, không root-cause kết luận.
- `Preview Form` mở `Health Form Preview` dialog có blank textbox và `Required*`. DOM marker text là `Required`, dấu `*` thuộc CSS pseudo-content; modal loại background title khỏi accessible role tree nên read-only ownership guard dùng exact DOM input.
- Synthetic answer retained nhưng Required marker vẫn visible sau fill và Tab/blur; clear và Close/reopen trả blank answer/marker visible. Khác historical Blinx Deployment observation marker biến mất; giữ cả hai theo context, intended contract chưa established. Không response `Save`/`Submit`, template `Save Form` hoặc clinical submission.
- Discard qua `Health Form Designer` breadcrumb; fresh blank editor và list Search blank, không dialog/test tab. Scoped list query retained nhưng không recognized result/empty end state; matching completion `Inconclusive`, không lấy rendered row absence làm cleanup proof. Cleanup dựa unsaved draft discard/fresh editor, không database absence.

### Mutation coverage

| Nhánh | Thực hiện | End state / persistence | Cleanup |
|---|---|---|---|
| Owned draft / native Text Input placement | `Performed` | Title/recording setting và component làm Preview enabled; draft only | `Done`: discard |
| Required/recording config Save/reopen | `Performed` | Exact label và toggles retained trong draft | `Done`: discard |
| Preview empty / answer / blur | `Performed` | Answer retained; Required marker vẫn visible, intended semantics chưa biết | `Done`: Close |
| Preview clear / Close-reopen | `Performed` | Blank answer và marker visible; final dialog đóng | `Done` |
| Draft discard / fresh editor | `Performed` | New editor blank; list query cleared và role verified | `Done` |
| List matching completion | `Skipped` | `Inconclusive`: query retained, không recognized completion | `Done`: clear |
| Response Save/Submit / filing | `Skipped` | Không owned patient/response context; không submit để thử validation | `N/A` |

**5/7 bounded nhánh**, `Partial (interactive — draft only)`; không persisted business mutation/new record. Validation chỉ presentation/configuration, không server-required enforcement. Persistence chỉ draft reopen và reset; source/receiver relationship không được kiểm. Native pointer/keyboard continuations dùng sau read-only reconciliation, không replay whole script.

## Logic từ ticket

Nguồn: `PAC2-4399`, `PAC2-5776`, `PAC2-6982`.

### Health Form Designer — component Blood Pressure

**Luồng**
1. `Health Forms` → `Designer` → `/health-forms/builder/`; list search theo title; form có type `Scheduled One-Off`/`One-off Health Form`, status `Active`, cột editable. `[Observed]` — PAC2-4399/exploration.md
2. Grid cột `Health Form Name`, `Created By Organisation`, `Shared To Organisation(s)`, `Archived`, `Editable`, `Actions`; nhiều form hiện `-` ở creator/shared nên không đủ chứng minh ownership. `[Observed]` — PAC2-6982/exploration.md
3. Component `Blood Pressure`: label, hint, hai input `SYS`/`DIA`; `Select Emis Header`, `Record Question/Answer in Patient Record`, `Search SNOMED Code`; chọn ghi nhận (a) một entry kết hợp "O/E - blood pressure reading <sys>/<dia> mmHg" hoặc (b) `Separate Diastolic and Systolic entries`; form-level `Add Total Health Form Score to Patient Record`. `[Observed]` — PAC2-4399/exploration.md, report.md

**Business rules**
- Danh sách là AG Grid với pinned action column: mapping row center ↔ pinned bằng row-id; map theo index có thể mở nhầm form. `[Observed]` — PAC2-4399/exploration.md
- Editor không hiển thị ConceptID/DescriptionID đã chọn nên UI không đủ làm bằng chứng mapping. `[Observed]` — PAC2-4399/exploration.md
- Health Form có hai quan hệ tổ chức `Created by` và `Shared To`; form do child practice tạo, không `Shared To` chính practice đó, vẫn phải truy cập được khi nằm trong Shared Campaign của PCN gửi tới practice (campaign share hiệu lực thay cho `Shared To` của form). `[Confirmed]` — PAC2-6982/requirements.md (REQ-002)

**Role/permission**
- Rule truy cập với organisation ngoài phạm vi nhận campaign chưa rõ. `[Open Question]` — PAC2-6982/requirements.md (OQ-004)

**Defect đã biết**
- PAC2-4399 · Pass (cấu hình UI, theo yêu cầu tester) · side panel `Blood Pressure` có lựa chọn combined O/E được chọn, `Separate...` không chọn; không phải xác nhận EMIS code đã filed. `[Observed]` — PAC2-4399/report.md
- PAC2-6982 · Blocked (TC-001 P0, TC-002 positive control) · chưa xác minh form do child tạo không `Shared To` và chưa có patient/recipient an toàn; chưa có Pass/Fail. `[Observed]` — PAC2-6982/status.md

**Open questions**
- Behavior `Submit`/lưu câu trả lời; control path hợp lệ (form có `Shared To` khác). `[Open Question]` — PAC2-6982/requirements.md

### Health Form Inbox

**Luồng**
1. `Health Forms` → `Inbox` → `/health-forms/responses/`; `View By Health Form` lọc ra response hoàn thành với trạng thái `synced`; header `Synced to Primary Care Patient Record`. `[Observed]` — PAC2-4399/exploration.md
2. Summary phân biệt `Reviewed (synced)` và `Reviewed (not synced)`. `[Observed]` — PAC2-4399/exploration.md
3. `View Form` mở dialog read-only (SYS/DIA disabled); `Add/View Comments`, `More Actions`, `Send to Patient Record` (mutation). `[Observed]` — PAC2-4399/exploration.md
4. `Quick Send` làm follow-up action từ Inbox (xem `comms-hub.md#popup-scheduler-link-required`). `[Confirmed]` — PAC2-5776/requirements.md

**Business rules**
- Response đang được user khác review: dialog hiện lock notice, nút filing disable, có `Click Here to Take Over`. `[Observed]` — PAC2-4399/exploration.md

**Trạng thái**
- Response: `synced`, `Reviewed (synced)`, `Reviewed (not synced)`, locked (đang review). `[Observed]` — PAC2-4399/exploration.md

**Defect đã biết**
- PAC2-4399 · Inconclusive (possible defect) · modal `Review Answers`/`View Form` kẹt loading (loader hiện, content ẩn, không empty/error/retry); mẫu 6 response: 3 kẹt, 1 unlocked, 2 locked; không phải lỗi do lock. `[Observed]` — PAC2-4399/exploration.md
- PAC2-4399 · Inconclusive (possible defect, accessibility) · `Save to Record` và `Save & Follow up` cùng accessible label; icon `expand` không có accessible name. `[Observed]` — PAC2-4399/exploration.md
- PAC2-4399 · Blocked · `Save to Patient Record` (đã duyệt): dialog xác nhận vẫn mở, request filing lên EMIS trả HTTP 403, không đổi trạng thái `synced`. `[Observed]` — PAC2-4399/exploration.md

**Open questions**
- Nguyên nhân modal kẹt loading chưa triage; 403 là authorization hay server rejection. `[Open Question]` — PAC2-4399/exploration.md

## Tester notes
