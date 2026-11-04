# Changelog

รุ่นของ `@wirabyte/ui` แยก major ตามช่วง Angular: `1.x` = 15–17, `2.x` = 18–20, `3.x` = 21 ขึ้นไป ทุก major ออกจาก source ชุดเดียวกัน หัวข้อด้านล่างจึงใช้กับทุก major ยกเว้นที่ระบุไว้ ส่วน `@wirabyte/icons` ออกพร้อมกันแต่ใช้เลขของตัวเอง

## 1.1.0 · 2.1.0 · 3.1.0

**ของใหม่**

- นาฬิกากลางของแอป: `provideWiraUI({ now: () => serverTime.now() })` ให้ทุก component ใช้เวลานี้เป็น "ตอนนี้" แทนนาฬิกาเครื่องผู้ใช้ ได้แก่ วันนี้และเดือนแรกที่แสดงใน DatePicker, วันนี้และเส้นเวลาปัจจุบันใน Scheduler, pipe `wuTimeAgo`, ป้ายวันในแชท และปีใน SiteFooter เปลี่ยนภายหลังได้ที่ `WuConfig.clock` และอ่านด้วย `WuConfig.now()` ส่วนตัวจับเวลา (หน่วงการค้นหา อายุของ toast) ยังใช้นาฬิกาเครื่อง (WUI-024)

**แก้บั๊ก**

- Textarea ที่ใช้ `autoResize` ไม่ทำให้เบราว์เซอร์แจ้ง error "ResizeObserver loop completed with undelivered notifications" แล้ว เดิมเกิดเมื่อเปิด dialog หรือ panel ที่ช่องมีข้อความอยู่ก่อน และแอปที่ส่ง error ของหน้าเว็บเข้า `ErrorHandler` จะเห็นเป็น `ERROR` ใน console (WUI-022) ตอนนี้ช่องยังขยายตามข้อความตั้งแต่เฟรมแรกที่แสดงเหมือนเดิม
- Aside Menu บนมือถือ: ปุ่มปิดอยู่มุมบนด้านท้ายแถวเดียวกับโลโก้ และส่วน start กว้างเต็มหัวเมนู เดิมเมื่อ start สูง (โลโก้ นาฬิกา การ์ดผู้ใช้) ปุ่มไปอยู่กึ่งกลางความสูงและกินความกว้างทุกแถว ควรเว้นท้ายแถวแรกของ start ไว้ให้ปุ่ม (WUI-023)

## 1.0.0 · 2.0.0 · 3.0.0 · @wirabyte/icons 1.0.0

รุ่นจริงรุ่นแรก ติดตั้งได้ด้วย `ng add @wirabyte/ui` (Angular 21 ขึ้นไป), `@wirabyte/ui@2` (18–20) หรือ `@wirabyte/ui@1` (15–17) โดยไม่ต้องระบุ tag แล้ว รวมทุกข้อที่พบจากการใช้จริงกับแอปแรก (รหัส WUI-001 ถึง WUI-021)

**แก้บั๊ก**

- Card, Panel, Accordion, Fieldset, Tabs, SelectButton, Toolbar, Popover และ cell editor ของ Table ไม่ดึง template `#header` / `#content` / `#footer` ของ component ที่อยู่ข้างในไปใช้อีก เช่น ตารางหรือ timeline ในการ์ด
- Textarea ที่ใช้ `autoResize` วัดขนาดใหม่เมื่อเริ่มแสดง จึงไม่สูง 0px ใน dialog หรือ panel ที่เปิดทีหลัง
- Datepicker ใช้ปฏิทินตามภาษาของแอปเหมือน pipe `wuDate`: ภาษาไทยใช้ `calendar` ที่ตั้งไว้ ภาษาอื่นใช้ ค.ศ. (`WuConfig.calendarFor()`)
- ปุ่ม icon-only ที่มี `badge` แสดงป้ายลอยที่มุมปุ่ม ปุ่มไม่ขยายตาม
- Navbar ไม่ล้นจอบนมือถือ: ปุ่มด้านขวาคงขนาด ชื่อหรือ brand ที่ยาวตัดด้วย …

**ธีม**

- `$tokens` / `$dark-tokens` (SCSS) และ `tokens` (TypeScript) ตั้งค่า token ใดก็ได้ด้วยชื่อ ชื่อที่สะกดผิดจะแจ้ง error
- token ฟอนต์หัวข้อ `$heading-font-family` / `semantic.headingFontFamily` ใช้กับหัวข้อของ card, dialog, drawer, panel และอื่น ๆ
- `provideWiraUI({ fonts })`: ค่าเริ่มต้น `'google'` โหลดฟอนต์ของธีมจาก Google Fonts ให้ ถ้าหน้าเว็บยังไม่ได้โหลด ตั้ง `'none'` สำหรับแอปที่ใช้ฟอนต์ของตัวเอง ส่วน `ng add --font=none` จะเขียนค่านี้ให้
- preset `wira` หน้าตาใหม่: มุมโค้ง 10, เงา soft, หัวตารางโปร่ง, เมนูที่เลือกเป็นสีอ่อน
- tag แบบ soft ใช้สีโปร่งของสีหลัก จึงเห็นชัดบนพื้นเทา และ breadcrumb มี `variant="plain"`

**ของใหม่**

- `wu-chat`: แชทพร้อม bubble, จัดกลุ่มตามผู้ส่ง, คั่นวัน, ไฟล์และรูป, สถานะอ่านแล้ว, ตัวบอกกำลังพิมพ์ และช่องพิมพ์ที่วางรูปได้
- `wu-scheduler`: ปฏิทินนัดหมายแบบวัน สัปดาห์ เดือน ลากเลื่อนนัดได้ และแสดงปี พ.ศ. ตามภาษา
- `wu-signature-pad`: ช่องเซ็นลายเซ็นสำหรับฟอร์ม ค่าที่ได้เป็นรูป PNG
- `wu-stat`: การ์ดตัวเลข KPI พร้อมไอคอน, แนวโน้ม และสีตามความหมาย
- `wu-descriptions`: รายการ label / value หลายคอลัมน์ ยุบเหลือคอลัมน์เดียวเมื่อกรอบแคบ
- SelectButton `variant="chips"` (ตัวกรองแบบ chip) และ `variant="cards"` (การ์ดตัวเลือก), Avatar `severity`, MeterGroup `showValue` และ legend ที่คลิกได้ (`clickable`, `(onItemClick)`)

**เอกสาร:** วิธีวาง global CSS ใน `@layer reset` และ override ใน `@layer wiraui.overrides`, การโหลดฟอนต์เมื่อติดตั้งแบบ manual และ footer ของ card

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
