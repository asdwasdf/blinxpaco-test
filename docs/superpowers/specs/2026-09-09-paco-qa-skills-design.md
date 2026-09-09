# Đặc tả thiết kế bộ skill QA Paco

- **Ngày:** 2026-09-09
- **Trạng thái:** Đã được người dùng duyệt ngày 2026-09-09
- **Phạm vi:** Black-box QA chỉ dành cho Paco
- **Website:** `https://blinx.dev.blinxpaco-np.com/paco/dashboard`

## 1. Mục tiêu

Xây dựng một quy trình QA lưu trạng thái bằng file cho trường hợp tester chỉ có website và ticket, không có source code, database hoặc specification đầy đủ.

Hệ thống cần:

1. Chỉ xử lý ticket được người dùng chỉ định.
2. Tái dựng requirement mà không biến suy luận thành sự thật.
3. Hỗ trợ khám phá website black-box an toàn.
4. Tạo test case theo risk.
5. Chỉ automate case phù hợp bằng Playwright.
6. Giữ evidence, traceability và checkpoint qua nhiều phiên Claude.
7. Tích lũy dần mô hình requirement thực tế của Paco với nguồn gốc rõ ràng.

Đặc tả này chỉ định nghĩa thiết kế. Nó không cho phép tự xử lý ticket thật, mở Paco, đăng nhập hoặc thay đổi dữ liệu.

## 2. Ràng buộc đã xác nhận

- Chỉ áp dụng cho Paco.
- Nội dung giải thích bằng tiếng Việt; tên field, button, role, status và thuật ngữ UI tiếng Anh được giữ trong dấu `backtick`.
- Luồng mặc định là phân tích → test → Playwright, nhưng automation không bắt buộc.
- Người dùng đăng nhập thủ công.
- Không lưu credential trong skill, tài liệu, test code hoặc prompt.
- Browser authentication state chỉ được lưu cục bộ.
- Website interaction mặc định là read-only.
- Phải xin xác nhận trước mọi action có thể `Create`, `Update`, `Delete`, `Submit`, `Approve`, `Reject`, upload, import, gửi dữ liệu hoặc gây side effect khác.
- Kiến trúc gồm nhiều skill mô-đun và một orchestrator.
- Trạng thái workflow phải nằm trong file, không phụ thuộc lịch sử chat.

## 3. Ngoài phạm vi phiên bản đầu

Phiên bản đầu không:

- Đồng bộ Jira hoặc publish defect ra hệ thống bên ngoài.
- Crawl toàn bộ Paco hoặc tự xử lý mọi ticket trong folder.
- Truy cập database hoặc reverse-engineer private API.
- Gửi email, SMS, link hoặc notification thật nếu chưa được phép rõ ràng.
- Thiết lập CI/CD, load test, penetration test, pixel-diff visual test hoặc full browser matrix.
- Coi behavior hiện tại của website là product intent chính thức.
- Đọc hoặc đưa nội dung Playwright authentication state vào prompt.

## 4. Kiến trúc

### 4.1. Thành phần

| Skill | Trách nhiệm |
|---|---|
| `paco-ticket` | Validate ticket, quản lý revision/checkpoint, chọn phase tiếp theo, thực thi safety gate và điều phối skill con. |
| `paco-requirements` | Dịch và phân tích source, tạo atomic requirement, ambiguity và open question có provenance. |
| `paco-explore` | Khám phá black-box trong read-only mode và ghi observation/evidence theo environment. |
| `paco-test-design` | Tạo risk-based test case có requirement mapping, precondition, expected result, role và mutation class. |
| `paco-playwright` | Đánh giá khả năng automate, triển khai case được phép, quản lý manual-login state, chạy đúng scope và thu artifact. |
| `paco-report` | Tổng hợp result, defect, evidence, blocker và đề xuất cập nhật product knowledge an toàn. |

`paco-ticket` là orchestrator duy nhất. Skill con chỉ xử lý phase của mình và không tự gọi toàn bộ chuỗi tiếp theo.

### 4.2. Cách gọi

Entry point mặc định:

```text
/paco-ticket <ticket-folder-or-path>
```

