---
name: feature-location
description: LOCATE outcome cho PAC2-7727 - PACO Connect Access Denied Booking Error
metadata:
  type: ticket
  input_revision: 1
---

# Feature Location: PAC2-7727

**Input Revision:** 1
**Generated:** 2026-10-16
**Status:** completed

## Target

- **Feature/Scope:** Patient-facing scheduler — DFD booking link generation + transition error
- **Environment:** dev (`blinx.dev.blinxpaco-np.com` cho PACO; `dev.blinxscheduler-np.com` cho scheduler)
- **Role:** clinic (Johnny Bravo - Blinx Deployment, General Practice Demo Site)

## Search Order

1. Match `DFD` / `Digital Front Door` / `scheduler link` trong `docs/product/feature-map.md` — confirmed entry: PACO Configuration → `Patient > DFD`.
2. Validate reusable route bằng 1–3 meaningful views (manual).
3. Bounded scan từ dashboard nếu route stale/missing.

## Candidates

| # | Candidate | Path/Route | Status | Source |
|---|-----------|-----------|--------|--------|
| 1 | PACO Configuration > Patient > DFD | `/paco/configuration/organisation/general` → sidebar `Patient > DFD` → loads `https://blinx.dev.blinxpaco-np.com/configuration/#dfd-config` | **Confirmed** | Manual session 2026-10-16 |
| 2 | Scheduler landing page | `https://dev.blinxscheduler-np.com/patient-self-booking/#<jwt>` | Observed (video 30s) | video 2026-08-19 |
| 3 | Error page `Link Error` | Scheduler host (exact route chưa capture) | Observed (video 60s) | video 2026-08-19 |
| 4 | Web form recovery | `https://dev.blinxscheduler-np.com/web-form/?wf=...` | Observed (video 90s) | video 2026-08-19 |

## Budget

- Views used: 4 (login → location-roles → configuration → DFD Config page)
- Views limit: 12
- Elapsed minutes: ~3
- Minutes limit: 15

## Outcome

- `outcome`: completed
- `confidence`: high
- `route_status`: Confirmed

## Validated Entry Path

1. Login: `https://blinx.dev.blinxpaco-np.com/paco/dashboard` (auth manual, role clinic, location "test again")
2. Sidebar → click icon `Configuration` → loads `/paco/configuration/organisation/general`
3. Sidebar submenu → click `Patient` (button expanded)
4. Trong submenu Patient → click `DFD` (treeitem id `PATIENT_CONFIG_DFD_CONFIG`)
5. URL chuyển sang `https://blinx.dev.blinxpaco-np.com/configuration/#dfd-config` — title "DFD Config"
6. Page liệt kê các campaign (vd: `MAR GB Copy Test`, `Alex & Mike Campaign Test`, `PACO DEMO DFD`, v.v.). Mỗi campaign có button `+` để copy DFD booking link.
7. (Theo `paco-scheduler-booking-link-flow` memory) Click `+` → generate/copy link với JWT token trong URL fragment.

## Warnings / Blockers

- Không có.
- DFD Config page là SPA nặng (snapshot ~226k tokens), không thể snapshot full → chỉ lấy labels/buttons qua evaluate.

## Next Action

Sync `docs/product/feature-map.md` (Patient DFD module) → dispatch `paco-explore` mode `observe` cho defect verification trên dev hiện tại.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
