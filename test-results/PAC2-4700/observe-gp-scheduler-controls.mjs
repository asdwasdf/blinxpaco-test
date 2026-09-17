import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0]?.pages().find((candidate) => candidate.url().includes('pac2-4700-qs-only.dev.blinxpaco-np.com'));
if (!page) throw new Error('GP feature-branch page missing');
if (/\/login/i.test(page.url())) throw new Error('Authentication expired');
const structure = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const classify = (text) => /email/i.test(text) ? 'Email' : /sms/i.test(text) ? 'SMS' : text ? 'Other' : 'None';
  const visible = (element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
  };
  const box = (element) => {
    const rect = element.getBoundingClientRect();
    return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) };
  };
  const style = (element) => {
    const current = getComputedStyle(element);
    return {
      color: current.color,
      backgroundColor: current.backgroundColor,
      border: current.border,
      borderRadius: current.borderRadius,
      fontSize: current.fontSize,
      textAlign: current.textAlign,
    };
  };

  const combo = document.querySelector('[role="combobox"]');
  const comboText = clean(combo?.textContent);
  const openButtons = [...document.querySelectorAll('button')].filter((button) => clean(button.textContent) === 'Open');
  const visibleButtons = [...document.querySelectorAll('button')].filter(visible);
  const typedButtons = visibleButtons.reduce((counts, button) => {
    const type = classify(clean(button.textContent));
    counts[type] += 1;
    return counts;
  }, { Email: 0, SMS: 0, Other: 0, None: 0 });

  return {
    observedAt: new Date().toISOString(),
    urlPath: location.pathname,
    title: document.title,
    bodyLength: clean(document.body?.innerText).length,
    combo: combo ? {
      tag: combo.tagName.toLowerCase(),
      ariaExpanded: combo.getAttribute('aria-expanded'),
      ariaDisabled: combo.getAttribute('aria-disabled'),
      ariaHaspopup: combo.getAttribute('aria-haspopup'),
      ariaLabel: clean(combo.getAttribute('aria-label')) || null,
      visible: visible(combo),
      box: box(combo),
      style: style(combo),
      selectedType: classify(comboText),
      selectedTextPresent: Boolean(comboText),
    } : null,
    controls: {
      visibleButtonCount: visibleButtons.length,
      visibleButtonTypeCounts: typedButtons,
      openButtonCount: openButtons.length,
      visibleOpenButtonCount: openButtons.filter(visible).length,
      openDisabledStates: openButtons.map((button) => Boolean(button.disabled) || button.getAttribute('aria-disabled') === 'true'),
      inputs: [...document.querySelectorAll('input')].map((input) => ({
        type: input.type,
        visible: visible(input),
        disabled: input.disabled,
        required: input.required,
        placeholderPresent: Boolean(input.placeholder),
        valuePresent: Boolean(input.value),
        checked: ['checkbox', 'radio'].includes(input.type) ? input.checked : undefined,
      })),
    },
    mutationOccurred: false,
  };
});

await page.screenshot({ path: path.join(outDir, 'PAC2-4700-EXPLORE-gp-scheduler-stable.png'), fullPage: false });
await writeFile(path.join(outDir, 'control-structure.json'), JSON.stringify(structure, null, 2));
console.log(JSON.stringify(structure, null, 2));
process.exit(0);