Có thể gọi skill con trực tiếp để làm một phase riêng. Khi đó skill phải validate dependency, chỉ ghi artifact thuộc quyền sở hữu và không tự đánh dấu checkpoint workflow hoàn thành. Lần gọi `paco-ticket` tiếp theo sẽ reconcile artifact và checkpoint.

### 4.3. Giao tiếp bằng file

Các skill không dựa vào trí nhớ ẩn của phiên chat. Chúng trao đổi qua:

- Ticket source.
- Machine-readable manifest.
- Human-readable checkpoint.
- Artifact Markdown của từng phase.
- Playwright result và evidence reference.

Phiên mới có thể tiếp tục bằng cách đọc các file này và kiểm tra input snapshot.

## 5. Cấu trúc workspace

```text
CLAUDE.md
paco.config.yaml

.claude/
└── skills/
    ├── paco-ticket/SKILL.md
    ├── paco-requirements/SKILL.md
    ├── paco-explore/SKILL.md
    ├── paco-test-design/SKILL.md
    ├── paco-playwright/SKILL.md
    └── paco-report/SKILL.md

ticket/
└── <TICKET-ID>-<short-title>/
    ├── ticket.md
    └── [ảnh, video, PDF, note hoặc attachments/]

docs/
├── README.md
├── standards/
│   ├── knowledge-classification.md
│   ├── workflow-and-checkpoints.md
│   ├── data-safety.md
│   ├── traceability.md
│   └── evidence-handling.md
├── product/
│   ├── README.md
│   ├── feature-map.md
│   ├── roles-permissions.md
│   ├── glossary.md
│   ├── open-questions.md
│   ├── change-log.md
│   ├── requirements/README.md
│   └── workflows/README.md
├── tickets/
│   └── <same-ticket-folder>/
│       ├── manifest.yaml
│       ├── status.md
│       ├── requirements.md
│       ├── exploration.md
│       ├── test-cases.md
│       ├── automation.md
│       ├── report.md
│       ├── defects/
│       └── evidence/
├── regression/
│   ├── README.md
│   └── smoke-suite.md
├── templates/
└── test-runs/

playwright/
├── .auth/
├── config/
├── fixtures/
├── pages/
├── tests/{smoke,regression,tickets}/
├── test-data/
└── README.md

playwright.config.ts
package.json
.gitignore
test-results/
```

Khi triển khai ban đầu chỉ tạo policy, skill, template, index và Playwright scaffold tối thiểu. Không tạo trước ticket output, feature requirement, workflow, regression feature hoặc ticket test khi chưa có công việc thật cần chúng.

## 6. Quy chuẩn ticket source

Một ticket hợp lệ có cấu trúc:

```text
ticket/<TICKET-ID>-<short-title>/ticket.md
```

Naming rule phải chấp nhận ví dụ thực tế:

```text
PAC2-5776-intermittent-scheduler-link-needed-popup
```

Không giả định prefix luôn là `PACO`. Pattern thiết kế:

```regex
^[A-Z][A-Z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*$
```

Quy tắc:

- `ticket.md` là primary source bắt buộc.
- File cùng cấp và folder `attachments/` tùy chọn là supporting source.
- Mọi nội dung trong `ticket/` là read-only đối với skill.
- Skill không đổi tên ticket folder hoặc source file.
- Output nằm tại `docs/tickets/<cùng-tên-folder>/`.
- Hai folder có cùng ticket ID được báo conflict, không tự chọn một folder.
- Thiếu `ticket.md` làm phase `INGEST` bị `Blocked`.
- Chỉ ticket được người dùng chỉ định mới được xử lý.

## 7. Workflow và state machine

### 7.1. Các phase

```text
DISCOVER
  → INGEST
  → ANALYZE
  → EXPLORE
  → TEST_DESIGN
  → AUTOMATION_REVIEW
  → AUTOMATE
  → EXECUTE
  → REPORT
  → COMPLETE
```

Automation không bắt buộc. Các đường rút gọn hợp lệ:

- `ANALYZE → TEST_DESIGN` khi chưa thể hoặc không cần explore; design maturity là `Preliminary`.
- `TEST_DESIGN → REPORT` nếu scope chỉ yêu cầu manual test plan.
- `AUTOMATION_REVIEW → REPORT` nếu không có case phù hợp automate.

