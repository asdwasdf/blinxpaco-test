# Feature Location — PAC2-8998

**Generated:** 2026-10-13
**Environment:** dev (feature-branch)
**Host:** `blinx.dev.blinxpaco-np.com` (đã trong `paco.config.yaml` `allowedHosts`)
**Feature branch path:** `/paco/feature-branch/pac2-8998/...`
**Role:** Super Admin GB (Test Fiona Nguyen)
**Org:** General Practice (Demo Site) — 78,974 patients

## Routes discovered

| Surface | Path | Control | Notes |
|---|---|---|---|
| Patient Search page | `/paco/feature-branch/pac2-8998/patient-search` | `textbox[placeholder="Search Patients..."]` | Heading `Patient Search (N)` updates; grid below |
| Top-bar search | `/paco/.../dashboard` (và mọi route vì top-bar global) | `textbox[placeholder*="Search patients by name or NHS number"]` | Cùng backend, dropdown panel |
| Dashboard entry | `/paco/.../dashboard` | sidebar `img[alt="Patient Search"]` icon | Routes to PDS page |
| Rocket Bar | sidebar `img[alt="Rocket Bar"]` | desktop launcher app | KHÔNG liên quan top-bar search |

## Observations

- `Observed` (dev, Super Admin GB, 2026-10-13T13:53Z): tổng patient 78,974 tại `General Practice (Demo Site)`. Đủ lớn để trigger cap 50 ở PDS panels (test với broad query).
- `Observed` (cùng session): patient test `PHOEBE EILEEN SMITHAM` (DOB 27/09/1947, NHS 944 930 7539, Fetcham, Surrey) tồn tại trong org này. Search `Smitham` → 1 result, heading update `Patient Search (1)`.
- `Observed`: response gần như tức thì (sub-second), tương ứng Tony note "about a fifth of a second".
- `Observed`: top-bar search box visible trên mọi trang (global header).
- `Inferred` (chưa verify): Rocket Bar icon trong sidebar = desktop app launcher (theo `docs/product/survey/views/rocket-bar.md`), KHÔNG phải top-bar search. Cần confirm trong EXPLORE nếu cần.

## Survey

- Bounded scan: 2 views (dashboard → patient-search). Tổng < 3 phút.
- Reusable route confirm: page-level search nằm tại `/paco/feature-branch/pac2-8998/patient-search`, route ổn định.
- Feature-branch prefix khác với survey `docs/product/survey/views/patient-search.md:9` (ghi `/paco/patient-search`); cập nhật survey hoặc note: feature-branch dùng `/paco/feature-branch/<key>/<route>`.

## Open questions (escalate to manual)

- Top-bar search: là web global header (theo dashboard placeholder) — **Confirmed** trong LOCATE.
- 2-word first name: chưa thấy patient nào có first name 2+ từ trong tổng 78,974 (chưa tìm hiểu sâu); tạo data mới qua `Create new patient` button nếu cần.
- 50-result cap UI affordance: chưa thấy; PDS page hiện heading count `(N)` thay vì "X of Y".

## Tester notes
