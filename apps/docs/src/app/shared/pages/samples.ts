import { DocVersion } from '../../core/versions';
import { SampleWords } from '../../core/sample-text';

/** Code shown on the Getting Started and Theming pages (DESIGN.md §5–§8). */

export const NG_ADD = 'ng add wiratheme';

/** Default theme of each major: v1 starts from sila-light-teal, v2 / v3 from Mali. */
export function defaultTheme(v: DocVersion): string {
  return v.major === 1 ? 'sila-light-teal' : 'mali';
}

export function ngAddPrompts(v: DocVersion): string {
  // Exactly what the CLI prints (it is English-only).
  const themes =
    v.major === 1
      ? 'Sila light (default) · Sila dark · Arun light · Sayan dim dark · Ratri dark · Material light · Material dark'
      : v.major === 2
        ? 'Mali: clean, modern (default) · Sila: bold, roomy · Material: Material Design · Phet: sharp, high contrast'
        : 'Mali: clean, modern (default) · Sila: bold, roomy · Material: Material Design · Phet: sharp, high contrast · Wira · Lanna · Siam · Nakhon · Glass';
  const row = (q: string, choices?: string) => (choices ? `? ${q.padEnd(48)}› ${choices}` : `? ${q}`);
  return [
    row('How should the main theme be loaded?', 'Detect from the project (recommended) · SCSS · CSS'),
    row('App structure?', 'Detect from main.ts (recommended) · NgModule · Standalone'),
    row('Theme?', `This version's default · ${themes}`),
    row('Add WiraTheme utility classes (grid, flex, spacing)?'),
    row('Primary colour hex (empty = preset colour)'),
    row('Font?', "Preset's font (skipped if already loaded) · Kanit · Sarabun · Prompt · Noto Sans Thai · IBM Plex Sans Thai · Anuphan · Inter · Roboto · Don't set a font"),
    row('Language and calendar?', 'Thai, Buddhist calendar (B.E.) · Thai, Gregorian calendar (A.D.) · English'),
    row('Dark mode?', 'Off · Toggle with the .wt-dark class · Follow the OS setting'),
  ].join('\n');
}

/** What ng add prints when it is done (SCSS + NgModule). */
export function ngAddResult(v: DocVersion): string {
  const theme = defaultTheme(v);
  return `WiraTheme: SCSS · NgModule · ${theme} · <primary>
  ✔ created src/theme/wiratheme.theme.scss
  ✔ src/styles.scss: added @use 'theme/wiratheme.theme'
  ✔ created src/theme/wiratheme.overrides.ts
  ✔ src/styles.scss: added @use 'wiratheme/utils';
  ✔ src/app/app.module.ts: added provideWiraTheme() to the providers of AppModule
Next: import WtButtonModule (NgModule) or WtButton (standalone) from wiratheme/button, then use <wt-button label="Save"></wt-button>`;
}

export function ngAddFlags(v: DocVersion): string {
  return `# ใช้ค่าที่ตรวจพบและค่าเริ่มต้นทั้งหมด ไม่ถามอะไร
ng add wiratheme --defaults

# หรือส่งเป็น flag ทีละข้อ
ng add wiratheme --style=scss --structure=module --theme=${defaultTheme(v)} --primary=#00a86b`;
}

export function providerNgModule(v: DocVersion): string {
  return `// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideWiraTheme } from 'wiratheme/config';
import { WtButtonModule } from 'wiratheme/button';
import { wiraOverrides } from '../theme/wiratheme.overrides';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, WtButtonModule],
  providers: [
    provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist' }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}${v.major === 1 ? '\n\n// Angular 15–17: ใช้ได้เหมือนกันทุก minor' : ''}`;
}

