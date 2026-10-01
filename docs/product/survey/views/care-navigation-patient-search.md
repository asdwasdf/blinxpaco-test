---
id: care-navigation-patient-search
title: Care Navigation Patient Profile Search
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - patient-search
controls:
  - name: Search Patients...
    kind: search
  - name: A-Z Search
    kind: navigation
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Care Navigation Patient Profile Search

## Purpose and context

`Observed`: `Patients` → `Care Navigation` opens `/patient-search/` and displays `Patient Profile Search`.

## Entry and transitions

Landing state exposes `Search Patients...` and `A-Z Search`. `A-Z Search` exposed letters A–Z, a selector with `First Name` and `Last Name`, and initial guidance `Please Select A Letter To Begin Search`. Selecting `Q` under the default `First Name` mode produced explicit `No Results`; returning restored the standard search view. A synthetic no-match query produced explicit `No Patients Found` and `Showing 0 result` states plus `Include deleted patients`. Toggling `Include deleted patients` on retained the zero-result state; it was restored off before clearing search. `[Observed: dev, Super Admin GB, 2026-09-30]` Route vẫn hiển thị `Patient Profile Search`; synthetic no-match trả `No Patients Found`. Đã clear query; tại thời điểm snapshot ngay sau clear, grid vẫn ở zero-result state, chưa xác minh populated results sau khi settle. Không suy ra input normalization từ việc ký tự `_` không còn trong textbox sau nhập. No patient profile was opened.

## Execution guidance

- Search only approved test patients.
- Treat user, organisation, patient and profile content as sensitive.
- Capture route and control structure only during general survey.

## Automation guidance

- Stable landmarks: `/patient-search/`, `Patient Profile Search`, search input and `A-Z Search`.
- Patient-specific assertions require controlled test data.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-20. `A-Z Search` structure, `First Name`/`Last Name` mode options, and representative `Q` no-result state observed before returning. Synthetic no-match search produced explicit zero-result messaging; `Include deleted patients` toggled on and restored off while zero results remained, then search cleared. Reverified route/heading and no-match state 2026-09-30; query cleared before auth expiration on 2026-10-01. Mutation: `None`; no PII retained.

## Open questions

- Patient profile workflow remains unverified; positive-result A-Z behavior requires approved test-patient data.

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `Patients > Care Navigation` mở `Patient Profile Search` (`/patient-search/`) với `A-Z Search` và ô `Search Patients...`; không có view care-navigation riêng.

Gap / Open Question:

- Cần bệnh nhân synthetic được chọn (data dependency); tìm kiếm cần định danh bệnh nhân.

## Tester notes

[Protected area]
