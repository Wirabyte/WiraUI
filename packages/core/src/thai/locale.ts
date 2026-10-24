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
  /**
   * Form error messages, by validator key. `{label}` is the field's name when one is given (`requiredLabel`),
   * `{requiredLength}`, `{min}`, `{max}` come from the error.
   */
  validation: WtValidationMessages;
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
};

export const LOCALES: Record<string, WtLocale> = { th: TH_LOCALE, en: EN_LOCALE };
