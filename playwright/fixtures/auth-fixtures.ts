import { existsSync } from 'node:fs';
import path from 'node:path';
import { test as base, type BrowserContext, type Page } from '@playwright/test';
import { getDefaultEnvironment, loadConfig } from '../../scripts/load-config.js';

const config = loadConfig();
const environment = getDefaultEnvironment(config);
const authFile = path.resolve(config.paths.playwrightAuth, 'user.json');

type AuthFixtures = {
  authenticatedContext: BrowserContext;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    if (!existsSync(authFile)) {
      throw new Error(
        'Blocked: Authentication state not found. Run npm run auth:login; see scripts/manual-login.md',
      );
    }
    const context = await browser.newContext({ storageState: authFile });
    await use(context);
    await context.close();
  },
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await page.goto(environment.dashboardPath);
    if (/\/(?:login|signin|sign-in|auth)(?:[/?#]|$)/i.test(new URL(page.url()).pathname)) {
      throw new Error('Blocked: Authentication expired');
    }
    await use(page);
    await page.close();
  },
});

export { expect } from '@playwright/test';
