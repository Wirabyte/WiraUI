import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/** Back / Next buttons of a panel, as the samples write them. */
const nav = (back: number | null, next: number | null, indent = '        ') =>
  `${indent}<div class="flex justify-content-between">\n` +
  (back !== null
    ? `${indent}  <wt-button label="ย้อนกลับ" icon="wi wi-chevron-left" severity="secondary" [text]="true" (onClick)="activateCallback(${back})"></wt-button>\n`
    : `${indent}  <span></span>\n`) +
  (next !== null
    ? `${indent}  <wt-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right" (onClick)="activateCallback(${next})"></wt-button>\n`
    : '') +
  `${indent}</div>`;

const HEADER_V3 = `<wt-stepper [(value)]="paymentStep">
  <wt-step-list>
    @for (s of paymentSteps; track s.value) {
      <wt-step [value]="s.value">
        <ng-template #content let-activateCallback="activateCallback" let-active="active">
          <button type="button" class="step-head" [class.step-head-active]="active" [attr.aria-current]="active ? 'step' : null"
            (click)="activateCallback(s.value)">
            <i [class]="s.icon"></i> {{ s.label }}
          </button>
        </ng-template>
      </wt-step>
    }
  </wt-step-list>
  <wt-step-panels>
    <wt-step-panel [value]="1">กรอกชื่อผู้ชำระและอีเมลสำหรับส่งใบเสร็จ</wt-step-panel>
    <wt-step-panel [value]="2">เลือกโอนผ่านธนาคารหรือชำระที่ห้องการเงิน</wt-step-panel>
    <wt-step-panel [value]="3">ดาวน์โหลดใบเสร็จได้หลังเจ้าหน้าที่ตรวจแล้ว</wt-step-panel>
  </wt-step-panels>
</wt-stepper>`;

const HEADER_CLASSIC = `<wt-stepper [(value)]="paymentStep">
  <wt-step-list>
    <wt-step *ngFor="let s of paymentSteps" [value]="s.value">
      <ng-template wtTemplate="content" let-activateCallback="activateCallback" let-active="active">
        <button type="button" class="step-head" [class.step-head-active]="active" [attr.aria-current]="active ? 'step' : null"
          (click)="activateCallback(s.value)">
          <i [class]="s.icon"></i> {{ s.label }}
        </button>
      </ng-template>
    </wt-step>
  </wt-step-list>
  <wt-step-panels>
    <wt-step-panel [value]="1">กรอกชื่อผู้ชำระและอีเมลสำหรับส่งใบเสร็จ</wt-step-panel>
    <wt-step-panel [value]="2">เลือกโอนผ่านธนาคารหรือชำระที่ห้องการเงิน</wt-step-panel>
    <wt-step-panel [value]="3">ดาวน์โหลดใบเสร็จได้หลังเจ้าหน้าที่ตรวจแล้ว</wt-step-panel>
  </wt-step-panels>
</wt-stepper>`;

