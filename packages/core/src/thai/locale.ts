/** What wu-empty-state shows: no data yet, nothing found, an empty inbox or folder, a failed load, no connection. */
export type WuEmptyStateType = 'nodata' | 'search' | 'inbox' | 'folder' | 'error' | 'offline';

/** What wu-result reports: the outcome of a task, or a page that cannot be shown. */
export type WuResultStatus = 'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500';

/** wu-error-page: what kind of failure a status code is (picks the picture and the kawaii text). */
export type WuErrorKind = 'request' | 'auth' | 'forbidden' | 'missing' | 'time' | 'busy' | 'server' | 'gateway' | 'down';

/** UI strings components read. Keys follow the translation object shape apps already use, so migrating apps can reuse theirs. */
export interface WuLocale {
  code: string;
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesMin: string[];
  monthNames: string[];
  monthNamesShort: string[];
  firstDayOfWeek: number;
  today: string;
  clear: string;
  accept: string;
  reject: string;
  cancel: string;
  choose: string;
  upload: string;
  emptyMessage: string;
  emptyFilterMessage: string;
  weekHeader: string;
  /** Labels for icon-only buttons (close a message, remove a chip, expand a panel) and busy states. */
  close: string;
  remove: string;
  expand: string;
  collapse: string;
  loading: string;
  /** Search boxes, e.g. the filter of a select. */
  search: string;
  /** Paginator and table: the page report (placeholders {first} {last} {totalRecords} {currentPage} {totalPages} {rows}),
   *  labels of the page buttons and the rows-per-page box, and the row checkboxes. */
  pageReport: string;
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
  pageLabel: string;
  rowsPerPage: string;
  /** The menu button that shows a menubar's items on narrow screens. */
  navigation: string;
  /** wu-aside-menu: the side menu's landmark and its collapse button. */
  sideNavigation: string;
  collapseMenu: string;
  expandMenu: string;
  selectAll: string;
  /** Label of the total row in an exported table. */
  total: string;
  /** wu-empty-state: the title and the line under it, per type. */
  emptyState: Record<WuEmptyStateType, { title: string; description: string }>;
  /** wu-result: the title and the line under it, per status. */
  result: Record<WuResultStatus, { title: string; description: string }>;
  /**
   * wu-error-page: the word before the code, the buttons, the reference line, the formal text per status code (any code
   * not listed takes `4xx` / `5xx`) and the kawaii text per kind.
   */
  errorPage: {
    error: string;
    home: string;
    back: string;
    retry: string;
    signIn: string;
    reference: string;
    codes: Record<string, { title: string; description: string }>;
    kawaii: Record<WuErrorKind, { title: string; description: string }>;
  };
  /** wu-site-footer: the back-to-top button and the words after the copyright. wu-bottombar: its label. */
  siteFooter: { backToTop: string; rights: string };
  bottombar: string;
  /** Multi-select field once more are chosen than it lists; {0} is the count. */
  selectedItemsLabel: string;
  /** Image preview: the button over the picture and the full-screen toolbar. */
  previewImage: string;
  rotateRight: string;
  rotateLeft: string;
  zoomIn: string;
  /** wu-imagecropper */
  imageCropper: string;
  /** Label of wu-language-switch. */
  language: string;
  cropArea: string;
  cropAreaHint: string;
  zoom: string;
  flipHorizontal: string;
  flipVertical: string;
  resetCrop: string;
  imageLoadFailed: string;
  zoomOut: string;
  /** The button that lists every suggestion of an autocomplete. */
  showOptions: string;
  selectRow: string;
  /** Column filter menu: match modes (the keys translation objects already use), rules and buttons. */
  startsWith: string;
  contains: string;
  notContains: string;
  endsWith: string;
  equals: string;
  notEquals: string;
  lt: string;
  lte: string;
  gt: string;
  gte: string;
  dateIs: string;
  dateIsNot: string;
  dateBefore: string;
  dateAfter: string;
  noFilter: string;
  apply: string;
  matchAll: string;
  matchAny: string;
  addRule: string;
  removeRule: string;
  filter: string;
  /** Pick list and order list buttons. */
  moveUp: string;
  moveTop: string;
  moveDown: string;
  moveBottom: string;
  moveToTarget: string;
  moveAllToTarget: string;
  moveToSource: string;
  moveAllToSource: string;
  /**
   * File upload: the hint in an empty drop area, upload states, size units, and the messages for files it turns away
   * ({0} the file name, {1} the limit or the accepted types).
   */
  dropFiles: string;
  pending: string;
  completed: string;
  fileSizeTypes: string[];
  invalidFileSize: string;
  invalidFileType: string;
  invalidFileLimit: string;
  /** Password field: hint before typing, strength levels, and the show/hide button. */
  passwordPrompt: string;
  /** Default labels of a toggle button. */
  yes: string;
  no: string;
  weak: string;
  medium: string;
  strong: string;
  showPassword: string;
  hidePassword: string;
  /** Date picker: time field names, the 12-hour markers, and labels for its icon-only buttons. */
  hour: string;
  minute: string;
  second: string;
  am: string;
  pm: string;
  chooseDate: string;
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  previousDecade: string;
  nextDecade: string;
  /** Default display pattern, see `formatDate()`. */
  dateFormat: string;
  /** Image gallery: the arrows, the dots (`{0}` of `{1}`) and full screen. */
  previousImage: string;
  nextImage: string;
  imageOf: string;
  fullScreen: string;
  /** Breadcrumb: the trail's label and the home link's. */
  breadcrumb: string;
  home: string;
  /** Colour picker: the swatch button, the hue strip and the saturation/brightness area. */
  colorPicker: string;
  hue: string;
  saturationBrightness: string;
  /** Terminal: the label of its command line. */
  terminalInput: string;
  /** Image compare: the label of its divider (a slider). */
  imageCompare: string;
  /** Carousel: how screen readers call it and its items, and an item's place (`{0}` of `{1}`). */
  carousel: string;
  slide: string;
  slideOf: string;
  /** Splitter: the label of a gutter between panels. */
  resizePanels: string;
  /** Organization chart: the chart's label. */
  organizationChart: string;
  /** One-time code boxes: the group's label and each box's (`{0}` of `{1}`). */
  oneTimeCode: string;
  otpCharacter: string;
  /** wu-flow (a node diagram): role names, keyboard hints, controls, and what screen readers hear as things change. */
  /** The diagram's accessible name and role description. */
  flowLabel: string;
  flowNode: string;
  flowEdge: string;
  /** Added to a node's or edge's name while it is selected. */
  flowSelectedState: string;
  /** Hints read with the diagram and with each node / edge. */
  flowPaneHint: string;
  flowNodeHint: string;
  flowEdgeHint: string;
  /** Controls. */
  flowControls: string;
  flowZoomIn: string;
  flowZoomOut: string;
  flowFitView: string;
  flowLock: string;
  flowUnlock: string;
  flowMiniMap: string;
  flowNodeToolbar: string;
  flowUndo: string;
  flowRedo: string;
  /** Announcements ({name}, {count}, {x} … are filled in). */
  flowSelected: string;
  flowSelectionCleared: string;
  flowMoved: string;
  flowMovedMany: string;
  flowResized: string;
  flowConnectStart: string;
  flowConnected: string;
  flowConnectCancelled: string;
  flowConnectInvalid: string;
  flowReconnected: string;
  flowDeleted: string;
  flowEdgeFromTo: string;
  flowZoomLevel: string;
  /**
   * Form error messages, by validator key. `{label}` is the field's name when one is given (`requiredLabel`),
   * `{requiredLength}`, `{min}`, `{max}` come from the error.
   */
  validation: WuValidationMessages;
  /** Rich-text editor: toolbar labels, menus and dialogs. `{0}` / `{1}` are filled in (a level, a size, a count). */
  editor: WuEditorMessages;
  /** wu-chat: the message box and its buttons, who is typing (`{name}`, `{count}`), read marks and day separators. */
  chat?: WuChatMessages;
  /** wu-signature-pad */
  signaturePad?: { label: string; hint: string; clear: string; undo: string };
  /** wu-scheduler: the toolbar, the views and the "+{count} more" link of a full day. */
  scheduler?: { today: string; previous: string; next: string; day: string; week: string; month: string; allDay: string; more: string; noEvents: string };
  /** wu-stat: how a screen reader says the trend. */
  stat?: { up: string; down: string; same: string };
}

