import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/** The search most samples share: a method that filters a local array, the way the TS tab shows it. */
const SEARCH_TS = `import { WuAutoCompleteCompleteEvent } from '@wirabyte/ui/autocomplete';

interface Province {
  id: number;
  code: string;
  name_th: string;
  name_en: string;
}

provinces: Province[] = [
  { id: 10, code: 'BKK', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok' },
  { id: 50, code: 'CMI', name_th: 'เชียงใหม่', name_en: 'Chiang Mai' },
  { id: 57, code: 'CRI', name_th: 'เชียงราย', name_en: 'Chiang Rai' },
  { id: 40, code: 'KKN', name_th: 'ขอนแก่น', name_en: 'Khon Kaen' },
  { id: 83, code: 'PKT', name_th: 'ภูเก็ต', name_en: 'Phuket' },
  { id: 90, code: 'SKA', name_th: 'สงขลา', name_en: 'Songkhla' },
];
suggestions: Province[] = [];
province: Province | string | null = null;   // ตัวเลือกที่เลือก (ทั้ง object) หรือข้อความที่กำลังพิมพ์

search(event: WuAutoCompleteCompleteEvent): void {
  const query = event.query.toLowerCase();
  // แอปจริงเรียก API ตรงนี้ แล้วตั้ง suggestions เมื่อได้ผลกลับมา
  this.suggestions = this.provinces.filter((p) => p.name_th.toLowerCase().includes(query));
}`;

/** English sample data drops the Thai names (the Thai sample keeps both, as the apps store them). */
const SEARCH_TS_EN = `import { WuAutoCompleteCompleteEvent } from '@wirabyte/ui/autocomplete';

interface Province {
  id: number;
  code: string;
  name_en: string;
}

provinces: Province[] = [
  { id: 10, code: 'BKK', name_en: 'Bangkok' },
  { id: 50, code: 'CMI', name_en: 'Chiang Mai' },
  { id: 57, code: 'CRI', name_en: 'Chiang Rai' },
  { id: 40, code: 'KKN', name_en: 'Khon Kaen' },
  { id: 83, code: 'PKT', name_en: 'Phuket' },
  { id: 90, code: 'SKA', name_en: 'Songkhla' },
];
suggestions: Province[] = [];
province: Province | string | null = null;   // ตัวเลือกที่เลือก (ทั้ง object) หรือข้อความที่กำลังพิมพ์

search(event: WuAutoCompleteCompleteEvent): void {
  const query = event.query.toLowerCase();
  // แอปจริงเรียก API ตรงนี้ แล้วตั้ง suggestions เมื่อได้ผลกลับมา
  this.suggestions = this.provinces.filter((p) => p.name_th.toLowerCase().includes(query));
}`;

/** The opening of most samples. */
const FIELD = `<wu-autocomplete name="province" [(ngModel)]="province" [suggestions]="suggestions" (completeMethod)="search($event)"
  optionLabel="name_th"`;