export function providerStandalone(v: DocVersion): string {
  const zoneless =
    v.major === 3
      ? `\n    provideZonelessChangeDetection(),   // v3 รันแบบ zoneless ได้เต็มที่`
      : v.major === 2
        ? `\n    provideZoneChangeDetection({ eventCoalescing: true }),`
        : '';
  const coreImport =
    v.major === 3
      ? `import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';`
      : v.major === 2
        ? `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';`
        : `import { ApplicationConfig } from '@angular/core';`;
  return `// app.config.ts
${coreImport}
import { provideWiraTheme } from 'wiratheme/config';
import { wiraOverrides } from '../theme/wiratheme.overrides';

export const appConfig: ApplicationConfig = {
  providers: [${zoneless}
    provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist' }),
  ],
};`;
}

export const PROVIDER_FOR_ROOT = `// ถ้าชอบสไตล์ forRoot แบบ NgModule
import { WiraThemeModule } from 'wiratheme/config';

@NgModule({
  imports: [WiraThemeModule.forRoot({ locale: 'th', calendar: 'buddhist' })],
})
export class AppModule {}`;

export function scssTheme(v: DocVersion): string {
  if (v.major === 1) {
    return `// src/theme/wiratheme.theme.scss
// ชื่อธีมเดียวกับโฟลเดอร์ธีมที่แอปเดิมใช้อยู่
@use 'wiratheme/theme' with (
  $theme: 'sila-light-teal',
);

// หรือเริ่มจาก preset ของยุคนี้แล้วปรับเอง
// @use 'wiratheme/theme' with (
//   $preset: 'sila-classic',            // sila-classic · arun · sayan · ratri · material-classic
//   $primary: #00a86b,                  // ใส่สีเดียว ระบบสร้างเฉด 50–950 ให้
//   $primary-contrast: #ffffff,         // ตัวอักษรบนปุ่มหลัก
//   $scheme: 'light',                   // 'dark' = ธีมมืดอย่างเดียวแบบ sayan / ratri
//   $font-family: ('Kanit', sans-serif),
//   $components: (card: (body-gap: 0)),
// );`;
  }
  const presets = v.major === 2 ? 'mali · sila · material · phet' : 'mali · sila · material · phet · wira · lanna · siam · nakhon · glass';
  return `// src/theme/wiratheme.theme.scss
@use 'wiratheme/theme' with (
  $preset: 'mali',                      // ${presets}
  $primary: #06b6d4,                    // ใส่สีเดียว ระบบสร้างเฉด 50–950 ให้
  $primary-contrast: #ffffff,           // ตัวอักษรบนปุ่มหลัก
  $scheme: 'light',                     // 'dark' = ธีมมืดอย่างเดียว
  $surface: 'slate',
  $font-family: ('Kanit', sans-serif),
  $radius: 6px,
  $density: 'comfortable',              // 'compact' | 'normal' | 'comfortable'
  $components: (
    card:   (body-gap: 0),
    button: (font-weight: 600),
  )
);

// @use 'wiratheme/theme';             // ไม่ใส่ with (…) = ธีมเริ่มต้นของรุ่น (mali)`;
}

export const SCSS_STYLES = `// src/styles.scss (บรรทัดแรก)
@use 'theme/wiratheme.theme';`;

export const SCSS_API = `// ไฟล์ SCSS ของ component ในแอป: โมดูล API ไม่ปล่อย CSS ซ้ำ
@use 'wiratheme/theme/api' as wt;

.student-card {
  border-color: wt.token(primary-300);   // → var(--wt-primary-300)

  @include wt.dark {
    border-color: wt.token(primary-700);
  }
  @include wt.media(md) {
    padding: 1rem;
  }
}`;

export function cssAngularJson(v: DocVersion): string {
  const file =
    v.major === 1
      ? `"node_modules/wiratheme/themes/sila-light-teal/theme.css",   // ชื่อโฟลเดอร์ธีมเดิมของแอป`
      : `"node_modules/wiratheme/themes/mali/theme.css",              // หรือ themes/mali/<สี>.css เช่น cyan.css`;
  return `// angular.json → projects.<app>.architect.build.options
"styles": [
  ${file}
  "src/styles.css"
]`;
}

