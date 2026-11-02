import { ComponentDoc, TokenRow } from '../core/component-doc';
import { SampleWords } from '../core/sample-text';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/** The permissions the PickList samples move around, in English (see core/sample-text.ts). */
const PERMISSION_WORDS: SampleWords = {
  'ดูข้อมูลนักเรียน': 'View student records',
  'แก้ไขข้อมูลนักเรียน': 'Edit student records',
  'บันทึกผลการเรียน': 'Enter grades',
  'อนุมัติผลการเรียน': 'Approve grades',
  'ดูรายงานการเงิน': 'View finance reports',
  'คืนเงินค่าธรรมเนียม': 'Refund fees',
  'จัดการผู้ใช้': 'Manage users',
  'ส่งออกรายงาน': 'Export reports',
  'งานทะเบียน': 'Registry',
  'งานวัดผล': 'Assessment',
  'งานการเงิน': 'Finance',
  'ผู้ดูแลระบบ': 'Admin',
};

const PERMISSIONS_TS = `interface Permission {
  id: number;
  code: string;
  name: string;
  module: string;
}

allPermissions: Permission[] = [
  { id: 2, code: 'student.edit', name: 'แก้ไขข้อมูลนักเรียน', module: 'งานทะเบียน' },
  { id: 3, code: 'grade.entry', name: 'บันทึกผลการเรียน', module: 'งานวัดผล' },
  // … ข้อมูลจาก API
];
userPermissions: Permission[] = [
  { id: 1, code: 'student.view', name: 'ดูข้อมูลนักเรียน', module: 'งานทะเบียน' },
];`;

/** Tokens wu-picklist and wu-orderlist share (one stylesheet). */
const LIST_TOKENS: TokenRow[] = [
  tok('--wu-picklist-gap', 'ระยะระหว่างรายการกับปุ่ม', 'Gap between the lists and the buttons'),
  tok('--wu-picklist-box-border-width', 'ขอบของกรอบแต่ละรายการ (v2 / v3)', 'Border of each list frame (v2 / v3)'),
  tok('--wu-picklist-box-radius', 'ความมนของกรอบ', 'Frame radius'),
  tok('--wu-picklist-box-bg', 'พื้นของกรอบ', 'Frame background'),
  tok('--wu-picklist-header-padding', 'ระยะในหัวรายการ', 'Header padding'),
  tok('--wu-picklist-header-border-width', 'ขอบของหัวรายการ', 'Header border width'),
  tok('--wu-picklist-header-radius', 'ความมนของหัวรายการ (v1)', 'Header radius (v1)'),
  tok('--wu-picklist-header-bg', 'พื้นของหัวรายการ', 'Header background'),
  tok('--wu-picklist-header-weight', 'น้ำหนักตัวอักษรหัวรายการ', 'Header font weight'),
  tok('--wu-picklist-filter-padding', 'ระยะรอบช่องค้นหา', 'Padding around the search box'),
  tok('--wu-picklist-filter-border-width', 'ขอบของแถบค้นหา', 'Search bar border width'),
  tok('--wu-picklist-filter-bg', 'พื้นของแถบค้นหา', 'Search bar background'),
  tok('--wu-picklist-list-padding', 'ระยะในรายการ', 'List padding'),
  tok('--wu-picklist-list-border-width', 'ขอบของรายการ', 'List border width'),
  tok('--wu-picklist-list-radius', 'ความมนของรายการ', 'List radius'),
  tok('--wu-picklist-list-height', 'ความสูงของรายการ (เมื่อไม่ได้ตั้ง style หรือ scrollHeight)', 'List height (when no style or scrollHeight is set)'),
  tok('--wu-picklist-list-min-height', 'ความสูงขั้นต่ำของรายการ', 'Minimum list height'),
  tok('--wu-picklist-list-max-height', 'ความสูงสูงสุดของรายการ', 'Maximum list height'),
  tok('--wu-picklist-item-gap', 'ระยะระหว่างรายการย่อย', 'Gap between items'),
  tok('--wu-picklist-item-padding', 'ระยะในแต่ละรายการย่อย', 'Item padding'),
  tok('--wu-picklist-item-radius', 'ความมนของรายการย่อย', 'Item radius'),
  tok('--wu-picklist-item-stripe-bg', 'พื้นแถวคู่เมื่อ stripedRows', 'Even rows with stripedRows'),
  tok('--wu-select-option-hover-bg', 'พื้นรายการที่ชี้ (ร่วมกับ Select)', 'Hovered item (shared with Select)'),
  tok('--wu-select-option-selected-bg', 'พื้นรายการที่เลือก', 'Selected item background'),
  tok('--wu-select-option-selected-color', 'สีตัวอักษรรายการที่เลือก', 'Selected item text'),
  tok('--wu-primary-color', 'เส้นบอกตำแหน่งวางและตัวเลขบนภาพที่ลาก', 'The drop line and the count on the drag image'),
];

const ARIA_LABELS_NOTE = {
  th: 'ชื่อปุ่มสำหรับ screen reader (ค่าเริ่มต้นมาจาก locale)',
  en: 'Button names for screen readers (defaults come from the locale)',
};

