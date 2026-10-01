# Exploration: PAC2-4399

**Input Revision:** 1
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)
**Role:** `Super Admin GB`
**Observed:** 2026-09-22
**Mutation:** Attempted filing to Patient Record; server rejected request (403), no success evidence
**Outcome:** Inconclusive

## Scope

Read-only exploration từ `Patient Search` nhằm tìm entry flow cho blood-pressure filing, sau khi tester cho phép search demo patient nhưng không cung cấp flow clue.

## Observed

1. Auth được re-verified trên authenticated dashboard; role hiển thị `Super Admin GB`.
2. `Patient Search` mở menu có `Patient Search` và `Care Navigation`.
3. `Care Navigation` mở route `/patient-search/`, title `NHS`, heading `Patient Profile Search`.
4. Search synthetic query `test` hiển thị nhiều demo/test patient results. Không ghi identifier, contact detail, NHS number hoặc patient name vào artifact.
5. Mỗi result có controls `Quick Form`, `Care Navigator`, `Quick Send`.

## Mutation Boundary / Stop

Không click `Quick Form`, `Care Navigator`, hoặc `Quick Send`. Từ label hiện có, không thể xác định chắc chắn control nào chỉ navigate và control nào tạo draft, send, hoặc mutate patient workflow. Theo read-only scope, dừng trước action unknown/potentially persistent.

Không quan sát được blood-pressure input, filing action, EMIS result, hoặc code pair trong run này.

## Context and Candidates

### Patient Profile Search — Confirmed read-only entry root

- Entry: dashboard → `Patient Search` → `Care Navigation`.
- Route: `/patient-search/`.
- Landmarks: `Patient Profile Search`, `Search Patients...`, `A-Z Search`.
- Usable for locating an approved fixture; search itself is read-only.

### Patient action controls — Blocked candidate

- Controls: `Quick Form`, `Care Navigator`, `Quick Send`.
- Relevance: possible pathways to patient clinical data or forms; no trusted source links any to blood-pressure filing.
- Stop reason: intended persistence/side effect unknown.

### `Code Rule Config` — Confirmed configuration root

- See `feature-location.md`.
- Still no read-only evidence tying its displayed rule builder to PAC2-4399 mapping.

## Knowledge Classification

- `[Observed: dev, Super Admin GB, 2026-09-22]` Patient Search → Care Navigation opens `Patient Profile Search`.
- `[Observed: dev, Super Admin GB, 2026-09-22]` filtered test/demo results show three titled patient actions.
- `[Open Question]` Which control/flow records a blood-pressure reading, whether it creates a draft or persists data, and where EMIS filed code is observable.
- `[Open Question]` Whether `Code Rule Config` controls PAC2-4399 mapping.

## Coverage Impact

- REQ-PAC2-4399-001: Not Run; no filing flow reached.
- REQ-PAC2-4399-002: Blocked; database/config migration not inspectable via black-box UI.
- REQ-PAC2-4399-003: Not Run; no safe execution data or reading flow.

## Approved Follow-up Exploration — 2026-09-22

Tester cho phép mở cả `Care Navigator` và `Quick Form` trên demo patient; cho phép draft tạm chỉ khi cleanup rõ, nhưng không `Save`/`Submit`/`Send`/file.

### `Care Navigator`

- Mở thành công từ patient result tới `/care-navigation/`.
- Hiển thị selected demo patient context, heading `Welcome to Care Navigator`, `Search Services...`, và danh sách service.
- Search read-only `blood pressure` trả không có visible service/result.
- Không chọn service; không draft/mutation.
- Kết luận: route này không cung cấp blood-pressure flow trực tiếp trong current organisation/context.

### `Quick Form`

- Mở `Quick Form` trên cùng demo result không tạo visible form/draft.
- UI chuyển sang visible `error`; console ghi `Error: patient_patientnumber is required`.
- Không có `Save`/`Submit`, không draft, không mutation, không cleanup cần thiết.
- Đây là technical/data blocker cho fixture được chọn, không phải bằng chứng ticket fix fail.

## Updated Knowledge Classification

- `[Observed: dev, Super Admin GB, 2026-09-22]` `Care Navigator` là navigation-only khi mở; blood-pressure search không có visible match.
- `[Observed: dev, Super Admin GB, 2026-09-22]` `Quick Form` trên selected demo result lỗi `patient_patientnumber is required` trước khi form render.
- `[Open Question]` Demo fixture nào có required `patient_patientnumber` và flow/form nào chứa blood-pressure field.

