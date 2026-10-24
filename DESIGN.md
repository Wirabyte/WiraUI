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
| ใช้ `theme.css` ขนาด 154 KB ที่ export จาก Theme Designer รุ่นเก่า (Lara light teal ของ PrimeNG, primary `#00a86b`, ฟอนต์ Kanit) | Strisrinan `src/assets/css/theme.css` | ทำ Designer ที่ export ไฟล์ได้ ซึ่งตรงกับวิธีที่ทีมใช้อยู่แล้ว |
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
? Preset                         (Wira)                › Wira · Lanna · Siam · Phet-like
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
  "node_modules/wiratheme/themes/sila-light-teal/theme.css",  // v1: แทน primeng/resources/themes/lara-light-teal/… (ตารางเทียบชื่อใน §12.8)
  // "node_modules/wiratheme/themes/mali/emerald.css",        // v2/v3: <preset>/theme.css หรือ <preset>/<สี>.css
  "src/styles.css"
]
```

แต่ละรุ่นมีไฟล์สำเร็จรูปเฉพาะธีมของรุ่นตัวเอง (ดู 6.10)

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

### 6.10 หน้าตาแยกตามรุ่น (ย้ายจาก PrimeNG แล้วไม่พัง)

แต่ละรุ่นหน้าตาเหมือน PrimeNG ยุคเดียวกัน ทั้งขนาด ระยะ และสี เพื่อให้แอปเดิม (TP-APPS, SS-APPS, …) ย้ายมาแล้ว layout ไม่ขยับ ส่วนธีมใหม่ของ WiraTheme เองเริ่มที่ v3

| รุ่น | family (หน้าตา) | preset | ธีมสำเร็จรูป | ค่าเริ่มต้น |
|---|---|---|---|---|
| v1 | PrimeNG 15–17 | `sila-classic`, `arun`, `sayan`, `ratri`, `material-classic` | 25 ธีม (เทียบกับชื่อเดิมใน §12.8): `sila-light-*`, `sila-dark-*`, `arun-*`, `sayan-*`, `ratri-*`, `md-light-*`, `md-dark-*` และ `sila-light-wira` (สีเขียวที่แอป Wirabyte ส่วนใหญ่ใช้) | `sila-light-teal` |
| v2 | PrimeNG 18–20 | `mali`, `sila`, `material`, `phet` | `<preset>/theme.css` + 18 สี | `mali` |
| v3 | PrimeNG 21 + ของ WiraTheme | v2 + `wira`, `lanna`, `siam`, `nakhon`, `glass` | เหมือน v2 | `mali` |

- **ทำงานอย่างไร:** CSS ของ component มีชุดเดียวใช้ทุกรุ่น ส่วนหน้าตามาจาก token ของ family (`packages/core/src/families.ts` ตัวเลขจากธีม MIT ของ PrimeNG เช่น ปุ่ม Sila 15 padding `.75rem 1.25rem` ตัวหนา 700, ปุ่ม Mali `.5rem .75rem` น้ำหนัก 500) ทุก family ต่อยอดจาก Mali จึงมี token ชุดเดียวกันครบ (มี test ตรวจว่า CSS ทุกไฟล์ใช้แต่ token ที่ทุกธีมประกาศ)
- **`VERSION_CATALOG`** ใน core บอกว่ารุ่นไหนมี preset/ธีมอะไร ใช้ร่วมกันโดย `ng add` (ถามเฉพาะธีมของรุ่นนั้น), ไฟล์ CSS สำเร็จรูป, SCSS (`@use 'wiratheme/theme'` ไม่ใส่อะไรได้ค่าเริ่มต้นของรุ่น) และเว็บ docs
- **ธีมมืดล้วน** (`scheme: 'dark'` เช่น sayan, ratri, sila-dark) ใส่ค่ามืดเป็นค่าเดียว ไม่มี block `.wt-dark` เหมือน PrimeNG 15 ที่สลับธีมด้วยการเปลี่ยนไฟล์ ส่วน overrides จาก TS อ่าน `--wt-scheme` จากไฟล์ธีมเองจึงทับถูกที่
- **ชื่อ class ของ PrimeNG:** DOM มี class `p-*` ของยุคนั้นคู่กับ `wt-*` เช่น v1 ปุ่ม warn มี `p-button-warning` และ checkbox ที่เลือกมี `.p-checkbox-box.p-highlight`, switch เป็น `p-inputswitch` ส่วน v2/v3 ใช้ `p-button-warn`, `p-checkbox-checked`, `p-toggleswitch` CSS ของแอปที่เขียนทับ `.p-button`, `.p-card-body`, `.p-highlight` อยู่แล้วจึงยังทำงาน (CSS ของแอปไม่อยู่ใน layer จึงชนะ) class ของ checkbox/radio/switch อยู่บน wrapper รอบกล่อง ไม่ใช่บน `<label>` เพราะ PrimeNG กำหนดขนาด `.p-checkbox` ไว้ตายตัว ถ้าแอปยังโหลด CSS ของ PrimeNG ระหว่างย้ายจะไม่บีบข้อความ label
- **ตัวแปร CSS ของ PrimeNG:** ไฟล์ธีม v1 สร้าง `--primary-color`, `--surface-ground`, `--surface-border`, `--text-color`, `--green-500`, … ส่วน v2/v3 สร้าง `--p-primary-color`, `--p-surface-0…950`, `--p-content-border-radius`, `--p-<สี>-<เฉด>`, … (`compat.ts`) โดยอ้างกลับไปที่ `--wt-*` จึงเปลี่ยนตามธีม และค่า component บางตัวอ่านค่าที่แอปตั้งแบบ PrimeNG ก่อน เช่น `--p-card-body-gap: 0` ของ SP Admission ยังได้ผล
- **สีตัวอักษรบนปุ่มหลัก:** family แบบ PrimeNG ใช้ตัวอักษรขาวเสมอเหมือนต้นฉบับ (เช่นบน `#00a86b` ของ Strisrinan) ส่วน family Wira เลือกสีที่อ่านง่ายกว่าอัตโนมัติ (`*-contrast-auto`) และตั้งเองได้ด้วย `primaryContrast` (Designer, SCSS `$primary-contrast`, TS `semantic.primaryContrast`) ธีมสีส้มของ Arun/Sayan/Ratri ใช้ตัวอักษรเข้มแบบ PrimeNG
- **ตัวเลือกแบบ PrimeNG 18+:** `provideWiraTheme({ darkModeSelector: '.my-dark' | 'system' | 'none' })` ใช้ชื่อเดียวกับ PrimeNG แอปที่ตั้ง `.non-dark-selector` (ไม่มีวันเป็นมืด) ใช้ได้เลย
- **โหมดมืดแบบนวล:** ทุก family ใช้ชุดสีมืดเดียวกัน (`SOFT_DARK` ใน `families.ts`) ที่ยกพื้นขึ้นจากของ PrimeNG หนึ่งขั้น (พื้นหน้าระหว่าง surface 900 กับ 800, การ์ด 800) และใช้ตัวอักษร surface 200 แทนสีขาว contrast จึงเหลือราว 11:1 แทน 20:1 ยังผ่าน WCAG AAA
- **ขนาดตัวอักษรเป็น rem** และระยะทั้งหมดคูณ `--wt-density` แอปที่ตั้ง `html { font-size: 14px }` แบบ PrimeNG จึงย่อทั้งชุดเหมือนเดิม

