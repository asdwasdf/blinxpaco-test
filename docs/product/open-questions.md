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
**Update (2026-10-22):** `[Observed / Open Question]` Với role `Blinx Deployment` trên Paco, sidebar `Comms Hub` > `Campaign Manager` đã chuyển được cùng tab tới external `/commshub/login`; nhận định lịch sử không trigger navigation không tái hiện trong context này. Helper chưa qua auth riêng trong pass đó, có redirect SSO; role requirement và nguyên nhân chưa xác lập. — `product-explore/auto-20261022-0500/ledger.md#2–3`.
**Current context (2026-10-22):** `[Observed / Open Question]` Source Paco `Super Admin GB`; dedicated helper dùng actual credential-method control đạt authenticated external Home/Campaign Manager/Outbox, organisation header đúng, external role không visible. Auth blocker gỡ cho context này, chưa chứng minh required role; chỉ read-only search/navigation, không Send/Resend. — `product-explore/auto-20261022-1001/ledger.md#13–14`.
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

**ID:** OQ-046
**Status:** Open (partially answered)
**Question:** Dependency nào chặn `Generate Templates` trên branch `pac2-7579` với UI `HTTP error! status: 403`, và full tagged A → `PACO Assist` → B có bỏ Comms Hub tag đúng expected không? Source cũ unavailable chưa rõ nguyên nhân; không suy ra do org/channel/license.
**Impact:** High — generation chặn tạo B và kiểm tra tag inheritance PAC2-7579; không phải product `Fail`.
**Evidence:** `[Observed / Open Question]` PAC2-7579/test-data-ledger.md#source2-paco-handoff-và-assist--2026-10-21; `test-results/PAC2-7579-source2-assist-20261021.json`. NHS admin home/viewing `Haringey Demo Org`: source mới SMS Quick Send persisted tag và chọn được trong branch picker dưới `Super Admin GB` / `test again - old location`. Generate với synthetic prompt trả UI `403` cả SMS-only và default options; không B/Save/Send. Cancel/Close dialogs `0`; source mới Delete/Confirm rồi reload có Restore action, không hard absence. Không suy root cause từ UI. Khác OQ-016 (quyền update campaign tags).
**Diagnostic:** Fresh PAC admin login không khắc phục. UI-triggered `POST /paco/feature-branch/pac2-7579/undefined/v1/chat/completions` trên frontend host trả `403` `[Observed]`; literal `undefined` gợi ý AI base URL thiếu/sai config `[Inferred]`, exact build/runtime variable và nguyên nhân reject chưa biết. Cần owner deployment kiểm tra; không rewrite endpoint/bypass. — PAC2-7579/test-data-ledger.md#chẩn-đoán-403-theo-tester--2026-10-21; `test-results/PAC2-7579-403-diagnosis-20261021.json`.
**Created:** 2026-10-21
**Answered:** Một phần 2026-10-21 — persisted source tag/source mới availability và request sai target đã quan sát; full A → B vẫn Open do generation `403`.

### Autonomous product exploration (2026-10-21)

**ID:** OQ-047
**Status:** Open
**Question:** `Skills` → `View Audit` có end state/permission/loading signal nào? Hai lần mở trên owned records chưa thấy audit panel; chưa xác lập completion timing nên kết quả `Inconclusive`, không defect.
**Impact:** Low
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1359/ledger.md#6`; `workflows/organisation-skills.md`.
**Created:** 2026-10-21
**Answered:** -

**ID:** OQ-048
**Status:** Open (partially answered)
**Question:** Rule Name của Skills (empty Edit/whitespace/length), semantics suffix ` copy`, retention/Restore sau Archive, và hiệu ứng Pathways/RBAC hoặc saved staff assignment khi rename/archive là gì? Add empty disable Confirm, Edit empty vẫn enable Save; chưa submit invalid vì giữ `QA-test` ownership.
**Impact:** Medium
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1359/ledger.md#3`–`#7`, `#11`; owned Skill create/rename/archive phản ánh exact Name ở fresh Staff Profile `Skill Capabilities` picker. Không chọn/lưu receiver; saved assignment và Pathways/SNOMED/RBAC mapping chưa thử. 4/4 owned Skills đã UI Archive; retention chưa biết.
**Created:** 2026-10-21
**Answered:** Một phần 2026-10-21 — availability/rename/removal trong unsaved Staff Profile picker đã Observed; validator phía server, intent của Copy suffix, archived retention/Restore và persisted downstream effects vẫn Open.

**ID:** OQ-049
**Status:** Open
**Question:** Visible menu `Configuration` → `Organisation` → `Pathways Config` đưa tới `/paco/configuration/organisation/pathways` chỉ render `Page Not Found`: route triển khai đúng là gì, hay cần role/context khác? Root cause chưa biết; không suy từ static audio 404.
**Impact:** Medium
**Evidence:** `[Observed / Possible defect]` `product-explore/auto-20261021-1359/ledger.md#8`; menu re-entry, reload chờ heading và fresh tab cùng context đều tái hiện; Skills control render được.
**Created:** 2026-10-21
**Answered:** -

