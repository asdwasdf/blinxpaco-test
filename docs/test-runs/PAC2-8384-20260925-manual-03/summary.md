# Test Run: PAC2-8384-20260925-manual-03

**Ticket:** PAC2-8384  
**Input Revision:** 1  
**Environment:** dev  
**Role:** `Super Admin GB`  
**Date:** 2026-09-25  
**Overall:** Fail

## Results

- `PAC2-8384-TC-002`: Fail — `Location` returned `No results found` while both controlled sessions visibly showed `Temi PCN`.
- `PAC2-8384-TC-003`: Inconclusive — partial option coverage only.
- `PAC2-8384-TC-004`: Inconclusive — `Session Name` filter path only.
- `PAC2-8384-TC-001`, `PAC2-8384-TC-005`, `PAC2-8384-TC-007`: Not Run.
- `PAC2-8384-TC-006`: Inconclusive non-verdict; expected behavior remains `Inferred`.

## Traceability

- Report: `docs/tickets/PAC2-8384-fix-filtering-in-appointment-book/report.md`
- Defect: `docs/tickets/PAC2-8384-fix-filtering-in-appointment-book/defects/PAC2-8384-DEF-001.md`
- Execution ledger: `docs/tickets/PAC2-8384-fix-filtering-in-appointment-book/automation.md`

## Mutation and Cleanup

Owned Session A/B templates and occurrences deleted. Owned Book A/B archived. Active searches clear. Archived book history remains. Raw browser artifacts and affected-record CSV remain local-only; no auth state or sensitive data copied here.

## Tester notes

[Protected area]
