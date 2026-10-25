import { Text } from './i18n';

export interface NavItem {
  id: string;
  title: Text;
  /** Path after the version prefix, e.g. 'components/button'. */
  path: string;
  soon?: boolean;
  /** Extra words the Ctrl+K search matches (either language). */
  keywords?: string;
}

export interface NavSubgroup {
  /** Key for the open / closed state, e.g. 'components/form'. */
  id: string;
  title: string;
  items: NavItem[];
}

export interface NavGroup {
  id: string;
  title: string;
  icon: string;
  items?: NavItem[];
  groups?: NavSubgroup[];
}

export const NAV: NavGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'rocket',
    items: [
      { id: 'introduction', title: { th: 'บทนำ', en: 'Introduction' }, path: 'getting-started/introduction', keywords: 'overview เริ่มต้น' },
      { id: 'installation', title: { th: 'ติดตั้ง', en: 'Installation' }, path: 'getting-started/installation', keywords: 'install ng add npm' },
      { id: 'configuration', title: { th: 'ตั้งค่า', en: 'Configuration' }, path: 'getting-started/configuration', keywords: 'config provideWiraTheme options locale' },
      { id: 'migration', title: { th: 'ย้ายโปรเจคเดิม', en: 'Migrating an existing app' }, path: 'getting-started/migration', keywords: 'migrate ย้าย css class' },
    ],
  },
  {
    id: 'theming',
    title: 'Theming',
    icon: 'palette',
    items: [
      { id: 'theming-overview', title: { th: 'ภาพรวม', en: 'Overview' }, path: 'theming/overview', keywords: 'theming token layer dark mode ธีม' },
      { id: 'presets', title: { th: 'Presets ของรุ่นนี้', en: 'Presets in this version' }, path: 'theming/presets', keywords: 'preset mali sila arun theme ธีม' },
      { id: 'scss', title: 'SCSS', path: 'theming/scss', keywords: 'sass @use' },
      { id: 'css', title: 'CSS', path: 'theming/css', keywords: 'css variables angular.json' },
      { id: 'typescript', title: 'TypeScript', path: 'theming/typescript', keywords: 'overrides definePreset WtThemeService' },
      { id: 'studio', title: { th: 'สตูดิโอธีม', en: 'WiraTheme Studio' }, path: 'theming/studio', keywords: 'studio designer theme designer export figma สตูดิโอ' },
    ],
  },
  {
    id: 'utilities',
    title: 'Utilities',
    icon: 'layers',
    items: [
      { id: 'utilities-overview', title: { th: 'ภาพรวม', en: 'Overview' }, path: 'utilities/overview', keywords: 'utility class utils เปิด ปิด' },
      { id: 'utilities-grid', title: 'Grid', path: 'utilities/grid', keywords: 'col responsive gutter คอลัมน์' },
      { id: 'utilities-flex', title: 'Flex', path: 'utilities/flex', keywords: 'flexbox justify align gap order' },
      { id: 'utilities-spacing', title: 'Spacing', path: 'utilities/spacing', keywords: 'padding margin ระยะห่าง' },
      { id: 'utilities-sizing', title: 'Sizing', path: 'utilities/sizing', keywords: 'width height ขนาด' },
      { id: 'utilities-typography', title: 'Typography', path: 'utilities/typography', keywords: 'text font ตัวอักษร' },
      { id: 'utilities-colors', title: { th: 'สี', en: 'Colours' }, path: 'utilities/colors', keywords: 'color colour palette surface bg' },
      { id: 'utilities-borders', title: { th: 'เส้นขอบและเงา', en: 'Borders and shadows' }, path: 'utilities/borders', keywords: 'border radius shadow' },
      { id: 'utilities-misc', title: { th: 'ตำแหน่งและอื่น ๆ', en: 'Position and more' }, path: 'utilities/misc', keywords: 'position z-index overflow cursor opacity' },
      { id: 'utilities-forms', title: { th: 'จัด layout ฟอร์ม', en: 'Form layout' }, path: 'utilities/forms', keywords: 'field formgrid' },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    icon: 'grid',
    groups: [
      {
        id: 'components/form',
        title: 'Form',
        items: [
          { id: 'autocomplete', title: 'AutoComplete', path: 'components/autocomplete', keywords: 'autocomplete typeahead suggestions search ค้นหา แนะนำ พิมพ์แล้วแนะนำ' },
          { id: 'checkbox', title: 'Checkbox', path: 'components/checkbox', keywords: 'binary ช่องติ๊ก' },
          { id: 'datepicker', title: 'DatePicker', path: 'components/datepicker', keywords: 'calendar date time พ.ศ. ปฏิทิน วันที่ เวลา' },
          { id: 'floatlabel', title: 'FloatLabel', path: 'components/floatlabel', keywords: 'label floating ป้ายลอย' },
          { id: 'iconfield', title: 'IconField', path: 'components/iconfield', keywords: 'inputicon icon ไอคอน ค้นหา' },
          { id: 'inputgroup', title: 'InputGroup', path: 'components/inputgroup', keywords: 'addon add-on กลุ่มช่องกรอก' },
          { id: 'inputmask', title: 'InputMask', path: 'components/inputmask', keywords: 'mask pattern format เลขบัตรประชาชน เบอร์โทร รูปแบบ ทะเบียนรถ' },
          { id: 'inputnumber', title: 'InputNumber', path: 'components/inputnumber', keywords: 'number currency ตัวเลข เงิน บาท' },
          { id: 'inputtext', title: 'InputText', path: 'components/inputtext', keywords: 'input text field ช่องกรอก' },
          { id: 'multiselect', title: 'MultiSelect', path: 'components/multiselect', keywords: 'multiple select checkbox chips เลือกหลายรายการ ตัวเลือก' },
          { id: 'password', title: 'Password', path: 'components/password', keywords: 'strength meter รหัสผ่าน' },
          { id: 'radiobutton', title: 'RadioButton', path: 'components/radiobutton', keywords: 'radio ตัวเลือก' },
          { id: 'rating', title: 'Rating', path: 'components/rating', keywords: 'star ดาว คะแนน' },
          { id: 'select', title: 'Select', path: 'components/select', keywords: 'dropdown combobox จังหวัด เลือก ค้นหา' },
          { id: 'selectbutton', title: 'SelectButton', path: 'components/selectbutton', keywords: 'segmented ปุ่มเลือก' },
          { id: 'textarea', title: 'Textarea', path: 'components/textarea', keywords: 'autoResize ข้อความยาว' },
          { id: 'togglebutton', title: 'ToggleButton', path: 'components/togglebutton', keywords: 'toggle ปุ่มเปิดปิด' },
          { id: 'toggleswitch', title: 'ToggleSwitch', path: 'components/toggleswitch', keywords: 'switch สวิตช์' },
          { id: 'validation', title: 'Validation', path: 'components/validation', keywords: 'field-error error required ตรวจสอบ ข้อผิดพลาด เลขบัตรประชาชน เบอร์โทร' },
        ],
      },
      { id: 'components/button', title: 'Button', items: [{ id: 'button', title: 'Button', path: 'components/button', keywords: 'action loading ปุ่ม' }] },
      {
        id: 'components/panel',
        title: 'Panel',
        items: [
          { id: 'accordion', title: 'Accordion', path: 'components/accordion', keywords: 'collapse faq หัวข้อพับ' },
          { id: 'card', title: 'Card', path: 'components/card', keywords: 'glass การ์ด' },
          { id: 'divider', title: 'Divider', path: 'components/divider', keywords: 'separator เส้นคั่น' },
          { id: 'fieldset', title: 'Fieldset', path: 'components/fieldset', keywords: 'legend group' },
          { id: 'panel', title: 'Panel', path: 'components/panel', keywords: 'collapse toggleable พับ' },
          { id: 'tabs', title: 'Tabs', path: 'components/tabs', keywords: 'tabview tabpanel แท็บ' },
          { id: 'toolbar', title: 'Toolbar', path: 'components/toolbar', keywords: 'actions bar แถบเครื่องมือ' },
        ],
      },
      {
        id: 'components/menu',
        title: 'Menu',
        items: [
          { id: 'menubar', title: 'Menubar', path: 'components/menubar', keywords: 'menu navbar เมนู แถบเมนู header routerLink' },
          { id: 'menu', title: 'Menu', path: 'components/menu', keywords: 'popup menu profile sidebar side menu เมนู เมนูโปรไฟล์ เมนูข้าง' },
          { id: 'tabmenu', title: 'TabMenu', path: 'components/tabmenu', keywords: 'tab menu activeItem routerLink แท็บ เมนูแท็บ' },
          { id: 'panelmenu', title: 'PanelMenu', path: 'components/panelmenu', keywords: 'panel menu side menu sidebar accordion menu เมนูข้าง เมนูพับได้' },
          { id: 'steps', title: 'Steps', path: 'components/steps', keywords: 'steps wizard progress stepper ขั้นตอน ลำดับขั้น' },
        ],
      },
      {
        id: 'components/display',
        title: 'Display',
        items: [
          { id: 'tag', title: 'Tag', path: 'components/tag', keywords: 'label status ป้าย' },
          { id: 'badge', title: 'Badge', path: 'components/badge', keywords: 'count dot ตัวเลข' },
          { id: 'chip', title: 'Chip', path: 'components/chip', keywords: 'pill removable' },
          { id: 'avatar', title: 'Avatar', path: 'components/avatar', keywords: 'avatargroup user profile' },
          { id: 'image', title: 'Image', path: 'components/image', keywords: 'img picture preview zoom rotate รูป รูปภาพ ขยาย' },
          { id: 'skeleton', title: 'Skeleton', path: 'components/skeleton', keywords: 'loading placeholder' },
          { id: 'progressbar', title: 'ProgressBar', path: 'components/progressbar', keywords: 'progress loading ความคืบหน้า' },
          { id: 'metergroup', title: 'MeterGroup', path: 'components/metergroup', keywords: 'meter storage แถบหลายค่า พื้นที่' },
          { id: 'timeline', title: 'Timeline', path: 'components/timeline', keywords: 'events history steps ลำดับเหตุการณ์ ประวัติ ไทม์ไลน์' },
          { id: 'progressspinner', title: 'ProgressSpinner', path: 'components/progressspinner', keywords: 'spinner loading' },
        ],
      },
      {
        id: 'components/data',
        title: 'Data',
        items: [
          { id: 'table', title: 'Table', path: 'components/table', keywords: 'datatable data table grid ตาราง รายชื่อ แบ่งหน้า เรียง ค้นหา lazy' },
          { id: 'chart', title: 'Chart', path: 'components/chart', keywords: 'chart.js graph bar line pie doughnut กราฟ แผนภูมิ' },
          { id: 'paginator', title: 'Paginator', path: 'components/paginator', keywords: 'paging pagination page แบ่งหน้า หน้าถัดไป' },
        ],
      },
      {
        id: 'components/overlay',
        title: 'Overlay',
        items: [
          { id: 'alert', title: 'AlertDialog', path: 'components/alert', keywords: 'alert fire popup แจ้งเตือน กล่องข้อความ' },
          { id: 'confirmdialog', title: 'ConfirmDialog', path: 'components/confirmdialog', keywords: 'confirm confirmation ยืนยัน' },
          { id: 'dialog', title: 'Dialog', path: 'components/dialog', keywords: 'modal popup กล่องโต้ตอบ' },
          { id: 'popover', title: 'Popover', path: 'components/popover', keywords: 'overlaypanel dropdown panel' },
          { id: 'tooltip', title: 'Tooltip', path: 'components/tooltip', keywords: 'hint title คำอธิบาย' },
        ],
      },
      {
        id: 'components/messages',
        title: 'Messages',
        items: [
          { id: 'message', title: 'Message', path: 'components/message', keywords: 'alert inline notice ข้อความแจ้ง' },
          { id: 'toast', title: 'Toast', path: 'components/toast', keywords: 'notification snackbar แจ้งเตือน' },
        ],
      },
      {
        id: 'components/misc',
        title: 'Misc',
        items: [{ id: 'animate', title: 'Animate on scroll', path: 'components/animate', keywords: 'data-aos scroll animation เคลื่อนไหว' }],
      },
    ],
  },
];

export interface NavPage extends NavItem {
  group: string;
  /** Keys of the sidebar sections that contain this page. */
  sections: string[];
}

/** Every page in sidebar order; drives search, page titles, the previous / next links and the open sidebar groups. */
export const NAV_PAGES: NavPage[] = NAV.flatMap((g) => [
  ...(g.items || []).map((i) => ({ ...i, group: g.title, sections: [g.id] })),
  ...(g.groups || []).flatMap((s) => s.items.map((i) => ({ ...i, group: `${g.title} · ${s.title}`, sections: [g.id, s.id] }))),
]);

export function navPageOf(path: string): NavPage | undefined {
  return NAV_PAGES.find((p) => p.path === path);
}