Không cho phép:

- `INGEST → AUTOMATE` khi chưa có requirement/test case.
- `EXECUTE` khi dependency bị stale.
- Chạy mutation khi chưa có approval đúng scope.

### 7.2. Phase status

```text
pending
in_progress
completed
blocked
stale
skipped
failed
```

Skill outcome:

```text
completed
completed_with_warnings
blocked
failed
inconclusive
no_change
```

- `Warning`: phase vẫn có thể hoàn thành.
- `Blocked`: cần input, quyền, authentication hoặc approval bên ngoài.
- `Failed`: lỗi kỹ thuật.
- `Inconclusive`: đã quan sát/chạy nhưng chưa thể kết luận đúng sai.

### 7.3. Definition of Done theo phase

| Phase | Hoàn thành khi |
|---|---|
| `DISCOVER` | Xác định rõ ticket folder và primary source. |
| `INGEST` | Input snapshot, checksum và revision hợp lệ. |
| `ANALYZE` | Knowledge nguyên tử đã phân loại và có provenance. |
| `EXPLORE` | Observation có environment, role, timestamp và evidence reference. |
| `TEST_DESIGN` | Case có traceability, risk, role/precondition và mutation class. |
| `AUTOMATION_REVIEW` | Mọi case trong scope có `Yes`, `Later`, `No` hoặc `Blocked` cùng lý do. |
| `AUTOMATE` | Test code có mapping, safety guard và được verify trong scope. |
| `EXECUTE` | Result và artifact được ghi nhận. |
| `REPORT` | Scope, outcome, evidence, defect, limitation và open question được tổng hợp. |
| `COMPLETE` | Mọi phase trong scope đều được xử lý hoặc có lý do rõ ràng. |

`COMPLETE` không có nghĩa tất cả test đều `Pass`.

## 8. Manifest và checkpoint

### 8.1. `manifest.yaml`

`docs/tickets/<ticket-folder>/manifest.yaml` do `paco-ticket` sở hữu. Nó lưu:

- Schema version.
- Ticket key, folder, source directory và primary source.
- Input revision.
- Path, semantic role, type và SHA-256 checksum của từng source file.
- Workflow status, phase status và timestamp.
- Output paths.

Nó không lưu credential, authentication state, requirement dài, test case hoặc approval của một lần chạy.

Schema khái niệm:

```yaml
schema_version: 1

ticket:
  key: PAC2-5776
  folder_name: PAC2-5776-intermittent-scheduler-link-needed-popup
  source_directory: ticket/PAC2-5776-intermittent-scheduler-link-needed-popup
  primary_source: ticket.md

input_snapshot:
  revision: 1
  generated_at: ""
  files:
    - path: ticket.md
      role: primary_source
      type: markdown
      sha256: ""

workflow:
  status: pending
  current_phase: DISCOVER
  last_completed_phase: null
  updated_at: ""

phases: {}
outputs: {}
```

### 8.2. `status.md`

`status.md` cũng do `paco-ticket` sở hữu và gồm:

- Ticket và input revision.
- Current phase và last-completed phase.
- Bảng tiến độ phase.
- Completed work, warning, blocker và approval cần thiết.
- Valid/stale artifact.
- `Next action` cụ thể.
- Checkpoint history dạng append-only.
- Khu vực `Tester notes` được bảo vệ.

### 8.3. Resume algorithm

Phiên mới:

1. Đọc `CLAUDE.md` và standard liên quan.
2. Resolve ticket được chọn.
3. Đọc `ticket.md`, `manifest.yaml`, `status.md`.
4. Tính lại source checksum.
5. Validate output được checkpoint khai báo.
6. Chỉ đọc artifact của phase gần nhất có liên quan.
7. Tiếp tục từ `Next action` hoặc phase hợp lệ chưa hoàn thành đầu tiên.

Không chạy lại phase đã hoàn thành nếu input/dependency không đổi. Nếu output được ghi là hợp lệ nhưng bị thiếu/hỏng, phase chuyển thành `stale` và skill báo discrepancy.