**ID:** OQ-050
**Status:** Answered — `DEC-shared-list-save`
**Answer:** `[Confirmed: tester 2026-10-23]` Tester duyệt 2026-10-23 (option a): cho bấm page/footer Save trên shared list Teams, Services, Announcements, Dx Priority thoải mái như manual test; không cần xóa dòng QA-test sau đó. Riêng Role Groups: chỉ tạo role group mới tên QA-test và sửa quyền trên chính group đó; KHÔNG sửa quyền role group có sẵn.
**Question:** `Teams` footer `Save` chỉ ghi delta owned Team hay toàn shared list? Có cách create/cleanup scoped riêng và owned staff prerequisite để test member assignment không? Add New → Add chỉ tạo draft, reload không persist; không bấm Save khi write footprint chưa chắc.
**Impact:** Medium
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1359/ledger.md#9`; current `[Observed: Super Admin GB]` `product-explore/auto-20261023-0506/ledger.md#8–9`: authorized owned Create/Rename Save giữ qua reload, Work Board picker theo hai triggers; no-member source retained theo approval. Shared-list write footprint và member semantics chưa được chứng minh.
**Created:** 2026-10-21
**Answered:** 2026-10-23

**ID:** OQ-051
**Status:** Answered — `DEC-staff-create`
**Answer:** `[Confirmed: tester 2026-10-23]` Tester duyệt 2026-10-23: cho tạo staff QA-test với email fiona.nguyen@blinxsolutions.com (invite/identity gửi tới email này OK); không cần xóa, giữ lại để tái sử dụng cho lần sau.
**Question:** `Staff Profiles` → `Add Care Professional` → `Create` có tạo identity, invite hoặc email tự động không? Cần safe unique Email và cleanup scope nào để tạo owned staff không trùng account/ảnh hưởng quyền người dùng có sẵn?
**Impact:** Medium — chặn persisted profile/role/capability/Teams assignment; vẫn đọc được unsaved picker.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1359/ledger.md#10`–`#11`; `workflows/staff-profiles.md`. General required First/Last Name, Gender, Email; không nhập dữ liệu hoặc submit Create. Chỉ mở receiver draft rồi Close; không send/invite.
**Created:** 2026-10-21
**Answered:** 2026-10-23

**ID:** OQ-052
**Status:** Answered — `DEC-shared-list-save`
**Answer:** `[Confirmed: tester 2026-10-23]` Tester duyệt 2026-10-23 (option a): cho bấm page/footer Save trên shared list Teams, Services, Announcements, Dx Priority thoải mái như manual test; không cần xóa dòng QA-test sau đó. Riêng Role Groups: chỉ tạo role group mới tên QA-test và sửa quyền trên chính group đó; KHÔNG sửa quyền role group có sẵn.
**Question:** `Organisation` → `Services` footer `Save` ghi delta owned service hay toàn shared list? Có cách create/update/remove scoped riêng không; `Service ID` có rule required/unique/domain nào, và `Case Type`/service được tiêu thụ ở đâu?
**Impact:** Medium — authorization đã giải quyết bằng DEC; `Super Admin GB` đã verified Create, Rename/Case Type Update, Delete qua reload (`product-explore/auto-20261023-0506/ledger.md#10`), cleanup Done. Shared-list write footprint, domain/unique rules và consumer vẫn chưa established; không suy semantics từ Teams.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1359/ledger.md#15`, `services-draft-check.js`; `workflows/organisation-services.md`. 4 editable baseline rows; Add Another tạo owned draft, Remove riêng draft về 4, Add/reload về 4 và 0 owned inputs. ID lọc non-digit/max15, Name max255, Case Type mở 14 option labels; chưa Save/select option, không server-validation/downstream claim.
**Created:** 2026-10-21
**Answered:** 2026-10-23

### Health Forms autonomous (2026-10-21)

**ID:** OQ-053
**Status:** Open
**Question:** `Archive/Unarchive` trên source `Archived` vẫn mở prompt/button `Archive`; confirm làm source `Active` sau reload. Wording và state transition mong đợi là gì? Intent/root cause chưa biết; không kết luận behavior đúng hoặc sai.
**Impact:** Low — wording không thể hiện rõ effect đã quan sát; cần trusted requirement trước verdict.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1626/ledger.md#8`, `ui-observations.json#archive`; Cancel/reload giữ Archived, confirm/reload thành Active, re-Archive cleanup thành Archived. `workflows/health-forms.md#mutation-coverage`.
**Created:** 2026-10-21
**Answered:** -

**ID:** OQ-054
**Status:** Open
**Question:** `Clone Health Form` từ source `Archived` hai lần mở create-new editor với Title/Dropzone rỗng, source component không có, `Save Form` disabled, trong khi source `Edit` vẫn có content. Clone có hỗ trợ Archived source không, và load/completion signal đúng là gì? Root cause và Active-source behavior chưa verified.
**Impact:** Medium — persisted Clone copy chưa có end state; không Save clone, persistence `Not Run`, hai drafts đã bỏ.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1626/ledger.md#9`, `ui-observations.json#clone`; source Edit control có content. Diagnostic lần hai captured requests200/failed0/console0/pageerror0; không payload inspection, HTTP200 không proof data loaded. `workflows/health-forms.md#mutation-coverage` nhánh9.
**Created:** 2026-10-21
**Answered:** -

