# Knowledge Classification

## Classification Levels

### Confirmed
- Nguồn: ticket Acceptance Criteria, trusted product document, BA/PO xác nhận bằng văn bản
- Example: "User `role` `Admin` can approve `request`"
- Marker: `[Confirmed]`

### Observed
- Nguồn: quan sát trực tiếp trên environment cụ thể
- Bắt buộc: role, timestamp, environment, evidence reference
- Example: "Dev environment, `Admin` role, 2026-09-08 10:30, screenshot evidence/obs-001.png"
- Marker: `[Observed: env, role, date]`

### Inferred
- Nguồn: suy luận logic có basis nhưng chưa xác nhận
- Bắt buộc: ghi rõ basis và cần xác nhận
- Example: "Nếu `Submit` button disabled, suy luận validation đang fail [cần xác nhận]"
- Marker: `[Inferred from: X, needs confirmation]`

### Open Question
- Knowledge còn thiếu hoặc mâu thuẫn
- Không phải classification của requirement
- Tracked riêng tại `docs/product/open-questions.md`

## Lifecycle States

- `Candidate`: mới trích xuất, chưa validate
- `Active`: đang áp dụng
- `Disputed`: có source mâu thuẫn
- `Superseded`: bị requirement mới thay thế (giữ link)
- `Retired`: không còn áp dụng (giữ lịch sử)

## Rules

1. Nhiều observation không tự biến thành Confirmed
2. Behavior hiện tại ≠ behavior đúng
3. Source mâu thuẫn → `Disputed` + open question, không tự chọn
4. Mọi classification cần provenance: source location, revision, timestamp
