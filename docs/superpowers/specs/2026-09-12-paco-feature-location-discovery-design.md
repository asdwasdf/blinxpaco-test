# Đặc tả thiết kế phase `LOCATE` cho Paco QA

- **Ngày:** 2026-09-12
- **Trạng thái:** Đã được người dùng duyệt ngày 2026-09-12
- **Phạm vi:** Tìm vị trí feature trên Paco trước khi test design và Playwright
- **Website:** `https://blinx.dev.blinxpaco-np.com/paco/dashboard`

## 1. Bối cảnh

PAC2-5776 cho thấy workflow hiện tại phân tích ticket và thiết kế case trước khi xác định chắc chắn feature nằm ở đâu trên website. Ticket chỉ nêu `Quick Send`, `HF inbox`, `Health Forms` và `Booking Link`, nhưng không cung cấp ordered entry path, contextual prerequisite, test record hoặc UI landmark.

Việc tìm đường vào feature bị trộn với việc dò locator, chuẩn bị test data và chạy nghiệp vụ. Playwright vì vậy trở thành công cụ thử-sai để khám phá UI. Riêng PAC2-5776 phải dò patient search, contextual `Patient actions menu`, template picker, sáu booking combobox và health-form picker trước khi test có thể chạy đúng precondition.

Workflow cần một checkpoint read-only riêng để trả lời “feature ở đâu và mở bằng đường nào?” trước khi thiết kế hoặc triển khai automation chi tiết.

## 2. Mục tiêu

Thêm phase `LOCATE` để:

1. Hỏi tester về `role` và clue đã biết, nhưng không bắt tester phải biết feature nằm ở đâu.
2. Tự tìm feature trên Paco bằng scan read-only có giới hạn.
3. Lưu ordered entry path, contextual prerequisite, evidence và confidence.
4. Tái sử dụng navigation recipe đã xác minh cho ticket sau.
5. Chặn việc dùng Playwright test nghiệp vụ làm vòng lặp dò page, selector và test data.
6. Giữ nguyên safety policy, provenance, checkpoint/resume và protected `Tester notes`.

## 3. Ngoài phạm vi

Thiết kế này không:

- Crawl toàn bộ Paco.
- Brute-force mọi menu hoặc route.
- Probe private API.
- Tự chọn patient hoặc test data chưa được phép.
- Thực hiện `Create`, `Update`, `Delete`, `Submit`, `Approve`, `Reject`, upload, import, gửi dữ liệu hoặc action có side effect.
- Xác nhận business behavior trong phase `LOCATE`.
- Xây generic DOM harvester, Page Object toàn Paco hoặc navigation crawler.
- Coi route quan sát trên dev là product intent đã `Confirmed`.

## 4. Bài học từ PAC2-5776

### 4.1. Điểm nghẽn

- `DISCOVER` hiện chỉ resolve ticket folder và source; tên phase dễ gây hiểu nhầm rằng feature trên web cũng đã được tìm.
- `paco-explore` hiện yêu cầu selected scope trước khi browse, nhưng ticket mới thường chưa cho biết entry path.
- `feature-map.md` chưa chứa navigation recipe tái dùng.
- Locator ban đầu được suy đoán từ ticket hoặc hình dung UI: global button, table row, checkbox và visible text. UI thực tế dùng contextual patient action, dialog, PrimeReact multiselect/dropdown và template-dependent state.
- Fixed wait và test rerun được dùng để bù cho landmark chưa biết.
- “Không thấy popup” không có ý nghĩa nếu scheduler-link precondition chưa được chứng minh.

### 4.2. Rule cần giữ

- Không viết locator từ tên trong ticket nếu chưa quan sát UI.
- Không giả định contextual action là global navigation.
- Không trộn feature locating, locator reconnaissance, test-data preparation và business execution.
- Screenshot phải chứng minh milestone có giá trị, không chỉ được tạo khi test failure.
- Chỉ đánh giá `Pass` khi precondition và expected-result basis đều đủ rõ; nếu không thì `Inconclusive`.

## 5. Kiến trúc

### 5.1. State machine

Workflow mới:

