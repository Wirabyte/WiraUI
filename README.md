<p align="center">
  <img src="apps/docs/public/favicon.svg" width="88" height="88" alt="WiraUI" />
</p>

<h1 align="center">WiraUI</h1>

<p align="center">
  UI component library + Theme Designer สำหรับ Angular ของ Wirabyte<br />
  API คุ้นมือ เขียนเองทั้งหมด และมีของที่งานไทยต้องใช้ในตัว (พ.ศ., เลขบัตรประชาชน, ฟอนต์ไทย)<br />
  เอกสารและตัวอย่าง: <a href="https://ui.wirabyte.com">ui.wirabyte.com</a>
</p>

<p align="center">
  <a href="https://github.com/Wirabyte/WiraUI/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/Wirabyte/WiraUI/actions/workflows/ci.yml/badge.svg?branch=main" /></a>
  <img alt="Angular 15+" src="https://img.shields.io/badge/Angular-15%2B-dd0031?logo=angular&amp;logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&amp;logoColor=white" />
  <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-16a34a" />
  <img alt="Thai first: Buddhist dates, Thai ID, Thai fonts" src="https://img.shields.io/badge/Thai--first-%E0%B8%9E.%E0%B8%A8.%20%C2%B7%20%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%20%C2%B7%20%E0%B8%9F%E0%B8%AD%E0%B8%99%E0%B8%95%E0%B9%8C%E0%B9%84%E0%B8%97%E0%B8%A2-0d9488" />
</p>

| แพ็กเกจ | Angular | หน้าตา | ธีม | สถานะ |
|---|---|---|---|---|
| `wiraui@1` | 15 – 17 | classic | `sila-light-*`, `sila-dark-*`, `arun-*`, `sayan-*`, `ratri-*`, `md-*` | maintenance |
| `wiraui@2` | 18 – 20 | styled | Mali, Sila, Material, Phet | active |
| `wiraui@3` | 21+ | ของ WiraUI (ค่าเริ่มต้น **Wira**) + styled | Wira, Lanna, Siam, Nakhon, Glass (Liquid Glass) + ของ v2 | active (latest) |

แต่ละรุ่นถูกล็อกกับช่วง Angular ของตัวเอง ติดตั้งข้ามช่วงไม่ได้ · License: [MIT](LICENSE) ใช้ฟรี

## 📦 ติดตั้ง

ตอนนี้เป็นรุ่น beta จึงต้องระบุ tag ตามรุ่น Angular ของแอป (เมื่อออกรุ่นจริงจะใช้ `ng add wiraui` ได้เลย):

```bash
ng add wiraui@beta      # Angular 21 ขึ้นไป
```

```bash
ng add wiraui@v2-beta   # Angular 18 – 20
```

```bash
ng add wiraui@v1-beta   # Angular 15 – 17
```

`wiraui@3` รับ Angular 21 และทุกรุ่นที่ใหม่กว่าโดยไม่จำกัดเพดาน CI ทดสอบ `ng add` กับ Angular 21, 22 และรุ่นล่าสุดเสมอ · ดูการเปลี่ยนแปลงที่ [CHANGELOG.md](CHANGELOG.md)

**ย้ายโปรเจคเดิม:** ใช้คู่กับ UI library เดิมแล้วย้ายทีละหน้าได้ ดูหน้า “ย้ายโปรเจคเดิม” ในเว็บเอกสาร · ขนาดและระยะของแต่ละรุ่นตรงกับธีมยุคเดียวกันที่แอปเดิมใช้, DOM มี class `p-*` ของยุคนั้น (`p-button`, `p-card-body`, `p-highlight`, …) และไฟล์ธีมสร้างตัวแปร `--surface-ground`, `--primary-color` (v1) หรือ `--p-primary-color`, `--p-surface-*` (v2/v3) ให้ CSS เดิมของแอปยังใช้ได้ ดูรายละเอียดที่ [DESIGN.md §6.10](DESIGN.md)

```jsonc
// v1: แทนไฟล์ธีมเดิม ".../themes/<ชื่อธีม>/theme.css" (ชื่อธีมของ WiraUI ดูตารางเทียบใน DESIGN.md §12.8)
"node_modules/wiraui/themes/sila-light-teal/theme.css"
```

## 🧩 Component ที่มีแล้ว

ทุกตัวมีใน v1, v2 และ v3 ใช้ได้ทั้ง NgModule (`WuXxxModule`) และ standalone (`WuXxx`) CSS ชุดเดียวกันทุกรุ่น ส่วนหน้าตามาจากธีมของรุ่นนั้น (ใส่ preset เดียวกันแล้ว pixel ตรงกันทุกรุ่น)

