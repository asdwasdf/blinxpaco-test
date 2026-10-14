# Dev Reply — PAC2-8999 (2026-10-13)

**From:** Dev (via tester)
**Type:** Confirmation — feature branch URLs + test path
**Status:** Applied — unblocks `ANALYZE` → `LOCATE`

## Branches

- PACO Connect (book + cancel): `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8999/`
- PACO (audit view): `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-8999/`

Cùng host `blinx.dev.blinxpaco-np.com` đã có trong `allowedHosts`.

## Test path (per dev)

1. PACO Connect: book an appointment cho test patient, rồi cancel.
2. PACO: mở patient profile → Audit. Phải có entry `<user> cancelled appointment`.
3. Optional: check-in hoặc move appointment → cũng phải xuất hiện trong patient audit.

## Scope

- "Booking not logged" **không reproduce** trên dev → verify nhưng cảnh báo nếu ticket conflict.
- Cancel là scope chính.
- Check-in / move: optional, timebox dependent.

## Wording

- Cancel: `<user> cancelled appointment` (Confirmed từ dev).
- Booking / check-in / move: chưa có exact wording → ghi Open Question trong requirements.md.
