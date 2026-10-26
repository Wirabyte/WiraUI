import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

export const INPLACE_DOC: ComponentDoc = {
  id: 'inplace',
  title: 'Inplace',
  group: 'Panel',
  entry: 'inplace',
  standalone: 'WtInplace',
  module: 'WtInplaceModule',
  selector: 'wt-inplace',
  description: {
    th: 'แสดงค่าเป็นข้อความธรรมดาจนกว่าจะคลิก แล้วจึงเปลี่ยนเป็นช่องแก้ไข เหมาะกับหน้าข้อมูลที่ส่วนใหญ่ดูอย่างเดียว เปิดแล้วโฟกัสเข้าช่องแก้ไขทันที และ Esc ปิดกลับ',
    en: 'Shows a value as plain text until it is clicked, then the field to edit it. It suits pages people mostly read; opening puts focus in the field and Esc goes back.',
  },
  english: {
    'ด.ช.กิตติพัฒน์ ใจดี': 'Liam Smith',
    'ชื่อเล่น': 'Nickname',
    'ต้นกล้า': 'Tony',
    'คลิกเพื่อแก้ไข': 'Click to edit',
    'ดูรูปอาคาร': 'Show the building',
    'อาคารเรียนของโรงเรียน': 'The school building',
    'หมายเหตุ': 'Note',
    'ยังไม่มีหมายเหตุ': 'No note yet',
    'แก้ไขหมายเหตุ': 'Edit the note',
    'เปิดจากโค้ด': 'Open from code',
    'ปิด': 'Close',
    'ชื่อ - สกุล': 'Name',
    'สร้างเมื่อเปิดครั้งแรก': 'created on first open',
    'บันทึกแล้วจึงปิด': 'save, then close',
    'ข้อมูลจาก API': 'data from the API',
    'แก้ไขได้เฉพาะเจ้าหน้าที่': 'Only staff can edit',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtInplaceModule</code>) และ standalone (<code>WtInplace</code>)',
        en: 'Works as an NgModule (<code>WtInplaceModule</code>) or standalone (<code>WtInplace</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'template <code>display</code> คือสิ่งที่เห็นก่อน และ <code>content</code> คือช่องแก้ไข คลิก กด <code>Enter</code> หรือ <code>Space</code> ที่ข้อความเพื่อเปิด แล้วโฟกัสจะเข้าช่องแรกในนั้น · <code>[closable]="true"</code> มีปุ่มปิด และ <code>Esc</code> ปิดได้ โฟกัสกลับมาที่ข้อความ · เนื้อหาใน <code>content</code> สร้างเมื่อเปิดเท่านั้น',
        en: 'The <code>display</code> template is what shows first and <code>content</code> is the field. Click, or press <code>Enter</code> or <code>Space</code> on the text, to open it; focus goes to the first field inside · <code>[closable]="true"</code> adds a close button and lets <code>Esc</code> close it, focus going back to the text · what is in <code>content</code> is created only when it opens.',
      },
    },
    save: {
      title: { th: 'บันทึกแล้วปิด', en: 'Save, then close' },
      text: {
        th: 'template <code>content</code> ได้ <code>closeCallback</code> (<code>let-closeCallback="closeCallback"</code>) เรียกหลังบันทึกเสร็จเพื่อกลับไปเป็นข้อความ · ระหว่างบันทึกใช้ <code>[loading]="isApiSaving"</code>',
        en: 'The <code>content</code> template gets <code>closeCallback</code> (<code>let-closeCallback="closeCallback"</code>); call it once the save is done to go back to the text · while saving, <code>[loading]="isApiSaving"</code>.',
      },
    },
    lazy: {
      title: { th: 'โหลดเมื่อเปิด', en: 'Load on open' },
      text: {
        th: 'เพราะ <code>content</code> สร้างเมื่อเปิด รูปหรือส่วนที่หนักจึงยังไม่โหลดจนกว่าจะกด · <code>closeIcon</code> หรือ template <code>closeicon</code> เปลี่ยนไอคอนปุ่มปิด และ <code>closeAriaLabel</code> ตั้งชื่อปุ่ม',
        en: 'Because <code>content</code> is created on open, a picture or a heavy part does not load until it is pressed · <code>closeIcon</code> or the <code>closeicon</code> template change the close icon, and <code>closeAriaLabel</code> names the button.',
      },
    },
    control: {
      title: { th: 'ควบคุมจากโค้ด', en: 'From code' },
      text: {
        th: '<code>[(active)]</code> เปิด / ปิดจากโค้ด หรือเรียก <code>activate()</code> / <code>deactivate()</code> ผ่าน template ref · <code>[preventClick]="true"</code> คลิกข้อความแล้วไม่เปิด (เปิดจากปุ่มเท่านั้น) · <code>[disabled]="true"</code> เปิดไม่ได้เลย · <code>(onActivate)</code> / <code>(onDeactivate)</code> เมื่อเปิด / ปิด',
        en: '<code>[(active)]</code> opens and closes it from code, or call <code>activate()</code> / <code>deactivate()</code> through a template ref · <code>[preventClick]="true"</code>: clicking the text does not open it (only your button does) · <code>[disabled]="true"</code>: it cannot open at all · <code>(onActivate)</code> / <code>(onDeactivate)</code> on open / close.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-inplace&gt;</code> เป็น <code>&lt;wt-inplace&gt;</code> template <code>pTemplate="display"</code> / <code>"content"</code> ใช้ต่อได้ และเนื้อหาที่ใส่ attribute <code>pInplaceDisplay</code> / <code>pInplaceContent</code> แบบเก่าก็อ่านได้ input และ event ชื่อเดิม class <code>p-inplace</code> อยู่คู่กับ <code>wt-inplace</code>',
        en: 'Change <code>&lt;p-inplace&gt;</code> to <code>&lt;wt-inplace&gt;</code>. <code>pTemplate="display"</code> / <code>"content"</code> keep working, and content marked with the older <code>pInplaceDisplay</code> / <code>pInplaceContent</code> attributes is read too. Inputs and events keep their names; the <code>p-inplace</code> class sits next to <code>wt-inplace</code>.',
      },
    },
  },
  code: {
    basic: `<wt-inplace [closable]="true">
  <ng-template #display>
    <span>{{ studentName }}</span>
  </ng-template>
  <ng-template #content>
    <input wtInputText name="studentName" [(ngModel)]="studentName" aria-label="ชื่อ - สกุล" />
  </ng-template>
</wt-inplace>`,
    save: `<wt-inplace>
  <ng-template #display>
    ชื่อเล่น: <b>{{ nickname }}</b>
  </ng-template>
  <ng-template #content let-closeCallback="closeCallback">
    <input wtInputText name="nickname" [(ngModel)]="nickname" aria-label="ชื่อเล่น" />
    <wt-button label="บันทึก" icon="wi wi-check" size="small" [loading]="isApiSaving" (onClick)="saveNickname(closeCallback)"></wt-button>
  </ng-template>
</wt-inplace>`,
    lazy: `<wt-inplace [closable]="true" closeIcon="wi wi-times">
  <ng-template #display>
    <i class="wi wi-image"></i> ดูรูปอาคาร
  </ng-template>
  <ng-template #content>
    <img src="photos/school.jpg" alt="อาคารเรียนของโรงเรียน" width="320" />
  </ng-template>
</wt-inplace>`,
    control: `<wt-inplace #noteEditor [(active)]="editingNote" [preventClick]="true" [closable]="true">
  <ng-template #display>
    {{ note || 'ยังไม่มีหมายเหตุ' }}
  </ng-template>
  <ng-template #content>
    <textarea wtTextarea name="note" [(ngModel)]="note" rows="3" aria-label="หมายเหตุ"></textarea>
  </ng-template>
</wt-inplace>
<wt-button label="แก้ไขหมายเหตุ" icon="wi wi-pencil" severity="secondary" [text]="true" (onClick)="noteEditor.activate()"></wt-button>
<wt-inplace [disabled]="true">
  <ng-template #display>แก้ไขได้เฉพาะเจ้าหน้าที่</ng-template>
</wt-inplace>`,
  },
  ts: {
    basic: `studentName = 'ด.ช.กิตติพัฒน์ ใจดี';   // ข้อมูลจาก API`,
    save: `nickname = 'ต้นกล้า';
isApiSaving = false;

/** บันทึกแล้วจึงปิด */
saveNickname(close: () => void): void {
  this.isApiSaving = true;
  this.studentService.saveNickname(this.nickname).subscribe({
    next: () => {
      this.isApiSaving = false;
      close();
    },
    error: () => (this.isApiSaving = false),
  });
}`,
    control: `note = '';
editingNote = false;`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('active', BOOL, 'false', 'เปิดอยู่หรือไม่ (สองทาง [(active)])', 'Whether it is open (two-way [(active)])'),
        row('closable', BOOL, 'false', 'มีปุ่มปิด และ Esc ปิดได้', 'A close button, and Esc closes it'),
        row('disabled', BOOL, 'false', 'เปิดไม่ได้', 'It cannot open'),
        row('preventClick', BOOL, 'false', 'คลิกข้อความแล้วไม่เปิด (เปิดจากโค้ด)', 'Clicking the text does not open it (open it from code)'),
        row('closeIcon · closeAriaLabel', 'string', undefined, 'class ไอคอนและชื่อของปุ่มปิด (ชื่อเริ่มต้นมาจาก locale)', 'Icon class and name of the close button (the default name comes from the locale)'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onActivate · onDeactivate', 'Event', undefined, 'เปิด / ปิด', 'Opened / closed'),
        row('activeChange', 'boolean', undefined, 'คู่ของ [(active)]', 'For [(active)]'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #display, wtTemplate="display" หรือ pTemplate="display" ก็ได้', en: 'Write them as #display, wtTemplate="display" or pTemplate="display".' },
      rows: [
        row('display', '—', undefined, 'สิ่งที่เห็นก่อนเปิด', 'What shows before it opens'),
        row('content', 'closeCallback', undefined, 'ช่องแก้ไข (สร้างเมื่อเปิด)', 'The field (created on open)'),
        row('closeicon', '—', undefined, 'ไอคอนของปุ่มปิด', 'The close button\'s icon'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [
        row('activate(event?)', 'void', undefined, 'เปิดแล้วโฟกัสเข้าช่องแรก', 'Opens it and focuses the first field'),
        row('deactivate(event?)', 'void', undefined, 'ปิดกลับเป็นข้อความ (โฟกัสกลับเมื่ออยู่ข้างใน)', 'Back to the text (focus returns when it was inside)'),
      ],
    },
  ],
  tokens: [tok('--wt-inplace-padding', 'ระยะรอบข้อความที่คลิกได้', 'Padding around the clickable text')],
};