### 6.11 Utility class ในตัว (`wiratheme/utils`)

แทน utility library ที่แอปเดิมต้องติดตั้งแยก (ในแอปเราใช้หนักมาก เช่น Strisrinan ใช้ `col-12` ราว 3,300 ครั้ง, `grid` 1,200, `md:col-*` หลายร้อย) โดยใช้ **ชื่อ class เดิม** template จึงไม่ต้องแก้

- **มีอะไรบ้าง:** grid 12 คอลัมน์ (`grid`, `col-N`, `col-offset-N`, `grid-nogutter`), flex, spacing (`p/m` + `t r b l x y`, สเกล 0–8, ค่าติดลบ, auto), sizing, typography, สีตามธีม (`surface-card`, `text-color-secondary`, `bg-primary`, `text-gray-*` = surface ของธีม), palette สีคงที่, border/radius ตาม token, shadow, position, overflow, form layout (`field`, `field-checkbox`, `formgrid`)
- **Mobile-first:** class ปกติคือขนาดมือถือ ส่วน `sm:` `md:` `lg:` `xl:` (576/768/992/1200px) มีผลจากความกว้างนั้นขึ้นไป
- **ตามธีม:** สี, radius และ shadow อ่าน `--wt-*` จึงเปลี่ยนตาม preset และโหมดมืดเอง ระยะ gutter ของ grid ปรับตอน runtime ได้ด้วย `--wt-grid-gutter`
- **ลำดับ layer:** `@layer reset, wiratheme.tokens, wiratheme.components, wiratheme.utilities, wiratheme.overrides` (`reset` มีไว้ให้แอปห่อ CSS reset ของตัวเอง เช่น `button { font: inherit }` ไม่ให้ชนะ style ของ component) utility จึงชนะ style ของ component (เช่น `class="p-0"` บน component) แต่แพ้ CSS ของแอปเอง ไฟล์ utility ประกาศลำดับ layer เต็มไว้บนสุดด้วย โหลดก่อนธีมก็ไม่เพี้ยน
- **เปิด/ปิด:** `ng add` ถามว่าจะเพิ่มไหม (`--utils=false` เพื่อข้าม) แบบ SCSS ใส่ `@use 'wiratheme/utils';` ใต้บรรทัดธีม แบบ CSS ใส่ `node_modules/wiratheme/utils/utils.css` ใน angular.json ปิดทั้งหมดได้ด้วยการลบบรรทัดนั้น หรือเลือกเฉพาะบางกลุ่มใน SCSS:

```scss
@use 'wiratheme/utils' with (
  $groups: (palette: false, shadows: false),  // ปิดบางกลุ่ม
  $prefix: 'u-',                                // .u-flex, .md:u-col-6 ถ้าต้องใช้คู่กับ library อื่นระหว่างย้าย
  $responsive: true,
  $layer: 'wiratheme.utilities',                // false = ไม่ใส่ layer
  $important: false
);
```

- **ขนาด:** ครบทุกกลุ่ม 157 KB (minified 102 KB, gzip ราว 12 KB) ตัดกลุ่มที่ไม่ใช้ออกได้ใน SCSS

## 7. Theme Designer (แบบ PrimeNG สมัยก่อน)

Designer เป็นแค่ **ตัวแก้ token** และ preview ใช้ `WtThemeService` ตัวเดียวกับ runtime **สิ่งที่เห็นใน preview จึงตรงกับไฟล์ที่ export 100%**

**หน้าจอ 3 ส่วน**
- **แถบบน:** เลือก preset, สลับ light/dark, **ปรับขนาดหน้าจอ preview** (Desktop / Tablet / Mobile / กำหนดความกว้างเอง + หมุนจอ เพื่อดู responsive ของ component), Undo/Redo, Import, Export, Share
- **ซ้าย (ตัวควบคุม):**
  1. Preset: Wira (เรียบแบบ Mali), Lanna (นุ่ม โค้งมนแบบ Sila), Siam (มี elevation และ ripple แบบ Material), แบบเหลี่ยมคมสไตล์ enterprise (ชื่อทั้งหมดยังเป็นชื่อชั่วคราว)
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

Chart (wrapper ครอบ Chart.js), Image (preview), Timeline, AutoComplete, Stepper, Drawer, Breadcrumb, Tree, TreeSelect, TreeTable, Listbox, Slider, Rating, InputOtp, Knob, ColorPicker, Chip, Carousel, Galleria, DataView, Splitter, ScrollPanel, Inplace, OrderList, PickList, Editor