```text
DISCOVER
  → INGEST
  → ANALYZE
  → LOCATE
  → EXPLORE
  → TEST_DESIGN
  → AUTOMATION_REVIEW
  → AUTOMATE
  → EXECUTE
  → REPORT
  → COMPLETE
```

Trách nhiệm:

- `DISCOVER`: resolve đúng ticket folder và primary source.
- `INGEST`: snapshot source, checksum và revision.
- `ANALYZE`: trích requirement, ambiguity, feature terms, aliases, actor/context, known location và unknown location.
- `LOCATE`: tìm và xác minh ordered entry path bằng browser read-only.
- `EXPLORE`: quan sát behavior trong feature đã định vị.
- Các phase sau giữ trách nhiệm hiện tại.

`LOCATE` là phase bắt buộc mặc định. Nó có thể `skipped` khi case không phụ thuộc feature UI, nhưng checkpoint phải ghi lý do cụ thể.

### 5.2. Skill ownership

Không thêm skill mới. `paco-explore` có hai mode rõ:

- `locate`: chỉ tìm feature entry path và ghi `feature-location.md`.
- `observe`: thực hiện `EXPLORE` hiện tại và ghi `exploration.md`.

`paco-ticket` route cả `LOCATE` và `EXPLORE` tới `paco-explore`, validate artifact theo mode rồi cập nhật manifest/status.

Ownership:

| Artifact | Write owner | Thành phần khác |
|---|---|---|
| `feature-location.md` | `paco-explore` mode `locate` | Chỉ đọc |
| `exploration.md` | `paco-explore` mode `observe` | Chỉ đọc |
| `manifest.yaml`, `status.md` | `paco-ticket` | Skill con chỉ trả checkpoint proposal |
| `feature-map.md` | `paco-report` theo policy product knowledge | Skill khác chỉ đề xuất |

## 6. Input contract của `LOCATE`

### 6.1. Bắt buộc

- Ticket đã qua `ANALYZE` và dependency còn valid.
- `environment`.
- `role` khi permission có ý nghĩa.
- Browser authentication hợp lệ qua manual-login flow.
- Safety mode read-only.

Thiếu một input bắt buộc trả `Blocked` với exact next action.

### 6.2. Tùy chọn

Trước khi scan, hỏi tester nếu họ biết:

- Module hoặc page gần feature.
- Global hay contextual entry.
- Patient, inbox, template hoặc record context cần thiết.
- Menu, label hoặc alias đã thấy.

Tester trả lời “không biết” không phải blocker. Clue được lưu với provenance là tester-provided, chưa tự động thành `Observed`.

## 7. Search strategy và budget

### 7.1. Chuẩn bị clue

`ANALYZE` cung cấp:

- Exact terms từ ticket.
- UI spelling variants và aliases hợp lý.
- Actor/context.
- Trigger nouns và target nouns.
- Location đã biết hoặc `Unknown`.

Ví dụ PAC2-5776:

```text
Quick Send
Quicksend
HF inbox
Health Forms
Booking Link
Scheduler Link
follow-up action
```

Alias chỉ dùng để search; route chỉ được ghi `Observed` sau khi thấy trực tiếp.

### 7.2. Thứ tự tìm

1. Tra route liên quan trong `docs/product/feature-map.md`.
2. Nếu có route còn phù hợp, validate bằng 1–3 meaningful views.
3. Nếu route thiếu, stale hoặc không match, bắt đầu tại dashboard.
4. Dò theo clue qua:
   - global navigation;
   - page search;
   - visible menu;
   - contextual menu trên test record được phép;
   - read-only detail.
5. Ghi candidate path và rejected path có giá trị.
6. Dừng ngay khi ordered entry path được xác minh hoặc stop condition xảy ra.

### 7.3. Meaningful view

Một meaningful view là một UI state mới có giá trị điều hướng, ví dụ:

- Page hoặc module mới.
- Menu/dialog/drawer mới.
- Search result state làm xuất hiện contextual entry.
- Feature root đã mở.

Reload, retry kỹ thuật hoặc screenshot cùng state không tăng view count. Quy tắc này tránh budget bị méo bởi thao tác không mang thông tin mới.

