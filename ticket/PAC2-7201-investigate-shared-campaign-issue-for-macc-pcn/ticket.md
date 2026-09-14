# Investigate Shared Campaign Issue for MACC PCN

## Description

In the organisation, Macclesfield PCN, all of the PCN’s shared patient initiated campaigns are created and managed.

Adult Blood Test and SEVERAL others are missing entirely from Macclesfield PCN.

There are **at least 3 campaigns missing for each practice** (campaigns shared seperately to individual sites) for the blood test options (Adult, LD, Child).

Video on [BH-41375](https://blinxsolutions.atlassian.net/browse/BH-41375#icft=BH-41375) shows example from Broken Cross DFD - the patient initiated campaigns are still accessible (tested off video) to patients, and appear to be working.

However,

- In broken cross (and all other sites) the campaign status is set to “failed”
- The campaigns do not show up in the home organisation of macclesfield PCN, and thereby cannot be managed.

## Testing Details

I think there is a bug affecting comms hub sign in from Blinx Demo Site organisation, I will alert technical team but hopefully this is a good start

### You will want to

- Create a campaign at Redmoor Liverpool and share to Blinx Demo Site, and check you can view and edit from the creator organisation
- Create a campaign at Blinx Demo Site and share to Redmoor, and check you can view and edit from the creator organisation
- Edit both and check can still view & edit, and that campaign stays in the Shared dropdown in Comms Hub

