<p align="center">
  <img src="https://raw.githubusercontent.com/Wirabyte/WiraUI/main/apps/docs/public/favicon.svg" width="88" height="88" alt="WiraUI" />
</p>

<h1 align="center">WiraUI</h1>

<p align="center">
  UI component library + Theme Designer สำหรับ Angular ของ Wirabyte<br />
  API คุ้นมือ เขียนเองทั้งหมด และมีของที่งานไทยต้องใช้ในตัว
</p>

<p align="center">
  <a href="https://ui.wirabyte.com"><b>คู่มือและตัวอย่าง: ui.wirabyte.com</b></a>
</p>

<p align="center">
  <a href="https://github.com/Wirabyte/WiraUI/blob/main/README.md">English</a> · <b>ภาษาไทย</b>
</p>

<p align="center">
  <a href="https://github.com/Wirabyte/WiraUI/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/Wirabyte/WiraUI/actions/workflows/ci.yml/badge.svg?branch=main" /></a>
  <img alt="Angular 15+" src="https://img.shields.io/badge/Angular-15%2B-dd0031?logo=angular&amp;logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&amp;logoColor=white" />
  <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-16a34a" />
</p>

## ✨ มีอะไรบ้าง

- **Component มากกว่า 90 ตัว** ตั้งแต่ปุ่มและฟอร์มไปจนถึงตาราง กราฟ Editor และแผนภาพ Flow ใช้ได้ทั้ง NgModule และ standalone
- **เขียนเองทั้งหมด:** Editor, Flow, Excel export และกราฟ SVG (v3) ไม่ต้องลง library เพิ่ม
- **ของงานไทยมาในตัว:** วันที่ พ.ศ., เลขบัตรประชาชน, ฟอนต์ไทย และข้อความไทย/อังกฤษ
- **ปรับธีมได้เต็มที่:** มี preset, ปรับด้วย SCSS, CSS หรือ TypeScript และมี Theme Studio ให้ใช้ฟรี
- **ใช้งานได้ทุกคนทุกจอ:** รองรับคีย์บอร์ดครบ และแสดงผลได้ตั้งแต่มือถือถึงเดสก์ท็อป
- **`@wirabyte/icons`:** แพ็กเกจ icon ของเราเอง 424 icon 5 น้ำหนัก ใช้แยกจาก WiraUI ได้

## 📦 ติดตั้ง

ตอนนี้เป็นรุ่น beta จึงต้องระบุ tag ตามรุ่น Angular ของแอป:

| Angular | คำสั่ง | แพ็กเกจ | สถานะ |
|---|---|---|---|
| 21 ขึ้นไป | `ng add @wirabyte/ui@beta` | `@wirabyte/ui@3` | active (latest) |
| 18 – 20 | `ng add @wirabyte/ui@v2-beta` | `@wirabyte/ui@2` | active |
| 15 – 17 | `ng add @wirabyte/ui@v1-beta` | `@wirabyte/ui@1` | maintenance |

`ng add` ตั้งค่าธีม ฟอนต์ และ icon ให้ โดยถามเฉพาะที่จำเป็น จากนั้นเรียกใช้ component ได้เลย:

```html
<wu-button label="บันทึก" icon="wi wi-save" (onClick)="save()"></wu-button>
<wu-datepicker [(ngModel)]="due" dateFormat="dd/mm/yy" [showIcon]="true"></wu-datepicker>
```

## 🧭 แนวทางการใช้งาน

- **ใช้ major ให้ตรงกับช่วง Angular:** แต่ละ major ล็อกกับช่วงของตัวเอง และจะไม่ยอมติดตั้งข้ามช่วง
- **อัปเกรด Angular ข้ามช่วงในคำสั่งเดียว** เพื่อให้ Angular กับ WiraUI ขยับพร้อมกัน:
  `ng update @angular/core@18 @angular/cli@18 @wirabyte/ui@v2-beta`
- **ปรับหน้าตาผ่านไฟล์ธีม** ไม่เขียน CSS ทับ component เพื่อให้หน้าตาคงเดิมเมื่อออกรุ่นใหม่
- **ย้ายแอปเดิมทีละหน้าได้:** WiraUI ใช้คู่กับ UI library เดิมได้ ไม่ต้องย้ายทีเดียว
- **จำไว้ว่าเป็น beta:** API ยังเปลี่ยนได้ระหว่างรุ่น beta ถ้าใช้บน production ควรล็อกเวอร์ชันให้ตรงตัว

## 📚 อ่านต่อ

| เรื่อง | ลิงก์ |
|---|---|
| เริ่มต้น | [แนะนำ](https://ui.wirabyte.com/v3/getting-started/introduction) · [ติดตั้ง](https://ui.wirabyte.com/v3/getting-started/installation) · [ตั้งค่า](https://ui.wirabyte.com/v3/getting-started/configuration) |
| Component | [รายการและตัวอย่างทั้งหมด](https://ui.wirabyte.com/v3/components/button) · [Icon](https://ui.wirabyte.com/v3/getting-started/icons) |
| ธีม | [ภาพรวม](https://ui.wirabyte.com/v3/theming/overview) · [Preset](https://ui.wirabyte.com/v3/theming/presets) · [Theme Studio](https://ui.wirabyte.com/v3/theming/studio) |
| แอปเดิม | [ย้ายโปรเจคเดิม](https://ui.wirabyte.com/v3/getting-started/migration) |

เจอปัญหาหรือมีไอเดีย? [เปิด Issue](https://github.com/Wirabyte/WiraUI/issues) หรืออ่าน [CONTRIBUTING.md](https://github.com/Wirabyte/WiraUI/blob/main/CONTRIBUTING.md) ถ้าอยากร่วมพัฒนา

## 📄 License

[MIT](https://github.com/Wirabyte/WiraUI/blob/main/LICENSE) ใช้ฟรี