- **Chart (ตัดสินแล้ว):** ครอบ Chart.js แบบเดียวกับ PrimeNG คือ `<wt-chart type="bar" [data]="…" [options]="…">` แอปติดตั้ง `chart.js` เอง (peer dependency แบบ optional) และ component โหลดแบบ lazy สีเริ่มต้นของกราฟ (ตัวอักษร เส้นตาราง palette ของ dataset) อ่านจาก token `--wt-*` จึงเปลี่ยนตามธีมและโหมดมืดเอง
- **Editor (ยังเลือกอยู่):** ทางที่ผู้ใช้สนใจคือ integrate TinyMCE หรือทำ editor เอง เรื่องที่ต้องรู้: TinyMCE ตั้งแต่รุ่น 7 เปลี่ยน license จาก MIT เป็น GPLv2+ (หรือซื้อ license เชิงพาณิชย์) ส่วนรุ่น 6 ที่ยังเป็น MIT หมดการดูแลแล้ว ซึ่งขัดกับเหตุผลที่ย้ายออกจาก PrimeNG ข้อเสนอ: ทำ `<wt-editor>` ของเราเองบน Tiptap/ProseMirror (MIT) เป็น `ControlValueAccessor` มี toolbar ตามธีม, ตาราง, รูป, วางจาก Word, ฟอนต์ไทย และให้ TinyMCE เป็น adapter เสริมสำหรับโปรเจคที่มี license อยู่แล้ว แอปจะสลับได้โดยไม่แก้ template

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

**สีตัวอักษรบนปุ่มหลัก (ตัดสินแล้วใน 12.4):** family แบบ PrimeNG ใช้ตัวอักษรขาวเหมือนต้นฉบับ ส่วน Wira เลือกอัตโนมัติ และตั้งเองได้ด้วย `primaryContrast`

### 12.4 หน้าตาแยกตามรุ่นแบบ PrimeNG (24 ต.ค. 2569)

ทำตาม feedback ว่าปุ่มทุกรุ่นหน้าตาเหมือนกันและเว็บดู basic: แต่ละรุ่นมีธีมย่อยแบบ PrimeNG ยุคเดียวกัน (6.10) โดยสำรวจแอป PrimeNG ทุกตัวใน `E:\Web Applications Coding` ก่อน กลุ่ม v1 (Angular 15/17, Sila จาก Designer เก่า, `#00a86b`/`#4c99e1`/`#8f1403`, Kanit, radius 6px) ใช้ `var(--surface-ground)`, `var(--surface-border)` และเขียนทับ `.p-highlight`, `.p-button`, `.p-card-body`, `.p-datatable-*` ส่วนกลุ่ม v2/v3 (Mali) ส่วนใหญ่ตั้ง `darkModeSelector: '.non-dark-selector'` และอ่าน `--p-surface-*`, `--p-primary-color`, `--p-content-border-radius`

- **core:** `families.ts` (token ของ 8 family), `compat.ts` (ตัวแปร PrimeNG), `CLASSIC_THEMES` + `VERSION_CATALOG` ใน `catalog.ts`, `themeConfig()` / `themePreset()` / `presetsFor()`, radius scale แบบ PrimeNG (xs…xl), focus 4 แบบ (ring/outline/inset/bold)
- **Sass:** เขียนใหม่ให้ตรงกับ `computeTokens()` ทั้งค่าและลำดับ (parity test 343 กรณีบน Sass 1.58 และ 1.106 รวมธีม v1 ทั้ง 25 ชื่อ) เพิ่ม `$theme`, `$scheme`, `$primary-contrast`
- **e2e (12.4):** แต่ละรุ่นตรวจหน้าตาเริ่มต้นของตัวเอง (padding/น้ำหนักตัวอักษรของปุ่ม) ส่วนการเทียบ pixel ข้ามรุ่นทำหลังใส่ preset เดียวกัน (ยืนยันว่า CSS ชุดเดียวกันให้ผลเหมือนกันทั้ง Angular 15, 19, 21) และตรวจ class/ตัวแปร PrimeNG ของแต่ละยุค

### 12.5 โหมดมืดนวล, utility ในตัว, สีองค์กร และ component ชุดง่าย (24 ต.ค. 2569)

- **โหมดมืดนวล** (6.10) และ **`wiratheme/utils`** (6.11)
- **สีองค์กร Wirabyte** (จาก wirabyte.com): preset `wira` ใช้น้ำเงินองค์กร `#1e7ae0` บน surface `ink` (`#f6f8fc` … `#070b14`) และ swatch `wira` เป็นสีเดียวกัน ส่วนธีม `sila-light-wira` ยังเป็นเขียว `#00a86b` เพราะทำไว้ให้ตรงกับแอปเดิม
- **Component ชุดง่าย (11 ตัว, ครบ v1/v2/v3):** Tag, Badge, Chip, Avatar + AvatarGroup, Divider, Skeleton, ProgressBar, ProgressSpinner, Message, Panel, Fieldset
  - ทุกตัวมี token ของ family (เช่น Tag แบบ classic เป็นสีทึบ `tag-fill: 100%`, แบบ styled เป็นสีอ่อน `0%`; Panel แบบ classic มีเส้นขอบแยกหัว/เนื้อหา แบบ styled ขอบรอบทั้งกล่อง) และ class `p-*` ของแต่ละยุค (v1 `p-tag-warning`, `p-inline-message-error`, `p-toggleable-content`; v2/v3 `p-tag-warn`, `p-message-error`, `p-panel-content-container`)
  - รับ severity แบบเดิม (`warning`, `error`) ผ่าน `ɵseverity()` กลาง
  - Panel/Fieldset ยุบด้วย `grid-template-rows` (ลื่นทั้ง Chromium, Firefox, Safari 16+) และใส่ `inert` ให้เนื้อหาที่ยุบ กด tab ไม่ถึง
  - ปุ่มไอคอน (ปิด, ลบ, ยุบ/ขยาย) มี `aria-label` จาก locale (`close`, `remove`, `expand`, `collapse`, `loading` เพิ่มใน `WtLocale`)
  - ขนาดของ ProgressBar/Spinner อยู่ที่ host จึงใช้ `style="height: 6px"` ได้เหมือนแอปเดิม
