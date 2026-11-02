import { Text } from './i18n';

export interface NavItem {
  id: string;
  title: Text;
  /** Path after the version prefix, e.g. 'components/button'. */
  path: string;
  soon?: boolean;
  /** The first wiraui major that has the page (Chart, WiraUI's own: 3); older versions leave it out. */
  since?: number;
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
      { id: 'configuration', title: { th: 'ตั้งค่า', en: 'Configuration' }, path: 'getting-started/configuration', keywords: 'config provideWiraUI options locale' },
      { id: 'migration', title: { th: 'ย้ายโปรเจคเดิม', en: 'Migrating an existing app' }, path: 'getting-started/migration', keywords: 'migrate ย้าย css class' },
      { id: 'icons', title: { th: 'ไอคอน', en: 'Icons' }, path: 'getting-started/icons', keywords: 'icons icon wiraicon wi-icon svg pi-* font awesome phosphor ไอคอน สัญลักษณ์' },
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
      { id: 'typescript', title: 'TypeScript', path: 'theming/typescript', keywords: 'overrides definePreset WuThemeService' },
      { id: 'studio', title: { th: 'สตูดิโอธีม', en: 'WiraUI Studio' }, path: 'theming/studio', keywords: 'studio designer theme designer export figma สตูดิโอ' },
    ],
  },
  // Laying a page out: the grid / flex / spacing classes and the components that divide space.
  {
    id: 'layout',
    title: 'Layout',
    icon: 'layout',
    groups: [
      {
        id: 'layout/classes',
        title: 'Classes',
        items: [
          { id: 'utilities-grid', title: 'Grid', path: 'utilities/grid', keywords: 'col responsive gutter คอลัมน์' },
          { id: 'utilities-flex', title: 'Flex', path: 'utilities/flex', keywords: 'flexbox justify align gap order' },
          { id: 'utilities-spacing', title: 'Spacing', path: 'utilities/spacing', keywords: 'padding margin ระยะห่าง' },
          { id: 'utilities-sizing', title: 'Sizing', path: 'utilities/sizing', keywords: 'width height ขนาด' },
          { id: 'utilities-misc', title: { th: 'ตำแหน่งและ overflow', en: 'Position and overflow' }, path: 'utilities/misc', keywords: 'position z-index overflow cursor opacity' },
          { id: 'utilities-forms', title: { th: 'จัด layout ฟอร์ม', en: 'Form layout' }, path: 'utilities/forms', keywords: 'field formgrid' },
        ],
      },
      {
        id: 'layout/components',
        title: 'Components',
        items: [
          { id: 'divider', title: 'Divider', path: 'components/divider', keywords: 'separator เส้นคั่น' },
          { id: 'splitter', title: 'Splitter', path: 'components/splitter', keywords: 'splitter split panes resize layout แบ่งช่อง ปรับขนาด ลากแบ่ง' },
          { id: 'toolbar', title: 'Toolbar', path: 'components/toolbar', keywords: 'actions bar แถบเครื่องมือ' },
          { id: 'scrollpanel', title: 'ScrollPanel', path: 'components/scrollpanel', keywords: 'scroll panel scrollbar กล่องเลื่อน แถบเลื่อน' },
        ],
      },
    ],
  },
  // Not components: styling classes, and functions, pipes and directives that help them.
  {
    id: 'utilities',
    title: 'Utilities',
    icon: 'layers',
    groups: [
      {
        id: 'utilities/classes',
        title: 'Styling',
        items: [
          { id: 'utilities-overview', title: { th: 'ภาพรวม', en: 'Overview' }, path: 'utilities/overview', keywords: 'utility class utils เปิด ปิด' },
          { id: 'utilities-typography', title: 'Typography', path: 'utilities/typography', keywords: 'text font ตัวอักษร' },
          { id: 'utilities-colors', title: { th: 'สี', en: 'Colours' }, path: 'utilities/colors', keywords: 'color colour palette surface bg' },
          { id: 'utilities-borders', title: { th: 'เส้นขอบและเงา', en: 'Borders and shadows' }, path: 'utilities/borders', keywords: 'border radius shadow' },
        ],
      },
      {
        id: 'utilities/helpers',
        title: 'Helpers',
        items: [
          { id: 'excel', title: 'Excel', path: 'components/excel', keywords: 'excel xlsx spreadsheet export workbook sheet merge formula style xlsx sheetjs exceljs ส่งออก ไฟล์ เอ็กเซล รวมเซลล์ สูตร รายงาน' },
          { id: 'thai', title: { th: 'Pipe ภาษาไทย', en: 'Thai pipes' }, path: 'components/thai', keywords: 'thai pipe date buddhist พ.ศ. bahttext baht text phone id digits time ago วันที่ เงินเป็นตัวอักษร บาทถ้วน เบอร์โทร เลขบัตร เลขไทย ที่ผ่านมา' },
          { id: 'animate', title: 'Animate on scroll', path: 'components/animate', keywords: 'data-aos scroll animation เคลื่อนไหว' },
          { id: 'ripple', title: 'Ripple', path: 'components/ripple', keywords: 'ripple pRipple ink material คลื่น' },
          { id: 'dragdrop', title: 'DragDrop', path: 'components/dragdrop', keywords: 'drag drop draggable droppable pDraggable ลากวาง' },
        ],
      },
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
          { id: 'colorpicker', title: 'ColorPicker', path: 'components/colorpicker', keywords: 'color colour picker hex rgb สี เลือกสี' },
          { id: 'datepicker', title: 'DatePicker', path: 'components/datepicker', keywords: 'calendar date time พ.ศ. ปฏิทิน วันที่ เวลา' },
          { id: 'editor', title: 'Editor', path: 'components/editor', keywords: 'editor rich text wysiwyg html ข้อความ เนื้อหาข่าว จัดรูปแบบ ตาราง รูปภาพ' },
          { id: 'fileupload', title: 'FileUpload', path: 'components/fileupload', keywords: 'upload file attach drag drop excel pdf อัปโหลด ไฟล์ แนบไฟล์ ลากวาง รูป' },
          { id: 'floatlabel', title: 'FloatLabel', path: 'components/floatlabel', keywords: 'label floating ป้ายลอย' },
          { id: 'iconfield', title: 'IconField', path: 'components/iconfield', keywords: 'inputicon icon ไอคอน ค้นหา' },
          { id: 'inputgroup', title: 'InputGroup', path: 'components/inputgroup', keywords: 'addon add-on กลุ่มช่องกรอก' },
          { id: 'inputmask', title: 'InputMask', path: 'components/inputmask', keywords: 'mask pattern format เลขบัตรประชาชน เบอร์โทร รูปแบบ ทะเบียนรถ' },
          { id: 'inputnumber', title: 'InputNumber', path: 'components/inputnumber', keywords: 'number currency ตัวเลข เงิน บาท' },
          { id: 'inputotp', title: 'InputOtp', path: 'components/inputotp', keywords: 'otp one-time code pin verification sms รหัสยืนยัน รหัส otp รหัสครั้งเดียว ยืนยันตัวตน' },
          { id: 'inputtext', title: 'InputText', path: 'components/inputtext', keywords: 'input text field ช่องกรอก' },
          { id: 'keyfilter', title: 'KeyFilter', path: 'components/keyfilter', keywords: 'keyfilter key filter pKeyFilter digits only ตัวเลขเท่านั้น กรองตัวอักษร ภาษาไทย' },
          { id: 'knob', title: 'Knob', path: 'components/knob', keywords: 'knob dial rotary volume ปุ่มหมุน ระดับเสียง วงแหวน เปอร์เซ็นต์' },
          { id: 'listbox', title: 'Listbox', path: 'components/listbox', keywords: 'listbox list multiple checkbox รายการ เลือกจากรายการ ห้องเรียน' },
          { id: 'multiselect', title: 'MultiSelect', path: 'components/multiselect', keywords: 'multiple select checkbox chips เลือกหลายรายการ ตัวเลือก' },
          { id: 'password', title: 'Password', path: 'components/password', keywords: 'strength meter รหัสผ่าน' },
          { id: 'radiobutton', title: 'RadioButton', path: 'components/radiobutton', keywords: 'radio ตัวเลือก' },
          { id: 'rating', title: 'Rating', path: 'components/rating', keywords: 'star ดาว คะแนน' },
          { id: 'select', title: 'Select', path: 'components/select', keywords: 'dropdown combobox จังหวัด เลือก ค้นหา' },
          { id: 'selectbutton', title: 'SelectButton', path: 'components/selectbutton', keywords: 'segmented ปุ่มเลือก' },
          { id: 'slider', title: 'Slider', path: 'components/slider', keywords: 'slider range volume ตัวเลื่อน ช่วง ระดับ' },
          { id: 'textarea', title: 'Textarea', path: 'components/textarea', keywords: 'autoResize ข้อความยาว' },
          { id: 'togglebutton', title: 'ToggleButton', path: 'components/togglebutton', keywords: 'toggle ปุ่มเปิดปิด' },
          { id: 'toggleswitch', title: 'ToggleSwitch', path: 'components/toggleswitch', keywords: 'switch สวิตช์' },
          { id: 'treeselect', title: 'TreeSelect', path: 'components/treeselect', keywords: 'tree select hierarchy dropdown เลือกแบบลำดับชั้น โฟลเดอร์' },
          { id: 'validation', title: 'Validation', path: 'components/validation', keywords: 'field-error error required ตรวจสอบ ข้อผิดพลาด เลขบัตรประชาชน เบอร์โทร' },
        ],
      },
      {
        id: 'components/button',
        title: 'Button',
        items: [
          { id: 'button', title: 'Button', path: 'components/button', keywords: 'action loading ปุ่ม' },
          { id: 'splitbutton', title: 'SplitButton', path: 'components/splitbutton', keywords: 'split button dropdown menu ปุ่มเมนู ปุ่มแยก บันทึกเป็นร่าง' },
        ],
      },
      {
        id: 'components/panel',
        title: 'Panel',
        items: [
          { id: 'accordion', title: 'Accordion', path: 'components/accordion', keywords: 'collapse faq หัวข้อพับ' },
          { id: 'card', title: 'Card', path: 'components/card', keywords: 'glass การ์ด' },
          { id: 'fieldset', title: 'Fieldset', path: 'components/fieldset', keywords: 'legend group' },
          { id: 'inplace', title: 'Inplace', path: 'components/inplace', keywords: 'inplace edit in place click to edit แก้ไขในที่ คลิกเพื่อแก้ไข' },
          { id: 'panel', title: 'Panel', path: 'components/panel', keywords: 'collapse toggleable พับ' },
          { id: 'stepper', title: 'Stepper', path: 'components/stepper', keywords: 'stepper wizard multi-step form linear vertical steps ขั้นตอน ฟอร์มหลายขั้น ทีละขั้น' },
          { id: 'tabs', title: 'Tabs', path: 'components/tabs', keywords: 'tabview tabpanel แท็บ' },
        ],
      },
      {
        id: 'components/menu',
        title: 'Navigation',
        items: [
          { id: 'breadcrumb', title: 'Breadcrumb', path: 'components/breadcrumb', keywords: 'breadcrumb trail path เส้นทาง ตำแหน่งหน้า' },
          { id: 'menubar', title: 'Menubar', path: 'components/menubar', keywords: 'menu navbar เมนู แถบเมนู header routerLink' },
          { id: 'navbar', title: 'Navbar', path: 'components/navbar', keywords: 'navbar top bar header navigation sticky hamburger แถบบน แถบนำทาง เมนูบน หัวเว็บ' },
          { id: 'sitefooter', title: 'SiteFooter', path: 'components/sitefooter', keywords: 'footer site footer bottom links copyright social newsletter back to top ส่วนท้าย ท้ายเว็บ ลิขสิทธิ์ ลิงก์ท้ายหน้า' },
          { id: 'bottombar', title: 'BottomBar', path: 'components/bottombar', keywords: 'bottom bar bottom navigation tab bar mobile app fab แถบล่าง เมนูล่าง แท็บบาร์ มือถือ' },
          { id: 'asidemenu', title: 'Aside Menu', path: 'components/asidemenu', keywords: 'aside menu sidebar side navigation sidenav admin layout collapse icon rail off-canvas เมนูด้านข้าง เมนูข้าง ย่อเมนู แถบไอคอน โครงหน้าแอป ระบบหลังบ้าน' },
          { id: 'menu', title: 'Menu', path: 'components/menu', keywords: 'popup menu profile sidebar side menu เมนู เมนูโปรไฟล์ เมนูข้าง' },
          { id: 'tabmenu', title: 'TabMenu', path: 'components/tabmenu', keywords: 'tab menu activeItem routerLink แท็บ เมนูแท็บ' },
          { id: 'panelmenu', title: 'PanelMenu', path: 'components/panelmenu', keywords: 'panel menu side menu sidebar accordion menu เมนูข้าง เมนูพับได้' },
          { id: 'tieredmenu', title: 'TieredMenu', path: 'components/tieredmenu', keywords: 'tiered menu submenu nested เมนูย่อย เมนูซ้อน' },
          { id: 'contextmenu', title: 'ContextMenu', path: 'components/contextmenu', keywords: 'context menu right click คลิกขวา เมนูคลิกขวา' },
          { id: 'dock', title: 'Dock', path: 'components/dock', keywords: 'dock taskbar launcher macos windows desktop magnify แถบโปรแกรม ทาสก์บาร์ เดสก์ท็อป' },
          { id: 'steps', title: 'Steps', path: 'components/steps', keywords: 'steps wizard progress stepper ขั้นตอน ลำดับขั้น' },
        ],
      },
      {
        id: 'components/data',
        title: 'Data',
        items: [
          { id: 'table', title: 'Table', path: 'components/table', keywords: 'datatable data table grid ตาราง รายชื่อ แบ่งหน้า เรียง ค้นหา lazy frozen expansion row group column filter export csv excel xlsx context menu คอลัมน์ตรึง แถวขยาย จัดกลุ่ม ตัวกรอง ส่งออก คลิกขวา' },
          { id: 'paginator', title: 'Paginator', path: 'components/paginator', keywords: 'paging pagination page แบ่งหน้า หน้าถัดไป' },
          { id: 'tree', title: 'Tree', path: 'components/tree', keywords: 'tree treeview hierarchy folders checkbox ลำดับชั้น โฟลเดอร์ ต้นไม้' },
          { id: 'picklist', title: 'PickList', path: 'components/picklist', keywords: 'pick list transfer dual list permissions drag drop ย้ายรายการ สิทธิ์ ลำดับผู้อนุมัติ ลากวาง' },
          { id: 'orderlist', title: 'OrderList', path: 'components/orderlist', keywords: 'order list reorder sort drag drop เรียงลำดับ จัดลำดับ ลากวาง' },
          { id: 'timeline', title: 'Timeline', path: 'components/timeline', keywords: 'events history steps ลำดับเหตุการณ์ ประวัติ ไทม์ไลน์' },
          { id: 'scroller', title: 'Scroller', path: 'components/scroller', keywords: 'virtual scroller virtual scroll long list รายการยาว เลื่อนเร็ว' },
        ],
      },
      {
        id: 'components/charts',
        title: 'Charts',
        items: [
          { id: 'chart', title: 'Chart', path: 'components/chart', since: 3, keywords: 'chart wirachart graph svg bar line area pie doughnut radar scatter bubble dashboard no chart.js กราฟ แผนภูมิ แดชบอร์ด กราฟแท่ง กราฟเส้น กราฟวงกลม' },
          { id: 'chartjs', title: 'ChartJS', path: 'components/chartjs', keywords: 'chart.js chartjs graph bar line pie doughnut plugins canvas p-chart กราฟ แผนภูมิ' },
          { id: 'organizationchart', title: 'OrganizationChart', path: 'components/organizationchart', keywords: 'organization chart org chart hierarchy tree ผังองค์กร โครงสร้างองค์กร ผังบุคลากร' },
          { id: 'flow', title: 'Flow', path: 'components/flow', keywords: 'flow diagram node editor flowchart workflow graph edges handles minimap vflow ngx-vflow แผนภาพ ผังงาน ขั้นตอนงาน เส้นเชื่อม โหนด ผังองค์กร ลากเชื่อม' },
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
          { id: 'metergroup', title: 'MeterGroup', path: 'components/metergroup', keywords: 'meter storage แถบหลายค่า พื้นที่' },
          { id: 'terminal', title: 'Terminal', path: 'components/terminal', keywords: 'terminal console command line cli คำสั่ง คอนโซล หน้าจอคำสั่ง' },
        ],
      },
      {
        id: 'components/feedback',
        title: 'Feedback',
        items: [
          { id: 'message', title: 'Message', path: 'components/message', keywords: 'alert inline notice ข้อความแจ้ง' },
          { id: 'toast', title: 'Toast', path: 'components/toast', keywords: 'notification snackbar แจ้งเตือน' },
          { id: 'progressbar', title: 'ProgressBar', path: 'components/progressbar', keywords: 'progress loading ความคืบหน้า' },
          { id: 'progressspinner', title: 'ProgressSpinner', path: 'components/progressspinner', keywords: 'spinner loading' },
          { id: 'skeleton', title: 'Skeleton', path: 'components/skeleton', keywords: 'loading placeholder' },
          { id: 'blockui', title: 'BlockUI', path: 'components/blockui', keywords: 'block ui blockui overlay loading busy บังหน้า ระหว่างบันทึก' },
          { id: 'emptystate', title: 'EmptyState', path: 'components/emptystate', keywords: 'empty state no data nothing found placeholder blank slate ไม่มีข้อมูล ว่าง ไม่พบ ค้นไม่เจอ' },
          { id: 'result', title: 'Result', path: 'components/result', keywords: 'result success error 404 403 500 not found forbidden server error สำเร็จ ไม่สำเร็จ ไม่พบหน้า ไม่มีสิทธิ์ ระบบขัดข้อง' },
          { id: 'errorpage', title: 'ErrorPage', path: 'components/errorpage', keywords: 'error page 404 403 401 500 503 4xx 5xx not found maintenance kawaii template หน้าข้อผิดพลาด ไม่พบหน้า ปิดปรับปรุง ระบบขัดข้อง น่ารัก' },
        ],
      },
      {
        id: 'components/media',
        title: 'Media',
        items: [
          { id: 'image', title: 'Image', path: 'components/image', keywords: 'img picture preview zoom rotate รูป รูปภาพ ขยาย' },
          { id: 'carousel', title: 'Carousel', path: 'components/carousel', keywords: 'carousel slider slideshow news cards ภาพสไลด์ ข่าวประชาสัมพันธ์ เลื่อน แบนเนอร์' },
          { id: 'galleria', title: 'Galleria', path: 'components/galleria', keywords: 'galleria gallery carousel slideshow photos อัลบั้ม ภาพกิจกรรม สไลด์' },
          { id: 'imagecompare', title: 'ImageCompare', path: 'components/imagecompare', keywords: 'image compare before after slider เทียบภาพ ก่อนหลัง เปรียบเทียบรูป' },
          { id: 'imagecropper', title: 'Image Cropper', path: 'components/imagecropper', keywords: 'image cropper crop image-cropper avatar profile photo resize upload ตัดรูป ครอปรูป รูปโปรไฟล์ ย่อรูป อัปโหลดรูป' },
        ],
      },
      {
        id: 'components/overlay',
        title: 'Overlay',
        items: [
          { id: 'alert', title: 'AlertDialog', path: 'components/alert', keywords: 'alert fire popup แจ้งเตือน กล่องข้อความ' },
          { id: 'confirmdialog', title: 'ConfirmDialog', path: 'components/confirmdialog', keywords: 'confirm confirmation ยืนยัน' },
          { id: 'dialog', title: 'Dialog', path: 'components/dialog', keywords: 'modal popup กล่องโต้ตอบ' },
          { id: 'drawer', title: 'Drawer', path: 'components/drawer', keywords: 'drawer sidebar side panel offcanvas เมนูข้าง แผงข้าง' },
          { id: 'popover', title: 'Popover', path: 'components/popover', keywords: 'overlaypanel dropdown panel' },
          { id: 'tooltip', title: 'Tooltip', path: 'components/tooltip', keywords: 'hint title คำอธิบาย' },
        ],
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

/** Whether a page is in a version ('v1' … 'v3' or the major). */
export function inVersion(item: { since?: number }, version: string | number): boolean {
  const major = typeof version === 'number' ? version : Number(String(version).replace(/^v/, '')) || 3;
  return !item.since || major >= item.since;
}

/** The sidebar of one version: pages it does not have are left out. */
export function navFor(version: string | number): NavGroup[] {
  return NAV.map((g) => ({
    ...g,
    items: g.items?.filter((i) => inVersion(i, version)),
    groups: g.groups?.map((s) => ({ ...s, items: s.items.filter((i) => inVersion(i, version)) })).filter((s) => s.items.length),
  }));
}

/** NAV_PAGES of one version. */
export function navPagesFor(version: string | number): NavPage[] {
  return NAV_PAGES.filter((p) => inVersion(p, version));
}
