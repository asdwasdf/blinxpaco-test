# Paco QA Documentation

Living documentation cho Paco black-box testing.

## Structure

- `standards/` - Policy và quy chuẩn workflow
- `templates/` - Template cho artifact
- `product/` - Reusable product knowledge
- `tickets/` - Ticket-specific artifact
- `superpowers/` - Spec và plan

## Product Knowledge

Reusable knowledge tại `product/`:
- `feature-map.md` - Index feature và coverage
- `roles-permissions.md` - Role capability matrix
- `glossary.md` - Term definitions
- `open-questions.md` - Knowledge gaps
- `change-log.md` - Knowledge updates

## Ticket Artifacts

Mỗi ticket có folder riêng tại `tickets/<TICKET-ID>-<short-title>/`:
- `manifest.yaml` - Workflow state (machine-readable)
- `status.md` - Progress summary (human-readable)
- `requirements.md` - Atomic requirements
- `exploration.md` - Black-box observations
- `test-cases.md` - Test case specs
- `automation.md` - Playwright automation
- `report.md` - Execution results
- `defects/` - Defect reports
- `evidence/` - Screenshots, traces

## Usage

1. Skill tạo/cập nhật artifact
2. Tester review và thêm notes vào protected sections
3. Artifact không bị overwrite; conflict phải reconcile thủ công
