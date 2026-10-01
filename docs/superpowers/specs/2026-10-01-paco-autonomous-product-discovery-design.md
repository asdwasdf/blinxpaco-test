# Paco Autonomous Product Discovery — thiết kế

Ngày: 2026-10-01

## Mục tiêu và ranh giới

Mở rộng hạ tầng Paco hiện có thành hệ thống khám phá sản phẩm có lập lịch tự động, hiểu state/workflow, giới hạn ngân sách và tiếp tục được sau gián đoạn. Mục tiêu là giảm việc tester phải chọn trang hoặc bước kế tiếp, không biến quan sát thành requirement. Khám phá theo từng role đã đăng nhập trong Claude Playwright plugin; thay role và gia hạn đăng nhập vẫn cần tester. Chỉ Paco trên dev host được cấu hình; production/unknown host không được mutate.

`npm run paco:discover` là CLI quản lý/kiểm tra discovery state và đưa ra task tiếp theo, **không** tự điều khiển browser. Vòng browser chạy trong phiên Claude đang giữ tab Playwright plugin. Không mở browser riêng, không dùng private API hoặc tái sử dụng auth state. Đây là giới hạn chủ ý của lựa chọn plugin-first; không quảng bá CLI là runner browser không cần phiên Claude.

Không thay thế `paco-ticket`, không biến discovery thành ticket runner, không thay đổi contract `ChildSkillOutcome` v1 của các phase ticket. `LOCATE` và `OBSERVE` giữ budget, read-only, artifact ownership và outcome cũ.

## Thành phần và quyền sở hữu

1. **Discovery orchestrator**: một entry skill/workflow cấp cha, ngoài ticket. Đọc/ghi checkpoint theo run+role, chọn task bằng planner, quản lý ngân sách, gọi child `SURVEY` hoặc `VERIFY_FLOW`, kiểm tra outcome và artifact rồi quyết định tiếp tục. Không ghi `docs/tickets/**/manifest.yaml` hoặc `status.md`; chỉ `paco-ticket` có quyền đó. Lần gọi child trực tiếp không tự bắt đầu vòng lặp.
2. **Planner và state store** (`scripts/`): TypeScript thuần cho fingerprint, queue, priority, budget, checkpoint/ledger atomic, compatibility với checkpoint legacy; không phụ thuộc browser. CLI dùng cùng các hàm. Không thêm dependency khi `yaml`, `node:crypto` và Node stdlib đã đủ.
3. **`paco-explore`**: giữ `locate` và `observe`; `survey` chỉ điều hướng/quan sát read-only, ghi view/workflow/overview do nó sở hữu, trả discovery outcome/proposal. Cấm mutation, upload, import, send và action chưa rõ persistence. Không sửa checkpoint hay manifest cha.
4. **`VERIFY_FLOW` executor**: child riêng nhận đúng một mutation candidate và authorization của run; kiểm tra sự cần thiết, gate, test data, ledger, kết quả, cleanup. Chỉ ghi evidence và proposal thuộc phạm vi discovery, không tự điều phối hoặc sửa trạng thái cha.
5. **Graph generator**: mở rộng `scripts/generate-product-graph.ts` trên nguồn Markdown `docs/product/survey/views/*.md`. Sinh `graph.json`/`graph.mmd`; `feature-map.md` vẫn chỉ được promote theo chính sách report hiện hành. Giữ khả năng parse view cũ và `routes` cũ.

`ChildSkillOutcome` v1 vẫn dùng nguyên cho `LOCATE`/`OBSERVE` và ticket phases. Discovery ngoài ticket có `DiscoveryChildOutcome` riêng (mode, task ID, artifact/checksum, trạng thái quan sát, edges, candidates, blockers, mutation/ledger summary). Không chế ticket key giả để đi qua `verifyChildArtifacts()` dành cho ticket; validator discovery kiểm tra đường dẫn, ownership, checksum, redaction và `## Tester notes` riêng. Orchestrator xác minh output trước khi commit checkpoint.

## Vòng khám phá

1. Nạp checkpoint cho `run_id` + environment + role; nếu tạo mới thì seed dashboard đã xác thực. Không tự đổi role hoặc môi trường khi resume.
2. Planner lấy task hợp lệ cao nhất; task phải dẫn đến navigation entry đã thấy, branch/edge có provenance, gap đã ghi hoặc mutation candidate có nguồn. Không tạo feature giả từ tên/URL suy đoán.
3. Task read-only: `SURVEY` quan sát current state bằng plugin, ghi state/edge/gap/candidate và evidence đã redact; enqueue các nhánh chưa thấy. Task mutation: `VERIFY_FLOW` chỉ chạy khi read-only không tiếp cận được state có giá trị và đáp ứng toàn bộ điều kiện an toàn.
4. Orchestrator validate proposal, cập nhật checkpoint, regenerate graph khi survey Markdown đã thay đổi, chọn task khác. Branch bị chặn không cản các branch độc lập. Hết task hợp lệ thì ghi `exhausted`; hết budget thì checkpoint `paused_budget`, **không** tuyên bố đã bao phủ toàn Paco.
5. Nếu auth hết hạn: điều hướng tab hiện tại tới `/paco/login`, ghi `Blocked: Authentication expired` và checkpoint; chờ tester login/SSO/MFA, xác minh trang authenticated và role trước resume. Không đọc/ghi credentials, cookies, tokens, headers hoặc serialized auth state.

