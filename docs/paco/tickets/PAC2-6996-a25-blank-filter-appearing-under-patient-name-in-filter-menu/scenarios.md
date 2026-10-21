# PAC2-6996 Scenarios

## SC-001: Verify no blank filter under Patient Name in filter menu

**Mutation class**: None (read-only visual verification)

**Entry**: `/paco/dashboard` → sidebar → `Appointment Book`

**Preconditions**: Authenticated session, Super Admin GB role

**Steps**:
1. Navigate to Appointment Book (`/paco-connect/appointment-book`)
2. Wait for content to load
3. Click `Filters` toolbar button
4. Observe filter sidebar/panel
5. Locate `Patient Name` section
6. Verify no blank/empty filter option appears under Patient Name

**Expected**: No blank filter option visible under "Patient Name" section

**Observable assertions**:
- Filter sidebar opens
- "Patient Name" label present
- All options under "Patient Name" have non-empty text labels

**Evidence**: Screenshot or DOM capture of filter panel with Patient Name section

---

## SC-002: Apply Patient Name filter with valid name

**Mutation class**: None (read-only filtering)

**Entry**: `/paco-connect/appointment-book`

**Preconditions**: Authenticated session, appointments visible in calendar

**Steps**:
1. Navigate to Appointment Book
2. Open Filters
3. Expand Patient Name section
4. Enter valid patient name in filter input
5. Verify appointments are filtered correctly
6. Close filters

**Expected**: Filtered appointments match the entered patient name

**Observable assertions**:
- Patient Name input accepts text
- Calendar shows filtered results matching patient

---

## SC-003: Full filter menu smoke (regression check)

**Mutation class**: None (read-only)

**Entry**: `/paco-connect/appointment-book`

**Preconditions**: Authenticated session

**Steps**:
1. Open Appointment Book
2. Click Filters to open filter panel
3. Scan all filter sections (Location, Slot Type, Session, Clinician, Patient Name, Appointment Type)
4. Verify no section contains a blank/empty option label

**Expected**: All filter sections display only non-empty, valid option labels

**Observable assertions**:
- Every filter option has visible text
- No empty strings rendered as filter options