export function cssOverride(v: DocVersion): string {
  const compat =
    v.major === 1
      ? `/* ตัวแปรชื่อเดิมที่แอปอ่านอยู่มีให้ด้วย: var(--primary-color), var(--surface-ground),
   var(--surface-border), var(--text-color), var(--green-500) … ใช้ต่อได้ */`
      : `/* ตัวแปรชื่อเดิมที่แอปอ่านอยู่มีให้ด้วย: var(--p-primary-color), var(--p-surface-0..950),
   var(--p-content-border-radius), var(--p-<สี>-<เฉด>) … ใช้ต่อได้ */`;
  return `/* src/styles.css: CSS ของแอปไม่อยู่ใน @layer จึงชนะธีมทั้งหมด */
:root {
  --wt-primary-color: #00a86b;
  --wt-primary-contrast: #ffffff;    /* ตัวอักษรขาวบนปุ่มหลักตามแบรนด์ */
  --wt-card-body-gap: 0;
}

/* dark mode แบบ class: ใส่ .wt-dark ที่ <html> (หรือ class ที่ตั้งใน darkModeSelector) */
:root.wt-dark {
  --wt-ground: #0b1220;
}

${compat}`;
}

export const CSS_SCOPED = `/* ทั้งโซน เช่น ฝั่ง admin ใช้สีหลักอีกสี */
.admin-area {
  --wt-primary-color: #e11d48;
  --wt-primary-hover: #be123c;
  --wt-primary-active: #9f1239;
}`;

export const LAYER_ORDER = `@layer reset, wiratheme.tokens, wiratheme.components, wiratheme.utilities, wiratheme.overrides;`;

export const LAYER_STACK = `แพ้ / loses   wiratheme.tokens       ← ธีมหลักจาก SCSS / CSS (หรือ preset จาก TS)
              wiratheme.components   ← CSS ของ component (อ่านแค่ var(--wt-*))
              wiratheme.utilities    ← utility class (wiratheme/utils) ถ้าเปิดใช้
              wiratheme.overrides    ← overrides จาก TS / WtThemeService
ชนะ / wins    CSS ของแอปเอง          ← ไม่อยู่ใน layer จึงชนะโดยไม่ต้องใช้ !important`;

export const TS_OVERRIDES = `// src/theme/wiratheme.overrides.ts (ng add สร้างไฟล์นี้ให้ เริ่มต้นว่าง)
import { defineOverrides, palette } from 'wiratheme/config';

export const wiraOverrides = defineOverrides({
  semantic: {
    primary: palette('#00a86b'),
    primaryContrast: '#ffffff',                // ตัวอักษรบนปุ่มหลัก
    radius: '8px',
  },
  components: {
    card: { bodyGap: '0' },                    // แทน --p-card-body-gap: 0px !important
    button: { radius: '999px' },
  },
  dark: {
    semantic: { surface: palette('#0f1d1a') }, // ส่วนที่ไม่ได้ระบุ dark มีผลทั้งสองโหมด
  },
});`;

/** TS-only theme from the preset on screen: a named theme in v1, a preset constant in v2 / v3. */
export function tsPreset(v: DocVersion, id: string, name: string, dark: boolean): string {
  const named = v.major === 1 || !/^[A-Z]/.test(name);
  const base = named ? `themePreset('${id}')` : name;
  const importLine = named ? `import { themePreset } from 'wiratheme/presets';` : `import { ${name} } from 'wiratheme/presets';`;
  return `// ใช้ TypeScript อย่างเดียว ไม่มีไฟล์ธีม SCSS / CSS
import { definePreset, palette, provideWiraTheme } from 'wiratheme/config';
${importLine}

const School = definePreset(${base}, {${dark ? "\n  scheme: 'dark',                                   // ธีมมืดอย่างเดียว ไม่ต้องสลับ class" : ''}
  semantic: {
    primary: palette('{cyan}'),
    primaryContrast: '#ffffff',
  },
});

provideWiraTheme({ preset: School });`;
}