### 7.4. Budget mặc định

- Tối đa 15 phút elapsed time.
- Tối đa 12 meaningful views.
- Dừng khi điều kiện nào tới trước.

Budget chỉ là ceiling, không phải target. Tìm được feature sớm thì dừng sớm. Người dùng có thể cấp budget khác cho một run cụ thể; override không được lưu thành approval tái sử dụng.

### 7.5. Stop conditions

Dừng scan khi:

- Ordered entry path đã được xác minh.
- Đạt time hoặc view budget.
- Gặp mutation hoặc action có side effect chưa rõ.
- Thiếu permission, role hoặc authorized test context.
- Authentication hết hạn.
- Browser/tool fault ngăn quan sát đáng tin cậy.

Không tự mở rộng scope để vượt blocker.

## 8. Safety

`LOCATE` chỉ được:

- Navigate.
- View.
- Search.
- Filter.
- Sort.
- Paginate.
- Mở detail chắc chắn read-only.
- Mở menu/dialog không thay đổi dữ liệu.

Phải dừng trước:

- `Create`, `Update`, `Delete`, `Submit`, `Approve`, `Reject`.
- Upload, import hoặc gửi dữ liệu.
- Chọn item có thể thêm vào draft/template.
- Action chưa rõ persistence.
- Cleanup có tính destructive.

Contextual menu được phép mở nếu việc mở menu là read-only. Chọn menu item chỉ được phép khi item đó mở view/dialog read-only đã biết. Nếu tính chất chưa rõ, ghi candidate và trả `Blocked` thay vì click.

Không đọc credential, auth state, token, cookie, authorization header hoặc unnecessary response body vào prompt/docs.

## 9. Screenshot và evidence

### 9.1. Milestone mặc định

Khi route được xác minh, chụp tối thiểu các milestone áp dụng:

1. Landmark chứng minh đúng module/page/context.
2. Entry control hoặc contextual menu chứa entry.
3. Feature/page/dialog sau khi mở thành công.

Không chụp mọi click. Candidate/rejected route chỉ cần screenshot khi evidence đó giúp tránh dò lại hoặc giải thích blocker.

### 9.2. Lưu trữ

- Raw artifact chưa redact: local `test-results/<ticket-key>/locate/<run-id>/`.
- Evidence đã redact cần chia sẻ: `docs/tickets/<ticket-folder>/evidence/`.
- `feature-location.md` chỉ ghi reference, timestamp, environment, role và redaction status.

Tên file đề xuất:

```text
<TICKET-ID>-LOCATE-<milestone>-<timestamp>.png
```

### 9.3. Sensitive-data review

Trước khi đưa screenshot vào docs hoặc commit, phải kiểm tra và redact:

- Patient name và identifier.
- NHS number.
- Email, phone, address.
- Credential, token, cookie hoặc auth-related data.
- Nội dung clinical hoặc message không cần thiết.

Nếu chưa redact an toàn, giữ artifact local và chỉ ghi “local evidence; not shareable”.

## 10. Artifact `feature-location.md`

Path:

```text
docs/tickets/<ticket-folder>/feature-location.md
```

Cấu trúc bắt buộc:

```markdown
# Feature Location: <TICKET-ID>

**Input Revision:** <revision>
**Environment:** <environment>
**Role:** `<role>`
**Observed:** <timestamp>
**Status:** <Confirmed/Candidate/Blocked/Inconclusive>
**Budget:** <views used>/<view limit> views; <minutes used>/<minute limit> minutes

## Search clues

## Confirmed entry path

## Context requirements

## Candidate and rejected paths

## Observed landmarks

## Evidence

## Automation hints

## Blockers and next action

## Tester notes

[Protected area]
```

### 10.1. Entry path

Mỗi step ghi:

- Starting state.
- Exact visible landmark/control.
- Action read-only.
- Resulting state.
- Context dependency.

Ví dụ PAC2-5776:

```text
Dashboard
→ tìm authorized patient record
→ mở `Patient actions menu`
→ chọn `Quick Send`
→ `Quick Send` dialog hiển thị
```

