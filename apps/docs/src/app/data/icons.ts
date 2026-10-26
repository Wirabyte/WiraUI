import { DocSectionText } from '../core/component-doc';
import { SampleWords } from '../core/sample-text';
import { Snippet } from '../core/snippets';

/** The Icons page (getting-started/icons): wiraicon, the icon set the docs and their samples use. */
export const ICONS_SECTIONS: Record<string, DocSectionText> = {
  install: {
    title: { th: 'ติดตั้ง', en: 'Installation' },
    text: {
      th: 'wiraicon เป็น package แยกของ WiraTheme ใช้ได้โดยไม่ต้องมี wiratheme และใช้ได้กับ Angular 15 ขึ้นไป (ทุกรุ่นของ WiraTheme) · ใส่ไฟล์ CSS ครั้งเดียวใน <code>angular.json</code> แล้วใช้เป็น class ได้ทั้งแอป · ถ้าอยากได้ไอคอนเป็น SVG ในหน้า ใช้ component <code>&lt;wi-icon&gt;</code> จาก <code>wiraicon/angular</code> (standalone <code>WiIcon</code> หรือ <code>WiIconModule</code>)',
      en: 'wiraicon is a separate WiraTheme package: it works without wiratheme and with Angular 15 and later (every WiraTheme version) · add its CSS once in <code>angular.json</code> and the classes work across the app · for icons as inline SVG, use the <code>&lt;wi-icon&gt;</code> component from <code>wiraicon/angular</code> (standalone <code>WiIcon</code>, or <code>WiIconModule</code>).',
    },
  },
  classes: {
    title: { th: 'ใช้เป็น class', en: 'CSS classes' },
    text: {
      th: '<code>&lt;i class="wi wi-ชื่อ"&gt;&lt;/i&gt;</code> ชื่อหลักตรงกับชื่อที่ทีมคุ้นอยู่แล้ว (<code>check</code>, <code>times</code>, <code>exclamation-triangle</code>, <code>cog</code> …) และชื่อแบบ Font Awesome / Phosphor ใช้เป็นชื่อแทนได้ (<code>wi-xmark</code> = <code>wi-times</code>) · ไอคอนสูงเท่าตัวอักษรรอบ ๆ และใช้สีตัวอักษร',
      en: '<code>&lt;i class="wi wi-name"&gt;&lt;/i&gt;</code>. The main names are the ones teams already write (<code>check</code>, <code>times</code>, <code>exclamation-triangle</code>, <code>cog</code> …), and Font Awesome / Phosphor spellings work as aliases (<code>wi-xmark</code> = <code>wi-times</code>) · an icon is as tall as the text around it and takes the text colour.',
    },
  },
  weights: {
    title: { th: 'น้ำหนักเส้น', en: 'Weights' },
    text: {
      th: 'ทุกไอคอนมี 5 แบบ: <code>wi-thin</code>, <code>wi-light</code>, ปกติ (ไม่ต้องใส่), <code>wi-bold</code> และ <code>wi-fill</code> · แต่ละแบบเป็น font ของตัวเอง เบราว์เซอร์โหลดเฉพาะแบบที่หน้านั้นใช้',
      en: 'Every icon comes in five weights: <code>wi-thin</code>, <code>wi-light</code>, regular (no class), <code>wi-bold</code> and <code>wi-fill</code> · each weight is its own font, and a browser downloads only the weights a page uses.',
    },
  },
  size: {
    title: { th: 'ขนาด สี และหมุน', en: 'Size, colour and spin' },
    text: {
      th: 'ขนาดตาม <code>font-size</code> และสีตาม <code>color</code> เหมือนตัวอักษร (ใช้ token ของธีมได้ เช่น <code>var(--wt-primary-color)</code>) · <code>wi-spin</code> หมุนตลอด เหมาะกับไอคอนกำลังโหลด (ผู้ใช้ที่ตั้งลดการเคลื่อนไหวเห็นหมุนช้าลง) · <code>wi-fw</code> ให้ทุกไอคอนกว้างเท่ากัน รายการจึงตรงกัน',
      en: 'Size follows <code>font-size</code> and colour follows <code>color</code>, as for text (theme tokens such as <code>var(--wt-primary-color)</code> work) · <code>wi-spin</code> turns the icon round and round, for loading states (slower for people who ask for reduced motion) · <code>wi-fw</code> gives every icon the same width, so lists line up.',
    },
  },
  buttons: {
    title: { th: 'ในปุ่มและ component', en: 'In buttons and components' },
    text: {
      th: 'input <code>icon</code> ของ component ใน WiraTheme (ปุ่ม เมนู ช่องค้นหา แท็บ ฯลฯ) รับ class ของไอคอน ใส่ <code>icon="wi wi-save"</code> ได้เลย และใส่ weight เพิ่มได้ เช่น <code>icon="wi wi-trash wi-bold"</code> · ปุ่มที่มีแต่ไอคอนใส่ <code>ariaLabel</code> ด้วยเสมอ',
      en: 'The <code>icon</code> input of WiraTheme components (buttons, menus, search fields, tabs …) takes icon classes, so write <code>icon="wi wi-save"</code>, with a weight too if you like (<code>icon="wi wi-trash wi-bold"</code>) · an icon-only button always gets an <code>ariaLabel</code>.',
    },
  },
  component: {
    title: { th: 'Component <wi-icon>', en: 'The <wi-icon> component' },
    text: {
      th: '<code>&lt;wi-icon name="check"&gt;</code> วาดไอคอนเป็น SVG ในหน้า (ไม่ใช้ font) ชื่อและชื่อแทนเหมือน class · <code>weight</code> (<code>thin</code> / <code>light</code> / <code>regular</code> / <code>bold</code> / <code>fill</code>), <code>[size]</code> (ตัวเลขเป็น px หรือหน่วย CSS อื่น ค่าเริ่มต้น 1em), <code>color</code> และ <code>[spin]="true"</code> · ไม่ใส่ <code>label</code> = ไอคอนตกแต่ง โปรแกรมอ่านจอข้ามไป ใส่ <code>label</code> = อ่านเป็นรูปที่มีชื่อ · <code>provideWiraIcon()</code> ตั้งค่าเริ่มต้นของทั้งแอป',
      en: '<code>&lt;wi-icon name="check"&gt;</code> draws the icon as inline SVG (no font), with the same names and aliases as the classes · <code>weight</code> (<code>thin</code> / <code>light</code> / <code>regular</code> / <code>bold</code> / <code>fill</code>), <code>[size]</code> (a number is px, or any CSS length; 1em by default), <code>color</code> and <code>[spin]="true"</code> · without <code>label</code> the icon is decorative and screen readers skip it; with <code>label</code> it is read as a named image · <code>provideWiraIcon()</code> sets app-wide defaults.',
    },
  },
  gallery: {
    title: { th: 'ไอคอนทั้งหมด', en: 'All icons' },
    text: {
      th: 'ค้นหาด้วยชื่อหรือชื่อแทน (พิมพ์ชื่อเดิมพร้อม prefix ก็ได้ เช่น <code>pi-times</code> หรือ <code>fa-xmark</code>) หรือชื่อหมวดภาษาไทย เลือกหมวด น้ำหนักเส้น และขนาด แล้วคลิกไอคอนเพื่อดู class, tag ของ component, ชื่อแทน ปุ่มคัดลอก และดาวน์โหลด SVG',
      en: 'Search by name or alias (old names with their prefix work too, such as <code>pi-times</code> or <code>fa-xmark</code>) or by category, pick a category, weight and size, and click an icon for its class, the component tag, its aliases, copy buttons and the SVG download.',
    },
  },
  migration: {
    title: { th: 'ย้ายจากไอคอนเดิม', en: 'Moving from other icons' },
    text: {
      th: 'ชื่อไอคอนหลักตรงกับชื่อ <code>pi-*</code> ที่แอปใช้อยู่ และชื่อแบบ Font Awesome ใช้เป็นชื่อแทนได้ จึงเปลี่ยนแค่ prefix: ค้นหา <code>pi pi-</code> แล้วแทนด้วย <code>wi wi-</code> ทั้งโปรเจค (template, ข้อมูลเมนู และ <code>icon="…"</code> ของ component) · ชื่อที่ไม่มี ค้นในรายการด้านบนด้วยชื่อเดิมได้',
      en: 'The main icon names match the <code>pi-*</code> names apps already use, and Font Awesome spellings work as aliases, so only the prefix changes: replace <code>pi pi-</code> with <code>wi wi-</code> across the project (templates, menu data and the <code>icon="…"</code> of components) · for a name that is missing, search the list above by the old name.',
    },
  },
  license: {
    title: { th: 'สัญญาอนุญาต', en: 'Licence' },
    text: {
      th: 'wiraicon เผยแพร่แบบ MIT ภาพไอคอนมาจาก <a href="https://phosphoricons.com" target="_blank" rel="noopener">Phosphor Icons</a> (MIT) ใช้ในงานของหน่วยงานและงานเชิงพาณิชย์ได้ เก็บไฟล์ LICENSE ใน package ไว้ด้วย',
      en: 'wiraicon is MIT licensed; the drawings come from <a href="https://phosphoricons.com" target="_blank" rel="noopener">Phosphor Icons</a> (MIT). It can be used in organisational and commercial work; keep the LICENSE file that ships with the package.',
    },
  },
};

