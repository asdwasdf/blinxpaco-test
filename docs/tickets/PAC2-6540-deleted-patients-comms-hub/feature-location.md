# Feature Location: PAC2-6540

**Input Revision:** 1
**Environment:** dev
**Role:** `GP Paco Assist`
**Observed:** 2026-09-13T03:59:00Z
**Status:** Confirmed
**Budget:** 3/12 views in latest bounded run

## Search clues

- Exact terms: `Analytics Reports`, `Comms Hub`, `Outbox`, `Advanced Search`, `Deleted Patient Included`, `Deleted Patient Excluded`.
- Aliases: `Analytics & Reports`, `Analytics and Reports`, `Reports`, `PaComms`, campaign, deleted patient, inactive patient.
- Actor/context: practice user; tester xác nhận role `GP Paco Assist` trên `dev`.
- Trigger/target nouns: report, patient set, campaign, send, outbox status, deleted/inactive filter.

## Confirmed entry path

1. Starting state: `/paco/dashboard`
   - Landmark/control: sidebar item `Analytics & Reports`
   - Read-only action: mở sidebar rồi chọn `Analytics & Reports`
   - Resulting state: submenu có entry `Reports`
   - Context dependency: authenticated `GP Paco Assist` session trên `dev`
2. Starting state: submenu `Analytics & Reports`
   - Landmark/control: `Reports`
   - Read-only action: chọn `Reports`
   - Resulting state: `/paco/analytics-reports`, heading `Analytics and Reports`
   - Context dependency: role có quyền mở module; trang hiển thị cảnh báo không được phép xem `Summary Care Record (SCR) report`

Route trên chỉ xác minh root `Analytics and Reports`; chưa xác minh được `Advanced Search`, deleted-patient filters hoặc campaign `Outbox` thuộc scope ticket.

## Context requirements

- `Analytics and Reports` root mở được với role hiện tại.
- `Comms Hub`/`PaComms` cần role/permission khác hoặc enablement mà `GP Paco Assist` hiện không có.
- Cần practice/site có quyền xem campaign và `Outbox`; không yêu cầu patient identifier trong bước location.

## Candidate and rejected paths

- Candidate: `/paco/analytics-reports` qua `Analytics & Reports` → `Reports`; root hợp ticket nhưng exact entry tới `Advanced Search`, campaign results hoặc `Outbox` vẫn Unknown.
- Rejected: top-bar `PaComms`; QA xác nhận ngày 2026-09-14 rằng feature này không cần cho ticket. Đây là tester-provided location clue, không phải browser observation về product intent; dependency revision 1.
- Rejected: `/paco/patient-search`; có `Filters` và patient fields nhưng không có `Advanced Search` hoặc deleted-patient included/excluded controls trong visible state; dependency revision 1.

## Observed landmarks

- `Analytics & Reports` trong expanded sidebar.
- `Reports` trong submenu.
- Heading `Analytics and Reports` tại `/paco/analytics-reports`.
- Tabs `Analytics` và `Reports`; visible report links không cung cấp entry `Advanced Search`.
- `PaComms` trong `More options`, hiển thị disabled/inaccessible cho role hiện tại.
- `/paco/patient-search` có `Filters`, `Search Patients...` và `Create new patient`; không chọn hoặc nhập dữ liệu.

## Evidence

- `test-results/PAC2-6540/locate/20260913T035900Z/PAC2-6540-LOCATE-analytics-entry-20260913T035900Z.png` — local raw evidence; `dev`; `GP Paco Assist`; chỉ chứa navigation label.
- `test-results/PAC2-6540/locate/20260913T035900Z/PAC2-6540-LOCATE-reports-entry-20260913T035900Z.png` — local raw evidence; `dev`; `GP Paco Assist`; chỉ chứa entry label.
- `test-results/PAC2-6540/locate/20260913T035900Z/PAC2-6540-LOCATE-analytics-root-20260913T035900Z.png` — local raw evidence; `dev`; `GP Paco Assist`; chỉ chứa page heading.
- `test-results/PAC2-6540/locate/20260913T035900Z/PAC2-6540-LOCATE-pacomms-disabled-20260913T035900Z.png` — local raw evidence; `dev`; `GP Paco Assist`; disabled control, không chứa patient/auth data.

## Automation hints

- Stable observed route hint: `/paco/analytics-reports` với heading `Analytics and Reports`.
- Stable observed entry labels: `Analytics & Reports` và `Reports`.
- Không tạo locator/assertion cho `Advanced Search`, deleted-patient filters, `Comms Hub` hoặc `Outbox` vì route chưa được xác minh.