export const AUTOCOMPLETE_DOC: ComponentDoc = {
  id: 'autocomplete',
  title: 'AutoComplete',
  group: 'Form',
  entry: 'autocomplete',
  standalone: 'WuAutoComplete',
  module: 'WuAutoCompleteModule',
  forms: true,
  selector: 'wu-autocomplete',
  description: {
    th: 'ช่องพิมพ์ที่แนะนำตัวเลือกระหว่างพิมพ์ หน้าเว็บหาผลเองด้วย (completeMethod) จากข้อมูลในหน้าหรือ API เลือกแล้วได้ทั้ง object มีปุ่มแสดงทั้งหมด บังคับให้เลือกจากรายการได้ และหน้าตากับธีมเหมือน Select',
    en: 'A field that suggests options while you type. The page finds them in (completeMethod), from local data or an API. A pick gives the whole option, a button can show everything, picks can be required, and it looks and themes like Select.',
  },
  english: {
    name_th: 'name_en',
    'จังหวัด': 'Province',
    'พิมพ์ชื่อจังหวัด': 'Type a province',
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
    'ตัวเลือกที่เลือก (ทั้ง object) หรือข้อความที่กำลังพิมพ์': 'the picked option (the whole object), or the text being typed',
    'แอปจริงเรียก API ตรงนี้ แล้วตั้ง suggestions เมื่อได้ผลกลับมา': 'a real app calls its API here and sets suggestions when it returns',
    'พิมพ์อย่างน้อย 2 ตัวอักษร': 'Type at least 2 letters',
    'แทน API ที่ตอบช้า: ระหว่างรอ ช่องแสดง spinner': 'stands in for a slow API: the field shows a spinner while it waits',
    'ไม่พบจังหวัดนี้': 'No such province',
    'ไม่แสดงรายการเมื่อไม่พบ': 'No list when nothing matches',
    'กดปุ่มเพื่อดูทั้งหมด': 'Press the button to see all',
    'ปุ่มค้นตามข้อความในช่อง': 'The button searches the text',
    'ต้องเลือกจากรายการ': 'Pick from the list',
    'ข้อความที่ไม่ได้เลือกจะถูกล้างเมื่อออกจากช่อง': 'text that was not picked is cleared on leaving the field',
    'เลือกระดับชั้น': 'Pick a level',
    'อนุบาล 1': 'Kindergarten 1',
    'อนุบาล 2': 'Kindergarten 2',
    'ประถมศึกษาปีที่ 1': 'Grade 1',
    'มัธยมศึกษาปีที่ 1': 'Grade 7',
    'มัธยมศึกษาปีที่ 4': 'Grade 10',
    'ปิดรับสมัคร': 'applications closed',
    'ค้นตามภาค': 'Search by region',
    'เฉพาะภาคที่มีจังหวัดตรงกับคำค้น': 'only the regions with a matching province',
    'มีปุ่มล้าง': 'With a clear button',
    'แบบพื้นทึบ': 'Filled',
    'กว้างเต็มพื้นที่': 'Full width',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'เลือกจังหวัด': 'Pick a province',
    'พิมพ์ชื่อหรือรหัสจังหวัด': 'Type a name or code',
    'เพิ่มจังหวัด': 'Add a province',
    'ไม่พบจังหวัดที่ค้นหา': 'No province matches',
    'เปิดฟอร์มเพิ่มจังหวัด': 'open the add-province form',
    'ค้นทั้งชื่อและรหัส': 'match the name or the code',
    'ล่าสุด': 'Last events',
    'ตัวเลือกที่เลือก (หรือถูกแทน)': 'the option picked (or replaced)',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> selector <code>wu-autoComplete</code> ก็ใช้ได้ ช่องและรายการใช้ stylesheet และ token ชุดเดียวกับ Select: เป็นช่องพิมพ์ได้ และปุ่ม dropdown อยู่ตรงที่ลูกศรของ Select',
        en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>. The <code>wu-autoComplete</code> selector works too. The field and the list share Select\'s stylesheet and tokens: an editable field, with the dropdown button where Select has its arrow.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'พิมพ์แล้ว component ส่ง <code>(completeMethod)</code> พร้อม <code>$event.query</code> ให้หน้าเว็บหาผลแล้วตั้ง <code>[suggestions]</code> ใหม่ (ตัวอย่างนี้กรอง array ในหน้า แอปจริงมักเรียก API แล้วตั้งค่าเมื่อได้ผล) <code>optionLabel</code> คือ field ที่แสดง ค่าใน model คือตัวเลือกที่เลือกทั้ง object ส่วนระหว่างพิมพ์ยังไม่เลือก ค่าคือข้อความที่พิมพ์',
        en: 'As you type, the component emits <code>(completeMethod)</code> with <code>$event.query</code>; the page finds the matches and sets <code>[suggestions]</code> again (this sample filters an array in the page; a real app usually calls its API and sets them when they return). <code>optionLabel</code> is the field shown. The model is the picked option, the whole object; while you type without picking, it is the text.',
      },
    },
    delay: {
      title: { th: 'เวลารอและจำนวนตัวอักษร', en: 'Delay and minimum length' },
      text: {
        th: '<code>delay</code> รอกี่ ms หลังพิมพ์ตัวสุดท้ายก่อนส่ง (ค่าเริ่มต้น 0 คือส่งทุกครั้งที่พิมพ์ทันที ตั้งทั้งแอปได้ด้วย <code>provideWiraUI({ delays: { autoComplete: 300 } })</code>) · <code>minLength</code> ต้องพิมพ์กี่ตัวก่อนส่ง (ค่าเริ่มต้น 1) ระหว่างรอ <code>[suggestions]</code> ช่องแสดง spinner เอง ตัวอย่างนี้จำลอง API ที่ตอบกลับใน 0.7 วินาที',
        en: '<code>delay</code> is how many ms to wait after the last key before asking (default 0: ask on every key at once; set it for the whole app with <code>provideWiraUI({ delays: { autoComplete: 300 } })</code>) · <code>minLength</code> how many characters before asking (default 1). While waiting for <code>[suggestions]</code> the field shows a spinner. This sample stands in for an API that answers in 0.7 seconds.',
      },
    },
    empty: {
      title: { th: 'เมื่อไม่พบ', en: 'No results' },
      text: {
        th: 'ผลว่างแสดงข้อความ “ไม่พบข้อมูลที่ค้นหา” ตามภาษา เปลี่ยนด้วย <code>emptyMessage</code> หรือใส่ <code>[showEmptyMessage]="false"</code> เพื่อไม่เปิดรายการเลย',
        en: 'An empty result shows “No results found” in the reader\'s language. Change it with <code>emptyMessage</code>, or set <code>[showEmptyMessage]="false"</code> to keep the list closed.',
      },
    },
    dropdown: {
      title: { th: 'ปุ่มแสดงทั้งหมด', en: 'Dropdown button' },
      text: {
        th: '<code>[dropdown]="true"</code> เพิ่มปุ่มที่ส่ง <code>(completeMethod)</code> ด้วยคำค้นว่าง (<code>dropdownMode="blank"</code> ค่าเริ่มต้น) จึงได้ทุกตัวเลือก หรือ <code>dropdownMode="current"</code> ค้นตามข้อความในช่อง ปุ่มยังส่ง <code>(onDropdownClick)</code> ด้วย',
        en: '<code>[dropdown]="true"</code> adds a button that emits <code>(completeMethod)</code> with an empty query (<code>dropdownMode="blank"</code>, the default), so every option comes back; <code>dropdownMode="current"</code> searches the text in the field. The button also emits <code>(onDropdownClick)</code>.',
      },
    },
    force: {
      title: { th: 'ต้องเลือกจากรายการ', en: 'Force a pick' },
      text: {
        th: '<code>[forceSelection]="true"</code> เมื่อออกจากช่อง ข้อความที่ไม่ได้เลือกจากรายการจะถูกล้าง ถ้าข้อความตรงกับชื่อตัวเลือกพอดี (ไม่สนตัวพิมพ์) จะเลือกตัวนั้นให้ ลองพิมพ์ “ภูเก็ต” ให้ครบแล้วกด Tab',
        en: '<code>[forceSelection]="true"</code>: on leaving the field, text that was not picked from the list is cleared. Text equal to an option\'s label (ignoring case) picks that option. Try typing “phuket” in full and pressing Tab.',
      },
    },
    disabled: {
      title: { th: 'ตัวเลือกที่เลือกไม่ได้และไฮไลต์อันแรก', en: 'Disabled options and auto highlight' },
      text: {
        th: '<code>optionDisabled</code> ชื่อ field ที่บอกว่าตัวเลือกปิดอยู่ (คีย์บอร์ดข้ามไป) · <code>[autoHighlight]="true"</code> ไฮไลต์ตัวเลือกแรกให้ทันที กด Enter เลือกได้เลย',
        en: '<code>optionDisabled</code> names the field that marks an option disabled (the keyboard skips it) · <code>[autoHighlight]="true"</code> highlights the first option at once, so Enter picks it.',
      },
    },
    group: {
      title: { th: 'จัดกลุ่ม', en: 'Groups' },
      text: {
        th: '<code>[group]="true"</code> ผลเป็นกลุ่ม <code>{ label, items }</code> (หรือกำหนดชื่อ field ด้วย <code>optionGroupLabel</code> / <code>optionGroupChildren</code>) การค้นก็คืนเฉพาะกลุ่มที่มีตัวเลือกตรง',
        en: '<code>[group]="true"</code> makes the results groups of <code>{ label, items }</code> (or name the fields with <code>optionGroupLabel</code> / <code>optionGroupChildren</code>); the search returns only the groups with a match.',
      },
    },
    look: {
      title: { th: 'ปุ่มล้าง ความกว้าง และแบบพื้นทึบ', en: 'Clear button, width and filled' },
      text: {
        th: '<code>[showClear]="true"</code> เพิ่มปุ่ม × เมื่อมีค่า (ส่ง <code>(onClear)</code>) · กว้าง 14rem ตาม <code>--wu-select-width</code> เหมือน Select · <code>[fluid]="true"</code> หรือ <code>styleClass="w-full"</code> กว้างเต็มพื้นที่ · <code>variant="filled"</code> แบบพื้นทึบ',
        en: '<code>[showClear]="true"</code> adds an × once there is a value (it emits <code>(onClear)</code>) · 14rem wide from <code>--wu-select-width</code>, like Select · <code>[fluid]="true"</code> or <code>styleClass="w-full"</code> fills the space · <code>variant="filled"</code> for a filled field.',
      },
    },
    sizes: {
      title: 'Sizes',
      text: { th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้)', en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too).' },
    },
    templates: {
      title: 'Templates',
      text: {
        th: '<code>item</code> แทนแต่ละแถว (ได้ตัวเลือกเป็น <code>let-p</code>) · <code>header</code> / <code>footer</code> บนและล่างของรายการ · <code>empty</code> เมื่อไม่พบ · <code>group</code> หัวกลุ่ม',
        en: '<code>item</code> draws each row (the option arrives as <code>let-p</code>) · <code>header</code> / <code>footer</code> above and below the list · <code>empty</code> when nothing matches · <code>group</code> for group headers.',
      },
    },
    events: {
      title: 'Events',
      text: {
        th: '<code>(onSelect)</code> เลือกแล้ว (<code>{ originalEvent, value }</code>) · <code>(onUnselect)</code> ค่าที่เลือกไว้ถูกแทน · <code>(onClear)</code> · <code>(onDropdownClick)</code> · <code>(onFocus)</code> / <code>(onBlur)</code> · <code>(onKeyUp)</code> · <code>(onShow)</code> / <code>(onHide)</code> รายการเปิด / ปิด',
        en: '<code>(onSelect)</code> picked (<code>{ originalEvent, value }</code>) · <code>(onUnselect)</code> a picked value was replaced · <code>(onClear)</code> · <code>(onDropdownClick)</code> · <code>(onFocus)</code> / <code>(onBlur)</code> · <code>(onKeyUp)</code> · <code>(onShow)</code> / <code>(onHide)</code> when the list opens / closes.',
      },
    },
    reactive: { title: 'Reactive Forms', text: { th: 'validator และ <code>disable()</code> ใช้ได้ตามปกติ', en: 'Validators and <code>disable()</code> work as usual.' } },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: '<code>↓</code> / <code>↑</code> เลื่อนตัวเลือก (<code>↓</code> เปิดผลล่าสุดถ้ารายการปิดอยู่) · <code>Enter</code> เลือก · <code>Esc</code> ปิด · <code>Tab</code> เลือกแถวที่ไฮไลต์แล้วไปช่องถัดไป · ช่องเป็น <code>role="combobox"</code> พร้อม <code>aria-autocomplete="list"</code> รายการเป็น <code>role="listbox"</code> และ <code>aria-busy</code> ระหว่างรอผล',
        en: '<code>↓</code> / <code>↑</code> move (<code>↓</code> reopens the last results when the list is closed) · <code>Enter</code> picks · <code>Esc</code> closes · <code>Tab</code> keeps the highlighted row and moves on · the field is a <code>role="combobox"</code> with <code>aria-autocomplete="list"</code>, the list a <code>role="listbox"</code>, and <code>aria-busy</code> is set while waiting.',
      },
    },
    notyet: {
      title: { th: 'ยังไม่มี', en: 'Not built yet' },
      text: {
        th: '<code>optionValue</code> (เก็บแค่ field เดียวใน model) และ <code>multiple</code> (เลือกหลายค่าเป็นชิป) ยังไม่มีในรุ่นนี้ ค่าใน model จึงเป็นตัวเลือกทั้ง object เสมอ <code>multiple</code> รับไว้แต่ยังไม่มีผล ถ้าต้องการเลือกหลายค่าตอนนี้ใช้ MultiSelect ที่มีช่องค้นหาในตัว',
        en: '<code>optionValue</code> (keeping one field in the model) and <code>multiple</code> (several values as chips) are not built yet, so the model is always the whole option. <code>multiple</code> is accepted with no effect for now; to pick several values today, MultiSelect has a search box built in.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-autoComplete&gt;</code> เป็น <code>&lt;wu-autocomplete&gt;</code> (หรือ <code>wu-autoComplete</code>) <code>suggestions</code>, <code>completeMethod</code>, <code>field</code> / <code>optionLabel</code>, <code>delay</code>, <code>minLength</code>, <code>dropdown</code>, <code>forceSelection</code> และ template <code>pTemplate="item"</code> ใช้ชื่อเดิม รายการเปิดใน top layer จึงไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล เช่นเดียวกับ <code>virtualScroll</code>, <code>completeOnFocus</code> และ transition options)',
        en: 'Change <code>&lt;p-autoComplete&gt;</code> to <code>&lt;wu-autocomplete&gt;</code> (or <code>wu-autoComplete</code>). <code>suggestions</code>, <code>completeMethod</code>, <code>field</code> / <code>optionLabel</code>, <code>delay</code>, <code>minLength</code>, <code>dropdown</code>, <code>forceSelection</code> and <code>pTemplate="item"</code> templates keep their names. The list opens in the top layer, so <code>appendTo</code> is not needed (accepted and ignored, like <code>virtualScroll</code>, <code>completeOnFocus</code> and the transition options).',
      },
    },
  },
  code: {
    basic: `<label for="province">จังหวัด</label>
${FIELD} inputId="province" placeholder="พิมพ์ชื่อจังหวัด"></wu-autocomplete>`,
    delay: `<wu-autocomplete name="province" [(ngModel)]="province" [suggestions]="slowSuggestions" (completeMethod)="searchSlow($event)"
  optionLabel="name_th" [delay]="500" [minLength]="2" placeholder="พิมพ์อย่างน้อย 2 ตัวอักษร"></wu-autocomplete>`,
    empty: `${FIELD} emptyMessage="ไม่พบจังหวัดนี้"></wu-autocomplete>
${FIELD} [showEmptyMessage]="false" placeholder="ไม่แสดงรายการเมื่อไม่พบ"></wu-autocomplete>`,
    dropdown: `${FIELD} [dropdown]="true" placeholder="กดปุ่มเพื่อดูทั้งหมด"></wu-autocomplete>
${FIELD} [dropdown]="true" dropdownMode="current" placeholder="ปุ่มค้นตามข้อความในช่อง"></wu-autocomplete>`,
    force: `<!-- ข้อความที่ไม่ได้เลือกจะถูกล้างเมื่อออกจากช่อง -->
${FIELD} [forceSelection]="true" placeholder="ต้องเลือกจากรายการ"></wu-autocomplete>`,
    disabled: `<wu-autocomplete name="level" [(ngModel)]="level" [suggestions]="levelSuggestions" (completeMethod)="searchLevels($event)"
  optionLabel="name" optionDisabled="closed" [autoHighlight]="true" [dropdown]="true" placeholder="เลือกระดับชั้น"></wu-autocomplete>`,
    group: `<wu-autocomplete name="province" [(ngModel)]="province" [suggestions]="regionSuggestions" (completeMethod)="searchRegions($event)"
  [group]="true" optionLabel="name_th" placeholder="ค้นตามภาค"></wu-autocomplete>`,
    look: `${FIELD} [showClear]="true" placeholder="มีปุ่มล้าง"></wu-autocomplete>
${FIELD} variant="filled" placeholder="แบบพื้นทึบ"></wu-autocomplete>
${FIELD} [fluid]="true" placeholder="กว้างเต็มพื้นที่"></wu-autocomplete>`,
    sizes: `${FIELD} size="small" placeholder="เล็ก"></wu-autocomplete>
${FIELD} placeholder="ปกติ"></wu-autocomplete>
${FIELD} size="large" placeholder="ใหญ่"></wu-autocomplete>`,
    templates: {
      v3: `<wu-autocomplete name="province" [(ngModel)]="province" [suggestions]="suggestions" (completeMethod)="searchByCode($event)"
  optionLabel="name_th" [dropdown]="true" placeholder="พิมพ์ชื่อหรือรหัสจังหวัด">
  <ng-template #header>
    <div class="px-3 py-2 text-sm text-color-secondary">เลือกจังหวัด</div>
  </ng-template>
  <ng-template #item let-p>
    <b class="mr-2">{{ p.code }}</b> {{ p.name_th }}
  </ng-template>
  <ng-template #empty>ไม่พบจังหวัดที่ค้นหา</ng-template>
  <ng-template #footer>
    <wu-button label="เพิ่มจังหวัด" icon="wi wi-plus" size="small" [text]="true" (onClick)="addProvince()"></wu-button>
  </ng-template>
</wu-autocomplete>`,
      classic: `<wu-autocomplete name="province" [(ngModel)]="province" [suggestions]="suggestions" (completeMethod)="searchByCode($event)"
  optionLabel="name_th" [dropdown]="true" placeholder="พิมพ์ชื่อหรือรหัสจังหวัด">
  <ng-template wuTemplate="header">
    <div class="px-3 py-2 text-sm text-color-secondary">เลือกจังหวัด</div>
  </ng-template>
  <ng-template wuTemplate="item" let-p>
    <b class="mr-2">{{ p.code }}</b> {{ p.name_th }}
  </ng-template>
  <ng-template wuTemplate="empty">ไม่พบจังหวัดที่ค้นหา</ng-template>
  <ng-template wuTemplate="footer">
    <wu-button label="เพิ่มจังหวัด" icon="wi wi-plus" size="small" [text]="true" (onClick)="addProvince()"></wu-button>
  </ng-template>
</wu-autocomplete>`,
    },
    events: `${FIELD} [dropdown]="true" [showClear]="true"
  (onSelect)="log('onSelect')" (onUnselect)="log('onUnselect')" (onClear)="log('onClear')"
  (onDropdownClick)="log('onDropdownClick')" (onFocus)="log('onFocus')" (onBlur)="log('onBlur')"
  (onShow)="log('onShow')" (onHide)="log('onHide')"></wu-autocomplete>`,
    reactive: `<form [formGroup]="form">
  <wu-autocomplete formControlName="province" [suggestions]="suggestions" (completeMethod)="search($event)"
    optionLabel="name_th" placeholder="จังหวัด"></wu-autocomplete>
</form>`,
  },
  ts: {
    basic: { th: SEARCH_TS, en: SEARCH_TS_EN },
    delay: `slowSuggestions: Province[] = [];

searchSlow(event: WuAutoCompleteCompleteEvent): void {
  // แทน API ที่ตอบช้า: ระหว่างรอ ช่องแสดง spinner
  setTimeout(() => {
    const query = event.query.toLowerCase();
    this.slowSuggestions = this.provinces.filter((p) => p.name_th.toLowerCase().includes(query));
  }, 700);
}`,
    disabled: `levels = [
  { id: 'k1', name: 'อนุบาล 1' },
  { id: 'k2', name: 'อนุบาล 2', closed: true },   // ปิดรับสมัคร
  { id: 'p1', name: 'ประถมศึกษาปีที่ 1' },
  { id: 'm1', name: 'มัธยมศึกษาปีที่ 1' },
  { id: 'm4', name: 'มัธยมศึกษาปีที่ 4' },
];
levelSuggestions = this.levels;

searchLevels(event: WuAutoCompleteCompleteEvent): void {
  const query = event.query.toLowerCase();
  this.levelSuggestions = this.levels.filter((l) => l.name.toLowerCase().includes(query));
}`,
    group: `regions = [
  { label: 'ภาคเหนือ', items: [{ id: 50, name_th: 'เชียงใหม่' }, { id: 57, name_th: 'เชียงราย' }] },
  { label: 'ภาคอีสาน', items: [{ id: 40, name_th: 'ขอนแก่น' }, { id: 30, name_th: 'นครราชสีมา' }] },
  { label: 'ภาคใต้', items: [{ id: 83, name_th: 'ภูเก็ต' }, { id: 90, name_th: 'สงขลา' }] },
];
regionSuggestions = this.regions;

searchRegions(event: WuAutoCompleteCompleteEvent): void {
  const query = event.query.toLowerCase();
  // เฉพาะภาคที่มีจังหวัดตรงกับคำค้น
  this.regionSuggestions = this.regions
    .map((r) => ({ ...r, items: r.items.filter((p) => p.name_th.toLowerCase().includes(query)) }))
    .filter((r) => r.items.length);
}`,
    templates: `searchByCode(event: WuAutoCompleteCompleteEvent): void {
  const query = event.query.toLowerCase();
  // ค้นทั้งชื่อและรหัส
  this.suggestions = this.provinces.filter(
    (p) => p.name_th.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)
  );
}

addProvince(): void {
  // เปิดฟอร์มเพิ่มจังหวัด
}`,
    events: `lastEvents: string[] = [];

log(name: string): void {
  this.lastEvents = [...this.lastEvents.slice(-3), name];
}`,
    reactive: `form = new FormGroup({
  province: new FormControl<Province | null>(null, Validators.required),
});`,
  },
  api: [
    {
      id: 'api-options',
      title: { th: 'Inputs · ตัวเลือก', en: 'Inputs · options' },
      rows: [
        row('suggestions', 'unknown[]', '[]', 'ผลของคำค้นล่าสุด ตั้งใหม่ทุกครั้งที่ completeMethod ทำงาน', 'The results of the last query; set it again each time completeMethod runs'),
        row('optionLabel · field', 'string', undefined, 'field (หรือ dot path) ที่แสดง field คือชื่อเดิม', 'Field (or dot path) shown; field is the older name'),
        row('optionDisabled', 'string', undefined, 'field ที่บอกว่าตัวเลือกปิดอยู่', 'Field that marks an option disabled'),
        row('group · optionGroupLabel · optionGroupChildren', 'boolean · string · string', "false · 'label' · 'items'", 'ผลแบบกลุ่ม', 'Grouped results'),
        row('dataKey', 'string', undefined, 'เทียบตัวเลือกที่เลือกด้วย field นี้', 'Compare the picked option by this field'),
      ],
    },
    {
      id: 'api-search',
      title: { th: 'Inputs · การค้นหา', en: 'Inputs · search' },
      rows: [
        row('delay', 'number', '0', 'รอกี่ ms หลังพิมพ์ก่อนส่ง completeMethod (0 = ส่งทันที ค่าเริ่มต้นตั้งทั้งแอปได้ที่ provideWiraUI({ delays }))', 'Ms to wait after typing before completeMethod (0 = at once; the default is set for the app with provideWiraUI({ delays }))'),
        row('minLength', 'number', '1', 'จำนวนตัวอักษรขั้นต่ำก่อนส่ง', 'Characters needed before asking'),
        row('dropdown', BOOL, 'false', 'ปุ่มแสดงตัวเลือกทั้งหมด', 'A button that shows every option'),
        row('dropdownMode', "'blank' | 'current'", "'blank'", 'ปุ่มส่งคำค้นว่าง หรือข้อความในช่อง', 'The button asks with an empty query, or the current text'),
        row('forceSelection', BOOL, 'false', 'ล้างข้อความที่ไม่ได้เลือกเมื่อออกจากช่อง (ข้อความที่ตรงชื่อเลือกตัวนั้น)', 'Clear unpicked text on blur (text equal to a label picks it)'),
        row('autoHighlight', BOOL, 'false', 'ไฮไลต์ตัวเลือกแรกเมื่อรายการเปิด', 'Highlight the first option when the list opens'),
        row('showEmptyMessage · emptyMessage', 'boolean · string', 'true · locale', 'แสดงข้อความเมื่อไม่พบ และข้อความนั้น', 'Show text when nothing matches, and that text'),
        row('scrollHeight', 'string', "'14rem'", 'ความสูงของรายการก่อนเลื่อน', 'List height before it scrolls'),
      ],
    },
    {
      id: 'api-field',
      title: { th: 'Inputs · ช่อง', en: 'Inputs · field' },
      rows: [
        row('placeholder', 'string', undefined, 'ข้อความเมื่อยังว่าง', 'Text while empty'),
        row('showClear', BOOL, 'false', 'ปุ่ม × เมื่อมีค่า', 'An × once there is a value'),
        row('size · variant', "'small' | 'large' · 'outlined' | 'filled'", undefined, 'ขนาดและแบบพื้นทึบ', 'Size and the filled look'),
        row('fluid', BOOL, 'false', 'กว้างเต็มพื้นที่ (styleClass="w-full" ก็ได้)', 'Full width (styleClass="w-full" too)'),
        row('disabled · readonly · required · invalid', BOOL, 'false', 'สถานะของช่อง', 'Field states'),
        row('inputId · name · maxlength · tabindex', 'string · number', undefined, 'attribute ของ input', 'Input attributes'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อของช่องสำหรับ screen reader', 'Accessible name of the field'),
        row('styleClass · style · inputStyleClass · inputStyle · panelStyleClass · panelStyle', 'string · object', undefined, 'class / style ของกล่อง input และรายการ', 'Box, input and list classes / styles'),
        row('appendTo · autoZIndex · baseZIndex · virtualScroll · virtualScrollItemSize · multiple · completeOnFocus · showTransitionOptions · hideTransitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล (multiple ยังไม่มี)', 'Accepted so existing templates compile; no effect (multiple is not built yet)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('completeMethod', 'WuAutoCompleteCompleteEvent', undefined, 'ถึงเวลาหาผล: ตั้ง [suggestions] จาก query', 'Time to find results: set [suggestions] from query'),
        row('onSelect · onUnselect', 'WuAutoCompleteSelectEvent', undefined, 'เลือกแล้ว · ค่าที่เลือกไว้ถูกแทน', 'Picked · a picked value was replaced'),
        row('onDropdownClick', 'WuAutoCompleteCompleteEvent', undefined, 'กดปุ่ม dropdown', 'The dropdown button was pressed'),
        row('onClear', 'Event | undefined', undefined, 'กดปุ่มล้าง', 'The clear button was pressed'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'โฟกัสเข้า / ออกจากช่อง', 'Focus came in / left'),
        row('onKeyUp', 'KeyboardEvent', undefined, 'ปล่อยปุ่มในช่อง', 'A key was released in the field'),
        row('onShow · onHide', 'void', undefined, 'รายการเปิด / ปิด', 'The list opened / closed'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wuTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wuTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (option) · index', undefined, 'แต่ละแถวในรายการ', 'Each row in the list'),
        row('group', '$implicit (group)', undefined, 'หัวกลุ่ม', 'A group header'),
        row('header · footer', '—', undefined, 'บน / ล่างของรายการ', 'Above / below the list'),
        row('empty', '—', undefined, 'เมื่อไม่พบ', 'When nothing matches'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน template reference เช่น #ac', en: 'Call them through a template reference such as #ac.' },
      rows: [row('show() · hide()', 'void', undefined, 'เปิด / ปิดรายการจากโค้ด', 'Open / close the list from code')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WuAutoCompleteCompleteEvent, WuAutoCompleteSelectEvent } from '@wirabyte/ui/autocomplete';

interface WuAutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface WuAutoCompleteSelectEvent {
  originalEvent: Event;
  value: unknown;    // ตัวเลือกที่เลือก (หรือถูกแทน)
}`,
    },
  ],
  tokens: [
    tok('--wu-select-width', 'ความกว้างของช่อง (ร่วมกับ Select ค่าเริ่มต้น 14rem)', 'Field width (shared with Select; 14rem by default)'),
    tok('--wu-field-bg', 'พื้นของช่อง (ร่วมกับ InputText)', 'Field background (shared with InputText)'),
    tok('--wu-field-border', 'ขอบของช่อง', 'Field border'),
    tok('--wu-input-radius', 'ความมนของช่อง', 'Field radius'),
    tok('--wu-select-dropdown-width', 'ความกว้างของปุ่ม dropdown และ spinner', 'Dropdown button and spinner width'),
    tok('--wu-select-dropdown-color', 'สีลูกศรของปุ่ม dropdown', 'Dropdown arrow colour'),
    tok('--wu-overlay-bg', 'พื้นของรายการ', 'List background'),
    tok('--wu-select-overlay-radius', 'ความมนของรายการ', 'List radius'),
    tok('--wu-select-overlay-shadow', 'เงาของรายการ', 'List shadow'),
    tok('--wu-select-overlay-border-width', 'ขอบของรายการ', 'List border width'),
    tok('--wu-select-list-padding', 'ระยะรอบรายการ', 'List padding'),
    tok('--wu-select-option-padding-x', 'ระยะซ้ายขวาของแถว', 'Row horizontal padding'),
    tok('--wu-select-option-padding-y', 'ระยะบนล่างของแถว', 'Row vertical padding'),
    tok('--wu-select-option-radius', 'ความมนของแถว', 'Row radius'),
    tok('--wu-select-option-hover-bg', 'พื้นแถวที่ชี้ / ไฮไลต์', 'Hovered / highlighted row'),
    tok('--wu-select-option-selected-bg', 'พื้นแถวที่เลือกอยู่', 'Picked row background'),
    tok('--wu-select-option-selected-color', 'สีตัวอักษรแถวที่เลือกอยู่', 'Picked row text'),
    tok('--wu-select-group-color', 'สีหัวกลุ่ม', 'Group header colour'),
    tok('--wu-select-group-weight', 'น้ำหนักหัวกลุ่ม', 'Group header weight'),
  ],
};
