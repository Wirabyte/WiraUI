import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const STEPS_DOC: ComponentDoc = {
  id: 'steps',
  title: 'Steps',
  group: 'Menu',
  entry: 'steps',
  standalone: 'WtSteps',
  module: 'WtStepsModule',
  selector: 'wt-steps',
  description: {
    th: 'ขั้นตอนของงานเป็นหมายเลขเรียงบนเส้น บอกว่าอยู่ขั้นไหน ขั้นที่ผ่านมาแล้วเป็นสีหลัก ใช้แสดงความคืบหน้าเฉย ๆ หรือให้กดเลือกขั้นเองก็ได้',
    en: 'The steps of a process as numbers along a line, showing where you are; steps already passed take the primary colour. Use it as a progress display, or let people pick a step.',
  },
  english: {
    'กรอกข้อมูล': 'Your details',
    'อัปโหลดเอกสาร': 'Documents',
    'ชำระเงิน': 'Payment',
    'ยืนยัน': 'Confirm',
    'เลือกหลักสูตร': 'Programme',
    'ข้อมูลผู้ปกครอง': 'Parents',
    'นัดสัมภาษณ์': 'Interview',
    'ประกาศผล': 'Results',
    'ส่งใบสมัคร': 'Apply',
    'ตรวจเอกสาร': 'Document check',
    'สอบข้อเขียน': 'Written test',
    'รายงานตัว': 'Enrolment',
    'เจ้าหน้าที่ทำให้': 'done by the office',
    'ขั้นล่าสุด': 'Last step',
    'ลำดับของขั้น (เริ่มที่ 0)': 'step index (0-based)',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtStepsModule</code>) และ standalone (<code>WtSteps</code>) ขั้นตอนแต่ละขั้นเป็น <code>MenuItem</code> จาก <code>wiratheme/api</code>',
        en: 'Works as an NgModule (<code>WtStepsModule</code>) or standalone (<code>WtSteps</code>). Each step is a <code>MenuItem</code> from <code>wiratheme/api</code>.',
      },
    },
    basic: {
      title: { th: 'แสดงความคืบหน้า', en: 'Progress display' },
      text: {
        th: '<code>[model]</code> คือขั้นตอนทั้งหมด และ <code>[activeIndex]</code> คือขั้นปัจจุบัน (เริ่มที่ 0) <code>readonly</code> เป็น true เป็นค่าเริ่มต้น จึงใช้แสดงความคืบหน้าเฉย ๆ กดไม่ได้ ขั้นก่อนหน้าขั้นปัจจุบันแสดงด้วยสีหลัก ปุ่มย้อนกลับ / ถัดไปอยู่นอก wt-steps และแค่เปลี่ยน <code>activeIndex</code> · บนจอแคบชื่อขั้นตัดขึ้นบรรทัดใหม่ใต้หมายเลข',
        en: '<code>[model]</code> lists the steps and <code>[activeIndex]</code> marks the current one (0-based). <code>readonly</code> is true by default, so it is a progress display that cannot be clicked. Steps before the current one show in the primary colour. The Back / Next buttons sit outside wt-steps and only change <code>activeIndex</code>. On narrow screens the labels wrap under their numbers.',
      },
    },
    interactive: {
      title: { th: 'เลือกขั้นเองได้', en: 'Pickable steps' },
      text: {
        th: '<code>[readonly]="false"</code> ให้เลือกขั้นได้ด้วยการคลิกหรือคีย์บอร์ด ผูกขั้นปัจจุบันด้วย <code>[(activeIndex)]</code> การเลือกเรียก <code>command</code> ของขั้นนั้นด้วย ส่วนขั้นที่มี <code>routerLink</code> หรือ <code>url</code> ไปตามลิงก์',
        en: '<code>[readonly]="false"</code> lets people pick a step by click or keyboard; bind the current one with <code>[(activeIndex)]</code>. Picking a step also runs its <code>command</code>, and steps with a <code>routerLink</code> or <code>url</code> follow their link.',
      },
    },
    disabled: {
      title: { th: 'ขั้นที่เลือกไม่ได้', en: 'Disabled steps' },
      text: {
        th: 'ขั้นที่ <code>disabled: true</code> กดไม่ได้และปุ่มลูกศรข้ามไป ส่วน <code>visible: false</code> ไม่แสดงเลย ลองกด <code>→</code> จากขั้นแรก',
        en: 'A step with <code>disabled: true</code> cannot be picked and the arrow keys skip it; <code>visible: false</code> hides a step. Try <code>→</code> from the first step.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'ใช้คีย์บอร์ดได้เมื่อ <code>[readonly]="false"</code>: ทั้งแถวเป็นจุด Tab จุดเดียว (ขั้นปัจจุบัน) · <code>←</code> <code>→</code> เลื่อนระหว่างขั้น · <code>Home</code> / <code>End</code> ขั้นแรก / สุดท้าย · <code>Enter</code> / <code>Space</code> เลือกขั้นนั้น · ข้ามขั้นที่ disabled · ขั้นปัจจุบันมี <code>aria-current="step"</code> และขั้นที่เลือกได้เป็น <code>role="button"</code> แบบ readonly ไม่มีจุด Tab',
        en: 'With <code>[readonly]="false"</code>: the row is one Tab stop (the current step) · <code>←</code> <code>→</code> move between steps · <code>Home</code> / <code>End</code> first / last · <code>Enter</code> / <code>Space</code> pick the step · disabled steps are skipped · the current step has <code>aria-current="step"</code> and pickable steps are <code>role="button"</code>. A read-only row has no Tab stop.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-steps&gt;</code> เป็น <code>&lt;wt-steps&gt;</code> input เดิม (<code>model</code>, <code>activeIndex</code>, <code>readonly</code>, <code>styleClass</code>) ใช้ได้เหมือนเดิม และ class <code>p-steps-*</code> อยู่คู่กับ <code>wt-steps-*</code> ส่วน <code>exact</code> รับไว้แต่ไม่มีผล ขั้นตอนแบบ value ที่มีเนื้อหาของแต่ละขั้นในตัวยังไม่มี',
        en: 'Change <code>&lt;p-steps&gt;</code> to <code>&lt;wt-steps&gt;</code>. The inputs (<code>model</code>, <code>activeIndex</code>, <code>readonly</code>, <code>styleClass</code>) work as before, and the <code>p-steps-*</code> classes sit next to <code>wt-steps-*</code>; <code>exact</code> is accepted and ignored. A value-based stepper that holds each step\'s content is not built yet.',
      },
    },
  },
  code: {
    basic: `<wt-steps [model]="steps" [activeIndex]="activeIndex"></wt-steps>
<div class="flex justify-content-between">
  <wt-button label="ย้อนกลับ" icon="pi pi-chevron-left" severity="secondary" [text]="true"
    [disabled]="activeIndex === 0" (onClick)="back()"></wt-button>
  <wt-button label="ถัดไป" icon="pi pi-chevron-right" iconPos="right"
    [disabled]="activeIndex === steps.length - 1" (onClick)="next()"></wt-button>
</div>`,
    interactive: `<wt-steps [model]="admission" [(activeIndex)]="current" [readonly]="false"></wt-steps>`,
    disabled: `<wt-steps [model]="checks" [(activeIndex)]="checkIndex" [readonly]="false"></wt-steps>`,
  },
  ts: {
    basic: `import { MenuItem } from 'wiratheme/api';

steps: MenuItem[] = [
  { label: 'กรอกข้อมูล' },
  { label: 'อัปโหลดเอกสาร' },
  { label: 'ชำระเงิน' },
  { label: 'ยืนยัน' },
];
activeIndex = 1;

back(): void {
  this.activeIndex = Math.max(0, this.activeIndex - 1);
}

next(): void {
  this.activeIndex = Math.min(this.steps.length - 1, this.activeIndex + 1);
}`,
    interactive: `import { MenuItem, MenuItemCommandEvent } from 'wiratheme/api';

admission: MenuItem[] = [
  { label: 'เลือกหลักสูตร', command: (event) => this.go(event) },
  { label: 'ข้อมูลผู้ปกครอง', command: (event) => this.go(event) },
  { label: 'นัดสัมภาษณ์', command: (event) => this.go(event) },
  { label: 'ประกาศผล', command: (event) => this.go(event) },
];
current = 0;
lastStep = '';

go(event: MenuItemCommandEvent): void {
  this.lastStep = event.item?.label ?? '';
}`,
    disabled: `checks: MenuItem[] = [
  { label: 'ส่งใบสมัคร' },
  { label: 'ตรวจเอกสาร', disabled: true },   // เจ้าหน้าที่ทำให้
  { label: 'สอบข้อเขียน' },
  { label: 'รายงานตัว' },
];
checkIndex = 0;`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', '[]', 'ขั้นตอนทั้งหมด', 'The steps'),
        row('activeIndex', 'number', '0', 'ขั้นปัจจุบัน (เริ่มที่ 0) ใช้ [(activeIndex)] ได้', 'The current step (0-based); [(activeIndex)] works'),
        row('readonly', BOOL, 'true', 'แสดงอย่างเดียว กดเลือกไม่ได้ (false = เลือกด้วยคลิกหรือคีย์บอร์ด)', 'Display only (false = pick by click or keyboard)'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของแถบ', 'Bar class / style'),
        row('id', 'string', undefined, 'id ของแถบ ใช้นำหน้า id ของแต่ละขั้น', 'Bar id; prefixes the step ids'),
        row('exact', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('activeIndexChange', 'number', undefined, 'ผู้ใช้เลือกขั้นอื่น (เมื่อ readonly เป็น false)', 'The user picked another step (with readonly false)')],
    },
    {
      id: 'api-menuitem',
      title: 'MenuItem',
      note: { th: 'field ของ MenuItem ที่ wt-steps ใช้', en: 'The MenuItem fields wt-steps reads.' },
      rows: [
        row('label', 'string', undefined, 'ชื่อขั้น', 'Step label'),
        row('command', '(event: MenuItemCommandEvent) => void', undefined, 'ทำงานเมื่อเลือกขั้นนี้', 'Runs when the step is picked'),
        row('routerLink · queryParams · fragment · replaceUrl · state', 'unknown', undefined, 'ลิงก์ของ router เมื่อเลือกขั้นนี้', 'A router link followed on pick'),
        row('url', 'string', undefined, 'ลิงก์ธรรมดา (href) เมื่อเลือกขั้นนี้', 'A plain link (href) followed on pick'),
        row('disabled · visible', BOOL, 'false · true', 'เลือกไม่ได้ (คีย์บอร์ดข้าม) · ไม่แสดง', 'Cannot be picked (the keyboard skips it) · hidden'),
        row('styleClass · style · title', 'string · object', undefined, 'class / style ของขั้น และ title ของลิงก์', 'Step class / style, and the link title'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { MenuItem, MenuItemCommandEvent } from 'wiratheme/api';

interface MenuItemCommandEvent {
  originalEvent?: Event;
  item?: MenuItem;
  index?: number;   // ลำดับของขั้น (เริ่มที่ 0)
}`,
    },
  ],
  tokens: [
    tok('--wt-steps-number-size', 'ขนาดวงกลมหมายเลข', 'Number circle size'),
    tok('--wt-steps-number-border-width', 'ความหนาขอบวงกลมหมายเลข', 'Number circle border width'),
    tok('--wt-steps-number-bg', 'พื้นวงกลมหมายเลข (ขั้นที่ยังไม่ถึง)', 'Number circle background (steps not reached)'),
    tok('--wt-steps-number-color', 'สีหมายเลข (ขั้นที่ยังไม่ถึง)', 'Number colour (steps not reached)'),
    tok('--wt-steps-line-width', 'ความหนาเส้นเชื่อมระหว่างขั้น', 'Width of the line between steps'),
    tok('--wt-steps-line-color', 'สีเส้นเชื่อมและขอบวงกลม (ขั้นที่ยังไม่ถึง)', 'Line and circle border colour (steps not reached)'),
    tok('--wt-steps-gap', 'ระยะระหว่างหมายเลขกับชื่อขั้น', 'Gap between the number and the label'),
    tok('--wt-steps-label-color', 'สีชื่อขั้น', 'Label colour'),
    tok('--wt-steps-label-weight', 'น้ำหนักตัวอักษรชื่อขั้น', 'Label font weight'),
    tok('--wt-steps-label-active-color', 'สีชื่อขั้นปัจจุบัน', 'Current step label colour'),
    tok('--wt-primary-color', 'ขั้นปัจจุบัน ขั้นที่ผ่านมาแล้ว และเส้นถึงขั้นเหล่านั้น', 'The current step, steps passed and the line up to them'),
    tok('--wt-primary-contrast', 'หมายเลขของขั้นปัจจุบัน', 'Number of the current step'),
  ],
};
