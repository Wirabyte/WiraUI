import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/** Back / Next buttons of a panel, as the samples write them. */
const nav = (back: number | null, next: number | null, indent = '        ') =>
  `${indent}<div class="flex justify-content-between">\n` +
  (back !== null
    ? `${indent}  <wu-button label="ย้อนกลับ" icon="wi wi-chevron-left" severity="secondary" [text]="true" (onClick)="activateCallback(${back})"></wu-button>\n`
    : `${indent}  <span></span>\n`) +
  (next !== null
    ? `${indent}  <wu-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right" (onClick)="activateCallback(${next})"></wu-button>\n`
    : '') +
  `${indent}</div>`;

const HEADER_V3 = `<wu-stepper [(value)]="paymentStep">
  <wu-step-list>
    @for (s of paymentSteps; track s.value) {
      <wu-step [value]="s.value">
        <ng-template #content let-activateCallback="activateCallback" let-active="active">
          <button type="button" class="step-head" [class.step-head-active]="active" [attr.aria-current]="active ? 'step' : null"
            (click)="activateCallback(s.value)">
            <i [class]="s.icon"></i> {{ s.label }}
          </button>
        </ng-template>
      </wu-step>
    }
  </wu-step-list>
  <wu-step-panels>
    <wu-step-panel [value]="1">กรอกชื่อผู้ชำระและอีเมลสำหรับส่งใบเสร็จ</wu-step-panel>
    <wu-step-panel [value]="2">เลือกโอนผ่านธนาคารหรือชำระที่ห้องการเงิน</wu-step-panel>
    <wu-step-panel [value]="3">ดาวน์โหลดใบเสร็จได้หลังเจ้าหน้าที่ตรวจแล้ว</wu-step-panel>
  </wu-step-panels>
</wu-stepper>`;

const HEADER_CLASSIC = `<wu-stepper [(value)]="paymentStep">
  <wu-step-list>
    <wu-step *ngFor="let s of paymentSteps" [value]="s.value">
      <ng-template wuTemplate="content" let-activateCallback="activateCallback" let-active="active">
        <button type="button" class="step-head" [class.step-head-active]="active" [attr.aria-current]="active ? 'step' : null"
          (click)="activateCallback(s.value)">
          <i [class]="s.icon"></i> {{ s.label }}
        </button>
      </ng-template>
    </wu-step>
  </wu-step-list>
  <wu-step-panels>
    <wu-step-panel [value]="1">กรอกชื่อผู้ชำระและอีเมลสำหรับส่งใบเสร็จ</wu-step-panel>
    <wu-step-panel [value]="2">เลือกโอนผ่านธนาคารหรือชำระที่ห้องการเงิน</wu-step-panel>
    <wu-step-panel [value]="3">ดาวน์โหลดใบเสร็จได้หลังเจ้าหน้าที่ตรวจแล้ว</wu-step-panel>
  </wu-step-panels>
</wu-stepper>`;

