# Ticket Artifacts

Mỗi ticket được xử lý tạo một folder tại đây với cùng tên như source folder.

## Convention

Source: `ticket/<TICKET-ID>-<short-title>/ticket.md`
Output: `docs/tickets/<TICKET-ID>-<short-title>/`

## Artifact Ownership

| File | Owner | Others |
|------|-------|--------|
| `manifest.yaml`, `status.md` | `paco-ticket` | Read-only |
| `requirements.md` | `paco-requirements` | Read-only |
| `exploration.md` | `paco-explore` | Read-only |
| `test-cases.md` | `paco-test-design` | Read-only |
| `automation.md` | `paco-playwright` | Read-only |
| `report.md` | `paco-report` | Read-only |

## Protected Content

Mọi file có section `## Tester notes` là protected. Skill merge cẩn thận hoặc dừng nếu conflict.
