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

**ID:** OQ-024
**Status:** Open
**Question:** Với role `Super User` của PAC2-8611, ngoài medicines/prescribing thì appointments permission có bị thiếu không; domain nào được phép dùng làm control path; patient test có đủ restricted data để phát hiện leak không?
**Impact:** High
**Evidence:** PAC2-8611/requirements.md, exploration.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-025
**Status:** Open
**Question:** Appointment audit PAC2-8381: concise `booked this appointment` là row bổ sung hay thay field-level rows; label cuối `Booked By` hay `Actioned By`; timestamp tolerance; amendment có cần old/new value; `Care Navigation` tile/fixture/cleanup nào an toàn?
**Impact:** High
**Evidence:** PAC2-8381/requirements.md, feature-location.md, exploration.md
**Created:** 2026-10-02
**Answered:** -

**ID:** OQ-026
**Status:** Answered
**Question:** PAC2-8998 top-bar dropdown có phải global header search (vs. `Rocket Bar` desktop app launcher) không
**Impact:** Low
**Evidence:** PAC2-8998/exploration.md (LOCATE + EXPLORE)
**Created:** 2026-10-13
**Answered:** 2026-10-13
**Answer:** Yes. Top-bar = global header `Search patients by name or NHS number` (placeholder); `Rocket Bar` icon trong sidebar là desktop app launcher, không phải search. Route cùng backend PDS.

**ID:** OQ-027
**Status:** Answered
**Question:** PAC2-8998 UI affordance nào báo total match (Tony mô tả "X of Y" hoặc tương đương)
**Impact:** Low
**Evidence:** PAC2-8998/requirements.md (Open Question), exploration.md
**Created:** 2026-10-13
**Answered:** 2026-10-13
**Answer:** Top-bar dropdown dùng label `Results (50)` (cap cố định, không hiện total). PDS page dùng heading `Patient Search (N)` với N = total match. Hai cách khác nhau giữa hai surface.

**ID:** OQ-028
**Status:** Answered
**Question:** PAC2-8998 dev data có patient nào với 2-word first name để test REQ-003 không
**Impact:** Medium
**Evidence:** PAC2-8998/exploration.md
**Created:** 2026-10-13
**Answered:** 2026-10-13
**Answer:** Không. Dev seed `PHOEBE EILEEN SMITHAM` có `EILEEN` ở middle name (không phải first). Test đã chọn read-only scope (không tạo data) → TC-006 Skipped với reason; Tony đã cover qua 15,000 patient prod sweep.

**ID:** OQ-029
**Status:** Open
**Question:** PAC2-8998 AG Grid virtual scroll "buffer" rows (~48 unique first names) có vi phạm cap 50 không, hay là implementation detail không quan trọng (user chỉ thấy tối đa ~21 rows tại viewport)
**Impact:** Low
**Evidence:** PAC2-8998/evidence/manual-r1.json (TC-011)
**Created:** 2026-10-13
**Answered:** -

**ID:** OQ-030
**Status:** Open
**Question:** PAC2-9001 paco-one-db #1022 đã deploy trên dev host chưa? RBAC activity list tại `/paco/configuration/staff/role-groups` max P7507, có P7030 prerequisite nhưng P7032 (`Appointment Book Cancel Session`) không visible. Nếu P7032 chưa deploy, REQ-009 setup bị Blocked và REQ-001/006/007/008 không test được trên dev
**Impact:** Critical
**Evidence:** PAC2-9001/feature-location.md (R-4), PAC2-9001/requirements.md (REQ-009), PAC2-9001/requirements.md (OQ-1)
**Created:** 2026-10-13
**Answered:** -

**ID:** OQ-031
**Status:** Answered (with UX gap finding)
**Question:** PAC2-9001 `Block Session` trên session có ≥1 booking có gate bằng P7032 không? Video (step 2/6) test trên empty session (Conflict test 48 slots) → PASS. Chưa test trên session có booking. AC matrix chỉ nói `Block an empty session: all roles allow`, ambiguous khi session có booking
**Impact:** Medium
**Evidence:** PAC2-9001/requirements.md (REQ-004), PAC2-9001/video-notes.md (step 2/6), PAC2-9001/requirements.md (OQ-2)
**Created:** 2026-10-13
**Answered:** 2026-10-15
**Answer source:** PAC2-9001 MANUAL_EXECUTE rev-2 (15 Oct, Booked=2): Block Session enabled in slot context menu (no P7032 gate observed at slot-menu level), click non-functional. UX gap on both empty and booked sessions — see DEF-PAC2-9001-01.

