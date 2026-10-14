# PAC2-8700 — Requirements

**Source:** `ticket/PAC2-8700-quick-send-scheduler-link-required-prompt-fires-when-the-link-is-already-in-the/ticket.md`
**SHA-256:** `a733168b19a9edefa71c78ca63b788c40f2fd4aa97e9ea3956c2afb2062f9a68`
**Imported:** 2026-10-05
**Phase:** ANALYZE

## Problem Statement

Popup `Scheduler Link Required` trong `Quick Send` chỉ được phép hiện khi message mang health form, file attachment hoặc booking link mà thiếu `{{{scheduler_link}}}`. Hiện tại popup bị kích hoạt khi link đã có sẵn trong message, và bị kích hoạt lại sau khi user dismiss. Users báo thêm click thừa; trong Health Form inbox, popup không tương tác được và chặn gửi.

**Supersedes:** PAC2-5776 (PR #2495, refactor không chạm root cause, Fail QA)

## Root Causes (from code review on development)

1. Email check đọc live Froala editor — chỉ mounted trên tab `Message`. Trên tab `Health Forms`/`Files`, editor unmounted → fallback về campaign template gốc, bỏ qua mọi edit kể cả link prompt đã insert. Thêm form/file thứ hai → prompt lại.
2. Khi chưa chọn channel nào → fallback về "preview nào đang hiện". Send flags reset trước effects chạy → effects đọc channel cũ từ campaign trước. Template có default health form/booking link → prompt ngay khi load.
3. Popup portalled ra `document.body`, không reset khi đóng. Có thể hiện khi không có `Quick Send` mở (screenshot Beth HF inbox). Z-index 99998 thấp hơn host modal → bị che.
4. Effects keyed trên object identity của templates → mỗi templates query replace object → effects chạy lại → prompt hiện lại dù user đã dismiss.
5. `send-menu onBeforeShow` chỉ check channel đang hiện trên màn, không phải channel thực sự được gửi. 6 copies check dùng nguồn content khác nhau → prompt và send validation disagree.

## Fix Strategy (from PR #2799, branch `PAC2-8700`)

- Một pure function `getMissingSchedulerLinkChannels({ sendEmail, sendSms, emailContent, smsContent })` trong `utils/validateSchedulerLink.ts` với unit tests.
- Chỉ check channel thực sự được gửi. Không channel nào được gửi → không có gì thiếu.
- Mọi trigger site đọc qua `emailContentGetter()` / `smsContentGetterRaw()`.
- Effects re-run trên stable content key (campaign id + template ids + syntax), không phải object identity; cũng re-run khi send flags thay đổi.
- Popup hidden khi Quick Send dialog không visible; reset state khi đóng.
- Z-index raised trên host modals.
- Dismissal remembered cho dependency/channel/content state hiện tại → không reopen cho đến khi có thay đổi relevant.

## Acceptance Criteria (from ticket Description)

| # | Criteria | Notes |
|---|---|---|
| AC-001 | Load saved/favourite template đã có `{{{scheduler_link}}}` (text hoặc button) và mang default health form hoặc booking link → không hiện popup. | Load template trigger |
| AC-002 | Khi email đã có link, thêm second health form hoặc file từ tab `Health Forms`/`Files` → không hiện popup. | Add form/file trigger |
| AC-003 | Chèn link qua popup, rồi thêm form/file → không hiện popup lại. | Dismiss + add trigger |
| AC-004 | Dismiss popup → không mở lại cho đến khi có thay đổi relevant (form, file, booking link, channel, message content). | Dismiss persistence |
| AC-005 | Popup vẫn hiện khi channel được gửi thực sự thiếu link (ví dụ SMS tick và SMS template không có link); `Send` vẫn bị chặn với toast. | False negative prevention |
| AC-006 | Mở Quick Send là follow-up từ Health Form inbox: popup render trên Quick Send modal; không bao giờ hiện khi không có Quick Send mở. | HF inbox z-index |
| AC-007 | Unit tests cover channel logic; component tests cover "link already present" và "link genuinely missing" paths. | Test coverage |

## Atomic Requirements

| ID | Statement | Classification | Basis |
|---|---|---|---|
| REQ-001 | Khi email hoặc SMS channel được tick gửi và content chứa `{{{scheduler_link}}}` merge field, popup `Scheduler Link Required` KHÔNG được kích hoạt. | Inferred | Fix strategy, AC-001/002 |
| REQ-002 | Khi email hoặc SMS channel được tick gửi và content KHÔNG chứa `{{{scheduler_link}}}` merge field, popup phải kích hoạt và `Send` bị chặn với toast. | Inferred | Fix strategy, AC-005 |
| REQ-003 | Popup phải bị ẩn khi Quick Send dialog đóng; state phải reset khi dialog đóng lại. | Inferred | Fix strategy, AC-006 |
| REQ-004 | Dismissed popup chỉ reopen khi có thay đổi relevant trong form attachments, file attachments, booking link, channel selection hoặc message content. | Inferred | Fix strategy, AC-003/004 |
| REQ-005 | Khi mở Quick Send là follow-up từ Health Form inbox, popup render trên cùng layer với hoặc trên Quick Send modal (z-index cao hơn host modal). | Inferred | Fix strategy, AC-006 |
| REQ-006 | Effects kiểm tra scheduler link phải re-run trên stable content key (campaign id + template ids + syntax), không phải object identity của templates object. | Confirmed | PR #2799 description, code root cause analysis |
| REQ-007 | `getMissingSchedulerLinkChannels()` chỉ check các channel thực sự được gửi (`sendEmail`/`sendSms` flags). Nếu không có channel nào được gửi, không có gì bị thiếu. | Confirmed | PR #2799 description |

## Test Scopes (from PR QA steps, inferred)

- **Load template:** Favourite/saved template với `{{{scheduler_link}}}` (text + button) + default health form / booking link.
- **Add form/file:** Email đã có link + thêm second form hoặc file.
- **Insert + add:** Chèn link qua popup → thêm form/file → no re-prompt.
- **Dismiss persistence:** Dismiss → tab switch (Campaign ↔ Health Forms) → no reopen; dismiss → add second form → reopen.
- **Hidden → reopen:** Dialog hidden → reopen → check prompt reappears if channel still missing link.
- **Dismiss → remove → add different:** Dismiss cho form A → remove A → add form B → prompt.
- **Campaign switch:** Dismiss → switch campaign → prompt forgot → fresh check on new template.
- **HF inbox follow-up:** Quick Send từ HF inbox → popup renders above modal.
- **No Quick Send:** Khi dialog đóng → popup biến mất.
- **Genuinely missing:** SMS tick, SMS template không có link → popup + toast blocks Send.

## Known Gaps

- Không có video/recording/screenshot đi kèm ticket.
- PAC2-5776 có recording Quick Send (không chứa popup evidence), chưa link vào PAC2-8700.
- Acceptance Criteria không nằm trong field riêng của Jira (nằm trong Description body).
- Danh sách 7 ticket liên kết chưa được xác định chi tiết.

## Open Questions

- 7 ticket liên kết là những ticket nào? Fix một flow chưa đủ cơ sở đóng cả 7 nếu triệu chứng khác nhau.
- Test data cụ thể: campaign/template nào mang `{{{scheduler_link}}}`? Patient/account nào dùng?
- Fixture cho favourite/saved template: tạo mới hay dùng template có sẵn trên dev?
- Không gian: baseline, OS, Connect, GP? Feature branch là `/paco-connect/feature-branch/pac2-8700`.

## Related

- `workflows/comms-hub.md#popup-scheduler-link-required`
- `workflows/comms-hub.md#quick-send-dialog`
- `feature-map.md` (Quick Send section)
- Supersedes: `PAC2-5776` (requirements.md, exploration.md)
- References: `PAC2-4700` (Quick Send component), `PAC2-8522` (Quick Send tags)
