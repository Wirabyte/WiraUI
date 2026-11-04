# WiraUI UI Kit สำหรับ Figma

plugin สำหรับ Figma (แบบ development) ที่สร้าง UI Kit ของ WiraUI ลงในไฟล์ Figma จาก token จริงของไลบรารี ค่าสี ระยะ และมุมโค้งทุกค่าคำนวณจากธีมที่ build แล้ว ไม่ได้กรอกเอง เมื่อไลบรารีเปลี่ยน แค่ build ใหม่แล้วสร้าง kit ใหม่

kit มี **ทุก component ที่มีหน้าตา** ใน `@wirabyte/ui` (95 entry point จาก 107 ส่วนที่เหลือเป็น helper ที่ไม่มีหน้าตา เช่น config, api, ripple) เทสต์จะล้มถ้ามี component ใหม่ในไลบรารีที่ยังไม่ได้วาดใน kit

## สร้างอะไรให้บ้าง

- **Variables:** collection `WiraUI · <preset>` มีตัวแปรราว 1,200 ตัว (สี, ระยะ, ตัวเลข) และ 2 mode คือ Light / Dark ชื่อแบ่งกลุ่มเป็น `palette/primary/500`, `button/secondary-bg`, `field/focus-border` … และคำอธิบายของแต่ละตัวคือชื่อ CSS (`--wu-…`)
  - token แบบหลายค่า เช่น padding `0 1.25rem 1.25rem` แยกเป็นตัวแปรต่อด้าน `kit/<ชื่อ>-top` / `-right` / `-bottom` / `-left` (มุมโค้ง `-tl` …, gap `-row` / `-column`)
  - Figma แพลนฟรีให้ collection ละ mode เดียว ถ้าเป็นแพลนนี้ ค่า Dark จะไปอยู่อีก collection ชื่อ `… · Dark`
- **Styles:**
  - Text styles: Heading H1–H4, Body, Label, Caption, Code ใช้ฟอนต์ของ preset
  - Effect styles: เงาทุกระดับ, เงาของ overlay / dialog / toast และวงโฟกัส
- **หน้า Foundations:** palette, สีเชิงความหมาย, ตัวอย่างตัวอักษร (ภาษาไทยพร้อมสระวรรณยุกต์) และเงา
- **หน้า Components:** ทุกชิ้นผูกกับ variables ทั้งสี padding gap มุมโค้ง และเส้นขอบ เปลี่ยน mode เป็น Dark หรือแก้ตัวแปร ทั้ง kit ก็เปลี่ยนตาม ชิ้นที่ประกอบจากชิ้นอื่น (dialog ที่มีปุ่ม, ตารางที่มี cell) ใช้ instance จึงแก้ต้นแบบที่เดียวแล้วเปลี่ยนตามทั้งหมด
  - **ปุ่มและตัวเลือก:** Button (Severity × Variant × Size × State 216 variant), SelectButton (แบบปกติ, chips, cards), ToggleButton, SplitButton
  - **ฟอร์ม:**
    - InputText, Textarea, IconField, FloatLabel (Over / In / On), InputGroup
    - InputNumber, InputMask, InputOtp, Password (พร้อมแถบความแข็งแรง)
    - Select, MultiSelect, AutoComplete, Listbox, DatePicker (วัน ช่วง เดือน เวลา แสดง พ.ศ.), ColorPicker
    - Checkbox, RadioButton, ToggleSwitch, Rating, Knob, Slider
    - FileUpload, Editor, SignaturePad
  - **แสดงข้อมูล:**
    - Tag, Badge, Avatar (มี Severity), Chip, ProgressBar, ProgressSpinner, MeterGroup, Skeleton (รวมโครงการ์ด รายการ แถวตาราง)
    - Stat, Descriptions, Timeline, Tree, TreeSelect, OrganizationChart
    - Table (cell ทุกสถานะ และตารางตัวอย่าง), PickList, OrderList, Chart (Bar, Line, Doughnut, Pie), Scroller
  - **แจ้งเตือน:** Message, Toast, Tooltip, Alert, EmptyState, Result, ErrorPage, BlockUI
  - **กล่องและ overlay:** Card, Dialog, ConfirmDialog, Drawer, Popover, Panel, Fieldset, Accordion, Divider, Toolbar, Splitter, ScrollPanel, Inplace
  - **เมนูและการนำทาง:** Menu, TieredMenu, ContextMenu, Menubar (รวมแบบมือถือ), PanelMenu, Tab, TabMenu, Breadcrumb (มีแบบ plain), Steps, Stepper, Paginator, Dock (แบบ Mac / Windows), BottomBar
  - **สื่อ:** Image (พร้อมหน้าต่าง preview), Galleria, Carousel, ImageCompare, ImageCropper
  - **โครงหน้า:** Navbar, Aside menu, SiteFooter, LanguageSwitch
  - **ชิ้นใหญ่ระดับแอป:** Chat, Scheduler (สัปดาห์ / เดือน), Terminal, Flow
- **หน้า Icons:** wiraicon ครบ 424 ตัว (น้ำหนัก regular) เป็น component ใช้กับ property Icon glyph ได้ทันที

