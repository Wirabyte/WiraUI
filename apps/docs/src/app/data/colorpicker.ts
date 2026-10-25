import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

export const COLORPICKER_DOC: ComponentDoc = {
  id: 'colorpicker',
  title: 'ColorPicker',
  group: 'Form',
  entry: 'colorpicker',
  standalone: 'WtColorPicker',
  module: 'WtColorPickerModule',
  forms: true,
  selector: 'wt-colorpicker',
  description: {
    th: 'เลือกสีจากแผง: พื้นที่ความอิ่มตัวและความสว่าง แถบเฉดสี และช่องพิมพ์รหัส hex เปิดจากปุ่มตัวอย่างสี หรือวางแผงไว้บนหน้าเลย ค่าเป็น #rrggbb, { r, g, b } หรือ { h, s, b }',
    en: 'Pick a colour from a panel: a saturation and brightness area, a hue strip and a hex field. It opens from a swatch, or sits on the page. The value is #rrggbb, { r, g, b } or { h, s, b }.',
  },
  english: {
    'สีประจำโรงเรียน': 'School colour',
    'สีป้ายประกาศ': 'Notice colour',
    'สีหัวเกียรติบัตร': 'Certificate header colour',
    'สีของกลุ่มสาระ': 'Subject group colour',
    'เปิดแผง': 'opened',
    'ปิดแผง': 'closed',
    'ยังไม่ได้เลือก': 'none yet',
    'ค่าจาก API': 'from the API',
    'ล่าสุด': 'Last event',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtColorPickerModule</code>) และ standalone (<code>WtColorPicker</code>) ใช้คู่กับ <code>FormsModule</code> หรือ <code>ReactiveFormsModule</code> แท็กเขียนได้ทั้ง <code>wt-colorpicker</code>, <code>wt-colorPicker</code> และ <code>wt-color-picker</code>',
        en: 'Works as an NgModule (<code>WtColorPickerModule</code>) or standalone (<code>WtColorPicker</code>), with <code>FormsModule</code> or <code>ReactiveFormsModule</code>. The tag can be written <code>wt-colorpicker</code>, <code>wt-colorPicker</code> or <code>wt-color-picker</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'กดปุ่มตัวอย่างสีเพื่อเปิดแผง ลากในพื้นที่สีหรือแถบเฉดสี หรือพิมพ์รหัสในช่อง hex แล้วกด <code>Enter</code> · ค่าเป็น string <code>\'#rrggbb\'</code> (<code>format="hex"</code> ค่าเริ่มต้น) · คีย์บอร์ด: ลูกศรขยับจุดที่โฟกัส (<code>Shift</code> ทีละสิบ), <code>Home</code> / <code>End</code> ที่แถบเฉดสี, <code>Esc</code> ปิดแผงแล้วโฟกัสกลับที่ปุ่ม · แผงเปิดใน top layer จึงไม่ถูกตัดในกล่องที่เลื่อนได้',
        en: 'Press the swatch to open the panel, drag in the colour area or along the hue strip, or type a code in the hex field and press <code>Enter</code> · the value is a string <code>\'#rrggbb\'</code> (<code>format="hex"</code>, the default) · keyboard: arrows move the focused handle (<code>Shift</code> for ten), <code>Home</code> / <code>End</code> on the hue strip, <code>Esc</code> closes the panel and gives focus back to the swatch · the panel opens in the top layer, so scrolling boxes never cut it off.',
      },
    },
    inline: {
      title: { th: 'วางแผงบนหน้า', en: 'Inline' },
      text: {
        th: '<code>[inline]="true"</code> แสดงแผงบนหน้าตลอด ไม่มีปุ่มเปิด · <code>format="rgb"</code> ค่าเป็น <code>{ r, g, b }</code> (0–255)',
        en: '<code>[inline]="true"</code> keeps the panel on the page, with no swatch to open it · <code>format="rgb"</code> makes the value <code>{ r, g, b }</code> (0–255).',
      },
    },
    format: {
      title: { th: 'รูปแบบค่า', en: 'Value formats' },
      text: {
        th: '<code>format="hsb"</code> ค่าเป็น <code>{ h, s, b }</code> (h 0–360, s และ b 0–100) · ไม่ว่าตั้งรูปแบบไหน ค่าที่ส่งเข้ามาจะอ่านได้ทั้งสามแบบ (<code>\'#0f766e\'</code>, <code>{ r, g, b }</code> หรือ <code>{ h, s, b }</code>) แต่ค่าที่ส่งออกเป็นรูปแบบที่ตั้งไว้ · <code>defaultColor</code> คือสีที่แสดงเมื่อยังไม่มีค่า (ค่าเริ่มต้น <code>ff0000</code>)',
        en: '<code>format="hsb"</code> makes the value <code>{ h, s, b }</code> (h 0–360, s and b 0–100) · whatever the format, a value coming in is read in any of the three shapes (<code>\'#0f766e\'</code>, <code>{ r, g, b }</code> or <code>{ h, s, b }</code>); the value going out is in the format set · <code>defaultColor</code> is shown while there is no value (<code>ff0000</code> by default).',
      },
    },
    events: {
      title: { th: 'Event และการปิด', en: 'Events and turning it off' },
      text: {
        th: '<code>(onChange)</code> ได้ <code>{ originalEvent, value }</code> ทุกครั้งที่สีเปลี่ยน · <code>(onShow)</code> / <code>(onHide)</code> เมื่อแผงเปิด / ปิด · <code>[disabled]="true"</code> ปิดการใช้งาน · <code>inputId</code> ตั้ง id ให้ปุ่มเพื่อผูกกับ <code>&lt;label for&gt;</code>',
        en: '<code>(onChange)</code> brings <code>{ originalEvent, value }</code> on every change · <code>(onShow)</code> / <code>(onHide)</code> when the panel opens / closes · <code>[disabled]="true"</code> turns it off · <code>inputId</code> gives the swatch an id for a <code>&lt;label for&gt;</code>.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-colorPicker&gt;</code> เป็น <code>&lt;wt-colorPicker&gt;</code> input และ event ชื่อเดิม แผงเปิดใน top layer จึงไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล เช่นเดียวกับ <code>autoZIndex</code>, <code>baseZIndex</code> และ transition) · class <code>p-colorpicker</code> อยู่คู่กับ <code>wt-colorpicker</code>',
        en: 'Change <code>&lt;p-colorPicker&gt;</code> to <code>&lt;wt-colorPicker&gt;</code>; inputs and events keep their names. The panel opens in the top layer, so <code>appendTo</code> is not needed (accepted and ignored, like <code>autoZIndex</code>, <code>baseZIndex</code> and the transitions) · the <code>p-colorpicker</code> class sits next to <code>wt-colorpicker</code>.',
      },
    },
  },
  code: {
    basic: `<label for="schoolColor">สีประจำโรงเรียน</label>
<wt-colorPicker inputId="schoolColor" name="schoolColor" [(ngModel)]="schoolColor"></wt-colorPicker>
<code>{{ schoolColor }}</code>`,
    inline: `<wt-colorPicker name="noticeColor" [(ngModel)]="noticeColor" format="rgb" [inline]="true" ariaLabel="สีป้ายประกาศ"></wt-colorPicker>
<code>rgb({{ noticeColor.r }}, {{ noticeColor.g }}, {{ noticeColor.b }})</code>`,
    format: `<wt-colorPicker name="headerColor" [(ngModel)]="headerColor" format="hsb" defaultColor="0f766e"
  ariaLabel="สีหัวเกียรติบัตร"></wt-colorPicker>`,
    events: `<wt-colorPicker name="groupColor" [(ngModel)]="groupColor" ariaLabel="สีของกลุ่มสาระ"
  (onShow)="logPanel('onShow')" (onHide)="logPanel('onHide')"></wt-colorPicker>
<wt-colorPicker name="lockedColor" [(ngModel)]="schoolColor" [disabled]="true" ariaLabel="สีประจำโรงเรียน"></wt-colorPicker>`,
  },
  ts: {
    basic: `schoolColor = '#0f766e';   // ค่าจาก API`,
    inline: `noticeColor = { r: 234, g: 88, b: 12 };`,
    format: `headerColor: { h: number; s: number; b: number } | null = null;`,
    events: `groupColor = '#7c3aed';
panelEvents: string[] = [];

logPanel(name: string): void {
  this.panelEvents = [...this.panelEvents.slice(-3), name];
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('format', "'hex' | 'rgb' | 'hsb'", "'hex'", 'รูปแบบค่าที่ส่งออก (ค่าที่เข้ามาอ่านได้ทุกแบบ)', 'Shape of the value going out (any shape is read coming in)'),
        row('inline', BOOL, 'false', 'แผงอยู่บนหน้า ไม่มีปุ่มเปิด', 'The panel on the page, with no swatch'),
        row('defaultColor', 'string', "'ff0000'", 'สีที่แสดงเมื่อยังไม่มีค่า', 'Shown while there is no value'),
        row('disabled', BOOL, 'false', 'ปิดการใช้งาน', 'Turns it off'),
        row('inputId', 'string', undefined, 'id ของปุ่ม สำหรับ label for', 'Id of the swatch, for a label'),
        row('ariaLabel · tabindex', 'string · number', undefined, 'ชื่อสำหรับโปรแกรมอ่านหน้าจอ (ค่าเริ่มต้นมาจาก locale) และลำดับ Tab', 'Screen reader name (the default comes from the locale) and the tab order'),
        STYLE_ROW,
        row('appendTo · autoZIndex · baseZIndex · showTransitionOptions · hideTransitionOptions · autofocus', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onChange', 'WtColorPickerChangeEvent', undefined, 'สีเปลี่ยน', 'The colour changed'),
        row('onShow · onHide', 'void', undefined, 'แผงเปิด / ปิด', 'The panel opened / closed'),
      ],
    },
    {
      id: 'api-keyboard',
      title: { th: 'คีย์บอร์ด', en: 'Keyboard' },
      typeLabel: { th: 'ผล', en: 'Effect' },
      rows: [
        row('Enter · Space', 'swatch', undefined, 'เปิดแผง (เมื่อโฟกัสที่ปุ่ม)', 'Opens the panel (on the swatch)'),
        row('← → ↑ ↓', '±1 · Shift ±10', undefined, 'ขยับจุดในพื้นที่สีหรือแถบเฉดสีที่โฟกัส', 'Move the focused handle in the colour area or on the hue strip'),
        row('Home · End', 'hue', undefined, 'ไปเฉดแรก / สุดท้ายของแถบเฉดสี', 'To the first / last hue on the strip'),
        row('Esc', '—', undefined, 'ปิดแผงแล้วโฟกัสกลับที่ปุ่ม', 'Closes the panel and gives focus back to the swatch'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtColorPickerChangeEvent {
  originalEvent: Event;
  value: string | { r: number; g: number; b: number } | { h: number; s: number; b: number };
}`,
    },
  ],
  tokens: [
    tok('--wt-colorpicker-preview-size', 'ขนาดปุ่มตัวอย่างสี', 'Swatch size'),
    tok('--wt-colorpicker-panel-width', 'ความกว้างของแผง', 'Panel width'),
    tok('--wt-colorpicker-panel-padding', 'ระยะในแผง', 'Panel padding'),
    tok('--wt-colorpicker-area-height', 'ความสูงของพื้นที่สี', 'Colour area height'),
  ],
};
