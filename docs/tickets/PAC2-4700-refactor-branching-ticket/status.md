# Ticket Status: PAC2-4700

**Input Revision:** 1
**Current Phase:** EXECUTE
**Last Completed Phase:** TEST_DESIGN
**Updated:** 2026-09-18T21:00:00+07:00

## Progress

| Phase | Status | Outcome | Updated |
|---|---|---|---|
| DISCOVER | completed | completed | 2026-09-17T18:14:18+07:00 |
| INGEST | completed | completed | 2026-09-17T18:14:18+07:00 |
| ANALYZE | completed | completed_with_warnings | 2026-09-17T18:30:00+07:00 |
| LOCATE | inconclusive | inconclusive | 2026-09-17T18:52:50+07:00 |
| EXPLORE | in_progress | inconclusive | 2026-09-17T20:00:21+07:00 |
| TEST_DESIGN | completed | completed_with_warnings | 2026-09-18T00:00:00+07:00 |
| AUTOMATION_REVIEW | pending | - | - |
| AUTOMATE | pending | - | - |
| EXECUTE | in_progress | completed_with_warnings | 2026-09-18T00:00:00+07:00 |
| REPORT | pending | - | - |
| COMPLETE | pending | - | - |

## Completed Work

- Đã chọn duy nhất ticket `PAC2-4700-refactor-branching-ticket`.
- Revision 1 = source SHA-256 `9464263c8ce5ef24265ceba2124eacb9221698354cd2fce938f318a084724c20`.
- Scope: OS/24, Connect, GP trên feature branch `pac2-4700-qs-only`.
- `ANALYZE`: 15 REQ (4 Confirmed, 11 Inferred; 2 Disputed), 12 Open Questions.
- `LOCATE`: read-only, role `Super Admin GB`, cả 3 app đã auth; 12/12 meaningful views.
- GP landing đã xác minh: `Scheduler Configuration` → `Select Campaign Template`, có template type `Email`/`SMS`.
- Supporting candidates: OS `Patient Search`, `Health Form Templates`, `Configuration`; Connect `Appointment Book`.
- `EXPLORE` GP checkpoint hoàn tất read-only: `Scheduler Configuration` render landmark `SCHEDULER CONFIG`, một enabled/collapsed campaign-template `combobox`, chưa có selected value; không thấy `Open` trước selection.
- `EXPLORE` PACO OS / PACO 24 checkpoint hoàn tất read-only: `Health Form Templates`, `Patient Search (78,780)` và `Configuration` đều HTTP `200`, render landmark và không horizontal overflow tại 1280×720.
- PACO OS `Patient Search` có 52 table rows trong DOM; structured evidence không lưu patient values. `Configuration` hiện các section links nhưng `Appointment Books` href trỏ lại landing route, nên không click client-side section.
- PACO Connect checkpoint hoàn tất read-only: `Dashboard` và `Appointment Book` HTTP `200`, hết `Loading` khoảng sample 15 giây và giữ stable tới 30 giây; direct `/booking-links` trả HTTP `200` nhưng render app-level `404 Page Not Found`.
- Bounded Connect DOM/navigation scan: không semantic entry/route hint cho `Booking Links`/`EMIS`/`Slot Type`; semantic popup duy nhất `Accessibility Menu`; không click unlabeled controls.
- LOCATE/EXPLORE ban đầu có mutation class `None`. EXECUTE sau đó có approved campaign selection và local draft edit; không click `Save`, send/schedule/update/delete/upload, page đóng nên không persist.
- `TEST_DESIGN`: reconcile `test-cases.md` (đã tồn tại từ phiên trước ngoài orchestrator) + bổ sung TC-006..TC-011 từ session EXECUTE 2026-09-18 (Quick Send, patient Michael Ramella NHS 70986, base dev vs branch `pac2-4700-qs-only`).
- `EXECUTE` (base dev vs branch, patient chung cả 2 môi trường):
  - TC-006 Campaign sort A-Z: **Pass trên base và OS branch**; fresh branch assertion kiểm toàn bộ visible tree theo alphabet.
  - TC-007 Header DOB: **Observed defect trên base** — sample mới 8/8 lần hiện `Unknown (Unknown)`, tổng 10/11 lần; branch sample cũ chưa đủ để kết luận parity.
  - TC-008 Patient Reply icon: **Observed cả base và branch** — click nhảy sang tab `Health Forms`; workaround tester là mở trực tiếp tab `Health Forms`.
  - TC-009 Save Campaign: điều kiện enable đã **Observed trên OS branch** — `Save` disabled ở initial/campaign-selection state, enabled sau `Edit` + local SMS draft change. Không click `Save`; chưa có same-state base parity.
  - TC-011 Contact Details Number: **Pass trên base và OS branch** — branch dropdown có `+ Add new number`, modal `Enter Number` mở và `Cancel`; không mutation.
  - TC-014 Email dropdown: **Pass trên base và OS branch** — branch dropdown có `+ Add new email`, modal `Enter Email` mở và `Cancel`; không mutation.
  - TC-015 compose controls: **Pass trên OS branch** (`Resources`, `Button`, `Templates`, `Copy to SMS`).
  - TC-016 Significant Info: **Pass trên OS branch** (`View Patient Details`, `Significant Info`, 9 categories).
  - OS branch route confirmed: `/paco/feature-branch/pac2-4700-qs-only/dashboard`. Connect branch có cùng flow: `Dashboard` → global `Search...` → patient result → PACO OS patient profile → `Patient actions` → `Quick Send`.
