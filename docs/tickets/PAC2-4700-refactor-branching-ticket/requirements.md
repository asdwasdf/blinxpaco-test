# Requirements: PAC2-4700

**Input Revision:** 1
**Generated:** 2026-09-21T09:26:03.445Z
**Status:** Active

## Source Summary

Ticket refactor UI components cho consistency và reduce global style pollution. Testing cross-environment consistency (OS, GP, Connect, PC24) sau khi refactor. QA focus vào major visual/functional regressions trong inputs, dropdowns, checkboxes, forms, email templates, attachments, booking-link controls.

**Scope:** UI consistency testing cho core elements across 4 environments.

**Key Changes:** Storybook wrapper components align với PrimeReact, global-style cleanup, font standardization.

## Video Coverage

- **VID-01:** Dropdown persistence behaviour ở OS (00:19) - Timeline unreviewed
- **VID-02:** Connect walkthrough (05:00) - Timeline unreviewed  
- **VID-03:** GP walkthrough (04:51) - Timeline unreviewed
- **VID-04:** OS walkthrough (03:13) - Timeline unreviewed

Video timelines có frames nhưng chưa được review để map behaviour cụ thể. Evidence references trong ticket citations.

## Atomic Requirements

### REQ-PAC2-4700-001

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Campaign template default selection  
**Search Terms/Aliases:** campaign, template, email template, SMS template, default template, message template  
**Known Location:** Unknown  
**Actor/Role:** Unknown  
**Acceptance Criteria Status:** Present

**Preconditions:**
- User có quyền tạo campaign
- Có email và SMS templates available

**Expected Behavior:**
Core UI elements behave và render consistently across OS, GP, Connect, PC24. Default template behaviour phải consistent giữa environments.

**Observed Deviation:**
Connect/GP default tới SMS template và không có patient email. OS defaults tới email template và hiển thị patient email (`michael@blinxsolutions.com`).

**Provenance:**
- **Source:** ticket.md:51-57, 127
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** IMG-01 (OS email dropdown)  
**Related Tests:** TC-PAC2-4700-001  
**Notes:** QA question: "Is OS using a different data set from GP/Connect?"

---

### REQ-PAC2-4700-002

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** Campaign sorting options  
**Search Terms/Aliases:** campaign, sort, sorting, dropdown, sort by date, A-Z, Z-A, message type  
**Known Location:** Unknown  
**Actor/Role:** Unknown  
**Observation Context:** GP environment, QA testing session  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Campaign list có items để sort

**Expected Behavior:**
Sorting options consistent across environments với matching visual theme.

**Observed Deviation:**
- Sorting options bây giờ match
- GP hiển thị unusual grey-box theme khác với Connect/OS
- GP có extra Z-A sorting option không có trong Connect

**Provenance:**
- **Source:** ticket.md:59-62, 101, 115
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** IMG-02 (GP sorting dropdown với grey highlighting), VID-03  
**Related Tests:** TC-PAC2-4700-002

---

### REQ-PAC2-4700-003

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** Dropdown persistence behavior  
**Search Terms/Aliases:** dropdown, persist, persistence, close, dismiss, behaviour  
**Known Location:** Unknown  
**Actor/Role:** Unknown  
**Observation Context:** OS environment, comparison với Connect/GP  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Dropdown menu opened

**Expected Behavior:**
Dropdown behaviour consistent across environments - auto-dismiss sau selection hoặc click outside.

**Observed Deviation:**
Dropdown behaviour khác ở OS: boxes persist. Connect/GP auto-dismiss correctly.

**Provenance:**
- **Source:** ticket.md:64-68, 129
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** VID-01 (00:19)  
**Related Tests:** TC-PAC2-4700-003

---

### REQ-PAC2-4700-004

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** Patient documents/attachments display  
**Search Terms/Aliases:** attachments, documents, patient documents, patient profile, file upload, available options  
**Known Location:** Patient profile side panel  
**Actor/Role:** Unknown  
**Observation Context:** Cross-environment testing (OS, GP, Connect)  
**Acceptance Criteria Status:** Present