- **ตัวช่วยฟอร์ม (7 entry):** IconField + InputIcon, InputGroup + Addon, FloatLabel, ToggleButton, SelectButton, Rating, Password
  - IconField / InputGroup / FloatLabel ไม่มี state จึงเขียนครั้งเดียวใน `angular-common` (decorator ใช้ได้ทั้ง Angular 15–21) CSS อยู่ใน `inputtext.css` ที่ `wtInputText` โหลดอยู่แล้ว markup เดิมแบบ class ล้วน (`p-input-icon-left`, `p-inputgroup`, `p-float-label`) จึงใช้ได้แม้ไม่ได้ใช้ component
  - `wtInputText` / `wtTextarea` ใส่ class `wt-filled` (และ `p-filled`) เมื่อมีค่า FloatLabel ใช้ตัดสินว่าจะลอยหรือไม่ selector ที่มี `:autofill` ห่อด้วย `:is()` เพื่อไม่ให้ทั้ง rule หายใน browser ที่ไม่รู้จัก
  - ToggleButton / SelectButton แบบ styled เป็นราง + ชิปสีขาวบนตัวที่เลือก แบบ classic เป็นปุ่มที่เปลี่ยนเป็นสีหลัก (สีชิปซ้อนบนสี checked: ชิปโปร่งใสจึงเห็นสีหลัก)
  - Rating ใช้ radio จริงจึงกดลูกศร/ใช้ screen reader ได้, Password แสดงแถบความแข็งแรงใต้ช่องแทน overlay (ไม่บังเนื้อหา ใช้บนมือถือได้)
  - helper กลางของรายการตัวเลือก (`ɵoptionLabel`, `ɵoptionValue`, `ɵoptionDisabled`, `ɵsameValue` + `dataKey`) อยู่ใน `config/forms.ts` เตรียมไว้ให้ Select / Listbox
- **Panel (3 entry):** Toolbar (ไม่มี state เขียนใน `angular-common`), Accordion + AccordionTab, Tabs + TabPanel
  - API แบบหัวข้อเดียว (`<wt-accordion-tab header>`, `<wt-tab-panel header>`) ใช้เหมือนกันทุกรุ่น class ของ DOM ตามยุค (v1 `p-tabview`, `p-accordion-tab-active`; v2/v3 `p-tabs`, `p-accordionpanel-active`)
  - คีย์บอร์ดตาม WAI-ARIA: Accordion ลูกศรขึ้น/ลง/Home/End ระหว่างหัวข้อ, Tabs ลูกศรซ้าย/ขวา/Home/End ข้ามแท็บที่ปิดและเลือกทันที (roving tabindex)
  - responsive: แถบแท็บเลื่อนด้านข้างในตัวเอง (`overflow-x: auto`, scrollbar บาง) ส่วน Toolbar ขึ้นบรรทัดใหม่
- **InputNumber:** แสดงค่าที่จัดรูปแบบแล้ว (`฿1,234.50`, `60 กก.`) และไม่เปลี่ยนข้อความตอนโฟกัส (เปลี่ยนตอนนั้นทำให้การเลือกจาก Tab, คลิก, autofill หรือ `fill()` ของ test runner หาย แล้วตัวเลขที่พิมพ์ไปต่อท้ายค่าเดิม เจอใน e2e) สิ่งที่พิมพ์/วางอ่านแบบผ่อนปรน (ไม่สน `฿` และ `,`) แล้วจัดรูปแบบใหม่ตอนออกจากช่อง จึงไม่ต้องจัดการตำแหน่ง caret ระหว่างพิมพ์ model อัปเดตทุกครั้งที่พิมพ์ ส่วน min/max และจำนวนทศนิยมบังคับตอนออกจากช่อง ตรรกะตัวเลข (`formatNumber`, `parseNumber` รับเลขไทยและค่าที่วาง, `stepNumber` ไม่มีเศษทศนิยมลอย, `clampNumber`) อยู่ใน core มี unit test, `inputmode` numeric/decimal ให้มือถือแสดงแป้นตัวเลข
- **เปลี่ยนภาษาระหว่างใช้งาน:** component ที่แสดงข้อความจาก locale เป็น OnPush จึงต้องรู้ตัวเมื่อเรียก `WtConfig.setTranslation()` รุ่น v1 ใช้ `ɵrefreshOnTranslation()` (markForCheck) ส่วน signal ที่อ่านข้อความใน `computed()` ใช้ signal `language` เป็นตัวกระตุ้น เพราะ computed เก็บค่าไว้ (เจอจากเว็บ docs ที่สลับ TH/EN)
- **แถบแท็บ:** เส้นฐานใช้ `box-shadow: inset` แทน border + margin ติดลบ จึงไม่ล้นแนวตั้งจน scrollbar โผล่ (`overflow-x: auto` บังคับให้แกน y เป็น auto ด้วย)
- **ลำดับถัดไปตามการใช้งานจริง:** นับไฟล์ HTML ในทุกโปรเจคที่ใช้แต่ละ component (24 ต.ค. 2569): Table 449, Dialog 432, Select/Dropdown 437, Toast 194, ConfirmDialog 155, Tooltip 119, InputNumber 116, DatePicker/Calendar 98, Tabs/TabView 64, Accordion 34, Timeline 28, Steps 10 ชุดถัดไปจึงควรเป็น overlay (Dialog, ConfirmDialog/`WtAlertService`, Toast, Tooltip, Popover) แล้ว Select, InputNumber, DatePicker พ.ศ. และ Table แอป v2/v3 ใช้ Tabs แบบ PrimeNG 18 (`<p-tabs><p-tablist><p-tab>`) อยู่ 41 ไฟล์ ถ้าจะลดงานย้ายควรเพิ่ม API แบบนั้นให้ `wiratheme/tabs` ด้วย

### 12.6 DatePicker (24 ต.ค. 2569)

