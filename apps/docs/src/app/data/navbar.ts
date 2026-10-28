import { ComponentDoc } from '../core/component-doc';
import { Text } from '../core/i18n';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/**
 * A ready-made look for the bar: one class for `styleClass` that sets `--wt-navbar-*` tokens (plus a short rule where a
 * token cannot do it). The live demo applies `css` itself, so what the reader copies is exactly what is on screen.
 */
export interface NavbarTheme {
  /** Section id and anchor. */
  id: string;
  styleClass: string;
  variant: 'solid' | 'glass';
  /** The sign-in button in the end slot. */
  button: 'solid' | 'outlined' | 'rounded';
  title: Text;
  text: Text;
  /** The theme: shown in the sample and applied to the live demo. */
  css: string;
  /** Shown in the sample only: the reader's own page around the bar. */
  pageCss?: string;
}

/** Buttons and badges on a coloured bar: white, with the bar's colour as their text. */
const whiteButtons = (cls: string, hover: string, active: string, text: string): string => `/* ปุ่มและ badge ในแถบเป็นสีขาว */
.${cls} .wt-navbar-end,
.${cls} .wt-navbar-badge {
  --wt-primary-color: #ffffff;
  --wt-primary-hover: ${hover};
  --wt-primary-active: ${active};
  --wt-primary-contrast: ${text};
}`;

