# Traceability Standards

## Traceability Chain

```
Product Workflow Observation (optional navigation/setup/coverage hint)
  ↘
Ticket/Trusted Source
  → Ticket/Product Requirement
  → Feature Location (UI-dependent only)
  → Test Case 
  → Automation (optional)
  → Test Run 
  → Evidence 
  → Defect (if failed)
```

Workflow observation không thay ticket/trusted source và không xác lập expected result. Nó chỉ bổ sung route, prerequisite, data state, safe steps, risk và coverage; route/context phải re-verify trên run hiện tại.

## Required Links

Mỗi test result phải trả lời:
- Test requirement nào?
- Classification và source nào hỗ trợ expected result?
- Environment, role, input revision nào?
- Nếu phụ thuộc UI: valid `feature-location.md`, ordered entry path và context nào?
- Evidence ở đâu?
- Có mutation không? Cleanup hoàn tất chưa?

## Test ID Convention

- **Ticket test:** `<TICKET-ID>-TC-001` (e.g., `PAC2-5776-TC-001`)
- **Regression test:** stable ID riêng, link về ticket nguồn

## Evidence Requirements

- Screenshot/trace file path hoặc reference; từ REPORT trở đi phải dùng durable path dưới `docs/tickets/<ticket-folder>/evidence/`, không dùng `test-results/`
- Timestamp và environment
- Role/permission context nếu liên quan
- Test case ID và expected vs actual result

## Defect Traceability

- Defect link về failed test case
- Test case link về requirement
- Requirement link về ticket source hoặc observation
- Full chain từ ticket → defect phải traverse được