export const STEPPER_DOC: ComponentDoc = {
  id: 'stepper',
  title: 'Stepper',
  group: 'Panel',
  entry: 'stepper',
  standalone: 'WuStepper',
  module: 'WuStepperModule',
  selector: 'wu-stepper',
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
        th: '<code>WuStepperModule</code> รวม <code>wu-stepper</code>, <code>wu-step-list</code>, <code>wu-step</code>, <code>wu-step-panels</code>, <code>wu-step-panel</code>, <code>wu-step-item</code> และ <code>wuTemplate</code> ไว้แล้ว ถ้าเป็น standalone ให้ import <code>WuStepper</code>, <code>WuStepList</code>, <code>WuStep</code>, <code>WuStepPanels</code> และ <code>WuStepPanel</code> (กับ <code>WuStepItem</code> สำหรับแนวตั้ง)',
        en: '<code>WuStepperModule</code> brings <code>wu-stepper</code>, <code>wu-step-list</code>, <code>wu-step</code>, <code>wu-step-panels</code>, <code>wu-step-panel</code>, <code>wu-step-item</code> and <code>wuTemplate</code>. Standalone: import <code>WuStepper</code>, <code>WuStepList</code>, <code>WuStep</code>, <code>WuStepPanels</code> and <code>WuStepPanel</code> (plus <code>WuStepItem</code> for a vertical stepper).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[(value)]</code> คือค่าของขั้นปัจจุบัน · <code>wu-step-list</code> เป็นแถวหัวขั้น (<code>&lt;wu-step [value]="1"&gt;ชื่อขั้น&lt;/wu-step&gt;</code>) · <code>wu-step-panels</code> เก็บเนื้อหา (<code>wu-step-panel</code> ที่ value ตรงกัน) · ใน template <code>#content</code> ได้ <code>activateCallback</code> สำหรับปุ่มย้อนกลับ / ถัดไป · หมายเลขคือลำดับของขั้น (1, 2, 3) ขั้นก่อนหน้าขั้นปัจจุบันแสดงว่าผ่านแล้ว และคลิกหัวขั้นเพื่อไปขั้นนั้นได้',
        en: '<code>[(value)]</code> is the current step\'s value · <code>wu-step-list</code> is the row of headers (<code>&lt;wu-step [value]="1"&gt;Title&lt;/wu-step&gt;</code>) · <code>wu-step-panels</code> holds the content (the <code>wu-step-panel</code> with the same value) · a <code>#content</code> template gets <code>activateCallback</code> for its Back / Next buttons · the number is the step\'s position (1, 2, 3), steps before the current one are drawn done, and a click on a header goes to that step.',
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
        th: 'ใส่ <code>wu-step</code> กับ <code>wu-step-panel</code> คู่กันใน <code>&lt;wu-step-item [value]="1"&gt;</code> (ไม่ต้องใส่ value ซ้ำ) เนื้อหาเปิดใต้หัวขั้นของมัน และมีเส้นต่อลงไปถึงขั้นถัดไป เหมาะกับจอแคบหรือฟอร์มยาว',
        en: 'Put a <code>wu-step</code> and a <code>wu-step-panel</code> together in a <code>&lt;wu-step-item [value]="1"&gt;</code> (they take its value). The content opens under its header, with a line down to the next step. Good for phones and long forms.',
      },
    },
    progress: {
      title: { th: 'แสดงความคืบหน้า', en: 'Progress display' },
      text: {
        th: 'ขั้นที่ <code>[disabled]="true"</code> กดไม่ได้แต่ไม่จางลง แอปจึงใช้ stepper ที่ทุกขั้น disabled และไม่มี panel แสดงสถานะของใบสมัคร โดยเปลี่ยนแค่ <code>[value]</code> ตามข้อมูลจาก API · <code>[readonly]="true"</code> บน wu-stepper ทำแบบเดียวกันกับทุกขั้นในครั้งเดียว (ดูหัวข้อแสดงอย่างเดียว)',
        en: 'A step with <code>[disabled]="true"</code> cannot be clicked but is not faded, so apps use a stepper whose steps are all disabled, with no panels, to show where an application stands, changing only <code>[value]</code> from the API · <code>[readonly]="true"</code> on wu-stepper does the same for every step at once (see Read-only).',
      },
    },
    header: {
      title: { th: 'หัวขั้นแบบกำหนดเอง', en: 'Custom headers' },
      text: {
        th: 'template <code>#content</code> บน <code>wu-step</code> แทนหัวขั้นทั้งหมด ได้ <code>activateCallback</code>, <code>value</code> และ <code>active</code> แบบเดียวกับใน panel ตัวอย่างนี้ใช้ไอคอนแทนหมายเลข · เนื้อหาของ <code>wu-step-panel</code> จะเป็นข้อความธรรมดาก็ได้ (อยู่ในหน้าแต่ซ่อนไว้จนถึงขั้นนั้น)',
        en: 'A <code>#content</code> template on <code>wu-step</code> replaces its whole header and gets <code>activateCallback</code>, <code>value</code> and <code>active</code>, as in a panel. Here icons stand in for the numbers · a <code>wu-step-panel</code> can also hold plain content (it stays in the page, hidden until its step).',
      },
    },
    label: {
      title: { th: 'ชื่อขั้นใต้หมายเลขและคำอธิบาย', en: 'Titles under the numbers, and subtitles' },
      text: {
        th: '<code>subtitle</code> บน <code>wu-step</code> เพิ่มบรรทัดเล็กใต้ชื่อขั้น · <code>labelPosition="bottom"</code> วางชื่อขั้น (และ subtitle) ไว้ใต้หมายเลขใน stepper แนวนอน แต่ละขั้นกว้างเท่ากัน และเส้นเชื่อมลากจากหมายเลขถึงหมายเลข (ค่าเริ่มต้น <code>\'right\'</code> วางข้างหมายเลข) · จอแคบกว่า 576px ซ่อนชื่อของขั้นอื่นเหมือนเดิม',
        en: '<code>subtitle</code> on <code>wu-step</code> adds a smaller line under the title · <code>labelPosition="bottom"</code> puts the title (and subtitle) under the number in a horizontal stepper: the steps take equal columns and the line runs from number to number (the default, <code>\'right\'</code>, puts it beside the number) · below 576px the other steps hide their titles as before.',
      },
    },
    model: {
      title: { th: 'แถบขั้นตอนจาก model', en: 'Steps from a model' },
      text: {
        th: '<code>&lt;wu-stepper [model]="steps" [(activeIndex)]="stepIndex"&gt;</code> วาดแถวหัวขั้นจาก menu model แทน wu-step ข้างใน แบบเดียวกับแถบ Steps · รายการใช้ <code>label</code>, <code>subtitle</code>, <code>disabled</code> และ <code>command</code> (<code>visible: false</code> ไม่แสดง) · <code>activeIndex</code> เริ่มที่ 0 และการเลือกขั้นเรียก <code>command</code> ของขั้นนั้นพร้อม <code>{ originalEvent, item, index }</code> · ถ้าแต่ละขั้นมีเนื้อหา ใส่ <code>wu-step-panels</code> ที่ <code>[value]</code> เป็น 0, 1, 2 ไว้ข้างในได้ · standalone import แค่ <code>WuStepper</code>',
        en: '<code>&lt;wu-stepper [model]="steps" [(activeIndex)]="stepIndex"&gt;</code> draws the header row from a menu model instead of wu-step children, like a Steps bar · items take <code>label</code>, <code>subtitle</code>, <code>disabled</code> and <code>command</code> (<code>visible: false</code> hides one) · <code>activeIndex</code> is 0-based, and picking a step runs its <code>command</code> with <code>{ originalEvent, item, index }</code> · when steps have content, put <code>wu-step-panels</code> with <code>[value]</code> 0, 1, 2 inside · standalone apps import only <code>WuStepper</code>.',
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
        th: 'Stepper เก็บเนื้อหาของแต่ละขั้นและผูกด้วย value และวาดแถบขั้นตอนจาก <code>MenuItem[]</code> ได้ด้วย <code>[model]</code> + <code>[(activeIndex)]</code> โค้ดใหม่จึงใช้ wu-stepper ตัวเดียวได้ทั้งสองแบบ · Steps (<code>wu-steps</code>) ยังใช้ได้และมีหน้าของตัวเอง แอปที่ใช้อยู่ไม่ต้องย้าย (ค่าเริ่มต้นต่างกันหนึ่งจุด: wu-steps เป็น readonly อยู่แล้ว ส่วน wu-stepper ต้องใส่ <code>[readonly]="true"</code>) · ทั้งสองตัวจัดวางได้เหมือนกันแล้ว: wu-steps มี <code>labelPosition</code> (<code>\'bottom\'</code> ค่าเริ่มต้น / <code>\'right\'</code>) และ <code>orientation="vertical"</code> ดูหัวข้อการจัดวางในหน้า Steps',
        en: 'Stepper holds each step\'s content, is bound by value, and also draws the bar of steps from a <code>MenuItem[]</code> with <code>[model]</code> + <code>[(activeIndex)]</code>, so new code can use wu-stepper for both · Steps (<code>wu-steps</code>) stays, with its own page, and apps that use it need not move (one default differs: wu-steps is read-only by default, wu-stepper needs <code>[readonly]="true"</code>) · both now share the same layouts: wu-steps has <code>labelPosition</code> (<code>\'bottom\'</code>, its default, or <code>\'right\'</code>) and <code>orientation="vertical"</code>; see Layout on the Steps page.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>p-stepper</code>, <code>p-step-list</code>, <code>p-step</code>, <code>p-step-panels</code>, <code>p-step-panel</code> และ <code>p-step-item</code> เป็น <code>wu-*</code> template <code>#content</code> (หรือ <code>pTemplate="content"</code>) กับ <code>activateCallback</code> ใช้ได้เหมือนเดิม class <code>p-stepper</code> / <code>p-step-*</code> อยู่คู่กับ <code>wu-*</code> ส่วน <code>transitionOptions</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>p-stepper</code>, <code>p-step-list</code>, <code>p-step</code>, <code>p-step-panels</code>, <code>p-step-panel</code> and <code>p-step-item</code> to <code>wu-*</code>. <code>#content</code> templates (or <code>pTemplate="content"</code>) with <code>activateCallback</code> work as before, the <code>p-stepper</code> / <code>p-step-*</code> classes sit next to <code>wu-*</code>, and <code>transitionOptions</code> is accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wu-stepper [(value)]="step">
  <wu-step-list>
    <wu-step [value]="1">ข้อมูลพื้นฐาน</wu-step>
    <wu-step [value]="2">ที่อยู่</wu-step>
    <wu-step [value]="3">ยืนยัน</wu-step>
  </wu-step-list>
  <wu-step-panels>
    <wu-step-panel [value]="1">
      <ng-template #content let-activateCallback="activateCallback">
        <p>กรอกชื่อ วันเกิด และเลขประจำตัวประชาชน</p>
${nav(null, 2)}
      </ng-template>
    </wu-step-panel>
    <wu-step-panel [value]="2">
      <ng-template #content let-activateCallback="activateCallback">
        <p>ที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน</p>
${nav(1, 3)}
      </ng-template>
    </wu-step-panel>
    <wu-step-panel [value]="3">
      <ng-template #content let-activateCallback="activateCallback">
        <p>ตรวจข้อมูลอีกครั้งก่อนส่งใบสมัคร</p>
${nav(2, null)}
      </ng-template>
    </wu-step-panel>
  </wu-step-panels>
</wu-stepper>`,
    linear: `<wu-stepper [(value)]="applyStep" [linear]="true">
  <wu-step-list>
    <wu-step [value]="1">ผู้สมัคร</wu-step>
    <wu-step [value]="2">ผู้ปกครอง</wu-step>
    <wu-step [value]="3">ส่งใบสมัคร</wu-step>
  </wu-step-list>
  <wu-step-panels>
    <wu-step-panel [value]="1">
      <ng-template #content let-activateCallback="activateCallback">
        <label for="studentName">ชื่อ - สกุลผู้สมัคร</label>
        <input id="studentName" name="studentName" wuInputText [(ngModel)]="studentName" />
        <wu-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right" [disabled]="!studentName.trim()"
          (onClick)="activateCallback(2)"></wu-button>
      </ng-template>
    </wu-step-panel>
    <wu-step-panel [value]="2">
      <ng-template #content let-activateCallback="activateCallback">
        <label for="parentPhone">เบอร์โทรผู้ปกครอง</label>
        <input id="parentPhone" name="parentPhone" wuInputText inputmode="tel" [(ngModel)]="parentPhone" />
        <wu-button label="ย้อนกลับ" severity="secondary" [text]="true" (onClick)="activateCallback(1)"></wu-button>
        <wu-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right" [disabled]="parentPhone.length !== 10"
          (onClick)="activateCallback(3)"></wu-button>
      </ng-template>
    </wu-step-panel>
    <wu-step-panel [value]="3">
      <ng-template #content let-activateCallback="activateCallback">
        <p>{{ studentName }} · {{ parentPhone }}</p>
        <wu-button label="ย้อนกลับ" severity="secondary" [text]="true" [disabled]="isApiSaving"
          (onClick)="activateCallback(2)"></wu-button>
        <wu-button label="ส่งใบสมัคร" icon="wi wi-send" [loading]="isApiSaving" (onClick)="submitApplication()"></wu-button>
      </ng-template>
    </wu-step-panel>
  </wu-step-panels>
</wu-stepper>`,
    vertical: `<wu-stepper [(value)]="setupStep">
  <wu-step-item [value]="1">
    <wu-step>เลือกปีการศึกษา</wu-step>
    <wu-step-panel>
      <ng-template #content let-activateCallback="activateCallback">
        <p>ปีการศึกษาและภาคเรียนที่จะเปิดรับสมัคร</p>
${nav(null, 2)}
      </ng-template>
    </wu-step-panel>
  </wu-step-item>
  <wu-step-item [value]="2">
    <wu-step>ตั้งค่ารอบสมัคร</wu-step>
    <wu-step-panel>
      <ng-template #content let-activateCallback="activateCallback">
        <p>วันเปิด ปิดรับสมัคร และจำนวนที่รับ</p>
${nav(1, 3)}
      </ng-template>
    </wu-step-panel>
  </wu-step-item>
  <wu-step-item [value]="3">
    <wu-step>เปิดระบบ</wu-step>
    <wu-step-panel>
      <ng-template #content let-activateCallback="activateCallback">
        <p>ตรวจทานแล้วเปิดให้ผู้สมัครเข้าใช้งาน</p>
${nav(2, null)}
      </ng-template>
    </wu-step-panel>
  </wu-step-item>
</wu-stepper>`,
    progress: `<wu-stepper [value]="applicationStatus">
  <wu-step-list>
    <wu-step value="submitted" [disabled]="true">ส่งใบสมัคร</wu-step>
    <wu-step value="checking" [disabled]="true">ตรวจเอกสาร</wu-step>
    <wu-step value="interview" [disabled]="true">สัมภาษณ์</wu-step>
    <wu-step value="result" [disabled]="true">ประกาศผล</wu-step>
  </wu-step-list>
</wu-stepper>`,
    header: { v3: HEADER_V3, classic: HEADER_CLASSIC },
    label: `<wu-stepper [(value)]="enrolStep" labelPosition="bottom">
  <wu-step-list>
    <wu-step [value]="1" subtitle="ชื่อและวันเกิด">ข้อมูลพื้นฐาน</wu-step>
    <wu-step [value]="2" subtitle="ตามทะเบียนบ้าน">ที่อยู่</wu-step>
    <wu-step [value]="3" subtitle="ตรวจแล้วส่ง">ยืนยัน</wu-step>
  </wu-step-list>
  <wu-step-panels>
    <wu-step-panel [value]="1">กรอกชื่อ วันเกิด และเลขประจำตัวประชาชน</wu-step-panel>
    <wu-step-panel [value]="2">ที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน</wu-step-panel>
    <wu-step-panel [value]="3">ตรวจข้อมูลอีกครั้งก่อนส่งใบสมัคร</wu-step-panel>
  </wu-step-panels>
</wu-stepper>`,
    model: `<wu-stepper [model]="applySteps" [(activeIndex)]="stepIndex"></wu-stepper>`,
    readonly: `<wu-stepper [model]="trackSteps" [activeIndex]="trackIndex" [readonly]="true" labelPosition="bottom"></wu-stepper>
<div class="flex justify-content-between">
  <wu-button label="ย้อนกลับ" icon="wi wi-chevron-left" severity="secondary" [text]="true"
    [disabled]="trackIndex === 0" (onClick)="trackBack()"></wu-button>
  <wu-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right"
    [disabled]="trackIndex === trackSteps.length - 1" (onClick)="trackNext()"></wu-button>
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
    model: `import { MenuItem, MenuItemCommandEvent } from 'wiraui/api';

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
      title: 'wu-stepper',
      rows: [
        row('value', 'any', undefined, 'ค่าของขั้นปัจจุบัน ใช้ [(value)] ได้', 'The current step\'s value; [(value)] works'),
        row('linear', BOOL, 'false', 'ล็อกหัวขั้นทุกขั้นยกเว้นขั้นปัจจุบัน (ไปต่อด้วย activateCallback)', 'Lock every header but the current one (move on with activateCallback)'),
        row('model', 'MenuItem[]', undefined, 'หัวขั้นจาก menu model แทน wu-step ข้างใน (รายการใช้ label, subtitle, disabled, command และ visible)', 'Headers from a menu model instead of wu-step children (items take label, subtitle, disabled, command and visible)'),
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
        row('wu-step-list', '—', undefined, 'แถวหัวขั้น (role="tablist") รับปุ่มลูกศร Home End', 'The header row (role="tablist"); handles the arrows, Home and End'),
        row('wu-step', 'value · disabled · subtitle', undefined, 'หัวขั้น ชื่อขั้นอยู่ข้างใน (ใน wu-step-item ไม่ต้องใส่ value) subtitle เป็นบรรทัดเล็กใต้ชื่อ', 'A header with the title inside (no value inside a wu-step-item); subtitle is a smaller line under the title'),
        row('wu-step-panels', '—', undefined, 'เก็บ panel ของ stepper แนวนอน', 'Holds the panels of a horizontal stepper'),
        row('wu-step-panel', 'value', undefined, 'เนื้อหาของขั้น (template #content หรือเนื้อหาธรรมดา)', 'A step\'s content (a #content template or plain content)'),
        row('wu-step-item', 'value', undefined, 'ขั้นของ stepper แนวตั้ง: wu-step กับ wu-step-panel ใช้ value ของมัน', 'A step of a vertical stepper: its wu-step and wu-step-panel take its value'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #content, wuTemplate="content" หรือ pTemplate="content" ก็ได้', en: 'Write them as #content, wuTemplate="content" or pTemplate="content".' },
      rows: [
        row('content (wu-step-panel)', 'activateCallback(value) · value · active', undefined, 'เนื้อหาของขั้น แสดงเมื่อเป็นขั้นปัจจุบัน', 'The step\'s content, shown while it is current'),
        row('content (wu-step)', 'activateCallback(value) · value · active', undefined, 'แทนหัวขั้นทั้งหมด', 'Replaces the whole header'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WuStepContext } from 'wiraui/stepper';

interface WuStepContext {
  activateCallback: (value: unknown) => void;
  value: unknown;
  active: boolean;
}`,
    },
  ],
  tokens: [
    tok('--wu-steps-number-size', 'ขนาดวงกลมหมายเลข (ร่วมกับ Steps)', 'Number circle size (shared with Steps)'),
    tok('--wu-steps-number-border-width', 'ความหนาขอบวงกลมหมายเลข', 'Number circle border width'),
    tok('--wu-steps-number-bg', 'พื้นวงกลมหมายเลข (ขั้นที่ยังไม่ถึง)', 'Number circle background (steps not reached)'),
    tok('--wu-steps-number-color', 'สีหมายเลข (ขั้นที่ยังไม่ถึง)', 'Number colour (steps not reached)'),
    tok('--wu-steps-line-width', 'ความหนาเส้นเชื่อมระหว่างขั้น', 'Width of the line between steps'),
    tok('--wu-steps-line-color', 'สีเส้นเชื่อม (ขั้นที่ยังไม่ถึง)', 'Line colour (steps not reached)'),
    tok('--wu-steps-gap', 'ระยะระหว่างหมายเลขกับชื่อขั้น', 'Gap between the number and the title'),
    tok('--wu-steps-label-color', 'สีชื่อขั้น', 'Title colour'),
    tok('--wu-steps-label-weight', 'น้ำหนักตัวอักษรชื่อขั้น', 'Title font weight'),
    tok('--wu-steps-label-active-color', 'สีชื่อขั้นปัจจุบัน', 'Current step title colour'),
    tok('--wu-stepper-panel-padding', 'ระยะในเนื้อหาของขั้น', 'Step content padding'),
    tok('--wu-primary-color', 'ขั้นปัจจุบัน ขั้นที่ผ่านมาแล้ว และเส้นถึงขั้นเหล่านั้น', 'The current step, steps passed and the line up to them'),
    tok('--wu-primary-contrast', 'หมายเลขของขั้นปัจจุบัน', 'Number of the current step'),
  ],
};
