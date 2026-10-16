import type { Locator, Page } from '@playwright/test';

/**
 * Appointment Book (`/paco-connect/appointment-book`) and the session slot editor dialog.
 * Source for editor/session locators: PAC2-8241-TC-001-002-003-007.spec.ts.
 * Source for Day view + Audit dialog + Mark-as-menu locators: PAC2-8999 manual-test.md.
 * Pure page object.
 */
export class AppointmentBookPage {
  constructor(readonly page: Page) {}

  /** Session header button, name `Session Name <name>`. */
  sessionHeader(sessionName: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`Session Name ${sessionName}`) }).first();
  }

  /** Session region containing slots. */
  sessionRegion(sessionName: string): Locator {
    return this.page.getByRole('region', { name: new RegExp(sessionName) });
  }

  /** Slot buttons in a session region. */
  slots(sessionName: string): Locator {
    return this.sessionRegion(sessionName).getByRole('button', { name: 'slots span' });
  }

  /** `Edit Session` context menu item. */
  get editSessionMenuItem(): Locator {
    return this.page.getByRole('menuitem', { name: 'Edit Session' });
  }

  /** Slot editor dialog. */
  get editor(): Locator {
    return this.page.getByRole('dialog');
  }

  /** "Session ends at:" text in editor. */
  get sessionEndsAt(): Locator {
    return this.editor.getByText('Session ends at:');
  }

  /** Slot items in editor. */
  get slotItems(): Locator {
    return this.editor.locator('[aria-label=slot-item]');
  }

  get undoButton(): Locator {
    return this.editor.getByRole('button', { name: 'Undo' });
  }

  get closeButton(): Locator {
    return this.editor.getByRole('button', { name: 'Close' });
  }

  /** Editor `Save` (last = footer). */
  get saveButton(): Locator {
    return this.editor.getByRole('button', { name: 'Save', exact: true }).last();
  }

  get selectAllCheckbox(): Locator {
    return this.editor.getByRole('checkbox').first();
  }

  get actionsButton(): Locator {
    return this.editor.getByRole('button', { name: 'Actions' });
  }

  /** `Bookable` checkbox in Actions panel (last). */
  get bookableCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: 'Bookable' }).last();
  }

  /** Slot type dropdown in Actions panel (last). */
  get slotTypeDropdown(): Locator {
    return this.page.locator('.p-dropdown[class*="preview-modal__dropdown"]').last();
  }

  /** Slot type option by exact name. */
  slotTypeOption(type: string): Locator {
    return this.page.getByRole('option', { name: type, exact: true });
  }

  /** Actions panel `Save` (first). */
  get actionsSaveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' }).first();
  }

  // ─── Day view / Quick Book / Appointment Details sidebar / Audit dialog ───
  // Source: PAC2-8999 manual-test.md (2026-10-15 14:49)

  /** `Quick Book Appointment` dialog. */
  get quickBookDialog(): Locator {
    return this.page.getByRole('dialog', { name: /Quick Book Appointment/i });
  }

  /** Patient search input inside Quick Book dialog. */
  get quickBookPatientSearch(): Locator {
    return this.quickBookDialog.getByPlaceholder(/search patient/i);
  }

  /** Quick Book dialog `Book Appointment` confirmation button. */
  get quickBookConfirmButton(): Locator {
    return this.quickBookDialog.getByRole('button', { name: 'Book Appointment', exact: true });
  }

  /** Quick Book dropdown row matching exact NHS display text. */
  quickBookPatientRow(nhsDisplay: string): Locator {
    return this.quickBookDialog
      .locator('[role="option"], li, .p-dropdown-item')
      .filter({ hasText: nhsDisplay })
      .filter({ visible: true });
  }

  /** Appointment Details sidebar (PrimeVue `p-sidebar`). */
  get appointmentSidebar(): Locator {
    return this.page.locator('.p-sidebar');
  }

  /** `Mark as:` chevron trigger on appointment sidebar. */
  get markAsButton(): Locator {
    return this.page.locator('[aria-label="patient-status-button"]');
  }

  /** Patient-status menuitems (Patient Arrived / Consultation Started / Consultation Ended / Patient Left / Did Not Attend / Cancel). */
  get statusMenuItems(): Locator {
    return this.page.getByRole('menuitem').filter({ visible: true });
  }

  /** `Cancel` menuitem in Mark-as menu (accessible name `Cancel Appointment`). */
  get cancelMenuItem(): Locator {
    return this.page.getByRole('menuitem', { name: /Cancel Appointment|^Cancel$/ });
  }

  /** PACO Patient Audit modal opened from Patient Search row action menu. */
  get auditDialog(): Locator {
    return this.page.getByRole('dialog', { name: /Audit Trail/i });
  }

  /** Audit dialog search input. */
  get auditSearch(): Locator {
    return this.auditDialog.getByPlaceholder(/Search by category, user, event/i);
  }

  /** Audit AG Grid rows (Date/Time + Summary columns). */
  get auditRows(): Locator {
    return this.auditDialog.locator('.ag-row, [role="row"]').filter({ has: this.page.locator('[col-id]') });
  }
}