Một run có trần cấu hình cho meaningful states, actions, elapsed time và retries. Dùng giới hạn `LOCATE` hiện có chỉ cho `LOCATE`; discovery có default hữu hạn, có thể override từ CLI, lưu cả limit và consumed trong checkpoint. Retry/reload không tăng meaningful-state count. Mọi iteration hoặc outcome lỗi vẫn có đường dừng hữu hạn.

## Fingerprint, queue và checkpoint

Fingerprint trạng thái gồm `role | normalized URL | heading/module | selected tab | dialog/drawer | entity/context type | meaningful data-state variant`. URL giữ origin khi qua host dev đã cấu hình, path và query/hash làm thay đổi flow; thay segment ID không ổn định bằng `:id`, bỏ timestamp/tracking/query không liên quan; không bỏ các discriminator như selected tab, status/filter, entity type hoặc empty/populated/error/loading. Không lưu giá trị bệnh nhân, thông tin lâm sàng hay recipient. Cùng URL nhưng context khác tạo state khác; refresh/retry cùng state không tạo node mới.

Queue task gồm ID, source evidence/edge/gap, source fingerprint, action/target, priority, status (`unseen`, `queued`, `exploring`, `explored`, `blocked`, `mutation-candidate`, `verified-by-observation`, `exhausted`), attempt count và lý do requeue nếu có. Dedup theo fingerprint + transition/action + context, kiểm tra visited và attempted transitions để ngăn cycle. Chỉ requeue trạng thái đã hiểu khi role/context/data variant mới làm thay đổi đáng kể hành vi và lý do được ghi.

Thứ tự deterministic: module chưa khám phá; branch workflow chưa khám phá; cross-module handoff; read-only transition; authorized mutation candidate cần thiết; alternate/empty/error state có ích. Trong cùng mức, chọn theo thông tin mới dự kiến, evidence strength, rồi ID ổn định; LLM chỉ giúp diễn giải ambiguity, không được tạo task thiếu provenance hoặc vượt rule. Mutation được phép không đồng nghĩa đáng thực hiện.

Checkpoint YAML theo run/role ở `docs/product/survey/roles/` chứa `run_id`, environment, role, current task, queue, visited states, discovered edges, mutation candidates, completed/pending mutations, blocked tasks, gaps, budgets và timestamp. Sử dụng viết tạm + rename atomic, validate schema trước khi thay file. Legacy checkpoint hiện tại có `queue` dạng câu văn, `visited_fingerprints`, `attempted_transitions`, `mutation_fingerprints`, `blockers`: đọc không mất dữ liệu; giữ câu văn thành legacy notes/gaps, không tự biến thành transition đã quan sát hoặc task executable; coi mutation fingerprints legacy là đã dùng, không chạy lại. Không ghi đè checkpoint đang có hoặc notes khi migrate lỗi. Snapshot checkpoint trước action rủi ro; sau mỗi tiến triển có ý nghĩa lưu tiếp. Reconcile Markdown đã ghi nhưng checkpoint chưa cập nhật dựa trên ID/provenance, không tạo duplicate.

## Graph và tài liệu

Markdown survey view tiếp tục là nguồn chuẩn. Frontmatter mở rộng bằng state, entity/context, data variant và `relationships` có `from`, `to`/destination hint, trigger, relationship, context, classification, mutation boundary, evidence, environment, role và observation time. `Observed` là quan sát read-only; `Verified-by-Mutation` là outcome được thấy sau action được phép; `Inferred` là giả thuyết có nguồn; `Open Question` là gap. Không suy `Confirmed` từ quan sát. Boundary chỉ là candidate, không sinh edge tới destination như đã xác minh. Graph giữ `views`, `edges`, `danglingRoutes` legacy để consumer cũ hoạt động, bổ sung nodes/relationships giàu provenance; Mermaid render relationship xác minh, phân biệt boundary/gap mà không ngụ ý kết quả.

