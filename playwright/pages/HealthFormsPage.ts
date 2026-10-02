import type { Locator, Page } from '@playwright/test';

/**
 * Health Forms / Booking Link tabs inside the Quick Send dialog.
 * Pure page object.
 */
export class HealthFormsPage {
  constructor(readonly page: Page) {}

  /** `tab-Health Forms` button. Source: PAC2-4700-base/health-booking, PAC2-5776 guided spec */
  healthFormsTab(scope: Locator | Page = this.page): Locator {
    return scope.getByRole('button', { name: 'tab-Health Forms', exact: true });
  }

  /** `tab-Booking Link` button. Source: PAC2-4700-health-booking, PAC2-5776 guided spec */
  bookingLinkTab(scope: Locator | Page = this.page): Locator {
    return scope.getByRole('button', { name: 'tab-Booking Link', exact: true });
  }

  /** `tab-Files` button. Source: PAC2-4700-base-mutation.spec.ts */
  filesTab(scope: Locator | Page = this.page): Locator {
    return scope.getByRole('button', { name: 'tab-Files', exact: true });
  }

  /** Visible "Select Health Form" selector text. Source: PAC2-4700-health-booking.spec.ts */
  selectHealthFormText(dialog: Locator): Locator {
    return dialog.getByText('Select Health Form', { exact: true }).filter({ visible: true });
  }

  /** "Select Health Form" dropdown. Source: PAC2-5776-TC-004.guided.spec.ts */
  selectHealthFormDropdown(): Locator {
    return this.page.getByRole('dialog').locator('.p-dropdown').filter({ hasText: 'Select Health Form' });
  }

  /** `Add Health Form(s)` control. Source: PAC2-5776-TC-004.guided.spec.ts */
  get addHealthFormsControl(): Locator {
    return this.page.getByText('Add Health Form(s)', { exact: true });
  }

  /** Health form search textbox. Source: PAC2-5776-TC-004.guided.spec.ts */
  get healthFormSearch(): Locator {
    return this.page.getByRole('textbox', { name: 'Search...', exact: true });
  }

  /** "Added Health Forms:" label. Source: PAC2-5776-TC-004.guided.spec.ts */
  addedHealthFormsLabel(dialog: Locator): Locator {
    return dialog.getByText('Added Health Forms:', { exact: true });
  }

  /** Visible "Booking Link" heading text in dialog. Source: PAC2-4700-health-booking.spec.ts */
  bookingLinkText(dialog: Locator): Locator {
    return dialog.getByText('Booking Link', { exact: true }).filter({ visible: true }).first();
  }
}
