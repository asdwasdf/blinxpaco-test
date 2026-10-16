import type { Locator, Page } from '@playwright/test';

/**
 * Configuration → Appointment Books → Sessions table.
 * Source: PAC2-9001 MANUAL_EXECUTE rev-2 (Configuration → Sessions row kebab menu confirmed 8 items).
 */
export class ConfigurationSessionsPage {
  constructor(readonly page: Page) {}

  /** Row kebab button `…` (last `…` button in row = Actions). */
  rowKebab(sessionName: string): Locator {
    return this.page
      .getByRole('row', { name: new RegExp(sessionName) })
      .getByRole('button', { name: '…' })
      .last();
  }

  /** Kebab menu item by exact visible name. */
  kebabMenuItem(name: string): Locator {
    return this.page.getByRole('menuitem', { name, exact: true });
  }

  /** Search box for sessions table. */
  get searchInput(): Locator {
    return this.page.getByRole('textbox', { name: /Search Session/i });
  }
}