| Entry point | ใช้แบบนี้ | หมายเหตุ |
|---|---|---|
| `wiraui/button` | `<wu-button label="บันทึก" [action]="save">` | `[action]` แสดง spinner และกันกดซ้ำจนงานเสร็จ · `size="small"`/`"large"` · `<button wuButton>` (อ่าน `pButton` ได้) · `styleClass="p-button-sm p-button-danger"` |
| `wiraui/card` | `<wu-card header="…" subheader="…">` | slot `[wuCardHeader]`, `[wuCardActions]`, `[wuCardFooter]` · `variant` outlined / elevated / glass (v3) · `loading` |
| `wiraui/inputtext` | `<input wuInputText [(ngModel)]="name">` | `wuSize`, `variant="filled"`, `fluid`, `invalid` |
| `wiraui/textarea` | `<textarea wuTextarea autoResize formControlName="note">` | `autoResize` ขยายตามข้อความ รวมค่าที่ตั้งจากโค้ด |
| `wiraui/checkbox` | `<wu-checkbox [(ngModel)]="agree" binary label="…">` | `binary` หรือแบบกลุ่ม (array + `value`) |
| `wiraui/radiobutton` | `<wu-radiobutton name="plan" value="sci" formControlName="plan">` | กลุ่มเดียวกันใน Reactive Forms อัปเดตกันเอง |
| `wiraui/toggleswitch` | `<wu-toggleswitch [(ngModel)]="notify" label="…">` | `trueValue` / `falseValue` |
| `wiraui/tag` | `<wu-tag value="อนุมัติ" severity="success" rounded>` | สีทึบหรือสีอ่อนตามธีม, รับ `severity="warning"` แบบเดิมได้ |
| `wiraui/badge` | `<wu-badge value="8" severity="danger">` | ไม่ใส่ `value` เป็นจุด, `size` small / large / xlarge |
| `wiraui/chip` | `<wu-chip label="แอดมิน" removable (onRemove)="…">` | icon หรือรูป, ปุ่มลบกดได้ด้วยคีย์บอร์ด |
| `wiraui/avatar` | `<wu-avatar image="…" label="สม" shape="circle">` | รูปเสียแล้วกลับไปใช้ตัวอักษร, `wu-avatar-group` วางซ้อนกัน |
| `wiraui/divider` | `<wu-divider align="center">หรือ</wu-divider>` | แนวนอน/แนวตั้ง, solid / dashed / dotted |
| `wiraui/skeleton` | `<wu-skeleton width="10rem">` | `shape="circle"`, `size`, ปิด animation ได้ |
| `wiraui/progressbar` | `<wu-progressbar [value]="60">` | `mode="indeterminate"`, ตั้งความสูงด้วย `style` · นับจำนวน `[max]="2500" unit="รายการ"` → `1,000 / 2,500 รายการ` · `text` หรือ template `#content` |
| `wiraui/metergroup` | `<wu-metergroup [value]="[{ label: 'แอป', value: 16 }]">` | หลายค่าในแถบเดียวพร้อมคำอธิบาย, `min`/`max`, แนวตั้ง, `labelPosition`, template label / meter / start / end / icon |
| `wiraui/progressspinner` | `<wu-progress-spinner style="width: 2rem">` | สีและขนาดเริ่มต้นตามธีม |
| `wiraui/message` | `<wu-message severity="warn" text="…" closable [life]="5000">` | `variant` outlined / simple, `size` |
| `wiraui/panel` | `<wu-panel header="…" toggleable [(collapsed)]="closed">` | slot `[wuPanelHeader]`, `[wuPanelIcons]`, `[wuPanelFooter]`, เนื้อหาที่ยุบกด tab ไม่ถึง |
| `wiraui/fieldset` | `<wu-fieldset legend="ที่อยู่" toggleable>` | ใช้ `<fieldset>` จริง |
| `wiraui/iconfield` | `<wu-iconfield><wu-inputicon icon="pi pi-search"></wu-inputicon><input wuInputText></wu-iconfield>` | ไอคอนก่อน input อยู่ซ้าย หลัง input อยู่ขวา, markup เดิม `p-input-icon-left` ใช้ได้ |
| `wiraui/inputgroup` | `<wu-inputgroup><wu-inputgroup-addon>฿</wu-inputgroup-addon><input wuInputText></wu-inputgroup>` | ใส่ปุ่มได้, markup เดิม `p-inputgroup` ใช้ได้ |
| `wiraui/floatlabel` | `<wu-floatlabel><input wuInputText id="n"><label for="n">ชื่อ</label></wu-floatlabel>` | `variant` over / on / in, markup เดิม `p-float-label` ใช้ได้ |
| `wiraui/togglebutton` | `<wu-togglebutton [(ngModel)]="bold" onLabel="ตัวหนา">` | ค่า boolean, ไอคอนเปิด/ปิด |
| `wiraui/selectbutton` | `<wu-selectbutton [options]="plans" optionLabel="name" optionValue="id" [(ngModel)]="plan">` | `multiple`, `allowEmpty`, `dataKey`, ขึ้นบรรทัดใหม่บนจอแคบ |
| `wiraui/rating` | `<wu-rating [(ngModel)]="score">` | ใช้ radio จริง กดลูกศรเลือกได้ |
| `wiraui/password` | `<wu-password [(ngModel)]="pw" toggleMask>` | แสดง/ซ่อนรหัส, แถบความแข็งแรงเปิดเป็นแผงใต้ช่องตอนโฟกัส (ไม่ดันเนื้อหา) |
| `wiraui/inputnumber` | `<wu-inputnumber [(ngModel)]="price" mode="currency" [min]="0" showButtons>` | แสดง `฿1,234.50` ตอนไม่ได้พิมพ์ ตัวเลขล้วนตอนพิมพ์, รับเลขไทย/ค่าที่วาง, พิมพ์ตัวอักษรไม่ได้ ทศนิยมไม่เกิน `maxFractionDigits` และไม่เกิน `max`, ลูกศรเพิ่ม-ลด, กดปุ่มค้างได้, คีย์บอร์ดตัวเลขบนมือถือ |
| `wiraui/datepicker` | `<wu-datepicker [(ngModel)]="due" dateFormat="dd/mm/yy" showIcon showTime>` | ปี พ.ศ. (หรือ `isBudhistYear`), เลือกวัน/ช่วง/หลายวัน/เดือน/ปี, ชม. นาที วินาที กดขึ้นลงหรือพิมพ์ได้, `readonlyInput` กับ `timeReadonlyInput` แยกกัน, เปิดใน top layer ไม่ต้อง `appendTo`, มือถือเป็น bottom sheet |
| `wiraui/dialog` | `<wu-dialog header="แก้ไข" [(visible)]="open" [style]="{ width: '50vw' }">` · `dialogs.open(PickStudent, { header, data })` | `<dialog>` แบบ modal ใน top layer, focus ไม่หลุดและกลับที่เดิม, ล็อก scroll, `breakpoints`, `maximizable`, `position`, slot `wuTemplate="footer"` (อ่าน `pTemplate` ได้), มือถือกว้างเต็มจอ · `WuDialogService` เปิด component ของแอปใน dialog คืนผลทาง `ref.onClose` / `await ref.result` (ชื่อ `DialogService`, `DynamicDialogRef`, `DynamicDialogConfig` ใช้ได้) |
| `wiraui/alert` | `WuAlert.fire('บันทึกแล้ว', '', 'success')` | alert สำเร็จรูปแบบ SweetAlert: ไอคอนเคลื่อนไหว, input + validator, `preConfirm` พร้อม spinner, timer, ปุ่มยืนยันอยู่ขวาเสมอ (`reverseButtons: false` สลับ); `import { WuAlert as Swal }` แล้วโค้ดเดิมใช้ต่อได้ |
| `wiraui/confirmdialog` | `<wu-confirmdialog>` + `confirmation.confirm({ message, accept })` | ถามก่อนทำ, รับ `acceptButtonStyleClass="p-button-success"`, ถ้าไม่มี component ในหน้าจะเปิดเป็น alert แทน |
| `wiraui/toast` | `<wu-toast>` + `messages.add({ severity: 'success', summary, detail })` | แสดงเหนือ dialog, เส้นนับถอยหลังด้านล่าง (`[showTimer]="false"` ปิด) หยุดตอน hover แล้วนับต่อจากที่เหลือ, ปุ่มปิดอยู่ขวาบนเสมอ, มือถือเต็มความกว้าง |
| `wiraui/tooltip` | `<button wuTooltip="บันทึก" tooltipPosition="top">` | รับ `pTooltip` เดิม, แสดงตอนโฟกัสด้วยคีย์บอร์ด, กลับด้านเมื่อไม่พอ, เลื่อนเมาส์ไปบน tooltip ได้ (คลิกลิงก์ข้างในได้; `[autoHide]="true"` ซ่อนทันที) |
| `wiraui/popover` | `<wu-popover #op>` + `(click)="op.toggle($event)"` | การ์ดมีลูกศรชี้ปุ่ม, กลับขึ้นบนเมื่อด้านล่างไม่พอ, คลิกข้างนอก/Escape ปิด |
| `wiraui/animate` | `provideWuAnimate()` + `<div data-aos="fade-up">` | animate on scroll แบบ AOS ด้วย attribute เดิม หรือ `[wuAnimate]`, เคารพ reduced motion |
| `wiraui/api` | `import { ConfirmationService, MessageService } from 'wiraui/api'` | service และ `WuTemplate` ในที่เดียว ใช้ชื่อเดิมได้ |
| `wiraui/toolbar` | `<wu-toolbar><div wuToolbarStart>…</div><div wuToolbarEnd>…</div></wu-toolbar>` | 3 กลุ่ม start / center / end ขึ้นบรรทัดใหม่บนจอแคบ |
| `wiraui/accordion` | `<wu-accordion [(activeIndex)]="i"><wu-accordion-tab header="…">` | `multiple`, `[(selected)]`, ปุ่มลูกศรเลื่อนระหว่างหัวข้อ |
| `wiraui/tabs` | `<wu-tabs [(activeIndex)]="i"><wu-tab-panel header="…">` · `<wu-tabs [model]="pages" [(activeItem)]="page">` | ปุ่มลูกศร/Home/End ข้ามแท็บที่ปิด, แท็บล้นแถวมีปุ่มเลื่อนซ้าย-ขวาแทน scrollbar และเลื่อนแท็บที่เลือกให้เห็นเสมอ, `[model]` ทำงานแบบ tab menu |
| `wiraui/select` | `<wu-select [options]="provinces" optionLabel="name_th" optionValue="id" [(ngModel)]="id" [filter]="true">` | ค้นหาไทย/อังกฤษ, group, showClear, editable, template item/selectedItem, คีย์บอร์ดครบ, เปิดใน top layer |
| `wiraui/multiselect` | `<wu-multiselect [options]="clubs" optionLabel="name" optionValue="id" [(ngModel)]="ids">` | ช่องเลือกหลายค่า มี checkbox, เลือกทั้งหมด, ค้นหาไทย, `display="chip"`, `maxSelectedLabels`, `selectionLimit` |
| `wiraui/inputmask` | `<wu-inputmask mask="9-9999-99999-99-9" [(ngModel)]="id" [unmask]="true">` | ใส่ขีดให้เอง, `autoClear`, `(onComplete)`, เลขไทยใช้ได้, แป้นตัวเลขบนมือถือ |
| `wiraui/timeline` | `<wu-timeline [value]="events">` + template content/opposite/marker | แนวตั้ง/แนวนอน, `align` left/right/alternate, ไม่มี opposite แล้วเนื้อหาเต็มแถว |
| `wiraui/chart` | `<wu-chart type="bar" [labels]="months" [series]="[{ name: 'รายรับ', data: income }]" format="compact">` | **v3: กราฟของ WiraUI เอง** วาดด้วย SVG ไม่ต้องลง library: แท่ง (กลุ่ม ซ้อน แนวนอน) เส้น (โค้ง ขั้นบันได) พื้นที่ไล่สี วงกลม โดนัท (ครึ่งวงได้) วงแหวน / เกจ (`radialBar`) วงกลมแบบรัศมี (`polarArea`) เรดาร์ จุด/ฟอง `heatmap` (สี่เหลี่ยม วงกลม รังผึ้ง) `treemap` `stream` `waterfall` `dumbbell` `timeline` (Gantt) `funnel` `boxplot` (กล่อง ไวโอลิน จุด) `histogram` `sunburst` / icicle (คลิกเจาะลงได้) `unit` (waffle จุด รูปคน) `slope` แต่ละแบบเลือกลักษณะด้วย `variant` ผสมได้ ปุ่มสลับแบบกราฟพร้อม animation (`swap`, Beta) แกนขวา เส้นอ้างอิง คำอธิบายบนกราฟ (`annotations`: เส้น แถบ จุดที่มีป้าย), กราฟจิ๋ว (`sparkline`), แถบเครื่องมือซูม (ลากเพื่อซูม) และดาวน์โหลด PNG / SVG / CSV, กราฟที่ชี้ไปด้วยกัน (`group`), ฟอนต์ไทยแสดงถูก (`font`, `fontSize`), ตัวเลขแบบ ฿ / % / พัน หมื่น แสน ล้าน, legend ซ่อนแสดง, tooltip ตามเมาส์และคีย์บอร์ด, เคลื่อนไหวเมื่อข้อมูลเปลี่ยน, ตารางข้อมูลให้โปรแกรมอ่านจอ, export PNG / SVG, รับ `[data]` / `[options]` แบบ Chart.js · **v1 / v2:** ชื่อเดิมของกราฟ Chart.js (ตัวเดียวกับ `wu-chartjs`) |
| `wiraui/chartjs` | `<wu-chartjs type="bar" [data]="data" [options]="options" height="320px">` | ห่อ Chart.js 3/4 (ติดตั้ง `chart.js` เอง) ใช้ได้ทุกรุ่น, ฟอนต์และสีของธีม, `[plugins]`, `(onDataSelect)`, `refresh()` · ใช้เมื่อต้องการปลั๊กอินหรือกราฟแบบที่ `wu-chart` ไม่มี |
| `wiraui/image` | `<wu-image [src]="url" alt="…" width="240" [preview]="true">` | ดูภาพเต็มจอใน dialog (top layer) หมุนและซูมได้, Esc ปิด, บนมือถือปุ่มดูภาพแสดงตลอด |
| `wiraui/autocomplete` | `<wu-autocomplete [(ngModel)]="v" [suggestions]="found" (completeMethod)="find($event)" optionLabel="name">` | แนะนำระหว่างพิมพ์, `delay`, `minLength`, `dropdown`, `forceSelection`, หน้าตาเดียวกับ Select (ยังไม่มี `multiple`) |
| `wiraui/paginator` | `<wu-paginator [first]="first" [rows]="10" [totalRecords]="120" (onPageChange)="…">` | รายงานภาษาไทย, จำนวนแถวต่อหน้า |
| `wiraui/menubar` | `<wu-menubar [model]="items">` + template start/end | เมนูย่อยซ้อนได้, `routerLink` / `url` / `command`, คีย์บอร์ดแบบ ARIA menubar, ปุ่มเมนูบนจอแคบ, ใช้เป็นแถบหัวเว็บที่มีแค่ start/end ได้ |
| `wiraui/menu` | `<wu-menu #m [model]="items" [popup]="true">` + `(click)="m.toggle($event)"` | แบบ popup (top layer ไม่ต้อง appendTo) หรือเมนูข้าง, กลุ่มมีหัวข้อ, คีย์บอร์ดครบ |
| `wiraui/tabmenu` | `<wu-tabmenu [model]="pages" [(activeItem)]="page">` | แท็บจาก menu model, `routerLink` / `command`, เลื่อนด้านข้างเหมือน wu-tabs (ตัวเดียวกับ `wu-tabs [model]`, อยู่ใน `wiraui/tabs`) |
| `wiraui/panelmenu` | `<wu-panelmenu [model]="items" [multiple]="true">` | เมนูข้างแบบแผงพับได้ ซ้อนกี่ชั้นก็ได้, เปิดตาม `expanded` ของ item, คีย์บอร์ดลูกศร |
| `wiraui/steps` | `<wu-steps [model]="steps" [(activeIndex)]="step">` | ขั้นตอนมีตัวเลข ขั้นที่ผ่านแล้วเป็นสีหลัก, `[readonly]="false"` ให้คลิก/คีย์บอร์ดเลือกขั้นได้ |
| `wiraui/table` | `<wu-table #dt [value]="rows" [paginator]="true" [rows]="10">` + template header/body | template แบบ p-table เดิม (`pTemplate`), sort, ค้นหา `dt.filterGlobal`, ตัวกรองต่อคอลัมน์ (แถว/เมนู หลายเงื่อนไข), เลือกแถว/checkbox/radio, lazy, ตรึงคอลัมน์และแถว, ปรับกว้าง/ลากเรียงคอลัมน์, ลากเรียงแถว, ขยายแถว, จัดกลุ่ม, แก้ไขในเซลล์/ทั้งแถว, `stateKey`, export CSV และ Excel (`dt.exportExcel({ title, totals, cellStyle })` ไม่ต้องลง library), stack บนมือถือ |
| `wiraui/excel` | `downloadExcel({ rows: [['ชื่อ', 'คะแนน'], ['วิระ', 18]] }, 'scores')` | สร้างไฟล์ .xlsx เอง ไม่ต้องลง library: สี ฟอนต์ เส้นขอบ รูปแบบตัวเลข รวมเซลล์ (`colSpan` / `rowSpan`) สูตร (รวม `BAHTTEXT`) หลาย sheet ตรึงแถว ตัวกรอง ตั้งค่าการพิมพ์ วันที่แสดง พ.ศ. ได้, `downloadRowsAsExcel()` รายงานจาก object (อ่านไฟล์ Excel ให้ใช้ SheetJS / ExcelJS คู่กัน) |
| `wiraui/emptystate` | `<wu-empty-state type="search"><wu-button label="ล้างตัวกรอง"></wu-button></wu-empty-state>` | ภาพวาด 6 แบบในสีของธีม (ไม่มีข้อมูล ค้นไม่พบ กล่องว่าง โฟลเดอร์ว่าง โหลดไม่สำเร็จ ออฟไลน์) ข้อความตามภาษา, `icon` / `image`, `size="small"` ในตาราง |
| `wiraui/result` | `<wu-result status="404"><wu-button wuResultExtra label="กลับหน้าแรก"></wu-button></wu-result>` | ผลของงาน success / error / info / warning และหน้า 403 / 404 / 500 ที่วาดรหัสพร้อมภาพ, ปุ่ม `wuResultExtra`, กล่องรายละเอียด |
| `wiraui/errorpage` | `<wu-error-page code="404" look="kawaii" fullPage></wu-error-page>` | หน้าข้อผิดพลาดสำเร็จรูปของรหัส 4xx / 5xx ทุกตัว สองแบบ: ทางการ (ไอคอนกับรหัสตัวใหญ่) และ kawaii (ตัวการ์ตูนถือป้ายรหัส ขยับตัว กะพริบตา) ข้อความไทย / อังกฤษของรหัสที่พบบ่อย ปุ่มตามรหัส (เข้าสู่ระบบ ลองอีกครั้ง ย้อนกลับ กลับหน้าแรก) `(action)` ให้ใช้ router ของแอป รหัสอ้างอิงสำหรับแจ้งฝ่ายช่วยเหลือ ทุกรุ่น |
| `wiraui/dock` | `<wu-dock [model]="apps" look="mac">` | แถบไอคอนเปิดแอปตามขอบกล่อง: แบบ macOS (ไอคอนขยายตามเมาส์อย่างนุ่มนวล เด้งเมื่อคลิก จุดใต้แอปที่เปิด ย่อไอคอนเองเมื่อกล่องแคบ) หรือแบบ taskbar ของ Windows (`look="windows"`, ช่อง `start` / `end` สำหรับปุ่ม Start และถาดนาฬิกา) `position` บน ล่าง ซ้าย ขวา คีย์บอร์ดครบ `p-dock` เดิมย้ายมาได้ ทุกรุ่น |
| `wiraui/sitefooter` | `<wu-site-footer brand="WiraUI" [model]="columns" [social]="social" [legal]="legal" [backToTop]="true">` | ส่วนท้ายเว็บ: ชื่อ คำอธิบาย คอลัมน์ลิงก์ ไอคอนโซเชียล แถวล่าง (ลิขสิทธิ์ ลิงก์นโยบาย ปุ่มกลับขึ้นด้านบน) แบบ `columns` / `simple` / `centered` จอแคบคอลัมน์พับเป็นหัวข้อที่กดเปิด (วัดความกว้างของตัวเอง) ช่อง `brand` `end` `bottom` (ชื่อ tag ไม่ใช่ `wu-footer` เพราะนั่นคือช่องท้ายของ card / dialog) ทุกรุ่น |
| `wiraui/bottombar` | `<wu-bottombar [model]="tabs" look="fab" [action]="newPost">` | เมนูล่างของแอปมือถือ: ไอคอน ชื่อ ป้ายตัวเลข รายการที่เลือกตาม `[(activeIndex)]` หรือ route แบบ `standard` / `pill` (แคปซูลลอย รายการที่เลือกขยายออก) / `fab` (ปุ่มกลมยกขึ้นตรงกลางในรอยเว้า) ติดขอบล่างเหนือแถบ home ของ iPhone `hideOnScroll` ซ่อนเมื่อเลื่อนลง ทุกรุ่น |
| `wiraui/thai` | `{{ born \| wuDate: 'long' }}` · `{{ total \| wuBahtText }}` · `{{ phone \| wuThaiPhone }}` | วันที่ พ.ศ. ตามภาษาของแอป, `wuTimeAgo`, จำนวนเงินเป็นตัวอักษรแบบ BAHTTEXT ของ Excel, เบอร์โทร / เลขบัตรประชาชนมีขีด, `wuThaiDigits` |
| `wiraui/validation` | `<input wuInputText formControlName="email"><wu-field-error for="email" label="อีเมล">` | ข้อความ error ภาษาไทย/อังกฤษตาม locale, `WuValidators.thaiId` / `thaiPhone` / `match`, directive `wuThaiId` `wuThaiPhone` `wuMatch` |
| `wiraui/picklist` / `orderlist` | `<wu-picklist [source]="all" [target]="picked">` · `<wu-orderlist [value]="rows">` | ย้าย/เรียงด้วยปุ่ม ลาก หรือดับเบิลคลิก, เลือกหลายแถว, ค้นหาแยกฝั่ง, บนมือถือเรียงบนลงล่าง |
| `wiraui/fileupload` | `<wu-fileupload name="file" url="/api/upload" accept="image/*" [maxFileSize]="2000000">` | ลากวาง, preview รูป, ตรวจชนิด/ขนาด/จำนวนพร้อมข้อความไทย, progress, `customUpload` + `(uploadHandler)`, โหมด `basic` |
| `wiraui/stepper` | `<wu-stepper [(value)]="step"><wu-step-list><wu-step [value]="1">…` · `<wu-stepper [model]="steps" [(activeIndex)]="i">` | แบบ value + panel, `linear`, แนวตั้งด้วย `wu-step-item`, `activateCallback`, `[model]` ทำงานแบบ Steps, `labelPosition="bottom"`, `subtitle`, `[readonly]` |
| `wiraui/editor` | `<wu-editor [(ngModel)]="html" toolbar="full" [imageUpload]="{ mode: 'upload', url: '/api/images' }">` | ทำเองทั้งหมด: ตาราง (เพิ่ม/ลบแถวคอลัมน์ รวม/แยกเซลล์), รูป base64 หรืออัปโหลดไป URL, ตั้งเครื่องมือ toolbar ได้ละเอียด (`toolbar`, `toolOptions`, `provideEditorOptions()`), วางจาก Word ได้สะอาด, เต็มจอ, ดู HTML, template `header` แบบเดิมใช้ได้ |
| `wiraui/slider` | `<wu-slider [(ngModel)]="volume" [min]="0" [max]="100" [step]="5">` | ค่าเดียวหรือช่วง (`[range]`), แนวตั้ง, ลาก/คลิก/คีย์บอร์ด |
| `wiraui/splitbutton` | `<wu-splitButton label="บันทึก" [model]="more" (onClick)="save()">` | ลูกศรเปิดเมนูคำสั่งอื่น, severity / outlined / size แบบ wu-button |
| `wiraui/listbox` | `<wu-listbox [options]="rooms" optionLabel="name" [(ngModel)]="room" [filter]="true">` | เลือกเดียว/หลายค่าพร้อม check box และเลือกทั้งหมด, จัดกลุ่ม, striped, คีย์บอร์ดครบ |
| `wiraui/galleria` | `<wu-galleria [value]="photos" [numVisible]="5">` + template item/thumbnail | ลูกศร จุด thumbnail เลื่อนตาม, `responsiveOptions`, เล่นเอง วนรอบ ปัดบนมือถือ, เต็มจอ |
| `wiraui/colorpicker` | `<wu-colorPicker [(ngModel)]="color">` | แผงสีใน top layer หรือ `inline`, ช่อง hex, `format` hex / rgb / hsb |
| `wiraui/breadcrumb` | `<wu-breadcrumb [model]="trail" [home]="home">` | `routerLink` / `url` / `command`, หน้าปัจจุบันเป็น `aria-current` |
| `wiraui/inplace` | `<wu-inplace>` + template display / content | คลิกข้อความแล้วเปิดช่องแก้ไขพร้อมโฟกัส, `closable`, Esc ปิด |
| `wiraui/blockui` | `<wu-blockUI [blocked]="isApiSaving">` | บังทั้งหน้า (modal) หรือเฉพาะ `[target]`, ของข้างใต้เป็น inert |
| `wiraui/scrollpanel` / `scroller` | `<wu-scrollPanel [style]="{ maxHeight: '12rem' }">` · `<wu-scroller [items]="rows" [itemSize]="40" scrollHeight="20rem">` | scrollbar บางตามธีม · virtual scroll วาดเฉพาะแถวที่เห็น, `lazy` |
| `wiraui/drawer` | `<wu-drawer [(visible)]="open" header="เมนู" position="left">` (`wu-sidebar` ก็ได้) | `<dialog>` ใน top layer, โฟกัสอยู่ข้างใน, Esc / คลิกพื้นหลังปิด, ซ้าย ขวา บน ล่าง เต็มจอ |
| `wiraui/tieredmenu` / `contextmenu` | `<wu-tieredMenu [model]="items">` · `<wu-contextMenu [model]="items" [target]="box">` | เมนูย่อยหลายชั้น (บนมือถือเปิดลงล่าง), เมนูคลิกขวาตรงตำแหน่งเมาส์ |
| `wiraui/tree` / `treeselect` | `<wu-tree [value]="nodes" selectionMode="checkbox" [(selection)]="picked">` · `<wu-treeSelect [options]="nodes" [(ngModel)]="node">` | check box กระจายลงลูกและขึ้นแม่, ค้นหา, โหลดลูกตอนเปิด, คีย์บอร์ดแบบ tree |
| `wiraui/navbar` | `<wu-navbar [model]="links" [sticky]="true"><a wuNavbarBrand routerLink="/">…` | แถบบน brand / links / end, เมนูย่อย, solid / glass / transparent, จอแคบพับลิงก์เข้าแผง |
| `wiraui/asidemenu` | `<wu-aside-menu #side [model]="menu" [(collapsed)]="mini">` + `<wu-navbar [aside]="side">` | เมนูด้านข้างหลายชั้น กลุ่มของหน้าปัจจุบันเปิดเอง, ย่อเหลือไอคอนพร้อม flyout, มือถือเป็นแผงเลื่อนเข้า |
| `wiraui/imagecropper` | `<wu-imagecropper [imageFile]="file" [aspectRatio]="1" (imageCropped)="saved($event)">` | ตัดรูปในตัว: EXIF, อัตราส่วน, ซูม หมุน พลิก, คีย์บอร์ด, ผลเป็น blob / base64 (`output` หรือทั้งแอปด้วย `provideImageCropperOptions()`), เลือกปุ่มบนแถบเครื่องมือ (`[toolbar]`) และเพิ่มปุ่มเอง (template `tools`), ความสูงคงที่ตอนหมุน (`image-cropper` เดิมก็ใช้ได้) |
| `wiraui/terminal` | `<wu-terminal welcomeMessage="…" prompt="$">` + `WuTerminalService` | หน้าจอพิมพ์คำสั่งแบบ console ประวัติ ↑ / ↓ คำสั่ง clear |
| `wiraui/imagecompare` | `<wu-imageCompare>` + template `left` / `right` | เทียบภาพก่อน / หลัง ลากเส้นแบ่งด้วยเมาส์ นิ้ว หรือคีย์บอร์ด `[(value)]` |
| `wiraui/carousel` | `<wu-carousel [value]="items" [numVisible]="3" [responsiveOptions]="…">` | ทีละหน้า ลูกศร แถบหน้า ปัด วนรอบ เล่นเอง (หยุดเมื่อชี้) แนวตั้ง |
| `wiraui/splitter` | `<wu-splitter [panelSizes]="[30, 70]">` + `<wu-splitter-panel>` | ช่องปรับขนาดได้ ซ้อนกันได้ คีย์บอร์ด ขนาดต่ำสุด จำขนาดใน storage |
| `wiraui/organizationchart` | `<wu-organizationChart [value]="tree" selectionMode="single">` | ผังองค์กรจาก TreeNode เส้นเชื่อม CSS เลือก ย่อ / ขยาย template ตามชนิด |
| `wiraui/knob` | `<wu-knob [(ngModel)]="value" [min]="0" [max]="100">` | ปุ่มหมุนแบบหน้าปัด ลาก กด คีย์บอร์ด ใช้กับฟอร์ม |
| `wiraui/inputotp` | `<wu-inputOtp [(ngModel)]="code" [length]="6" [integerOnly]="true">` | ช่องรหัส OTP ทีละตัว วางรหัสทั้งชุด รหัสจาก SMS ซ่อนตัวอักษร |
| `wiraui/flow` | `<wu-flow [(nodes)]="nodes" [(edges)]="edges" (connect)="…">` + `<wu-flow-handle>`, `<wu-flow-background>`, `<wu-flow-minimap>`, `<wu-flow-controls>` | แผนภาพ node / เส้นเชื่อมระดับ React Flow เขียนเองทั้งหมด: ลาก ซูม เลือกหลายตัว ลากเชื่อม เส้น 5 แบบ ป้าย ลูกศร กลุ่ม ปรับขนาด toolbar minimap จัดเรียงอัตโนมัติ undo / redo export SVG / JSON คีย์บอร์ดและจอสัมผัสครบ |
| `wiraui/i18n` | `provideWuI18n({ messages: { en: { 'บันทึก': 'Save' } } })` · `{{ 'บันทึก' \| t }}` · `<wu-language-switch>` | เปลี่ยนภาษาของแอปเอง: key เป็นข้อความภาษาหลักหรือ id, `{name}` แทนค่า, โหลด dictionary ทีหลังได้, จำภาษาที่เลือก, `<html lang>` และข้อความในตัว component เปลี่ยนตาม |
| `wiraui/ripple` / `keyfilter` / `dragdrop` | `<button wuButton wuRipple>` · `<input wuInputText pKeyFilter="int">` · `<div wuDraggable="cards">` + `<div wuDroppable="cards">` | อ่านชื่อ `pRipple` / `pKeyFilter` / `pDraggable` / `pDroppable` เดิมได้ |