ชื่อ variant ตรงกับ input ของ component ในโค้ด (`severity`, `variant`, `size`, `position` …) ให้ designer กับ dev คุยภาษาเดียวกัน ข้อความตัวอย่างเป็นภาษาไทยและใช้ชื่อสมมติทั้งหมด

ข้อจำกัดของ Figma ที่ kit เลือกวาดแทน: รูปภาพเป็นกล่องสีพร้อมไอคอนรูป (เปลี่ยนเป็นรูปจริงได้ใน Figma), สีไล่ระดับของ ColorPicker เป็นช่องสีเรียงกัน, เส้นของ Flow และลายเซ็นประกอบจากแท่งและวงโค้ง

## Build

ต้อง build ธีม v3 และ icon ก่อน:

```bash
pnpm build:core && pnpm --filter @wiraui-build/angular-v3 build && pnpm build:icons
pnpm build:figma
```

ผลลัพธ์อยู่ใน `packages/figma/dist/`:

- `manifest.json`, `code.js`, `ui.html` คือตัว plugin
- `tokens/<preset>.<light|dark>.json` คือ token รูปแบบ W3C Design Tokens (DTCG) สำหรับเครื่องมืออื่น เช่น Tokens Studio

โค้ดของ plugin อยู่ใน `src/code.ts` (ตัวช่วยและ component ชุดแรก) และ `src/sets/*.ts` (กลุ่ม component แต่ละกลุ่ม) build จะต่อไฟล์เหล่านี้เป็นไฟล์เดียว แต่ละกลุ่มลงทะเบียนตัวเองด้วย `kitSection({ order, title, note, covers, build })` โดย `covers` คือชื่อ entry point ที่กลุ่มนั้นวาด

## ตรวจ

`pnpm test:figma` จะ build แล้วตรวจชนิดกับ `@figma/plugin-typings` จากนั้นรัน plugin กับ Figma API จำลอง (`scripts/mock-figma.mjs`) ครบทุก preset การจำลองบังคับกฎเดียวกับที่ Figma ตรวจตอนรันจริง:

- ต้องโหลดฟอนต์ก่อนใส่ข้อความ
- FILL ใช้ได้เฉพาะใน auto layout
- ผูกตัวแปรได้เฉพาะ field ที่ Figma อนุญาต
- variant ในชุดเดียวกันต้องมีชื่อ property เหมือนกัน
- ข้อความที่ผูกกับ property ต้องแก้ผ่าน `setProperties`

และตรวจเพิ่มอีก 2 ข้อ:

- token ทุกตัวที่ใช้ต้องมีในทุก preset และเป็นชนิดที่ถูกต้อง (ใช้ token สีเป็นระยะไม่ได้)
- ทุก entry point ที่มีหน้าตาใน `@wirabyte/ui` ต้องอยู่ใน `covers` ของ section ใดสักอัน

CI รันชุดนี้ทุกครั้งที่ push

**ดูหน้าตาโดยไม่ต้องเปิด Figma:** `pnpm preview:figma` วาด kit เป็น HTML ที่ `dist/preview/<preset>.<light|dark>.html` (flexbox แทน auto layout ใช้ดูโครง สี และ state ได้ใกล้เคียง แต่ไม่ใช่ Figma จริง) ตัวช่วยเลือก token: `node scripts/tokens.mjs '<regex>' [preset]`

## ใช้ใน Figma

1. เปิด **Figma desktop** (plugin แบบ development ใช้ในเว็บไม่ได้) แล้วเปิดไฟล์ใหม่หรือไฟล์ที่จะเก็บ kit
2. เมนู **Plugins → Development → Import plugin from manifest…** เลือก `packages/figma/dist/manifest.json`
3. เปิด **Plugins → Development → WiraUI UI Kit** เลือก preset และติ๊กส่วนที่ต้องการ แล้วกด **Build the kit**

plugin จะสร้างหน้า `Foundations · <preset>`, `Components · <preset>` และ `Icons · <preset>` ใช้เวลาราว 1–2 นาที ถ้าต้องการหลาย preset ให้สร้างทีละตัว แต่ละตัวได้ collection และหน้าของตัวเอง แนะนำให้สร้างในไฟล์กลางของทีม แล้ว **Publish เป็น Library** ให้ไฟล์งานของ designer ดึงไปใช้

**ฟอนต์:** kit ใช้ฟอนต์ของ preset (Kanit, Sarabun, Prompt, IBM Plex Sans Thai, Anuphan, Roboto …) ซึ่ง Figma มีจาก Google Fonts ถ้าเครื่องหาไม่เจอจะใช้ Inter แทนและแจ้งในหน้าต่าง plugin ส่วนตัวอย่าง Code ใช้ JetBrains Mono ถ้ามี

**สีม่วงบานเย็น (magenta)** หมายถึง token ที่ preset นั้นไม่มี plugin จะบอกชื่อ token ไว้ในหน้าต่าง (เทสต์จะล้มก่อนถึงตอนนั้น ชุดปัจจุบันจึงไม่มีตัวที่ขาด)