export const PICKLIST_DOC: ComponentDoc = {
  id: 'picklist',
  title: 'PickList',
  group: 'Data',
  entry: 'picklist',
  standalone: 'WuPickList',
  module: 'WuPickListModule',
  selector: 'wu-picklist',
  description: {
    th: 'สองรายการที่ย้ายของไปมาได้ เลือกแล้วกดปุ่มตรงกลาง ดับเบิลคลิก หรือลากวาง แต่ละฝั่งค้นหาและจัดลำดับเองได้ ใช้กับสิทธิ์ของผู้ใช้หรือการเรียงลำดับผู้อนุมัติ',
    en: 'Two lists to move items between: select and use the buttons in the middle, double-click, or drag. Each side can be searched and put in order. Made for user permissions and approval chains.',
  },
  english: {
    ...PERMISSION_WORDS,
    'สิทธิ์ทั้งหมด': 'All permissions',
    'สิทธิ์ของผู้ใช้': 'User permissions',
    'สิทธิ์ที่ให้แล้ว': 'Granted',
    'ค้นหาสิทธิ์': 'Search permissions',
    'ยังไม่ได้ให้สิทธิ์ใด ๆ': 'No permissions granted yet',
    'ไม่พบสิทธิ์ที่ค้นหา': 'No permission matches',
    'ให้ทุกสิทธิ์': 'Grant all',
    'ถอนทุกสิทธิ์': 'Revoke all',
    'ข้อมูลจาก API': 'data from the API',
    'ตำแหน่ง': 'Positions',
    'ลำดับการส่งต่อ (เรียงจากบนลงล่าง)': 'Forwarding order (top to bottom)',
    'ครูที่ปรึกษาชุมนุม': 'Club adviser',
    'หัวหน้ากลุ่มสาระ': 'Head of department',
    'หัวหน้างานกิจกรรม': 'Head of activities',
    'รองผู้อำนวยการฝ่ายวิชาการ': 'Deputy director (academic)',
    'ผู้อำนวยการ': 'Director',
    'เจ้าหน้าที่การเงิน': 'Finance officer',
    'นางสาวกานดา ศรีสุข': 'Ms Kanda Srisuk',
    'นายวิชัย ทองคำ': 'Mr Wichai Thongkham',
    'นางพรทิพย์ บุญมา': 'Mrs Porntip Boonma',
    'นายสมชาย ใจดี': 'Mr Somchai Jaidee',
    'นางสุนีย์ แสงจันทร์': 'Mrs Sunee Saengchan',
    '(ยังไม่กำหนดผู้รับผิดชอบ)': '(no one assigned yet)',
    'เรียงจากบนลงล่าง': 'top to bottom',
    'บันทึกแล้ว': 'Saved',
    'ล่าสุด': 'Last event',
    'รายการที่ย้าย': 'the items that moved',
    'ที่เลือกทั้งหมดของฝั่งนั้น': "that side's whole selection",
    'รายการที่ค้นหาเหลือ': 'the items the search leaves',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuPickListModule</code> ซึ่งรวม <code>wuTemplate</code> ไว้แล้ว) และ standalone (<code>WuPickList</code>) selector <code>wu-pickList</code> ก็ใช้ได้',
        en: 'Works as an NgModule (<code>WuPickListModule</code>, which brings <code>wuTemplate</code>) or standalone (<code>WuPickList</code>). The <code>wu-pickList</code> selector works too.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[source]</code> และ <code>[target]</code> คือ array ของสองฝั่ง ตัว array ถูกเปลี่ยนในที่เดิม (in place) แบบที่แอปใช้อยู่ จึงอ่าน <code>userPermissions</code> ได้ทันทีหลังย้าย (เขียน <code>[(source)]</code> / <code>[(target)]</code> ก็ได้) template <code>item</code> วาดแต่ละรายการ คลิกเพื่อเลือก (v1: คลิกเลือกทีละตัว Ctrl / ⌘ + คลิกเพื่อเพิ่ม · v2 / v3: คลิกสลับเลือกทีละตัว · จอสัมผัสสลับเสมอ) แล้วกดปุ่มตรงกลาง หรือดับเบิลคลิกเพื่อส่งไปอีกฝั่ง <code>[sourceStyle]</code> / <code>[targetStyle]</code> กำหนดความสูงของแต่ละฝั่ง',
        en: '<code>[source]</code> and <code>[target]</code> are the arrays of the two sides. They are changed in place, as apps expect, so <code>userPermissions</code> is up to date right after a move (<code>[(source)]</code> / <code>[(target)]</code> work too). The <code>item</code> template draws each item. Click to select (v1: a click picks one item and Ctrl / ⌘ + click adds · v2 / v3: each click toggles an item · touch always toggles), then use the buttons in the middle, or double-click an item to send it across. <code>[sourceStyle]</code> / <code>[targetStyle]</code> set the height of each list.',
      },
    },
    dragdrop: {
      title: { th: 'ลากวางและจัดลำดับ', en: 'Drag and drop, and ordering' },
      text: {
        th: '<code>[dragdrop]="true"</code> ลากรายการข้ามฝั่งหรือเรียงใหม่ในฝั่งเดียวกันได้ เมาส์เริ่มลากเมื่อขยับไปไม่กี่พิกเซล นิ้วต้องกดค้างประมาณ 300ms (ปัดเร็ว ๆ ยังเลื่อนรายการได้ตามปกติ) มีเส้นบอกตำแหน่งที่จะวาง ลากรายการที่เลือกอยู่จะลากทั้งชุดพร้อมตัวเลขจำนวน <code>Esc</code> ยกเลิก และรายการเลื่อนเองเมื่อลากไปใกล้ขอบ ปุ่มข้างแต่ละฝั่งเลื่อนรายการที่เลือกขึ้น ลง บนสุด หรือล่างสุด ตัวอย่างนี้เรียงลำดับการส่งต่อเอกสาร แล้วบันทึกด้วยปุ่มที่มี <code>[loading]="isApiSaving"</code>',
        en: '<code>[dragdrop]="true"</code> lets items be dragged across or reordered within a list. A mouse starts dragging after a few pixels; a finger presses and holds for about 300ms (a quick swipe still scrolls). A line shows where the items will land, dragging a selected item drags the whole selection with a count badge, <code>Esc</code> cancels, and the lists scroll when the pointer nears their edge. The buttons beside each list move the selection up, down, to the top or to the bottom. This example orders who a document goes to, then saves with a button that has <code>[loading]="isApiSaving"</code>.',
      },
    },
    filter: {
      title: { th: 'ค้นหา', en: 'Search' },
      text: {
        th: '<code>filterBy</code> คือ field ที่ค้น คั่นด้วยจุลภาค ใส่แล้วช่องค้นหาแสดงทั้งสองฝั่ง (ซ่อนทีละฝั่งด้วย <code>[showSourceFilter]="false"</code> / <code>[showTargetFilter]="false"</code>) ปุ่มย้ายทั้งหมดย้ายเฉพาะรายการที่ค้นหาเหลืออยู่ ปุ่มจัดลำดับรอจนล้างคำค้น และเมื่อค้นไม่เจอแสดง “ไม่พบข้อมูลที่ค้นหา” ตามภาษาของผู้อ่าน ลองพิมพ์ “นักเรียน”',
        en: '<code>filterBy</code> names the fields to search, comma separated; with it a search box shows on both sides (hide one with <code>[showSourceFilter]="false"</code> / <code>[showTargetFilter]="false"</code>). The move-all buttons move only the items the search leaves, the order buttons wait until the search is cleared, and a search with no match shows “No results found” in the reader\'s language. Try typing “student”.',
      },
    },
    templates: {
      title: { th: 'template ของหัวรายการและรายการว่าง', en: 'Header and empty templates' },
      text: {
        th: 'template <code>sourceHeader</code> / <code>targetHeader</code> แทนหัวรายการ ได้ array ของฝั่งนั้นเป็น <code>let-list</code> · <code>item</code> ได้ <code>selected</code> และ <code>index</code> ด้วย · <code>emptymessagesource</code> / <code>emptymessagetarget</code> แสดงเมื่อฝั่งนั้นว่าง (ถ้าไม่ใส่จะไม่แสดงอะไร) · <code>emptyfiltermessagesource</code> / <code>emptyfiltermessagetarget</code> แสดงเมื่อค้นไม่เจอ',
        en: 'The <code>sourceHeader</code> / <code>targetHeader</code> templates replace the list titles and get that side\'s array as <code>let-list</code> · <code>item</code> also gets <code>selected</code> and <code>index</code> · <code>emptymessagesource</code> / <code>emptymessagetarget</code> show when a side is empty (without them nothing shows) · <code>emptyfiltermessagesource</code> / <code>emptyfiltermessagetarget</code> show when a search finds nothing.',
      },
    },
    events: {
      title: { th: 'Event และเมธอด', en: 'Events and methods' },
      text: {
        th: 'event การย้าย (<code>onMoveToTarget</code>, <code>onMoveAllToTarget</code>, <code>onMoveToSource</code>, <code>onMoveAllToSource</code>) และการจัดลำดับ (<code>onSourceReorder</code>, <code>onTargetReorder</code>) ส่ง <code>items</code> ที่ย้ายมาให้ ตั้งชื่อด้วย <code>#pl="wuPickList"</code> แล้วเรียก <code>pl.moveAllRight()</code>, <code>pl.moveAllLeft()</code> หรือ <code>pl.resetFilter()</code> จากปุ่มของหน้าเองได้',
        en: 'The move events (<code>onMoveToTarget</code>, <code>onMoveAllToTarget</code>, <code>onMoveToSource</code>, <code>onMoveAllToSource</code>) and the order events (<code>onSourceReorder</code>, <code>onTargetReorder</code>) bring the <code>items</code> that moved. Name it with <code>#pl="wuPickList"</code> to call <code>pl.moveAllRight()</code>, <code>pl.moveAllLeft()</code> or <code>pl.resetFilter()</code> from your own buttons.',
      },
    },
    look: {
      title: { th: 'ความสูง แถบสี และจอแคบ', en: 'Height, stripes and narrow screens' },
      text: {
        th: '<code>scrollHeight</code> ตั้งความสูงทั้งสองฝั่งในครั้งเดียว · <code>[stripedRows]="true"</code> แถวสลับสี · <code>[showSourceControls]="false"</code> / <code>[showTargetControls]="false"</code> ซ่อนปุ่มจัดลำดับ · ไม่มี template <code>item</code> จะแสดง <code>optionLabel</code> (ค่าเริ่มต้น <code>label</code> แล้วจึง <code>name</code>) · ที่ความกว้าง <code>breakpoint</code> (960px) ลงไป สองฝั่งเรียงบนลงล่างและลูกศรย้ายชี้ลง / ขึ้น ลองย่อหน้าจอดู',
        en: '<code>scrollHeight</code> sets the height of both lists at once · <code>[stripedRows]="true"</code> stripes the rows · <code>[showSourceControls]="false"</code> / <code>[showTargetControls]="false"</code> hide the order buttons · without an <code>item</code> template it shows <code>optionLabel</code> (default <code>label</code>, then <code>name</code>) · at <code>breakpoint</code> (960px) and below the lists stack and the transfer arrows point down / up: try a narrow window.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'แต่ละฝั่งเป็นจุด Tab หนึ่งจุด (<code>role="listbox"</code> แบบ <code>aria-multiselectable</code>) · <code>↑</code> <code>↓</code> <code>Home</code> <code>End</code> เลื่อน · <code>Shift</code> + <code>↑</code> / <code>↓</code> เลือกไปด้วย · <code>Space</code> / <code>Enter</code> สลับเลือก · <code>Ctrl</code> / <code>⌘</code> + <code>A</code> เลือกทุกรายการที่มองเห็น · ปุ่มทุกปุ่มมีชื่อตามภาษาของผู้อ่านสำหรับ screen reader (เปลี่ยนได้ด้วย <code>rightButtonAriaLabel</code> และตัวอื่น ๆ)',
        en: 'Each list is one Tab stop (an <code>aria-multiselectable</code> <code>role="listbox"</code>) · <code>↑</code> <code>↓</code> <code>Home</code> <code>End</code> move · <code>Shift</code> + <code>↑</code> / <code>↓</code> also selects · <code>Space</code> / <code>Enter</code> toggles · <code>Ctrl</code> / <code>⌘</code> + <code>A</code> selects every visible item · every button has a name in the reader\'s language for screen readers (change it with <code>rightButtonAriaLabel</code> and the rest).',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-pickList&gt;</code> เป็น <code>&lt;wu-picklist&gt;</code> (หรือ <code>&lt;wu-pickList&gt;</code>) input และ event ชื่อเดิม <code>pTemplate="item"</code> ใช้ได้ และ class <code>p-picklist-*</code> อยู่คู่กับ <code>wu-picklist-*</code> ส่วน <code>responsive</code>, <code>filterLocale</code> และ <code>autoOptionFocus</code> รับไว้แต่ไม่มีผล (สองฝั่งเรียงบนลงล่างบนจอแคบเสมอ)',
        en: 'Change <code>&lt;p-pickList&gt;</code> to <code>&lt;wu-picklist&gt;</code> (or <code>&lt;wu-pickList&gt;</code>). Inputs and events keep their names, <code>pTemplate="item"</code> works, and the <code>p-picklist-*</code> classes sit next to <code>wu-picklist-*</code>. <code>responsive</code>, <code>filterLocale</code> and <code>autoOptionFocus</code> are accepted and ignored (the lists always stack on narrow screens).',
      },
    },
  },
  code: {
    basic: `<wu-picklist [source]="allPermissions" [target]="userPermissions" sourceHeader="สิทธิ์ทั้งหมด"
  targetHeader="สิทธิ์ของผู้ใช้" [sourceStyle]="{ height: '20rem' }" [targetStyle]="{ height: '20rem' }">
  <ng-template #item let-p>
    <div class="font-semibold">{{ p.name }}</div>
    <small class="text-color-secondary">{{ p.module }}</small>
  </ng-template>
</wu-picklist>`,
    dragdrop: `<wu-picklist [source]="ranks" [target]="flow" sourceHeader="ตำแหน่ง" targetHeader="ลำดับการส่งต่อ (เรียงจากบนลงล่าง)"
  [dragdrop]="true" [showSourceControls]="false" [sourceStyle]="{ height: '20rem' }" [targetStyle]="{ height: '20rem' }">
  <ng-template #item let-r>
    <div class="font-semibold">{{ r.rank }}</div>
    <small class="text-color-secondary">{{ r.person || '(ยังไม่กำหนดผู้รับผิดชอบ)' }}</small>
  </ng-template>
</wu-picklist>
<wu-button label="บันทึก" icon="wi wi-save" [loading]="isApiSaving" (onClick)="saveFlow()"></wu-button>`,
    filter: `<wu-picklist [source]="allPermissions" [target]="userPermissions" sourceHeader="สิทธิ์ทั้งหมด"
  targetHeader="สิทธิ์ของผู้ใช้" filterBy="name,module" sourceFilterPlaceholder="ค้นหาสิทธิ์"
  targetFilterPlaceholder="ค้นหาสิทธิ์" [sourceStyle]="{ height: '16rem' }" [targetStyle]="{ height: '16rem' }">
  <ng-template #item let-p>
    {{ p.name }} <small class="text-color-secondary">· {{ p.module }}</small>
  </ng-template>
</wu-picklist>`,
    templates: `<wu-picklist [source]="allPermissions" [target]="userPermissions" filterBy="name"
  [sourceStyle]="{ height: '16rem' }" [targetStyle]="{ height: '16rem' }">
  <ng-template #sourceHeader let-list>สิทธิ์ทั้งหมด ({{ list.length }})</ng-template>
  <ng-template #targetHeader let-list>สิทธิ์ที่ให้แล้ว ({{ list.length }})</ng-template>
  <ng-template #item let-p let-selected="selected">
    <i [class]="selected ? 'wi wi-check-circle' : 'wi wi-circle'"></i> {{ p.name }}
  </ng-template>
  <ng-template #emptymessagetarget>ยังไม่ได้ให้สิทธิ์ใด ๆ</ng-template>
  <ng-template #emptyfiltermessagesource>ไม่พบสิทธิ์ที่ค้นหา</ng-template>
</wu-picklist>`,
    events: `<wu-picklist #pl="wuPickList" [source]="allPermissions" [target]="userPermissions" sourceHeader="สิทธิ์ทั้งหมด"
  targetHeader="สิทธิ์ของผู้ใช้" [sourceStyle]="{ height: '14rem' }" [targetStyle]="{ height: '14rem' }"
  (onMoveToTarget)="logMove('onMoveToTarget', $event)" (onMoveAllToTarget)="logMove('onMoveAllToTarget', $event)"
  (onMoveToSource)="logMove('onMoveToSource', $event)" (onMoveAllToSource)="logMove('onMoveAllToSource', $event)"
  (onTargetReorder)="logMove('onTargetReorder', $event)">
  <ng-template #item let-p>{{ p.name }}</ng-template>
</wu-picklist>
<wu-button label="ให้ทุกสิทธิ์" icon="wi wi-check" (onClick)="pl.moveAllRight()"></wu-button>
<wu-button label="ถอนทุกสิทธิ์" icon="wi wi-times" severity="secondary" [outlined]="true" (onClick)="pl.moveAllLeft()"></wu-button>`,
    look: `<wu-picklist [source]="allPermissions" [target]="userPermissions" sourceHeader="สิทธิ์ทั้งหมด"
  targetHeader="สิทธิ์ของผู้ใช้" optionLabel="name" scrollHeight="12rem" [stripedRows]="true"
  [showSourceControls]="false" [showTargetControls]="false"></wu-picklist>`,
  },
  ts: {
    basic: PERMISSIONS_TS,
    dragdrop: `interface FlowRank {
  id: number;
  rank: string;
  person: string;
}

ranks: FlowRank[] = [];   // ข้อมูลจาก API
flow: FlowRank[] = [];    // เรียงจากบนลงล่าง
isApiSaving = false;

saveFlow(): void {
  this.isApiSaving = true;
  const rankIds = this.flow.map((r) => r.id);
  this.documentFlowService.save(rankIds).subscribe(() => {
    this.isApiSaving = false;
  });
}`,
    events: `import { WuPickListMoveEvent } from 'wiraui/picklist';

lastEvent = '';

logMove(name: string, event: WuPickListMoveEvent): void {
  const codes = (event.items as Permission[]).map((p) => p.code);
  this.lastEvent = name + ': ' + codes.join(', ');
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: { th: 'Inputs · รายการและค้นหา', en: 'Inputs · lists and search' },
      rows: [
        row('source · target', 'any[]', '[]', 'array ของสองฝั่ง เปลี่ยนในที่เดิม และส่งออกเป็น sourceChange / targetChange ด้วย', 'The two sides; changed in place and also emitted as sourceChange / targetChange'),
        row('sourceHeader · targetHeader', 'string', undefined, 'หัวของแต่ละฝั่ง', 'Each side\'s title'),
        row('optionLabel', 'string', "'label', 'name'", 'field ที่แสดงเมื่อไม่มี template item (dot path ได้)', 'Field shown without an item template (dot paths work)'),
        row('dataKey', 'string', undefined, 'field ที่ระบุรายการ ให้รายการที่เลือกอยู่รอดเมื่อแอปเปลี่ยน object', 'Field that identifies an item, so selections survive new objects'),
        row('trackBy · sourceTrackBy · targetTrackBy', 'TrackByFunction', undefined, 'trackBy ของรายการ', 'Item trackBy'),
        row('filterBy', 'string', undefined, 'field ที่ค้น คั่นด้วยจุลภาค ใส่แล้วช่องค้นหาแสดง', 'Fields to search, comma separated; the search boxes show when set'),
        row('filterMatchMode', "'contains' | 'startsWith' | 'endsWith' | 'equals'", "'contains'", 'วิธีเทียบคำค้น', 'How the search matches'),
        row('showSourceFilter · showTargetFilter', BOOL, 'true', 'แสดงช่องค้นหาของแต่ละฝั่ง (เมื่อมี filterBy)', 'Show each side\'s search box (with filterBy)'),
        row('sourceFilterPlaceholder · targetFilterPlaceholder', 'string', undefined, 'ข้อความในช่องค้นหา', 'Search box placeholder'),
        row('ariaSourceFilterLabel · ariaTargetFilterLabel', 'string', 'placeholder', 'ชื่อของช่องค้นหาสำหรับ screen reader', 'Search box name for screen readers'),
      ],
    },
    {
      id: 'api-behaviour',
      title: { th: 'Inputs · การเลือกและการย้าย', en: 'Inputs · selecting and moving' },
      rows: [
        row('dragdrop', BOOL, 'false', 'ลากรายการข้ามฝั่งและเรียงใหม่ในฝั่งเดียวกัน', 'Drag items across and within the lists'),
        row('metaKeySelection', BOOL, 'v1 true · v2 / v3 false', 'true: คลิกเลือกทีละตัว Ctrl / ⌘ + คลิกเพิ่ม · false: คลิกสลับเลือก (จอสัมผัสสลับเสมอ)', 'true: a click picks one, Ctrl / ⌘ + click adds · false: a click toggles (touch always toggles)'),
        row('showSourceControls · showTargetControls', BOOL, 'true', 'ปุ่มจัดลำดับข้างแต่ละฝั่ง', 'The order buttons beside each list'),
        row('keepSelection', BOOL, 'false', 'รายการยังถูกเลือกอยู่หลังย้ายไปอีกฝั่ง', 'Items stay selected after moving across'),
        row('disabled', BOOL, 'false', 'ปิดทั้งหมด', 'Disable everything'),
      ],
    },
    {
      id: 'api-look',
      title: { th: 'Inputs · หน้าตา', en: 'Inputs · look' },
      rows: [
        row('scrollHeight', 'string', undefined, 'ความสูงของทั้งสองรายการ', 'Height of both lists'),
        row('sourceStyle · targetStyle', 'object', undefined, 'style ของแต่ละรายการ เช่น { height: \'20rem\' }', 'Each list\'s style, e.g. { height: \'20rem\' }'),
        row('stripedRows', BOOL, 'false', 'แถวสลับสี', 'Striped rows'),
        row('breakpoint', 'string', "'960px'", 'ความกว้างที่สองฝั่งเริ่มเรียงบนลงล่าง (ลูกศรชี้ลง / ขึ้น)', 'Width at which the lists stack (arrows point down / up)'),
        row('style · styleClass', 'object · string', undefined, 'style / class ของกล่องนอก', 'Outer box style / class'),
        row('id · tabindex', 'string · number', 'undefined · 0', 'id (ใช้นำหน้า id ของรายการ) และ tabindex ของรายการ', 'Id (prefixes the list ids) and the lists\' tabindex'),
        row('rightButtonAriaLabel · allRightButtonAriaLabel · leftButtonAriaLabel · allLeftButtonAriaLabel · upButtonAriaLabel · topButtonAriaLabel · downButtonAriaLabel · bottomButtonAriaLabel', 'string', 'locale', ARIA_LABELS_NOTE.th, ARIA_LABELS_NOTE.en),
        row('responsive · filterLocale · autoOptionFocus', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onMoveToTarget · onMoveAllToTarget', 'WuPickListMoveEvent', undefined, 'ย้ายไปปลายทาง (items คือรายการที่ย้าย)', 'Moved to the target (items are the ones that moved)'),
        row('onMoveToSource · onMoveAllToSource', 'WuPickListMoveEvent', undefined, 'ย้ายกลับต้นทาง', 'Moved back to the source'),
        row('onSourceReorder · onTargetReorder', 'WuPickListMoveEvent', undefined, 'จัดลำดับใหม่ด้วยปุ่มหรือการลาก', 'Reordered by the buttons or a drag'),
        row('onSourceSelect · onTargetSelect', 'WuPickListSelectEvent', undefined, 'การเลือกเปลี่ยน (items คือที่เลือกทั้งหมด)', 'Selection changed (items is the whole selection)'),
        row('onSourceFilter · onTargetFilter', 'WuPickListFilterEvent', undefined, 'พิมพ์ค้นหา', 'Search typed'),
        row('onFocus · onBlur', 'Event', undefined, 'รายการได้ / เสียโฟกัส', 'A list gains / loses focus'),
        row('sourceChange · targetChange', 'any[]', undefined, 'คู่ของ [(source)] / [(target)]', 'For [(source)] / [(target)]'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wuTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wuTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (item) · index · selected', undefined, 'แต่ละรายการ', 'Each item'),
        row('sourceHeader · targetHeader', '$implicit (list)', undefined, 'หัวของแต่ละฝั่ง', 'Each side\'s title'),
        row('sourceFilter · targetFilter', 'options (filter(text) · reset())', undefined, 'ช่องค้นหาของแอปเอง', 'Your own search box'),
        row('emptymessagesource · emptymessagetarget', '—', undefined, 'เมื่อฝั่งนั้นว่าง', 'When that side is empty'),
        row('emptyfiltermessagesource · emptyfiltermessagetarget', '—', undefined, 'เมื่อค้นไม่เจอ', 'When a search finds nothing'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน template reference เช่น #pl="wuPickList"', en: 'Call them through a template reference such as #pl="wuPickList".' },
      rows: [
        row('moveRight() · moveAllRight()', 'void', undefined, 'ย้ายที่เลือก / ทุกรายการที่ค้นหาเหลือไปปลายทาง', 'Move the selection / every item the search leaves to the target'),
        row('moveLeft() · moveAllLeft()', 'void', undefined, 'ย้ายกลับต้นทาง', 'Move back to the source'),
        row('resetFilter() · resetSourceFilter() · resetTargetFilter()', 'void', undefined, 'ล้างคำค้นทั้งสองฝั่ง / ฝั่งเดียว', 'Clear both searches / one'),
        row('selectedItemsSource · selectedItemsTarget', 'any[]', undefined, 'รายการที่เลือกอยู่ของแต่ละฝั่ง (อ่านและตั้งได้)', 'Each side\'s selection (read and write)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WuPickListFilterEvent, WuPickListMoveEvent, WuPickListSelectEvent } from 'wiraui/picklist';

interface WuPickListMoveEvent {
  originalEvent?: Event;
  items: unknown[];        // รายการที่ย้าย
}
interface WuPickListSelectEvent {
  originalEvent?: Event;
  items: unknown[];        // ที่เลือกทั้งหมดของฝั่งนั้น
}
interface WuPickListFilterEvent {
  query: string;
  value: unknown[];        // รายการที่ค้นหาเหลือ
}`,
    },
  ],
  tokens: LIST_TOKENS,
};