`docs/product/paco-overview.md`, `docs/product/workflows/*.md`, `docs/product/survey/views/*.md`, `docs/product/survey/roles/*.yaml` là cấu trúc tài liệu hiện hành. Workflow ghi mục đích thấy trên UI, role/context, ordered steps, branch, handoff, data dependency, mutation boundary, verified outcome, gap, `Execution guidance`, `Automation guidance`. Chỉ promoted evidence đã review/redact; raw evidence ở `test-results/product-survey/<run-id>/`. Mọi Markdown managed file giữ cuối file là `## Tester notes`; dùng `mergeManagedMarkdown()`, dừng khi conflict, không overwrite. Không ghi ticket expected result từ discovery.

## Mutation candidate và an toàn thực thi

`SURVEY` tạo candidate gồm ID, feature, source fingerprint, observed action, class (`CREATE`, `UPDATE`, `SEND`, `DELETE`, `EXTERNAL_SIDE_EFFECT`), destination hint **chỉ là giả thuyết**, reason, required owned/synthetic data, recipient requirement, source evidence, status. Mapping vào `MutationClass` hiện tại (`Temporary`, `Persistent`, `Destructive`, `Unknown`) phụ thuộc hậu quả cụ thể; unknown persistence luôn block cho đến khi có phân loại đáng tin. Không đổi semantics gate của ticket.

Authorization run/action/test-data phải được cung cấp bên ngoài agent, không sinh từ candidate, không lưu reusable authorization vào checkpoint. Ngoài `paco-explore-survey` workflow authorization tương thích gate hiện hành, `VERIFY_FLOW` xác minh rõ mutation class và, với destructive, authorization destructive riêng; gate hiện tại chỉ kiểm tra class của `MutationApproval` chứ không kiểm tra class của workflow authorization, nên executor **không** được dựa riêng vào `workflowMatches` để chứng minh destructive authorization. Mỗi action, kể cả cleanup, cần `PACO_ALLOW_MUTATION=true`, URL hiện tại đúng explicit dev hostname allowlist trong `paco.config.yaml`, safe owned/synthetic data, action/run/fingerprint match, `evaluateMutationGate()` pass. Destructive thêm `PACO_ALLOW_DESTRUCTIVE=true`. `SEND` yêu cầu recipient được approve rõ; external side effect yêu cầu destination dev được cấu hình và hiểu được tác động. Production/unknown host luôn block. Không tự bật flags hoặc tự cấp authorization.

Trước click mutation: ghi durable ledger `pending` gồm run/candidate/action, hash không chứa PII cho mutation fingerprint, redacted before-state, ownership proof reference, gate decision, timestamp. Reserve fingerprint trước side effect để crash không gây click lại. Sau click: ghi observed after-state, result, evidence, side effects, cleanup status/leftovers; graph chỉ thêm edge `Verified-by-Mutation` khi outcome thực sự quan sát. Resume gặp `pending` phải đối chiếu ledger và UI read-only; nếu không xác định chắc action chưa xảy ra, không retry tự động. Blocker không chặn task an toàn khác. Cleanup chỉ khi chứng minh đối tượng thuộc run và cleanup riêng được phép; thất bại hoặc không an toàn thì ghi leftovers, không xóa dữ liệu nền. Mutation nhằm mở state khám phá, không phải test assertion/correctness.

## CLI và kiểm thử

`npm run paco:discover -- --environment dev --role "Super Admin GB" [--run-id ...] [--resume] [--max-states N] [--max-actions N] [--max-minutes N] [--allow-mutation]`: mặc định read-only, chỉ chuẩn bị/kiểm tra checkpoint, in task kế tiếp và hướng dẫn mở discovery orchestrator trong cùng phiên Claude plugin. `--allow-mutation` chỉ yêu cầu planner xét candidate; không bật flags, không cấp authorization, không thực thi browser từ CLI. CLI không đọc auth state hoặc giả vờ xác nhận browser đã đăng nhập. Không hỗ trợ tự động thao tác qua Playwright CLI/browser riêng.

Fixture/mocks kiểm fingerprint normalization và phân biệt context; queue dedup, priority, cycle, requeue có lý do; legacy migration, atomic checkpoint/resume; budget; mutation fingerprint reservation/crash reconciliation; exact run/action/class authorization; host production/unknown; thiếu data/recipient; auth interruption; ledger, cleanup/leftovers; graph backward compatibility, provenance, boundaries; protected content và contract ticket v1. Không dùng live destructive actions để kiểm implementation. Chạy `npm run test:fixtures`, `npm run type-check`, `npm run validate` và `npm run graph:generate` khi cần; không thay đổi graph trước khi hiểu các uncommitted edits hiện có.

## Giới hạn

Autonomy chỉ duy trì khi phiên Claude và authenticated plugin tab còn hoạt động; role switch, auth expiry, permission blocker và thiếu test data/recipient vẫn cần tester. CLI độc lập không có browser control. Budget exhaustion là checkpoint, không chứng minh coverage. Observation và verified mutation không phải requirement hay expected result. Không mở rộng sang crawler không có workflow context, chạy ticket suite, bypass auth hoặc private API.
