# Comms Hub — Campaign Manager

## Route
- URL: `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/commshub/campaign-manager/create`
- Note: double `/commshub/commshub` path is intentional (redirect from `/commshub/campaign-manager/create`)

## Auth
Separate auth domain — SSO from `blinx.dev.blinxpaco-np.com` does NOT carry over.
Manual login via `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/login` required.
After login, navigating to `/commshub/campaign-manager` works within the same browser session.

## Tech stack
- Bootstrap 4 + jQuery + custom Tail Select dropdowns (not MUI, not PrimeReact)
- React used for some components (textarea, tail select sync)
- Tail Select: custom select replacement (not a native `<select>` behavior)

## Campaign Setup — Step 1 fields

| Field | Type | Automation |
|---|---|---|
| `Campaign Name *` | Plain text input, `placeholder="Enter Campaign Name"` | `locator.fill()` works |
| `Patient Facing Campaign Display Name *` | React textarea | `locator.type()` (NOT `.fill()` — React state) |
| `SMS` consent pill | Display-only indicator | Not interactive |
| `Email` consent pill | Display-only indicator | Not interactive |
| `Campaign Type(s) *` | Tail Select (`.tail-select.js-campaignTypeDropdown`) | Click `.select-label` → options in `.select-dropdown` as `li[data-key="0"]` (Scheduled), `li[data-key="1"]` (Quick Send), `li[data-key="2"]` (Patient-Initiated); multi-select via `li.click()` |
| `Campaign Tags` | Tail Select (50+ tags) | Same pattern as Campaign Type |
| `Add appointment invitation` | Checkbox (`.checkbox-hollow`) | Click the div |
| `Add Health Form(s) to Campaign?` | Checkbox (`.checkbox-hollow`) | Click the div |
| `Next` button | `.next-page-btn` | Disabled until all required React-state fields filled |

### Tail Select automation pattern
```js
// Open dropdown
const ts = document.querySelector('.tail-select.js-campaignTypeDropdown');
ts.querySelector('.select-label').click(); // sets display:none→block on .select-dropdown
await page.waitForTimeout(300);

// Select option
const li = document.querySelector('.select-dropdown li[data-key="1"]');
li.click();
```

### React textarea automation
```js
// DOES NOT work:
ta.value = 'text';
ta.dispatchEvent(new Event('input', {bubbles:true}));

// WORKS:
locator.type('text', {delay: 80});
```

### Next button gating
- `button.next-page-btn` is `disabled=true` by default
- No HTML `required` attributes — validation is React-level
- Must fill `Campaign Name` (input) AND `Patient Facing Campaign Display Name` (textarea) before Next enables
- SMS/Email pills are display-only, NOT gating factors

## Hidden conditional inputs (appear when SMS/Email selected)
- `#emailFromAddress` — text input
- `#emailSubjectLine` — text input
- `#smsFromName` — text input
- `#webformSelectionSearch` — text input (health form search)

## Stable selectors
- Campaign name: `input[placeholder="Enter Campaign Name"]`
- Patient facing name: `textarea[placeholder="Patient Facing Campaign Display Name"]`
- Tail select label: `.tail-select .select-label`
- Next button: `button.next-page-btn`
- Campaign type options: `.select-dropdown li[data-key="0/1/2"]`
- Tags options: `.select-dropdown li[data-key="<id>"]`
- Consent pills: `.comms-consent-pill-sms`, `.comms-consent-pill-email`
- Appointment invite checkbox: `[class*=js-appointment-invite]` or `.checkbox-hollow` near "Add appointment invitation"
- Health form checkbox: `.js-cc-addHealthFormsRow .checkbox-hollow`

## Step 1 → Step 2 Navigation (Critical Automation Gap)

