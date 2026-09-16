# Evidence: BH-41375 Video Analysis

**Source:** `ticket/PAC2-7201-investigate-shared-campaign-issue-for-macc-pcn/BH-41375.mp4`
**Analyzed:** 2026-09-14
**Classification:** Observed
**Environment:** Production (domain `nhs-comms-hub.blinxhealthcare.com`)
**Source:** Video BH-41375 gốc từ Jira ticket PAC2-7201 — được Beth Green xác nhận qua Slack là "from production environment" (2026-09-14)
**Status:** Complete

## Summary

Video ghi lại 2 view liên tiếp trên **production** tại Macclesfield PCN / Broken Cross Surgery — cung cấp ground truth cho expected behavior của hệ thống. Quan trọng: đây là production, **không phải dev**, và là môi trường gốc mà reporter Beth Green quan sát bug.

## Screenshot 1 — Macclesfield PCN (Home Organisation View)

**Context:**
- `Viewing data for: Macclesfield PCN`
- `Your Home Organisation: Macclesfield PCN`
- Tab: `Non-Shared Campaigns` (selected), `Shared Campaigns` (0) — Macclesfield không thấy campaign nào trong Shared

**Campaigns hiển thị (tất cả do Macclesfield PCN tạo):**

| Campaign | Status | Type | Created By | Shared To Orgs |
|---|---|---|---|---|
| MPCN - FeNO Testing Appointment | Patient-Initiated | Non-Shared | Macclesfield PCN | — |
| MPCN - Covid Spring 2026 Vaccination | Patient-Initiated | Non-Shared | Macclesfield PCN | — |
| MPCN - Women's Health Hub - Mirena Coil Fitting | Patient-Initiated | Non-Shared | Macclesfield PCN | — |
| MPCN - PI MACS Smears | Patient-Initiated | Non-Shared | Macclesfield PCN | — |
| MPCN - PI MACS... | Patient-Initiated | Non-Shared | Macclesfield PCN | — |
| MPCN - PI MACS... | Patient-Initiated | Non-Shared | Macclesfield PCN | — |
| MPCN - PI MACS... | Patient-Initiated | Non-Shared | Macclesfield PCN | — |

**Hành vi quan sát được:**
- Tất cả campaign đều **Non-Shared** (đúng)
- Macclesfield PCN (home org / creator) có đầy đủ icon: 👁️ View + ✏️ Edit + 🗑️ Delete
- `Shared Campaigns (0)` — Macclesfield không thấy bất kỳ shared campaign nào (trái với ticket mô tả campaign bị "missing" — có thể campaign đó ở trạng thái khác hoặc nằm ở org con)

**Đây là hành vi đúng** theo thiết kế: creator org có full quyền trên campaign mình tạo.

---

## Screenshot 2 — Broken Cross Surgery (N81632) — Shared-to Org View

**Context:**
- `Viewing data for: Broken Cross Surgery (N81632)`
- `Your Home Organisation: Broken Cross Surgery (N81632)` ← org gốc của account
- Tab: `Shared Campaigns (4)`

**Campaigns hiển thị (tất cả do Macclesfield PCN tạo, share sang Broken Cross):**

| Campaign | Created By Org | Shared To | Status | Actions |
|---|---|---|---|---|
| MPCN - FeNO Testing Appointment | Macclesfield PCN | Broken Cross Surgery | Patient-Initiated | 👁️ |
| MPCN - PI MACS Smears | Macclesfield PCN | Broken Cross Surgery | Patient-Initiated | 👁️ |
| MPCN - PI MACS LD | Macclesfield PCN | Broken Cross Surgery | Patient-Initiated | 👁️ |
| MPCN - PI MACS Child | Macclesfield PCN | Broken Cross Surgery | Patient-Initiated | 👁️ |

**Hành vi quan sát được:**
- Tất cả campaign có `Created By Organisation = Macclesfield PCN` (creator, KHÔNG phải Broken Cross)
- `Shared To = Broken Cross Surgery` (= org đang xem)
- **Chỉ có icon 👁️ View — KHÔNG có ✏️ Edit và KHÔNG có 🗑️ Delete**
- `Shared Campaigns (4)` — Broken Cross thấy 4 campaign được share từ Macclesfield PCN

**Đây là hành vi ĐÚNG theo thiết kế sản phẩm:**
> *"Organisations that this Campaign is shared with will be able to view it and its assets but will NOT be able to edit."*

---

## Key Findings

### 1. Production = Expected Behavior (Correct)

