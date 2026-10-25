import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

const PROVINCES_TS = `provinces = [
  { id: 10, code: 'BKK', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok' },
  { id: 50, code: 'CMI', name_th: 'เชียงใหม่', name_en: 'Chiang Mai' },
  { id: 57, code: 'CRI', name_th: 'เชียงราย', name_en: 'Chiang Rai' },
  { id: 40, code: 'KKN', name_th: 'ขอนแก่น', name_en: 'Khon Kaen' },
  { id: 83, code: 'PKT', name_th: 'ภูเก็ต', name_en: 'Phuket' },
  { id: 90, code: 'SKA', name_th: 'สงขลา', name_en: 'Songkhla' },
];
provinceIds: number[] = [];   // ค่าเป็น array เสมอ`;

/** English sample data drops the Thai names (the Thai sample keeps both, as the apps store them). */
const PROVINCES_TS_EN = `provinces = [
  { id: 10, code: 'BKK', name_en: 'Bangkok' },
  { id: 50, code: 'CMI', name_en: 'Chiang Mai' },
  { id: 57, code: 'CRI', name_en: 'Chiang Rai' },
  { id: 40, code: 'KKN', name_en: 'Khon Kaen' },
  { id: 83, code: 'PKT', name_en: 'Phuket' },
  { id: 90, code: 'SKA', name_en: 'Songkhla' },
];
provinceIds: number[] = [];   // ค่าเป็น array เสมอ`;

const REGIONS_TS = `regions = [
  { label: 'ภาคเหนือ', items: [{ id: 50, name_th: 'เชียงใหม่' }, { id: 57, name_th: 'เชียงราย' }] },
  { label: 'ภาคอีสาน', items: [{ id: 40, name_th: 'ขอนแก่น' }, { id: 30, name_th: 'นครราชสีมา' }] },
  { label: 'ภาคใต้', items: [{ id: 83, name_th: 'ภูเก็ต' }, { id: 90, name_th: 'สงขลา' }] },
];`;

/** One multiselect line, the way most samples start. */
const FIELD = `<wt-multiselect name="provinceIds" [(ngModel)]="provinceIds" [options]="provinces" optionLabel="name_th"
  optionValue="id"`;

