import { ComponentDoc } from '../core/component-doc';
import { STYLE_ROW } from './doc-helpers';

export const TOGGLESWITCH_DOC: ComponentDoc = {
  id: 'toggleswitch',
  title: 'ToggleSwitch',
  group: 'Form',
  entry: 'toggleswitch',
  standalone: 'WtToggleSwitch',
  module: 'WtToggleSwitchModule',
  forms: true,
  selector: 'wt-toggleswitch',
  description: {
    th: 'สวิตช์เปิด / ปิดสำหรับ ngModel และ Reactive Forms มี label ในตัว และข้างในเป็น checkbox จริงที่มี role="switch"',
    en: 'An on / off switch for ngModel and reactive forms, with a built-in label. Underneath is a real checkbox with role="switch".',
  },
  english: {
    'รับข่าวสารทางอีเมล': 'Email me the newsletter',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'เปิดใช้งานบัญชี': 'Account active',
    'แจ้งเตือนทางอีเมล': 'Email alerts',
    'แจ้งเตือนทาง SMS': 'SMS alerts',
    'ปิดอยู่ (เปิด)': 'Disabled (on)',
    'ปิดอยู่': 'Disabled',
    'สวิตช์เป็นสถานะ disabled ตาม control': 'the switch follows the control and shows disabled',
  },
  sections: {
    sizes: {
      title: 'Sizes',
      text: {
        th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้) ขนาดปกติตามขนาด UI ของทั้งแอป',
        en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too); the default follows the app\'s UI size.',
      },
    },
    import: {
      title: 'Import',
      text: {
        th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> ชื่อ tag ที่แอปใช้อยู่ <code>wt-inputSwitch</code> (และ <code>wt-toggleSwitch</code>) ใช้ได้เหมือน <code>wt-toggleswitch</code> ย้ายมาแค่เปลี่ยน prefix',
        en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>. The tag name apps already use, <code>wt-inputSwitch</code> (and <code>wt-toggleSwitch</code>), works the same as <code>wt-toggleswitch</code>, so moving over is a prefix change.',
      },
    },
    basic: { title: 'Basic' },
    values: {
      title: 'trueValue / falseValue',
      text: { th: 'เก็บค่าเป็นอย่างอื่นนอกจาก <code>true</code> / <code>false</code> ได้', en: 'Store values other than <code>true</code> / <code>false</code>.' },
    },
    reactive: {
      title: 'Reactive Forms',
      text: { th: 'สวิตช์ตามสถานะของ control รวมถึง <code>disable()</code> / <code>enable()</code>', en: 'The switch follows the control, including <code>disable()</code> / <code>enable()</code>.' },
    },
    disabled: { title: { th: 'Disabled และ Invalid', en: 'Disabled and Invalid' } },
  },
  code: {
    sizes: `<wt-toggleswitch name="notify" [(ngModel)]="notify" size="small" label="เล็ก"></wt-toggleswitch>
<wt-toggleswitch name="notify" [(ngModel)]="notify" label="ปกติ"></wt-toggleswitch>
<wt-toggleswitch name="notify" [(ngModel)]="notify" size="large" label="ใหญ่"></wt-toggleswitch>`,
    basic: `<wt-toggleswitch id="d-notify" name="newsletter" [(ngModel)]="newsletter" label="รับข่าวสารทางอีเมล"></wt-toggleswitch>`,
    values: `<wt-toggleswitch name="status" [(ngModel)]="status" trueValue="active" falseValue="inactive"
  label="เปิดใช้งานบัญชี"></wt-toggleswitch>`,
    reactive: `<form [formGroup]="form">
  <wt-toggleswitch formControlName="email" label="แจ้งเตือนทางอีเมล"></wt-toggleswitch>
  <wt-toggleswitch formControlName="sms" label="แจ้งเตือนทาง SMS"></wt-toggleswitch>
</form>`,
    disabled: `<wt-toggleswitch [ngModel]="true" [disabled]="true" label="ปิดอยู่ (เปิด)"></wt-toggleswitch>
<wt-toggleswitch [ngModel]="false" [disabled]="true" label="ปิดอยู่"></wt-toggleswitch>
<wt-toggleswitch [invalid]="true" label="Invalid"></wt-toggleswitch>`,
  },
  ts: {
    reactive: `form = new FormGroup({
  email: new FormControl(true),
  sms: new FormControl(false),
});

lockSms(): void {
  this.form.controls.sms.disable();   // สวิตช์เป็นสถานะ disabled ตาม control
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        { name: 'label', type: 'string', description: { th: 'ข้อความข้างสวิตช์', en: 'Text next to the switch' } },
        { name: 'trueValue', type: 'unknown', default: 'true', description: { th: 'ค่าเมื่อเปิด', en: 'Value when on' } },
        { name: 'falseValue', type: 'unknown', default: 'false', description: { th: 'ค่าเมื่อปิด', en: 'Value when off' } },
        { name: 'name', type: 'string', description: { th: 'name ของ <input> ข้างใน', en: 'name of the inner <input>' } },
        { name: 'inputId', type: 'string', description: { th: 'id ของ <input> ข้างใน', en: 'id of the inner <input>' } },
        { name: 'disabled', type: 'boolean', default: 'false', description: { th: 'ปิดการใช้', en: 'Disables it' } },
        { name: 'readonly', type: 'boolean', default: 'false', description: { th: 'แสดงค่าแต่สลับไม่ได้', en: 'Shows the value but cannot toggle' } },
        { name: 'invalid', type: 'boolean', default: 'false', description: { th: 'บังคับขึ้นสีแดง', en: 'Forces the error style' } },
        { name: 'ariaLabel', type: 'string', description: { th: 'ชื่อสำหรับ screen reader เมื่อไม่มี label', en: 'Accessible name when there is no label' } },
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [{ name: 'onChange', type: 'WtToggleSwitchChangeEvent', description: { th: 'สลับสถานะ', en: 'Toggled' } }],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtToggleSwitchChangeEvent {
  checked: boolean;
  originalEvent: Event;
}`,
    },
  ],
  tokens: [
    { name: '--wt-switch-width', description: { th: 'ความกว้างของราง', en: 'Track width' } },
    { name: '--wt-switch-height', description: { th: 'ความสูงของราง', en: 'Track height' } },
    { name: '--wt-switch-track-bg', description: { th: 'สีราง (ปิด)', en: 'Track (off)' } },
    { name: '--wt-switch-track-checked-bg', description: { th: 'สีราง (เปิด)', en: 'Track (on)' } },
    { name: '--wt-switch-track-hover-bg', description: { th: 'สีรางตอนชี้', en: 'Track on hover' } },
    { name: '--wt-switch-handle-bg', description: { th: 'สีปุ่มวงกลม', en: 'Handle colour' } },
    { name: '--wt-switch-handle-size', description: { th: 'ขนาดปุ่มวงกลม', en: 'Handle size' } },
    { name: '--wt-switch-handle-shadow', description: { th: 'เงาของปุ่มวงกลม', en: 'Handle shadow' } },
    { name: '--wt-switch-border-color', description: { th: 'ขอบราง', en: 'Track border' } },
    { name: '--wt-control-focus-shadow', description: { th: 'วงโฟกัส', en: 'Focus ring' } },
    { name: '--wt-transition', description: { th: 'ความเร็วตอนเลื่อน', en: 'Slide speed' } },
  ],
};
