---
name: exploration
description: EXPLORE outcome cho PAC2-7727 - defect verification trên dev hiện tại
metadata:
  type: ticket
  input_revision: 1
  phase: EXPLORE
  mode: observe
  environment: dev
  role: clinic
  timestamp: 2026-10-16T12:39:00Z
---

# Exploration: PAC2-7727

**Input Revision:** 1
**Phase:** EXPLORE
**Mode:** observe
**Environment:** dev (`blinx.dev.blinxpaco-np.com` + `dev.blinxscheduler-np.com`)
**Role:** clinic (Johnny Bravo - Blinx Deployment, GP Demo Site)
**Timestamp:** 2026-10-16T12:39:00Z

## Scope

- Verify PACO Configuration > Patient > DFD entry path on dev hiện tại
- Verify scheduler base behavior trên `dev.blinxscheduler-np.com` để characterize defect
- Không có JWT token thật để reproduce chính xác `Link Error / No token found` từ video Fiona

## Observed Behavior

### O-1: DFD Config page loads đúng entry từ feature-map
- Sidebar `Configuration` → submenu `Patient` → item `DFD` (treeitem id `PATIENT_CONFIG_DFD_CONFIG`) → loads `https://blinx.dev.blinxpaco-np.com/configuration/#dfd-config`
- Page render org-chart của các campaign DFD đã tạo (PACO DFD Demo, MAR GB Copy Test, Alex & Mike Test, v.v.)
- Mỗi campaign có 1 button `+` (class `org-chart__add`) — click mở menu với 2 options: `Campaign` (thêm sub-campaign) hoặc `Button` (thêm button action)
- **Không quan sát được button "Copy DFD link" rõ ràng ở level root campaign.** Memory `paco-scheduler-booking-link-flow` mô tả flow `Configuration → DFD Config → Copy DFD link` nhưng không thấy button copy trong state hiện tại.
- Network requests tới `nhs-comms-hub-be-dev.blinxhealthcare.com/CommsHub/Campaigns/getCampaignsByType` xác nhận page gọi Comms Hub backend.

### O-2: Scheduler base URL không có token → render Welcome page (KHÔNG phải Link Error)
- Mở `https://dev.blinxscheduler-np.com/patient-self-booking/` (không có token) → heading `Welcome to the General Practice (Demo Site) Digital Front Door`
- Button `Get started!` → list services (`PACO DEMO DFD`, `Blinx Surgery`)
- Click `PACO DEMO DFD` → list sub-services (`I need help with a Medical Query`, `Medication Queries`, v.v.)
- Có popup "Configurable Patient Popups" (info banner có thể đóng) — feature mới của PACO Connect.

**Implication:** `Link Error / "No token found"` chỉ trigger khi URL có token nhưng parse/validate fail. Workflow file `patient-facing-scheduler.md` đã ghi nhận: "Mở route feature branch không có token → trang `Link Error`" (PAC2-1805) — đây là route dạng `feature-branch/<branch>/patient-self-booking/`, khác với `patient-self-booking/` root.

### O-3: Không thể reproduce defect từ video Fiona do thiếu JWT token
- Video Fiona 2026-08-19 show link đầy đủ `dev.blinxscheduler-np.com/patient-self-booking/#eyJhbG...` (JWT trong fragment)
- Dev hiện tại (2026-10-16) không có workflow tự động generate JWT token cho patient test
- Cần Comms Hub campaign + patient + send link workflow để có token thật → ngoài scope observe read-only

### O-5: Entry "Copy DFD link" found ở page-level 3-dot menu (resolved OQ-039, 2026-10-16)
- Entry không ở level node card như đã quan sát trước đó. Có 1 ellipsis icon ở `<svg data-icon="ellipsis">` đặt tại `absolute right-[25px] top-[17px]` của page container DFD Config.
- Click ellipsis → `p-overlaypanel` mở với 2 items: `Copy DFD link` và `Copy to Care Navigator`.
- Click `Copy DFD link` → copy URL `https://dev.blinxscheduler-np.com/patient-self-booking/#<jwt>` vào clipboard.
- Verify ngày 2026-10-16 với campaign `MAR GB Copy Test` (DevBlDeploy, GP Demo Site). URL generated: `https://dev.blinxscheduler-np.com/patient-self-booking/#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdGlkIjoiezEwZDdhNGI1LTg0NGMtNDUxMS1iMDgyLWExODg2NDNlYzkyMH0ifQ.XEGjrGVpa6V6Qi5U3xlOJKv1gx4qEABpm5GEX0-kxAw`
- JWT payload decode: `otId: "{10d74a45-844c-4511-b082-a18864ec920}"` (organization ID) → **organization-level DFD link** (PACO Connect entry, không có patient pre-fill). Khác với video Fiona (link có patient context trong JWT).
- Mở link org-level này trong incognito → load `Welcome` page, click `Get started!` → list services `PACO DEMO DFD` / `Blinx Surgery`. KHÔNG gặp `Link Error` (TC-002 Pass).
- Để reproduce defect transition `Link Error / No token found` cần **patient-level link** (có patient ID trong JWT, từ Comms Hub Outbox `Resend` hoặc patient self-booking send) → vẫn cần Super Admin GB account (OQ-040).