## Second Patient Retry — 2026-09-22

Theo yêu cầu tester, retry `Quick Form` bằng một demo/test patient khác có visible patient number trong search result.

- `Quick Form` vẫn không render.
- UI vẫn chuyển sang `error`.
- Console vẫn ghi `Error: patient_patientnumber is required`.
- Không draft/mutation; không cleanup cần thiết.
- Vì hai fixture có visible patient number đều cho cùng lỗi, blocker có khả năng nằm ở missing internal `patient_patientnumber` mapping/payload, không đơn thuần do chọn patient không hiển thị number. Đây vẫn chỉ là observation, chưa kết luận defect của PAC2-4399.

## Health Form Designer Search — 2026-09-22

Sau khi re-authenticate, mở dashboard → `Health Forms` → `Designer`, route `/health-forms/builder/`. Search read-only `blood pressure` trả nhiều active editable forms.

Candidate sát ticket nhất:

- `Blood Pressure O/E coding test` — type `Scheduled One-Off`, status `Active`, editable `Yes`, created/updated 2025-05-23.

Candidates hỗ trợ khác:

- `Dodgy Blood Pressure Test`
- `Blood Pressure Readings`
- `Blood Pressure reading`
- `Blood Pressure & BMI`
- `Patient Blood Pressure Reading Form from March 2025`
- `7 Day blood pressure monitoring - JK`
- `7-Day Blood Pressure Home Monitoring (Paediatric)`
- `Blood Pressure Diary`

Tester cho phép mở editor read-only. Lần đầu mapping action theo visual index mở nhầm `Blood Pressure Readings`; title mismatch được phát hiện, không thay đổi field và không click `Update Form`.

Sau khi quay lại list, lọc exact title và map AG Grid center row sang pinned action row bằng cùng `row-id`, đã mở đúng form:

- `Health Form Title`: `Blood Pressure O/E coding test`
- Type: `One-off Health Form`
- Có 4 component `Blood Pressure`, cùng label `Blood Pressure Reading`, hint `For example: 120 / 80`, inputs `SYS` / `DIA`.
- Form-level `Add Total Health Form Score to Patient Record` đang checked.
- Component đầu có `Select Emis Header` = `Examination`.
- Component đầu chọn `Record BP readings as: "O/E - blood pressure reading 125/89 mmHg"`; option `Separate Diastolic and Systolic entries` không được chọn.
- `Record Question/Answer in Patient Record` đang checked.
- Các visible `Search SNOMED Code` field của component đầu không hiển thị selected code/value; editor UI hiện tại không cung cấp read-only evidence cho `ConceptID`/`DescriptionID` đích.

Chỉ mở configuration panel; không sửa input, không click component `Save`, `Update Form`, hay `Preview Form`. Mutation vẫn `None`.

`Blood Pressure O/E coding test` được xác nhận là Health Form trực tiếp liên quan O/E blood-pressure filing. Nó cung cấp entry/form structure cho regression, nhưng không chứng minh mapping `75367002` + `1495437014` hoặc migration DB.

## Quick Send Health Form Flow — 2026-09-22

Đã xác định flow gửi exact form bằng read-only navigation:

1. Từ global patient search, search demo query và mở `Quick Send` trên một demo result.
2. `Quick Send` mở dialog đã gắn patient context.
3. Chọn tab `Health Forms`.
4. Chọn `Select Health Form` để mở selector.
5. Search exact `Blood Pressure O/E coding test`; form xuất hiện trong result.

Dừng trước click result vì bước này sẽ thêm Health Form vào Quick Send draft, vượt scope read-only. Đóng dialog bằng `Close`; không click `Save`, send/schedule action, hoặc form result. Mutation `None`.

Demo fixture được quan sát có patient context hợp lệ cho `Quick Send`, nhưng không có SMS/email on file. Không ghi patient name, NHS number, DOB hoặc identifier vào artifact. Việc thiếu contact channel có thể chặn gửi thực tế; chưa kiểm tra vì cần approved recipient/test channel.

- `[Observed: dev, Super Admin GB, 2026-09-22]` Exact form có thể được tìm thấy qua `Patient Search`/global patient search → patient `Quick Send` → `Health Forms` → `Select Health Form`.
- `[Open Question]` Chọn form có chỉ thêm draft cục bộ hay tạo persisted draft; gửi qua channel nào khi selected fixture không có SMS/email.

## Exact Next Action

