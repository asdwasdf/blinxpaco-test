# Feature Location: PAC2-4700

**Ticket:** PAC2-4700-refactor-branching-ticket  
**Input Revision:** 1  
**Environment:** OS (planned), GP (planned), Connect (planned)  
**Role:** Unknown  
**Generated:** 2026-09-21T09:34:51.782Z  
**Status:** Blocked

## Location Attempt Summary

LOCATE phase blocked - Playwright MCP plugin tools không available trong session. Browser automation required cho bounded scan nhưng tools không load.

## Requirements Needing Location

Từ requirements.md, 10 atomic requirements cần locate:

1. **REQ-PAC2-4700-001:** Campaign template default selection
   - Search terms: campaign, template, email template, SMS template
   - Hint: Comms Hub workflow (`nhs-comms-hub-dev.blinxhealthcare.com`)
   
2. **REQ-PAC2-4700-002:** Campaign sorting options
   - Search terms: campaign, sort, sorting, dropdown
   - Hint: Campaign Manager list
   
3. **REQ-PAC2-4700-003:** Dropdown persistence behavior
   - Search terms: dropdown, persist, persistence
   
4. **REQ-PAC2-4700-004:** Patient documents/attachments
   - Search terms: attachments, documents, patient documents
   - Hint: Patient Profile workflow → Documents tab
   - Route clue: `/paco/patient-profile/<guid>/documents`
   
5. **REQ-PAC2-4700-005:** EMIS slot-type mapping
   - Search terms: EMIS, slot type, appointment slot
   
6. **REQ-PAC2-4700-006:** Core UI inputs/dropdowns/checkboxes
   - Generic UI elements across features
   
7. **REQ-PAC2-4700-007:** Booking Links text alignment
   - Search terms: booking link, text alignment
   
8. **REQ-PAC2-4700-008:** Patient profile cards styling
   - Search terms: patient profile, side panel, cards
   - Hint: Patient Profile workflow
   
9. **REQ-PAC2-4700-009:** Test Results scrolling
   - Search terms: test results, scroll, scrolling
   
10. **REQ-PAC2-4700-010:** Scheduler-link popup
    - Search terms: scheduler link, popup

## Workflow Hints Available

### From `docs/product/workflows/patient-profile.md`

**Entry route:** 
1. `/paco/patient-search`
2. Search patient → `Actions > Profile`
3. Opens `/paco/patient-profile/<guid>/dashboard`

**Tabs observed:**
- Timeline
- Coding
- **Documents** ← REQ-004
- Investigations
- Payments

**Documents tab specifics:**
- Route: `/paco/patient-profile/<guid>/documents`
- Filters: All/Pending/Reviewed
- Empty state: "There are no patient attachments"
- Classification: `Observed` trong dev, Super Admin GB

### From `docs/product/workflows/comms-hub.md`

**Campaign Manager:**
- **Separate auth domain:** `nhs-comms-hub-dev.blinxhealthcare.com`
- Route: `/commshub/commshub/campaign-manager/create`
- Tech: Bootstrap 4 + jQuery + Tail Select dropdowns (NOT PrimeReact)
- Campaign list: AG Grid với sorting/filtering

**Note:** Comms Hub là separate application với separate auth. Ticket testing Paco environments (OS/GP/Connect), không clear nếu Comms Hub included.

## Feature Branch URLs

Ticket provides 3 environments:

1. **PACO OS/PACO 24:**  
   `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard`

2. **GP (Supergrid):**  
   `https://pac2-4700-qs-only.dev.blinxpaco-np.com`

3. **PACO Connect:**  
   `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/`

Cross-environment testing là ticket scope - cần verify route và behavior ở cả 3.

## Product Graph Search

Searched `docs/product/survey/graph.json` cho campaign/template/attachment/booking/slot terms - no matches found. Graph có thể chưa cover các features này.

## Candidates

Không có candidates - scan chưa chạy do blocker.

## Rejected Paths

None - không attempt nào được thực hiện.

## Budget

- **Meaningful views:** 0 of 12 max
- **Time elapsed:** 0 of 15 minutes max
- **Budget status:** Not started

## Blocker Details

**Type:** Missing browser automation capability  
**Detail:** Playwright MCP plugin tools không available trong session này. LOCATE phase requires:
- Navigate tới feature branch URLs
- Authenticate manually
- Bounded scan từ dashboard
- Capture screenshots cho evidence

Không thể verify MCP configuration (settings.json blocked by permissions).

## Next Actions

### Option 1: Fix Playwright Setup
1. Verify MCP server config trong `~/.claude/settings.json` hoặc `settings.local.json`
2. Restart Claude Code session để reload MCP connections
3. Retry LOCATE phase

### Option 2: Manual Exploration
1. Tester tự navigate browser tới feature branch
2. Document route/screenshots manually
3. Update feature-location.md với findings

### Option 3: Skip LOCATE
Ticket đã có 4 videos (VID-01 through VID-04) với contact sheets covering behaviors. TEST_DESIGN có thể proceed từ:
- Requirements (10 atomic requirements)
- Video evidence (timelines unreviewed nhưng contact sheets available)
- Workflow hints (Patient Profile, Comms Hub)

**Recommended:** Option 3 - proceed tới TEST_DESIGN. Video evidence đủ cho test case design mà không cần interactive LOCATE.

## Dependencies

- **Input:** requirements.md (checksum: 687558e535709207c6720cc959192e4288271d36381aa1ba16a33aaf0a3f6aba)
- **Dependency revision:** 1

---

## Tester notes

[Protected area]