control ทุกตัวรองรับ `ngModel`, `formControlName`, `formControl`, `disable()` และขึ้นสีแดงเองเมื่อ invalid และถูกแตะแล้วหรือกดส่งฟอร์มแล้ว (ไม่ต้องใส่ class `ng-dirty` เอง)

**ขนาดทั้งระบบ:** `provideWiraUI({ scale: 'md' })` หรือ `WuThemeService.setScale('sm' | 'md' | 'lg' | px)` ตั้ง font-size ของ root (12 / 14 / 16px) ทุกขนาดใน theme เป็น rem จึงย่อขยายตามกัน ส่วนแต่ละ component มี `size="small"` / `"large"` (หรือ class `p-button-sm`, `p-inputtext-sm`)

**Utility class ในตัว** (`wiraui/utils`): grid, flex, spacing, sizing, typography และสีตามธีม แบบ mobile-first ชื่อ class แบบที่แอปใช้อยู่แล้ว (`grid`, `col-12 md:col-6`, `flex align-items-center gap-2`, `p-3`) `ng add` ถามว่าจะเพิ่มไหม หรือใส่เอง:

```scss
@use 'wiraui/utils';                                   // ทั้งหมด
@use 'wiraui/utils' with ($groups: (palette: false));   // ปิดบางกลุ่ม
```