Tester đã phê duyệt chọn form vào draft. Flow được chạy tới draft trên demo fixture: `Added Health Forms` hiển thị `Blood Pressure O/E coding test`, tab `Health Forms` hiển thị badge `1`, còn `Save` disabled. Sau đó đóng `Quick Send` bằng `Close`; không `Save`, send hoặc schedule. Mutation `None`.

Quick Send hiển thị alert fixture không có mobile number; UI cũng không có SMS/email on file. Chưa có test channel khả dụng để gửi form. Cần tester cung cấp/approve demo patient có test SMS/email channel. Mọi `Save`/send/schedule vẫn cần approval mutation riêng. DB verification vẫn cần migration scope cùng redacted query/export.

## Health Form Inbox — 2026-09-22

- Route: `/health-forms/responses/` (`Health Form Inbox`).
- Search exact `Blood Pressure O/E coding test`, then `View By Health Form`, returned two matching completed response rows.
- Each matching row displayed `View Form`, `synced`, and a `Quick Send` icon. Inbox headers expose `Synced to Primary Care Patient Record`; summary controls distinguish `Reviewed (synced)` from `Reviewed (not synced)`.
- Opened one `View Form` detail read-only. The dialog displayed the exact form title, completed status, four `Blood Pressure Reading` components, and disabled `SYS`/`DIA` fields. This proves the Inbox preserves a viewable response and provides a patient-record synchronization state.
- The dialog does not display EMIS `ConceptID`, `DescriptionID`, filed-code text, or a primary-care-record result. Therefore it cannot prove target mapping `75367002` / `1495437014`.
- Visible dialog controls included `Add/View Comments` and `More Actions`; neither was opened. Toolbar `Send to Patient Record` is a mutation boundary and was not used. No review, sync, send, file, save, update, or deletion occurred. Mutation: None.
- Response content and patient identifiers observed in the UI are intentionally excluded from this artifact.

## Approved Filing Attempt — 2026-09-22

Tester explicitly approved selecting the visible completed response and `Save to Patient Record`. `Send to Patient Record` confirmed one selected one-off form for one patient; no additional comment was entered. Clicking `Save to Patient Record` did not complete filing: the confirmation dialog remained open and the browser recorded `POST /dev/api/web-form/answer/emis` with HTTP `403`. No success message, changed `synced` state, or EMIS code/result was displayed.

- Result: `Blocked` — authorization/server rejection.
- Mutation ledger: one approved filing attempt; outcome rejected before confirmed persistence. Cleanup: not applicable unless server-side audit confirms a partial write.
- No patient identifiers, response values, auth material, request body, or endpoint host are retained in this artifact.

## Updated Knowledge Classification

- `[Observed: dev, Super Admin GB, 2026-09-22]` `Health Form Inbox` can filter the exact form and show completed responses with a visible `synced` state.
- `[Observed: dev, Super Admin GB, 2026-09-22]` `View Form` is a read-only response detail: submitted blood-pressure fields are disabled.
- `[Observed: dev, Super Admin GB, 2026-09-22]` Inbox/detail UI does not visibly expose the required EMIS `ConceptID`/`DescriptionID` or filed-code result.
- `[Open Question]` Whether a permitted, read-only primary-care record surface can expose the exact code pair after synchronization.

## Health Form Inbox Pop-out Investigation — 2026-09-29

Beth cung cấp clue: “there is an issue with the pop out modal in HF inbox which makes it hard to tell which option to select”. Reproduced trên dev, role `Super Admin GB`, route `/health-forms/responses/`, `View By Health Form`.

- Mở một `View Form` từ pinned `Action` column tạo modal 800×800 nhưng modal hiển thị hoàn toàn trắng.
- Loader container vẫn visible sau nhiều giây; content wrapper chứa controls nhưng bị `display: none`.
- Loader có width bằng toàn viewport (1920px) dù được đặt trong modal 800px, làm loading graphic nằm ngoài modal viewport; người dùng chỉ thấy nền trắng.
- Hidden modal controls gồm `More Actions`, `Save to Record`, `Save & Follow up`, `Additional Snomed Code (Optional)`, và hai action cuối cùng cùng có accessible label `Save to Patient Record`.
- Vì content không render, không thể phân biệt/chọn option trong UI. Khi content render được, `Save to Record` và `Save & Follow up` vẫn có accessible labeling trùng nhau, tạo ambiguity bổ sung cho accessibility/automation.
- Không click option, không file/save/follow-up; mutation `None`.
- Evidence raw đã redact PII: `test-results/PAC2-4399/hf-inbox-popout-blank-20260929.png`.
- Review toàn bộ 100 frame của attachment mới không thấy `Health Form Inbox` hoặc pop-out này. Frames `0065`–`0085` (`00:01:48`–`00:02:25`) là `Quick Form`: chỉ có một save icon, không có lựa chọn `Save to Record` / `Save & Follow up`. Vì vậy video không xác định option Beth định chọn và không cung cấp workaround.

