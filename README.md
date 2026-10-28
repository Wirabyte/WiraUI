# WiraTheme

UI component library + Theme Designer สำหรับ Angular ของ Wirabyte
API คุ้นมือ เขียนเองทั้งหมด และมีของที่งานไทยต้องใช้ในตัว (พ.ศ., เลขบัตรประชาชน, ฟอนต์ไทย)

| แพ็กเกจ | Angular | หน้าตา | ธีม | สถานะ |
|---|---|---|---|---|
| `wiratheme@1` | 15 – 17 | classic | `sila-light-*`, `sila-dark-*`, `arun-*`, `sayan-*`, `ratri-*`, `md-*` | maintenance |
| `wiratheme@2` | 18 – 20 | styled | Mali, Sila, Material, Phet | active |
| `wiratheme@3` | 21+ | ของ WiraTheme (ค่าเริ่มต้น **Wira**) + styled | Wira, Lanna, Siam, Nakhon, Glass (Liquid Glass) + ของ v2 | active (latest) |

แต่ละรุ่นถูกล็อกกับช่วง Angular ของตัวเอง ติดตั้งข้ามช่วงไม่ได้ · License: [MIT](LICENSE) ใช้ฟรี

**ย้ายโปรเจคเดิม:** `ng g wiratheme:from-primeng` (ลอง `--dry-run` ก่อน) เปลี่ยน import จาก `primeng/*` เป็น `wiratheme/*` (เช่น `DropdownModule` → `WtSelectModule`, service ใช้ชื่อเดิม) และ tag `<p-…>` ใน template เป็น `<wt-…>` ส่วนที่ยังย้ายไม่ได้จะถูกรายงานไว้ · ขนาดและระยะของแต่ละรุ่นตรงกับธีมยุคเดียวกันที่แอปเดิมใช้, DOM มี class `p-*` ของยุคนั้น (`p-button`, `p-card-body`, `p-highlight`, …) และไฟล์ธีมสร้างตัวแปร `--surface-ground`, `--primary-color` (v1) หรือ `--p-primary-color`, `--p-surface-*` (v2/v3) ให้ CSS เดิมของแอปยังใช้ได้ ดูรายละเอียดที่ [DESIGN.md §6.10](DESIGN.md)

```jsonc
// v1: แทนไฟล์ธีมเดิม ".../themes/lara-light-teal/theme.css" (ชื่อธีมของ WiraTheme ดูตารางเทียบใน DESIGN.md §12.8)
"node_modules/wiratheme/themes/sila-light-teal/theme.css"
```

## Component ที่มีแล้ว

ทุกตัวมีใน v1, v2 และ v3 ใช้ได้ทั้ง NgModule (`WtXxxModule`) และ standalone (`WtXxx`) CSS ชุดเดียวกันทุกรุ่น ส่วนหน้าตามาจากธีมของรุ่นนั้น (ใส่ preset เดียวกันแล้ว pixel ตรงกันทุกรุ่น)

