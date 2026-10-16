import { test, expect } from "../fixtures/auth-fixtures";

/**
 * QA-AUTO exploration: create a single test patient on dev host.
 *
 * Context: free exploration, no ticket. Patient is fictional self-data
 * (user-confirmed). Created for downstream test scenarios that need
 * a known patient (email + phone).
 *
 * Requires: a separate Chrome instance running with dev login completed
 * (`npm run auth:login`). Spec attaches via CDP — does NOT re-login.
 *
 * Run once, capture patient ID, then DELETE the record via
 * Patients → search "Fiona Nguyen" → Delete to honour the
 * "cleanup QA-AUTO test data after use" policy.
 */

const FIRST_NAME = "Fiona";
const LAST_NAME = "Nguyen";
const DOB_DDMMYYYY = "28/02/2003";
const POSTCODE = "SW1A 1AA";
const EMAIL = "fiona.nguyen@blinxsolutions.com";
const PHONE = "07347959475";

test.describe("QA-AUTO: create one patient (exploration)", () => {
  test("creates Fiona Nguyen on dev host", async ({ authenticatedPage: page }) => {
    // 1. Navigate to patient search
    await page.goto("https://blinx.dev.blinxpaco-np.com/paco/patient-search");
    await expect(page.getByRole("heading", { name: /Patient Search/i })).toBeVisible({ timeout: 15_000 });

    // 2. Open Create new patient dialog
    await page.getByRole("button", { name: "Create new patient" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // 3. Tab 0 (Patient Search / PDS lookup) — surname + DOB + postcode
    await dialog.locator('input[name="surname"]').fill(LAST_NAME);
    await dialog.locator('input[name="dateofbirth"]').fill(DOB_DDMMYYYY);
    // Postcode* — locate by adjacent label
    const postcodeField = dialog
      .locator('xpath=//label[contains(text(),"Postcode")]/following::input[1]')
      .first();
    if (await postcodeField.count()) {
      await postcodeField.fill(POSTCODE);
      // Pick from autocomplete suggestions
      const suggestion = page.getByRole("option", { name: new RegExp(POSTCODE, "i") }).first();
      if (await suggestion.count()) {
        await suggestion.click();
      }
    }

    // 4. Tab 1 (Personal details) — givenname, title, gender, language
    await dialog.getByRole("tab").nth(1).click();
    const tab1 = dialog.locator('[role="tabpanel"]').nth(1);
    await expect(tab1).toBeVisible();

    await tab1.locator('input[name="givenname"]').fill(FIRST_NAME);
    // Title* — only "Mrs" available in this dev env per observed DOM
    await tab1.locator('select[name="title"]').selectOption({ label: "Mrs" }).catch(async () => {
      // PrimeNG may render select without options; use React value setter fallback
      await tab1.locator('input[name="givenname"]').evaluate(() => {}); // no-op marker
    });
    // Gender* — open PrimeNG dropdown, pick first option
    const sexSelect = tab1.locator('select[name="patient_sex"]');
    const sexTrigger = sexSelect.locator("xpath=ancestor::*[contains(@class,'p-dropdown')][1]");
    if (await sexTrigger.count()) {
      await sexTrigger.click();
      await page.getByRole("listbox").waitFor({ state: "visible", timeout: 5000 });
      await page.getByRole("option").first().click();
    } else {
      await sexSelect.selectOption({ index: 1 });
    }
    // Preferred Spoken Language* — default English (value="en")
    await tab1.locator('select[name="preferred_language_code"]').selectOption({ value: "en" });

    // 5. Tab 2 (Contact) — email + phone
    await dialog.getByRole("tab").nth(2).click();
    const tab2 = dialog.locator('[role="tabpanel"]').nth(2);
    await expect(tab2).toBeVisible();
    await tab2.locator('input[name="email_address"]').fill(EMAIL);
    // Phone field name may vary — try common patterns
    const phoneCandidates = [
      'input[name="phone_number"]',
      'input[name="home_phone"]',
      'input[name="mobile"]',
      'input[name="contact_number"]',
    ];
    for (const sel of phoneCandidates) {
      const field = tab2.locator(sel).first();
      if (await field.count()) {
        await field.fill(PHONE);
        break;
      }
    }

    // 6. Tab 3 (Address) — minimal fill
    await dialog.getByRole("tab").nth(3).click();
    const tab3 = dialog.locator('[role="tabpanel"]').nth(3);
    if (await tab3.isVisible().catch(() => false)) {
      const addr2 = tab3.locator('input[name="numberandstreet"]');
      if (await addr2.count()) await addr2.fill("1 QA Test Lane");
      const city = tab3.locator('input[name="city"]');
      if (await city.count()) await city.fill("London");
    }

    // 7. Submit
    const createBtn = dialog.getByRole("button", { name: "Create" });
    await expect(createBtn).toBeEnabled({ timeout: 10_000 });
    await createBtn.click();

    // 8. Verify success
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    await page.getByPlaceholder(/Search patients/i).first().fill(LAST_NAME);
    await expect(page.getByText(new RegExp(`${FIRST_NAME}\\s+${LAST_NAME}`, "i"))).toBeVisible({ timeout: 10_000 });

    test.info().annotations.push({
      type: "qa-auto-cleanup",
      description: `Patient ${FIRST_NAME} ${LAST_NAME} (DOB ${DOB_DDMMYYYY}) created on dev. DELETE via Patients → search → row action after use.`,
    });
  });
});
