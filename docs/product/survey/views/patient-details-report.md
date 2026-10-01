---
id: patient-details-report
title: Patient Details Report
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - patient-analyser
controls:
  - name: Reports
    kind: tab
  - name: Search...
    kind: search
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-patient-details-report-1
    from: patient-details-report
    destination_hint: luồng recipient/campaign của Comms Hub (cross-module)
    trigger: Send to Comms Hub
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-patient-details-report-2
    from: patient-details-report
    destination_hint: luồng gửi tin nhóm
    trigger: Group Quick Send
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-patient-details-report-3
    from: patient-details-report
    destination_hint: saved report
    trigger: Save Report
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Patient Details Report

## Purpose and context

`Observed`: `Patient Details` is a distinct selected report state within `/patient-analyser-new/`.

## Entry and transitions

Select `Analytics & Reports` → `Patient Details`. Report list and grid refresh inside the shared analyser shell. Visible structural headers are age, date of birth, email address, full name, gender, and actions; 54 visible `role=row` elements include structural rows and must not be treated as a patient total. No row or action was opened.

## Execution guidance

- Treat all grid content as sensitive patient data.
- Capture only route, selected state and control structure.

## Automation guidance

- Assert selected state and shell landmarks only.
- Never place patient data in fixtures or evidence without explicit approved handling.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Grid headers and 54 visible structural rows observed; no row opened. Mutation: `None`; PII excluded.

## Open questions

- Data prerequisites and intended report fields remain unknown.

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `Patient Details` mở app `Patient & Medication Analyser` (`/patient-analyser-new/`), dùng chung cho `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details`. Control: `Advanced Search`, `Reset View`, `Expand All`, `Collapse All`, `Columns`.

Gap / Open Question:

- Kết quả chứa PII bệnh nhân nên chỉ ghi control.
- `Send to Comms Hub`/`Group Quick Send` là SEND boundary sang Comms Hub; cần cohort synthetic và recipient được duyệt trước VERIFY_FLOW.

## Tester notes

[Protected area]
