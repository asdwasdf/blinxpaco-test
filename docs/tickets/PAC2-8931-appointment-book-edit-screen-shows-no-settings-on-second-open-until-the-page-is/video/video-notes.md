# Video Evidence Analysis — PAC2-8931

**Source:** `128932-8931.mp4` (94.98s)  
**Reviewed:** 2026-10-07

## Numbered reproduction steps

### First open (working state)

1. **Screen:** PACO Connect > Configuration > Appointment Books listing  
   **Action:** Click three-dots menu icon on appointment book `111 PC24`  
   **Input:** None  
   **Result:** Context menu appears showing `Edit`, `View Audit`, `Archive` options  
   **Evidence:** Frame 0045, 0055

2. **Screen:** Context menu  
   **Action:** Click `Edit` option  
   **Input:** None  
   **Result:** Right-side edit panel slides open with header `Edit Appointment Book`  
   **Evidence:** Frame 0050-0055

3. **Screen:** Edit panel (first open)  
   **Action:** Observe rendered content  
   **Input:** None  
   **Result:** Panel displays correctly populated fields:
   - `Name` textbox: `111 PC24`
   - `Shared Organisations` dropdown: shows `Primary Care 24, General Practice (Demo Site)`
   - Below dropdown: Two pink pills visible: `Primary Care 24` with X button, `General Practice (Demo Site)` with X button
   **Evidence:** Frame 0060, 0070

4. **Screen:** Edit panel open  
   **Action:** Click X icon (top-right of panel) to close  
   **Input:** None  
   **Result:** Panel closes, returns to appointment books listing  
   **Evidence:** Frame 0075

### Second open (bug state)

5. **Screen:** Appointment Books listing (after first close)  
   **Action:** Navigate away via left menu  
   **Input:** Click `Appointment Settings` then back to `Appointment Books`  
   **Result:** Page navigates away showing loading spinner `Loading appointment books`, then returns to listing  
   **Evidence:** Frame 0080-0095

6. **Screen:** Appointment Books listing  
   **Action:** Click three-dots menu on same `111 PC24` appointment book  
   **Input:** None  
   **Result:** Context menu appears with `Edit`, `View Audit`, `Archive`  
   **Evidence:** Frame 0095

7. **Screen:** Context menu  
   **Action:** Click `Edit`  
   **Input:** None  
   **Result:** Edit panel slides open  
   **Evidence:** Frame 0095-0100

8. **Screen:** Edit panel (second open) — **BUG OBSERVED**  
   **Action:** Observe rendered content  
   **Input:** None  
   **Result:** Panel header shows `Edit Appointment Book` but content is BLANK:
   - `Name` textbox appears empty/blank in visible area
   - `Shared Organisations` field visible but no pink pills rendered below dropdown
   - The data exists (dropdown shows text) but selected organizations NOT displayed as pills
   **Evidence:** Frame 0100, 0101

## Bug behavior

**First open:** Edit panel displays all settings correctly — `Name` field populated, `Shared Organisations` shows both the dropdown value AND the selected organizations as removable pink pills below.

**Second open:** Edit panel header renders, but form content does NOT display:
- `Name` field appears blank/unpopulated
- `Shared Organisations` dropdown may show text but selected pills do NOT render below it
- Data exists in memory (dropdown text visible) but UI components fail to display

**After page refresh:** Settings display correctly again on first open, then bug repeats on subsequent second open.

## Exact UI text and labels observed

- Panel header: `Edit Appointment Book`
- Field label: `Name`
- Field label: `Shared Organisations`
- First open pills: `Primary Care 24`, `General Practice (Demo Site)` (pink background, white text, X button)
- Loading text: `Loading appointment books`
- Menu options: `Edit`, `View Audit`, `Archive`

## Understanding level

**85%**

Clear repro: first open works, second open fails to render form fields. Data exists (dropdown text visible) but selected organization pills and populated name field do NOT display. Pattern is consistent: blank on second open until page refresh.

## Open questions

- Does the bug occur if user saves changes on first open before closing, then opens second time?
- Does the bug occur if user opens different appointment book second (not same one)?
- Are form fields actually empty (data cleared) or just not rendering (display bug)?
- Does closing panel via backdrop click vs X button vs Save make a difference?
- Browser console errors during second open?
