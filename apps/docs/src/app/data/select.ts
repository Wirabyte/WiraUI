import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

const PROVINCES_TS = `provinces = [
  { id: 10, code: 'BKK', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok' },
  { id: 50, code: 'CMI', name_th: 'เชียงใหม่', name_en: 'Chiang Mai' },
  { id: 40, code: 'KKN', name_th: 'ขอนแก่น', name_en: 'Khon Kaen' },
  { id: 83, code: 'PKT', name_th: 'ภูเก็ต', name_en: 'Phuket' },
  { id: 90, code: 'SKA', name_th: 'สงขลา', name_en: 'Songkhla' },
];
provinceId: number | null = null;`;

/** English sample data drops the Thai names (the Thai sample keeps both, as the apps store them). */
const PROVINCES_TS_EN = `provinces = [
  { id: 10, code: 'BKK', name_en: 'Bangkok' },
  { id: 50, code: 'CMI', name_en: 'Chiang Mai' },
  { id: 40, code: 'KKN', name_en: 'Khon Kaen' },
  { id: 83, code: 'PKT', name_en: 'Phuket' },
  { id: 90, code: 'SKA', name_en: 'Songkhla' },
];
provinceId: number | null = null;`;

export const SELECT_DOC: ComponentDoc = {
  id: 'select',
  title: 'Select',
  group: 'Form',
  entry: 'select',
  standalone: 'WuSelect',
  module: 'WuSelectModule',
  forms: true,
  selector: 'wu-select',
  description: {
    th: 'ช่องเลือกจากรายการ ค้นหาภาษาไทยได้ จัดกลุ่ม ปรับแต่งแต่ละแถวด้วย template ใช้คีย์บอร์ดได้ครบ และรายการเปิดใน top layer จึงไม่ต้องใช้ appendTo',
    en: 'Pick from a list, with Thai search, groups, templates for each row and full keyboard support. The list opens in the top layer, so no appendTo is needed.',
  },
  english: {
    name_th: 'name_en',
    'name_th,name_en,code': 'name_en,code',
    'จังหวัด': 'Province',
    'เลือกจังหวัด': 'Pick a province',
    'ค้นหาจังหวัด': 'Search provinces',
    'เลือกตามภาค': 'Pick by region',
    'ตามภาค': 'By region',
    'เลือกระดับชั้น': 'Pick a level',
    'ระดับชั้น': 'Level',
    'เพิ่มจังหวัด': 'Add a province',
    'ไม่พบจังหวัดที่ค้นหา': 'No province matches',
    'คำนำหน้า': 'Title',
    'กำลังโหลด…': 'Loading…',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'กว้างเต็มพื้นที่': 'Full width',
    'แบบพื้นทึบ': 'Filled',
    'กว้างตามค่า': 'Sized to the value',
    'จังหวัด (ต้องเลือก)': 'Province (required)',
    'เลือกได้ 1 จังหวัด': 'Pick one province',
    'โหลดจาก API ใหม่': 'Reload from API',
    'กรุงเทพมหานคร': 'Bangkok',
    'เชียงใหม่': 'Chiang Mai',
    'ขอนแก่น': 'Khon Kaen',
    'ภูเก็ต': 'Phuket',
    'สงขลา': 'Songkhla',
    'เชียงราย': 'Chiang Rai',
    'นครราชสีมา': 'Nakhon Ratchasima',
    'ภาคเหนือ': 'North',
    'ภาคอีสาน': 'Northeast',
    'ภาคใต้': 'South',
    'ชื่อ field อื่น:': 'Other field names:',
    'อนุบาล 1': 'Kindergarten 1',
    'ประถมศึกษาปีที่ 1': 'Grade 1',
    'มัธยมศึกษาปีที่ 1': 'Grade 7',
    'มัธยมศึกษาปีที่ 4': 'Grade 10',
    'ปิดรับสมัคร': 'applications closed',
    'เปิดฟอร์มเพิ่มจังหวัด': 'open the add-province form',
    'นาย': 'Mr',
    'นาง': 'Mrs',
    'นางสาว': 'Ms',
    'เด็กชาย': 'Master',
    'เด็กหญิง': 'Miss',
    'พิมพ์เองได้ เช่น "ดร."': 'any text works too, e.g. "Dr"',
    'object ใหม่จาก API: dataKey="id" ยังเลือกตัวเดิมได้': 'a new object from the API: dataKey="id" still matches the chosen one',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> selector <code>wu-dropdown</code> ก็ใช้ได้',
        en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>. The <code>wu-dropdown</code> selector works too.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>options</code> เป็น array ของ object · <code>optionLabel</code> คือ field ที่แสดง · <code>optionValue</code> คือ field ที่เก็บใน model (ไม่ใส่ = ทั้ง object) · กดที่ label แล้วโฟกัสที่ช่องให้ · คลิกที่ช่องอีกครั้งตอนรายการเปิดอยู่เพื่อปิด',
        en: '<code>options</code> is an array of objects · <code>optionLabel</code> is the field shown · <code>optionValue</code> the field kept in the model (left out = the whole object) · clicking the label focuses the field · a second click on the open field closes the list.',
      },
    },
    filter: {
      title: { th: 'ค้นหา', en: 'Search' },
      text: {
        th: '<code>[filter]="true"</code> เพิ่มช่องค้นหาในรายการ <code>filterBy</code> เลือก field ที่ค้น (คั่นด้วยจุลภาค) ค้นภาษาไทยได้ตรง ๆ และเลขไทยใช้ได้เหมือน 0–9',
        en: '<code>[filter]="true"</code> adds a search box to the list; <code>filterBy</code> picks the fields (comma separated). Thai text matches as typed, and Thai digits count as 0–9.',
      },
    },
    clear: { title: { th: 'ปุ่มล้าง', en: 'Clear button' }, text: { th: '<code>[showClear]="true"</code> เพิ่มปุ่ม × เมื่อมีค่า', en: '<code>[showClear]="true"</code> adds an × once there is a value.' } },
    group: {
      title: { th: 'จัดกลุ่ม', en: 'Groups' },
      text: {
        th: '<code>[group]="true"</code> ตัวเลือกเป็นกลุ่ม <code>{ label, items }</code> หรือกำหนดชื่อ field ด้วย <code>optionGroupLabel</code> / <code>optionGroupChildren</code>',
        en: '<code>[group]="true"</code> makes the options groups of <code>{ label, items }</code>, or name the fields with <code>optionGroupLabel</code> / <code>optionGroupChildren</code>.',
      },
    },
    disabled: { title: { th: 'ตัวเลือกที่เลือกไม่ได้', en: 'Disabled options' }, text: { th: '<code>optionDisabled</code> ชื่อ field ที่บอกว่าตัวเลือกนั้นปิดอยู่ คีย์บอร์ดจะข้ามไป', en: '<code>optionDisabled</code> names the field that marks an option disabled; the keyboard skips it.' } },
    templates: {
      title: { th: 'ปรับแต่งแถวและค่าที่เลือก', en: 'Custom rows and value' },
      text: {
        th: 'template <code>item</code> แทนแต่ละแถวในรายการ และ <code>selectedItem</code> แทนค่าที่แสดงในช่อง ทั้งสองได้ตัวเลือกเป็น <code>let-p</code>',
        en: 'The <code>item</code> template draws each row and <code>selectedItem</code> the value in the field; both get the option as <code>let-p</code>.',
      },
    },
    moretemplates: {
      title: { th: 'template อื่น ๆ', en: 'More templates' },
      text: {
        th: '<code>group</code> หัวกลุ่ม · <code>header</code> / <code>footer</code> บนและล่างของรายการ · <code>empty</code> / <code>emptyfilter</code> เมื่อไม่มีตัวเลือกหรือค้นไม่เจอ · <code>dropdownicon</code> แทนลูกศร',
        en: '<code>group</code> group headers · <code>header</code> / <code>footer</code> above and below the list · <code>empty</code> / <code>emptyfilter</code> with no options or no match · <code>dropdownicon</code> instead of the arrow.',
      },
    },
    editable: {
      title: { th: 'พิมพ์เองได้', en: 'Editable' },
      text: { th: '<code>[editable]="true"</code> พิมพ์ข้อความเองได้ ถ้าพิมพ์ตรงกับชื่อตัวเลือกจะเลือกตัวนั้นให้', en: '<code>[editable]="true"</code> accepts any text; typing an option\'s label picks it.' },
    },
    loading: {
      title: { th: 'กำลังโหลด', en: 'Loading' },
      text: {
        th: '<code>[loading]="true"</code> แสดง spinner แทนลูกศรระหว่างโหลดตัวเลือก และล็อกช่องไว้: รายการไม่เปิด ค่าเปลี่ยนไม่ได้ และปุ่มล้างซ่อนไป',
        en: '<code>[loading]="true"</code> shows a spinner in place of the arrow while options load, and locks the field: the list does not open, the value cannot change and the clear button hides.',
      },
    },
    checkmark: { title: { th: 'เครื่องหมายถูก', en: 'Check mark' }, text: { th: '<code>[checkmark]="true"</code> แสดง ✓ ข้างตัวเลือกที่เลือกอยู่', en: '<code>[checkmark]="true"</code> shows ✓ beside the chosen option.' } },
    sizes: {
      title: 'Sizes',
      text: { th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้)', en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too).' },
    },
    look: {
      title: { th: 'ความกว้างและแบบพื้นทึบ', en: 'Width and filled' },
      text: {
        th: 'ค่าเริ่มต้นกว้างมาตรฐาน 14rem (<code>--wu-select-width</code>) แต่ไม่เกินกล่องที่อยู่ ค่าที่ยาวกว่าช่องลงท้ายด้วย … · ตั้ง <code>--wu-select-width: auto</code> ให้กว้างตามค่า · <code>[fluid]="true"</code> หรือ <code>styleClass="w-full"</code> กว้างเต็มพื้นที่ · <code>variant="filled"</code> แบบพื้นทึบ',
        en: 'By default the field is a standard 14rem wide (<code>--wu-select-width</code>), never wider than its container; long values end in …. Set <code>--wu-select-width: auto</code> to size it to the value · <code>[fluid]="true"</code> or <code>styleClass="w-full"</code> fills the space · <code>variant="filled"</code> for a filled field.',
      },
    },
    invalid: {
      title: 'Invalid',
      text: { th: 'ใน form ขึ้นสีแดงเองเมื่อถูกแตะแล้วหรือกดส่ง ใช้ <code>[invalid]</code> เมื่อต้องการบังคับเอง', en: 'In a form it turns red on its own once touched or submitted; use <code>[invalid]</code> to force it.' },
    },
    datakey: {
      title: 'dataKey',
      text: {
        th: 'เมื่อ model เป็น object (ไม่ใส่ <code>optionValue</code>) ใช้ <code>dataKey</code> เทียบด้วย field นั้นแทนการเทียบทั้ง object เช่นข้อมูลที่โหลดจาก API มาใหม่',
        en: 'When the model is an object (no <code>optionValue</code>), <code>dataKey</code> compares by that field instead of the whole object, e.g. for data reloaded from an API.',
      },
    },
    reactive: { title: 'Reactive Forms', text: { th: 'validator และ <code>disable()</code> ใช้ได้ตามปกติ', en: 'Validators and <code>disable()</code> work as usual.' } },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: '<code>↑</code> <code>↓</code> เลื่อนตัวเลือก (เปิดรายการถ้ายังปิด) · <code>Home</code> / <code>End</code> ตัวแรก / ตัวสุดท้าย · <code>PageUp</code> / <code>PageDown</code> ทีละหน้า · <code>Enter</code> / <code>Space</code> เลือก · <code>Esc</code> ปิด · <code>Tab</code> เลือกแถวที่ไฮไลต์แล้วไปช่องถัดไป · ตอนรายการปิด พิมพ์ตัวอักษรเพื่อข้ามไปตัวเลือกที่ขึ้นต้นด้วยตัวนั้น · ช่องเป็น <code>role="combobox"</code> และรายการเป็น <code>role="listbox"</code> · ช่องที่โฟกัสอยู่มีวงแสงจาง ๆ ตามความมนของช่อง (โหมด focus แบบ ring / outline)',
        en: '<code>↑</code> <code>↓</code> move (and open the list) · <code>Home</code> / <code>End</code> first / last · <code>PageUp</code> / <code>PageDown</code> by a page · <code>Enter</code> / <code>Space</code> pick · <code>Esc</code> closes · <code>Tab</code> keeps the highlighted row and moves on · with the list closed, typing a letter jumps to the next option starting with it · the field is a <code>role="combobox"</code> and the list a <code>role="listbox"</code> · a focused field shows a soft halo that follows its radius (ring / outline focus modes).',
      },
    },
    migration: {
      title: { th: 'ไม่ต้องใช้ appendTo และย้ายโค้ดเดิม', en: 'No appendTo, and moving existing code' },
      text: {
        th: 'รายการเปิดใน top layer ของ browser จึงไม่ถูกตัดใน dialog หรือกล่องที่ <code>overflow: hidden</code> template เดิมที่ใช้ <code>p-dropdown</code> หรือ <code>p-select</code> เปลี่ยนเป็น <code>wu-select</code> ได้เลย input ส่วนใหญ่ชื่อเดิม ส่วน <code>appendTo</code>, <code>virtualScroll</code> และ <code>autoDisplayFirst</code> รับไว้แต่ไม่มีผล',
        en: 'The list opens in the browser top layer, so dialogs and <code>overflow: hidden</code> boxes never clip it. Templates using <code>p-dropdown</code> or <code>p-select</code> switch to <code>wu-select</code> with most inputs unchanged; <code>appendTo</code>, <code>virtualScroll</code> and <code>autoDisplayFirst</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<label for="province">จังหวัด</label>
<wu-select inputId="province" name="provinceId" [(ngModel)]="provinceId" [options]="provinces"
  optionLabel="name_th" optionValue="id" placeholder="เลือกจังหวัด"></wu-select>`,
    filter: `<wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
  optionValue="id" [filter]="true" filterBy="name_th,name_en,code" placeholder="ค้นหาจังหวัด"></wu-select>`,
    clear: `<wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
  optionValue="id" [showClear]="true" placeholder="เลือกจังหวัด"></wu-select>`,
    group: `<wu-select name="province" [(ngModel)]="province" [options]="regions" [group]="true" optionLabel="name_th"
  optionValue="id" placeholder="เลือกตามภาค"></wu-select>`,
    disabled: `<wu-select name="level" [(ngModel)]="level" [options]="levels" optionLabel="name" optionValue="id"
  optionDisabled="closed" placeholder="เลือกระดับชั้น"></wu-select>`,
    templates: `<wu-select name="province" [(ngModel)]="province" [options]="provinces" optionLabel="name_th"
  dataKey="id" placeholder="เลือกจังหวัด">
  <ng-template #item let-p>
    <b class="province-code">{{ p.code }}</b> {{ p.name_th }}
  </ng-template>
  <ng-template #selectedItem let-p>
    <span>{{ p.code }} · {{ p.name_th }}</span>
  </ng-template>
</wu-select>`,
    moretemplates: `<wu-select name="province" [(ngModel)]="province" [options]="regions" [group]="true" optionLabel="name_th"
  optionValue="id" [filter]="true" placeholder="เลือกจังหวัด">
  <ng-template #group let-g>
    <i class="wi wi-map-marker"></i> {{ g.label }}
  </ng-template>
  <ng-template #header>
    <div class="select-note">เลือกได้ 1 จังหวัด</div>
  </ng-template>
  <ng-template #footer>
    <wu-button label="เพิ่มจังหวัด" icon="wi wi-plus" size="small" [text]="true" (onClick)="addProvince()"></wu-button>
  </ng-template>
  <ng-template #emptyfilter>ไม่พบจังหวัดที่ค้นหา</ng-template>
  <ng-template #dropdownicon>
    <i class="wi wi-search"></i>
  </ng-template>
</wu-select>`,
    editable: `<wu-select name="title" [(ngModel)]="title" [options]="titles" [editable]="true"
  placeholder="คำนำหน้า"></wu-select>`,
    loading: `<wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
  optionValue="id" [loading]="isOptionsLoading" placeholder="กำลังโหลด…"></wu-select>`,
    checkmark: `<wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
  optionValue="id" [checkmark]="true" placeholder="เลือกจังหวัด"></wu-select>`,
    sizes: `<wu-select name="small" [(ngModel)]="small" [options]="titles" size="small" placeholder="เล็ก"></wu-select>
<wu-select name="normal" [(ngModel)]="normal" [options]="titles" placeholder="ปกติ"></wu-select>
<wu-select name="large" [(ngModel)]="large" [options]="titles" size="large" placeholder="ใหญ่"></wu-select>`,
    look: `<wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
  optionValue="id" [fluid]="true" placeholder="กว้างเต็มพื้นที่"></wu-select>
<wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
  optionValue="id" variant="filled" placeholder="แบบพื้นทึบ"></wu-select>
<div style="--wu-select-width: auto">
  <wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
    optionValue="id" placeholder="กว้างตามค่า"></wu-select>
</div>`,
    invalid: `<wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
  optionValue="id" [required]="true" placeholder="จังหวัด (ต้องเลือก)"></wu-select>
<wu-select name="other" [(ngModel)]="other" [options]="provinces" optionLabel="name_th" [invalid]="true"
  placeholder="Invalid"></wu-select>`,
    datakey: `<wu-select name="province" [(ngModel)]="province" [options]="provinces" optionLabel="name_th"
  dataKey="id" placeholder="เลือกจังหวัด"></wu-select>`,
    reactive: `<form [formGroup]="form">
  <wu-select formControlName="level" [options]="levels" optionLabel="name" optionValue="id"
    placeholder="ระดับชั้น"></wu-select>
</form>`,
  },
  ts: {
    basic: { th: PROVINCES_TS, en: PROVINCES_TS_EN },
    group: `regions = [
  { label: 'ภาคเหนือ', items: [{ id: 50, name_th: 'เชียงใหม่' }, { id: 57, name_th: 'เชียงราย' }] },
  { label: 'ภาคอีสาน', items: [{ id: 40, name_th: 'ขอนแก่น' }, { id: 30, name_th: 'นครราชสีมา' }] },
  { label: 'ภาคใต้', items: [{ id: 83, name_th: 'ภูเก็ต' }, { id: 90, name_th: 'สงขลา' }] },
];
// ชื่อ field อื่น: optionGroupLabel="region_name" optionGroupChildren="provinces"`,
    disabled: `levels = [
  { id: 'k1', name: 'อนุบาล 1' },
  { id: 'p1', name: 'ประถมศึกษาปีที่ 1' },
  { id: 'm1', name: 'มัธยมศึกษาปีที่ 1' },
  { id: 'm4', name: 'มัธยมศึกษาปีที่ 4', closed: true },   // ปิดรับสมัคร
];`,
    moretemplates: `addProvince(): void {
  // เปิดฟอร์มเพิ่มจังหวัด
}`,
    editable: `titles = ['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง'];
title = '';   // พิมพ์เองได้ เช่น "ดร."`,
    loading: `isOptionsLoading = true;

ngOnInit(): void {
  this.provinceService.getAll().subscribe((provinces) => {
    this.provinces = provinces;
    this.isOptionsLoading = false;
  });
}`,
    datakey: `province: { id: number; name_th: string } | null = null;

reload(): void {
  // object ใหม่จาก API: dataKey="id" ยังเลือกตัวเดิมได้
  this.province = { id: 50, name_th: 'เชียงใหม่' };
}`,
    reactive: `form = new FormGroup({
  level: new FormControl('', Validators.required),
});`,
  },
  api: [
    {
      id: 'api-inputs',
      title: { th: 'Inputs · ตัวเลือก', en: 'Inputs · options' },
      rows: [
        row('options', 'unknown[]', '[]', 'ตัวเลือก (หรือกลุ่มเมื่อ group)', 'Options (or groups with group)'),
        row('optionLabel · optionValue · optionDisabled', 'string', undefined, 'field (หรือ dot path) ของข้อความ ค่า และการปิด', 'Fields (or dot paths) for the label, value and disabled'),
        row('group · optionGroupLabel · optionGroupChildren', "boolean · string · string", "false · 'label' · 'items'", 'ตัวเลือกแบบกลุ่ม', 'Grouped options'),
        row('dataKey', 'string', undefined, 'เทียบ object ด้วย field นี้', 'Compare objects by this field'),
        row('placeholder', 'string', undefined, 'ข้อความเมื่อยังไม่เลือก', 'Text before a pick'),
        row('showClear · editable · loading · checkmark', BOOL, 'false', 'ปุ่มล้าง · พิมพ์เอง · spinner และล็อกช่อง · เครื่องหมายถูก', 'Clear button · free text · spinner and a locked field · check mark'),
        row('scrollHeight', 'string', "'14rem'", 'ความสูงของรายการก่อนเลื่อน', 'List height before it scrolls'),
      ],
    },
    {
      id: 'api-filter',
      title: { th: 'Inputs · ค้นหา', en: 'Inputs · search' },
      rows: [
        row('filter', BOOL, 'false', 'ช่องค้นหาในรายการ', 'Search box in the list'),
        row('filterBy', 'string', 'optionLabel', 'field ที่ค้น คั่นด้วยจุลภาค', 'Fields to search, comma separated'),
        row('filterMatchMode', "'contains' | 'startsWith' | 'endsWith' | 'equals'", "'contains'", 'วิธีเทียบ', 'How to match'),
        row('filterPlaceholder · ariaFilterLabel · filterValue', 'string', undefined, 'ช่องค้นหา', 'Search box'),
        row('resetFilterOnHide', BOOL, 'false', 'ล้างคำค้นเมื่อปิดรายการ', 'Clear the search on close'),
        row('emptyMessage · emptyFilterMessage', 'string', 'locale', 'ข้อความเมื่อไม่มีตัวเลือก / ค้นไม่เจอ', 'Text with no options / no match'),
      ],
    },
    {
      id: 'api-field',
      title: { th: 'Inputs · ช่อง', en: 'Inputs · field' },
      rows: [
        row('size', "'small' | 'large' | 'sm' | 'lg'", undefined, 'ขนาด', 'Size'),
        row('fluid', BOOL, 'false', 'กว้างเต็มพื้นที่ (ค่าเริ่มต้นกว้าง 14rem จาก --wu-select-width)', 'Full width (the default is 14rem, from --wu-select-width)'),
        row('variant', "'outlined' | 'filled'", "'outlined'", 'มีขอบหรือพื้นทึบ', 'Bordered or filled'),
        row('disabled · readonly · invalid', BOOL, 'false', 'สถานะ', 'States'),
        row('inputId · ariaLabel · ariaLabelledBy · tabindex', 'string', undefined, 'id และชื่อสำหรับ screen reader', 'id and accessible names'),
        row('styleClass · style · panelStyleClass · panelStyle', 'string · object', undefined, 'class / style ของช่องและรายการ', 'Field and list classes / styles'),
        row('appendTo · autoZIndex · baseZIndex · virtualScroll · virtualScrollItemSize · lazy · autoDisplayFirst · autofocusFilter', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล (อยู่ใน top layer)', 'Accepted so existing templates compile; no effect (top layer)'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      rows: [
        row('item', '$implicit (option) · selected · index', undefined, 'แต่ละแถวในรายการ', 'Each row of the list'),
        row('selectedItem', '$implicit (option)', undefined, 'ค่าที่แสดงในช่อง', 'The value in the field'),
        row('group', '$implicit (group)', undefined, 'หัวกลุ่ม', 'Group header'),
        row('header · footer · empty · emptyfilter · dropdownicon', '—', undefined, 'ส่วนบน / ล่าง / ว่าง / ค้นไม่เจอ / ลูกศร', 'Top / bottom / empty / no match / arrow'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onChange', 'WuSelectChangeEvent', undefined, 'ค่าเปลี่ยน', 'Value changed'),
        row('onFilter', 'WuSelectFilterEvent', undefined, 'พิมพ์ค้นหา', 'Search typed'),
        row('onShow · onHide', 'void', undefined, 'รายการเปิด / ปิด', 'List opened / closed'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'เข้า / ออกจากช่อง', 'Field focus / blur'),
        row('onClear', 'Event', undefined, 'กดปุ่มล้าง', 'Clear pressed'),
        row('onLazyLoad', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ (ไม่ส่ง เพราะไม่มี virtual scroll)', 'Accepted so existing templates compile (never emitted: there is no virtual scroll)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuSelectChangeEvent {
  originalEvent: Event | null;
  value: unknown;
}
interface WuSelectFilterEvent {
  originalEvent: Event;
  filter: string;
}
type WuSelectMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals';`,
    },
  ],
  tokens: [
    tok('--wu-select-width', 'ความกว้างของช่อง (ค่าเริ่มต้น 14rem ไม่เกินกล่องที่อยู่ · auto = กว้างตามค่า)', 'Field width (14rem by default, never wider than its container; auto sizes to the value)'),
    tok('--wu-field-bg', 'พื้นของช่อง (ร่วมกับ InputText)', 'Field background (shared with InputText)'),
    tok('--wu-field-border', 'ขอบของช่อง', 'Field border'),
    tok('--wu-input-radius', 'ความมนของช่อง', 'Field radius'),
    tok('--wu-select-dropdown-width', 'ความกว้างของปุ่มลูกศร', 'Arrow button width'),
    tok('--wu-select-dropdown-color', 'สีลูกศร', 'Arrow colour'),
    tok('--wu-overlay-bg', 'พื้นของรายการ', 'List background'),
    tok('--wu-select-overlay-radius', 'ความมนของรายการ', 'List radius'),
    tok('--wu-select-overlay-shadow', 'เงาของรายการ', 'List shadow'),
    tok('--wu-select-overlay-border-width', 'ขอบของรายการ', 'List border width'),
    tok('--wu-select-header-padding', 'ระยะในส่วนค้นหา / header', 'Search / header padding'),
    tok('--wu-select-list-padding', 'ระยะรอบรายการ', 'List padding'),
    tok('--wu-select-option-padding-x', 'ระยะซ้ายขวาของแถว', 'Row horizontal padding'),
    tok('--wu-select-option-padding-y', 'ระยะบนล่างของแถว', 'Row vertical padding'),
    tok('--wu-select-option-radius', 'ความมนของแถว', 'Row radius'),
    tok('--wu-select-option-hover-bg', 'พื้นแถวที่ชี้ / ไฮไลต์', 'Hovered / highlighted row'),
    tok('--wu-select-option-selected-bg', 'พื้นแถวที่เลือก', 'Chosen row background'),
    tok('--wu-select-option-selected-color', 'สีตัวอักษรแถวที่เลือก', 'Chosen row text'),
    tok('--wu-select-group-color', 'สีหัวกลุ่ม', 'Group header colour'),
    tok('--wu-select-group-weight', 'น้ำหนักหัวกลุ่ม', 'Group header weight'),
  ],
};
