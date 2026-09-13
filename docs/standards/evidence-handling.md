# Evidence Handling Standards

## Evidence Types

- **Screenshot:** PNG/JPG, annotated nếu cần
- **Trace:** Playwright trace files
- **Video:** chỉ khi cần thiết (không mặc định)
- **Network observation:** redacted request/response (loại bỏ token/cookie/personal data)
- **Console log:** relevant errors/warnings only

## Storage Location

- Large/raw artifacts: `test-results/` (local, Git ignored)
- Raw `LOCATE`: `test-results/<ticket-key>/locate/<run-id>/`
- Referenced in docs: link hoặc tóm tắt, không embed full artifact
- Evidence đã review/redact per ticket: `docs/tickets/<ticket-folder>/evidence/`

## Security Requirements

**Phải redact trước khi chia sẻ:**
- Credentials (password, token, API key)
- Cookies và session state
- Personal data (email, phone, address)
- Authorization headers
- Sensitive request/response body

## File Naming

Pattern: `<test-case-id>-<type>-<timestamp>.<ext>`

Example:
- `PAC2-5776-LOCATE-entry-20260913-103045.png`
- `PAC2-5776-TC-001-screenshot-20260909-103045.png`
- `PAC2-5776-TC-002-trace-20260909-104512.zip`

## Retention

- Evidence liên kết defect: giữ cho tới khi defect closed
- Evidence từ passed test: có thể xóa sau test run hoàn tất
- Regression evidence: giữ latest run only