### 8.4. Revision và stale propagation

Source thay đổi làm tăng `input_revision`. Output cũ không bị xóa; skill ghi delta và đánh dấu dependency cần review.

Mặc định khi `ticket.md` đổi:

- `requirements.md` → `stale`.
- `test-cases.md` → `stale`.
- `automation.md` và assertion trong test code → `review_required`.
- `report.md` → `stale`.
- Exploration chỉ stale nếu thay đổi ảnh hưởng page, flow hoặc expected behavior đã khám phá.

Supporting file mới/sửa chỉ ảnh hưởng phase phụ thuộc semantic role của nó. Source bị xóa làm knowledge phụ thuộc chuyển `needs_review`, không xóa lịch sử.

### 8.5. Idempotency

Chạy lại skill không được:

- Cấp ID mới cho knowledge tương đương.
- Nhân đôi source hoặc open question.
- Reset execution history.
- Ghi đè tester note.
- Tái tạo artifact còn hợp lệ và không đổi.
- Mark phase completed trước khi ghi artifact thành công.

## 9. Artifact ownership

| Artifact | Write owner | Thành phần khác |
|---|---|---|
| `ticket/**` | Tester | Chỉ đọc |
| `manifest.yaml`, `status.md` | `paco-ticket` | Chỉ đọc hoặc trả checkpoint proposal |
| `requirements.md` | `paco-requirements` | Chỉ đọc |
| `exploration.md` | `paco-explore` | Chỉ đọc |
| `test-cases.md` | `paco-test-design` | Chỉ đọc |
| `automation.md`, Playwright source | `paco-playwright` | Chỉ đọc |
| Raw Playwright artifact | Playwright runner | Chỉ tham chiếu |
| `report.md`, defect, product change log | `paco-report` | Skill khác chỉ đề xuất |

File do skill quản lý có khu vực `Tester notes`. Khi cập nhật phải giữ nguyên khu vực này. Nếu không thể merge an toàn, skill dừng và báo conflict thay vì overwrite.

## 10. Knowledge model

### 10.1. Hai tầng kiến thức

- Ticket-specific knowledge: `docs/tickets/<ticket-folder>/`.
- Reusable product knowledge: `docs/product/`.

Ticket knowledge chỉ được promote khi áp dụng ngoài một ticket và có provenance phù hợp.

### 10.2. Classification

- `Confirmed`: được ticket, Acceptance Criteria, trusted product document hoặc xác nhận bằng văn bản của BA/PO hỗ trợ rõ.
- `Observed`: thấy trực tiếp trên environment xác định, có role, timestamp và evidence.
- `Inferred`: suy luận có ghi basis nhưng vẫn cần xác nhận.
- `Open Question`: knowledge còn thiếu được quản lý riêng, không phải requirement classification.

Nhiều observation lặp lại không tự biến thành `Confirmed`. Behavior hiện tại không mặc định là behavior đúng.

### 10.3. Lifecycle

```text
Candidate
Active
Disputed
Superseded
Retired
```

Classification và lifecycle độc lập. Requirement có thể là `Observed + Active`. Source mâu thuẫn dẫn tới `Disputed`. Requirement cũ vẫn được giữ và liên kết khi `Superseded` hoặc `Retired`.

### 10.4. Atomic requirement và provenance

Mỗi requirement gồm:

- Stable ID.
- Classification và lifecycle.
- Feature và scope.
- Actor/role nếu biết.
- Preconditions và expected observable behavior.
- `First recorded` và `Last verified`.
- Source location chính xác và input revision.
- Evidence và related tests.
- Note hoặc uncertainty còn lại.

Giới hạn, role hoặc Acceptance Criteria còn thiếu phải được giữ là unknown/open question, không được tự bổ sung.

### 10.5. Product documentation

- `feature-map.md`: index điều hướng và knowledge coverage.
- `requirements/<feature>.md`: reusable atomic requirement.
- `workflows/<workflow>.md`: multi-page/state flow có nguồn.
- `roles-permissions.md`: capability, access, classification, source và last verification.
- `glossary.md`: term, alias, giải thích, source và quan hệ chưa rõ.
- `open-questions.md`: stable question ID, status, impact, evidence và answer source.
- `change-log.md`: thay đổi knowledge có ý nghĩa.

