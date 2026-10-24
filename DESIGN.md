# WiraTheme — ร่างสถาปัตยกรรม (Draft v0.1)

> UI component library + Theme Designer สำหรับ **Angular อย่างเดียว** ได้แรงบันดาลใจจาก PrimeNG
> ร่างเมื่อ 24 ต.ค. 2026 จากการอ่านโปรเจค Strisrinan_Apps (Angular 15), SP Admission Frontend V2 (Angular 19) และ Wutthiphon Homepage (Angular 19)

## สรุปสั้น

- **เป้าหมายหลัก: ใช้แทน PrimeNG** ในโปรเจคของ Wirabyte หลังจาก PrimeNG เปลี่ยนมาใช้รูปแบบ license โดยคงหน้าตาและวิธีใช้ให้คล้ายเดิมมากที่สุด (ย้ายได้ง่าย) แต่ครอบคลุมกว่าและเหมาะกับงานไทยกว่า
- มีแพ็กเกจหลักแพ็กเกจเดียวชื่อ **`wiratheme`** (ตอนตรวจ ชื่อนี้ยังว่างบน npm) แยก major ตามรุ่น Angular แบบเดียวกับ PrimeNG: **v1 = Angular 15–17, v2 = 18–20, v3 = 21+** โดย v3 มาพร้อมหน้าตาใหม่แบบ **Liquid Glass + ชุดสีสด** และ `ng add wiratheme` จะเลือก major ที่เข้ากับโปรเจคให้เอง
- ใช้ได้ทั้ง **standalone และ NgModule** ในทุกรุ่น
- ธีมคือชุด **design token ที่ออกมาเป็น CSS variables** ชุดเดียว เขียนได้ 3 ทาง ได้แก่ **CSS** สำเร็จรูป, **SCSS** (`@use … with (…)`) และ **TypeScript** (override หรือ preset ทับได้ตอน runtime) ลำดับว่าค่าไหนชนะคุมด้วย CSS `@layer` จึงเลิกใช้ `!important` กับ `::ng-deep` ได้
- **Theme Designer** แบบ PrimeNG สมัยก่อน: ปรับค่าบนเว็บแล้วเห็นผลทันที จากนั้น export เป็น SCSS / CSS / TS / JSON และ import ไฟล์กลับมาแก้ต่อได้
- **เว็บแนะนำ** ใช้โครงเดียวกับ primeng.org (แท็บ FEATURES / API / THEMING, เลือก v1/v2/v3 ได้, มี configurator และ Designer)
- มีของที่ PrimeNG ไม่มีแต่โปรเจคเราใช้จริง เช่น ปฏิทิน พ.ศ. ในตัว, ภาษาไทยเป็นค่าเริ่มต้น, Alert แทน SweetAlert2, Table ที่ export Excel ได้ และช่องกรอกเลขบัตรประชาชน

---

## 1. สิ่งที่เจอในโปรเจคเดิม และสิ่งที่ WiraTheme ควรทำ

ตัวเลขด้านล่างได้จากการ grep จึงเป็นค่าประมาณ

| สิ่งที่เจอ | ที่มา | WiraTheme ควรทำ |
|---|---|---|
| ใช้ `theme.css` ขนาด 154 KB ที่ export จาก Theme Designer รุ่นเก่า (Lara light teal, primary `#00a86b`, ฟอนต์ Kanit) | Strisrinan `src/assets/css/theme.css` | ทำ Designer ที่ export ไฟล์ได้ ซึ่งตรงกับวิธีที่ทีมใช้อยู่แล้ว |
| override คลาส `.p-*` ใน SCSS ราว 215 / 46 / 245 จุด และมี `::ng-deep` ใน 25 / 6 / 8 ไฟล์ | ทั้ง 3 โปรเจค | ใช้ cascade layers + token ระดับ component + `[tokens]` สำหรับแก้เฉพาะจุด |
| `--p-card-body-gap: 0px !important;` | SP Admission `styles.scss` | `components.card.bodyGap` |
| `darkModeSelector: '.non-dark-selector'` ที่ใช้เพื่อปิด dark mode | SP Admission `app.module.ts` | มีตัวเลือก `darkMode: 'none'` ตรง ๆ |
| `setTranslation({...})` ภาษาไทยเขียนซ้ำใน layout 3 ไฟล์ | Strisrinan `routes/*-layout.component.ts` | มี locale `th` ในตัวและตั้งครั้งเดียว |
| ใช้ `primeng-buddhist-year-datepicker` | SP Admission | DatePicker รองรับ พ.ศ. ในตัว |
| เรียก `Swal.fire` ราว 219 จุด | Strisrinan | มี `WtAlertService` ที่ใช้ธีมเดียวกัน |
| `xlsx` ถูกใช้ใน 26 / 5 ไฟล์ | Strisrinan / SP Admission | Table export Excel/CSV ได้ในตัว |
| ใช้คลาส PrimeFlex ราว 5,100 / 650 / 230 จุด | ทั้ง 3 โปรเจค | ห้ามใช้ชื่อคลาสชนกับ PrimeFlex และยังไม่ทำระบบ grid เอง |
| **ทุกแอปเป็น NgModule** (`app.module.ts`) แม้แต่แอปที่เป็น Angular 19 | ทั้ง 3 โปรเจค | ต้องรองรับ NgModule ทุกรุ่น ไม่ใช่แค่ v1 |
| ใช้ฟอนต์ Kanit ทุกโปรเจค | `styles.scss` | ใช้เป็นค่าเริ่มต้น และตั้ง line-height ให้สระบน/วรรณยุกต์ไม่ถูกตัด |
| Homepage มีระบบ token `--app-*` (light/dark) ที่เขียนเอง | Homepage `styles.scss` | ใช้ token model ของ WiraTheme แทนได้ |
| สร้าง `dialog-loading`, `empty-state`, `file-upload` ไว้ใช้เอง | SP Admission `shared/components` | ทำเป็น component มาตรฐาน |
| component ที่ใช้มากที่สุด: button 417, table 349, card 308, dropdown 276, dialog 229, calendar 177 | Strisrinan | ใช้เป็นลำดับในการทำ MVP |

## 2. ขอบเขต

**ทำ**
- Angular component library ทั้ง 3 รุ่น, ระบบธีม, Theme Designer, เว็บแนะนำ, schematics (`ng add` / `ng update`)
- ใช้ร่วมกับ PrimeNG ในแอปเดียวกันได้ระหว่างย้าย (ทุกอย่างขึ้นต้นด้วย `wt-` / `--wt-` และไม่มี global reset ไปกระทบของเดิม)
- ตั้งชื่อ input/output ให้ใกล้ PrimeNG มากที่สุด (`label`, `icon`, `severity`, `options`, `optionLabel`, `optionValue`, `(onClick)` …) เพื่อให้การย้ายส่วนใหญ่เป็นแค่การเปลี่ยนชื่อ tag
- เขียนเองทั้งหมด ไม่คัดลอกโค้ดหรือ CSS ของ PrimeNG ที่ "คล้ายเดิม" คือชื่อ API, ชุด component และความรู้สึกตอนใช้ ไม่ใช่ source

**ยังไม่ทำ (ตอนนี้)**
- React / Vue / framework อื่น
- grid หรือ utility CSS ของตัวเอง (ใช้ PrimeFlex หรือ Tailwind ต่อไปได้)
- rich-text editor และ chart engine ของตัวเอง (ทำ wrapper ครอบ Chart.js และ adapter สำหรับ Quill/TinyMCE แทน)
- โหมด unstyled/headless และ pass-through (`pt`) แบบ PrimeNG ไว้พิจารณาหลัง v1.0

---

## 3. Versioning