## ✨ Icon: `wiraicon`

แพ็กเกจ icon ของเราเอง ติดตั้งแยกได้ไม่ต้องมี wiraui: 424 icon × 5 น้ำหนัก (thin, light, regular, bold, fill) ชื่อตามที่ทีมเขียนอยู่ (`times`, `exclamation-triangle`, `cog` …) และชื่อแบบ Font Awesome / Phosphor ใช้แทนกันได้ ตัวภาพจาก Phosphor Icons (MIT)

```html
<i class="wi wi-check"></i>  <i class="wi wi-trash wi-bold"></i>  <wu-button icon="wi wi-save" label="บันทึก"></wu-button>
<wi-icon name="info-circle" weight="fill" [size]="20"></wi-icon>   <!-- import { WiIcon } from 'wiraicon/angular' -->
```

ใส่ `node_modules/wiraicon/wiraicon.css` ใน `styles` ของ angular.json (font ของแต่ละน้ำหนักโหลดเมื่อถูกใช้เท่านั้น) ดูรายละเอียดใน [packages/icons/config/README.md](packages/icons/config/README.md)

## 🎨 Figma UI Kit

plugin สำหรับ Figma desktop สร้าง UI Kit จาก token จริงของ preset ที่เลือก ได้แก่ variables (Light / Dark), text / effect styles, component พร้อม variant ตาม input ในโค้ด (severity, variant, size) และ wiraicon ครบชุด พร้อมไฟล์ token แบบ W3C Design Tokens วิธี build และติดตั้งดูที่ [packages/figma/README.md](packages/figma/README.md)

