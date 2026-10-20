# Video Notes - PAC2-7579

## Frames Extracted
- frame_001.jpg: 00:00 - PACO Connect campaign list
- frame_002.jpg: 00:30 - Campaign selected with Paco Assist option
- frame_003.jpg: 01:00 - Campaign create form with Tags section
- frame_004.jpg: 01:30 - Tags section showing retained tag
- frame_005.jpg: 02:00 - Final view of campaign

## Observed Flow
1. **Campaign List** (frame_001): PACO Connect dashboard showing "Smear Campaign 2024" in Draft status
2. **Select Paco Assist** (frame_002): User clicks campaign → dropdown shows "Paco Assist" option
3. **Create with Paco Assist** (frame_003): New campaign form opens via URL `/paco-connect/campaigns/create?campaignId=...&copyFrom=...`
4. **BUG OBSERVED** (frame_003-005): Tags section shows **"Comms Hub Tags: Smear (CWoSP) [Primary]"** - this tag is retained from original campaign!

## Environment
- URL pattern: `/paco-connect/campaigns/create?campaignId=<uuid>&copyFrom=<uuid>`
- UI: Quicksend v2.0, PACO Connect
- Tag dropdown: Comms Hub Tags section with "Smear (CWoSP) [Primary]" selected

## Bug Confirmation
**Expected**: New campaign created via Paco Assist should NOT retain Comms Hub tag from original
**Actual**: Tag "Smear (CWoSP) [Primary]" is automatically selected in the new campaign

This confirms the bug described in the ticket.
