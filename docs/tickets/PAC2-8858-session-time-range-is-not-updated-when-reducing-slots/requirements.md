# PAC2-8858 — Requirements

## Source

- Ticket: `ticket/PAC2-8858-session-time-range-is-not-updated-when-reducing-slots/ticket.md`
- Source checksum: `sha256:2e4a1f4989af1c3cf0890869b85e55ddfe27d562c7a0e0821ad9a34d9a666cb5`
- Video evidence: `video/video-notes-128884.md`, `video/video-notes-128920.md`
- Imported: 2026-10-06

## Feature

**Module:** Appointment Book (PACO Connect)  
**Feature:** Session slot editor — `Edit Session` dialog  
**Location:** `/paco-connect/appointment-book` → right-click session → `Edit Session`

---

## Requirements

### REQ-001: Session end time tự động update khi xóa slots

**Classification:** `Confirmed` (from video evidence 128884)

**Trigger:** User mở `Edit Session` dialog, xóa một hoặc nhiều slots ở cuối session, click `Save`.

**Expected:** Session header time range (hiển thị trên agenda view) phải tự động update để phản ánh slot end time mới nhất của session. Nếu slot cuối cùng sau khi xóa kết thúc lúc 14:40, header phải hiển thị đúng `09:00 - 14:40` (không còn là `09:00 - 16:00`).

**Actual (trước fix):** Header vẫn giữ time range cũ (`09:00 - 16:00`) dù đã xóa slots. Red vertical timeline bar vẫn chạy đến thời gian cũ. Các slots đã xóa hiện `Empty Slot` placeholder.

**Source:** Video 128884 (Daniel Farley), comment Alexander Paul 2026-10-06 (incognito + hard reload confirm)

**Note:** Start time fix đã được verify pass bởi Alexander Paul. Issue còn lại là **end time** không update.

**Aliases:** `session header`, `time range`, `session ends at`, `end time`

---

### REQ-002: Session start time tự động update khi xóa slots đầu tiên

**Classification:** `Confirmed` (from Alexander Paul comment, verified pass)

**Trigger:** User mở `Edit Session` dialog, xóa slot(s) ở đầu session (slot đầu tiên), click `Save`.

**Expected:** Session header start time phải update theo slot đầu tiên còn lại.

**Source:** Alexander Paul 2026-10-06 comment

**Note:** Fix đã verified pass trên DEV.

---

### REQ-003: Popup "Slots run past the session end" chỉ hiện khi edit thực sự đẩy slots ra ngoài

**Classification:** `Confirmed` (from video evidence 128920)

**Trigger:** User đã extend session bằng cách thêm slot(s) trong cùng session editing. Sau đó, trong same sitting, user thực hiện bất kỳ edit nào khác (đổi slot type, đổi thời gian, v.v.).

**Expected:** Popup **không xuất hiện** khi edit không liên quan đến session length.

**Actual:** Popup xuất hiện **mỗi lần** edit sau khi session đã extend.

**Source:** Video 128920 (Alexander Paul Third QA), comment lines 82-116

**Popup exact text:**
- **Title:** `Slots run past the session end`
- **Body:** `One slot would end after the session ends at 16:25. Extend the session to 16:25 to keep them?`
- **Buttons:** `Cancel` | `Extend session to 16:25`

**Note:** Có grammar mismatch: "One slot ... them" (singular/plural). Cần verify khi count > 1.

---

### REQ-004: Popup chỉ xuất hiện một lần cho mỗi action gây conflict

**Classification:** `Observed` (from ticket description)

**Trigger:** User thực hiện edit đẩy slots ra ngoài session end, confirm popup.

**Expected:** Popup chỉ hiện một lần cho action đó. Sau khi accept/decline, user tiếp tục edit không liên quan mà không bị popup lại.

**Actual:** Popup reappear mỗi lần save sau khi đã extend.

**Source:** Alexander Paul comment

---

## Acceptance Criteria (từ Alexander Paul)

```
AC-1: Given đã extend session bằng cách thêm slot
      When edit phần khác (slot type, patient, v.v.)
      Then popup "Slots run past the session end" không xuất hiện

AC-2: Given edit đẩy slot past session end
      When confirm edit
      Then popup xuất hiện một lần

AC-3: Given accept hoặc decline popup
      When make further unrelated edits
      Then popup không reappear
```

---

## Open Questions

1. **Auto end time calculation:** Tại sao xóa slots khiến session end time tự động thay đổi từ 16:15 → 16:25? (video 128920 frame 0016)
2. **Grammar mismatch:** "One slot ... them" — singular/plural không khớp. Cần verify khi count = 2+.
3. **Popup wording:** "end AFTER 16:25" nhưng "Extend TO 16:25" — nếu slot end sau 16:25 thì extend to 16:25 không đủ? Cần xác minh logic.
4. **Empty slots sau xóa:** Slots đã xóa hiện `Empty Slot` placeholder — có bị xóa khỏi DB hay chỉ marked empty?

---

## Related Tickets / Knowledge

- `PAC2-8241`: Session editor — slot ngoài range bị từ chối với message boundary `[Confirmed]`
- `PAC2-8241` TC-007: Extend `Hours (To)` toast success nhưng không sinh slot
- `workflows/appointment-book.md#session-editor-và-khóa-field`

---

## Classification Summary

| ID | Requirement | Classification | Source |
|----|-------------|----------------|--------|
| REQ-001 | Session end time update khi xóa slots | `Confirmed` | Video 128884, Alexander Paul |
| REQ-002 | Session start time update khi xóa slots đầu | `Confirmed` | Alexander Paul (pass) |
| REQ-003 | Popup chỉ hiện khi action đẩy slots ra ngoài | `Confirmed` | Video 128920 |
| REQ-004 | Popup chỉ hiện một lần per conflict action | `Observed` | Ticket description |

---

## Tester notes

[Protected area]