**Step 1 validation gates progression** via `campaignSetupStepValidation()`:
1. `newCampaignNameValid=true` — async axios check, skippable: `window.newCampaignNameValid = true`
2. `campaignCreationObj.DESCRIPTION` non-empty — set via: `$('.campaign-description-input').val('text'); $(descInput).trigger('input')`
3. SMS or Email selected — toggle via: `document.getElementById('newCampaignSmsBtn').click()` (DOM `.click()`, NOT jQuery `.trigger('click')` which toggles OFF)

**CRITICAL**: The `.campaign-description-input` textarea is overlaid by a React-rendered div. Playwright `locator.fill()` and `locator.type()` cannot interact with it (element covered). jQuery `.trigger('input')` fires the JS event handler correctly (sets `campaignCreationObj.DESCRIPTION`) but does NOT update the React textarea display — so the visual shows empty while the JS state is correct. This makes E2E automation of Step 1 unfeasible without full E2E test framework (Puppeteer with headless browser + React DevTools, or Cypress).

**Step 2 (Patient List)** and **Step 3 (Review)** cannot be reached programmatically.

## Other Comms Hub Pages
- **Campaign Manager list**: AG Grid (`ag-theme-balham-dark`, `.newTableComponent`) — 873 `ag-*` class elements, full AG Grid with sorting, filtering, pagination. Data loaded via API.
- **Campaign Outbox**: Tail Select (`.tail-select`) + plain text `Search campaigns...` input.
- **Settings**: `404` — route not found.
- **User Management**: `404` — route not found.
- **Analytics**: Separate auth required — redirects to login page.

## Provenance and gaps
- Raw evidence: `test-results/product-survey/batch37-comms-hub-20260916/`
- Open questions: Quick Send flow (Patient-Initiated campaign type), Patient List step (Step 2), Review step (Step 3), campaign tags creation, campaign editing existing campaigns, editing existing campaigns in the list view.
- Route: `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/commshub/campaign-manager/create`
- Consent pills: SMS and Email pills are display-only, not checkbox inputs — they reflect patient communication preferences
- Next button disabled state: React controlled, no external value indicators
- Assertions lacking trusted expected basis: exact validation rules for enabling Next, campaign type impact on subsequent steps, tag selection defaults

## Discovery update run-20261001-085609

`Observed: dev, Super Admin GB, 2026-10-01`; autonomous discovery read-only, checkpoint `docs/product/survey/roles/super-admin-gb-run-20261001-085609.discovery.yaml`. Không có mutation; mọi điểm dưới đây là hành vi hiện tại, chưa đối chiếu requirement.

- Sidebar `Comms Hub`: `Template Manager`, `Campaign Manager`, `Patient Manager` → host `nhs-comms-hub-dev.blinxhealthcare.com` (đã thêm vào `externalDevHosts` cho read-only theo approval tester).
- Sau khi tester đăng nhập: cả ba trang tải dữ liệu bình thường. **Đính chính (deep dive cùng ngày):** `SESSION EXPIRED` là heading của modal ẩn dùng chung, không phải banner đang hiển thị. `Analytics & Reports > Comms Analytics` vẫn rơi về `/commshub/login` (`loggedout=true&msg=error-at-axios-interceptor` ở lần đầu).
- Approval stop: Template `Create New Email/SMS`, `Create without a Template`, `Save`; Campaign `Create Campaign`, `Resend` (SEND), `Add Selected`, `Save`; Patient Manager: `Create List`, `Add to Existing List`, `Upload CSV` có trong DOM nhưng ẩn trên trang list (chỉ trong modal).
- Template Manager: nhóm `Shared Templates (418)` / `Non-Shared Templates (2220)`, filter org `Viewing data for:`; shared có `View` (read-only `/template-builder/email/view/<id>`) + `Copy`; non-shared có `Edit`/`Delete`/`Copy`. Mở nhóm bằng icon `.ag-group-contracted`.
- Campaign Manager: `Non-Shared Campaigns (4115)` / `Shared Campaigns (445)`; action `Analytics` (`/commshub/analytics`, bảng cấp bệnh nhân có PII, `Export to CSV`), `Outbox` (`/commshub/campaign-outbox`, chọn campaign mới hiện bảng), `Edit`/`Delete`/`Restore`.
- Patient Manager: recipient list `Non-Shared Lists (33)` / `Shared Lists (186)`; ô `Actions` trống trên các dòng quan sát được (`Open Question`).
- Handoff từ Paco: Patient Analyser `Send to Comms Hub`/`Group Quick Send` (SEND boundary, chưa thực hiện).