### Classification

- `[Observed: dev, Super Admin GB, 2026-09-29]` HF Inbox pop-out modal có thể mắc kẹt ở trạng thái trắng/loading, content hidden.
- `[Observed: dev, Super Admin GB, 2026-09-29]` Hidden actions gồm `Save to Record` và `Save & Follow up`; cả hai expose cùng accessible label `Save to Patient Record`.
- `[Possible defect]` Modal loading/layout khiến tester không biết hoặc không thể chọn option. Đây là issue riêng của HF Inbox modal, không chứng minh PAC2-4399 code migration fail.

### Trigger Recheck — 2026-09-29

- `View Form`/`Review Form` trước tiên mở response dialog trong trang. Header của dialog có icon `expand` không có accessible name; click icon này mở cùng response dialog ở kích thước full viewport, không mở browser tab/window mới.
- Trên response hiện tại bị user khác review, full-viewport dialog vẫn render header, lock notice và disabled filing controls. Không click `Click Here to Take Over`, `More Actions`, `Save to Record` hoặc `Save & Follow up`.
- So với blank reproduction trước đó, trigger phù hợp là `expand` icon. Blank state không phải hệ quả tất yếu của pop-out: cùng trigger hiện render được chrome/control shell nhưng response bị lock. Cần response không locked để đánh giá liệu blank loading liên quan data/state cụ thể hay intermittent.

### Updated Classification

- `[Observed: dev, Super Admin GB, 2026-09-29]` Pop-out trigger là unlabeled `expand` header icon; nó opens a full-viewport in-page dialog.
- `[Inconclusive]` Blank pop-out chưa được tái hiện lại trong lượt trigger recheck này; trạng thái render phụ thuộc response/context chưa xác định.

### Second Reproduction — 2026-09-29

- Sau khi quay về Inbox và mở một `Review Form` khác từ `Action` column, modal hiện `Review Answers` nhưng không có nội dung.
- Chờ thêm 10 giây: loader wrapper vẫn `display: block`; content wrapper vẫn `display: none`; dialog không có empty-state, error hoặc retry control. Không có user/lock notice được render.
- Lần này tái hiện trạng thái trống ở response khác với response previously locked. Không cần click `expand` để tái hiện, nên `expand` không phải điều kiện bắt buộc của failure.
- Không có `Save`, `Take Over`, `More Actions`, filing hoặc thay đổi dữ liệu.

### Final Classification

- `[Observed: dev, Super Admin GB, 2026-09-29]` HF Inbox response modal có thể mắc kẹt loading và che toàn bộ response content ở nhiều response contexts; tái hiện sau wait 10 seconds.
- `[Observed: dev, Super Admin GB, 2026-09-29]` Fresh-page sample gồm 6 visible `Review Form` responses: 3 stuck loading/content hidden, 1 rendered unlocked, 2 rendered nhưng locked. Vì vậy failure không phải universal và không do lock alone.
- `[Possible defect]` Failure path không cung cấp feedback/recovery và che clinical context trước filing controls. Cần owner triage client/data/API loading cause; không suy ra PAC2-4399 SNOMED mapping fail.

## Corrected Beth Verification — 2026-09-29

Beth xác nhận “pop out” cần check là side panel của component `Blood Pressure` trong `Health Form Designer`, không phải modal `Health Form Inbox`.

- Path: `Health Form Designer` → search `Blood Pressure O/E coding test` → `Edit Health Form` → icon edit của component `Blood Pressure` đầu tiên.
- `[Observed: dev, Super Admin GB, 2026-09-29]` Radio `Record BP readings as: "O/E - blood pressure reading 125/89 mmHg"` được selected.
- `[Observed: dev, Super Admin GB, 2026-09-29]` `Record BP readings as Separate Diastolic and Systolic entries` không được selected.
- Không sửa field; không click `Update Form`. Mutation: None.
- Điều tra `Health Form Inbox` phía trên giữ là observation độc lập, ngoài phạm vi clarification của Beth; không dùng để đánh giá O/E configuration.

## Tester notes

