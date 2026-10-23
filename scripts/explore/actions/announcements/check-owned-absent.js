async page => {
  const P = { prefix: 'QA-test-auto-20261023-0506-announcement', role: 'Super Admin GB' };
  if (!P.prefix.startsWith('QA-test-')) throw Error('Synthetic prefix required');
  if (new URL(page.url()).origin !== 'https://blinx.dev.blinxpaco-np.com' || !new URL(page.url()).pathname.endsWith('/organisation/announcements')) throw Error('Dev Announcements required');
  await page.locator('div.leading-none.md\\:flex').filter({ hasText: P.role }).waitFor();
  await page.locator('[contenteditable=true]').first().waitFor();
  const owned = await page.locator('[contenteditable=true]').evaluateAll((es, prefix) => es.filter(e => e.textContent.includes(prefix)).length, P.prefix);
  if (owned) throw Error('Owned announcement remains');
  return { ownedAbsent: true, visibleEditors: await page.locator('[contenteditable=true]').count(), dialogs: await page.getByRole('dialog').count() };
}
