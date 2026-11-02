# WiraUI — ร่างสถาปัตยกรรม (Draft v0.1)

> UI component library + Theme Designer สำหรับ **Angular อย่างเดียว**
> ร่างเมื่อ 24 ต.ค. 2026 จากการอ่านแอปจริงของทีม 3 ตัว (เรียกในเอกสารนี้ว่า แอป A: Angular 15, แอป B และ C: Angular 19)

## สรุปสั้น

- **เป้าหมายหลัก:** UI library ของ Wirabyte เองที่ใช้ฟรี คงวิธีใช้ให้คุ้นมือจนย้ายจากของเดิมได้ง่าย แต่ครอบคลุมกว่าและเหมาะกับงานไทยกว่า
- มีแพ็กเกจหลักแพ็กเกจเดียวชื่อ **`wiraui`** (ตอนตรวจ ชื่อนี้ยังว่างบน npm) แยก major ตามรุ่น Angular แบบเดียวกับ UI library เดิม: **v1 = Angular 15–17, v2 = 18–20, v3 = 21+** โดย v3 มาพร้อมหน้าตาใหม่แบบ **Liquid Glass + ชุดสีสด** และ `ng add wiraui` จะเลือก major ที่เข้ากับโปรเจคให้เอง
- ใช้ได้ทั้ง **standalone และ NgModule** ในทุกรุ่น
- ธีมคือชุด **design token ที่ออกมาเป็น CSS variables** ชุดเดียว เขียนได้ 3 ทาง ได้แก่ **CSS** สำเร็จรูป, **SCSS** (`@use … with (…)`) และ **TypeScript** (override หรือ preset ทับได้ตอน runtime) ลำดับว่าค่าไหนชนะคุมด้วย CSS `@layer` จึงเลิกใช้ `!important` กับ `::ng-deep` ได้
- **Theme Designer** แบบ UI library เดิม สมัยก่อน: ปรับค่าบนเว็บแล้วเห็นผลทันที จากนั้น export เป็น SCSS / CSS / TS / JSON และ import ไฟล์กลับมาแก้ต่อได้
- **เว็บแนะนำ** ใช้โครงเดียวกับ เว็บเอกสารของ UI library ทั่วไป (แท็บ FEATURES / API / THEMING, เลือก v1/v2/v3 ได้, มี configurator และ Designer)
- มีของที่ UI library เดิม ไม่มีแต่โปรเจคเราใช้จริง เช่น ปฏิทิน พ.ศ. ในตัว, ภาษาไทยเป็นค่าเริ่มต้น, Alert แทน SweetAlert2, Table ที่ export Excel ได้ และช่องกรอกเลขบัตรประชาชน

---

## 1. สิ่งที่เจอในโปรเจคเดิม และสิ่งที่ WiraUI ควรทำ

ตัวเลขด้านล่างได้จากการ grep จึงเป็นค่าประมาณ

| สิ่งที่เจอ | ที่มา | WiraUI ควรทำ |
|---|---|---|
| ใช้ `theme.css` ขนาด 154 KB ที่ export จาก Theme Designer รุ่นเก่า (Lara light teal ของ UI library เดิม, primary `#00a86b`, ฟอนต์ Kanit) | แอป A `src/assets/css/theme.css` | ทำ Designer ที่ export ไฟล์ได้ ซึ่งตรงกับวิธีที่ทีมใช้อยู่แล้ว |
| override คลาส `.p-*` ใน SCSS ราว 215 / 46 / 245 จุด และมี `::ng-deep` ใน 25 / 6 / 8 ไฟล์ | ทั้ง 3 โปรเจค | ใช้ cascade layers + token ระดับ component + `[tokens]` สำหรับแก้เฉพาะจุด |
| `--p-card-body-gap: 0px !important;` | แอป B `styles.scss` | `components.card.bodyGap` |
| `darkModeSelector: '.non-dark-selector'` ที่ใช้เพื่อปิด dark mode | แอป B `app.module.ts` | มีตัวเลือก `darkMode: 'none'` ตรง ๆ |
| `setTranslation({...})` ภาษาไทยเขียนซ้ำใน layout 3 ไฟล์ | แอป A `routes/*-layout.component.ts` | มี locale `th` ในตัวและตั้งครั้งเดียว |
| ใช้ fork ของ datepicker ที่แสดง พ.ศ. | แอป B | DatePicker รองรับ พ.ศ. ในตัว |
| เรียก `Swal.fire` ราว 219 จุด | แอป A | มี `WuAlertService` ที่ใช้ธีมเดียวกัน |
| `xlsx` ถูกใช้ใน 26 / 5 ไฟล์ | แอป A / แอป B | Table export Excel/CSV ได้ในตัว |
| ใช้คลาส utility library เดิม ราว 5,100 / 650 / 230 จุด | ทั้ง 3 โปรเจค | ห้ามใช้ชื่อคลาสชนกับ utility library เดิม และยังไม่ทำระบบ grid เอง |
| **ทุกแอปเป็น NgModule** (`app.module.ts`) แม้แต่แอปที่เป็น Angular 19 | ทั้ง 3 โปรเจค | ต้องรองรับ NgModule ทุกรุ่น ไม่ใช่แค่ v1 |
| ใช้ฟอนต์ Kanit ทุกโปรเจค | `styles.scss` | ใช้เป็นค่าเริ่มต้น และตั้ง line-height ให้สระบน/วรรณยุกต์ไม่ถูกตัด |
| Homepage มีระบบ token `--app-*` (light/dark) ที่เขียนเอง | Homepage `styles.scss` | ใช้ token model ของ WiraUI แทนได้ |
| สร้าง `dialog-loading`, `empty-state`, `file-upload` ไว้ใช้เอง | แอป B `shared/components` | ทำเป็น component มาตรฐาน |
| component ที่ใช้มากที่สุด: button 417, table 349, card 308, dropdown 276, dialog 229, calendar 177 | แอป A | ใช้เป็นลำดับในการทำ MVP |

## 2. ขอบเขต

**ทำ**
- Angular component library ทั้ง 3 รุ่น, ระบบธีม, Theme Designer, เว็บแนะนำ, schematics (`ng add` / `ng update`)
- ใช้ร่วมกับ UI library เดิม ในแอปเดียวกันได้ระหว่างย้าย (ทุกอย่างขึ้นต้นด้วย `wu-` / `--wu-` และไม่มี global reset ไปกระทบของเดิม)
- ตั้งชื่อ input/output ให้ใกล้ UI library เดิม มากที่สุด (`label`, `icon`, `severity`, `options`, `optionLabel`, `optionValue`, `(onClick)` …) เพื่อให้การย้ายส่วนใหญ่เป็นแค่การเปลี่ยนชื่อ tag
- เขียนเองทั้งหมด ไม่คัดลอกโค้ดหรือ CSS ของ UI library เดิม ที่ "คล้ายเดิม" คือชื่อ API, ชุด component และความรู้สึกตอนใช้ ไม่ใช่ source

**ยังไม่ทำ (ตอนนี้)**
- React / Vue / framework อื่น
- grid หรือ utility CSS ของตัวเอง (ใช้ utility library เดิม หรือ Tailwind ต่อไปได้)
- rich-text editor และ chart engine ของตัวเอง (ทำ wrapper ครอบ Chart.js และ adapter สำหรับ Quill/TinyMCE แทน)
- โหมด unstyled/headless และ pass-through (`pt`) แบบ UI library เดิม ไว้พิจารณาหลัง v1.0

---

## 3. Versioning

| | **v1** | **v2** | **v3** |
|---|---|---|---|
| Angular ที่รองรับ | 15 – 17 | 18 – 20 | 21+ |
| เทียบกับ UI library เดิม | 15 – 17 | 18 – 20 | 21 |
| build ด้วย | Angular 15.2 · TS 4.9 | Angular 18 · TS 5.4 | Angular 21 · TS 5.9 |
| Node ที่ใช้ dev / build / CI | Node 24 LTS ตัวเดียวทั้ง repo | ← | ← |
| Node ขั้นต่ำของผู้ใช้ (`engines`) | 18 | 18.19 (Angular 18–19) · 20.19 (Angular 20) | 20.19 (ตามที่ Angular 21 กำหนด) |
| `peerDependencies` | `>=15.0.0 <18.0.0` | `>=18.0.0 <21.0.0` | `>=21.0.0` ไม่มีเพดาน (ดูด้านล่าง) |
| รูปแบบ API | `@Input()` / `@Output()` | `input()` / `model()` / `output()` | เหมือน v2 + รองรับ Signal Forms |
| template | `*ngIf` / `*ngFor` | `@if` / `@for` | เหมือน v2 |
| change detection | OnPush + zone.js | OnPush, รันแบบ zoneless ได้ | zoneless เป็นหลัก |
| standalone / NgModule | ✓ / ✓ | ✓ / ✓ | ✓ / ✓ |
| animation | CSS ล้วน (ไม่ต้องใช้ `@angular/animations`) | CSS ล้วน | CSS ล้วน |
| หน้าตาเริ่มต้น | Wira แบบพื้นทึบ | Wira แบบพื้นทึบ (เปิดใช้ Glass เองได้) | **Glass**: Liquid Glass + ชุดสีสดใหม่ (ข้อ 6.9) |
| สถานะ | maintenance | active | active (`latest`) |
| แอปเราที่จะใช้ | แอป A | แอป B, แอป C | — (รออัปเกรด) |

**ทำไมต้อง build ด้วย Angular รุ่นต่ำสุดของช่วง:** library แบบ partial compilation (Angular Package Format) ที่ build ด้วย Angular X ใช้ได้กับแอป Angular X **ขึ้นไป** เพราะ linker ของแอปแปลงให้ แต่ใช้กับรุ่นที่ต่ำกว่าไม่ได้ ดังนั้น v1 ที่ build ด้วย 15 จึงรันบน 15, 16, 17 ได้ทั้งหมด

**ล็อกรุ่น ห้ามใช้ข้ามช่วง** (เช่น ติดตั้ง v1 ลง Angular 18 ต้องไม่ผ่าน) โดยกันไว้ 3 ชั้น:
1. **ตอนติดตั้ง:** `peerDependencies` ของ v1 และ v2 เป็นช่วงปิด (`>=15.0.0 <18.0.0` …) ส่วน v3 เปิดด้านบน npm 7 ขึ้นไปจะปฏิเสธการติดตั้ง (ERESOLVE) ส่วน pnpm จะเตือน แต่โปรเจคที่ตั้ง `legacy-peer-deps` จะข้ามชั้นนี้ไปได้ จึงต้องมีอีก 2 ชั้น
2. **ตอน `ng add` / `ng update`:** schematic ตรวจรุ่น Angular ก่อนแก้ไฟล์ ถ้าไม่ตรงจะหยุดและบอกว่าต้องใช้ `wiraui@<major ที่ถูก>`
3. **ตอนแอปเริ่มทำงาน:** `provideWiraUI()` และ constructor ของทุก component ตรวจ `VERSION.major` ของ `@angular/core` ถ้าอยู่นอกช่วงจะ throw error ทันที แอปจึงไม่เปิดทั้งตอน dev และ production

มีข้อยกเว้นเดียวคือเว็บแนะนำ (ข้อ 10.1) ที่ต้องโชว์ v1/v2 บน Angular 21 ซึ่งจะใช้ token ภายในที่ไม่ได้เปิดเป็น API สาธารณะ (ขึ้นต้นด้วย `ɵ` แบบ API ภายในของ Angular) การล็อกนี้มีไว้กันการติดตั้งผิดและภาระ support ไม่ได้มีไว้กันคนตั้งใจหลบ

**เลือกรุ่นอัตโนมัติ:** ตั้ง npm dist-tags เป็น `latest` → 3.x, `v2-lts` → 2.x, `v1-lts` → 1.x (ช่วง beta: `beta`, `v2-beta`, `v1-beta`; `tools/publish.mjs` เลือกให้) ส่วน `ng add` / `ng update` จะอ่าน `peerDependencies` แล้วเลือกเวอร์ชันที่เข้ากับ Angular ของโปรเจคเอง

**"21+" ของ v3:** ผู้ใช้เลือกไม่ปิดเพดาน (2 พ.ย. 2569) แอปบน Angular รุ่นใหม่กว่าติดตั้งได้ทันทีโดยไม่ต้องรอเราออกรุ่น CI ทดสอบ `ng add` กับ Angular 22 และรุ่นล่าสุด ถ้ารุ่นใหม่ทำให้พังจะเห็นใน CI แล้วค่อยแก้ใน 3.x ถ้าเป็น breaking หนักจริงค่อยแยกเป็น v4

**สิ่งที่ต้องรู้:**
- ตามรอบ support 18 เดือนของ Angular ตอนนี้ Angular 15–19 หมด support จาก Google แล้ว v1 จึงควรเป็น **maintenance line** คือแก้บั๊กและมี component หลักครบ แต่ฟีเจอร์ใหม่บางตัวอาจมีแค่ใน v2/v3
- **Node:** ทั้ง repo ใช้ Node 24 LTS ตัวเดียว ไม่ต้องสลับเวอร์ชัน ตรวจแล้วบนเครื่องนี้ว่า Angular CLI 15 และ 19 รันบน Node 24.11 ได้ (ขึ้นแค่คำเตือน "Unsupported") และ แอป A (Angular 15) build บนเครื่องนี้ได้ แต่ Google ไม่ได้รับรอง Angular 15–20 บน Node 24 อย่างเป็นทางการ CI จึงต้อง build v1/v2 บน Node 24 ทุกครั้ง ใช้รุ่น LTS เสมอ ไม่ใช้ Node รุ่นเลขคี่
- **รองรับผู้ใช้ตั้งแต่ Node 18:** library รันในเบราว์เซอร์ Node จึงมีผลแค่กับ schematics (`ng add` / `ng update`) ซึ่งจะ compile ให้รันบน Node 18 ได้ (ไม่ใช้ API ของ Node 20+) และ CI มี job ทดสอบติดตั้งจริงบน Node รุ่นต่ำสุดของแต่ละรุ่น ข้อจำกัดคือ Node 18 ใช้ได้แค่ v1 และ v2 ที่อยู่บน Angular 18–19 เพราะ Angular 20 และ 21 เองต้องใช้ Node 20.19 ขึ้นไป

---

## 4. โครงสร้าง repo (pnpm monorepo)

```
WiraUI/                      (โครงจริงหลัง Phase 0)
├─ packages/
│  ├─ core/              @wiraui/core: token engine, presets, exporters/importer, locale th/en,
│  │                     ปฏิทิน พ.ศ., ตรวจเลขบัตรประชาชน (TS ล้วน, ถูก copy เข้าทุก build เป็น wiraui/core)
│  ├─ themes/            scss/ (_index ไว้ @use … with, _api, _color, _data ที่ generate จาก core)
│  │                     + script สร้าง CSS สำเร็จรูป 4 preset × 18 สี + parity test กับ core
│  ├─ styles/            CSS ของ component ที่ทั้ง 3 รุ่นใช้ไฟล์เดียวกัน
│  ├─ angular-common/    ส่วนที่เหมือนกันทุกรุ่น: config (provideWiraUI, WuThemeService, ล็อกรุ่น),
│  │                     presets, module/type ของ component (ใช้ API ที่มีตั้งแต่ Angular 15)
│  ├─ angular-signal/    component แบบ signal ที่ v2 และ v3 ใช้ร่วมกัน
│  ├─ angular-v1/        src/ = component แบบ @Input/*ngIf + build shell (Angular 15 toolchain)
│  ├─ angular-v2/        build shell (Angular 18 toolchain) + overlay/
│  ├─ angular-v3/        build shell (Angular 21 toolchain) + overlay/ (provideEnvironmentInitializer)
│  └─ schematics/        ng add (compile เป็น .cjs สำหรับ Node 18 / devkit 15)
├─ apps/                 npm project แยกทั้งหมด ติดตั้ง wiraui จาก tarball แบบเดียวกับแอปจริง
│  ├─ docs/              เว็บแนะนำ: Angular 21 แบบ NgModule, โหลด v1/v2/v3 แบบ lazy (ข้อ 10.1)
│  └─ playground-v1/ playground-v2/ playground-v3/   Angular 15 / 19 / 21 หลังรัน ng add
├─ e2e/                  Playwright: playground ทั้ง 3 ต้องหน้าตาตรงกัน + เว็บ docs
└─ tools/                versions.mjs (ช่วง Angular ของแต่ละรุ่น), sync-sources, setup-playgrounds,
                         build-docs-packages, dry-run-ng-add, finish-package
```

ใน workspace แต่ละ build shell มีชื่อ package ไม่ซ้ำกัน แต่ตอน publish script จะตั้งชื่อเป็น `wiraui` ตัวเดียวกันในคนละ major

**โครงของแพ็กเกจที่ผู้ใช้เห็น** (ใช้ secondary entry point แบบ `primeng/button`)

```
wiraui/config      provideWiraUI, WiraUIModule, definePreset, defineOverrides, palette, WuThemeService
wiraui/button      WuButton, WuButtonModule
wiraui/table       WuTable, WuTableModule …       (หนึ่ง entry ต่อหนึ่ง component)
wiraui/alert       WuAlertService (แทน sweetalert2)
wiraui/thai        wu-thai-id-input, wu-thai-address, pipe ภาษาไทย
wiraui/theme       SCSS (_index.scss, _api.scss)
wiraui/themes/     CSS สำเร็จรูป เช่น wira/teal.css, wira/blue.css
wiraui/locale/     th, en
```

### การแชร์โค้ดระหว่าง 3 รุ่น (เรื่องที่กำหนดภาระดูแลระยะยาว)

| ชั้น | แชร์ | หมายเหตุ |
|---|---|---|
| Token, palette, SCSS และ CSS ของ component | 100% | class name และโครง DOM เหมือนกันทุกรุ่น **ธีมไฟล์เดียวจึงใช้ได้ทั้ง 3 รุ่น** รวมถึงไฟล์ที่ export จาก Designer |
| Logic ล้วน (`@wiraui/core`) | 100% | ย้าย logic มาไว้ที่นี่ได้มากเท่าไร component ฝั่ง Angular ก็ยิ่งบาง |
| Component Angular v2 ↔ v3 | เกือบ 100% | ใช้ signal API ชุดเดียวกัน ส่วน v3 มี overlay เฉพาะ (Signal Forms, test แบบ zoneless) |
| Component Angular v1 | เขียนแยก | แปลงแบบตรงไปตรงมา: `input()` → `@Input()`, `model()` → `@Input` + `@Output() xChange`, `@if` → `*ngIf` |

ลำดับการทำแต่ละ component คือ เขียนใน `angular-signal` → พอร์ตลง v1 → E2E ชุดเดียวกันต้องผ่านทั้ง 3 playground

> ทางเลือกที่ไม่เลือก: เขียนแบบ v1 ชุดเดียวแล้วใช้กับทุกรุ่น ทำได้เพราะ linker รองรับ แต่ผู้ใช้ v2/v3 จะไม่ได้ signal API และ Signal Forms ซึ่งเป็นเหตุผลหลักของการแยกรุ่น

---

## 5. การติดตั้ง (ง่ายแบบ UI library เดิม)

```bash
ng add wiraui
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
? Icon set                       (ตรวจพบ icon font เดิม)   › icon font เดิม · Font Awesome · ไม่ติดตั้ง
```

**โหมดอัตโนมัติ:** `ng add wiraui --defaults` ใช้ค่าที่ตรวจพบกับค่าเริ่มต้นทั้งหมดโดยไม่ถาม และทุกข้อส่งเป็น flag ได้ เช่น `--style=scss --standalone=false --primary=#00a86b`

**ตรวจจากอะไร**

| ข้อ | ตรวจจาก |
|---|---|
| รุ่น Angular → major ของ wiraui | `@angular/core` ใน `package.json` (`ng add` เลือกเวอร์ชันให้ ส่วน schematic ตรวจซ้ำอีกรอบ) |
| ภาษาสไตล์ | `angular.json` → `schematics["@schematics/angular:component"].style` / `inlineStyleLanguage` / นามสกุลไฟล์ `styles` |
| standalone หรือ NgModule | `main.ts` มี `bootstrapApplication(` หรือ `bootstrapModule(` |
| มี UI library เดิม อยู่แล้ว | `primeng` ใน dependencies → เปิดโหมดอยู่ร่วมกัน และแสดงลิงก์คู่มือย้ายจาก UI library เดิม |
| ฟอนต์ / icon ที่มีอยู่ | `styles.*` และ `angular.json` |

**ไฟล์ที่ schematic จะแก้หรือสร้าง**

| | สิ่งที่ทำ |
|---|---|
| NgModule | เพิ่ม `provideWiraUI(...)` ใน `providers` ของ `app.module.ts` |
| Standalone | เพิ่ม `provideWiraUI(...)` ใน `app.config.ts` (หรือใน `bootstrapApplication` ของ `main.ts`) |
| SCSS / Sass | สร้าง `src/theme/wiraui.theme.scss` แล้วเพิ่ม `@use 'theme/wiraui.theme';` เป็นบรรทัดแรกของ `styles.scss` |
| CSS / Less / อื่น ๆ | เพิ่มไฟล์ CSS สำเร็จรูปของ preset และสีที่เลือกลงใน `angular.json` → `styles` (CSS variables ใช้ได้กับทุก preprocessor) |
| ทุกแบบ | สร้าง `src/theme/wiraui.overrides.ts` (ไฟล์ override ฝั่ง TS ซึ่งเริ่มต้นว่าง) แล้วผูกกับ provider |
| ทุกแบบ | ติดตั้งฟอนต์และ icon ตามที่เลือก แล้วพิมพ์ "ขั้นตอนถัดไป" |

`ng update wiraui` ใช้ตอนอัปเกรด Angular ข้ามช่วง (เช่น 17 → 18 ก็ขยับ v1 → v2) และรัน migration ให้ถ้ามี API เปลี่ยน ส่วนการติดตั้งแบบ manual มีคู่มือบนเว็บแนะนำแยกเป็นแท็บ CSS / SCSS / TS

---

