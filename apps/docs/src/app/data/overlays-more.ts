import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const TOAST_DOC: ComponentDoc = {
  id: 'toast',
  title: 'Toast',
  group: 'Messages',
  entry: 'toast',
  standalone: 'WtToast, WtTemplate',
  module: 'WtToastModule',
  selector: 'wt-toast',
  description: {
    th: 'ข้อความแจ้งเตือนสั้น ๆ ที่ลอยขึ้นมุมจอแล้วหายไปเอง วาง <wt-toast> ไว้ครั้งเดียวแล้วเรียก WtMessageService.add() จากที่ไหนก็ได้',
    en: 'Short notices that float in at a corner and go away by themselves. Place <wt-toast> once, then call WtMessageService.add() from anywhere.',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WtMessageService</code> อยู่ใน <code>wiratheme/toast</code> หรือ import จาก <code>wiratheme/api</code> ในชื่อ <code>MessageService</code> (type ของข้อความคือ <code>Message</code>)',
        en: '<code>WtMessageService</code> comes from <code>wiratheme/toast</code>, or from <code>wiratheme/api</code> as <code>MessageService</code> (the message type is <code>Message</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'toast อยู่ใน top layer จึงขึ้นเหนือ dialog ด้วย เอาเมาส์ชี้ค้างไว้เพื่อหยุดนับเวลา และบนมือถือกว้างเต็มจอ',
        en: 'Toasts sit in the top layer, so they show above dialogs too. Hovering pauses the countdown, and on phones they span the screen.',
      },
    },
    severity: { title: 'Severity', text: { th: 'success, info, warn, error, secondary และ contrast ทุกแบบมี icon ของตัวเอง', en: 'success, info, warn, error, secondary and contrast, each with its own icon.' } },
    position: {
      title: 'Position',
      text: { th: '<code>position</code> และ <code>key</code> แยกกลุ่ม toast แต่ละมุม', en: '<code>position</code> plus a <code>key</code> per group of toasts.' },
    },
    life: {
      title: { th: 'เวลาแสดงและการปิด', en: 'Time on screen and closing' },
      text: {
        th: 'เส้นนับถอยหลังด้านล่างวิ่งตาม <code>life</code> (ms ต่อข้อความหรือทั้ง <code>&lt;wt-toast&gt;</code>) เอาเมาส์ชี้แล้วหยุด และเดินต่อจากเวลาที่เหลือเมื่อเอาออก · <code>[showTimer]="false"</code> ปิดเส้นนี้ · <code>sticky</code> ค้างจนกดปิด · ปุ่ม × อยู่มุมขวาบนเสมอ แม้ใช้ template ของตัวเอง (<code>closable: false</code> ซ่อน) · <code>clear()</code> ล้างทั้งหมด · <code>preventDuplicates</code> ข้ามข้อความซ้ำ',
        en: 'A countdown line along the bottom runs for the <code>life</code> (ms, per message or for the whole <code>&lt;wt-toast&gt;</code>). Hovering pauses it, and the remaining time continues afterwards · <code>[showTimer]="false"</code> turns the line off · <code>sticky</code> stays until closed · the × always sits top-right, custom templates included (<code>closable: false</code> hides it) · <code>clear()</code> removes them all · <code>preventDuplicates</code> skips repeats.',
      },
    },
    templates: {
      title: 'Templates',
      text: {
        th: '<code>#message</code> (ได้ข้อความเป็น <code>let-m</code>) แทนเนื้อหา หรือ <code>#headless</code> วาดทั้งกล่องเอง (ปิดด้วย <code>closeFn</code>)',
        en: '<code>#message</code> (with the message as <code>let-m</code>) replaces the content, or <code>#headless</code> draws the whole box (close it with <code>closeFn</code>).',
      },
    },
  },
  code: {
    basic: `<wt-toast></wt-toast>   <!-- ครั้งเดียว เช่นใน app.component.html -->

<wt-button label="บันทึก" (onClick)="save()"></wt-button>`,
    severity: `<wt-button label="success" severity="success" (onClick)="show('success')"></wt-button>
<wt-button label="info" severity="info" (onClick)="show('info')"></wt-button>
<!-- warn · error · secondary · contrast -->`,
    position: `<wt-toast key="bl" position="bottom-left"></wt-toast>
<wt-toast key="tc" position="top-center"></wt-toast>

<wt-button label="ล่างซ้าย"
  (onClick)="messages.add({ key: 'bl', severity: 'info', summary: 'ล่างซ้าย' })"></wt-button>`,
    life: `<wt-button label="ค้างไว้"
  (onClick)="messages.add({ severity: 'warn', summary: 'ต้องตรวจสอบ', sticky: true })"></wt-button>
<wt-button label="10 วินาที"
  (onClick)="messages.add({ severity: 'info', summary: 'แสดง 10 วินาที', life: 10000 })"></wt-button>
<wt-button label="ล้างทั้งหมด" severity="secondary" (onClick)="messages.clear()"></wt-button>`,
    templates: `<wt-toast key="invite" position="bottom-right">
  <ng-template #message let-m>
    <div class="invite">
      <wt-avatar [label]="m.data.initial" shape="circle"></wt-avatar>
      <div><b>{{ m.summary }}</b><p>{{ m.detail }}</p></div>
      <wt-button label="ดู" size="small" (onClick)="open(m)"></wt-button>
    </div>
  </ng-template>
</wt-toast>`,
  },
  ts: {
    basic: `private readonly messages = inject(WtMessageService);

save() {
  this.messages.add({ severity: 'success', summary: 'บันทึกแล้ว', detail: 'ข้อมูลลูกค้าถูกบันทึกเรียบร้อย' });
}`,
    severity: `show(severity: string) {
  this.messages.add({ severity, summary: severity, detail: 'ข้อความตัวอย่าง' });
}`,
    templates: `this.messages.add({
  key: 'invite',
  summary: 'สมหญิงแชร์เอกสาร',
  detail: 'รายงานยอดขายเดือนมีนาคม',
  data: { initial: 'ส' },
  life: 6000,
});`,
  },
  api: [
    {
      id: 'api-message',
      title: { th: 'ข้อความ (add)', en: 'Message (add)' },
      rows: [
        row('severity', "'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'", undefined, 'สีและ icon (warning, danger ใช้ได้)', 'Colour and icon (warning, danger work too)'),
        row('summary · detail', 'string', undefined, 'หัวข้อและรายละเอียด', 'Title and detail'),
        row('key', 'string', undefined, 'ส่งไป <wt-toast> ที่ key ตรงกัน', 'Goes to the <wt-toast> with that key'),
        row('life', 'number', '3000', 'เวลาแสดง (ms)', 'Time on screen (ms)'),
        row('sticky', BOOL, 'false', 'ค้างจนกดปิด', 'Stays until closed'),
        row('closable', BOOL, 'true', 'ปุ่ม ×', 'The ×'),
        row('icon · closeIcon', 'string', undefined, 'class ของ icon แทนของในตัว', 'Icon classes instead of the built-in ones'),
        row('styleClass · contentStyleClass · id · data', 'string · unknown', undefined, 'class และข้อมูลสำหรับ template', 'Classes and data for templates'),
      ],
    },
    {
      id: 'api-inputs',
      title: { th: 'Inputs ของ wt-toast', en: 'wt-toast inputs' },
      rows: [
        row('key', 'string', undefined, 'แสดงเฉพาะข้อความที่ key ตรงกัน', 'Shows only messages with this key'),
        row('position', "'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center'", "'top-right'", 'มุมของจอ', 'Corner of the screen'),
        row('life', 'number', '3000', 'เวลาแสดงเริ่มต้น', 'Default time on screen'),
        row('showTimer', 'boolean', 'true', 'เส้นนับถอยหลังตาม life', 'Countdown line for the life'),
        row('preventDuplicates · preventOpenDuplicates', BOOL, 'false', 'ข้ามข้อความที่เคยแสดง / ที่ยังแสดงอยู่', 'Skip messages shown before / still shown'),
        row('style · styleClass', 'object · string', undefined, 'ตกแต่ง', 'Styling'),
        row('baseZIndex · autoZIndex · breakpoints · *TransitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ (อยู่ใน top layer)', 'Accepted so existing templates compile (top layer)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onClose', 'WtToastCloseEvent', undefined, 'ผู้ใช้ปิดข้อความ', 'The user closed a message')],
    },
    {
      id: 'api-service',
      title: 'WtMessageService',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('add(message)', 'void', undefined, 'แสดงข้อความ', 'Shows a message'),
        row('addAll(messages)', 'void', undefined, 'แสดงหลายข้อความ', 'Shows several'),
        row('clear(key?)', 'void', undefined, 'ล้างข้อความของ key นั้น หรือทั้งหมด', 'Removes those of a key, or all'),
      ],
    },
  ],
  tokens: [
    tok('--wt-toast-width', 'ความกว้าง (มือถือเต็มจอ)', 'Width (full on phones)'),
    tok('--wt-toast-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-toast-border-width', 'ขอบ (เช่น 0 0 0 6px เป็นแถบด้านซ้าย)', 'Border (0 0 0 6px for a left stripe)'),
    tok('--wt-toast-border-mix', 'ความเข้มของสีขอบ', 'Border colour strength'),
    tok('--wt-toast-icon-size', 'ขนาด icon', 'Icon size'),
    tok('--wt-toast-summary-weight', 'น้ำหนักหัวข้อ', 'Summary weight'),
    tok('--wt-toast-padding', 'ระยะใน', 'Padding'),
    tok('--wt-toast-shadow', 'เงา', 'Shadow'),
    tok('--wt-toast-blur', 'ความเบลอของพื้นหลัง', 'Background blur'),
  ],
};