| | **v1** | **v2** | **v3** |
|---|---|---|---|
| Angular ที่รองรับ | 15 – 17 | 18 – 20 | 21+ |
| เทียบกับ PrimeNG | 15 – 17 | 18 – 20 | 21 |
| build ด้วย | Angular 15.2 · TS 4.9 | Angular 18 · TS 5.4 | Angular 21 · TS 5.9 |
| Node ที่ใช้ dev / build / CI | Node 24 LTS ตัวเดียวทั้ง repo | ← | ← |
| Node ขั้นต่ำของผู้ใช้ (`engines`) | 18 | 18.19 (Angular 18–19) · 20.19 (Angular 20) | 20.19 (ตามที่ Angular 21 กำหนด) |
| `peerDependencies` | `>=15.0.0 <18.0.0` | `>=18.0.0 <21.0.0` | `>=21.0.0 <22.0.0` แล้วขยายทีละ major (ดูด้านล่าง) |
| รูปแบบ API | `@Input()` / `@Output()` | `input()` / `model()` / `output()` | เหมือน v2 + รองรับ Signal Forms |
| template | `*ngIf` / `*ngFor` | `@if` / `@for` | เหมือน v2 |
| change detection | OnPush + zone.js | OnPush, รันแบบ zoneless ได้ | zoneless เป็นหลัก |
| standalone / NgModule | ✓ / ✓ | ✓ / ✓ | ✓ / ✓ |
| animation | CSS ล้วน (ไม่ต้องใช้ `@angular/animations`) | CSS ล้วน | CSS ล้วน |
| หน้าตาเริ่มต้น | Wira แบบพื้นทึบ | Wira แบบพื้นทึบ (เปิดใช้ Glass เองได้) | **Glass**: Liquid Glass + ชุดสีสดใหม่ (ข้อ 6.9) |
| สถานะ | maintenance | active | active (`latest`) |
| แอปเราที่จะใช้ | Strisrinan_Apps | SP Admission V2, Wutthiphon Homepage | — (รออัปเกรด) |

**ทำไมต้อง build ด้วย Angular รุ่นต่ำสุดของช่วง:** library แบบ partial compilation (Angular Package Format) ที่ build ด้วย Angular X ใช้ได้กับแอป Angular X **ขึ้นไป** เพราะ linker ของแอปแปลงให้ แต่ใช้กับรุ่นที่ต่ำกว่าไม่ได้ ดังนั้น v1 ที่ build ด้วย 15 จึงรันบน 15, 16, 17 ได้ทั้งหมด

**ล็อกรุ่น ห้ามใช้ข้ามช่วง** (เช่น ติดตั้ง v1 ลง Angular 18 ต้องไม่ผ่าน) โดยกันไว้ 3 ชั้น:
1. **ตอนติดตั้ง:** `peerDependencies` เป็นช่วงปิด (`>=15.0.0 <18.0.0` …) npm 7 ขึ้นไปจะปฏิเสธการติดตั้ง (ERESOLVE) ส่วน pnpm จะเตือน แต่โปรเจคที่ตั้ง `legacy-peer-deps` จะข้ามชั้นนี้ไปได้ จึงต้องมีอีก 2 ชั้น
2. **ตอน `ng add` / `ng update`:** schematic ตรวจรุ่น Angular ก่อนแก้ไฟล์ ถ้าไม่ตรงจะหยุดและบอกว่าต้องใช้ `wiratheme@<major ที่ถูก>`
3. **ตอนแอปเริ่มทำงาน:** `provideWiraTheme()` และ constructor ของทุก component ตรวจ `VERSION.major` ของ `@angular/core` ถ้าอยู่นอกช่วงจะ throw error ทันที แอปจึงไม่เปิดทั้งตอน dev และ production

มีข้อยกเว้นเดียวคือเว็บแนะนำ (ข้อ 10.1) ที่ต้องโชว์ v1/v2 บน Angular 21 ซึ่งจะใช้ token ภายในที่ไม่ได้เปิดเป็น API สาธารณะ (ขึ้นต้นด้วย `ɵ` แบบ API ภายในของ Angular) การล็อกนี้มีไว้กันการติดตั้งผิดและภาระ support ไม่ได้มีไว้กันคนตั้งใจหลบ

**เลือกรุ่นอัตโนมัติ:** ตั้ง npm dist-tags เป็น `latest` → 3.x, `v2-lts` → 2.x, `v1-lts` → 1.x ส่วน `ng add` / `ng update` จะอ่าน `peerDependencies` แล้วเลือกเวอร์ชันที่เข้ากับ Angular ของโปรเจคเอง

**"21+" ของ v3:** เมื่อ Angular ออก major ใหม่และ CI ผ่าน จะออก minor ของ 3.x ที่ขยาย peer range (เช่น 3.4 เพิ่ม Angular 22) ถ้ามีรุ่นที่ breaking หนักจริงค่อยแยกเป็น v4

**สิ่งที่ต้องรู้:**
- ตามรอบ support 18 เดือนของ Angular ตอนนี้ Angular 15–19 หมด support จาก Google แล้ว v1 จึงควรเป็น **maintenance line** คือแก้บั๊กและมี component หลักครบ แต่ฟีเจอร์ใหม่บางตัวอาจมีแค่ใน v2/v3
- **Node:** ทั้ง repo ใช้ Node 24 LTS ตัวเดียว ไม่ต้องสลับเวอร์ชัน ตรวจแล้วบนเครื่องนี้ว่า Angular CLI 15 และ 19 รันบน Node 24.11 ได้ (ขึ้นแค่คำเตือน "Unsupported") และ Strisrinan_Apps (Angular 15) build บนเครื่องนี้ได้ แต่ Google ไม่ได้รับรอง Angular 15–20 บน Node 24 อย่างเป็นทางการ CI จึงต้อง build v1/v2 บน Node 24 ทุกครั้ง ใช้รุ่น LTS เสมอ ไม่ใช้ Node รุ่นเลขคี่
- **รองรับผู้ใช้ตั้งแต่ Node 18:** library รันในเบราว์เซอร์ Node จึงมีผลแค่กับ schematics (`ng add` / `ng update`) ซึ่งจะ compile ให้รันบน Node 18 ได้ (ไม่ใช้ API ของ Node 20+) และ CI มี job ทดสอบติดตั้งจริงบน Node รุ่นต่ำสุดของแต่ละรุ่น ข้อจำกัดคือ Node 18 ใช้ได้แค่ v1 และ v2 ที่อยู่บน Angular 18–19 เพราะ Angular 20 และ 21 เองต้องใช้ Node 20.19 ขึ้นไป

---

## 4. โครงสร้าง repo (pnpm monorepo)

```
WiraTheme/                      (โครงจริงหลัง Phase 0)
├─ packages/
│  ├─ core/              @wiratheme/core: token engine, presets, exporters/importer, locale th/en,
│  │                     ปฏิทิน พ.ศ., ตรวจเลขบัตรประชาชน (TS ล้วน, ถูก copy เข้าทุก build เป็น wiratheme/core)
│  ├─ themes/            scss/ (_index ไว้ @use … with, _api, _color, _data ที่ generate จาก core)
│  │                     + script สร้าง CSS สำเร็จรูป 4 preset × 18 สี + parity test กับ core
│  ├─ styles/            CSS ของ component ที่ทั้ง 3 รุ่นใช้ไฟล์เดียวกัน
│  ├─ angular-common/    ส่วนที่เหมือนกันทุกรุ่น: config (provideWiraTheme, WtThemeService, ล็อกรุ่น),
│  │                     presets, module/type ของ component (ใช้ API ที่มีตั้งแต่ Angular 15)
│  ├─ angular-signal/    component แบบ signal ที่ v2 และ v3 ใช้ร่วมกัน
│  ├─ angular-v1/        src/ = component แบบ @Input/*ngIf + build shell (Angular 15 toolchain)
│  ├─ angular-v2/        build shell (Angular 18 toolchain) + overlay/
│  ├─ angular-v3/        build shell (Angular 21 toolchain) + overlay/ (provideEnvironmentInitializer)
│  └─ schematics/        ng add (compile เป็น .cjs สำหรับ Node 18 / devkit 15)
├─ apps/                 npm project แยกทั้งหมด ติดตั้ง wiratheme จาก tarball แบบเดียวกับแอปจริง
│  ├─ docs/              เว็บแนะนำ: Angular 21 แบบ NgModule, โหลด v1/v2/v3 แบบ lazy (ข้อ 10.1)
│  └─ playground-v1/ playground-v2/ playground-v3/   Angular 15 / 19 / 21 หลังรัน ng add
├─ e2e/                  Playwright: playground ทั้ง 3 ต้องหน้าตาตรงกัน + เว็บ docs
└─ tools/                versions.mjs (ช่วง Angular ของแต่ละรุ่น), sync-sources, setup-playgrounds,
                         build-docs-packages, dry-run-ng-add, finish-package
```

ใน workspace แต่ละ build shell มีชื่อ package ไม่ซ้ำกัน แต่ตอน publish script จะตั้งชื่อเป็น `wiratheme` ตัวเดียวกันในคนละ major

**โครงของแพ็กเกจที่ผู้ใช้เห็น** (ใช้ secondary entry point แบบ `primeng/button`)

