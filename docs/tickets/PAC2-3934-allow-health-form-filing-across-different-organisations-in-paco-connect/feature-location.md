# Feature Location: PAC2-3934 — Cross-org Health Form Filing

**Survey scope:** dev host `blinx.dev.blinxpaco-np.com` (tester chọn thay vì add `pac2-3934.dev.blinxpaco-np.com` vào whitelist)
**Budget used:** 4 views / 15 min (trong limit 12 / 15)
**Role observed:** `Blinx Deployment` (Johnny 2255, org `General Practice (Demo Site)`)
**Updated:** 2026-10-18T03:05:00Z

## Routes surveyed

| Route | Status | Notes |
|---|---|---|
| `/paco/dashboard` | ✅ 200 | Dashboard chính; sidebar có Health Forms, Patient Search, Appointment Book (PACO Connect) nhưng KHÔNG có menu Consultation top-level. |
| `/paco-connect/dashboard` | ❌ 404 | Survey note đã xác nhận mainline PACO Connect dashboard 404; feature-branch mới chạy được. PAC2-3934 không có feature-branch. |
| `/paco/health-forms` | ✅ 200 | Health Forms Designer V2 — list template, có sẵn `AutoTest Consultation Form` × N. Không phải consultation screen. |
| `/paco/health-forms/inbox` | ❌ 404 | Route inbox 404 trên dev chung — không truy cập được. |

## Findings

- **Consultation screen KHÔNG accessible trên dev chung** ở thời điểm survey. Theo PAC2-5445 (linked blocker, Ready to Release) và memory note, consultation mode đang không mở được.
- **Consultation template (`AutoTest Consultation Form`) đã có sẵn** ở `/paco/health-forms`, owner là org hiện tại (`General Practice (Demo Site)`). Đây là template, không phải form đã file.
- **Không có UI entry rõ ràng** để user open consultation → file health form cross-org. Route `/paco-connect/*` cho consultation chưa được expose trên dev chung.

## Reusable routes

- `/paco/dashboard` (authenticated session) — landing page; có thể là global patient search. Cẩn thận: cross-org test cần role cross-org clinician (không phải Blinx Deployment).
- `/paco/health-forms` — Health Forms Designer; có template builder, có Consultation template đã tồn tại.

## Implications for PAC2-3934

- Không thể chạy AC1/AC2/AC3/AC4 trên dev chung vì **không có entry point** để user complete + file health form của patient thuộc Org khác.
- Linked blocker PAC2-5445 ("Unable to open consultation mode in connect") đang block ngược ticket này — consultation mode trước khi cross-org filing mới có ý nghĩa.
- Để chạy live, cần:
  1. Whitelist `pac2-3934.dev.blinxpaco-np.com` (host riêng đã có fix backend) — tester đã chọn không add.
  2. Hoặc unblock PAC2-5445 để consultation mode mở được trên dev chung.

## Recommendation

- Phase LOCATE kết thúc **Inconclusive/Blocked**: không có route consultation-accessible trên dev chung.
- Chuyển phase REPORT với kết quả **Blocked (technical)** do dependency trên PAC2-5445 + host whitelist thiếu. Không mark vì tooling/error.
- Nếu user muốn proceed bất chấp: có thể thử `/paco-connect/feature-branch/<branch>/<page>` nếu có branch PAC2-3934 đã deploy nhưng docs + ticket không cho thấy branch.

## Tester notes

[Protected area — survey done trên dev chung. Kết luận: consultation screen không accessible. Decision: chuyển REPORT với Blocked hoặc yêu cầu tester whitelist host riêng `pac2-3934.dev.blinxpaco-np.com` để chạy trên PR build.]
