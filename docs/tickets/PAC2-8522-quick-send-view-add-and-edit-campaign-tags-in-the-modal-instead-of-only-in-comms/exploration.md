# Exploration: PAC2-8522

**Input Revision:** 1
**Environment:** dev feature branch `pac2-8522` + Communications Hub dev
**Role:** `Super Admin GB`
**Observed:** 2026-09-28T14:34:00Z
**Status:** Complete

## Scope

Quan sát read-only route từ test patient đã được tester duyệt tới `Quick Send`, đồng thời dùng attachment để tìm campaign/tag tương ứng trong Communications Hub. Không `Save`, update, delete hoặc send.

## Observations

### OBS-PAC2-8522-001

**Classification:** Observed
**Location/URL:** Paco patient profile, query `qs_campaign_tags=true`
**Action:** Mở sidebar `Quick Send` từ patient context.
**Observed Behavior:** Control `Quick Send` mở menu `Template Manager`, `Campaign Manager`, `Patient Manager`; không tự mở composer/modal. Đây là launcher `Comms Hub`, không phải campaign-selection action.
**Requirement Links:** REQ-PAC2-8522-001, REQ-PAC2-8522-002, REQ-PAC2-8522-003
**Evidence:** Local snapshots `.playwright-mcp/page-2026-09-28T14-20-10-406Z.yml`; screenshot `pac2-8522-qs-flag.png` local-only.
**Sensitive Data Review:** Local-only; patient identifiers không được copy vào artifact.

### OBS-PAC2-8522-002

**Classification:** Observed
**Location/URL:** Communications Hub dev `/commshub/campaign-manager`
**Action:** Đăng nhập thủ công, mở `Campaign Manager`, dùng read-only `Search campaigns` với exact attachment campaign name và substring `updated 2`; mở group `Non-Shared Campaigns`.
**Observed Behavior:** Campaign Manager tải được cho `General Practice (Demo Site)`. Grid có `Non-Shared Campaigns (4114)` và `Shared Campaigns (445)`. Exact/substring search không tạo visible campaign row trong accessibility tree; chỉ group rows còn hiển thị.
**Requirement Links:** REQ-PAC2-8522-003
**Evidence:** Local snapshots `.playwright-mcp/page-2026-09-28T14-23-25-075Z.yml`, `.playwright-mcp/page-2026-09-28T14-23-52-928Z.yml`, `.playwright-mcp/page-2026-09-28T14-24-58-466Z.yml`.
**Sensitive Data Review:** None in recorded claim.

### OBS-PAC2-8522-003

**Classification:** Observed
**Location/URL:** Ticket attachments
**Action:** Review imported images.
**Observed Behavior:** Attachment cung cấp campaign candidate `Test (updated due to duplicate name) updated 2` và hai tag candidates hiển thị rút gọn `[Bootcamp] Mult...`, `[Bootcamp] QOF...`. Attachment còn cho thấy feature-branch query `qs_campaign_tags=true`.
**Requirement Links:** REQ-PAC2-8522-001, REQ-PAC2-8522-003
**Evidence:** `ticket/.../attachments/128292-image-20260926-103032.png`, local-only vì chứa patient data.
**Sensitive Data Review:** Redacted from prose except campaign/tag labels relevant to QA.

### OBS-PAC2-8522-004

**Classification:** Observed
**Location/URL:** Paco patient profile on user-confirmed feature URL
**Action:** Open `Patient actions`, choose `Quick Send`, then open `(click to change)` without selecting another campaign.
**Observed Behavior:** `Patient actions` contains the actual `Quick Send` composer trigger. Modal opens with campaign `Test (updated due to duplicate name) updated 2`. `(click to change)` opens `Select Campaign`; the same campaign exists as the first tree item. Sidebar image `Quick Send` is a separate Comms Hub launcher.
**Requirement Links:** REQ-PAC2-8522-001, REQ-PAC2-8522-002, REQ-PAC2-8522-003
**Evidence:** Local snapshots `.playwright-mcp/page-2026-09-28T14-31-23-235Z.yml`, `.playwright-mcp/page-2026-09-28T14-31-38-371Z.yml`, `.playwright-mcp/page-2026-09-28T14-32-05-811Z.yml`.
**Sensitive Data Review:** Local-only; patient identifiers omitted from reusable route prose.

### OBS-PAC2-8522-005

**Classification:** Observed
**Location/URL:** Quick Send composer on feature branch
**Action:** Reopen composer and inspect selected campaign header without `Save` or send.
**Observed Behavior:** Campaign name is visible, but current render shows no tag chips or adjacent tag edit control. This differs from ticket attachment, where two `[Bootcamp]...` chips and a pencil are visible next to the same campaign name. Query `qs_campaign_tags=true` is present in the browser URL.
**Requirement Links:** REQ-PAC2-8522-001, REQ-PAC2-8522-002, REQ-PAC2-8522-003
**Evidence:** Local snapshot `.playwright-mcp/page-2026-09-28T14-34-00-809Z.yml`; screenshot `pac2-8522-quick-send-dialog.png` local-only; ticket attachment `128292-image-20260926-103032.png`.
**Sensitive Data Review:** Local-only; screenshot contains patient data.

## Mismatches and Possible Defects

- Communications Hub grid search không hiển thị attachment campaign, nhưng Quick Send `Select Campaign` xác nhận campaign vẫn tồn tại; grid search result trước đó không đủ để kết luận campaign thiếu.
- Current feature-branch composer không render tag chips/edit control cho cùng campaign trong khi ticket attachment có hai chips và pencil. Đây là mismatch cần MANUAL_EXECUTE chẩn đoán kỹ; chưa kết luận `Fail` trong EXPLORE.
- Sidebar `Quick Send` là Comms Hub launcher; composer trigger đúng là `Patient actions` → `Quick Send`.

## Actions Not Taken

- Không click `Create Campaign`, `Save`, send, update/delete campaign/tag.
- Không chọn campaign khác vào draft.
- Không thể mở tag editor vì current composer không render chips/pencil.
- Không click `quick-send-action`, `Save`, send, update/delete campaign/tag.

## Suggested Coverage

- Dùng route ổn định: selected patient → `Patient actions` → `Quick Send`.
- Dùng campaign `Test (updated due to duplicate name) updated 2` cho diagnostic baseline; campaign tồn tại trong picker.
- Kiểm tra tag chips, overflow, search existing tag, add/remove/save/cleanup, read-only permission.
- Cross-check persisted tags trong Communications Hub sau manual save.

## Blockers and Open Questions

- Tag chips/edit control vắng trên current composer; MANUAL_EXECUTE phải chạy initial + same data + clean data + fresh session/control path trước khi kết luận.
- Cần tag test hiện có để add/remove nếu editor xuất hiện; `[Bootcamp]...` trong attachment là candidate, không tự tạo tag.
- Read-only/no-permission account chưa có, nên REQ-PAC2-8522-005 có thể `Blocked`.

## Tester notes