export const TS_RUNTIME = `import { inject } from '@angular/core';
import { WtThemeService } from 'wiratheme/config';

const theme = inject(WtThemeService);
theme.setPrimary('#2563eb');                       // ทุกเฉดและ token ที่อ้างถึงเปลี่ยนตาม
theme.setDarkMode(true);                           // สลับ .wt-dark ที่ <html>
theme.patch({ components: { button: { radius: '999px' } } });
theme.setOverrides({});                            // ล้าง overrides ทั้งหมด
theme.setScale('md');                              // ขนาด UI: 'sm' 12px · 'md' 14px · 'lg' 16px`;

export const SCALE = `// app.config.ts (หรือ WiraThemeModule.forRoot({ ... }) ใน AppModule)
provideWiraTheme({ scale: 'md' });   // root font size 14px: ทุกค่า rem ย่อตาม ทั้ง UI เล็กลงเท่ากัน

// เปลี่ยนตอน runtime
const theme = inject(WtThemeService);
theme.setScale('lg');    // 16px
theme.setScale(15);      // กำหนดเป็น px ก็ได้
theme.setScale(null);    // คืนให้ CSS ของหน้าเว็บกำหนดเอง`;

export function firstComponent(v: DocVersion): string {
  return v.major === 1
    ? `<!-- app.component.html -->
<wt-button label="บันทึก" icon="pi pi-check" [action]="save"></wt-button>`
    : `<!-- app.component.html -->
<wt-button label="บันทึก" icon="pi pi-check" [action]="save"></wt-button>`;
}

export const FIRST_COMPONENT_TS = `export class AppComponent {
  // [action] รับตัวฟังก์ชัน จึง bind ไว้ครั้งเดียวให้ this ยังเป็น component
  save = this.saveStudent.bind(this);

  saveStudent(): Observable<unknown> {
    // คืน Promise หรือ Observable: ปุ่มแสดง spinner และกันกดซ้ำจนงานเสร็จ
    return this.studentService.save(this.student);
  }
}`;

export const TRANSLATION = `import { inject } from '@angular/core';
import { WtConfig } from 'wiratheme/config';

// ตั้งครั้งเดียวที่ระดับแอป: locale 'th' มีในตัวแล้ว แก้เฉพาะคำที่อยากเปลี่ยน
inject(WtConfig).setTranslation({ emptyMessage: 'ไม่พบข้อมูลที่ค้นหา' });`;

export const MIGRATE_AFTER = `<wt-button label="บันทึก" icon="pi pi-check" [action]="save"></wt-button>
<input wtInputText name="name" [(ngModel)]="name" />
<wt-checkbox name="agree" [(ngModel)]="agree" [binary]="true" label="ยอมรับเงื่อนไข"></wt-checkbox>
<wt-card header="โปรไฟล์">…</wt-card>`;

export function migrateCss(v: DocVersion): string {
  if (v.major === 1) {
    return `/* CSS เดิมของแอปที่แก้คลาสเหล่านี้ยังได้ผล: template ของ WiraTheme มีคลาสเหล่านี้คู่กับ wt-* */
.p-button.p-button-warning { font-weight: 600; }
.p-card .p-card-body { padding: 1rem; }
.p-checkbox .p-checkbox-box.p-highlight { border-radius: 4px; }
.p-inputswitch { vertical-align: middle; }

/* ตัวแปรชื่อเดิมของธีมมีให้ครบ */
.student-name { color: var(--primary-color); border-color: var(--surface-border); }
.page { background: var(--surface-ground); color: var(--text-color); }
.badge-ok { color: var(--green-500); }

/* ทางที่แนะนำต่อจากนี้: ตั้ง token ครั้งเดียว ไม่ต้องใช้ ::ng-deep / !important */
:root { --wt-card-body-gap: 0; }`;
  }
  return `/* CSS เดิมของแอปที่แก้คลาสเหล่านี้ยังได้ผล: template ของ WiraTheme มีคลาสเหล่านี้คู่กับ wt-* */
.p-button.p-button-warn { font-weight: 600; }
.p-checkbox.p-checkbox-checked { --my-accent: var(--p-primary-color); }
.p-toggleswitch { vertical-align: middle; }

/* ตัวแปรชื่อเดิมมีให้ และค่าที่แอปตั้งเองก็ยังมีผล */
:root { --p-card-body-gap: 0; }
.panel { border-radius: var(--p-content-border-radius); background: var(--p-surface-0); }
.badge-ok { color: var(--p-green-500); }

/* ทางที่แนะนำต่อจากนี้: ตั้ง token ครั้งเดียว ไม่ต้องใช้ ::ng-deep / !important */
:root { --wt-card-body-gap: 0; }`;
}

