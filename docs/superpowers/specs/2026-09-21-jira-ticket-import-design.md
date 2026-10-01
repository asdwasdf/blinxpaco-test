# Thiết kế import Jira ticket qua Edge

- **Ngày:** 2026-09-21
- **Trạng thái:** Chờ người dùng review bản ghi
- **Phạm vi:** Import một Jira issue vào source convention của Paco
- **Jira origin:** `https://blinxsolutions.atlassian.net`

## 1. Mục tiêu

Loại bỏ bước copy/convert Jira ticket thủ công. Khi người dùng gửi Jira issue URL dạng:

```text
https://blinxsolutions.atlassian.net/browse/PAC2-3798
```

Claude hiểu đây là yêu cầu import issue đó vào `ticket/`. Importer mở Microsoft Edge automation, người dùng đăng nhập thủ công trong mỗi session, đọc toàn bộ dữ liệu Jira khả dụng và tạo source ticket tương thích với `paco-ticket`.

Importer chỉ thu thập source. Nó không tự phân tích requirement, chạy workflow QA hoặc thay đổi Jira.

## 2. Phạm vi đã chốt

### 2.1. Input

Hỗ trợ hai cách:

1. Người dùng gửi Jira URL; importer điều hướng tới URL đó.
2. Không truyền URL; người dùng mở issue cần import trong cửa sổ Edge automation trước khi tiếp tục.

URL được chấp nhận phải thuộc configured Jira origin và có route `/browse/<KEY>`.

### 2.2. Dữ liệu cần lấy

Mặc định lấy toàn bộ dữ liệu Jira mà UI và quyền hiện tại cho phép:

- Issue key và URL.
- `Summary` và `Description`.
- `Acceptance Criteria` nếu có.
- Issue type, `Status`, `Priority`, reporter, assignee.
- Labels, components, dates và các visible fields khác.
- Linked issues.
- Toàn bộ comments khả dụng, kèm author và timestamp.
- Attachment metadata và file attachment/video tải được.

`Summary` và `Description` luôn được đặt gần đầu `ticket.md` để có chế độ đọc nhanh. Không suy đoán nội dung bị thiếu hoặc bị ẩn do permission.

### 2.3. Output

Importer tạo đúng một source folder:

```text
ticket/<KEY>-<summary-slug>/
├── ticket.md
└── attachments/
```

Nếu bất kỳ folder nào trong `ticket/` đã dùng cùng ticket key, importer dừng và báo conflict. Nó không merge, overwrite hoặc đổi tên source cũ.

## 3. Giao diện sử dụng

Thêm command:

```bash
npm run jira:import
npm run jira:import -- "https://blinxsolutions.atlassian.net/browse/PAC2-3798"
```

Quy ước Claude:

- Một Jira issue URL từ configured origin được hiểu là yêu cầu tạo source ticket.
- Claude gọi importer cho đúng URL đó.
- Import thành công không tự gọi `paco-ticket`; workflow QA là yêu cầu riêng.

Không cần command login riêng. Mỗi lần import tạo một Edge automation session mới và cho phép người dùng đăng nhập thủ công.

## 4. Luồng import

1. Nếu có URL, validate origin và `/browse/<KEY>` trước khi mở browser.
2. Mở headed Microsoft Edge bằng Playwright `channel: "msedge"` với session tạm thời mới.
3. Điều hướng tới URL nếu được truyền; nếu không, chờ người dùng tự mở issue.
4. Người dùng đăng nhập Jira thủ công, mở đúng issue rồi xác nhận tiếp tục trong terminal.
5. Importer xác minh URL hiện tại, issue key và `Summary`.
6. Mở/expand các vùng read-only cần thiết để đọc toàn bộ fields, comments, linked issues và attachments khả dụng.
7. Chuẩn hóa dữ liệu trong memory; chưa ghi target folder.
8. Tải attachments vào staging folder. Download lỗi không hủy dữ liệu issue; lỗi được ghi theo từng attachment.
9. Render `ticket.md`, kiểm tra path confinement và preview target path.
10. Commit output bằng atomic directory rename từ staging sang target.
11. Đóng browser và in kết quả, field thiếu, field không đọc được, attachment thành công/thất bại.

Toàn bộ thao tác trên Jira là read-only. Download chỉ tạo file local trong source ticket đã được người dùng yêu cầu tạo.

## 5. Định dạng `ticket.md`

```markdown
# PAC2-1234 — Summary

## Jira metadata
- URL:
- Type:
- Status:
- Priority:
- Reporter:
- Assignee:
- Labels:
- Components:
- Created:
- Updated:

## Summary

## Description

## Acceptance criteria

## Fields

## Linked issues

## Comments

## Attachments
- [filename](attachments/filename)

## Import notes
- Imported at:
- Missing/unreadable sections:
- Failed attachments:

## Tester notes
```

Quy tắc:

- Nội dung Jira được giữ gần nguyên bản; chỉ chuẩn hóa sang Markdown.
- Field thực sự rỗng ghi `Not provided`.
- Field không đọc được hoặc không có quyền ghi `Unavailable` cùng lý do nếu biết.
- Comment giữ author và timestamp.
- Attachment link dùng relative path và filename đã sanitize.
- Filename trùng được disambiguate deterministically; không overwrite.
- `## Tester notes` là final protected section, ban đầu rỗng.
- Không biến dữ liệu Jira thành requirement/test case trong bước import.

## 6. Browser và authentication

- Browser: Microsoft Edge headed qua Playwright.
- Mỗi invocation dùng temporary profile/session mới.
- Người dùng nhập credential và hoàn tất SSO/MFA trực tiếp trong Edge.
- Không lưu hoặc reuse authentication state sau khi command kết thúc.
- Không đọc credential, cookie, token hoặc browser storage vào artifact, log hay prompt.
- Importer không kết nối vào Edge profile cá nhân đang chạy và không bật remote debugging cho profile đó.