```
wiratheme/config      provideWiraTheme, WiraThemeModule, definePreset, defineOverrides, palette, WtThemeService
wiratheme/button      WtButton, WtButtonModule
wiratheme/table       WtTable, WtTableModule …       (หนึ่ง entry ต่อหนึ่ง component)
wiratheme/alert       WtAlertService (แทน sweetalert2)
wiratheme/thai        wt-thai-id-input, wt-thai-address, pipe ภาษาไทย
wiratheme/theme       SCSS (_index.scss, _api.scss)
wiratheme/themes/     CSS สำเร็จรูป เช่น wira/teal.css, wira/blue.css
wiratheme/locale/     th, en
```

### การแชร์โค้ดระหว่าง 3 รุ่น (เรื่องที่กำหนดภาระดูแลระยะยาว)

| ชั้น | แชร์ | หมายเหตุ |
|---|---|---|
| Token, palette, SCSS และ CSS ของ component | 100% | class name และโครง DOM เหมือนกันทุกรุ่น **ธีมไฟล์เดียวจึงใช้ได้ทั้ง 3 รุ่น** รวมถึงไฟล์ที่ export จาก Designer |
| Logic ล้วน (`@wiratheme/core`) | 100% | ย้าย logic มาไว้ที่นี่ได้มากเท่าไร component ฝั่ง Angular ก็ยิ่งบาง |
| Component Angular v2 ↔ v3 | เกือบ 100% | ใช้ signal API ชุดเดียวกัน ส่วน v3 มี overlay เฉพาะ (Signal Forms, test แบบ zoneless) |
| Component Angular v1 | เขียนแยก | แปลงแบบตรงไปตรงมา: `input()` → `@Input()`, `model()` → `@Input` + `@Output() xChange`, `@if` → `*ngIf` |

ลำดับการทำแต่ละ component คือ เขียนใน `angular-signal` → พอร์ตลง v1 → E2E ชุดเดียวกันต้องผ่านทั้ง 3 playground

> ทางเลือกที่ไม่เลือก: เขียนแบบ v1 ชุดเดียวแล้วใช้กับทุกรุ่น ทำได้เพราะ linker รองรับ แต่ผู้ใช้ v2/v3 จะไม่ได้ signal API และ Signal Forms ซึ่งเป็นเหตุผลหลักของการแยกรุ่น

---

## 5. การติดตั้ง (ง่ายแบบ PrimeNG)

```bash
ng add wiratheme
```

**คำถามระหว่างติดตั้ง** (ค่าในวงเล็บคือค่าที่ตรวจพบหรือค่าเริ่มต้น กด Enter ผ่านได้ทุกข้อ)

```
? ภาษาสไตล์ของโปรเจค            (ตรวจพบ: SCSS)        › SCSS · CSS · Less · Sass · ตั้งค่าเองทีหลัง
? โครงสร้างแอป                  (ตรวจพบ: NgModule)    › NgModule · Standalone
? Preset                         (Wira)                › Wira · Lanna · Siam · Nora-like
? สีหลัก                          (emerald)             › palette 17 สี · กรอก HEX เอง
? ฟอนต์                          (ตรวจพบ Kanit แล้ว)   › Kanit · Sarabun · Prompt · Noto Sans Thai · IBM Plex Sans Thai · ไม่ตั้ง
? ภาษา / ปฏิทิน                   (ไทย + พ.ศ.)          › ไทย + พ.ศ. · ไทย + ค.ศ. · English
? Dark mode                      (ปิด)                 › ปิด · ตาม class · ตามระบบ
? Icon set                       (ตรวจพบ primeicons)   › primeicons · Font Awesome · ไม่ติดตั้ง
```

**โหมดอัตโนมัติ:** `ng add wiratheme --defaults` ใช้ค่าที่ตรวจพบกับค่าเริ่มต้นทั้งหมดโดยไม่ถาม และทุกข้อส่งเป็น flag ได้ เช่น `--style=scss --standalone=false --primary=#00a86b`

**ตรวจจากอะไร**

| ข้อ | ตรวจจาก |
|---|---|
| รุ่น Angular → major ของ wiratheme | `@angular/core` ใน `package.json` (`ng add` เลือกเวอร์ชันให้ ส่วน schematic ตรวจซ้ำอีกรอบ) |
| ภาษาสไตล์ | `angular.json` → `schematics["@schematics/angular:component"].style` / `inlineStyleLanguage` / นามสกุลไฟล์ `styles` |
| standalone หรือ NgModule | `main.ts` มี `bootstrapApplication(` หรือ `bootstrapModule(` |
| มี PrimeNG อยู่แล้ว | `primeng` ใน dependencies → เปิดโหมดอยู่ร่วมกัน และแสดงลิงก์คู่มือย้ายจาก PrimeNG |
| ฟอนต์ / icon ที่มีอยู่ | `styles.*` และ `angular.json` |

**ไฟล์ที่ schematic จะแก้หรือสร้าง**

| | สิ่งที่ทำ |
|---|---|
| NgModule | เพิ่ม `provideWiraTheme(...)` ใน `providers` ของ `app.module.ts` |
| Standalone | เพิ่ม `provideWiraTheme(...)` ใน `app.config.ts` (หรือใน `bootstrapApplication` ของ `main.ts`) |
| SCSS / Sass | สร้าง `src/theme/wiratheme.theme.scss` แล้วเพิ่ม `@use 'theme/wiratheme.theme';` เป็นบรรทัดแรกของ `styles.scss` |
| CSS / Less / อื่น ๆ | เพิ่มไฟล์ CSS สำเร็จรูปของ preset และสีที่เลือกลงใน `angular.json` → `styles` (CSS variables ใช้ได้กับทุก preprocessor) |
| ทุกแบบ | สร้าง `src/theme/wiratheme.overrides.ts` (ไฟล์ override ฝั่ง TS ซึ่งเริ่มต้นว่าง) แล้วผูกกับ provider |
| ทุกแบบ | ติดตั้งฟอนต์และ icon ตามที่เลือก แล้วพิมพ์ "ขั้นตอนถัดไป" |

`ng update wiratheme` ใช้ตอนอัปเกรด Angular ข้ามช่วง (เช่น 17 → 18 ก็ขยับ v1 → v2) และรัน migration ให้ถ้ามี API เปลี่ยน ส่วนการติดตั้งแบบ manual มีคู่มือบนเว็บแนะนำแยกเป็นแท็บ CSS / SCSS / TS

---

## 6. ระบบธีม

### 6.1 Token 3 ชั้น (ทุกช่องทางสุดท้ายออกมาเป็น CSS variable `--wt-*`)

| ชั้น | ตัวอย่าง | CSS variable |
|---|---|---|
| primitive | palette emerald 50–950, radius scale, spacing scale | `--wt-emerald-500`, `--wt-radius-md` |
| semantic | primary, surface, success/info/warn/danger/help, text, border, focus ring, form field, overlay (มีค่า light/dark) | `--wt-primary-500`, `--wt-text-color`, `--wt-form-field-padding-y` |
| component | ค่าของแต่ละ component ที่อ้างถึง semantic ได้ด้วย `{primary.600}` | `--wt-button-padding-x`, `--wt-card-body-gap`, `--wt-table-row-height` |

token ทุกตัวประกาศบน `:root` ส่วน CSS ของ component ใช้แค่ `var(--wt-*)` อย่างเดียว CSS โครงสร้างของ component แถมมากับ component (ไม่ต้อง import แยกแบบ `primeng.min.css` สมัยก่อน และถูก tree-shake อัตโนมัติ) ไฟล์ธีมจึงมีแต่ค่า token

### 6.2 ลำดับการชนะ (CSS `@layer`)

```css
@layer wiratheme.tokens, wiratheme.components, wiratheme.overrides;
```

```
แพ้   wiratheme.tokens       ← ธีมหลักจาก SCSS / CSS (หรือ preset จาก TS ถ้าไม่ใช้ไฟล์)
      wiratheme.components   ← CSS ของ component (ใช้ var() อย่างเดียว)
      wiratheme.overrides    ← override จาก TS / WtThemeService
      CSS ของแอปเอง          ← ไม่อยู่ใน layer จึงชนะทั้งหมดโดยไม่ต้องใช้ !important
ชนะ   [tokens] / wtTheme     ← เฉพาะ element นั้นและลูกของมัน
```

แบบนี้ **ธีมหลักยัง import ผ่าน SCSS ได้ และ TS ก็ override ทับได้เสมอ** โดยไม่ต้องสนลำดับการ import ส่วนตัว injector ฝั่ง TS จะใส่บรรทัดประกาศลำดับ layer ไว้บนสุดของ `<head>` ให้