Đây là example design, không tự nâng thành route product đã xác minh nếu artifact hiện tại chưa có evidence phù hợp.

### 10.2. Automation hints

Chỉ ghi:

- Accessible role/name đã quan sát.
- Dialog/page boundary.
- Stable landmark.
- UI state cần chờ.
- Context khiến control enabled/disabled.

Không ghi patient identifier, credential, generated class hoặc selector dễ vỡ vào product knowledge. Scoped CSS/XPath chỉ nằm trong ticket artifact khi không có lựa chọn tốt hơn và phải ghi lý do.

### 10.3. Protected content

File luôn kết thúc bằng `## Tester notes`. Update phải giữ nguyên toàn bộ vùng này. Không merge an toàn thì dừng và báo conflict.

## 11. Outcome và Definition of Done

### 11.1. Outcome

- `completed`: route được quan sát và mở tới feature bằng read-only action.
- `completed_with_warnings`: route tìm được nhưng có context dependency hoặc confidence warning chưa ảnh hưởng việc tiếp tục.
- `inconclusive`: có candidate hữu ích nhưng hết budget hoặc evidence chưa đủ chọn một route.
- `blocked`: auth, role, permission, authorized context hoặc mutation boundary ngăn tiếp tục.
- `failed`: browser, tool hoặc artifact fault.

### 11.2. Definition of Done

`LOCATE` hoàn thành khi:

- Feature root được nhận diện bằng visible landmark.
- Ordered entry path có thể lặp lại từ starting state đã ghi.
- Environment, role, timestamp và context dependency có provenance.
- Budget usage được ghi.
- Evidence reference và sensitive-data status có mặt.
- Mutation không xảy ra.
- Exact next action cho `EXPLORE` hoặc blocker được ghi.

URL riêng lẻ không đủ nếu feature phụ thuộc dialog/contextual menu. Visible text riêng lẻ không đủ nếu không chứng minh được entry path.

## 12. Manifest, checkpoint và resume

### 12.1. Manifest

`manifest.yaml` thêm phase `LOCATE` và output `feature_location`:

```yaml
LOCATE:
  status: completed
  outcome: completed
  input_revision: 1
  updated_at: ""
  artifacts:
    - path: "docs/tickets/<ticket-folder>/feature-location.md"
      sha256: ""
  budget:
    views_used: 8
    views_limit: 12
    elapsed_minutes: 11
    minutes_limit: 15
  warnings: []
  blockers: []
```

Budget metadata nhỏ được phép trong manifest; screenshot content hoặc sensitive route data không được copy vào manifest.

### 12.2. Status

`status.md` thêm row `LOCATE` và ghi:

- Route status.
- Context cần có.
- Candidate còn mở.
- Budget đã dùng.
- Blocker/warning.
- Exact next action.

### 12.3. Resume

Khi resume `LOCATE`:

1. Validate source/dependency revision.
2. Validate checksum của `feature-location.md` nếu có.
3. Đọc budget và candidate đã ghi.
4. Không lặp rejected path nếu UI/source không đổi.
5. Tiếp tục từ candidate hữu ích nhất trong budget mới hoặc budget còn lại theo run policy.
6. Không rerun phase `completed` nếu route dependency không stale.

Checkpoint history không bị xóa khi route đổi.

## 13. Stale propagation

`feature-location.md` chuyển `stale` khi source hoặc product knowledge thay đổi liên quan tới:

- Feature name/alias.
- Actor/context.
- Module/page/location.
- Trigger hoặc entry path.
- Role/permission cần để thấy feature.

Thay đổi chỉ về expected business behavior không tự làm location stale.

Khi route product cũ không còn validate được:

- Không overwrite history.
- Mark route `stale` hoặc `needs_review`.
- Ghi observation mới và ticket source.
- Chạy bounded scan thay vì mặc định tin route cũ.

## 14. Tái sử dụng qua `feature-map.md`

### 14.1. Promotion

Sau ticket report, `paco-report` có thể đề xuất hoặc thực hiện safe product-knowledge update theo policy hiện tại:

