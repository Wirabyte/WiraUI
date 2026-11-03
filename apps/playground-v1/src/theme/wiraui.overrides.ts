// WiraUI · wiraui.overrides.ts
// ค่าในไฟล์นี้ทับธีมหลัก (ไฟล์ SCSS/CSS) ผ่าน @layer wiraui.overrides โดยไม่ต้องใช้ !important
// Values here win over the main theme file through @layer wiraui.overrides, no !important needed.
import { defineOverrides } from '@wirabyte/ui/config';

export const wiraOverrides = defineOverrides({
  // semantic: { radius: '8px', density: 'compact' },
  // components: { card: { bodyGap: '0px' }, button: { radius: '999px' } },
});