### 6.3 ทาง A — CSS

```jsonc
// angular.json
"styles": [
  "node_modules/wiratheme/themes/wira/emerald.css",   // หรือไฟล์ที่ export จาก Designer
  "src/styles.css"
]
```

### 6.4 ทาง B — SCSS (ไฟล์แบบที่ Designer export ให้)

```scss
// src/theme/wiratheme.theme.scss
@use 'wiratheme/theme' with (
  $preset: 'wira',
  $primary: #00a86b,                 // ใส่สีเดียวแล้วระบบสร้าง 50–950 ให้
  // $primary: (50: #e8f8f1, 100: #c5eedd, …, 950: #00281a),  // หรือกำหนดเองทุกเฉด
  $surface: 'slate',
  $font-family: ('Kanit', sans-serif),
  $font-size: 14px,
  $radius: 6px,
  $density: 'comfortable',           // 'compact' | 'normal' | 'comfortable'
  $dark-mode: 'none',                // 'none' | 'class' | 'media'
  $ripple: false,
  $components: (
    card:   (body-gap: 0),
    button: (font-weight: 600),
    table:  (row-height: 44px, striped: true),
  )
);
```

```scss
// src/styles.scss
@use 'theme/wiratheme.theme';
```

ไฟล์ SCSS ของ component ในแอปใช้ helper ได้ผ่านโมดูล API (โมดูลนี้ไม่ปล่อย CSS ซ้ำ):

```scss
@use 'wiratheme/theme/api' as wt;

.student-card {
  border-color: wt.token(primary-300);   // → var(--wt-primary-300)
  @include wt.dark { border-color: wt.token(primary-700); }
  @include wt.media(md) { padding: 1rem; }
}
```

### 6.5 ทาง C — TypeScript

**C1. ใช้ไฟล์ SCSS/CSS เป็นธีมหลัก แล้ว override บางค่าด้วย TS** (แบบที่ `ng add` ตั้งให้)

```ts
// src/theme/wiratheme.overrides.ts
import { defineOverrides, palette } from 'wiratheme/config';

export const wiraOverrides = defineOverrides({
  semantic: {
    primary: palette('#00a86b'),
    formField: { paddingY: '0.625rem' },
  },
  components: {
    card: { bodyGap: '0' },                       // แทน --p-card-body-gap: 0px !important
    button: { borderRadius: '{radius.full}' },
  },
  dark: {
    semantic: { surface: palette('#0f1d1a') },    // override ที่ไม่ได้ระบุ dark จะมีผลทั้งสองโหมด
  },
});
```

token ทุกตัวมี type ครบ จึงมี autocomplete และพิมพ์ชื่อผิดจะ compile ไม่ผ่าน ซึ่งเป็นข้อดีของการ override ฝั่ง TS

**C2. ใช้ TS อย่างเดียวโดยไม่มีไฟล์ธีม** (คล้าย PrimeNG v17+ styled mode)

```ts
provideWiraTheme({
  preset: definePreset(Wira, { semantic: { primary: palette('{emerald}') } }),
});
```

ถ้าใช้ทั้งไฟล์ธีมและ `preset` พร้อมกัน ใน dev mode จะมีคำเตือน (ไฟล์ SCSS/CSS ฝัง `--wt-theme-source` ไว้ให้ runtime ตรวจได้)

### 6.6 เปลี่ยนธีมตอน runtime

```ts
const theme = inject(WtThemeService);
theme.setPrimary('#2563eb');
theme.setDarkMode(true);
theme.patch({ components: { button: { borderRadius: '999px' } } });
```

service ตัวนี้ใช้ทำ configurator บนเว็บแนะนำ (แบบรูปที่ 3) และ Designer ก็ใช้โค้ดชุดเดียวกัน

### 6.7 ธีมเฉพาะจุด

```html
<!-- เฉพาะการ์ดใบนี้ -->
<wt-card [tokens]="{ bodyGap: '0', borderRadius: '1rem' }">…</wt-card>

<!-- ทั้งโซน เช่น ฝั่ง admin ใช้สีหลักอีกสี -->
<section wtTheme [tokens]="{ primary: '#e11d48' }">…</section>
```

### 6.8 Dark mode

ตั้งได้ 3 แบบ: `'none'` (ปล่อยแค่ค่า light), `'class'` (สลับด้วย `.wt-dark` บน `<html>`) และ `'media'` (ตาม `prefers-color-scheme`) ค่า dark ได้มาจากการคำนวณจาก light อัตโนมัติ และแก้ทีละ token ได้ใน Designer

### 6.9 Liquid Glass (หน้าตาหลักของ v3)

v3 มี preset ใหม่ชื่อชั่วคราวว่า **Glass** เป็นค่าเริ่มต้น: พื้นผิวโปร่งแสงแบบกระจก เบลอสิ่งที่อยู่ข้างหลัง มีขอบสะท้อนแสง และใช้ชุดสีที่สดกว่าเดิม (สีไล่เฉดได้)

**ใช้กระจกตรงไหน:** เฉพาะชั้นที่ลอยอยู่เหนือเนื้อหา ได้แก่ menubar/toolbar, dialog, toast, popover, panel ของ select/datepicker, แถบ tabs, segmented และปุ่ม variant `glass` ส่วนเนื้อหาหลัก (table, ช่องกรอก, ข้อความยาว) ยังเป็นพื้นทึบหรือโปร่งเล็กน้อย เพื่อให้อ่านง่ายและผ่าน contrast ซึ่งเป็นแนวเดียวกับ Liquid Glass ของ Apple ที่ใช้กระจกกับชั้น control/navigation

**token กลุ่ม glass (ต้องอยู่ใน schema ตั้งแต่ Phase 0 แม้ preset จะมาทีหลัง)**

| token | ตัวอย่างค่า |
|---|---|
| `material` | `'solid'` \| `'glass'` |
| `--wt-glass-bg` | `rgba(255,255,255,.55)` · dark `rgba(15,23,42,.45)` |
| `--wt-glass-blur` / `--wt-glass-saturate` | `20px` / `180%` |
| `--wt-glass-border` | `rgba(255,255,255,.6)` |
| `--wt-glass-highlight` | `inset 0 1px 0 rgba(255,255,255,.7)` (ขอบสะท้อนแสงด้านบน) |
| `--wt-glass-shadow` | `0 8px 32px rgba(15,23,42,.18)` |
| `--wt-primary-gradient` | `linear-gradient(135deg, #7c3aed, #06b6d4)` |
| `--wt-backdrop` | พื้นหลังแอปแบบ mesh gradient เพื่อให้กระจกมีอะไรให้เบลอ |

**สิ่งที่ library ต้องจัดการให้**
- ถ้าเบราว์เซอร์ไม่รองรับ `backdrop-filter` (ตรวจด้วย `@supports`) หรือผู้ใช้ขอลดความโปร่งใส (`prefers-reduced-transparency` ในเบราว์เซอร์ที่รองรับ) ให้ถอยเป็นพื้นทึบอัตโนมัติ และมีตัวเลือก `glass: false` ใน `provideWiraTheme` ส่วน Safari รุ่นเก่าต้องใส่ `-webkit-backdrop-filter` ด้วย ซึ่ง mixin จะใส่ให้
- blur ใช้ GPU หนักบนมือถือรุ่นเล็ก จึงใช้กับ element ขนาดไม่ใหญ่ และไม่ซ้อนกระจกหลายชั้น
- contrast บนกระจกขึ้นกับสิ่งที่อยู่ข้างหลัง ตัวตรวจ contrast ใน Designer จึงต้องวัดกับพื้นหลังกรณีแย่ที่สุด (ส่วนที่สว่างสุดและมืดสุดของ backdrop) และกำหนดความทึบขั้นต่ำของ `--wt-glass-bg`
- Glass เป็นแค่ token + CSS ชุดเดิม (class name ไม่เปลี่ยน) จึงเปิดใช้ใน v2 ได้ทางเทคนิค ข้อเสนอคือให้เป็นค่าเริ่มต้นของ v3, ให้ v2 เปิดเองได้ และไม่รวมใน v1 ที่เป็น maintenance line

---

## 7. Theme Designer (แบบ PrimeNG สมัยก่อน)

Designer เป็นแค่ **ตัวแก้ token** และ preview ใช้ `WtThemeService` ตัวเดียวกับ runtime **สิ่งที่เห็นใน preview จึงตรงกับไฟล์ที่ export 100%**