## 6. ระบบธีม

### 6.1 Token 3 ชั้น (ทุกช่องทางสุดท้ายออกมาเป็น CSS variable `--wu-*`)

| ชั้น | ตัวอย่าง | CSS variable |
|---|---|---|
| primitive | palette emerald 50–950, radius scale, spacing scale | `--wu-emerald-500`, `--wu-radius-md` |
| semantic | primary, surface, success/info/warn/danger/help, text, border, focus ring, form field, overlay (มีค่า light/dark) | `--wu-primary-500`, `--wu-text-color`, `--wu-form-field-padding-y` |
| component | ค่าของแต่ละ component ที่อ้างถึง semantic ได้ด้วย `{primary.600}` | `--wu-button-padding-x`, `--wu-card-body-gap`, `--wu-table-row-height` |

token ทุกตัวประกาศบน `:root` ส่วน CSS ของ component ใช้แค่ `var(--wu-*)` อย่างเดียว CSS โครงสร้างของ component แถมมากับ component (ไม่ต้อง import แยกแบบ `primeng.min.css` สมัยก่อน และถูก tree-shake อัตโนมัติ) ไฟล์ธีมจึงมีแต่ค่า token

### 6.2 ลำดับการชนะ (CSS `@layer`)

```css
@layer wiraui.tokens, wiraui.components, wiraui.overrides;
```

```
แพ้   wiraui.tokens       ← ธีมหลักจาก SCSS / CSS (หรือ preset จาก TS ถ้าไม่ใช้ไฟล์)
      wiraui.components   ← CSS ของ component (ใช้ var() อย่างเดียว)
      wiraui.overrides    ← override จาก TS / WuThemeService
      CSS ของแอปเอง          ← ไม่อยู่ใน layer จึงชนะทั้งหมดโดยไม่ต้องใช้ !important
ชนะ   [tokens] / wuTheme     ← เฉพาะ element นั้นและลูกของมัน
```

แบบนี้ **ธีมหลักยัง import ผ่าน SCSS ได้ และ TS ก็ override ทับได้เสมอ** โดยไม่ต้องสนลำดับการ import ส่วนตัว injector ฝั่ง TS จะใส่บรรทัดประกาศลำดับ layer ไว้บนสุดของ `<head>` ให้

### 6.3 ทาง A — CSS

```jsonc
// angular.json
"styles": [
  "node_modules/wiraui/themes/sila-light-teal/theme.css",  // v1: แทน primeng/resources/themes/lara-light-teal/… (ตารางเทียบชื่อใน §12.8)
  // "node_modules/wiraui/themes/mali/emerald.css",        // v2/v3: <preset>/theme.css หรือ <preset>/<สี>.css
  "src/styles.css"
]
```

แต่ละรุ่นมีไฟล์สำเร็จรูปเฉพาะธีมของรุ่นตัวเอง (ดู 6.10)

### 6.4 ทาง B — SCSS (ไฟล์แบบที่ Designer export ให้)

```scss
// src/theme/wiraui.theme.scss
@use 'wiraui/theme' with (
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
@use 'theme/wiraui.theme';
```

ไฟล์ SCSS ของ component ในแอปใช้ helper ได้ผ่านโมดูล API (โมดูลนี้ไม่ปล่อย CSS ซ้ำ):

```scss
@use 'wiraui/theme/api' as wu;

.student-card {
  border-color: wu.token(primary-300);   // → var(--wu-primary-300)
  @include wu.dark { border-color: wu.token(primary-700); }
  @include wu.media(md) { padding: 1rem; }
}
```

### 6.5 ทาง C — TypeScript

**C1. ใช้ไฟล์ SCSS/CSS เป็นธีมหลัก แล้ว override บางค่าด้วย TS** (แบบที่ `ng add` ตั้งให้)

```ts
// src/theme/wiraui.overrides.ts
import { defineOverrides, palette } from 'wiraui/config';

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

**C2. ใช้ TS อย่างเดียวโดยไม่มีไฟล์ธีม** (คล้าย UI library เดิม v17+ styled mode)

```ts
provideWiraUI({
  preset: definePreset(Wira, { semantic: { primary: palette('{emerald}') } }),
});
```

ถ้าใช้ทั้งไฟล์ธีมและ `preset` พร้อมกัน ใน dev mode จะมีคำเตือน (ไฟล์ SCSS/CSS ฝัง `--wu-theme-source` ไว้ให้ runtime ตรวจได้)

### 6.6 เปลี่ยนธีมตอน runtime

```ts
const theme = inject(WuThemeService);
theme.setPrimary('#2563eb');
theme.setDarkMode(true);
theme.patch({ components: { button: { borderRadius: '999px' } } });
```

service ตัวนี้ใช้ทำ configurator บนเว็บแนะนำ (แบบรูปที่ 3) และ Designer ก็ใช้โค้ดชุดเดียวกัน

### 6.7 ธีมเฉพาะจุด

```html
<!-- เฉพาะการ์ดใบนี้ -->
<wu-card [tokens]="{ bodyGap: '0', borderRadius: '1rem' }">…</wu-card>