export const STEPPER_DOC: ComponentDoc = {
  id: 'stepper',
  title: 'Stepper',
  group: 'Panel',
  entry: 'stepper',
  standalone: 'WtStepper',
  module: 'WtStepperModule',
  selector: 'wt-stepper',
  description: {
    th: 'ขั้นตอนของงานพร้อมเนื้อหาของแต่ละขั้นในตัว ผูกขั้นปัจจุบันด้วย value แบบ linear ให้ไปต่อได้เมื่อกรอกขั้นนั้นครบ เรียงแนวนอนหรือแนวตั้งก็ได้ และวาดแถบขั้นตอนจาก menu model ได้ด้วย',
    en: 'The steps of a process with each step\'s content built in. The current step is bound by value, a linear stepper moves on only when the step is filled in, and it lays out across or down. It also draws a bar of steps from a menu model.',
  },
  english: {
    'ข้อมูลพื้นฐาน': 'Basics',
    'ที่อยู่': 'Address',
    'ยืนยัน': 'Confirm',
    'กรอกชื่อ วันเกิด และเลขประจำตัวประชาชน': 'Enter the name, date of birth and ID number',
    'ที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน': 'The registered address and the current one',
    'ตรวจข้อมูลอีกครั้งก่อนส่งใบสมัคร': 'Check everything once more before you apply',
    'ผู้สมัคร': 'Applicant',
    'ผู้ปกครอง': 'Parent',
    'ส่งใบสมัคร': 'Apply',
    'ส่งใบสมัครแล้ว': 'Application sent',
    'ชื่อ - สกุลผู้สมัคร': "Applicant's full name",
    'เบอร์โทรผู้ปกครอง': "Parent's phone",
    'เลือกปีการศึกษา': 'Academic year',
    'ปีการศึกษาและภาคเรียนที่จะเปิดรับสมัคร': 'The year and term to open applications for',
    'ตั้งค่ารอบสมัคร': 'Application round',
    'วันเปิด ปิดรับสมัคร และจำนวนที่รับ': 'Opening and closing dates, and how many places',
    'เปิดระบบ': 'Go live',
    'ตรวจทานแล้วเปิดให้ผู้สมัครเข้าใช้งาน': 'Review, then open the system to applicants',
    'ตรวจเอกสาร': 'Document check',
    'สัมภาษณ์': 'Interview',
    'ประกาศผล': 'Results',
    'จาก API': 'from the API',
    'ข้อมูลผู้ชำระ': 'Payer',
    'ช่องทางชำระ': 'Payment method',
    'ใบเสร็จ': 'Receipt',
    'กรอกชื่อผู้ชำระและอีเมลสำหรับส่งใบเสร็จ': 'Enter the payer\'s name and an email for the receipt',
    'เลือกโอนผ่านธนาคารหรือชำระที่ห้องการเงิน': 'Choose a bank transfer or paying at the finance office',
    'ดาวน์โหลดใบเสร็จได้หลังเจ้าหน้าที่ตรวจแล้ว': 'Download the receipt once the office has checked it',
    'ขั้นปัจจุบัน': 'Current step',
    'ไปหน้า Steps': 'Go to the Steps page',
    'หน้า Steps': 'the Steps page',
    'ชื่อและวันเกิด': 'Name and birthday',
    'ตามทะเบียนบ้าน': 'As registered',
    'ตรวจแล้วส่ง': 'Check and send',
    'เลือกหลักสูตร': 'Programme',
    'ห้องเรียนพิเศษ': 'Special class',
    'ข้อมูลผู้ปกครอง': 'Parents',
    'เบอร์ติดต่อ': 'Phone number',
    'ชำระเงิน': 'Payment',
    'ปิดชั่วคราว': 'Paused',
    'ขั้นที่เลือกล่าสุด': 'Last picked',
    'พ.ค.': 'May',
    'แอปเปลี่ยนขั้นเอง': 'the app moves the step',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WtStepperModule</code> รวม <code>wt-stepper</code>, <code>wt-step-list</code>, <code>wt-step</code>, <code>wt-step-panels</code>, <code>wt-step-panel</code>, <code>wt-step-item</code> และ <code>wtTemplate</code> ไว้แล้ว ถ้าเป็น standalone ให้ import <code>WtStepper</code>, <code>WtStepList</code>, <code>WtStep</code>, <code>WtStepPanels</code> และ <code>WtStepPanel</code> (กับ <code>WtStepItem</code> สำหรับแนวตั้ง)',
        en: '<code>WtStepperModule</code> brings <code>wt-stepper</code>, <code>wt-step-list</code>, <code>wt-step</code>, <code>wt-step-panels</code>, <code>wt-step-panel</code>, <code>wt-step-item</code> and <code>wtTemplate</code>. Standalone: import <code>WtStepper</code>, <code>WtStepList</code>, <code>WtStep</code>, <code>WtStepPanels</code> and <code>WtStepPanel</code> (plus <code>WtStepItem</code> for a vertical stepper).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[(value)]</code> คือค่าของขั้นปัจจุบัน · <code>wt-step-list</code> เป็นแถวหัวขั้น (<code>&lt;wt-step [value]="1"&gt;ชื่อขั้น&lt;/wt-step&gt;</code>) · <code>wt-step-panels</code> เก็บเนื้อหา (<code>wt-step-panel</code> ที่ value ตรงกัน) · ใน template <code>#content</code> ได้ <code>activateCallback</code> สำหรับปุ่มย้อนกลับ / ถัดไป · หมายเลขคือลำดับของขั้น (1, 2, 3) ขั้นก่อนหน้าขั้นปัจจุบันแสดงว่าผ่านแล้ว และคลิกหัวขั้นเพื่อไปขั้นนั้นได้',
        en: '<code>[(value)]</code> is the current step\'s value · <code>wt-step-list</code> is the row of headers (<code>&lt;wt-step [value]="1"&gt;Title&lt;/wt-step&gt;</code>) · <code>wt-step-panels</code> holds the content (the <code>wt-step-panel</code> with the same value) · a <code>#content</code> template gets <code>activateCallback</code> for its Back / Next buttons · the number is the step\'s position (1, 2, 3), steps before the current one are drawn done, and a click on a header goes to that step.',
      },
    },
    linear: {
      title: { th: 'ทำทีละขั้น (linear)', en: 'Linear' },
      text: {
        th: '<code>[linear]="true"</code> ล็อกหัวขั้นทุกขั้นยกเว้นขั้นปัจจุบัน แอปพาไปขั้นถัดไปเองด้วย <code>activateCallback</code> หลังตรวจข้อมูลของขั้นนั้น ตัวอย่างนี้ปุ่มถัดไปกดได้เมื่อกรอกชื่อแล้ว ขั้นที่สองต้องมีเบอร์โทร 10 หลัก และขั้นสุดท้ายส่งด้วยปุ่มที่มี <code>[loading]="isApiSaving"</code>',
        en: '<code>[linear]="true"</code> locks every header except the current one, so your code moves on with <code>activateCallback</code> after checking the step. Here Next works once a name is in, the second step wants a 10-digit phone number, and the last step sends with a button that has <code>[loading]="isApiSaving"</code>.',
      },
    },
    vertical: {
      title: { th: 'แนวตั้ง', en: 'Vertical' },
      text: {
        th: 'ใส่ <code>wt-step</code> กับ <code>wt-step-panel</code> คู่กันใน <code>&lt;wt-step-item [value]="1"&gt;</code> (ไม่ต้องใส่ value ซ้ำ) เนื้อหาเปิดใต้หัวขั้นของมัน และมีเส้นต่อลงไปถึงขั้นถัดไป เหมาะกับจอแคบหรือฟอร์มยาว',
        en: 'Put a <code>wt-step</code> and a <code>wt-step-panel</code> together in a <code>&lt;wt-step-item [value]="1"&gt;</code> (they take its value). The content opens under its header, with a line down to the next step. Good for phones and long forms.',
      },
    },
    progress: {
      title: { th: 'แสดงความคืบหน้า', en: 'Progress display' },
      text: {
        th: 'ขั้นที่ <code>[disabled]="true"</code> กดไม่ได้แต่ไม่จางลง แอปจึงใช้ stepper ที่ทุกขั้น disabled และไม่มี panel แสดงสถานะของใบสมัคร โดยเปลี่ยนแค่ <code>[value]</code> ตามข้อมูลจาก API · <code>[readonly]="true"</code> บน wt-stepper ทำแบบเดียวกันกับทุกขั้นในครั้งเดียว (ดูหัวข้อแสดงอย่างเดียว)',
        en: 'A step with <code>[disabled]="true"</code> cannot be clicked but is not faded, so apps use a stepper whose steps are all disabled, with no panels, to show where an application stands, changing only <code>[value]</code> from the API · <code>[readonly]="true"</code> on wt-stepper does the same for every step at once (see Read-only).',
      },
    },
    header: {
      title: { th: 'หัวขั้นแบบกำหนดเอง', en: 'Custom headers' },
      text: {
        th: 'template <code>#content</code> บน <code>wt-step</code> แทนหัวขั้นทั้งหมด ได้ <code>activateCallback</code>, <code>value</code> และ <code>active</code> แบบเดียวกับใน panel ตัวอย่างนี้ใช้ไอคอนแทนหมายเลข · เนื้อหาของ <code>wt-step-panel</code> จะเป็นข้อความธรรมดาก็ได้ (อยู่ในหน้าแต่ซ่อนไว้จนถึงขั้นนั้น)',
        en: 'A <code>#content</code> template on <code>wt-step</code> replaces its whole header and gets <code>activateCallback</code>, <code>value</code> and <code>active</code>, as in a panel. Here icons stand in for the numbers · a <code>wt-step-panel</code> can also hold plain content (it stays in the page, hidden until its step).',
      },
    },
    label: {
      title: { th: 'ชื่อขั้นใต้หมายเลขและคำอธิบาย', en: 'Titles under the numbers, and subtitles' },
      text: {
        th: '<code>subtitle</code> บน <code>wt-step</code> เพิ่มบรรทัดเล็กใต้ชื่อขั้น · <code>labelPosition="bottom"</code> วางชื่อขั้น (และ subtitle) ไว้ใต้หมายเลขใน stepper แนวนอน แต่ละขั้นกว้างเท่ากัน และเส้นเชื่อมลากจากหมายเลขถึงหมายเลข (ค่าเริ่มต้น <code>\'right\'</code> วางข้างหมายเลข) · จอแคบกว่า 576px ซ่อนชื่อของขั้นอื่นเหมือนเดิม',
        en: '<code>subtitle</code> on <code>wt-step</code> adds a smaller line under the title · <code>labelPosition="bottom"</code> puts the title (and subtitle) under the number in a horizontal stepper: the steps take equal columns and the line runs from number to number (the default, <code>\'right\'</code>, puts it beside the number) · below 576px the other steps hide their titles as before.',
      },
    },
    model: {
      title: { th: 'แถบขั้นตอนจาก model', en: 'Steps from a model' },
      text: {
        th: '<code>&lt;wt-stepper [model]="steps" [(activeIndex)]="stepIndex"&gt;</code> วาดแถวหัวขั้นจาก menu model แทน wt-step ข้างใน แบบเดียวกับแถบ Steps · รายการใช้ <code>label</code>, <code>subtitle</code>, <code>disabled</code> และ <code>command</code> (<code>visible: false</code> ไม่แสดง) · <code>activeIndex</code> เริ่มที่ 0 และการเลือกขั้นเรียก <code>command</code> ของขั้นนั้นพร้อม <code>{ originalEvent, item, index }</code> · ถ้าแต่ละขั้นมีเนื้อหา ใส่ <code>wt-step-panels</code> ที่ <code>[value]</code> เป็น 0, 1, 2 ไว้ข้างในได้ · standalone import แค่ <code>WtStepper</code>',
        en: '<code>&lt;wt-stepper [model]="steps" [(activeIndex)]="stepIndex"&gt;</code> draws the header row from a menu model instead of wt-step children, like a Steps bar · items take <code>label</code>, <code>subtitle</code>, <code>disabled</code> and <code>command</code> (<code>visible: false</code> hides one) · <code>activeIndex</code> is 0-based, and picking a step runs its <code>command</code> with <code>{ originalEvent, item, index }</code> · when steps have content, put <code>wt-step-panels</code> with <code>[value]</code> 0, 1, 2 inside · standalone apps import only <code>WtStepper</code>.',
      },
    },
    readonly: {
      title: { th: 'แสดงอย่างเดียว', en: 'Read-only' },
      text: {
        th: '<code>[readonly]="true"</code> ให้หัวขั้นบอกแค่ว่าอยู่ขั้นไหน กดไม่ได้ แอปเปลี่ยนขั้นเองด้วย <code>activeIndex</code> (หรือ <code>value</code>) ตัวอย่างนี้ใช้ model กับ <code>labelPosition="bottom"</code> และใช้ subtitle เป็นวันที่ของแต่ละขั้น',
        en: '<code>[readonly]="true"</code> makes the headers only show where the process is; they cannot be pressed, and the app moves the step itself with <code>activeIndex</code> (or <code>value</code>). This demo uses a model with <code>labelPosition="bottom"</code>, and the subtitles carry each step\'s date.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด จอแคบ และ ARIA', en: 'Keyboard, phones and ARIA' },
      text: {
        th: '<code>Tab</code> มาถึงขั้นปัจจุบัน · <code>←</code> <code>→</code> <code>Home</code> <code>End</code> เลื่อนระหว่างขั้นที่เลือกได้ · <code>Enter</code> / <code>Space</code> เลือก · หัวขั้นเป็น <code>role="tab"</code> ที่โยงกับ <code>role="tabpanel"</code> และขั้นปัจจุบันมี <code>aria-current="step"</code> · จอแคบกว่า 576px แถวหัวขั้นแสดงชื่อเฉพาะขั้นปัจจุบัน ขั้นอื่นซ่อนชื่อไว้แต่ screen reader ยังอ่านได้',
        en: '<code>Tab</code> reaches the current step · <code>←</code> <code>→</code> <code>Home</code> <code>End</code> move between the steps that can be picked · <code>Enter</code> / <code>Space</code> picks · headers are <code>role="tab"</code> tied to a <code>role="tabpanel"</code>, and the current step has <code>aria-current="step"</code> · below 576px only the current step keeps its title in the header row; the others hide theirs but screen readers still read them.',
      },
    },
    steps: {
      title: { th: 'Stepper หรือ Steps', en: 'Stepper or Steps' },
      text: {
        th: 'Stepper เก็บเนื้อหาของแต่ละขั้นและผูกด้วย value และวาดแถบขั้นตอนจาก <code>MenuItem[]</code> ได้ด้วย <code>[model]</code> + <code>[(activeIndex)]</code> โค้ดใหม่จึงใช้ wt-stepper ตัวเดียวได้ทั้งสองแบบ · Steps (<code>wt-steps</code>) ยังใช้ได้และมีหน้าของตัวเอง แอปที่ใช้อยู่ไม่ต้องย้าย (ค่าเริ่มต้นต่างกันหนึ่งจุด: wt-steps เป็น readonly อยู่แล้ว ส่วน wt-stepper ต้องใส่ <code>[readonly]="true"</code>) · ทั้งสองตัวจัดวางได้เหมือนกันแล้ว: wt-steps มี <code>labelPosition</code> (<code>\'bottom\'</code> ค่าเริ่มต้น / <code>\'right\'</code>) และ <code>orientation="vertical"</code> ดูหัวข้อการจัดวางในหน้า Steps',
        en: 'Stepper holds each step\'s content, is bound by value, and also draws the bar of steps from a <code>MenuItem[]</code> with <code>[model]</code> + <code>[(activeIndex)]</code>, so new code can use wt-stepper for both · Steps (<code>wt-steps</code>) stays, with its own page, and apps that use it need not move (one default differs: wt-steps is read-only by default, wt-stepper needs <code>[readonly]="true"</code>) · both now share the same layouts: wt-steps has <code>labelPosition</code> (<code>\'bottom\'</code>, its default, or <code>\'right\'</code>) and <code>orientation="vertical"</code>; see Layout on the Steps page.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>p-stepper</code>, <code>p-step-list</code>, <code>p-step</code>, <code>p-step-panels</code>, <code>p-step-panel</code> และ <code>p-step-item</code> เป็น <code>wt-*</code> template <code>#content</code> (หรือ <code>pTemplate="content"</code>) กับ <code>activateCallback</code> ใช้ได้เหมือนเดิม class <code>p-stepper</code> / <code>p-step-*</code> อยู่คู่กับ <code>wt-*</code> ส่วน <code>transitionOptions</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>p-stepper</code>, <code>p-step-list</code>, <code>p-step</code>, <code>p-step-panels</code>, <code>p-step-panel</code> and <code>p-step-item</code> to <code>wt-*</code>. <code>#content</code> templates (or <code>pTemplate="content"</code>) with <code>activateCallback</code> work as before, the <code>p-stepper</code> / <code>p-step-*</code> classes sit next to <code>wt-*</code>, and <code>transitionOptions</code> is accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wt-stepper [(value)]="step">
  <wt-step-list>
    <wt-step [value]="1">ข้อมูลพื้นฐาน</wt-step>
    <wt-step [value]="2">ที่อยู่</wt-step>
    <wt-step [value]="3">ยืนยัน</wt-step>
  </wt-step-list>
  <wt-step-panels>
    <wt-step-panel [value]="1">
      <ng-template #content let-activateCallback="activateCallback">
        <p>กรอกชื่อ วันเกิด และเลขประจำตัวประชาชน</p>
${nav(null, 2)}
      </ng-template>
    </wt-step-panel>
    <wt-step-panel [value]="2">
      <ng-template #content let-activateCallback="activateCallback">
        <p>ที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน</p>
${nav(1, 3)}
      </ng-template>
    </wt-step-panel>
    <wt-step-panel [value]="3">
      <ng-template #content let-activateCallback="activateCallback">
        <p>ตรวจข้อมูลอีกครั้งก่อนส่งใบสมัคร</p>
${nav(2, null)}
      </ng-template>
    </wt-step-panel>
  </wt-step-panels>
</wt-stepper>`,
    linear: `<wt-stepper [(value)]="applyStep" [linear]="true">
  <wt-step-list>
    <wt-step [value]="1">ผู้สมัคร</wt-step>
    <wt-step [value]="2">ผู้ปกครอง</wt-step>
    <wt-step [value]="3">ส่งใบสมัคร</wt-step>
  </wt-step-list>
  <wt-step-panels>
    <wt-step-panel [value]="1">
      <ng-template #content let-activateCallback="activateCallback">
        <label for="studentName">ชื่อ - สกุลผู้สมัคร</label>
        <input id="studentName" name="studentName" wtInputText [(ngModel)]="studentName" />
        <wt-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right" [disabled]="!studentName.trim()"
          (onClick)="activateCallback(2)"></wt-button>
      </ng-template>
    </wt-step-panel>
    <wt-step-panel [value]="2">
      <ng-template #content let-activateCallback="activateCallback">
        <label for="parentPhone">เบอร์โทรผู้ปกครอง</label>
        <input id="parentPhone" name="parentPhone" wtInputText inputmode="tel" [(ngModel)]="parentPhone" />
        <wt-button label="ย้อนกลับ" severity="secondary" [text]="true" (onClick)="activateCallback(1)"></wt-button>
        <wt-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right" [disabled]="parentPhone.length !== 10"
          (onClick)="activateCallback(3)"></wt-button>
      </ng-template>
    </wt-step-panel>
    <wt-step-panel [value]="3">
      <ng-template #content let-activateCallback="activateCallback">
        <p>{{ studentName }} · {{ parentPhone }}</p>
        <wt-button label="ย้อนกลับ" severity="secondary" [text]="true" [disabled]="isApiSaving"
          (onClick)="activateCallback(2)"></wt-button>
        <wt-button label="ส่งใบสมัคร" icon="wi wi-send" [loading]="isApiSaving" (onClick)="submitApplication()"></wt-button>
      </ng-template>
    </wt-step-panel>
  </wt-step-panels>
</wt-stepper>`,
    vertical: `<wt-stepper [(value)]="setupStep">
  <wt-step-item [value]="1">
    <wt-step>เลือกปีการศึกษา</wt-step>
    <wt-step-panel>
      <ng-template #content let-activateCallback="activateCallback">
        <p>ปีการศึกษาและภาคเรียนที่จะเปิดรับสมัคร</p>
${nav(null, 2)}
      </ng-template>
    </wt-step-panel>
  </wt-step-item>
  <wt-step-item [value]="2">
    <wt-step>ตั้งค่ารอบสมัคร</wt-step>
    <wt-step-panel>
      <ng-template #content let-activateCallback="activateCallback">
        <p>วันเปิด ปิดรับสมัคร และจำนวนที่รับ</p>
${nav(1, 3)}
      </ng-template>
    </wt-step-panel>
  </wt-step-item>
  <wt-step-item [value]="3">
    <wt-step>เปิดระบบ</wt-step>
    <wt-step-panel>
      <ng-template #content let-activateCallback="activateCallback">
        <p>ตรวจทานแล้วเปิดให้ผู้สมัครเข้าใช้งาน</p>
${nav(2, null)}
      </ng-template>
    </wt-step-panel>
  </wt-step-item>
</wt-stepper>`,
    progress: `<wt-stepper [value]="applicationStatus">
  <wt-step-list>
    <wt-step value="submitted" [disabled]="true">ส่งใบสมัคร</wt-step>
    <wt-step value="checking" [disabled]="true">ตรวจเอกสาร</wt-step>
    <wt-step value="interview" [disabled]="true">สัมภาษณ์</wt-step>
    <wt-step value="result" [disabled]="true">ประกาศผล</wt-step>
  </wt-step-list>
</wt-stepper>`,
    header: { v3: HEADER_V3, classic: HEADER_CLASSIC },
    label: `<wt-stepper [(value)]="enrolStep" labelPosition="bottom">
  <wt-step-list>
    <wt-step [value]="1" subtitle="ชื่อและวันเกิด">ข้อมูลพื้นฐาน</wt-step>
    <wt-step [value]="2" subtitle="ตามทะเบียนบ้าน">ที่อยู่</wt-step>
    <wt-step [value]="3" subtitle="ตรวจแล้วส่ง">ยืนยัน</wt-step>
  </wt-step-list>
  <wt-step-panels>
    <wt-step-panel [value]="1">กรอกชื่อ วันเกิด และเลขประจำตัวประชาชน</wt-step-panel>
    <wt-step-panel [value]="2">ที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน</wt-step-panel>
    <wt-step-panel [value]="3">ตรวจข้อมูลอีกครั้งก่อนส่งใบสมัคร</wt-step-panel>
  </wt-step-panels>
</wt-stepper>`,
    model: `<wt-stepper [model]="applySteps" [(activeIndex)]="stepIndex"></wt-stepper>`,
    readonly: `<wt-stepper [model]="trackSteps" [activeIndex]="trackIndex" [readonly]="true" labelPosition="bottom"></wt-stepper>
<div class="flex justify-content-between">
  <wt-button label="ย้อนกลับ" icon="wi wi-chevron-left" severity="secondary" [text]="true"
    [disabled]="trackIndex === 0" (onClick)="trackBack()"></wt-button>
  <wt-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right"
    [disabled]="trackIndex === trackSteps.length - 1" (onClick)="trackNext()"></wt-button>
</div>`,
  },
  ts: {
    basic: `step = 1;`,
    linear: `applyStep = 1;
studentName = '';
parentPhone = '';
isApiSaving = false;

submitApplication(): void {
  this.isApiSaving = true;
  const application = { studentName: this.studentName, parentPhone: this.parentPhone };
  this.applicationService.submit(application).subscribe(() => {
    this.isApiSaving = false;
  });
}`,
    vertical: `setupStep = 1;`,
    progress: `applicationStatus = 'checking';   // จาก API`,
    header: `paymentStep = 1;
paymentSteps = [
  { value: 1, label: 'ข้อมูลผู้ชำระ', icon: 'wi wi-user' },
  { value: 2, label: 'ช่องทางชำระ', icon: 'wi wi-credit-card' },
  { value: 3, label: 'ใบเสร็จ', icon: 'wi wi-check-circle' },
];`,
    label: `enrolStep = 1;`,
    model: `import { MenuItem, MenuItemCommandEvent } from 'wiratheme/api';

applySteps: MenuItem[] = [
  { label: 'เลือกหลักสูตร', subtitle: 'ห้องเรียนพิเศษ', command: (event) => this.stepPicked(event) },
  { label: 'ข้อมูลผู้ปกครอง', subtitle: 'เบอร์ติดต่อ', command: (event) => this.stepPicked(event) },
  { label: 'ชำระเงิน', subtitle: 'ปิดชั่วคราว', disabled: true },
  { label: 'ยืนยัน', command: (event) => this.stepPicked(event) },
];
stepIndex = 0;
lastStep = '';

stepPicked(event: MenuItemCommandEvent): void {
  this.lastStep = event.item?.label ?? '';
}`,
    readonly: `trackSteps: MenuItem[] = [
  { label: 'ส่งใบสมัคร', subtitle: '3 พ.ค.' },
  { label: 'ตรวจเอกสาร', subtitle: '5 พ.ค.' },
  { label: 'สัมภาษณ์', subtitle: '12 พ.ค.' },
  { label: 'ประกาศผล', subtitle: '20 พ.ค.' },
];
trackIndex = 1;   // แอปเปลี่ยนขั้นเอง

trackBack(): void {
  this.trackIndex = Math.max(0, this.trackIndex - 1);
}

trackNext(): void {
  this.trackIndex = Math.min(this.trackSteps.length - 1, this.trackIndex + 1);
}`,
  },
  api: [
    {
      id: 'api-stepper',
      title: 'wt-stepper',
      rows: [
        row('value', 'any', undefined, 'ค่าของขั้นปัจจุบัน ใช้ [(value)] ได้', 'The current step\'s value; [(value)] works'),
        row('linear', BOOL, 'false', 'ล็อกหัวขั้นทุกขั้นยกเว้นขั้นปัจจุบัน (ไปต่อด้วย activateCallback)', 'Lock every header but the current one (move on with activateCallback)'),
        row('model', 'MenuItem[]', undefined, 'หัวขั้นจาก menu model แทน wt-step ข้างใน (รายการใช้ label, subtitle, disabled, command และ visible)', 'Headers from a menu model instead of wt-step children (items take label, subtitle, disabled, command and visible)'),
        row('activeIndex', 'number', undefined, 'กับ model: ลำดับขั้นปัจจุบัน เริ่มที่ 0 ใช้ [(activeIndex)] ได้', 'With model: the current step\'s position, 0-based; [(activeIndex)] works'),
        row('readonly', BOOL, 'false', 'หัวขั้นแสดงว่าอยู่ขั้นไหนอย่างเดียว กดไม่ได้ (แอปเปลี่ยนขั้นเอง)', 'The headers only show where the process is and cannot be pressed (the app moves on)'),
        row('labelPosition', "'right' | 'bottom'", "'right'", 'ชื่อขั้น (และ subtitle) อยู่ข้างหรือใต้หมายเลข ใน stepper แนวนอน', 'Title (and subtitle) beside or under the number, in a horizontal stepper'),
        row('id', 'string', undefined, 'ใช้นำหน้า id ที่โยงหัวขั้นกับ panel', 'Prefixes the ids tying headers to panels'),
        row('transitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
        row('(valueChange)', 'any', undefined, 'ผู้ใช้ไปขั้นอื่น (คู่ของ [(value)])', 'The user went to another step (for [(value)])'),
        row('(activeIndexChange)', 'number', undefined, 'กับ model: ผู้ใช้เลือกขั้นอื่น (คู่ของ [(activeIndex)])', 'With model: the user picked another step (for [(activeIndex)])'),
      ],
    },
    {
      id: 'api-parts',
      title: { th: 'ส่วนประกอบ', en: 'Parts' },
      typeLabel: 'Inputs',
      rows: [
        row('wt-step-list', '—', undefined, 'แถวหัวขั้น (role="tablist") รับปุ่มลูกศร Home End', 'The header row (role="tablist"); handles the arrows, Home and End'),
        row('wt-step', 'value · disabled · subtitle', undefined, 'หัวขั้น ชื่อขั้นอยู่ข้างใน (ใน wt-step-item ไม่ต้องใส่ value) subtitle เป็นบรรทัดเล็กใต้ชื่อ', 'A header with the title inside (no value inside a wt-step-item); subtitle is a smaller line under the title'),
        row('wt-step-panels', '—', undefined, 'เก็บ panel ของ stepper แนวนอน', 'Holds the panels of a horizontal stepper'),
        row('wt-step-panel', 'value', undefined, 'เนื้อหาของขั้น (template #content หรือเนื้อหาธรรมดา)', 'A step\'s content (a #content template or plain content)'),
        row('wt-step-item', 'value', undefined, 'ขั้นของ stepper แนวตั้ง: wt-step กับ wt-step-panel ใช้ value ของมัน', 'A step of a vertical stepper: its wt-step and wt-step-panel take its value'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #content, wtTemplate="content" หรือ pTemplate="content" ก็ได้', en: 'Write them as #content, wtTemplate="content" or pTemplate="content".' },
      rows: [
        row('content (wt-step-panel)', 'activateCallback(value) · value · active', undefined, 'เนื้อหาของขั้น แสดงเมื่อเป็นขั้นปัจจุบัน', 'The step\'s content, shown while it is current'),
        row('content (wt-step)', 'activateCallback(value) · value · active', undefined, 'แทนหัวขั้นทั้งหมด', 'Replaces the whole header'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WtStepContext } from 'wiratheme/stepper';

interface WtStepContext {
  activateCallback: (value: unknown) => void;
  value: unknown;
  active: boolean;
}`,
    },
  ],
  tokens: [
    tok('--wt-steps-number-size', 'ขนาดวงกลมหมายเลข (ร่วมกับ Steps)', 'Number circle size (shared with Steps)'),
    tok('--wt-steps-number-border-width', 'ความหนาขอบวงกลมหมายเลข', 'Number circle border width'),
    tok('--wt-steps-number-bg', 'พื้นวงกลมหมายเลข (ขั้นที่ยังไม่ถึง)', 'Number circle background (steps not reached)'),
    tok('--wt-steps-number-color', 'สีหมายเลข (ขั้นที่ยังไม่ถึง)', 'Number colour (steps not reached)'),
    tok('--wt-steps-line-width', 'ความหนาเส้นเชื่อมระหว่างขั้น', 'Width of the line between steps'),
    tok('--wt-steps-line-color', 'สีเส้นเชื่อม (ขั้นที่ยังไม่ถึง)', 'Line colour (steps not reached)'),
    tok('--wt-steps-gap', 'ระยะระหว่างหมายเลขกับชื่อขั้น', 'Gap between the number and the title'),
    tok('--wt-steps-label-color', 'สีชื่อขั้น', 'Title colour'),
    tok('--wt-steps-label-weight', 'น้ำหนักตัวอักษรชื่อขั้น', 'Title font weight'),
    tok('--wt-steps-label-active-color', 'สีชื่อขั้นปัจจุบัน', 'Current step title colour'),
    tok('--wt-stepper-panel-padding', 'ระยะในเนื้อหาของขั้น', 'Step content padding'),
    tok('--wt-primary-color', 'ขั้นปัจจุบัน ขั้นที่ผ่านมาแล้ว และเส้นถึงขั้นเหล่านั้น', 'The current step, steps passed and the line up to them'),
    tok('--wt-primary-contrast', 'หมายเลขของขั้นปัจจุบัน', 'Number of the current step'),
  ],
};
