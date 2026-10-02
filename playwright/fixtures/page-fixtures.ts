import { test as base } from './auth-fixtures.js';
import {
  AppShell,
  AppointmentBookPage,
  CommsHubPage,
  HealthFormsPage,
  QuickSendPage,
  SchedulerConfigPage,
} from '../pages/index.js';

type PageObjects = {
  appShell: AppShell;
  quickSend: QuickSendPage;
  healthForms: HealthFormsPage;
  appointmentBook: AppointmentBookPage;
  schedulerConfig: SchedulerConfigPage;
  commsHub: CommsHubPage;
};

/** auth-fixtures + page objects bound to `authenticatedPage`. */
export const test = base.extend<PageObjects>({
  appShell: async ({ authenticatedPage }, use) => use(new AppShell(authenticatedPage)),
  quickSend: async ({ authenticatedPage }, use) => use(new QuickSendPage(authenticatedPage)),
  healthForms: async ({ authenticatedPage }, use) => use(new HealthFormsPage(authenticatedPage)),
  appointmentBook: async ({ authenticatedPage }, use) => use(new AppointmentBookPage(authenticatedPage)),
  schedulerConfig: async ({ authenticatedPage }, use) => use(new SchedulerConfigPage(authenticatedPage)),
  commsHub: async ({ authenticatedPage }, use) => use(new CommsHubPage(authenticatedPage)),
});

export { expect } from './auth-fixtures.js';