**ID:** OQ-055
**Status:** Open
**Question:** `Designer V2` (`/paco/health-forms/`) hiện heading `Health Form Templates` nhưng chưa có rendered data rows; fresh reload chờ20s vẫn vậy, legacy control thấy source `Active` lúc probe. Điều kiện load/permission/filter và quan hệ với legacy Designer là gì? Source hiện đã Archived; receiver archived visibility chưa biết.
**Impact:** Medium — relationship `Inconclusive`, không observed edge; không chứng minh template absent hoặc sync thiếu.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1626/ledger.md#7`, `ui-observations.json#designer_v2`; lần vào đầu và fresh reload đều chưa thấy rows, chỉ fresh reload có explicit wait20s. Console errors2/pageerror0, same-origin capture chỉ GETdocument200, không đủ backend diagnosis. `workflows/health-forms.md#mutation-coverage` nhánh10.
**Current-role evidence:** `[Observed / Open Question: dev, Super Admin GB]` `product-explore/auto-20261022-1206/ledger.md#12–13`: source Active lúc probe, exact V2 search retained và loading indicator gone nhưng 0 data rows; concurrent resource errors không chứng minh causality. Source sau probe Archived; relationship giữ `Inconclusive`, không retry nếu prerequisite chưa đổi.
**Created:** 2026-10-21
**Answered:** -

**ID:** OQ-056
**Status:** Open
**Question:** `Health Form Title` rỗng làm `Save` disabled nhưng whitespace làm enabled. Trusted trim/required/length/duplicate rule phía client và server là gì? Invalid Title chưa submit, không kết luận server chấp nhận hoặc client bug.
**Impact:** Low — chỉ client-state observation; invalid/duplicate/boundary persistence chưa chạy.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1626/ledger.md#4`, `ui-observations.json#validation`; khôi phục valid Title trước Save, không invalid submit. `workflows/health-forms.md#mutation-coverage` nhánh4/11.
**Created:** 2026-10-21
**Answered:** -

**ID:** OQ-057
**Status:** Open
**Question:** `Configuration` → `Organisation` → `Practice Profiles` visible menu tới route `/paco/configuration/organisation/practice-profiles` chỉ render `Page Not Found`: route triển khai đúng là gì, hay cần role/deployment khác? Root cause chưa biết; không suy từ Pathways Config error (OQ-049).
**Impact:** Medium — chặn map action/ownership và kiểm owned workflow; entity/consumer/relationship chưa biết, không suy quan hệ với `Staff Profiles` hoặc HTTP status/backend unavailable.
**Evidence:** `[Observed / Blocked]` `product-explore/auto-20261021-1626/ledger.md#13`, `practice-profiles-route-check.js`, `resume-observations.json#practice_profiles`; visible menu, reload chờ heading và fresh tab cùng browser context đều `Page Not Found`; `Skills` control render được.
**Created:** 2026-10-21
**Answered:** -

### Locations autonomous (2026-10-21)

**ID:** OQ-058
**Status:** Open
**Question:** Nested `Enter Address` → `Cancel` hoặc `Close` có chủ ý giữ draft trong cùng parent `Location` không? Nếu sau Cancel bấm parent `Save`, draft Address có được persist không? Chưa chạy nhánh Save sau Cancel, chưa có trusted intent hoặc root cause.
**Impact:** Medium — cần phân biệt parent buffer với persisted value trước verdict; không kết luận mất dữ liệu hoặc product Fail từ label Cancel.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1844/ledger.md#9–11`, `address-cancel-check.js`, `ui-observations.json#address_cancel_diagnostic`; cùng parent giữ City draft sau Cancel/Close, parent Close rồi fresh reload/reopen trả City gốc. Explicit Confirm/Save update riêng đã persist. Selective console/network diagnosis chưa chạy. Connection failure original recovered qua auth/reconciliation; cleanup Done 19:27:59.966Z. Notice sau Add Close recovered qua auth/role và read-only exact cleaned/cancelled rows0/dialogs0 tại20:00:15.316Z — ledger #17. Latest connector notice sau Sharing Agreements Column Menu chưa có current UI recheck; notice timestamp không có — ledger #18–19.
**Created:** 2026-10-21
**Answered:** -

**ID:** OQ-059
**Status:** Open
**Question:** `Locations` có trusted required/trim/format/duplicate/length rules nào cho Name, Contact Number, Email và các Address fields? Empty/whitespace Name, invalid Email native validity và Address Confirm gating chỉ là client observation; server rules chưa verified.
**Impact:** Medium — empty Name Save enabled nhưng không submit unnamed data; Email input type text không proof invalid recipient được server chấp nhận. Không suy City/County/Postcode optional vì Confirm enabled sau Line1.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1844/ledger.md#4–7`, `ui-observations.json#validation`; empty Email Save bị native message `Please fill out this field.`, Address trống bị custom `Address is required`. Valid synthetic create/update được UI reload/reopen; duplicate/server-invalid/boundary chưa chạy. Connection failure original recovered qua auth/reconciliation; cleanup Done 19:27:59.966Z. Notice sau Add Close recovered qua auth/role và read-only exact cleaned/cancelled rows0/dialogs0 tại20:00:15.316Z — ledger #17. Latest connector notice sau Sharing Agreements Column Menu chưa có current UI recheck; notice timestamp không có — ledger #18–19. `workflows/organisation-locations.md`.
**Created:** 2026-10-21
**Answered:** -