- Booking Link tab: re-test base sau khi đợi đủ lâu (~15-20s) — **Pass**, không có khác biệt thật với branch (lần đầu bị stuck loading do chưa đợi đủ).
- Session tiếp theo (base dev, cùng patient), bổ sung TC-012..TC-016:
  - TC-012 "Search all tabs..." trong Patient Information: **Fail** — gõ "blood" không filter/highlight gì.
  - TC-013 Escape đóng cả dialog Quick Send (thay vì chỉ đóng dropdown Merge Fields): **Observed**, rủi ro mất draft.
  - TC-014 Email dropdown (Contact Details): **Pass** (UI only) — có list email cũ + trash icon + modal "Enter Email", đã Cancel không mutation.
  - TC-015 Campaign compose extras (Merge Fields, Copy to Email, Button Builder, Email Templates Library, Resources): **Pass** — tất cả hoạt động đúng, không mutation.
  - TC-016 Significant Info sweep toàn category: **Pass** — Allergies và Test Results có data thật, các mục còn lại rỗng.

## Warnings & Blockers

- Ticket Outcome placeholder; AC rộng/refactor-style.
- Media: `IMG-05` thiếu; VID-01..04 chưa transcribe.
- Route status chỉ `Candidate`: ticket multi-area, chưa có một feature root chung.
- GP direct `/appointment-book` và `/booking-links` trả `404 Not Found`.
- Connect direct `/booking-links` đã load: HTTP `200` nhưng render app-level `404 Page Not Found`; exact feature entry path vẫn chưa locate.
- OS `Patient Search` live state đổi từ `(0)` lúc LOCATE sang `(78,780)` lúc EXPLORE; có result nhưng chưa mở profile, `Attachments` hoặc email dialog vì chọn row chưa được xác minh là pure read-only transition.
- Comms Hub cần manual login riêng.
- LOCATE đã chạm ceiling 12/12 views; không scan thêm.
- GP initial render có transient incomplete state kèm resource `404` và `remoteEntry.js` MIME mismatch; state sau render ổn định. Chưa đủ evidence kết luận functional failure.
- Deeper GP behavior bị chặn tại safety boundary: chọn template hoặc click `Open` chưa được xác nhận là non-persistent.
- Cả ba PACO OS route có console resource `404` nhưng vẫn render landmark và không có page error; chưa đủ evidence kết luận functional defect.
- PACO OS text inputs không có accessible label do detector tìm thấy; cần manual accessible-name review trước kết luận accessibility defect.
- Cross-app parity chưa kết luận vì ba app mới được quan sát tại các landing surface khác nhau; chưa có cùng state/behavior để so sánh.
- PACO Connect `Dashboard` và `Appointment Book` cần khoảng 15 giây để hết `Loading`; fixed short wait tạo incomplete observation.
- Bounded Connect DOM/navigation scan không tìm thấy semantic `Booking Links`/`EMIS`/`Slot Type` entry; unlabeled buttons không được click vì intent/persistence chưa rõ.
- TC-009 đã xác định điều kiện enable trên OS branch: `Edit` + local SMS draft change làm `Save` enabled. Chưa có same-state base run nên parity vẫn `Inconclusive`; không click `Save`.
- TC-006, TC-011, TC-014, TC-015 và TC-016 đều `Pass` trên OS branch; blockers cũ do locator/wait sai.
- TC-007 đã đủ sample base để ghi nhận defect `Observed` (10/11 lần); vẫn thiếu branch sample tương đương để kết luận parity.
- TC-008 chuyển sang `Health Forms`; workaround là mở trực tiếp tab `Health Forms`. TC-012 no-op đã Confirmed (`10 → 10`, 0 highlight) nhưng expected product basis còn thiếu. TC-013 được tester chấp nhận là behavior bình thường.
- EMIS slot mapping giữ `Inconclusive`: đã select approved campaign `Tower House Practice - New Online Booking!`; thấy `scheduler_link`/`Booking Link` nhưng không thấy `EMIS`, `slot` hoặc `slot type`.
- Repo-wide `npm run type-check` trước đó fail bởi lỗi ngoài phạm vi trong `survey-super-admin.spec.ts` và scripts; không có lỗi từ file PAC2-4700 trong output.

