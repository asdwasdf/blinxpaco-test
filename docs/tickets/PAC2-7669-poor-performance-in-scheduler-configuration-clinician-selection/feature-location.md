# PAC2-7669 — Feature Location

**Ticket:** PAC2-7669
**Date:** 2026-10-01
**Role observed:** `Blinx Deployment` (tester xác nhận quyền tương đương admin)
**Environment:** `dev`

## Verified Route

1. Mở trực tiếp feature-branch route `/configuration/`.
2. Xác nhận page title `Scheduler Configuration` và heading `Scheduler Config`.

**Final URL:** `https://pac2-7669.dev.blinxpaco-np.com/configuration/`
**Reusable path:** `/configuration/`
**Route status:** `Confirmed` cho run PAC2-7669.

## Landmarks

- Page title: `Scheduler Configuration`.
- Heading: `Scheduler Config`.
- Control: `Search Templates...`.
- Mapping action: `Edit` mở dialog `Edit Connections`.
- Clinician control: `Select a clinician` trong existing mapping.

## Required Context

- Chọn existing template mapping trước khi bấm `Edit`; mở dialog global không bảo đảm có clinician field.
- `EMIS` mapping dùng slot source `emis`.
- `PACO Connect` mapping dùng slot source `paco-connect`.
- Draft clinician selection là mutation `Temporary`; không bấm `Save`, cleanup bằng `Cancel`.

## Provenance

- `[Observed: dev, Blinx Deployment, 2026-10-01]` Route và landmarks được verify trên feature branch `pac2-7669` trong manual execution.
- Shared-dev route trước đó đã superseded và không dùng để kết luận ticket.

## Tester notes

[Protected area]