## Logic từ ticket

Nguồn: `PAC2-1805`, `PAC2-3798`, `PAC2-4399`, `PAC2-4700`, `PAC2-5776`, `PAC2-6540`, `PAC2-6982`, `PAC2-7201`, `PAC2-8522`.

### Quick Send dialog

**Luồng**
1. Global header patient search → `Patient actions menu` (cùng `Quick Book`, `Quick Form`, `Care Navigation`) → `Quick Send`; không click vào dòng patient (mở patient profile). `[Observed]` — PAC2-4700/feature-location.md, PAC2-8522/exploration.md
2. Dialog có `Send as:` `SMS`/`Email`, `Preview`, `Edit`, `Copy to Email`, `Resources`, tab `Campaign`/`Health Forms`/`Files`/`Booking Link`, `Save`, nút send/schedule; có trên baseline, Connect, OS, GP branch. `[Observed]` — PAC2-4700/feature-location.md, exploration.md
3. `(click to change)` mở `Select Campaign` (tree) với sort `By date (descending)`, `By date (ascending)`, `By message type`, `A - Z`, `Z - A`. `[Observed]` — PAC2-4700/exploration.md, PAC2-8522/exploration.md
4. Tab `Health Forms` → `Select Health Form` → search; chọn form thêm vào `Added Health Forms`; `Save` disabled cho tới khi có thay đổi hợp lệ; `Close` không lưu. `[Observed]` — PAC2-4399/exploration.md
5. Tab `Booking Link`: `Date & Time`, `Refresh Availability`, slot type (`Face to Face`/`Phone`/`Video`/`Web Chat`), `Select Clinician(s)`, `Select Location(s)`, `Booking Notes (optional)`; slot type của org load vào dropdown. `[Observed]` — PAC2-4700/exploration.md
6. Tab `Files`: `Loading...` vài giây rồi `Select Attachment`; thiếu patient number thì tooltip lỗi tải attachments; khi `Select Campaign` đang mở, `Files` có class disabled (Connect). `[Observed]` — PAC2-4700/exploration.md, automation.md

**Business rules**
- `Send as` bị disable khi patient không có contact tương ứng; khi thiếu cả SMS/email, dialog hiện alert thiếu số mobile và không có kênh gửi. `[Observed]` — PAC2-4700/exploration.md, PAC2-4399/exploration.md
- Mặc định `SMS` hay `Email` đổi theo dữ liệu patient/thời gian/branch (baseline/OS thấy `Email` khi có cả hai). `[Observed]` — PAC2-4700/exploration.md
- Tab `Health Forms` và `Booking Link` có badge số item đã thêm vào draft. `[Observed]` — PAC2-4700/automation.md, PAC2-4399/exploration.md
- Mutation boundary: `Save`, send/schedule, `Edit` draft, `Set up Patient Reply`, thêm campaign/file/booking vào draft. `[Observed]` — PAC2-4700/feature-location.md
- Sidebar icon `Quick Send` là launcher `Comms Hub` (`Template Manager`, `Campaign Manager`, `Patient Manager`), không phải composer. `[Observed]` — PAC2-8522/exploration.md, status.md
- Sort dropdown không persist khi bấm `Files` (khác video 2026-09-17); OS `Files` tải chậm ~12s nhưng không perma-load. `[Observed]` — PAC2-4700/automation.md

