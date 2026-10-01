# Product Survey Standards

## Scope

Survey toàn Paco trên dev, từng role đang đăng nhập. Đổi role thủ công rồi resume checkpoint riêng. Full-site survey chạy ngoài critical path của ticket.

## Traversal

- Dùng Claude Playwright plugin; `paco-discover` chọn task theo planner deterministic (`scripts/discovery-planner.ts`): module chưa khám phá → branch → cross-module handoff → read-only transition → authorized mutation candidate → alternate/empty/error variant.
- Fingerprint: `role + normalized URL + heading/module + tab + dialog/drawer + entity/context type + data-state variant`. Bỏ tracking query; query/path segment chưa phân loại hoặc nhạy cảm bị chặn thành gap.
- Mọi task phải có provenance (evidence, edge, gap hoặc candidate). Checkpoint `docs/product/survey/roles/<role>-<run>.discovery.yaml`, revision-checked, ghi atomic sau mỗi task.
- Mỗi transition thử một lần trên mỗi fingerprint trong một run; retry/reload không tạo state mới.
- Mutation fingerprint được reserve trước side effect và không bao giờ chạy lại tự động.
- Ceiling view/action chỉ chống runaway; đạt ceiling thì checkpoint và resume, không kết luận coverage đủ.
- Dùng observable waits; không fixed sleep hoặc private API.

## Collection

Lưu normalized route, title/heading, accessible controls, stable selector clues, transitions, role, environment, provenance và mutation outcome. Gộp records cùng cấu trúc thành view template. Không dump raw DOM, network payload, credentials hoặc PII.

## Mutation

Mode `survey` strictly read-only; dừng trước boundary và ghi mutation candidate. Chỉ `paco-verify-flow` thực hiện candidate đã reserve, đúng run/action/class/test-data/recipient của authorization tester cấp ngoài agent, khi environment `dev`, hostname allowlist và runtime guards qua `evaluateDiscoveryMutation()`/`evaluateMutationGate()`. Pending reservation sau crash chỉ được reconcile read-only; không retry tự động. `PACO_ALLOW_MUTATION=true` bắt buộc; destructive cần thêm `PACO_ALLOW_DESTRUCTIVE=true`. Production và hostname ngoài allowlist luôn bị chặn. Dùng synthetic/owned data; `Send` cần test recipient đã xác minh. Ghi ledger đã redact và cleanup an toàn, báo leftovers nếu cleanup thất bại. Form thiếu domain rule/test data an toàn phải `Blocked` và Ask QA early, không đoán.

## Knowledge

Markdown trong `docs/product/survey/views/` là nguồn chuẩn. `graph.json` và `graph.mmd` được generate. Relationship có provenance: `Observed`, `Verified-by-Mutation` (kèm `reservation_id`), `Inferred`, `Open Question`; boundary chỉ có `destination_hint`. `Observed`/`Verified-by-Mutation` không tự thành `Confirmed` hay expected result. Protected content conflict phải dừng.
