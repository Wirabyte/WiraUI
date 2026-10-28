import { ComponentDoc } from '../core/component-doc';
import { row } from './doc-helpers';

export const THAI_DOC: ComponentDoc = {
  id: 'thai',
  title: 'Thai pipes',
  group: 'Helpers',
  entry: 'thai',
  standalone: 'WtDatePipe, WtBahtTextPipe',
  module: 'WtThaiModule',
  selector: 'wtDate · wtTimeAgo · wtBahtText · wtThaiPhone · wtThaiId · wtThaiDigits',
  description: {
    th: 'pipe สำหรับงานไทยที่ทุกแอปเขียนเองซ้ำ ๆ: วันที่ พ.ศ. ตามภาษาของแอป, เวลาที่ผ่านมา, จำนวนเงินเป็นตัวอักษรแบบ BAHTTEXT ของ Excel, เบอร์โทรและเลขบัตรประชาชนที่มีขีด และเลขไทย',
    en: 'Pipes for the Thai details every app ends up writing: dates with Buddhist years in the app’s language, time ago, amounts in Thai words like Excel’s BAHTTEXT, phone and ID numbers with dashes, and Thai digits.',
  },
  english: {
    'วันเกิด': 'Birthday',
    'ส่งเมื่อ': 'Sent',
    'จำนวนเงิน': 'Amount',
    'เบอร์โทร': 'Phone',
    'เลขบัตรประชาชน': 'National ID',
    'ปีการศึกษา': 'Academic year',
    "'เวลา'": "'at'",
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'NgModule: <code>WtThaiModule</code> ได้ทุก pipe · standalone: import เฉพาะ pipe ที่ใช้ (<code>WtDatePipe</code>, <code>WtTimeAgoPipe</code>, <code>WtBahtTextPipe</code>, <code>WtThaiPhonePipe</code>, <code>WtThaiIdPipe</code>, <code>WtThaiDigitsPipe</code>) · ฟังก์ชันเบื้องหลังใช้ในโค้ดได้เลย: <code>bahtText()</code>, <code>formatThaiPhone()</code>, <code>toThaiDigits()</code>, <code>timeAgo()</code>',
        en: 'NgModule: <code>WtThaiModule</code> brings every pipe · standalone: import the pipes you use (<code>WtDatePipe</code>, <code>WtTimeAgoPipe</code>, <code>WtBahtTextPipe</code>, <code>WtThaiPhonePipe</code>, <code>WtThaiIdPipe</code>, <code>WtThaiDigitsPipe</code>) · the functions behind them work in code too: <code>bahtText()</code>, <code>formatThaiPhone()</code>, <code>toThaiDigits()</code>, <code>timeAgo()</code>.',
      },
    },
    date: {
      title: { th: 'วันที่ (wtDate)', en: 'Dates (wtDate)' },
      text: {
        th: '<code>{{ value | wtDate }}</code> รับ <code>Date</code>, เวลาเป็น ms หรือข้อความ (<code>\'2012-05-14\'</code> คือวันนั้นตามเวลาเครื่อง ไม่เลื่อนวันแบบ UTC) · รูปแบบที่ตั้งชื่อไว้: <code>short</code>, <code>medium</code> (ค่าเริ่มต้น), <code>long</code>, <code>full</code>, <code>time</code>, <code>shortDateTime</code>, <code>dateTime</code> หรือเขียน pattern เอง: <code>d</code> <code>dd</code> <code>M</code> <code>MM</code> <code>MMM</code> <code>MMMM</code> <code>yy</code> <code>yyyy</code> <code>EEE</code> <code>EEEE</code> <code>HH</code> <code>mm</code> <code>ss</code> และข้อความใน <code>\'…\'</code>',
        en: '<code>{{ value | wtDate }}</code> takes a <code>Date</code>, a time in ms or text (<code>\'2012-05-14\'</code> is that day in local time, not shifted by UTC) · named formats: <code>short</code>, <code>medium</code> (default), <code>long</code>, <code>full</code>, <code>time</code>, <code>shortDateTime</code>, <code>dateTime</code>, or a pattern of your own: <code>d</code> <code>dd</code> <code>M</code> <code>MM</code> <code>MMM</code> <code>MMMM</code> <code>yy</code> <code>yyyy</code> <code>EEE</code> <code>EEEE</code> <code>HH</code> <code>mm</code> <code>ss</code> and text in <code>\'…\'</code>.',
      },
    },
    calendar: {
      title: { th: 'ปฏิทินและภาษา', en: 'Calendar and language' },
      text: {
        th: 'ภาษามาจากแอป (เปลี่ยนตาม <code>wt-language-switch</code> ทันที) · ภาษาไทยใช้ปฏิทินตาม <code>provideWiraTheme({ calendar })</code> (ค่าเริ่มต้น พ.ศ.) ภาษาอื่นใช้ ค.ศ. · กำหนดเองได้ทีละที่: <code>wtDate: \'long\' : \'gregorian\'</code> หรือ <code>wtDate: \'long\' : null : \'en\'</code>',
        en: 'The language is the app’s (it follows <code>wt-language-switch</code> at once) · Thai uses the calendar of <code>provideWiraTheme({ calendar })</code> (Buddhist by default), other languages the Gregorian one · set either per use: <code>wtDate: \'long\' : \'gregorian\'</code> or <code>wtDate: \'long\' : null : \'en\'</code>.',
      },
    },
    timeago: {
      title: { th: 'เวลาที่ผ่านมา (wtTimeAgo)', en: 'Time ago (wtTimeAgo)' },
      text: {
        th: '<code>{{ sentAt | wtTimeAgo }}</code> เป็น "5 นาทีที่ผ่านมา", "เมื่อวาน", "ในอีก 3 วัน" ตามภาษาของแอป (ใช้ <code>Intl.RelativeTimeFormat</code> ของเบราว์เซอร์) · ต่ำกว่าหนึ่งนาทีเป็น "ขณะนี้" · คำนวณใหม่ทุกครั้งที่หน้าวาดใหม่ ไม่ตั้ง timer เอง',
        en: '<code>{{ sentAt | wtTimeAgo }}</code> gives "5 minutes ago", "yesterday", "in 3 days" in the app’s language (the browser’s <code>Intl.RelativeTimeFormat</code>) · under a minute is "now" · it is worked out again whenever the view renders; it sets no timer of its own.',
      },
    },
    baht: {
      title: { th: 'จำนวนเงินเป็นตัวอักษร (wtBahtText)', en: 'Amounts in words (wtBahtText)' },
      text: {
        th: '<code>{{ total | wtBahtText }}</code> เขียนจำนวนเงินเป็นตัวอักษรไทยแบบเดียวกับ <code>BAHTTEXT</code> ของ Excel (ตรวจกับ Excel แล้ว): เอ็ด ยี่ ล้านล้าน ถ้วน สตางค์ ติดลบ · ปัดสตางค์เป็นสองตำแหน่ง · รับข้อความที่มี <code>,</code> หรือ <code>฿</code> ได้',
        en: '<code>{{ total | wtBahtText }}</code> writes the amount in Thai words the way Excel’s <code>BAHTTEXT</code> does (checked against Excel): เอ็ด, ยี่, ล้านล้าน, ถ้วน, satang, negatives · satang round to two places · text with <code>,</code> or <code>฿</code> works.',
      },
    },
    numbers: {
      title: { th: 'เบอร์โทร เลขบัตร และเลขไทย', en: 'Phones, IDs and Thai digits' },
      text: {
        th: '<code>wtThaiPhone</code> ใส่ขีดตามชนิดเบอร์ (มือถือ 081-234-5678, กรุงเทพฯ 02-123-4567, ต่างจังหวัด 053-123-456, <code>+66</code> เป็น 0) ตัวคั่นอื่นส่งเป็น argument ได้ · <code>wtThaiId</code> เลขบัตรประชาชน 1-2345-67890-12-3 · <code>wtThaiDigits</code> เปลี่ยนเลขเป็นเลขไทย ต่อท้าย pipe อื่นได้',
        en: '<code>wtThaiPhone</code> adds dashes by kind of number (mobile 081-234-5678, Bangkok 02-123-4567, other areas 053-123-456, <code>+66</code> becomes 0); another separator can be passed · <code>wtThaiId</code> national IDs 1-2345-67890-12-3 · <code>wtThaiDigits</code> turns digits into Thai digits, after another pipe too.',
      },
    },
  },
  code: {
    date: `<p>{{ born | wtDate }}</p>                  <!-- medium -->
<p>{{ born | wtDate: 'short' }}</p>
<p>{{ born | wtDate: 'long' }}</p>
<p>{{ born | wtDate: 'full' }}</p>
<p>{{ sentAt | wtDate: 'dateTime' }}</p>
<p>{{ sentAt | wtDate: "EEEE d MMM yy 'เวลา' HH:mm" }}</p>
<p>{{ '2012-05-14' | wtDate: 'long' }}</p>`,
    calendar: `<p>{{ born | wtDate: 'long' : 'gregorian' }}</p>
<p>{{ born | wtDate: 'long' : null : 'en' }}</p>`,
    timeago: `<p>{{ sentAt | wtTimeAgo }}</p>`,
    baht: `<wt-inputnumber [(ngModel)]="amount" mode="decimal" [minFractionDigits]="2"></wt-inputnumber>
<p>{{ amount | wtBahtText }}</p>`,
    numbers: `<p>{{ '0812345678' | wtThaiPhone }}</p>
<p>{{ '+66 2 123 4567' | wtThaiPhone }}</p>
<p>{{ '1103702345679' | wtThaiId }}</p>
<p>{{ born | wtDate: 'long' | wtThaiDigits }}</p>`,
  },
  ts: {
    date: `born = new Date(2012, 4, 14);
sentAt = new Date(Date.now() - 5 * 60 * 1000);`,
    baht: `amount = 1250.5;`,
  },
  api: [
    {
      id: 'api-pipes',
      title: 'Pipes',
      typeLabel: { th: 'อาร์กิวเมนต์', en: 'Arguments' },
      rows: [
        row('wtDate', "format = 'medium' : calendar? : lang?", undefined, 'วันที่ตามภาษาของแอป (พ.ศ. ในภาษาไทย)', 'A date in the app’s language (Buddhist years in Thai)'),
        row('wtTimeAgo', 'lang?', undefined, 'เวลาที่ผ่านมาหรือที่จะถึง', 'Time ago or to come'),
        row('wtBahtText', '—', undefined, 'จำนวนเงินเป็นตัวอักษรไทย (BAHTTEXT)', 'An amount in Thai words (BAHTTEXT)'),
        row('wtThaiPhone', "separator = '-'", undefined, 'เบอร์โทรไทยที่มีขีด', 'A Thai phone number with dashes'),
        row('wtThaiId', '—', undefined, 'เลขบัตรประชาชนที่มีขีด', 'A national ID with dashes'),
        row('wtThaiDigits', '—', undefined, 'เลขไทย', 'Thai digits'),
      ],
    },
    {
      id: 'api-formats',
      title: { th: 'รูปแบบของ wtDate', en: 'wtDate formats' },
      typeLabel: { th: 'ภาษาไทย', en: 'Thai' },
      rows: [
        row('short', '14/05/2555', undefined, 'dd/MM/yyyy', 'dd/MM/yyyy'),
        row('medium', '14 พ.ค. 2555', undefined, 'd MMM yyyy (ค่าเริ่มต้น)', 'd MMM yyyy (default)'),
        row('long', '14 พฤษภาคม 2555', undefined, 'd MMMM yyyy', 'd MMMM yyyy'),
        row('full', 'วันจันทร์ที่ 14 พฤษภาคม พ.ศ. 2555', undefined, 'ภาษาอังกฤษ: Monday, 14 May 2012', 'English: Monday, 14 May 2012'),
        row('time', '09:30 น.', undefined, 'HH:mm (ภาษาอังกฤษไม่มี น.)', 'HH:mm (no น. in English)'),
        row('shortDateTime · dateTime', '14/05/2555 09:30 · 14 พ.ค. 2555 09:30 น.', undefined, 'วันที่และเวลา', 'Date and time'),
      ],
    },
  ],
  tokens: [],
  themingNote: { th: 'pipe ไม่มีหน้าตาของตัวเอง', en: 'Pipes have no look of their own.' },
};