export interface WuChatMessages {
  placeholder: string;
  send: string;
  attach: string;
  removeFile: string;
  typing: string;
  typingMany: string;
  read: string;
  readBy: string;
  today: string;
  yesterday: string;
  closed: string;
  emptyTitle: string;
  emptyDescription: string;
  loadMore: string;
  failed: string;
  retry: string;
  newMessages: string;
  messages: string;
}

export interface WuEditorMessages {
  toolbar: string;
  undo: string;
  redo: string;
  paragraph: string;
  heading: string;
  blockStyle: string;
  fontSize: string;
  fontFamily: string;
  defaultFont: string;
  sizeSmall: string;
  sizeNormal: string;
  sizeLarge: string;
  sizeHuge: string;
  bold: string;
  italic: string;
  underline: string;
  strike: string;
  subscript: string;
  superscript: string;
  code: string;
  color: string;
  highlight: string;
  removeColor: string;
  customColor: string;
  bulletList: string;
  orderedList: string;
  indent: string;
  outdent: string;
  align: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;
  link: string;
  linkUrl: string;
  linkText: string;
  linkNewTab: string;
  openLink: string;
  editLink: string;
  unlink: string;
  invalidUrl: string;
  apply: string;
  image: string;
  imageUpload: string;
  imageFromUrl: string;
  imageUrl: string;
  imageAlt: string;
  imageDrop: string;
  imageWidth: string;
  imageOriginal: string;
  imageInline: string;
  imageLeft: string;
  imageCenter: string;
  imageRight: string;
  imageRemove: string;
  imageResize: string;
  uploading: string;
  uploadFailed: string;
  imageTooLarge: string;
  imageWrongType: string;
  table: string;
  insertTable: string;
  tableSize: string;
  rowAbove: string;
  rowBelow: string;
  colLeft: string;
  colRight: string;
  deleteRow: string;
  deleteCol: string;
  deleteTable: string;
  headerRow: string;
  mergeRight: string;
  mergeDown: string;
  splitCell: string;
  /** Table: merging the cells picked by dragging, the insert panel's own size fields, the table's toolbar. */
  mergeCells: string;
  tableRows: string;
  tableCols: string;
  insert: string;
  tableTools: string;
  blockquote: string;
  codeBlock: string;
  hr: string;
  clear: string;
  source: string;
  fullscreen: string;
  exitFullscreen: string;
  words: string;
  characters: string;
  content: string;
}

export interface WuValidationMessages {
  required: string;
  requiredLabel: string;
  requiredTrue: string;
  email: string;
  minlength: string;
  maxlength: string;
  min: string;
  max: string;
  pattern: string;
  thaiId: string;
  phone: string;
  mismatch: string;
  /** Any other error key. */
  invalid: string;
}