- **ดูจากแอปจริงก่อน:** `dateFormat="dd/mm/yy"` 164 ที่, `hourFormat="24"` 129, `[showSeconds]` 154, `[readonlyInput]` 256, `appendTo="body"` 1,400+ ที่, และ `[isBudhistYear]` 27 ที่ (TP Hub, Samsen One ใช้ fork `primeng-buddhist-year-datepicker` พร้อม directive ที่บังคับ `readonlyInput`) จึงรับทั้งหมดนี้ได้ตรงตัว
- **ตรรกะอยู่ใน core ไม่ผูก framework:** `core/src/date.ts` (ตาราง 6 สัปดาห์คงที่ให้ panel ไม่กระโดด, min/max/disabled, หน้าปี 12 ช่องตามทศวรรษที่คนเห็นเช่น 2560–2569, ลูกศร/Home/End/PageUp/PageDown, เวลา wrap 23→00, 12/24 ชม.) และ `DatePickerState` (เลือกวัน/ช่วง/หลายวัน/เดือน/ปี, เวลา, ข้อความในช่อง) มี unit test 32 ข้อ component v1 (decorator, `*ngIf`) กับ v2/v3 (signal, `@if`) จึงเหลือแค่ template กับการจัดการโฟกัส
- **รูปแบบวันที่:** `dateFormat` ใช้ภาษา `dd/mm/yy` เดิม (`classicDateFormat()` แปลงเป็น pattern ของ `formatDate()`) ค่าเริ่มต้นเป็นของ locale พิมพ์ได้ทั้งตรงรูปแบบ, ตัวเลขตามลำดับวัน/เดือน/ปีของรูปแบบด้วยตัวคั่นอะไรก็ได้ (`12/3/2569`, `12-03-69`), เลขไทย, ชื่อเดือนตัวพิมพ์ใดก็ได้ และในโหมด พ.ศ. ปีที่ต่ำกว่า 2300 ถือเป็น ค.ศ. ที่พิมพ์ตามความเคยชิน ค่าที่ใช้ไม่ได้ (นอก min/max) ไม่เข้า model และถูกแทนด้วยค่าเดิมตอนออกจากช่อง
- **เวลา:** ช่อง ชม./นาที/วินาที เป็น `<input>` ที่กดปุ่มขึ้นลง (กดค้างได้), ลูกศรขึ้นลง และพิมพ์ได้ พิมพ์ครบแล้วไปช่องถัดไปเอง (เช่น `45` หรือ `7` ในช่องนาที) เกินช่วงถูกบีบตอนออกจากช่อง `readonlyInput` (ช่องหลัก) กับ `timeReadonlyInput` (ช่องเวลา) แยกกัน รับชื่อ `readOnlyInput` / `timeReadOnlyInput` ด้วย เมื่อมีเวลา panel ไม่ปิดหลังเลือกวัน (ต่างจากต้นฉบับ ตั้ง `hideOnDateTimeSelect` ได้)
- **Overlay:** `ɵWtPopup` ใน `wiratheme/config` (ใช้ต่อกับ Select, Dialog) วาง panel ใน top layer ด้วย `popover="manual"` จึงอยู่เหนือ dialog และไม่ถูก `overflow: hidden` ตัด ไม่ต้อง `appendTo` (รับไว้เฉย ๆ) panel อยู่ที่เดิมใน DOM ลำดับโฟกัสจึงถูก กลับด้านขึ้นบนเมื่อด้านล่างไม่พอ ตามช่องเมื่อ scroll บนมือถือเป็น bottom sheet ที่อยู่เหนือแป้นพิมพ์ (visualViewport) วันกว้าง 44px และช่องหลักไม่เรียกแป้นพิมพ์ (`inputmode="none"`)
- **คีย์บอร์ด:** ช่องหลัก ลูกศรลงเข้าตาราง, Escape/Enter ปิด, Tab ปิดแล้วไปช่องถัดไป (ซ่อนทันทีใน keydown เดียวกัน ไม่งั้นแอป zoneless จะ Tab เข้า panel) ในตาราง roving tabindex ตาม WAI-ARIA และ Tab วนใน panel
- **ยุค:** v1 มี class `p-calendar`, `p-datepicker` (panel), `p-datepicker-trigger`, `p-highlight`, `p-monthpicker`, `p-timepicker`; v2/v3 มี `p-datepicker`, `p-datepicker-panel`, `p-datepicker-dropdown`, `p-datepicker-day-selected`, `p-datepicker-time-picker` token `datepicker-*` แยกตาม family (classic ใช้สีอ่อนบนวันที่เลือกและช่อง 2.5rem, styled ใช้สีหลักทึบ 2rem, Phet มุมเหลี่ยม)
- **e2e 15 ข้อ** (Chromium v1/v2/v3 + WebKit) ใช้ `page.clock` ตรึงวันที่ และภาพ inline calendar ชุดเดียวกันทุกรุ่น สิ่งที่ e2e จับได้และแก้แล้ว:
  - ตาราง `width: 100%` ใน popup ที่กว้างตามเนื้อหา ทำให้ browser ขยาย popup เต็มหน้าต่าง จึงให้ตารางกว้าง auto และใช้ 100% เฉพาะ sheet / inline บนมือถือ
  - ไฟล์ธีมที่ `ng add` สร้างคำนวณ token จาก core ที่ฝังใน schematics ต้อง build schematics ใหม่ทุกครั้งที่เพิ่ม token (`pnpm build` ทำตามลำดับนี้อยู่แล้ว)
  - กดลูกศรจนถึง minDate/maxDate ปุ่มถูก disable แล้ว browser ทิ้งโฟกัส panel จึงปิดเอง ตอนนี้ย้ายโฟกัสไปที่ตารางแทน
  - Safari ไม่โฟกัสปุ่มที่ถูกคลิก โฟกัสจึงตกไปที่หน้าและ panel ปิด ตอนนี้คลิกปุ่มหรือที่ว่างใน panel ไม่ย้ายโฟกัส (เฉพาะช่องเวลาและช่องวันรับโฟกัสจากการคลิก) และตัวเลขแรกที่พิมพ์หลังโฟกัสแทนค่าทั้งช่องผ่าน keydown แทนการพึ่ง selection ที่ WebKit ทิ้งได้
  - หน้าตา classic สูงจนลงไม่พอทั้งด้านบนและด้านล่าง: เลือกด้านที่มีที่มากกว่าแล้วจำกัดความสูงให้เลื่อนในตัว แทนการทับช่อง บนมือถือช่องว่างระหว่างวันคงที่ 0.125rem เพื่อให้วันกว้าง 44px ทุกธีม

