# Paco QA Fast Workflow Design

**Date:** 2026-09-19  
**Status:** Approved

## Goal

Giảm thời gian kiểm thử ticket Paco mà không đổi độ chính xác lấy tốc độ. Workflow phải dùng được video ticket, tái sử dụng knowledge về UI, test trực tiếp bằng Claude Playwright plugin, cho phép mutation đầy đủ trên môi trường dev và hỏi QA ngay khi gặp blocker thật.

## Principles

- Độ chính xác là gate; không áp timebox cứng.
- Ticket text và video đều là requirement source.
- Test qua browser trước; chỉ viết automation khi regression có giá trị chạy lại.
- Search product knowledge trước khi explore lại UI.
- Blocker phải được nêu và hỏi QA ngay; không tự đoán nghiệp vụ hoặc âm thầm mất hàng giờ.
- Markdown là nguồn chuẩn; graph machine-readable và diagram được generate.
- Artifact bền nằm trong repo; credentials, auth state, PII và output tạm ở local.

## 1. Video ingestion

### Inputs

Hỗ trợ video local trong folder ticket:

- `.mp4`
- `.webm`

### Pipeline

```text
video
  → ffprobe metadata
  → ffmpeg scene-change detection
  → selected timestamped frames
  → contact sheet
  → Markdown timeline
  → requirement and test checklist
```

Dùng `ffmpeg` và `ffprobe`; không thêm video library nếu hai tool này đủ.

Scene-change detection là pass đầu. Khi thao tác hoặc animation diễn ra quá nhanh, workflow trích frame dày hơn quanh timestamp cần kiểm tra. Frame gần trùng nhau được loại để giảm nhiễu.

### Outputs

```text
docs/tickets/<ticket-folder>/video/
├── timeline.md
├── contact-sheet.webp
└── frames/
```

`timeline.md` ghi:

- timestamp;
- UI state/action quan sát được;
- requirement hoặc test case liên quan;
- provenance: `Observed`, `Confirmed`, `Inferred`, `Open Question`;
- điểm mâu thuẫn giữa ticket text và video.

Video gốc giữ trong `ticket/<ticket-folder>/`. Frame và contact sheet chỉ commit sau khi kiểm tra/redact PII.

OCR chưa thuộc scope. Chỉ thêm khi việc search text trong ảnh có lợi ích thực tế.

## 2. Plugin-first testing

Claude Playwright plugin là công cụ mặc định cho:

- exploration;
- route validation;
- test execution;
- accessibility snapshots;
- evidence capture;
- mutation flows.

Test cases vẫn được thiết kế trong Markdown trước khi execute. Không tạo `.spec.ts` cho mọi test case.

Chỉ viết Playwright spec khi tất cả điều kiện sau đúng:

- regression quan trọng;
- expected result dựa trên `Confirmed` hoặc `Observed`;
- flow và locator đủ ổn định;
- chạy lại nhiều lần có lợi hơn test trực tiếp bằng plugin.

Spec phải nhỏ theo flow. Không gom toàn bộ ticket, setup, mutation và cleanup vào một file lớn nếu chúng có thể test trực tiếp hoặc tách độc lập.

## 3. Dev mutation policy

Trên hostname chính xác `blinx.dev.blinxpaco-np.com`, workflow được phép thực hiện:

- `Create`, `Update`, `Save`, `Submit`, `Send`;
- `Delete`, `Approve`, `Reject`;
- upload, import, download;
- external flow liên quan trực tiếp đến ticket hoặc survey.

### Hard guards

- Runtime phải xác minh hostname trước mutation.
- Production hostname luôn bị chặn.
- Redirect sang hostname khác chỉ tiếp tục khi hostname đó nằm trong dev allowlist của repo.
- Không lưu credentials, cookies hoặc auth state vào repo.
- Dùng test data khi có thể.
- Không ghi PII vào docs, graph, screenshot hoặc ledger đã commit.
- Cleanup tự động chỉ chạy khi không thể phá dữ liệu nền.
- `Send` chỉ dùng destination/test recipient đã xác minh; nếu chưa xác minh, result là `Blocked` và hỏi QA.
- Mỗi action/view có fingerprint và giới hạn lặp để tránh mutation vô hạn.

