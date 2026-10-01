# Paco Dev Autonomous Mutation Policy Design

**Ngày:** 2026-09-21

## Mục tiêu

Giảm tối đa permission prompt trong Paco QA. Trên Dev đã được allowlist, Paco tự thực hiện mọi thao tác cần thiết để test, gồm `Create`, `Update`, `Delete`, `Submit`, `Approve`, `Reject`, upload, import, download, gửi tới test recipient và cleanup phù hợp.

## Ranh giới authorization

Một thao tác được tự chạy khi đồng thời thỏa:

- `environment` là `dev`.
- Host nằm trong `safety.allowedHosts` hoặc `safety.externalDevHosts` của `paco.config.yaml`.
- Thao tác phục vụ trực tiếp ticket, test case hoặc product survey hiện tại.
- Không cần sử dụng dữ liệu riêng tư thật.

Không cần approval theo run, case, action hoặc mutation class. `Temporary`, `Persistent`, `Destructive` chỉ còn là metadata phục vụ báo cáo và cleanup; không phải permission gate.

## Khi phải dừng hỏi

Chỉ dừng và hỏi QA khi:

1. Cần nhập, đọc, gửi, lưu hoặc ghi artifact chứa dữ liệu riêng tư thật: credentials, auth token, cookie, PII, customer data hoặc production data.
2. Host là production, unknown hoặc không thuộc allowlist.
3. Ticket thiếu thông tin khiến không xác định được thao tác hay expected result cần kiểm thử.
4. Authentication cần người dùng tự hoàn tất login, SSO hoặc MFA.

Thiếu test data thông thường không phải blocker: skill tự tạo dữ liệu giả tối thiểu. Thiếu recipient không riêng tư: skill dùng test recipient đã cấu hình hoặc hỏi một lần nếu chưa có nơi an toàn để gửi.

## Runtime behavior

- Bỏ approval gate và các environment-variable guards `PACO_ALLOW_MUTATION` / `PACO_ALLOW_DESTRUCTIVE`.
- Thay `evaluateMutationGate()` bằng kiểm tra thực tế: environment, hostname, scope và sensitive-data boundary.
- Production/unknown host luôn bị chặn.
- Mutation ledger tiếp tục ghi action, test-data identifier, cleanup và leftover; phải redact dữ liệu nhạy cảm.
- Cleanup tự chạy khi không xóa dữ liệu nền hoặc làm mất evidence cần báo cáo.
- Không lặp mutation fingerprint nếu không cần cho coverage.

## Skill behavior

- `paco-ticket`: không yêu cầu approval; chỉ route và kiểm tra allowlist/sensitive boundary.
- `paco-explore`: `locate` vẫn read-only để tránh làm thay đổi state trong lúc tìm vị trí; `observe` và `survey` được mutation đầy đủ trên Dev khi cần kiểm thử.
- `paco-test-design`: vẫn ghi mutation class, side effects và cleanup nhưng không tạo approval requirement trên Dev.
- `paco-playwright`: tự execute selected cases trên Dev; không đánh dấu `Blocked` chỉ vì thiếu approval.
- Standards/templates/config dùng cùng một authorization contract.

## Artifact và provenance

Mọi result vẫn chỉ dùng `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`. Artifact ghi rõ environment, host, role, test data, mutations, cleanup, leftovers và evidence. Không ghi credentials, token, cookie hoặc PII chưa redact.

## Kiểm thử thay đổi

- Static scan không còn câu yêu cầu approval cho mutation trên allowlisted Dev.
- Static scan không còn reference tới phantom approval gate hoặc hai environment-variable guards.
- Scenario checks:
  - Allowlisted Dev + destructive test action: tự chạy.
  - Allowlisted Dev + synthetic data: tự chạy.
  - Allowlisted Dev + real PII/customer data: dừng hỏi.
  - Production/unknown host: chặn.
  - Login/SSO/MFA: chờ người dùng hoàn tất thủ công.
  - Missing expected result: hỏi QA, không tự suy đoán pass/fail.

## Ngoài phạm vi

Không nới quyền cho production. Không lưu credentials/auth state vào docs hoặc source. Không bỏ mutation ledger, cleanup tracking, evidence redaction hay protected `## Tester notes`.
