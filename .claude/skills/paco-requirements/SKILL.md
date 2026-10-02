---
name: paco-requirements
description: Use when analyzing selected Paco ticket sources into atomic requirements with classification and provenance.
---

# Paco Requirements

## Scope and dependencies
`ANALYZE` only. Require selected ticket, `ticket.md`, revision, output directory, and valid `INGEST`. Read knowledge/traceability standards and `docs/templates/requirements.md`. Do not browse Paco, design full tests, conclude fix status, or orchestrate later phases.

## Ownership
Write only `requirements.md`; `ticket/**` is read-only. Preserve final `## Tester notes` or stop.

## Workflow
1. Read primary and relevant supporting source. Khi ticket có `.mp4`/`.webm`, chạy `npm run video:ingest -- <input> <docs/tickets/<ticket>/video>`, coi video là requirement source; không bỏ qua vì model không phát video trực tiếp. Video là nguồn quan trọng; mục tiêu là hiểu đủ để **tái hiện lại được flow (≥80% hiểu rõ)**, không bắt buộc xem mọi frame. Review qua **subagent** `model: sonnet` (không Read ảnh trong phiên chính), theo 2 vòng: (1) **Tổng quan**: đọc `timeline` và contact sheet để nắm toàn bộ flow, chia thành các đoạn (màn hình/thao tác/kết quả); (2) **Đào sâu có chọn lọc**: mở frame chi tiết tại các điểm then chốt (chuyển màn, click/nhập liệu, popup/error, kết quả cuối, chỗ contact sheet không đọc rõ). Video dài thì chia đoạn cho nhiều subagent song song. Notes phải có: các bước tái hiện đánh số (màn hình, thao tác, dữ liệu nhập, kết quả quan sát), text/label/error nguyên văn, `OCR uncertain` kèm frame path cho chỗ mờ, và **mức hiểu tự đánh giá (%) kèm phần còn chưa rõ**. Dưới 80% thì mở thêm frame ở đoạn chưa rõ; vẫn không đạt thì ghi `Open Question` và hỏi QA. Subagent đọc mỗi ảnh tối đa một lần, ghi `docs/tickets/<ticket>/video/video-notes.md` (timestamp → hành động/UI state/text đọc được, kèm path frame làm evidence) và chỉ trả tóm tắt text. Phiên chính chỉ đọc `video-notes.md`; chỉ mở lại đúng 1 frame khi cần xác minh chi tiết cụ thể. `video-notes.md` đã tồn tại và video chưa đổi thì dùng lại, không review lại.
2. Summarize in Vietnamese; keep UI terms in backticks.
3. Split observable claims into stable atomic IDs.
4. Classify `Confirmed`, `Observed`, or `Inferred`; track missing knowledge as `Open Question`.
5. Record lifecycle, exact source/revision, dates, basis, evidence, and related tests.
6. For UI scope, extract exact feature terms, reasonable spelling aliases, actor/context, trigger nouns, target nouns, and known location or `Unknown`. Aliases support search only; never mark a route `Observed` without browser evidence.
7. Optionally read matching `docs/product/workflows/*.md` for search terms, actor/context, prerequisite and open-question hints. Survey workflow is not a requirement source: never create a requirement, expected behavior or `Confirmed` claim from it; record any conflict with ticket sources instead.
8. Keep missing Acceptance Criteria and OCR uncertainty explicit. Mark conflict `Disputed`; never silently choose a source.
9. Compare before write; preserve IDs and deduplicate sources/questions.

## Direct invocation, stop, outcome
Write only owned artifact and return checkpoint proposal; never edit manifest/status or call next skill. Missing source is `Blocked`; technical/merge error is `Failed`; ambiguity may warn. Return `ChildSkillOutcome` v1 with artifact action/checksum, counts, mutation `None`, sensitive-data status, blockers/warnings, and recommended next phase.
