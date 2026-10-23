// Preflight dùng chung cho paco-explore (chạy bằng browser_run_code filename, không tham số).
// Read-only, trừ việc chọn `Admin` ở dialog `Set your status` (tester đã duyệt). Không đọc/trả cookie, token, credentials.
async page => {
  const allowedHosts = ['blinx.dev.blinxpaco-np.com', 'pac2-3798.dev.blinxpaco-np.com', 'pac2-3934.dev.blinxpaco-np.com', 'pac2-4700-qs-only.dev.blinxpaco-np.com', 'pac2-7786.dev.blinxpaco-np.com', 'dev.blinxscheduler-np.com', 'pac2-6763-send-key.dev.blinxpaco-np.com', 'nhs-comms-hub-dev.blinxhealthcare.com'];
  const url = new URL(page.url());
  const hostOk = url.protocol === 'https:' && allowedHosts.includes(url.hostname);
  const authenticated = hostOk && !/\/paco\/(login|location-roles)/.test(url.pathname);
  let statusDialog = 'none';
  if (authenticated) {
    const dialog = page.getByRole('dialog').filter({ hasText: 'Set your status' });
    if (await dialog.count()) {
      const admin = dialog.getByText('Admin', { exact: true }).first();
      if (await admin.count()) { await admin.click(); await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {}); statusDialog = 'set-admin'; }
      else statusDialog = 'present-unhandled';
    }
  }
  // Role thật đọc từ header (block `div.leading-none.md:flex`), trả các text lá để so với locked role.
  const headerTexts = authenticated ? await page.evaluate(() => {
    const visible = e => !!e.getClientRects().length;
    const blocks = [...document.querySelectorAll('div.leading-none')].filter(e => visible(e) && e.classList.contains('md:flex'));
    return [...new Set(blocks.flatMap(b => [...b.querySelectorAll('*')].filter(n => visible(n) && !n.children.length).map(n => n.textContent.trim()).filter(Boolean)))].slice(0, 8);
  }) : [];
  return {
    ok: hostOk && authenticated && statusDialog !== 'present-unhandled',
    host: url.hostname, hostOk, path: url.pathname, authenticated, statusDialog, headerTexts,
    dialogs: await page.getByRole('dialog').count(), tabs: page.context().pages().length,
  };
}