### Announcements autonomous (2026-10-21)

**ID:** OQ-061
**Status:** Answered — `DEC-shared-list-save`
**Answer:** `[Confirmed: tester 2026-10-23]` Tester duyệt 2026-10-23 (option a): cho bấm page/footer Save trên shared list Teams, Services, Announcements, Dx Priority thoải mái như manual test; không cần xóa dòng QA-test sau đó. Riêng Role Groups: chỉ tạo role group mới tên QA-test và sửa quyền trên chính group đó; KHÔNG sửa quyền role group có sẵn.
**Question:** `Organisation / Announcements` shared page-level `Save` ghi delta owned block hay toàn Welcome/Service list? Có cách tạo scoped owned persisted announcement với separate write footprint và cleanup không? Saved validation rules (required/trim/length/duplicate), location assignment persistence, recipients/triggers/location effect và saved lifecycle là gì?
**Impact:** Medium — authorization resolved; current Super Admin GB Create/Update/Delete+Save without location verified qua reload/reopen, cleanup Done (`product-explore/auto-20261023-0506/ledger.md#11`). Shared write footprint, domain validation và delivery/location semantics vẫn chưa established.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-2259/ledger.md#5–10`, `ui-observations.json#announcements`; `workflows/organisation-announcements.md`. Welcome Message 2 existing blocks, Service Updates 1 block baseline; own unsaved drafts Add/Delete/reload và Add/reload-discard đều baseline1/owned text0 sau cleanup. `Apply to locations` picker 285 rendered options; không chọn option/Save. Toolbar formatting/link/table/image visible, end states chưa exercise. Không bấm shared Save; persisted create/update/delete, server validation, location assignment persistence, recipients/triggers và delivery/receiver `Not Run`. Read-only reconciliation `2026-10-22T01:07:48.305Z`: baseline1editor/exact own matches0/0/dialogs0/roletrue, no Save; `resume-preflight-20261022-0103/ledger.md#4–6`, run2259 ledger #12–13. Organisation continuity qua re-auth chưa independently established; latest connector notice sau sweep chặn current check, timestamp null. Không trả lời saved-lifecycle question hoặc tăng coverage.
**Created:** 2026-10-21
**Answered:** 2026-10-23

### Sharing Agreements autonomous (2026-10-21)

**ID:** OQ-060
**Status:** Open
**Question:** `Sharing Agreements` hỗ trợ purpose/lifecycle/actions nào trong role `Blinx Deployment`? Có UI path tạo agreement bằng owned synthetic prerequisites, separate write footprint và cleanup an toàn không? Chưa map scoped form/CRUD; không coi existing organisation list hoặc Access labels là permission hay relationship proof.
**Impact:** Medium — chặn thiết kế owned mutation/validation/persistence và receiver assertions; không kết luận CRUD unsupported hoặc tự sửa shared agreement.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261021-1844/ledger.md#17–19`, `auto-20261021-2259/ledger.md#1–4`, `ui-observations.json#sharing_agreements`: visible entry/root, grid columns và Name `Column Menu` observed. Cumulative 4/5 bounded branches Partial read-only (root/menu/general-layout/columns/paging order): Performed 4, Skipped 1. Columns tab six checked columns; Filter Columns Input `Status` filters column names only (layout search), clear restored six, no checkbox changed. Autosize This Column Name width200→279, fresh reload six200/unpinned, no layout persistence trong context đã thử; baseline restored `23:02:44.955Z`, dialogs `0`. Paging four controls `visible:false`/`hidden ancestor` measured `23:01:07.299Z`, visibility only, no navigation/support proof; branch Skipped not `Not supported`. Bounded root không thấy feature Add/Save/row Actions. Other general choices (pin/autosizeall/reset, column toggle/order, data-row sort/filter, paging navigation) và owned lifecycle/validation/prerequisites/receiver chưa verified. Column menu/filter chỉ own layout UI preference only, no agreement-record mutations/domain persistence/receiver. Run1844 menu-open click `20:04:00.999Z`, run2259 baseline restored `23:02:44.955Z`. Historical connector blocker recovered preflight2253. Coverage dimensions: navigation done, main_workflow partial, branches_states partial (4/5), mutation none, validation none, persistence partial (own layout reload only, NOT business data), relationships none, errors_edge none. Confidence Medium bounded navigation/layout, no product verdict/deep/Complete. Final read-only reconciliation `2026-10-22T01:08:14.018Z`: six200px/unpinned/dialogs0/menu absent/roletrue, no agreement/layout mutation replay; `resume-preflight-20261022-0103/ledger.md#4–6`, run2259 ledger #12–13. Latest connector notice sau sweep chặn current check, timestamp null; owned lifecycle/write footprint vẫn Open. `workflows/organisation-sharing-agreements.md`.
**Created:** 2026-10-21
**Answered:** -

