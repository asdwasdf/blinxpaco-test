#!/usr/bin/env node
/**
 * Auth helper for playwright-user MCP on dev blinx
 * Saves login steps so tester doesn't have to type credentials each time.
 *
 * Usage: Run the script, it opens browser at login page,
 * fills credentials, submits, selects org, and navigates to target URL.
 *
 * Credentials (stored in this file only, not in git):
 *   Username: blinx_daophuongnguyen28022003+2
 *   Password: Nguyen28022003@
 *   Org: General Practice (Demo Site)
 *   Role: Super Admin GB
 */

const LOGIN_URL = 'https://blinx.dev.blinxpaco-np.com/paco/login';
const USERNAME = 'blinx_daophuongnguyen28022003+2';
const PASSWORD = 'Nguyen28022003@';
const ORG = 'General Practice (Demo Site)';

// If running via MCP directly, this script is a reference.
// MCP playwright-user browser keeps auth for the session duration.
// Auth expires between sessions (Cognito session not persisted).
// To re-authenticate: navigate to login page, fill credentials, select org.

console.log('Auth helper for blinx.dev — playwright-user MCP');
console.log('Credentials: blinx_daophuongnguyen28022003+2 / Nguyen28022003@');
console.log('Org: General Practice (Demo Site), Role: Super Admin GB');
console.log('Note: Auth expires on browser close. Re-run this helper after auth reset.');
