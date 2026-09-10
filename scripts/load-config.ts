import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import type { PacoConfig, PacoEnvironment } from './workflow-types.js';

function record(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Invalid config: ${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function string(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid config: ${field} must be a non-empty string`);
  }
  return value;
}

function literal<T>(value: unknown, expected: T, field: string): T {
  if (value !== expected) {
    throw new Error(`Invalid config: ${field} must be ${String(expected)}`);
  }
  return expected;
}

function environment(value: unknown, field: string): PacoEnvironment {
  const input = record(value, field);
  const baseUrl = string(input.baseUrl, `${field}.baseUrl`);
  const dashboardPath = string(input.dashboardPath, `${field}.dashboardPath`);
  try {
    new URL(baseUrl);
  } catch {
    throw new Error(`Invalid config: ${field}.baseUrl must be a URL`);
  }
  if (!dashboardPath.startsWith('/')) {
    throw new Error(`Invalid config: ${field}.dashboardPath must start with /`);
  }
  return { baseUrl, dashboardPath };
}

export function loadConfig(configPath = path.resolve(process.cwd(), 'paco.config.yaml')): PacoConfig {
  const parsed: unknown = YAML.parse(fs.readFileSync(configPath, 'utf8'));
  const root = record(parsed, 'root');
  const environmentsInput = record(root.environments, 'environments');
  const defaultEnvironment = string(environmentsInput.default, 'environments.default');
  const defaultValue = environmentsInput[defaultEnvironment];
  if (typeof defaultValue !== 'object' || defaultValue === null || Array.isArray(defaultValue)) {
    throw new Error('Invalid config: environments.default must reference an environment object');
  }
  const resolvedDefault = environment(defaultValue, `environments.${defaultEnvironment}`);
  const environments: PacoConfig['environments'] = {
    default: defaultEnvironment,
    [defaultEnvironment]: resolvedDefault,
  };
  for (const [name, value] of Object.entries(environmentsInput)) {
    if (name !== 'default') environments[name] = environment(value, `environments.${name}`);
  }

  const paths = record(root.paths, 'paths');
  const ticket = record(root.ticket, 'ticket');
  const defaults = record(root.defaults, 'defaults');
  const sourcePattern = string(ticket.sourcePattern, 'ticket.sourcePattern');
  try {
    new RegExp(sourcePattern);
  } catch {
    throw new Error('Invalid config: ticket.sourcePattern must be a valid regular expression');
  }

  return {
    product: literal(root.product, 'Paco', 'product'),
    environments,
    paths: {
      ticketSource: string(paths.ticketSource, 'paths.ticketSource'),
      ticketOutput: string(paths.ticketOutput, 'paths.ticketOutput'),
      testResults: string(paths.testResults, 'paths.testResults'),
      playwrightAuth: string(paths.playwrightAuth, 'paths.playwrightAuth'),
    },
    ticket: {
      sourcePattern,
      primarySourceFile: literal(ticket.primarySourceFile, 'ticket.md', 'ticket.primarySourceFile'),
    },
    defaults: {
      readOnly: literal(defaults.readOnly, true, 'defaults.readOnly'),
      language: literal(defaults.language, 'vi', 'defaults.language'),
      uiTermsLanguage: literal(defaults.uiTermsLanguage, 'en', 'defaults.uiTermsLanguage'),
      browser: literal(defaults.browser, 'chromium', 'defaults.browser'),
      authStrategy: literal(defaults.authStrategy, 'manual', 'defaults.authStrategy'),
    },
  };
}

export function getDefaultEnvironment(config: PacoConfig): PacoEnvironment {
  const value = config.environments[config.environments.default];
  if (typeof value === 'string' || value === undefined) {
    throw new Error('Invalid config: environments.default must reference an environment object');
  }
  return value;
}