**ID:** OQ-032
**Status:** Open
**Question:** PAC2-9001 `Configuration > Sessions` row-kebab menu content cho `User + P7032` (NOT Admin): Cancel option có visible (UI gate hidden) hay click visible nhưng ra Access Denied (server gate)? Video step 6/6 PASS = page reachable cho User+P7032, không phải Cancel option visible. Tester did not open kebab
**Impact:** Medium
**Evidence:** PAC2-9001/requirements.md (REQ-007), PAC2-9001/video-notes.md (step 6/6), PAC2-9001/requirements.md (OQ-3)
**Created:** 2026-10-13
**Answered:** -

**ID:** OQ-033
**Status:** Answered
**Question:** PAC2-9001 Entry-point shape cho `Cancel session appointments` (right-click context menu / kebab dropdown / menu icon)? Video KHÔNG capture. LOCATE attempt-4 verified session card chỉ có 2 buttons (Edit pencil + Note icon), EDIT SESSION drawer không có Cancel/Block/Remove entry, right-click session name = no-op. Có thể ở patient slot row level (untested)
**Impact:** Critical
**Evidence:** PAC2-9001/feature-location.md (R-2), PAC2-9001/video-notes.md (Open questions), PAC2-9001/requirements.md (OQ-4)
**Created:** 2026-10-13
**Answered:** 2026-10-15
**Answer source:** PAC2-9001 MANUAL_EXECUTE rev-2 (TC-009) — entry point = `Configuration → Appointment Books → Sessions → row kebab → Cancel session appointments`. 8-item kebab confirmed. NOT in Appointment Book Day view slot menu (19-item slot menu has Block Session, Cancel Appointment, etc. but no Cancel session appointments).

**ID:** OQ-034
**Status:** Open
**Question:** PAC2-9001 Time-edit cancellation dialog (REQ-008 scenarios 6-10) trigger bằng template edit (per QA notes rev 2) — có session template nào trên dev có generated sessions hold bookings outside template times? Video không capture dialog. Trực tiếp session edit khi có bookings thì times locked, không trigger
**Impact:** High
**Evidence:** PAC2-9001/requirements.md (REQ-008, QA notes), PAC2-9001/video-notes.md (step 5/6), PAC2-9001/requirements.md (OQ-5)
**Created:** 2026-10-13
**Answered:** -


### Từ PAC2-8575 (2026-10-15)

**ID:** OQ-035
**Status:** Open
**Question:** Single click trên patient slot mở `Appointment Details sidebar` (fix observable), nhưng trong sidebar `Select Patient Status` chevron-down không có onClick (chain 6 levels). Cơ chế arrive/change status thực sự nằm ở đâu? Right-click context menu? Keyboard? Drag? Button arrive ẩn?
**Impact:** High
**Evidence:** PAC2-8575/exploration.md OBS-001, OBS-004; PAC2-8575/manual-execution.md TC-001 (aside mở, chevron không clickable)
**Created:** 2026-10-15
**Answered:** -

**ID:** OQ-036
**Status:** Open
**Question:** Bug PAC2-8575 (double click để arrive) có ảnh hưởng status transition khác ngoài `Arrive` không? Reception chỉ nói "arrive"; cần test `In consultation`, `No show`, `Cancelled`.
**Impact:** Medium
**Evidence:** PAC2-8575/requirements.md OQ-002, PAC2-8575/exploration.md OQ-2; PAC2-8575/manual-execution.md TC-006 Blocked
**Created:** 2026-10-15
**Answered:** -

**ID:** OQ-037
**Status:** Open
**Question:** Trên production/mainline/dev chung, behavior có còn là double click arrive không? Hay fix đã promote? Có thể branch host `pac2-8575` mới có fix, mainline chưa.
**Impact:** Medium
**Evidence:** PAC2-8575/requirements.md OQ-003, PAC2-8575/exploration.md OQ-3; PAC2-8575/manual-execution.md TC-007 Blocked
**Created:** 2026-10-15
**Answered:** -

**ID:** OQ-038
**Status:** Partially Answered
**Question:** Data volatile — sau page refresh `Booked` từ 6 xuống 0. Session test có cache; automation cần handle data setup robust hoặc dùng QA-AUTO fixture test patient future booked.
**Impact:** Medium
**Evidence:** PAC2-8575/exploration.md OBS-003, OQ-5; PAC2-8575/manual-execution.md attempts 1-3 (existing tab) vs attempt 4 (fresh tab → Booked 6)
**Created:** 2026-10-15
**Answered:** 2026-10-15
**Answer:** Data KHÔNG volatile; chỉ là stale tab state. 4 diagnostic attempts cho thấy: existing tab sau navigate lại nhiều lần trả `Booked 0`; fresh tab (`browser_tabs new`) trả `Booked 6` đúng. Nguyên nhân: cookie/date persistence trong existing tab hoặc API cache per-tab. Automation cần fresh-tab context hoặc explicit session reload để đảm bảo data visibility.