| Entry point | ใช้แบบนี้ | หมายเหตุ |
|---|---|---|
| `wiratheme/button` | `<wt-button label="บันทึก" [action]="save">` | `[action]` แสดง spinner และกันกดซ้ำจนงานเสร็จ · `size="small"`/`"large"` · `<button wtButton>` (อ่าน `pButton` ได้) · `styleClass="p-button-sm p-button-danger"` |
| `wiratheme/card` | `<wt-card header="…" subheader="…">` | slot `[wtCardHeader]`, `[wtCardActions]`, `[wtCardFooter]` · `variant` outlined / elevated / glass (v3) · `loading` |
| `wiratheme/inputtext` | `<input wtInputText [(ngModel)]="name">` | `wtSize`, `variant="filled"`, `fluid`, `invalid` |
| `wiratheme/textarea` | `<textarea wtTextarea autoResize formControlName="note">` | `autoResize` ขยายตามข้อความ รวมค่าที่ตั้งจากโค้ด |
| `wiratheme/checkbox` | `<wt-checkbox [(ngModel)]="agree" binary label="…">` | `binary` หรือแบบกลุ่ม (array + `value`) |
| `wiratheme/radiobutton` | `<wt-radiobutton name="plan" value="sci" formControlName="plan">` | กลุ่มเดียวกันใน Reactive Forms อัปเดตกันเอง |
| `wiratheme/toggleswitch` | `<wt-toggleswitch [(ngModel)]="notify" label="…">` | `trueValue` / `falseValue` |
| `wiratheme/tag` | `<wt-tag value="อนุมัติ" severity="success" rounded>` | สีทึบหรือสีอ่อนตามธีม, รับ `severity="warning"` แบบเดิมได้ |
| `wiratheme/badge` | `<wt-badge value="8" severity="danger">` | ไม่ใส่ `value` เป็นจุด, `size` small / large / xlarge |
| `wiratheme/chip` | `<wt-chip label="แอดมิน" removable (onRemove)="…">` | icon หรือรูป, ปุ่มลบกดได้ด้วยคีย์บอร์ด |
| `wiratheme/avatar` | `<wt-avatar image="…" label="สม" shape="circle">` | รูปเสียแล้วกลับไปใช้ตัวอักษร, `wt-avatar-group` วางซ้อนกัน |
| `wiratheme/divider` | `<wt-divider align="center">หรือ</wt-divider>` | แนวนอน/แนวตั้ง, solid / dashed / dotted |
| `wiratheme/skeleton` | `<wt-skeleton width="10rem">` | `shape="circle"`, `size`, ปิด animation ได้ |
| `wiratheme/progressbar` | `<wt-progressbar [value]="60">` | `mode="indeterminate"`, ตั้งความสูงด้วย `style` · นับจำนวน `[max]="2500" unit="รายการ"` → `1,000 / 2,500 รายการ` · `text` หรือ template `#content` |
| `wiratheme/metergroup` | `<wt-metergroup [value]="[{ label: 'แอป', value: 16 }]">` | หลายค่าในแถบเดียวพร้อมคำอธิบาย, `min`/`max`, แนวตั้ง, `labelPosition`, template label / meter / start / end / icon |
| `wiratheme/progressspinner` | `<wt-progress-spinner style="width: 2rem">` | สีและขนาดเริ่มต้นตามธีม |
| `wiratheme/message` | `<wt-message severity="warn" text="…" closable [life]="5000">` | `variant` outlined / simple, `size` |
| `wiratheme/panel` | `<wt-panel header="…" toggleable [(collapsed)]="closed">` | slot `[wtPanelHeader]`, `[wtPanelIcons]`, `[wtPanelFooter]`, เนื้อหาที่ยุบกด tab ไม่ถึง |
| `wiratheme/fieldset` | `<wt-fieldset legend="ที่อยู่" toggleable>` | ใช้ `<fieldset>` จริง |
| `wiratheme/iconfield` | `<wt-iconfield><wt-inputicon icon="pi pi-search"></wt-inputicon><input wtInputText></wt-iconfield>` | ไอคอนก่อน input อยู่ซ้าย หลัง input อยู่ขวา, markup เดิม `p-input-icon-left` ใช้ได้ |
| `wiratheme/inputgroup` | `<wt-inputgroup><wt-inputgroup-addon>฿</wt-inputgroup-addon><input wtInputText></wt-inputgroup>` | ใส่ปุ่มได้, markup เดิม `p-inputgroup` ใช้ได้ |
| `wiratheme/floatlabel` | `<wt-floatlabel><input wtInputText id="n"><label for="n">ชื่อ</label></wt-floatlabel>` | `variant` over / on / in, markup เดิม `p-float-label` ใช้ได้ |
| `wiratheme/togglebutton` | `<wt-togglebutton [(ngModel)]="bold" onLabel="ตัวหนา">` | ค่า boolean, ไอคอนเปิด/ปิด |
| `wiratheme/selectbutton` | `<wt-selectbutton [options]="plans" optionLabel="name" optionValue="id" [(ngModel)]="plan">` | `multiple`, `allowEmpty`, `dataKey`, ขึ้นบรรทัดใหม่บนจอแคบ |
| `wiratheme/rating` | `<wt-rating [(ngModel)]="score">` | ใช้ radio จริง กดลูกศรเลือกได้ |
| `wiratheme/password` | `<wt-password [(ngModel)]="pw" toggleMask>` | แสดง/ซ่อนรหัส, แถบความแข็งแรงเปิดเป็นแผงใต้ช่องตอนโฟกัส (ไม่ดันเนื้อหา) |
| `wiratheme/inputnumber` | `<wt-inputnumber [(ngModel)]="price" mode="currency" [min]="0" showButtons>` | แสดง `฿1,234.50` ตอนไม่ได้พิมพ์ ตัวเลขล้วนตอนพิมพ์, รับเลขไทย/ค่าที่วาง, พิมพ์ตัวอักษรไม่ได้ ทศนิยมไม่เกิน `maxFractionDigits` และไม่เกิน `max`, ลูกศรเพิ่ม-ลด, กดปุ่มค้างได้, คีย์บอร์ดตัวเลขบนมือถือ |
| `wiratheme/datepicker` | `<wt-datepicker [(ngModel)]="due" dateFormat="dd/mm/yy" showIcon showTime>` | ปี พ.ศ. (หรือ `isBudhistYear`), เลือกวัน/ช่วง/หลายวัน/เดือน/ปี, ชม. นาที วินาที กดขึ้นลงหรือพิมพ์ได้, `readonlyInput` กับ `timeReadonlyInput` แยกกัน, เปิดใน top layer ไม่ต้อง `appendTo`, มือถือเป็น bottom sheet |
| `wiratheme/dialog` | `<wt-dialog header="แก้ไข" [(visible)]="open" [style]="{ width: '50vw' }">` · `dialogs.open(PickStudent, { header, data })` | `<dialog>` แบบ modal ใน top layer, focus ไม่หลุดและกลับที่เดิม, ล็อก scroll, `breakpoints`, `maximizable`, `position`, slot `wtTemplate="footer"` (อ่าน `pTemplate` ได้), มือถือกว้างเต็มจอ · `WtDialogService` เปิด component ของแอปใน dialog คืนผลทาง `ref.onClose` / `await ref.result` (ชื่อ `DialogService`, `DynamicDialogRef`, `DynamicDialogConfig` ใช้ได้) |
| `wiratheme/alert` | `WtAlert.fire('บันทึกแล้ว', '', 'success')` | alert สำเร็จรูปแบบ SweetAlert: ไอคอนเคลื่อนไหว, input + validator, `preConfirm` พร้อม spinner, timer, ปุ่มยืนยันอยู่ขวาเสมอ (`reverseButtons: false` สลับ); `import { WtAlert as Swal }` แล้วโค้ดเดิมใช้ต่อได้ |
| `wiratheme/confirmdialog` | `<wt-confirmdialog>` + `confirmation.confirm({ message, accept })` | ถามก่อนทำ, รับ `acceptButtonStyleClass="p-button-success"`, ถ้าไม่มี component ในหน้าจะเปิดเป็น alert แทน |
| `wiratheme/toast` | `<wt-toast>` + `messages.add({ severity: 'success', summary, detail })` | แสดงเหนือ dialog, เส้นนับถอยหลังด้านล่าง (`[showTimer]="false"` ปิด) หยุดตอน hover แล้วนับต่อจากที่เหลือ, ปุ่มปิดอยู่ขวาบนเสมอ, มือถือเต็มความกว้าง |
| `wiratheme/tooltip` | `<button wtTooltip="บันทึก" tooltipPosition="top">` | รับ `pTooltip` เดิม, แสดงตอนโฟกัสด้วยคีย์บอร์ด, กลับด้านเมื่อไม่พอ, เลื่อนเมาส์ไปบน tooltip ได้ (คลิกลิงก์ข้างในได้; `[autoHide]="true"` ซ่อนทันที) |
| `wiratheme/popover` | `<wt-popover #op>` + `(click)="op.toggle($event)"` | การ์ดมีลูกศรชี้ปุ่ม, กลับขึ้นบนเมื่อด้านล่างไม่พอ, คลิกข้างนอก/Escape ปิด |
| `wiratheme/animate` | `provideWtAnimate()` + `<div data-aos="fade-up">` | animate on scroll แบบ AOS ด้วย attribute เดิม หรือ `[wtAnimate]`, เคารพ reduced motion |
| `wiratheme/api` | `import { ConfirmationService, MessageService } from 'wiratheme/api'` | service และ `WtTemplate` ในที่เดียว ใช้ชื่อเดิมได้ |
| `wiratheme/toolbar` | `<wt-toolbar><div wtToolbarStart>…</div><div wtToolbarEnd>…</div></wt-toolbar>` | 3 กลุ่ม start / center / end ขึ้นบรรทัดใหม่บนจอแคบ |
| `wiratheme/accordion` | `<wt-accordion [(activeIndex)]="i"><wt-accordion-tab header="…">` | `multiple`, `[(selected)]`, ปุ่มลูกศรเลื่อนระหว่างหัวข้อ |
| `wiratheme/tabs` | `<wt-tabs [(activeIndex)]="i"><wt-tab-panel header="…">` · `<wt-tabs [model]="pages" [(activeItem)]="page">` | ปุ่มลูกศร/Home/End ข้ามแท็บที่ปิด, แท็บล้นแถวมีปุ่มเลื่อนซ้าย-ขวาแทน scrollbar และเลื่อนแท็บที่เลือกให้เห็นเสมอ, `[model]` ทำงานแบบ tab menu |
| `wiratheme/select` | `<wt-select [options]="provinces" optionLabel="name_th" optionValue="id" [(ngModel)]="id" [filter]="true">` | ค้นหาไทย/อังกฤษ, group, showClear, editable, template item/selectedItem, คีย์บอร์ดครบ, เปิดใน top layer |
| `wiratheme/multiselect` | `<wt-multiselect [options]="clubs" optionLabel="name" optionValue="id" [(ngModel)]="ids">` | ช่องเลือกหลายค่า มี checkbox, เลือกทั้งหมด, ค้นหาไทย, `display="chip"`, `maxSelectedLabels`, `selectionLimit` |
| `wiratheme/inputmask` | `<wt-inputmask mask="9-9999-99999-99-9" [(ngModel)]="id" [unmask]="true">` | ใส่ขีดให้เอง, `autoClear`, `(onComplete)`, เลขไทยใช้ได้, แป้นตัวเลขบนมือถือ |
| `wiratheme/timeline` | `<wt-timeline [value]="events">` + template content/opposite/marker | แนวตั้ง/แนวนอน, `align` left/right/alternate, ไม่มี opposite แล้วเนื้อหาเต็มแถว |
| `wiratheme/chart` | `<wt-chart type="bar" [labels]="months" [series]="[{ name: 'รายรับ', data: income }]" format="compact">` | **v3: กราฟของ WiraTheme เอง** วาดด้วย SVG ไม่ต้องลง library: แท่ง (กลุ่ม ซ้อน แนวนอน) เส้น (โค้ง ขั้นบันได) พื้นที่ไล่สี วงกลม โดนัท (ครึ่งวงได้) วงแหวน / เกจ (`radialBar`) วงกลมแบบรัศมี (`polarArea`) เรดาร์ จุด/ฟอง `heatmap` (สี่เหลี่ยม วงกลม รังผึ้ง) `treemap` `stream` `waterfall` `dumbbell` `timeline` (Gantt) `funnel` `boxplot` (กล่อง ไวโอลิน จุด) `histogram` `sunburst` / icicle (คลิกเจาะลงได้) `unit` (waffle จุด รูปคน) `slope` แต่ละแบบเลือกลักษณะด้วย `variant` ผสมได้ ปุ่มสลับแบบกราฟพร้อม animation (`swap`, Beta) แกนขวา เส้นอ้างอิง คำอธิบายบนกราฟ (`annotations`: เส้น แถบ จุดที่มีป้าย), กราฟจิ๋ว (`sparkline`), แถบเครื่องมือซูม (ลากเพื่อซูม) และดาวน์โหลด PNG / SVG / CSV, กราฟที่ชี้ไปด้วยกัน (`group`), ฟอนต์ไทยแสดงถูก (`font`, `fontSize`), ตัวเลขแบบ ฿ / % / พัน หมื่น แสน ล้าน, legend ซ่อนแสดง, tooltip ตามเมาส์และคีย์บอร์ด, เคลื่อนไหวเมื่อข้อมูลเปลี่ยน, ตารางข้อมูลให้โปรแกรมอ่านจอ, export PNG / SVG, รับ `[data]` / `[options]` แบบ Chart.js · **v1 / v2:** ชื่อเดิมของกราฟ Chart.js (ตัวเดียวกับ `wt-chartjs`) |
| `wiratheme/chartjs` | `<wt-chartjs type="bar" [data]="data" [options]="options" height="320px">` | ห่อ Chart.js 3/4 (ติดตั้ง `chart.js` เอง) ใช้ได้ทุกรุ่น, ฟอนต์และสีของธีม, `[plugins]`, `(onDataSelect)`, `refresh()` · ใช้เมื่อต้องการปลั๊กอินหรือกราฟแบบที่ `wt-chart` ไม่มี |
| `wiratheme/image` | `<wt-image [src]="url" alt="…" width="240" [preview]="true">` | ดูภาพเต็มจอใน dialog (top layer) หมุนและซูมได้, Esc ปิด, บนมือถือปุ่มดูภาพแสดงตลอด |
| `wiratheme/autocomplete` | `<wt-autocomplete [(ngModel)]="v" [suggestions]="found" (completeMethod)="find($event)" optionLabel="name">` | แนะนำระหว่างพิมพ์, `delay`, `minLength`, `dropdown`, `forceSelection`, หน้าตาเดียวกับ Select (ยังไม่มี `multiple`) |
| `wiratheme/paginator` | `<wt-paginator [first]="first" [rows]="10" [totalRecords]="120" (onPageChange)="…">` | รายงานภาษาไทย, จำนวนแถวต่อหน้า |
| `wiratheme/menubar` | `<wt-menubar [model]="items">` + template start/end | เมนูย่อยซ้อนได้, `routerLink` / `url` / `command`, คีย์บอร์ดแบบ ARIA menubar, ปุ่มเมนูบนจอแคบ, ใช้เป็นแถบหัวเว็บที่มีแค่ start/end ได้ |
| `wiratheme/menu` | `<wt-menu #m [model]="items" [popup]="true">` + `(click)="m.toggle($event)"` | แบบ popup (top layer ไม่ต้อง appendTo) หรือเมนูข้าง, กลุ่มมีหัวข้อ, คีย์บอร์ดครบ |
| `wiratheme/tabmenu` | `<wt-tabmenu [model]="pages" [(activeItem)]="page">` | แท็บจาก menu model, `routerLink` / `command`, เลื่อนด้านข้างเหมือน wt-tabs (ตัวเดียวกับ `wt-tabs [model]`, อยู่ใน `wiratheme/tabs`) |
| `wiratheme/panelmenu` | `<wt-panelmenu [model]="items" [multiple]="true">` | เมนูข้างแบบแผงพับได้ ซ้อนกี่ชั้นก็ได้, เปิดตาม `expanded` ของ item, คีย์บอร์ดลูกศร |
| `wiratheme/steps` | `<wt-steps [model]="steps" [(activeIndex)]="step">` | ขั้นตอนมีตัวเลข ขั้นที่ผ่านแล้วเป็นสีหลัก, `[readonly]="false"` ให้คลิก/คีย์บอร์ดเลือกขั้นได้ |
| `wiratheme/table` | `<wt-table #dt [value]="rows" [paginator]="true" [rows]="10">` + template header/body | template แบบ p-table เดิม (`pTemplate`), sort, ค้นหา `dt.filterGlobal`, ตัวกรองต่อคอลัมน์ (แถว/เมนู หลายเงื่อนไข), เลือกแถว/checkbox/radio, lazy, ตรึงคอลัมน์และแถว, ปรับกว้าง/ลากเรียงคอลัมน์, ลากเรียงแถว, ขยายแถว, จัดกลุ่ม, แก้ไขในเซลล์/ทั้งแถว, `stateKey`, export CSV และ Excel (`dt.exportExcel({ title, totals, cellStyle })` ไม่ต้องลง library), stack บนมือถือ |
| `wiratheme/excel` | `downloadExcel({ rows: [['ชื่อ', 'คะแนน'], ['วิระ', 18]] }, 'scores')` | สร้างไฟล์ .xlsx เอง ไม่ต้องลง library: สี ฟอนต์ เส้นขอบ รูปแบบตัวเลข รวมเซลล์ (`colSpan` / `rowSpan`) สูตร (รวม `BAHTTEXT`) หลาย sheet ตรึงแถว ตัวกรอง ตั้งค่าการพิมพ์ วันที่แสดง พ.ศ. ได้, `downloadRowsAsExcel()` รายงานจาก object (อ่านไฟล์ Excel ให้ใช้ SheetJS / ExcelJS คู่กัน) |
| `wiratheme/emptystate` | `<wt-empty-state type="search"><wt-button label="ล้างตัวกรอง"></wt-button></wt-empty-state>` | ภาพวาด 6 แบบในสีของธีม (ไม่มีข้อมูล ค้นไม่พบ กล่องว่าง โฟลเดอร์ว่าง โหลดไม่สำเร็จ ออฟไลน์) ข้อความตามภาษา, `icon` / `image`, `size="small"` ในตาราง |
| `wiratheme/result` | `<wt-result status="404"><wt-button wtResultExtra label="กลับหน้าแรก"></wt-button></wt-result>` | ผลของงาน success / error / info / warning และหน้า 403 / 404 / 500 ที่วาดรหัสพร้อมภาพ, ปุ่ม `wtResultExtra`, กล่องรายละเอียด |
| `wiratheme/errorpage` | `<wt-error-page code="404" look="kawaii" fullPage></wt-error-page>` | หน้าข้อผิดพลาดสำเร็จรูปของรหัส 4xx / 5xx ทุกตัว สองแบบ: ทางการ (ไอคอนกับรหัสตัวใหญ่) และ kawaii (ตัวการ์ตูนถือป้ายรหัส ขยับตัว กะพริบตา) ข้อความไทย / อังกฤษของรหัสที่พบบ่อย ปุ่มตามรหัส (เข้าสู่ระบบ ลองอีกครั้ง ย้อนกลับ กลับหน้าแรก) `(action)` ให้ใช้ router ของแอป รหัสอ้างอิงสำหรับแจ้งฝ่ายช่วยเหลือ ทุกรุ่น |
| `wiratheme/dock` | `<wt-dock [model]="apps" look="mac">` | แถบไอคอนเปิดแอปตามขอบกล่อง: แบบ macOS (ไอคอนขยายตามเมาส์อย่างนุ่มนวล เด้งเมื่อคลิก จุดใต้แอปที่เปิด ย่อไอคอนเองเมื่อกล่องแคบ) หรือแบบ taskbar ของ Windows (`look="windows"`, ช่อง `start` / `end` สำหรับปุ่ม Start และถาดนาฬิกา) `position` บน ล่าง ซ้าย ขวา คีย์บอร์ดครบ `p-dock` เดิมย้ายมาได้ ทุกรุ่น |
| `wiratheme/sitefooter` | `<wt-site-footer brand="WiraTheme" [model]="columns" [social]="social" [legal]="legal" [backToTop]="true">` | ส่วนท้ายเว็บ: ชื่อ คำอธิบาย คอลัมน์ลิงก์ ไอคอนโซเชียล แถวล่าง (ลิขสิทธิ์ ลิงก์นโยบาย ปุ่มกลับขึ้นด้านบน) แบบ `columns` / `simple` / `centered` จอแคบคอลัมน์พับเป็นหัวข้อที่กดเปิด (วัดความกว้างของตัวเอง) ช่อง `brand` `end` `bottom` (ชื่อ tag ไม่ใช่ `wt-footer` เพราะนั่นคือช่องท้ายของ card / dialog) ทุกรุ่น |
| `wiratheme/bottombar` | `<wt-bottombar [model]="tabs" look="fab" [action]="newPost">` | เมนูล่างของแอปมือถือ: ไอคอน ชื่อ ป้ายตัวเลข รายการที่เลือกตาม `[(activeIndex)]` หรือ route แบบ `standard` / `pill` (แคปซูลลอย รายการที่เลือกขยายออก) / `fab` (ปุ่มกลมยกขึ้นตรงกลางในรอยเว้า) ติดขอบล่างเหนือแถบ home ของ iPhone `hideOnScroll` ซ่อนเมื่อเลื่อนลง ทุกรุ่น |
| `wiratheme/thai` | `{{ born \| wtDate: 'long' }}` · `{{ total \| wtBahtText }}` · `{{ phone \| wtThaiPhone }}` | วันที่ พ.ศ. ตามภาษาของแอป, `wtTimeAgo`, จำนวนเงินเป็นตัวอักษรแบบ BAHTTEXT ของ Excel, เบอร์โทร / เลขบัตรประชาชนมีขีด, `wtThaiDigits` |
| `wiratheme/validation` | `<input wtInputText formControlName="email"><wt-field-error for="email" label="อีเมล">` | ข้อความ error ภาษาไทย/อังกฤษตาม locale, `WtValidators.thaiId` / `thaiPhone` / `match`, directive `wtThaiId` `wtThaiPhone` `wtMatch` |
| `wiratheme/picklist` / `orderlist` | `<wt-picklist [source]="all" [target]="picked">` · `<wt-orderlist [value]="rows">` | ย้าย/เรียงด้วยปุ่ม ลาก หรือดับเบิลคลิก, เลือกหลายแถว, ค้นหาแยกฝั่ง, บนมือถือเรียงบนลงล่าง |
| `wiratheme/fileupload` | `<wt-fileupload name="file" url="/api/upload" accept="image/*" [maxFileSize]="2000000">` | ลากวาง, preview รูป, ตรวจชนิด/ขนาด/จำนวนพร้อมข้อความไทย, progress, `customUpload` + `(uploadHandler)`, โหมด `basic` |
| `wiratheme/stepper` | `<wt-stepper [(value)]="step"><wt-step-list><wt-step [value]="1">…` · `<wt-stepper [model]="steps" [(activeIndex)]="i">` | แบบ value + panel, `linear`, แนวตั้งด้วย `wt-step-item`, `activateCallback`, `[model]` ทำงานแบบ Steps, `labelPosition="bottom"`, `subtitle`, `[readonly]` |
| `wiratheme/editor` | `<wt-editor [(ngModel)]="html" toolbar="full" [imageUpload]="{ mode: 'upload', url: '/api/images' }">` | ทำเองทั้งหมด: ตาราง (เพิ่ม/ลบแถวคอลัมน์ รวม/แยกเซลล์), รูป base64 หรืออัปโหลดไป URL, ตั้งเครื่องมือ toolbar ได้ละเอียด (`toolbar`, `toolOptions`, `provideEditorOptions()`), วางจาก Word ได้สะอาด, เต็มจอ, ดู HTML, template `header` แบบเดิมใช้ได้ |
| `wiratheme/slider` | `<wt-slider [(ngModel)]="volume" [min]="0" [max]="100" [step]="5">` | ค่าเดียวหรือช่วง (`[range]`), แนวตั้ง, ลาก/คลิก/คีย์บอร์ด |
| `wiratheme/splitbutton` | `<wt-splitButton label="บันทึก" [model]="more" (onClick)="save()">` | ลูกศรเปิดเมนูคำสั่งอื่น, severity / outlined / size แบบ wt-button |
| `wiratheme/listbox` | `<wt-listbox [options]="rooms" optionLabel="name" [(ngModel)]="room" [filter]="true">` | เลือกเดียว/หลายค่าพร้อม check box และเลือกทั้งหมด, จัดกลุ่ม, striped, คีย์บอร์ดครบ |
| `wiratheme/galleria` | `<wt-galleria [value]="photos" [numVisible]="5">` + template item/thumbnail | ลูกศร จุด thumbnail เลื่อนตาม, `responsiveOptions`, เล่นเอง วนรอบ ปัดบนมือถือ, เต็มจอ |
| `wiratheme/colorpicker` | `<wt-colorPicker [(ngModel)]="color">` | แผงสีใน top layer หรือ `inline`, ช่อง hex, `format` hex / rgb / hsb |
| `wiratheme/breadcrumb` | `<wt-breadcrumb [model]="trail" [home]="home">` | `routerLink` / `url` / `command`, หน้าปัจจุบันเป็น `aria-current` |
| `wiratheme/inplace` | `<wt-inplace>` + template display / content | คลิกข้อความแล้วเปิดช่องแก้ไขพร้อมโฟกัส, `closable`, Esc ปิด |
| `wiratheme/blockui` | `<wt-blockUI [blocked]="isApiSaving">` | บังทั้งหน้า (modal) หรือเฉพาะ `[target]`, ของข้างใต้เป็น inert |
| `wiratheme/scrollpanel` / `scroller` | `<wt-scrollPanel [style]="{ maxHeight: '12rem' }">` · `<wt-scroller [items]="rows" [itemSize]="40" scrollHeight="20rem">` | scrollbar บางตามธีม · virtual scroll วาดเฉพาะแถวที่เห็น, `lazy` |
| `wiratheme/drawer` | `<wt-drawer [(visible)]="open" header="เมนู" position="left">` (`wt-sidebar` ก็ได้) | `<dialog>` ใน top layer, โฟกัสอยู่ข้างใน, Esc / คลิกพื้นหลังปิด, ซ้าย ขวา บน ล่าง เต็มจอ |
| `wiratheme/tieredmenu` / `contextmenu` | `<wt-tieredMenu [model]="items">` · `<wt-contextMenu [model]="items" [target]="box">` | เมนูย่อยหลายชั้น (บนมือถือเปิดลงล่าง), เมนูคลิกขวาตรงตำแหน่งเมาส์ |
| `wiratheme/tree` / `treeselect` | `<wt-tree [value]="nodes" selectionMode="checkbox" [(selection)]="picked">` · `<wt-treeSelect [options]="nodes" [(ngModel)]="node">` | check box กระจายลงลูกและขึ้นแม่, ค้นหา, โหลดลูกตอนเปิด, คีย์บอร์ดแบบ tree |
| `wiratheme/navbar` | `<wt-navbar [model]="links" [sticky]="true"><a wtNavbarBrand routerLink="/">…` | แถบบน brand / links / end, เมนูย่อย, solid / glass / transparent, จอแคบพับลิงก์เข้าแผง |
| `wiratheme/asidemenu` | `<wt-aside-menu #side [model]="menu" [(collapsed)]="mini">` + `<wt-navbar [aside]="side">` | เมนูด้านข้างหลายชั้น กลุ่มของหน้าปัจจุบันเปิดเอง, ย่อเหลือไอคอนพร้อม flyout, มือถือเป็นแผงเลื่อนเข้า |
| `wiratheme/imagecropper` | `<wt-imagecropper [imageFile]="file" [aspectRatio]="1" (imageCropped)="saved($event)">` | ตัดรูปในตัว: EXIF, อัตราส่วน, ซูม หมุน พลิก, คีย์บอร์ด, ผลเป็น blob / base64 (`output` หรือทั้งแอปด้วย `provideImageCropperOptions()`), เลือกปุ่มบนแถบเครื่องมือ (`[toolbar]`) และเพิ่มปุ่มเอง (template `tools`), ความสูงคงที่ตอนหมุน (`image-cropper` เดิมก็ใช้ได้) |
| `wiratheme/terminal` | `<wt-terminal welcomeMessage="…" prompt="$">` + `WtTerminalService` | หน้าจอพิมพ์คำสั่งแบบ console ประวัติ ↑ / ↓ คำสั่ง clear |
| `wiratheme/imagecompare` | `<wt-imageCompare>` + template `left` / `right` | เทียบภาพก่อน / หลัง ลากเส้นแบ่งด้วยเมาส์ นิ้ว หรือคีย์บอร์ด `[(value)]` |
| `wiratheme/carousel` | `<wt-carousel [value]="items" [numVisible]="3" [responsiveOptions]="…">` | ทีละหน้า ลูกศร แถบหน้า ปัด วนรอบ เล่นเอง (หยุดเมื่อชี้) แนวตั้ง |
| `wiratheme/splitter` | `<wt-splitter [panelSizes]="[30, 70]">` + `<wt-splitter-panel>` | ช่องปรับขนาดได้ ซ้อนกันได้ คีย์บอร์ด ขนาดต่ำสุด จำขนาดใน storage |
| `wiratheme/organizationchart` | `<wt-organizationChart [value]="tree" selectionMode="single">` | ผังองค์กรจาก TreeNode เส้นเชื่อม CSS เลือก ย่อ / ขยาย template ตามชนิด |
| `wiratheme/knob` | `<wt-knob [(ngModel)]="value" [min]="0" [max]="100">` | ปุ่มหมุนแบบหน้าปัด ลาก กด คีย์บอร์ด ใช้กับฟอร์ม |
| `wiratheme/inputotp` | `<wt-inputOtp [(ngModel)]="code" [length]="6" [integerOnly]="true">` | ช่องรหัส OTP ทีละตัว วางรหัสทั้งชุด รหัสจาก SMS ซ่อนตัวอักษร |
| `wiratheme/flow` | `<wt-flow [(nodes)]="nodes" [(edges)]="edges" (connect)="…">` + `<wt-flow-handle>`, `<wt-flow-background>`, `<wt-flow-minimap>`, `<wt-flow-controls>` | แผนภาพ node / เส้นเชื่อมระดับ React Flow เขียนเองทั้งหมด: ลาก ซูม เลือกหลายตัว ลากเชื่อม เส้น 5 แบบ ป้าย ลูกศร กลุ่ม ปรับขนาด toolbar minimap จัดเรียงอัตโนมัติ undo / redo export SVG / JSON คีย์บอร์ดและจอสัมผัสครบ |
| `wiratheme/i18n` | `provideWtI18n({ messages: { en: { 'บันทึก': 'Save' } } })` · `{{ 'บันทึก' \| t }}` · `<wt-language-switch>` | เปลี่ยนภาษาของแอปเอง: key เป็นข้อความภาษาหลักหรือ id, `{name}` แทนค่า, โหลด dictionary ทีหลังได้, จำภาษาที่เลือก, `<html lang>` และข้อความในตัว component เปลี่ยนตาม |
| `wiratheme/ripple` / `keyfilter` / `dragdrop` | `<button wtButton wtRipple>` · `<input wtInputText pKeyFilter="int">` · `<div wtDraggable="cards">` + `<div wtDroppable="cards">` | อ่านชื่อ `pRipple` / `pKeyFilter` / `pDraggable` / `pDroppable` เดิมได้ |