### 12.7 Overlay, AlertDialog และ animate on scroll (24 ต.ค. 2569)

- **ดูจากแอปจริงก่อน:**
  - Dialog: `[modal]="true"` 832, `[(visible)]` 805, `[draggable]="false"` 763, `[style]="{ width: '50vw', 'min-width': '360px' }"` เป็นแบบที่พบบ่อย
  - เทมเพลต: `pTemplate="header|footer"` 1,800+ ที่
  - Swal: `Swal.fire` 835 ครั้ง (อ่าน `result.value` 250, `isConfirmed` 108, `showLoading` 20)
  - Toast: `messageService.add({ severity, summary, detail })` 3,200+ ครั้ง
  - Confirm: `confirm({ message, header, icon, accept })` 470
  - Tooltip: `pTooltip` + `tooltipPosition` 390
  - Popover: `#op` + `op.toggle($event)` 33
- **ทุกตัวอยู่ใน top layer ของ browser:**
  - Dialog / Alert ใช้ `<dialog>` + `showModal()` จึงได้ focus trap, หน้าข้างหลัง inert และซ้อนกันได้เองโดยไม่ต้องใช้ z-index หรือ appendTo
  - Toast / Tooltip / Popover / DatePicker ใช้ `popover="manual"`
  - Toast ที่เพิ่มตอนมี dialog เปิดอยู่จะ show ใหม่เพื่อขึ้นมาอยู่บนสุด
  - ปุ่ม Escape จัดการเองใน keydown ไม่ปล่อยให้ browser ปิด `<dialog>` เอง และ component ข้างใน (DatePicker) ที่ใช้ Escape แล้วจะกันไม่ให้ dialog ปิดตาม
- **เขียนครั้งเดียว:** logic อยู่ใน base class ของ `angular-common` (decorator input ใช้ได้ Angular 15–21) ส่วน template v1 (`*ngIf`) และ v2/v3 (`@if`) ต่างกันเฉพาะ control flow และ class ตามยุค
  - v1: `p-dialog-header-close`, `p-confirm-dialog`, `p-toast-icon-close`, `p-overlaypanel`
  - v2/v3: `p-dialog-close-button`, `p-confirmdialog`, `p-toast-close-button`, `p-popover`
- **Migration ทำได้โดยเปลี่ยน import:**
  - `WtTemplate` อ่าน `pTemplate` ด้วย
  - `wiratheme/api` export ชื่อเดิม `ConfirmationService`, `MessageService`, `ConfirmEventType`, `SharedModule`, `Message`
  - `WtTooltip` รับ attribute `pTooltip`
  - `WtConfirmDialog` รับ `acceptButtonStyleClass="p-button-success"` และแปลงเป็นปุ่ม WiraTheme (`ɵbuttonClass`)
  - selector `wt-confirmDialog`, `wt-overlayPanel` ใช้ได้
- **AlertDialog แทน SweetAlert** (`wiratheme/alert`):
  - `import { WtAlert as Swal } from 'wiratheme/alert'` แล้วโค้ด `Swal.fire(...)` เดิมทำงานต่อได้
  - รับ option ชื่อเดิม: title, text, html, icon, showCancelButton, reverseButtons, confirmButtonColor, input, inputValidator, preConfirm, timer, didOpen, allowOutsideClick
  - ผลลัพธ์รูปเดิม: isConfirmed, isDenied, isDismissed, value, dismiss
  - มี `showLoading`, `close`, `mixin`, `confirm()` ที่คืน boolean
  - ไอคอน SVG วาดเส้นเอง สีมาจาก semantic token และป้ายปุ่มมาจาก locale
  - static facade หา service ผ่าน root injector ที่ `provideWiraTheme()` เก็บไว้
  - เรียก `confirm()` โดยไม่มี `<wt-confirmdialog>` ใน key นั้น จะเปิดเป็น alert แทน คำถามจึงไม่หายเงียบ
- **Responsive:**
  - บนมือถือ Dialog กว้างเต็มจอเสมอ (`width`/`min-width` ของแอปถูกแทนด้วย `!important` เฉพาะ < 576px) เพราะแอปจำนวนมากตั้ง `min-width: 360px`
  - Alert กว้างเต็มจอ ปุ่มแบ่งแถวเท่ากันและสูง 44px
  - Toast เต็มความกว้างจอ
  - Tooltip ที่ไม่พอด้านข้างย้ายไปบนหรือล่าง
- **ความต่างจากของเดิมที่ตั้งใจไว้:**
  - `draggable` ค่าเริ่มต้นเป็น false (แอปปิดอยู่แล้ว 763 จาก ~840)
  - modal ล็อก scroll ของหน้าเป็นค่าเริ่มต้น
  - Tooltip แสดงตอนโฟกัสด้วยคีย์บอร์ดด้วย
  - Tooltip HTML (`[escape]="false"`) เหลือเฉพาะแท็กจัดรูปแบบและลิงก์ http/https/mailto