/** English for the Thai in the samples above (see core/sample-text.ts). */
export const GUIDE_WORDS: SampleWords = {
  'ใช้ค่าที่ตรวจพบและค่าเริ่มต้นทั้งหมด ไม่ถามอะไร': 'Take what it detects and every default, no questions asked',
  'หรือส่งเป็น flag ทีละข้อ': 'or pass each answer as a flag',
  'ใช้ได้เหมือนกันทุก minor': 'every minor works the same',
  'รันแบบ zoneless ได้เต็มที่': 'runs fully zoneless',
  'ถ้าชอบสไตล์ forRoot แบบ NgModule': 'if you prefer the NgModule forRoot style',
  'ชื่อธีมเดียวกับโฟลเดอร์ธีมที่แอปเดิมใช้อยู่': 'the same name as the theme folder the app already uses',
  'หรือเริ่มจาก preset ของยุคนี้แล้วปรับเอง': "or start from one of this version's presets and adjust it",
  'ใส่สีเดียว ระบบสร้างเฉด 50–950 ให้': 'one colour; shades 50–950 are generated',
  'ตัวอักษรบนปุ่มหลัก': 'text on primary buttons',
  'ธีมมืดอย่างเดียวแบบ sayan / ratri': 'dark only, like sayan / ratri',
  'ธีมมืดอย่างเดียว': 'dark only',
  'ไม่ใส่ with (…) = ธีมเริ่มต้นของรุ่น (mali)': "no with (…) = the version's default theme (mali)",
  'บรรทัดแรก': 'first line',
  'ไฟล์ SCSS ของ component ในแอป: โมดูล API ไม่ปล่อย CSS ซ้ำ': 'a component SCSS file in the app: the API module emits no CSS of its own',
  'ชื่อโฟลเดอร์ธีมเดิมของแอป': "the app's existing theme folder",
  'หรือ themes/mali/<สี>.css เช่น cyan.css': 'or themes/mali/<colour>.css, e.g. cyan.css',
  'ตัวแปรชื่อเดิมที่แอปอ่านอยู่มีให้ด้วย:': 'The old variable names the app reads are there too:',
  '<สี>-<เฉด>': '<colour>-<shade>',
  'ใช้ต่อได้': 'keep working',
  'CSS ของแอปไม่อยู่ใน @layer จึงชนะธีมทั้งหมด': "the app's CSS is not in a @layer, so it beats the whole theme",
  'ตัวอักษรขาวบนปุ่มหลักตามแบรนด์': 'white text on primary buttons, as the brand wants',
  'dark mode แบบ class: ใส่ .wt-dark ที่ <html> (หรือ class ที่ตั้งใน darkModeSelector)':
    'class-based dark mode: put .wt-dark on <html> (or the class set in darkModeSelector)',
  'ทั้งโซน เช่น ฝั่ง admin ใช้สีหลักอีกสี': 'a whole area, e.g. the admin side, in another primary colour',
  'แพ้ / loses   ': 'loses         ',
  'ชนะ / wins    ': 'wins          ',
  'ธีมหลักจาก SCSS / CSS (หรือ preset จาก TS)': 'the main theme from SCSS / CSS (or a TS preset)',
  'CSS ของ component (อ่านแค่ var(--wt-*))': 'component CSS (reads only var(--wt-*))',
  'utility class (wiratheme/utils) ถ้าเปิดใช้': 'utility classes (wiratheme/utils), if enabled',
  'overrides จาก TS / WtThemeService': 'overrides from TS / WtThemeService',
  'CSS ของแอปเอง          ': "your app's CSS         ",
  'ไม่อยู่ใน layer จึงชนะโดยไม่ต้องใช้ !important': 'not in a layer, so it wins with no !important',
  '(ng add สร้างไฟล์นี้ให้ เริ่มต้นว่าง)': '(ng add creates it, empty)',
  'แทน --p-card-body-gap: 0px !important': 'instead of --p-card-body-gap: 0px !important',
  'ส่วนที่ไม่ได้ระบุ dark มีผลทั้งสองโหมด': 'anything outside dark applies to both modes',
  'ใช้ TypeScript อย่างเดียว ไม่มีไฟล์ธีม SCSS / CSS': 'TypeScript only, no SCSS / CSS theme file',
  'ธีมมืดอย่างเดียว ไม่ต้องสลับ class': 'dark only, no class to toggle',
  'ทุกเฉดและ token ที่อ้างถึงเปลี่ยนตาม': 'every shade, and every token that uses them, follows',
  'สลับ .wt-dark ที่ <html>': 'toggles .wt-dark on <html>',
  'ล้าง overrides ทั้งหมด': 'clears every override',
  "ขนาด UI: 'sm' 12px · 'md' 14px · 'lg' 16px": "UI size: 'sm' 12px · 'md' 14px · 'lg' 16px",
  '(หรือ WiraThemeModule.forRoot({ ... }) ใน AppModule)': '(or WiraThemeModule.forRoot({ ... }) in AppModule)',
  'ทุกค่า rem ย่อตาม ทั้ง UI เล็กลงเท่ากัน': 'every rem value follows, so the whole UI shrinks evenly',
  'เปลี่ยนตอน runtime': 'change it at runtime',
  'กำหนดเป็น px ก็ได้': 'or a px value',
  'คืนให้ CSS ของหน้าเว็บกำหนดเอง': "hand it back to the page's CSS",
  '[action] รับตัวฟังก์ชัน จึง bind ไว้ครั้งเดียวให้ this ยังเป็น component': '[action] takes the function itself: bind it once so this stays the component',
  'คืน Promise หรือ Observable: ปุ่มแสดง spinner และกันกดซ้ำจนงานเสร็จ':
    'return a Promise or an Observable: the button shows a spinner and ignores clicks until it is done',
  "ตั้งครั้งเดียวที่ระดับแอป: locale 'th' มีในตัวแล้ว แก้เฉพาะคำที่อยากเปลี่ยน":
    "set once for the whole app: the 'th' locale is built in, change only the words you want",
  'ไม่พบข้อมูลที่ค้นหา': 'Nothing matches your search',
  'ยอมรับเงื่อนไข': 'I accept the terms',
  'โปรไฟล์': 'Profile',
  'CSS เดิมของแอปที่แก้คลาสเหล่านี้ยังได้ผล: template ของ WiraTheme มีคลาสเหล่านี้คู่กับ wt-*':
    "The app's existing CSS for these classes still works: WiraTheme templates carry them next to wt-*",
  'ตัวแปรชื่อเดิมของธีมมีให้ครบ': "Every variable name of the old theme is there",
  'ทางที่แนะนำต่อจากนี้: ตั้ง token ครั้งเดียว ไม่ต้องใช้ ::ng-deep / !important': 'From here on: set a token once, no ::ng-deep / !important',
  'ตัวแปรชื่อเดิมมีให้ และค่าที่แอปตั้งเองก็ยังมีผล': 'The old variable names are there, and values the app sets still apply',
};

/** Theming → Presets: the preview card and the TypeScript sample. */
export const PRESET_WORDS: SampleWords = {
  ...GUIDE_WORDS,
  'ข้อมูลบัญชี': 'Account details',
  'สมชาย ใจดี': 'Alex Morgan',
  'ยอมรับเงื่อนไข': 'I accept the terms',
  'รับข่าวสาร': 'Get the newsletter',
  'ลบบัญชี': 'Delete account',
};