export const NAVBAR_THEMES: NavbarTheme[] = [
  {
    id: 'theme-dark',
    styleClass: 'navbar-dark',
    variant: 'solid',
    button: 'solid',
    title: { th: 'สีเข้ม', en: 'Dark' },
    text: {
      th: 'แถบสีกรมท่าเกือบดำ ตัวอักษรขาว เข้ากับสีแบรนด์ได้ทุกสี และปุ่มสีหลักของธีมเด่นขึ้นบนพื้นเข้ม',
      en: 'A near-black bar with white text that suits any brand colour; the theme\'s primary button stands out on it.',
    },
    css: `/* styles.css · แถบสีเข้ม ตัวอักษรสีขาว */
.navbar-dark {
  --wt-navbar-bg: #0f172a;
  --wt-navbar-color: #f8fafc;
  --wt-navbar-border-color: #1e293b;
  --wt-navbar-link-color: #cbd5e1;
  --wt-navbar-link-hover-bg: rgba(255, 255, 255, 0.08);
  --wt-navbar-link-active-bg: rgba(255, 255, 255, 0.14);
  --wt-navbar-link-active-color: #ffffff;
  --wt-navbar-panel-bg: #0f172a;
}
/* โหมดมืด (.wt-dark): เข้มกว่าพื้นหน้าเว็บอีกนิด แถบจึงไม่กลืนไปกับหน้า */
.wt-dark .navbar-dark {
  --wt-navbar-bg: #020617;
  --wt-navbar-panel-bg: #020617;
}`,
  },
  {
    id: 'theme-primary',
    styleClass: 'navbar-primary',
    variant: 'solid',
    button: 'solid',
    title: { th: 'สีหลักของธีม', en: 'Primary' },
    text: {
      th: 'แถบเป็นเฉดเข้มของสีหลัก (<code>--wt-primary-600</code>) ตัวอักษรขาวจึงอ่านง่าย และกฎสั้น ๆ อีกข้อทำให้ปุ่มกับ badge ในแถบเป็นสีขาว · เปลี่ยนสีหลักของธีมแล้วแถบเปลี่ยนตาม',
      en: 'The bar takes a deep shade of the primary colour (<code>--wt-primary-600</code>), so white text reads well, and one short rule turns buttons and badges in the bar white · change the theme\'s primary colour and the bar follows.',
    },
    css: `/* styles.css · แถบสีหลักของธีม ตัวอักษรสีขาว */
.navbar-primary {
  --wt-navbar-bg: var(--wt-primary-600);
  --wt-navbar-color: #ffffff;
  --wt-navbar-border-width: 0px;
  --wt-navbar-border-color: rgba(255, 255, 255, 0.3);
  --wt-navbar-link-color: #ffffff;
  --wt-navbar-link-hover-bg: rgba(0, 0, 0, 0.12);
  --wt-navbar-link-active-bg: rgba(0, 0, 0, 0.24);
  --wt-navbar-link-active-color: #ffffff;
  --wt-navbar-panel-bg: var(--wt-primary-600);
}
${whiteButtons('navbar-primary', 'var(--wt-primary-50)', 'var(--wt-primary-100)', 'var(--wt-primary-700)')}`,
  },
  {
    id: 'theme-soft',
    styleClass: 'navbar-soft',
    variant: 'solid',
    button: 'solid',
    title: { th: 'พื้นอ่อน', en: 'Soft tint' },
    text: {
      th: 'พื้นเทาอ่อนที่ผสมจากสีตัวอักษรกับสีการ์ด ไม่มีเส้นใต้ ลิงก์ของหน้าปัจจุบันเป็นแผ่นสีการ์ด · ผสมจาก token ของธีม จึงเป็นเทาเข้มเองในโหมดมืด',
      en: 'A soft grey mixed from the text and card colours, with no line under it; the current page\'s link is a card-coloured tile · it is mixed from theme tokens, so it turns dark grey in dark mode by itself.',
    },
    css: `/* styles.css · แถบพื้นเทาอ่อน ไม่มีเส้นใต้ โหมดมืดปรับเอง */
.navbar-soft {
  --wt-navbar-bg: color-mix(in srgb, var(--wt-text) 7%, var(--wt-card-bg));
  --wt-navbar-border-width: 0px;
  --wt-navbar-link-hover-bg: color-mix(in srgb, var(--wt-text) 8%, transparent);
  --wt-navbar-link-active-bg: var(--wt-card-bg);
  --wt-navbar-link-active-color: var(--wt-primary-soft-text);
  --wt-navbar-panel-bg: color-mix(in srgb, var(--wt-text) 7%, var(--wt-card-bg));
}`,
  },
  {
    id: 'theme-gradient',
    styleClass: 'navbar-gradient',
    variant: 'solid',
    button: 'solid',
    title: { th: 'ไล่สี', en: 'Gradient' },
    text: {
      th: '<code>--wt-navbar-bg</code> รับ gradient ได้ แถบนี้ไล่จากครามไปม่วง แผงบนจอแคบใช้ gradient เดียวกัน และปุ่มเป็นสีขาว',
      en: '<code>--wt-navbar-bg</code> takes a gradient: this one runs from indigo to violet, the narrow-screen panel uses the same one, and the buttons are white.',
    },
    css: `/* styles.css · แถบไล่สีครามไปม่วง */
.navbar-gradient {
  --wt-navbar-bg: linear-gradient(90deg, #4338ca, #7c3aed);
  --wt-navbar-color: #ffffff;
  --wt-navbar-border-width: 0px;
  --wt-navbar-border-color: rgba(255, 255, 255, 0.3);
  --wt-navbar-link-color: #ffffff;
  --wt-navbar-link-hover-bg: rgba(0, 0, 0, 0.14);
  --wt-navbar-link-active-bg: rgba(0, 0, 0, 0.26);
  --wt-navbar-link-active-color: #ffffff;
  --wt-navbar-panel-bg: linear-gradient(90deg, #4338ca, #7c3aed);
}
${whiteButtons('navbar-gradient', '#eef2ff', '#e0e7ff', '#4338ca')}`,
  },
  {
    id: 'theme-underline',
    styleClass: 'navbar-underline',
    variant: 'solid',
    button: 'outlined',
    title: { th: 'เส้นใต้ลิงก์', en: 'Underlined links' },
    text: {
      th: 'ลิงก์ของหน้าปัจจุบันมีเส้นสีหลักอยู่ใต้ลิงก์แทนแผ่นสี (ชิดขอบล่างของแถบ) ชี้แล้วมีเส้นจาง ๆ · บนจอแคบกลับเป็นแผ่นสีตามปกติ เพราะกฎเส้นใต้ใช้เฉพาะ <code>:not(.wt-navbar-mobile)</code>',
      en: 'The current page\'s link has a primary line under it instead of a tile (on the bar\'s bottom edge), and hovering shows a faint one · on narrow screens it is a tile again, as the underline rules only apply to <code>:not(.wt-navbar-mobile)</code>.',
    },
    css: `/* styles.css · ลิงก์ของหน้าปัจจุบันมีเส้นใต้แทนแผ่นสี */
.navbar-underline {
  --wt-navbar-link-active-color: var(--wt-primary-soft-text);
}
/* เส้นใต้เฉพาะจอกว้าง */
.navbar-underline:not(.wt-navbar-mobile) {
  --wt-navbar-padding: 0px 1rem;
  --wt-navbar-link-gap: 1rem;
  --wt-navbar-link-padding: 0.875rem 0.25rem;
  --wt-navbar-link-radius: 0px;
  --wt-navbar-link-hover-bg: transparent;
  --wt-navbar-link-active-bg: transparent;
}
.navbar-underline:not(.wt-navbar-mobile) .wt-navbar-link {
  border-bottom: 2px solid transparent;
}
.navbar-underline:not(.wt-navbar-mobile) .wt-navbar-link:hover {
  border-bottom-color: color-mix(in srgb, currentColor 30%, transparent);
}
.navbar-underline:not(.wt-navbar-mobile) .wt-navbar-link.wt-navbar-link-active {
  border-bottom-color: var(--wt-primary-color);
}`,
  },
  {
    id: 'theme-pill',
    styleClass: 'navbar-pill',
    variant: 'solid',
    button: 'rounded',
    title: { th: 'แคปซูลกลางแถบ', en: 'Centred pills' },
    text: {
      th: '<code>--wt-navbar-links-justify: center</code> วางลิงก์ไว้กลางแถบ ลิงก์ทรงแคปซูลอยู่บนรางสีเทา หน้าปัจจุบันเป็นสีหลัก และ <code>--wt-navbar-max-width</code> ไม่ให้เนื้อในกว้างเกินไปบนจอใหญ่',
      en: '<code>--wt-navbar-links-justify: center</code> puts the links in the middle: pill links on a grey track, the current page in the primary colour, and <code>--wt-navbar-max-width</code> keeps the content from spreading on big screens.',
    },
    css: `/* styles.css · ลิงก์ทรงแคปซูลอยู่กลางแถบ */
.navbar-pill {
  --wt-navbar-max-width: 72rem;
  --wt-navbar-links-justify: center;
  --wt-navbar-link-radius: 999px;
  --wt-navbar-link-padding: 0.375rem 1rem;
  --wt-navbar-link-active-bg: var(--wt-primary-color);
  --wt-navbar-link-active-color: var(--wt-primary-contrast);
}
/* รางสีเทาใต้ลิงก์ เฉพาะจอกว้าง */
.navbar-pill:not(.wt-navbar-mobile) .wt-navbar-list {
  --wt-navbar-link-hover-bg: var(--wt-card-bg);
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--wt-hover-bg);
}`,
  },
  {
    id: 'theme-glass',
    styleClass: 'navbar-glass',
    variant: 'glass',
    button: 'rounded',
    title: { th: 'กระจกบนรูป', en: 'Glass over a picture' },
    text: {
      th: '<code>variant="glass"</code> บนรูปหัวเว็บ: <code>--wt-glass-bg</code> เป็นสีเข้มโปร่งแสง ตัวอักษรขาวจึงอ่านได้บนรูปทุกแบบ ส่วน <code>--wt-navbar-bg</code> เป็นสีสำรองของเบราว์เซอร์ที่ไม่มี backdrop-filter',
      en: '<code>variant="glass"</code> over a hero picture: <code>--wt-glass-bg</code> is a see-through dark, so white text reads on any picture, and <code>--wt-navbar-bg</code> is the fallback for browsers without backdrop-filter.',
    },
    css: `/* styles.css · แถบกระจกบนรูป ใช้กับ variant="glass" */
.navbar-glass {
  --wt-glass-bg: rgba(15, 23, 42, 0.5);
  --wt-glass-border: rgba(255, 255, 255, 0.2);
  --wt-navbar-bg: rgba(15, 23, 42, 0.8); /* สีสำรองของเบราว์เซอร์ที่ไม่มี backdrop-filter */
  --wt-navbar-color: #ffffff;
  --wt-navbar-border-color: rgba(255, 255, 255, 0.2);
  --wt-navbar-link-color: #ffffff;
  --wt-navbar-link-hover-bg: rgba(255, 255, 255, 0.14);
  --wt-navbar-link-active-bg: rgba(255, 255, 255, 0.22);
  --wt-navbar-link-active-color: #ffffff;
  --wt-navbar-panel-bg: rgba(15, 23, 42, 0.94);
}
${whiteButtons('navbar-glass', '#f1f5f9', '#e2e8f0', '#0f172a')}`,
    pageCss: `/* รูปหัวเว็บใต้แถบ (รูปของแอปเอง) */
.hero {
  min-height: 20rem;
  background: #0f172a url('/images/hero.jpg') center / cover;
}`,
  },
];