**Preconditions:**
- Patient profile opened
- Documents/attachments exist trong system

**Expected Behavior:**
Attachments và documents có no major visual or functional regressions. Consistent availability across environments.

**Observed Deviation:**
- Attachments hiện ở GP và Connect
- OS hiển thị "No available options"
- GP documents stuck "permaloading"
- Connect documents load OK

**Provenance:**
- **Source:** ticket.md:70-74, 103-104, 92, 117
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** IMG-03 (OS Attachments panel), VID-02, VID-03, VID-04  
**Related Tests:** TC-PAC2-4700-004

---

### REQ-PAC2-4700-005

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** EMIS slot-type mapping display  
**Search Terms/Aliases:** EMIS, slot type, slot-type, appointment slot, mapped slot, virtual mental health  
**Known Location:** Booking/appointment area  
**Actor/Role:** Unknown  
**Observation Context:** Cross-environment testing  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- EMIS slot-type mapping configured
- Appointment booking flow accessed

**Expected Behavior:**
Mapped EMIS slot type hiển thị correctly across all environments. Text centered.

**Observed Deviation:**
- OS và GP không pull mapped EMIS slot type (empty fields)
- Connect hiển thị slot correctly ("Virtual Mental Health…")
- Text bây giờ centered (correct)

**Provenance:**
- **Source:** ticket.md:76-82, 106, 119
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** IMG-04 (comparison OS/GP empty vs Connect showing slot), VID-02, VID-03, VID-04  
**Related Tests:** TC-PAC2-4700-005

---

### REQ-PAC2-4700-006

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Core UI inputs, dropdowns, checkboxes, forms  
**Search Terms/Aliases:** input, dropdown, checkbox, form, text input, form field, form control  
**Known Location:** Unknown  
**Actor/Role:** Unknown  
**Acceptance Criteria Status:** Present

**Preconditions:**
- UI elements rendered trong application

**Expected Behavior:**
Inputs, dropdowns, checkboxes, forms have no major visual or functional regressions. Behaviour consistent across OS, GP, Connect, PC24.

**Provenance:**
- **Source:** ticket.md:27
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** General acceptance criteria  
**Related Tests:** Multiple TCs cover này

---

### REQ-PAC2-4700-007

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** Booking Links text alignment  
**Search Terms/Aliases:** booking link, booking links, text alignment, centered, centre, alignment  
**Known Location:** Booking Links page  
**Actor/Role:** Unknown  
**Observation Context:** Cross-environment comparison  
**Acceptance Criteria Status:** Present (booking-link controls)

**Preconditions:**
- Booking Links page accessed

**Expected Behavior:**
Booking-link controls have no major visual regressions. Text alignment consistent.

**Observed Deviation:**
- Connect: words không centered trên Booking Links page
- GP: words bây giờ centered (correct)
- OS: text centered (correct)

**Provenance:**
- **Source:** ticket.md:96, 108
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** VID-02 (Connect), VID-03 (GP), VID-04 (OS)  
**Related Tests:** TC-PAC2-4700-007

---

### REQ-PAC2-4700-008

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** Patient profile cards styling  
**Search Terms/Aliases:** patient profile, side panel, cards, documents card, profile cards, panel cards  
**Known Location:** Patient profile side panel  
**Actor/Role:** Unknown  
**Observation Context:** OS environment comparison  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Patient profile side panel opened

**Expected Behavior:**
Patient-profile cards render consistently across environments.

**Observed Deviation:**
Cards trong patient-profile side panel (documents và others) look different ở OS.

**Provenance:**
- **Source:** ticket.md:115-116
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** VID-04  
**Related Tests:** TC-PAC2-4700-008

---

### REQ-PAC2-4700-009

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** Test Results scrolling area  
**Search Terms/Aliases:** test results, scroll, scrolling, individual scroll area, scroll area  
**Known Location:** Test Results section  
**Actor/Role:** Unknown  
**Observation Context:** OS environment  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Test Results có content để scroll