Trên **production** (BH-41375 video), hành vi hoàn toàn **đúng theo thiết kế**:
- ✅ Creator org (Macclesfield PCN) có đầy đủ View + Edit + Delete
- ✅ Shared-to org (Broken Cross) chỉ có View — không có Edit/Delete

### 2. Dev = Bug Behavior (Incorrect)

Trên **dev** (EXPLORE của ticket này, 2026-09-14), hành vi **khác biệt rõ rệt**:
- ✅ Creator org (Blinx Demo Site) có đầy đủ View + Edit + Delete
- ❌ Shared-to org (Redmoor Liverpool) **cũng có đầy đủ View + Edit + Delete** — **đây là bug**

### 3. Production vs Dev Discrepancy

| Aspect | Production (BH-41375) | Dev (PAC2-7201 EXPLORE) |
|---|---|---|
| Environment | `nhs-comms-hub.blinxhealthcare.com` | `nhs-comms-hub-dev.blinxhealthcare.com` |
| Creator org | Macclesfield PCN | Blinx Demo Site |
| Shared-to org | Broken Cross Surgery | Redmoor Liverpool |
| Shared-to có Edit/Delete | **Không** ✅ | **Có** ❌ BUG |

### 4. Implications for PAC2-7201

**Giả thuyết khả dĩ:**

1. **Bug đã được fix trên production** — production đúng (View-only), dev còn code cũ có bug → dev không phản ánh trạng thái production thực tế
2. **Môi trường/code hoàn toàn khác** — production và dev deploy độc lập, không sync về tính năng shared campaign permissions
3. **Bug chỉ xảy ra với cặp org cụ thể** — Redmoor Liverpool + Blinx Demo Site có vấn đề riêng, không phải bug chung

### 5. Mismatches with Ticket Claims

**Ticket claim:** "campaigns do not show up in the home organisation of Macclesfield PCN, and thereby cannot be managed"
- **Thực tế trên video:** Macclesfield PCN thấy 7 Non-Shared campaigns, nhưng **Shared Campaigns = 0** — có thể campaign "Adult Blood Test" thiếu nằm trong phạm vi **Shared** (đã share từ parent PCN sang site con), không phải Non-Shared → có thể là bug riêng biệt với bug quyền Edit/Delete

**Ticket claim:** "the campaign status is set to 'Failed'"
- **Thực tế trên video:** Các campaign hiển thị `Patient-Initiated` status — không thấy `Failed` trong các screenshot. Có thể status `Failed` hiển thị trong phần khác (Campaign Details), không phải trong bảng list

---

## Evidence Classification

| Claim | Source | Classification |
|---|---|---|
| Production shared-to org chỉ có View | BH-41375 video, Screenshot 2 | **Observed** (direct) |
| Creator org có đầy đủ quyền | BH-41375 video, Screenshot 1 | **Observed** (direct) |
| Dev shared-to org (Redmoor) có Edit/Delete | EXPLORE OBS-PAC2-7201-003/004 | **Observed** (direct) |
| Bug chỉ xảy ra trên dev, production đúng | Infer from comparison | **Inferred** |

---

## Sensitive Data Review

- Tên campaign (MPCN - FeNO, PI MACS, etc.) — không chứa thông tin bệnh nhân
- Tên nhân sự (Victoria F, Alex Paul, Nicholas) — thông tin nhân sự nội bộ, có thể cần redact nếu shared rộng
- Không có dữ liệu bệnh nhân trong các screenshot

---

## Related Artifacts

- `requirements.md` — REQ-PAC2-7201-003 (creator giữ quyền), REQ-PAC2-7201-001 (campaign hiển thị ở home org)
- `exploration.md` — OBS-PAC2-7201-003/004 (dev bug behavior)
- `automation-review.md` — TC-001/TC-002 gate evaluation

## Next Actions

1. Xác nhận với dev team: version hiện tại của dev có đang có bug quyền Edit/Delete không, hay đã fix?
2. Nếu dev chưa fix: báo cáo bug với evidence từ dev (Redmoor Liverpool)
3. Nếu dev đã fix: ticket PAC2-7201 có thể đóng — production không có bug
4. Cần xác minh riêng claim "campaign Adult Blood Test không xuất hiện ở Macclesfield PCN" — trong video không thấy campaign nào ở trạng thái Shared tại Macclesfield, có thể campaign đó tồn tại ở trạng thái khác hoặc đã bị xóa

## Tester notes

[Protected area]
