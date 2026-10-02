import type { Locator, Page } from '@playwright/test';

/**
 * Common shell: landmarks, dialogs, toasts, "Set your status" prompt.
 * Pure page object: no business assertions.
 */
export class AppShell {
  constructor(readonly page: Page) {}

  /** Main landmark. Source: smoke/dashboard.spec.ts */
  get main(): Locator {
    return this.page.getByRole('main');
  }

  /** Any dialog on the page. Source: PAC2-4700-readonly.spec.ts, PAC2-8241-*.spec.ts */
  get dialog(): Locator {
    return this.page.getByRole('dialog');
  }

  /** Last dialog (topmost when stacked). Source: PAC2-3798.spec.ts */
  get topDialog(): Locator {
    return this.page.getByRole('dialog').last();
  }

  /** Toast messages (PrimeVue). Source: PAC2-8241-TC-001-002-003-007.spec.ts */
  get toasts(): Locator {
    return this.page.locator('.p-toast-message');
  }

  /** Toast containing the given text/regex. Source: PAC2-8241-TC-001-002-003-007.spec.ts */
  toast(text: string | RegExp): Locator {
    return this.toasts.filter({ hasText: text });
  }

  /**
   * "Set your status" prompt text. Source: survey-remaining-areas.spec.ts (visibility probe only).
   * The "Admin" choice button is NOT catalogued: no spec has used it yet. Add it here after a verified run
   * (convention: docs/product/survey/views/set-your-status-dialog.md, tester picks `Admin`).
   */
  get statusPrompt(): Locator {
    return this.page.getByText('Set your status', { exact: true });
  }

  /** Visible `Cancel` button (modals). Source: PAC2-4700-readonly.spec.ts */
  get visibleCancelButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel', exact: true }).filter({ visible: true });
  }

  /** Navigate to an absolute URL without waiting for full load. Source: most ticket specs */
  async goto(url: string, timeout = 30_000): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  }
}
