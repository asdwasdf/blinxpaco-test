---
id: comms-campaign-manager
title: Communications Hub Campaign Manager
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - comms-hub-submenu
controls:
  - name: Create Campaign
    kind: mutation
  - name: Campaign Outbox
    kind: navigation
  - name: Search campaigns
    kind: search
  - name: Clear Filters
    kind: button
  - name: Columns
    kind: grid-panel
  - name: Filters
    kind: grid-panel
  - name: Campaign Statuses
    kind: filter
  - name: Campaign Types
    kind: filter
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-p2-comms-campaign-manager-1
    from: comms-campaign-manager
    destination_hint: draft campaign
    trigger: Create Campaign
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-comms-campaign-manager-2
    from: comms-campaign-manager
    destination_hint: tin được gửi lại (SEND)
    trigger: Resend
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-comms-campaign-manager-3
    from: comms-campaign-manager
    destination_hint: recipient campaign thay đổi
    trigger: Add Selected
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-comms-campaign-manager-4
    from: comms-campaign-manager
    destination_hint: campaign được lưu
    trigger: Save
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p4-comms-campaign-manager-1
    from: comms-campaign-manager
    destination_hint: /commshub/analytics (patient-level)
    trigger: Analytics
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p4-comms-campaign-manager-2
    from: comms-campaign-manager
    destination_hint: /commshub/campaign-outbox
    trigger: Outbox
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p4-comms-campaign-manager-3
    from: comms-campaign-manager
    destination_hint: campaign bị sửa
    trigger: Edit
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p4-comms-campaign-manager-4
    from: comms-campaign-manager
    destination_hint: campaign bị xóa (DELETE)
    trigger: Delete
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p4-comms-campaign-manager-5
    from: comms-campaign-manager
    destination_hint: campaign được khôi phục
    trigger: Restore
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p4-comms-campaign-manager-6
    from: comms-campaign-manager
    destination_hint: campaign mới
    trigger: Create Campaign
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p4-comms-campaign-manager-7
    from: comms-campaign-manager
    destination_hint: file CSV chứa PII (download)
    trigger: Analytics > Export to CSV
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Communications Hub Campaign Manager

## Purpose and context

`Observed`: external Comms Hub dev exposes campaign management at `/commshub/campaign-manager`.

## Entry and transitions

Landing state contains campaign status/type filters, search, `Viewing data for` context selector, grid controls and `Campaign Outbox`. A synthetic no-match campaign query was entered and cleared without opening campaign rows. `Columns` exposed structural campaign, status, description, type, template, creator/organisation and audit fields; `Filters` exposed searchable per-column controls. Both panels were closed unchanged. The context selector was opened read-only: it exposed `Select All (2)`, two checkbox-backed organisation options, one currently selected option, and `Apply`. It was closed by toggling the selector without changing selection or activating `Apply`; organisation values are omitted.

`Campaign Statuses` offers `All Statuses`, `Draft`, `Inactive`, `Queued`, `In Progress`, `Sent`, `Failed`, `Paused`, `Deleted`, `Available Quick Send`, and `Available Patient-Initiated`. `Campaign Types` offers `All Types`, `Scheduled`, `Quick Send`, and `Patient-initiated`. Representative `Draft` and `Scheduled` filters were applied independently, then restored to `All Statuses` and `All Types`. No campaign row was opened.

`Campaign Outbox` was opened and documented separately. With explicit approval for synthetic mutation excluding real sends, `Create Campaign` was opened without entering data. The wizard exposed steps `Campaign Setup`, `Patient List`, `Date`, and `Review`; required campaign and patient-facing display names; send-method selection; campaign types/tags; optional appointment invitation and Health Form inclusion. `Next` remained disabled. Browser Back restored Campaign Manager. No draft was submitted or persisted. Context `Apply`, exports/downloads and live campaign rows remain untested pending controlled context/data and evidence-path validation.

## Execution guidance

- Confirm test organisation, recipient, campaign data and cleanup before creation or sending.
- Treat campaign grid and organisation context as sensitive.
- Opening `Create Campaign` is non-persistent until required fields advance the wizard; stop before entering data unless synthetic campaign data and cleanup are approved. Never advance to send/review confirmation without a controlled recipient.

## Automation guidance

- Stable landmarks: route, `Create Campaign`, `Campaign Outbox` and search.
- Do not assert dynamic campaign rows, statuses or counts without controlled fixtures.

## Evidence

Accessibility observation, external Comms Hub dev, authenticated session associated with Paco `Super Admin GB`, 2026-09-21. Synthetic no-match search cleared; `Columns` and `Filters` inspected unchanged; representative `Draft` and `Scheduled` filters applied independently, then defaults restored. `Viewing data for` exposed two selectable contexts plus `Select All` and `Apply`, then closed unchanged without applying. `Create Campaign` wizard structure inspected with no input; Browser Back restored landing state. Mutation: `None`; no campaign, template, staff, organisation or live-count values retained.

## Open questions

- Safe recipient, send boundary and cleanup process remain unspecified.
- Campaign Outbox landing/search is covered separately; communication details, context persistence, export contents and campaign details remain unverified.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `Campaign Manager` → `/commshub/campaign-manager` trên host Comms Hub, 9 row, kèm `SESSION EXPIRED`.

Gap / Open Question:

- `Resend` gửi lại tin cho bệnh nhân (SEND): cần recipient synthetic được duyệt.

## Discovery run-20261001-085609 (part 4 — Comms Hub deep dive)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- **Đính chính:** `SESSION EXPIRED` là modal ẩn, không phải banner.
- Nhóm `Non-Shared Campaigns (4115)`, `Shared Campaigns (445)`; cột `Campaign`, `Status`, `Description`, `Campaign Type`, `Email Template`, `SMS Template`, `Created By Organisation`, `Shared To Orgs`, `Created By`, `Created Date`, `Tags`, `Start/End Date & Time`, `Next Scheduled Date & Time`, `Repeat Interval`, `List`.
- Actions mỗi campaign: `Analytics`, `Outbox` (read-only); `Edit`, `Delete`, `Restore` (boundary).
- `Analytics` → `/commshub/analytics`: bảng cấp bệnh nhân (`Patient Name`, `NHS Number`, `Booked Appt.`, `Health Form Submitted`, `Gender`, `Age`, `Email Address`, `Mobile Number`) và `Export to CSV`; dữ liệu là PII nên không ghi.
- `Outbox`/`Campaign Outbox` → `/commshub/campaign-outbox`: chọn trong `Campaigns`/`Campaign Types`, `Search campaigns...`, `Search communications...`; bảng chỉ hiện sau khi chọn campaign.

Gap / Open Question:

- Danh sách giá trị `Status` chưa đọc được (cột bị ảo hoá).
- `Export to CSV` là download PII: cần approval.

## Tester notes

[Protected area]
