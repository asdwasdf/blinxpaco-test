# Feature Map

Index các feature của Paco và coverage status.

## Format

Mỗi feature entry:
- Feature name và category
- Coverage level: Unknown/Minimal/Partial/Substantial/Reviewed
- Ordered `Entry` không chứa ticket-specific test data
- `Role observed`, `Environment`, `Classification: Observed`
- `Source`, `Last verified`, aliases
- Link tới requirements detail và tickets đã test

Chỉ `paco-report` promote route đã verified sau report. Dùng allowlist từ `toSafeFeatureMapEntry()`; không lưu patient/NHS identifier, credential/auth detail, clinical/message content, ticket test data, raw generated class hoặc fragile locator. Route quan sát trên dev không tự thành product intent `Confirmed`.

## Features

*[Sẽ được populate khi process tickets thật]*

### Navigation
- Coverage: Unknown
- Requirements: N/A
- Tickets: None
- Updated: -

### Dashboard
- Coverage: Unknown
- Requirements: N/A
- Tickets: None
- Updated: -