```bash
pnpm build:figma      # แล้ว Import plugin from manifest… → packages/figma/dist/manifest.json
```

## 📚 เอกสาร

- [DESIGN.md](DESIGN.md) สถาปัตยกรรม, ระบบธีม, versioning และลำดับงาน
- [CHANGELOG.md](CHANGELOG.md) การเปลี่ยนแปลงของแต่ละรุ่น
- [prototype/theme-designer](prototype/theme-designer/index.html) ต้นแบบ Theme Designer

## 🗂️ โครง repo

```
packages/core            @wiraui/core: token engine, exporters, Thai utils (TypeScript ล้วน)
packages/themes          SCSS theme (@use … with) + CSS สำเร็จรูป
packages/angular-signal  source ของ component แบบ signal ที่ v2 และ v3 ใช้ร่วมกัน
packages/angular-v1      build ของ wiraui@1 (Angular 15 toolchain)
packages/angular-v2      build ของ wiraui@2 (Angular 18 toolchain)
packages/angular-v3      build ของ wiraui@3 (Angular 21 toolchain)
packages/schematics      ng add / ng update
apps/docs                เว็บแนะนำ (Angular 21, NgModule, โหลดแต่ละรุ่นแบบ lazy)
apps/playground-v*       แอปทดสอบของแต่ละรุ่น (npm project แยก)
```

