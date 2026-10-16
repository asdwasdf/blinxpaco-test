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

  /** Visible "Select Health Form" selector text. Source: PAC2-5776-TC-004.guided.spec.ts */
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

  // ─── PAC2-4837: HF Inbox (Classic + New 2.0) ────────────────────────────
  // Source: docs/tickets/PAC2-4837-blank-patient-record-status-causing-failure-to-resync-hf/test-results-manual.md (2026-10-15)

  /** Classic Health Form Inbox URL. Source: PAC2-4837/test-results-manual.md */
  get classicInboxUrl(): string {
    return 'https://blinx.dev.blinxpaco-np.com/health-forms/responses/';
  }

  /** New Health Form Inbox URL (beta). Source: PAC2-4837/test-results-manual.md */
  get newInboxUrl(): string {
    return 'https://blinx.dev.blinxpaco-np.com/health-forms/inbox-2.0';
  }

  /** `Not Synced to PR` filter button in Classic Inbox (count dynamic). Source: PAC2-4837/test-results-manual.md */
  notSyncedFilterButton(): Locator {
    return this.page.getByRole('button', { name: /^Not Synced to PR \(\d[\d,]*\)$/ });
  }

  /** "Review Form" action cell in Classic Inbox grid (open form detail dialog). Source: PAC2-4837/test-results-manual.md */
  reviewFormCell(): Locator {
    return this.page.getByRole('gridcell', { name: 'Review Form', exact: true }).first();
  }

  /** "Save Status" column header in New Inbox. Source: PAC2-4837/test-results-manual.md */
  saveStatusColumnHeader(): Locator {
    return this.page.getByRole('columnheader', { name: 'Save Status', exact: true });
  }

  /** MUI dialog form-detail wrapper. Source: PAC2-4837/test-results-manual.md */
  get formDetailDialog(): Locator {
    return this.page.locator('.MuiDialog-root').filter({ hasText: /Submit Online Consultation|Configure/ });
  }

  /** "More Actions" toggle button in form detail dialog. Source: PAC2-4837/test-results-manual.md */
  moreActionsButton(): Locator {
    return this.formDetailDialog.getByRole('button', { name: 'More Actions', exact: true });
  }

  /** Resync action menu item. Accepts "Resync" / "Re-sync to Patient Record" / "Re-sync". Source: PAC2-4837/test-results-manual.md */
  resyncMenuItem(): Locator {
    return this.page.getByRole('menuitem', { name: /^(Resync|Re-sync to Patient Record|Re-sync)$/i });
  }
}
