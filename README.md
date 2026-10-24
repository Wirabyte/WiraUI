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
pnpm build
pnpm test
```