**Role/permission**
- Role dùng: `Super Admin GB`, `Blinx Deployment`, `GP Paco Assist`. `[Observed]` — PAC2-8522/status.md, PAC2-5776/status.md

**Defect đã biết**
- PAC2-4700 · Inconclusive (TC-015) · `Escape` trên OS branch khi mở dropdown slot type đóng cả dialog `Quick Send` thay vì chỉ overlay. `[Observed]` — PAC2-4700/exploration.md
- PAC2-4700 · Inconclusive (TC-010, 011, 012) · default channel, sort option, attachments chưa kết luận (khác dataset giữa host). `[Observed]` — PAC2-4700/report.md
- PAC2-4700 · Blocked (TC-013) · EMIS slot type mapped. `[Observed]` — PAC2-4700/report.md

**Open questions**
- Default channel `SMS` vs `Email`; OS khác dataset hay bug; mutation `Send`/`Save as new Campaign` có trong scope không; branch-context retention trên Connect. `[Open Question]` — PAC2-4700/requirements.md, report.md

### Popup Scheduler Link Required

**Luồng**
1. Tải template có booking link hoặc health form, rồi thêm health form/booking link vào template đã có scheduler link. `[Confirmed]` — PAC2-5776/requirements.md
2. Hệ thống có thể (không ổn định) yêu cầu thêm scheduler link dù đã có. `[Confirmed]` — PAC2-5776/requirements.md
3. Khi `Quick Send` là follow-up action ở `Health Form Inbox`, popup có thể nằm sau hộp `Quick Send`, không tương tác được và chặn gửi. `[Confirmed]` — PAC2-5776/requirements.md

**Business rules**
- Mong muốn: không hiện popup khi template đã có scheduler link hợp lệ; nếu hiện thì phải tương tác được và không bị che. `[Inferred from: REQ-001/002, needs confirmation]` — PAC2-5776/requirements.md
- Fix được xác nhận đã deploy lên dev (2026-09-10); recording demo không có evidence trực quan. `[Observed]` — PAC2-5776/status.md
- Không tái hiện popup trên baseline/OS/Connect/GP dù campaign body chứa placeholder scheduler link; video 2026-09-11 từng thấy popup ở Connect. `[Observed]` — PAC2-4700/exploration.md, report.md

**Role/permission**
- Role dùng `GP Paco Assist`. `[Observed]` — PAC2-5776/status.md

**Defect đã biết**
- PAC2-5776 · Inconclusive · popup intermittent/sau hộp `Quick Send`; 3–4 test case đều Blocked ở automation review (thiếu expected xác nhận, test data, approval mutation `Unknown`). `[Observed]` — PAC2-5776/status.md, exploration.md
- PAC2-4700 · Inconclusive (TC-014) · không tái hiện trên dev. `[Observed]` — PAC2-4700/report.md

**Open questions**
- Khi nào popup hiển thị là đúng (thiếu link thật vs false positive); "scheduler link hợp lệ" nghĩa là gì; fix mong muốn là bỏ popup hay đưa lên lớp trên; pass condition cho lỗi intermittent. `[Open Question]` — PAC2-5776/requirements.md, PAC2-4700/requirements.md

### Campaign tags trong Quick Send

**Luồng**
1. Trong composer, campaign được chọn hiển thị tag cạnh tên; campaign không tag thì không render vùng tag khi editing tắt; overflow thu gọn `+N`, hover xem phần còn lại. `[Confirmed]` — PAC2-8522/requirements.md (REQ-001)
2. Control `Edit campaign tags` mở dialog: search tag tổ chức, chọn tag, `Save tags` (enabled sau khi chọn), `Cancel` không persist. `[Observed]` — PAC2-8522/automation.md (TC-001, 003, 004)
3. Thêm tag → save → reopen thấy tag đã tick; gỡ tag → save trả về baseline. `[Observed]` — PAC2-8522/automation.md
4. Thêm/bỏ tag trong một interaction rồi `Save`: persist và hiện trong `Comms Hub` không cần refresh campaign library. `[Confirmed]` — PAC2-8522/requirements.md (REQ-003)