export const ICONS_CODE: Record<string, Snippet> = {
  install: `npm install wiraicon`,
  styles: `// angular.json → projects.<app>.architect.build.options
"styles": [
  "node_modules/wiraicon/wiraicon.css",
  "src/styles.scss"
]`,
  ngmodule: `// app.module.ts หรือ feature module ที่ใช้ <wi-icon>
import { NgModule } from '@angular/core';
import { WiIconModule } from 'wiraicon/angular';

@NgModule({
  imports: [WiIconModule],
})
export class AppModule {}`,
  provide: {
    v3: `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideWiraIcon } from 'wiraicon/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // ทุก <wi-icon> ในแอปเริ่มจากค่านี้ ใส่บน component ก็ได้
    provideWiraIcon({ weight: 'bold', size: 18 }),
  ],
};`,
    classic: `// app.module.ts
import { NgModule } from '@angular/core';
import { provideWiraIcon, WiIconModule } from 'wiraicon/angular';

@NgModule({
  imports: [WiIconModule],
  providers: [
    // ทุก <wi-icon> ในแอปเริ่มจากค่านี้ ใส่บน component ก็ได้
    provideWiraIcon({ weight: 'bold', size: 18 }),
  ],
})
export class AppModule {}`,
  },
  classes: `<i class="wi wi-check"></i>
<i class="wi wi-times"></i>
<i class="wi wi-search"></i>
<i class="wi wi-bell"></i>
<i class="wi wi-calendar"></i>
<i class="wi wi-users"></i>
<i class="wi wi-graduation-cap"></i>
<i class="wi wi-file-excel"></i>`,
  weights: `<i class="wi wi-heart wi-thin"></i>
<i class="wi wi-heart wi-light"></i>
<i class="wi wi-heart"></i>
<i class="wi wi-heart wi-bold"></i>
<i class="wi wi-heart wi-fill"></i>`,
  size: `<!-- ขนาดตาม font-size สีตาม color -->
<i class="wi wi-star wi-fill" style="font-size: 2rem; color: var(--wt-warn-color)"></i>
<i class="wi wi-bell" style="font-size: 1.5rem; color: var(--wt-primary-color)"></i>
<i class="wi wi-spinner wi-spin" style="font-size: 1.5rem"></i>

<!-- wi-fw: ไอคอนกว้างเท่ากัน รายการตรงกัน -->
<ul class="list-none m-0 p-0">
  <li><i class="wi wi-home wi-fw"></i> หน้าแรก</li>
  <li><i class="wi wi-users wi-fw"></i> นักเรียน</li>
  <li><i class="wi wi-cog wi-fw"></i> ตั้งค่า</li>
</ul>`,
  buttons: `<wt-button label="บันทึก" icon="wi wi-save" (onClick)="save()"></wt-button>
<wt-button label="ส่งออก Excel" icon="wi wi-file-excel" severity="secondary" [outlined]="true" (onClick)="exportExcel()"></wt-button>
<wt-button icon="wi wi-trash wi-bold" severity="danger" [text]="true" [rounded]="true" ariaLabel="ลบ" (onClick)="remove()"></wt-button>`,
  component: `<wi-icon name="check"></wi-icon>
<wi-icon name="trash" weight="bold" [size]="24" color="var(--wt-danger-color)"></wi-icon>
<wi-icon name="info-circle" [size]="24" label="ข้อมูลเพิ่มเติม"></wi-icon>
<wi-icon name="spinner" [size]="24" [spin]="true"></wi-icon>`,
  migration: `<!-- เดิม -->
<i class="pi pi-check"></i>
<wt-button label="บันทึก" icon="pi pi-save"></wt-button>

<!-- ใหม่: เปลี่ยนแค่ prefix -->
<i class="wi wi-check"></i>
<wt-button label="บันทึก" icon="wi wi-save"></wt-button>`,
};

