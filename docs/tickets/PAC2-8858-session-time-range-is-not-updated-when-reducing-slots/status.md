# PAC2-8858 — Status

**Phase:** EXPLORE (in progress)

## Summary

Session time range không update khi reduce slots. Có 2 issue:
1. **Issue chính (REQ-001)**: End time range header không update khi xóa slot — Start time fix đã pass (Alexander Paul), end time cần verify
2. **Issue mới (REQ-003, REQ-004)**: Popup "Slots run past the session end" xuất hiện mỗi lần edit sau khi extend session

## Requirements extracted

| ID | Requirement | Classification |
|----|-------------|----------------|
| REQ-001 | Session end time update khi xóa slots | `Confirmed` |
| REQ-002 | Session start time update khi xóa slots đầu | `Confirmed` (đã fix) |
| REQ-003 | Popup chỉ hiện khi action đẩy slots ra ngoài | `Confirmed` |
| REQ-004 | Popup chỉ hiện một lần per conflict action | `Observed` |

## Video evidence

- `video/video-notes-128884.md` — Daniel Farley FAIL (session end time not update)
- `video/video-notes-128920.md` — Alexander Paul Third QA (popup bug)

## QA History

| Tester | Date | Result | Note |
|--------|------|--------|------|
| Daniel Farley | 2026-10-06 | Fail | Time không update khi xóa slot |
| Sean Huynh | 2026-10-06 | Pass | QA on DEV |
| Alexander Paul | 2026-10-06 | Fail | Incognito + hard reload confirm |
| Alexander Paul | 2026-10-06 | Pass (partial) | Start time fix OK, new popup bug |
| tony.do | 2026-10-06 | Tested on FB | Latest |

## Next

Run `paco-explore` mode `observe` để observe session editor behavior và test REQ-001 (end time update), REQ-003/004 (popup bug).

## EXPLORE progress (2026-10-06)

**Test data observed (5 sessions on 6 Oct 2026):**
- Sophie Friar / PC 24 Test Sophie PC24 HQ / 08:00 - 16:15 / 48 slots
- Mr Matthew Lynas / PC24 Test Matt / 08:00 - 16:10 / 47 slots
- Mickey Mouse3 / **OMP QA 8858-8859** / **18:10 - 19:00** / **3 slots** — best candidate for popup bug (small session, easy to extend/test)
- Chloe Stephens / PC24 Test Chloe PC24 HQ / 08:00 - 16:00 / 48 slots
- Prof Jayde Turner / PC24 Test Simon PC24 HQ / 08:00 - 16:00 / 48 slots

**Confirmed:**
- Pencil icon (`svg.fa-pencil`) cạnh session name mở Edit Session dialog (session properties, không có slot list)
- Tester screenshot confirm dialog "Edit Session" hiện được bằng click trực tiếp vào chevron/time-range area

**Open question:**
- Slot editor (có slot list + footer "Session ends at: XX:XX" + Save) là dialog riêng — mở bằng cách nào? Có thể là context menu `Edit Session` chứ không phải pencil icon.

**Pending actions:**
- Hỏi tester cách mở slot editor dialog (context menu vs pencil vs chevron)
- Test REQ-001: xóa slots cuối session, kiểm tra end time update
- Test REQ-003/004: extend session → edit khác → popup "Slots run past the session end"

**Next:** Tiếp tục EXPLORE sau khi tester confirm cách mở slot editor.

## Tester notes

[Protected area]
