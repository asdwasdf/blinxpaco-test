---
name: paco-verify-flow
description: Use when paco-discover dispatches exactly one reserved, externally authorized Paco mutation candidate to observe the workflow state it unlocks on dev.
---

# Paco Verify Flow

Child `VERIFY_FLOW`. Mutation là cơ chế khám phá state, không phải test assertion; kết quả quan sát không phải requirement hay expected result.

## Đầu vào bắt buộc

Từ `paco-discover`: `run_id`, environment, role, `task_id`, checkpoint `revision`, `reservation_id`, đúng một mutation candidate (action, mutation class, test-data fingerprint, ownership ref, recipient/destination nếu có) và đường dẫn authorization do tester cấp. Thiếu bất kỳ mục nào → trả `blocked`, không click. Gọi trực tiếp không có reservation thì không được mutate, không tạo vòng lặp, không sửa checkpoint/ledger cha.

## Thực hiện

1. Dùng tab Claude Playwright plugin hiện tại. Xác minh trang authenticated, đúng role, URL hiện tại thuộc configured dev host trong `paco.config.yaml`. Không browser riêng, không private API, không đọc auth state.
2. Ngay trước click, đánh giá lại `evaluateDiscoveryMutation()` (bao gồm `evaluateMutationGate()`) với URL hiện tại và guard từ môi trường; mọi điều kiện phải pass: `PACO_ALLOW_MUTATION=true`, destructive thêm `PACO_ALLOW_DESTRUCTIVE=true` và authorization destructive riêng, `SEND` chỉ tới recipient đã approve, external side effect chỉ tới destination dev đã approve. Không tự bật guard, không tự cấp authorization.
3. Xác minh mutation thực sự cần thiết: state đích không đạt được read-only. Không cần → trả `no_change` kèm lý do, không click.
4. Ghi redacted before-state, thực hiện đúng một action của candidate, chờ bằng observable wait, ghi after-state, side effects và evidence. Không lặp click khi kết quả không chắc chắn; trả `indeterminate`.
5. Cleanup là action riêng: chỉ khi ownership thuộc run được chứng minh và có candidate/authorization/reservation cleanup riêng. Không xóa dữ liệu nền. Không cleanup được → ghi `leftovers`.
6. Auth hết hạn giữa chừng: điều hướng tab tới `/paco/login`, trả `outcome: blocked`, `auth_expired: true`; mutation đã có thể xảy ra thì `mutation.status: indeterminate`.

## Ownership và outcome

Chỉ ghi raw evidence ở `test-results/product-survey/<run-id>/` và tối đa view/workflow Markdown liên quan qua `saveManagedMarkdown()`, giữ final `## Tester notes`. Trả `DiscoveryChildOutcome` (`scripts/discovery-outcome.ts`) với `mode: VERIFY_FLOW`, `mutation.reservation_id` đúng reservation, `status: observed|indeterminate`. Relationship `Verified-by-Mutation` chỉ khi after-state thực sự quan sát được và gắn `reservation_id`. Không dùng `ChildSkillOutcome` v1 và không ghi ticket manifest/status.
