/** UI strings components read. Keys follow PrimeNG's translation object so migrating apps can reuse theirs. */
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
  /** Default display pattern, see `formatDate()`. */
  dateFormat: string;
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
  dateFormat: 'd MMMM yyyy',
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
  dateFormat: 'MMM d, yyyy',
};

export const LOCALES: Record<string, WtLocale> = { th: TH_LOCALE, en: EN_LOCALE };
