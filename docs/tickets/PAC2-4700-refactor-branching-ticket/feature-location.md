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

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
