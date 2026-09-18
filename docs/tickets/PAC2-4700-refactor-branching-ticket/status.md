# Ticket Status: PAC2-4700

**Input Revision:** 1
**Current Phase:** EXECUTE
**Last Completed Phase:** TEST_DESIGN
**Updated:** 2026-09-18T00:00:00+07:00

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
- Mutation class `None`; không chọn template, search/filter/toggle, export, chọn appointment, mở patient, click config section, compose/send/attach/submit hoặc chạy branch song song.
- `TEST_DESIGN`: reconcile `test-cases.md` (đã tồn tại từ phiên trước ngoài orchestrator) + bổ sung TC-006..TC-011 từ session EXECUTE 2026-09-18 (Quick Send, patient Michael Ramella NHS 70986, base dev vs branch `pac2-4700-qs-only`).
- `EXECUTE` (base dev vs branch, patient chung cả 2 môi trường):
  - TC-006 Campaign sort A-Z: **Pass**, base và branch khớp nhau (chỉ khác data volume).
  - TC-007 Header DOB: **Inconclusive** — base hiện `Unknown` 2/3 lần mở, branch đúng 2/2 lần; có vẻ race condition, cần sample thêm.
  - TC-008 Patient Reply icon: **Fail cả base và branch** — click nhảy sang tab Health Forms; bug pre-existing, không phải regression riêng branch.
  - TC-009 Save Campaign: **Pass trên base** (mở dialog Save as New/Update existing đúng), **Fail trên branch** (icon disabled, không mở dialog) — regression candidate P1, cần re-verify + dev điều tra.
  - TC-011 Contact Details Add/Delete Number: **Pass trên base** — thêm số test `07700900123` (mutation Persistent), verify Save thành công, sau đó revert về số gốc `07379060817` và xác nhận qua search fresh (server-side) không còn leftover; chưa test branch.
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
- TC-009 (Save disabled trên branch) mới chỉ verify 1 lần; cần re-verify lần 2 trước khi báo chính thức là regression.
- TC-011, TC-014, TC-015, TC-016 chưa test trên branch để xác nhận pre-existing hay regression.
- TC-007 (Header DOB Unknown) cần sample nhiều lần hơn (>3) để xác nhận tỉ lệ tái lập trước khi kết luận là bug hay noise.
- TC-012 ("Search all tabs" không filter) và TC-013 (Escape đóng cả dialog) cần dev/BA xác nhận trước khi coi là bug chính thức.

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
- `feature-location.md` (`6e000bda50ded6c772df8d8a81a83c7e760d53da2e6707077b1a5ad5fe2c6610`)
- `exploration.md` (`d11a03256d45c828bc64579cfb5747621a4c7ee7dae38b57e9bb2beac7164ea7`, GP + PACO OS + PACO Connect checkpoint partial)
- `test-cases.md` (`7ddf93f13b4d68af1a08af689b1f704493c6ecfafd9d504ef6388c535544be6f`, TC-001..TC-016)
- `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`

## Stale Artifacts

- Không có

## Next Action

`EXPLORE` (3 app landing surfaces) vẫn giữ nguyên trạng thái cũ (Inconclusive, chờ route clue cho Booking Links/EMIS trên Connect). Song song, `TEST_DESIGN`/`EXECUTE` đã có tiến triển mới qua Quick Send testing (base dev vs branch `pac2-4700-qs-only`). Bước kế tiếp:
1. Re-verify TC-009 (Save Campaign disabled trên branch) lần 2 trước khi báo chính thức là regression.
2. Test TC-011, TC-014, TC-015, TC-016 (Contact Details, Copy to Email/Templates/Button/Resources, Significant Info) trên branch để so sánh với base.
3. Sample thêm TC-007 (Header DOB) để xác nhận tỉ lệ tái lập.
4. Vẫn cần tester/QA/BA route clue cho Booking Links/EMIS trên Connect để đóng EXPLORE.
Không chọn template, export, chọn appointment, mở patient (ngoại trừ patient test đã chỉ định), click config section nếu chưa xác minh action là pure read-only; mọi mutation Persistent phải cleanup và verify server-side như đã làm với TC-011.

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

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