## Super User validation

**Observed:** 2026-09-13T04:20:29Z
**Role:** `Super User`
**Additional budget:** 1 meaningful view

- Dashboard xác nhận context `Super User`.
- `More options` vẫn hiển thị `PaComms` disabled: `aria-hidden="true"`, `tabindex="-1"`, `cursor-not-allowed`.
- Role change từ `GP Paco Assist` sang `Super User` không mở quyền `PaComms`; không click disabled control và không có mutation.

## Blinx Deployment validation

**Observed:** 2026-09-13T04:29:54Z
**Role:** `Blinx Deployment`
**Additional budget:** 1 meaningful view

- Dashboard xác nhận context `Blinx Deployment`.
- `More options` vẫn hiển thị `PaComms` disabled: `aria-hidden="true"`, `tabindex="-1"`, `cursor-not-allowed`.
- Không click disabled control và không có mutation.

## QA location clarification

- 2026-09-14 — QA xác nhận top-bar `PaComms` không cần cho ticket này.
- Provenance: tester-provided clue qua conversation.
- Tác động: bỏ blocker về quyền top-bar `PaComms`; giữ observation cũ làm lịch sử rejected path.

## Corrected route scan

**Observed:** 2026-09-14T02:20:37Z
**Role:** `Blinx Deployment`
**Scope:** Fresh bounded read-only scan sau khi QA loại top-bar `PaComms`

- Expanded sidebar có module `Comms Hub` riêng, khác top-bar `PaComms`.
- Chọn sidebar `Comms Hub` mở submenu `Template Manager`, `Campaign Manager`, `Patient Manager` mà không mutation.
- Chọn `Campaign Manager` điều hướng sang external app tại `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/login?loggedout=true&msg=error-at-axios-interceptor`.
- External app hiển thị login; Paco authentication không tạo valid Comms Hub session trong lần điều hướng này.
- Không nhập credential, không tạo campaign và không thực hiện mutation.

## Super Admin GB validation

**Observed:** 2026-09-15T15:02:44Z
**Role:** `Super Admin GB`
**Scope:** Resume route read-only với external Comms Hub authentication được tester xác nhận valid
**Additional budget:** 2 meaningful views

- External Comms Hub home mở tại `/commshub/`; heading `Communications Hub` và context `General Practice (Blinx Demo Site)` hiển thị.
- Route `Comms Hub` → `Campaign Manager` mở `/commshub/campaign-manager` thành công.
- `Campaign Manager` hiển thị các control `Create Campaign`, `Campaign Outbox`, `Reset Column Widths`, `Show All Columns`, `Clear Filters`.
- Không dùng `Create Campaign`, không chọn campaign, không gửi dữ liệu và không có mutation.
- Lần thử mở `Campaign Outbox` bị `Blocked` vì control không còn tồn tại sau khi page state tải xong; chưa xác minh được `Outbox` detail.

## Evidence bổ sung

- `test-results/PAC2-6540/locate/20260915T000000Z/PAC2-6540-LOCATE-campaign-manager-20260915T000000Z.png` — local raw evidence; `dev`; `Super Admin GB`; cần review/redact trước khi chia sẻ.

## Campaign Outbox validation

**Observed:** 2026-09-15T15:08:45Z
**Role:** `Super Admin GB`
**Environment:** `dev`
**Scope:** Fresh bounded read-only validation
**Budget:** 3/12 meaningful views

- Context hiển thị `General Practice (Blinx Demo Site) (YGMQJ)`.
- `Campaign Manager` mở tại `/commshub/campaign-manager`.
- Entry `Campaign Outbox` được xác minh visible và enabled qua ancestor `button`; mở thành công `/commshub/campaign-outbox`.
- `Outbox` root hiển thị `Campaigns`, `Campaign Types` và prompt `Select a Campaign to view communication`.
- Không chọn campaign vì hành động có thể mở dữ liệu bệnh nhân/message; không dùng `Create Campaign`, không gửi dữ liệu và không có mutation.

## Evidence bổ sung

- `test-results/PAC2-6540/locate/20260915T151000Z/PAC2-6540-LOCATE-campaign-outbox-20260915T151000Z.png` — local raw evidence; `dev`; `Super Admin GB`; cần review/redact trước khi chia sẻ.

## Blockers and next action

- Không còn blocker cho route tới `Campaign Outbox` root.
- Route status: `Confirmed`.
- Next action: chuyển sang `EXPLORE` read-only để xác định campaign phù hợp. Dừng trước chọn campaign nếu chưa xác nhận data context và quyền xem patient/message data.

## Tester notes

[Protected area]
