# Comms Hub — Campaign Manager

## Route
- URL: `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/commshub/campaign-manager/create`
- Note: double `/commshub/commshub` path is intentional (redirect from `/commshub/campaign-manager/create`)

## Auth
Separate auth domain — SSO from `blinx.dev.blinxpaco-np.com` does NOT carry over.
Manual login via `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/login` required.
After login, navigating to `/commshub/campaign-manager` works within the same browser session.

## Tech stack
- Bootstrap 4 + jQuery + custom Tail Select dropdowns (not MUI, not PrimeReact)
- React used for some components (textarea, tail select sync)
- Tail Select: custom select replacement (not a native `<select>` behavior)

## Campaign Setup — Step 1 fields

| Field | Type | Automation |
|---|---|---|
| `Campaign Name *` | Plain text input, `placeholder="Enter Campaign Name"` | `locator.fill()` works |
| `Patient Facing Campaign Display Name *` | React textarea | `locator.type()` (NOT `.fill()` — React state) |
| `SMS` consent pill | Display-only indicator | Not interactive |
| `Email` consent pill | Display-only indicator | Not interactive |
| `Campaign Type(s) *` | Tail Select (`.tail-select.js-campaignTypeDropdown`) | Click `.select-label` → options in `.select-dropdown` as `li[data-key="0"]` (Scheduled), `li[data-key="1"]` (Quick Send), `li[data-key="2"]` (Patient-Initiated); multi-select via `li.click()` |
| `Campaign Tags` | Tail Select (50+ tags) | Same pattern as Campaign Type |
| `Add appointment invitation` | Checkbox (`.checkbox-hollow`) | Click the div |
| `Add Health Form(s) to Campaign?` | Checkbox (`.checkbox-hollow`) | Click the div |
| `Next` button | `.next-page-btn` | Disabled until all required React-state fields filled |

### Tail Select automation pattern
```js
// Open dropdown
const ts = document.querySelector('.tail-select.js-campaignTypeDropdown');
ts.querySelector('.select-label').click(); // sets display:none→block on .select-dropdown
await page.waitForTimeout(300);

// Select option
const li = document.querySelector('.select-dropdown li[data-key="1"]');
li.click();
```

### React textarea automation
```js
// DOES NOT work:
ta.value = 'text';
ta.dispatchEvent(new Event('input', {bubbles:true}));

// WORKS:
locator.type('text', {delay: 80});
```

### Next button gating
- `button.next-page-btn` is `disabled=true` by default
- No HTML `required` attributes — validation is React-level
- Must fill `Campaign Name` (input) AND `Patient Facing Campaign Display Name` (textarea) before Next enables
- SMS/Email pills are display-only, NOT gating factors

## Hidden conditional inputs (appear when SMS/Email selected)
- `#emailFromAddress` — text input
- `#emailSubjectLine` — text input
- `#smsFromName` — text input
- `#webformSelectionSearch` — text input (health form search)

## Stable selectors
- Campaign name: `input[placeholder="Enter Campaign Name"]`
- Patient facing name: `textarea[placeholder="Patient Facing Campaign Display Name"]`
- Tail select label: `.tail-select .select-label`
- Next button: `button.next-page-btn`
- Campaign type options: `.select-dropdown li[data-key="0/1/2"]`
- Tags options: `.select-dropdown li[data-key="<id>"]`
- Consent pills: `.comms-consent-pill-sms`, `.comms-consent-pill-email`
- Appointment invite checkbox: `[class*=js-appointment-invite]` or `.checkbox-hollow` near "Add appointment invitation"
- Health form checkbox: `.js-cc-addHealthFormsRow .checkbox-hollow`

## Step 1 → Step 2 Navigation (Critical Automation Gap)

**Step 1 validation gates progression** via `campaignSetupStepValidation()`:
1. `newCampaignNameValid=true` — async axios check, skippable: `window.newCampaignNameValid = true`
2. `campaignCreationObj.DESCRIPTION` non-empty — set via: `$('.campaign-description-input').val('text'); $(descInput).trigger('input')`
3. SMS or Email selected — toggle via: `document.getElementById('newCampaignSmsBtn').click()` (DOM `.click()`, NOT jQuery `.trigger('click')` which toggles OFF)

**CRITICAL**: The `.campaign-description-input` textarea is overlaid by a React-rendered div. Playwright `locator.fill()` and `locator.type()` cannot interact with it (element covered). jQuery `.trigger('input')` fires the JS event handler correctly (sets `campaignCreationObj.DESCRIPTION`) but does NOT update the React textarea display — so the visual shows empty while the JS state is correct. This makes E2E automation of Step 1 unfeasible without full E2E test framework (Puppeteer with headless browser + React DevTools, or Cypress).

**Step 2 (Patient List)** and **Step 3 (Review)** cannot be reached programmatically.

## Other Comms Hub Pages
- **Campaign Manager list**: AG Grid (`ag-theme-balham-dark`, `.newTableComponent`) — 873 `ag-*` class elements, full AG Grid with sorting, filtering, pagination. Data loaded via API.
- **Campaign Outbox**: Tail Select (`.tail-select`) + plain text `Search campaigns...` input.
- **Settings**: `404` — route not found.
- **User Management**: `404` — route not found.
- **Analytics**: Separate auth required — redirects to login page.

## Provenance and gaps
- Raw evidence: `test-results/product-survey/batch37-comms-hub-20260916/`
- Open questions: Quick Send flow (Patient-Initiated campaign type), Patient List step (Step 2), Review step (Step 3), campaign tags creation, campaign editing existing campaigns, editing existing campaigns in the list view.
- Route: `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/commshub/campaign-manager/create`
- Consent pills: SMS and Email pills are display-only, not checkbox inputs — they reflect patient communication preferences
- Next button disabled state: React controlled, no external value indicators
- Assertions lacking trusted expected basis: exact validation rules for enabling Next, campaign type impact on subsequent steps, tag selection defaults