Coverage level:

```text
Unknown
Minimal
Partial
Substantial
Reviewed
```

Chỉ người có thẩm quyền phù hợp mới gán `Reviewed`.

### 10.6. Duplicate và conflict

Trước khi thêm product requirement, skill kiểm tra feature, actor, trigger, expected behavior, superseded item và glossary alias.

- Trùng hoàn toàn: giữ một ID và thêm source mới.
- Trùng một phần: tách thành atomic requirement hoặc ghi khác biệt scope.
- Source mâu thuẫn: giữ cả hai claim, mark `Disputed`, tạo open question.
- Inference: mặc định giữ ở ticket; nếu rủi ro toàn sản phẩm cần theo dõi thì vẫn là `Inferred + Candidate` và liên kết open question.

Không skill nào được âm thầm chọn nguồn “có vẻ đúng nhất”.

### 10.7. Cập nhật product knowledge an toàn

`paco-report` có thể tự thực hiện thay đổi không đổi ý nghĩa:

- Thêm source/evidence link.
- Thêm observation có provenance đầy đủ.
- Thêm open question.
- Cập nhật `Last verified`.
- Ghi change log.

Phải xin xác nhận trước khi:

- Nâng knowledge lên `Confirmed`.
- Giải quyết conflict.
- Đổi scope, actor hoặc business meaning.
- Mark requirement `Retired` hoặc `Superseded` khi nguồn chưa rõ.
- Mark product knowledge `Reviewed`.

## 11. Traceability

Chuỗi traceability:

```text
Ticket hoặc observation
  → ticket/product requirement
  → ticket test case
  → regression case hoặc Playwright test
  → test run
  → evidence
  → defect
```

Mỗi test result phải trả lời được:

- Test requirement nào?
- Classification và source nào hỗ trợ expected result?
- Environment, role và input revision nào được dùng?
- Evidence ở đâu?
- Có mutation không và cleanup đã hoàn tất chưa?

Ticket test ID dùng phần external ticket ID, ví dụ `PAC2-5776-TC-001`. Regression case dùng stable ID riêng và liên kết ticket nguồn.

## 12. Test strategy

### 12.1. Các lớp test

- **Ticket validation:** kiểm tra thay đổi của ticket, thường manual trước.
- **Smoke:** Paco truy cập được và các critical read-only flow ổn định.
- **Feature regression:** kiểm tra reusable product rule có nguồn.
- **Exploratory:** tìm undocumented behavior, risk và unusual state.

### 12.2. Risk model

Test design xét business impact, user frequency, permission sensitivity, mutation, integration, regression probability, requirement confidence và automation stability.

Risk:

```text
Critical
High
Medium
Low
```

Severity/priority do skill đề xuất phải ghi `Suggested` nếu team chưa cung cấp quy ước chính thức.

### 12.3. Nhóm coverage

Chỉ chọn nhóm liên quan thay vì sinh máy móc:

- Happy path.
- Negative và validation.
- Boundary.
- State transition.
- Role và permission.
- Duplicate/concurrency.
- Navigation và persistence.
- Search/filter/sort/pagination.
- Error handling và recovery.
- Impacted regression.

Boundary hoặc rule chưa biết tạo open question, không tạo expected result giả.

### 12.4. Test case contract

Mỗi test case có:

- Stable ID và title.
- Type, risk và priority.
- Requirement IDs và knowledge basis.
- Preconditions, environment, role và test data.
- Steps và expected results.
- Mutation class và approval requirement.
- Postconditions và cleanup.
- Automation decision/status.
- Evidence và execution history.

Result:

```text
Pass
Fail
Blocked
Not Run
Inconclusive
```

Chỉ dùng `Fail` khi expected result rõ và precondition đạt. Lỗi environment/authentication làm suite `Blocked`, không tạo hàng loạt false feature failure.

## 13. Data safety

### 13.1. Quyền mặc định

Khi chưa có authorization mới và rõ ràng, chỉ được điều hướng, xem, search, filter, sort, pagination và mở detail chắc chắn read-only.