**Business rules**
- Tìm tag tồn tại bằng vài ký tự đầu; chọn tag không tạo duplicate; tag đang gắn hiển thị ticked; tạo tag mới ngoài scope (backend route tắt). `[Confirmed]` — PAC2-8522/requirements.md (REQ-002)
- Tag gắn với campaign nhưng không có trong `getAllTags` (shared từ org khác/đã removed) vẫn hiển thị, tick được, không bị xóa im lặng ở lần save sau. `[Confirmed]` — PAC2-8522/requirements.md (REQ-004)
- `Save as new Campaign`: backend hỗ trợ tags nhưng UI field "Still to do"; chưa dùng làm assertion. `[Confirmed, Candidate]` — PAC2-8522/requirements.md (REQ-006)
- Bật bằng query `qs_campaign_tags=true` trên feature branch. `[Observed]` — PAC2-8522/exploration.md, status.md
- Campaign không tag vẫn hiện `Add tags` enabled với cả `Super Admin GB` và `Blinx Deployment` (chưa có context "editing off"). `[Observed]` — PAC2-8522/automation.md (TC-002)
- Hành vi `+N` overflow/hover chưa có quan sát. `[Inferred from: requirements notes, needs confirmation]` — PAC2-8522/requirements.md

**Role/permission**
- Chỉ người có quyền update campaign sửa tag (ticket nêu `qsNewCampaignCreator`, chưa xác nhận tương đương); người không có quyền thấy tag nhưng không sửa. `[Confirmed]` — PAC2-8522/requirements.md (REQ-002, REQ-005)

**Defect đã biết**
- PAC2-8522 · Blocked (TC-002, 005, 006) · thiếu context editing-off, fixture attached-tag vắng option list, account không quyền update. `[Observed]` — PAC2-8522/status.md
- PAC2-8522 · Not Run (TC-007) · `Save as new Campaign` disputed. Kết quả: 3 Pass (TC-001, 003, 004), 0 Fail; TC-004 chưa cross-check trong `Comms Hub`. `[Observed]` — PAC2-8522/status.md

**Open questions**
- Role/account đại diện user có/không có quyền; campaign/tag test an toàn; fixture tag shared/removed đang attached; `Save as new Campaign` trong scope; feature branch riêng hay dev mặc định đã chứa thay đổi. `[Open Question]` — PAC2-8522/requirements.md

### Campaign Manager và Campaign Outbox

**Luồng**
1. Sidebar `Comms Hub`/`Quick Send` → `Campaign Manager` chuyển sang site Comms Hub riêng, cần đăng nhập riêng (không share session PACO). `[Observed]` — PAC2-1805/status.md, PAC2-3798/exploration.md, PAC2-6540/status.md
2. `Campaign Manager`: `Create Campaign`, `Campaign Outbox`, `Search campaigns`, `Clear Filters`, filter theo status, nhóm `Non-Shared Campaigns`/`Shared Campaigns`, cột ownership/sharing. `[Observed]` — PAC2-6982/exploration.md, PAC2-1805/status.md
3. `Campaign Outbox`: filter site/organisation, date range mặc định ~30 ngày, preset `All Time`; chọn campaign để xem communication; ghi lịch sử gửi theo patient. `[Observed]` — PAC2-6540/exploration.md
4. `Viewing data for` mở cây organisation (parent → child) + `Apply`; `Apply` đổi context nên là boundary mutation. `[Observed]` — PAC2-6982/exploration.md
5. `Create Campaign` wizard cho chọn `Select Booking Links` khi tạo campaign patient-initiated; luôn tạo dưới home organisation của account bất kể `Viewing data for`. `[Observed]` — PAC2-7201/manual-test-guide.md, exploration.md