- **Animate on scroll** (`wiratheme/animate`):
  - แทน AOS โดยใช้ attribute เดิม (`data-aos`, `data-aos-delay`, `-duration`, `-easing`, `-offset`, `-once`, `-mirror`, `-anchor-placement`) และชื่อ animation ครบ 27 ชื่อ (fade, zoom, flip, slide)
  - เปิดใช้ด้วย `provideWtAnimate()` (หรือ `WtAnimateModule.forRoot()`) แทน `AOS.init()` หรือใช้ directive `[wtAnimate]`
  - ใช้ IntersectionObserver โดย MutationObserver คอยจับ element ที่เพิ่มทีหลัง
  - ซ่อนเฉพาะ element ที่ script ดูอยู่ (`.wt-aos`) เนื้อหาจึงไม่หายถ้า script ไม่ทำงาน
  - ผู้ใช้ที่ตั้ง reduced motion เห็นทุกอย่างทันที

### 12.8 รอบรีวิวของผู้ใช้: ขนาด, validation, MeterGroup (24 ต.ค. 2569)

- **ขนาดเทียบกับ PrimeNG จริง:** วัดที่ v17 / v19 / v21 (root 14px)
  - ปุ่มสูง 33px, `sm` 27.5px, `lg` 38.5px, ปุ่มไอคอน 35×33 padding `0.5rem 0.75rem`
  - ของเราสูงกว่าเพราะ Kanit มี line-height `normal` ราว 1.5
  - เพิ่ม token `control-line-height` = 1.2 ใช้กับปุ่ม, input, datepicker, selectbutton, togglebutton
  - ผลที่ root 14px: styled 33 / sm 28 / lg 37px, classic Sila 40 / 35 / 50px (ธีม Lara ของ PrimeNG v17 วัดได้ 39 / 34.4 / 49.3)
  - ทดสอบแล้วสระ/วรรณยุกต์ไทยใน input ไม่ถูกตัด
- **ขนาดทั้งระบบ:** `scale` ใน `provideWiraTheme()` และ `WtThemeService.setScale()`
  - ตั้ง font-size ของ `<html>`: `sm` 12px, `md` 14px, `lg` 16px หรือใส่ตัวเลข px (ช่วงเดียวกับตัวเลือก scale ของเว็บเอกสาร PrimeNG ที่ค่าเริ่มต้น 14px)
  - เว็บเอกสารเริ่มที่ `md` และมีตัวเลือก "ขนาด UI" ใน Theme panel
- **ขนาดรายตัว:** `size="small"`/`"large"` (หรือ `sm`/`lg`) ใน button, checkbox, radiobutton, toggleswitch, togglebutton, selectbutton, password, inputnumber, datepicker
  - class เดิม `p-button-sm`, `p-inputtext-sm` ใช้ได้
  - มี `<button wtButton>` (อ่าน `pButton`) และ `styleClass="p-button-*"` แปลงเป็น class ของเรา
- **Validation** (`wiratheme/validation`):
  - field แดงเองเมื่อ invalid และ (touched หรือ form submitted)
  - `wt-field-error` แสดงข้อความภาษาของ locale
  - validator ไทย: `thaiId`, `thaiPhone`, `match`
- **ปรับหน้าตาตามที่ผู้ใช้ทัก:**
  - Divider ใช้สี `divider-color` (เข้มกว่า border), dotted หนา 2px, ระยะห่าง 0.75rem
  - Fieldset legend เล็กลง และตอนยุบมีที่ว่างใต้ legend
  - Panel: ปุ่มไอคอนใน header ขนาด 2rem และไม่ทำให้ header สูงขึ้น
  - Tabs: padding เล็กลง, ไม่มี scrollbar, มีปุ่มเลื่อนเมื่อแท็บล้น (รับ `scrollable` เดิม)
  - Toolbar (classic) padding 0.75rem
- **CSS reset ของแอปทำปุ่มใหญ่:** เว็บเอกสารมี `button { font: inherit }` ไม่อยู่ใน layer
  - ชนะ `.wt-btn` ใน `@layer wiratheme.components` ปุ่มจึงได้ตัวอักษร 15px และ line-height 1.75 ของหน้า (สูง 42–49px)
  - Bootstrap Reboot และ Tailwind preflight ทำแบบเดียวกัน
  - แก้ด้วยการเพิ่ม layer `reset` ไว้หน้าสุดของลำดับ ให้แอปห่อ reset ด้วย `@layer reset { }`
- **พฤติกรรมที่เปลี่ยน:**
  - AlertDialog: ปุ่มยืนยันอยู่ขวาเสมอ เรียงใน DOM ด้วย จึงกด Tab ตามที่ตาเห็น
  - Toast:
    - มีเส้นนับถอยหลัง ซึ่งหยุดตอน hover และนับต่อจากเวลาที่เหลือ
    - ปุ่มปิดอยู่ขวาบนเสมอ
    - severity contrast เห็นไอคอน
  - Tooltip: เลื่อนเมาส์ไปบน tooltip ได้ (WCAG 1.4.13); `[autoHide]="true"` ซ่อนทันทีแบบเดิม
  - Dialog: `position` ใช้ได้แล้ว (เดิมกฎของ mask ชนะ specificity) และไอคอนขยายเป็นลูกศรออกสองมุม
  - InputNumber:
    - ห้ามตัวอักษร, ทศนิยมเกิน, ลบเมื่อ `min ≥ 0` และค่าเกิน `max` ตอนพิมพ์
    - ข้อความที่มาทีเดียว (วาง, autofill) อ่านแบบยืดหยุ่น
  - Animate: ซ่อนทันทีโดยไม่ fade ออกก่อน (เดิมเนื้อหาที่เห็นอยู่จางหายก่อนเล่น)
  - Focus ของช่องกรอก: ขอบ 1px เปลี่ยนเป็นสีหลักอย่างเดียว ไม่มี ring (ผู้ใช้ต้องการแบบนี้ เดิม ring 2px รวมขอบดูเป็นแถบหนา) ส่วนปุ่ม/checkbox ยังใช้ ring เดิม
  - ปุ่มที่ disabled เป็นสีเทาจาง (`button-disabled-bg` / `-color`) ทุก severity และทุกแบบ ส่วนปุ่มที่กำลังโหลดยังเป็นสีเดิมแบบจางลง
  - ปุ่มของ DatePicker กว้างเท่า addon ของ InputGroup (classic 3rem, styled 2.5rem)
    - เดิมพยายามให้เป็นสี่เหลี่ยมจัตุรัสด้วย `aspect-ratio`
    - แต่ใน flex ที่ยืดความสูง aspect-ratio ไม่ทำงาน ปุ่มจึงแคบ 35px บนช่องสูง 40px
