# Requirements - PAC2-7579

## Ticket Summary
PACO Assist Copying Campaign Tag Configuration

## Problem Statement
When a new campaign is created using Paco Assist from a quicksend campaign, an irrelevant Comms Hub tag is retained. This can result in incorrect tagging and coding on the new campaign.

## Observed Behavior (from video)
- Source campaign: "Smear Campaign 2024" with Comms Hub tag "Smear (CWoSP) [Primary]"
- Action: Use Paco Assist to create new campaign from source
- **Actual**: New campaign keeps the "Smear (CWoSP) [Primary]" tag from original
- **Expected**: New campaign should NOT retain Comms Hub tag from original

## Source Evidence
- Video: `ticket/PAC2-7579-paco-assist-copying-campaign-tag-configuration/attachments/126650-20260911-1530-05.8922959.mp4`
- Frame analysis: `docs/tickets/PAC2-7579-paco-assist-copying-campaign-tag-configuration/video/video-notes.md`

## Flow Reconstructed
1. User navigates to PACO Connect dashboard
2. User selects existing campaign (e.g., "Smear Campaign 2024")
3. User clicks dropdown → selects "Paco Assist"
4. New campaign form opens at `/paco-connect/campaigns/create?campaignId=<uuid>&copyFrom=<uuid>`
5. **BUG**: Tags section shows "Comms Hub Tags: Smear (CWoSP) [Primary]" - tag retained from source

## Requirements

### REQ-001: Clear Comms Hub Tags on Paco Assist Copy
**Classification**: Observed (from video evidence)
**Priority**: High
**Description**: When creating a new campaign via Paco Assist, the system should NOT retain Comms Hub tags from the source campaign.

**Basis**: Video frame_003-frame_005 show tag "Smear (CWoSP) [Primary]" automatically selected in new campaign form.

**Test Scope**:
- Feature: PACO Connect → Campaigns → Create with Paco Assist
- Input: Source campaign with Comms Hub tag
- Expected: New campaign form has NO Comms Hub tag selected by default

## Open Questions
- Does this bug also affect other tag types (e.g., PACO Tags)?
- Is there a specific campaign type (e.g., "smear invite") that triggers this behavior?
- What is the expected behavior for tag inheritance (none, all, or user-selectable)?

## Acceptance Criteria
Not provided in ticket. Based on problem statement: "the tag should not be retained from the original campaign."