### Dx Priority autonomous (2026-10-22)

**ID:** OQ-062
**Status:** Answered — `DEC-shared-list-save`
**Answer:** `[Confirmed: tester 2026-10-23]` Tester duyệt 2026-10-23 (option a): cho bấm page/footer Save trên shared list Teams, Services, Announcements, Dx Priority thoải mái như manual test; không cần xóa dòng QA-test sau đó. Riêng Role Groups: chỉ tạo role group mới tên QA-test và sửa quyền trên chính group đó; KHÔNG sửa quyền role group có sẵn.
**Question:** `Dx Priority` có UI path tạo isolated owned disposition/pair và cleanup an toàn không? `Add Service & Priority`, `Remove pair`, chọn Service/Priority và page-level `Save` ghi delta hay toàn shared configuration? Trusted domain rules/validation, source prerequisites và downstream consumer là gì?
**Impact:** Medium — chặn saved lifecycle/validation/persistence/receiver; không sửa existing disposition/pair hoặc shared Save để tìm rule. Không suy clinical meaning từ label hoặc dependency từ populated picker.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261022-0158/ledger.md#2–5`, `ui-observations.json`, `workflows/organisation-dx-priorities.md`. Root `DX Priorities`/Disposition Code/Text/Service/Priority và disabled shared Save; synthetic no-match/clear, read-only Service/Priority picker open/close có end state. 4/7 bounded branches Partial read-only, 3 shared-write branches Skipped; no selection/Add/Remove/Save/new record. No saved persistence/domain validation/two-sided relationship proof. Rendered counts chỉ context observation, không rule/dataset total.
**Created:** 2026-10-22
**Answered:** 2026-10-23

**ID:** OQ-063
**Status:** Open
**Current-role check (2026-10-23):** `[Observed]` Super Admin GB header verified trước/sau Dx Priority settled reload (`product-explore/auto-20261023-0506/ledger.md#12`); historical absence không reproduced trong role này, không giải thích cause cũ.
**Question:** Cách read-only nào xác minh actual active role/context khi header thiếu exact `Blinx Deployment` hoặc hiển thị `Config Admin` trong run intended `Blinx Deployment`? Quan sát tại `Dx Priority`, Reports và Dashboard có cùng cause không, hay chỉ header/context behavior khác nhau?
**Impact:** Medium — chặn tiếp autonomous mutation/feature mới cho tới verify role; path-based `CHECK_AUTH_SCRIPT` true không đủ. Không credential retry hoặc switch role/logout chỉ để ép label trở lại.
**Evidence:** `[Observed / Open Question]` preflight `resume-preflight-20261022-0151/ledger.md#2–4` role verified trước run; `product-explore/auto-20261022-0158/ledger.md#3–4`: role wait timeout25s sau reload, readbacks `02:04:40.420Z`/`02:05:30.280Z` role absent, root render/loginInputs0/dialogs0. `More options` mở `02:06:23.494Z`, targeted snapshot sau đó chỉ application shortcuts, không role proof/snapshot timestamp. Later plugin/user `CONNECTION_CLOSED`, notice timestamp null/current recheck Blocked; không browser action sau notice, không selective console/network/root-cause proof.
**Created:** 2026-10-22
**Note (2026-10-22):** Các notice `CONNECTION_CLOSED` trong evidence là của hai server `.mcp.json` `playwright-user`/`playwright-plugin` (lỗi `EADDRINUSE`), không phải Claude Playwright plugin; câu hỏi về role vẫn Open.
**Current evidence (2026-10-22):** `[Observed / Open Question]` `product-explore/auto-20261022-0714/ledger.md#6–12`: exact role checked trước Role Groups và tại hai Web Chat child roots; chưa independently checked tại Case Load. Reports và Dashboard header hiển thị `Config Admin`; final targeted Dashboard header check không có intended role, dù toàn trang có `Blinx Deployment` ngoài header. Không switch role, credential retry hoặc quy cause cho availability; historical checks không tự chứng minh active-role continuity.
**Resume preflight (2026-10-22):** `[Observed / Open Question]` `product-explore/resume-preflight-20261022-0946/ledger.md#1–4`: `.env` helper tới picker chỉ offered `Super Admin GB`, không `Blinx Deployment`, với Organisation/Location đã chọn. Tester sau đó chốt `Dùng Super Admin GB`; exact role hoàn tất và Dashboard header verified, checkpoint riêng. Không còn chờ role choice; nguyên nhân role cũ/header-context vẫn Open, bốn mutation decisions không đổi.
**Answered:** -

### Shared-list Save decision (2026-10-22)

