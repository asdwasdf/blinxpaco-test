import type { Locator, Page } from '@playwright/test';

/**
 * Scheduler Configuration: template mapping (PAC2-7669) and session creation (PAC2-8241, `/paco-connect/configuration`).
 * Pure page object.
 */
export class SchedulerConfigPage {
  constructor(readonly page: Page) {}

  /** Source: PAC2-7669-TC-001-005.spec.ts */
  get title(): Locator {
    return this.page.getByText('Scheduler Config', { exact: true });
  }

  /** Source: PAC2-7669-TC-001-005.spec.ts */
  get templateSearch(): Locator {
    return this.page.getByPlaceholder('Search Templates...');
  }

  /** Source: PAC2-7669-TC-001-005.spec.ts */
  template(templateId: string): Locator {
    return this.page.locator(`[data-template-id="${templateId}"]`);
  }

  /** Template `Edit` button. Source: PAC2-7669-TC-001-005.spec.ts */
  editButton(template: Locator): Locator {
    return template.getByRole('button', { name: 'Edit', exact: true });
  }

  /** `Edit Connections` dialog heading. Source: PAC2-7669-TC-001-005.spec.ts */
  editConnectionsHeading(dialog: Locator): Locator {
    return dialog.getByRole('heading', { name: 'Edit Connections' });
  }

  /** Clinician combobox. Source: PAC2-7669-TC-001-005.spec.ts */
  clinicianCombobox(dialog: Locator): Locator {
    return dialog.getByRole('combobox', { name: 'Select a clinician' });
  }

  /** Clinician dropdown opener. Source: PAC2-7669-TC-001-005.spec.ts */
  openClinicianButton(dialog: Locator): Locator {
    return dialog.getByRole('button', { name: 'Open' });
  }

  clinicianOption(clinician: RegExp): Locator {
    return this.page.getByRole('option', { name: clinician }).first();
  }

  /** Selected clinician chip. Source: PAC2-7669-TC-001-005.spec.ts */
  clinicianChip(dialog: Locator, clinician: RegExp): Locator {
    return dialog.locator('.chip-label').filter({ hasText: clinician });
  }

  /** Remove icon inside a chip. Source: PAC2-7669-TC-001-005.spec.ts */
  chipRemoveIcon(chip: Locator): Locator {
    return chip.locator('svg[data-icon="xmark"]');
  }

  /** Dialog `Cancel` button. Source: PAC2-7669-TC-001-005.spec.ts */
  cancelButton(dialog: Locator): Locator {
    return dialog.getByRole('button', { name: 'Cancel', exact: true });
  }

  // --- Session creation (PAC2-8241-TC-001-002-003-007.spec.ts) ---

  get addSessionHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Add Session' });
  }

  get loadingSessions(): Locator {
    return this.page.getByText('Loading sessions').first();
  }

  get speedDialButton(): Locator {
    return this.page.locator('.p-speeddial-button');
  }

  get speedDialAdd(): Locator {
    return this.page.locator('a[aria-label="Add"]');
  }

  get sessionNameInput(): Locator {
    return this.page.locator('#slide-bar-right__name__id');
  }

  get frequencyButton(): Locator {
    return this.page.getByRole('button', { name: 'Frequency' });
  }

  get hoursFrom(): Locator {
    return this.page.getByRole('textbox', { name: 'Hours (From)' });
  }

  get hoursTo(): Locator {
    return this.page.getByRole('textbox', { name: 'Hours (To)' });
  }

  get slotTypesDropdown(): Locator {
    return this.page.locator('#selected-slot-types__ids');
  }

  /** Dropdown trigger next to a label (Assigned Appointment Book, Location 1). */
  dropdownAfterLabel(label: string, exact = false): Locator {
    return this.page.getByText(label, { exact }).locator('xpath=following-sibling::*[1]');
  }

  option(name: string): Locator {
    return this.page.getByRole('option', { name, exact: true });
  }

  get submitChanges(): Locator {
    return this.page.getByRole('button', { name: 'submit-changes' });
  }
}