## Feature Location

- Status: Candidate / inconclusive
- Exact candidate: GP `https://pac2-4700-qs-only.dev.blinxpaco-np.com/feature-branch/pac2-4700-qs-only/configuration/`
- Landmark: `SCHEDULER CONFIG` → `Select Campaign Template`
- Other candidates: OS `patient-search`, `health-forms`, `configuration`; Connect `appointment-book`
- Budget: 12/12 views; 15/15 elapsed minutes

## Valid Artifacts

- `manifest.yaml`
- `status.md`
- `requirements.md` (`15ef5b7e253f238bb6b546e3bca6f8ebc09057f666007d69054f6cf37f92951a`)
- `feature-location.md` (`8129157e8f2ecead3755a5cf2bf7d3c8f25778e89076ae8ec70036bf72163368`)
- `exploration.md` (`33492fc7ae9afd0470f98d57da148ee19fba0af8027a800cf772795b309a7704`, GP + PACO OS + PACO Connect checkpoint partial)
- `test-cases.md` (`05f63adbc59113e1f95b659339c7d555be2fa01e7cb8a7bc4a7f95147e75f7d1`, TC-001..TC-016)
- `automation.md` (đã cập nhật run evidence 2026-09-19; checksum manifest cần orchestrator reconcile)
- `evidence/README.md` và `evidence/20260919-*.png` (`IMG-01`..`IMG-08`; mô tả claim/provenance kèm từng ảnh)
- `playwright/tests/tickets/PAC2-4700-readonly.spec.ts` (`44887d80768944cb393a27fc9aacb090f91dc3fa74d4a71772d600139256639f`)
- `test-results/PAC2-4700/execute/20260918-branch-readonly-parity-corrected/summary.json` (`713e345b9071027ec7bd5572d1719faa8eb83f0ac0a1970feda8983714ac9f13`)

## Stale Artifacts

- Không có

## Next Action

`EXECUTE` còn mở vì hai điểm chưa kết luận:
1. Chạy same-state local SMS edit trên base để so sánh TC-009 parity; không click `Save`.
2. Cần campaign/context đã biết có EMIS slot mapping để kiểm mapped slot rendering.
3. TC-012 no-op đã Confirmed nhưng cần product basis trước khi phân loại business result.
Vẫn cần tester/QA/BA route clue cho Booking Links/EMIS trên Connect. Không export, appointment, `Save`, `Send Now`, `Schedule`, update, delete hoặc upload khi chưa có approval/safety proof.

## Checkpoint History

