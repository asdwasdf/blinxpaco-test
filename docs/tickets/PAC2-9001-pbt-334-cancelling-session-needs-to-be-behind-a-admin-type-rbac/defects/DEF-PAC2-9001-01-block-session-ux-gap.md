# Defect: DEF-PAC2-9001-01 — Block Session click produces no dialog / no effect (UX gap, regression suspected)

**Ticket:** PAC2-9001 (PBT-334 — Cancelling session behind Admin RBAC)
**Input Revision:** 2
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-9001/`)
**Role:** Super Admin GB (Fiona Nguyen, auto-include P7032)
**Observed:** 2026-10-14T12:21:00Z (empty session) and 2026-10-15T09:30:00Z (booked session)
**Suggested Severity/Priority:** Medium / Medium

## Expected

Khi right-click vào appointment slot trong session → context menu hiển thị `Block Session` (enabled). Click `Block Session` phải mở confirmation dialog:
- Empty session: dialog `No patients are booked in this session` (per AC scenario 3).
- Booked session: dialog liệt kê affected patients với `Cancel & notify` / `Block without notify` (per AC scenario 2 + REQ-008).
- Sau khi confirm, `Available` slot count giảm và `Booked` count tăng/giảm tương ứng (per session block action semantics).

**Basis:** PAC2-9001/requirements.md REQ-008, REQ-002 scenario 3, AC table tony.do comment 14:31:47Z 2026-10-13. Video self-test 456.7s step 2/6 captured Block Session dialog. `[Confirmed]`

## Actual

Menu item `Block Session` enabled in slot context menu. Click produces:
- No dialog (DOM scanned: 0 dialog elements appear after click).
- No error toast.
- No visible effect on `Sessions 45 / Booked N / Available N` counts.
- Session `Booked` and `Available` counts unchanged after click + reload.

**Reproducible:** Yes. 2/2 attempts across 2 dates (14 Oct empty session with 48 slots; 15 Oct session with Booked=2, Available=902).

## Preconditions and Reproduction

**Preconditions:** Dev host `blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-9001/`. Super Admin GB role (auto-include P7032). Any session with at least one slot.

**Steps:**
1. Navigate to `/paco-connect/feature-branch/pac2-9001/appointment-book`.
2. Right-click on a session slot → context menu opens.
3. Verify `Block Session` is enabled in the menu (it is, in both 14 Oct and 15 Oct sessions).
4. Click `Block Session`.
5. **Expected:** Confirmation dialog opens. **Actual:** Nothing happens.
6. Reload the page → slot still active, counts unchanged.

**Diagnostic spec:** `playwright/tests/tickets/PAC2-9001-TC-006.spec.ts` records behavior across 2 dates. Spec does not assert pass/fail; it logs whether dialog appeared.

## Evidence

- `test-results/PAC2-9001/manual/rev-2/execution-log.md` — detailed step log per attempt.
- `test-results/PAC2-9001/manual/rev-2/final-report.md` — summary + manifest link.
- `test-results/PAC2-9001/manual/rev-2/config-sessions-kebab-menu.png` — Configuration kebab has 8 items (no Block Session).
- `playwright/tests/tickets/PAC2-9001-TC-006.spec.ts` — diagnostic spec.

## Mutation and Cleanup

**Class:** None (read-only investigation).
**Occurred:** No destructive action performed.
**Approval scope:** N/A.
**Cleanup status:** N/A.
**Leftover Identifiers:** None.

## Limitations

- Cannot confirm whether regression or original behavior — video self-test shows Block Session dialog (different build than current dev branch). Need dev team to confirm whether `Block Session` action is wired in current dev code, or whether it's a regression introduced by the P7032 RBAC split.
- Test data: empty session used in attempt 1 had no bookings; per AC scenario 3, empty session should still show a confirmation dialog. Booked session attempt (15 Oct, Booked=2) also produced no dialog, ruling out the "no patients = no confirmation" hypothesis.
- Diagnostic spec (TC-006) is non-assertive — it records behavior. A confirmatory test (asserting dialog appears) requires a dev fix or explicit confirmation of expected behavior.

## Tester notes

[Protected area]