### Mutation ledger

Mỗi mutation ghi record đã redact:

```yaml
timestamp:
role:
environment:
source_view:
action:
target:
test_data_ref:
result:
cleanup:
evidence:
```

`test_data_ref` chỉ chứa alias hoặc hash; không chứa NHS number, email, phone hoặc dữ liệu bệnh nhân thật.

## 4. Full Paco survey

Survey crawl toàn Paco trên dev bằng role đang đăng nhập. Khi cần role khác, QA đổi account/role thủ công rồi resume crawl cho role mới.

### Discovery model

Crawler dùng breadth-first traversal từ dashboard. View fingerprint gồm:

```text
role + normalized URL + page heading + dialog/tab state
```

Crawler thu:

- normalized route và URL pattern;
- page title và headings;
- accessible controls: link, button, tab, menu, dialog, form field;
- stable selector clues như accessible name hoặc `data-testid`;
- transitions giữa views;
- role và environment;
- mutation outcome và provenance.

Page dùng record khác nhau nhưng cùng cấu trúc được gộp thành một view template. Không dump raw DOM/HTML hoặc network payload vì nặng và dễ chứa PII.

### Crawl controls

- Queue và checkpoint được lưu sau từng view.
- Mỗi transition thử tối đa một lần trên mỗi fingerprint trong một run.
- Không lặp cùng mutation trên cùng record fingerprint.
- Có configurable ceiling cho view/action để chống runaway; ceiling không phải test deadline và có thể resume.
- Dừng khi session hết hạn, CAPTCHA, production redirect, redirect ngoài allowlist hoặc lỗi liên tiếp.
- Không dùng fixed sleep; chờ observable URL, heading, dialog, response hoặc UI state.
- Form thiếu domain rule không được điền bằng dữ liệu đoán. Ghi `Blocked` và hỏi QA.

Full-site survey chạy riêng, không nằm trên critical path của từng ticket.

## 5. Product knowledge map

### Storage

```text
docs/product/
├── feature-map.md
├── workflows/
├── survey/
│   ├── views/
│   ├── roles/
│   ├── mutation-ledger/
│   ├── graph.json
│   ├── graph.mmd
│   └── coverage.md
└── assets/survey/
```

Markdown là nguồn chuẩn và được review qua Git. `graph.json` và `graph.mmd` luôn được generate từ Markdown; không sửa tay.

Không dùng `code-graph` hoặc graph DB ở giai đoạn này. Paco là black-box website, nên code dependency graph không giải quyết route discovery. Generated graph đủ cho search, traversal và visualization mà không tạo DB/schema/migration overhead.

### View schema

Mỗi view Markdown có frontmatter tương đương:

```yaml
id: quick-send
title: Quick Send
roles:
  - current-role
environment: dev
status: Confirmed
routes:
  - patient-search
controls:
  - name: Send
    kind: mutation
verified_by:
  - PAC2-4700
last_observed: 2026-09-19
```

Graph giữ nguyên provenance:

- `Confirmed`: route/action đã chạy thành công;
- `Observed`: crawler nhìn thấy nhưng chưa chạy;
- `Inferred`: suy luận chưa xác minh;
- `Open Question`: thiếu dữ liệu hoặc cần QA trả lời.

`Observed` không tự động được nâng thành `Confirmed`.

### Ticket lookup

Khi ticket mới vào:

```text
ticket text + video observations
  → feature/action/role keywords
  → graph search
  → matching views and workflows
  → confirmed route and selector clues
  → related historical tickets
  → short route revalidation
```

Không survey lại toàn site trong ticket workflow.

## 6. Ticket fast path

### Flow

```text
ticket.md + local video
  → contact sheet and timeline
  → requirements with provenance
  → graph lookup
  → route revalidation
  → risk-based test design
  → plugin execution with dev mutation
  → evidence and report
  → optional small regression spec
  → knowledge promotion
```