## 🛠️ พัฒนา

ใช้ Node 24 LTS (ดู `.nvmrc`) และ pnpm 9

```bash
pnpm install
pnpm test          # core, SCSS ↔ TS parity (Sass 1.58 + ปัจจุบัน), schematics
pnpm pack:all      # build + pack wiraui v1, v2, v3 เป็น tarball
```

ทดสอบแบบแอปจริง (ครั้งแรกให้รัน `npm ci` ใน `apps/playground-v1..v3` และ `apps/docs` ก่อน):

```bash
pnpm playgrounds   # npm install tarball + ng add wiraui + ng build ในทั้ง 3 playground
pnpm run docs      # build เว็บ docs ที่โหลด v1/v2/v3 แบบ lazy บน Angular 21
pnpm e2e           # Playwright: 3 รุ่นต้องหน้าตาตรงกัน + เว็บ docs
```

ลอง `ng add` กับโปรเจคที่มีอยู่โดยไม่แตะไฟล์ (รันในหน่วยความจำแล้วแสดง diff):

```bash
node tools/dry-run-ng-add.mjs "../my-app"
```

ออกรุ่นด้วย workflow **Publish** ใน GitHub Actions หรือ `node tools/publish.mjs v3 --dry-run` ([tools/publish.mjs](tools/publish.mjs)) · ครั้งแรกให้ออก `v3` ก่อน เพราะ npm จะชี้ `latest` ไปที่รุ่นแรกที่ขึ้น registry

เว็บเอกสาร `ui.wirabyte.com` บน OpenShift ใช้ไฟล์ใน [deploy/openshift](deploy/openshift/docs.yaml):

```bash
oc apply -f deploy/openshift/docs.yaml
```

```bash
oc start-build wiraui-docs --follow
```

ถ้า npm ในเครื่องเป็น 10.2.x ซึ่งมีบั๊กกับ Angular 21 ให้อัปเดต npm หรือรันสคริปต์ด้วย `WU_NPM="npx -y npm@11"`
