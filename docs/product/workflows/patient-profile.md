# Patient Profile & PDS Gate 1 Epic

## PDS Gate 1 — Epic Overview (PAC2-63)

### Epic Summary
**PAC2-63 — PDS Gate 1** là Epic tích hợp NHS Personal Demographic Service (PDS) vào Patient registration.

### Epic Children Tickets
| Ticket | Title | Status |
|--------|-------|--------|
| `PAC2-114` | Address finder / postcode lookup | ✅ Done |
| `PAC2-115` | Email sent to PDS submission | ✅ Done |
| `PAC2-116` | Phone numbers include type | ✅ Done |
| `PAC2-117` | Address Line 5 map to county | ✅ Done |
| `PAC2-118` | PDS "More fields" | ✅ Done |
| `PAC2-120` | Language selection SNOMED CT | ✅ Done |
| `PAC2-121` | Temporary address 90-day cap | ✅ Done |
| `PAC2-122` | Postcode for temporary/billing address | ✅ Done |
| `PAC2-123` | Date of Death pulled from PDS | ✅ Done |
| `PAC2-124` | Email field included in PDS update | ✅ Done |

### Entry Point
1. Navigate to `/paco/patient-search`
2. Click `Create new patient` button
3. Dialog `Create New Patient` opens

### Create New Patient Tabs
1. **Patient** — PDS Check section, NHS Number, "More fields"
2. **Personal** — Date of Birth, Date of Death, Language, etc.
3. **Contact** — Email, Phone (Home/Mobile), SMS/Email options
4. **Address** — Postcode lookup, Temporary address with 90-day cap
5. **Healthcare Provider** — GP details
6. **Relationships & Permissions**

### Patient Search Grid Columns
| Column | Source |
|--------|--------|
| Date of Birth | PDS |
| Date of Death | PDS (PAC2-123) |
| Home Phone | PDS (PAC2-116) |
| Mobile Phone | PDS (PAC2-116) |
| Email Address | PDS (PAC2-115/124) |
| Main Language | PDS SNOMED CT (PAC2-120) |
| Interpreter Required | PDS |
| County | PDS (PAC2-117) |
| Postcode | PDS |

---

## Address Finder / Postcode Lookup (PAC2-114)

### Entry
1. Navigate to `/paco/patient-search`
2. Click `Create new patient` button
3. Dialog `Create New Patient` opens with tabs: Patient, Personal, Contact, **Address**, Healthcare Provider, Relationships & Permissions
4. Click **Address** tab

### Address Finder Flow
- Field: `Search by postcode` (combobox)
- Type UK postcode (e.g., "NG1 1EA") → suggestions appear
- Select suggestion → address fields auto-populate:
  - `numberandstreet` (Address line 1)
  - `village` (Address line 2)
  - `city` (Town/City)
  - County (auto-filled)
  - Postcode (auto-filled)

### Address Fields
| Field Name | Type | Notes |
|---|---|---|
| `numberandstreet` | textbox | Address line 1 |
| `village` | textbox | Address line 2 (optional) |
| `city` | textbox | Town/City |
| `locality_desc` | textbox | Locality (optional) |
| `county` | combobox | Auto-populated from postcode lookup |
| `postcode` | textbox | Postcode |
| `access_instructions` | textbox | Access instructions (optional) |

### Temporary Address Fields
Same fields prefixed with `temporary_`:
- `temporary_house_flat`
- `temporary_street`
- `temporary_town_city`
- `temporary_postcode`
- `temporary_access_instructions`

### Technical Notes
- Postcode lookup integrates with PDS (Personal Demographic Service) or external address service
- Auto-populate reduces manual entry errors
- Service availability depends on NHS connectivity
- **PAC2-117 Bug Fix:** Address Line 5 → County mapping (PDS "S Yorkshire" vs "South Yorkshire" discrepancy fixed)

### Related Tickets
- `PAC2-114` — Address finder / postcode lookup (base feature)
- `PAC2-117` — County mapping bug fix (S Yorkshire vs South Yorkshire)
- `PAC2-118` — PDS Check More fields (additional PDS info)
- `PAC2-121` — Temporary address 90-day cap restriction

## Temporary Address — 90-Day Cap (PAC2-121)

### Entry
1. Navigate to `/paco/patient-search`
2. Click `Create new patient` button
3. Dialog `Create New Patient` → **Address** tab
4. Scroll to Temporary Address section

### Temporary Address Fields
| Field Name | Type | Notes |
|---|---|---|
| `temporary_address_type` | select | Address type (e.g., Temporary) |
| `temporary_house_flat` | textbox | House name/flat number |
| `temporary_street` | textbox | Street address |
| `temporary_town_city` | textbox | Town/City |
| `temporary_postcode` | textbox | Postcode |
| `temporary_access_instructions` | textbox | Access instructions |

### Validation Rules (PAC2-121)
- **90-day cap:** End date must be ≤ 90 days after Start date
- **Max date for temporary address:** Tomorrow (not today)
- **Billing address:** Max date is today (future date throws error)
- Same rules apply to temporary emails and phones