**ID:** OQ-064
**Status:** Answered — `DEC-shared-list-save`
**Answer:** `[Confirmed: tester 2026-10-23]` Tester duyệt 2026-10-23 (option a): cho bấm page/footer Save trên shared list Teams, Services, Announcements, Dx Priority thoải mái như manual test; không cần xóa dòng QA-test sau đó. Riêng Role Groups: chỉ tạo role group mới tên QA-test và sửa quyền trên chính group đó; KHÔNG sửa quyền role group có sẵn.
**Question:** Có được bấm page/footer `Save` trên list dùng chung khi diff chỉ thêm rồi xoá một dòng `QA-test` không? Nếu không, có cách tạo/xoá scoped riêng cho từng feature không?
**Impact:** Medium — cùng một root cause chặn persisted CRUD của 5 feature; mỗi feature vẫn explore được các nhánh read-only/unsaved độc lập.
**Scope:** `whole-list` candidate — page/footer `Save` trên shared configuration; chưa xác minh ghi delta hay toàn list, giữ authorization gate trước khi chạy.
**Linked:** OQ-050 (`Users & Staff / Teams`), OQ-052 (`Organisation / Services`), OQ-061 (`Organisation / Announcements`), OQ-062 (`Organisation / Dx Priority`), plus `Users & Staff / Role Groups` (disabled footer Save, share cùng pattern). Câu hỏi domain riêng của từng feature vẫn giữ ở OQ gốc.
**Evidence:** Xem evidence trong từng OQ gốc; Role Groups `product-explore/auto-20261022-0714/ledger.md#6–7`.
**Created:** 2026-10-22
**Answered:** 2026-10-23

### Case Workboards fixture (2026-10-22)

**ID:** OQ-066
**Status:** Answered — `DEC-workboard-create`
**Answer:** `[Confirmed: tester 2026-10-23]` Tester duyệt 2026-10-23: cho tạo board QA-test, không cần xóa. Notification nếu có chỉ tới fiona.nguyen@blinxsolutions.com. Tester chưa rõ màn này; gán case/task/staff theo policy CLAUDE.md (dữ liệu có sẵn trên dev được dùng).
**Question:** `Create new board` có cách tạo owned board minimal với scope cleanup/visibility/notification/write footprint đã xác lập không? Scoped cleanup, private/default visibility và permission sharing unknown; create class là `unknown-scope`, không reuse shared-list/staff rootcause.
**Impact:** Medium — chặn saved board lifecycle, assignment và case/task relationship; form blank và Cancel end states vẫn chạy độc lập.
**Linked:** `Case Load Management / Case Workboards`, `workflows/case-load-management.md`; decision `DEC-workboard-create` pending trong autonomous state; destination role/context cần reverify.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261022-0714/ledger.md#10`: `Create new board` mở `/paco/workboards/new-workboard` form blank, Type options Case/Task opened không chọn, không nhập name, Cancel đóng/auto-select board khác; không Save/assignment/case mutation. 3/9 bounded branches performed, 6 skipped; no saved persistence/validation/two-sided relationship. My Case handoff tới profile case không chứng minh create→receiver hoặc active ownership.
**Created:** 2026-10-22
**Answered:** 2026-10-23

### Patient registration fixture (2026-10-22)

**ID:** OQ-065
**Status:** Answered — `DEC-patient-fixture`
**Answer:** `[Confirmed: tester 2026-10-23]` Tester duyệt 2026-10-23: cho tạo patient synthetic tên QA-test-*, NHS number random hợp lệ mod-11 trong dải test 999xxxxxxx; email chỉ fiona.nguyen@blinxsolutions.com, phone để trống (không SMS); không cần cleanup, để lại trên dev; được dùng patient đó như bình thường (booking/media) và được dùng patient có sẵn trên dev.
**Question:** Có fixture đăng ký patient hoàn toàn synthetic với giá trị bắt buộc hợp lệ, scope không gọi external identity/notification và đường UI cleanup đã duyệt không?
**Impact:** Chặn saved patient lifecycle và patient-dependent booking/media; search, unsaved draft và Appointment Book/Virtual Appointments/Media Library read-only vẫn chạy độc lập. Patient fixture không thay thế prerequisite owned booking, slot/session, media và cleanup.
**Linked:** `Patients / Patient Search`, `Patients / Care Navigation`, `Appointment Book / Quick Book`, `Web Chat & Video / Virtual Appointments`, `Web Chat & Video / Media Library`, `workflows/patient-search.md`, `workflows/care-navigation.md`, `workflows/appointment-book.md`, `workflows/web-chat-video.md`; decision `DEC-patient-fixture` trong autonomous state.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261022-0236/ledger.md#5–9,#14–15`: patient draft mở các step không cần PDS và discard qua fresh reopen; blank Quick Book có `Find Appointment` disabled, chưa có owned saved fixture hoặc owned slot/cleanup. `product-explore/auto-20261022-0500/ledger.md#6–7`: Virtual Appointments root và filter end states đã observed; chưa có owned appointment để exercise lifecycle. `product-explore/auto-20261022-0714/ledger.md#8`: Media Library root `No Patient Selected`, patient search không submit; media fixture ownership/cleanup riêng chưa xác lập.
**Current-role evidence (2026-10-22):** `[Observed: dev, Super Admin GB]` `product-explore/auto-20261022-1001/ledger.md#9–11`: independent calendar/search/filter end states và blank Quick Book disabled gate đã chạy; không chọn patient hoặc retry pending fixture.
**Created:** 2026-10-22
**Answered:** 2026-10-23

### Patient Search filter Cancel (2026-10-22)

