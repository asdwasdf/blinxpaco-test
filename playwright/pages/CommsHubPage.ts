import type { Locator, Page } from '@playwright/test';

/**
 * Comms Hub campaign manager (external origin). Source: PAC2-7201-TC-001-002.spec.ts. Pure page object.
 */
export class CommsHubPage {
  constructor(readonly page: Page) {}

  /** Org switcher text. Source: PAC2-7201-TC-001-002.spec.ts */
  get viewingDataFor(): Locator {
    return this.page.getByText('Viewing data for', { exact: true });
  }

  /** Org entry in the switcher menu. Source: PAC2-7201-TC-001-002.spec.ts */
  orgMenuItem(org: string): Locator {
    return this.page.getByRole('menuitem', { name: new RegExp(org, 'i') }).first();
  }

  /** Campaign table row by name. Source: PAC2-7201-TC-001-002.spec.ts */
  campaignRow(name: string): Locator {
    return this.page.locator('tbody tr, table tr').filter({ hasText: name }).first();
  }

  /** Row action buttons. Source: PAC2-7201-TC-001-002.spec.ts */
  rowActions(row: Locator): { performance: Locator; view: Locator; edit: Locator; delete: Locator } {
    return {
      performance: row.locator('[title="Performance"]').first(),
      view: row.locator('[title="View"]').first(),
      edit: row.locator('[title="Edit"], [aria-label*="Edit" i], button[title*="dit"]').first(),
      delete: row.locator('[title="Delete"], [aria-label*="Delete" i], button[title*="el"]').first(),
    };
  }
}