**หน้าจอ 3 ส่วน**
- **แถบบน:** เลือก preset, สลับ light/dark, **ปรับขนาดหน้าจอ preview** (Desktop / Tablet / Mobile / กำหนดความกว้างเอง + หมุนจอ เพื่อดู responsive ของ component), Undo/Redo, Import, Export, Share
- **ซ้าย (ตัวควบคุม):**
  1. Preset: Wira (เรียบแบบ Aura), Lanna (นุ่ม โค้งมนแบบ Lara), Siam (มี elevation และ ripple แบบ Material), แบบเหลี่ยมคมสไตล์ enterprise (ชื่อทั้งหมดยังเป็นชื่อชั่วคราว)
  2. สี: Primary (swatch แบบรูปที่ 3 + กรอก HEX แล้วสร้าง 50–950 ให้และแก้ได้ทีละเฉด), Surface, Semantic (success/info/warn/danger/help/contrast), text, border, focus ring, mask
  3. ตัวอักษร: ฟอนต์ไทยพร้อม preview (Kanit, Sarabun, Prompt, Noto Sans Thai, IBM Plex Sans Thai, Anuphan หรือกำหนดเอง), ขนาดพื้นฐาน, น้ำหนัก, line-height สำหรับภาษาไทย
  4. รูปทรง: radius scale, ความหนาเส้นขอบ
  5. ความหนาแน่น: compact / normal / comfortable (มีผลกับ padding, ความสูง input และความสูงแถวของ table)
  6. เอฟเฟกต์: เงา, ความเร็ว transition, ripple, รูปแบบ focus ring
  7. Dark mode: ค่าที่คำนวณให้อัตโนมัติ แก้ได้ทีละ token
  8. Components: ตัวแก้ token ราย component (ค้นหาได้ และมีจุดบอกว่าค่าไหนถูกแก้แล้ว)
- **กลาง (preview สด):** หน้า Dashboard (แบบรูปที่ 1), หน้าฟอร์ม (แบบฟอร์มรับสมัคร), Data table, Overlay (dialog / toast / confirm / alert) และ gallery รวมทุก component

**เครื่องมือเสริม:** ตรวจ contrast ตาม WCAG AA (เตือนเช่นสีตัวอักษรบน primary อ่านยาก), จำลองการมองเห็นของผู้ที่ตาบอดสี, แสดง diff ว่าแก้อะไรไปจาก preset และปุ่ม reset ทีละกลุ่ม

**Export (เนื้อหาเดียวกัน 4 รูปแบบ):**

| ไฟล์ | ใช้กับ |
|---|---|
| `wiratheme.theme.scss` | ทาง B (`@use … with`) |
| `wiratheme.theme.css` | ทาง A (ใส่ใน `angular.json`) |
| `wiratheme.preset.ts` / `wiratheme.overrides.ts` | ทาง C |
| `wiratheme.theme.json` | เก็บไว้ หรือเปิดใน Designer อีกครั้ง |

ทุกไฟล์ฝัง config ไว้ใน comment (`/* wiratheme-config: … */`) จึง **import ไฟล์ไหนกลับเข้า Designer ก็ได้โดยข้อมูลไม่หาย** นอกจากนี้มี Share URL (เก็บ state แบบบีบอัดไว้ใน hash), autosave ลง localStorage และปุ่ม "copy วิธีติดตั้ง" ตาม Angular รุ่นที่เลือก

**palette ต้องตรงกันทุกที่:** `palette()` ฝั่ง TS (`@wiratheme/core`) กับ `wt.palette()` ฝั่ง Sass ใช้สูตรผสมสีเดียวกัน และมี unit test เทียบผลลัพธ์ทั้งสองฝั่งด้วยชุดสีทดสอบ

---

## 8. การใช้งาน: NgModule และ Standalone

template เหมือนกันทุกรุ่นและทุกแบบ ที่ต่างกันมีแค่การ import

```ts
// NgModule (ใช้ได้ทั้ง v1, v2, v3)
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, WtButtonModule, WtTableModule],
  providers: [
    provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist' }),
  ],
  // หรือใช้ imports: [WiraThemeModule.forRoot({ … })] ถ้าชอบสไตล์ forRoot
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```ts
// Standalone
@Component({
  selector: 'app-student-list',
  standalone: true,                  // ต้องใส่ใน Angular 15–18 ส่วน 19+ เป็นค่าเริ่มต้นอยู่แล้ว
  imports: [WtButton, WtTable, WtSelect],
  templateUrl: './student-list.component.html',
})
export class StudentListComponent {}
```

```html
<wt-table [value]="students" [loading]="loading" [paginator]="true" [rows]="20"
          exportable exportFileName="รายชื่อนักเรียน">
  …
</wt-table>

<!-- save() คืน Promise/Observable ปุ่มจะแสดง loading และกันการกดซ้ำให้เอง -->
<wt-button label="บันทึก" icon="pi pi-check" [action]="save"></wt-button>