### O-4: Comms Hub requires Super Admin GB role, clinic role không đủ (2026-10-16 retry)
- Click sidebar `Quick Send` trong PACO (clinic role) → không navigate, không mở dialog. Có thể Quick Send launcher route bị ẩn cho role này.
- Navigate trực tiếp `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-outbox` → redirect về `commshub/login?loggedout=true&msg=error-at-axios-interceptor`.
- Click `Sign In` → redirect tới Microsoft Azure SAML2 SSO (`login.microsoftonline.com/...saml2?...`) — yêu cầu user đã có trong Azure AD với role phù hợp (Super Admin GB theo feature-map).
- PACO clinic role `blinx_johnny.bravo` (Blinx Deployment) KHÔNG đủ quyền vào Comms Hub. Cần user Super Admin GB riêng để access.
- **Workaround candidates** (chưa verify):
  1. Switch role trong PACO tới user Super Admin GB (cần account riêng)
  2. Tìm booking link trong dev environment thông qua cách khác (vd: Comms Hub API call trực tiếp nếu có endpoint generate, hoặc patient test device có sẵn link)
  3. Skip TC-002..005 trong session này, tập trung TC-001 (DFD entry) + TC-006 (process gate) + report ticket Blocked với OQ-039 + new OQ về role gap

## Unperformed Actions

- Generate booking link cho patient cụ thể (cần mutation: tạo campaign/button mới trong DFD Config hoặc gửi link từ Comms Hub)
- Mở booking link có JWT token hợp lệ
- Reproduce `Link Error / No token found` page trên dev hiện tại
- Access Comms Hub Outbox (cần Super Admin GB role, không có trong session này)
- Click sidebar `Quick Send` launcher (không trigger navigation cho clinic role)

## Possible Defect

- **D-1 (mở rộng từ video):** Booking link có JWT hợp lệ vẫn có thể bị `Link Error` tại transition scheduler → web form. Nguyên nhân có thể:
  - JWT token validation quá strict (reject valid token do encoding/timing)
  - Hash fragment parsing issue (token trong `#eyJ...` không được đọc đúng)
  - Routing race condition giữa scheduler page và web form page
- Cần `MANUAL_EXECUTE` với test data mới (QA-AUTO prefix) + Comms Hub workflow để verify.

## Suggested Coverage

- Generate booking link mới với patient test QA-AUTO → mở trong incognito 3 lần liên tiếp để check intermittent
- Capture Network/Console log khi gặp `Link Error` để xác định token validation endpoint fail
- Test trên nhiều browser (Chrome/Firefox/Safari) để check cross-browser parser
- Test với link từ Comms Hub Outbox `Resend` vs link từ DFD Config trực tiếp

## Ticket Knowledge Sync

Cập nhật tại:
- `docs/product/feature-map.md` (đã sync ở LOCATE — Patient DFD Config module)
- `docs/product/workflows/patient-facing-scheduler.md` (cần thêm section `## Logic từ ticket` cho PAC2-7727)
- `docs/product/open-questions.md` (thêm OQ mới: entry "Copy DFD link" không tìm thấy trong DFD Config hiện tại)
- `docs/product/change-log.md` (ghi nhận observe 2026-10-16)

## Outcome

- `outcome`: completed (exploration extended with O-4 role gap)
- `confidence`: medium
- `mode`: observe
- `mutation`: None (read-only)
- `next_action`: report `Blocked` cho TC-002..005; chạy TC-001 + TC-006 nếu feasible; cần QA hỗ trợ Super Admin GB account hoặc patient device có scheduler link thật
- `blockers`:
  1. OQ-039: entry "Copy DFD link" không tìm thấy trong DFD Config
  2. OQ-040 (new): Comms Hub SSO yêu cầu Super Admin GB role, clinic role `blinx_johnny.bravo` không đủ
  3. Cần JWT token thật để reproduce defect transition (vẫn chưa có)

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