```text
Feature: Quick Send
Entry: Dashboard → patient context → `Patient actions menu` → `Quick Send`
Role observed: `GP Paco Assist`
Environment: dev
Classification: Observed
Source: PAC2-5776
Last verified: 2026-09-12
Aliases: Quicksend
```

Route vẫn là `Observed`, không tự thành `Confirmed`.

### 14.2. Dữ liệu không được promote

Không đưa vào product map:

- Patient name hoặc identifier.
- NHS number.
- Credential hoặc auth-state detail.
- Ticket-specific test data.
- Raw generated class.
- Locator chưa chứng minh ổn định.

### 14.3. Ticket sau

1. Match exact term hoặc alias.
2. Validate reusable route bằng 1–3 meaningful views.
3. Nếu valid, ghi nguồn route và tiếp tục.
4. Nếu stale/mismatch, chạy scan đầy đủ trong budget.

## 15. Gate trước test design và Playwright

### 15.1. Test design gate

Mỗi UI-dependent case trước `AUTOMATION_REVIEW` phải có:

- Feature location `Confirmed` hoặc lý do location không áp dụng.
- Ordered entry path.
- Required context: global, patient, HF inbox, template hoặc loại khác.
- Environment và role.
- Test-data category.
- Mutation class.
- Expected-result basis.

`TEST_DESIGN` có thể tạo preliminary case khi `LOCATE` chưa hoàn thành, nhưng case phải giữ trạng thái blocked cho automation và không chứa locator suy đoán.

### 15.2. Playwright gate

`paco-playwright` phải đọc valid `feature-location.md` trước khi viết UI test. Nó từ chối automation khi:

- Location thiếu/stale mà case phụ thuộc UI.
- Entry path chưa xác minh.
- Context hoặc role chưa rõ.
- Test data cần thiết chưa được định nghĩa.
- Mutation/approval gate chưa đạt.

### 15.3. Locator reconnaissance

Nếu route đúng nhưng locator chưa đủ:

1. Chạy probe read-only riêng trong scope feature đã xác minh.
2. Chỉ thu accessible snapshot/landmark cần thiết.
3. Ghi observation vào `feature-location.md` hoặc artifact exploration phù hợp.
4. Sau đó mới viết test nghiệp vụ.

Probe:

- Không chứa business assertion.
- Không nằm trong smoke suite mặc định.
- Có scope, budget và cleanup/delete-or-promote decision.
- Không dùng fixed wait làm chiến lược chính.
- Chờ observable condition như dialog, listbox, spinner hoặc stable landmark.

## 16. Error handling

- Auth redirect: `Blocked: Authentication expired`.
- Login browser không chạy: `Blocked` với lệnh manual-login hiện hành.
- Không thấy expected route từ product map: mark route candidate stale rồi dùng budget còn lại để scan; không kết luận product failure.
- Nhiều candidate bằng nhau khi hết budget: `Inconclusive`, liệt kê tối đa ba candidate và exact discriminator cần tiếp theo.
- Mutation boundary: `Blocked`, ghi control/action và không click.
- Screenshot chứa PII: không copy vào docs; giữ local, ghi redaction pending.
- Artifact write/checksum failure: `Failed`; orchestrator không mark phase completed.
- Protected `Tester notes` conflict: dừng, không overwrite.

## 17. Validation strategy

Dùng synthetic fixtures và Node assert-based checks; không mở Paco trong automated validation của workflow.

### 17.1. Static consistency

Kiểm tra:

1. Workflow order có `LOCATE` sau `ANALYZE`, trước `EXPLORE`.
2. `paco-ticket`, `paco-explore`, standards và templates dùng cùng phase name.
3. Ownership của `feature-location.md` không xung đột.
4. CLAUDE.md mô tả input `role` + optional clue và bounded read-only scan.

### 17.2. Synthetic workflow tests

Kiểm tra:

1. Manifest/template chứa `LOCATE`, output và budget.
2. Scan dừng tại 12 meaningful views.
3. Scan dừng tại 15 phút.
4. Tìm được route sớm thì dừng sớm.
5. Mutation/unknown action trả `Blocked` trước click.
6. Missing auth/role/environment trả blocker đúng.
7. `feature-location.md` giữ nguyên `## Tester notes` khi update.
8. Route stale khi location/context source đổi.
9. Expected-behavior-only change không làm location stale.
10. Existing v1 checkpoint được reconcile thêm phase mà không mất history.
11. `paco-playwright` từ chối UI automation khi location thiếu/stale.
12. Product route promotion loại patient identifier và PII.
13. Reusable route valid được xác minh trong 1–3 views.
14. Rejected route không bị lặp khi dependency không đổi.

### 17.3. Controlled pilot

Ticket thật chỉ chạy khi người dùng yêu cầu riêng. Pilot cho ticket kế tiếp:

1. `ANALYZE` sinh search clue.
2. Người dùng cung cấp `role`; clue vị trí là tùy chọn.
3. `LOCATE` scan read-only trong budget.
4. Người dùng review `feature-location.md` và screenshot đã redact.
5. Sau đó mới `EXPLORE`, `TEST_DESIGN` và Playwright assessment.

Duyệt thiết kế này không tự cho phép mở website hoặc mutation.

## 18. Thay đổi dự kiến

Tối thiểu các nhóm file cần cập nhật khi triển khai:

- `CLAUDE.md`.
- `.claude/skills/paco-ticket/SKILL.md`.
- `.claude/skills/paco-explore/SKILL.md`.
- `.claude/skills/paco-test-design/SKILL.md`.
- `.claude/skills/paco-playwright/SKILL.md`.
- `docs/standards/workflow-and-checkpoints.md`.
- `docs/standards/traceability.md`.
- `docs/standards/evidence-handling.md`.
- `docs/templates/manifest.yaml`.
- `docs/templates/status.md`.
- `docs/templates/feature-location.md` mới.
- `docs/templates/README.md`.
- `docs/product/feature-map.md` format.
- Synthetic tests hiện có liên quan workflow/template/safety.

Không sửa artifact PAC2-5776 hiện tại trong bước triển khai workflow nếu không có migration/reconciliation được yêu cầu riêng. Existing working-tree changes của PAC2-5776 và ticket khác phải được giữ nguyên.

## 19. Acceptance criteria

Thiết kế được triển khai đạt khi:

1. Workflow có `LOCATE` checkpoint riêng sau `ANALYZE`, trước `EXPLORE`.
2. Tester chỉ bắt buộc cung cấp `role`, environment và auth; feature location là clue tùy chọn.
3. `LOCATE` tra reusable route trước, rồi mới bounded web scan.
4. Default budget là 15 phút hoặc 12 meaningful views, điều kiện nào tới trước.
5. Scan chỉ dùng read-only action và dừng trước mutation/unknown action.
6. `feature-location.md` có route, context, candidate/rejected path, landmark, budget, evidence, automation hint, blocker và protected `Tester notes`.
7. Screenshot milestone được thu có chọn lọc; PII phải redact trước khi vào docs/version control.
8. Manifest/status resume được phase mà không lặp rejected path hoặc làm mất history.
9. Stale propagation phân biệt location/context change với expected-behavior-only change.
10. Route đã xác minh có thể được lưu `Observed` trong `feature-map.md` mà không chứa patient identifier hoặc fragile selector.
11. Test design và Playwright không được bỏ qua location gate đối với UI-dependent case.
12. Locator probe tách khỏi business test, không nằm trong smoke suite mặc định và không dựa vào fixed wait.
13. Synthetic tests chứng minh budget, safety, note preservation, stale behavior, v1 reconciliation và automation gate.
14. Không website nào được mở và không dữ liệu Paco nào thay đổi chỉ vì spec hoặc implementation workflow được duyệt.

## 20. Ranh giới phê duyệt

Duyệt tài liệu này chỉ cho phép chuyển sang viết implementation plan. Nó không tự cho phép:

- Mở Paco.
- Chạy `LOCATE` cho ticket thật.
- Chạy Playwright trên website.
- Thực hiện mutation.
- Sửa hoặc migrate artifact ticket thật.

Mọi browser action và mutation tiếp tục tuân thủ authorization hiện hành.