**Business rules**
- Organisation selector chỉ liệt kê org mà session có entitlement; thiếu org gốc của ticket gây `Blocked`. `[Observed]` — PAC2-6540/exploration.md, status.md
- Search grid theo tên có thể không hiện row dù campaign vẫn có trong `Select Campaign` (không đủ kết luận thiếu). `[Observed]` — PAC2-8522/exploration.md
- Top-bar `PaComms` không liên quan, disabled với nhiều role. `[Observed]` — PAC2-6540/status.md
- Bệnh nhân deleted phải xử lý nhất quán giữa `Analytics Reports` và `Comms Hub`; tập người nhận phải khớp tập bệnh nhân trong report; count khớp. `[Confirmed]` — PAC2-6540/requirements.md (REQ-001, 002, 005)
- `Outbox` hiển thị `Not Sent - Patient Deleted or Inactive` (gộp deleted và inactive). `[Confirmed]` — PAC2-6540/requirements.md (REQ-003)

**Trạng thái**
- Outbox status: `Sent`, `Not Sent - Patient Deleted or Inactive`, `Failed` (nghĩa của `Failed` chưa rõ). `[Observed]` — PAC2-6540/requirements.md, PAC2-7201/requirements.md

**Defect đã biết**
- PAC2-1805 · Fail kỹ thuật (3/3, ngoài scope ticket) · `Resend` trên `Campaign Outbox` ("Initial Email") HTTP 400, không toast lỗi, kèm exception JS ở modal edit campaign details; chưa có ticket riêng. `[Observed]` — PAC2-1805/status.md
- PAC2-6540 · Not Run (TC-003) · đối chiếu patient set với `Outbox`: org gốc không nằm trong selector. `[Observed]` — PAC2-6540/report.md

**Open questions**
- Ticket 6540 tự mâu thuẫn: nhóm bị coi deleted nhưng deleted status ghi `False`; chênh lệch included − excluded không khớp số `Not Sent` (lệch 2); công thức đối chiếu và thứ tự ưu tiên khi nhiều nguyên nhân không gửi chưa rõ. `[Open Question]` — PAC2-6540/requirements.md

### Shared Campaign và quyền view/edit

**Luồng**
1. Campaign tạo ở org A được share sang org B; panel `Quick Send/PI Sharing` nêu: share cũng chia sẻ assets (Templates, Health Forms). `[Observed]` — PAC2-7201/exploration.md (OBS-001)
2. Org được share chỉ `view` campaign và assets, không `edit`; creator giữ `edit`. `[Observed]` — PAC2-7201/exploration.md (OBS-001)
3. Production (video ticket): org tạo có View+Edit+Delete, org được share chỉ View; tab `Shared Campaigns` rỗng ở home PCN trong video. `[Observed]` — PAC2-7201/exploration.md (OBS-006)

**Business rules**
- Toàn bộ REQ của ticket là Inferred (không AC): campaign phải hiện trong `Shared Campaigns` ở home org và mở/view/edit được; `Status` không `Failed` khi campaign vẫn accessible; sau edit vẫn ở `Shared` và view/edit được cả hai phía. `[Inferred from: ticket symptoms, needs confirmation]` — PAC2-7201/requirements.md (REQ-001..004)
- Quyền edit shared campaign có thể gắn với hướng share cụ thể chứ không phải đảo creator/shared-to đơn giản; root cause chưa biết (độ tin cậy tester: pattern có thật trên dev ~90%, là root cause production ~60–65%). `[Inferred from: 2 pattern quan sát, needs confirmation]` — PAC2-7201/exploration.md, status.md

**Role/permission**
- Role/permission của "practice user" cho Outbox/Shared Campaign chưa nêu. `[Open Question]` — PAC2-6540/requirements.md, PAC2-7201/requirements.md