/** The sample of a theme: the bar from Basic with the theme's class. */
function themeHtml(t: NavbarTheme): string {
  const button = t.button === 'outlined' ? ' [outlined]="true"' : t.button === 'rounded' ? ' [rounded]="true"' : '';
  const bar = `<wt-navbar [model]="links"${t.variant === 'glass' ? ' variant="glass"' : ''} styleClass="${t.styleClass}">
  <a wtNavbarBrand routerLink="/">วิระ</a>
  <button wtNavbarEnd wtButton type="button" label="เข้าสู่ระบบ" size="small"${button}></button>
</wt-navbar>`;
  return t.variant === 'glass' ? `<header class="hero">\n${bar.replace(/^/gm, '  ')}\n</header>` : bar;
}

export const NAVBAR_DOC: ComponentDoc = {
  id: 'navbar',
  title: 'Navbar',
  group: 'Navigation',
  entry: 'navbar',
  standalone: 'WtNavbar',
  module: 'WtNavbarModule',
  selector: 'wt-navbar',
  description: {
    th: 'แถบบนสุดของแอปหรือเว็บไซต์ มีโลโก้ ลิงก์จาก menu model (มีเมนูย่อยได้) และปุ่มด้านขวา บนจอแคบลิงก์พับเข้าแผงใต้แถบโดยอัตโนมัติ ติดอยู่ด้านบนขณะเลื่อนหน้าได้ และใช้คู่กับ Aside Menu เป็นโครงหน้าแอปได้ทันที',
    en: 'The top bar of an app or website: a brand, links from a menu model (with dropdowns) and actions on the right. On narrow screens the links fold into a panel under the bar on their own; it can stay at the top while the page scrolls, and with Aside Menu it makes a ready-made app layout.',
  },
  english: {
    'หน้าแรก': 'Home',
    'ข่าวสาร': 'News',
    'บริการ': 'Services',
    'ตารางเรียน': 'Timetable',
    'ผลการเรียน': 'Grades',
    'ปิดปรับปรุง': 'Under maintenance',
    'เกี่ยวกับเรา': 'About us',
    'ติดต่อ': 'Contact',
    'เข้าสู่ระบบ': 'Sign in',
    'โรงเรียนวิระ': 'Wira School',
    'วิระ': 'Wira',
    'เมนูที่เลือก': 'Picked',
    'เมนูเปิดอยู่': 'Menu open',
    'เนื้อหาของหน้า เลื่อนลงเพื่อดูแถบที่ติดอยู่ด้านบน': 'Page content. Scroll down: the bar stays at the top.',
    'ย่อหน้าตัวอย่าง': 'Sample paragraph',
    'ประกาศ': 'Notices',
    'ผลงาน': 'Work',
    'บทความ': 'Articles',
    'ปุ่มนี้เปิดแผงลิงก์': 'This button opens the links panel',
    'ค้นหา': 'Search',
    'โปรไฟล์': 'Profile',
    'เมนูหลัก': 'Main menu',
    'แอปที่ไม่ใช้ router บอกหน้าปัจจุบันเอง': 'Apps without a router name the current page themselves',
    'ปุ่มและ badge ในแถบเป็นสีขาว': 'White buttons and badges on the bar',
    'โหมดมืด (.wt-dark): เข้มกว่าพื้นหน้าเว็บอีกนิด แถบจึงไม่กลืนไปกับหน้า': 'Dark mode (.wt-dark): a little darker than the page, so the bar does not blend into it',
    'แถบสีเข้ม ตัวอักษรสีขาว': 'Dark bar, white text',
    'แถบสีหลักของธีม ตัวอักษรสีขาว': 'A bar in the theme\'s primary colour, white text',
    'แถบพื้นเทาอ่อน ไม่มีเส้นใต้ โหมดมืดปรับเอง': 'Soft grey bar, no line under it, dark mode follows by itself',
    'แถบไล่สีครามไปม่วง': 'Indigo to violet bar',
    'ลิงก์ของหน้าปัจจุบันมีเส้นใต้แทนแผ่นสี': 'The current page\'s link is underlined instead of a tile',
    'เส้นใต้เฉพาะจอกว้าง': 'Underlines on wide screens only',
    'ลิงก์ทรงแคปซูลอยู่กลางแถบ': 'Pill links in the middle of the bar',
    'รางสีเทาใต้ลิงก์ เฉพาะจอกว้าง': 'A grey track under the links, wide screens only',
    'แถบกระจกบนรูป ใช้กับ variant="glass"': 'Glass bar over a picture, with variant="glass"',
    'สีสำรองของเบราว์เซอร์ที่ไม่มี backdrop-filter': 'fallback for browsers without backdrop-filter',
    'รูปหัวเว็บใต้แถบ (รูปของแอปเอง)': 'The picture under the bar (your own)',
    'ขนาดจอของตัวอย่าง': 'Width of the demos',
    'จอกว้าง': 'Wide',
    'จอแคบ': 'Narrow',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtNavbarModule</code> มี <code>WtTemplate</code> ให้ด้วย) และ standalone (<code>WtNavbar</code>)',
        en: 'Works as an NgModule (<code>WtNavbarModule</code>, which also brings <code>WtTemplate</code>) or standalone (<code>WtNavbar</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'โลโก้ใส่เป็น element ที่มี <code>wtNavbarBrand</code> ลิงก์มาจาก <code>[model]</code> (<code>routerLink</code>, <code>url</code> หรือ <code>command</code> พร้อม <code>icon</code>, <code>badge</code>, <code>disabled</code>, <code>visible: false</code>) และปุ่มด้านขวาใส่ <code>wtNavbarEnd</code> · ลิงก์ <code>routerLink</code> ที่ตรงกับหน้าปัจจุบันได้ class active และ <code>aria-current="page"</code> เอง (ลิงก์ <code>/</code> ให้ใส่ <code>routerLinkActiveOptions: { exact: true }</code>) ถ้าแอปไม่ใช้ router บอกหน้าปัจจุบันด้วย <code>[activeItem]</code> · ชื่อของแถบมาจาก <code>ariaLabel</code> หรือ locale',
        en: 'The brand is an element with <code>wtNavbarBrand</code>, links come from <code>[model]</code> (<code>routerLink</code>, <code>url</code> or <code>command</code>, with <code>icon</code>, <code>badge</code>, <code>disabled</code>, <code>visible: false</code>) and actions on the right take <code>wtNavbarEnd</code> · a <code>routerLink</code> matching the current page gets the active class and <code>aria-current="page"</code> by itself (give a <code>/</code> link <code>routerLinkActiveOptions: { exact: true }</code>); apps without a router name the current page with <code>[activeItem]</code> · the bar\'s name comes from <code>ariaLabel</code> or the locale.',
      },
    },
    dropdown: {
      title: { th: 'เมนูย่อย', en: 'Dropdowns' },
      text: {
        th: 'รายการที่มี <code>items</code> เป็นปุ่มที่เปิดเมนูย่อย (wt-menu แบบ popup) ใต้ปุ่ม ลูกศรลงก็เปิดได้ และเมนูที่มีหน้าปัจจุบันอยู่ข้างในได้ class active ด้วย · บนจอแคบเมนูย่อยกางอยู่ในแผงแทน (ซ้อนได้หลายชั้น)',
        en: 'An item with <code>items</code> is a button that opens a dropdown (a popup wt-menu) under it; Arrow Down opens it too, and a dropdown that holds the current page is marked active as well · on narrow screens dropdowns expand inside the panel instead (to any depth).',
      },
    },
    responsive: {
      title: { th: 'จอแคบ', en: 'Narrow screens' },
      text: {
        th: 'ที่ความกว้างเท่ากับหรือน้อยกว่า <code>breakpoint</code> (ค่าเริ่มต้น <code>960px</code> ใส่ตัวเลขก็ได้ หมายถึง px) ลิงก์พับไว้หลังปุ่มเมนู กดแล้วแผงลิงก์เปิดใต้แถบ · ปิดเมื่อกด Esc (โฟกัสกลับที่ปุ่ม) กดลิงก์ คลิกนอกแถบ โฟกัสออกนอกแถบ หรือขยายจอเกิน breakpoint · <code>(onMenuToggle)</code> บอกว่าแผงเปิดหรือปิด และเรียก <code>toggle()</code> / <code>open()</code> / <code>close()</code> จากโค้ดได้ · ตัวอย่างนี้ตั้ง breakpoint สูงไว้จึงเป็นแบบจอแคบเสมอ',
        en: 'At or below <code>breakpoint</code> (default <code>960px</code>; a bare number means px) the links fold behind a menu button that opens them in a panel under the bar · it closes on Esc (focus goes back to the button), a link, a press outside the bar, focus leaving the bar or the window growing past the breakpoint · <code>(onMenuToggle)</code> tells when the panel opens or closes, and <code>toggle()</code> / <code>open()</code> / <code>close()</code> work from code · this demo sets a large breakpoint, so it is always in the narrow layout.',
      },
    },
    variants: {
      title: { th: 'พื้นหลัง', en: 'Backgrounds' },
      text: {
        th: '<code>variant</code> เป็น <code>solid</code> (สีการ์ด มีเส้นใต้ ค่าเริ่มต้น), <code>glass</code> (โปร่งแสงเบลอพื้นหลัง) หรือ <code>transparent</code> (ไม่มีพื้นจนกว่าจะเลื่อนหน้า เหมาะวางบนภาพหัวเว็บ)',
        en: '<code>variant</code> is <code>solid</code> (the card colour with a line under it; the default), <code>glass</code> (translucent over a blur) or <code>transparent</code> (no background until the page scrolls; for a bar over a hero image).',
      },
    },
    sticky: {
      title: { th: 'ติดด้านบน', en: 'Sticky' },
      text: {
        th: '<code>[sticky]="true"</code> ให้แถบติดอยู่ด้านบนของกล่องที่เลื่อน (ปกติคือหน้าเว็บ) และเมื่อหน้าเลื่อนลงแล้วได้ class <code>wt-navbar-scrolled</code> พร้อมเงา (token <code>--wt-navbar-scrolled-shadow</code>) · ตัวอย่างนี้ติดอยู่ในกล่องที่เลื่อนได้',
        en: '<code>[sticky]="true"</code> keeps the bar at the top of whatever scrolls (usually the page); once the page has scrolled, the host gets <code>wt-navbar-scrolled</code> and a shadow (token <code>--wt-navbar-scrolled-shadow</code>) · this demo sticks inside a scrolling box.',
      },
    },
    themes: {
      title: { th: 'ธีมสำเร็จรูป', en: 'Ready-made themes' },
      text: {
        th: 'คัดลอก HTML และ CSS ของแบบที่ชอบไปใช้ได้ทันที ทุกแบบเป็น class เดียวที่ตั้งค่า token <code>--wt-navbar-*</code> (บางแบบมีกฎสั้น ๆ เพิ่ม เช่น ปุ่มสีขาวบนแถบสี) ส่งเข้า <code>styleClass</code> แล้ววาง CSS ใน <code>styles.css</code> (หรือ <code>styles.scss</code>) ของแอป เพราะต้องเป็น CSS ของทั้งแอปจึงเข้าถึงข้างใน component ได้ · ทุกแบบใช้ได้ทั้งโหมดสว่างและโหมดมืด และบนจอแคบแผงลิงก์ที่พับลงมาใช้สีเดียวกับแถบ (เลือก <b>จอแคบ</b> แล้วกดปุ่มเมนูเพื่อดู) · <code>links</code> เป็นรายการเดียวกับตัวอย่าง Basic',
        en: 'Copy the HTML and CSS of the one you like. Each theme is one class that sets <code>--wt-navbar-*</code> tokens (a few add a short rule, such as white buttons on a coloured bar): pass it to <code>styleClass</code> and put the CSS in the app\'s <code>styles.css</code> (or <code>styles.scss</code>), since only app-wide CSS reaches inside the component · every theme works in light and dark mode, and on narrow screens the panel that drops down takes the bar\'s colours (pick <b>Narrow</b>, then press the menu button) · <code>links</code> is the same list as in Basic.',
      },
    },
    templates: {
      title: { th: 'Slot และ Template', en: 'Slots and templates' },
      text: {
        th: 'โลโก้ใส่เป็น <code>wtNavbarBrand</code> หรือ template <code>start</code> · ปุ่มด้านขวาใส่ <code>wtNavbarEnd</code> หรือ template <code>end</code> · ลิงก์เพิ่มเติมใส่ <code>wtNavbarLinks</code> (ต่อท้ายลิงก์จาก model ใส่ class <code>wt-navbar-link</code> ให้หน้าตาเหมือนกัน) · template <code>item</code> วาดเนื้อในลิงก์เอง (ได้ <code>let-item</code>) · <code>menuIcon</code> / <code>closeIcon</code> เปลี่ยนไอคอนของปุ่มเมนู',
        en: 'The brand is <code>wtNavbarBrand</code> or the <code>start</code> template · actions are <code>wtNavbarEnd</code> or the <code>end</code> template · extra links take <code>wtNavbarLinks</code> (after the model\'s; give them <code>wt-navbar-link</code> for the same look) · the <code>item</code> template draws what is inside each link (it gets <code>let-item</code>) · <code>menuIcon</code> / <code>closeIcon</code> change the menu button\'s icons.',
      },
    },
    aside: {
      title: { th: 'คู่กับ Aside Menu', en: 'With Aside Menu' },
      text: {
        th: '<code>[aside]="side"</code> ผูกปุ่มเมนูของแถบกับ <code>&lt;wt-aside-menu #side&gt;</code> โดยไม่ต้องเขียนโค้ดเพิ่ม: ปุ่มย้ายไปไว้หน้าโลโก้ บนจอแคบกดแล้วเปิดเมนูด้านข้าง และลิงก์ของแถบย้ายเข้าไปเป็นกลุ่มแรกของเมนูด้านข้าง บนจอกว้างกดแล้วย่อ / ขยายเมนูด้านข้าง (<code>[asideCollapse]="false"</code> ให้ปุ่มมีเฉพาะจอแคบ) · ดูตัวอย่างเต็มในหน้า Aside Menu',
        en: '<code>[aside]="side"</code> ties the bar\'s menu button to <code>&lt;wt-aside-menu #side&gt;</code> with no code of your own: the button moves before the brand, on narrow screens it opens the side menu and the bar\'s links move into it as its first group, and on wide screens it collapses / expands the side menu (<code>[asideCollapse]="false"</code> keeps the button to narrow screens) · see the full example on the Aside Menu page.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'แถบบนที่แอปประกอบเองจาก menubar + ปุ่ม hamburger + CSS media query เปลี่ยนเป็น <code>&lt;wt-navbar&gt;</code> ได้: ย้ายรายการเมนูเดิมมาเป็น <code>[model]</code> (รูปแบบ <code>MenuItem</code> เดิม) โลโก้เป็น <code>wtNavbarBrand</code> ปุ่มผู้ใช้เป็น <code>wtNavbarEnd</code> แล้วลบโค้ดเปิด/ปิดเมนูบนมือถือและ media query ของเดิมออก',
        en: 'A top bar an app builds from a menubar, a hamburger button and CSS media queries becomes <code>&lt;wt-navbar&gt;</code>: move the menu items to <code>[model]</code> (the same <code>MenuItem</code> shape), the logo to <code>wtNavbarBrand</code> and the user button to <code>wtNavbarEnd</code>, then delete the old mobile open/close code and media queries.',
      },
    },
  },
  code: {
    basic: `<wt-navbar [model]="links" [activeItem]="current" ariaLabel="เมนูหลัก">
  <a wtNavbarBrand routerLink="/">วิระ</a>
  <button wtNavbarEnd wtButton type="button" label="เข้าสู่ระบบ" size="small"></button>
</wt-navbar>`,
    dropdown: `<wt-navbar [model]="links">
  <a wtNavbarBrand routerLink="/">วิระ</a>
</wt-navbar>`,
    responsive: `<wt-navbar [model]="links" breakpoint="768px" (onMenuToggle)="menuToggled($event)">
  <a wtNavbarBrand routerLink="/">วิระ</a>
</wt-navbar>`,
    variants: `<wt-navbar [model]="links" variant="glass"></wt-navbar>
<wt-navbar [model]="links" variant="transparent"></wt-navbar>`,
    sticky: `<wt-navbar [model]="links" [sticky]="true">
  <a wtNavbarBrand routerLink="/">วิระ</a>
</wt-navbar>`,
    templates: {
      v3: `<wt-navbar [model]="links" menuIcon="wi wi-bars" closeIcon="wi wi-times">
  <ng-template #start>
    <img src="assets/logo.svg" alt="" width="28" height="28" />
    <b>โรงเรียนวิระ</b>
  </ng-template>
  <ng-template #item let-item>
    @if (item.icon) {
      <i [class]="item.icon"></i>
    }
    <span>{{ item.label }}</span>
  </ng-template>
  <a wtNavbarLinks class="wt-navbar-link" href="/contact">ติดต่อ</a>
  <ng-template #end>
    <button wtButton type="button" icon="wi wi-search" [text]="true" [rounded]="true" aria-label="ค้นหา"></button>
  </ng-template>
</wt-navbar>`,
      classic: `<wt-navbar [model]="links" menuIcon="wi wi-bars" closeIcon="wi wi-times">
  <ng-template wtTemplate="start">
    <img src="assets/logo.svg" alt="" width="28" height="28" />
    <b>โรงเรียนวิระ</b>
  </ng-template>
  <ng-template wtTemplate="item" let-item>
    <i *ngIf="item.icon" [class]="item.icon"></i>
    <span>{{ item.label }}</span>
  </ng-template>
  <a wtNavbarLinks class="wt-navbar-link" href="/contact">ติดต่อ</a>
  <ng-template wtTemplate="end">
    <button wtButton type="button" icon="wi wi-search" [text]="true" [rounded]="true" aria-label="ค้นหา"></button>
  </ng-template>
</wt-navbar>`,
    },
    aside: `<wt-navbar [model]="links" [aside]="side" [sticky]="true">
  <a wtNavbarBrand routerLink="/">วิระ</a>
</wt-navbar>
<div class="layout">
  <wt-aside-menu #side [model]="menu"></wt-aside-menu>
  <main><router-outlet></router-outlet></main>
</div>`,
    ...Object.fromEntries(NAVBAR_THEMES.map((t) => [t.id, themeHtml(t)])),
  },
  css: Object.fromEntries(NAVBAR_THEMES.map((t) => [t.id, t.pageCss ? t.css + '\n\n' + t.pageCss : t.css])),
  ts: {
    basic: `import { WtMenuItem } from 'wiratheme/menu';

links: WtMenuItem[] = [
  { label: 'หน้าแรก', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  { label: 'ข่าวสาร', routerLink: '/news', badge: '3' },
  {
    label: 'บริการ',
    items: [
      { label: 'ตารางเรียน', routerLink: '/timetable' },
      { label: 'ผลการเรียน', routerLink: '/grades' },
      { separator: true },
      { label: 'ปิดปรับปรุง', disabled: true },
    ],
  },
  { label: 'เกี่ยวกับเรา', command: (event) => this.openAbout(event) },
];
/** แอปที่ไม่ใช้ router บอกหน้าปัจจุบันเอง */
current: WtMenuItem | null = null;

openAbout(event: { item?: WtMenuItem }): void {
  this.current = event.item ?? null;
}`,
    responsive: `isMenuOpen = false;

menuToggled(open: boolean): void {
  this.isMenuOpen = open;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'WtMenuItem[]', undefined, 'ลิงก์ในแถบ รายการที่มี items เป็นเมนูย่อย', 'The links; items with items are dropdowns'),
        row('activeItem', 'WtMenuItem | null', undefined, 'หน้าปัจจุบันเมื่อไม่ใช้ router (ลิงก์ routerLink ใช้ routerLinkActive เอง)', 'The current page without a router (routerLink items use routerLinkActive)'),
        row('breakpoint', 'string | number', "'960px'", 'กว้างเท่านี้หรือน้อยกว่า ลิงก์พับเข้าแผง (ตัวเลข = px)', 'At this width or less the links fold into a panel (a number means px)'),
        row('sticky', BOOL, 'false', 'ติดด้านบนขณะเลื่อน มีเงาเมื่อเลื่อนแล้ว', 'Stays at the top while scrolling, with a shadow once scrolled'),
        row('variant', "'solid' | 'glass' | 'transparent'", "'solid'", 'พื้นหลังของแถบ', 'The bar\'s background'),
        row('aside', 'WtAsideMenu', undefined, 'เมนูด้านข้างที่ปุ่มเมนูควบคุม', 'The side menu the menu button controls'),
        row('asideCollapse', BOOL, 'true', 'กับ aside: บนจอกว้างปุ่มย่อ / ขยายเมนูด้านข้าง', 'With aside: on wide screens the button collapses / expands it'),
        row('ariaLabel', 'string', 'locale', 'ชื่อของแถบ (landmark nav)', 'Name of the bar (the nav landmark)'),
        row('menuButtonAriaLabel', 'string', 'locale', 'ชื่อของปุ่มเมนู', 'Name of the menu button'),
        row('menuIcon · closeIcon', 'string', undefined, 'class ไอคอนของปุ่มเมนูตอนปิด / เปิด', 'Icon classes of the menu button, closed / open'),
        row('styleClass · style', 'string · object', undefined, 'แต่ง element nav', 'Style the nav element'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onMenuToggle', BOOL, undefined, 'แผงลิงก์บนจอแคบเปิด (true) หรือปิด (false)', 'The narrow-screen panel opened (true) or closed (false)')],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('toggle() · open() · close()', 'void', undefined, 'เปิด / ปิดแผงลิงก์ (open ไม่ทำอะไรบนจอกว้าง)', 'Open / close the links panel (open does nothing on wide screens)'),
        row('mobile · menuOpen · scrolled', BOOL, undefined, 'อ่านสถานะ: จอแคบอยู่ไหม แผงเปิดไหม หน้าเลื่อนแล้วไหม', 'State: narrow layout, panel open, page scrolled'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #start, wtTemplate="start" หรือ pTemplate="start" ก็ได้ · slot แบบ attribute: wtNavbarBrand, wtNavbarLinks, wtNavbarEnd',
        en: 'Write them as #start, wtTemplate="start" or pTemplate="start" · attribute slots: wtNavbarBrand, wtNavbarLinks, wtNavbarEnd.',
      },
      rows: [
        row('start', '—', undefined, 'โลโก้ / ชื่อเว็บ', 'The brand'),
        row('end', '—', undefined, 'ปุ่มด้านขวา', 'Actions on the right'),
        row('item', '$implicit (item)', undefined, 'เนื้อในแต่ละลิงก์', 'What is inside each link'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtNavbarVariant = 'solid' | 'glass' | 'transparent';

// host classes: wt-navbar-sticky, wt-navbar-scrolled, wt-navbar-menu-open
// nav classes:  wt-navbar-solid | wt-navbar-glass | wt-navbar-transparent, wt-navbar-mobile, wt-navbar-open`,
    },
  ],
  tokens: [
    tok('--wt-navbar-bg', 'พื้นของแถบ (solid)', 'Background (solid)'),
    tok('--wt-navbar-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wt-navbar-border-width', 'เส้นใต้แถบ', 'Width of the line under the bar'),
    tok('--wt-navbar-border-color', 'สีเส้นใต้แถบ', 'Colour of the line under the bar'),
    tok('--wt-navbar-height', 'ความสูงของแถบ', 'Height of the bar'),
    tok('--wt-navbar-padding', 'ระยะในแถบ', 'Padding of the bar'),
    tok('--wt-navbar-max-width', 'ความกว้างสูงสุดของเนื้อในแถบ (none = เต็มจอ)', 'Maximum width of the bar\'s content (none = full width)'),
    tok('--wt-navbar-gap', 'ระยะระหว่างโลโก้ ลิงก์ และปุ่ม', 'Gap between brand, links and actions'),
    tok('--wt-navbar-z-index', 'ลำดับชั้นเมื่อติดด้านบน', 'Stacking order when sticky'),
    tok('--wt-navbar-scrolled-shadow', 'เงาเมื่อหน้าเลื่อนแล้ว', 'Shadow once the page has scrolled'),
    tok('--wt-navbar-brand-size', 'ขนาดตัวอักษรของโลโก้', 'Font size of the brand'),
    tok('--wt-navbar-brand-weight', 'น้ำหนักตัวอักษรของโลโก้', 'Font weight of the brand'),
    tok('--wt-navbar-links-justify', 'จัดลิงก์ชิดซ้าย / กลาง / ขวา', 'Links to the start / centre / end'),
    tok('--wt-navbar-link-gap', 'ระยะระหว่างลิงก์', 'Gap between links'),
    tok('--wt-navbar-link-padding', 'ระยะในลิงก์', 'Padding of a link'),
    tok('--wt-navbar-link-radius', 'มุมโค้งของลิงก์', 'Corner radius of a link'),
    tok('--wt-navbar-link-color', 'สีลิงก์', 'Link colour'),
    tok('--wt-navbar-link-weight', 'น้ำหนักตัวอักษรของลิงก์', 'Font weight of a link'),
    tok('--wt-navbar-link-hover-bg', 'พื้นลิงก์เมื่อชี้', 'Link background on hover'),
    tok('--wt-navbar-link-active-bg', 'พื้นลิงก์ของหน้าปัจจุบัน', 'Background of the current page\'s link'),
    tok('--wt-navbar-link-active-color', 'สีลิงก์ของหน้าปัจจุบัน', 'Colour of the current page\'s link'),
    tok('--wt-navbar-toggle-size', 'ขนาดปุ่มเมนู', 'Size of the menu button'),
    tok('--wt-navbar-toggle-radius', 'มุมโค้งของปุ่มเมนู', 'Corner radius of the menu button'),
    tok('--wt-navbar-panel-bg', 'พื้นของแผงลิงก์บนจอแคบ', 'Background of the narrow-screen panel'),
    tok('--wt-navbar-panel-shadow', 'เงาของแผง', 'Shadow of the panel'),
    tok('--wt-navbar-panel-padding', 'ระยะในแผง', 'Padding of the panel'),
    tok('--wt-navbar-panel-max-height', 'ความสูงสูงสุดของแผง (เลื่อนได้)', 'Maximum height of the panel (it scrolls)'),
    tok('--wt-navbar-panel-item-min-height', 'ความสูงต่ำสุดของรายการในแผง (นิ้วกดง่าย)', 'Minimum height of panel items (easy to tap)'),
  ],
};