<!-- ทั้งโซน เช่น ฝั่ง admin ใช้สีหลักอีกสี -->
<section wuTheme [tokens]="{ primary: '#e11d48' }">…</section>
```

### 6.8 Dark mode

ตั้งได้ 3 แบบ: `'none'` (ปล่อยแค่ค่า light), `'class'` (สลับด้วย `.wu-dark` บน `<html>`) และ `'media'` (ตาม `prefers-color-scheme`) ค่า dark ได้มาจากการคำนวณจาก light อัตโนมัติ และแก้ทีละ token ได้ใน Designer

### 6.9 Liquid Glass (หน้าตาหลักของ v3)

v3 มี preset ใหม่ชื่อชั่วคราวว่า **Glass** เป็นค่าเริ่มต้น: พื้นผิวโปร่งแสงแบบกระจก เบลอสิ่งที่อยู่ข้างหลัง มีขอบสะท้อนแสง และใช้ชุดสีที่สดกว่าเดิม (สีไล่เฉดได้)

**ใช้กระจกตรงไหน:** เฉพาะชั้นที่ลอยอยู่เหนือเนื้อหา ได้แก่ menubar/toolbar, dialog, toast, popover, panel ของ select/datepicker, แถบ tabs, segmented และปุ่ม variant `glass` ส่วนเนื้อหาหลัก (table, ช่องกรอก, ข้อความยาว) ยังเป็นพื้นทึบหรือโปร่งเล็กน้อย เพื่อให้อ่านง่ายและผ่าน contrast ซึ่งเป็นแนวเดียวกับ Liquid Glass ของ Apple ที่ใช้กระจกกับชั้น control/navigation

**token กลุ่ม glass (ต้องอยู่ใน schema ตั้งแต่ Phase 0 แม้ preset จะมาทีหลัง)**

| token | ตัวอย่างค่า |
|---|---|
| `material` | `'solid'` \| `'glass'` |
| `--wu-glass-bg` | `rgba(255,255,255,.55)` · dark `rgba(15,23,42,.45)` |
| `--wu-glass-blur` / `--wu-glass-saturate` | `20px` / `180%` |
| `--wu-glass-border` | `rgba(255,255,255,.6)` |
| `--wu-glass-highlight` | `inset 0 1px 0 rgba(255,255,255,.7)` (ขอบสะท้อนแสงด้านบน) |
| `--wu-glass-shadow` | `0 8px 32px rgba(15,23,42,.18)` |
| `--wu-primary-gradient` | `linear-gradient(135deg, #7c3aed, #06b6d4)` |
| `--wu-backdrop` | พื้นหลังแอปแบบ mesh gradient เพื่อให้กระจกมีอะไรให้เบลอ |

**สิ่งที่ library ต้องจัดการให้**
- ถ้าเบราว์เซอร์ไม่รองรับ `backdrop-filter` (ตรวจด้วย `@supports`) หรือผู้ใช้ขอลดความโปร่งใส (`prefers-reduced-transparency` ในเบราว์เซอร์ที่รองรับ) ให้ถอยเป็นพื้นทึบอัตโนมัติ และมีตัวเลือก `glass: false` ใน `provideWiraUI` ส่วน Safari รุ่นเก่าต้องใส่ `-webkit-backdrop-filter` ด้วย ซึ่ง mixin จะใส่ให้
- blur ใช้ GPU หนักบนมือถือรุ่นเล็ก จึงใช้กับ element ขนาดไม่ใหญ่ และไม่ซ้อนกระจกหลายชั้น
- contrast บนกระจกขึ้นกับสิ่งที่อยู่ข้างหลัง ตัวตรวจ contrast ใน Designer จึงต้องวัดกับพื้นหลังกรณีแย่ที่สุด (ส่วนที่สว่างสุดและมืดสุดของ backdrop) และกำหนดความทึบขั้นต่ำของ `--wu-glass-bg`
- Glass เป็นแค่ token + CSS ชุดเดิม (class name ไม่เปลี่ยน) จึงเปิดใช้ใน v2 ได้ทางเทคนิค ข้อเสนอคือให้เป็นค่าเริ่มต้นของ v3, ให้ v2 เปิดเองได้ และไม่รวมใน v1 ที่เป็น maintenance line

---

### 6.10 หน้าตาแยกตามรุ่น (ย้ายจาก UI library เดิม แล้วไม่พัง)

แต่ละรุ่นหน้าตาเหมือน UI library เดิม ยุคเดียวกัน ทั้งขนาด ระยะ และสี เพื่อให้แอปเดิม (TP-APPS, SS-APPS, …) ย้ายมาแล้ว layout ไม่ขยับ ส่วนธีมใหม่ของ WiraUI เองเริ่มที่ v3

| รุ่น | family (หน้าตา) | preset | ธีมสำเร็จรูป | ค่าเริ่มต้น |
|---|---|---|---|---|
| v1 | UI library เดิม 15–17 | `sila-classic`, `arun`, `sayan`, `ratri`, `material-classic` | 25 ธีม (เทียบกับชื่อเดิมใน §12.8): `sila-light-*`, `sila-dark-*`, `arun-*`, `sayan-*`, `ratri-*`, `md-light-*`, `md-dark-*` และ `sila-light-wira` (สีเขียวที่แอป Wirabyte ส่วนใหญ่ใช้) | `sila-light-teal` |
| v2 | UI library เดิม 18–20 | `mali`, `sila`, `material`, `phet` | `<preset>/theme.css` + 18 สี | `mali` |
| v3 | UI library เดิม 21 + ของ WiraUI | v2 + `wira`, `lanna`, `siam`, `nakhon`, `glass` | เหมือน v2 | `mali` |

- **ทำงานอย่างไร:** CSS ของ component มีชุดเดียวใช้ทุกรุ่น ส่วนหน้าตามาจาก token ของ family (`packages/core/src/families.ts` ตัวเลขจากธีม MIT ของ UI library เดิม เช่น ปุ่ม Sila 15 padding `.75rem 1.25rem` ตัวหนา 700, ปุ่ม Mali `.5rem .75rem` น้ำหนัก 500) ทุก family ต่อยอดจาก Mali จึงมี token ชุดเดียวกันครบ (มี test ตรวจว่า CSS ทุกไฟล์ใช้แต่ token ที่ทุกธีมประกาศ)
- **`VERSION_CATALOG`** ใน core บอกว่ารุ่นไหนมี preset/ธีมอะไร ใช้ร่วมกันโดย `ng add` (ถามเฉพาะธีมของรุ่นนั้น), ไฟล์ CSS สำเร็จรูป, SCSS (`@use 'wiraui/theme'` ไม่ใส่อะไรได้ค่าเริ่มต้นของรุ่น) และเว็บ docs
- **ธีมมืดล้วน** (`scheme: 'dark'` เช่น sayan, ratri, sila-dark) ใส่ค่ามืดเป็นค่าเดียว ไม่มี block `.wu-dark` เหมือน UI library เดิม 15 ที่สลับธีมด้วยการเปลี่ยนไฟล์ ส่วน overrides จาก TS อ่าน `--wu-scheme` จากไฟล์ธีมเองจึงทับถูกที่
- **ชื่อ class ของ UI library เดิม:** DOM มี class `p-*` ของยุคนั้นคู่กับ `wu-*` เช่น v1 ปุ่ม warn มี `p-button-warning` และ checkbox ที่เลือกมี `.p-checkbox-box.p-highlight`, switch เป็น `p-inputswitch` ส่วน v2/v3 ใช้ `p-button-warn`, `p-checkbox-checked`, `p-toggleswitch` CSS ของแอปที่เขียนทับ `.p-button`, `.p-card-body`, `.p-highlight` อยู่แล้วจึงยังทำงาน (CSS ของแอปไม่อยู่ใน layer จึงชนะ) class ของ checkbox/radio/switch อยู่บน wrapper รอบกล่อง ไม่ใช่บน `<label>` เพราะ UI library เดิม กำหนดขนาด `.p-checkbox` ไว้ตายตัว ถ้าแอปยังโหลด CSS ของ UI library เดิม ระหว่างย้ายจะไม่บีบข้อความ label
- **ตัวแปร CSS ของ UI library เดิม:** ไฟล์ธีม v1 สร้าง `--primary-color`, `--surface-ground`, `--surface-border`, `--text-color`, `--green-500`, … ส่วน v2/v3 สร้าง `--p-primary-color`, `--p-surface-0…950`, `--p-content-border-radius`, `--p-<สี>-<เฉด>`, … (`compat.ts`) โดยอ้างกลับไปที่ `--wu-*` จึงเปลี่ยนตามธีม และค่า component บางตัวอ่านค่าที่แอปตั้งแบบ UI library เดิม ก่อน เช่น `--p-card-body-gap: 0` ของ แอป B ยังได้ผล
- **สีตัวอักษรบนปุ่มหลัก:** family แบบ UI library เดิม ใช้ตัวอักษรขาวเสมอเหมือนต้นฉบับ (เช่นบน `#00a86b` ของ แอป A) ส่วน family Wira เลือกสีที่อ่านง่ายกว่าอัตโนมัติ (`*-contrast-auto`) และตั้งเองได้ด้วย `primaryContrast` (Designer, SCSS `$primary-contrast`, TS `semantic.primaryContrast`) ธีมสีส้มของ Arun/Sayan/Ratri ใช้ตัวอักษรเข้มแบบ UI library เดิม
- **ตัวเลือกแบบ UI library เดิม 18+:** `provideWiraUI({ darkModeSelector: '.my-dark' | 'system' | 'none' })` ใช้ชื่อเดียวกับ UI library เดิม แอปที่ตั้ง `.non-dark-selector` (ไม่มีวันเป็นมืด) ใช้ได้เลย
- **โหมดมืดแบบนวล:** ทุก family ใช้ชุดสีมืดเดียวกัน (`SOFT_DARK` ใน `families.ts`) ที่ยกพื้นขึ้นจากของ UI library เดิม หนึ่งขั้น (พื้นหน้าระหว่าง surface 900 กับ 800, การ์ด 800) และใช้ตัวอักษร surface 200 แทนสีขาว contrast จึงเหลือราว 11:1 แทน 20:1 ยังผ่าน WCAG AAA
- **ขนาดตัวอักษรเป็น rem** และระยะทั้งหมดคูณ `--wu-density` แอปที่ตั้ง `html { font-size: 14px }` แบบ UI library เดิม จึงย่อทั้งชุดเหมือนเดิม

### 6.11 Utility class ในตัว (`wiraui/utils`)

แทน utility library ที่แอปเดิมต้องติดตั้งแยก (ในแอปเราใช้หนักมาก เช่น แอป A ใช้ `col-12` ราว 3,300 ครั้ง, `grid` 1,200, `md:col-*` หลายร้อย) โดยใช้ **ชื่อ class เดิม** template จึงไม่ต้องแก้

- **มีอะไรบ้าง:** grid 12 คอลัมน์ (`grid`, `col-N`, `col-offset-N`, `grid-nogutter`), flex, spacing (`p/m` + `t r b l x y`, สเกล 0–8, ค่าติดลบ, auto), sizing, typography, สีตามธีม (`surface-card`, `text-color-secondary`, `bg-primary`, `text-gray-*` = surface ของธีม), palette สีคงที่, border/radius ตาม token, shadow, position, overflow, form layout (`field`, `field-checkbox`, `formgrid`)
- **Mobile-first:** class ปกติคือขนาดมือถือ ส่วน `sm:` `md:` `lg:` `xl:` (576/768/992/1200px) มีผลจากความกว้างนั้นขึ้นไป
- **ตามธีม:** สี, radius และ shadow อ่าน `--wu-*` จึงเปลี่ยนตาม preset และโหมดมืดเอง ระยะ gutter ของ grid ปรับตอน runtime ได้ด้วย `--wu-grid-gutter`
- **ลำดับ layer:** `@layer reset, wiraui.tokens, wiraui.components, wiraui.utilities, wiraui.overrides` (`reset` มีไว้ให้แอปห่อ CSS reset ของตัวเอง เช่น `button { font: inherit }` ไม่ให้ชนะ style ของ component) utility จึงชนะ style ของ component (เช่น `class="p-0"` บน component) แต่แพ้ CSS ของแอปเอง ไฟล์ utility ประกาศลำดับ layer เต็มไว้บนสุดด้วย โหลดก่อนธีมก็ไม่เพี้ยน
- **เปิด/ปิด:** `ng add` ถามว่าจะเพิ่มไหม (`--utils=false` เพื่อข้าม) แบบ SCSS ใส่ `@use 'wiraui/utils';` ใต้บรรทัดธีม แบบ CSS ใส่ `node_modules/wiraui/utils/utils.css` ใน angular.json ปิดทั้งหมดได้ด้วยการลบบรรทัดนั้น หรือเลือกเฉพาะบางกลุ่มใน SCSS:

```scss
@use 'wiraui/utils' with (
  $groups: (palette: false, shadows: false),  // ปิดบางกลุ่ม
  $prefix: 'u-',                                // .u-flex, .md:u-col-6 ถ้าต้องใช้คู่กับ library อื่นระหว่างย้าย
  $responsive: true,
  $layer: 'wiraui.utilities',                // false = ไม่ใส่ layer
  $important: false
);
```

- **ขนาด:** ครบทุกกลุ่ม 157 KB (minified 102 KB, gzip ราว 12 KB) ตัดกลุ่มที่ไม่ใช้ออกได้ใน SCSS

## 7. Theme Designer (แบบ UI library เดิม สมัยก่อน)

Designer เป็นแค่ **ตัวแก้ token** และ preview ใช้ `WuThemeService` ตัวเดียวกับ runtime **สิ่งที่เห็นใน preview จึงตรงกับไฟล์ที่ export 100%**

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
| `wiraui.theme.scss` | ทาง B (`@use … with`) |
| `wiraui.theme.css` | ทาง A (ใส่ใน `angular.json`) |
| `wiraui.preset.ts` / `wiraui.overrides.ts` | ทาง C |
| `wiraui.theme.json` | เก็บไว้ หรือเปิดใน Designer อีกครั้ง |

ทุกไฟล์ฝัง config ไว้ใน comment (`/* wiraui-config: … */`) จึง **import ไฟล์ไหนกลับเข้า Designer ก็ได้โดยข้อมูลไม่หาย** นอกจากนี้มี Share URL (เก็บ state แบบบีบอัดไว้ใน hash), autosave ลง localStorage และปุ่ม "copy วิธีติดตั้ง" ตาม Angular รุ่นที่เลือก

**palette ต้องตรงกันทุกที่:** `palette()` ฝั่ง TS (`@wiraui/core`) กับ `wu.palette()` ฝั่ง Sass ใช้สูตรผสมสีเดียวกัน และมี unit test เทียบผลลัพธ์ทั้งสองฝั่งด้วยชุดสีทดสอบ

---

## 8. การใช้งาน: NgModule และ Standalone

template เหมือนกันทุกรุ่นและทุกแบบ ที่ต่างกันมีแค่การ import

```ts
// NgModule (ใช้ได้ทั้ง v1, v2, v3)
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, WuButtonModule, WuTableModule],
  providers: [
    provideWiraUI({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist' }),
  ],
  // หรือใช้ imports: [WiraUIModule.forRoot({ … })] ถ้าชอบสไตล์ forRoot
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```ts
// Standalone
@Component({
  selector: 'app-student-list',
  standalone: true,                  // ต้องใส่ใน Angular 15–18 ส่วน 19+ เป็นค่าเริ่มต้นอยู่แล้ว
  imports: [WuButton, WuTable, WuSelect],
  templateUrl: './student-list.component.html',
})
export class StudentListComponent {}
```

```html
<wu-table [value]="students" [loading]="loading" [paginator]="true" [rows]="20"
          exportable exportFileName="รายชื่อนักเรียน">
  …
</wu-table>

<!-- save() คืน Promise/Observable ปุ่มจะแสดง loading และกันการกดซ้ำให้เอง -->
<wu-button label="บันทึก" icon="pi pi-check" [action]="save"></wu-button>

<!-- แสดงเป็น "12 มีนาคม 2551" แต่ค่าใน model ยังเป็น Date (ค.ศ.) ปกติ -->
<wu-datepicker [(ngModel)]="birthDate" calendar="buddhist" dateFormat="d MMMM yyyy"></wu-datepicker>
```

`provideWiraUI()` ใช้ได้ทั้งใน `providers` ของ NgModule และ `app.config.ts` ตั้งแต่ Angular 15 ส่วน `WiraUIModule.forRoot()` เป็นทางเลือกสำหรับคนที่คุ้นกับแบบ NgModule

---

## 9. รายการ Component

### P1 — MVP (ครอบคลุม component เกือบทั้งหมดที่ 3 โปรเจคใช้อยู่)

| กลุ่ม | Component | ลูกเล่นที่เพิ่มจาก UI library เดิม |
|---|---|---|
| Button | Button, SplitButton | `[action]` จัดการ loading ให้อัตโนมัติ, `confirm="…"` ถามยืนยันในตัว |
| Data | **Table**, Paginator | export Excel/CSV, เลือก/ซ่อน/ลากคอลัมน์และจำค่าไว้ (`stateKey`), แสดงเป็นการ์ดบนมือถือ, แถว skeleton ขณะโหลด, empty state ในตัว, server-side ส่ง event เดียว `(query)` = {page, size, sort, filters}, action bar ตอนเลือกแถว, inline edit |
| Form | InputText, Textarea, InputNumber, InputMask, Password, Checkbox, RadioButton, ToggleSwitch, FloatLabel / IftaLabel | ปุ่มล้างค่า, นับตัวอักษร, prefix/suffix, จัดรูปแบบเงินบาท |
| Form | **Select**, **MultiSelect** | ค้นหาจาก server พร้อม debounce (`[search]` คืน Observable/Promise), virtual scroll, จัดกลุ่ม, ตัวเลือก "เพิ่มใหม่" |
| Form | **DatePicker** | **พ.ศ. ในตัว** (ทั้งพิมพ์และแสดง), locale ไทยเป็นค่าเริ่มต้น, ช่วงวันสำเร็จรูป ("7 วันล่าสุด", "เดือนนี้"), โหมดปีการศึกษา/ภาคเรียน |
| Panel | **Card**, Fieldset, Accordion, Tabs, Divider | Card แบบ outlined / elevated / glass, slot สำหรับ action ที่ header, สถานะ loading |
| Overlay | **Dialog**, ConfirmDialog, Popover, Tooltip | `WuDialogService.open(Component, { data })` คืน Promise ของผลลัพธ์, ซ้อนหลายชั้นได้, เต็มจอบนมือถือ |
| Messages | Toast, Message | Toast มีปุ่ม action (เช่น "เลิกทำ"), แถบเวลา, หยุดนับเมื่อเอาเมาส์ชี้, รวมข้อความซ้ำ |
| Menu | Menu, Menubar | — |
| Misc | Skeleton, ProgressBar, ProgressSpinner, Tag, Badge, Avatar | — |

### W — ของเฉพาะ WiraUI (มาจากสิ่งที่โปรเจคเราเขียนเองซ้ำ ๆ)

| Component / Service | แทนอะไร |
|---|---|
| `WuAlertService` — `await alert.confirm({ title: 'ลบข้อมูล?', severity: 'danger' })`, `alert.loading()`, `alert.success()` | `Swal.fire` ราว 219 จุด ได้ธีมเดียวกับระบบ |
| `wu-loading` (block UI / overlay) | `dialog-loading` |
| `wu-empty-state` | `empty-state`, `news-empty` |
| `wu-file-upload` แบบลากวาง + preview รูป/PDF + crop รูป | `file-upload` และ `ngx-image-cropper` |
| `wu-thai-id-input` จัดรูปแบบ 1-2345-67890-12-3 และตรวจ checksum | หน้า `th-identify-id` และฟอร์มรับสมัคร |
| `wu-thai-address` จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์ (โหลดข้อมูลแบบ lazy) | ฟอร์มที่อยู่ |
| `wu-academic-term-picker` ปีการศึกษา/ภาคเรียน | ระบบโรงเรียน |
| `wu-stat-card`, `wu-page-header` | หน้า dashboard และหัวหน้าเพจ |
| pipe: `wuDate` (พ.ศ.), `wuBahtText` (หนึ่งร้อยบาทถ้วน), `wuThaiPhone` | โค้ด +543 และ format ที่กระจายอยู่หลายไฟล์ |

### P2 — รอบถัดไป

ทำแล้ว (§12.12–12.16): Chart, Image, Timeline, AutoComplete, Stepper, Drawer, Breadcrumb, Tree, TreeSelect, Listbox, Slider, Rating, ColorPicker, Chip, Galleria, ScrollPanel, Inplace, OrderList, PickList, Editor, FileUpload, SplitButton, TieredMenu, ContextMenu, BlockUI, Scroller ที่เหลือ: TreeTable, InputOtp, Knob, Carousel, DataView, Splitter

- **Chart (ตัดสินแล้ว):** ครอบ Chart.js แบบเดียวกับ UI library เดิม คือ `<wu-chart type="bar" [data]="…" [options]="…">` แอปติดตั้ง `chart.js` เอง (peer dependency แบบ optional) และ component โหลดแบบ lazy สีเริ่มต้นของกราฟ (ตัวอักษร เส้นตาราง palette ของ dataset) อ่านจาก token `--wu-*` จึงเปลี่ยนตามธีมและโหมดมืดเอง
- **Editor (ตัดสินแล้ว):** ทำเองทั้งหมดบน `contenteditable` ไม่พึ่ง TinyMCE (license GPLv2+ ตั้งแต่รุ่น 7) และไม่พึ่ง Tiptap ตามที่ผู้ใช้เลือก รายละเอียดใน §12.15

---

## 10. เว็บแนะนำ (แบบ เว็บเอกสารของ UI library ทั่วไป)

```
/                       หน้าแรก: hero + dashboard ที่ใช้งานได้จริง (แบบรูปที่ 1) + จุดเด่น + Get Started
/installation           ng add / ติดตั้งเอง (แท็บ CSS · SCSS · TS และ NgModule · Standalone)
/configuration          ตัวเลือกของ provideWiraUI
/theming                token, CSS/SCSS/TS, @layer, dark mode, ธีมเฉพาะจุด
/designer               Theme Designer
/locale                 ภาษาไทยและ พ.ศ.
/migration/primeng      ตารางเทียบ p-xxx → wu-xxx และ input ที่ต่างกัน
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

- **ติดตั้งทั้ง 3 รุ่นในแอปเดียว** ด้วยชื่อแฝง (npm alias / pnpm workspace): `wiraui-v1` → wiraui@1, `wiraui-v2` → wiraui@2, `wiraui` → wiraui@3 แล้วให้ `DocsV1Module` import จาก `wiraui-v1/button` เป็นต้น เพราะโหลดแบบ lazy โค้ดของ v1 จึงถูกดาวน์โหลดเฉพาะตอนเข้า `/v1`
- **ทำไมรันได้:** v1 และ v2 เป็น library แบบ partial compilation ที่ linker ของ Angular 21 แปลงให้ได้ (หลักเดียวกับข้อ 3 ที่ว่า library ใช้กับ Angular รุ่นที่ใหม่กว่าได้) แอปหลักเปิด zone.js ไว้ (`provideZoneChangeDetection`) เพื่อให้ v1 ที่อิง zone ทำงานถูก ส่วน peerDependencies ของ v1/v2 ที่ไม่ครอบคลุม Angular 21 ให้ยกเว้นเฉพาะแอป docs ผ่าน `pnpm.peerDependencyRules`
- **dropdown เปลี่ยนรุ่น:** เปลี่ยน prefix ของ URL แต่คงหน้าเดิมไว้ เช่น `/v3/components/button` → `/v1/components/button` ถ้ารุ่นนั้นไม่มี component นี้ (เช่น ของที่มีแค่ใน v3) ให้พาไปหน้ารายการ component ของรุ่นนั้นพร้อมข้อความบอก และจำรุ่นที่เลือกไว้ใน localStorage
- **ธีมไม่ปนกัน:** token ของแต่ละรุ่นผูกกับ element ที่ครอบ route นั้น (`<div data-wu-version="v1">`) แทน `:root` และ Angular ลบ style ของ component ที่ถูกทำลายแล้วออกให้เอง สลับรุ่นแล้วจึงไม่มี CSS ของรุ่นก่อนค้างอยู่
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
| 0 — ฐาน | ท่อทั้งเส้นด้วย component ตัวเดียว (`wu-button`): monorepo, `@wiraui/core`, SCSS/CSS/TS theme, `provideWiraUI`, `ng add`, playground 3 รุ่น, CI (รายละเอียดข้อ 12.1) | ดูเกณฑ์ในข้อ 12.1 |
| 1 — MVP | component P1 (เริ่มใน `angular-signal` → v2/v3 → v1) | **นำร่องที่ แอป C** (ใช้ไม่กี่ component ความเสี่ยงต่ำ) แล้วต่อด้วย แอป B โดยใช้คู่กับ UI library เดิม และย้ายทีละหน้า |
| 2 — เว็บ + Designer | เว็บแนะนำ, Theme Designer ตัวจริงเป็น Angular (ต่อยอดจากต้นแบบ + ปรับขนาดหน้าจอ preview ได้ + export token ไป Figma), configurator, preset Glass ของ v3, เริ่ม Figma UI Kit | ทำธีมของ แอป A (`#00a86b` + Kanit) ใน Designer แล้ว export ไปใช้ได้จริง |
| 3 — ของเฉพาะ WiraUI | กลุ่ม W (Alert, Thai inputs, Table export, …) + P2 บางส่วน | แอปเราไม่ต้องพึ่ง sweetalert2 / buddhist-datepicker / xlsx โดยตรงแล้ว |
| 4 — เครื่องมือย้าย | schematic `ng g wiraui:from-primeng` (เปลี่ยน `p-button` → `wu-button` ฯลฯ ใน component ที่ API ตรงกัน) | ย้าย แอป A (โปรเจคใหญ่สุด, v1) ได้ |

### 12.1 Phase 0 แบบละเอียด

**เป้าหมาย:** ทำท่อให้ครบทั้งเส้นด้วย component ตัวเดียว (`wu-button`) ก่อนจะเริ่มทำ component จำนวนมาก ถ้าท่อนี้ผ่านทั้ง 3 รุ่น งานที่เหลือก็คือการเพิ่ม component ตามแบบเดิม

| ลำดับ | งาน | ได้อะไร |
|---|---|---|
| 1 | ตั้ง repo: pnpm workspace ใน `WiraUI/`, git, โครงโฟลเดอร์ตามข้อ 4, ล็อก Node 24 LTS ตัวเดียว (`.nvmrc` + `engines`), prettier/editorconfig | repo ที่ build ได้ทุก package |
| 2 | `@wiraui/core`: ย้าย `engine.js` + `exporters.js` จากต้นแบบมาเป็น TypeScript ที่มี type ครบ ได้แก่ token schema (รวมกลุ่ม glass), `palette()`, presets, `computeTokens()`, exporters SCSS/CSS/TS/JSON และ `parseImport()` | ตัวคำนวณ token ตัวเดียวที่ runtime, schematics และ Designer ใช้ร่วมกัน |
| 3 | Thai utils ใน core: locale `th`/`en`, ปฏิทิน พ.ศ. (แปลง/แสดง/อ่านค่า), ตรวจเลขบัตรประชาชน พร้อม unit test | ของที่ DatePicker และฟอร์มใน Phase 1 ต้องใช้ |
| 4 | SCSS `wiraui/theme`: `_index.scss` (`@use … with`) ที่ปล่อย `@layer` + `:root` vars, `_api.scss` (`token()`, `dark`, `media`, `glass`) และ `palette()` ฝั่ง Sass ที่ใช้สูตรเดียวกับ TS (มี test เทียบผล) | import ธีมผ่าน SCSS ได้ |
| 5 | script สร้าง CSS สำเร็จรูป: preset × สีหลัก → `themes/<preset>/<color>.css` | ทาง CSS สำหรับคนที่ไม่ใช้ SCSS |
| 6 | `wiraui/config` ในทั้ง 3 รุ่น: `provideWiraUI()`, `WiraUIModule.forRoot()`, `defineOverrides`, `definePreset`, `WuThemeService`, ตัวใส่ style ที่คุมลำดับ `@layer`, คำเตือนใน dev mode, ใช้กับ SSR ได้ | override ธีมด้วย TS ได้ทั้ง NgModule และ standalone |
| 7 | `wu-button` ครบทั้งท่อ: เขียนใน `angular-signal` → sync เข้า v2/v3 → พอร์ตเป็น v1 → build ด้วย ng-packagr ของ Angular 15 / 18 / 21 ได้ entry point `wiraui/button` | พิสูจน์ว่าการแชร์โค้ด 3 รุ่นใช้ได้จริง |
| 8 | schematic `ng add wiraui`: ถามหรือตรวจเอง (ภาษาสไตล์, NgModule/standalone, รุ่น Angular, มี UI library เดิม ไหม, ฟอนต์) แล้วสร้างไฟล์ธีม + `overrides.ts` + ใส่ provider | ติดตั้งด้วยคำสั่งเดียวแบบ UI library เดิม |
| 9 | playground 3 ตัว: v1 = Angular 15 NgModule + SCSS (แบบ แอป A), v2 = Angular 19 NgModule (แบบ แอป B), v3 = Angular 21 standalone + zoneless โดยติดตั้งด้วย `ng add` จาก tarball ในเครื่อง | แอปทดสอบที่โครงเหมือนของจริง |
| 10 | Playwright: spec ชุดเดียวของ `wu-button` รันกับ 3 playground × light/dark พร้อมภาพ baseline | ตรวจว่าทั้ง 3 รุ่นหน้าตาเหมือนกัน |
| 11 | CI: build + test ทุก package บน Node 24 และมี job ติดตั้งจริงบน Node ต่ำสุดของแต่ละรุ่น (18 / 18.19 / 20.19) | กันของพังก่อน merge และยืนยันว่ารองรับ Node 18 จริง |
| 11b | ล็อกรุ่น 3 ชั้น (peerDependencies, schematic, ตรวจตอนเริ่มแอป) + test ว่าติดตั้ง v1 ลง Angular 18 แล้วไม่ผ่าน | ใช้ข้ามช่วงไม่ได้ |
| 12 | โครงเว็บ docs: แอป Angular 21 แบบ NgModule มี dropdown เลือกรุ่น และ `loadChildren` 3 module ที่แต่ละตัวโชว์ `wu-button` จาก wiraui v1 / v2 / v3 | พิสูจน์ว่า v1/v2 รันในแอป Angular 21 ได้จริง ก่อนลงแรงทำเว็บใน Phase 2 |

**จบ Phase 0 เมื่อผ่านทุกข้อ**
- รัน `ng add wiraui` บนแอปใหม่ Angular 15, 19 และ 21 แล้วได้ `<wu-button>` ที่ใช้ธีมได้ทั้ง 3 ทาง (SCSS, CSS, TS)
- override ด้วย TS ชนะธีมจาก SCSS โดยไม่ใช้ `!important` และ CSS ของแอปชนะทั้งสองอย่าง
- ไฟล์ที่ export จาก Designer ต้นแบบใช้กับ playground ทั้ง 3 ตัวได้โดยไม่ต้องแก้
- ภาพ `wu-button` ของ v1/v2/v3 ตรงกัน (pixel diff ต่ำกว่าเกณฑ์)
- `ng add --dry-run` บนสำเนาของ แอป A และ แอป B ให้ผลถูกต้อง โดยไม่แตะ repo จริง
- เว็บ docs ต้นแบบสลับ v1 → v2 → v3 ผ่าน dropdown ได้ ปุ่มของทุกรุ่นทำงาน และไม่มี error ใน console
- CI ผ่าน ทั้ง job บน Node 24 และ job บน Node 18

**ไม่อยู่ใน Phase 0:** component อื่นนอกจาก Button, เว็บแนะนำ, Designer ตัวจริง (ใช้ต้นแบบไปก่อน), preset Glass แบบเต็ม (แต่ token กลุ่ม glass ต้องอยู่ใน schema แล้ว) และการ publish ขึ้น npm จริง (ใช้ tarball ในเครื่องจนกว่าจะตัดสินใจข้อ 13.1)

**ต้องตัดสินใจก่อนเริ่ม:** repo จะอยู่บน GitHub หรือ GitLab เพราะมีผลกับ CI ในลำดับที่ 11 ส่วนข้ออื่นในข้อ 13 รอได้ถึง Phase 1 (ตัดสินแล้ว: GitHub + GitHub Actions)

### 12.2 ผล Phase 0 (24 ต.ค. 2569)

ผ่านทุกเกณฑ์ที่ทดสอบในเครื่องได้ เหลือแค่ CI บน GitHub ที่จะรู้ผลหลัง push ครั้งแรก

| เกณฑ์ | ผล |
|---|---|
| `ng add` บน Angular 15 / 19 / 21 ได้ `wu-button` ที่ใช้ธีมทั้ง SCSS, CSS และ TS | ผ่าน (playground v1 = SCSS + NgModule, v2 = SCSS + NgModule, v3 = CSS + standalone/zoneless; TS override และ TS preset ทดสอบใน Playwright) |
| TS override ชนะธีมจากไฟล์โดยไม่ใช้ `!important` และ CSS ของแอปชนะทั้งหมด | ผ่าน |
| ไฟล์ที่ export จาก Designer ต้นแบบใช้ได้ทันที | ผ่าน (import กลับได้ทุกรูปแบบ, SCSS compile บน Sass 1.58 และรุ่นปัจจุบันโดยไม่มีคำเตือน) |
| หน้าตา v1 / v2 / v3 ตรงกัน | ผ่าน (screenshot light/dark ของ v1, v2 ต้องตรงกับ v3) |
| `ng add --dry-run` บน แอป A และ แอป B | ผ่าน (`tools/dry-run-ng-add.mjs` รันในหน่วยความจำ ไม่แตะ repo จริง) |
| เว็บ docs สลับ v1 → v2 → v3 ได้ ไม่มี error | ผ่าน (v1 ที่ build ด้วย Angular 15 และ v2 ที่ build ด้วย 18 รันบน Angular 21 ได้จริง) |
| ล็อกรุ่น 3 ชั้น | ผ่าน (npm ERESOLVE, schematic ปฏิเสธ, แอป throw ตอนเริ่มเมื่อบังคับติดตั้ง) |
| CI | เขียนแล้ว รอ push |

**สิ่งที่เจอระหว่างทำ (กันไว้แล้วในโค้ด)**
- npm 10.2.5 (ที่ติดตั้งในเครื่องนี้) มีบั๊ก `Cannot read properties of null (reading 'edgesOut')` เวลาติดตั้งโปรเจค Angular 21 แก้ได้ด้วยการอัปเดต npm
- Angular CLI 21 ใช้ `ng add` กับ tarball ในเครื่อง (`file:`) ไม่ได้ ผู้ใช้จริงติดตั้งจาก registry จึงไม่กระทบ ส่วน CI/สคริปต์ใช้วิธี `npm install <tgz>` แล้ว `ng add wiraui`
- Angular CLI 15 ส่ง path ที่มีช่องว่างให้ npm แบบไม่ใส่เครื่องหมายคำพูด สคริปต์จึงใช้ path แบบ relative
- ng-packagr 21 ใส่ `"type": "module"` ให้ทั้งแพ็กเกจ schematics จึงต้องเป็นไฟล์ `.cjs`
- `angular.json` ของโปรเจคจริงมี trailing comma (แอป A) schematic จึงอ่านแบบเดียวกับ Angular CLI
- Angular 22 ออกแล้ว v3 ยังล็อกไว้ที่ 21 จนกว่าจะทดสอบบน 22 ผ่าน (`tools/versions.mjs`)

### 12.3 Phase 1 ชุดที่ 1: ฟอร์มพื้นฐาน (24 ต.ค. 2569)

Card, InputText, Textarea, Checkbox, RadioButton และ ToggleSwitch เสร็จครบทั้ง v1 / v2 / v3

- **ฟอร์ม:** control ทุกตัวเป็น `ControlValueAccessor` จึงใช้ได้ทั้ง `ngModel` และ Reactive Forms ส่วน InputText/Textarea เป็น directive บน `<input>`/`<textarea>` จริง จึงใช้ value accessor เดิมของ Angular
- **Radio ใน Reactive Forms:** radio หลายตัวใช้ FormControl เดียวกัน แต่ FormControl เขียนค่ากลับไปแค่ตัวที่เปลี่ยน จึงมี registry (`ɵWuRadioRegistry`) คอยบอกตัวอื่นในกลุ่มให้เลิกเลือก แบบเดียวกับที่ Angular ทำกับ radio ปกติ
- **CSS ของ directive:** directive ไม่มี template ไว้แนบ style จึงโหลด CSS ผ่าน `ɵWuStyleLoader` (sync script สร้าง `<name>.styles.ts` จาก `packages/styles/<name>.css`)
- **ทดสอบแล้ว:** Playwright 33 test รวมการเทียบหน้าตา gallery ฟอร์มของทั้ง 3 รุ่น (light/dark), ngModel, Reactive Forms (validation, `patchValue`, กลุ่ม radio, `disable()`) และหน้าฟอร์มในเว็บ docs ที่รัน v1/v2 บน Angular 21
- **ที่เรียนรู้:** แอป zoneless (v3) render รอบถัดไป test ที่อ่านค่าหลังคลิกต้องรอ (`expect.poll`)

**สีตัวอักษรบนปุ่มหลัก (ตัดสินแล้วใน 12.4):** family แบบ UI library เดิม ใช้ตัวอักษรขาวเหมือนต้นฉบับ ส่วน Wira เลือกอัตโนมัติ และตั้งเองได้ด้วย `primaryContrast`

### 12.4 หน้าตาแยกตามรุ่นแบบ UI library เดิม (24 ต.ค. 2569)

ทำตาม feedback ว่าปุ่มทุกรุ่นหน้าตาเหมือนกันและเว็บดู basic: แต่ละรุ่นมีธีมย่อยแบบ UI library เดิม ยุคเดียวกัน (6.10) โดยสำรวจแอป UI library เดิม ทุกตัวใน `E:\Web Applications Coding` ก่อน กลุ่ม v1 (Angular 15/17, Sila จาก Designer เก่า, `#00a86b`/`#4c99e1`/`#8f1403`, Kanit, radius 6px) ใช้ `var(--surface-ground)`, `var(--surface-border)` และเขียนทับ `.p-highlight`, `.p-button`, `.p-card-body`, `.p-datatable-*` ส่วนกลุ่ม v2/v3 (Mali) ส่วนใหญ่ตั้ง `darkModeSelector: '.non-dark-selector'` และอ่าน `--p-surface-*`, `--p-primary-color`, `--p-content-border-radius`

- **core:** `families.ts` (token ของ 8 family), `compat.ts` (ตัวแปร UI library เดิม), `CLASSIC_THEMES` + `VERSION_CATALOG` ใน `catalog.ts`, `themeConfig()` / `themePreset()` / `presetsFor()`, radius scale แบบ UI library เดิม (xs…xl), focus 4 แบบ (ring/outline/inset/bold)
- **Sass:** เขียนใหม่ให้ตรงกับ `computeTokens()` ทั้งค่าและลำดับ (parity test 343 กรณีบน Sass 1.58 และ 1.106 รวมธีม v1 ทั้ง 25 ชื่อ) เพิ่ม `$theme`, `$scheme`, `$primary-contrast`
- **e2e (12.4):** แต่ละรุ่นตรวจหน้าตาเริ่มต้นของตัวเอง (padding/น้ำหนักตัวอักษรของปุ่ม) ส่วนการเทียบ pixel ข้ามรุ่นทำหลังใส่ preset เดียวกัน (ยืนยันว่า CSS ชุดเดียวกันให้ผลเหมือนกันทั้ง Angular 15, 19, 21) และตรวจ class/ตัวแปร UI library เดิม ของแต่ละยุค

### 12.5 โหมดมืดนวล, utility ในตัว, สีองค์กร และ component ชุดง่าย (24 ต.ค. 2569)

- **โหมดมืดนวล** (6.10) และ **`wiraui/utils`** (6.11)
- **สีองค์กร Wirabyte** (จาก wirabyte.com): preset `wira` ใช้น้ำเงินองค์กร `#1e7ae0` บน surface `ink` (`#f6f8fc` … `#070b14`) และ swatch `wira` เป็นสีเดียวกัน ส่วนธีม `sila-light-wira` ยังเป็นเขียว `#00a86b` เพราะทำไว้ให้ตรงกับแอปเดิม
- **Component ชุดง่าย (11 ตัว, ครบ v1/v2/v3):** Tag, Badge, Chip, Avatar + AvatarGroup, Divider, Skeleton, ProgressBar, ProgressSpinner, Message, Panel, Fieldset
  - ทุกตัวมี token ของ family (เช่น Tag แบบ classic เป็นสีทึบ `tag-fill: 100%`, แบบ styled เป็นสีอ่อน `0%`; Panel แบบ classic มีเส้นขอบแยกหัว/เนื้อหา แบบ styled ขอบรอบทั้งกล่อง) และ class `p-*` ของแต่ละยุค (v1 `p-tag-warning`, `p-inline-message-error`, `p-toggleable-content`; v2/v3 `p-tag-warn`, `p-message-error`, `p-panel-content-container`)
  - รับ severity แบบเดิม (`warning`, `error`) ผ่าน `ɵseverity()` กลาง
  - Panel/Fieldset ยุบด้วย `grid-template-rows` (ลื่นทั้ง Chromium, Firefox, Safari 16+) และใส่ `inert` ให้เนื้อหาที่ยุบ กด tab ไม่ถึง
  - ปุ่มไอคอน (ปิด, ลบ, ยุบ/ขยาย) มี `aria-label` จาก locale (`close`, `remove`, `expand`, `collapse`, `loading` เพิ่มใน `WuLocale`)
  - ขนาดของ ProgressBar/Spinner อยู่ที่ host จึงใช้ `style="height: 6px"` ได้เหมือนแอปเดิม
- **ตัวช่วยฟอร์ม (7 entry):** IconField + InputIcon, InputGroup + Addon, FloatLabel, ToggleButton, SelectButton, Rating, Password
  - IconField / InputGroup / FloatLabel ไม่มี state จึงเขียนครั้งเดียวใน `angular-common` (decorator ใช้ได้ทั้ง Angular 15–21) CSS อยู่ใน `inputtext.css` ที่ `wuInputText` โหลดอยู่แล้ว markup เดิมแบบ class ล้วน (`p-input-icon-left`, `p-inputgroup`, `p-float-label`) จึงใช้ได้แม้ไม่ได้ใช้ component
  - `wuInputText` / `wuTextarea` ใส่ class `wu-filled` (และ `p-filled`) เมื่อมีค่า FloatLabel ใช้ตัดสินว่าจะลอยหรือไม่ selector ที่มี `:autofill` ห่อด้วย `:is()` เพื่อไม่ให้ทั้ง rule หายใน browser ที่ไม่รู้จัก
  - ToggleButton / SelectButton แบบ styled เป็นราง + ชิปสีขาวบนตัวที่เลือก แบบ classic เป็นปุ่มที่เปลี่ยนเป็นสีหลัก (สีชิปซ้อนบนสี checked: ชิปโปร่งใสจึงเห็นสีหลัก)
  - Rating ใช้ radio จริงจึงกดลูกศร/ใช้ screen reader ได้, Password แสดงแถบความแข็งแรงใต้ช่องแทน overlay (ไม่บังเนื้อหา ใช้บนมือถือได้)
  - helper กลางของรายการตัวเลือก (`ɵoptionLabel`, `ɵoptionValue`, `ɵoptionDisabled`, `ɵsameValue` + `dataKey`) อยู่ใน `config/forms.ts` เตรียมไว้ให้ Select / Listbox
- **Panel (3 entry):** Toolbar (ไม่มี state เขียนใน `angular-common`), Accordion + AccordionTab, Tabs + TabPanel
  - API แบบหัวข้อเดียว (`<wu-accordion-tab header>`, `<wu-tab-panel header>`) ใช้เหมือนกันทุกรุ่น class ของ DOM ตามยุค (v1 `p-tabview`, `p-accordion-tab-active`; v2/v3 `p-tabs`, `p-accordionpanel-active`)
  - คีย์บอร์ดตาม WAI-ARIA: Accordion ลูกศรขึ้น/ลง/Home/End ระหว่างหัวข้อ, Tabs ลูกศรซ้าย/ขวา/Home/End ข้ามแท็บที่ปิดและเลือกทันที (roving tabindex)
  - responsive: แถบแท็บเลื่อนด้านข้างในตัวเอง (`overflow-x: auto`, scrollbar บาง) ส่วน Toolbar ขึ้นบรรทัดใหม่
- **InputNumber:** แสดงค่าที่จัดรูปแบบแล้ว (`฿1,234.50`, `60 กก.`) และไม่เปลี่ยนข้อความตอนโฟกัส (เปลี่ยนตอนนั้นทำให้การเลือกจาก Tab, คลิก, autofill หรือ `fill()` ของ test runner หาย แล้วตัวเลขที่พิมพ์ไปต่อท้ายค่าเดิม เจอใน e2e) สิ่งที่พิมพ์/วางอ่านแบบผ่อนปรน (ไม่สน `฿` และ `,`) แล้วจัดรูปแบบใหม่ตอนออกจากช่อง จึงไม่ต้องจัดการตำแหน่ง caret ระหว่างพิมพ์ model อัปเดตทุกครั้งที่พิมพ์ ส่วน min/max และจำนวนทศนิยมบังคับตอนออกจากช่อง ตรรกะตัวเลข (`formatNumber`, `parseNumber` รับเลขไทยและค่าที่วาง, `stepNumber` ไม่มีเศษทศนิยมลอย, `clampNumber`) อยู่ใน core มี unit test, `inputmode` numeric/decimal ให้มือถือแสดงแป้นตัวเลข
- **เปลี่ยนภาษาระหว่างใช้งาน:** component ที่แสดงข้อความจาก locale เป็น OnPush จึงต้องรู้ตัวเมื่อเรียก `WuConfig.setTranslation()` รุ่น v1 ใช้ `ɵrefreshOnTranslation()` (markForCheck) ส่วน signal ที่อ่านข้อความใน `computed()` ใช้ signal `language` เป็นตัวกระตุ้น เพราะ computed เก็บค่าไว้ (เจอจากเว็บ docs ที่สลับ TH/EN)
- **แถบแท็บ:** เส้นฐานใช้ `box-shadow: inset` แทน border + margin ติดลบ จึงไม่ล้นแนวตั้งจน scrollbar โผล่ (`overflow-x: auto` บังคับให้แกน y เป็น auto ด้วย)
- **ลำดับถัดไปตามการใช้งานจริง:** นับไฟล์ HTML ในทุกโปรเจคที่ใช้แต่ละ component (24 ต.ค. 2569): Table 449, Dialog 432, Select/Dropdown 437, Toast 194, ConfirmDialog 155, Tooltip 119, InputNumber 116, DatePicker/Calendar 98, Tabs/TabView 64, Accordion 34, Timeline 28, Steps 10 ชุดถัดไปจึงควรเป็น overlay (Dialog, ConfirmDialog/`WuAlertService`, Toast, Tooltip, Popover) แล้ว Select, InputNumber, DatePicker พ.ศ. และ Table แอป v2/v3 ใช้ Tabs แบบ UI library เดิม 18 (`<p-tabs><p-tablist><p-tab>`) อยู่ 41 ไฟล์ ถ้าจะลดงานย้ายควรเพิ่ม API แบบนั้นให้ `wiraui/tabs` ด้วย

### 12.6 DatePicker (24 ต.ค. 2569)

- **ดูจากแอปจริงก่อน:** `dateFormat="dd/mm/yy"` 164 ที่, `hourFormat="24"` 129, `[showSeconds]` 154, `[readonlyInput]` 256, `appendTo="body"` 1,400+ ที่, และ `[isBudhistYear]` 27 ที่ (แอป E, แอป D ใช้ fork ของ datepicker ที่แสดง พ.ศ. พร้อม directive ที่บังคับ `readonlyInput`) จึงรับทั้งหมดนี้ได้ตรงตัว
- **ตรรกะอยู่ใน core ไม่ผูก framework:** `core/src/date.ts` (ตาราง 6 สัปดาห์คงที่ให้ panel ไม่กระโดด, min/max/disabled, หน้าปี 12 ช่องตามทศวรรษที่คนเห็นเช่น 2560–2569, ลูกศร/Home/End/PageUp/PageDown, เวลา wrap 23→00, 12/24 ชม.) และ `DatePickerState` (เลือกวัน/ช่วง/หลายวัน/เดือน/ปี, เวลา, ข้อความในช่อง) มี unit test 32 ข้อ component v1 (decorator, `*ngIf`) กับ v2/v3 (signal, `@if`) จึงเหลือแค่ template กับการจัดการโฟกัส
- **รูปแบบวันที่:** `dateFormat` ใช้ภาษา `dd/mm/yy` เดิม (`classicDateFormat()` แปลงเป็น pattern ของ `formatDate()`) ค่าเริ่มต้นเป็นของ locale พิมพ์ได้ทั้งตรงรูปแบบ, ตัวเลขตามลำดับวัน/เดือน/ปีของรูปแบบด้วยตัวคั่นอะไรก็ได้ (`12/3/2569`, `12-03-69`), เลขไทย, ชื่อเดือนตัวพิมพ์ใดก็ได้ และในโหมด พ.ศ. ปีที่ต่ำกว่า 2300 ถือเป็น ค.ศ. ที่พิมพ์ตามความเคยชิน ค่าที่ใช้ไม่ได้ (นอก min/max) ไม่เข้า model และถูกแทนด้วยค่าเดิมตอนออกจากช่อง
- **เวลา:** ช่อง ชม./นาที/วินาที เป็น `<input>` ที่กดปุ่มขึ้นลง (กดค้างได้), ลูกศรขึ้นลง และพิมพ์ได้ พิมพ์ครบแล้วไปช่องถัดไปเอง (เช่น `45` หรือ `7` ในช่องนาที) เกินช่วงถูกบีบตอนออกจากช่อง `readonlyInput` (ช่องหลัก) กับ `timeReadonlyInput` (ช่องเวลา) แยกกัน รับชื่อ `readOnlyInput` / `timeReadOnlyInput` ด้วย เมื่อมีเวลา panel ไม่ปิดหลังเลือกวัน (ต่างจากต้นฉบับ ตั้ง `hideOnDateTimeSelect` ได้)
- **Overlay:** `ɵWuPopup` ใน `wiraui/config` (ใช้ต่อกับ Select, Dialog) วาง panel ใน top layer ด้วย `popover="manual"` จึงอยู่เหนือ dialog และไม่ถูก `overflow: hidden` ตัด ไม่ต้อง `appendTo` (รับไว้เฉย ๆ) panel อยู่ที่เดิมใน DOM ลำดับโฟกัสจึงถูก กลับด้านขึ้นบนเมื่อด้านล่างไม่พอ ตามช่องเมื่อ scroll บนมือถือเป็น bottom sheet ที่อยู่เหนือแป้นพิมพ์ (visualViewport) วันกว้าง 44px และช่องหลักไม่เรียกแป้นพิมพ์ (`inputmode="none"`)
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
  - `WuTemplate` อ่าน `pTemplate` ด้วย
  - `wiraui/api` export ชื่อเดิม `ConfirmationService`, `MessageService`, `ConfirmEventType`, `SharedModule`, `Message`
  - `WuTooltip` รับ attribute `pTooltip`
  - `WuConfirmDialog` รับ `acceptButtonStyleClass="p-button-success"` และแปลงเป็นปุ่ม WiraUI (`ɵbuttonClass`)
  - selector `wu-confirmDialog`, `wu-overlayPanel` ใช้ได้
- **AlertDialog แทน SweetAlert** (`wiraui/alert`):
  - `import { WuAlert as Swal } from 'wiraui/alert'` แล้วโค้ด `Swal.fire(...)` เดิมทำงานต่อได้
  - รับ option ชื่อเดิม: title, text, html, icon, showCancelButton, reverseButtons, confirmButtonColor, input, inputValidator, preConfirm, timer, didOpen, allowOutsideClick
  - ผลลัพธ์รูปเดิม: isConfirmed, isDenied, isDismissed, value, dismiss
  - มี `showLoading`, `close`, `mixin`, `confirm()` ที่คืน boolean
  - ไอคอน SVG วาดเส้นเอง สีมาจาก semantic token และป้ายปุ่มมาจาก locale
  - static facade หา service ผ่าน root injector ที่ `provideWiraUI()` เก็บไว้
  - เรียก `confirm()` โดยไม่มี `<wu-confirmdialog>` ใน key นั้น จะเปิดเป็น alert แทน คำถามจึงไม่หายเงียบ
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
- **Animate on scroll** (`wiraui/animate`):
  - แทน AOS โดยใช้ attribute เดิม (`data-aos`, `data-aos-delay`, `-duration`, `-easing`, `-offset`, `-once`, `-mirror`, `-anchor-placement`) และชื่อ animation ครบ 27 ชื่อ (fade, zoom, flip, slide)
  - เปิดใช้ด้วย `provideWuAnimate()` (หรือ `WuAnimateModule.forRoot()`) แทน `AOS.init()` หรือใช้ directive `[wuAnimate]`
  - ใช้ IntersectionObserver โดย MutationObserver คอยจับ element ที่เพิ่มทีหลัง
  - ซ่อนเฉพาะ element ที่ script ดูอยู่ (`.wu-aos`) เนื้อหาจึงไม่หายถ้า script ไม่ทำงาน
  - ผู้ใช้ที่ตั้ง reduced motion เห็นทุกอย่างทันที

### 12.8 รอบรีวิวของผู้ใช้: ขนาด, validation, MeterGroup (24 ต.ค. 2569)

- **ขนาดเทียบกับ UI library เดิม จริง:** วัดที่ v17 / v19 / v21 (root 14px)
  - ปุ่มสูง 33px, `sm` 27.5px, `lg` 38.5px, ปุ่มไอคอน 35×33 padding `0.5rem 0.75rem`
  - ของเราสูงกว่าเพราะ Kanit มี line-height `normal` ราว 1.5
  - เพิ่ม token `control-line-height` = 1.2 ใช้กับปุ่ม, input, datepicker, selectbutton, togglebutton
  - ผลที่ root 14px: styled 33 / sm 28 / lg 37px, classic Sila 40 / 35 / 50px (ธีม Lara ของ UI library เดิม v17 วัดได้ 39 / 34.4 / 49.3)
  - ทดสอบแล้วสระ/วรรณยุกต์ไทยใน input ไม่ถูกตัด
- **ขนาดทั้งระบบ:** `scale` ใน `provideWiraUI()` และ `WuThemeService.setScale()`
  - ตั้ง font-size ของ `<html>`: `sm` 12px, `md` 14px, `lg` 16px หรือใส่ตัวเลข px (ช่วงเดียวกับตัวเลือก scale ของเว็บเอกสาร UI library เดิม ที่ค่าเริ่มต้น 14px)
  - เว็บเอกสารเริ่มที่ `md` และมีตัวเลือก "ขนาด UI" ใน Theme panel
- **ขนาดรายตัว:** `size="small"`/`"large"` (หรือ `sm`/`lg`) ใน button, checkbox, radiobutton, toggleswitch, togglebutton, selectbutton, password, inputnumber, datepicker
  - class เดิม `p-button-sm`, `p-inputtext-sm` ใช้ได้
  - มี `<button wuButton>` (อ่าน `pButton`) และ `styleClass="p-button-*"` แปลงเป็น class ของเรา
- **Validation** (`wiraui/validation`):
  - field แดงเองเมื่อ invalid และ (touched หรือ form submitted)
  - `wu-field-error` แสดงข้อความภาษาของ locale
  - validator ไทย: `thaiId`, `thaiPhone`, `match`
- **ปรับหน้าตาตามที่ผู้ใช้ทัก:**
  - Divider ใช้สี `divider-color` (เข้มกว่า border), dotted หนา 2px, ระยะห่าง 0.75rem
  - Fieldset legend เล็กลง และตอนยุบมีที่ว่างใต้ legend
  - Panel: ปุ่มไอคอนใน header ขนาด 2rem และไม่ทำให้ header สูงขึ้น
  - Tabs: padding เล็กลง, ไม่มี scrollbar, มีปุ่มเลื่อนเมื่อแท็บล้น (รับ `scrollable` เดิม)
  - Toolbar (classic) padding 0.75rem
- **CSS reset ของแอปทำปุ่มใหญ่:** เว็บเอกสารมี `button { font: inherit }` ไม่อยู่ใน layer
  - ชนะ `.wu-btn` ใน `@layer wiraui.components` ปุ่มจึงได้ตัวอักษร 15px และ line-height 1.75 ของหน้า (สูง 42–49px)
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
  - MeterGroup (`wiraui/metergroup`) ครบ v1/v2/v3
  - Glass เป็นของ v3 เท่านั้น: preset ไม่อยู่ใน `wiraui/presets` ของ v1/v2 และ `variant="glass"` ของ Card แสดงเป็นการ์ดปกติใน v1/v2
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
- **สีสถานะแยกตาม preset** (ผู้ใช้ต้องการให้เปลี่ยนธีมแล้วโทนเปลี่ยนแบบ UI library เดิม ที่ Aura นวลกว่า Lara):
  - Mali นวล เย็น: emerald, sky, orange, rose, violet
  - Sila สดแบบยุค 2019–2022: `#22c55e`, `#3b82f6`, amber, `#ef4444`, `#a855f7` และปุ่ม secondary สีเทาอมฟ้าทึบตัวอักษรขาว
  - Phet เข้มขึ้นหนึ่งขั้นให้คม
  - Material ใช้ชุดสีของ Material Design
- **สไตล์โค้ดตัวอย่างบนเว็บ:** ตามโค้ดในโปรเจคของทีม (สำรวจ 21 แอป)
  - ทุกรุ่น:
    - boolean เขียน `[modal]="true"`
    - ค่าคงที่เป็น attribute ธรรมดา
    - `<wu-button (onClick)>` และ `[style]="{ width: '480px' }"`
  - v1/v2: `wuTemplate="footer"` กับ `*ngIf`
  - v3: `#footer` กับ `@if`

### 12.9 Select, Paginator และ Table (25 ต.ค. 2569)

- **สำรวจก่อนทำ** (21+ แอปของทีม):
  - `p-dropdown` / `p-select` ใช้ 1,434 ครั้ง
  - `p-table` ใช้ 947 ครั้งใน 449 ไฟล์ ราว 96% แบ่งหน้า/เรียง/ค้นหาฝั่ง browser มี lazy เฉพาะ แอป D
  - CSS ของแอปเขียนทับ `.p-datatable-*` 640 จุด จึงเก็บชื่อ class ของแต่ละยุคไว้
- **Select** (`wiraui/select`, `wu-select` หรือ `wu-dropdown`):
  - **โครงสร้าง:** combobox แบบ select-only ตาม ARIA มี `<input role="combobox">` ที่ซ่อนอยู่รับคีย์บอร์ดและ `<label for>` รายการเปิดใน top layer จึงไม่ต้องใช้ `appendTo`
  - **ค้นหา:** ไทย/อังกฤษไม่สนตัวพิมพ์ เลขไทยเท่ากับ 0–9 ค้นหลายฟิลด์ได้ด้วย `filterBy="name_th,code"`
  - **คีย์บอร์ด:** แบบ native select ทั้งลูกศร, Home/End, PageUp/Down, Enter/Space, Esc, Tab เลือกแถวที่ชี้อยู่ และพิมพ์ตัวอักษรเพื่อหาตอนที่ปิดอยู่ได้ คลิก label แค่ focus ไม่เปิดรายการ
  - **ความสามารถอื่น:** group, `optionDisabled`, `showClear`, `editable`, `loading`, `checkmark`, template item / selectedItem / group / header / footer / empty / emptyfilter / dropdownicon, `dataKey`
  - **ตรรกะ:** อยู่ใน core (`select.ts`) พร้อม unit test
- **Paginator** (`wiraui/paginator`):
  - ปุ่มหน้า และช่องจำนวนแถวต่อหน้าที่ใช้ `wu-select`
  - รายงานภาษาไทยค่าเริ่มต้น `กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ` (ข้อความที่แอปใช้มากที่สุด 188 ครั้ง)
  - บนมือถือซ่อนปุ่มหน้าแรก/สุดท้าย และให้รายงานขึ้นบรรทัดของตัวเอง
- **Table** (`wiraui/table`, `wu-table` หรือ `wu-datatable` ตัวเดียวแบบ p-table):
  - **Template:** รับ `pTemplate="x"`, `wuTemplate="x"` และ `#x`: caption / header / body / footer / emptymessage / summary / loadingbody / paginatorleft / paginatorright / colgroup
  - **Body context:** `$implicit`, `rowIndex` นับต่อเนื่องข้ามหน้า (`{{ i + 1 }}` แบบเดิม), `columns`
  - **ลำดับข้อมูล:** ค้นหา (`filterGlobal`, `filter`) → เรียง → แบ่งหน้า
    - การเรียงใช้ลำดับพจนานุกรมไทย ตัวเลขในข้อความเรียงแบบตัวเลข ช่องว่างไปท้าย
    - เรียงหลายคอลัมน์ได้ด้วย Ctrl/⌘ และ `removableSort`
  - **Directive:** `wuSortableColumn` / `pSortableColumn` + `wu-sortIcon`, `wuSelectableRow` / `pSelectableRow`, `wu-tableCheckbox`, `wu-tableHeaderCheckbox` (เลือกทุกแถวที่ค้นหาเหลือ)
  - **Lazy:** `onLazyLoad` ส่ง `first`, `rows`, `page` (เริ่มที่ 1), การเรียงและตัวกรอง
  - **Loading:** มี mask และ `loadingbody` ส่วน `showLoader` / `loadingIcon` รับได้
  - **หน้าตาและเลย์เอาต์:**
    - `showGridlines` / `stripedRows` / `size` และ class เดิม `p-datatable-sm/-gridlines/-striped`
    - `scrollable` + `scrollHeight` (หรือ `flex`) พร้อมหัวตารางติดบน
    - `responsiveLayout="stack"` + `breakpoint` (ใช้ `.p-column-title` แบบเดิม) ส่วนแบบปกติเลื่อนด้านข้างในตัว
  - **Input ที่รับไว้แต่ไม่ทำอะไร:** `responsive`, `autoLayout`, `resizableColumns`, `reorderableColumns`, `virtualScroll`, `paginatorDropdownAppendTo` … (แอปยังใส่อยู่แต่ไม่มีผล)
  - **ยังไม่ทำ (แอปใช้แทบไม่มี):** row expansion, cell editing, frozen columns, row group, column filter แบบเมนู, export CSV

### 12.10 Menubar และรอบรีวิวหน้าตา (25 ต.ค. 2569)

- **Menubar** (`wiraui/menubar`, `wu-menubar`):
  - **สำรวจ:** แอปส่วนใหญ่ใช้ `p-menubar` เป็นแถบหัวเว็บที่มีแค่ `pTemplate="start"` / `"end"` (ไม่มี model) และวาง `p-menu` popup ไว้ใน end จึงต้องใช้แบบไม่มี model ได้เต็มที่ และรับ `<ng-content>` เป็น end แบบเดิม
  - **Model:** `MenuItem` แบบเดิม (`label`, `icon`, `items`, `routerLink` + ตัวเลือก router, `url`, `target`, `command`, `disabled`, `visible`, `separator`, `badge`, `escape`, `styleClass` …) export เป็น `MenuItem` จาก `wiraui/api` และ `WuMenuItem` จาก `wiraui/config`
  - **Router:** `@angular/router` เป็น optional peer dependency เพราะ entry นี้ entry เดียวที่ import
  - **คีย์บอร์ด:** ตาม ARIA menubar มี tab stop เดียว (roving tabindex) ลูกศรซ้าย/ขวาข้ามรายการบนสุด ลง/ขึ้นเปิดเมนูย่อย ขวาในเมนูย่อยไปเมนูของรายการถัดไป Esc ถอยทีละชั้น พิมพ์ตัวอักษรไทยกระโดดได้
  - **Hover:** `autoDisplay` ค่าเริ่มต้นตามยุค (v1 ต้องคลิกก่อน, v2/v3 hover เปิดเลย) และถ้า hover เปิดอยู่แล้วคลิกจะคงไว้ ไม่ปิดทันที
  - **จอแคบ:** ที่ `breakpoint` (960px) ลงไปมีปุ่มเมนู รายการเป็นแนวตั้งใต้แถบ เมนูย่อยเปิดในที่
  - **เมนูย่อยชนขอบขวา:** เปิดไปทางซ้ายแทน
  - **ตรรกะ:** อยู่ใน core (`menu.ts`) พร้อม unit test
- **รอบรีวิวหน้าตา:**
  - **Focus ของช่องกรอก:** เส้นขอบเป็นสีหลัก และในโหมด ring / outline มีวงจาง ๆ ตามมุมโค้งของช่อง
  - **Select:**
    - ความกว้างมาตรฐาน `--wu-select-width` (14rem) และไม่เกินกรอบ
    - ใช้ width คงที่แทน `min-width: min(…, 100%)` เพราะ WebKit คำนวณค่านั้นเกินคอลัมน์ grid
  - **Select (พฤติกรรม):**
    - คลิกซ้ำเพื่อปิด แม้กดเมาส์ค้างแบบคนจริง (mousedown ไม่ย้าย focus)
    - ระหว่าง `loading` เปิดรายการและเปลี่ยนค่าไม่ได้
  - **Accordion แบบ styled:** เป็นกล่องเดียวมีเส้นคั่นแถว พื้นเดียวกันทั้งหัวและเนื้อหา สีหัวอ่านง่ายขึ้น
  - **Table:** หัวตารางมีพื้นสีอ่อนเด่นจากแถว
  - **Fieldset:** legend มีเส้นขอบและพื้นสีของตัวเอง
  - **Divider:** ข้อความบนเส้นมีมุมโค้ง

### 12.11 ชื่อ tag เดิม, Tabs แบบ value, Menu และ TabMenu (25 ต.ค. 2569)

- **สำรวจ** (นับ tag ในแอปของทีม): `p-calendar` 303, `p-progressSpinner` 191, `p-tabPanel` 161, `p-inputSwitch` 93, `p-menu` 72, `p-tabMenu` 71, `p-tabs`/`p-tablist`/`p-tab` แบบ value 44/44/104
- **ชื่อ tag เดิม (alias):** `wu-calendar` = DatePicker, `wu-inputSwitch` = ToggleSwitch, `wu-progressSpinner` = ProgressSpinner, `wu-tabView` / `wu-tabPanel` = Tabs แบบ index, `wu-accordionTab` = AccordionTab ทำให้ย้ายแอปได้ด้วยการเปลี่ยน prefix อย่างเดียว (CSS เลือก tag ตัวพิมพ์เล็ก ซึ่ง browser เทียบแบบไม่สนตัวพิมพ์)
- **Tabs แบบ value:** `<wu-tabs [(value)]>` + `wu-tablist` / `wu-tab value` / `wu-tabpanels` / `wu-tabpanel value` ใช้ได้ทุกรุ่น (v1 ด้วย เพื่อให้ template ใช้ร่วมกันได้)
  - ถ้ามี `wu-tablist` จะไม่สร้างแถวหัวแท็บจาก panel
  - `[(value)]` เป็น `any` เพื่อผูกกับ field ที่เป็น string, number หรือ union ของแอปได้ใน strict template
- **Menu** (`wiraui/menu`, `wu-menu`):
  - popup เปิดจากปุ่มด้วย `toggle($event)` อยู่ใน top layer (`appendTo` รับไว้แต่ไม่มีผล) หรือเป็นเมนูข้างแบบ inline
  - item ที่มี `items` เป็นกลุ่มมีหัวข้อ (ชั้นเดียว)
  - คีย์บอร์ด: เปิดแล้ว focus รายการแรก ลูกศรข้ามรายการที่ปิด Enter/Space เลือก Esc ปิดแล้วคืน focus ให้ปุ่ม เมนู inline มี tab stop เดียว
- **TabMenu** (`wiraui/tabmenu`, `wu-tabmenu` / `wu-tabMenu`):
  - แท็บจาก menu model มี `[(activeItem)]` ถ้าไม่ใส่ item ที่มี `routerLink` จะดู router แทน
  - ใช้ stylesheet ของ wu-tabs (โหลดให้เอง) ลูกศรย้าย focus เท่านั้น Enter/Space เปิดแท็บ

### 12.12 MultiSelect, InputMask และ Messages (25 ต.ค. 2569)

- **MultiSelect** (`wiraui/multiselect`, `wu-multiselect` / `wu-multiSelect`, แอปใช้ 161 ครั้ง):
  - หน้าตาและ token เดียวกับ Select (โหลด stylesheet ของ select และ checkbox ให้เอง) ค่าเป็น array
  - ค่าเริ่มต้นตามเดิม: `filter` และ `showToggleAll` เปิดอยู่, `maxSelectedLabels` 3 แล้วแสดง "เลือกแล้ว {0} รายการ" (`selectedItemsLabel`), `defaultLabel` คือ placeholder ชื่อเดิม
  - `display="chip"` มีปุ่มลบแต่ละค่า, `selectionLimit` ปิดแถวที่เหลือและซ่อนช่องเลือกทั้งหมด, template `selectedItems` ได้ค่าและ `removeChip`
  - ช่องเลือกทั้งหมดเลือกเฉพาะแถวที่ค้นหาเหลือและไม่ disabled มีขีดเมื่อเลือกบางแถว
  - คีย์บอร์ด: เลือกแล้วรายการยังเปิดอยู่, Space/Enter เลือกแถวที่ชี้, Ctrl/⌘+A เลือกทั้งหมด, Esc / Tab ปิด
- **InputMask** (`wiraui/inputmask`, `wu-inputmask` / `wu-inputMask`, 74 ครั้ง ส่วนใหญ่เลขบัตรประชาชนและโทรศัพท์):
  - ตรรกะอยู่ใน core (`mask.ts`) พร้อม unit test: `9` `a` `*` และ `?` แบบเดิม `characterPattern` กำหนดตัวอักษร
  - อ่านข้อความแบบเดียวกับการพิมพ์ทั้งตอนพิมพ์ วาง และค่าจาก model เลขไทยนับเป็น 0–9 mask ที่เป็นตัวเลขล้วนเปิดแป้นตัวเลข (`inputmode="numeric"`)
  - Backspace / Delete ข้ามขีดที่ mask ใส่ให้ `autoClear` ล้างค่าที่ไม่ครบตอน blur
  - model: ข้อความที่จัดรูปแล้ว (มี `_` ระหว่างยังไม่ครบ แบบเดิม) หรือเฉพาะตัวที่พิมพ์เมื่อ `[unmask]="true"`
- **Messages** (`wu-messages` อยู่ใน `wiraui/message`, 110 ครั้ง):
  - กล่อง wu-message ซ้อนกันจาก `[(value)]` ปิดแล้วเอาออกจาก array
  - `enableService` ค่าเริ่มต้น true แบบเดิม: แสดงข้อความจาก `WuMessageService` ที่ `key` ตรงกัน (แอปส่วนใหญ่ปิดด้วย `[enableService]="false"`)
- **Timeline** (`wiraui/timeline`, 35 ครั้ง): แนวตั้ง/แนวนอน, `align` left / right / alternate (top / bottom ตอนแนวนอน), template content / opposite / marker ถ้าไม่มี opposite เนื้อหาจะเต็มแถว (ต่างจากเดิมที่เหลือครึ่งเดียว)
- **Chart** (`wiraui/chart`, 130 ครั้ง):
  - ห่อ Chart.js (`chart.js/auto`) เป็น optional peer `>=3 <5` แอปติดตั้ง `chart.js` เองเหมือนเดิม (แอปของทีมใช้ 4.x)
  - สร้างใหม่เมื่อ `type` / `data` / `options` เปลี่ยน แบบเดิม, `refresh()` สำหรับแก้ data ในที่, `(onDataSelect)`, `[plugins]`, `width` / `height` / `responsive`
  - ใช้ฟอนต์ (ภาษาไทย) และสีตัวอักษรของธีม เว้นแต่แอปตั้งค่า default ของ Chart.js เองหรือส่งมาใน `options`
  - ไม่กว้างเกินกรอบแม้ใส่ `width` คงที่
- **Image** (`wiraui/image`, 45 ครั้ง ส่วนใหญ่ `[preview]`):
  - ดูภาพเต็มจอด้วย `<dialog>` แบบ modal (top layer, Esc ปิด, focus กลับปุ่มเดิม, หน้าไม่เลื่อนข้างหลัง) หมุน/ซูม 0.5–1.5
  - บนจอที่ไม่มี hover ปุ่มดูภาพแสดงเป็นไอคอนเล็กที่มุมตลอด
- **AutoComplete** (`wiraui/autocomplete`, 30 ครั้ง):
  - หน้าตาและ token เดียวกับ Select (ช่องแบบพิมพ์ได้ + ปุ่ม dropdown ตรงที่ลูกศร)
  - `(completeMethod)` หลัง `delay` (300) และ `minLength` (1), ระหว่างรอมี spinner, ไม่พบแสดงข้อความ
  - ค่าเป็น option ทั้งก้อนเมื่อเลือก ระหว่างพิมพ์เป็นข้อความแบบเดิม, `forceSelection` ล้างข้อความที่ไม่ได้เลือก (ถ้าตรงกับชื่อ option พอดีจะเลือกให้)
  - `field` ชื่อเดิมของ `optionLabel`
  - **ยังไม่ทำ:** `multiple` (แอปใช้ครั้งเดียว)
- **Accordion แบบ value:** `<wu-accordion [(value)]>` + `wu-accordion-panel value` / `wu-accordion-header` / `wu-accordion-content` (แอปรุ่นใหม่ใช้ 17 ครั้ง) ใช้ได้ทุกรุ่น หน้าตาและคีย์บอร์ดเหมือนแบบ `wu-accordion-tab`, `multiple` แล้วค่าเป็น array
- **PanelMenu** (`wiraui/panelmenu`, 18 ครั้ง): เมนูข้างแบบแผงพับได้ ซ้อนได้หลายชั้น สถานะเปิดอยู่ที่ `expanded` ของ item แบบเดิม, `multiple` ค่าเริ่มต้นตามยุค (v1 เปิดหลายแผงได้, v2/v3 ทีละแผง), คีย์บอร์ด ↑↓ ไล่ทุกแถวที่มองเห็น → เปิด ← ปิด/กลับไปแถวแม่
- **Steps** (`wiraui/steps`, `p-steps` 10 ครั้ง): ขั้นตอนมีตัวเลขจาก menu model, ขั้นที่ผ่านแล้วเส้นและตัวเลขเป็นสีหลัก, ค่าเริ่มต้น read-only แบบเดิม `[readonly]="false"` คลิก/ลูกศร/Enter เลือกขั้นได้ (`[(activeIndex)]`) **ยังไม่ทำ:** Stepper แบบ value (`p-stepper` 7 ครั้ง)

### 12.13 PickList, OrderList, FileUpload และ Stepper แบบ value (25 ต.ค. 2569)

- **PickList / OrderList** (`wiraui/picklist`, `wiraui/orderlist`, แอปใช้ 21 / 7 ครั้ง): ตรรกะย้าย/เรียงอยู่ใน core (`picklist.ts`, มี unit test) ย้ายด้วยปุ่ม ลาก (`[dragdrop]`) หรือดับเบิลคลิก เลือกหลายแถวด้วย Ctrl/Shift ค้นหาแยกฝั่ง (`filterBy`, `showSourceFilter` / `showTargetFilter`) แก้ array เดิมในที่แบบเดิมแล้วส่ง `sourceChange` / `targetChange` ต่อ ปุ่มทุกปุ่มมีชื่อภาษาไทยให้ screen reader บนมือถือสองฝั่งเรียงบนลงล่างและลูกศรหมุนตาม
- **FileUpload** (`wiraui/fileupload`, 14 ครั้ง): โหมด `advanced` (ลากวาง แสดงรายการ รูป preview ขนาดไฟล์ ปุ่มอัปโหลด/ยกเลิก) และ `basic` (ปุ่มเดียว `auto` ได้) ตรวจ `accept` / `maxFileSize` / `fileLimit` ใน core พร้อมข้อความไทย อัปโหลดเองด้วย XHR (`url`, `name`, `headers`, `withCredentials`, progress) หรือให้แอปทำเอง (`customUpload` + `(uploadHandler)`) ไฟล์ซ้ำ (ชื่อ ขนาด ชนิดเดียวกัน) ไม่ถูกเพิ่มซ้ำ
- **Stepper แบบ value** (`wiraui/stepper`, `p-stepper` 7 ครั้ง): `wu-stepper [(value)]` + `wu-step-list` / `wu-step` / `wu-step-panels` / `wu-step-panel` และแนวตั้งด้วย `wu-step-item` template `content` ได้ `activateCallback` แบบเดิม `[linear]` ห้ามข้ามขั้น

### 12.14 Table เชิงลึก (25 ต.ค. 2569)

ไล่ตาม API ของ Table รุ่นที่แอปติดตั้ง (ไฟล์ `.d.ts` ใน node_modules ของแต่ละแอป) แล้วทำส่วนที่ยังขาดทั้งหมดที่แอปเรียกใช้ และส่วนที่เหลือเกือบครบ:

- **คอลัมน์:** ตรึงคอลัมน์ซ้าย/ขวา (`wuFrozenColumn`, `alignFrozen`), ปรับกว้าง (`[resizableColumns]` + `wuResizableColumn`, `columnResizeMode` fit / expand), ลากเรียงคอลัมน์ (`[reorderableColumns]` + `wuReorderableColumn`, `(onColReorder)`)
- **แถว:** แถวตรึงบนสุด (`frozenValue`), ขยายแถว (`wuRowToggler`, `expandedRowKeys`, `rowExpandMode`), จัดกลุ่มแถว (`rowGroupMode` subheader / rowspan, `groupRowsBy`, template `groupheader` / `groupfooter`), ลากเรียงแถว (`wuReorderableRow` + `wuReorderableRowHandle`, ลูกศรขึ้นลงที่ด้ามจับได้)
- **เลือก:** radio (`wu-tableRadioButton`), `rowSelectable`, `metaKeySelection`, `selectionPageOnly`, `compareSelectionBy`, `wuSelectableRowDblClick`
- **กรอง:** ตัวกรองต่อคอลัมน์แบบแถวใต้หัวตาราง (`display="row"`) และแบบเมนู (`display="menu"`) เลือก match mode ได้ เพิ่มเงื่อนไขหลายข้อพร้อม match all / match any (`FilterRule` + `operator` ใน core), โหมดวันที่ (`dateIs`, `dateBefore`, `dateAfter`), `filterDelay`
- **แก้ไขในตาราง:** แบบเซลล์ (`wuEditableColumn` + `wu-cellEditor`, Enter เก็บ Tab ไปเซลล์ถัดไป Esc ยกเลิก) และแบบทั้งแถว (`editMode="row"`, `wuEditableRow`, `wuInitEditableRow` / `wuSaveEditableRow` / `wuCancelEditableRow`, `editingRowKeys`)
- **เมนูคลิกขวาที่แถว:** `[contextMenu]` + `wuContextMenuRow` (`pContextMenuRow`), `[(contextMenuSelection)]` แถวนั้นมีกรอบ, `contextMenuSelectionMode` separate / joint, `(onContextMenuSelect)`
- **อื่น ๆ:** `customSort` + `(sortFunction)`, `stateKey` จำการเรียง/กรอง/หน้า/การเลือก/ความกว้างคอลัมน์ (`stateStorage` session / local), export CSV (`exportFunction`, `csvSeparator`)
- **ยังไม่ทำ:** virtual scroll ในตาราง (รับ input ไว้ แต่แสดงทุกแถว)

### 12.15 Editor ของเราเอง (25 ต.ค. 2569)

`wiraui/editor` (`wu-editor`, แอปใช้ 48 ครั้ง) ทำเองทั้งหมดบน `contenteditable` ไม่พึ่ง Quill / Tiptap / TinyMCE หน้าตาแบบ editor สมัยใหม่ (แถบเครื่องมือจัดกลุ่ม ปุ่มไอคอน เมนูลอย) และนิสัยเดิมยังใช้ได้: `[(ngModel)]` (HTML), `formControlName`, `placeholder`, `readonly`, template `header` แบบ Quill (ปุ่ม `ql-bold` ฯลฯ ผูกคำสั่งให้เอง), `(onTextChange)`, `(onInit)`

- **ตั้งเครื่องมือได้ละเอียด:** `toolbar` เป็น preset (`basic` / `standard` / `full` / `none`), array ที่คั่นกลุ่มด้วย `'|'` หรือ array ของกลุ่ม และ `toolOptions` กำหนดรายการในเมนู (ระดับหัวข้อ ขนาด/ชุดฟอนต์ สี สีไฮไลต์ การจัดแนว ขนาดตารางเริ่มต้น การเปิดลิงก์ในแท็บใหม่ protocol ที่ยอมรับ) ตั้งค่าทั้งแอปได้ด้วย `provideEditorOptions()`
- **ตาราง:** แทรกจากตาราง grid เลือกขนาด เพิ่ม/ลบแถว คอลัมน์ แถวหัวตาราง รวม/แยกเซลล์ ลบตาราง จากเมนูที่ลอยเหนือตาราง
- **รูปภาพ:** `imageUpload.mode` เป็น `base64` (ฝังในเนื้อหา) หรือ `upload` (ส่งไป `url` ตาม `fieldName` / `method` / `headers` / `withCredentials` แล้วอ่าน URL จาก `responseUrl` หรือให้ฟังก์ชัน `upload(file)` ของแอปคืน URL เอง) ตรวจ `maxSize` / `accept` วาง ลากวาง หรือใส่จาก URL ได้ ปรับกว้าง จัดซ้าย/กลาง/ขวา ใส่คำอธิบาย (alt)
- **วางข้อความ:** ล้าง style ที่มากับ Word / เว็บ (คงตัวหนา เอียง สี ลิงก์ ตาราง รายการ) มี undo/redo ของเราเอง (core, unit test), นับคำ (`showCount`), แถบเครื่องมือติดด้านบนตอนเลื่อน (`stickyToolbar`), เต็มจอ (top layer), ดูโค้ด HTML
- ข้อความทุกจุดอยู่ใน `translation.editor` (ไทย/อังกฤษ)

### 12.16 ตรวจความครบเทียบการใช้งานจริง และ component ที่เหลือ (25 ต.ค. 2569)

ตรวจ tag / directive / input / output / template ที่แอปของทีมใช้จริงทุกจุด (26 แอป) เทียบกับ WiraUI แล้วปิดช่องว่างตามลำดับการใช้งาน:

- **ชื่อ tag ทุกแบบที่แอปเขียน:** camelCase และ kebab-case ของเดิม (`wu-inputNumber`, `wu-radioButton`, `wu-progressBar`, `wu-selectButton`, `wu-input-mask`, `wu-date-picker`, `wu-inputGroup` …) เพราะ Angular แยกตัวพิมพ์ใหญ่เล็กใน selector (CSS ใช้ `:is()` ครอบทุกชื่อ)
- **`styleClass` / `style` ลงที่ element หลัก** ของ component ที่ขาด 30 กว่าตัว (แอปใช้ 1,397 / 383 ครั้ง), slot template `header` / `footer` / `content` / `icons` ของ Card, Panel, Fieldset, AccordionTab, TabPanel, Toolbar, Popover, input ที่ขาด (`iconPos`, `iconPosition`, `link`, `badgeSeverity`, InputNumber ปุ่มล้างและ class ของช่อง …)
- **directive:** `pRipple` / `wuRipple`, `pBadge`, `pKeyFilter` (`int`, `num`, `alpha`, regex …), `pInputTextarea` `autoResize`, `wuDraggable` / `wuDroppable` (และ `pDraggable` / `pDroppable`) ลากวางแบบ HTML พร้อม scope
- **component ใหม่ (เขียนครั้งเดียวใน angular-common ใช้ได้ทุกรุ่น):**
  - **Slider** (`wiraui/slider`): ค่าเดียวหรือช่วง (`[range]`), แนวนอน/ตั้ง, ลาก คลิกราง คีย์บอร์ด (ลูกศร Page Up/Down Home/End), `(onChange)` / `(onSlideEnd)`
  - **SplitButton** (`wiraui/splitbutton`): ปุ่มหลัก + ลูกศรเปิด wu-menu, severity / outlined / text / size แบบ wu-button, Alt + ↓ เปิดเมนู
  - **Listbox** (`wiraui/listbox`): รายการเลือกที่อยู่บนหน้า เลือกเดียว/หลายค่า check box + เลือกทั้งหมด ค้นหา จัดกลุ่ม striped template item / group / header / footer / empty คีย์บอร์ดครบ (Shift + ลูกศร, Ctrl + A, พิมพ์เพื่อกระโดด) **ยังไม่ทำ:** virtual scroll (รับ input ไว้)
  - **Galleria** (`wiraui/galleria`): ภาพทีละภาพ ลูกศรบนภาพ จุด (ใต้ภาพหรือบนภาพ) แถบ thumbnail ที่เลื่อนตามภาพปัจจุบัน (`numVisible` + `responsiveOptions`) ล่าง/บน/ซ้าย/ขวา เล่นเอง (หยุดเมื่อชี้) วนรอบ ปัดบนจอสัมผัส ลูกศรคีย์บอร์ด และโหมดเต็มจอเป็น `<dialog>`
  - **ColorPicker** (`wiraui/colorpicker`): ช่องสีเปิดแผง (top layer) หรือ `inline` มีพื้นที่ saturation/brightness แถบ hue และช่อง hex ค่าเป็น `#rrggbb` / `{r,g,b}` / `{h,s,b}` ตาม `format` อ่านค่าได้ทุกแบบ (คณิตสีอยู่ใน core `colorpicker.ts` มี unit test)
  - **Breadcrumb** (`wiraui/breadcrumb`): menu model + `home` (ไอคอนบ้านให้เองถ้าไม่ระบุ) `routerLink` / `url` / `command` รายการสุดท้ายเป็น `aria-current="page"` ขึ้นบรรทัดใหม่ได้บนจอแคบ
  - **Inplace** (`wiraui/inplace`): template display / content (+ `closeCallback`) เปิดแล้วโฟกัสไปที่ช่องแก้ไข Esc / ปุ่มปิดกลับ
  - **BlockUI** (`wiraui/blockui`): บังทั้งหน้าเป็น `<dialog>` แบบ modal (หน้า inert เลื่อนไม่ได้) หรือบัง element เดียว (`[target]`) โดยย้ายแผ่นบังเข้าไปข้างใน และทำของเดิมเป็น `inert` + `aria-busy`
  - **ScrollPanel** (`wiraui/scrollpanel`): เลื่อนภายในความสูง/ความสูงสูงสุดที่กำหนด scrollbar บางตามสีธีม โฟกัสแล้วเลื่อนด้วยคีย์บอร์ดได้
  - **Scroller** (`wiraui/scroller`, ชื่อเดิม `wu-virtualScroller`): virtual scroll วาดเฉพาะแถวที่เห็น + เผื่อ (`numToleratedItems`) แนวตั้ง/นอน `lazy` + `(onLazyLoad)` `appendOnly` `scrollToIndex()` รายการสั้นวาดทั้งหมด **ยังไม่ทำ:** `orientation="both"`
  - **Drawer** (`wiraui/drawer`, `wu-sidebar` ก็ได้): แผงจากขอบซ้าย/ขวา/บน/ล่าง/เต็มจอ เป็น `<dialog>` (modal ค่าเริ่มต้น: หน้าหลัง inert โฟกัสอยู่ข้างใน) ปิดด้วยปุ่ม Esc หรือคลิกพื้นหลัง ไหลเข้า-ออกตามขอบ focus กลับปุ่มเดิม
  - **TieredMenu / ContextMenu** (`wiraui/tieredmenu`, `wiraui/contextmenu`): เมนูย่อยซ้อนหลายชั้นเปิดเมื่อชี้ คลิก หรือ → (พลิกไปอีกด้านเมื่อล้นจอ บนมือถือเปิดลงด้านล่างแทน) ContextMenu เปิดตรงตำแหน่งเมาส์จาก `[target]` / `[global]` / `show($event)` และปุ่ม context-menu ของคีย์บอร์ด
  - **Tree / TreeSelect** (`wiraui/tree`, `wiraui/treeselect`): TreeNode แบบเดิม เลือกเดียว / หลายค่า / check box ที่กระจายลงลูกและขึ้นแม่ (มีขีดเมื่อเลือกบางส่วน, `partialSelected` ตั้งให้แบบเดิม) ค้นหาแบบ lenient / strict โหลดลูกตอนเปิด (`leaf: false` + `(onNodeExpand)`) template ตาม `type` ของ node คีย์บอร์ดแบบ tree (↑↓ → ← Enter Space) TreeSelect หน้าตาเดียวกับ Select แสดงเป็นข้อความหรือ chip เปิดแล้วกาง node แม่ของค่าที่เลือก ตรรกะ (ค้นหา การกระจาย check) อยู่ใน core `tree.ts` มี unit test **ยังไม่ทำ:** ลากวาง node และ layout แนวนอนของ Tree, TreeTable
- token ใหม่ของแต่ละ component อยู่ใน families (หน้าตา classic มีกรอบเพิ่มที่ Breadcrumb / Tree / Drawer) และข้อความใหม่อยู่ใน locale ไทย/อังกฤษ (`previousImage`, `imageOf`, `breadcrumb`, `home`, `colorPicker`, `hue`, `saturationBrightness` …)
- ทดสอบ: unit core 142, e2e `more.spec.ts` 16 กรณีต่อรุ่น (v1 / v2 / v3 / WebKit) และตรวจภาพที่ 360 / 1280 ทั้งโหมดสว่าง/มืด ไม่มีหน้าล้นแนวนอน
- **แก้จากการเขียนหน้าเอกสาร:** Editor เปิดตัวหนา/เอียงที่เคอร์เซอร์ (ไม่ได้เลือกข้อความ) แล้วข้อความที่พิมพ์ต่อเป็นตัวหนาจริง (เดิมการตั้ง selection ซ้ำทำให้หาย) และคำสั่งใช้ selection ปัจจุบันก่อน range ที่จำไว้ (ทางลัดทันทีหลัง Shift + ลูกศรไม่ทำกับช่วงเก่า), มี `getEditor()` / `getQuill()`, ปุ่มจัดแนวจาก `select.ql-align` มีไอคอนตามแนวปัจจุบัน; Tree / TreeSelect มี `emptyFilterMessage`; Tree / Listbox / TreeSelect / Galleria ไม่กว้างเกินกรอบเมื่อกำหนดความกว้างด้วย `[style]`; Table แก้ในเซลล์เลือกข้อความเดิมหลังค่าถูกเขียนลงช่อง (ไม่เลือกถ้าเริ่มพิมพ์แล้ว); `WuPanelModule` export `wu-header` / `wu-footer`
- **ยังเหลือ (ใช้น้อยหรือไม่มีใครใช้):** AutoComplete `multiple`, TreeTable, Carousel, DataView, Splitter, InputOtp, Knob, MegaMenu, SpeedDial, Dock, ConfirmPopup, DynamicDialog


### 12.17 รอบรีวิวหน้าเอกสาร: Navbar, Aside Menu, Image Cropper และการรวม component ที่ซ้ำกัน (26 ต.ค. 2569)

ผู้ใช้เปิดหน้าเอกสารไล่ดูทีละหน้าแล้วส่งข้อสังเกต แก้ทั้งหมดในไลบรารี (ไม่ใช่แค่หน้าเว็บ) และเพิ่ม component ที่ทีมต้องเขียนเองอยู่ทุกแอป:

- **ค่า delay แบบเดิม:** `provideWiraUI({ delays: { autoComplete, filter } })` ค่าเริ่มต้น 0 (ทีมใช้ `delay=0` เสมอ) AutoComplete ไม่ใส่ delay = ค้นทันทีที่กดปุ่ม, Table `filterDelay` และ column filter ใช้ค่าเดียวกัน
- **Editor ตาราง:** กำหนดจำนวนแถว/คอลัมน์และแถวหัวตารางก่อนแทรก ตารางกว้าง 100% มี `<colgroup>` เป็น % (responsive) ลากเลือกหลายเซลล์ (หรือ Shift + คลิก) แล้วรวมเซลล์ ลากขอบคอลัมน์ปรับความกว้าง แถบเครื่องมือตารางลอยขึ้นเมื่อคลิกในตาราง เพิ่ม/ลบแถวคอลัมน์หลังสร้างแล้วยังรักษาความกว้าง; เมนูรูปแบบมีหัวข้อ 1–6 + ข้อความอ้างอิง + บล็อกโค้ด (`blocks`) แบบ TinyMCE (header แบบ Quill ใช้รายการจาก select ของตัวเอง)
- **หน้าตา:** แถบหัวกลุ่มของ Select / Listbox ชัดขึ้น, check box เลือกทั้งหมดของ MultiSelect ตรงกับรายการ, chip ที่ล้นช่องรวมเป็น `+N` (ชี้ดูชื่อได้), ปุ่ม toggle switch อยู่กลางราง (ช่องว่างบนเท่าข้าง), ช่องค้นหาทุกตัวมี placeholder เสมอ (แก้ได้), ข้อความ error ชิด input ขึ้น, SplitButton สีรองมีขอบ, ไอคอนใน Tag อยู่กลาง, ปุ่มขึ้นลงของช่องตัวเลขใน filter ถูกซ่อน และ `select.wu-inputtext` มีลูกศร, เส้นในกราฟผสม (bar + line) อยู่บนแท่ง, BlockUI บังส่วนเดียวเป็นแผ่นสีการ์ดเบลอ (อ่านง่ายทั้งสว่างและมืด)
- **input ใหม่:** Accordion `[gap]` (แยกเป็นการ์ดหรือติดกัน), ProgressBar `[striped]` / `[animated]`, MeterGroup `[reverse]`, Stepper `labelPosition="bottom"` + `subtitle` + `[readonly]`, Table เรียงครั้งที่ 3 = ยกเลิก (`removableSort` เปิดเป็นค่าเริ่มต้น), `stripedRows` ปิดเป็นค่าเริ่มต้น (เปิดเองได้), หัว/ท้ายกลุ่มแถวมีแถบสีและเส้น (`wu-rowgroup-footer`)
- **รวม component ที่ซ้ำกัน (ตัวเดียวทำได้ทั้งสองแบบ):**
  - **Stepper ทำงานแบบ Steps ได้:** `<wu-stepper [model]="steps" [(activeIndex)]="i">` (รายการมี `label`, `subtitle`, `disabled`, `command`) `wu-steps` ยังอยู่เพื่อแอปที่ย้ายมา
  - **Tabs ทำงานแบบ TabMenu ได้:** `<wu-tabs [model]="pages" [(activeItem)]="page">` (แอปใช้ TabMenu 71 จุด) ย้าย TabMenu เข้า entry `wiraui/tabs` (เดิม tabmenu import จาก tabs จึง import กลับไม่ได้) `wiraui/tabmenu` เหลือเป็น re-export และ CSS รวมเป็น `tabs.css`
  - Message แบบมี service (`WuMessageService` + `key`) และไม่มี service (`[(value)]`) มีอยู่แล้วใน `wu-messages`
- **component ใหม่:**
  - **Navbar** (`wiraui/navbar`): แถบบนจาก `[model]` (`routerLink` / `url` / `command`, เมนูย่อยเป็น wu-menu) brand / links / end ทั้งแบบ attribute และ template, `sticky` (มีเงาเมื่อเลื่อน), `variant` solid / glass / transparent, ต่ำกว่า `breakpoint` ลิงก์พับเข้าแผงใต้แถบ เมนูย่อยกางในที่ ปิดด้วย Esc / คลิกนอก / ขยายจอ
  - **Aside Menu** (`wiraui/asidemenu`): เมนูด้านข้างแบบที่ แอป A และ แอป B เขียนเอง กลุ่มกางในที่หลายชั้น กลุ่มที่มีหน้าปัจจุบันเปิดเอง (ไม่ต้องใส่ class เอง) `[sections]` หัวข้อไม่พับ, `[(collapsed)]` เหลือแถบไอคอน (ไม่มีไอคอนใช้พยัญชนะแรก) เมนูย่อยเป็น flyout ข้างแถบ, บนมือถือเป็นแผงเลื่อนเข้าพร้อม mask ล็อกการเลื่อนหน้า ปิดเมื่อเลือกหรือเปลี่ยน route; `<wu-navbar [aside]="side">` ปุ่มเมนูของ navbar เปิด/ย่อ aside ให้เอง และบนมือถือย้ายลิงก์ของ navbar เข้าไปเป็นกลุ่มแรก
  - **Image Cropper** (`wiraui/imagecropper`, tag `image-cropper` เดิมก็ใช้ได้): รับ `imageFile` / `imageChangedEvent` / `imageURL` / `imageBase64` หมุนรูปตาม EXIF, กรอบตามอัตราส่วน (`aspectRatio` เป็นตัวเลขหรือ `'4/3'`) ขนาดต่ำสุด/สูงสุด/คงที่ กรอบกลม, แถบเครื่องมือซูม หมุน พลิก คืนค่า, Ctrl + ล้อ / pinch ซูม ลากนอกกรอบเลื่อนรูป คีย์บอร์ดครบ, ผลเป็น blob หรือ base64 (png / jpeg / webp / bmp / ico) ปรับขนาดผล (`resizeToWidth` / `resizeToHeight`) จำกัด 16.7 ล้านพิกเซลตามข้อจำกัดของ iOS คณิตกรอบอยู่ใน core `imagecropper.ts` มี unit test
- **WiraUI Studio ตัวจริง (ฟรี ไม่มีจ่ายเงิน ไม่ต้องล็อกอิน ทำงานในเบราว์เซอร์ทั้งหมด):** หน้า `theming/studio` ของเว็บเอกสาร แท็บ Primitive (scale สี primary / surface / สถานะ สร้างจากสีหลักหรือแก้ทีละเฉด), Semantic (กลุ่ม token ทั่วไป focus ring ฟอร์ม รายการ ฯลฯ), Component (เลือก component แล้วแก้ token ทุกตัว แยก Light / Dark), Custom (เพิ่ม `--wu-*` เอง) และ Settings (ชื่อ preset ฐาน โหมดมืด ฟอนต์ ขนาด ความหนาแน่น) ทุกช่องแสดงค่าปัจจุบัน อ้างอิง token อื่นได้ (`{field-bg}`) ค้นหาได้ทุกแท็บ undo / redo เห็นผลทั้งเว็บทันที (ผ่าน WuThemeService ของรุ่นนั้น) จำไว้ในเบราว์เซอร์ ดาวน์โหลด SCSS / CSS / TS preset / TS overrides / JSON (เฉพาะที่แก้ หรือทั้งหมด) และ import ไฟล์กลับมาแก้ต่อได้
- **หน้าเอกสารใหม่:** Navbar, Aside Menu, Image Cropper (ทุกรุ่น)
- **แก้ระหว่างทาง:** Stepper ที่ step มาจาก loop (`@for`, `*ngFor`, `[model]`) วาดเส้นเชื่อมไม่ขึ้น เพราะแต่ละ step วาดก่อนตัวถัดไปมีอยู่ ตอนนี้วาดใหม่หลังทุก step ลงทะเบียนครบ; flyout ของ Aside Menu บน Safari ไม่ปิดเองเมื่อคลิกข้างใน (Safari ไม่ให้ focus ปุ่มที่ถูกคลิก ส่ง focus ไปที่ nav แทน); แผงมือถือของ Aside Menu ไม่เลื่อนผ่านหน้าตอนโหลด (เลื่อนเฉพาะหลังเปิด/ปิดจริง); งบขนาด bundle ของ playground เป็น 3 / 4 MB เพราะรวมทุก component
- ทดสอบ: unit core 163, e2e ใหม่ `tweaks.spec.ts` 8, `navbar.spec.ts` 6, `asidemenu.spec.ts` 7, `imagecropper.spec.ts` 8 กรณีต่อรุ่น

### 12.18 รอบรีวิว: Image Cropper, Aside Menu, ภาษา, สีปุ่ม, ธีมเริ่มต้นของ v3 และ Liquid Glass (26 ต.ค. 2569)

- **Image Cropper:** กรอบรูปจำรูปทรงตอนโหลดไว้ หมุนแล้วรูปย่อลงอยู่กลางกรอบเดิม ความสูงไม่เปลี่ยน หน้าไม่กระโดด (เดิม viewport ใช้ `aspect-ratio` ตามรูปที่หมุนอยู่ และบน Firefox `max-height` ถูกส่งผ่าน ratio ไปทำให้กรอบแคบชิดซ้าย ตอนนี้กว้างเต็มเสมอ); `[toolbar]` เลือกปุ่มได้ (`'full'` / `'none'` / รายการ เช่น `['zoom', '|', 'rotateLeft', 'reset']` โดย `zoom` / `rotate` / `flip` แทนทั้งกลุ่ม และ `'|'` ขึ้นกลุ่มใหม่) ตรรกะอยู่ใน core `cropperToolbarGroups()` มี unit test; template `tools` (`let-cropper`) ใส่ปุ่มของแอปเองต่อท้ายแถบ; `provideImageCropperOptions({ output, format, imageQuality, toolbar, maxZoom })` ตั้งค่าเริ่มต้นทั้งแอป (input บน component ชนะ)
- **Aside Menu ย่อ/ขยาย:** ระหว่างที่ความกว้างเปลี่ยน เมนูคงความกว้างเต็มและ host ตัดขอบไว้ (`wu-aside-menu-sliding`) ข้อความไม่ขึ้นบรรทัดใหม่แล้วดีด ข้อความ badge และลูกศรจางออก/เข้า ตอนย่อแถบไอคอนมาแทนเมื่อแคบสุดแล้ว ระยะเวลาอ่านจาก transition ของ host (ไม่มีเมื่อผู้ใช้ขอลดการเคลื่อนไหว)
- **Steps จัดวางได้แบบ Stepper:** `labelPosition="right"` ชื่อ (และ subtitle) อยู่ข้างตัวเลข มีเส้นเต็มช่องว่างไปยัง step ถัดไป (เส้นหลัง step ที่ผ่านแล้วเป็นสีหลัก) บนจอแคบกว่า 576px เหลือชื่อเฉพาะ step ปัจจุบัน (ที่เหลือซ่อนไว้ให้ screen reader อ่าน) และ `orientation="vertical"` เรียงเป็นคอลัมน์ เส้นลากลงระหว่างตัวเลข ↑ / ↓ เลื่อนได้; ชื่อกับ subtitle อยู่ใน `.wu-steps-text`, token ใหม่ `--wu-steps-vertical-gap`
- **Radio / Checkbox:** ขนาดปัดเป็นพิกเซลคู่ด้วย `round()` (เดิม 1.25rem × 14px = 17.5px ถูกปัดเป็น 18 × 17 วงกลมจึงเบี้ยว และจุดกลางเยื้องครึ่งพิกเซล) จุดของ radio ขยายตาม `size` ด้วย
- **Dropdown:** hover ของตัวเลือก (Select, MultiSelect, AutoComplete, Listbox, PickList) เป็นสีหลักของธีมแบบจาง จางกว่าตัวที่เลือกอยู่ (`select-option-hover-bg`)
- **สีตัวอักษรบนปุ่มทึบ (`*-contrast-auto`):** เลือกด้วย APCA แทน WCAG 2 และเอนไปทางสีขาว (ภายใน 5 Lc) ปุ่ม teal / น้ำเงิน / แดง / เขียวมรกตได้ตัวอักษรขาว สีอ่อนอย่าง amber / lime / เหลืองยังเป็นตัวเข้ม (`apcaContrast()` ใน core และ `wu-apca()` ใน Sass ผลตรงกัน ตรวจด้วย parity test)
- **ธีมเริ่มต้นของ v3 เป็น Wira** (ผู้ใช้เลือก) ทั้ง `ng add`, SCSS `$theme` ค่าเริ่มต้น และเว็บเอกสาร รายการ preset ของ v3 เรียงของ WiraUI ก่อน: Wira, Lanna, Siam, Nakhon, Glass แล้วจึง Mali, Sila, Material, Phet
- **Glass เป็น Liquid Glass จริง** (`material: 'glass'`, ทั้งหมดเป็น token ใน `materialTokens()`): การ์ด เมนู dropdown panel ของ DatePicker popover dialog และ toast เป็นแผ่นกระจกโปร่งที่เบลอและเร่งสีสิ่งที่อยู่ข้างหลัง (`--wu-overlay-backdrop`, ชั้นลอยทึบกว่าเพื่อให้อ่านออก) มีขอบสะท้อนแสงด้านบนและเส้นบางรอบตัว เงายก ปุ่มเป็นแคปซูลมีแสงวาวด้านใน (`--wu-button-shadow`, `--wu-button-backdrop`) ปุ่มรองเป็นกระจกใส และพื้นหน้า (`--wu-backdrop` ที่ `.surface-ground` ใช้) มีแถบสีอ่อนจากสีของธีมให้กระจกมีอะไรให้หักเห ธีมอื่นค่าเหล่านี้เป็น `none` หน้าตาไม่เปลี่ยน
- **ระบบภาษาของแอป (`wiraui/i18n`):** `provideWuI18n({ languages, defaultLanguage, messages, load, storageKey, detectBrowser, componentLocales, setHtmlLang })` (หรือ `WuI18nModule.forRoot()`), service `WuI18n` (`t()`, `use()`, `add()`, `languageChange`, `ready`), pipe `t` / `wuTranslate` (impure มี cache, re-render เองเมื่อเปลี่ยนภาษาแม้ใน OnPush / zoneless) และ `<wu-language-switch>` แบบปุ่ม TH | EN หรือ drop-down พร้อมลูกโลก key เป็น id (ซ้อน object ได้) หรือข้อความภาษาหลัก ภาษาที่ไม่มีข้อความแสดง key เอง, `{name}` แทนค่า, จำภาษาใน localStorage, `<html lang>` และข้อความในตัว component (ไทย/อังกฤษ) เปลี่ยนตาม ตรรกะอยู่ใน core `i18n.ts` มี unit test
- **ชื่อจริง:** ตัวอย่าง เอกสาร fixture และ test ไม่ใช้ชื่อโรงเรียนหรือองค์กรที่มีอยู่จริง ใช้ "วิระ" / "โรงเรียนวิระ" หรือชื่อที่แต่งขึ้น
- **หน้าเอกสาร (helper agent):** ธีมสำเร็จรูปของ Navbar หลายแบบพร้อมคัดลอก, หน้า Image Cropper ส่วนใหม่, ตัวอย่างที่สีกลืนกันอ่านยากถูกแก้, Studio เลือกดู component ใดก็ได้ในช่อง Preview, ตัดแถบตัวอย่างใน Theme drawer
- **สำรวจรอบใหม่ (27 แอป):** tag `p-*` ทุกตัวที่แอปใช้มี `wu-*` รองรับครบ ไม่มีแอปใช้ Dock; ที่เหลือจาก UI library เดิม: TreeTable, Carousel, DataView, Splitter, InputOtp, Knob, MegaMenu, SpeedDial, Dock, ConfirmPopup, DynamicDialog (`WuDialogService` ยังไม่ทำ), CascadeSelect, OrganizationChart, ImageCompare, ScrollTop, Terminal, ButtonGroup, Fluid, IftaLabel แบบแยก; ของที่แอปเขียนเองหรือติดตั้ง library เพิ่มซ้ำ ๆ: export Excel ของ Table (xlsx 25 แอป), หน้า 404 / ผลลัพธ์ (33 แอป), empty state (29), pipe พ.ศ. (25), ที่อยู่ไทย (16), countdown (10), เลขบัตรประชาชน (10), แผนที่ (10), PDF (pdfmake 9, viewer 6), barcode / QR (6 / 5), signature pad (2), stat card (8)

### 12.19 Icon ของเราเอง: `wiraicon` (26 ต.ค. 2569)

- **ที่มา:** สแกน 29 แอปพบ icon font เดิม 212 ชื่อ (9,475 จุด) และ Font Awesome 35 ชื่อ (83 จุด ส่วนใหญ่เป็น brand) ผู้ใช้เลือกใช้ตัวภาพของ Phosphor Icons (MIT, ใส่ข้อความ license ใน LICENSE ของแพ็กเกจ) 5 น้ำหนัก thin / light / regular / bold / fill และให้มีทั้ง class และ component ติดตั้งแยกจาก wiraui ได้ ชื่อแพ็กเกจ `wiraicon` (ว่างบน npm)
- **ชุด icon:** 424 ตัวใน 20 หมวด (`packages/icons/icons.mjs`) ชื่อหลักตามชื่อที่ทีมเขียนอยู่ (pi) ชื่อสำรองแบบ FA / Phosphor รวม 838 ชื่อ ชื่อที่เป็นน้ำหนักในตัว (`star-fill`, `circle-fill`, `caret-*` แบบสามเหลี่ยมทึบ) วาดน้ำหนักนั้นเสมอ code point เก็บใน `codepoints.json` (เพิ่มต่อท้ายเท่านั้น) ห้ามตั้งชื่อ icon ชนกับ class น้ำหนัก (`bold` จึงเป็น `text-bold`)
- **ที่ได้:** `wiraicon.css` + font woff2 ต่อน้ำหนัก (~44KB, โหลดเฉพาะน้ำหนักที่หน้าใช้) class `wi wi-<name>` `wi-thin|light|bold|fill` `wi-spin` `wi-fw`; `svg/<weight>/<name>.svg`; `icons.json`; entry `wiraicon` (ชื่อ alias และ helper `wiraIconName()`, `wiraIconSvg()`), `wiraicon/angular` (`<wi-icon name weight size color label spin>`, `WiIconModule`, `provideWiraIcon()`) วาด SVG inline และโหลด `wiraicon/data/<weight>` ตอนใช้ครั้งแรก build ด้วย ng-packagr ของ Angular 15 (partial) จึงใช้ได้ Angular 15–21
- **build:** `pnpm build:icons` (`packages/icons/scripts/build.mjs`: ตรวจรายชื่อกับไฟล์ Phosphor, สร้าง font ด้วย svgicons2svgfont → svg2ttf → ttf2woff2 ตัว JS, CSS, SVG, ข้อมูล แล้ว ng-packagr) รวมใน `pnpm build`, `pack:all`, `pnpm test` และติดตั้งลงเว็บเอกสาร
- **เว็บเอกสาร:** เปลี่ยนทุก icon และตัวอย่างจาก `pi pi-*` เป็น `wi wi-*` และมีหน้า Icons (ค้นหา เลือกหมวด น้ำหนัก ขนาด คัดลอก ดาวน์โหลด SVG)

### 12.20 Terminal, ImageCompare, Carousel, Splitter, OrganizationChart, Knob, InputOtp (26 ต.ค. 2569)

เขียนครั้งเดียวใน angular-common ใช้ได้ทุกรุ่น ตรรกะใน core (`terminal.ts`, `imagecompare.ts`, `carousel.ts`, `splitter.ts`, `organizationchart.ts`, `knob.ts`, `inputotp.ts`) มี unit test API ตาม UI library เดิม 21 เกือบครบ ต่างจากต้นฉบับโดยตั้งใจ:
- **Terminal:** คำตอบที่มาโดยไม่มีคำสั่งแสดงเป็นบรรทัดของตัวเอง (ต้นฉบับ throw), มี `clearCommand` และ `role="log"`
- **ImageCompare:** มือจับสร้างเอง (ไม่ใช่ thumb ของ range) tab stop เดียว `[(value)]` / `step` เพิ่ม รูป `object-fit: cover` สัมผัสรอให้ลากด้านข้างก่อนจึงไม่กินการเลื่อนหน้า
- **Carousel:** หน้าสุดท้ายเต็มเสมอ วนรอบด้วยสำเนาหัวท้าย ปุ่มที่ปลายเป็น `aria-disabled` (ไม่หายไปทำให้โฟกัสหลุด) รายการนอกจอ `inert`; `prev/nextButtonProps` ใช้แค่ `icon`, `ariaLabel`, `styleClass`
- **Splitter:** ขนาดต่ำสุดใช้กับทุก gutter และหยุดที่ขอบ (ต้นฉบับดูแค่สองช่องแรกและไม่ยอมขยับ) ช่องที่ไม่กำหนดขนาดแบ่งที่เหลือ เนื้อหาเลื่อนได้แทนการตัด `stateStorage` ผิดจะเตือนแล้วใช้ session
- **OrganizationChart:** DOM ไม่ใช่ตารางซ้อน (class `p-organizationchart-node-content`, `p-highlight`, `p-node-toggler` คงไว้) ลูกแสดงเมื่อ `expanded` เท่านั้นแบบต้นฉบับ คีย์บอร์ดแบบ tree เลื่อนในกรอบของตัวเองบนมือถือ
- **Knob:** ลูกศรเลื่อนตาม `step` (ต้นฉบับทีละ 1) PageUp/Down 10 step ลากเข้าช่องว่างด้านล่างติดปลายที่ใกล้กว่า
- **InputOtp:** ช่องใช้ `wuInputText` (variant / size / invalid ใช้ได้) พิมพ์ทับช่องที่มีค่าแล้วได้ วางรหัส (ตัดช่องว่างและขีด) ช่องแรก `autocomplete="one-time-code"` รับรหัสจาก SMS
- e2e `parity2.spec.ts` 21 กรณีต่อรุ่น

### 12.21 Flow: แผนภาพ node ระดับ React Flow (26 ต.ค. 2569)

ผู้ใช้ขอ component ใหญ่ "Flow" เขียนเองทั้งหมด แนวคิดจาก ngx-vflow แต่ความสามารถระดับ React Flow (xyflow v12) ไม่มี dependency ภายนอก
- **core (`packages/core/src/flow/`, unit test 170):** ชนิดข้อมูล, geometry (snap, extent, จุด handle, handle ใกล้สุด, เส้นช่วยจัดแนว, resize), viewport (ซูมรอบจุด, translateExtent, fit bounds, แปลงพิกัดจอ ↔ flow, animation), เส้นเชื่อม `getBezierPath` / `getSmoothStepPath` / `getStepPath` / `getStraightPath` / `getSimpleBezierPath` (คืน `[path, labelX, labelY, offsetX, offsetY]` แบบ React Flow), graph (incomers / outgoers / bounds / intersect / parent-child / culling), change model (`applyNodeChanges`, `applyEdgeChanges`, `addEdge`, `reconnectEdge`), การโต้ตอบ (ลาก, กล่องเลือก, กติกาการเชื่อม strict / loose, จำกัดจำนวน, `isValidConnection`), จัดเรียง `layoutFlow` (layered: ตัดวง, rank, ลดเส้นตัดด้วย barycentre) และ `layoutTree`, `FlowHistory`, `flowToJSON` / `flowFromJSON` / `flowToSvg`
- **Angular (`wiraui/flow`, เขียนครั้งเดียวใช้ได้ทุกรุ่น, zoneless-safe):** `<wu-flow>` two-way `[(nodes)]` `[(edges)]` `[(viewport)]` หรือคุมเองด้วย `(nodeChanges)` / `(edgeChanges)` + `[applyChanges]="false"`, template ต่อชนิด node (`wuFlowNode="person"`), edge / ป้าย / เส้นตอนลาก, `<wu-flow-handle>` `<wu-flow-background>` (dots / lines / cross ซ้อนได้) `<wu-flow-minimap>` `<wu-flow-controls>` `<wu-flow-panel>` `<wu-flow-node-toolbar>` `<wu-flow-node-resizer>` `wuFlowHistory`, method แบบ React Flow (fitView, zoomTo, setCenter, screenToFlowPosition, deleteElements, layout, toSvg …), event ครบ
- **คีย์บอร์ดและ a11y:** Tab ไป node แล้ว edge, Enter / Space เลือก, ลูกศรย้าย (Shift ×10), Delete ลบ, Ctrl + A, + / − ซูม, C เริ่มเชื่อมจาก node ที่โฟกัสแล้ว Enter ที่ปลายทาง, Escape ยกเลิก, Ctrl + Z / Shift + Z / Y, aria-live ประกาศการเลือก ย้าย เชื่อม ลบ ซูม เป็นไทย / อังกฤษ; จอสัมผัส: แตะเลือก กดค้างเพิ่มในการเลือก สองนิ้วซูม ปุ่มและ handle ≥ 24px บน pointer: coarse
- **token `--wu-flow-*` 84 ตัว** (MALI, dark ปรับ 3 ตัว), locale `flow*` 30 คีย์
- **แก้ระหว่างทดสอบในเบราว์เซอร์จริง:** node แบบ template หดเหลือความกว้างเนื้อหา (`width: max-content`), Shift + ลูกศรย้าย ×100, กดลูกศรเร็วกว่ารอบวาด, กล่องเลือกในโหมดคุมเองบน WebKit, resizer วัดจากตำแหน่งเก่า, handle ถูก resizer ทับ, ป้ายเส้นอยู่ใต้ node, วงจุดปลายเส้นตอนเลือก
- e2e `flow.spec.ts` 14 กรณีต่อรุ่น (v1 / v2 / v3 / WebKit) ทั้งชุด component ผ่าน 1151 ข้อ

### 12.22 Figma UI Kit (26 ต.ค. 2569)

ผู้ใช้ให้เริ่มทำ Figma UI Kit (ข้อ 13.8) ในเวลาที่มี ไม่มีการเชื่อม Figma API ในเครื่องมือที่ใช้ จึงทำเป็น **plugin แบบ development** (`packages/figma`) ให้ designer รันใน Figma desktop แล้ว plugin สร้าง kit ลงไฟล์เอง
- **token มาจากธีมจริง:** `scripts/build.mjs` โหลด `theme.css` ของ preset v3 ทุกตัวลง Chromium แล้วอ่าน `--wu-*` ทุกตัวตามที่เบราว์เซอร์คำนวณ ทั้ง `:root` และ `:root.wu-dark` ได้ค่าสีจริงหลัง var() / color-mix() และ px หลัง rem / calc() รวมถึงเงา สีที่ CSS ผสมตอนใช้งาน (ขอบ outlined, tint ตอน hover, พื้น tag, ขอบ message) คำนวณเพิ่มเป็นกลุ่ม `kit/…` และได้ไฟล์ W3C Design Tokens ต่อ preset / mode ด้วย
- **ใน Figma:** variables 848 ตัว (Light / Dark; แพลนฟรีแยก Dark เป็นอีก collection), text styles ตามฟอนต์ของ preset, effect styles ของเงาและวงโฟกัส, หน้า Foundations / Components / Icons มี component set 15 ชุด (Button 216 variant, InputText, Select, Checkbox, RadioButton, ToggleSwitch, Tag, Badge, Avatar, Message, Toast, Tab, Step, Accordion, Table cell) และชิ้นเดี่ยว (Select panel, Chip, ProgressBar, Slider, Tooltip, Card, Dialog, Menu, Breadcrumb, Paginator, Navbar, Aside menu, ตารางตัวอย่าง) ทุกค่าผูกกับ variable และ wiraicon 424 ตัวเป็น component สำหรับ property Icon glyph
- **ตรวจ:** type-check กับ `@figma/plugin-typings` และรันกับ Figma API จำลองครบ 9 preset ซึ่งบังคับกฎที่ Figma ตรวจตอนรันจริง (ฟอนต์ต้องโหลดก่อน, FILL เฉพาะใน auto layout, field ที่ผูกตัวแปรได้, ข้อความที่ผูก property ต้องแก้ผ่าน `setProperties`) ส่วนหน้าตาต้องดูใน Figma เอง
- preset ที่ซ่อน (ไม่อยู่ใน `VERSION_CATALOG`) ไม่อยู่ใน plugin

### 12.23 เว็บเอกสาร: หน้า 404, ฟอนต์ของ preset และ CI (26 ต.ค. 2569)

- **หน้า 404 (`apps/docs/src/app/shared/not-found.ts`):** เดิมที่อยู่ที่ไม่มีจริงจะเด้งไปหน้าแรก (หรือหน้าบทนำถ้าอยู่ใต้ /vN) ตอนนี้มีหน้าของตัวเอง
  - ใต้ /v1–/v3 อยู่ในโครงเอกสาร (sidebar, ค้นหา, เลือกรุ่น) ที่อื่นแสดงเดี่ยวพร้อมหัวเล็ก ๆ
  - ภาพเป็นแผนภาพแบบ Flow ที่เส้นเชื่อมหลุดและแกว่ง (มีการหมุนเล็กน้อยกัน Firefox ปัดพิกเซล)
  - แสดงที่อยู่ที่เปิด มีปุ่มกลับหน้าแรก / เอกสาร / ค้นหา
  - เสนอหน้าที่ชื่อใกล้ที่สุดด้วย edit distance ที่นับตัวอักษรสลับเป็นหนึ่ง (`buton` → Button, `tabel` → Table) ถ้าไม่ใกล้เลยเสนอหน้าที่เปิดบ่อย
  - title เป็น "ไม่พบหน้านี้ · WiraUI" รองรับไทย / อังกฤษ มือถือ และโหมดมืด
- **Glass:** ชิ้นเล็กที่วางทับเส้น (หัวจับ Slider, เลขของ Steps, จุดของ Timeline, ปุ่มพับของ OrganizationChart, node และ handle ของ Flow) เคยเป็นกระจกโปร่งจนเห็นเส้นทะลุ ตอนนี้ใช้ token ใหม่ `glass-solid` (surface-0 / surface-900 ในโหมดมืด)
- **ฟอนต์ของ preset (`core/preset-fonts.ts`):** เว็บโหลดเองแค่ Inter, IBM Plex Sans Thai, JetBrains Mono, Kanit preset ที่ใช้ฟอนต์อื่น (Sarabun, Prompt, Anuphan, Roboto …) จึงเคยแสดงด้วยฟอนต์ระบบ ซึ่ง metrics ทำให้ข้อความไม่ตรงแนวไอคอน ตอนนี้โหลดจาก Google Fonts ครั้งแรกที่ preset หรือ Studio ใช้
- **บทเรียนเรื่องฟอนต์ไทยในปุ่ม:** วัดจาก pixel จริง ไม่ใช่ canvas metrics ฟอนต์ไทยมีเชิงทุกตัวที่ลอง (Noto Serif Thai, Taviraj, Trirong, Pridi) วางตัวอักษรสูงกว่า Kanit 1–1.7px ข้างไอคอน ส่วนแบบมีหัว sans (Noto Sans Thai Looped, Sarabun) วางเหมือน Kanit
- **CI (`.github/workflows/ci.yml`):** ไม่เคยผ่านเพราะสองจุดหยุดตั้งแต่ต้น
  1. `npm pack --pack-destination packs` ทั้งที่ยังไม่มีโฟลเดอร์ `packs` (ENOENT)
  2. ขั้น build เว็บเอกสารเรียก `pnpm docs` ซึ่งเป็นคำสั่งของ pnpm เอง (เปิดหน้า npm) แทน script ต้องเป็น `pnpm run docs`

  ปรับโครงใหม่:
  - job `apps` build playground กับเว็บเอกสารครั้งเดียว แล้ว job `e2e` แบบ matrix รัน component / docs × Chromium / WebKit / Firefox ขนานกัน
  - ติดตั้ง browser ให้ครบ (เดิมติดตั้งแค่ Chromium แต่รันทุก project)
  - เลือก runner ได้ด้วย repository variable `WT_RUNNER` (เช่น `self-hosted` แบบโปรเจคอื่นของ Wirabyte)
  - แถว Angular 21 / Node 20.19 ของ `ng add` ใช้ npm 11 เพราะ npm ที่มากับ Node 20.19 พังใน `ng new` ("reading 'edgesOut'")
- **ลองทุก job ใน Linux ก่อน push (Docker, image `mcr.microsoft.com/playwright` รุ่นเดียวกับ e2e และ `node:<รุ่นต่ำสุด>`):** เพราะ Firefox ของ Playwright เปิดบนเครื่อง Windows นี้ไม่ได้ ชุด Firefox จึงไม่เคยรันมาก่อน ผลที่เจอ:
  - **บั๊กจริง:**
    - ใน Firefox การลากปรับความกว้างคอลัมน์ไปเรียงคอลัมน์นั้นด้วย เพราะ click ที่ตามมาไปลงที่หัวคอลัมน์ แก้ด้วยการกลืน click นั้นแบบเดียวกับการลากย้ายคอลัมน์
    - การกดหัวคอลัมน์เพื่อลากย้ายเริ่มเลือกข้อความ ปิดค่าเริ่มต้นของการกดแล้ว focus เอง และห้าม dragstart / selectstart ระหว่างกด
    - View Transition ที่ browser ข้าม (เครื่องช้า) ทำให้ `ready` / `updateCallbackDone` reject จนกลายเป็น error จึงรับไว้ด้วย
  - **เรื่องของชุดทดสอบ:**
    - Firefox ทิ้งข้อมูลของ paste event ที่สร้างเอง จึงตรวจก่อนว่าข้อมูลอยู่ไหม
    - Firefox รายงาน font ที่โหลดไม่ทันตอนเปลี่ยนหน้าภายใต้ที่อยู่ของหน้า จึงกรองจากข้อความด้วย
    - ตาราง Firefox กว้างกว่า จุดปล่อยของการลากจึงหลุดจอ แก้ให้อยู่ในหน้าต่าง
    - หน้า Studio โหลดยังไม่เสร็จแล้ว reload ทันที

### 12.27 เตรียมออก beta (2 พ.ย. 2569)

- **v3 ไม่จำกัดเพดาน Angular:** `tools/versions.mjs` ตั้ง `max: null` จึงได้ peer `>=21.0.0` และ `wiraicon` ได้ `>=15.0.0` · CI เพิ่ม `ng add` บน Angular 22 (Node ต่ำสุดที่ CLI 22 รับคือ 22.22.3) และ `latest` · Angular CLI 22 ต้องการ Node `^22.22.3 || ^24.15 || >=26`
- **ทุกแพ็กเกจเป็น `-beta.0`** · `tools/publish.mjs` เลือก dist-tag จากรุ่น (รุ่นจริง: `latest`, `v2-lts`, `v1-lts`; prerelease: `beta`, `v2-beta`, `v1-beta`) · workflow **Publish** กดเองเท่านั้น ค่าเริ่มต้นเป็น dry run ใช้ secret `NPM_TOKEN` และ registry จาก variable `WU_NPM_REGISTRY` (ไม่ตั้ง = npmjs) ซึ่งเผื่อคำตอบของข้อ 13.1 · ครั้งแรกต้องออก v3 ก่อน เพราะ npm ชี้ `latest` ไปที่รุ่นแรกที่ขึ้น registry
- **ชื่อใหม่ WiraUI (ผู้ใช้เลือก):** `wiraui` บน npm ว่าง ส่วน `wiraui.com` เป็นร้านธีม WordPress ของคนอื่น จึงเปลี่ยนก่อนออกรุ่นแรกทั้งชื่อแพ็กเกจและ prefix (`wu-*`, `WuXxx`, `wuXxx`, `--wu-*`, `WU_*`) ส่วน `wiraicon` และ class / attribute แบบ `p-*`, `pTemplate` คงเดิม · repository variable `WT_RUNNER` คงชื่อเดิม เพราะตั้งอยู่บน GitHub
- **เผยแพร่:** npm สาธารณะ (ข้อ 13.1 ตัดสินแล้ว) repo เป็น public เอกสารนี้จึงเรียกแอปของทีมว่า แอป A–E · เว็บเอกสาร deploy บน OpenShift (`deploy/openshift/`)
- **การกล่าวถึง UI library เดิม:** README และข้อความในแพ็กเกจไม่เอ่ยชื่อ ให้มีได้หน้าเดียวบนเว็บ คือหัวข้อเครื่องมือช่วยย้ายแบบไม่บังคับในหน้า “ย้ายโปรเจคเดิม” ให้ผู้ใช้เลือกเอง (`ng g wiraui:from-primeng`)
- **ของในแพ็กเกจ:** เพิ่ม `repository` / `homepage` / `bugs` และ CHANGELOG, README ไม่มีชื่อแอปจริงแล้ว, comment ของ preset ที่ซ่อนไว้ไม่มีชื่อของบุคคลที่สาม

### 12.26 Dock, SiteFooter, BottomBar (28 ต.ค. 2569)

- **Dock** (`wiraui/dock`, ทุกรุ่น): เดิมไม่ได้ทำเพราะไม่มีแอปใช้ ผู้ใช้ขอเพื่อทำหน้าจอแบบ Windows / macOS · API แบบ `p-dock` (`model`, `position`, `pTemplate="item"`) · `look="mac"`: ไอคอนขยายตามระยะจากเมาส์แบบ cosine (`dockScale` ใน core) ตั้ง `--wu-dock-scale` ที่แต่ละไอคอนนอก change detection ความกว้างไอคอนเปลี่ยนจริงให้ไอคอนข้าง ๆ ขยับ เด้งเมื่อคลิก จุดใต้แอปที่ `active` ย่อไอคอนเองเมื่อกล่องแคบ (ResizeObserver) · `look="windows"`: taskbar เต็มความกว้าง ไอคอนกลาง ช่อง `start` / `end` ขีดใต้แอปที่เปิด ขีดยาวสำหรับ `current` · หน้า docs มีหน้าจอตัวอย่างแบบ mac (แถบเมนู หน้าต่าง) และแบบ Windows (ปุ่ม Start เมนู Start ถาดนาฬิกา) · schematic ย้าย `p-dock` → `wu-dock` แล้ว
- **SiteFooter** (`wiraui/sitefooter`): ชื่อ tag `wu-site-footer` เพราะ `wu-footer` คือ slot ท้ายของ card และ dialog อยู่แล้ว (แทน `p-footer`) ถ้าใช้ชื่อเดียวกัน dialog จะมี footer ทั้งเว็บโผล่ · คอลัมน์ลิงก์พับเป็น accordion ด้วย container query จึงพับตามความกว้างของ footer เองไม่ใช่จอ
- **BottomBar** (`wiraui/bottombar`): รายการที่เลือกตาม `activeIndex` หรือ route (ตรงที่สุดชนะ) · `pill` รายการที่เลือกขยาย (flex-grow) · `fab` รอยเว้าทำด้วย mask บน `::before` ปุ่มจึงไม่ถูกตัด · `hideOnScroll` ฟัง scroll นอก change detection · `env(safe-area-inset-bottom)`

### 12.25 ErrorPage (28 ต.ค. 2569)

- **`wu-error-page`** (`wiraui/errorpage`, ทุกรุ่น, อยู่ใน angular-common แบบ @Input): หน้าข้อผิดพลาดสำเร็จรูปของรหัส 400–599 · `core/errorpage.ts` แยกรหัสเป็นกลุ่ม (`httpErrorKind`: auth forbidden missing time busy server gateway down request) และเลือกปุ่ม (`httpErrorActions`) · ข้อความอยู่ใน locale `errorPage` (แบบทางการต่อรหัส 17 ตัว + `4xx` / `5xx` กลาง, แบบ kawaii ต่อกลุ่ม) · แบบทางการ: ไอคอนในกรอบสีอ่อน คำว่า “ข้อผิดพลาด” และรหัสตัวใหญ่ไล่สี · แบบ kawaii: ตัวการ์ตูนหูแมวถือป้ายรหัสสีหลักของธีม ท่าทางตามกลุ่ม (เครื่องหมายคำถาม กุญแจ มึนหัว หลับ เหงื่อตก ปลั๊กหลุด) ขยับตัว กะพริบตา ประกายระยิบ นิ่งเมื่อลดการเคลื่อนไหว ปุ่มทรงกลมกดยุบ · ปุ่มส่ง `(action)` ก่อนทำงาน `preventDefault()` เพื่อใช้ router แทน · `reference` สำหรับแจ้งฝ่ายช่วยเหลือ · `fullPage` สำหรับ route `**`

### 12.24 ไลบรารีเดียวจบ: Excel, EmptyState, Result, pipe ภาษาไทย, Chart / ChartJS, WuDialogService และตัวย้ายจาก UI library เดิม (28 ต.ค. 2569)

ไล่ช่องว่างจากผลสำรวจ 27 แอป (12.18) ตามจำนวนแอปที่ได้ประโยชน์ **หลักที่ผู้ใช้ตั้ง:** ของที่ library อื่นทำได้ดีกว่าไม่ต้องทำเอง ให้แอป import คู่กัน (แบบ chart.js) ทำเองเฉพาะที่ของเราเหมาะกว่า (เล็ก ไม่มี dependency ผูกกับ component และธีม)

- **Excel (`core/excel.ts`, `wiraui/excel`, Table `exportExcel()`):** ผู้ใช้เลือกเขียน writer เองแทนการห่อ ExcelJS (ใหญ่ ~1 MB และไม่ออกรุ่นใหม่ตั้งแต่ 2023) สร้าง Office Open XML + ZIP เอง (บีบอัดด้วย `CompressionStream` ถ้ามี ไม่มีก็เก็บแบบไม่บีบอัด) สไตล์เป็น object แบบแบน (`bold`, `color`, `fill`, `border`, `align`, `format` …) รวมเซลล์ด้วย `colSpan` / `rowSpan` แบบตาราง HTML หรือ `merges` สูตร (Excel คำนวณตอนเปิด, `fullCalcOnLoad`) ลิงก์ ตรึงแถว ตัวกรอง ตั้งค่าการพิมพ์ หลาย sheet วันที่เป็นวันที่จริง (`calendar: 'buddhist'` ใช้รูปแบบ `[$-th-TH,107]` แสดง พ.ศ.) ข้อความเป็นข้อความเสมอ (เลข 0 นำหน้าไม่หาย ไม่มีการกลายเป็นสูตร) · `excelSheetFromRows()` ทำรายงาน: หัวเรื่องรวมเซลล์ หัวตารางตรึงพร้อมปุ่มกรอง แถวรวมเป็น `SUBTOTAL` ที่คิดตามตัวกรอง สีตามเงื่อนไข · ตรวจกับ Excel จริงผ่าน COM (เปิดได้ไม่ต้องซ่อม สูตรคำนวณถูก วันที่ พ.ศ. ถูก) และ openpyxl · การ**อ่าน**ไฟล์ Excel รูปภาพ กราฟใน Excel ให้ใช้ SheetJS / ExcelJS คู่กัน
- **EmptyState (`wiraui/emptystate`) และ Result (`wiraui/result`):** ภาพวาดเส้นของเราเองในสีของธีม (6 แบบ / รหัส 403 404 500 ที่มีภาพแทนเลข 0) ข้อความเริ่มต้นใน locale (`emptyState`, `result`) ทุกรุ่น
- **pipe ภาษาไทย (`wiraui/thai`):** `wuDate` (รูปแบบที่ตั้งชื่อไว้หรือ pattern, พ.ศ. ในภาษาไทย ค.ศ. ในภาษาอื่น, อ่าน `'yyyy-mm-dd'` เป็นวันตามเวลาเครื่อง), `wuTimeAgo`, `wuBahtText` (ตรงกับ `BAHTTEXT` ของ Excel ทุกกรณีที่ทดสอบ), `wuThaiPhone`, `wuThaiId`, `wuThaiDigits`
- **Chart และ ChartJS:** ผู้ใช้ขอให้มีทั้งกราฟของเราเองและ Chart.js ใน v3 แล้วตั้งชื่อให้ไม่สับสนเป็น **Chart** (ของเรา) กับ **ChartJS** · v3: `wiraui/chart` (`<wu-chart>`, อยู่ใน `angular-v3/overlay/chart`) คือกราฟของเราเอง และ `wiraui/chartjs` (`<wu-chartjs>`) คือตัวห่อ Chart.js · v1 / v2: มี `wiraui/chartjs` และ `wiraui/chart` ยังเป็นกราฟ Chart.js ชื่อเดิม (`angular-v1/src/chart`, `angular-v2/overlay/chart`) ให้ `p-chart` → `wu-chart` ย้ายได้ทุกรุ่น · playground ทดสอบ `wu-chartjs` · กราฟของเราเองวาดด้วย SVG ไม่ต้องลง Chart.js · ส่วนคำนวณอยู่ใน `core/chart` (สเกลตัวเลขกลม, เส้นโค้งแบบ monotone ที่ไม่เกินข้อมูล, ชิ้นวงกลม, layout ทั้งหมดเป็นพิกเซล) · แท่ง (กลุ่ม ซ้อน แนวนอน) เส้น พื้นที่ วงกลม โดนัท เรดาร์ จุด/ฟอง ผสมกัน แกนขวา เส้นอ้างอิง · ข้อความเป็นตัวอักษรจริงในฟอนต์ของหน้า (ไทยไม่เพี้ยน; `font`, `fontSize`) วัดความกว้างด้วย canvas ของฟอนต์จริง · ตัวเลข ฿ / % / หน่วยไทย (พัน หมื่น แสน ล้าน; Intl ของ `th-TH` ให้ 1.2K จึงเขียนเอง) · legend ซ่อนแสดง (ชุดที่ซ่อนหดลงก่อนหายไป) tooltip ตามเมาส์และคีย์บอร์ด (ประกาศผ่าน aria-live) ตารางข้อมูลซ่อนสำหรับโปรแกรมอ่านจอ · เคลื่อนจากค่าเดิมไปค่าใหม่ (tween ที่ข้อมูล แกนจึงขยับตามเอง; ปิดได้ และนิ่งเองเมื่อผู้ใช้ขอลดการเคลื่อนไหว) · export SVG / PNG · รับ `[data]` / `[options]` แบบ Chart.js · สี `--wu-chart-1…10` (1 = สีหลักของ preset) · **รอบสาม:** แบบใหม่ 10 แบบใน `core/chart/kinds.ts` วาดด้วย shape ทั่วไป (`model.shapes` / `texts`) ที่ hover target มี tooltip ของตัวเองและหาเจอด้วย `chartHit()` (กล่อง เส้น วงแหวน จุด) แต่ละแบบมี `variant`: stream (silhouette / wiggle / expand, ชื่ออยู่ในช่วงที่หนาสุด) waterfall (bars / steps, `null` คือแท่งยอดรวม) dumbbell (dots ไล่สี / arrow / range) timeline (bars / thin, แกนเวลาเลือกช่วงเอง พ.ศ. ในภาษาไทย งานซ้อนแยกช่อง) funnel (funnel โค้ง / bars + % ที่เหลือ / pyramid) boxplot (box / violin KDE / points, คำนวณควอไทล์จากค่าดิบ) histogram (bars / density, ขอบช่วงเป็นเลขกลม เส้นค่าเฉลี่ย) sunburst (sunburst / icicle, คลิกเจาะลง Esc ย้อน) unit (waffle 100 / dots / people 50 ปัดเศษแบบ largest remainder) slope (lines / highlight, ป้ายไม่ทับกัน) และ heatmap ลักษณะ circle / hex (รังผึ้ง) ตัวเลขในช่อง · ปุ่มสลับแบบกราฟ `swap` (Beta): `chartSwapTypes()` เลือกแบบที่ข้อมูลชุดนั้นแสดงได้ เปลี่ยนแล้ว clone SVG เดิมวางทับให้จางหายขณะกราฟใหม่โตขึ้น (`kind` เป็น linkedSignal ของ `type`) · แบบที่ค่าไม่ควร tween (ค่าดิบ ช่วงเวลา โหนด หน่วย) ใช้ entrance ของ shape เอง (grow / pop / draw / fade เรียงหน่วงทีละชิ้น) · token ใหม่ `--wu-chart-up/-down/-total/-muted` · **รอบสอง (ให้ต่างจาก Chart.js แบบ ApexCharts):** พื้นที่ไล่สี (`gradient`) เส้นขั้นบันได (`curve: 'step'`) `radialBar` (วงแหวนความคืบหน้า / เกจครึ่งวงด้วย `startAngle` / `endAngle` ซึ่งใช้กับโดนัทได้ด้วย) `polarArea` `heatmap` (เฉดสีเดียวตามค่า หรือ `colorRanges` ที่ legend ซ่อนเป็นช่วงได้) `treemap` (squarified, หลายชุดจัดเป็นกลุ่ม) `sparkline` `annotations` (เส้น / แถบที่ค่าหรือป้าย และจุดที่มีป้าย) แถบเครื่องมือ (`toolbar`: ลากเพื่อซูมช่วงป้าย ซูมเข้าออก ดาวน์โหลด PNG / SVG / CSV) และ `group` ให้หลายกราฟแสดง tooltip พร้อมกัน · animation: แกนใช้สเกลสุดท้ายตั้งแต่เริ่ม (ไม่ไล่ตามค่าที่กำลังโต) และเลื่อนจากสเกลเก่าไปใหม่เมื่อข้อมูลเปลี่ยน วงกลมกางออก (`sweep`) ค่าบนกราฟรอจนวาดเสร็จ · ป้าย % บนชิ้นวงกลมแสดงเฉพาะเมื่ออยู่ในชิ้นได้ทั้งหมด · หน้า docs ของ component ที่ต้องลง library อื่น (ChartJS → chart.js) มีกล่องคำสั่งติดตั้งด้านบน (`requires` ใน ComponentDoc) · หน้าที่มีบางรุ่น: nav มี `since` (v1/v2 ไม่เห็น Chart ในเมนูและการค้นหา ที่อยู่ /components/chart เดิมของ v1/v2 พาไป ChartJS สลับรุ่นจากหน้า Chart ไปหน้าบทนำ)
- **WuDialogService (`wiraui/dialog`):** `open(Component, { header, width, data, footer, … })` คืน `WuDialogRef` (`onClose`, `result` เป็น promise) ใน component ที่เปิด inject `WuDialogConfig` / `WuDialogRef` · ชื่อ `DialogService`, `DynamicDialogRef`, `DynamicDialogConfig` ของ UI library เดิม export ไว้ด้วย · เขียนใน angular-common จึงใช้ได้ทุกรุ่น (สร้าง component ด้วย `ViewContainerRef` เพราะ `NgComponentOutlet` ของ Angular 15 ไม่ให้ instance)
- **`ng g wiraui:from-primeng`:** เปลี่ยน import `primeng/*` เป็น `wiraui/*` (NgModule และ class เปลี่ยนชื่อ: Dropdown → Select, Calendar → DatePicker, InputSwitch → ToggleSwitch, OverlayPanel → Popover, Sidebar → Drawer, TabView → Tabs …; service ใช้ชื่อเดิม) และ tag `<p-…>` ใน `.html` และ `template:` เป็น `<wu-…>` ที่มีจริงเท่านั้น ส่วนที่ย้ายไม่ได้รายงานไว้ · test เทียบตารางชื่อกับ source จริงทุกตัว · ลองแบบไม่เขียนไฟล์กับ แอป A: 179 ไฟล์ 367 import 3,004 tag เหลือให้คนทำ 9 จุด (TreeTable 4, Chips 4, DomHandler 1) ซึ่งชี้ว่า **TreeTable และ InputChips ควรทำต่อ**
- **หมวดหมู่ของเว็บเอกสาร (ผู้ใช้ขอ):** เพิ่มกลุ่ม **Layout** (class grid / flex / spacing / sizing / position / form layout และ component ที่แบ่งพื้นที่: Divider, Splitter, Toolbar, ScrollPanel) · **Utilities** เหลือ class ด้านหน้าตา (Styling: typography, สี, เส้นขอบ) และ **Helpers** ที่ไม่ใช่ component (Excel, pipe ภาษาไทย, Animate on scroll, Ripple, DragDrop) · **Components** จัดตามหน้าที่: Form, Button, Panel, Navigation, Data, Charts (Chart, ChartJS, OrganizationChart, Flow), Display, Feedback (Message, Toast, ProgressBar, ProgressSpinner, Skeleton, BlockUI, EmptyState, Result), Media, Overlay · URL ของหน้าไม่เปลี่ยน · หัวเล็กบนหน้าบอกตำแหน่งตาม sidebar
- **แก้ระหว่างทาง:** token ที่มีสองค่าใน `calc()` (`pad('2rem 1rem')`) เป็น CSS ที่ใช้ไม่ได้ จึงแยกเป็น `calc()` ต่อค่าและเพิ่ม test กันไว้ · class ของชนิดกราฟบน root (`wu-chart-area` ตอนนั้นชื่อ `wu-wirachart-area`) ชนกับ class ของพื้นที่ ทำให้ทั้งกราฟจาง จึงเปลี่ยนเป็น `wu-chart-type-*` · regex แบบ look-behind ใช้ไม่ได้ใน Safari ก่อน 16.4 (core อยู่ในทุก entry จึงพังทั้ง library) จึงเลี่ยง
- **ยังไม่ทำ:** ที่อยู่ไทย (รอตัดสินแหล่งข้อมูล ข้อ 13.9), TreeTable, InputChips, DataView, CascadeSelect, MegaMenu, SpeedDial, ConfirmPopup, ScrollTop, countdown, stat card, ตัวเลือกปีการศึกษา · ของที่ library อื่นทำได้ดีกว่าและไม่ทำในไลบรารีหลัก: แผนที่, PDF, barcode / QR, signature pad, การอ่านไฟล์ Excel

---

## 13. คำถามที่ต้องตัดสินใจ

1. **License (ตัดสินแล้ว):** MIT ใช้ฟรีทุกรุ่นแบบ UI library เดิม ยุคเดิม ไม่มี license ขายและไม่มีรุ่น LTS แบบเสียเงิน (ไฟล์ `LICENSE` ที่ root ถูก copy เข้าทุกแพ็กเกจ) ช่องทาง publish คือ npm สาธารณะ
8. **Figma UI Kit (เริ่มแล้ว, ดู 12.22):** มี Figma kit คู่กับโค้ด โดยให้ Theme Designer export token เป็น Figma Variables / W3C Design Tokens JSON เพิ่มจาก SCSS/CSS/TS/JSON เดิม เพื่อให้ Figma กับโค้ดใช้ token ชุดเดียวกัน และ component ใน kit ตั้งชื่อ variant ตาม input ของ component (`severity`, `variant`, `size`) ให้ designer กับ dev คุยภาษาเดียวกัน ต้องตัดสินใจว่าจะเริ่มใน Phase 2 (พร้อม Designer ตัวจริง) หรือ Phase 3
2. **โดเมนของเว็บแนะนำ** เช่น `wiraui.wirabyte.com` และ host ที่ไหน (มีโปรเจค NodeJS Web Hosting อยู่แล้ว หรือใช้ Cloudflare Pages)
3. **utility library เดิม (ตัดสินแล้ว):** ทำ utility ของ WiraUI เองในตัว (`wiraui/utils`, 6.11) ชื่อ class เดิม เปิด/ปิดได้
4. **Icon:** พึ่ง icon font เดิม/Font Awesome ต่อไป หรือทำ `@wiraui/icons` (ตอนนี้ icon ที่ใช้ภายใน component เป็น SVG inline จึงไม่บังคับ dependency)
5. **ชื่อและเอกลักษณ์ของ preset** (Wira / Lanna / Siam / …) และจะใช้ Kanit เป็นฟอนต์เริ่มต้นไหม
6. **ที่เก็บธีมใน Designer:** เก็บในเครื่องอย่างเดียว (localStorage + ไฟล์) หรือผูกบัญชีผู้ใช้เพื่อเก็บบน server
9. **ข้อมูลที่อยู่ไทย (จังหวัด / อำเภอ / ตำบล / รหัสไปรษณีย์):** ฝังชุดข้อมูลในแพ็กเกจ (โหลดเมื่อใช้ ต้องเลือกแหล่งที่ license ใช้ได้และมีคนดูแล) หรือให้แอปส่งข้อมูลเข้ามา / ใช้ library ข้อมูลคู่กัน
7. **API naming:** ยืนยันว่าจะใช้ชื่อแบบ UI library เดิม (`(onClick)`, `optionLabel`) เพื่อให้ย้ายง่าย แม้จะไม่ตรงกับ Angular style guide (ที่ไม่ให้ขึ้นต้น output ด้วย `on`)
