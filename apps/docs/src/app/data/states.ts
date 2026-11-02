import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

export const EMPTYSTATE_DOC: ComponentDoc = {
  id: 'emptystate',
  title: 'EmptyState',
  group: 'Feedback',
  entry: 'emptystate',
  standalone: 'WuEmptyState',
  module: 'WuEmptyStateModule',
  selector: 'wu-empty-state',
  description: {
    th: 'สิ่งที่แสดงเมื่อรายการ ตาราง หรือหน้าไม่มีอะไรเลย: ภาพวาดในสีของธีม หัวข้อ คำอธิบาย และปุ่มให้ทำต่อ มี 6 แบบ (ไม่มีข้อมูล ค้นไม่พบ กล่องว่าง โฟลเดอร์ว่าง โหลดไม่สำเร็จ ไม่มีอินเทอร์เน็ต) ข้อความเริ่มต้นเปลี่ยนตามภาษาของแอป',
    en: 'What a list, table or page shows when there is nothing in it: a drawing in the theme’s colours, a title, a line under it and buttons to go on. Six kinds (no data, nothing found, empty inbox, empty folder, failed load, offline), with default text in the app’s language.',
  },
  english: {
    'เพิ่มนักเรียน': 'Add a student',
    'ล้างตัวกรอง': 'Clear filters',
    'ลองใหม่': 'Try again',
    'นำเข้าจาก Excel': 'Import from Excel',
    'ยังไม่มีนักเรียนในห้องนี้': 'No students in this class yet',
    'เพิ่มนักเรียนทีละคน หรือนำเข้าจากไฟล์ Excel': 'Add students one by one, or import them from an Excel file',
    'ยังไม่มีการแจ้งเตือน': 'No notifications yet',
    'รหัส': 'ID',
    'ชื่อ - สกุล': 'Name',
    'ห้อง': 'Class',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuEmptyStateModule</code>) และ standalone (<code>WuEmptyState</code>) · ชื่อ tag <code>wu-empty-state</code>, <code>wu-emptyState</code> และ <code>wu-empty</code> ใช้ได้เหมือนกัน',
        en: 'Works as an NgModule (<code>WuEmptyStateModule</code>) or standalone (<code>WuEmptyState</code>) · the tags <code>wu-empty-state</code>, <code>wu-emptyState</code> and <code>wu-empty</code> are the same component.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ใส่ tag เปล่า ๆ ก็ได้ภาพ หัวข้อ และคำอธิบายของแบบ <code>nodata</code> ในภาษาของแอป (ไทย / อังกฤษตาม locale) · สีของภาพมาจากธีม จึงเข้ากับทุก preset และโหมดมืด',
        en: 'The bare tag gives the <code>nodata</code> drawing, title and line in the app’s language (Thai or English by locale) · the drawing takes the theme’s colours, so it fits every preset and dark mode.',
      },
    },
    types: {
      title: { th: 'แบบต่าง ๆ', en: 'Kinds' },
      text: {
        th: '<code>type</code> เลือกภาพและข้อความเริ่มต้น: <code>nodata</code> (ค่าเริ่มต้น), <code>search</code> ค้นไม่พบ, <code>inbox</code> ไม่มีรายการใหม่, <code>folder</code> ยังไม่มีไฟล์, <code>error</code> โหลดไม่สำเร็จ และ <code>offline</code> ไม่มีอินเทอร์เน็ต',
        en: '<code>type</code> picks the drawing and default text: <code>nodata</code> (default), <code>search</code> nothing found, <code>inbox</code> nothing new, <code>folder</code> no files yet, <code>error</code> a failed load and <code>offline</code> no connection.',
      },
    },
    actions: {
      title: { th: 'ปุ่มให้ทำต่อ', en: 'Actions' },
      text: {
        th: 'สิ่งที่อยู่ใน tag จะเรียงเป็นแถวปุ่มใต้ข้อความ (ขึ้นบรรทัดใหม่บนจอแคบ) · <code>title</code> และ <code>description</code> แทนข้อความเริ่มต้น ใส่ <code>\'\'</code> เพื่อไม่แสดง',
        en: 'Whatever is inside the tag lines up as a row of actions under the text (wrapping on narrow screens) · <code>title</code> and <code>description</code> replace the default text; <code>\'\'</code> hides one.',
      },
    },
    picture: {
      title: { th: 'ไอคอนหรือรูปของแอป', en: 'Your own icon or picture' },
      text: {
        th: '<code>icon</code> แสดงไอคอน (class เช่น <code>wi wi-bell</code>) ในวงกลมสีอ่อนแทนภาพวาด · <code>image</code> ใช้รูปของแอป (<code>imageAlt</code> ถ้ารูปมีความหมาย) · <code>[showImage]="false"</code> เหลือแค่ข้อความ',
        en: '<code>icon</code> shows an icon (a class such as <code>wi wi-bell</code>) in a soft circle instead of the drawing · <code>image</code> uses a picture of your own (<code>imageAlt</code> if it means something) · <code>[showImage]="false"</code> keeps only the text.',
      },
    },
    table: {
      title: { th: 'ในตารางและการ์ด', en: 'In tables and cards' },
      text: {
        th: '<code>size="small"</code> ภาพและข้อความเล็กลงให้พอดีกับแถวว่างของ <code>wu-table</code> (template <code>emptymessage</code>) หรือในการ์ด · <code>size="large"</code> สำหรับทั้งหน้า',
        en: '<code>size="small"</code> shrinks the drawing and text to fit a <code>wu-table</code> empty row (the <code>emptymessage</code> template) or a card · <code>size="large"</code> for a whole page.',
      },
    },
  },
  code: {
    basic: `<wu-empty-state></wu-empty-state>`,
    types: `<wu-empty-state type="nodata"></wu-empty-state>
<wu-empty-state type="search"></wu-empty-state>
<wu-empty-state type="inbox"></wu-empty-state>
<wu-empty-state type="folder"></wu-empty-state>
<wu-empty-state type="error"></wu-empty-state>
<wu-empty-state type="offline"></wu-empty-state>`,
    actions: `<wu-empty-state title="ยังไม่มีนักเรียนในห้องนี้" description="เพิ่มนักเรียนทีละคน หรือนำเข้าจากไฟล์ Excel">
  <wu-button label="เพิ่มนักเรียน" icon="wi wi-plus"></wu-button>
  <wu-button label="นำเข้าจาก Excel" icon="wi wi-file-excel" severity="secondary" [outlined]="true"></wu-button>
</wu-empty-state>

<wu-empty-state type="search">
  <wu-button label="ล้างตัวกรอง" severity="secondary" [text]="true"></wu-button>
</wu-empty-state>`,
    picture: `<wu-empty-state icon="wi wi-bell" title="ยังไม่มีการแจ้งเตือน" description=""></wu-empty-state>
<wu-empty-state type="error" [showImage]="false">
  <wu-button label="ลองใหม่" icon="wi wi-refresh" size="small"></wu-button>
</wu-empty-state>`,
    table: `<wu-table [value]="students">
  <ng-template #header>
    <tr>
      <th>รหัส</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
  <ng-template #emptymessage>
    <tr>
      <td colspan="3">
        <wu-empty-state size="small" title="ยังไม่มีนักเรียนในห้องนี้">
          <wu-button label="เพิ่มนักเรียน" icon="wi wi-plus" size="small"></wu-button>
        </wu-empty-state>
      </td>
    </tr>
  </ng-template>
</wu-table>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('type', "'nodata' | 'search' | 'inbox' | 'folder' | 'error' | 'offline'", "'nodata'", 'ภาพและข้อความเริ่มต้น', 'Drawing and default text'),
        row('title · description', 'string', 'locale', 'หัวข้อ · คำอธิบาย (\'\' ไม่แสดง)', "Title · the line under it ('' hides it)"),
        row('icon', 'string', undefined, 'class ของไอคอนในวงกลม แทนภาพวาด', 'Icon class in a circle, instead of the drawing'),
        row('image · imageAlt', 'string', undefined, 'รูปของแอป แทนภาพวาด', 'Your own picture instead of the drawing'),
        row('showImage', BOOL, 'true', 'แสดงภาพ / ไอคอน / รูป', 'Show the drawing / icon / picture'),
        row('size', "'small' | 'normal' | 'large'", "'normal'", 'ขนาด: ในตาราง · ปกติ · ทั้งหน้า', 'Size: in a table · normal · a whole page'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-slots',
      title: { th: 'เนื้อหาใน tag', en: 'Content' },
      rows: [row('(content)', 'HTML', undefined, 'ปุ่มหรือลิงก์ใต้ข้อความ เรียงเป็นแถว', 'Buttons or links under the text, in a row')],
    },
  ],
  tokens: [
    tok('--wu-empty-state-padding · -sm-padding · -lg-padding · -gap', 'ระยะรอบนอก (ปกติ · เล็ก · ใหญ่) · ระยะระหว่างส่วน', 'Outer padding (normal · small · large) · gap between parts'),
    tok('--wu-empty-state-art-width · -art-sm-width · -art-lg-width', 'ความกว้างของภาพตามขนาด', 'Width of the drawing per size'),
    tok('--wu-empty-state-art-bg · -art-paper · -art-line', 'สีพื้นเงา · สีกระดาษ · สีเส้นของภาพ', 'Drawing: shadow · paper · line colours'),
    tok('--wu-empty-state-art-accent · -art-soft · -art-danger', 'สีเน้น · สีอ่อน · สีผิดพลาดของภาพ', 'Drawing: accent · soft · error colours'),
    tok('--wu-empty-state-icon-box · -icon-size · -icon-bg · -icon-color', 'วงกลมของ icon: ขนาด · ขนาดไอคอน · สีพื้น · สีไอคอน', 'Icon circle: size · icon size · background · colour'),
    tok('--wu-empty-state-title-color · -title-size · -title-weight', 'หัวข้อ', 'Title'),
    tok('--wu-empty-state-description-color · -description-size', 'คำอธิบาย', 'The line under the title'),
    tok('--wu-empty-state-actions-gap', 'ระยะระหว่างปุ่ม', 'Gap between actions'),
  ],
};

export const RESULT_DOC: ComponentDoc = {
  id: 'result',
  title: 'Result',
  group: 'Feedback',
  entry: 'result',
  standalone: 'WuResult',
  module: 'WuResultModule',
  selector: 'wu-result',
  description: {
    th: 'หน้าหรือกล่องที่บอกผลเมื่องานจบ (สำเร็จ ไม่สำเร็จ แจ้งเพื่อทราบ ต้องตรวจสอบ) หรือแทนหน้าที่เปิดไม่ได้ (403 ไม่มีสิทธิ์, 404 ไม่พบหน้า, 500 ระบบขัดข้อง) พร้อมปุ่มให้ทำต่อและกล่องรายละเอียด ข้อความเริ่มต้นเปลี่ยนตามภาษาของแอป',
    en: 'The page or box that tells how a task ended (done, failed, for your information, please check) or stands in for a page that cannot open (403 no access, 404 not found, 500 server error), with actions and a details box. Default text follows the app’s language.',
  },
  english: {
    'ส่งใบสมัครเรียบร้อยแล้ว': 'Your application is in',
    'เลขที่ใบสมัคร 69-000123 ระบบส่งอีเมลยืนยันไปที่ wira@example.com แล้ว': 'Application no. 69-000123. A confirmation email is on its way to wira@example.com.',
    'ดูใบสมัคร': 'View application',
    'กลับหน้าแรก': 'Back to home',
    'พิมพ์ใบเสร็จ': 'Print receipt',
    'ชำระเงินไม่สำเร็จ': 'Payment failed',
    'ลองอีกครั้ง': 'Try again',
    'บัตรถูกปฏิเสธโดยธนาคาร': 'The bank declined the card',
    'ยอดที่ต้องชำระ 3,500.00 บาท': 'Amount due: 3,500.00 baht',
    'ติดต่อผู้ดูแลระบบ': 'Contact an administrator',
    'ย้อนกลับ': 'Go back',
    'กำลังปิดปรับปรุงระบบ': 'Down for maintenance',
    'เปิดให้ใช้งานอีกครั้งเวลา 06:00 น.': 'Back at 06:00',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuResultModule</code>) และ standalone (<code>WuResult</code>)',
        en: 'Works as an NgModule (<code>WuResultModule</code>) or standalone (<code>WuResult</code>).',
      },
    },
    status: {
      title: { th: 'ผลของงาน', en: 'How a task ended' },
      text: {
        th: '<code>status</code> เป็น <code>success</code>, <code>error</code>, <code>info</code> (ค่าเริ่มต้น) หรือ <code>warning</code> ได้เครื่องหมายใหญ่ในสีสถานะของธีม · ข้อความเริ่มต้นมาจาก locale แทนด้วย <code>title</code> และ <code>subtitle</code> ได้',
        en: '<code>status</code> is <code>success</code>, <code>error</code>, <code>info</code> (default) or <code>warning</code>, with a large mark in the theme’s status colour · default text comes from the locale; <code>title</code> and <code>subtitle</code> replace it.',
      },
    },
    codes: {
      title: { th: 'หน้าที่เปิดไม่ได้', en: 'Pages that cannot open' },
      text: {
        th: '<code>status="403"</code>, <code>"404"</code> และ <code>"500"</code> วาดรหัสโดยมีภาพแทนเลข 0 (กุญแจ เข็มทิศ สายฟ้า) ในสีของธีม เหมาะกับ route <code>**</code> หรือหน้าที่ guard ไม่ให้เข้า · <code>[status]="404"</code> แบบตัวเลขก็ได้',
        en: '<code>status="403"</code>, <code>"404"</code> and <code>"500"</code> draw the code with a picture for its 0 (a lock, a compass, a bolt) in the theme’s colours, for a <code>**</code> route or a page a guard keeps out · <code>[status]="404"</code> as a number works too.',
      },
    },
    extra: {
      title: { th: 'ปุ่มและรายละเอียด', en: 'Actions and details' },
      text: {
        th: 'ใส่ attribute <code>wuResultExtra</code> ให้ปุ่มที่จะเรียงเป็นแถวใต้ข้อความ · สิ่งอื่นใน tag ไปอยู่ในกล่องรายละเอียดสีอ่อนด้านล่าง (ไม่มีก็ไม่แสดงกล่อง)',
        en: 'Mark buttons with <code>wuResultExtra</code> to line them up under the text · anything else inside the tag goes in a soft details box below (no content, no box).',
      },
    },
    custom: {
      title: { th: 'ไอคอนของแอป', en: 'Your own icon' },
      text: {
        th: '<code>icon</code> ใส่ไอคอน (class) ในวงกลมสีของสถานะแทนเครื่องหมาย · <code>[showIcon]="false"</code> เหลือแค่ข้อความ',
        en: '<code>icon</code> puts an icon (a class) in the status circle instead of the mark · <code>[showIcon]="false"</code> keeps only the text.',
      },
    },
  },
  code: {
    status: `<wu-result status="success" title="ส่งใบสมัครเรียบร้อยแล้ว"
  subtitle="เลขที่ใบสมัคร 69-000123 ระบบส่งอีเมลยืนยันไปที่ wira@example.com แล้ว">
  <wu-button wuResultExtra label="ดูใบสมัคร"></wu-button>
  <wu-button wuResultExtra label="กลับหน้าแรก" severity="secondary" [outlined]="true"></wu-button>
</wu-result>
<wu-result status="error"></wu-result>
<wu-result status="info"></wu-result>
<wu-result status="warning"></wu-result>`,
    codes: `<wu-result status="403">
  <wu-button wuResultExtra label="ติดต่อผู้ดูแลระบบ" severity="secondary" [outlined]="true"></wu-button>
</wu-result>
<wu-result status="404">
  <wu-button wuResultExtra label="กลับหน้าแรก" icon="wi wi-house"></wu-button>
</wu-result>
<wu-result status="500">
  <wu-button wuResultExtra label="ย้อนกลับ" severity="secondary" [text]="true"></wu-button>
</wu-result>`,
    extra: `<wu-result status="error" title="ชำระเงินไม่สำเร็จ" subtitle="บัตรถูกปฏิเสธโดยธนาคาร">
  <wu-button wuResultExtra label="ลองอีกครั้ง" icon="wi wi-refresh"></wu-button>
  <wu-button wuResultExtra label="กลับหน้าแรก" severity="secondary" [outlined]="true"></wu-button>
  <p>ยอดที่ต้องชำระ 3,500.00 บาท</p>
</wu-result>`,
    custom: `<wu-result status="warning" icon="wi wi-wrench" title="กำลังปิดปรับปรุงระบบ" subtitle="เปิดให้ใช้งานอีกครั้งเวลา 06:00 น."></wu-result>
<wu-result status="success" [showIcon]="false" title="ส่งใบสมัครเรียบร้อยแล้ว" subtitle=""></wu-result>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('status', "'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500'", "'info'", 'แบบของผล', 'What kind of result'),
        row('title · subtitle', 'string', 'locale', 'หัวข้อ · คำอธิบาย (\'\' ไม่แสดง)', "Title · the line under it ('' hides it)"),
        row('icon', 'string', undefined, 'class ของไอคอนในวงกลม แทนเครื่องหมาย', 'Icon class in the circle, instead of the mark'),
        row('showIcon', BOOL, 'true', 'แสดงเครื่องหมาย / ภาพ', 'Show the mark / picture'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-slots',
      title: { th: 'เนื้อหาใน tag', en: 'Content' },
      rows: [
        row('[wuResultExtra]', 'HTML', undefined, 'ปุ่มหรือลิงก์ เรียงเป็นแถวใต้ข้อความ', 'Buttons or links in a row under the text'),
        row('(content)', 'HTML', undefined, 'สิ่งอื่น ไปอยู่ในกล่องรายละเอียด', 'Anything else, in the details box'),
      ],
    },
  ],
  tokens: [
    tok('--wu-result-padding · -gap', 'ระยะรอบนอก · ระยะระหว่างส่วน', 'Outer padding · gap between parts'),
    tok('--wu-result-icon-box', 'ขนาดวงกลมของเครื่องหมาย (สีมาจาก --wu-success-color / -bg ฯลฯ)', 'Size of the mark circle (colours from --wu-success-color / -bg and so on)'),
    tok('--wu-result-art-width · -code-color', 'ความกว้างของภาพรหัส · สีของตัวเลข', 'Width of the code picture · colour of its digits'),
    tok('--wu-result-art-accent · -art-soft · -art-paper', 'สีเน้น · สีอ่อน · สีกระดาษของภาพ', 'Picture: accent · soft · paper colours'),
    tok('--wu-result-title-color · -title-size · -title-weight', 'หัวข้อ', 'Title'),
    tok('--wu-result-description-color', 'คำอธิบาย', 'The line under the title'),
    tok('--wu-result-actions-gap', 'ระยะระหว่างปุ่ม', 'Gap between actions'),
    tok('--wu-result-content-bg · -content-radius · -content-padding', 'กล่องรายละเอียด', 'Details box'),
  ],
};

