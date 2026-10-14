# Requirements: PAC2-8867

**Input Revision:** 1
**Generated:** 2026-10-06T13:58:47Z
**Status:** Active

## Source Summary

Session trong folder được edit riêng rẽ (thay đổi length/time) → session rời folder, trở thành independent. Folder vẫn coi ngày đó là "missing". Khi folder được edit tiếp (thay đổi session length/start/end), folder cố tạo lại session cho ngày đó → clash với session independent đã tồn tại. Clash tool không rõ ràng session nào được keep/replace.

## Video Coverage

**Video Notes:** `video/video-notes.md`
**Contact Sheet:** N/A (subagent reviewed)

| Timestamp | Behavior | Requirement |
|---|---|---|
| 0:00 | Add Session dialog | Setup context |
| 1:22–3:21 | Navigation section (tester lost) | Không có bug flow |
| 2:30 | Template expanded — 3 duplicate sessions `AP Dupe Session Test` cùng tên | Evidence: duplicate sessions đã tồn tại |
| 4:00 | Edit Session dialog mở với `Session Name` **trống** | Bug manifestation: system không load session data |

## Atomic Requirements

### REQ-PAC2-8867-001

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Appointment Books / Folder Template / Session Management
**Search Terms/Aliases:** folder template, session folder, template session, edit folder, folder edit
**Known Location:** `Configuration` → `Appointment Books` → folder template
**Actor/Role:** Practitioner/Admin managing appointment books

**Preconditions:**
- Tồn tại folder template chứa ≥2 sessions
- Ít nhất 1 session trong folder được edit riêng (thay đổi time/length) → rời folder

**Expected Behavior:**
Khi folder được edit (thay đổi session length, start time, hoặc end time), folder **không tạo lại** session cho ngày mà session đã rời. Session independent được giữ nguyên, không bị replace hay duplicate.

**Provenance:**
- **Source:** ticket.md:14-15 (Issue description)
- **Input Revision:** 1
- **First Recorded:** 2026-10-06

**Evidence:** ticket/attachments/128874-Dupe session.mp4 (1:22-4:00)
**Related Tests:** [design phase]
**Notes:** Fix được mô tả trong comment tony.do 2026-10-06: folder ghi nhớ chỗ session đã rời (date + clinician group), skip khi tạo lại.

---

### REQ-PAC2-8867-002

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Clash Resolution Tool
**Search Terms/Aliases:** clash, duplicate session, save and replace, keep both, don't save
**Known Location:** Clash resolution dialog sau folder edit
**Actor/Role:** Practitioner/Admin

**Preconditions:**
- Session đã rời folder + folder edit tạo lại session → clash

**Expected Behavior:**
Clash tool phải **rõ ràng phân biệt** session nào là existing independent session và session nào là new session từ folder. Các action (Save and replace / Don't save / Keep both) phải nói rõ kết quả cho mỗi session.

**Provenance:**
- **Source:** ticket.md:17-19 (Suggested fix)
- **Input Revision:** 1
- **First Recorded:** 2026-10-06

**Evidence:** ticket/attachments/128874-Dupe session.mp4 (4:00)
**Related Tests:** [design phase]
**Notes:** Video frame 4:00 cho thấy Edit Session dialog có `Session Name` trống — system không load đúng session data khi mở edit.

---

### REQ-PAC2-8867-003

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Folder Template / Multi-clinician support
**Search Terms/Aliases:** clinician group, multiple clinicians, clinician assignment
**Known Location:** Unknown
**Actor/Role:** Unknown

**Preconditions:**
- Folder có nhiều clinicians trên cùng ngày
- 1 session của 1 clinician rời folder

**Expected Behavior:**
Khi folder edit, chỉ skip place (date + clinician group) của session đã rời. Các clinicians khác trên cùng ngày vẫn được tạo/updated bình thường.

**Provenance:**
- **Source:** ticket comment tony.do 2026-10-06 (14:09)
- **Input Revision:** 1
- **First Recorded:** 2026-10-06

**Evidence:** N/A (inferred from fix description)
**Related Tests:** [design phase]
**Notes:** Chưa có video evidence cho multi-clinician scenario.

---

### REQ-PAC2-8867-004

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Folder Template / Date tracking
**Search Terms/Aliases:** original date, moved session, session moved
**Known Location:** Unknown
**Actor/Role:** Unknown

**Preconditions:**
- Session rời folder và được move sang ngày khác

**Expected Behavior:**
Folder vẫn skip ngày **original** mà session đã rời, không phải ngày session move tới.

**Provenance:**
- **Source:** ticket comment tony.do 2026-10-06 (14:09)
- **Input Revision:** 1
- **First Recorded:** 2026-10-06

**Evidence:** N/A (inferred from fix description)
**Related Tests:** [design phase]
**Notes:** —

---

### REQ-PAC2-8867-005

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Pre-existing session handling / Legacy data
**Search Terms/Aliases:** before release, sessions before fix, legacy sessions
**Known Location:** N/A (pre-existing data)
**Actor/Role:** System

**Preconditions:**
- Session đã rời folder **trước** khi fix được deploy

**Expected Behavior:**
**Limitation**: Fix không cover sessions đã rời folder trước release. Ngày của các session này vẫn có thể bị duplicate khi folder được edit sau release.

**Provenance:**
- **Source:** ticket comment tony.do 2026-10-06 (14:09)
- **Input Revision:** 1
- **First Recorded:** 2026-10-06

**Evidence:** N/A (documented limitation)
**Related Tests:** [design phase]
**Notes:** Đây là expected limitation, không phải bug.

---

## Ambiguities and Conflicts

| Item | Resolution |
|---|---|
| Video frame 4:00 `Session Name` trống — đây là symptom của bug (folder recreate) hay bug khác (edit dialog không load)? | Disputed — cần verify trên app. Có thể là 2 bugs: (1) folder recreate session, (2) edit dialog không load session độc lập. |

## Open Questions

| Question | Impact | Action |
|---|---|---|
| Edit Session dialog mở với Session Name trống — đây là bug riêng hay manifestation của folder recreate? | Phân biệt 2 bugs vs 1 bug để design test đúng | Verify trên app khi folder edit sau khi session rời |
| Video không capture clash tool UI — không rõ exact options và text của clash resolution | Clash tool test design | Cần observe clash tool thực tế |
| DB change (paco-one-db #1000) đã deploy chưa trên dev environment? | Ảnh hưởng test strategy | Check deployment status trước khi test |

## Release Dependencies

- **paco-one-db #1000** — DB migration phải release TRƯỚC
- **paco-connect-be #763** — Backend fix

## Tester notes