control ทุกตัวรองรับ `ngModel`, `formControlName`, `formControl`, `disable()` และขึ้นสีแดงเองเมื่อ invalid และถูกแตะแล้วหรือกดส่งฟอร์มแล้ว (ไม่ต้องใส่ class `ng-dirty` เอง)

**ขนาดทั้งระบบ:** `provideWiraTheme({ scale: 'md' })` หรือ `WtThemeService.setScale('sm' | 'md' | 'lg' | px)` ตั้ง font-size ของ root (12 / 14 / 16px) ทุกขนาดใน theme เป็น rem จึงย่อขยายตามกัน ส่วนแต่ละ component มี `size="small"` / `"large"` (หรือ class `p-button-sm`, `p-inputtext-sm`)

**Utility class ในตัว** (`wiratheme/utils`): grid, flex, spacing, sizing, typography และสีตามธีม แบบ mobile-first ชื่อ class แบบที่แอปใช้อยู่แล้ว (`grid`, `col-12 md:col-6`, `flex align-items-center gap-2`, `p-3`) `ng add` ถามว่าจะเพิ่มไหม หรือใส่เอง:

```scss
@use 'wiratheme/utils';                                   // ทั้งหมด
@use 'wiratheme/utils' with ($groups: (palette: false));   // ปิดบางกลุ่ม
```