## 7. Extraction strategy

Ưu tiên semantic locator và nội dung rendered từ UI:

1. Accessible role/name và stable visible labels.
2. Jira semantic regions/attributes ổn định.
3. Scoped CSS fallback khi không có semantic locator.

Importer không gọi Jira REST API bằng credential riêng và không reverse-engineer private API. Các vùng lazy-loaded phải được expand/scroll có giới hạn. Khi không thể chứng minh đã đọc một vùng, importer ghi `Unavailable` thay vì coi nó là rỗng.

Extractor và renderer là các unit tách biệt:

- Browser collector: điều hướng và thu dữ liệu rendered.
- Normalizer: tạo model issue nội bộ, sanitize filename/path.
- Markdown renderer: tạo `ticket.md` thuần từ model.
- Attachment downloader: tải từng file và ghi result.
- Atomic writer: kiểm tra duplicate/conflict, staging và rename.

Không tạo abstraction Jira provider chung khi chỉ có một Jira origin.

## 8. Failure handling

Importer dừng, không tạo target folder khi:

- URL không đúng configured origin/route.
- Chưa đăng nhập hoặc Jira báo không có quyền.
- Không xác định được issue key hoặc `Summary`.
- Ticket key trong URL và trang rendered không khớp.
- Target key đã tồn tại trong `ticket/`.
- Jira DOM thay đổi khiến core issue data không thể đọc tin cậy.
- Atomic writer hoặc path-confinement validation thất bại.

Attachment download failure không hủy import:

- Tiếp tục tải các file còn lại.
- Ghi filename, URL nếu an toàn, trạng thái `Failed` và lý do vào `Import notes`.
- Không tạo file giả.

Khi extraction core thất bại, screenshot chẩn đoán được lưu local dưới `test-results/jira-import/`, không nằm trong ticket source và không chứa browser state. Staging folder được cleanup. Không để output nửa vời.

## 9. Safety và privacy

- Jira interaction là read-only: navigation, expand, scroll và download.
- Không `Create`, `Update`, comment, transition, upload hoặc thay đổi issue.
- Chỉ xử lý đúng một issue do người dùng chỉ định; không scan project hoặc issue khác.
- Không lưu credential, cookie, token, request header hoặc auth state.
- Jira ticket có thể chứa personal/confidential data; importer chỉ ghi dữ liệu cần cho source ticket và không publish ra dịch vụ ngoài.
- Logs tránh in body comment/description và signed attachment URL.
- Temporary browser profile và staging data được cleanup ở cả success lẫn failure.

## 10. Thay đổi project dự kiến

Tối thiểu:

- `scripts/jira-import.ts`: CLI/browser flow.
- `scripts/jira-import-core.ts`: validation, normalized model, rendering và atomic write nếu việc tách file giúp fixture test không cần browser.
- `scripts/tests/jira-import.test.ts`: fixture/self-check.
- `package.json`: script `jira:import`.
- `paco.config.yaml`: Jira origin/path cấu hình không nhạy cảm.
- `CLAUDE.md`: Jira URL trigger và ranh giới import-only.
- `.gitignore`: temporary Jira import diagnostics/profile nếu path hiện tại chưa bao phủ.

Không thêm dependency mới; dùng Playwright, Node.js stdlib và TypeScript hiện có.

## 11. Verification

Fixture tests không kết nối Jira, bao phủ:

- URL origin/route validation.
- Issue key và slug derivation.
- Ticket key mismatch.
- Full issue rendering.
- Minimal issue chỉ có `Summary` và `Description`.
- Missing/unavailable fields.
- Comments và provenance.
- Filename sanitization, duplicate attachment names và traversal rejection.
- Attachment failure vẫn render ticket thành công.
- Duplicate ticket key dừng trước write.
- Staging cleanup và atomic output.
- Final `## Tester notes` section.

Validation chạy:

```bash
npm run type-check
npm run test:fixtures
npm run validate:static
```

Controlled smoke test dùng URL `https://blinxsolutions.atlassian.net/browse/PAC2-3798`. Người dùng đăng nhập thủ công; smoke test chỉ đọc/download. Vì output local `ticket/` sẽ được tạo, chạy smoke test cần xác nhận riêng tại thời điểm thực thi.

## 12. Acceptance criteria

1. Gửi Jira issue URL được hiểu là yêu cầu import source ticket.
2. Importer hỗ trợ URL cụ thể hoặc issue người dùng tự mở trong Edge automation.
3. Mỗi import dùng session mới; không lưu/reuse Jira authentication.
4. Toàn bộ visible fields, comments, linked issues và attachments khả dụng được thu thập hoặc ghi rõ lý do thiếu.
5. Output tuân thủ `ticket/<KEY>-<slug>/ticket.md` và dùng được bởi `paco-ticket`.
6. Folder/key trùng làm importer dừng, không merge hoặc overwrite.
7. Attachment lỗi không làm mất phần ticket đã thu thập.
8. Extraction core hoặc write lỗi không để target folder nửa vời.
9. Không Jira mutation, credential, cookie, token hoặc auth state nào được lưu.
10. Import không tự chạy workflow QA tiếp theo.
11. Fixture tests và project validation pass.

## 13. Ranh giới phê duyệt

Duyệt design này chỉ cho phép chuyển sang lập implementation plan. Nó không tự động cho phép triển khai hoặc chạy smoke import thật. Implementation plan cần được duyệt riêng trước khi sửa code; smoke test với Jira thật cần xác nhận tại thời điểm chạy.
