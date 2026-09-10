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
| `automation.md`, Playwright ticket source | `paco-playwright` | Read-only |
| Raw Playwright artifact | Playwright runner | Chỉ tham chiếu, không copy secrets vào docs |
| `report.md`, `defects/**`, curated `evidence/**` | `paco-report` | Read-only hoặc proposal |
| `docs/test-runs/**` | `paco-report` | Chỉ tạo khi có run thật |

Child skill được gọi trực tiếp chỉ ghi artifact thuộc ownership và trả checkpoint proposal. Chỉ `paco-ticket` được cập nhật `manifest.yaml`/`status.md` sau khi verify artifact và checksum.

## Protected Content

Mọi Markdown do skill quản lý phải có đúng một final section `## Tester notes`. Skill giữ nguyên section này theo byte hoặc dừng nếu merge không an toàn.

Raw runner artifact ở `test-results/`, không đưa authentication state, token, cookie hoặc dữ liệu nhạy cảm vào report/evidence.