Skill dừng trước action có thể tạo, sửa, xóa, submit, approve, reject, upload, import, gửi hoặc gây side effect. Action chưa rõ được coi như persistent mutation.

### 13.2. Mutation class

```text
None
Temporary
Persistent
Destructive
Unknown
```

- `None`: có thể chạy read-only mặc định.
- `Temporary`: có cleanup đáng tin cậy nhưng vẫn cần approval.
- `Persistent`: để lại dữ liệu/gửi/thay đổi state; cần approval theo từng run.
- `Destructive`: delete, bulk mutation, overwrite hoặc khó hoàn tác; cần approval riêng.
- `Unknown`: xử lý như persistent cho tới khi làm rõ.

### 13.3. Hai lớp safety gate

1. **Design-time:** test case và automation assessment ghi mutation + approval status.
2. **Runtime:** mutation test cần guard rõ như `PACO_ALLOW_MUTATION=true`; destructive test cần guard riêng như `PACO_ALLOW_DESTRUCTIVE=true`.

Flag mặc định tắt, không nằm trong shared config và không thay thế approval. Approval gắn với environment, case, action, data và một run trừ khi người dùng nói rõ khác đi.

### 13.4. Approval request

Trước mutation run, skill trình bày:

- Environment và ticket.
- Exact test case/action.
- Expected side effect, bao gồm notification/send.
- Test data.
- Cleanup method và confidence.
- Có destructive action hay không.

Checkpoint xác nhận chưa có mutation nào xảy ra trước approval.

### 13.5. Cleanup

Mutation case phải nêu cleanup, cách verify và failure handling. Cleanup failure được ghi cùng identifier của dữ liệu còn lại. Skill không tự mở rộng sang destructive cleanup chưa được phép.

## 14. Playwright strategy

### 14.1. Chọn automation

Mỗi case nhận quyết định `Yes`, `Later`, `No` hoặc `Blocked` dựa trên repeat value, business risk, requirement confidence, UI stability, data controllability, result observability, mutation risk và maintenance cost.

Thứ tự ưu tiên ban đầu:

1. Read-only smoke.
2. Critical read-only regression.
3. Search/filter/navigation ổn định.
4. Permission visibility với role rõ.
5. Critical mutation flow đã được phép, có dedicated data và cleanup.
6. Complex edge case.

Không automate correctness assertion chỉ dựa trên `Inferred` knowledge.

### 14.2. Manual authentication

Một headed setup cho phép tester tự nhập credential và hoàn thành SSO/MFA, sau đó lưu local state tại:

```text
playwright/.auth/
```

Chỉ tạo role-specific state cho role thật đã xác định. Auth state phải được Git ignore, không copy vào docs, không đọc vào prompt và không đính kèm defect. Redirect về login hoặc expired state cho kết quả `Blocked: Authentication expired`, không phải product failure.

### 14.3. Browser và environment

Bắt đầu với Chromium. Chỉ thêm browser khi có compatibility scope hoặc regression value rõ. Test dùng environment mapping trong cấu hình không nhạy cảm; không hard-code URL rải rác.

### 14.4. Test structure

Tách test thành `smoke`, `regression` và `tickets`. Ticket automation chỉ được promote thành regression qua quyết định rõ. Chỉ trích helper/page/component abstraction sau khi có reuse thật; không dựng trước Page Object cho toàn Paco.

### 14.5. Locator, wait và assertion

Ưu tiên locator:

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. Stable text
5. `getByTestId`
6. Scoped CSS khi không còn lựa chọn tốt hơn

Tránh long XPath, generated class, positional selector, `.first()` không giải thích và fixed sleep. Chờ theo observable condition: URL, visibility/enabled state, dialog lifecycle, relevant network completion, spinner, toast hoặc table update.

Assertion phải map tới expected behavior có nguồn; tránh assertion quá yếu hoặc ràng buộc copy không cần thiết.

### 14.6. Network observation

Có thể quan sát browser-visible request để synchronize và phân biệt UI/backend failure. Không probe endpoint ngoài flow hoặc dùng API để lách safety gate. Token, cookie, header, personal data và response body không cần thiết phải được loại bỏ/redact khỏi tài liệu.