export const TOOLTIP_DOC: ComponentDoc = {
  id: 'tooltip',
  title: 'Tooltip',
  group: 'Overlay',
  entry: 'tooltip',
  standalone: 'WtTooltip',
  module: 'WtTooltipModule',
  selector: '[wtTooltip]',
  description: {
    th: 'ข้อความอธิบายสั้น ๆ เมื่อชี้หรือโฟกัส ย้ายไปอีกฝั่งเองเมื่อพื้นที่ไม่พอ และเลื่อนตามเมื่อหน้าเลื่อน',
    en: 'A short hint on hover or focus. It flips to the other side when there is no room and follows the page as it scrolls.',
  },
  sections: {
    import: {
      title: 'Import',
      text: { th: 'ใส่ <code>wtTooltip</code> บน element ใดก็ได้ (attribute ชื่อเดิม <code>pTooltip</code> ก็ใช้ได้)', en: 'Add <code>wtTooltip</code> to any element (the attribute name older templates use, <code>pTooltip</code>, works too).' },
    },
    basic: {
      title: 'Position',
      text: { th: '<code>tooltipPosition</code>: top, bottom, left หรือ right (ค่าเริ่มต้น right)', en: '<code>tooltipPosition</code>: top, bottom, left or right (right by default).' },
    },
    event: {
      title: { th: 'เมื่อไหร่ที่แสดง', en: 'When it shows' },
      text: {
        th: '<code>tooltipEvent</code>: <code>hover</code> (แสดงเมื่อโฟกัสด้วยคีย์บอร์ดด้วย), <code>focus</code> หรือ <code>both</code> · <code>showDelay</code> / <code>hideDelay</code> / <code>life</code> (ms)',
        en: '<code>tooltipEvent</code>: <code>hover</code> (also on keyboard focus), <code>focus</code> or <code>both</code> · <code>showDelay</code> / <code>hideDelay</code> / <code>life</code> (ms).',
      },
    },
    html: {
      title: 'HTML',
      text: {
        th: '<code>[escape]="false"</code> แสดง HTML อย่างง่าย เก็บไว้เฉพาะแท็กจัดรูปแบบ (b, i, strong, em, u, br, p, span, small, code, ul, ol, li) และลิงก์ http / https / mailto เลื่อนเมาส์ไปบน tooltip แล้วกดลิงก์ได้ (ค่าเริ่มต้น) ส่วน <code>[autoHide]="true"</code> ซ่อนทันทีที่เมาส์ออกจากปุ่ม',
        en: '<code>[escape]="false"</code> shows simple HTML: only formatting tags (b, i, strong, em, u, br, p, span, small, code, ul, ol, li) and http / https / mailto links are kept. The pointer can move onto the tooltip and click its link (the default); <code>[autoHide]="true"</code> hides it as soon as the pointer leaves the target.',
      },
    },
    options: {
      title: { th: 'ตัวเลือกอื่น', en: 'More options' },
      text: {
        th: '<code>tooltipDisabled</code> ปิดชั่วคราว · <code>fitContent</code> แสดงบรรทัดเดียวไม่ตัดคำ · <code>tooltipStyleClass</code> class เพิ่ม · <code>tooltipOptions</code> ส่งทุกอย่างเป็น object',
        en: '<code>tooltipDisabled</code> turns it off for now · <code>fitContent</code> keeps one line · <code>tooltipStyleClass</code> adds a class · <code>tooltipOptions</code> passes it all as one object.',
      },
    },
  },
  code: {
    basic: `<wt-button label="บน" wtTooltip="บันทึกแบบร่าง" tooltipPosition="top"></wt-button>
<wt-button label="ล่าง" wtTooltip="ส่งออกเป็น Excel" tooltipPosition="bottom"></wt-button>
<wt-button label="ซ้าย" wtTooltip="ย้อนกลับ" tooltipPosition="left"></wt-button>
<wt-button label="ขวา" wtTooltip="ถัดไป"></wt-button>`,
    event: `<input wtInputText wtTooltip="กรอกเลขบัตรประชาชน 13 หลัก" tooltipEvent="focus" placeholder="เลขบัตรประชาชน" />
<wt-button label="ช้าหน่อย" wtTooltip="แสดงหลัง 500ms" [showDelay]="500" [hideDelay]="300"></wt-button>`,
    html: `<wt-button label="รายละเอียด" severity="secondary"
  wtTooltip="<b>แพ็กเกจ Pro</b><br>ผู้ใช้ไม่จำกัด · <a href='https://example.com'>ดูราคา</a>"
           [escape]="false" tooltipPosition="top"></wt-button>`,
    options: `<wt-button label="ปิด tooltip" [wtTooltip]="'ไม่แสดง'" [tooltipDisabled]="off"></wt-button>
<wt-button label="บรรทัดเดียว" wtTooltip="ข้อความยาวที่ไม่ต้องการให้ตัดขึ้นบรรทัดใหม่"
  [fitContent]="true"></wt-button>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('wtTooltip · pTooltip', 'string', undefined, 'ข้อความ', 'The text'),
        row('tooltipPosition', "'top' | 'bottom' | 'left' | 'right'", "'right'", 'ฝั่งที่แสดง (สลับเองเมื่อไม่พอ)', 'Side (flips when there is no room)'),
        row('tooltipEvent', "'hover' | 'focus' | 'both'", "'hover'", 'เหตุการณ์ที่ทำให้แสดง (hover รวมโฟกัสด้วยคีย์บอร์ด)', 'What shows it (hover includes keyboard focus)'),
        row('showDelay · hideDelay · life', 'number', '0', 'หน่วงก่อนแสดง / ก่อนซ่อน / ซ่อนเองหลัง (ms)', 'Delay before showing / hiding, hide after (ms)'),
        row('escape', BOOL, 'true', 'false แสดง HTML อย่างง่าย', 'false shows simple HTML'),
        row('tooltipDisabled', BOOL, 'false', 'ปิดชั่วคราว', 'Off for now'),
        row('fitContent', BOOL, 'false', 'บรรทัดเดียว', 'One line'),
        row('tooltipStyleClass', 'string', undefined, 'class เพิ่ม', 'Extra class'),
        row('positionTop · positionLeft', 'number', '0', 'เลื่อนเพิ่ม (px)', 'Extra offset (px)'),
        row('tooltipOptions', 'WtTooltipOptions', undefined, 'ทุกค่าใน object เดียว', 'All of it in one object'),
        row('autoHide', 'boolean', 'false', 'true = ซ่อนทันทีที่เมาส์ออกจากปุ่ม (false = เลื่อนไปบน tooltip และกดลิงก์ได้)', 'true hides it as soon as the pointer leaves the target (false lets the pointer move onto it and click links)'),
        row('appendTo · tooltipZIndex · positionStyle', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ (อยู่ใน top layer)', 'Accepted so existing templates compile (top layer)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtTooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type WtTooltipEvent = 'hover' | 'focus' | 'both';`,
    },
  ],
  tokens: [
    tok('--wt-tooltip-bg', 'พื้น', 'Background'),
    tok('--wt-tooltip-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wt-tooltip-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-tooltip-padding', 'ระยะใน', 'Padding'),
    tok('--wt-tooltip-max-width', 'ความกว้างสูงสุดก่อนตัดบรรทัด', 'Width before it wraps'),
    tok('--wt-tooltip-shadow', 'เงา', 'Shadow'),
  ],
};

