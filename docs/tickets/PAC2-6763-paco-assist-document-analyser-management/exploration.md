# Exploration: PAC2-6763

**Input Revision:** 1
**Environment:** `https://pac2-6763-send-key.dev.blinxpaco-np.com`
**Role:** `Super Admin GB`
**Observed:** 2026-09-28T12:09:15.800Z
**Status:** Complete

## Scope

Quan sát read-only hai upload entry trên feature branch: patient `Documents` và organisation-level `Document Inbox`. Patient do tester chọn; identity và profile ID không được lưu trong artifact.

## Observations

### OBS-PAC2-6763-001

**Classification:** Observed
**Location/URL:** `/paco/patient-profile/<redacted>/documents`
**Action:** Mở tab `Documents`; không chọn hoặc drop file.
**Observed Behavior:** Khu vực `Upload` hiển thị trực tiếp trong danh sách documents, cạnh checkbox `No review needed`.
**Requirement Links:** REQ-PAC2-6763-017
**Evidence:** Current Claude Playwright plugin observation, 2026-09-28T12:09:15.800Z; reviewed accessibility snapshot, không lưu raw patient data.
**Sensitive Data Review:** Redacted

### OBS-PAC2-6763-002

**Classification:** Observed
**Location/URL:** `/paco/patient-profile/<redacted>/documents`
**Action:** Quan sát trạng thái danh sách hiện tại.
**Observed Behavior:** Danh sách hiển thị `Showing 50/184 documents`; có filters `All`, `Pending`, `Reviewed`, scope `All`/`Mine`, `Sort By`, `Card view`, `List view`, và per-item `Document actions`.
**Requirement Links:** REQ-PAC2-6763-017
**Evidence:** Current Claude Playwright plugin observation, 2026-09-28T12:09:15.800Z; counts/labels retained, names và filenames omitted.
**Sensitive Data Review:** Redacted

### OBS-PAC2-6763-003

**Classification:** Observed
**Location/URL:** `/paco/patient-profile/<redacted>/documents`
**Action:** Quan sát visible document states.
**Observed Behavior:** Existing items expose `Pending` và `Reviewed`; visible status tooltip includes `Not seen`. Đây là baseline hiện tại, chưa phải expected result cho upload mới.
**Requirement Links:** REQ-PAC2-6763-017
**Evidence:** Current Claude Playwright plugin observation, 2026-09-28T12:09:15.800Z; reviewed accessibility snapshot.
**Sensitive Data Review:** Redacted

### OBS-PAC2-6763-004

**Classification:** Observed
**Location/URL:** `/paco/inbox`
**Action:** Mở `Document Inbox`; quan sát board và click `Upload a document` để mở non-persistent dialog, sau đó đóng bằng `Close`.
**Observed Behavior:** Organisation-level inbox hiển thị `31 need attention`, board/list toggle, search, và columns `Analysing` (0), `Needs review` (9), `Ready to file` (22), `Filed & rejected` (29). Existing cards expose states gồm `Match needed`, `Matched 99%`, `Analysed`, `Filed`, `Rejected`.
**Requirement Links:** REQ-PAC2-6763-017
**Evidence:** Current Claude Playwright plugin observation, 2026-09-28T12:15:50Z–12:16:51Z; names và document titles omitted from artifact.
**Sensitive Data Review:** Redacted

### OBS-PAC2-6763-005

**Classification:** Observed
**Location/URL:** `/paco/inbox`
**Action:** Mở dialog `Upload document to inbox`; không chọn file hoặc submit.
**Observed Behavior:** Dialog có file chooser `Choose a document (PDF, image, Word…)`, optional `Source type`, optional `Source name`, `Cancel`, và disabled `Upload & analyse`. `Upload & analyse` chưa enabled khi chưa chọn document.
**Requirement Links:** REQ-PAC2-6763-017
**Evidence:** Current Claude Playwright plugin observation, 2026-09-28T12:16:39.768Z; dialog closed without mutation.
**Sensitive Data Review:** None

## Mismatches and Possible Defects

- Chưa có mismatch kết luận được trong read-only exploration.
- `Upload` xuất hiện dưới dạng visible drop area nhưng accessibility snapshot không expose button/file-input name; automation locator có thể cần native file input hoặc drop-target inspection trong phase generate.
- Console có background errors; chưa có provenance gắn trực tiếp với upload nên không coi là defect.

## Actions Not Taken

- Không click/drop vào patient `Documents` upload area.
- Chỉ mở rồi đóng inbox upload dialog; không chọn file, nhập metadata hoặc click `Upload & analyse`.
- Không đổi `No review needed`.
- Không mở existing document/card actions, không update/delete existing document.
- Không kiểm tra size limit, success toast, created-item state hoặc processing transition vì các bước này cần mutation.

## Suggested Coverage

1. Ưu tiên organisation-level `/paco/inbox` flow theo tester-provided screenshot và exact ticket context: `Upload a document` → safe synthetic document → `Upload & analyse`.
2. Dùng filename unique; optional `Source type`/`Source name` để trống trừ khi test case có basis khác.
3. Ghi baseline counters; sau submit search filename và quan sát transition qua `Analysing`, `Needs review`, hoặc `Ready to file` mà không giả định final state/timing.
4. Kiểm tra patient-level `Documents` upload riêng nếu cần xác minh alternate entry path; không gộp expected result của hai flows.
5. Cleanup only khi card/action cung cấp safe delete/reject path; không file document vào patient record chỉ để cleanup.
6. Automation cần runtime host guard, unique filename, inbox search/state assertion và redacted mutation ledger.

## Blockers and Open Questions

- UI gợi ý accepted categories `PDF, image, Word…`; exact extensions và maximum size vẫn chưa rõ.
- Exact immediate success indicator chưa biết: toast, counter change, card hoặc processing state.
- Cleanup/delete action chưa được xác minh; card actions chưa mở trong read-only exploration.
- Hai upload entries có thể phục vụ flows khác nhau: patient `Documents` upload so với inbox `Upload & analyse`.
- Ticket context và tester screenshot nghiêng về inbox analyser; downstream lifecycle depth cần được test theo observable states, không giả định eventual completion SLA.

## Tester notes

[Protected area]
