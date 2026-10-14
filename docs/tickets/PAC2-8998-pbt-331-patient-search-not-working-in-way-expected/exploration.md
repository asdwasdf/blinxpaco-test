# Exploration — PAC2-8998

**Generated:** 2026-10-13
**Environment:** dev (feature-branch)
**Host:** `blinx.dev.blinxpaco-np.com` (đã trong `paco.config.yaml` `allowedHosts`)
**Feature branch path:** `/paco/feature-branch/pac2-8998/...`
**Role:** Super Admin GB (Test Fiona Nguyen)
**Org:** General Practice (Demo Site) — 78,974 patients
**Mutation:** None (read-only)

## Scope observed

Read-only quan sát 2 search surface + nhiều query form để verify REQ trên feature-branch preview (theo Tony do's 12/10 15:13 test).

## Evidence tổng hợp (live query results)

| Query | Surface | Result | Heading | REQ covered |
|---|---|---|---|---|
| `Smitham` | PDS page | 1 result (PHOEBE EILEEN SMITHAM) | `Patient Search (1)` | baseline, REQ-002 |
| `phoebe smitham` | PDS page | 1 result | `Patient Search (1)` | REQ-002 any order |
| `Smitham, Phoebe` | PDS page | 1 result | `Patient Search (1)` | REQ-004 comma |
| `phoebe eileen smitham` | PDS page | 1 result | `Patient Search (1)` | REQ-002 multi-word incl middle name |
| `Eileen Smitham` | PDS page | 1 result | `Patient Search (1)` | REQ-002 middle+surname |
| `phoebe ` (trailing space) | PDS page | 1 result | `Patient Search (1)` | REQ-005 trailing |
| `smitham,` (trailing comma) | PDS page | 1 result | `Patient Search (1)` | REQ-005 trailing |
| `9449307539` (NHS) | PDS page | 1 result | `Patient Search (1)` | REQ-002 non-name field |
| `Smitham` | top-bar | dropdown + page auto-update to (1) | `Patient Search (1)` | top-bar route active |
| `a` | top-bar | dropdown appears | — | sanity |
| `name1` | top-bar | **"Results (50)" — 50 patient items** | — | **REQ-006 cap 50 Confirmed** |

## Top-bar dropdown breakdown (query `name1`)

`Results (50)` label = exact cap. 50 items rendered:
- Items: `name1000 surname1000`, `name10000 surname10000`, `name10001 surname10001`, `name10002 surname10002`, `name10003 surname1003`, `name10005 surname10005`, ... , `name10045 surname10045`
- Pattern: dev seeded data `name{N} surname{N}` literal — tức `name1` literal matched N=1, 10, 100, 1000, 10000, 10001, ... (substring)
- Tức **match là substring contains**, không phải word-boundary equals. Cập nhật: `name1` matches `name1000` (4 chars trailing) → Inferred về REQ-002.
- Footer: `Include deleted patients` checkbox.
- Clear button (`Clear search`) và `Patient actions menu` per item.

## Reusable insights cho test design

- **Hai search surface dùng cùng backend**: top-bar gõ `Smitham` cũng làm page heading update → `1`. Có thể test chéo.
- **Heading pattern**: `Patient Search (N)` — count ở heading, không phải "X of Y". REQ-006/007 UI affordance dùng heading count, không phải text "X of Y".
- **Top-bar dropdown có footer `Include deleted patients`** — toggle bổ sung có thể ảnh hưởng số lượng match. Note cho TC.
- **Dev test data có sẵn 2 patient đặc biệt:**
  - `PHOEBE EILEEN SMITHAM` (middle name, surname Smitham) — đủ cho REQ-002, REQ-003 (single-word first + middle + surname), REQ-004, REQ-005
  - Dev seeded `name{N} surname{N}` cho broad cap test
- **Dev KHÔNG có 2-word first name** (theo Tony note + observation này). REQ-003 (two-word first name) cần create data mới hoặc skip với reason.

## Console errors during exploration

Pre-existing, **không liên quan search**:
- `webchat/agent/appointments` 403 (8 lần) — background webchat widget call
- `assets/phone-calling-internal-tone-Bo7ahvtU.wav` 404 — missing static asset

REQ-009 (no errors) **Pass** cho search behavior (không có error/warning do search).

## Open questions resolved

1. **Top-bar = global header search:** Confirmed (đúng nghĩa "top-bar" của Tony).
2. **50-cap UI affordance:** `Results (50)` label trên dropdown; heading `Patient Search (N)` ở page. KHÔNG phải "X of Y" text.
3. **Broad search `name1` literal:** Confirmed là literal data mẫu (`name{N} surname{N}`).
4. **Risk-score ordering:** Chưa thấy UI hint nào về risk-score; vẫn là Open Question cho REQ-008.
5. **Two-word first name dev data:** Không có sẵn. Cần create mới hoặc skip với reason. Tony đã cover qua 15k prod sweep.

## Remaining open for TEST_DESIGN

- Có tạo patient test với 2-word first name (vd `Mary Jane`)? Tester confirm read-only → không. → REQ-003 chỉ có thể test trên prod-like data (không khả thi trên feature-branch) hoặc skip với reason.
- Role access: Super Admin GB confirm; Receptionist/Clinician/Admin còn lại — chưa test.

## Tester notes