**Expected Behavior:**
Test Results scrolling behaviour consistent across environments.

**Observed Deviation:**
OS Test Results không có individual scroll area available trong GP/Connect.

**Provenance:**
- **Source:** ticket.md:119
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** VID-04  
**Related Tests:** TC-PAC2-4700-009

---

### REQ-PAC2-4700-010

**Classification:** Inferred  
**Lifecycle:** Active  
**Feature/Scope:** Scheduler-link popup  
**Search Terms/Aliases:** scheduler link, scheduler popup, needed popup, booking popup  
**Known Location:** Unknown  
**Actor/Role:** Unknown  
**Inference Basis:** QA mentioned "missing despite the link being present"  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Scheduler link present trong UI

**Expected Behavior:**
Scheduler-link popup hiển thị khi trigger action.

**Observed Deviation:**
Scheduler-link popup missing ở Connect, OS, GP despite link being present.

**Provenance:**
- **Source:** ticket.md:96
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** VID-02 (Connect mention)  
**Related Tests:** TC-PAC2-4700-010  
**Notes:** Need visual confirmation của expected popup behaviour

---

## Performance Observations

Các observations sau không phải functional requirements nhưng noted cho investigation:

- **Health Forms tab:** Connect good performance, GP poor performance với long load times
- **Saved campaigns:** Connect slow load, GP quick load
- **EMIS slot loading:** GP poor performance
- **Appointment slots:** OS loads slowly

**Source:** ticket.md:93-94, 105-107, 119

---

## Ambiguities and Conflicts

### AMB-001: OS Data Set Difference

QA question: "Is OS using a different data set from GP/Connect?"

**Evidence:** OS shows patient email và defaults to email template, while GP/Connect default to SMS với no patient email.

**Impact:** Cannot determine nếu behaviour là intentional difference hoặc bug cho đến khi data set được confirm.

**Source:** ticket.md:55

---

### AMB-002: Intentional Environment Differences

Acceptance Criteria states: "Any intentional differences between environments are documented."

**Current Status:** No documentation tìm thấy trong ticket về intentional differences. Multiple differences observed nhưng không clear nào là intentional vs bugs.

**Source:** ticket.md:28

---

## Open Questions

### OQ-001: Default Template Logic

**Question:** What determines default campaign template selection (SMS vs Email)? Có phải environment-specific configuration hoặc data-driven?

**Impact:** Blocks proper test design cho REQ-PAC2-4700-001. Cannot write expected behaviour without knowing intended logic.

**Source:** Inferred từ findings 1

---

### OQ-002: OS Data Set Configuration

**Question:** Does OS intentionally use different data set từ GP/Connect?

**Impact:** Affects multiple requirements (REQ-PAC2-4700-001, possibly 004). Need confirmation để classify behaviours as bugs vs expected.

**Source:** ticket.md:55

---

### OQ-003: Grey-Box Theme Intentional

**Question:** Is GP grey-box theme cho sorting dropdown intentional design differentiation?

**Impact:** Determines whether REQ-PAC2-4700-002 deviation là bug hoặc expected.

**Source:** ticket.md:60-62

---

### OQ-004: Z-A Sort Option

**Question:** Should Z-A sorting option có trong all environments hoặc GP-only?

**Impact:** Test design cho REQ-PAC2-4700-002.

**Source:** ticket.md:101, 115

---

### OQ-005: Scheduler-Link Popup Expected Behaviour

**Question:** What should scheduler-link popup look like và what triggers it?

**Impact:** Cannot design assertion cho REQ-PAC2-4700-010 without baseline.

**Source:** ticket.md:96

---

### OQ-006: Video Timeline Review Status

**Question:** All video timelines marked "Unreviewed". Video frames có detailed visual observations?

**Impact:** May have additional requirement details trong video frames không captured trong ticket text summary.

**Source:** video/VID-01/timeline.md through VID-04/timeline.md

---

## Tester notes

[Protected area]
