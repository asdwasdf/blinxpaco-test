# Product Workflows Registry

Registry cho flow nhiều page/state đã quan sát trực tiếp. Mỗi file mô tả behavior hiện tại để locate, chuẩn bị data, chạy phần read-only và hướng dẫn tester; không mô tả product intent nếu thiếu trusted source.

## Quy ước

- Một feature ổn định dùng một file `<feature>.md`; dùng `docs/templates/workflow.md`.
- Bắt buộc ghi environment, role, timestamp, evidence, starting data state và mutation boundary.
- Merge observation mới theo role/data variant; không ghi đè lịch sử còn đúng.
- Mọi workflow survey giữ classification `Observed`; nhiều observation không tự thành `Confirmed`.
- Ticket có thể dùng workflow làm navigation/setup/data/risk/coverage hint. Requirement và expected result vẫn phải có basis độc lập từ ticket hoặc trusted source.
- Route chứa patient ID, PII, credential, auth state, generated class hoặc fragile locator không được đưa vào registry.
- Raw evidence nằm tại `test-results/product-survey/<run-id>/`; registry chỉ chứa nội dung đã review/redact.

## Dùng khi có ticket

1. Match feature term/alias từ ticket với registry.
2. Re-verify route, role, context và starting state trên environment hiện tại.
3. Chạy các bước read-only có basis rõ.
4. Dừng tại approval stop; nếu chưa có approval, trả hướng dẫn manual cùng evidence cần capture.
5. Không dùng observed end state làm expected result nếu ticket/trusted source không xác nhận.