export const TH_LOCALE: WuLocale = {
  code: 'th',
  dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
  dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
  dayNamesMin: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
  monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
  monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
  firstDayOfWeek: 0,
  today: 'วันนี้',
  clear: 'ล้าง',
  accept: 'ตกลง',
  reject: 'ยกเลิก',
  cancel: 'ยกเลิก',
  choose: 'เลือก',
  upload: 'อัปโหลด',
  emptyMessage: 'ไม่มีข้อมูล',
  emptyFilterMessage: 'ไม่พบข้อมูลที่ค้นหา',
  weekHeader: 'สัปดาห์',
  close: 'ปิด',
  remove: 'ลบ',
  expand: 'ขยาย',
  collapse: 'ยุบ',
  loading: 'กำลังโหลด',
  search: 'ค้นหา',
  pageReport: 'กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ',
  firstPage: 'หน้าแรก',
  previousPage: 'หน้าก่อน',
  nextPage: 'หน้าถัดไป',
  lastPage: 'หน้าสุดท้าย',
  pageLabel: 'หน้า {page}',
  rowsPerPage: 'จำนวนแถวต่อหน้า',
  navigation: 'เมนู',
  sideNavigation: 'เมนูด้านข้าง',
  collapseMenu: 'ย่อเมนู',
  expandMenu: 'ขยายเมนู',
  selectAll: 'เลือกทั้งหมด',
  total: 'รวม',
  emptyState: {
    nodata: { title: 'ยังไม่มีข้อมูล', description: 'ข้อมูลที่เพิ่มจะแสดงที่นี่' },
    search: { title: 'ไม่พบสิ่งที่ค้นหา', description: 'ลองใช้คำค้นอื่น หรือล้างตัวกรอง' },
    inbox: { title: 'ไม่มีรายการใหม่', description: 'รายการที่เข้ามาใหม่จะแสดงที่นี่' },
    folder: { title: 'ยังไม่มีไฟล์', description: 'อัปโหลดหรือลากไฟล์มาวางเพื่อเริ่มต้น' },
    error: { title: 'โหลดข้อมูลไม่สำเร็จ', description: 'เกิดข้อผิดพลาดระหว่างโหลด โปรดลองใหม่อีกครั้ง' },
    offline: { title: 'ไม่ได้เชื่อมต่ออินเทอร์เน็ต', description: 'ตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง' },
  },
  result: {
    success: { title: 'ทำรายการสำเร็จ', description: '' },
    error: { title: 'ทำรายการไม่สำเร็จ', description: 'โปรดตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง' },
    info: { title: 'แจ้งเพื่อทราบ', description: '' },
    warning: { title: 'โปรดตรวจสอบก่อนดำเนินการต่อ', description: '' },
    '403': { title: 'ไม่มีสิทธิ์เข้าถึงหน้านี้', description: 'บัญชีของคุณไม่มีสิทธิ์ดูหน้านี้ ติดต่อผู้ดูแลระบบหากคิดว่าเป็นความผิดพลาด' },
    '404': { title: 'ไม่พบหน้านี้', description: 'หน้าที่เปิดอาจถูกย้ายหรือลบไปแล้ว ตรวจสอบที่อยู่อีกครั้ง' },
    '500': { title: 'ระบบขัดข้อง', description: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ โปรดลองใหม่ในอีกสักครู่' },
  },
  errorPage: {
    error: 'ข้อผิดพลาด',
    home: 'กลับหน้าแรก',
    back: 'ย้อนกลับ',
    retry: 'ลองอีกครั้ง',
    signIn: 'เข้าสู่ระบบ',
    reference: 'รหัสอ้างอิง',
    codes: {
      '400': { title: 'คำขอไม่ถูกต้อง', description: 'ระบบไม่เข้าใจคำขอนี้ ตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง' },
      '401': { title: 'ต้องเข้าสู่ระบบก่อน', description: 'หน้านี้สำหรับผู้ที่เข้าสู่ระบบแล้ว หรือการเข้าสู่ระบบหมดอายุ โปรดเข้าสู่ระบบอีกครั้ง' },
      '403': { title: 'ไม่มีสิทธิ์เข้าถึงหน้านี้', description: 'บัญชีของคุณไม่มีสิทธิ์ดูหน้านี้ ติดต่อผู้ดูแลระบบหากคิดว่าเป็นความผิดพลาด' },
      '404': { title: 'ไม่พบหน้านี้', description: 'หน้าที่เปิดอาจถูกย้ายหรือลบไปแล้ว ตรวจสอบที่อยู่อีกครั้ง' },
      '405': { title: 'ไม่รองรับการทำรายการนี้', description: 'หน้านี้ไม่รับคำขอแบบที่ส่งมา' },
      '408': { title: 'หมดเวลารอ', description: 'การเชื่อมต่อใช้เวลานานเกินไป ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง' },
      '409': { title: 'ข้อมูลขัดแย้งกัน', description: 'ข้อมูลนี้ถูกแก้ไขไปแล้วระหว่างนั้น โหลดข้อมูลล่าสุดแล้วลองใหม่อีกครั้ง' },
      '410': { title: 'หน้านี้ถูกลบแล้ว', description: 'หน้าที่เปิดไม่มีให้บริการแล้ว' },
      '413': { title: 'ข้อมูลใหญ่เกินไป', description: 'ไฟล์หรือข้อมูลที่ส่งมีขนาดเกินกำหนด ลดขนาดแล้วลองใหม่อีกครั้ง' },
      '415': { title: 'ไม่รองรับไฟล์ชนิดนี้', description: 'เลือกไฟล์ชนิดอื่นแล้วลองใหม่อีกครั้ง' },
      '422': { title: 'ข้อมูลไม่ถูกต้อง', description: 'บางช่องยังไม่ถูกต้อง ตรวจสอบแล้วส่งใหม่อีกครั้ง' },
      '429': { title: 'มีคำขอมากเกินไป', description: 'คุณทำรายการถี่เกินไป รอสักครู่แล้วลองใหม่อีกครั้ง' },
      '500': { title: 'ระบบขัดข้อง', description: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ โปรดลองใหม่ในอีกสักครู่' },
      '501': { title: 'ยังไม่รองรับ', description: 'ระบบยังไม่รองรับการทำรายการนี้' },
      '502': { title: 'เชื่อมต่อระบบปลายทางไม่ได้', description: 'เซิร์ฟเวอร์ได้รับคำตอบที่ไม่ถูกต้องจากระบบอื่น โปรดลองใหม่ในอีกสักครู่' },
      '503': { title: 'ปิดปรับปรุงชั่วคราว', description: 'ระบบกำลังปรับปรุงหรือมีผู้ใช้มาก โปรดกลับมาใหม่ในอีกสักครู่' },
      '504': { title: 'ระบบตอบช้าเกินไป', description: 'ระบบปลายทางไม่ตอบกลับในเวลาที่กำหนด โปรดลองใหม่ในอีกสักครู่' },
      '4xx': { title: 'ทำรายการไม่ได้', description: 'คำขอนี้ไม่สามารถดำเนินการได้ ตรวจสอบแล้วลองใหม่อีกครั้ง' },
      '5xx': { title: 'ระบบขัดข้อง', description: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ โปรดลองใหม่ในอีกสักครู่' },
    },
    kawaii: {
      request: { title: 'เอ๊ะ ไม่ค่อยเข้าใจเลย', description: 'คำขอนี้แปลก ๆ นิดหน่อย ลองตรวจดูอีกทีนะ' },
      auth: { title: 'ขอดูบัตรหน่อยนะ', description: 'เข้าสู่ระบบก่อนแล้วค่อยเข้ามาเล่นด้วยกัน' },
      forbidden: { title: 'ตรงนี้ห้ามเข้านะ', description: 'ประตูนี้ล็อกไว้ ถ้าคิดว่าควรเข้าได้ ลองถามผู้ดูแลดูน้า' },
      missing: { title: 'อุ๊ย! หาหน้านี้ไม่เจอ', description: 'หน้านี้อาจหลงทางไปแล้ว ลองกลับไปตั้งต้นที่หน้าแรกกันนะ' },
      time: { title: 'รอนานจนเผลอหลับ', description: 'เน็ตช้านิดนึง ลองใหม่อีกทีนะ' },
      busy: { title: 'ใจเย็น ๆ ก่อนน้า', description: 'กดถี่จนเหนื่อยแล้ว พักหายใจสักครู่แล้วค่อยลองใหม่' },
      server: { title: 'ระบบมึนหัวนิดหน่อย', description: 'มีอะไรผิดพลาดหลังบ้าน เดี๋ยวก็หาย ลองใหม่อีกสักครู่นะ' },
      gateway: { title: 'สายหลุดไปแป๊บนึง', description: 'ระบบคุยกันไม่รู้เรื่อง ลองใหม่อีกสักครู่นะ' },
      down: { title: 'ขอพักปรับปรุงแป๊บนึง', description: 'กำลังแต่งตัวให้สวยขึ้น กลับมาใหม่เร็ว ๆ นี้นะ' },
    },
  },
  siteFooter: { backToTop: 'กลับขึ้นด้านบน', rights: 'สงวนลิขสิทธิ์' },
  bottombar: 'เมนูหลัก',
  selectedItemsLabel: 'เลือกแล้ว {0} รายการ',
  previewImage: 'ดูภาพขยาย',
  rotateRight: 'หมุนขวา',
  rotateLeft: 'หมุนซ้าย',
  zoomIn: 'ขยาย',
  imageCropper: 'ตัดรูปภาพ',
  language: 'ภาษา',
  cropArea: 'กรอบตัดรูป',
  cropAreaHint: 'ลากหรือใช้ปุ่มลูกศรเพื่อเลื่อนกรอบ กด Alt พร้อมปุ่มลูกศร หรือปุ่ม + และ − เพื่อปรับขนาด',
  zoom: 'ซูม',
  flipHorizontal: 'พลิกซ้าย-ขวา',
  flipVertical: 'พลิกบน-ล่าง',
  resetCrop: 'คืนค่าเดิม',
  imageLoadFailed: 'เปิดรูปภาพไม่ได้',
  zoomOut: 'ย่อ',
  showOptions: 'แสดงตัวเลือกทั้งหมด',
  selectRow: 'เลือกแถวนี้',
  startsWith: 'ขึ้นต้นด้วย',
  contains: 'มีคำว่า',
  notContains: 'ไม่มีคำว่า',
  endsWith: 'ลงท้ายด้วย',
  equals: 'เท่ากับ',
  notEquals: 'ไม่เท่ากับ',
  lt: 'น้อยกว่า',
  lte: 'น้อยกว่าหรือเท่ากับ',
  gt: 'มากกว่า',
  gte: 'มากกว่าหรือเท่ากับ',
  dateIs: 'ตรงกับวันที่',
  dateIsNot: 'ไม่ตรงกับวันที่',
  dateBefore: 'ก่อนวันที่',
  dateAfter: 'หลังวันที่',
  noFilter: 'ไม่กรอง',
  apply: 'ตกลง',
  matchAll: 'ตรงทุกเงื่อนไข',
  matchAny: 'ตรงอย่างน้อยหนึ่งเงื่อนไข',
  addRule: 'เพิ่มเงื่อนไข',
  removeRule: 'ลบเงื่อนไข',
  filter: 'กรองข้อมูล',
  moveUp: 'เลื่อนขึ้น',
  moveTop: 'เลื่อนไปบนสุด',
  moveDown: 'เลื่อนลง',
  moveBottom: 'เลื่อนไปล่างสุด',
  moveToTarget: 'ย้ายไปปลายทาง',
  moveAllToTarget: 'ย้ายทั้งหมดไปปลายทาง',
  moveToSource: 'ย้ายกลับต้นทาง',
  moveAllToSource: 'ย้ายทั้งหมดกลับต้นทาง',
  dropFiles: 'ลากไฟล์มาวางที่นี่ หรือกดปุ่มเลือกไฟล์',
  pending: 'รออัปโหลด',
  completed: 'อัปโหลดแล้ว',
  fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB'],
  invalidFileSize: '{0}: ไฟล์ใหญ่เกินกำหนด (ไม่เกิน {1})',
  invalidFileType: '{0}: ไม่รองรับไฟล์ชนิดนี้ (รองรับ {1})',
  invalidFileLimit: 'เลือกไฟล์ได้ไม่เกิน {0} ไฟล์',
  passwordPrompt: 'กรอกรหัสผ่าน',
  yes: 'ใช่',
  no: 'ไม่ใช่',
  weak: 'อ่อน',
  medium: 'ปานกลาง',
  strong: 'แข็งแรง',
  showPassword: 'แสดงรหัสผ่าน',
  hidePassword: 'ซ่อนรหัสผ่าน',
  hour: 'ชั่วโมง',
  minute: 'นาที',
  second: 'วินาที',
  am: 'AM',
  pm: 'PM',
  chooseDate: 'เลือกวันที่',
  previousMonth: 'เดือนก่อน',
  nextMonth: 'เดือนถัดไป',
  previousYear: 'ปีก่อน',
  nextYear: 'ปีถัดไป',
  previousDecade: 'ช่วงปีก่อนหน้า',
  nextDecade: 'ช่วงปีถัดไป',
  dateFormat: 'd MMMM yyyy',
  previousImage: 'ภาพก่อนหน้า',
  nextImage: 'ภาพถัดไป',
  imageOf: 'ภาพที่ {0} จาก {1}',
  fullScreen: 'เต็มจอ',
  breadcrumb: 'เส้นทาง',
  home: 'หน้าแรก',
  colorPicker: 'เลือกสี',
  hue: 'เฉดสี',
  saturationBrightness: 'ความสดและความสว่างของสี',
  terminalInput: 'พิมพ์คำสั่ง',
  imageCompare: 'เลื่อนเพื่อเปรียบเทียบภาพ',
  carousel: 'ภาพสไลด์',
  slide: 'สไลด์',
  slideOf: 'รายการที่ {0} จาก {1}',
  resizePanels: 'ปรับขนาดช่อง',
  organizationChart: 'ผังองค์กร',
  oneTimeCode: 'รหัสยืนยัน',
  otpCharacter: 'ตัวที่ {0} จาก {1}',
  flowLabel: 'แผนภาพ',
  flowNode: 'โหนด',
  flowEdge: 'เส้นเชื่อม',
  flowSelectedState: 'เลือกอยู่',
  flowPaneHint: 'ลากเพื่อเลื่อนแผนภาพ ใช้ล้อเมาส์หรือสองนิ้วเพื่อซูม กดปุ่มลูกศรเพื่อเลื่อน กด + หรือ − เพื่อซูม และกด Tab เพื่อไปยังโหนดและเส้นเชื่อม',
  flowNodeHint: 'กด Enter หรือ Space เพื่อเลือก ปุ่มลูกศรเพื่อย้ายโหนดที่เลือก (กด Shift ค้างเพื่อย้ายทีละมาก) Delete เพื่อลบ C เพื่อเริ่มเชื่อมต่อ และ Escape เพื่อยกเลิก',
  flowEdgeHint: 'กด Enter หรือ Space เพื่อเลือก และ Delete เพื่อลบ',
  flowControls: 'เครื่องมือแผนภาพ',
  flowZoomIn: 'ซูมเข้า',
  flowZoomOut: 'ซูมออก',
  flowFitView: 'พอดีหน้าจอ',
  flowLock: 'ล็อกการแก้ไข',
  flowUnlock: 'ปลดล็อกการแก้ไข',
  flowMiniMap: 'แผนที่ย่อ',
  flowNodeToolbar: 'เครื่องมือของโหนด',
  flowUndo: 'เลิกทำ',
  flowRedo: 'ทำซ้ำ',
  flowSelected: 'เลือก {nodes} โหนด และ {edges} เส้นเชื่อม',
  flowSelectionCleared: 'ยกเลิกการเลือกแล้ว',
  flowMoved: 'ย้าย {name} ไปที่ {x}, {y}',
  flowMovedMany: 'ย้าย {count} โหนดแล้ว',
  flowResized: 'ปรับขนาด {name} เป็น {width} × {height}',
  flowConnectStart: 'เริ่มเชื่อมต่อจาก {name} ไปที่โหนดปลายทางแล้วกด Enter หรือกด Escape เพื่อยกเลิก',
  flowConnected: 'เชื่อม {source} กับ {target} แล้ว',
  flowConnectCancelled: 'ยกเลิกการเชื่อมต่อ',
  flowConnectInvalid: 'เชื่อมต่อกับ {name} ไม่ได้',
  flowReconnected: 'ย้ายเส้นเชื่อมไปที่ {source} กับ {target} แล้ว',
  flowDeleted: 'ลบ {nodes} โหนด และ {edges} เส้นเชื่อมแล้ว',
  flowEdgeFromTo: 'จาก {source} ไป {target}',
  flowZoomLevel: 'ซูม {zoom}%',
  validation: {
    required: 'กรุณากรอกข้อมูลนี้',
    requiredLabel: 'กรุณากรอก{label}',
    requiredTrue: 'กรุณายืนยันก่อนดำเนินการต่อ',
    email: 'รูปแบบอีเมลไม่ถูกต้อง',
    minlength: 'ต้องมีอย่างน้อย {requiredLength} ตัวอักษร',
    maxlength: 'ยาวได้ไม่เกิน {requiredLength} ตัวอักษร',
    min: 'ต้องไม่น้อยกว่า {min}',
    max: 'ต้องไม่เกิน {max}',
    pattern: 'รูปแบบไม่ถูกต้อง',
    thaiId: 'เลขประจำตัวประชาชนไม่ถูกต้อง',
    phone: 'เบอร์โทรศัพท์ไม่ถูกต้อง',
    mismatch: 'ข้อมูลไม่ตรงกัน',
    invalid: 'ข้อมูลไม่ถูกต้อง',
  },
  editor: {
    toolbar: 'แถบเครื่องมือจัดรูปแบบ',
    undo: 'เลิกทำ',
    redo: 'ทำซ้ำ',
    paragraph: 'ย่อหน้า',
    heading: 'หัวข้อ {0}',
    blockStyle: 'รูปแบบย่อหน้า',
    fontSize: 'ขนาดตัวอักษร',
    fontFamily: 'แบบตัวอักษร',
    defaultFont: 'ค่าเริ่มต้น',
    sizeSmall: 'เล็ก',
    sizeNormal: 'ปกติ',
    sizeLarge: 'ใหญ่',
    sizeHuge: 'ใหญ่มาก',
    bold: 'ตัวหนา',
    italic: 'ตัวเอียง',
    underline: 'ขีดเส้นใต้',
    strike: 'ขีดฆ่า',
    subscript: 'ตัวห้อย',
    superscript: 'ตัวยก',
    code: 'โค้ด',
    color: 'สีตัวอักษร',
    highlight: 'สีพื้นหลังข้อความ',
    removeColor: 'ไม่ใช้สี',
    customColor: 'เลือกสีเอง',
    bulletList: 'รายการจุด',
    orderedList: 'รายการตัวเลข',
    indent: 'เพิ่มการเยื้อง',
    outdent: 'ลดการเยื้อง',
    align: 'จัดแนว',
    alignLeft: 'ชิดซ้าย',
    alignCenter: 'กึ่งกลาง',
    alignRight: 'ชิดขวา',
    alignJustify: 'เต็มบรรทัด',
    link: 'ลิงก์',
    linkUrl: 'ที่อยู่ลิงก์ (URL)',
    linkText: 'ข้อความที่แสดง',
    linkNewTab: 'เปิดในแท็บใหม่',
    openLink: 'เปิดลิงก์',
    editLink: 'แก้ไขลิงก์',
    unlink: 'ยกเลิกลิงก์',
    invalidUrl: 'ที่อยู่ลิงก์ไม่ถูกต้อง',
    apply: 'ตกลง',
    image: 'รูปภาพ',
    imageUpload: 'อัปโหลดรูป',
    imageFromUrl: 'จากลิงก์',
    imageUrl: 'ที่อยู่รูปภาพ (URL)',
    imageAlt: 'คำอธิบายรูป',
    imageDrop: 'ลากรูปมาวางที่นี่ หรือกดเพื่อเลือกรูป',
    imageWidth: 'ความกว้าง',
    imageOriginal: 'ขนาดเดิม',
    imageInline: 'แทรกในบรรทัด',
    imageLeft: 'ชิดซ้าย ข้อความล้อมรอบ',
    imageCenter: 'กึ่งกลาง',
    imageRight: 'ชิดขวา ข้อความล้อมรอบ',
    imageRemove: 'ลบรูป',
    imageResize: 'ลากเพื่อปรับขนาด',
    uploading: 'กำลังอัปโหลดรูป…',
    uploadFailed: 'อัปโหลดรูปไม่สำเร็จ',
    imageTooLarge: '{0}: รูปใหญ่เกินกำหนด (ไม่เกิน {1})',
    imageWrongType: '{0}: ไม่รองรับไฟล์ชนิดนี้',
    table: 'ตาราง',
    insertTable: 'แทรกตาราง',
    tableSize: '{0} × {1}',
    rowAbove: 'แทรกแถวด้านบน',
    rowBelow: 'แทรกแถวด้านล่าง',
    colLeft: 'แทรกคอลัมน์ทางซ้าย',
    colRight: 'แทรกคอลัมน์ทางขวา',
    deleteRow: 'ลบแถว',
    deleteCol: 'ลบคอลัมน์',
    deleteTable: 'ลบตาราง',
    headerRow: 'แถวหัวตาราง',
    mergeRight: 'รวมกับเซลล์ทางขวา',
    mergeDown: 'รวมกับเซลล์ด้านล่าง',
    splitCell: 'แยกเซลล์',
    mergeCells: 'รวมเซลล์ที่เลือก',
    tableRows: 'จำนวนแถว',
    tableCols: 'จำนวนคอลัมน์',
    insert: 'แทรก',
    tableTools: 'เครื่องมือตาราง',
    blockquote: 'ข้อความอ้างอิง',
    codeBlock: 'บล็อกโค้ด',
    hr: 'เส้นคั่น',
    clear: 'ล้างรูปแบบ',
    source: 'ดูโค้ด HTML',
    fullscreen: 'เต็มจอ',
    exitFullscreen: 'ออกจากเต็มจอ',
    words: '{0} คำ',
    characters: '{0} ตัวอักษร',
    content: 'เนื้อหา',
  },
  chat: {
    placeholder: 'พิมพ์ข้อความ',
    send: 'ส่ง',
    attach: 'แนบไฟล์',
    removeFile: 'เอาไฟล์ออก',
    typing: '{name} กำลังพิมพ์',
    typingMany: '{count} คนกำลังพิมพ์',
    read: 'อ่านแล้ว',
    readBy: 'อ่านแล้ว {count}',
    today: 'วันนี้',
    yesterday: 'เมื่อวาน',
    closed: 'ปิดการสนทนาแล้ว',
    emptyTitle: 'ยังไม่มีข้อความ',
    emptyDescription: 'เริ่มพิมพ์ข้อความด้านล่าง',
    loadMore: 'ดูข้อความก่อนหน้า',
    failed: 'ส่งไม่สำเร็จ',
    retry: 'ส่งอีกครั้ง',
    newMessages: 'ข้อความใหม่',
    messages: 'ข้อความ',
  },
  signaturePad: { label: 'ช่องเซ็นชื่อ', hint: 'เซ็นชื่อในกรอบนี้', clear: 'ล้าง', undo: 'ย้อนกลับ' },
  scheduler: {
    today: 'วันนี้',
    previous: 'ก่อนหน้า',
    next: 'ถัดไป',
    day: 'วัน',
    week: 'สัปดาห์',
    month: 'เดือน',
    allDay: 'ทั้งวัน',
    more: 'อีก {count} รายการ',
    noEvents: 'ไม่มีนัดหมาย',
  },
  stat: { up: 'เพิ่มขึ้น', down: 'ลดลง', same: 'เท่าเดิม' },
};

export const EN_LOCALE: WuLocale = {
  code: 'en',
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  firstDayOfWeek: 0,
  today: 'Today',
  clear: 'Clear',
  accept: 'Yes',
  reject: 'No',
  cancel: 'Cancel',
  choose: 'Choose',
  upload: 'Upload',
  emptyMessage: 'No records found',
  emptyFilterMessage: 'No results found',
  weekHeader: 'Wk',
  close: 'Close',
  remove: 'Remove',
  expand: 'Expand',
  collapse: 'Collapse',
  loading: 'Loading',
  search: 'Search',
  pageReport: 'Showing {first} to {last} of {totalRecords} entries',
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  pageLabel: 'Page {page}',
  rowsPerPage: 'Rows per page',
  navigation: 'Menu',
  sideNavigation: 'Side menu',
  collapseMenu: 'Collapse menu',
  expandMenu: 'Expand menu',
  selectAll: 'Select all',
  total: 'Total',
  emptyState: {
    nodata: { title: 'No data yet', description: 'What you add will show up here' },
    search: { title: 'No results found', description: 'Try other words or clear the filters' },
    inbox: { title: 'Nothing new', description: 'New items will show up here' },
    folder: { title: 'No files yet', description: 'Upload or drop files to get started' },
    error: { title: 'Could not load the data', description: 'Something went wrong while loading. Please try again.' },
    offline: { title: 'You are offline', description: 'Check your connection and try again' },
  },
  result: {
    success: { title: 'Done', description: '' },
    error: { title: 'Something went wrong', description: 'Please check the details and try again.' },
    info: { title: 'For your information', description: '' },
    warning: { title: 'Please check before you go on', description: '' },
    '403': { title: 'You do not have access', description: 'Your account cannot open this page. Ask an administrator if this looks wrong.' },
    '404': { title: 'Page not found', description: 'It may have moved or been removed. Check the address.' },
    '500': { title: 'Something went wrong on our side', description: 'The server ran into an error. Please try again in a moment.' },
  },
  errorPage: {
    error: 'Error',
    home: 'Go to the home page',
    back: 'Go back',
    retry: 'Try again',
    signIn: 'Sign in',
    reference: 'Reference',
    codes: {
      '400': { title: 'Bad request', description: 'The request could not be understood. Check the details and try again.' },
      '401': { title: 'Please sign in', description: 'This page is for signed-in users, or your sign-in has expired. Sign in again to go on.' },
      '403': { title: 'You do not have access', description: 'Your account cannot open this page. Ask an administrator if this looks wrong.' },
      '404': { title: 'Page not found', description: 'It may have moved or been removed. Check the address.' },
      '405': { title: 'Not allowed here', description: 'This page does not take that kind of request.' },
      '408': { title: 'The request timed out', description: 'The connection took too long. Check your internet and try again.' },
      '409': { title: 'Changed in the meantime', description: 'Someone changed this while you were working. Load the latest and try again.' },
      '410': { title: 'This page is gone', description: 'The page you opened is no longer available.' },
      '413': { title: 'Too large', description: 'The file or data sent is over the size limit. Make it smaller and try again.' },
      '415': { title: 'File type not supported', description: 'Pick another kind of file and try again.' },
      '422': { title: 'Some details are not right', description: 'A few fields need another look. Check them and send again.' },
      '429': { title: 'Too many requests', description: 'That was a lot in a short time. Wait a moment and try again.' },
      '500': { title: 'Something went wrong on our side', description: 'The server ran into an error. Please try again in a moment.' },
      '501': { title: 'Not supported yet', description: 'This is not something the system can do yet.' },
      '502': { title: 'Could not reach the service', description: 'The server got a bad answer from another system. Please try again in a moment.' },
      '503': { title: 'Down for maintenance', description: 'The system is being updated or is very busy. Please come back in a little while.' },
      '504': { title: 'The service took too long', description: 'Another system did not answer in time. Please try again in a moment.' },
      '4xx': { title: 'That did not work', description: 'This request cannot be carried out. Check it and try again.' },
      '5xx': { title: 'Something went wrong on our side', description: 'The server ran into an error. Please try again in a moment.' },
    },
    kawaii: {
      request: { title: 'Hmm, that looks odd', description: 'Something about this request is a bit off. Give it another look?' },
      auth: { title: 'Show me your pass, please', description: 'Sign in first, then come on in and play.' },
      forbidden: { title: 'No entry here!', description: 'This door is locked. If you should be inside, ask an admin nicely.' },
      missing: { title: 'Oops! This page wandered off', description: 'It got lost somewhere. Let’s start again from the home page.' },
      time: { title: 'I waited so long I dozed off', description: 'The connection is a little slow. Try once more?' },
      busy: { title: 'Easy there!', description: 'So many taps, I am out of breath. Take a little break and try again.' },
      server: { title: 'Feeling a bit dizzy', description: 'Something went wrong behind the scenes. It will pass, try again soon.' },
      gateway: { title: 'Something came unplugged', description: 'Our systems are not talking right now. Try again in a moment.' },
      down: { title: 'Taking a little break', description: 'Getting a makeover. Back very soon!' },
    },
  },
  siteFooter: { backToTop: 'Back to top', rights: 'All rights reserved.' },
  bottombar: 'Main menu',
  selectedItemsLabel: '{0} items selected',
  previewImage: 'View larger image',
  rotateRight: 'Rotate right',
  rotateLeft: 'Rotate left',
  zoomIn: 'Zoom in',
  imageCropper: 'Image cropper',
  language: 'Language',
  cropArea: 'Crop area',
  cropAreaHint: 'Drag or use the arrow keys to move the box; Alt with the arrow keys, or + and −, resizes it',
  zoom: 'Zoom',
  flipHorizontal: 'Flip horizontally',
  flipVertical: 'Flip vertically',
  resetCrop: 'Reset',
  imageLoadFailed: 'The image could not be opened',
  zoomOut: 'Zoom out',
  showOptions: 'Show all options',
  selectRow: 'Select this row',
  startsWith: 'Starts with',
  contains: 'Contains',
  notContains: 'Does not contain',
  endsWith: 'Ends with',
  equals: 'Equals',
  notEquals: 'Not equals',
  lt: 'Less than',
  lte: 'Less than or equal to',
  gt: 'Greater than',
  gte: 'Greater than or equal to',
  dateIs: 'Date is',
  dateIsNot: 'Date is not',
  dateBefore: 'Date is before',
  dateAfter: 'Date is after',
  noFilter: 'No filter',
  apply: 'Apply',
  matchAll: 'Match all',
  matchAny: 'Match any',
  addRule: 'Add rule',
  removeRule: 'Remove rule',
  filter: 'Filter',
  moveUp: 'Move up',
  moveTop: 'Move to top',
  moveDown: 'Move down',
  moveBottom: 'Move to bottom',
  moveToTarget: 'Move to target',
  moveAllToTarget: 'Move all to target',
  moveToSource: 'Move to source',
  moveAllToSource: 'Move all to source',
  dropFiles: 'Drag and drop files here, or use the Choose button',
  pending: 'Pending',
  completed: 'Completed',
  fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB'],
  invalidFileSize: '{0}: the file is too large (the limit is {1})',
  invalidFileType: '{0}: this file type is not allowed (allowed: {1})',
  invalidFileLimit: 'You can choose at most {0} files',
  passwordPrompt: 'Enter a password',
  yes: 'Yes',
  no: 'No',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  am: 'AM',
  pm: 'PM',
  chooseDate: 'Choose date',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  previousDecade: 'Previous years',
  nextDecade: 'Next years',
  dateFormat: 'MMM d, yyyy',
  previousImage: 'Previous image',
  nextImage: 'Next image',
  imageOf: 'Image {0} of {1}',
  fullScreen: 'Full screen',
  breadcrumb: 'Breadcrumb',
  home: 'Home',
  colorPicker: 'Choose a colour',
  hue: 'Hue',
  saturationBrightness: 'Saturation and brightness',
  terminalInput: 'Command',
  imageCompare: 'Image comparison',
  carousel: 'carousel',
  slide: 'slide',
  slideOf: '{0} of {1}',
  resizePanels: 'Resize panels',
  organizationChart: 'Organization chart',
  oneTimeCode: 'One-time code',
  otpCharacter: 'Character {0} of {1}',
  flowLabel: 'Diagram',
  flowNode: 'node',
  flowEdge: 'edge',
  flowSelectedState: 'selected',
  flowPaneHint: 'Drag to pan, use the mouse wheel or two fingers to zoom, the arrow keys to pan, + and − to zoom, and Tab to move between nodes and edges',
  flowNodeHint: 'Enter or Space selects; the arrow keys move the selected nodes (hold Shift for bigger steps); Delete removes; C starts a connection; Escape cancels',
  flowEdgeHint: 'Enter or Space selects; Delete removes',
  flowControls: 'Diagram controls',
  flowZoomIn: 'Zoom in',
  flowZoomOut: 'Zoom out',
  flowFitView: 'Fit view',
  flowLock: 'Lock editing',
  flowUnlock: 'Unlock editing',
  flowMiniMap: 'Mini map',
  flowNodeToolbar: 'Node toolbar',
  flowUndo: 'Undo',
  flowRedo: 'Redo',
  flowSelected: 'Selected {nodes} nodes and {edges} edges',
  flowSelectionCleared: 'Selection cleared',
  flowMoved: 'Moved {name} to {x}, {y}',
  flowMovedMany: 'Moved {count} nodes',
  flowResized: 'Resized {name} to {width} × {height}',
  flowConnectStart: 'Connecting from {name}: move to the target node and press Enter, or press Escape to cancel',
  flowConnected: 'Connected {source} to {target}',
  flowConnectCancelled: 'Connection cancelled',
  flowConnectInvalid: 'Cannot connect to {name}',
  flowReconnected: 'Edge moved to {source} and {target}',
  flowDeleted: 'Deleted {nodes} nodes and {edges} edges',
  flowEdgeFromTo: 'From {source} to {target}',
  flowZoomLevel: 'Zoom {zoom}%',
  validation: {
    required: 'This field is required',
    requiredLabel: '{label} is required',
    requiredTrue: 'Please confirm to continue',
    email: 'Enter a valid email address',
    minlength: 'Use at least {requiredLength} characters',
    maxlength: 'Use at most {requiredLength} characters',
    min: 'Must be at least {min}',
    max: 'Must be at most {max}',
    pattern: 'The format is not valid',
    thaiId: 'Not a valid Thai ID number',
    phone: 'Not a valid phone number',
    mismatch: 'The values do not match',
    invalid: 'This value is not valid',
  },
  editor: {
    toolbar: 'Formatting toolbar',
    undo: 'Undo',
    redo: 'Redo',
    paragraph: 'Paragraph',
    heading: 'Heading {0}',
    blockStyle: 'Block style',
    fontSize: 'Font size',
    fontFamily: 'Font',
    defaultFont: 'Default',
    sizeSmall: 'Small',
    sizeNormal: 'Normal',
    sizeLarge: 'Large',
    sizeHuge: 'Huge',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strike: 'Strikethrough',
    subscript: 'Subscript',
    superscript: 'Superscript',
    code: 'Code',
    color: 'Text colour',
    highlight: 'Highlight',
    removeColor: 'No colour',
    customColor: 'Custom colour',
    bulletList: 'Bulleted list',
    orderedList: 'Numbered list',
    indent: 'Increase indent',
    outdent: 'Decrease indent',
    align: 'Align',
    alignLeft: 'Align left',
    alignCenter: 'Align centre',
    alignRight: 'Align right',
    alignJustify: 'Justify',
    link: 'Link',
    linkUrl: 'Link address (URL)',
    linkText: 'Text to show',
    linkNewTab: 'Open in a new tab',
    openLink: 'Open link',
    editLink: 'Edit link',
    unlink: 'Remove link',
    invalidUrl: 'This link address is not allowed',
    apply: 'Apply',
    image: 'Image',
    imageUpload: 'Upload',
    imageFromUrl: 'From a link',
    imageUrl: 'Image address (URL)',
    imageAlt: 'Alternative text',
    imageDrop: 'Drop an image here, or click to choose one',
    imageWidth: 'Width',
    imageOriginal: 'Original size',
    imageInline: 'In line with text',
    imageLeft: 'Left, text wraps',
    imageCenter: 'Centred',
    imageRight: 'Right, text wraps',
    imageRemove: 'Remove image',
    imageResize: 'Drag to resize',
    uploading: 'Uploading image…',
    uploadFailed: 'The image could not be uploaded',
    imageTooLarge: '{0}: the image is too large (the limit is {1})',
    imageWrongType: '{0}: this file type is not supported',
    table: 'Table',
    insertTable: 'Insert table',
    tableSize: '{0} × {1}',
    rowAbove: 'Insert row above',
    rowBelow: 'Insert row below',
    colLeft: 'Insert column left',
    colRight: 'Insert column right',
    deleteRow: 'Delete row',
    deleteCol: 'Delete column',
    deleteTable: 'Delete table',
    headerRow: 'Header row',
    mergeRight: 'Merge cell right',
    mergeDown: 'Merge cell down',
    splitCell: 'Split cell',
    mergeCells: 'Merge selected cells',
    tableRows: 'Rows',
    tableCols: 'Columns',
    insert: 'Insert',
    tableTools: 'Table tools',
    blockquote: 'Block quote',
    codeBlock: 'Code block',
    hr: 'Horizontal line',
    clear: 'Clear formatting',
    source: 'Source',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    words: '{0} words',
    characters: '{0} characters',
    content: 'Content',
  },
  chat: {
    placeholder: 'Type a message',
    send: 'Send',
    attach: 'Attach files',
    removeFile: 'Remove file',
    typing: '{name} is typing',
    typingMany: '{count} people are typing',
    read: 'Read',
    readBy: 'Read by {count}',
    today: 'Today',
    yesterday: 'Yesterday',
    closed: 'This conversation is closed',
    emptyTitle: 'No messages yet',
    emptyDescription: 'Start typing below',
    loadMore: 'Earlier messages',
    failed: 'Not sent',
    retry: 'Send again',
    newMessages: 'New messages',
    messages: 'Messages',
  },
  signaturePad: { label: 'Signature', hint: 'Sign in the box', clear: 'Clear', undo: 'Undo' },
  scheduler: {
    today: 'Today',
    previous: 'Previous',
    next: 'Next',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    allDay: 'All day',
    more: '+{count} more',
    noEvents: 'No events',
  },
  stat: { up: 'Up', down: 'Down', same: 'No change' },
};

export const LOCALES: Record<string, WuLocale> = { th: TH_LOCALE, en: EN_LOCALE };
