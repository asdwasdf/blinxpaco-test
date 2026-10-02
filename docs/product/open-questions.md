# Open Questions

Knowledge gaps và contradictions cần clarification.

## Format

Mỗi question:
- Stable ID: `OQ-XXX`
- Status: Open/Answered/Obsolete
- Question text
- Impact: Critical/High/Medium/Low
- Evidence và related observations
- Answer source (khi answered)
- Date created, date answered

## Questions

### Tổng hợp từ 17 ticket (2026-10-02)

Dedupe từ 3 nhóm logic; `Status: Open`, `Created: 2026-10-02`, `Answered: -`. Impact là đánh giá sơ bộ.

**ID:** OQ-001
**Status:** Open
**Question:** Ticket nào/phiên bản nào đã chứa fix trên dev (BE+FE PR) để retest session delete/editor/booking
**Impact:** High
**Evidence:** PAC2-7786, PAC2-8241, PAC2-8552/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-002
**Status:** Open
**Question:** `Block Session` coexist hay thay `Delete Session`; role nào được xóa session; message khi session có booking; 'referenced as a template' có chặn delete
**Impact:** High
**Evidence:** PAC2-7786/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-003
**Status:** Open
**Question:** Footer `Session ends at` không khớp header sau khi xóa slot cuối; cần assert server rejection trực tiếp hay chỉ UI + no persistence; `PASSED QA on FB` mâu thuẫn video 'DEV not work'
**Impact:** Medium
**Evidence:** PAC2-8241/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-004
**Status:** Open
**Question:** Non-bookable slot có tính vào `Available` summary không; multi-holder dedupe theo appointment hay holder (Day vs Week đếm khác nhau)
**Impact:** High
**Evidence:** PAC2-7137/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-005
**Status:** Open
**Question:** Multi-book filter: `Location` union hay dedupe; 'newly added location' đồng bộ ra sao; chip `Location`/loading-vs-empty có bắt buộc; role test filter
**Impact:** Medium
**Evidence:** PAC2-8384/requirements.md, exploration.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-006
**Status:** Open
**Question:** Hiệu năng partition: build dev chứa commit nào, `EXPLAIN ANALYZE` (DB owner), error contract khi guard fail, reschedule trong scope, `appointment_status` semantics organisation
**Impact:** High
**Evidence:** PAC2-8552/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-007
**Status:** Open
**Question:** Fixture an toàn (session có booking, patient synthetic, cleanup owner, approval mutation) cho Book/Cancel/session edit
**Impact:** High
**Evidence:** PAC2-7786, PAC2-8241, PAC2-8552/status.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-008
**Status:** Open
**Question:** Scheduler double-book fix: đã merge/deploy tới môi trường nào, migration chạy UAT/prod chưa, route chính thức của scheduler link, độ trễ hủy slot cũ ở `Reschedule` (Disputed), phạm vi REQ-005
**Impact:** High
**Evidence:** PAC2-1805/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-009
**Status:** Open
**Question:** Phương thức xác thực scheduler, thông báo lỗi, cách lấy link/recipient an toàn cho child practice
**Impact:** Medium
**Evidence:** PAC2-6982/requirements.md (OQ-003)
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-010
**Status:** Open
**Question:** Rule truy cập Health Form với org ngoài phạm vi nhận campaign; behavior `Submit`/lưu câu trả lời; control path hợp lệ
**Impact:** Medium
**Evidence:** PAC2-6982/requirements.md (OQ-004)
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-011
**Status:** Open
**Question:** Shared campaign: `Failed` status nghĩa là gì; quyền edit shared campaign phụ thuộc hướng share; cần account single-org; ảnh hưởng đăng nhập Comms Hub từ demo org
**Impact:** High
**Evidence:** PAC2-7201/requirements.md, status.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-012
**Status:** Open
**Question:** Role/permission của 'practice user' cho Outbox/Shared Campaign
**Impact:** Medium
**Evidence:** PAC2-6540, PAC2-7201/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-013
**Status:** Open
**Question:** Đối chiếu deleted/inactive: nhóm 'deleted' nhưng deleted status `False`; công thức included − excluded vs `Not Sent`; thứ tự ưu tiên nhiều nguyên nhân không gửi
**Impact:** Medium
**Evidence:** PAC2-6540/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-014
**Status:** Open
**Question:** Popup `Scheduler Link Required`: khi nào đúng, 'scheduler link hợp lệ' là gì, fix mong muốn, pass condition cho lỗi intermittent
**Impact:** Medium
**Evidence:** PAC2-5776/requirements.md, PAC2-4700/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-015
**Status:** Open
**Question:** `Quick Send`: default channel `SMS` vs `Email`; OS khác dataset hay bug; `Send`/`Save as new Campaign` có trong scope; branch-context retention trên Connect; Rocketbar thiếu preview
**Impact:** Low
**Evidence:** PAC2-4700/requirements.md, report.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-016
**Status:** Open
**Question:** Campaign tags: role đại diện user có/không quyền update; fixture tag shared/removed đang attached; `Save as new Campaign` trong scope; feature branch hay dev đã chứa thay đổi
**Impact:** Medium
**Evidence:** PAC2-8522/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-017
**Status:** Open
**Question:** Blood-pressure code: `Code Rule Config` có phải nơi quyết định mapping; phạm vi migrate (DB change hay không); evidence legacy code không còn dùng
**Impact:** High
**Evidence:** PAC2-4399/requirements.md, exploration.md, report.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-018
**Status:** Open
**Question:** Health Form Inbox: nguyên nhân modal kẹt loading; HTTP 403 khi filing EMIS là authorization hay server rejection; quan hệ `Designer` vs `Designer V2`
**Impact:** Medium
**Evidence:** PAC2-4399/exploration.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-019
**Status:** Open
**Question:** Analyser: thứ tự đích/nhãn tab mới; eligibility column cho pivot; old search migrate in-memory hay persist; ngưỡng 'loads faster'; route đích của `Patient Analyser` sidebar
**Impact:** Medium
**Evidence:** PAC2-3798/requirements.md, exploration.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-020
**Status:** Open
**Question:** SSO: negative case (account chưa tồn tại hay thiếu organisation); message/route cuối; SSO identity an toàn và cách reset; nguồn chứng minh 'không auto-created'; `redirect_mismatch` là blocker hay failure
**Impact:** High
**Evidence:** PAC2-191/requirements.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-021
**Status:** Open
**Question:** Documents tab (PAC2-7466): role dùng test, cần role có/thiếu `View patient documents`; upload `Documents` vs inbox `Upload & analyse` là hai flow khác nhau
**Impact:** Medium
**Evidence:** PAC2-7466/status.md, PAC2-6763/exploration.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-022
**Status:** Open
**Question:** Document upload (PAC2-6763): định dạng/dung lượng, tín hiệu thành công, SLA phân tích, cleanup an toàn, role/feature flag, `PAC2-7193` hoàn thành chưa
**Impact:** Medium
**Evidence:** PAC2-6763/requirements.md, report.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-023
**Status:** Open
**Question:** Scheduler Configuration: proxy-enabled là precondition nhưng không có UI indicator; không có SLA tuyệt đối
**Impact:** Low
**Evidence:** PAC2-7669/requirements.md
**Created:** 2026-10-02
**Answered:** -


### Example Format

**ID:** OQ-001
**Status:** Open
**Question:** What happens when user submits duplicate request?
**Impact:** Medium
**Evidence:** Ticket PAC2-XXXX mentions duplication but no expected behavior
**Created:** 2026-09-09
**Answered:** -