- **ใหม่:**
  - ProgressBar รับ `max` (นับจำนวน `1,000 / 2,500 รายการ`), `text` และ template `#content`
  - MeterGroup (`wiratheme/metergroup`) ครบ v1/v2/v3
  - Glass เป็นของ v3 เท่านั้น: preset ไม่อยู่ใน `wiratheme/presets` ของ v1/v2 และ `variant="glass"` ของ Card แสดงเป็นการ์ดปกติใน v1/v2
- **ชื่อ preset เป็นของเราเอง** (ผู้ใช้ไม่อยากใช้ชื่อที่ดูลอกมา) ชื่อไทยตามความหมาย:

  | ชื่อเดิม (แนวเดียวกับ) | ชื่อใหม่ | ความหมาย |
  |---|---|---|
  | Aura | `mali` มะลิ | เรียบ สะอาด (ค่าเริ่มต้น v2/v3) |
  | Lara / `lara-light-*`, `lara-dark-*` | `sila` ศิลา / `sila-light-*`, `sila-dark-*` | หนักแน่น ตัวหนา (ค่าเริ่มต้น v1 `sila-light-teal`) |
  | Nora | `phet` เพชร | คม ชัด |
  | Saga / `saga-*` | `arun-*` อรุณ | สว่าง |
  | Vela / `vela-*` | `sayan-*` สายัณห์ | มืดโทนน้ำเงิน |
  | Arya / `arya-*` | `ratri-*` ราตรี | มืดโทนเทา |
  | Material / `md-*` | คงเดิม | ชื่อ design system ของ Google |

  - ใช้ชื่อใหม่ทั้งใน API (`Mali`, `Sila`, `SilaClassic` …), ไฟล์ธีม และเว็บ
  - `ng add --theme` ยังรับชื่อเดิมได้ เพื่อให้ทีมที่ย้ายมาพิมพ์ชื่อที่คุ้นได้
- **สีสถานะแยกตาม preset** (ผู้ใช้ต้องการให้เปลี่ยนธีมแล้วโทนเปลี่ยนแบบ PrimeNG ที่ Aura นวลกว่า Lara):
  - Mali นวล เย็น: emerald, sky, orange, rose, violet
  - Sila สดแบบยุค 2019–2022: `#22c55e`, `#3b82f6`, amber, `#ef4444`, `#a855f7` และปุ่ม secondary สีเทาอมฟ้าทึบตัวอักษรขาว
  - Phet เข้มขึ้นหนึ่งขั้นให้คม
  - Material ใช้ชุดสีของ Material Design
- **สไตล์โค้ดตัวอย่างบนเว็บ:** ตามโค้ดในโปรเจคของทีม (สำรวจ 21 แอป)
  - ทุกรุ่น:
    - boolean เขียน `[modal]="true"`
    - ค่าคงที่เป็น attribute ธรรมดา
    - `<wt-button (onClick)>` และ `[style]="{ width: '480px' }"`
  - v1/v2: `wtTemplate="footer"` กับ `*ngIf`
  - v3: `#footer` กับ `@if`

---

## 13. คำถามที่ต้องตัดสินใจ

1. **License (ตัดสินแล้ว):** MIT ใช้ฟรีทุกรุ่นแบบ PrimeNG ยุคเดิม ไม่มี license ขายและไม่มีรุ่น LTS แบบเสียเงิน (ไฟล์ `LICENSE` ที่ root ถูก copy เข้าทุกแพ็กเกจ) ส่วนช่องทาง publish ยังเหลือเลือกระหว่าง npm สาธารณะ (`wiratheme` ยังว่าง) ซึ่งเข้ากับ MIT ที่สุด หรือ private registry
8. **Figma UI Kit (วางแผนแล้ว):** มี Figma kit คู่กับโค้ด โดยให้ Theme Designer export token เป็น Figma Variables / W3C Design Tokens JSON เพิ่มจาก SCSS/CSS/TS/JSON เดิม เพื่อให้ Figma กับโค้ดใช้ token ชุดเดียวกัน และ component ใน kit ตั้งชื่อ variant ตาม input ของ component (`severity`, `variant`, `size`) ให้ designer กับ dev คุยภาษาเดียวกัน ต้องตัดสินใจว่าจะเริ่มใน Phase 2 (พร้อม Designer ตัวจริง) หรือ Phase 3
2. **โดเมนของเว็บแนะนำ** เช่น `wiratheme.wirabyte.com` และ host ที่ไหน (มีโปรเจค NodeJS Web Hosting อยู่แล้ว หรือใช้ Cloudflare Pages)
3. **PrimeFlex (ตัดสินแล้ว):** ทำ utility ของ WiraTheme เองในตัว (`wiratheme/utils`, 6.11) ชื่อ class เดิม เปิด/ปิดได้
4. **Icon:** พึ่ง primeicons/Font Awesome ต่อไป หรือทำ `@wiratheme/icons` (ตอนนี้ icon ที่ใช้ภายใน component เป็น SVG inline จึงไม่บังคับ dependency)
5. **ชื่อและเอกลักษณ์ของ preset** (Wira / Lanna / Siam / …) และจะใช้ Kanit เป็นฟอนต์เริ่มต้นไหม
6. **ที่เก็บธีมใน Designer:** เก็บในเครื่องอย่างเดียว (localStorage + ไฟล์) หรือผูกบัญชีผู้ใช้เพื่อเก็บบน server
7. **API naming:** ยืนยันว่าจะใช้ชื่อแบบ PrimeNG (`(onClick)`, `optionLabel`) เพื่อให้ย้ายง่าย แม้จะไม่ตรงกับ Angular style guide (ที่ไม่ให้ขึ้นต้น output ด้วย `on`)