### Speed without reduced correctness

- Đọc frame video thay vì đoán behavior từ ticket text ngắn.
- Search graph trước exploration.
- Tái sử dụng route, role, workflow và selector clues đã xác minh.
- Gom test cases dùng chung setup để giảm navigation lặp.
- Chạy happy path trước để xác minh feature, sau đó boundary, negative và regression theo risk.
- Dùng screenshot khi chứng minh kết quả; không chụp mọi bước.
- Chỉ bật trace/video bổ sung khi lỗi khó tái hiện.
- Viết automation sau execution, không dùng automation để khám phá expected behavior.
- Promote evidence bền ngay vào `docs/tickets/<ticket-folder>/evidence/`; không tham chiếu lâu dài tới `test-results/`.

Không có deadline cố định. Workflow tiếp tục đến khi coverage đủ chính xác hoặc gặp blocker cần QA.

## 7. Ask-QA-early protocol

Workflow dừng tại checkpoint và hỏi QA ngay khi:

- không tìm thấy feature sau graph lookup và bounded exploration;
- không xác định được role hoặc test data;
- video mờ, thiếu frame hoặc mâu thuẫn với ticket;
- expected result không rõ;
- mutation cần domain rule không thể suy đoán;
- session/auth lỗi;
- behavior có thể là bug nhưng baseline chưa xác định;
- destination cho `Send` chưa được xác minh.

Mỗi câu hỏi phải chứa:

```markdown
- Blocker
- Điều đã quan sát
- Evidence hoặc video timestamp
- Quyết định cần QA xác nhận
- Các lựa chọn cụ thể nếu có
- Test cases bị ảnh hưởng
```

Workflow không tự khám phá hàng giờ, không tạo automation để né blocker và không biến assumption quan trọng thành assertion.

## 8. Evidence and repository boundaries

### Commit vào repo

- ticket text và video source phù hợp policy repository;
- timeline và contact sheet đã kiểm tra/redact;
- test cases, report và evidence bền đã redact;
- product view/workflow Markdown;
- generated graph và coverage;
- mutation ledger đã redact;
- Playwright regression specs được chọn lọc.

### Chỉ giữ local/ignored

- credentials, cookies, auth state;
- `.env` secrets;
- raw DOM/HTML và network payload;
- evidence chứa PII chưa redact;
- downloaded patient data;
- Playwright report và output tạm.

`test-results/` là output tạm. Artifact cần tồn tại qua session phải được copy/promote sang ticket evidence và được manifest/status tham chiếu bằng path bền.

## 9. Definition of done

Ticket hoàn tất khi:

- `ticket.md` và video source đã được ingest;
- mọi behavior quan trọng trong video đã map thành requirement, test case hoặc `Open Question`;
- coverage được chọn theo risk, không theo deadline;
- test cases quan trọng đã chạy hoặc có lý do `Blocked` rõ;
- mutation được ghi ledger;
- result có provenance và evidence bền;
- assumption quan trọng đều được đánh dấu hoặc hỏi QA;
- route/knowledge mới đã được promote vào product map;
- automation được quyết định rõ: `Worth automating` hoặc `Not worth automating`.

Automation hoàn hảo không phải điều kiện để ticket `COMPLETE`.

## 10. PAC2-4700 lessons applied

Workflow mới tránh lặp lại các vấn đề đã gặp:

- Video được chuyển thành frame/timeline trước test design.
- `Quick Send` route và knowledge tương tự được promote để ticket sau search lại được.
- Plugin test flow trực tiếp trước khi viết spec.
- Mutation trên dev không còn bị read-only policy chặn.
- Không duy trì nhiều spec chồng lấn nếu chúng không có regression value.
- Evidence bền không nằm trong `test-results/`.
- Manifest, status, automation decision và report phải đồng bộ tại checkpoint.
- Khi expected behavior hoặc test data chưa rõ, workflow hỏi QA ngay.