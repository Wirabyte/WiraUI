/** UI strings components read. Keys follow the translation object shape apps already use, so migrating apps can reuse theirs. */
export interface WtLocale {
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
  /** wt-aside-menu: the side menu's landmark and its collapse button. */
  sideNavigation: string;
  collapseMenu: string;
  expandMenu: string;
  selectAll: string;
  /** Multi-select field once more are chosen than it lists; {0} is the count. */
  selectedItemsLabel: string;
  /** Image preview: the button over the picture and the full-screen toolbar. */
  previewImage: string;
  rotateRight: string;
  rotateLeft: string;
  zoomIn: string;
  /** wt-imagecropper */
  imageCropper: string;
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
  /**
   * Form error messages, by validator key. `{label}` is the field's name when one is given (`requiredLabel`),
   * `{requiredLength}`, `{min}`, `{max}` come from the error.
   */
  validation: WtValidationMessages;
  /** Rich-text editor: toolbar labels, menus and dialogs. `{0}` / `{1}` are filled in (a level, a size, a count). */
  editor: WtEditorMessages;
}

export interface WtEditorMessages {
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

export interface WtValidationMessages {
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

export const TH_LOCALE: WtLocale = {
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
  selectedItemsLabel: 'เลือกแล้ว {0} รายการ',
  previewImage: 'ดูภาพขยาย',
  rotateRight: 'หมุนขวา',
  rotateLeft: 'หมุนซ้าย',
  zoomIn: 'ขยาย',
  imageCropper: 'ตัดรูปภาพ',
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
};

export const EN_LOCALE: WtLocale = {
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
  selectedItemsLabel: '{0} items selected',
  previewImage: 'View larger image',
  rotateRight: 'Rotate right',
  rotateLeft: 'Rotate left',
  zoomIn: 'Zoom in',
  imageCropper: 'Image cropper',
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
};

export const LOCALES: Record<string, WtLocale> = { th: TH_LOCALE, en: EN_LOCALE };
