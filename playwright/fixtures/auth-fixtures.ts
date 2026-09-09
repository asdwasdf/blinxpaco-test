// playwright/fixtures/auth-fixtures.ts
import { test as base } from '@playwright/test';
import path from 'path';

type AuthFixtures = {
  authenticatedContext: any;
};

export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    const authFile = path.join('.', 'playwright', '.auth', 'user.json');

    // Check if auth state exists
    if (!require('fs').existsSync(authFile)) {
      throw new Error(
        'Auth state not found. Run manual login first: see scripts/manual-login.md'
      );
    }

    const context = await browser.newContext({
      storageState: authFile,
    });

    await use(context);
    await context.close();
  },
});

export { expect } from '@playwright/test';
