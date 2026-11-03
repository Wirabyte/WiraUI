# Changelog

รุ่นของ `@wirabyte/ui` แยก major ตามช่วง Angular: `1.x` = 15–17, `2.x` = 18–20, `3.x` = 21 ขึ้นไป ทุก major ออกจาก source ชุดเดียวกัน หัวข้อด้านล่างจึงใช้กับทุก major ยกเว้นที่ระบุไว้ ส่วน `@wirabyte/icons` ออกพร้อมกันแต่ใช้เลขของตัวเอง

## 1.0.0-beta.0 · 2.0.0-beta.0 · 3.0.0-beta.0 · @wirabyte/icons 1.0.0-beta.0

รุ่นแรกที่ออกให้ทดลองใช้ เอกสารอยู่ที่ https://ui.wirabyte.com

- แพ็กเกจอยู่ใต้ org Wirabyte: `@wirabyte/ui` และ `@wirabyte/icons` (ชื่อ `wiraui` และ `wiraicon` ที่ขึ้นไปก่อนหน้าถูกถอนออกแล้ว)

- Component มากกว่า 90 entry point ใช้ได้ทั้ง NgModule และ standalone พร้อมธีม SCSS / CSS / TypeScript, Theme Studio และ `ng add`
- ของงานไทย: พ.ศ., เลขบัตรประชาชน, pipe `@wirabyte/ui/thai`, ข้อความไทยในตัว
- เขียนเองทั้งหมด ไม่ต้องลง library เพิ่ม: Editor, Flow, Excel export, Chart แบบ SVG (เฉพาะ v3)
- ใช้คู่กับ UI library เดิมแล้วย้ายทีละหน้าได้ พร้อมเครื่องมือช่วยย้ายแบบไม่บังคับ
- `@wirabyte/ui@3` รับ Angular 21 และทุกรุ่นที่ใหม่กว่า ทดสอบบน 21, 22 และรุ่นล่าสุด
- `@wirabyte/icons`: 424 icon × 5 น้ำหนัก ติดตั้งแยกได้

**ยังไม่มี:** TreeTable, InputChips, DataView, CascadeSelect, MegaMenu, SpeedDial, ConfirmPopup, ScrollTop, AutoComplete แบบ `multiple`, virtual scroll ของ Table และ Listbox