<!-- แสดงเป็น "12 มีนาคม 2551" แต่ค่าใน model ยังเป็น Date (ค.ศ.) ปกติ -->
<wt-datepicker [(ngModel)]="birthDate" calendar="buddhist" dateFormat="d MMMM yyyy"></wt-datepicker>
```

`provideWiraTheme()` ใช้ได้ทั้งใน `providers` ของ NgModule และ `app.config.ts` ตั้งแต่ Angular 15 ส่วน `WiraThemeModule.forRoot()` เป็นทางเลือกสำหรับคนที่คุ้นกับแบบ NgModule

---

## 9. รายการ Component

### P1 — MVP (ครอบคลุม component เกือบทั้งหมดที่ 3 โปรเจคใช้อยู่)

| กลุ่ม | Component | ลูกเล่นที่เพิ่มจาก PrimeNG |
|---|---|---|
| Button | Button, SplitButton | `[action]` จัดการ loading ให้อัตโนมัติ, `confirm="…"` ถามยืนยันในตัว |
| Data | **Table**, Paginator | export Excel/CSV, เลือก/ซ่อน/ลากคอลัมน์และจำค่าไว้ (`stateKey`), แสดงเป็นการ์ดบนมือถือ, แถว skeleton ขณะโหลด, empty state ในตัว, server-side ส่ง event เดียว `(query)` = {page, size, sort, filters}, action bar ตอนเลือกแถว, inline edit |
| Form | InputText, Textarea, InputNumber, InputMask, Password, Checkbox, RadioButton, ToggleSwitch, FloatLabel / IftaLabel | ปุ่มล้างค่า, นับตัวอักษร, prefix/suffix, จัดรูปแบบเงินบาท |
| Form | **Select**, **MultiSelect** | ค้นหาจาก server พร้อม debounce (`[search]` คืน Observable/Promise), virtual scroll, จัดกลุ่ม, ตัวเลือก "เพิ่มใหม่" |
| Form | **DatePicker** | **พ.ศ. ในตัว** (ทั้งพิมพ์และแสดง), locale ไทยเป็นค่าเริ่มต้น, ช่วงวันสำเร็จรูป ("7 วันล่าสุด", "เดือนนี้"), โหมดปีการศึกษา/ภาคเรียน |
| Panel | **Card**, Fieldset, Accordion, Tabs, Divider | Card แบบ outlined / elevated / glass, slot สำหรับ action ที่ header, สถานะ loading |
| Overlay | **Dialog**, ConfirmDialog, Popover, Tooltip | `WtDialogService.open(Component, { data })` คืน Promise ของผลลัพธ์, ซ้อนหลายชั้นได้, เต็มจอบนมือถือ |
| Messages | Toast, Message | Toast มีปุ่ม action (เช่น "เลิกทำ"), แถบเวลา, หยุดนับเมื่อเอาเมาส์ชี้, รวมข้อความซ้ำ |
| Menu | Menu, Menubar | — |
| Misc | Skeleton, ProgressBar, ProgressSpinner, Tag, Badge, Avatar | — |

### W — ของเฉพาะ WiraTheme (มาจากสิ่งที่โปรเจคเราเขียนเองซ้ำ ๆ)

| Component / Service | แทนอะไร |
|---|---|
| `WtAlertService` — `await alert.confirm({ title: 'ลบข้อมูล?', severity: 'danger' })`, `alert.loading()`, `alert.success()` | `Swal.fire` ราว 219 จุด ได้ธีมเดียวกับระบบ |
| `wt-loading` (block UI / overlay) | `dialog-loading` |
| `wt-empty-state` | `empty-state`, `news-empty` |
| `wt-file-upload` แบบลากวาง + preview รูป/PDF + crop รูป | `file-upload` และ `ngx-image-cropper` |
| `wt-thai-id-input` จัดรูปแบบ 1-2345-67890-12-3 และตรวจ checksum | หน้า `th-identify-id` และฟอร์มรับสมัคร |
| `wt-thai-address` จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์ (โหลดข้อมูลแบบ lazy) | ฟอร์มที่อยู่ |
| `wt-academic-term-picker` ปีการศึกษา/ภาคเรียน | ระบบโรงเรียน |
| `wt-stat-card`, `wt-page-header` | หน้า dashboard และหัวหน้าเพจ |
| pipe: `wtDate` (พ.ศ.), `wtBahtText` (หนึ่งร้อยบาทถ้วน), `wtThaiPhone` | โค้ด +543 และ format ที่กระจายอยู่หลายไฟล์ |

### P2 — รอบถัดไป

Chart (wrapper ครอบ Chart.js), Image (preview), Timeline, AutoComplete, Stepper, Drawer, Breadcrumb, Tree, TreeSelect, TreeTable, Listbox, Slider, Rating, InputOtp, Knob, ColorPicker, Chip, Carousel, Galleria, DataView, Splitter, ScrollPanel, Inplace, OrderList, PickList, Editor (adapter ของ Quill/TinyMCE)

---

## 10. เว็บแนะนำ (แบบ primeng.org)

```
/                       หน้าแรก: hero + dashboard ที่ใช้งานได้จริง (แบบรูปที่ 1) + จุดเด่น + Get Started
/installation           ng add / ติดตั้งเอง (แท็บ CSS · SCSS · TS และ NgModule · Standalone)
/configuration          ตัวเลือกของ provideWiraTheme
/theming                token, CSS/SCSS/TS, @layer, dark mode, ธีมเฉพาะจุด
/designer               Theme Designer
/locale                 ภาษาไทยและ พ.ศ.
/migration/primeng      ตารางเทียบ p-xxx → wt-xxx และ input ที่ต่างกัน
/upgrade                v1 → v2 → v3
/components/<name>      แท็บ FEATURES · API · THEMING (แบบรูปที่ 2) + สารบัญด้านขวา
/changelog  /roadmap
```

- **Header:** ค้นหา (Ctrl+K), ลิงก์ repo, สลับ dark, configurator แบบรูปที่ 3 (Primary / Surface / Preset / Ripple / RTL + ปุ่ม "เปิด Designer") และ dropdown เลือก **v1 · Angular 15–17 / v2 · 18–20 / v3 · 21+** ซึ่งสลับรุ่นในเว็บเดียวกัน (ข้อ 10.1)
- **FEATURES:** demo ที่ใช้งานได้จริง กดดูโค้ดได้ทั้ง HTML / TS และสลับ NgModule ↔ Standalone ได้ พร้อมปุ่ม "เปิดใน StackBlitz" ที่ใช้ template ของรุ่นนั้น
- **API:** สร้างอัตโนมัติจาก source (script อ่าน input / output / template / method ด้วย TS compiler API) ไม่ต้องเขียนเอง
- **THEMING:** ตาราง token ของ component นั้น (สร้างจาก token schema ชุดเดียวกับที่ Designer ใช้) + ปุ่ม "แก้ใน Designer"
### 10.1 เว็บเดียว สลับรุ่นด้วย dropdown

เว็บแนะนำเป็นแอป **Angular 21 ตัวเดียวแบบ NgModule** (`AppModule` + `bootstrapModule`) ไม่แยก subdomain ตามรุ่น แต่ละรุ่นเป็น feature module ที่โหลดแบบ lazy ด้วย `loadChildren`

```ts
// apps/docs/src/app/app-routing.module.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'designer', loadChildren: () => import('./designer/designer.module').then((m) => m.DesignerModule) },
  { path: 'v1', loadChildren: () => import('./versions/v1/docs-v1.module').then((m) => m.DocsV1Module) },
  { path: 'v2', loadChildren: () => import('./versions/v2/docs-v2.module').then((m) => m.DocsV2Module) },
  { path: 'v3', loadChildren: () => import('./versions/v3/docs-v3.module').then((m) => m.DocsV3Module) },
  { path: '**', redirectTo: 'v3' },
];
```

- **ติดตั้งทั้ง 3 รุ่นในแอปเดียว** ด้วยชื่อแฝง (npm alias / pnpm workspace): `wiratheme-v1` → wiratheme@1, `wiratheme-v2` → wiratheme@2, `wiratheme` → wiratheme@3 แล้วให้ `DocsV1Module` import จาก `wiratheme-v1/button` เป็นต้น เพราะโหลดแบบ lazy โค้ดของ v1 จึงถูกดาวน์โหลดเฉพาะตอนเข้า `/v1`
- **ทำไมรันได้:** v1 และ v2 เป็น library แบบ partial compilation ที่ linker ของ Angular 21 แปลงให้ได้ (หลักเดียวกับข้อ 3 ที่ว่า library ใช้กับ Angular รุ่นที่ใหม่กว่าได้) แอปหลักเปิด zone.js ไว้ (`provideZoneChangeDetection`) เพื่อให้ v1 ที่อิง zone ทำงานถูก ส่วน peerDependencies ของ v1/v2 ที่ไม่ครอบคลุม Angular 21 ให้ยกเว้นเฉพาะแอป docs ผ่าน `pnpm.peerDependencyRules`
- **dropdown เปลี่ยนรุ่น:** เปลี่ยน prefix ของ URL แต่คงหน้าเดิมไว้ เช่น `/v3/components/button` → `/v1/components/button` ถ้ารุ่นนั้นไม่มี component นี้ (เช่น ของที่มีแค่ใน v3) ให้พาไปหน้ารายการ component ของรุ่นนั้นพร้อมข้อความบอก และจำรุ่นที่เลือกไว้ใน localStorage
- **ธีมไม่ปนกัน:** token ของแต่ละรุ่นผูกกับ element ที่ครอบ route นั้น (`<div data-wt-version="v1">`) แทน `:root` และ Angular ลบ style ของ component ที่ถูกทำลายแล้วออกให้เอง สลับรุ่นแล้วจึงไม่มี CSS ของรุ่นก่อนค้างอยู่
- **โค้ดที่โชว์คือโค้ดที่รันจริง:** demo ของ v1 เขียนแบบ classic (`@Input`, `*ngIf`) ซึ่ง Angular 21 ยัง compile ได้ ส่วน v2/v3 เขียนแบบ signal แล้วดึง source ของ demo มาแสดงด้วย text loader ของ Angular CLI
- **ความเสี่ยงที่ต้องพิสูจน์ตั้งแต่ Phase 0:** v1 ที่ compile ด้วย Angular 15 อาจเรียก API ที่ Angular 21 เอาออกไปแล้ว ถ้าเจอต้องเลี่ยงใน source ของ v1 (ใช้เฉพาะ API ที่มีทั้งใน 15 และ 21) งานนี้จึงอยู่ใน Phase 0 (ข้อ 12.1 ลำดับที่ 12)

---

## 11. การทดสอบและคุณภาพ

- **E2E ชุดเดียว × 3 รุ่น:** Playwright รัน spec เดียวกันกับ playground-v1/v2/v3
- **Visual regression:** screenshot ทุก demo × 3 รุ่น × light/dark ต้องไม่ต่างกัน เพื่อรับประกันว่าทุกรุ่นหน้าตาเหมือนกัน
- **API parity:** script ดึงรายชื่อ input/output ของทั้ง 3 รุ่นมาเทียบกัน ถ้าต่างกันนอกรายการที่อนุญาตไว้ให้ CI ไม่ผ่าน
- **Accessibility:** ใช้ axe-core ใน Playwright และทดสอบการใช้งานด้วยคีย์บอร์ดทุก component
- **Palette parity:** เทียบผลของ TS กับ Sass (ดูข้อ 7)
- **CI:** build และ test ทุกอย่างบน Node 24 LTS ส่วนอีก job ติดตั้ง tarball ลงแอปทดสอบบน Node ต่ำสุดที่รับปากไว้ (v1 บน Node 18, v2 บน Node 18.19 กับ Angular 18, v3 บน Node 20.19) ทดสอบกับ Angular `next` ล่วงหน้า และ release ด้วย changesets ไปยัง dist-tag ทั้ง 3 ตัว

---

## 12. ลำดับงาน

| Phase | งาน | จบเมื่อ |
|---|---|---|
| 0 — ฐาน | ท่อทั้งเส้นด้วย component ตัวเดียว (`wt-button`): monorepo, `@wiratheme/core`, SCSS/CSS/TS theme, `provideWiraTheme`, `ng add`, playground 3 รุ่น, CI (รายละเอียดข้อ 12.1) | ดูเกณฑ์ในข้อ 12.1 |
| 1 — MVP | component P1 (เริ่มใน `angular-signal` → v2/v3 → v1) | **นำร่องที่ Wutthiphon Homepage** (ใช้ไม่กี่ component ความเสี่ยงต่ำ) แล้วต่อด้วย SP Admission V2 โดยใช้คู่กับ PrimeNG และย้ายทีละหน้า |
| 2 — เว็บ + Designer | เว็บแนะนำ, Theme Designer ตัวจริงเป็น Angular (ต่อยอดจากต้นแบบ + ปรับขนาดหน้าจอ preview ได้ + export token ไป Figma), configurator, preset Glass ของ v3, เริ่ม Figma UI Kit | ทำธีมของ Strisrinan (`#00a86b` + Kanit) ใน Designer แล้ว export ไปใช้ได้จริง |
| 3 — ของเฉพาะ WiraTheme | กลุ่ม W (Alert, Thai inputs, Table export, …) + P2 บางส่วน | แอปเราไม่ต้องพึ่ง sweetalert2 / buddhist-datepicker / xlsx โดยตรงแล้ว |
| 4 — เครื่องมือย้าย | schematic `ng g wiratheme:from-primeng` (เปลี่ยน `p-button` → `wt-button` ฯลฯ ใน component ที่ API ตรงกัน) | ย้าย Strisrinan_Apps (โปรเจคใหญ่สุด, v1) ได้ |

