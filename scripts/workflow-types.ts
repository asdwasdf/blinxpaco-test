export const PHASES = [
  'DISCOVER',
  'INGEST',
  'ANALYZE',
  'LOCATE',
  'EXPLORE',
  'TEST_DESIGN',
  'AUTOMATION_REVIEW',
  'AUTOMATE',
  'EXECUTE',
  'REPORT',
  'COMPLETE',
] as const;

export type Phase = (typeof PHASES)[number];
export type PhaseStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'blocked'
  | 'stale'
  | 'skipped'
  | 'failed';
export type SkillOutcomeCode =
  | 'completed'
  | 'completed_with_warnings'
  | 'blocked'
  | 'failed'
  | 'inconclusive'
  | 'no_change';
export type ArtifactState =
  | 'valid'
  | 'stale'
  | 'review_required'
  | 'needs_review'
  | 'missing'
  | 'corrupt';
export type MutationClass =
  | 'None'
  | 'Temporary'
  | 'Persistent'
  | 'Destructive'
  | 'Unknown';
export type TestResult = 'Pass' | 'Fail' | 'Blocked' | 'Not Run' | 'Inconclusive';

export interface PacoEnvironment {
  baseUrl: string;
  dashboardPath: string;
}

export interface PacoConfig {
  product: 'Paco';
  environments: {
    default: string;
    [name: string]: string | PacoEnvironment;
  };
  paths: {
    ticketSource: string;
    ticketOutput: string;
    testResults: string;
    playwrightAuth: string;
  };
  ticket: {
    sourcePattern: string;
    primarySourceFile: 'ticket.md';
  };
  safety: {
    mutationEnabledEnvironments: string[];
    allowedHosts: string[];
    externalDevHosts: string[];
  };
  defaults: {
    readOnly: true;
    language: 'vi';
    uiTermsLanguage: 'en';
    browser: 'chromium';
    authStrategy: 'manual';
    locateMaxMinutes: number;
    locateMaxViews: number;
    reusableRouteMaxViews: number;
  };
}
