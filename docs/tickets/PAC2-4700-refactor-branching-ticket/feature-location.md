# Feature Location: PAC2-4700

**Input Revision:** 1
**Environment:** dev (`pac2-4700-qs-only`)
**Role:** `Super Admin GB`
**Observed:** 2026-09-17T11:28Z–11:52Z
**Status:** Candidate
**Budget:** 12/12 views; 15/15 elapsed minutes

## Search clues

- Ticket terms: `email template`, campaign sorting, `Attachments`, `Booking Links`, EMIS slot type, patient profile, `dropdown`, `Health Forms`
- Survey hints (validate only): `Patients` → `Patient Search`; `Health Forms`; `Configuration`; `Appointment Book`; `Comms Hub` on external `nhs-comms-hub-dev.blinxhealthcare.com`
- Feature-map: không có entry exact cho ticket alias
- Tester clue: không biết
- Actor/context từ requirements: Unknown; session role `Super Admin GB`

## Confirmed entry path

Ticket gồm nhiều area parity, không có một feature root duy nhất. Entry path khớp trực tiếp nhất đã **Observed** trên GP feature branch:

1. Starting state: GP feature-branch sau manual login
   - Landmark/control: URL feature branch `/feature-branch/pac2-4700-qs-only/configuration/`
   - Read-only action: giữ landing state sau login; không chọn template
   - Resulting state: page title `Scheduler Configuration`; landmark `SCHEDULER CONFIG`; control `Select Campaign Template`; danh sách template gồm loại `Email` và `SMS`
   - Context dependency: authenticated GP session; role `Super Admin GB`
   - URL: `https://pac2-4700-qs-only.dev.blinxpaco-np.com/feature-branch/pac2-4700-qs-only/configuration/`

Các supporting entry path đã **Observed**:

2. PACO OS dashboard → `Expand sidebar` → `Patients` → `Patient Search`
   - Result: heading `Patient Search (0)`; links `Filters`, `Create new patient`, `Offline config`
   - URL: `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/patient-search`

3. PACO OS direct route `/health-forms`
   - Result: heading `Health Form Templates`; mutation-shaped create actions không được dùng
   - URL: `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/health-forms`

4. PACO OS direct route `/configuration/`
   - Result: heading `Configuration`; sections `Organisation`, `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, `Clinical Config`, `Case Prioritisation`
   - URL: `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/configuration/`

5. PACO Connect direct route `/appointment-book`
   - Result: route resolves; pass1 dashboard exposed `Appointment Book`, date and export controls; pass2 DOM remained empty after SPA wait
   - URL: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/appointment-book`

## Context requirements

- Feature branch prefixes:
  - OS: `/paco/feature-branch/pac2-4700-qs-only/`
  - Connect: `/paco-connect/feature-branch/pac2-4700-qs-only/`
  - GP: `/feature-branch/pac2-4700-qs-only/` on host `pac2-4700-qs-only.dev.blinxpaco-np.com`
- Role: `Super Admin GB`
- Sidebar thường collapsed icon rail; dùng `Expand sidebar` trước text navigation
- `Comms Hub` / `Campaign Manager` / `Template Manager` dùng origin riêng; Paco SSO không mang theo
- Patient profile / `Attachments` / email compose cần patient result. OS `Patient Search` hiện `(0)` khi scan.
- GP auth đã xác nhận usable trong pass3 (`auth:true`)

## Candidate and rejected paths

- Candidate 1: GP `Scheduler Configuration` — exact surface cho `Select Campaign Template`, email/SMS template parity
- Candidate 2: OS `Patient Search` — entry cho patient profile / `Attachments` / email compose parity; cần patient demo
- Candidate 3: OS `Health Form Templates` — entry cho Health Forms area
- Candidate 4: OS `Configuration` — có thể dẫn `Appointment Books` / scheduler / Booking Links config
- Candidate 5: Connect `Appointment Book` — gần Booking Links / slot / EMIS surface
- Candidate 6: Comms Hub external route từ product survey — campaign sorting / template manager; chưa validate trên feature branch vì auth riêng
- Rejected: sidebar text click khi collapsed — action fail, URL không đổi
- Rejected: GP direct `/appointment-book` — `404 Not Found`, storage key `feature-branch/pac2-4700-qs-only/appointment-book`
- Rejected: GP direct `/booking-links` — `404 Not Found`, storage key `feature-branch/pac2-4700-qs-only/booking-links`
- Rejected: GP direct `/patient-search` resolved tới `/feature-branch/pac2-4700-qs-only/patient-search/`, title `NHS`, nhưng không có landmark/body trong wait window
- Rejected: Connect direct `/booking-links` giữ title `PACO Connect` nhưng không có landmark/body trong wait window; route chưa đủ evidence làm feature root
- Rejected: Connect nav text clicks khi sidebar không expand (`expanded:false`)
- Not attempted: click/select campaign template; `Create new patient`; compose email; attach document; campaign create. Đây là mutation/unknown persistence boundary.