**Defect đã biết**
- PAC2-7201 · Fail dự kiến (TC-002, chưa execute chính thức) · pattern 1 trên dev: org được share cũng có `Edit` + `Delete` (sai thiết kế), tái hiện 3 lần ở 3 cặp org. `[Observed]` — PAC2-7201/exploration.md (OBS-003..005)
- PAC2-7201 · Inconclusive · pattern 2: org tạo chỉ có `Performance` + `View`, không `Edit`/`Delete`, `Save` disabled, khớp triệu chứng ticket. `[Observed]` — PAC2-7201/exploration.md (OBS-002)
- PAC2-7201 · Blocked (TC-003, 005, 006) · thiếu account phía kia, quyền home PCN, định nghĩa `Failed` mơ hồ; TC-004 không automate được (basis Inferred). `[Observed]` — PAC2-7201/status.md
- Leftover: 1 campaign test còn trên dev (Quick Send, shared); `Pause` không phản hồi; chưa `Delete` do cần approval riêng. `[Observed]` — PAC2-7201/status.md

**Open questions**
- `Failed` nghĩa là gì; số campaign "bị thiếu" ở home PCN có liên quan `Failed`; đăng nhập Comms Hub từ demo org có ảnh hưởng; cần account single-org. `[Open Question]` — PAC2-7201/requirements.md, status.md

### Comms Analytics

**Luồng**
1. `Analytics & Reports` → `Comms Analytics` redirect sang login Comms Hub (kèm lỗi `error-at-axios-interceptor` lần đầu khi chưa có session). `[Observed]` — PAC2-3798/exploration.md
2. `Export to CSV`: request trả HTTP 200 dạng JSON (`success=true`), không download trực tiếp. `[Observed]` — PAC2-3798/exploration.md

**Business rules**
- Comms Hub Analytics là site riêng, ngoài scope PAC2-3798 (TC-010 CSV, TC-011 send to comms hub: Not Run). `[Confirmed]` — PAC2-3798/automation.md

**Defect đã biết**
- PAC2-3798 · Inconclusive · schema CSV chưa có contract. `[Observed]` — PAC2-3798/exploration.md

### UI component library refactor (PAC2-4700)

**Luồng**
1. Refactor dọn global CSS, bọc PrimeReact thành Storybook `Bx*` components, đồng bộ style `Quick Send`/form controls trên 4 consumer: Connect, GP (Supergrid), PC24/OS, Rocketbar. `[Confirmed]` — PAC2-4700/requirements.md (REQ-001..008)
2. QA so với baseline (`PAC2-4683` đã merge); chỉ ghi major visual/functional breakage. `[Confirmed]` — PAC2-4700/requirements.md; `[Observed]` baseline xác nhận bởi tester — PAC2-4700/automation.md

**Business rules**
- Không đổi UX/visual/mobile/layout; control trong scope: `input`, `textarea`, `dropdown`, `multiselect`, `checkbox`, `radio`, `avatar` (hover/focus/checked); `Quick Form` sau bump version; mỗi consumer test riêng; Jira AC không có. `[Confirmed]` — PAC2-4700/requirements.md
- `Launch Rocket Bar` gọi desktop protocol handler không có trên máy test (remote entry 404). `[Observed]` — PAC2-4700/automation.md, report.md

**Defect đã biết**
- PAC2-4700 · Pass (TC-001..005) · form primitives, dropdown, checkbox/radio, GP `Quick Form`, GP `Quick Send` khớp baseline; tổng 5 Pass / 0 Fail / 2 Blocked / 5 Inconclusive, không tạo defect. `[Observed]` — PAC2-4700/report.md
- PAC2-4700 · Blocked (TC-006) · Rocketbar do integration môi trường. `[Observed]` — PAC2-4700/report.md

**Open questions**
- Rocketbar thiếu preview; có test `Quick Form` riêng; GP theme xám chưa xác nhận. `[Open Question]` — PAC2-4700/requirements.md, report.md

## Tester notes
