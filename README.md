# WiraTheme

UI component library + Theme Designer สำหรับ Angular ที่ใช้แทน PrimeNG ในโปรเจคของ Wirabyte
หน้าตาและวิธีใช้คล้าย PrimeNG แต่เขียนเองทั้งหมด และมีของที่งานไทยต้องใช้ในตัว (พ.ศ., เลขบัตรประชาชน, ฟอนต์ไทย)

| แพ็กเกจ | Angular | สถานะ |
|---|---|---|
| `wiratheme@1` | 15 – 17 | maintenance |
| `wiratheme@2` | 18 – 20 | active |
| `wiratheme@3` | 21+ | active (latest) |

แต่ละรุ่นถูกล็อกกับช่วง Angular ของตัวเอง ติดตั้งข้ามช่วงไม่ได้

## เอกสาร

- [DESIGN.md](DESIGN.md) สถาปัตยกรรม, ระบบธีม, versioning และลำดับงาน
- [prototype/theme-designer](prototype/theme-designer/index.html) ต้นแบบ Theme Designer

## โครง repo

```
packages/core            @wiratheme/core: token engine, exporters, Thai utils (TypeScript ล้วน)
packages/themes          SCSS theme (@use … with) + CSS สำเร็จรูป
packages/angular-signal  source ของ component แบบ signal ที่ v2 และ v3 ใช้ร่วมกัน
packages/angular-v1      build ของ wiratheme@1 (Angular 15 toolchain)
packages/angular-v2      build ของ wiratheme@2 (Angular 18 toolchain)
packages/angular-v3      build ของ wiratheme@3 (Angular 21 toolchain)
packages/schematics      ng add / ng update
apps/docs                เว็บแนะนำ (Angular 21, NgModule, โหลดแต่ละรุ่นแบบ lazy)
apps/playground-v*       แอปทดสอบของแต่ละรุ่น (npm project แยก)
```

## พัฒนา

ใช้ Node 24 LTS (ดู `.nvmrc`) และ pnpm 9

```bash
pnpm install
pnpm test          # core, SCSS ↔ TS parity (Sass 1.58 + ปัจจุบัน), schematics
pnpm pack:all      # build + pack wiratheme v1, v2, v3 เป็น tarball
```

ทดสอบแบบแอปจริง (ครั้งแรกให้รัน `npm ci` ใน `apps/playground-v1..v3` และ `apps/docs` ก่อน):

```bash
pnpm playgrounds   # npm install tarball + ng add wiratheme + ng build ในทั้ง 3 playground
pnpm docs          # build เว็บ docs ที่โหลด v1/v2/v3 แบบ lazy บน Angular 21
pnpm e2e           # Playwright: 3 รุ่นต้องหน้าตาตรงกัน + เว็บ docs
```

ลอง `ng add` กับโปรเจคที่มีอยู่โดยไม่แตะไฟล์ (รันในหน่วยความจำแล้วแสดง diff):

```bash
node tools/dry-run-ng-add.mjs "../../Angular NodeJS SS Apps/Strisrinan_Apps"
```

ถ้า npm ในเครื่องเป็น 10.2.x ซึ่งมีบั๊กกับ Angular 21 ให้อัปเดต npm หรือรันสคริปต์ด้วย `WT_NPM="npx -y npm@11"`
