import { expect, test } from '@playwright/test';

/**
 * Responsive-first check of the whole test page (every component, layouts such as the navbar and aside menu included)
 * at phone, tablet, laptop and desktop widths: nothing may stick out of the window, and on a phone every control a
 * finger has to hit inside a component is at least 24 × 24 px (WCAG 2.5.8), or sits in a row tall enough to take the tap.
 */
const WIDTHS = [360, 768, 1024, 1440];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('responsive: no part of any component sticks out of the window, from 360 to 1440 px', async ({ page }) => {
  test.setTimeout(180_000);
  const problems: string[] = [];
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#select')).toBeVisible();
    // Layouts with a JS breakpoint (navbar, aside menu) switch a frame after the resize.
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const found = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const clipped = (el: Element) => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (s.overflowX !== 'visible' || s.position === 'fixed') return true;
        }
        return false;
      };
      const out: string[] = [];
      if (document.documentElement.scrollWidth > window.innerWidth) out.push(`page is ${document.documentElement.scrollWidth}px wide`);
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || r.right <= vw + 1 || getComputedStyle(el).visibility === 'hidden' || clipped(el)) continue;
        const host = el.closest('[id]');
        out.push(`${host ? '#' + host.id + ' ' : ''}${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').split(' ')[0]} → ${Math.round(r.right)}`);
        if (out.length > 20) break;
      }
      return out;
    });
    for (const f of found) problems.push(`${width}: ${f}`);
  }
  expect(problems).toEqual([]);
});

test.describe('on a touch phone', () => {
  // A touch screen: (pointer: coarse) styles apply, as on a real phone.
  test.use({ viewport: { width: 360, height: 800 }, hasTouch: true, isMobile: true });

  test('responsive: the controls inside components are big enough to tap', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#select')).toBeVisible();
    const small = await page.evaluate(() => {
      const MIN = 24;
      const sel = [
        'button',
        'a[href]',
        '[role="button"]',
        '[role="tab"]',
        '[role="checkbox"]',
        '[role="radio"]',
        '[role="switch"]',
        '[role="slider"]',
        '[role="option"]',
        '[role="menuitem"]',
        '[role="treeitem"]',
        'input:not([type="hidden"])',
        'select',
      ].join(',');
      const own = (el: Element | null) => !!el && /(^|\s)wt-/.test(el.getAttribute('class') || '');
      /** The element's box grown by an absolutely positioned ::before / ::after that extends its hit area. */
      const hitBox = (el: Element) => {
        const r = el.getBoundingClientRect();
        let w = r.width;
        let h = r.height;
        for (const pseudo of ['::before', '::after']) {
          const s = getComputedStyle(el, pseudo);
          if (s.content === 'none' || s.position !== 'absolute' || s.pointerEvents === 'none') continue;
          const px = (v: string) => (v.endsWith('px') ? parseFloat(v) : 0);
          w = Math.max(w, r.width - px(s.left) - px(s.right), px(s.width));
          h = Math.max(h, r.height - px(s.top) - px(s.bottom), px(s.height));
        }
        return { w, h };
      };
      const out: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(sel)) {
        // WiraTheme's own parts only (a native input counts through its wt- parent); the test page's own buttons are not the library's.
        if (!own(el) && !(el.tagName === 'INPUT' && own(el.parentElement))) continue;
        if (el.closest('[aria-hidden="true"], [inert]')) continue;
        const s = getComputedStyle(el);
        if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        // A native check box / radio is the hit area of its visible box.
        const box = el.matches('input[type="checkbox"], input[type="radio"]') && el.parentElement ? hitBox(el.parentElement) : hitBox(el);
        if (box.w >= MIN && box.h >= MIN) continue;
        // Inside a bigger row that takes the tap (a list option, a label): the row is the target.
        const row = el.parentElement?.closest('[role="option"], [role="treeitem"], [role="menuitem"], label');
        if (row && row.getBoundingClientRect().height >= MIN && row.getBoundingClientRect().width >= MIN) continue;
        const host = el.closest('[id]');
        out.push(`${host ? '#' + host.id : ''} ${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').split(' ')[0]} ${Math.round(box.w)}×${Math.round(box.h)}`);
      }
      return out;
    });
    expect(small).toEqual([]);
  });
});