### Example Format

**ID:** OQ-001
**Status:** Open
**Question:** What happens when user submits duplicate request?
**Impact:** Medium
**Evidence:** Ticket PAC2-XXXX mentions duplication but no expected behavior
**Created:** 2026-09-09
**Answered:** -

**ID:** OQ-039
**Status:** Answered
**Question:** Entry "Copy DFD link" được mô tả trong memory `paco-scheduler-booking-link-flow` không tìm thấy ở level root campaign trong DFD Config hiện tại (2026-10-16) — chỉ thấy button `+` (class `org-chart__add`) để thêm Campaign/Button. Có thể UI đã refactor, copy action nằm trong sub-row không capture được, hoặc cần double-click vào campaign name?
**Impact:** High — nếu không tìm được copy entry, không thể generate booking link để reproduce defect `Link Error / No token found` trong test execution.
**Evidence:** PAC2-7727/exploration.md O-1, O-5; memory `paco-scheduler-booking-link-flow.md` mô tả flow `Configuration → DFD Config → Copy DFD link`
**Created:** 2026-10-16
**Answered:** 2026-10-16
**Answer:** Entry **không** ở level node card mà ở **page-level 3-dot menu** (`<svg data-icon="ellipsis">` ở `absolute right-[25px] top-[17px]` của page container DFD Config). Click ellipsis → `p-overlaypanel` mở với 2 items: `Copy DFD link` và `Copy to Care Navigator`. Click `Copy DFD link` → copy URL `https://dev.blinxscheduler-np.com/patient-self-booking/#<jwt>` vào clipboard. JWT payload chứa `otId` (organization ID) → đây là **organization-level scheduler link** (org-level DFD entry, không phải patient-level booking link với patient pre-fill như trong video Fiona). Em xác nhận trên dev 2026-10-16 với campaign `MAR GB Copy Test`.

**ID:** OQ-040
**Status:** Open
**Question:** Comms Hub SSO yêu cầu Super Admin GB role; clinic role `blinx_johnny.bravo` (Blinx Deployment) không đủ quyền. Sidebar `Quick Send` trong PACO cũng không trigger navigation cho role này. Cần user Super Admin GB riêng để access Comms Hub Outbox `Resend` workflow.
**Impact:** Critical — Workaround chính để generate JWT scheduler link bị chặn. Cần QA cấp Super Admin GB account.
**Evidence:** PAC2-7727/exploration.md O-4 (2026-10-16 retry); feature-map.md Comms Hub role observed `Super Admin GB`
**Created:** 2026-10-16
**Answered:** -

**ID:** OQ-041
**Status:** Answered
**Question:** Host `pac2-3934.dev.blinxpaco-np.com` có cần add vào `paco.config.yaml` `allowedHosts` không, để chạy live replay AC1–AC4 (cross-org health form filing)?
**Impact:** High
**Evidence:** PAC2-3934/feature-location.md 2026-10-18; ticket `Multiple Test URL` field
**Created:** 2026-10-18
**Answered:** 2026-10-18
**Answer:** Tester chọn KHÔNG add host riêng; chạy trên dev chung `blinx.dev.blinxpaco-np.com`. Kết quả survey 2026-10-18: consultation screen không accessible trên dev chung (`/paco-connect/dashboard` 404, `/paco/health-forms/inbox` 404, không có menu Consultation top-level). Blocker thật là PAC2-5445 (consultation mode not opening, Ready to Release). Ticket closed Blocked.

**ID:** OQ-044
**Status:** Open
**Question:** Backend fix `nhs-supergrid-be#2752` (full-PK patient lookup, no fallback, fix tautology) đã deploy lên host nào chưa?
**Impact:** High — nếu fix chỉ deploy trên host riêng PAC2-3934, mainline/dev chung vẫn ở pre-fix.
**Evidence:** PAC2-3934/requirements.md Mustafa review; ticket snapshot ticket.md
**Created:** 2026-10-18
**Answered:** -

**ID:** OQ-045
**Status:** Open
**Question:** PAC2-5445 (consultation mode not opening) sẽ release khi nào? PAC2-3934 cross-org filing phụ thuộc consultation mode accessible trên PACO Connect.
**Impact:** Critical — không thể chạy AC1–AC4 ở bất kỳ dev host nào nếu consultation mode chưa work.
**Evidence:** PAC2-3934/feature-location.md 2026-10-18; linked issue PAC2-5445
**Created:** 2026-10-18
**Answered:** -
