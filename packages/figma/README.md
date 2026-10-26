# WiraTheme UI Kit สำหรับ Figma

plugin สำหรับ Figma (แบบ development) ที่สร้าง UI Kit ของ WiraTheme ลงในไฟล์ Figma จาก token จริงของไลบรารี ค่าสี ระยะ และมุมโค้งทุกค่าคำนวณจากธีมที่ build แล้ว ไม่ได้กรอกเอง เมื่อไลบรารีเปลี่ยน แค่ build ใหม่แล้วสร้าง kit ใหม่

## สร้างอะไรให้บ้าง

- **Variables:** collection `WiraTheme · <preset>` มีตัวแปร 848 ตัว (สี, ระยะ, ตัวเลข) และ 2 mode คือ Light / Dark ชื่อแบ่งกลุ่มเป็น `palette/primary/500`, `button/secondary-bg`, `field/focus-border` … และคำอธิบายของแต่ละตัวคือชื่อ CSS (`--wt-…`)
  - Figma แพลนฟรีให้ collection ละ mode เดียว ถ้าเป็นแพลนนี้ ค่า Dark จะไปอยู่อีก collection ชื่อ `… · Dark`
- **Styles:**
  - Text styles: Heading H1–H4, Body, Label, Caption, Code ใช้ฟอนต์ของ preset
  - Effect styles: เงาทุกระดับ, เงาของ overlay / dialog / toast และวงโฟกัส
- **หน้า Foundations:** palette, สีเชิงความหมาย, ตัวอย่างตัวอักษร (ภาษาไทยพร้อมสระวรรณยุกต์) และเงา
- **หน้า Components:** ทุกชิ้นผูกกับ variables ทั้งสี padding gap มุมโค้ง และเส้นขอบ เปลี่ยน mode เป็น Dark หรือแก้ตัวแปร ทั้ง kit ก็เปลี่ยนตาม
  - Button: Severity × Variant × Size × State รวม 216 variant พร้อม property Label / Icon / Icon glyph
  - InputText, Select พร้อม panel ตัวเลือก
  - Checkbox, RadioButton, ToggleSwitch
  - Tag, Badge, Avatar, Chip, ProgressBar, Slider, Tooltip
  - Message, Toast
  - Card, Dialog, Menu
  - Tab, Breadcrumb, Steps, Accordion, Paginator
  - Table: cell ทุกสถานะ และตารางตัวอย่างที่สร้างจาก instance ของ cell
  - Navbar, Aside menu
- **หน้า Icons:** wiraicon ครบ 424 ตัว (น้ำหนัก regular) เป็น component ใช้กับ property Icon glyph ได้ทันที

ชื่อ variant ตรงกับ input ของ component ในโค้ด (`severity`, `variant`, `size`) ให้ designer กับ dev คุยภาษาเดียวกัน

## Build

ต้อง build ธีม v3 และ icon ก่อน:

```bash
pnpm build:core && pnpm --filter @wiratheme-build/angular-v3 build && pnpm build:icons
pnpm build:figma
```

ผลลัพธ์อยู่ใน `packages/figma/dist/`:

- `manifest.json`, `code.js`, `ui.html` คือตัว plugin
- `tokens/<preset>.<light|dark>.json` คือ token รูปแบบ W3C Design Tokens (DTCG) สำหรับเครื่องมืออื่น เช่น Tokens Studio

`pnpm test:figma` จะ build แล้วตรวจชนิดกับ `@figma/plugin-typings` จากนั้นรัน plugin กับ Figma API จำลองครบทุก preset การจำลองบังคับกฎเดียวกับที่ Figma ตรวจตอนรันจริง:

- ต้องโหลดฟอนต์ก่อนใส่ข้อความ
- FILL ใช้ได้เฉพาะใน auto layout
- ผูกตัวแปรได้เฉพาะ field ที่ Figma อนุญาต
- ข้อความที่ผูกกับ property ต้องแก้ผ่าน `setProperties`

การจำลองตัดสินหน้าตาไม่ได้ ต้องเปิดดูใน Figma

## ใช้ใน Figma

1. เปิด **Figma desktop** (plugin แบบ development ใช้ในเว็บไม่ได้) แล้วเปิดไฟล์ใหม่หรือไฟล์ที่จะเก็บ kit
2. เมนู **Plugins → Development → Import plugin from manifest…** เลือก `packages/figma/dist/manifest.json`
3. เปิด **Plugins → Development → WiraTheme UI Kit** เลือก preset และติ๊กส่วนที่ต้องการ แล้วกด **Build the kit**

plugin จะสร้างหน้า `Foundations · <preset>`, `Components · <preset>` และ `Icons · <preset>` ใช้เวลาไม่ถึงนาที ถ้าต้องการหลาย preset ให้สร้างทีละตัว แต่ละตัวได้ collection และหน้าของตัวเอง

**ฟอนต์:** kit ใช้ฟอนต์ของ preset (Kanit, Sarabun, Prompt, IBM Plex Sans Thai, Anuphan, Roboto …) ซึ่ง Figma มีจาก Google Fonts ถ้าเครื่องหาไม่เจอจะใช้ Inter แทนและแจ้งในหน้าต่าง plugin ส่วนตัวอย่าง Code ใช้ JetBrains Mono ถ้ามี

**สีม่วงบานเย็น (magenta)** หมายถึง token ที่ preset นั้นไม่มี plugin จะบอกชื่อ token ไว้ในหน้าต่าง (ชุดปัจจุบันไม่มีตัวที่ขาด)