### 14.7. Retry và intermittent behavior

Local/debug mặc định không retry. Pass sau retry được ghi là flaky, không âm thầm coi là ổn định. Intermittent test ghi bounded attempt count, reset behavior, occurrence count/rate và evidence. Repetition không mở rộng mutation approval. Không reproduce được phải ghi `Not Reproduced` hoặc `Inconclusive` theo requirement basis, không tự động `Pass`.

### 14.8. Evidence

Evidence có thể gồm screenshot, trace, relevant console/network observation, URL, timestamp, environment, role label và test-case ID. Artifact lớn lưu tại local `test-results/`; docs chỉ ghi reference/tóm tắt. Phải kiểm tra credential và personal data trước khi chia sẻ. Video chỉ thu khi có giá trị.

## 15. Skill contract

### 15.1. Common context

Mọi skill nhận hoặc resolve:

- Ticket key/folder/source.
- Output directory và input revision.
- Current phase và dependency status.
- Environment và language policy.
- Safety mode và explicit approval.
- Authentication strategy, role và state status.

Không đoán environment, role, approval, auth validity, priority hoặc expected result.

### 15.2. Common outcome

Skill con trả:

- Skill, phase, ticket và input revision.
- Outcome.
- Artifact created/updated/unchanged.
- Summary/count của phase.
- Mutation có xảy ra không.
- Có sensitive data không.
- Blocker, warning và recommended next phase.

Orchestrator chỉ cập nhật checkpoint sau khi xác nhận artifact được ghi thành công.

### 15.3. `paco-ticket`

Nhận ticket folder/key cùng optional target phase, environment hoặc run scope. Nó validate naming/source, tính revision/checksum, phát hiện stale dependency, chọn transition hợp lệ, kiểm tra gate, gọi skill con, cập nhật manifest/status và báo checkpoint ngắn. Nó không làm chuyên môn thay skill con.

### 15.4. `paco-requirements`

Đọc source và attachment liên quan; tạo tóm tắt/bản dịch tiếng Việt, atomic confirmed/inferred requirement, ambiguity, open question và source mapping. OCR không chắc và Acceptance Criteria thiếu phải được ghi rõ. Skill không browse Paco, tạo full test case hoặc kết luận fix.

### 15.5. `paco-explore`

Yêu cầu scope, environment, authentication và role khi permission có ý nghĩa. Nó ghi navigation, UI observation, redacted network observation, mismatch, action chủ động không thực hiện, possible defect, evidence và suggested coverage. Nó dừng trước action chưa rõ hoặc có mutation.

### 15.6. `paco-test-design`

Yêu cầu requirement hợp lệ; có thể dùng exploration và product knowledge. Nó tạo risk-based case, coverage mapping, test data/mutation classification, sơ bộ automation candidate, blocker và regression candidate. Nếu chưa explore, design maturity là `Preliminary`.

### 15.7. `paco-playwright`

Tách `AUTOMATION_REVIEW`, `AUTOMATE` và `EXECUTE`. Nó cần selected case hợp lệ, expected result rõ, environment/auth context và approval phù hợp. Nó sở hữu automation assessment và Playwright source nhưng không tự bật mutation guard hoặc mở rộng run scope.

### 15.8. `paco-report`

Đọc versioned requirement, result, evidence, role/environment và cleanup status. Nó tạo ticket/test-run summary, defect, limitation, open question, regression recommendation và safe product-knowledge proposal. Khi thiếu evidence hoặc expected behavior, report phải `Incomplete`/`Inconclusive` thay vì bịa kết luận.

## 16. `CLAUDE.md`

`CLAUDE.md` là bộ nguyên tắc ngắn, không phải toàn bộ procedure. Nó chứa:

- Paco-only black-box scope.
- Tiếng Việt + giữ English UI terms.
- Ticket/input/output convention.
- Read-only default và explicit mutation gate.
- Manual authentication và auth-state secrecy.
- Knowledge classification/provenance.
- Resume bằng manifest/status/checksum.
- Orchestrator lifecycle và automation tùy chọn.
- Protected `Tester notes`.
- Result vocabulary.
- Link tới standards/templates.