### NHS PDS Guidelines
Reference: [Get and update contact details in PDS - NHS England Digital](https://digital.nhs.uk/developer/api-catalogue/personal-demographics-service-fhir/get-and-update-contact-details-in-pds#contact-details-for-healthcare-workers)

### Test Scenarios
1. Temporary address with end date ≤ 90 days → accepted ✓
2. Temporary address with end date > 90 days → validation error
3. Temporary address end date = tomorrow → accepted
4. Billing address with future date → error thrown

## PDS Check — More Fields (PAC2-118)

### Entry
1. Navigate to `/paco/patient-search`
2. Click `Create new patient` button
3. Dialog `Create New Patient` opens with tabs
4. Click **Patient** tab
5. Scroll to **PDS Check** section

### PDS Check Section
- **NHS Number** field
- **Postcode** field (for PDS lookup)
- **Last Name** field
- **Date of Birth** field
- **"More fields"** button — expands to show additional PDS fields when no match

### More Fields Expansion
When PDS returns no match or partial match:
- Click "More fields" button to expand
- Additional patient demographics visible:
  - Middle Names
  - Known as
  - Previous Family Name
  - Title
  - etc.

### Technical Notes
- PDS (Personal Demographic Service) lookup for NHS patient verification
- "More fields" reveals additional demographics for manual matching
- **PAC2-122 Bug Fix:** PDS payload must include postalCode for temporary/billing addresses

### Test Scenarios
1. Valid UK postcode → address auto-populated ✓
2. Invalid/incomplete postcode → no suggestions
3. Edit auto-filled address → manual override preserved
4. Clear postcode → address fields cleared

## Phone Types / Contact Methods (PAC2-116)

### Entry
1. Navigate to `/paco/patient-search`
2. Grid columns: `Home Phone`, `Mobile Phone`, `Email Address`, `Preferred Contact Method`, `SMS Options`, `Email Options`
3. Or: Click `Create new patient` → **Contact** tab

### Patient Search Grid Columns
| Column | Description |
|---|---|
| `Home Phone` | Home telephone number |
| `Mobile Phone` | Mobile/cell phone number |
| `Email Address` | Email address |
| `Preferred Contact Method` | Contact preference (phone/email/SMS) |
| `SMS Options` | SMS opt-in status |
| `Email Options` | Email opt-in status |
| `Preferred Communication Method` | Communication preference |

### Contact Tab Fields
| Field Name | Type | Notes |
|---|---|---|
| `email_address` | textbox | Email input |
| `preferred_communication_method` | select | Preferred contact method |
| `expressed_by` | select | Who expressed the preference |
| `sms_option_ind` | checkbox | SMS opt-in |
| `email_option_ind` | checkbox | Email opt-in |

### Technical Notes
- Phone numbers have distinct types (Home vs Mobile) for easier mapping/filtering
- Contact preferences allow patients to specify preferred communication method
- SMS/Email options track consent for digital communications
- **PAC2-115 Bug Fix:** Email address must be included in PDS submission payload
- **PAC2-124:** Email field included in PDS update (related fix)

### Test Scenarios
1. Grid displays Home Phone and Mobile Phone in separate columns ✓
2. Create patient with phone type selection preserved
3. Preferred contact method displayed in patient list
4. SMS/Email opt-in checkboxes functional

## Patient Search — Date of Death (PAC2-123)

### Entry
1. Navigate to `/paco/patient-search`
2. Grid columns: `Date of Death`
3. PDS Check section pulls Date of Death from NHS PDS

### Patient Search Grid Columns
| Column | Description |
|---|---|
| `Date of Death` | Date patient passed away (from PDS) |
| `Date of Birth` | Patient's birth date |

### Technical Notes
- **PAC2-123 Bug Fix:** Date of Death must pull correctly from PDS
- Date format: DD/MM/YYYY (NHS standard)
- Deceased patients may have restricted access to certain features
- PDS Check shows deceased patient indicator in UI

### Related Tickets
- `PAC2-123` — Date of Death pulled from PDS correctly (bug fix)

## Language Selection (PAC2-120)

### Entry
1. Navigate to `/paco/patient-search`
2. Grid columns: `Main Language`, `Interpreter Required`
3. Or: Click `Create new patient` → **Personal** tab → `Main Language` dropdown

### Patient Search Grid Columns
| Column | Description |
|---|---|
| `Main Language` | Patient's primary language (from PDS) |
| `Interpreter Required` | Whether interpreter is needed |

### Personal Tab Fields
| Field Name | Type | Notes |
|---|---|---|
| `preferred_language_code` | select | Language selection (SNOMED CT codes) |
| `interpreter_required_ind` | select | Interpreter required flag |

### Technical Notes
- **PAC2-120:** Language dropdown populated from SNOMED CT instead of hardcoded 5 languages
- SNOMED CT language codes provide comprehensive language coverage
- PDS lookup can populate language from NHS demographic data
- Interpreter flag supports accessibility requirements

### Related Tickets
- `PAC2-120` — Populate language selection from SNOMED CT (fixes limited language list)