- 2026-09-17T18:14:18+07:00 — `DISCOVER` completed; folder resolved; scope 3 apps.
- 2026-09-17T18:14:18+07:00 — `INGEST` completed; source SHA-256 `9464263c8ce5…`.
- 2026-09-17T18:30:00+07:00 — `ANALYZE` completed_with_warnings; `requirements.md` created.
- 2026-09-17T18:52:50+07:00 — `LOCATE` inconclusive; GP auth confirmed; Scheduler Configuration candidate found; budget 12/12.
- 2026-09-17T19:29:05+07:00 — `EXPLORE` inconclusive checkpoint; GP read-only observation complete, mutation `None`; OS/Connect deferred for sequential execution.
- 2026-09-17T19:38:02+07:00 — `EXPLORE` inconclusive checkpoint; PACO OS / PACO 24 read-only observation complete, mutation `None`; Connect deferred for sequential execution.
- 2026-09-17T19:51:11+07:00 — `EXPLORE` inconclusive checkpoint; PACO Connect read-only observation complete, mutation `None`; `Dashboard`/`Appointment Book` stable, direct `/booking-links` app-level `404`.
- 2026-09-17T20:00:21+07:00 — `EXPLORE` inconclusive checkpoint; Connect bounded DOM/navigation scan complete, mutation `None`; no semantic `Booking Links`/`EMIS`/`Slot Type` entry; only `Accessibility Menu`.
- 2026-09-18T00:00:00+07:00 — `TEST_DESIGN` completed_with_warnings; reconciled `test-cases.md`, added TC-006..TC-011.
- 2026-09-18T00:00:00+07:00 — `EXECUTE` in_progress checkpoint; Quick Send base-vs-branch testing (patient Michael Ramella NHS 70986); mutation Persistent duy nhất (thêm/xóa test phone number) đã cleanup và verify server-side; 1 regression candidate (TC-009 Save disabled trên branch) cần re-verify.
- 2026-09-18T00:00:00+07:00 — `EXECUTE` in_progress checkpoint tiếp theo; bổ sung TC-012..TC-016 (Search all tabs, Escape behavior, Email dropdown, Campaign compose extras, Significant Info sweep) trên base dev; phát hiện 2 bug mới (Search all tabs không filter; Escape đóng cả dialog); mutation `None` (mọi modal đều Cancel).
- 2026-09-18T20:10:00+07:00 — `EXECUTE` in_progress checkpoint; OS branch route corrected và Quick Send reachable; TC-015/TC-016 `Pass`, TC-011/TC-014/TC-006 `Blocked`, TC-009/EMIS `Inconclusive`; mutation `None`; protected notes giữ nguyên.
- 2026-09-18T21:00:00+07:00 — `EXECUTE` in_progress checkpoint; fresh OS branch suite TC-006/011/014/015/016 `Pass` (`5/5`); TC-009 local edit làm `Save` enabled nhưng không persist; approved Tower House campaign không expose EMIS mapping; TC-008 workaround, TC-012 no-op và TC-013 tester decision đã reconcile; protected notes giữ nguyên.
- 2026-09-18T23:45:00+07:00 — `EXECUTE` in_progress checkpoint; BASE-OS standard suite STD-01..10 bằng direct Playwright plugin: sau mutation follow-up `Pass` 8, `Fail` 1 (DOB `Unknown (Unknown)`), `Blocked` 1 (STD-09); STD-05 test number đã create/delete và verify cleanup; STD-06 Health Form đã add/remove local; không `Send Now`/`Schedule`, không known leftover; protected notes giữ nguyên.
- 2026-09-19T00:15:00+07:00 — `EXECUTE` in_progress checkpoint; STD-09 hoàn tất `Pass`: tạo campaign duy nhất `QA-PAC2-4700-20260919-0001` (`campaignId=56448`, `smsId=11156`), verify trong Quick Send picker, xóa vĩnh viễn qua Comms Hub `Campaign Manager`, reload/reopen PACO và verify marker absent. BASE-OS tổng `Pass` 9, `Fail` 1, `Blocked` 0; không `Send Now`/`Schedule`, không known leftover; protected notes giữ nguyên.
- 2026-09-19T00:30:00+07:00 — `EXECUTE` in_progress checkpoint; BRANCH-OS STD-01..10 hoàn tất `Pass` 9, `Fail` 1 (DOB `Unknown (Unknown)` parity với base), `Blocked` 0. STD-05 tạo/xóa `07700901947`; STD-06 add/remove Health Form local; STD-09 tạo/xóa `QA-PAC2-4700-BRANCH-OS-CAMPAIGN-20260919`, reload/reopen verify absent. Không `Send Now`/`Schedule`, không known leftover; protected notes giữ nguyên.
- 2026-09-19T01:11:00+07:00 — `EXECUTE` in_progress checkpoint; BRANCH-CONNECT STD-01..10 hoàn tất `Pass` 9, `Fail` 1 (DOB `Unknown (Unknown)` parity). Flow Connect Dashboard search → PACO OS patient profile → Quick Send. STD-05 tạo/xóa `07700901963`; STD-09 retry sau transient `ERR_NETWORK_CHANGED`, tạo/xóa `QA-PAC2-4700-CONNECT-CAMPAIGN-20260919`, reload/reopen verify absent. Không `Send Now`/`Schedule`, không known leftover; protected notes giữ nguyên.
- 2026-09-19T01:31:00+07:00 — `EXECUTE` in_progress checkpoint; BRANCH-GP STD-01..10 từ root Dashboard hoàn tất `Pass` 10, `Fail` 0, `Blocked` 0. Quick Send mở qua embedded patient action, không vào `patient-profile/...`; DOB đúng `15/03/2024 (2 years old)`. STD-05 tạo/xóa `07700901984`; STD-06 add/remove `17 jul test by mw`; STD-09 tạo HTTP `200`, verify rồi xóa `QA-PAC2-4700-GP-CAMPAIGN-20260919`; reload/reopen xác minh mọi marker absent. Không `Send Now`/`Schedule`, không known leftover; protected notes giữ nguyên.
- 2026-09-19T01:43:00+07:00 — `EXECUTE` follow-up: CONNECT STD-06 chạy trực tiếp từ Dashboard embedded patient action, add/remove `17 jul test by mw` và cleanup verified; GP STD-06 tương tự, badge tăng `1` rồi cleanup. BASE TC-009 same-state local SMS edit làm `Save` enabled, parity với OS branch; khôi phục content, không persist. STD-08 đổi sang assertion observable `Booking Link`: date/time, refresh availability, đủ 4 nhóm slot type, clinician/location, booking notes và confirmation/reminder; bỏ EMIS khỏi test case theo tester decision. Không `Send Now`/`Schedule`; protected notes giữ nguyên.
- 2026-09-19T01:54:00+07:00 — STD-08 four-target parity hoàn tất: BASE-OS, BRANCH-OS, BRANCH-CONNECT và BRANCH-GP đều `Pass`. Mỗi target render đủ required Booking Link controls; unique booking-note marker giữ qua tab switch rồi được clear. Không `Save`, `Send Now`, `Schedule`; không known leftover; protected notes giữ nguyên.
- 2026-09-19T02:02:00+07:00 — Focused behavior parity spot-run: Health Forms load gần ngang nhau (GP `1969ms`, Connect `1942ms`, OS `1990ms`), không tái lập GP slow claim. Files không permaload: GP đạt expected state trong wait ≤5s, Connect `6127ms`, OS `130ms`. Shared patient có email option trên cả target và current campaign đều SMS compose, nên claims Connect/GP thiếu email và OS default Email không tái lập. Sorting, Booking Link alignment, newly-saved campaign timing và Test Results inner scroll chưa đủ controlled evidence; result tổng `Inconclusive (mixed)`. Không mutation/persist; protected notes giữ nguyên.
- 2026-09-19T02:25:00+07:00 — Evidence pass hoàn tất `IMG-01`..`IMG-08`; index và mô tả chi tiết tại `evidence/README.md`. Ảnh phủ OS/Connect/GP `Files`, `Booking Link`, OS compose và GP email state. Connect `Files` loading được ghi là transient, không permaload; GP email option và OS-vs-GP DOB difference có screenshot. Không `Save`, `Send Now`, `Schedule`. Screenshot login chứa credential autofill do session timeout đã xóa ngay; không còn trong evidence set. Protected notes giữ nguyên.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