### 12.1 Phase 0 แบบละเอียด

**เป้าหมาย:** ทำท่อให้ครบทั้งเส้นด้วย component ตัวเดียว (`wt-button`) ก่อนจะเริ่มทำ component จำนวนมาก ถ้าท่อนี้ผ่านทั้ง 3 รุ่น งานที่เหลือก็คือการเพิ่ม component ตามแบบเดิม

| ลำดับ | งาน | ได้อะไร |
|---|---|---|
| 1 | ตั้ง repo: pnpm workspace ใน `WiraTheme/`, git, โครงโฟลเดอร์ตามข้อ 4, ล็อก Node 24 LTS ตัวเดียว (`.nvmrc` + `engines`), prettier/editorconfig | repo ที่ build ได้ทุก package |
| 2 | `@wiratheme/core`: ย้าย `engine.js` + `exporters.js` จากต้นแบบมาเป็น TypeScript ที่มี type ครบ ได้แก่ token schema (รวมกลุ่ม glass), `palette()`, presets, `computeTokens()`, exporters SCSS/CSS/TS/JSON และ `parseImport()` | ตัวคำนวณ token ตัวเดียวที่ runtime, schematics และ Designer ใช้ร่วมกัน |
| 3 | Thai utils ใน core: locale `th`/`en`, ปฏิทิน พ.ศ. (แปลง/แสดง/อ่านค่า), ตรวจเลขบัตรประชาชน พร้อม unit test | ของที่ DatePicker และฟอร์มใน Phase 1 ต้องใช้ |
| 4 | SCSS `wiratheme/theme`: `_index.scss` (`@use … with`) ที่ปล่อย `@layer` + `:root` vars, `_api.scss` (`token()`, `dark`, `media`, `glass`) และ `palette()` ฝั่ง Sass ที่ใช้สูตรเดียวกับ TS (มี test เทียบผล) | import ธีมผ่าน SCSS ได้ |
| 5 | script สร้าง CSS สำเร็จรูป: preset × สีหลัก → `themes/<preset>/<color>.css` | ทาง CSS สำหรับคนที่ไม่ใช้ SCSS |
| 6 | `wiratheme/config` ในทั้ง 3 รุ่น: `provideWiraTheme()`, `WiraThemeModule.forRoot()`, `defineOverrides`, `definePreset`, `WtThemeService`, ตัวใส่ style ที่คุมลำดับ `@layer`, คำเตือนใน dev mode, ใช้กับ SSR ได้ | override ธีมด้วย TS ได้ทั้ง NgModule และ standalone |
| 7 | `wt-button` ครบทั้งท่อ: เขียนใน `angular-signal` → sync เข้า v2/v3 → พอร์ตเป็น v1 → build ด้วย ng-packagr ของ Angular 15 / 18 / 21 ได้ entry point `wiratheme/button` | พิสูจน์ว่าการแชร์โค้ด 3 รุ่นใช้ได้จริง |
| 8 | schematic `ng add wiratheme`: ถามหรือตรวจเอง (ภาษาสไตล์, NgModule/standalone, รุ่น Angular, มี PrimeNG ไหม, ฟอนต์) แล้วสร้างไฟล์ธีม + `overrides.ts` + ใส่ provider | ติดตั้งด้วยคำสั่งเดียวแบบ PrimeNG |
| 9 | playground 3 ตัว: v1 = Angular 15 NgModule + SCSS (แบบ Strisrinan), v2 = Angular 19 NgModule (แบบ SP Admission), v3 = Angular 21 standalone + zoneless โดยติดตั้งด้วย `ng add` จาก tarball ในเครื่อง | แอปทดสอบที่โครงเหมือนของจริง |
| 10 | Playwright: spec ชุดเดียวของ `wt-button` รันกับ 3 playground × light/dark พร้อมภาพ baseline | ตรวจว่าทั้ง 3 รุ่นหน้าตาเหมือนกัน |
| 11 | CI: build + test ทุก package บน Node 24 และมี job ติดตั้งจริงบน Node ต่ำสุดของแต่ละรุ่น (18 / 18.19 / 20.19) | กันของพังก่อน merge และยืนยันว่ารองรับ Node 18 จริง |
| 11b | ล็อกรุ่น 3 ชั้น (peerDependencies, schematic, ตรวจตอนเริ่มแอป) + test ว่าติดตั้ง v1 ลง Angular 18 แล้วไม่ผ่าน | ใช้ข้ามช่วงไม่ได้ |
| 12 | โครงเว็บ docs: แอป Angular 21 แบบ NgModule มี dropdown เลือกรุ่น และ `loadChildren` 3 module ที่แต่ละตัวโชว์ `wt-button` จาก wiratheme v1 / v2 / v3 | พิสูจน์ว่า v1/v2 รันในแอป Angular 21 ได้จริง ก่อนลงแรงทำเว็บใน Phase 2 |

**จบ Phase 0 เมื่อผ่านทุกข้อ**
- รัน `ng add wiratheme` บนแอปใหม่ Angular 15, 19 และ 21 แล้วได้ `<wt-button>` ที่ใช้ธีมได้ทั้ง 3 ทาง (SCSS, CSS, TS)
- override ด้วย TS ชนะธีมจาก SCSS โดยไม่ใช้ `!important` และ CSS ของแอปชนะทั้งสองอย่าง
- ไฟล์ที่ export จาก Designer ต้นแบบใช้กับ playground ทั้ง 3 ตัวได้โดยไม่ต้องแก้
- ภาพ `wt-button` ของ v1/v2/v3 ตรงกัน (pixel diff ต่ำกว่าเกณฑ์)
- `ng add --dry-run` บนสำเนาของ Strisrinan_Apps และ SP Admission V2 ให้ผลถูกต้อง โดยไม่แตะ repo จริง
- เว็บ docs ต้นแบบสลับ v1 → v2 → v3 ผ่าน dropdown ได้ ปุ่มของทุกรุ่นทำงาน และไม่มี error ใน console
- CI ผ่าน ทั้ง job บน Node 24 และ job บน Node 18

**ไม่อยู่ใน Phase 0:** component อื่นนอกจาก Button, เว็บแนะนำ, Designer ตัวจริง (ใช้ต้นแบบไปก่อน), preset Glass แบบเต็ม (แต่ token กลุ่ม glass ต้องอยู่ใน schema แล้ว) และการ publish ขึ้น npm จริง (ใช้ tarball ในเครื่องจนกว่าจะตัดสินใจข้อ 13.1)

**ต้องตัดสินใจก่อนเริ่ม:** repo จะอยู่บน GitHub หรือ GitLab เพราะมีผลกับ CI ในลำดับที่ 11 ส่วนข้ออื่นในข้อ 13 รอได้ถึง Phase 1 (ตัดสินแล้ว: GitHub + GitHub Actions)

### 12.2 ผล Phase 0 (24 ต.ค. 2569)