export const MULTISELECT_DOC: ComponentDoc = {
  id: 'multiselect',
  title: 'MultiSelect',
  group: 'Form',
  entry: 'multiselect',
  standalone: 'WtMultiSelect',
  module: 'WtMultiSelectModule',
  forms: true,
  selector: 'wt-multiselect',
  description: {
    th: 'เลือกได้หลายตัวเลือกจากรายการเดียว ค่าเป็น array มีช่องค้นหาและติ๊กทั้งหมดในตัว แสดงเป็นข้อความหรือชิป และรายการเปิดค้างไว้ระหว่างเลือก ใช้ช่องและรายการชุดเดียวกับ Select',
    en: 'Pick several options from one list. The value is an array, search and check-all are built in, choices show as text or chips, and the list stays open while you pick. It shares its field and list with Select.',
  },
  english: {
    name_th: 'name_en',
    'จังหวัด': 'Provinces',
    'เลือกจังหวัด': 'Pick provinces',
    'กรุงเทพมหานคร': 'Bangkok',
    'เชียงใหม่': 'Chiang Mai',
    'เชียงราย': 'Chiang Rai',
    'ขอนแก่น': 'Khon Kaen',
    'ภูเก็ต': 'Phuket',
    'สงขลา': 'Songkhla',
    'นครราชสีมา': 'Nakhon Ratchasima',
    'ภาคเหนือ': 'North',
    'ภาคอีสาน': 'Northeast',
    'ภาคใต้': 'South',
    'ค่าเป็น array เสมอ': 'always an array',
    'จังหวัดที่ดูแล': 'Provinces you cover',
    'เลือกแล้ว {0} จังหวัด': '{0} provinces selected',
    'เลือกได้ไม่เกิน 2 จังหวัด': 'Up to 2 provinces',
    'เลือกตามภาค': 'Pick by region',
    'เลือกระดับชั้น': 'Pick levels',
    'อนุบาล 1': 'Kindergarten 1',
    'ประถมศึกษาปีที่ 1': 'Grade 1',
    'มัธยมศึกษาปีที่ 1': 'Grade 7',
    'มัธยมศึกษาปีที่ 4': 'Grade 10',
    'ปิดรับสมัคร': 'applications closed',
    'กำลังโหลด…': 'Loading…',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'กว้างเต็มพื้นที่': 'Full width',
    'แบบพื้นทึบ': 'Filled',
    'นำออก': 'Remove',
    'เลือกได้หลายจังหวัด': 'Pick as many as you need',
    'เพิ่มจังหวัด': 'Add a province',
    'ไม่พบจังหวัดที่ค้นหา': 'No province matches',
    'เปิดฟอร์มเพิ่มจังหวัด': 'open the add-province form',
    'จังหวัด (ต้องเลือก)': 'Provinces (required)',
    'object ทั้งก้อน เทียบด้วย dataKey="id"': 'whole objects, compared by dataKey="id"',
    'ค่าที่เพิ่งติ๊กหรือเอาออก': 'the value just ticked or unticked',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> selector <code>wt-multiSelect</code> ก็ใช้ได้ ค่าเป็น array เสมอ ช่องค้นหา (<code>filter</code>) และช่องติ๊กทั้งหมด (<code>showToggleAll</code>) เปิดอยู่แล้วโดยไม่ต้องใส่',
        en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>; the <code>wt-multiSelect</code> selector works too. The value is always an array. The search box (<code>filter</code>) and the check-all box (<code>showToggleAll</code>) are on by default.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>options</code> เป็น array ของ object · <code>optionLabel</code> คือ field ที่แสดง · <code>optionValue</code> คือ field ที่เก็บใน array (ไม่ใส่ = ทั้ง object) · คลิกแถวเพื่อติ๊กหรือเอาออก รายการเปิดค้างไว้จนกดข้างนอก กด Esc หรือ Tab · คลิกที่ช่องอีกครั้งเพื่อปิด',
        en: '<code>options</code> is an array of objects · <code>optionLabel</code> is the field shown · <code>optionValue</code> the field kept in the array (left out = the whole object) · click a row to tick or untick it; the list stays open until a click outside, Esc or Tab · a second click on the field closes it.',
      },
    },
    labels: {
      title: { th: 'ข้อความเมื่อเลือกหลายตัว', en: 'When many are picked' },
      text: {
        th: 'ช่องแสดงชื่อที่เลือกคั่นด้วยจุลภาค เมื่อเลือกเกิน <code>maxSelectedLabels</code> (ค่าเริ่มต้น 3) จะแสดง <code>selectedItemsLabel</code> แทน <code>{0}</code> คือจำนวน (ค่าเริ่มต้นมาจาก locale: “เลือกแล้ว {0} รายการ”) · <code>defaultLabel</code> คือชื่อเดิมของ <code>placeholder</code> ใช้ได้ทั้งคู่',
        en: 'The field lists the chosen labels with commas. Past <code>maxSelectedLabels</code> (default 3) it shows <code>selectedItemsLabel</code> instead, <code>{0}</code> being the count (the default comes from the locale: “{0} items selected”) · <code>defaultLabel</code> is the older name of <code>placeholder</code>; both work.',
      },
    },
    chips: {
      title: { th: 'แสดงเป็นชิป', en: 'Chips' },
      text: {
        th: '<code>display="chip"</code> แสดงค่าที่เลือกเป็นชิปพร้อมปุ่ม × สำหรับเอาออกทีละตัว เกิน <code>maxSelectedLabels</code> แล้วก็กลับเป็นข้อความจำนวนเหมือนเดิม',
        en: '<code>display="chip"</code> shows each choice as a chip with an × to remove it. Past <code>maxSelectedLabels</code> it falls back to the count text.',
      },
    },
    limit: {
      title: { th: 'จำกัดจำนวน', en: 'Selection limit' },
      text: {
        th: '<code>selectionLimit</code> เลือกได้ไม่เกินจำนวนนี้ ครบแล้วแถวที่เหลือจะกดไม่ได้ และช่องติ๊กทั้งหมดซ่อนไป',
        en: '<code>selectionLimit</code> caps the number of choices: once reached, the other rows are blocked and the check-all box hides.',
      },
    },
    toggleall: {
      title: { th: 'ติ๊กทั้งหมด', en: 'Check all' },
      text: {
        th: 'ช่องที่หัวรายการติ๊กเฉพาะแถวที่ค้นหาเหลืออยู่ (ข้ามแถวที่ปิด) ลองพิมพ์ “เชียง” แล้วกดติ๊กทั้งหมด · ถ้าติ๊กไว้บางแถวจะแสดงขีด · <code>(onSelectAllChange)</code> บอกว่าติ๊กหรือเอาออก · <code>[showToggleAll]="false"</code> ซ่อนช่องนี้',
        en: 'The box in the list header ticks only the rows the search leaves (disabled ones are skipped): type “chiang” and tick it · it shows a dash when some rows are ticked · <code>(onSelectAllChange)</code> says whether it ticked or cleared · <code>[showToggleAll]="false"</code> hides it.',
      },
    },
    group: {
      title: { th: 'จัดกลุ่ม', en: 'Groups' },
      text: {
        th: '<code>[group]="true"</code> ตัวเลือกเป็นกลุ่ม <code>{ label, items }</code> หรือกำหนดชื่อ field ด้วย <code>optionGroupLabel</code> / <code>optionGroupChildren</code>',
        en: '<code>[group]="true"</code> makes the options groups of <code>{ label, items }</code>, or name the fields with <code>optionGroupLabel</code> / <code>optionGroupChildren</code>.',
      },
    },
    disabled: {
      title: { th: 'ตัวเลือกที่เลือกไม่ได้', en: 'Disabled options' },
      text: {
        th: '<code>optionDisabled</code> ชื่อ field ที่บอกว่าตัวเลือกนั้นปิดอยู่ คีย์บอร์ดและติ๊กทั้งหมดจะข้ามไป · ตัวอย่างนี้มีตัวเลือกน้อยจึงปิดช่องค้นหาด้วย <code>[filter]="false"</code>',
        en: '<code>optionDisabled</code> names the field that marks an option disabled; the keyboard and check-all skip it · with so few options this sample turns the search off with <code>[filter]="false"</code>.',
      },
    },
    clear: {
      title: { th: 'ปุ่มล้างและกำลังโหลด', en: 'Clear button and loading' },
      text: {
        th: '<code>[showClear]="true"</code> เพิ่มปุ่ม × เมื่อมีค่า · <code>[loading]="true"</code> แสดง spinner แทนลูกศรและล็อกช่องไว้: รายการไม่เปิด ค่าเปลี่ยนไม่ได้ และปุ่มล้างซ่อนไป',
        en: '<code>[showClear]="true"</code> adds an × once there is a value · <code>[loading]="true"</code> shows a spinner in place of the arrow and locks the field: the list does not open, the value cannot change and the clear button hides.',
      },
    },
    sizes: {
      title: 'Sizes',
      text: { th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้)', en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too).' },
    },
    look: {
      title: { th: 'ความกว้างและแบบพื้นทึบ', en: 'Width and filled' },
      text: {
        th: 'กว้าง 14rem เหมือน Select (<code>--wt-select-width</code>) แต่ไม่เกินกล่องที่อยู่ · <code>[fluid]="true"</code> หรือ <code>styleClass="w-full"</code> กว้างเต็มพื้นที่ · <code>variant="filled"</code> แบบพื้นทึบ',
        en: '14rem wide like Select (<code>--wt-select-width</code>), never wider than its container · <code>[fluid]="true"</code> or <code>styleClass="w-full"</code> fills the space · <code>variant="filled"</code> for a filled field.',
      },
    },
    templates: {
      title: { th: 'ปรับแต่งแถวและค่าที่เลือก', en: 'Custom rows and chosen values' },
      text: {
        th: 'template <code>selectedItems</code> วาดค่าที่เลือกในช่องเอง (แอปใช้บ่อย) ได้ array ของค่าเป็น <code>let-values</code> และฟังก์ชัน <code>removeChip</code> สำหรับปุ่มเอาออก ส่วน <code>item</code> วาดแต่ละแถวในรายการ ได้ตัวเลือกเป็น <code>let-p</code> (มี <code>selected</code> และ <code>index</code> ด้วย) ตัวอย่างนี้ไม่ใส่ <code>optionValue</code> ค่าจึงเป็น object ทั้งก้อน และเทียบด้วย <code>dataKey</code>',
        en: 'The <code>selectedItems</code> template draws the chosen values in the field (the apps use it a lot). It gets the array of values as <code>let-values</code> and a <code>removeChip</code> function for remove buttons. <code>item</code> draws each row of the list and gets the option as <code>let-p</code> (with <code>selected</code> and <code>index</code> too). This sample has no <code>optionValue</code>, so the values are whole objects compared by <code>dataKey</code>.',
      },
    },
    moretemplates: {
      title: { th: 'template อื่น ๆ', en: 'More templates' },
      text: {
        th: '<code>group</code> หัวกลุ่ม · <code>header</code> / <code>footer</code> บนและล่างของรายการ · <code>empty</code> / <code>emptyfilter</code> เมื่อไม่มีตัวเลือกหรือค้นไม่เจอ · <code>dropdownicon</code> แทนลูกศร',
        en: '<code>group</code> group headers · <code>header</code> / <code>footer</code> above and below the list · <code>empty</code> / <code>emptyfilter</code> with no options or no match · <code>dropdownicon</code> instead of the arrow.',
      },
    },
    events: {
      title: { th: 'Event', en: 'Events' },
      text: {
        th: '<code>(onChange)</code> ได้ <code>{ originalEvent, value, itemValue }</code> โดย <code>itemValue</code> คือค่าที่เพิ่งติ๊กหรือเอาออก · <code>(onFilter)</code> เมื่อพิมพ์ค้นหา · <code>(onPanelShow)</code> / <code>(onPanelHide)</code> เมื่อรายการเปิด / ปิด · <code>(onClear)</code> เมื่อกดปุ่มล้าง · ลองดูผลด้านล่าง',
        en: '<code>(onChange)</code> gets <code>{ originalEvent, value, itemValue }</code>, <code>itemValue</code> being the value just ticked or unticked · <code>(onFilter)</code> on search · <code>(onPanelShow)</code> / <code>(onPanelHide)</code> when the list opens / closes · <code>(onClear)</code> on the clear button · watch the output below.',
      },
    },
    reactive: { title: 'Reactive Forms', text: { th: 'validator และ <code>disable()</code> ใช้ได้ตามปกติ', en: 'Validators and <code>disable()</code> work as usual.' } },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: '<code>↓</code> / <code>Enter</code> / <code>Space</code> เปิดรายการ · <code>↑</code> <code>↓</code> เลื่อนแถว (ข้ามแถวที่ปิด) · <code>Space</code> หรือ <code>Enter</code> ติ๊กแถวที่ไฮไลต์โดยรายการยังเปิดอยู่ · <code>Ctrl</code> / <code>⌘</code> + <code>A</code> ติ๊กทั้งหมด (ในช่องค้นหา Space กับ Ctrl / ⌘ + A ใช้กับข้อความที่พิมพ์ ส่วน Enter ยังติ๊กแถวได้) · <code>Home</code> / <code>End</code> · <code>PageUp</code> / <code>PageDown</code> · พิมพ์ตัวอักษรเพื่อข้ามไปแถวที่ขึ้นต้นด้วยตัวนั้น · <code>Esc</code> หรือ <code>Tab</code> ปิด · ช่องเป็น <code>role="combobox"</code> รายการเป็น <code>role="listbox"</code> แบบ <code>aria-multiselectable</code>',
        en: '<code>↓</code> / <code>Enter</code> / <code>Space</code> open the list · <code>↑</code> <code>↓</code> move (skipping disabled rows) · <code>Space</code> or <code>Enter</code> ticks the highlighted row and the list stays open · <code>Ctrl</code> / <code>⌘</code> + <code>A</code> ticks all (in the search box Space and Ctrl / ⌘ + A work on the typed text; Enter still ticks) · <code>Home</code> / <code>End</code> · <code>PageUp</code> / <code>PageDown</code> · typing a letter jumps to the next row starting with it · <code>Esc</code> or <code>Tab</code> closes · the field is a <code>role="combobox"</code> and the list an <code>aria-multiselectable</code> <code>role="listbox"</code>.',
      },
    },
    migration: {
      title: { th: 'ไม่ต้องใช้ appendTo และย้ายโค้ดเดิม', en: 'No appendTo, and moving existing code' },
      text: {
        th: 'รายการเปิดใน top layer ของ browser จึงไม่ถูกตัดใน dialog หรือกล่องที่ <code>overflow: hidden</code> template เดิมที่ใช้ <code>p-multiSelect</code> เปลี่ยนเป็น <code>wt-multiselect</code> ได้เลย input ส่วนใหญ่ชื่อเดิม (<code>defaultLabel</code>, <code>maxSelectedLabels</code>, <code>selectedItemsLabel</code>, <code>display="chip"</code>, template <code>selectedItems</code>) ส่วน <code>appendTo</code>, <code>virtualScroll</code>, <code>lazy</code> และ <code>autofocusFilter</code> รับไว้แต่ไม่มีผล',
        en: 'The list opens in the browser top layer, so dialogs and <code>overflow: hidden</code> boxes never clip it. Templates using <code>p-multiSelect</code> switch to <code>wt-multiselect</code> with most inputs unchanged (<code>defaultLabel</code>, <code>maxSelectedLabels</code>, <code>selectedItemsLabel</code>, <code>display="chip"</code>, the <code>selectedItems</code> template); <code>appendTo</code>, <code>virtualScroll</code>, <code>lazy</code> and <code>autofocusFilter</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<label for="provinces">จังหวัด</label>
<wt-multiselect inputId="provinces" name="provinceIds" [(ngModel)]="provinceIds" [options]="provinces"
  optionLabel="name_th" optionValue="id" placeholder="เลือกจังหวัด"></wt-multiselect>`,
    labels: `${FIELD} [maxSelectedLabels]="2" selectedItemsLabel="เลือกแล้ว {0} จังหวัด"
  defaultLabel="จังหวัดที่ดูแล"></wt-multiselect>`,
    chips: `${FIELD} display="chip" placeholder="เลือกจังหวัด"></wt-multiselect>`,
    limit: `${FIELD} [selectionLimit]="2" placeholder="เลือกได้ไม่เกิน 2 จังหวัด"></wt-multiselect>`,
    toggleall: `${FIELD} placeholder="เลือกจังหวัด"
  (onSelectAllChange)="allChanged($event)"></wt-multiselect>`,
    group: `<wt-multiselect name="provinceIds" [(ngModel)]="provinceIds" [options]="regions" [group]="true"
  optionLabel="name_th" optionValue="id" placeholder="เลือกตามภาค"></wt-multiselect>`,
    disabled: `<wt-multiselect name="levelIds" [(ngModel)]="levelIds" [options]="levels" optionLabel="name" optionValue="id"
  optionDisabled="closed" [filter]="false" placeholder="เลือกระดับชั้น"></wt-multiselect>`,
    clear: `${FIELD} [showClear]="true" placeholder="เลือกจังหวัด"></wt-multiselect>
${FIELD} [loading]="isOptionsLoading" placeholder="กำลังโหลด…"></wt-multiselect>`,
    sizes: `${FIELD} size="small" placeholder="เล็ก"></wt-multiselect>
${FIELD} placeholder="ปกติ"></wt-multiselect>
${FIELD} size="large" placeholder="ใหญ่"></wt-multiselect>`,
    look: `${FIELD} [fluid]="true" placeholder="กว้างเต็มพื้นที่"></wt-multiselect>
${FIELD} variant="filled" placeholder="แบบพื้นทึบ"></wt-multiselect>`,
    templates: {
      v3: `<wt-multiselect name="picked" [(ngModel)]="picked" [options]="provinces" optionLabel="name_th" dataKey="id"
  placeholder="เลือกจังหวัด">
  <ng-template #item let-p>
    <b class="province-code">{{ p.code }}</b> {{ p.name_th }}
  </ng-template>
  <ng-template #selectedItems let-values let-removeChip="removeChip">
    @for (p of values; track p.id) {
      <span class="province-chip">
        {{ p.code }}
        <button type="button" aria-label="นำออก" (click)="removeChip(p, $event)">×</button>
      </span>
    } @empty {
      <span class="text-color-secondary">เลือกจังหวัด</span>
    }
  </ng-template>
</wt-multiselect>`,
      classic: `<wt-multiselect name="picked" [(ngModel)]="picked" [options]="provinces" optionLabel="name_th" dataKey="id"
  placeholder="เลือกจังหวัด">
  <ng-template wtTemplate="item" let-p>
    <b class="province-code">{{ p.code }}</b> {{ p.name_th }}
  </ng-template>
  <ng-template wtTemplate="selectedItems" let-values let-removeChip="removeChip">
    <span *ngFor="let p of values" class="province-chip">
      {{ p.code }}
      <button type="button" aria-label="นำออก" (click)="removeChip(p, $event)">×</button>
    </span>
    <span *ngIf="!values.length" class="text-color-secondary">เลือกจังหวัด</span>
  </ng-template>
</wt-multiselect>`,
    },
    moretemplates: `<wt-multiselect name="provinceIds" [(ngModel)]="provinceIds" [options]="regions" [group]="true"
  optionLabel="name_th" optionValue="id" placeholder="เลือกจังหวัด">
  <ng-template #group let-g>
    <i class="pi pi-map-marker"></i> {{ g.label }}
  </ng-template>
  <ng-template #header>
    <div class="select-note">เลือกได้หลายจังหวัด</div>
  </ng-template>
  <ng-template #footer>
    <wt-button label="เพิ่มจังหวัด" icon="pi pi-plus" size="small" [text]="true" (onClick)="addProvince()"></wt-button>
  </ng-template>
  <ng-template #emptyfilter>ไม่พบจังหวัดที่ค้นหา</ng-template>
  <ng-template #dropdownicon>
    <i class="pi pi-search"></i>
  </ng-template>
</wt-multiselect>`,
    events: `${FIELD} [showClear]="true" placeholder="เลือกจังหวัด"
  (onChange)="changed($event)" (onFilter)="log('onFilter: ' + $event.filter)" (onPanelShow)="log('onPanelShow')"
  (onPanelHide)="log('onPanelHide')" (onClear)="log('onClear')"></wt-multiselect>`,
    reactive: `<form [formGroup]="form">
  <wt-multiselect formControlName="provinces" [options]="provinces" optionLabel="name_th" optionValue="id"
    placeholder="จังหวัด (ต้องเลือก)"></wt-multiselect>
</form>`,
  },
  ts: {
    basic: { th: PROVINCES_TS, en: PROVINCES_TS_EN },
    labels: `provinceIds: number[] = [10, 50, 40];`,
    chips: `provinceIds: number[] = [50, 83];`,
    toggleall: `import { WtMultiSelectSelectAllChangeEvent } from 'wiratheme/multiselect';

allChecked: boolean | null = null;

allChanged(event: WtMultiSelectSelectAllChangeEvent): void {
  this.allChecked = event.checked;
}`,
    group: REGIONS_TS,
    disabled: `levels = [
  { id: 'k1', name: 'อนุบาล 1' },
  { id: 'p1', name: 'ประถมศึกษาปีที่ 1' },
  { id: 'm1', name: 'มัธยมศึกษาปีที่ 1' },
  { id: 'm4', name: 'มัธยมศึกษาปีที่ 4', closed: true },   // ปิดรับสมัคร
];
levelIds: string[] = [];`,
    clear: `provinceIds: number[] = [50, 83];
isOptionsLoading = true;`,
    templates: `picked: Province[] = [];   // object ทั้งก้อน เทียบด้วย dataKey="id"`,
    moretemplates: `addProvince(): void {
  // เปิดฟอร์มเพิ่มจังหวัด
}`,
    events: `import { WtMultiSelectChangeEvent } from 'wiratheme/multiselect';

lastChange = '';
lastEvent = '';

changed(event: WtMultiSelectChangeEvent): void {
  this.lastChange = 'itemValue ' + event.itemValue + ' · value [' + event.value.join(', ') + ']';
}

log(name: string): void {
  this.lastEvent = name;
}`,
    reactive: `form = new FormGroup({
  provinces: new FormControl<number[]>([], Validators.required),
});`,
  },
  api: [
    {
      id: 'api-inputs',
      title: { th: 'Inputs · ตัวเลือก', en: 'Inputs · options' },
      rows: [
        row('options', 'unknown[]', '[]', 'ตัวเลือก (หรือกลุ่มเมื่อ group)', 'Options (or groups with group)'),
        row('optionLabel · optionValue · optionDisabled', 'string', undefined, 'field (หรือ dot path) ของข้อความ ค่า และการปิด', 'Fields (or dot paths) for the label, value and disabled'),
        row('group · optionGroupLabel · optionGroupChildren', 'boolean · string · string', "false · 'label' · 'items'", 'ตัวเลือกแบบกลุ่ม', 'Grouped options'),
        row('dataKey', 'string', undefined, 'เทียบ object ด้วย field นี้', 'Compare objects by this field'),
      ],
    },
    {
      id: 'api-field',
      title: { th: 'Inputs · ช่อง', en: 'Inputs · field' },
      rows: [
        row('placeholder · defaultLabel', 'string', undefined, 'ข้อความเมื่อยังไม่เลือก (defaultLabel คือชื่อเดิม)', 'Text before a pick (defaultLabel is the older name)'),
        row('display', "'comma' | 'chip'", "'comma'", 'แสดงค่าเป็นข้อความคั่นจุลภาคหรือชิป', 'Choices as comma-separated text or chips'),
        row('maxSelectedLabels', 'number', '3', 'เกินจำนวนนี้แสดง selectedItemsLabel แทน', 'Past this count, show selectedItemsLabel'),
        row('selectedItemsLabel', 'string', 'locale', 'ข้อความจำนวนที่เลือก {0} คือจำนวน', 'Count text; {0} is the count'),
        row('selectionLimit', 'number', undefined, 'เลือกได้ไม่เกินจำนวนนี้ (ซ่อนช่องติ๊กทั้งหมด)', 'At most this many (hides the check-all box)'),
        row('showClear · loading', BOOL, 'false', 'ปุ่มล้าง · spinner และล็อกช่อง', 'Clear button · spinner and a locked field'),
        row('disabled · readonly · invalid', BOOL, 'false', 'ปิด · อ่านอย่างเดียว · ขอบสีแดง', 'Disabled · read-only · red border'),
        row('size', "'small' | 'large' | 'sm' | 'lg'", undefined, 'ขนาด', 'Size'),
        row('fluid', BOOL, 'false', 'กว้างเต็มพื้นที่ (ค่าเริ่มต้นกว้าง 14rem จาก --wt-select-width)', 'Full width (the default is 14rem, from --wt-select-width)'),
        row('variant', "'outlined' | 'filled'", "'outlined'", 'แบบมีขอบหรือพื้นทึบ', 'Outlined or filled'),
        row('inputId · ariaLabel · ariaLabelledBy · tabindex', 'string', undefined, 'id และชื่อของช่องสำหรับ label / screen reader', 'Id and accessible name of the field'),
        row('styleClass · style · panelStyleClass · panelStyle', 'string · object', undefined, 'class / style ของช่องและรายการ', 'Field and list class / style'),
        row('scrollHeight', 'string', "'14rem'", 'ความสูงของรายการก่อนเลื่อน', 'List height before it scrolls'),
      ],
    },
    {
      id: 'api-panel',
      title: { th: 'Inputs · รายการและค้นหา', en: 'Inputs · list and search' },
      rows: [
        row('showHeader', BOOL, 'true', 'แถวหัวรายการ (ติ๊กทั้งหมด ช่องค้นหา)', 'The list header row (check-all, search)'),
        row('showToggleAll', BOOL, 'true', 'ช่องติ๊กทั้งหมด (ติ๊กเฉพาะแถวที่ค้นหาเหลือ)', 'The check-all box (ticks the rows the search leaves)'),
        row('filter', BOOL, 'true', 'ช่องค้นหาในรายการ', 'Search box in the list'),
        row('filterBy', 'string', 'optionLabel', 'field ที่ค้น คั่นด้วยจุลภาค', 'Fields to search, comma separated'),
        row('filterMatchMode', "'contains' | 'startsWith' | 'endsWith' | 'equals'", "'contains'", 'วิธีเทียบ', 'How to match'),
        row('filterPlaceholder · ariaFilterLabel · filterValue', 'string', undefined, 'ช่องค้นหา', 'Search box'),
        row('resetFilterOnHide', BOOL, 'false', 'ล้างคำค้นเมื่อปิดรายการ', 'Clear the search on close'),
        row('emptyMessage · emptyFilterMessage', 'string', 'locale', 'ข้อความเมื่อไม่มีตัวเลือก / ค้นไม่เจอ', 'Text with no options / no match'),
        row('appendTo · autoZIndex · baseZIndex · virtualScroll · virtualScrollItemSize · lazy · autofocusFilter · showTransitionOptions · hideTransitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onChange', 'WtMultiSelectChangeEvent', undefined, 'ติ๊ก เอาออก ติ๊กทั้งหมด หรือล้าง', 'Ticked, unticked, all ticked or cleared'),
        row('onFilter', 'WtMultiSelectFilterEvent', undefined, 'พิมพ์ค้นหา', 'Search typed'),
        row('onSelectAllChange', 'WtMultiSelectSelectAllChangeEvent', undefined, 'กดช่องติ๊กทั้งหมด (หรือ Ctrl / ⌘ + A)', 'Check-all box used (or Ctrl / ⌘ + A)'),
        row('onPanelShow · onPanelHide', 'void', undefined, 'รายการเปิด / ปิด', 'List opened / closed'),
        row('onClear', 'Event', undefined, 'กดปุ่มล้าง', 'Clear button pressed'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'โฟกัสเข้า / ออก', 'Focus in / out'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wtTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wtTemplate="item" or pTemplate="item".' },
      rows: [
        row('selectedItems', '$implicit (values) · removeChip', undefined, 'ค่าที่เลือกในช่อง removeChip(value, event) เอาค่าออก', 'The chosen values in the field; removeChip(value, event) removes one'),
        row('item', '$implicit (option) · selected · index', undefined, 'แต่ละแถวในรายการ', 'Each row of the list'),
        row('group', '$implicit (group)', undefined, 'หัวกลุ่ม', 'Group header'),
        row('header · footer', '—', undefined, 'บนและล่างของรายการ', 'Above and below the list'),
        row('empty · emptyfilter', '—', undefined, 'เมื่อไม่มีตัวเลือก / ค้นไม่เจอ', 'No options / no match'),
        row('dropdownicon', '—', undefined, 'แทนลูกศร', 'Instead of the arrow'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน template reference เช่น #ms', en: 'Call them through a template reference such as #ms.' },
      rows: [
        row('show() · hide() · toggle()', 'void', undefined, 'เปิด / ปิดรายการ', 'Open / close the list'),
        row('focusField()', 'void', undefined, 'โฟกัสที่ช่อง', 'Focus the field'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WtMultiSelectChangeEvent, WtMultiSelectSelectAllChangeEvent } from 'wiratheme/multiselect';

interface WtMultiSelectChangeEvent {
  originalEvent: Event;
  value: unknown[];
  itemValue?: unknown;     // ค่าที่เพิ่งติ๊กหรือเอาออก
}
interface WtMultiSelectFilterEvent { originalEvent: Event; filter: string }
interface WtMultiSelectSelectAllChangeEvent { originalEvent: Event; checked: boolean }
interface WtMultiSelectSelectedItemsContext {
  $implicit: unknown[];
  removeChip: (value: unknown, event?: Event) => void;
}`,
    },
  ],
  tokens: [
    tok('--wt-select-width', 'ความกว้างของช่อง (ร่วมกับ Select ค่าเริ่มต้น 14rem · auto = กว้างตามค่า)', 'Field width (shared with Select; 14rem by default, auto sizes to the value)'),
    tok('--wt-field-bg', 'พื้นของช่อง (ร่วมกับ InputText)', 'Field background (shared with InputText)'),
    tok('--wt-field-border', 'ขอบของช่อง', 'Field border'),
    tok('--wt-input-radius', 'ความมนของช่อง', 'Field radius'),
    tok('--wt-select-dropdown-width', 'ความกว้างของปุ่มลูกศร', 'Arrow button width'),
    tok('--wt-select-dropdown-color', 'สีลูกศร', 'Arrow colour'),
    tok('--wt-overlay-bg', 'พื้นของรายการ', 'List background'),
    tok('--wt-select-overlay-radius', 'ความมนของรายการ', 'List radius'),
    tok('--wt-select-overlay-shadow', 'เงาของรายการ', 'List shadow'),
    tok('--wt-select-header-padding', 'ระยะในแถวหัวรายการ (ติ๊กทั้งหมด ค้นหา)', 'List header padding (check-all, search)'),
    tok('--wt-select-list-padding', 'ระยะรอบรายการ', 'List padding'),
    tok('--wt-select-option-padding-x', 'ระยะซ้ายขวาของแถว', 'Row horizontal padding'),
    tok('--wt-select-option-padding-y', 'ระยะบนล่างของแถว', 'Row vertical padding'),
    tok('--wt-select-option-hover-bg', 'พื้นแถวที่ชี้ / ไฮไลต์', 'Hovered / highlighted row'),
    tok('--wt-select-option-selected-bg', 'พื้นแถวที่ติ๊ก', 'Ticked row background'),
    tok('--wt-select-option-selected-color', 'สีตัวอักษรแถวที่ติ๊ก', 'Ticked row text'),
    tok('--wt-select-group-color', 'สีหัวกลุ่ม', 'Group header colour'),
    tok('--wt-chip-bg', 'พื้นของชิป (display="chip")', 'Chip background (display="chip")'),
    tok('--wt-chip-color', 'สีตัวอักษรของชิป', 'Chip text'),
    tok('--wt-chip-radius', 'ความมนของชิป', 'Chip radius'),
    tok('--wt-primary-color', 'สีของช่องติ๊กและขีดของช่องติ๊กทั้งหมด', 'Check boxes and the check-all dash'),
  ],
};
