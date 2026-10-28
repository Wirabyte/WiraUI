import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

const LAYER = {
  th: 'เปิดใน top layer ของ browser จึงอยู่เหนือทุกอย่างและไม่ถูกตัดโดย <code>overflow: hidden</code> ไม่ต้องใช้ <code>appendTo</code> หรือ z-index',
  en: 'It opens in the browser top layer, above everything and never clipped by <code>overflow: hidden</code>; no <code>appendTo</code> or z-index needed.',
};

export const DIALOG_DOC: ComponentDoc = {
  id: 'dialog',
  title: 'Dialog',
  group: 'Overlay',
  entry: 'dialog',
  standalone: 'WtDialog, WtDialogFooter, WtTemplate',
  module: 'WtDialogModule',
  selector: 'wt-dialog',
  description: {
    th: 'กล่องโต้ตอบที่สร้างจาก <dialog> ของ browser เปิดใน top layer โฟกัสวนอยู่ข้างในและกลับไปที่ปุ่มเดิมเมื่อปิด และล็อกการเลื่อนหน้าระหว่างเปิด',
    en: 'A dialog built on the browser\'s own <dialog>, opened in the top layer. Focus stays inside and returns when it closes, and the page stops scrolling behind it.',
  },
  english: {
    'ม.1/1': 'Class 7/1',
    'เลือกหัวหน้าห้อง': 'Pick the class leader',
    'หัวหน้าห้อง': 'Class leader',
    'ยกเลิก': 'Cancelled',
    'หน้าที่เปิด dialog': 'the page that opens the dialog',
    'component ที่อยู่ใน dialog': 'the component in the dialog',
    'หรือ ref.onClose.subscribe(…)': 'or ref.onClose.subscribe(…)',
    'ห้อง': 'Class',
    'แก้ไขโปรไฟล์': 'Edit profile',
    'ชื่อที่แสดง': 'Display name',
    'ส่งข้อความ': 'Send a message',
    'ส': 'S',
    'สมหญิง ใจดี': 'Sarah Jones',
    'ส่งข้อความหาสมาชิกในทีม': 'Message a team member.',
    'ตำแหน่ง': 'Position',
    'เปิดรายงาน': 'Open the report',
    'รายงานประจำเดือน': 'Monthly report',
    'โน้ต (ไม่บังหน้า)': 'Note (non-modal)',
    'คลิกพื้นมืดเพื่อปิด': 'Click the mask to close',
    'โน้ต': 'Note',
    'รายละเอียด': 'Details',
    'ดูข้อเสนอ': 'See the offer',
    'เริ่มเลย': 'Start now',
    'ไว้ทีหลัง': 'Maybe later',
    'ทดลองใช้แพ็กเกจ Pro ฟรี 14 วัน': 'Try Pro free for 14 days',
    'ผู้ใช้ไม่จำกัด รายงานขั้นสูง และฝ่ายช่วยเหลือ 24 ชั่วโมง': 'Unlimited users, advanced reports and 24-hour support.',
    'ลากที่หัวเพื่อย้าย หน้ายังใช้งานได้': 'Drag me by the header; the page stays usable.',
    'คลิกที่พื้นมืดเพื่อปิด': 'Click the dimmed page to close.',
  },
  sections: {
    import: {
      title: 'Import',
      text: { th: '<code>WtDialogModule</code> มี <code>WtTemplate</code> และ <code>wt-footer</code> มาด้วย', en: '<code>WtDialogModule</code> also brings <code>WtTemplate</code> and <code>wt-footer</code>.' },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ผูกการเปิด / ปิดด้วย <code>[(visible)]</code> ปิดได้ด้วยปุ่ม × และ <code>Esc</code> ' + LAYER.th,
        en: 'Bind it open with <code>[(visible)]</code>; the × and <code>Esc</code> close it. ' + LAYER.en,
      },
    },
    slots: {
      title: { th: 'หัวและท้ายแบบกำหนดเอง', en: 'Custom header and footer' },
      text: {
        th: 'ใช้ <code>&lt;ng-template #header&gt;</code> / <code>#footer</code> หรือ <code>wtTemplate="header"</code> / <code>"footer"</code> (มี <code>content</code>, <code>headless</code>, <code>closeicon</code> ด้วย) หรือวางเนื้อหาใน <code>&lt;wt-footer&gt;</code> / <code>[wtDialogFooter]</code>',
        en: 'Use <code>&lt;ng-template #header&gt;</code> / <code>#footer</code>, or <code>wtTemplate="header"</code> / <code>"footer"</code> (also <code>content</code>, <code>headless</code>, <code>closeicon</code>), or put the footer in <code>&lt;wt-footer&gt;</code> / <code>[wtDialogFooter]</code>.',
      },
    },
    position: {
      title: 'Position',
      text: {
        th: '<code>position</code>: center, top, bottom, left, right, topleft, topright, bottomleft, bottomright (เขียน top-left ก็ได้)',
        en: '<code>position</code>: center, top, bottom, left, right, topleft, topright, bottomleft, bottomright (top-left works too).',
      },
    },
    responsive: {
      title: { th: 'ขนาดตามหน้าจอและขยายเต็มจอ', en: 'Responsive width and maximize' },
      text: {
        th: '<code>breakpoints</code> กำหนดความกว้างตามหน้าจอ (max-width ที่เล็กที่สุดที่ตรงจะชนะ) บนมือถือกล่องกว้างเท่าจอเสมอ แม้แอปตั้ง <code>min-width</code> ไว้ <code>maximizable</code> เพิ่มปุ่มขยายเต็มจอ',
        en: '<code>breakpoints</code> set the width per screen size (the smallest matching max-width wins). On phones the box always takes the screen width, even when the app set a <code>min-width</code>. <code>maximizable</code> adds a full-screen button.',
      },
    },
    modeless: {
      title: { th: 'ไม่บังหน้าและลากได้', en: 'Non-modal and draggable' },
      text: {
        th: '<code>[modal]="false"</code> ไม่มีพื้นมืดและหน้ายังใช้ได้ · <code>dismissableMask</code> คลิกพื้นมืดเพื่อปิด · <code>draggable</code> ลากที่หัวเพื่อย้าย (ปิดอยู่เป็นค่าเริ่มต้น)',
        en: '<code>[modal]="false"</code> leaves the page usable with no mask · <code>dismissableMask</code> closes on a mask click · <code>draggable</code> moves it by the header (off by default).',
      },
    },
    headless: {
      title: 'Headless',
      text: { th: '<code>#headless</code> วาดทั้งกล่องเอง ส่วนการเปิดปิด โฟกัส และ top layer ยังทำงานเหมือนเดิม', en: '<code>#headless</code> draws the whole box yourself; opening, focus and the top layer still work.' },
    },
    service: {
      title: { th: 'เปิดจากโค้ด (WtDialogService)', en: 'Opening from code (WtDialogService)' },
      text: {
        th: '<code>WtDialogService.open(Component, config)</code> เปิด component ของแอปใน dialog โดยไม่ต้องเขียน <code>&lt;wt-dialog&gt;</code> ในหน้า · config: <code>header</code>, <code>width</code>, <code>data</code>, <code>footer</code> (component ของปุ่มท้าย), <code>maximizable</code>, <code>dismissableMask</code>, <code>closable</code>, <code>position</code>, <code>breakpoints</code>, <code>style</code> … · ใน component ที่เปิด: <code>inject(WtDialogConfig).data</code> และ <code>inject(WtDialogRef).close(ผลลัพธ์)</code> · ผลลัพธ์กลับมาทาง <code>ref.onClose</code> หรือ <code>await ref.result</code> (ปิดด้วย X / Esc / คลิกพื้นหลังได้ <code>undefined</code>) · เปิดซ้อนกันได้ · <code>DialogService</code>, <code>DynamicDialogRef</code>, <code>DynamicDialogConfig</code> ชื่อเดิมก็ import ได้',
        en: '<code>WtDialogService.open(Component, config)</code> opens a component of yours in a dialog, with no <code>&lt;wt-dialog&gt;</code> in the page · config: <code>header</code>, <code>width</code>, <code>data</code>, <code>footer</code> (a component for the buttons), <code>maximizable</code>, <code>dismissableMask</code>, <code>closable</code>, <code>position</code>, <code>breakpoints</code>, <code>style</code> … · in the opened component: <code>inject(WtDialogConfig).data</code> and <code>inject(WtDialogRef).close(result)</code> · the result comes back through <code>ref.onClose</code> or <code>await ref.result</code> (closing with X / Esc / the mask gives <code>undefined</code>) · dialogs stack · the old names <code>DialogService</code>, <code>DynamicDialogRef</code>, <code>DynamicDialogConfig</code> import too.',
      },
    },
    a11y: {
      title: { th: 'การเข้าถึงและคีย์บอร์ด', en: 'Accessibility and keyboard' },
      text: {
        th: 'เปิดแล้วโฟกัสที่ element ที่มี <code>autofocus</code> หรือปุ่มปิด · <code>Tab</code> วนอยู่ในกล่อง · <code>Esc</code> ปิด (<code>closeOnEscape</code>) · ปิดแล้วโฟกัสกลับไปที่ปุ่มที่เปิด · หัวข้อผูกกับ <code>aria-labelledby</code> ให้เอง · ทุกรุ่นติด class ชื่อที่ CSS เดิมของแอปเล็งไว้ด้วย (v1 ชุดเดิม v2 / v3 ชุดใหม่)',
        en: 'On open, focus goes to an <code>autofocus</code> element or the close button · <code>Tab</code> stays inside · <code>Esc</code> closes (<code>closeOnEscape</code>) · focus returns to the opener · the title is wired to <code>aria-labelledby</code>. Every version also carries the class names existing CSS already targets (v1 the older set, v2 / v3 the newer one).',
      },
    },
  },
  code: {
    basic: `<wt-button label="แก้ไขโปรไฟล์" icon="wi wi-user" (onClick)="visible = true"></wt-button>

<wt-dialog header="แก้ไขโปรไฟล์" [(visible)]="visible" [style]="{ width: '28rem' }">
  <label for="profile-name">ชื่อที่แสดง</label>
  <input wtInputText id="profile-name" name="name" [(ngModel)]="name" [fluid]="true" />
  <ng-template #footer>
    <wt-button label="ยกเลิก" severity="secondary" [text]="true" (onClick)="visible = false"></wt-button>
    <wt-button label="บันทึก" (onClick)="visible = false"></wt-button>
  </ng-template>
</wt-dialog>`,
    slots: `<wt-dialog [(visible)]="visible" [style]="{ width: '26rem' }">
  <ng-template #header>
    <wt-avatar label="ส" shape="circle"></wt-avatar>
    <b>สมหญิง ใจดี</b>
  </ng-template>
  <p>ส่งข้อความหาสมาชิกในทีม</p>
  <wt-footer>
    <wt-button label="ส่ง" icon="wi wi-send" (onClick)="visible = false"></wt-button>
  </wt-footer>
</wt-dialog>`,
    position: `<wt-dialog header="ตำแหน่ง" [(visible)]="visible" [position]="position" [style]="{ width: '20rem' }">
  …
</wt-dialog>`,
    responsive: `<wt-dialog header="รายงานประจำเดือน" [(visible)]="visible" [maximizable]="true"
  [style]="{ width: '50vw' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }">
  …
</wt-dialog>`,
    modeless: `<wt-dialog header="โน้ต" [(visible)]="visible" [modal]="false" [draggable]="true" position="right"></wt-dialog>
<wt-dialog header="รายละเอียด" [(visible)]="visible2" [dismissableMask]="true"></wt-dialog>`,
    headless: `<wt-dialog [(visible)]="visible" [style]="{ width: '22rem' }">
  <ng-template #headless>
    <div class="promo">
      <h3>ทดลองใช้แพ็กเกจ Pro ฟรี 14 วัน</h3>
      <wt-button label="เริ่มเลย" (onClick)="visible = false"></wt-button>
      <wt-button label="ไว้ทีหลัง" [text]="true" (onClick)="visible = false"></wt-button>
    </div>
  </ng-template>
</wt-dialog>`,
    service: `<wt-button label="เลือกหัวหน้าห้อง" icon="wi wi-users" (onClick)="pickLeader()"></wt-button>
<p>หัวหน้าห้อง: {{ leader }}</p>`,
  },
  ts: {
    basic: `visible = false;
name = 'สมหญิง ใจดี';`,
    service: `import { Component, inject } from '@angular/core';
import { WtButton } from 'wiratheme/button';
import { WtDialogConfig, WtDialogRef, WtDialogService } from 'wiratheme/dialog';

// หน้าที่เปิด dialog
export class ClassroomPage {
  private readonly dialogs = inject(WtDialogService);
  leader = '-';

  async pickLeader(): Promise<void> {
    const ref = this.dialogs.open(PickStudent, { header: 'เลือกหัวหน้าห้อง', width: '26rem', data: { room: 'ม.1/1' } });
    const student = await ref.result;           // หรือ ref.onClose.subscribe(…)
    this.leader = student ? student.name : 'ยกเลิก';
  }
}

// component ที่อยู่ใน dialog
@Component({
  selector: 'app-pick-student',
  imports: [WtButton],
  template: \`
    <p>ห้อง {{ config.data.room }}</p>
    @for (s of students; track s.id) {
      <wt-button [label]="s.name" [text]="true" (onClick)="ref.close(s)"></wt-button>
    }
    <wt-button label="ยกเลิก" severity="secondary" (onClick)="ref.close()"></wt-button>
  \`,
})
export class PickStudent {
  readonly ref = inject(WtDialogRef<Student>);
  readonly config = inject(WtDialogConfig<{ room: string }>);
  readonly students = STUDENTS;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('header', 'string', undefined, 'หัวข้อ (template header ใช้แทนได้)', 'Title (a header template replaces it)'),
        row('visible', BOOL, 'false', 'เปิดอยู่หรือไม่ ใช้ [(visible)]', 'Open or not; use [(visible)]'),
        row('modal', BOOL, 'true', 'มีพื้นมืดและโฟกัสอยู่ในกล่อง', 'Mask the page and keep focus inside'),
        row('closable', BOOL, 'true', 'ปุ่ม × , Esc และพื้นมืดปิดได้', 'The ×, Esc and the mask can close it'),
        row('closeOnEscape', BOOL, 'true', 'Esc ปิด', 'Esc closes it'),
        row('dismissableMask', BOOL, 'false', 'คลิกพื้นมืดเพื่อปิด', 'A mask click closes it'),
        row('blockScroll', BOOL, 'modal', 'หยุดการเลื่อนหน้าข้างหลัง', 'Stop the page scrolling behind'),
        row('draggable', BOOL, 'false', 'ลากที่หัวเพื่อย้าย', 'Move it by the header'),
        row('maximizable', BOOL, 'false', 'ปุ่มขยายเต็มจอ', 'A full-screen button'),
        row('showHeader', BOOL, 'true', 'แสดงแถบหัว', 'Show the header'),
        row('focusOnShow', BOOL, 'true', 'โฟกัสเมื่อเปิด', 'Focus on open'),
        row('position', 'string', "'center'", 'ตำแหน่งบนจอ', 'Place on screen'),
        row('style · styleClass', 'object · string', undefined, 'style / class ของกล่อง (มือถือกว้างเท่าจอเสมอ)', 'Box style / class (phones always get the screen width)'),
        row('contentStyle · contentStyleClass · maskStyleClass', 'object · string', undefined, 'style / class ของเนื้อหาและพื้นมืด', 'Content and mask style / class'),
        row('breakpoints', 'Record<string, string>', undefined, "ความกว้างตามจอ เช่น { '960px': '75vw' }", "Width per screen size, e.g. { '960px': '75vw' }"),
        row('closeIcon · maximizeIcon · minimizeIcon', 'string', undefined, 'class ของ icon แทนของในตัว', 'Icon classes instead of the built-in ones'),
        row('closeAriaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible names'),
        row('appendTo · baseZIndex · autoZIndex · resizable · keepInViewport · responsive · transitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล (อยู่ใน top layer)', 'Accepted so existing templates compile; no effect (top layer)'),
      ],
    },
    {
      id: 'api-slots',
      title: 'Templates',
      typeLabel: { th: 'ใช้', en: 'Use' },
      rows: [
        row('header · footer · content · closeicon', 'ng-template', undefined, '#ชื่อ หรือ wtTemplate="ชื่อ"', '#name or wtTemplate="name"'),
        row('headless', 'ng-template', undefined, 'วาดทั้งกล่องเอง', 'Draw the whole box'),
        row('wt-footer · [wtDialogFooter]', 'element', undefined, 'เนื้อหาส่วนท้ายแบบไม่ต้องใช้ template', 'Footer content without a template'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('visibleChange', BOOL, undefined, 'เปิด / ปิด', 'Opened / closed'),
        row('onShow · onHide', 'void', undefined, 'แสดงแล้ว / ปิดแล้ว', 'Shown / hidden'),
        row('onMaximize', 'WtDialogMaximizeEvent', undefined, 'ขยาย / ย่อ', 'Maximized / restored'),
      ],
    },
    { id: 'api-types', title: 'Types', code: `interface WtDialogMaximizeEvent {\n  maximized: boolean;\n}` },
  ],
  tokens: [
    tok('--wt-dialog-bg', 'พื้นกล่อง', 'Box background'),
    tok('--wt-dialog-border', 'ขอบ', 'Border'),
    tok('--wt-dialog-shadow', 'เงา', 'Shadow'),
    tok('--wt-dialog-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-dialog-header-padding', 'ระยะในหัว', 'Header padding'),
    tok('--wt-dialog-content-padding', 'ระยะในเนื้อหา', 'Content padding'),
    tok('--wt-dialog-footer-padding', 'ระยะในส่วนท้าย', 'Footer padding'),
    tok('--wt-dialog-title-size', 'ขนาดหัวข้อ', 'Title size'),
    tok('--wt-dialog-title-weight', 'น้ำหนักหัวข้อ', 'Title weight'),
    tok('--wt-dialog-divider', 'เส้นคั่นหัวและท้าย (0 = ไม่มี)', 'Header / footer divider (0 = none)'),
  ],
};

export const ALERT_DOC: ComponentDoc = {
  id: 'alert',
  title: 'AlertDialog',
  group: 'Overlay',
  entry: 'alert',
  standalone: 'WtAlertService',
  module: 'WtAlertModule',
  selector: 'WtAlertService · WtAlert',
  description: {
    th: 'กล่องแจ้งเตือนสำเร็จรูปที่เรียกจากโค้ด มี icon เคลื่อนไหว หัวข้อ ข้อความ ช่องกรอก ปุ่มยืนยัน / ปฏิเสธ / ยกเลิก ตัวนับเวลา และคืนผลเป็น Promise',
    en: 'A ready-made alert opened from code: an animated icon, title, text, an optional input, confirm / deny / cancel buttons and a timer, resolving to a Promise.',
  },
  english: {
    'สำเร็จ': 'Success',
    'ผิดพลาด': 'Error',
    'เตือน': 'Warning',
    'ข้อมูล': 'Info',
    'คำถาม': 'Question',
    'บันทึกแล้ว': 'Saved',
    'ข้อมูลลูกค้าถูกบันทึกเรียบร้อย': 'The customer record is saved.',
    'บันทึกไม่สำเร็จ': 'Could not save',
    'กรุณาลองใหม่อีกครั้ง': 'Please try again.',
    'ใกล้หมดเวลา': 'Almost out of time',
    'เหลือเวลาอีก 5 นาที': '5 minutes left.',
    'มีเวอร์ชันใหม่': 'A new version is out',
    'รีเฟรชหน้าเพื่อใช้งาน': 'Refresh the page to use it.',
    'ต้องการความช่วยเหลือ?': 'Need help?',
    'ติดต่อทีมงานได้ทุกวัน': 'Our team answers every day.',
    'ลบรายการ': 'Delete item',
    'ออกจากหน้านี้': 'Leave this page',
    'สาขา': 'Branch',
    'สาขา (select)': 'Branch (select)',
    'ขนาด (radio)': 'Size (radio)',
    'ความคิดเห็น (textarea)': 'Comment (textarea)',
    'เงื่อนไข (checkbox)': 'Terms (checkbox)',
    'ส่งคำขอ': 'Send request',
    'บันทึกอัตโนมัติ': 'Autosave',
    'โปรโมชัน': 'Promotion',
    'ออกจากระบบ': 'Sign out',
    'คัดลอกลิงก์': 'Copy link',
    'ซิงก์ข้อมูล': 'Sync data',
    'เรียกแบบ static': 'Static call',
    'หรือเรียกจากที่ไหนก็ได้ (ต้องมี provideWiraTheme() ใน app.config.ts / AppModule)': 'or call it from anywhere (needs provideWiraTheme() in app.config.ts / AppModule)',
    'ลบรายการนี้?': 'Delete this item?',
    'ลบแล้วกู้คืนไม่ได้': 'This cannot be undone.',
    'ลบเลย': 'Delete',
    'ลบแล้ว': 'Deleted',
    'บันทึกการแก้ไขก่อนออก?': 'Save your changes before leaving?',
    'ไม่บันทึก': "Don't save",
    'r.isConfirmed → บันทึก · r.isDenied → ไม่บันทึก · r.isDismissed → อยู่ต่อ': "r.isConfirmed → save · r.isDenied → don't save · r.isDismissed → stay",
    'ส่งใบเสร็จทางอีเมล': 'Email the receipt',
    'กรุณากรอกอีเมล': 'Please enter an email',
    'ส่งแล้ว': 'Sent',
    'เลือกสาขา': 'Choose a branch',
    'กรุงเทพฯ': 'Bangkok',
    'เชียงใหม่': 'Chiang Mai',
    'ภูเก็ต': 'Phuket',
    'กรุณาเลือกสาขา': 'Please choose a branch',
    'ขนาดเสื้อ': 'Shirt size',
    'ความคิดเห็น': 'Comment',
    'บอกเราได้เลย': 'Tell us anything',
    'เงื่อนไขการใช้งาน': 'Terms of use',
    'ฉันยอมรับเงื่อนไข': 'I accept the terms',
    'ดำเนินการต่อ': 'Continue',
    'ต้องยอมรับเงื่อนไขก่อน': 'Please accept the terms first',
    'ขอใบเสนอราคา': 'Request a quote',
    'ชื่อบริษัท': 'Company name',
    'บริษัท ตัวอย่าง จำกัด': 'Example Co., Ltd.',
    'spinner แสดงระหว่างรอ': 'the spinner shows while it waits',
    'กลายเป็น r.value': 'becomes r.value',
    'ส่งคำขอแล้ว': 'Request sent',
    'เลขที่': 'No.',
    'บันทึกอัตโนมัติแล้ว': 'Saved automatically',
    'ส่วนลดสมาชิก': 'Member discount',
    'ใช้โค้ด <b>WELCOME20</b> รับส่วนลด <b>20%</b> ถึงสิ้นเดือนนี้': 'Use code <b>WELCOME20</b> for <b>20%</b> off until the end of the month',
    'ใช้โค้ด': 'Use code',
    'อ่านเงื่อนไข': 'Read the terms',
    'ออกจากระบบ?': 'Sign out?',
    'งานที่ยังไม่บันทึกจะหายไป': 'Unsaved work will be lost.',
    'คัดลอกลิงก์แล้ว': 'Link copied',
    'object ของ option ที่ใช้อยู่ส่งต่อให้ fire() ได้เลย': 'the option objects you already have go straight to fire()',
    'true เมื่อยืนยัน หรือค่าที่กรอก / ผลของ preConfirm, false เมื่อปฏิเสธ': 'true on confirm, or the input value / preConfirm result; false on deny',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ไม่ต้องวางอะไรใน template เรียก <code>WtAlertService</code> จากโค้ด หรือใช้ <code>WtAlert</code> แบบ static ที่เรียกได้จากทุกที่ (ต้องมี <code>provideWiraTheme()</code> ใน providers ของแอป)',
        en: 'Nothing goes in a template: call <code>WtAlertService</code> from code, or the static <code>WtAlert</code> from anywhere (it needs <code>provideWiraTheme()</code> in the app providers).',
      },
    },
    basic: {
      title: { th: 'icon ทั้ง 5 แบบ', en: 'The five icons' },
      text: { th: '<code>fire(หัวข้อ, ข้อความ, icon)</code> icon เป็น success, error, warning, info หรือ question', en: '<code>fire(title, text, icon)</code> with success, error, warning, info or question.' },
    },
    question: {
      title: { th: 'ถามก่อนทำ', en: 'Ask first' },
      text: {
        th: 'รอผลด้วย <code>await</code> แล้วดู <code>isConfirmed</code> · ปุ่มยืนยันอยู่ขวาเสมอ (<code>reverseButtons: false</code> สลับให้อยู่ซ้าย) · <code>focusCancel</code> โฟกัสปุ่มยกเลิก (ปลอดภัยกับการลบ)',
        en: '<code>await</code> the result and check <code>isConfirmed</code> · confirm always sits on the right (<code>reverseButtons: false</code> moves it left) · <code>focusCancel</code> focuses cancel (safer for deletes).',
      },
    },
    deny: {
      title: { th: 'สามทางเลือก', en: 'Three choices' },
      text: { th: '<code>showDenyButton</code> เพิ่มปุ่มปฏิเสธ ผลเป็น <code>isDenied</code>', en: '<code>showDenyButton</code> adds a deny button; the result has <code>isDenied</code>.' },
    },
    inputs: {
      title: { th: 'ช่องกรอก', en: 'Inputs' },
      text: {
        th: '<code>input</code>: text, email, password, number, tel, url, textarea, select, radio, checkbox · <code>inputOptions</code> สำหรับ select / radio · <code>inputValidator</code> คืนข้อความเพื่อค้างไว้และแสดงข้อผิดพลาด ค่าที่กรอกอยู่ใน <code>value</code>',
        en: '<code>input</code>: text, email, password, number, tel, url, textarea, select, radio, checkbox · <code>inputOptions</code> for select / radio · <code>inputValidator</code> returns a message to keep it open and show it. The value lands in <code>value</code>.',
      },
    },
    preconfirm: {
      title: { th: 'รอทำงานก่อนปิด', en: 'Work before closing' },
      text: {
        th: '<code>preConfirm</code> ทำงานตอนกดยืนยัน (เช่น เรียก API) ระหว่างนั้นปุ่มกลายเป็น spinner ผลที่คืนมาเป็น <code>value</code> และคืน <code>false</code> เพื่อค้างไว้',
        en: '<code>preConfirm</code> runs on confirm (an API call, say) while a spinner replaces the buttons. Its result becomes <code>value</code>; return <code>false</code> to stay open.',
      },
    },
    timer: {
      title: { th: 'ปิดเองตามเวลา', en: 'Timer' },
      text: { th: '<code>timer</code> ปิดเองหลังเวลาที่กำหนด (dismiss เป็น <code>timer</code>) และ <code>timerProgressBar</code> แสดงแถบเวลา', en: '<code>timer</code> closes it after a while (dismiss is <code>timer</code>); <code>timerProgressBar</code> shows the time left.' },
    },
    custom: {
      title: { th: 'HTML สีปุ่ม และความกว้าง', en: 'HTML, button colours and width' },
      text: {
        th: '<code>html</code> แทน <code>text</code> (ผ่าน sanitizer ของ Angular ไม่มี script) · <code>footer</code> ใต้ปุ่ม · <code>confirmButtonColor</code> ใช้สี CSS ใดก็ได้ · <code>width</code> (มือถือกว้างเท่าจอเสมอ) · <code>customClass</code>',
        en: '<code>html</code> instead of <code>text</code> (sanitized by Angular, no scripts) · <code>footer</code> under the buttons · <code>confirmButtonColor</code> takes any CSS colour · <code>width</code> (phones always get the screen width) · <code>customClass</code>.',
      },
    },
    helpers: {
      title: { th: 'ตัวช่วย', en: 'Helpers' },
      text: {
        th: '<code>confirm()</code> คืน <code>true</code> เมื่อยืนยันเท่านั้น · <code>mixin()</code> สร้างชุดค่าเริ่มต้นไว้ใช้ซ้ำ · <code>showLoading()</code> / <code>close()</code> แสดง spinner ระหว่างรอแล้วปิด',
        en: '<code>confirm()</code> resolves to <code>true</code> only on confirm · <code>mixin()</code> keeps a preset to reuse · <code>showLoading()</code> / <code>close()</code> show a spinner while you wait, then close.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'โค้ดที่เรียกฟังก์ชัน alert แบบ global อยู่แล้วย้ายมาใช้ <code>WtAlert.fire({...})</code> ได้ object ของ option ที่ส่งให้ <code>fire()</code> อยู่แล้วใช้ต่อได้เลย ชื่อ option และรูปแบบผลลัพธ์เหมือนเดิม ปุ่มนี้เรียกผ่าน <code>WtAlert</code> แบบ static',
        en: 'Code that already calls a global alert function moves to <code>WtAlert.fire({...})</code>: the option objects it already passes to <code>fire()</code> keep working, with the same option names and result shape. This button goes through the static <code>WtAlert</code>.',
      },
    },
  },
  code: {
    basic: `<wt-button label="สำเร็จ" severity="success"
  (onClick)="alert.fire('บันทึกแล้ว', 'ข้อมูลลูกค้าถูกบันทึกเรียบร้อย', 'success')"></wt-button>
<wt-button label="ผิดพลาด" severity="danger"
  (onClick)="alert.fire('บันทึกไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง', 'error')"></wt-button>
<wt-button label="เตือน" severity="warn"
  (onClick)="alert.fire('ใกล้หมดเวลา', 'เหลือเวลาอีก 5 นาที', 'warning')"></wt-button>
<wt-button label="ข้อมูล" severity="info"
  (onClick)="alert.fire('มีเวอร์ชันใหม่', 'รีเฟรชหน้าเพื่อใช้งาน', 'info')"></wt-button>
<wt-button label="คำถาม" severity="help"
  (onClick)="alert.fire('ต้องการความช่วยเหลือ?', 'ติดต่อทีมงานได้ทุกวัน', 'question')"></wt-button>`,
    question: `<wt-button label="ลบรายการ" severity="danger" icon="wi wi-trash" (onClick)="remove()"></wt-button>`,
    deny: `<wt-button label="ออกจากหน้านี้" severity="secondary" (onClick)="leave()"></wt-button>`,
    inputs: `<wt-button label="อีเมล" (onClick)="askEmail()"></wt-button>
<wt-button label="สาขา" (onClick)="askBranch()"></wt-button>`,
    preconfirm: `<wt-button label="ส่งคำขอ" (onClick)="request()"></wt-button>`,
    timer: `<wt-button label="บันทึกอัตโนมัติ" (onClick)="autosave()"></wt-button>`,
    custom: `<wt-button label="โปรโมชัน" (onClick)="promo()"></wt-button>`,
    helpers: `<wt-button label="ออกจากระบบ" (onClick)="logout()"></wt-button>
<wt-button label="คัดลอกลิงก์" (onClick)="copied()"></wt-button>
<wt-button label="ซิงก์ข้อมูล" (onClick)="sync()"></wt-button>`,
    migration: `<wt-button label="เรียกแบบ static" (onClick)="legacy()"></wt-button>`,
  },
  ts: {
    import: `import { inject } from '@angular/core';
import { WtAlertService } from 'wiratheme/alert';

export class OrdersComponent {
  readonly alert = inject(WtAlertService);
}

// หรือเรียกจากที่ไหนก็ได้ (ต้องมี provideWiraTheme() ใน app.config.ts / AppModule)
import { WtAlert } from 'wiratheme/alert';
WtAlert.fire('บันทึกแล้ว', '', 'success');`,
    question: `async remove(): Promise<void> {
  const r = await this.alert.fire({
    title: 'ลบรายการนี้?',
    text: 'ลบแล้วกู้คืนไม่ได้',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบเลย',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626',
    focusCancel: true,
  });
  if (r.isConfirmed) this.alert.fire('ลบแล้ว', '', 'success');
}`,
    deny: `async leave(): Promise<void> {
  const r = await this.alert.fire({
    title: 'บันทึกการแก้ไขก่อนออก?',
    icon: 'question',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'บันทึก',
    denyButtonText: 'ไม่บันทึก',
  });
  // r.isConfirmed → บันทึก · r.isDenied → ไม่บันทึก · r.isDismissed → อยู่ต่อ (r.dismiss = 'cancel' | 'esc' | …)
}`,
    inputs: `async askEmail(): Promise<void> {
  const { value } = await this.alert.fire({
    title: 'ส่งใบเสร็จทางอีเมล',
    input: 'email',
    inputPlaceholder: 'name@example.com',
    showCancelButton: true,
    inputValidator: (v) => (!v ? 'กรุณากรอกอีเมล' : undefined),
  });
  if (value) this.alert.fire('ส่งแล้ว', value, 'success');
}

async askBranch(): Promise<void> {
  const { value } = await this.alert.fire({
    title: 'เลือกสาขา',
    input: 'select',
    inputOptions: { bkk: 'กรุงเทพฯ', cnx: 'เชียงใหม่', hkt: 'ภูเก็ต' },
    inputPlaceholder: 'เลือกสาขา',
    showCancelButton: true,
    inputValidator: (v) => (!v ? 'กรุณาเลือกสาขา' : undefined),
  });
}`,
    preconfirm: `async request(): Promise<void> {
  const r = await this.alert.fire({
    title: 'ขอใบเสนอราคา',
    input: 'text',
    inputLabel: 'ชื่อบริษัท',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async (name) => {
      const res = await this.api.createQuote(name);   // spinner แสดงระหว่างรอ
      return res.id;                                  // กลายเป็น r.value
    },
  });
  if (r.isConfirmed) this.alert.fire('ส่งคำขอแล้ว', 'เลขที่ ' + r.value, 'success');
}`,
    timer: `autosave(): void {
  this.alert.fire({
    title: 'บันทึกอัตโนมัติแล้ว',
    icon: 'success',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}`,
    custom: `promo(): void {
  this.alert.fire({
    title: 'ส่วนลดสมาชิก',
    html: 'ใช้โค้ด <b>WELCOME20</b> รับส่วนลด <b>20%</b> ถึงสิ้นเดือนนี้',
    icon: 'info',
    confirmButtonText: 'ใช้โค้ด',
    confirmButtonColor: '#7c3aed',
    footer: '<a href="https://example.com/terms">อ่านเงื่อนไข</a>',
    width: '32rem',
  });
}`,
    helpers: `async logout(): Promise<void> {
  if (await this.alert.confirm('ออกจากระบบ?', 'งานที่ยังไม่บันทึกจะหายไป')) {
    // ...
  }
}

private readonly notify = this.alert.mixin({ icon: 'success', timer: 1500, showConfirmButton: false });
copied(): void {
  this.notify.fire({ title: 'คัดลอกลิงก์แล้ว' });
}

async sync(): Promise<void> {
  this.alert.showLoading();
  await this.api.sync();
  this.alert.close();
}`,
    migration: `import { WtAlert } from 'wiratheme/alert';

// object ของ option ที่ใช้อยู่ส่งต่อให้ fire() ได้เลย
const r = await WtAlert.fire({
  title: 'ลบรายการนี้?',
  text: 'ลบแล้วกู้คืนไม่ได้',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'ลบ',
  cancelButtonText: 'ยกเลิก',
});
if (r.isConfirmed) WtAlert.fire({ title: 'ลบแล้ว', icon: 'success' });`,
  },
  api: [
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'มีทั้งใน WtAlertService และ WtAlert (static)', en: 'On WtAlertService and the static WtAlert.' },
      rows: [
        row('fire(options) · fire(title, text?, icon?)', 'Promise<WtAlertResult>', undefined, 'เปิดกล่อง', 'Opens an alert'),
        row('success · error · warning · info · question (title, text?)', 'Promise<WtAlertResult>', undefined, 'ทางลัดตาม icon', 'Shortcuts per icon'),
        row('confirm(options | title, text?)', 'Promise<boolean>', undefined, 'คำถามใช่ / ไม่ (โฟกัสปุ่มยกเลิก)', 'Yes / no question (cancel focused)'),
        row('mixin(defaults)', '{ fire }', undefined, 'ชุดค่าเริ่มต้นไว้ใช้ซ้ำ', 'A preset to reuse'),
        row('close(result?)', 'void', undefined, 'ปิดกล่องที่เปิดอยู่', 'Closes the open alert'),
        row('showLoading · hideLoading · isLoading', 'void · boolean', undefined, 'spinner แทนปุ่ม', 'Spinner instead of the buttons'),
        row('isVisible · getPopup', 'boolean · HTMLElement | null', undefined, 'สถานะและ element ของกล่อง', 'State and the popup element'),
        row('clickConfirm · clickCancel', 'void', undefined, 'กดปุ่มจากโค้ด', 'Press a button from code'),
        row('showValidationMessage · resetValidationMessage', 'void', undefined, 'ข้อความผิดพลาดใต้ช่องกรอก', 'Message under the input'),
      ],
    },
    {
      id: 'api-options',
      title: 'Options',
      rows: [
        row('title · text · html · footer', 'string', undefined, 'เนื้อหา (html ผ่าน sanitizer)', 'Content (html is sanitized)'),
        row('icon · iconColor', 'WtAlertIcon · string', undefined, 'icon เคลื่อนไหวและสี', 'Animated icon and its colour'),
        row('confirmButtonText · cancelButtonText · denyButtonText', 'string', 'locale', 'ข้อความปุ่ม', 'Button texts'),
        row('showConfirmButton · showCancelButton · showDenyButton · showCloseButton', BOOL, 'true · false · false · false', 'ปุ่มที่แสดง', 'Buttons shown'),
        row('confirmButtonColor · cancelButtonColor · denyButtonColor', 'string', undefined, 'สีพื้นปุ่ม (สี CSS ใดก็ได้)', 'Button colours (any CSS colour)'),
        row('reverseButtons', BOOL, 'true', 'ยกเลิกอยู่ซ้าย ยืนยันอยู่ขวา; false = ยืนยันอยู่ซ้าย', 'Cancel left, confirm right; false puts confirm left'),
        row('focusConfirm · focusCancel', BOOL, 'false', 'ปุ่มที่โฟกัสเมื่อเปิด', 'Which button has focus when it opens'),
        row('allowOutsideClick · allowEscapeKey · allowEnterKey', 'boolean', 'true', 'วิธีปิดและยืนยัน', 'Ways to close and confirm'),
        row('timer · timerProgressBar', 'number · boolean', undefined, 'ปิดเองตามเวลา', 'Close after a while'),
        row('input · inputValue · inputPlaceholder · inputLabel · inputOptions · inputAttributes', 'WtAlertInput …', undefined, 'ช่องกรอก', 'Input'),
        row('inputValidator · validationMessage', 'function · string', undefined, 'ตรวจค่าก่อนยืนยัน', 'Check the value before confirming'),
        row('preConfirm · showLoaderOnConfirm', 'function · boolean', undefined, 'ทำงานก่อนปิด พร้อม spinner', 'Work before closing, with a spinner'),
        row('didOpen · willClose · didClose', 'function', undefined, 'จังหวะเปิด / ปิด', 'Open / close hooks'),
        row('width · customClass', 'string | number · string | object', undefined, 'ความกว้างและ class (มือถือกว้างเท่าจอ)', 'Width and classes (phones get the screen width)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question' | 'danger' | 'warn' | 'help';
type WtAlertInput = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkbox';
type WtAlertDismissReason = 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';

interface WtAlertResult<T = any> {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value?: T;          // true เมื่อยืนยัน หรือค่าที่กรอก / ผลของ preConfirm, false เมื่อปฏิเสธ
  dismiss?: WtAlertDismissReason;
}`,
    },
  ],
  tokens: [
    tok('--wt-alert-width', 'ความกว้าง', 'Width'),
    tok('--wt-alert-padding', 'ระยะใน', 'Padding'),
    tok('--wt-alert-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-alert-icon-size', 'ขนาด icon', 'Icon size'),
    tok('--wt-alert-title-size', 'ขนาดหัวข้อ', 'Title size'),
    tok('--wt-dialog-bg', 'พื้น (ร่วมกับ Dialog)', 'Background (shared with Dialog)'),
    tok('--wt-dialog-border', 'ขอบ', 'Border'),
    tok('--wt-dialog-shadow', 'เงา', 'Shadow'),
  ],
};