/** English for the Thai in the samples on the Icons page. */
export const ICONS_WORDS: SampleWords = {
  'app.module.ts หรือ feature module ที่ใช้ <wi-icon>': 'app.module.ts or the feature module that uses <wi-icon>',
  'ทุก <wi-icon> ในแอปเริ่มจากค่านี้ ใส่บน component ก็ได้': 'every <wi-icon> in the app starts from these; set them on the component too',
  'ขนาดตาม font-size สีตาม color': 'size from font-size, colour from color',
  'wi-fw: ไอคอนกว้างเท่ากัน รายการตรงกัน': 'wi-fw: icons of one width, so the list lines up',
  'หน้าแรก': 'Home',
  'นักเรียน': 'Students',
  'ตั้งค่า': 'Settings',
  'ส่งออก Excel': 'Export to Excel',
  'ข้อมูลเพิ่มเติม': 'More information',
  'เดิม': 'before',
  'ใหม่: เปลี่ยนแค่ prefix': 'after: only the prefix changes',
  'ค้นหาไอคอน เช่น save, xmark, ปฏิทิน': 'Search icons, e.g. save, xmark, calendar',
  'ทุกหมวด': 'All categories',
  'หมวด': 'Category',
  'น้ำหนักเส้น': 'Weight',
  'ขนาด': 'Size',
  'ไอคอน': 'icons',
  'ชื่อแทน': 'Aliases',
  'ไม่มี': 'None',
  'ดาวน์โหลด SVG': 'Download SVG',
  'ปิด': 'Close',
  'ไม่พบไอคอนที่ค้นหา': 'No icon matches',
  'โหลดรายการไอคอนไม่ได้': 'The icon list could not be loaded',
  'กำลังโหลดรายการไอคอน': 'Loading the icon list',
  'ปกติ': 'regular',
};