export const POPOVER_DOC: ComponentDoc = {
  id: 'popover',
  title: 'Popover',
  group: 'Overlay',
  entry: 'popover',
  standalone: 'WtPopover',
  module: 'WtPopoverModule',
  selector: 'wt-popover',
  description: {
    th: 'แผงเล็ก ๆ ที่เปิดใต้ปุ่มพร้อมลูกศรชี้ ขึ้นด้านบนเองเมื่อพื้นที่ด้านล่างไม่พอ และปิดเมื่อคลิกข้างนอกหรือกด Esc',
    en: 'A small panel that opens under its button with an arrow pointing at it, flips above when there is no room below, and closes on an outside click or Esc.',
  },
  sections: {
    import: {
      title: 'Import',
      text: { th: 'selector <code>wt-overlaypanel</code> ก็ใช้ได้ สำหรับ template เดิม', en: 'The <code>wt-overlaypanel</code> selector works too, for existing templates.' },
    },
    basic: {
      title: 'Basic',
      text: { th: 'อ้างถึงด้วย <code>#op</code> แล้วเรียก <code>op.toggle($event)</code> จากปุ่ม', en: 'Reference it with <code>#op</code> and call <code>op.toggle($event)</code> from the button.' },
    },
    select: {
      title: { th: 'เลือกจากรายการ', en: 'Pick from a list' },
      text: { th: 'เรียก <code>op.hide()</code> หลังเลือก', en: 'Call <code>op.hide()</code> after a pick.' },
    },
    options: {
      title: { th: 'ปุ่มปิด', en: 'Close button' },
      text: {
        th: '<code>showCloseIcon</code> เพิ่ม × ที่มุม · <code>[dismissable]="false"</code> ไม่ปิดเมื่อคลิกข้างนอก · <code>align()</code> จัดตำแหน่งใหม่เมื่อเนื้อหาเปลี่ยนขนาด',
        en: '<code>showCloseIcon</code> adds an × · <code>[dismissable]="false"</code> keeps it open on outside clicks · <code>align()</code> places it again after the content changes size.',
      },
    },
  },
  code: {
    basic: `<wt-button label="แชร์" icon="pi pi-send" (onClick)="op.toggle($event)"></wt-button>
<wt-popover #op>
  <p>ส่งลิงก์ให้ทีม</p>
  <input wtInputText value="https://example.com/r/10234" [readonly]="true" [fluid]="true" />
</wt-popover>`,
    select: {
      classic: `<wt-button [label]="owner || 'เลือกผู้รับผิดชอบ'" icon="pi pi-user"
  (onClick)="people.toggle($event)"></wt-button>
<wt-popover #people>
  <button *ngFor="let p of team" type="button" class="person" (click)="owner = p; people.hide()">{{ p }}</button>
</wt-popover>`,
      v3: `<wt-button [label]="owner || 'เลือกผู้รับผิดชอบ'" icon="pi pi-user"
  (onClick)="people.toggle($event)"></wt-button>
<wt-popover #people>
  @for (p of team; track p) {
  <button type="button" class="person" (click)="owner = p; people.hide()">{{ p }}</button>
  }
</wt-popover>`,
    },
    options: `<wt-button label="ตัวกรอง" severity="secondary" (onClick)="filters.toggle($event)"></wt-button>
<wt-popover #filters [showCloseIcon]="true" [dismissable]="false">…</wt-popover>`,
  },
  ts: {
    select: `team = ['สมหญิง', 'กมล', 'ณัฐ', 'ปวีณา'];
owner = '';`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('dismissable', BOOL, 'true', 'คลิกข้างนอกเพื่อปิด', 'An outside click closes it'),
        row('showCloseIcon', BOOL, 'false', 'ปุ่ม × ที่มุม', 'An × in the corner'),
        row('focusOnShow', BOOL, 'true', 'ย้ายโฟกัสเข้าแผงเมื่อเปิด', 'Move focus inside on open'),
        row('ariaCloseLabel', 'string', undefined, 'ชื่อของปุ่ม ×', 'Name of the ×'),
        row('style · styleClass', 'object · string', undefined, 'ตกแต่ง', 'Styling'),
        row('appendTo · baseZIndex · autoZIndex · show/hideTransitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ (อยู่ใน top layer)', 'Accepted so existing templates compile (top layer)'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'รับ', en: 'Takes' },
      rows: [
        row('toggle(event?, target?)', 'Event · HTMLElement', undefined, 'เปิดใต้ target (ค่าเริ่มต้นคือ element ของ event) หรือปิดถ้าเปิดอยู่', 'Opens under target (default: the event\'s element), or closes'),
        row('show(event?, target?) · hide()', 'Event · HTMLElement', undefined, 'เปิด / ปิด', 'Open / close'),
        row('align()', '', undefined, 'จัดตำแหน่งใหม่', 'Place it again'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onShow · onHide', 'void', undefined, 'เปิด / ปิด', 'Opened / closed')],
    },
  ],
  tokens: [
    tok('--wt-popover-padding', 'ระยะใน', 'Padding'),
    tok('--wt-popover-arrow-size', 'ขนาดลูกศร', 'Arrow size'),
    tok('--wt-overlay-bg', 'พื้น', 'Background'),
    tok('--wt-border', 'ขอบ', 'Border'),
    tok('--wt-radius-md', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-shadow-md', 'เงา', 'Shadow'),
  ],
};

export const ANIMATE_DOC: ComponentDoc = {
  id: 'animate',
  title: 'Animate on scroll',
  group: 'Misc',
  entry: 'animate',
  standalone: 'WtAnimate',
  module: 'WtAnimateModule',
  selector: '[data-aos] · [wtAnimate]',
  description: {
    th: 'ให้ element ค่อย ๆ ปรากฏเมื่อเลื่อนมาถึง ใช้ attribute data-aos ที่มีอยู่ในหน้าแล้วได้ทันที หรือใช้ directive wtAnimate',
    en: 'Elements animate in as they scroll into view. The data-aos attributes you already use work as they are, or use the wtAnimate directive.',
  },
  themingNote: {
    th: 'ไม่มี token ของธีม จังหวะทั้งหมดมาจาก attribute (<code>data-aos-duration</code>, <code>-delay</code>, <code>-easing</code>) หรือค่าเริ่มต้นของ <code>provideWtAnimate()</code> CSS อยู่ใน <code>@layer wiratheme.utilities</code>',
    en: 'There are no theme tokens: timing comes from the attributes (<code>data-aos-duration</code>, <code>-delay</code>, <code>-easing</code>) or the <code>provideWtAnimate()</code> defaults. The CSS lives in <code>@layer wiratheme.utilities</code>.',
  },
  sections: {
    import: {
      title: { th: 'ติดตั้ง', en: 'Setup' },
      text: {
        th: 'เรียก <code>provideWtAnimate()</code> (หรือ <code>WtAnimateModule.forRoot()</code>) ครั้งเดียว แล้ว element ที่มี <code>data-aos</code> ทั้งหน้าจะทำงาน รวมถึงที่ไม่ได้อยู่ใน template ของ Angular ใน template ที่ใช้ <code>[wtAnimate]</code> ให้ import <code>WtAnimateModule</code> หรือ <code>WtAnimate</code>',
        en: 'Call <code>provideWtAnimate()</code> (or <code>WtAnimateModule.forRoot()</code>) once and every <code>data-aos</code> element in the page animates, including ones outside Angular templates. Templates that use <code>[wtAnimate]</code> import <code>WtAnimateModule</code> or <code>WtAnimate</code>.',
      },
    },
    families: {
      title: { th: 'ท่าทั้ง 27 แบบ', en: 'All 27 animations' },
      text: {
        th: 'เลื่อนลงเพื่อดูแต่ละกลุ่ม: fade (9), zoom (10), flip (4) และ slide (4) ตัวอย่างนี้ตั้ง <code>data-aos-once="false"</code> จึงเล่นซ้ำทุกครั้งที่เลื่อนกลับมา',
        en: 'Scroll down through each family: fade (9), zoom (10), flip (4) and slide (4). These use <code>data-aos-once="false"</code>, so they play again whenever they come back into view.',
      },
    },
    timing: {
      title: { th: 'จังหวะ', en: 'Timing' },
      text: {
        th: '<code>data-aos-delay</code> และ <code>data-aos-duration</code> (ms) · <code>data-aos-easing</code> (ค่า CSS หรือ ease-in-back, ease-out-back …) · <code>data-aos-offset</code> (px จากขอบล่างของจอ) · <code>data-aos-anchor-placement</code> top-bottom, center-bottom, bottom-bottom · <code>data-aos-once</code> · <code>data-aos-mirror</code> เล่นออกเมื่อเลื่อนผ่าน',
        en: '<code>data-aos-delay</code> and <code>data-aos-duration</code> (ms) · <code>data-aos-easing</code> (a CSS value or ease-in-back, ease-out-back …) · <code>data-aos-offset</code> (px from the bottom of the screen) · <code>data-aos-anchor-placement</code> top-bottom, center-bottom, bottom-bottom · <code>data-aos-once</code> · <code>data-aos-mirror</code> plays out when scrolled past.',
      },
    },
    directive: {
      title: 'Directive',
      text: { th: '<code>[wtAnimate]</code> พร้อม <code>animateDelay</code>, <code>animateDuration</code>, <code>animateEasing</code>, <code>animateOffset</code>, <code>animateOnce</code>, <code>animateMirror</code>, <code>animateAnchorPlacement</code>', en: '<code>[wtAnimate]</code> with <code>animateDelay</code>, <code>animateDuration</code>, <code>animateEasing</code>, <code>animateOffset</code>, <code>animateOnce</code>, <code>animateMirror</code>, <code>animateAnchorPlacement</code>.' },
    },
    a11y: {
      title: { th: 'การเคลื่อนไหวที่ลดลงและเนื้อหาที่ไม่หาย', en: 'Reduced motion and safe content' },
      text: {
        th: 'ผู้ใช้ที่ตั้งค่าลดการเคลื่อนไหวจะเห็นทุกอย่างทันทีโดยไม่เคลื่อนไหว เฉพาะ element ที่ถูกติดตามเท่านั้นที่เริ่มแบบซ่อน ถ้า script ไม่ทำงาน เนื้อหาก็ยังแสดงตามปกติ เพิ่มเนื้อหานอก Angular แล้วเรียก <code>WtAnimateService.refresh()</code>',
        en: 'People who ask for reduced motion see everything at once, without movement. Only watched elements start hidden, so content still shows if the script never runs. After adding content outside Angular, call <code>WtAnimateService.refresh()</code>.',
      },
    },
  },
  code: {
    families: `<div data-aos="fade-up">…</div>
<div data-aos="zoom-in" data-aos-once="false">…</div>
<div data-aos="flip-left">…</div>
<div data-aos="slide-up">…</div>`,
    timing: `<div data-aos="fade-up" data-aos-delay="0">…</div>
<div data-aos="fade-up" data-aos-delay="150">…</div>
<div data-aos="fade-up" data-aos-delay="300" data-aos-duration="800" data-aos-easing="ease-out-back">…</div>`,
    directive: `<div wtAnimate="zoom-in" [animateDelay]="200" [animateDuration]="600" [animateOnce]="false">…</div>`,
  },
  ts: {
    import: `// app.config.ts (standalone)
import { provideWtAnimate } from 'wiratheme/animate';

export const appConfig = {
  providers: [provideWiraTheme(), provideWtAnimate({ duration: 600, once: true })],
};

// หรือ AppModule
import { WtAnimateModule } from 'wiratheme/animate';
@NgModule({ imports: [WtAnimateModule.forRoot({ duration: 600 })] })
export class AppModule {}`,
  },
  api: [
    {
      id: 'api-attributes',
      title: { th: 'Attributes / Inputs', en: 'Attributes / Inputs' },
      rows: [
        row('data-aos · wtAnimate', 'WtAnimation', undefined, 'ชื่อท่า', 'Animation name'),
        row('data-aos-delay · animateDelay', 'number', '0', 'หน่วงก่อนเริ่ม (ms)', 'Delay (ms)'),
        row('data-aos-duration · animateDuration', 'number', '400', 'ระยะเวลา (ms)', 'Duration (ms)'),
        row('data-aos-easing · animateEasing', 'string', "'ease'", 'จังหวะ', 'Easing'),
        row('data-aos-offset · animateOffset', 'number', '120', 'px จากขอบล่างของจอที่เริ่มเล่น', 'px from the bottom of the screen where it starts'),
        row('data-aos-once · animateOnce', BOOL, 'true', 'เล่นครั้งแรกครั้งเดียว', 'Play only the first time'),
        row('data-aos-mirror · animateMirror', BOOL, 'false', 'เล่นออกเมื่อเลื่อนผ่าน', 'Play out when scrolled past'),
        row('data-aos-anchor-placement · animateAnchorPlacement', "'top-bottom' | 'center-bottom' | 'bottom-bottom'", "'top-bottom'", 'ส่วนของ element ที่ต้องถึงขอบล่างของจอ', 'Which part must reach the bottom of the screen'),
      ],
    },
    {
      id: 'api-setup',
      title: { th: 'การติดตั้ง', en: 'Setup' },
      typeLabel: { th: 'รับ', en: 'Takes' },
      rows: [
        row('provideWtAnimate(options?)', 'WtAnimateOptions', undefined, 'เริ่มทำงานตอนแอปเริ่ม', 'Starts with the app'),
        row('WtAnimateModule.forRoot(options?)', 'WtAnimateOptions', undefined, 'แบบเดียวกันสำหรับ NgModule', 'The same for NgModule apps'),
        row('WtAnimateService.init(options?) · refresh()', 'WtAnimateOptions', undefined, 'เริ่มเอง / หา element ใหม่', 'Start by hand / look for new elements'),
        row('disable', BOOL, 'false', 'แสดงทุกอย่างโดยไม่เคลื่อนไหว', 'Show everything without animating'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtAnimation =
  | 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
  | 'fade-up-right' | 'fade-up-left' | 'fade-down-right' | 'fade-down-left'
  | 'flip-up' | 'flip-down' | 'flip-left' | 'flip-right'
  | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
  | 'zoom-in' | 'zoom-in-up' | 'zoom-in-down' | 'zoom-in-left' | 'zoom-in-right'
  | 'zoom-out' | 'zoom-out-up' | 'zoom-out-down' | 'zoom-out-left' | 'zoom-out-right';`,
    },
  ],
  tokens: [],
};
