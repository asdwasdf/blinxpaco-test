# Feature Location: PAC2-8611

**Input Revision:** 1
**Environment:** `dev`
**Role:** `Super User`
**Observed:** 2026-10-02
**Mode:** Read-only
**Route status:** `Confirmed`

## Target

- Feature: Assist Chat / Patient Records Agent v4
- Backend target from ticket: `POST /api/v1/patient-records-agent/:person_id`
- Search aliases: `Assist Chat`, `Patient Records Agent`, `PACO Talk`, `paco-assistant`

## Ordered entry path

1. Mở feature-branch dashboard `/paco/feature-branch/pac2-8611-authorization-context/dashboard`.
2. Dùng global patient search và chọn patient test do tester chỉ định (identifier đã redact khỏi artifact).
3. Trong patient profile, mở top-bar `More options`.
4. Chọn `PACO Assist` để mở side panel.
5. Chọn `Switch to Chat`.
6. Chat hiển thị textbox `Ask a question about this patient...`.

## Investigation

1. Manual authentication được xác minh với role `Super User` trong patient context.
2. Direct route `/paco/feature-branch/pac2-8611-authorization-context/paco-talk/` vẫn bị loại vì trả `Page Not Found`.
3. `PACO Assist` không phải sidebar route; entry phụ thuộc patient context qua top-bar `More options`.
4. Summary state hiển thị `PACO Assist`, `Summarise Patient Record` và các domain gồm `Medications`, `Recent Activity & Encounters`.
5. `Switch to Chat` mở chat state với textbox `Ask a question about this patient...`.
6. Private API probing không được thực hiện.

## Candidates

| Candidate | Result | Classification |
|---|---|---|
| Patient profile → `More options` → `PACO Assist` → `Switch to Chat` | Confirmed | `[Observed: dev, Super User, 2026-10-02]` |
| Feature-branch `/paco-talk/` | Rejected: `Page Not Found` | `[Observed: dev, 2026-10-02]` |
| `POST /api/v1/patient-records-agent/:person_id` | Backend target từ ticket; không probe trực tiếp trong locate | `[Confirmed]` from `requirements.md` / `ticket.md` |

## Budget

- Meaningful views: 6
- Ceiling: 12 views / 15 minutes
- Stop reason: feature root và chat entry đã xác minh.
- Mutation class: `None`

## Outcome

`Completed`: PACO Assist Chat entry được xác minh trên feature branch với role `Super User`. Route phụ thuộc patient context; `/paco-talk` không phải entry hợp lệ trên build này.

## Exact next action

Chuyển `EXPLORE`, ghi behavior/knowledge sync; sau `TEST_DESIGN`, chạy permission prompts trong `MANUAL_EXECUTE` với patient test đã được tester chỉ định và không đưa PII vào artifact.

## Tester notes

