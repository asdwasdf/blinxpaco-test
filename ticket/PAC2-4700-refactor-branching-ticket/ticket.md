# Refactor (here for branching purposes only)

## Description

Keeping this ticket for branching purposes.

**Branched cleanly from 4683** (containing all new QS changes and features across the team).

## Summary

This work item involved refactoring UI components across multiple applications to improve consistency and reduce global style pollution, with ongoing testing and merge activities.

- Multiple environments (OS, GP, Connect, PC24) displayed differences in email templates, dropdown behaviours, attachment visibility, and slot-type rendering, highlighting inconsistencies across platforms.
- The team focused on standardising core UI elements by creating Storybook wrapper components that closely follow PrimeReact, ensuring consistent styling and behaviour across all consuming applications.
- Several conflicts in PRs were resolved, and local testing confirmed UI consistency, but deployment issues in GitHub Actions temporarily blocked end-to-end testing.
- The team planned to review feature-branch links for UI consistency, address any hotfixes, and proceed with merging after review and approval, with an ETA pending from @Michael Ramella.
- Significant global-style cleanup was performed, including replacing inconsistent fonts, removing unnecessary Tailwind utilities, and centralising component styles, with a focus on non-disruptive, behind-the-scenes improvements.
- QA was instructed to focus on major visual or functional regressions—such as broken inputs, dropdowns, checkboxes, and form behaviours—due to the extensive scope of the refactor and the need for thorough testing across all affected applications.

## Ticket Outcome

_To be completed._

## Acceptance Criteria

- Core UI elements behave and render consistently across OS, GP, Connect, and PC24.
- Inputs, dropdowns, checkboxes, forms, email templates, attachments, and booking-link controls have no major visual or functional regressions.
- Any intentional differences between environments are documented.
- Feature branches are reviewed and approved before merging.

## Technical / Design Details

- **UX or UI changes:** Yes — visual consistency and shared component behaviour.
- **DB changes or API query updates:** To be confirmed.
- **Design (UX/UI):** Storybook wrapper components aligned closely with PrimeReact.

## Feature Branch Links

All links below use the `pac2-4700-qs-only` feature branch:

- **PACO Connect:** https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/
- **GP (Supergrid):** https://pac2-4700-qs-only.dev.blinxpaco-np.com
- **PACO OS / PACO 24:** https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard
- **Rocket Bar and PACO Talk:** No feature-branch deployment pipeline is available, so there are currently no preview URLs.
---

## QA Notes — Quick Retest of Previous Scenarios

Only had time for a quick test, so previous scenarios were revisited.

### 1. Email template selection

All three areas now open the email template first. However, OS lists a different email address from the other two environments.

**Question:** Is OS using a different data set from GP/Connect?

> 🖼️ **[IMG-01] Image evidence:** OS email dropdown displaying `michael@blinxsolutions.com`.

### 2. Campaign sorting theme

Sorting options now match, but GP displays an unusual grey-box theme compared with Connect/OS.

> 🖼️ **[IMG-02] Image evidence:** GP sorting dropdown with grey highlighting. Options shown: By date (descending), By date (ascending), By message type, A–Z, and Z–A.

### 3. Dropdown persistence

Dropdown behaviour differs in OS compared with Connect/GP: boxes persist in OS.

> 🎥 **[VID-01] Video evidence (00:19):** Dropdown persistence behaviour demonstrated in OS.

### 4. Attachments

Attachments appear in GP and Connect, but none appear in OS.

> 🖼️ **[IMG-03] Image evidence:** OS Attachments panel displays “No available options”.

### 5. EMIS slot-type mapping

OS and GP are not pulling in the mapped EMIS slot type. Connect displays the slot correctly. Text is now centred, which is correct.

> 🖼️ **[IMG-04] Image evidence:** Comparison between OS/GP with empty slot-type fields and Connect showing the mapped “Virtual Mental Health…” slot.

---

## Cross-Environment Consistency Review

Testing focused only on consistency of behaviour across all three environments; unrelated bugs were ignored for this pass.

### Connect

- Defaults to the SMS template and has no patient email.
- Patient documents and booking links are available.
- Good performance in the Health Forms tab.
- Newly saved campaigns load very slowly.
- Words are not centred on the Booking Links page.
- Scheduler-link popup is missing despite the link being present; the popup is also absent in OS and GP.

> 🎥 **[VID-02] Video evidence (05:00):** Connect behaviour and performance walkthrough.

### GP

- Defaults to the SMS template and has no patient email.
- Has an extra Z–A sorting option on the campaign screen that is not present in Connect.
- Documents do not load and remain stuck on “permaloading”.
- Poor performance in the Health Forms tab, with long loading times.
- Poor performance while loading available slot types from EMIS.
- Newly saved campaigns load very quickly.
- Words are now centred on the Booking Links page.

> 🎥 **[VID-03] Video evidence (04:51):** GP behaviour and performance walkthrough.

### OS

- Defaults to the email template and displays a patient email.
- Has the extra Z–A sorting option.
- Cards in the patient-profile side panel—documents and others—look different.
- Documents do not remain loading, but the UI reports that no options are available.
- Appointment slots load slowly; words are centred, unlike in Connect.
- Test Results does not have the individual scroll area available in GP/Connect.

> 🎥 **[VID-04] Video evidence (03:13):** OS behaviour and performance walkthrough.

---

## Key Findings

1. Default campaign template behaviour is inconsistent: Connect/GP default to SMS, while OS defaults to email and shows a patient email.
2. Sorting options and styling differ between environments, particularly the Z–A option and GP grey-box theming.
3. Dropdown persistence differs in OS.
4. Attachment/document availability and loading states are inconsistent.
5. EMIS slot-type mappings do not appear in OS and GP but do appear in Connect.
6. Performance differs significantly across Health Forms, saved campaigns, and EMIS slot loading.
7. Booking-link text alignment is consistent in OS/GP but not Connect.
8. Patient-profile cards and Test Results scrolling differ in OS.

## Recommended QA Focus

- Confirm whether OS intentionally uses a different data set.
- Verify the expected default template and patient-email behaviour.
- Standardise sorting options, dropdown theming, and persistence.
- Validate document and attachment API responses and empty/loading states.
- Confirm EMIS slot mapping across all environments.
- Compare performance baselines for Health Forms, saved campaigns, and appointment-slot loading.
- Standardise Booking Links alignment, patient-profile cards, and Test Results scrolling.

## Evidence Legend

- `IMG-xx` — 🖼️ Image/screenshot evidence
- `VID-xx` — 🎥 Video evidence

## Media Attachment Checklist

- [ ] **IMG-01** — OS email dropdown
- [ ] **IMG-02** — GP sorting dropdown and grey-box theme
- [ ] **VID-01** — OS dropdown persistence (00:19)
- [ ] **IMG-03** — OS Attachments panel with no available options
- [ ] **IMG-04** — EMIS slot-type comparison across OS/GP and Connect
- [ ] **VID-02** — Connect walkthrough (05:00)
- [ ] **VID-03** — GP walkthrough (04:51)
- [ ] **VID-04** — OS walkthrough (03:13)
- [ ] **IMG-05** — PAC2-4700 feature-branch links
