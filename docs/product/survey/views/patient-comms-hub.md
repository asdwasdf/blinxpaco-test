---
id: patient-comms-hub
title: Patient Comms / Comms Hub
routes:
  - comms-analytics
roles:
  - Super Admin GB
environment: dev
status: Observed
controls: []
verified_by: []
last_observed: 2026-10-01
---
# Patient Comms / Comms Hub

## Overview

**URL:** `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/`

Comms Hub là portal riêng cho patient communications, tách biệt khỏi Paco.

## Role & Environment

- **Site:** General Practice (Demo Site) (YGMQJ)
- **Auth:** Separate login từ Comms Hub domain

## Sections

### 1. Template Manager

**URL:** `/commshub/commshub/template-builder`

- Quản lý message templates
- Không liên quan health forms

### 2. Patient Manager

**URL:** `/commshub/patient-management`

- **Lists tab:** Danh sách tags/lists (không phải health form responses)
- **Patients tab:** Grid bệnh nhân với search
- Date range filter: 02/09/2026 - 01/10/2026
- Tags: Health Check Invites TH, Health Form Complete, HF Stop Send, etc.
- Không có health form response view trực tiếp

### 3. Campaign Manager

**URL:** `/commshub/campaign-manager`

- Tạo và quản lý campaigns
- Campaign Outbox
- Filter: Campaign Statuses, Campaign Types
- Không có health form response view

### 4. Analytics

**URL:** `/commshub/analytics`

- Campaign conversion metrics
- Date range: 01/10/2026 - 01/10/2026
- Stats: Conversion, etc.
- Không có health form analytics

### 5. Configuration

**URL:** `/commshub/configuration`

- Cấu hình Comms Hub

## Navigation

- Sidebar links to Paco modules:
  - Dashboard (Paco Connect)
  - Patient Search
  - Health Forms
  - Care Navigator
  - Configuration

## Observations

- **Observed:** Comms Hub không có health form response view riêng
- **Observed:** Health forms được quản lý từ Health Form Inbox trong Paco (`/health-forms/responses/`)
- **Observed:** Comms Hub tập trung vào campaigns và templates, không phải health form data

## Related Views

- `health-form-inbox.md` — Health Form Inbox trong Paco (nơi health form responses được quản lý)

## Tester notes

- Comms Hub cần separate login từ Paco
- Patient search trong Comms Hub không return health form data