Chi tiết policy nằm trong `docs/standards/` để sáu skill không copy và drift khỏi nhau.

## 17. `paco.config.yaml`

Chỉ lưu cấu hình không nhạy cảm:

- Product name và default environment.
- Base URL và dashboard path.
- Source/output/result/auth paths.
- Ticket naming pattern và `ticket.md` convention.
- Default read-only policy.
- Vietnamese documentation preference.
- Chromium strategy ban đầu.

Không chứa password, token, cookie, personal data, auth state hoặc reusable mutation approval.

## 18. Template

Cần template cho:

- `manifest.yaml`
- `status.md`
- `requirements.md`
- `exploration.md`
- `test-cases.md`
- `automation.md`
- Test report
- Defect
- Open question

Template dùng metadata nhỏ, provenance bắt buộc và vùng `Tester notes` được bảo vệ. Acceptance Criteria trống trong source phải tiếp tục được ghi là thiếu, không tự điền thành confirmed content.

## 19. Validation strategy

### 19.1. Static review

Kiểm tra:

- Skill frontmatter.
- Link tới standard/template.
- Tính nhất quán giữa `CLAUDE.md`, skill và docs.
- Artifact ownership.
- Secret exclusion.
- Placeholder chưa giải quyết.
- Naming/path rule.

### 19.2. Synthetic dry-run

Dùng fixture giả, không chứa dữ liệu Paco thật và không mở website, để kiểm tra:

- Discovery và source validation.
- Tạo manifest/status.
- Checksum/input revision.
- Resume từ `Next action`.
- Stale propagation.
- Idempotent rerun.
- Giữ tester note.
- Permission gate.
- Structured child-skill outcome.

### 19.3. Controlled pilot

Chỉ dùng ticket thật sau khi người dùng yêu cầu riêng. Pilot đi từng bước:

1. Requirement analysis.
2. Người dùng review.
3. Read-only exploration.
4. Người dùng review test case.
5. Automation assessment.

Ticket nằm trong `ticket/` không đồng nghĩa được phép tự xử lý.

## 20. Acceptance criteria

Subsystem được nghiệm thu khi:

1. Sáu `SKILL.md` tồn tại với input, workflow, output, stop condition, safety rule, outcome và ownership rõ.
2. `CLAUDE.md`, standards, templates và skill nhất quán.
3. Hỗ trợ `PAC2-5776-.../ticket.md` mà không giả định prefix `PACO`.
4. Ticket source không bị sửa và selected-ticket scope được giữ.
5. Manifest/checkpoint phát hiện revision, đánh dấu stale và resume mà không lặp việc còn hợp lệ.
6. Requirement tách `Confirmed`, `Observed`, `Inferred`, `Open Question`, có provenance và lifecycle.
7. Product docs không bị nhiễm ticket-only fact, duplicate, unsupported promotion hoặc silent conflict resolution.
8. Test case có traceability, risk, expected-result basis, role/precondition, mutation class và coverage mapping.
9. Read-only là mặc định; mutation/destructive action cần authorization ở design-time và runtime.
10. Manual login không lưu credential; auth state local và bị loại khỏi prompt/docs/version control.
11. Playwright chỉ automate case đã assess, dùng locator/wait ổn định và lưu evidence có kiểm soát.
12. Report phân biệt `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`, đồng thời ghi environment, role, revision, mutation và cleanup.
13. Synthetic validation chứng minh discovery, revision, stale propagation, resume, idempotency, tester-note preservation và safety gate.
14. Không ticket thật nào được phân tích, không website được mở và không dữ liệu Paco nào thay đổi nếu chưa có yêu cầu riêng.
15. Có hướng dẫn ngắn cho orchestrated use và direct child-skill use.

## 21. Ranh giới phê duyệt

Duyệt đặc tả này chỉ cho phép chuyển sang lập implementation plan. Nó không tự động cho phép triển khai, xử lý ticket, mở website, đăng nhập hoặc mutation. Việc triển khai chỉ bắt đầu sau khi implementation plan được người dùng xem và duyệt riêng.