**ID:** OQ-067
**Status:** Open
**Question:** `Filters` → `Cancel` phải bỏ Postcode draft hay giữ live filter? Heading count có ý nghĩa gì khi `Cancel` không đổi field cũng làm count đổi trong khi rows vẫn hiện?
**Impact:** Medium — cần trusted intent trước assertion về discard/apply và total match; không suy saved patient hoặc server mutation từ transient grid state.
**Evidence:** `[Observed: dev, Super Admin GB]` `product-explore/auto-20261022-1001/ledger.md#4–7`; hai isolated synthetic Postcode inputs rồi `Cancel` có zero-result UI và giữ draft khi reopen, không `Save`; fresh reload reset filter và rows trở lại. Control `Cancel` không đổi field vẫn có rows, count đổi. Console không xác lập filter-specific cause.
**Linked:** `Patients / Patient Search`, `workflows/patient-search.md#super-admin-gb-breadth--2026-10-22`.
**Created:** 2026-10-22
**Answered:** -

### Web Chat module authentication (2026-10-22)

**ID:** OQ-068
**Status:** Open
**Question:** Prerequisite/session và đường đăng nhập được duyệt nào mở Web Chat cho `Super Admin GB` khi Paco header đã authenticated nhưng module vẫn hiện `Welcome Back`/`Log in`?
**Impact:** Chặn current-role Virtual Appointments body; không replay Paco credential hoặc tương tác external identity host chưa cấu hình.
**Evidence:** `[Observed / Open Question]` `product-explore/auto-20261022-1001/ledger.md#15`; actual sidebar entry giữ verified Paco header, destination `/web-chat/` có module Login, không `Date Range`. Historical same-role SSO boundary: `workflows/web-chat-video.md#discovery-update-run-20261001-085609`.
**Linked:** `Web Chat & Video / Virtual Appointments`, `workflows/web-chat-video.md#super-admin-gb-auth-boundary--2026-10-22`; module auth gate độc lập với `DEC-patient-fixture`.
**Created:** 2026-10-22
**Answered:** -

### Reports current-role access (2026-10-22)

**ID:** OQ-069
**Status:** Open
**Question:** Permission/role prerequisite nào cho `Super Admin GB` xem SCR/Patient Cases khi actual header verified nhưng SCR báo not authorized và Patient Cases `Access Denied`; `Analytics` trong Reporting shell phải mở view nào?
**Impact:** Chặn current-role report data/search/filter và owned report lifecycle; không suy denial là defect hoặc tự đổi quyền.
**Evidence:** `[Observed / Open Question: dev, Super Admin GB]` `product-explore/auto-20261022-1206/ledger.md#15`, `reports-observation.json`; SCR denial và Patient Cases denial sau reload, return SCR settled header verified, Analytics click chưa changed known state.
**Linked:** `Analytics & Reports / Reports`, `workflows/analytics-reports.md#super-admin-gb-reports-access--2026-10-22`; độc lập với historical role-context OQ-063.
**Created:** 2026-10-22
**Answered:** -

### Rocket Bar client prerequisite (2026-10-22)

**ID:** OQ-070
**Status:** Open
**Question:** Installed Rocket Bar/client nào được phép dùng trong browser QA này; `Launch Rocket Bar` và `Download Rocket Bar` có destination, installation và cleanup scope được duyệt nào?
**Impact:** Chặn main desktop/client workflow; launcher menu vẫn map read-only được, không tự install hoặc launch runtime chưa rõ.
**Evidence:** `[Observed: dev, Super Admin GB]` `product-explore/auto-20261022-1414/ledger.md#6`: menu có hai enabled buttons, source page không đổi; chưa execute launch/download, menu đã đóng.
**Linked:** `Rocket Bar`, `workflows/rocket-bar.md`; độc lập với OQ-026 đã answered về desktop launcher khác global patient search.
**Created:** 2026-10-22
**Answered:** -

### Appointment configuration source search semantics (2026-10-22)

**ID:** OQ-071
**Status:** Open
**Question:** `Search Appointment Book...` và `Search Slot Type...` lọc rows đã tải hay toàn bộ source, và khi nào query retained/early fill sau reload được áp dụng lại?
**Impact:** Chặn dùng initial search miss/row absence làm persistence hoặc cleanup proof; cần exact owned editor và independent receiver readback.
**Evidence:** `[Observed / Open Question: dev, Super Admin GB]` `product-explore/auto-20261022-1742/ledger.md#3,#6`: owned Create/rename retained trong fresh editors nhưng reload/query retained hoặc early fill chưa hiện row; Book Enter không đổi, later clear/retype mới hiện exact row. Cleanup có independent receiver empty sau Archive; chưa xác định nguyên nhân chung.
**Linked:** `Appointment Books source`, `Slot Types source`, `workflows/appointment-books-settings.md`, `workflows/appointment-slot-types-settings.md`; không là permission hoặc mutation-authorization decision.
**Created:** 2026-10-22
**Answered:** -

### Saved Session rename không persist (2026-10-22)

