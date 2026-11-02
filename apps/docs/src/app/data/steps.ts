import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const STEPS_DOC: ComponentDoc = {
  id: 'steps',
  title: 'Steps',
  group: 'Navigation',
  entry: 'steps',
  standalone: 'WuSteps',
  module: 'WuStepsModule',
  selector: 'wu-steps',
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
    'แต่ละขั้น': 'each step',
    'ออนไลน์': 'Online',
    'ภายใน 3 วัน': 'Within 3 days',
    'ที่โรงเรียน': 'At the school',
    'พร้อมผู้ปกครอง': 'With a parent',
    'labelPosition="bottom" เป็นค่าเริ่มต้น ไม่ต้องใส่': 'labelPosition="bottom" is the default; no need to write it',
    'ชื่อขั้นและ subtitle อยู่ข้างหมายเลข': 'label and subtitle beside the number',
    'แนวตั้ง เลือกขั้นได้ ใช้ ↑ ↓ ได้ด้วย': 'a column that can be picked, ↑ ↓ too',
    'เปลี่ยนเมื่อเลือกขั้นในแบบแนวตั้ง': 'changes when a step is picked in the column',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuStepsModule</code>) และ standalone (<code>WuSteps</code>) ขั้นตอนแต่ละขั้นเป็น <code>MenuItem</code> จาก <code>wiraui/api</code>',
        en: 'Works as an NgModule (<code>WuStepsModule</code>) or standalone (<code>WuSteps</code>). Each step is a <code>MenuItem</code> from <code>wiraui/api</code>.',
      },
    },
    basic: {
      title: { th: 'แสดงความคืบหน้า', en: 'Progress display' },
      text: {
        th: '<code>[model]</code> คือขั้นตอนทั้งหมด และ <code>[activeIndex]</code> คือขั้นปัจจุบัน (เริ่มที่ 0) <code>readonly</code> เป็น true เป็นค่าเริ่มต้น จึงใช้แสดงความคืบหน้าเฉย ๆ กดไม่ได้ ขั้นก่อนหน้าขั้นปัจจุบันแสดงด้วยสีหลัก ปุ่มย้อนกลับ / ถัดไปอยู่นอก wu-steps และแค่เปลี่ยน <code>activeIndex</code> · บนจอแคบชื่อขั้นตัดขึ้นบรรทัดใหม่ใต้หมายเลข',
        en: '<code>[model]</code> lists the steps and <code>[activeIndex]</code> marks the current one (0-based). <code>readonly</code> is true by default, so it is a progress display that cannot be clicked. Steps before the current one show in the primary colour. The Back / Next buttons sit outside wu-steps and only change <code>activeIndex</code>. On narrow screens the labels wrap under their numbers.',
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
    layout: {
      title: { th: 'การจัดวาง', en: 'Layout' },
      text: {
        th: 'wu-steps จัดวางได้แบบเดียวกับ Stepper แล้ว: <code>labelPosition</code> วางชื่อขั้นไว้ใต้หมายเลข (<code>\'bottom\'</code> ค่าเริ่มต้น) หรือข้างหมายเลข (<code>\'right\'</code>) และ <code>orientation="vertical"</code> เรียงขั้นเป็นคอลัมน์ · ทั้งสามตัวอย่างใช้ <code>enrolSteps</code> ชุดเดียวกัน (มี <code>subtitle</code>) และ <code>enrolIndex</code> ตัวเดียวกัน ลองเลือกขั้นในแบบแนวตั้งแล้วดูอีกสองแบบเปลี่ยนตาม · บนมือถือ (กว้างน้อยกว่า 576px) แบบข้างหมายเลขแสดงชื่อเฉพาะขั้นปัจจุบัน',
        en: 'wu-steps now lays out the way Stepper does: <code>labelPosition</code> puts each label under its number (<code>\'bottom\'</code>, the default) or beside it (<code>\'right\'</code>), and <code>orientation="vertical"</code> stacks the steps in a column · the three demos share one <code>enrolSteps</code> list (with <code>subtitle</code>) and one <code>enrolIndex</code>: pick a step in the column and watch the other two follow · on phones (narrower than 576px) the beside-the-number layout shows only the current step\'s label.',
      },
    },
    'layout-bottom': {
      title: { th: 'ใต้หมายเลข (ค่าเริ่มต้น)', en: 'Under the number (default)' },
      text: {
        th: '<code>labelPosition="bottom"</code>: แต่ละขั้นกว้างเท่ากัน ชื่อขั้นและ <code>subtitle</code> อยู่ใต้หมายเลข และเส้นเชื่อมลากจากหมายเลขถึงหมายเลข · บนจอแคบชื่อขั้นตัดขึ้นบรรทัดใหม่ใต้หมายเลข',
        en: '<code>labelPosition="bottom"</code>: the steps take equal columns, the label and <code>subtitle</code> sit under the number, and the line runs from number to number · on narrow screens the labels wrap under their numbers.',
      },
    },
    'layout-right': {
      title: { th: 'ข้างหมายเลข', en: 'Beside the number' },
      text: {
        th: '<code>labelPosition="right"</code> วางชื่อขั้นและ <code>subtitle</code> ไว้ข้างหมายเลข แล้วเส้นยาวเต็มช่องจนถึงขั้นถัดไป เส้นหลังขั้นที่ผ่านแล้วเป็นสีหลัก · จอแคบกว่า 576px แสดงชื่อเฉพาะขั้นปัจจุบัน ขั้นอื่นซ่อนชื่อไว้แต่โปรแกรมอ่านจอยังอ่านได้',
        en: '<code>labelPosition="right"</code> puts the label and <code>subtitle</code> beside the number, with a line filling the space to the next step; the line after a completed step is in the primary colour · below 576px only the current step shows its label; the others hide theirs, though screen readers still read them.',
      },
    },
    'layout-vertical': {
      title: { th: 'แนวตั้ง', en: 'Vertical' },
      text: {
        th: '<code>orientation="vertical"</code> เรียงขั้นเป็นคอลัมน์ ชื่อขั้นอยู่ข้างหมายเลข และเส้นลากลงระหว่างหมายเลข เหมาะกับแถบด้านข้างหรือจอมือถือ ระยะระหว่างขั้นตั้งด้วย token <code>--wu-steps-vertical-gap</code> · กับ <code>[readonly]="false"</code> ปุ่ม <code>↑</code> <code>↓</code> เลื่อนระหว่างขั้นได้เหมือน <code>←</code> <code>→</code> · ตัวอย่างนี้เลือกขั้นได้และผูกด้วย <code>[(activeIndex)]</code>',
        en: '<code>orientation="vertical"</code> stacks the steps in a column, each label beside its number, with the line running down between the numbers: for a side panel or a phone. The token <code>--wu-steps-vertical-gap</code> sets the space between steps · with <code>[readonly]="false"</code>, <code>↑</code> <code>↓</code> move between steps as <code>←</code> <code>→</code> do · this demo can be picked and is bound with <code>[(activeIndex)]</code>.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'ใช้คีย์บอร์ดได้เมื่อ <code>[readonly]="false"</code>: ทั้งแถวเป็นจุด Tab จุดเดียว (ขั้นปัจจุบัน) · <code>←</code> <code>→</code> เลื่อนระหว่างขั้น (แนวตั้งใช้ <code>↑</code> <code>↓</code> ได้ด้วย) · <code>Home</code> / <code>End</code> ขั้นแรก / สุดท้าย · <code>Enter</code> / <code>Space</code> เลือกขั้นนั้น · ข้ามขั้นที่ disabled · ขั้นปัจจุบันมี <code>aria-current="step"</code> และขั้นที่เลือกได้เป็น <code>role="button"</code> แบบ readonly ไม่มีจุด Tab',
        en: 'With <code>[readonly]="false"</code>: the row is one Tab stop (the current step) · <code>←</code> <code>→</code> move between steps (<code>↑</code> <code>↓</code> too in a column) · <code>Home</code> / <code>End</code> first / last · <code>Enter</code> / <code>Space</code> pick the step · disabled steps are skipped · the current step has <code>aria-current="step"</code> and pickable steps are <code>role="button"</code>. A read-only row has no Tab stop.',
      },
    },
    stepper: {
      title: { th: 'Stepper แบบ value', en: 'The value-based Stepper' },
      text: {
        th: 'ถ้าแต่ละขั้นมีเนื้อหาของตัวเอง (ฟอร์มหลายขั้น) ใช้ Stepper (<code>wu-stepper</code>) ซึ่งผูกขั้นปัจจุบันด้วย value และมีแบบ linear กับแนวตั้ง ส่วน wu-steps ยังเป็นแถบขั้นตอนจาก <code>MenuItem[]</code> เหมือนเดิม · <code>&lt;wu-stepper [model]="steps" [(activeIndex)]="activeIndex" [readonly]="true"&gt;</code> วาดแถบแบบเดียวกับหน้านี้ได้ (รายการ <code>MenuItem</code> ชุดเดิม พร้อม <code>subtitle</code> และ <code>labelPosition="bottom"</code>) โค้ดใหม่จึงใช้ component เดียวได้ทั้งแถบขั้นตอนและฟอร์มหลายขั้น · ตอนนี้ทั้งสองตัวจัดวางได้เหมือนกัน: <code>labelPosition</code> แบบ <code>\'bottom\'</code> / <code>\'right\'</code> และแนวตั้ง (ดูหัวข้อการจัดวาง) ต่างกันแค่ค่าเริ่มต้น wu-steps วางชื่อใต้หมายเลข ส่วน wu-stepper วางข้างหมายเลข',
        en: 'When each step has its own content (a multi-step form), use Stepper (<code>wu-stepper</code>): bound by value, with linear and vertical layouts. wu-steps stays the bar of steps from a <code>MenuItem[]</code> · <code>&lt;wu-stepper [model]="steps" [(activeIndex)]="activeIndex" [readonly]="true"&gt;</code> draws the same bar as this page (the same <code>MenuItem</code> items, plus <code>subtitle</code> and <code>labelPosition="bottom"</code>), so new code can use one component for both a bar of steps and a multi-step form · both now share the same layouts: <code>labelPosition</code> <code>\'bottom\'</code> / <code>\'right\'</code> and a vertical column (see Layout); only the defaults differ: wu-steps puts the label under the number, wu-stepper beside it.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-steps&gt;</code> เป็น <code>&lt;wu-steps&gt;</code> input เดิม (<code>model</code>, <code>activeIndex</code>, <code>readonly</code>, <code>styleClass</code>) ใช้ได้เหมือนเดิม และ class <code>p-steps-*</code> อยู่คู่กับ <code>wu-steps-*</code> ส่วน <code>exact</code> รับไว้แต่ไม่มีผล ขั้นตอนแบบ value ที่มีเนื้อหาของแต่ละขั้นในตัว (<code>p-stepper</code>) ย้ายไปที่ Stepper',
        en: 'Change <code>&lt;p-steps&gt;</code> to <code>&lt;wu-steps&gt;</code>. The inputs (<code>model</code>, <code>activeIndex</code>, <code>readonly</code>, <code>styleClass</code>) work as before, and the <code>p-steps-*</code> classes sit next to <code>wu-steps-*</code>; <code>exact</code> is accepted and ignored. A value-based stepper that holds each step\'s content (<code>p-stepper</code>) moves to Stepper.',
      },
    },
  },
  code: {
    basic: `<wu-steps [model]="steps" [activeIndex]="activeIndex"></wu-steps>
<div class="flex justify-content-between">
  <wu-button label="ย้อนกลับ" icon="wi wi-chevron-left" severity="secondary" [text]="true"
    [disabled]="activeIndex === 0" (onClick)="back()"></wu-button>
  <wu-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right"
    [disabled]="activeIndex === steps.length - 1" (onClick)="next()"></wu-button>
</div>`,
    interactive: `<wu-steps [model]="admission" [(activeIndex)]="current" [readonly]="false"></wu-steps>`,
    disabled: `<wu-steps [model]="checks" [(activeIndex)]="checkIndex" [readonly]="false"></wu-steps>`,
    'layout-bottom': `<!-- labelPosition="bottom" เป็นค่าเริ่มต้น ไม่ต้องใส่ -->
<wu-steps [model]="enrolSteps" [activeIndex]="enrolIndex"></wu-steps>`,
    'layout-right': `<!-- ชื่อขั้นและ subtitle อยู่ข้างหมายเลข -->
<wu-steps [model]="enrolSteps" [activeIndex]="enrolIndex" labelPosition="right"></wu-steps>`,
    'layout-vertical': `<!-- แนวตั้ง เลือกขั้นได้ ใช้ ↑ ↓ ได้ด้วย -->
<wu-steps [model]="enrolSteps" [(activeIndex)]="enrolIndex" orientation="vertical" [readonly]="false"></wu-steps>`,
  },
  ts: {
    basic: `import { MenuItem } from 'wiraui/api';

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
    interactive: `import { MenuItem, MenuItemCommandEvent } from 'wiraui/api';

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
    layout: `import { MenuItem } from 'wiraui/api';

enrolSteps: MenuItem[] = [
  { label: 'ส่งใบสมัคร', subtitle: 'ออนไลน์' },
  { label: 'ตรวจเอกสาร', subtitle: 'ภายใน 3 วัน' },
  { label: 'สอบข้อเขียน', subtitle: 'ที่โรงเรียน' },
  { label: 'รายงานตัว', subtitle: 'พร้อมผู้ปกครอง' },
];
enrolIndex = 1;   // เปลี่ยนเมื่อเลือกขั้นในแบบแนวตั้ง`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', '[]', 'ขั้นตอนทั้งหมด', 'The steps'),
        row('activeIndex', 'number', '0', 'ขั้นปัจจุบัน (เริ่มที่ 0) ใช้ [(activeIndex)] ได้', 'The current step (0-based); [(activeIndex)] works'),
        row('readonly', BOOL, 'true', 'แสดงอย่างเดียว กดเลือกไม่ได้ (false = เลือกด้วยคลิกหรือคีย์บอร์ด)', 'Display only (false = pick by click or keyboard)'),
        row('labelPosition', "'bottom' | 'right'", "'bottom'", 'ชื่อขั้น (และ subtitle) อยู่ใต้หรือข้างหมายเลข · right บนจอแคบกว่า 576px แสดงชื่อเฉพาะขั้นปัจจุบัน', 'Label (and subtitle) under or beside the number · right shows only the current label below 576px'),
        row('orientation', "'horizontal' | 'vertical'", "'horizontal'", 'แถวหรือคอลัมน์ แนวตั้งวางชื่อข้างหมายเลขและใช้ ↑ ↓ ได้', 'A row or a column; vertical puts labels beside the numbers and takes ↑ ↓'),
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
      note: { th: 'field ของ MenuItem ที่ wu-steps ใช้', en: 'The MenuItem fields wu-steps reads.' },
      rows: [
        row('label', 'string', undefined, 'ชื่อขั้น', 'Step label'),
        row('subtitle', 'string', undefined, 'บรรทัดเล็กใต้ชื่อขั้น', 'A smaller line under the label'),
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
      code: `import { MenuItem, MenuItemCommandEvent } from 'wiraui/api';

interface MenuItemCommandEvent {
  originalEvent?: Event;
  item?: MenuItem;
  index?: number;   // ลำดับของขั้น (เริ่มที่ 0)
}

// nav: .wu-steps-label-right (labelPosition="right") · .wu-steps-vertical (orientation="vertical")
// แต่ละขั้น: .wu-steps-number + .wu-steps-text (.wu-steps-label, .wu-steps-subtitle)`,
    },
  ],
  tokens: [
    tok('--wu-steps-number-size', 'ขนาดวงกลมหมายเลข', 'Number circle size'),
    tok('--wu-steps-number-border-width', 'ความหนาขอบวงกลมหมายเลข', 'Number circle border width'),
    tok('--wu-steps-number-bg', 'พื้นวงกลมหมายเลข (ขั้นที่ยังไม่ถึง)', 'Number circle background (steps not reached)'),
    tok('--wu-steps-number-color', 'สีหมายเลข (ขั้นที่ยังไม่ถึง)', 'Number colour (steps not reached)'),
    tok('--wu-steps-line-width', 'ความหนาเส้นเชื่อมระหว่างขั้น', 'Width of the line between steps'),
    tok('--wu-steps-line-color', 'สีเส้นเชื่อมและขอบวงกลม (ขั้นที่ยังไม่ถึง)', 'Line and circle border colour (steps not reached)'),
    tok('--wu-steps-gap', 'ระยะระหว่างหมายเลขกับชื่อขั้น', 'Gap between the number and the label'),
    tok('--wu-steps-vertical-gap', 'ระยะระหว่างขั้นในแนวตั้ง (orientation="vertical")', 'Space between steps in a column (orientation="vertical")'),
    tok('--wu-steps-label-color', 'สีชื่อขั้น', 'Label colour'),
    tok('--wu-steps-label-weight', 'น้ำหนักตัวอักษรชื่อขั้น', 'Label font weight'),
    tok('--wu-steps-label-active-color', 'สีชื่อขั้นปัจจุบัน', 'Current step label colour'),
    tok('--wu-primary-color', 'ขั้นปัจจุบัน ขั้นที่ผ่านมาแล้ว และเส้นถึงขั้นเหล่านั้น', 'The current step, steps passed and the line up to them'),
    tok('--wu-primary-contrast', 'หมายเลขของขั้นปัจจุบัน', 'Number of the current step'),
  ],
};