export const ERRORPAGE_DOC: ComponentDoc = {
  id: 'errorpage',
  title: 'ErrorPage',
  group: 'Feedback',
  entry: 'errorpage',
  standalone: 'WuErrorPage',
  module: 'WuErrorPageModule',
  selector: 'wu-error-page',
  description: {
    th: 'หน้าข้อผิดพลาดสำเร็จรูปสำหรับรหัส 4xx และ 5xx ทุกตัว มีสองแบบ: แบบทางการ (ไอคอนเรียบ ๆ กับรหัสตัวใหญ่) และแบบ kawaii (ตัวการ์ตูนถือป้ายรหัส ขยับตัวและกะพริบตา พร้อมคำพูดน่ารัก) ข้อความไทยและอังกฤษของรหัสที่พบบ่อยมีให้ ปุ่มเลือกให้ตามรหัส (เข้าสู่ระบบ ลองอีกครั้ง ย้อนกลับ กลับหน้าแรก) และแสดงรหัสอ้างอิงให้แจ้งฝ่ายช่วยเหลือได้',
    en: 'Ready-made pages for every 4xx and 5xx code, in two looks: formal (a quiet icon and the code in large type) and kawaii (a little character holding the code up on a sign, bobbing and blinking, with friendlier words). Thai and English words for the common codes are built in, the buttons fit the code (sign in, try again, back, home), and a reference people can quote to support.',
  },
  english: {
    'ทางการ': 'Formal',
    'ติดต่อฝ่ายช่วยเหลือ': 'Contact support',
    'ปุ่มที่กดล่าสุด': 'Last button',
    'ระบบลงทะเบียนปิดชั่วคราว': 'Sign-ups are closed for now',
    'เปิดอีกครั้งวันจันทร์ที่ 3 พฤศจิกายน 2569 เวลา 08:00 น.': 'They open again on Monday 3 November 2026 at 8:00.',
    'ดูสถานะระบบ': 'System status',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuErrorPageModule</code>) และ standalone (<code>WuErrorPage</code>) · ชื่อ tag <code>wu-error-page</code> หรือ <code>wu-errorPage</code> · ใช้ได้ทุกรุ่น (v1–v3)',
        en: 'Works as an NgModule (<code>WuErrorPageModule</code>) or standalone (<code>WuErrorPage</code>) · the tags <code>wu-error-page</code> and <code>wu-errorPage</code> · every version (v1–v3).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>code</code> คือรหัส HTTP ที่จะแสดง หัวข้อ คำอธิบาย และปุ่มมาจากรหัสนั้นในภาษาของแอป · ปุ่มแรกเป็นปุ่มหลัก',
        en: '<code>code</code> is the HTTP status to show; the title, the line under it and the buttons come from that code, in the app’s language · the first button is the main one.',
      },
    },
    codes: {
      title: { th: 'ทุกรหัส สองแบบ', en: 'Every code, two looks' },
      text: {
        th: 'รหัสที่พบบ่อยมีข้อความของตัวเอง (400 401 403 404 405 408 409 410 413 415 422 429 500 501 502 503 504) รหัสอื่นในช่วง 4xx / 5xx ใช้ข้อความกลาง · ภาพเลือกตามกลุ่ม: เข้าสู่ระบบ ไม่มีสิทธิ์ ไม่พบ หมดเวลา ถี่เกินไป ระบบขัดข้อง เชื่อมต่อไม่ได้ ปิดปรับปรุง และคำขอไม่ถูกต้อง · <code>look="kawaii"</code> เปลี่ยนเป็นตัวการ์ตูนและคำพูดน่ารักของกลุ่มนั้น',
        en: 'The common codes have words of their own (400 401 403 404 405 408 409 410 413 415 422 429 500 501 502 503 504); any other 4xx / 5xx reads as a client or server error · the picture follows the kind: sign in, no access, missing, timed out, too many, server error, unreachable, maintenance and bad request · <code>look="kawaii"</code> switches to the character and that kind’s friendlier words.',
      },
    },
    kawaii: {
      title: 'Kawaii',
      text: {
        th: 'ตัวการ์ตูนถือป้ายรหัสในสีหลักของธีม ทำท่าตามกลุ่มของรหัส: งง มีเครื่องหมายคำถาม (404) กุญแจล็อก (403) มึนหัว (500) หลับ (503) เหงื่อตก (429) ถอดปลั๊ก (502) · ขยับตัว กะพริบตา และประกายระยิบ (นิ่งเมื่อผู้ใช้ขอลดการเคลื่อนไหว) · ปุ่มเป็นทรงกลมกดยุบได้',
        en: 'The character holds the code up on a sign in the theme’s main colour and acts out the kind: puzzled with a question mark (404), a padlock (403), dizzy (500), asleep (503), sweating (429), unplugged (502) · it bobs, blinks and sparkles (still for people who ask for less motion) · the buttons turn round and press in.',
      },
    },
    actions: {
      title: { th: 'ปุ่ม เหตุการณ์ และรหัสอ้างอิง', en: 'Buttons, events and a reference' },
      text: {
        th: '<code>[actions]="[\'retry\', \'home\']"</code> เลือกปุ่มเอง (<code>home</code> <code>back</code> <code>retry</code> <code>signIn</code>, <code>false</code> ไม่มีปุ่ม) · <code>homeLink</code> / <code>signInLink</code> ที่อยู่ของปุ่ม · <code>(action)</code> แจ้งก่อนทำงาน เรียก <code>originalEvent.preventDefault()</code> แล้วใช้ router ของแอปแทนได้ · สิ่งที่ใส่ <code>wuErrorAction</code> ต่อท้ายแถวปุ่ม · <code>reference</code> แสดงรหัสอ้างอิง (request id) ให้ผู้ใช้แจ้งฝ่ายช่วยเหลือ · สิ่งอื่นใน tag อยู่ในกล่องรายละเอียดด้านล่าง',
        en: '<code>[actions]="[\'retry\', \'home\']"</code> picks the buttons (<code>home</code> <code>back</code> <code>retry</code> <code>signIn</code>; <code>false</code> for none) · <code>homeLink</code> / <code>signInLink</code> are where they go · <code>(action)</code> comes first: call <code>originalEvent.preventDefault()</code> to route with the app’s router instead · elements marked <code>wuErrorAction</code> join the buttons · <code>reference</code> shows an id (a request id) people can quote to support · anything else inside goes in a details box under them.',
      },
    },
    route: {
      title: { th: 'เป็นหน้าของ route', en: 'As a route’s page' },
      text: {
        th: '<code>fullPage</code> เต็มความสูงจอและอยู่กลางจอ ใช้เป็นหน้าของ route <code>**</code> (ไม่พบหน้า) หรือหน้าที่ interceptor พาไปเมื่อ API ตอบ 401 / 403 / 5xx · <code>title</code> และ <code>description</code> แทนข้อความเดิมได้',
        en: '<code>fullPage</code> fills the screen’s height, centred: the page of the <code>**</code> route (not found), or where an interceptor sends people when the API answers 401 / 403 / 5xx · <code>title</code> and <code>description</code> replace the built-in words.',
      },
    },
  },
  code: {
    basic: `<wu-error-page code="404"></wu-error-page>`,
    codes: `<wu-error-page [code]="status" look="formal"></wu-error-page>
<wu-error-page [code]="status" look="kawaii"></wu-error-page>`,
    kawaii: `<wu-error-page code="404" look="kawaii"></wu-error-page>
<wu-error-page code="403" look="kawaii"></wu-error-page>
<wu-error-page code="503" look="kawaii"></wu-error-page>
<wu-error-page code="429" look="kawaii"></wu-error-page>`,
    actions: `<wu-error-page code="503" [actions]="['retry']" reference="REQ-7F3A-2026" (action)="picked($event)">
  <wu-button wuErrorAction label="ติดต่อฝ่ายช่วยเหลือ" severity="secondary" [outlined]="true"></wu-button>
  ระบบลงทะเบียนปิดชั่วคราว เปิดอีกครั้งวันจันทร์ที่ 3 พฤศจิกายน 2569 เวลา 08:00 น.
</wu-error-page>`,
    route: `<!-- not-found.page.html -->
<wu-error-page code="404" look="kawaii" fullPage (action)="go($event)"></wu-error-page>`,
  },
  ts: {
    codes: `status = 404; // 400, 401, 403, 404, 408, 429, 500, 502, 503 …`,
    actions: `import { WuErrorPageActionEvent } from 'wiraui/errorpage';

picked(e: WuErrorPageActionEvent): void {
  e.originalEvent.preventDefault(); // stay here (the sample only shows the name)
  this.last = e.action;
}`,
    route: `// app.routes.ts: the last route
{ path: '**', loadComponent: () => import('./not-found.page').then((m) => m.NotFoundPage) },

// not-found.page.ts: home through the router, without a full reload
go(e: WuErrorPageActionEvent): void {
  if (e.action === 'home') {
    e.originalEvent.preventDefault();
    this.router.navigateByUrl('/');
  }
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('code', 'number | string', '404', 'รหัส HTTP 400–599 (นอกช่วงนี้แสดง 500)', 'HTTP status 400–599 (anything else shows 500)'),
        row('look', "'formal' | 'kawaii'", "'formal'", 'แบบทางการ หรือ kawaii', 'Formal or kawaii'),
        row('title · description', 'string', 'locale', 'แทนข้อความของรหัส', 'Replace the code’s words'),
        row('actions', "('home' | 'back' | 'retry' | 'signIn')[] | false", 'ตามรหัส', 'ปุ่มในตัว ปุ่มแรกเป็นปุ่มหลัก', 'Built-in buttons, the first is the main one'),
        row('homeLink · signInLink', 'string | null', "'/' · '/login'", 'ที่อยู่ของปุ่มกลับหน้าแรก / เข้าสู่ระบบ (null ไม่แสดงปุ่ม)', 'Where home / sign in go (null leaves the button out)'),
        row('reference', 'string', undefined, 'รหัสอ้างอิงให้แจ้งฝ่ายช่วยเหลือ', 'A reference to quote to support'),
        row('fullPage', BOOL, 'false', 'เต็มความสูงจอ อยู่กลางจอ', 'Fill the screen’s height, centred'),
        row('headingLevel', 'number', '1', 'ระดับหัวข้อของชื่อหน้า', 'Heading level of the title'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('action', 'WuErrorPageActionEvent', undefined, '{ action, originalEvent } ก่อนปุ่มทำงาน (preventDefault() เพื่อหยุด)', '{ action, originalEvent } before the button acts (preventDefault() stops it)')],
    },
    {
      id: 'api-slots',
      title: { th: 'เนื้อหาใน tag', en: 'Content' },
      typeLabel: { th: 'ที่อยู่', en: 'Goes' },
      rows: [
        row('[wuErrorAction]', 'element', undefined, 'ต่อท้ายแถวปุ่ม', 'After the buttons'),
        row('อื่น ๆ', 'content', undefined, 'กล่องรายละเอียดใต้ปุ่ม', 'A details box under the buttons'),
      ],
    },
  ],
  tokens: [
    tok('--wu-error-page-padding · -gap', 'ระยะรอบหน้าและระหว่างส่วน', 'Padding and gaps'),
    tok('--wu-error-page-badge-size · -badge-bg · -badge-color', 'ไอคอนของแบบทางการ', 'The formal icon'),
    tok('--wu-error-page-label-color · -code-size · -code-from · -code-to', 'คำว่า “ข้อผิดพลาด” และรหัสตัวใหญ่ (ไล่สีจากบนลงล่าง)', 'The “Error” label and the large code (a top-to-bottom gradient)'),
    tok('--wu-error-page-title-color · -title-size · -title-weight · -description-color', 'หัวข้อและคำอธิบาย', 'Title and line'),
    tok('--wu-error-page-button-bg · -button-color · -button-border · -button-radius', 'ปุ่มรอง (ปุ่มหลักใช้สีหลัก)', 'Secondary buttons (the main one takes the primary colour)'),
    tok('--wu-error-page-mascot-width · -k-blob · -k-body · -k-ink · -k-blush', 'ตัวการ์ตูน: ขนาด พื้นหลัง ตัว เส้น และแก้ม', 'The character: size, backdrop, body, ink and cheeks'),
    tok('--wu-error-page-k-sign · -k-sign-text · -k-spark · -k-drop · -k-button-shadow', 'ป้ายรหัส ประกาย หยดเหงื่อ และเงาปุ่ม', 'The sign, sparkles, sweat drops and button ledge'),
  ],
};