**ID:** OQ-072
**Status:** Open
**Question:** Vì sao owned Session rename `Save` giữ drawer mở và original Name vẫn retained sau Discard/reload; lỗi `POST /dev/api/sessions/check-time-edit-impact` 404 có liên quan và có tái hiện trên fresh independent fixture không?
**Impact:** Chưa thể xác nhận saved Edit workflow hoặc defect/root cause, không retry mutation khi kết quả chưa reconcile.
**Evidence:** `[Observed / Open Question: dev, Super Admin GB]` `product-explore/auto-20261022-2011/ledger.md#3`: Save một lần, native inputs valid, metadata 404; fresh original present/edited absent sau Discard, rename `Inconclusive`.
**Linked:** `Appointment Sessions source`, `workflows/appointment-sessions-settings.md`.
**Created:** 2026-10-22
**Answered:** -

### Session template Delete và generated-occurrence cleanup (2026-10-22)

**ID:** OQ-073
**Status:** Open
**Question:** `Delete` owned Session template có loại generated occurrences hay chỉ source template; UI read-only nào xác nhận independently khi own Book/Slot Type đã Archive?
**Impact:** Giữ một potential leftover và cleanup `Inconclusive`, chưa thể kết luận schedule còn active hoặc đã sạch.
**Evidence:** `[Observed / Open Question: dev, Super Admin GB]` `product-explore/auto-20261022-2011/ledger.md#3–4`: Archive gate/export trước Delete có hai exact owned Session rows; fresh source sau Delete absent, prerequisites source/receiver absent sau Archive, nhưng không independent schedule readback.
**Linked:** `Appointment Sessions source`, `Appointment Book`, `workflows/appointment-sessions-settings.md`; không authorize restore, cancellation hoặc existing-record mutation.
**Created:** 2026-10-22
**Answered:** -

### User Portal embedded guide content không mở (2026-10-23)

**ID:** OQ-074
**Status:** Open
**Question:** Điều kiện nào cho phép embedded Scribe guide trong `User Portal` tải content khi viewer hiện `scribehow.com refused to connect.`; đây là browser/embed policy hay cấu hình guide?
**Impact:** Chặn kiểm guide steps/content dù category drilldown và outer viewer/Close đã có end states.
**Evidence:** `[Observed / Open Question: dev, Super Admin GB]` `product-explore/auto-20261023-0000/ledger.md#5`: exact guide icon mở drawer có iframe Scribe và rendered refusal; không interact destination, bypass policy hoặc dùng HTTP status làm root-cause proof.
**Linked:** `User Portal`, `workflows/user-training-portal.md`; không authorize external-site interaction hoặc policy change.
**Created:** 2026-10-23
**Answered:** -

### Health Form Preview Required marker semantics (2026-10-23)

**ID:** OQ-075
**Status:** Open
**Question:** Badge `Required*` trong Designer `Preview Form` là static required-field indicator hay validation feedback cần biến mất khi answer hợp lệ?
**Impact:** Chưa có trusted basis để dùng marker visibility làm required-answer pass/fail assertion.
**Evidence:** `[Observed / Open Question: dev, Super Admin GB]` `product-explore/auto-20261023-0000/ledger.md#8`: owned unsaved Text Input Required on/recording off, marker vẫn visible sau synthetic answer và blur; khác historical Blinx Deployment observation tại `product-explore/auto-20261021-1626/ledger.md#4–5`, không response Save/Submit.
**Linked:** `Health Forms Designer`, `workflows/health-forms.md`; không authorize response submit hoặc clinical filing.
**Created:** 2026-10-23
**Answered:** -

### Document default review semantics (2026-10-23)

**ID:** OQ-076
**Status:** Open
**Question:** Editor `No review needed` có quy định initial saved review status khác `Pending Review`, hay selector và review status là hai thuộc tính độc lập?
**Impact:** Chưa có trusted basis để đánh giá initial review status hoặc notification/queue behavior.
**Evidence:** `[Observed: dev, Super Admin GB]` `product-explore/auto-20261023-0506/ledger.md#2–3`: synthetic Document tạo với default copy, saved card Pending/detail Pending Review; manual Reviewed sau settled Save/reload verified; own document deleted, cleanup verified.
**Current evidence:** `product-explore/auto-20261023-0819/ledger.md#1`: control là checkbox, fresh default unchecked; explicit checked trước Save vẫn detail Pending Review sau reload. Không còn chỉ dựa trên label text; semantics/expected initial state vẫn cần trusted basis.
**Linked:** `Patient Profile / Documents`, `workflows/patient-profile.md`.
**Created:** 2026-10-23
**Answered:** -

### Document template management / cleanup (2026-10-23)

**ID:** OQ-077
**Status:** Open
**Question:** UI nào quản lý rename/delete template tạo bằng Patient Profile Documents `Save as Template`?
**Impact:** Owned template còn trên dev vì picker không có management action và bounded Configuration > Patient scan chưa tìm thấy route.
**Evidence:** `[Observed: dev, Super Admin GB]` `product-explore/auto-20261023-0819/ledger.md#3`: Save/reload picker/preview verified, generated document cleanup Done; template còn trong autonomous leftovers.
**Linked:** `Patient Profile / Documents`, `workflows/patient-profile.md`.
**Created:** 2026-10-23
**Answered:** -

## Tester notes
