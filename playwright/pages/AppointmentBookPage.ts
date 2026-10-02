import type { Locator, Page } from '@playwright/test';

/**
 * Appointment Book (`/paco-connect/appointment-book`) and the session slot editor dialog.
 * Source for all: PAC2-8241-TC-001-002-003-007.spec.ts. Pure page object.
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
}