export const CONFIRMDIALOG_DOC: ComponentDoc = {
  id: 'confirmdialog',
  title: 'ConfirmDialog',
  group: 'Overlay',
  entry: 'confirmdialog',
  standalone: 'WtConfirmDialog',
  module: 'WtConfirmDialogModule',
  selector: 'wt-confirmdialog',
  description: {
    th: 'กล่องยืนยันที่เรียกจาก service: วาง <wt-confirmdialog> ไว้ครั้งเดียว แล้วเรียก confirm() พร้อมข้อความ ปุ่ม และ callback',
    en: 'A confirmation asked through a service: place <wt-confirmdialog> once, then call confirm() with the message, buttons and callbacks.',
  },
  english: {
    'ลบลูกค้า': 'Delete customer',
    'ยืนยันด้านบน': 'Confirm at the top',
    'คำเชิญเข้าทีม': 'Team invitation',
    'ถามโดยไม่มีกล่อง': 'Ask with no dialog',
    'ก': 'K',
    'ไว้ก่อน': 'Not now',
    'เข้าร่วม': 'Join',
    'หรือ:': 'or:',
    'ยืนยันการลบ': 'Confirm delete',
    'ต้องการลบลูกค้ารายนี้หรือไม่?': 'Delete this customer?',
    'ลบแล้ว': 'Deleted',
    'ปิดไป': 'Closed',
    'บันทึกแบบร่าง': 'Save draft',
    'บันทึกก่อนออกจากหน้านี้?': 'Save before you leave this page?',
    'บันทึกแบบร่างแล้ว': 'Draft saved',
    'กมล ชวนคุณเข้าร่วมทีม "การตลาด"': 'Kevin invited you to the "Marketing" team',
    'เข้าร่วมแล้ว': 'Joined',
    'ไม่มี <wt-confirmdialog key="none"> ในหน้า: เปิดเป็น AlertDialog แทน': 'no <wt-confirmdialog key="none"> on the page: it opens as an AlertDialog instead',
    'ส่งออกไฟล์?': 'Export the file?',
    'ไฟล์จะถูกส่งไปที่อีเมลของคุณ': 'The file goes to your email.',
    'ส่งออกแล้ว': 'Exported',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WtConfirmationService</code> อยู่ใน <code>wiratheme/confirmdialog</code> หรือ import จาก <code>wiratheme/api</code> พร้อมชื่อที่แอปใช้อยู่ (<code>ConfirmationService</code>, <code>ConfirmEventType</code>) ซึ่งรวม <code>MessageService</code>, <code>WtTemplate</code> / <code>SharedModule</code> และ <code>WtAlert</code> ไว้ใน import เดียว',
        en: '<code>WtConfirmationService</code> comes from <code>wiratheme/confirmdialog</code>, or from <code>wiratheme/api</code> under the names apps already use (<code>ConfirmationService</code>, <code>ConfirmEventType</code>), together with <code>MessageService</code>, <code>WtTemplate</code> / <code>SharedModule</code> and <code>WtAlert</code> in one import.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>accept</code> ทำงานเมื่อกดยืนยัน <code>reject</code> ได้ชนิดของการปิด (REJECT หรือ CANCEL เมื่อปิดด้วย × / Esc) ปุ่มยืนยันตกแต่งด้วย <code>acceptButtonStyleClass</code> ชื่อ class ปุ่มแบบที่ใช้อยู่',
        en: '<code>accept</code> runs on confirm; <code>reject</code> gets how it closed (REJECT, or CANCEL for × / Esc). Style the accept button with <code>acceptButtonStyleClass</code> in the button class names apps already use.',
      },
    },
    icons: {
      title: { th: 'icon ในตัว', en: 'Built-in icons' },
      text: {
        th: '<code>icon</code> เป็น warning, question, info, success หรือ error เพื่อใช้ icon ในตัว ชื่อ class ของ icon ที่ใช้กันทั่วไป (เช่น <code>wi wi-exclamation-triangle</code>) ก็แสดงเป็น icon ในตัวได้แม้ไม่มี icon font',
        en: '<code>icon</code> takes warning, question, info, success or error for the built-in icons; common icon classes (such as <code>wi wi-exclamation-triangle</code>) are recognised too, even without an icon font.',
      },
    },
    key: {
      title: { th: 'หลายกล่องในหน้าเดียว', en: 'Several on a page' },
      text: { th: 'ใส่ <code>key</code> ให้ <code>&lt;wt-confirmdialog&gt;</code> และ <code>confirm()</code> ให้ตรงกัน แต่ละกล่องตั้ง <code>position</code> และ style ของตัวเองได้', en: 'Give <code>&lt;wt-confirmdialog&gt;</code> and <code>confirm()</code> the same <code>key</code>; each dialog keeps its own <code>position</code> and style.' },
    },
    templates: {
      title: 'Templates',
      text: {
        th: '<code>#message</code> (ได้ confirmation เป็น <code>let-c</code>), <code>#header</code>, <code>#footer</code> และ <code>#headless</code> ส่วนท้ายแบบกำหนดเองเรียก <code>cd.accept()</code> / <code>cd.reject()</code> ผ่าน template reference',
        en: '<code>#message</code> (with the confirmation as <code>let-c</code>), <code>#header</code>, <code>#footer</code> and <code>#headless</code>. A custom footer calls <code>cd.accept()</code> / <code>cd.reject()</code> through a template reference.',
      },
    },
    fallback: {
      title: { th: 'ไม่มีกล่องในหน้า', en: 'No dialog on the page' },
      text: {
        th: 'ถ้าไม่มี <code>&lt;wt-confirmdialog&gt;</code> ที่ key ตรงกันในหน้า คำถามจะเปิดเป็น AlertDialog แทน ไม่หายไปเฉย ๆ',
        en: 'When no <code>&lt;wt-confirmdialog&gt;</code> with that key is on the page, the question opens as an AlertDialog instead of getting lost.',
      },
    },
  },
  code: {
    basic: `<wt-confirmdialog></wt-confirmdialog>
<wt-button label="ลบลูกค้า" severity="danger" icon="wi wi-trash" (onClick)="remove()"></wt-button>`,
    icons: `<wt-button label="warning" (onClick)="ask('warning')"></wt-button>
<wt-button label="question" (onClick)="ask('question')"></wt-button>
<!-- info · success · error -->`,
    key: `<wt-confirmdialog key="top" position="top"></wt-confirmdialog>
<wt-button label="ยืนยันด้านบน" (onClick)="askTop()"></wt-button>`,
    templates: `<wt-confirmdialog key="custom" #cd>
  <ng-template #message let-c>
    <div class="invite">
      <wt-avatar label="ก" shape="circle" size="large"></wt-avatar>
      <p>{{ c?.message }}</p>
    </div>
  </ng-template>
  <ng-template #footer>
    <wt-button label="ไว้ก่อน" [text]="true" (onClick)="cd.reject()"></wt-button>
    <wt-button label="เข้าร่วม" icon="wi wi-check" (onClick)="cd.accept()"></wt-button>
  </ng-template>
</wt-confirmdialog>`,
    fallback: `<wt-button label="ถามโดยไม่มีกล่อง" (onClick)="askNowhere()"></wt-button>`,
  },
  ts: {
    import: `import { inject } from '@angular/core';
import { WtConfirmationService, WtConfirmEventType } from 'wiratheme/confirmdialog';
// หรือ: import { ConfirmationService, ConfirmEventType } from 'wiratheme/api';

export class CustomersComponent {
  private readonly confirmation = inject(WtConfirmationService);
}`,
    basic: `remove(): void {
  this.confirmation.confirm({
    header: 'ยืนยันการลบ',
    message: 'ต้องการลบลูกค้ารายนี้หรือไม่?',
    icon: 'wi wi-exclamation-triangle',
    acceptLabel: 'ลบ',
    rejectLabel: 'ยกเลิก',
    acceptButtonStyleClass: 'p-button-danger',
    defaultFocus: 'reject',
    accept: () => (this.result = 'ลบแล้ว'),
    reject: (type: WtConfirmEventType) =>
      (this.result = type === WtConfirmEventType.CANCEL ? 'ปิดไป' : 'ยกเลิก'),
  });
}`,
    icons: `ask(icon: string): void {
  this.confirmation.confirm({ header: 'icon: ' + icon, message: 'ข้อความตัวอย่าง', icon });
}`,
    key: `askTop(): void {
  this.confirmation.confirm({ key: 'top', header: 'บันทึกแบบร่าง', message: 'บันทึกก่อนออกจากหน้านี้?', icon: 'question' });
}`,
    templates: `invite(): void {
  this.confirmation.confirm({
    key: 'custom',
    header: 'คำเชิญเข้าทีม',
    message: 'กมล ชวนคุณเข้าร่วมทีม "การตลาด"',
    accept: () => (this.result = 'เข้าร่วมแล้ว'),
  });
}`,
    fallback: `askNowhere(): void {
  // ไม่มี <wt-confirmdialog key="none"> ในหน้า: เปิดเป็น AlertDialog แทน
  this.confirmation.confirm({ key: 'none', header: 'ส่งออกไฟล์?', message: 'ไฟล์จะถูกส่งไปที่อีเมลของคุณ', icon: 'info' });
}`,
  },
  api: [
    {
      id: 'api-confirm',
      title: { th: 'confirm() options', en: 'confirm() options' },
      rows: [
        row('message · header', 'string', undefined, 'ข้อความและหัวข้อ', 'Message and title'),
        row('icon', 'string', undefined, 'warning, question, info, success, error หรือ class ของ icon', 'warning, question, info, success, error or an icon class'),
        row('accept', '() => void', undefined, 'กดยืนยัน', 'Confirmed'),
        row('reject', '(type: WtConfirmEventType) => void', undefined, 'กดปฏิเสธ (REJECT) หรือปิดไป (CANCEL)', 'Rejected (REJECT) or closed (CANCEL)'),
        row('acceptLabel · rejectLabel · acceptIcon · rejectIcon', 'string', 'locale', 'ข้อความและ icon ของปุ่ม', 'Button texts and icons'),
        row('acceptVisible · rejectVisible', BOOL, 'true', 'แสดงปุ่ม', 'Show the button'),
        row('acceptButtonStyleClass · rejectButtonStyleClass', 'string', undefined, 'class ของปุ่ม', 'Button classes'),
        row('defaultFocus', "'accept' | 'reject' | 'close' | 'none'", "'accept'", 'ปุ่มที่โฟกัสเมื่อเปิด', 'Focused button on open'),
        row('key', 'string', undefined, 'เลือกกล่องที่ key ตรงกัน', 'Picks the dialog with that key'),
        row('closable · closeOnEscape · dismissableMask · blockScroll', BOOL, undefined, 'วิธีปิดและการล็อกการเลื่อน', 'Ways to close and scroll lock'),
        row('position · style · styleClass · data', 'string · object · string · unknown', undefined, 'ตำแหน่ง ตกแต่ง และข้อมูลสำหรับ template', 'Place, styling and data for templates'),
      ],
    },
    {
      id: 'api-inputs',
      title: { th: 'Inputs ของ wt-confirmdialog', en: 'wt-confirmdialog inputs' },
      note: { th: 'ค่าเริ่มต้นเมื่อ confirm() ไม่ได้ระบุ', en: 'Defaults when confirm() leaves them out.' },
      rows: [
        row('key', 'string', undefined, 'ฟังเฉพาะ confirm() ที่ key ตรงกัน', 'Listens to confirm() with this key'),
        row('header · message · icon · acceptLabel · rejectLabel · acceptIcon · rejectIcon', 'string', undefined, 'ค่าเริ่มต้นของข้อความ', 'Default texts'),
        row('acceptVisible · rejectVisible · closable · closeOnEscape · dismissableMask · blockScroll', BOOL, undefined, 'ค่าเริ่มต้นของปุ่มและการปิด', 'Default buttons and closing'),
        row('defaultFocus · position · breakpoints · style · styleClass · maskStyleClass', '…', undefined, 'ค่าเริ่มต้นของการแสดงผล', 'Default look'),
        row('appendTo · baseZIndex · autoZIndex · draggable · rtl · transitionOptions · focusTrap · modal', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ (กล่องเป็น modal เสมอ)', 'Accepted so existing templates compile (the dialog is always modal)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onHide', 'WtConfirmEventType', undefined, 'ปิดแล้ว พร้อมผล', 'Closed, with the outcome')],
    },
    {
      id: 'api-dialog-methods',
      title: { th: 'เมธอดของกล่อง', en: 'Dialog methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'ผ่าน template reference เช่น #cd ในส่วนท้ายแบบกำหนดเอง', en: 'Through a template reference such as #cd, in a custom footer.' },
      rows: [
        row('accept() · reject()', 'void', undefined, 'ยืนยัน / ปฏิเสธ', 'Confirm / reject'),
        row('onAccept() · onReject()', 'void', undefined, 'ชื่อเดิมของ accept() / reject() ที่ส่วนท้ายเดิมเรียกอยู่', 'The older names of accept() / reject() that existing footers call'),
      ],
    },
    {
      id: 'api-service',
      title: 'WtConfirmationService',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('confirm(confirmation)', 'this', undefined, 'ถามคำถาม', 'Asks'),
        row('close()', 'this', undefined, 'ปิดกล่องที่เปิดอยู่', 'Closes the open one'),
        row('requireConfirmation$ · accept', 'Observable', undefined, 'สำหรับ component ที่ทำกล่องเอง', 'For components drawing their own dialog'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `enum WtConfirmEventType {
  ACCEPT = 0,
  REJECT = 1,
  CANCEL = 2,
}`,
    },
  ],
  tokens: [
    tok('--wt-dialog-bg', 'พื้นกล่อง (ใช้ token ของ Dialog)', 'Box background (Dialog tokens)'),
    tok('--wt-dialog-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-dialog-header-padding', 'ระยะในหัว', 'Header padding'),
    tok('--wt-dialog-content-padding', 'ระยะในเนื้อหา', 'Content padding'),
    tok('--wt-dialog-footer-padding', 'ระยะในส่วนท้าย', 'Footer padding'),
    tok('--wt-warn-color', 'สี icon warning', 'Warning icon colour'),
    tok('--wt-help-color', 'สี icon question', 'Question icon colour'),
    tok('--wt-info-color', 'สี icon info', 'Info icon colour'),
    tok('--wt-success-color', 'สี icon success', 'Success icon colour'),
    tok('--wt-danger-color', 'สี icon error', 'Error icon colour'),
  ],
};
