// WiraTheme · wiratheme.overrides.ts
// ค่าในไฟล์นี้ทับธีมหลัก (ไฟล์ SCSS/CSS) ผ่าน @layer wiratheme.overrides โดยไม่ต้องใช้ !important
// Values here win over the main theme file through @layer wiratheme.overrides, no !important needed.
import { defineOverrides } from 'wiratheme/config';

export const wiraOverrides = defineOverrides({
  // semantic: { radius: '8px', density: 'compact' },
  // components: { card: { bodyGap: '0px' }, button: { radius: '999px' } },
});
