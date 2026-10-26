import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const BLOCKUI_DOC: ComponentDoc = {
  id: 'blockui',
  title: 'BlockUI',
  group: 'Overlay',
  entry: 'blockui',
  standalone: 'WtBlockUI',
  module: 'WtBlockUIModule',
  selector: 'wt-blockui',
  description: {
    th: 'บังทั้งหน้า หรือบังเฉพาะส่วนหนึ่ง ระหว่างที่งานกำลังทำ เช่นตอนบันทึก ส่วนที่ถูกบังกดและ Tab เข้าไปไม่ได้ ตรงกลางแสดงสิ่งที่ใส่ไว้ (spinner หรือข้อความ)',
    en: 'Covers the whole page, or one part of it, while work runs, such as a save. What is covered cannot be pressed or tabbed into; the middle shows what you put inside (a spinner or a message).',
  },
  english: {
    'ข้อมูลนักเรียน': 'Student details',
    'ชื่อ - สกุล': 'Name',
    'ด.ช.กิตติพัฒน์ ใจดี': 'Liam Smith',
    'ห้อง': 'Class',
    'ม.1/1': '7/1',
    'กำลังบันทึก': 'Saving',
    'บันทึกทั้งหมด': 'Save everything',
    'กำลังส่งผลการเรียน กรุณาอย่าปิดหน้านี้': 'Sending the grades, please keep this page open',
    'ส่งผลการเรียน': 'Send grades',
    'บันทึกครั้งที่': 'Saves',
    'ปุ่มด้านใน': 'Inside button',
    'กดไม่ได้ระหว่างบัง': 'cannot be pressed while covered',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtBlockUIModule</code>) และ standalone (<code>WtBlockUI</code>) แท็กเขียนได้ทั้ง <code>wt-blockui</code>, <code>wt-blockUI</code> และ <code>wt-block-ui</code>',
        en: 'Works as an NgModule (<code>WtBlockUIModule</code>) or standalone (<code>WtBlockUI</code>). The tag can be written <code>wt-blockui</code>, <code>wt-blockUI</code> or <code>wt-block-ui</code>.',
      },
    },
    target: {
      title: { th: 'บังส่วนหนึ่ง', en: 'Covering one part' },
      text: {
        th: '<code>[blocked]="isApiSaving"</code> กับ <code>[target]="studentForm"</code> (template ref ของ element, ElementRef หรือ component ที่มี <code>el</code> / <code>getBlockableElement()</code>) ม่านย้ายเข้าไปอยู่ในส่วนนั้น ส่วนนั้นได้ <code>aria-busy="true"</code> และเนื้อหาข้างในเป็น <code>inert</code> (กดและ Tab เข้าไม่ได้) จนกว่า <code>blocked</code> จะเป็น false · <code>ariaLabel</code> คือข้อความที่โปรแกรมอ่านหน้าจออ่านระหว่างบัง',
        en: '<code>[blocked]="isApiSaving"</code> with <code>[target]="studentForm"</code> (a template ref to an element, an ElementRef, or a component with <code>el</code> / <code>getBlockableElement()</code>). The cover moves into that part, which gets <code>aria-busy="true"</code>, and what is inside turns <code>inert</code> (no presses, no Tab) until <code>blocked</code> is false · <code>ariaLabel</code> is what screen readers hear while it is covered.',
      },
    },
    document: {
      title: { th: 'บังทั้งหน้า', en: 'Covering the page' },
      text: {
        th: 'ไม่ใส่ <code>target</code> ม่านคลุมทั้งหน้าเป็น modal dialog ใน top layer หน้าเบื้องหลังกดไม่ได้และเลื่อนไม่ได้ <code>Esc</code> ปิดไม่ได้ ม่านอยู่จนกว่า <code>blocked</code> เป็น false เหมาะกับงานที่ห้ามขัดจังหวะ เช่นส่งผลการเรียน',
        en: 'Without a <code>target</code> the cover takes the whole page as a modal dialog in the top layer: the page behind cannot be pressed or scrolled and <code>Esc</code> does not close it; it stays until <code>blocked</code> is false. It suits work that must not be interrupted, such as sending grades.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-blockUI&gt;</code> เป็น <code>&lt;wt-blockUI&gt;</code> <code>[blocked]</code> และ <code>[target]</code> ชื่อเดิม เนื้อหาตรงกลางใส่ตรง ๆ หรือใช้ <code>pTemplate="content"</code> ก็ได้ · <code>autoZIndex</code> และ <code>baseZIndex</code> รับไว้แต่ไม่มีผล (ม่านทั้งหน้าอยู่ใน top layer) · class <code>p-blockui</code> และ <code>p-blockui-document</code> อยู่คู่กับ class <code>wt-*</code>',
        en: 'Change <code>&lt;p-blockUI&gt;</code> to <code>&lt;wt-blockUI&gt;</code>; <code>[blocked]</code> and <code>[target]</code> keep their names, and the middle content goes straight inside or in <code>pTemplate="content"</code> · <code>autoZIndex</code> and <code>baseZIndex</code> are accepted and ignored (the page cover is in the top layer) · the <code>p-blockui</code> and <code>p-blockui-document</code> classes sit next to the <code>wt-*</code> ones.',
      },
    },
  },
  code: {
    target: `<div #studentForm class="student-form">
  <b>ข้อมูลนักเรียน</b>
  <label for="name">ชื่อ - สกุล</label>
  <input id="name" name="name" wtInputText [(ngModel)]="studentName" />
  <wt-button label="ปุ่มด้านใน" severity="secondary" [outlined]="true"></wt-button>
</div>
<wt-blockUI [blocked]="isApiSaving" [target]="studentForm" ariaLabel="กำลังบันทึก">
  <wt-progress-spinner [style]="{ width: '2rem', height: '2rem' }"></wt-progress-spinner>
  <span>กำลังบันทึก</span>
</wt-blockUI>
<wt-button label="บันทึก" icon="wi wi-save" [loading]="isApiSaving" (onClick)="save()"></wt-button>`,
    document: `<wt-blockUI [blocked]="isApiSending" ariaLabel="กำลังส่งผลการเรียน กรุณาอย่าปิดหน้านี้">
  <wt-progress-spinner [style]="{ width: '3rem', height: '3rem' }"></wt-progress-spinner>
  <p>กำลังส่งผลการเรียน กรุณาอย่าปิดหน้านี้</p>
</wt-blockUI>
<wt-button label="ส่งผลการเรียน" icon="wi wi-send" (onClick)="sendGrades()"></wt-button>`,
  },
  ts: {
    target: `studentName = 'ด.ช.กิตติพัฒน์ ใจดี';
isApiSaving = false;

save(): void {
  this.isApiSaving = true;
  this.studentService.save(this.studentName).subscribe({
    next: () => (this.isApiSaving = false),
    error: () => (this.isApiSaving = false),
  });
}`,
    document: `isApiSending = false;

sendGrades(): void {
  this.isApiSending = true;
  this.gradeService.send().subscribe({
    next: () => (this.isApiSending = false),
    error: () => (this.isApiSending = false),
  });
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('blocked', BOOL, 'false', 'บังอยู่หรือไม่', 'Whether it covers'),
        row('target', 'HTMLElement | ElementRef | component', undefined, 'บังเฉพาะส่วนนี้ (ไม่ใส่ = ทั้งหน้า)', 'Cover only this part (none: the whole page)'),
        row('ariaLabel', 'string', undefined, 'ข้อความที่โปรแกรมอ่านหน้าจออ่านระหว่างบัง', 'Read out while it covers'),
        row('styleClass', 'string', undefined, 'class เพิ่มที่ม่าน', 'Extra class on the cover'),
        row('autoZIndex · baseZIndex', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      rows: [row('content', '—', undefined, 'สิ่งที่แสดงตรงกลาง (ใส่เป็นเนื้อหาในแท็กตรง ๆ ก็ได้)', 'What shows in the middle (or put it straight inside the tag)')],
    },
  ],
  tokens: [
    tok('--wt-blockui-mask', 'สีม่าน', 'Cover colour'),
    tok('--wt-blockui-color', 'สีตัวอักษรบนม่าน', 'Text colour on the cover'),
  ],
};