## Observed landmarks

- GP: title `Scheduler Configuration`; `SCHEDULER CONFIG`; `Select Campaign Template`; `Open`; list entries mang type `Email` / `SMS`
- OS dashboard expanded nav: `Comms Hub`, `Health Forms`, `Patients`, `Appointment Book`, `Configuration`
- OS `Patient Search (0)`: `Filters`, `Show archived`, `Create new patient`, patient table columns
- OS `Health Form Templates`: columns `Name`, `Type`, `Created date`, `Created by`, `Updated date`, `Updated by`, `Actions`
- OS `Configuration`: left-menu sections; prompt `Please select a menu item`
- Connect pass1: `Dashboard`, `Appointment Book`, date, `Export PDF`, `CSV`
- SPA routes cần observable heading/body wait; fixed 3–4s vẫn có thể trả empty DOM

## Evidence

- Run id: `20260917-locate-pac2-4700`
- Raw local evidence: `test-results/PAC2-4700/locate/20260917-locate-pac2-4700/`
  - Pass1: `locate-summary.json`
  - Pass2: `08-locate-pass2.json`
  - Pass3: `09-inventory-pass3.json`, `10-gp-landing-info.json`, `13-locate-pass3.json`
  - Milestones: `01-os-dashboard.png`, `02-os-patient-search.png`, `03-os-direct-health-forms.png`, `04-os-direct-configuration.png`, `04-connect-dashboard.png`, `07-gp-landing.png`, `08-gp-configuration.png`, `09-gp-direct-patient-search.png`, `12-connect-booking-links.png`
- Environment: dev feature branch `pac2-4700-qs-only`
- Role: `Super Admin GB`
- Redaction: evidence chỉ lưu local; tài liệu không chứa patient/NHS/contact/template content cụ thể
- requirements.md SHA-256: `15ef5b7e253f238bb6b546e3bca6f8ebc09057f666007d69054f6cf37f92951a`

## Automation hints

- Prefer observed feature-branch URLs hơn collapsed-sidebar clicks
- OS expand: `getByRole('button', { name: /Expand sidebar/i })` trước text navigation
- Stable landmarks: `SCHEDULER CONFIG`, `Select Campaign Template`, `Patient Search`, `Health Form Templates`, `Configuration`
- GP base path khác OS/Connect; không giả định `/paco` hoặc `/paco-connect`
- Không dùng generated CSS class; không assert business parity từ LOCATE
- Comms Hub cần separate origin + auth state

## Blockers and next action

- Blocker: không có authenticated patient/result để mở profile, `Attachments`, hoặc email dialog read-only
- Blocker: Comms Hub cần manual login riêng để locate campaign sorting/template manager
- Warning: Connect `Booking Links` route và GP direct routes trả empty/404; exact Booking Links entry chưa xác minh
- Warning: primary comparison surfaces chưa được mở đủ trên cả 3 app
- Stop condition: chạm ceiling 12/12 meaningful views; không scan thêm trong LOCATE này
- Next action: chuyển `EXPLORE` từ GP `Scheduler Configuration` và OS/Connect candidates. Trước interaction với template/campaign/patient data, xác định read-only action hoặc xin approval nếu action có thể persist/send.

## Confirmed Quick Send entry path

**Classification:** Confirmed từ tester + Observed qua `OBS-PAC2-4700-012` đến `OBS-PAC2-4700-024`, run `20260918-quicksend-base-vs-branch`, và re-verify run `20260918-quicksend-base` (base dashboard, không qua PACO Connect).

Áp dụng cho TC-006, TC-008, TC-012, TC-015 và TC-016:

1. Mở base dashboard (search field có sẵn trực tiếp trên dashboard, không cần PACO Connect riêng):
   - Base: `https://blinx.dev.blinxpaco-np.com/paco/`
   - Branch: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/`
2. Dùng patient search trên Dashboard, search theo tên patient test đã chỉ định. **Quan sát 2026-09-18 (base):** search theo tên có thể trả nhiều kết quả trùng tên; phân biệt bằng NHS number hiển thị trên UI — NHS hiển thị có khoảng trắng giữa (ví dụ `709 86`), không phải chuỗi số liền.
3. Trong đúng patient result, mở `Patient actions menu` — control này render như accessible button thật (`getByRole('button', { name: 'Patient actions menu' })` nhận diện được), không phải luôn cần CSS class suy đoán.
4. Chọn menu item `Quick Send` (item trong menu chứa nhiều action khác: `New Consultation`, `Quick Script`, `Quick Book`, `Quick Form`, `Care Navigation`, `Open Patient in EPR`, `Pull Patient Record`, `Quick Pay`, `Create Task`, `Edit Details`).
5. Xác minh dialog `Quick Send` mở (`role="dialog"`; render có animation, cần wait theo trạng thái visible, không phải tức thời sau click). Từ đây dùng các context đã Observed:
   - `Campaign` → `(click to change)` mở ra **category list** (`Favourites`, `Booking Links & Health Forms`, `General News`, `Guidance & Advice`...) dưới dạng tree (`role="treeitem"`). Sort control cho TC-006 — **Confirmed (đã sửa lỗi nhận diện)**: control tên hiển thị "By message type" ngay cạnh category list KHÔNG phải filter tĩnh, mà là giá trị hiện tại của dropdown thật (`.sort-dropdown`). Click mở panel lộ 5 option: `By date (descending)`, `By date (ascending)`, `By message type`, `A - Z`, `Z - A`. Chọn `A - Z` → tree re-render flat (bỏ category header), item theo alphabet.
   - Header action `Patient Reply` cho TC-008 — **Confirmed** control: `[title="Set up Patient Reply"]`. Actual behavior Observed (không phải expected, OQ-7 vẫn mở): click chuyển active tab sang `Health Forms` (`getByRole('button', { name: 'tab-Health Forms' })`), khớp bug đã ghi nhận trong `status.md`.
   - `Patient Information` → `Search all tabs...` cho TC-012 — **Confirmed** control: input trong panel mở bằng `View Patient Details`, `getByPlaceholder(/search all tabs/i)`. Actual behavior Observed (OQ-10 vẫn mở): gõ text không filter/highlight gì, khớp bug đã ghi nhận.
   - `Campaign` compose controls cho TC-015 — **Confirmed**: campaign default đã chọn sẵn khi dialog mở (không cần picker); controls xác định bằng `title` attribute: `Healthcare resources and links` (Resources), `Create a custom button for your email` (Button), `Insert professional email templates` (Templates), `Copy your Email text into the SMS template` (Copy to SMS — khác `Copy to Email` giả định gốc).
   - `Patient Information` → `Significant Info` cho TC-016 — **Confirmed (đã sửa)**: control đúng không phải text "Patient Information" (chỉ là `<p>` label ẩn) mà là button `aria-label="View Patient Details"` (class `patient-details-toggle-btn`, ở dialog header). Click mở accordion category: `Personal Info`, `Significant Info`, `Allergies`, `Active Medications`, `Past Medications`, `Appointments`, `Active Problems`, `Significant Past Problems`, `Test Results`, `Attachments` (không có `PACO Registers` như giả định gốc). Cùng khu vực có button `title="Set up Patient Reply"` — candidate cho TC-008.

**Context:** Patient-specific Quick Send trên base dashboard (`/paco/`) hoặc branch qua PACO Connect.
**Role:** `Super Admin GB`.
**Test-data category:** Shared test patient (`Michael Ramella`, NHS hiển thị `709 86`); không ghi PII vào screenshot/report và không mutation.
**Route status:** Confirmed cho cả năm case trên (route + dialog + control cụ thể).

## Confirmed Quick Send supporting surfaces

**Observed 2026-09-18 trên base `/paco/`, read-only:** `Booking Links`, EMIS và Comms Hub references của ticket nằm trong Quick Send workflow; không cần đăng nhập Comms Hub origin riêng để locate các control được consume trong modal.

1. Dashboard → search shared test patient → `Patient actions menu` → `Quick Send`.
2. Bottom navigation có bốn button visible: `Campaign`, `Health Forms`, `Files`, `Booking Link`.
3. Chọn `Booking Link` không mở page riêng; modal giữ nguyên và campaign chứa scheduler-link content được render trong compose area. Landmark Observed: campaign `6 July - Test Case 1`, token `{{{scheduler_link}}}`, `Virtual Consult Link`, `Merge Fields`, `Preview`, `Edit`.
4. `Files` render `Add files from patient record`, `Select Attachment`, `Browse or record video`; không upload/chọn file.
5. `Health Forms` render `Add Health Form(s)`; không add form.
6. Campaign picker là source consume campaign/template (Comms Hub data) ngay trong modal. Không cần mở `nhs-comms-hub-dev.blinxhealthcare.com` cho phạm vi consume/render.
7. Re-check riêng 2026-09-18: sau khi click `Booking Link`, modal chỉ expose button `Booking Link`; không có text/control `EMIS`, `slot` hoặc `slot type`. Scan campaign picker theo các search term liên quan tìm được 3 candidate: `GP Requested Appointment`, `How do i set up an quick send message (no appointment)`, `Tower House Practice - New Online Booking!`. Hai candidate đầu mở read-only nhưng không expose `EMIS`, `slot type`, `Virtual Mental Health` hay scheduler-link mapping. Candidate `Tower House Practice - New Online Booking!` visible trong result nhưng click không hoàn tất trong observable wait window, nên chưa inspect được. Exact mapped slot vẫn `Candidate`.

**Safety boundary:** Không click `Edit`, `Virtual Consult Link`, `Add Health Form(s)`, attachment/upload hoặc `Save`; các action có thể tạo/persist dữ liệu.

**Evidence classification:** Observed, không dùng làm business-correct assertion. Raw structural probe đã xóa vì chứa patient/contact/template data; finding đã được review và redacted tại đây.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