ผ่านทุกเกณฑ์ที่ทดสอบในเครื่องได้ เหลือแค่ CI บน GitHub ที่จะรู้ผลหลัง push ครั้งแรก

| เกณฑ์ | ผล |
|---|---|
| `ng add` บน Angular 15 / 19 / 21 ได้ `wt-button` ที่ใช้ธีมทั้ง SCSS, CSS และ TS | ผ่าน (playground v1 = SCSS + NgModule, v2 = SCSS + NgModule, v3 = CSS + standalone/zoneless; TS override และ TS preset ทดสอบใน Playwright) |
| TS override ชนะธีมจากไฟล์โดยไม่ใช้ `!important` และ CSS ของแอปชนะทั้งหมด | ผ่าน |
| ไฟล์ที่ export จาก Designer ต้นแบบใช้ได้ทันที | ผ่าน (import กลับได้ทุกรูปแบบ, SCSS compile บน Sass 1.58 และรุ่นปัจจุบันโดยไม่มีคำเตือน) |
| หน้าตา v1 / v2 / v3 ตรงกัน | ผ่าน (screenshot light/dark ของ v1, v2 ต้องตรงกับ v3) |
| `ng add --dry-run` บน Strisrinan_Apps และ SP Admission V2 | ผ่าน (`tools/dry-run-ng-add.mjs` รันในหน่วยความจำ ไม่แตะ repo จริง) |
| เว็บ docs สลับ v1 → v2 → v3 ได้ ไม่มี error | ผ่าน (v1 ที่ build ด้วย Angular 15 และ v2 ที่ build ด้วย 18 รันบน Angular 21 ได้จริง) |
| ล็อกรุ่น 3 ชั้น | ผ่าน (npm ERESOLVE, schematic ปฏิเสธ, แอป throw ตอนเริ่มเมื่อบังคับติดตั้ง) |
| CI | เขียนแล้ว รอ push |

**สิ่งที่เจอระหว่างทำ (กันไว้แล้วในโค้ด)**
- npm 10.2.5 (ที่ติดตั้งในเครื่องนี้) มีบั๊ก `Cannot read properties of null (reading 'edgesOut')` เวลาติดตั้งโปรเจค Angular 21 แก้ได้ด้วยการอัปเดต npm
- Angular CLI 21 ใช้ `ng add` กับ tarball ในเครื่อง (`file:`) ไม่ได้ ผู้ใช้จริงติดตั้งจาก registry จึงไม่กระทบ ส่วน CI/สคริปต์ใช้วิธี `npm install <tgz>` แล้ว `ng add wiratheme`
- Angular CLI 15 ส่ง path ที่มีช่องว่างให้ npm แบบไม่ใส่เครื่องหมายคำพูด สคริปต์จึงใช้ path แบบ relative
- ng-packagr 21 ใส่ `"type": "module"` ให้ทั้งแพ็กเกจ schematics จึงต้องเป็นไฟล์ `.cjs`
- `angular.json` ของโปรเจคจริงมี trailing comma (Strisrinan) schematic จึงอ่านแบบเดียวกับ Angular CLI
- Angular 22 ออกแล้ว v3 ยังล็อกไว้ที่ 21 จนกว่าจะทดสอบบน 22 ผ่าน (`tools/versions.mjs`)

### 12.3 Phase 1 ชุดที่ 1: ฟอร์มพื้นฐาน (24 ต.ค. 2569)

Card, InputText, Textarea, Checkbox, RadioButton และ ToggleSwitch เสร็จครบทั้ง v1 / v2 / v3

- **ฟอร์ม:** control ทุกตัวเป็น `ControlValueAccessor` จึงใช้ได้ทั้ง `ngModel` และ Reactive Forms ส่วน InputText/Textarea เป็น directive บน `<input>`/`<textarea>` จริง จึงใช้ value accessor เดิมของ Angular
- **Radio ใน Reactive Forms:** radio หลายตัวใช้ FormControl เดียวกัน แต่ FormControl เขียนค่ากลับไปแค่ตัวที่เปลี่ยน จึงมี registry (`ɵWtRadioRegistry`) คอยบอกตัวอื่นในกลุ่มให้เลิกเลือก แบบเดียวกับที่ Angular ทำกับ radio ปกติ
- **CSS ของ directive:** directive ไม่มี template ไว้แนบ style จึงโหลด CSS ผ่าน `ɵWtStyleLoader` (sync script สร้าง `<name>.styles.ts` จาก `packages/styles/<name>.css`)
- **ทดสอบแล้ว:** Playwright 33 test รวมการเทียบหน้าตา gallery ฟอร์มของทั้ง 3 รุ่น (light/dark), ngModel, Reactive Forms (validation, `patchValue`, กลุ่ม radio, `disable()`) และหน้าฟอร์มในเว็บ docs ที่รัน v1/v2 บน Angular 21
- **ที่เรียนรู้:** แอป zoneless (v3) render รอบถัดไป test ที่อ่านค่าหลังคลิกต้องรอ (`expect.poll`)

**เรื่องที่ต้องตัดสินใจ:** สีตัวอักษรบนปุ่มหลัก ระบบเลือกสีที่ contrast สูงกว่าโดยอัตโนมัติ บน `#00a86b` จึงได้ตัวอักษรสีเข้ม (ตัวอักษรขาวได้ contrast แค่ราว 3:1 ไม่ผ่าน WCAG AA) ซึ่งต่างจาก Strisrinan เดิมที่ใช้ตัวอักษรขาว ถ้าต้องการขาวตามแบรนด์ ตอนนี้ทำได้ด้วยการใส่ `--wt-primary-contrast: #ffffff;` ใน `:root` ของ CSS แอป (ชนะทุก layer) หรือเลือกสีหลักที่เข้มขึ้น ถ้าจะใช้บ่อยควรเพิ่มเป็นตัวเลือกใน Designer/overrides ใน Phase 1

---

## 13. คำถามที่ต้องตัดสินใจ

1. **License (ตัดสินแล้ว):** MIT ใช้ฟรีทุกรุ่นแบบ PrimeNG ยุคเดิม ไม่มี license ขายและไม่มีรุ่น LTS แบบเสียเงิน (ไฟล์ `LICENSE` ที่ root ถูก copy เข้าทุกแพ็กเกจ) ส่วนช่องทาง publish ยังเหลือเลือกระหว่าง npm สาธารณะ (`wiratheme` ยังว่าง) ซึ่งเข้ากับ MIT ที่สุด หรือ private registry
8. **Figma UI Kit (วางแผนแล้ว):** มี Figma kit คู่กับโค้ด โดยให้ Theme Designer export token เป็น Figma Variables / W3C Design Tokens JSON เพิ่มจาก SCSS/CSS/TS/JSON เดิม เพื่อให้ Figma กับโค้ดใช้ token ชุดเดียวกัน และ component ใน kit ตั้งชื่อ variant ตาม input ของ component (`severity`, `variant`, `size`) ให้ designer กับ dev คุยภาษาเดียวกัน ต้องตัดสินใจว่าจะเริ่มใน Phase 2 (พร้อม Designer ตัวจริง) หรือ Phase 3
2. **โดเมนของเว็บแนะนำ** เช่น `wiratheme.wirabyte.com` และ host ที่ไหน (มีโปรเจค NodeJS Web Hosting อยู่แล้ว หรือใช้ Cloudflare Pages)
3. **PrimeFlex:** ยังใช้ต่อไป (แนะนำแบบนี้ในช่วงแรก) หรือจะทำ utility ของ WiraTheme ที่ใช้แทนได้ในภายหลัง
4. **Icon:** พึ่ง primeicons/Font Awesome ต่อไป หรือทำ `@wiratheme/icons` (ตอนนี้ icon ที่ใช้ภายใน component เป็น SVG inline จึงไม่บังคับ dependency)
5. **ชื่อและเอกลักษณ์ของ preset** (Wira / Lanna / Siam / …) และจะใช้ Kanit เป็นฟอนต์เริ่มต้นไหม
6. **ที่เก็บธีมใน Designer:** เก็บในเครื่องอย่างเดียว (localStorage + ไฟล์) หรือผูกบัญชีผู้ใช้เพื่อเก็บบน server
7. **API naming:** ยืนยันว่าจะใช้ชื่อแบบ PrimeNG (`(onClick)`, `optionLabel`) เพื่อให้ย้ายง่าย แม้จะไม่ตรงกับ Angular style guide (ที่ไม่ให้ขึ้นต้น output ด้วย `on`)
