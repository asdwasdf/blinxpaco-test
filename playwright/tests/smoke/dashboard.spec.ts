import { getDefaultEnvironment, loadConfig } from '../../../scripts/load-config.js';
import { expect, test } from '../../fixtures/auth-fixtures.js';

const environment = getDefaultEnvironment(loadConfig());

test('Paco dashboard is accessible in read-only mode', async ({ authenticatedPage }) => {
  const expectedPath = new URL(environment.dashboardPath, environment.baseUrl).pathname;
  await expect(authenticatedPage).toHaveURL((url) => url.pathname === expectedPath);
  await expect(authenticatedPage.getByRole('main')).toBeVisible();
});
