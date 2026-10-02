import { expect, type Locator, type Page } from '@playwright/test';

export interface OpenQuickSendOptions {
  searchTimeout?: number;
  resultTimeout?: number;
  menuTimeout?: number;
  dialogTimeout?: number;
}

/**
 * Patient dashboard search + Quick Send dialog (Comms area, opened from `/paco/`).
 * Pure page object: waits on visibility/count only, never asserts business results.
 */
export class QuickSendPage {
  constructor(readonly page: Page) {}

  /** Patient search box. Source: PAC2-4700-readonly/base/health-booking, smoke/dashboard-selector-probe */
  get patientSearch(): Locator {
    return this.page.getByPlaceholder('Search patients by name or NHS number', { exact: true });
  }

  /** Search result row holding the NHS display text and an actions menu. Source: PAC2-4700-readonly.spec.ts */
  patientResult(nhsDisplay: string): Locator {
    return this.page
      .locator('div')
      .filter({ hasText: nhsDisplay })
      .filter({ has: this.page.getByRole('button', { name: 'Patient actions menu', exact: true }) })
      .last();
  }

  /** `Patient actions menu` button inside a row. Source: PAC2-4700-readonly.spec.ts */
  patientActionsButton(row: Locator): Locator {
    return row.getByRole('button', { name: 'Patient actions menu', exact: true });
  }

  /** Visible `Quick Send` menu entry. Source: PAC2-4700-readonly.spec.ts */
  get quickSendMenuItem(): Locator {
    return this.page.locator('[role="menuitem"], li').filter({ hasText: 'Quick Send' }).filter({ visible: true });
  }

  /** Quick Send dialog (single dialog on page). Source: PAC2-4700-readonly.spec.ts */
  get dialog(): Locator {
    return this.page.getByRole('dialog');
  }

  /** Close button inside the dialog. Source: PAC2-4700-readonly.spec.ts */
  closeButton(dialog: Locator = this.dialog): Locator {
    return dialog.getByRole('button', { name: /close/i });
  }

  /** `View Patient Details` toggle. Source: PAC2-4700-readonly.spec.ts */
  viewPatientDetailsButton(dialog: Locator = this.dialog): Locator {
    return dialog.getByRole('button', { name: 'View Patient Details', exact: true });
  }

  /** Visible text inside dialog (exact). Source: PAC2-4700-readonly.spec.ts (Contact Details, Significant Info, categories) */
  visibleText(text: string, dialog: Locator = this.dialog): Locator {
    return dialog.getByText(text, { exact: true }).filter({ visible: true });
  }

  /** Dropdown beside a contact label (Number/Email). Source: PAC2-4700-readonly.spec.ts */
  contactDropdown(label: string, dialog: Locator = this.dialog): Locator {
    return this.visibleText(label, dialog).first().locator('..').locator('.p-dropdown');
  }

  /** Campaign picker link. Source: PAC2-4700-readonly.spec.ts */
  changeTemplateLink(dialog: Locator = this.dialog): Locator {
    return dialog.getByText('(click to change)', { exact: true });
  }

  /** Campaign sort dropdown. Source: PAC2-4700-readonly.spec.ts */
  sortDropdown(dialog: Locator = this.dialog): Locator {
    return dialog.locator('.sort-dropdown');
  }

  /** Open dropdown panel (first visible). Source: PAC2-4700-readonly.spec.ts */
  get dropdownPanel(): Locator {
    return this.page.locator('.p-dropdown-panel, [role="listbox"]').filter({ visible: true }).first();
  }

  /** Campaign tree items. Source: PAC2-4700-readonly.spec.ts */
  campaignItems(dialog: Locator = this.dialog): Locator {
    return dialog.locator('[role="treeitem"]').filter({ visible: true });
  }

  /** Compose control by `title` attribute. Source: PAC2-4700-readonly.spec.ts */
  composeControl(title: string, dialog: Locator = this.dialog): Locator {
    return dialog.getByTitle(title, { exact: true }).filter({ visible: true });
  }

  /** Patient Reply control. Source: PAC2-4700-base.spec.ts */
  patientReply(dialog: Locator = this.dialog): Locator {
    return dialog.locator('[title="Set up Patient Reply"]');
  }

  /** "Search all tabs" input. Source: PAC2-4700-base.spec.ts */
  searchAllTabs(dialog: Locator = this.dialog): Locator {
    return dialog.getByPlaceholder(/search all tabs/i);
  }

  /** Dialog `Save` button. Source: PAC2-4700-base-mutation/health-booking specs */
  saveButton(dialog: Locator = this.dialog): Locator {
    return dialog.getByRole('button', { name: 'Save', exact: true });
  }

  /** Scheduler Link Required prompt (visible). Source: PAC2-4700-health-booking.spec.ts */
  get schedulerLinkPrompt(): Locator {
    return this.page.getByText('Scheduler Link Required', { exact: true }).filter({ visible: true });
  }

  /** Scheduler placement choice. Source: PAC2-4700-health-booking.spec.ts, PAC2-5776 guided spec */
  schedulerPlacementButton(name: "I'll Choose Where" | 'Add at End'): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  /**
   * Search patient, open actions menu, choose Quick Send, return the dialog.
   * Behaviour mirrors PAC2-4700-readonly.spec.ts openQuickSend (after navigation).
   */
  async openFor(query: string, nhsDisplay: string, opts: OpenQuickSendOptions = {}): Promise<Locator> {
    const { searchTimeout = 30_000, resultTimeout = 15_000, menuTimeout = 10_000, dialogTimeout = 15_000 } = opts;
    await expect(this.patientSearch).toBeVisible({ timeout: searchTimeout });
    await this.patientSearch.fill(query);

    const row = this.patientResult(nhsDisplay);
    await expect(row).toBeVisible({ timeout: resultTimeout });

    const actions = this.patientActionsButton(row);
    const count = await actions.count();
    if (count !== 1) throw new Error(`Blocked: expected one Patient actions menu, found ${count}`);
    await actions.click();

    await expect(this.quickSendMenuItem).toHaveCount(1, { timeout: menuTimeout });
    await this.quickSendMenuItem.click({ timeout: menuTimeout });

    await expect(this.dialog).toHaveCount(1, { timeout: dialogTimeout });
    await expect(this.dialog).toBeVisible({ timeout: dialogTimeout });
    return this.dialog;
  }

  /** Click Close if present. Source: PAC2-4700-readonly.spec.ts closeDialog */
  async close(dialog: Locator = this.dialog): Promise<void> {
    const close = this.closeButton(dialog);
    if (await close.count()) await close.first().click();
  }
}