## Icon: `wiraicon`

แพ็กเกจ icon ของเราเอง ติดตั้งแยกได้ไม่ต้องมี wiratheme: 424 icon × 5 น้ำหนัก (thin, light, regular, bold, fill) ชื่อตามที่ทีมเขียนอยู่ (`times`, `exclamation-triangle`, `cog` …) และชื่อแบบ Font Awesome / Phosphor ใช้แทนกันได้ ตัวภาพจาก Phosphor Icons (MIT)

```html
<i class="wi wi-check"></i>  <i class="wi wi-trash wi-bold"></i>  <wt-button icon="wi wi-save" label="บันทึก"></wt-button>
<wi-icon name="info-circle" weight="fill" [size]="20"></wi-icon>   <!-- import { WiIcon } from 'wiraicon/angular' -->
```

ใส่ `node_modules/wiraicon/wiraicon.css` ใน `styles` ของ angular.json (font ของแต่ละน้ำหนักโหลดเมื่อถูกใช้เท่านั้น) ดูรายละเอียดใน [packages/icons/config/README.md](packages/icons/config/README.md)

## Figma UI Kit

plugin สำหรับ Figma desktop สร้าง UI Kit จาก token จริงของ preset ที่เลือก ได้แก่ variables (Light / Dark), text / effect styles, component พร้อม variant ตาม input ในโค้ด (severity, variant, size) และ wiraicon ครบชุด พร้อมไฟล์ token แบบ W3C Design Tokens วิธี build และติดตั้งดูที่ [packages/figma/README.md](packages/figma/README.md)

```bash
pnpm build:figma      # แล้ว Import plugin from manifest… → packages/figma/dist/manifest.json
```

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
