/**
 * Load PACO credentials from .env (gitignored).
 * Returns typed credentials or throws if required vars are missing.
 * Never log credential values.
 */

export interface PacoCredentials {
  username: string;
  password: string;
  org: string;
  location: string;
  role: string;
  baseUrl: string;
}

export interface PacoAdminCredentials {
  username: string;
  password: string;
  baseUrl: string;
}

function env(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback;
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export function loadCredentials(): PacoCredentials {
  return {
    username: env('PAC_USERNAME'),
    password: env('PAC_PASSWORD'),
    org:      env('PAC_ORG', 'General Practice (Demo Site)'),
    location: env('PAC_LOCATION', 'test again - old location'),
    role:     env('PAC_ROLE', 'Blinx Deployment'),
    baseUrl:  env('PAC_BASE_URL', 'https://blinx.dev.blinxpaco-np.com'),
  };
}

export function loadAdminCredentials(): PacoAdminCredentials {
  return {
    username: env('PAC_ADMIN_USERNAME'),
    password: env('PAC_ADMIN_PASSWORD'),
    baseUrl:  env('PAC_BASE_URL', 'https://blinx.dev.blinxpaco-np.com'),
  };
}

/** Build the MCP auto-login script as a self-contained JS string (no imports). */
export function buildMcpLoginScript(creds: PacoCredentials): string {
  const { username, password, org, location, role, baseUrl } = creds;
  return `
(async function() {
  function setReactValue(el, val) {
    const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    native.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  function clickDropdownByIndex(index) {
    const drops = document.querySelectorAll('.p-dropdown');
    const visible = Array.from(drops).filter(d => { const r = d.getBoundingClientRect(); return r.width > 0; });
    if (visible[index]) visible[index].click();
  }
  function selectOption(text) {
    const opts = document.querySelectorAll('[role="option"]');
    const found = Array.from(opts).find(o => (o.innerText||'').includes(text));
    if (found) found.click();
  }

  // Step 1: Login form
  const user = document.getElementById('username');
  const pass = document.getElementById('password');
  if (user) setReactValue(user, '${username}');
  if (pass) setReactValue(pass, '${password}');
  await wait(100);
  const btn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText||'').trim()==='Log in');
  if (btn) btn.click();

  // Step 2: Wait for location-role picker
  await wait(4000);
  if (!window.location.href.includes('location-roles')) return { step: 'login_failed', url: window.location.href };

  // Step 3: Organisation
  clickDropdownByIndex(0);
  await wait(1000);
  selectOption('${org}');
  await wait(1000);

  // Step 4: Location
  clickDropdownByIndex(1);
  await wait(1000);
  selectOption('${location}');
  await wait(1000);

  // Step 5: Role
  clickDropdownByIndex(2);
  await wait(1000);
  selectOption('${role}');
  await wait(500);

  // Step 6: Next
  const next = Array.from(document.querySelectorAll('button')).find(b => (b.innerText||'').trim().toLowerCase()==='next');
  if (next) next.click();

  await wait(3000);
  return { step: 'done', url: window.location.href };
})();
`;
}
