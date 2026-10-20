# Feature Location: PAC2-7579 — PACO Assist Copying Campaign Tag Configuration

**Survey scope:** dev host `blinx.dev.blinxpaco-np.com` (PACO và PACO Connect)
**Budget used:** ~10 views / 15 min (bounded scan)
**Role observed:** `Blinx Deployment` (Johnny 2255, org `General Practice (Demo Site)`)
**Updated:** 2026-10-19T16:30:00Z

## Routes surveyed

| Route | Status | Notes |
|---|---|---|
| `/paco/dashboard` | ✅ 200 | Dashboard chính PACO |
| `/paco/quick-send` | ✅ 200 | Quick Send Campaigns UI - tabs Templates/Campaigns/Tags |
| `/paco-connect/dashboard` | ❌ 404 | Survey xác nhận mainline PACO Connect dashboard 404 |
| `/paco-connect/campaigns` | ❌ 404 | 404 |
| `/paco-connect/campaigns/create` | ❌ 404 | 404 - target URL cho PACO Assist copy |
| `/paco-connect/quick-send` | ❌ 404 | 404 |
| Comms Hub `/commshub/campaign-manager` | ✅ 200 | Comms Hub có campaign list (4135 Non-Shared, 445 Shared) |

## Findings

- **PACO Connect campaigns create KHÔNG accessible trên dev chung** - URL `/paco-connect/campaigns/create` trả 404.
- Theo video evidence (frame_003): URL pattern là `/paco-connect/campaigns/create?campaignId=<uuid>&copyFrom=<uuid>`
- Comms Hub có campaign list nhưng không có PACO Assist entry từ Comms Hub interface.
- Feature-map ghi nhận: `/paco-connect/dashboard` (mainline) survey ghi 404, feature-branch `/dashboard` hoạt động (`PAC2-4700`, `PAC2-7786`).

## Reusable routes

- `/paco/quick-send` - Quick Send Campaigns (PACO, có tabs Templates/Campaigns/Tags)
- `/commshub/campaign-manager` - Comms Hub Campaign Manager (campaign list, create campaign)

## Implications for PAC2-7579

- **LOCATE blocked**: feature `/paco-connect/campaigns/create` không tồn tại trên dev mainline.
- Cần feature-branch đã deploy để test PACO Assist campaign copy flow.
- Video evidence cho thấy feature từng hoạt động - có thể đã bị remove hoặc cần specific environment.

## Recommendation

- Phase LOCATE kết thúc **Blocked (technical)**: feature không accessible trên dev chung.
- Chuyển phase REPORT với kết quả **Blocked** và yêu cầu tester cung cấp feature-branch hoặc confirm environment khác.

## Tester notes

[Protected area - survey done trên dev chung `blinx.dev.blinxpaco-np.com`. Kết luận: PACO Assist campaign create route 404. Decision: báo BLOCKED và yêu cầu tester cung cấp đúng environment/branch.]
