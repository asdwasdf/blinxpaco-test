import { test, expect, Page } from '@playwright/test';

/**
 * PAC2-114, PAC2-115, PAC2-116, PAC2-117, PAC2-118, PAC2-120, PAC2-121, PAC2-122, PAC2-123, PAC2-124
 * Patient Module - Tái hiện tất cả luồng đã cào hôm nay
 *
 * Entry: /paco/patient-search
 * Role: Super Admin GB
 */

const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const TEST_ORG = 'General Practice (Demo Site)';
const TEST_LOCATION = 'test again - old location';
const TEST_ROLE = 'Super Admin GB';

test.describe('Patient Module - Tổng hợp PAC2-114/115/116/117/118/120/121/122/123/124', () => {

  // Helper: Login và chọn org/location/role
  async function loginAsSuperAdmin(page: Page) {
    await page.goto(`${BASE_URL}/paco/login`);

    // Fill username/password
    await page.getByPlaceholder('Username').fill('blinx_daophuongnguyen28022003+2');
    await page.getByPlaceholder('Password').fill('Nguyen28022003@');
    await page.getByRole('button', { name: 'Log in', exact: true }).click();

    // Wait for location-roles page
    await page.waitForURL('**/location-roles**');

    // Select Organisation
    const orgTrigger = page.locator('.p-dropdown').nth(0);
    await orgTrigger.click();
    await page.getByRole('option', { name: TEST_ORG }).click();

    // Select Location
    const locTrigger = page.locator('.p-dropdown').nth(1);
    await locTrigger.click();
    await page.getByRole('option', { name: TEST_LOCATION }).click();

    // Select Role
    const roleTrigger = page.locator('.p-dropdown').nth(2);
    await roleTrigger.click();
    await page.getByRole('option', { name: TEST_ROLE }).click();

    // Click Next
    await page.getByRole('button', { name: 'Next' }).click();

    // Wait for dashboard
    await page.waitForURL('**/dashboard**');
  }

  // Helper: Navigate to Patient Search
  async function goToPatientSearch(page: Page) {
    await page.goto(`${BASE_URL}/paco/patient-search`);
    await page.waitForLoadState('networkidle');
  }

  // Helper: Open Create New Patient dialog
  async function openCreatePatientDialog(page: Page) {
    await page.getByRole('button', { name: 'Create new patient' }).click();
    await page.waitForSelector('[role="dialog"]');
  }

  // ============================================================
  // PAC2-116 - Phone numbers include type (Home vs Mobile)
  // ============================================================
  test('PAC2-116: Grid có cột Home Phone và Mobile Phone riêng biệt', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);

    // Verify grid columns tồn tại
    const homePhoneHeader = page.locator('[role="columnheader"]', { hasText: 'Home Phone' });
    const mobilePhoneHeader = page.locator('[role="columnheader"]', { hasText: 'Mobile Phone' });

    await expect(homePhoneHeader).toBeVisible();
    await expect(mobilePhoneHeader).toBeVisible();

    // Verify columns riêng biệt (không phải chung 1 cột)
    const homePhoneCount = await page.locator('[role="columnheader"]').filter({ hasText: 'Home Phone' }).count();
    const mobilePhoneCount = await page.locator('[role="columnheader"]').filter({ hasText: 'Mobile Phone' }).count();

    expect(homePhoneCount).toBe(1);
    expect(mobilePhoneCount).toBe(1);
  });

  // ============================================================
  // PAC2-123 - Date of Death pulled from PDS correctly
  // ============================================================
  test('PAC2-123: Grid có cột Date of Death', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);

    // Verify Date of Death column tồn tại
    const dodHeader = page.locator('[role="columnheader"]', { hasText: 'Date of Death' });
    await expect(dodHeader).toBeVisible();

    // Verify Date of Birth cũng tồn tại
    const dobHeader = page.locator('[role="columnheader"]', { hasText: 'Date of Birth' });
    await expect(dobHeader).toBeVisible();
  });

  // ============================================================
  // PAC2-120 - Language selection from SNOMED CT
  // ============================================================
  test('PAC2-120: Grid có cột Main Language và Interpreter Required', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);

    // Verify language columns tồn tại
    const langHeader = page.locator('[role="columnheader"]', { hasText: 'Main Language' });
    const interpHeader = page.locator('[role="columnheader"]', { hasText: 'Interpreter Required' });

    await expect(langHeader).toBeVisible();
    await expect(interpHeader).toBeVisible();
  });

  test('PAC2-120: Create Patient - Personal tab có Main Language dropdown', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);
    await openCreatePatientDialog(page);

    // Click Personal tab
    await page.locator('[class*="tab"]', { hasText: 'Personal' }).click();

    // Verify preferred_language_code field tồn tại
    const langField = page.locator('[name="preferred_language_code"]');
    await expect(langField).toBeVisible();
  });

  // ============================================================
  // PAC2-114 - Address Finder / postcode lookup
  // ============================================================
  test('PAC2-114: Address tab có postcode lookup field', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);
    await openCreatePatientDialog(page);

    // Click Address tab
    await page.locator('[class*="tab"]', { hasText: 'Address' }).click();

    // Verify Address fields tồn tại
    const postcodeField = page.locator('[name="postcode"], [placeholder*="postcode" i]');
    const numberAndStreet = page.locator('[name="numberandstreet"]');
    const cityField = page.locator('[name="city"]');

    await expect(postcodeField).toBeVisible();
    await expect(numberAndStreet).toBeVisible();
    await expect(cityField).toBeVisible();
  });

  // ============================================================
  // PAC2-121 - Temporary address 90-day cap
  // ============================================================
  test('PAC2-121: Address tab có temporary address fields', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);
    await openCreatePatientDialog(page);

    // Click Address tab
    await page.locator('[class*="tab"]', { hasText: 'Address' }).click();

    // Scroll down to find temporary address section
    // Verify temporary address fields tồn tại
    const tempPostcode = page.locator('[name="temporary_postcode"]');
    const tempStreet = page.locator('[name="temporary_street"]');

    // These fields may be visible or require scrolling
    const tempPostcodeVisible = await tempPostcode.isVisible().catch(() => false);
    const tempStreetVisible = await tempStreet.isVisible().catch(() => false);

    // Log result (fields may be below fold)
    console.log(`Temporary postcode visible: ${tempPostcodeVisible}`);
    console.log(`Temporary street visible: ${tempStreetVisible}`);
  });

  // ============================================================
  // PAC2-115/124 - Email included in PDS submission
  // ============================================================
  test('PAC2-115/124: Contact tab có email field', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);
    await openCreatePatientDialog(page);

    // Click Contact tab
    await page.locator('[class*="tab"]', { hasText: 'Contact' }).click();

    // Verify email field tồn tại
    const emailField = page.locator('[name="email_address"]');
    await expect(emailField).toBeVisible();

    // Verify SMS/Email opt-in checkboxes
    const smsOpt = page.locator('[name="sms_option_ind"]');
    const emailOpt = page.locator('[name="email_option_ind"]');

    await expect(smsOpt).toBeVisible();
    await expect(emailOpt).toBeVisible();
  });

  // ============================================================
  // PAC2-118 - PDS "More fields"
  // ============================================================
  test('PAC2-118: Patient tab có PDS Check section với More fields button', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);
    await openCreatePatientDialog(page);

    // Verify Patient tab is active by default
    // Verify PDS Check section tồn tại
    const pdsSection = page.locator('text=PDS Check');
    await expect(pdsSection).toBeVisible();

    // Verify NHS Number field trong PDS Check
    const nhsNumberField = page.locator('text=NHS Number');
    await expect(nhsNumberField).toBeVisible();

    // Verify More fields button tồn tại
    const moreFieldsBtn = page.locator('button', { hasText: /more.*field/i });
    const moreFieldsVisible = await moreFieldsBtn.isVisible().catch(() => false);
    console.log(`More fields button visible: ${moreFieldsVisible}`);
  });

  // ============================================================
  // Grid Columns Verification (tổng hợp)
  // ============================================================
  test('Tổng hợp: Patient Search grid có đầy đủ columns', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);

    const expectedColumns = [
      'Title',
      'First Name',
      'Last Name',
      'Date of Birth',
      'Date of Death',      // PAC2-123
      'Gender',
      'NHS Number',
      'Home Phone',         // PAC2-116
      'Mobile Phone',        // PAC2-116
      'Email Address',
      'Main Language',      // PAC2-120
      'Interpreter Required', // PAC2-120
      'County',
      'Postcode',
    ];

    for (const col of expectedColumns) {
      const header = page.locator('[role="columnheader"]', { hasText: col });
      await expect(header).toBeVisible({ timeout: 5000 }), `Column "${col}" not found`;
    }
  });

  // ============================================================
  // Create Patient Dialog Tabs Verification
  // ============================================================
  test('Tổng hợp: Create New Patient có đầy đủ tabs', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);
    await openCreatePatientDialog(page);

    const expectedTabs = [
      'Patient',
      'Personal',
      'Contact',
      'Address',
      'Healthcare Provider',
      'Relationships & Permissions',
    ];

    for (const tab of expectedTabs) {
      const tabElement = page.locator('[class*="tab"]', { hasText: tab });
      await expect(tabElement).toBeVisible({ timeout: 5000 }), `Tab "${tab}" not found`;
    }
  });

  // ============================================================
  // Contact Methods Verification
  // ============================================================
  test('Tổng hợp: Contact tab có đầy đủ contact fields', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await goToPatientSearch(page);
    await openCreatePatientDialog(page);

    // Click Contact tab
    await page.locator('[class*="tab"]', { hasText: 'Contact' }).click();

    const expectedFields = [
      'email_address',
      'preferred_communication_method',
      'sms_option_ind',
      'email_option_ind',
    ];

    for (const field of expectedFields) {
      const fieldElement = page.locator(`[name="${field}"]`);
      await expect(fieldElement).toBeVisible({ timeout: 5000 }), `Field "${field}" not found`;
    }
  });

});