/** The electives the OrderList samples put in order. */
const ELECTIVE_TS = `interface Elective {
  id: number;
  name: string;
  teacher: string;
}

electives: Elective[] = [
  { id: 1, name: 'หุ่นยนต์เบื้องต้น', teacher: 'ครูวิชัย' },
  { id: 2, name: 'ภาษาจีนเพื่อการสื่อสาร', teacher: 'ครูหลิน' },
  { id: 3, name: 'ดนตรีไทย', teacher: 'ครูสมศักดิ์' },
  // … ข้อมูลจาก API
];
order = '';

trackById(index: number, elective: Elective): number {
  return elective.id;
}

reordered(): void {
  this.order = this.electives.map((e) => e.id).join(', ');
}`;

export const ORDERLIST_DOC: ComponentDoc = {
  id: 'orderlist',
  title: 'OrderList',
  group: 'Data',
  entry: 'orderlist',
  standalone: 'WuOrderList',
  module: 'WuOrderListModule',
  selector: 'wu-orderlist',
  description: {
    th: 'รายการเดียวที่ผู้ใช้จัดลำดับเอง ด้วยปุ่มขึ้น ลง บนสุด ล่างสุด คีย์บอร์ด หรือลากวาง เช่น ลำดับวิชาเลือกที่ต้องการ ใช้หน้าตาและ token ชุดเดียวกับ PickList',
    en: 'One list people put in order with up, down, top and bottom buttons, the keyboard or a drag, such as electives by preference. It shares its look and tokens with PickList.',
  },
  english: {
    'หุ่นยนต์เบื้องต้น': 'Intro to robotics',
    'ภาษาจีนเพื่อการสื่อสาร': 'Chinese for communication',
    'ดนตรีไทย': 'Thai music',
    'การเขียนโปรแกรมเว็บ': 'Web programming',
    'ศิลปะการทำอาหาร': 'Cooking',
    'บาสเกตบอล': 'Basketball',
    'ครูวิชัย': 'Mr Wichai',
    'ครูหลิน': 'Ms Lin',
    'ครูสมศักดิ์': 'Mr Somsak',
    'ครูกานดา': 'Ms Kanda',
    'ครูพรทิพย์': 'Mrs Porntip',
    'ครูธนา': 'Mr Thana',
    'ลำดับวิชาเลือกที่ต้องการ': 'Electives by preference',
    'ค้นหาวิชา': 'Search electives',
    'ไม่พบวิชาที่ค้นหา': 'No elective matches',
    'ยังไม่มีวิชาเลือก': 'No electives yet',
    'วิชาเลือก': 'Electives',
    'ข้อมูลจาก API': 'data from the API',
    'ที่เลือก': 'Selected',
    'ลำดับ': 'Order',
    'ที่เลือกทั้งหมด': 'the whole selection',
    'รายการที่ค้นหาเหลือ': 'the items the search leaves',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuOrderListModule</code> ซึ่งรวม <code>wuTemplate</code> ไว้แล้ว) และ standalone (<code>WuOrderList</code>) selector <code>wu-orderList</code> ก็ใช้ได้',
        en: 'Works as an NgModule (<code>WuOrderListModule</code>, which brings <code>wuTemplate</code>) or standalone (<code>WuOrderList</code>). The <code>wu-orderList</code> selector works too.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[value]</code> คือ array ที่ถูกจัดลำดับในที่เดิม (ส่งออกเป็น <code>valueChange</code> ด้วย) เลือกรายการแล้วกดปุ่มขึ้น ลง บนสุด หรือล่างสุด <code>(onReorder)</code> ส่งรายการที่ย้ายมาให้ ตัวอย่างนี้ใช้ <code>dataKey</code>, <code>[listStyle]</code> และ <code>[trackBy]</code> แบบที่แอปใช้ และ template <code>item</code> ได้ <code>index</code> ไปแสดงลำดับ',
        en: '<code>[value]</code> is the array, reordered in place (and emitted as <code>valueChange</code>). Select items and use the up, down, top or bottom buttons; <code>(onReorder)</code> brings the items that moved. This example uses <code>dataKey</code>, <code>[listStyle]</code> and <code>[trackBy]</code> as the apps do, and the <code>item</code> template gets <code>index</code> to show the rank.',
      },
    },
    dragdrop: {
      title: { th: 'ลากวางและรายการที่เลือก', en: 'Drag and drop, and the selection' },
      text: {
        th: '<code>[dragdrop]="true"</code> ลากเรียงได้ (เมาส์ขยับไม่กี่พิกเซล นิ้วกดค้างประมาณ 300ms ลากรายการที่เลือกอยู่จะลากทั้งชุด <code>Esc</code> ยกเลิก) · <code>[(selection)]</code> ผูกรายการที่เลือก และ <code>(onSelectionChange)</code> ส่ง <code>{ originalEvent, value }</code> · <code>controlsPosition="right"</code> ย้ายปุ่มไปทางขวา',
        en: '<code>[dragdrop]="true"</code> lets items be dragged into order (a mouse after a few pixels, a finger after a press of about 300ms; dragging a selected item drags the whole selection; <code>Esc</code> cancels) · <code>[(selection)]</code> binds the selection and <code>(onSelectionChange)</code> brings <code>{ originalEvent, value }</code> · <code>controlsPosition="right"</code> puts the buttons on the right.',
      },
    },
    filter: {
      title: { th: 'ค้นหาและรายการว่าง', en: 'Search and empty lists' },
      text: {
        th: '<code>filterBy</code> เปิดช่องค้นหา (<code>filterPlaceholder</code> เป็นข้อความในช่อง) ระหว่างค้นหาปุ่มจัดลำดับและการลากรอไว้ เพราะลำดับเป็นของทั้งรายการ · template <code>emptyfilter</code> แสดงเมื่อค้นไม่เจอ (ไม่ใส่จะแสดง “ไม่พบข้อมูลที่ค้นหา”) และ <code>empty</code> เมื่อไม่มีรายการ · <code>header</code> แทนหัวรายการ · <code>(onFilterEvent)</code> ส่งรายการที่ค้นหาเหลือ',
        en: '<code>filterBy</code> turns on the search box (<code>filterPlaceholder</code> is its placeholder). While searching, the order buttons and dragging wait, because the order belongs to the whole list · the <code>emptyfilter</code> template shows when nothing matches (without it: “No results found”) and <code>empty</code> when there are no items · <code>header</code> replaces the title · <code>(onFilterEvent)</code> brings the items the search leaves.',
      },
    },
    look: {
      title: { th: 'แถบสีและจอแคบ', en: 'Stripes and narrow screens' },
      text: {
        th: '<code>[stripedRows]="true"</code> แถวสลับสี · <code>scrollHeight</code> ความสูงของรายการ · ไม่มี template <code>item</code> จะแสดง <code>optionLabel</code> (ค่าเริ่มต้น <code>label</code> แล้วจึง <code>name</code>) · ที่ความกว้าง <code>breakpoint</code> (960px) ลงไป ปุ่มย้ายขึ้นไปอยู่เหนือรายการ',
        en: '<code>[stripedRows]="true"</code> stripes the rows · <code>scrollHeight</code> sets the list height · without an <code>item</code> template it shows <code>optionLabel</code> (default <code>label</code>, then <code>name</code>) · at <code>breakpoint</code> (960px) and below the buttons move above the list.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'รายการเป็นจุด Tab หนึ่งจุด (<code>role="listbox"</code> แบบ <code>aria-multiselectable</code>) · <code>↑</code> <code>↓</code> <code>Home</code> <code>End</code> เลื่อน · <code>Shift</code> + <code>↑</code> / <code>↓</code> เลือกไปด้วย · <code>Space</code> / <code>Enter</code> สลับเลือก · <code>Ctrl</code> / <code>⌘</code> + <code>A</code> เลือกทั้งหมด · <code>Alt</code> + <code>↑</code> / <code>↓</code> ย้ายรายการที่เลือกขึ้น / ลง · ตั้งชื่อรายการด้วย <code>header</code>, <code>ariaLabel</code> หรือ <code>ariaLabelledBy</code>',
        en: 'The list is one Tab stop (an <code>aria-multiselectable</code> <code>role="listbox"</code>) · <code>↑</code> <code>↓</code> <code>Home</code> <code>End</code> move · <code>Shift</code> + <code>↑</code> / <code>↓</code> also selects · <code>Space</code> / <code>Enter</code> toggles · <code>Ctrl</code> / <code>⌘</code> + <code>A</code> selects all · <code>Alt</code> + <code>↑</code> / <code>↓</code> moves the selected items up / down · name the list with <code>header</code>, <code>ariaLabel</code> or <code>ariaLabelledBy</code>.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-orderList&gt;</code> เป็น <code>&lt;wu-orderlist&gt;</code> (หรือ <code>&lt;wu-orderList&gt;</code>) input และ event ชื่อเดิม (<code>dataKey</code>, <code>listStyle</code>, <code>onReorder</code>, <code>trackBy</code>, <code>filterBy</code>) <code>pTemplate="item"</code> ใช้ได้ และ class <code>p-orderlist-*</code> อยู่คู่กับ <code>wu-orderlist-*</code> ส่วน <code>responsive</code>, <code>filterLocale</code> และ <code>autoOptionFocus</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-orderList&gt;</code> to <code>&lt;wu-orderlist&gt;</code> (or <code>&lt;wu-orderList&gt;</code>). Inputs and events keep their names (<code>dataKey</code>, <code>listStyle</code>, <code>onReorder</code>, <code>trackBy</code>, <code>filterBy</code>), <code>pTemplate="item"</code> works, and the <code>p-orderlist-*</code> classes sit next to <code>wu-orderlist-*</code>. <code>responsive</code>, <code>filterLocale</code> and <code>autoOptionFocus</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wu-orderlist [value]="electives" header="ลำดับวิชาเลือกที่ต้องการ" dataKey="id"
  [listStyle]="{ height: '18rem' }" [trackBy]="trackById" (onReorder)="reordered()">
  <ng-template #item let-e let-i="index">
    <div class="font-semibold">{{ i + 1 }}. {{ e.name }}</div>
    <small class="text-color-secondary">{{ e.teacher }}</small>
  </ng-template>
</wu-orderlist>`,
    dragdrop: `<wu-orderlist [value]="electives" header="ลำดับวิชาเลือกที่ต้องการ" dataKey="id" [dragdrop]="true"
  [(selection)]="selectedElectives" controlsPosition="right" [listStyle]="{ height: '18rem' }">
  <ng-template #item let-e>{{ e.name }}</ng-template>
</wu-orderlist>`,
    filter: `<wu-orderlist [value]="electives" dataKey="id" filterBy="name,teacher" filterPlaceholder="ค้นหาวิชา"
  [listStyle]="{ height: '14rem' }">
  <ng-template #header>วิชาเลือก ({{ electives.length }})</ng-template>
  <ng-template #item let-e>{{ e.name }} <small class="text-color-secondary">· {{ e.teacher }}</small></ng-template>
  <ng-template #emptyfilter>ไม่พบวิชาที่ค้นหา</ng-template>
  <ng-template #empty>ยังไม่มีวิชาเลือก</ng-template>
</wu-orderlist>`,
    look: `<wu-orderlist [value]="electives" header="ลำดับวิชาเลือกที่ต้องการ" dataKey="id" optionLabel="name"
  scrollHeight="14rem" [stripedRows]="true"></wu-orderlist>`,
  },
  ts: {
    basic: ELECTIVE_TS,
    dragdrop: `selectedElectives: Elective[] = [];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'any[]', '[]', 'array ที่ถูกจัดลำดับในที่เดิม (ส่งออกเป็น valueChange ด้วย)', 'The array, reordered in place (also emitted as valueChange)'),
        row('selection', 'any[]', '[]', 'รายการที่เลือก ใช้ [(selection)] ได้', 'The selected items; [(selection)] works'),
        row('header', 'string', undefined, 'หัวรายการ', 'List title'),
        row('optionLabel', 'string', "'label', 'name'", 'field ที่แสดงเมื่อไม่มี template item', 'Field shown without an item template'),
        row('dataKey · trackBy', 'string · TrackByFunction', undefined, 'field ที่ระบุรายการ และ trackBy', 'Field that identifies an item, and the trackBy'),
        row('filterBy · filterMatchMode', "string · 'contains' | …", "undefined · 'contains'", 'field ที่ค้น (ใส่แล้วช่องค้นหาแสดง) และวิธีเทียบ', 'Fields to search (shows the search box) and how to match'),
        row('filterPlaceholder · ariaFilterLabel', 'string', undefined, 'ข้อความและชื่อของช่องค้นหา', 'Search box placeholder and name'),
        row('dragdrop', BOOL, 'false', 'ลากเรียงได้', 'Drag items into order'),
        row('metaKeySelection', BOOL, 'v1 true · v2 / v3 false', 'แบบเดียวกับ PickList', 'As on PickList'),
        row('controlsPosition', "'left' | 'right'", "'left'", 'ฝั่งของปุ่มจัดลำดับ', 'Side of the order buttons'),
        row('disabled · stripedRows', BOOL, 'false', 'ปิดทั้งหมด · แถวสลับสี', 'Disable everything · striped rows'),
        row('breakpoint', 'string', "'960px'", 'ความกว้างที่ปุ่มย้ายขึ้นไปอยู่เหนือรายการ', 'Width at which the buttons move above the list'),
        row('scrollHeight · listStyle', 'string · object', undefined, 'ความสูง / style ของรายการ', 'List height / style'),
        row('style · styleClass · id · tabindex', 'object · string · string · number', undefined, 'style / class ของกล่องนอก id และ tabindex ของรายการ', 'Outer box style / class, id and the list tabindex'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อของรายการสำหรับ screen reader', 'List name for screen readers'),
        row('upButtonAriaLabel · topButtonAriaLabel · downButtonAriaLabel · bottomButtonAriaLabel', 'string', 'locale', ARIA_LABELS_NOTE.th, ARIA_LABELS_NOTE.en),
        row('responsive · filterLocale · autoOptionFocus', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onReorder', 'unknown[]', undefined, 'จัดลำดับใหม่ (รายการที่ย้าย)', 'Reordered (the items that moved)'),
        row('selectionChange', 'any[]', undefined, 'คู่ของ [(selection)]', 'For [(selection)]'),
        row('onSelectionChange', 'WuOrderListSelectionChangeEvent', undefined, 'การเลือกเปลี่ยน', 'Selection changed'),
        row('onFilterEvent', 'WuOrderListFilterEvent', undefined, 'พิมพ์ค้นหา (value คือรายการที่ค้นหาเหลือ)', 'Search typed (value is what the search leaves)'),
        row('onFocus · onBlur', 'Event', undefined, 'รายการได้ / เสียโฟกัส', 'The list gains / loses focus'),
        row('valueChange', 'any[]', undefined, 'คู่ของ [(value)]', 'For [(value)]'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wuTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wuTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (item) · index · selected', undefined, 'แต่ละรายการ', 'Each item'),
        row('header', '—', undefined, 'หัวรายการ', 'List title'),
        row('filter', 'options (filter(text) · reset())', undefined, 'ช่องค้นหาของแอปเอง', 'Your own search box'),
        row('empty · emptyfilter', '—', undefined, 'เมื่อไม่มีรายการ / ค้นไม่เจอ', 'No items / no match'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WuOrderListFilterEvent, WuOrderListSelectionChangeEvent } from 'wiraui/orderlist';

interface WuOrderListSelectionChangeEvent {
  originalEvent?: Event;
  value: unknown[];        // ที่เลือกทั้งหมด
}
interface WuOrderListFilterEvent {
  originalEvent?: Event;
  value: unknown[];        // รายการที่ค้นหาเหลือ
}`,
    },
  ],
  tokens: LIST_TOKENS,
};
