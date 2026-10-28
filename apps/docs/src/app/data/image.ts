import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

export const IMAGE_DOC: ComponentDoc = {
  id: 'image',
  title: 'Image',
  group: 'Media',
  entry: 'image',
  standalone: 'WtImage',
  module: 'WtImageModule',
  selector: 'wt-image',
  description: {
    th: 'รูปภาพที่กดขยายดูเต็มจอได้ ในหน้าต่างเต็มจอหมุนและย่อขยายได้ กด Esc หรือคลิกข้างรูปเพื่อปิด และใส่ไฟล์ใหญ่แยกสำหรับดูเต็มจอได้',
    en: 'A picture that opens full screen on demand, with rotate and zoom. Escape or a click beside the picture closes it, and the full-screen view can load a larger file.',
  },
  english: {
    'อาคารเรียนของโรงเรียน': 'The school building',
    'ทะเลสาบยามเย็น': 'A lake at dusk',
    'ดูภาพเต็ม': 'Full view',
    'รูปนักเรียน': 'Student photo',
    'ยังไม่มีรูปนี้': 'this photo does not exist yet',
    'ไฟล์ที่หาไม่เจอ: ใช้รูปสำรองแทน': 'file not found: use a stand-in picture',
    'ลองอีกครั้ง': 'Try again',
    'จอกว้างแสดง 480px จอแคบเต็มความกว้าง': 'wide screens show 480px, narrow ones the full width',
    'คลิกที่รูปเพื่อปิด': 'click the picture to close',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtImageModule</code> ซึ่ง export <code>WtTemplate</code> ให้ด้วย) และ standalone (<code>WtImage</code>)',
        en: 'Works as an NgModule (<code>WtImageModule</code>, which also exports <code>WtTemplate</code>) or standalone (<code>WtImage</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>src</code> และ <code>alt</code> เหมือน <code>&lt;img&gt;</code> พร้อม <code>width</code> / <code>height</code> และ <code>loading="lazy"</code> · <code>imageClass</code> / <code>imageStyle</code> ใส่ที่ตัว <code>&lt;img&gt;</code> ส่วน <code>styleClass</code> / <code>style</code> ใส่ที่กล่องรอบรูป · รูปไม่กว้างเกินกล่องที่อยู่',
        en: '<code>src</code> and <code>alt</code> as on an <code>&lt;img&gt;</code>, with <code>width</code> / <code>height</code> and <code>loading="lazy"</code>. <code>imageClass</code> / <code>imageStyle</code> go on the <code>&lt;img&gt;</code> itself, <code>styleClass</code> / <code>style</code> on the box around it. The picture never gets wider than its container.',
      },
    },
    preview: {
      title: { th: 'ดูภาพเต็มจอ', en: 'Full-screen preview' },
      text: {
        th: '<code>[preview]="true"</code> วางปุ่มทับรูป (ชี้แล้วเห็น บนจอสัมผัสเป็นไอคอนเล็กที่มุมเสมอ) กดแล้วเปิดรูปเต็มจอใน <code>&lt;dialog&gt;</code> แบบ modal ซึ่งอยู่ใน top layer จึงไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล) หน้าด้านหลังเลื่อนไม่ได้ระหว่างเปิด ปุ่มด้านบนหมุนซ้าย / ขวา และย่อ / ขยายได้ 0.5–1.5 เท่า กด Esc ปุ่มปิด หรือคลิกข้างรูปเพื่อปิด แล้วโฟกัสกลับไปที่ปุ่มเดิม <code>(onShow)</code> / <code>(onHide)</code> บอกตอนเปิดและปิด',
        en: '<code>[preview]="true"</code> puts a button over the picture (shown on hover; a small corner icon that stays on touch screens). It opens the picture full screen in a modal <code>&lt;dialog&gt;</code> in the top layer, so <code>appendTo</code> is not needed (accepted and ignored). The page behind does not scroll meanwhile. The toolbar rotates left / right and zooms 0.5–1.5×. Escape, the close button or a click beside the picture closes it, and focus goes back to the button. <code>(onShow)</code> / <code>(onHide)</code> report opening and closing.',
      },
    },
    large: {
      title: { th: 'ไฟล์ใหญ่สำหรับเต็มจอ', en: 'A larger file for the preview' },
      text: {
        th: '<code>previewImageSrc</code> ให้หน้าต่างเต็มจอโหลดไฟล์ที่ใหญ่กว่า ส่วนในหน้าใช้ไฟล์เล็กที่โหลดเร็ว (มี <code>previewImageSrcSet</code> / <code>previewImageSizes</code> ด้วย) ลองเปิดดู: ภาพเต็มจอมีรายละเอียดมากกว่า',
        en: '<code>previewImageSrc</code> makes the full-screen view load a larger file while the page keeps the small, quick one (<code>previewImageSrcSet</code> / <code>previewImageSizes</code> exist too). Open it: the full-screen picture has more detail.',
      },
    },
    srcset: {
      title: { th: 'หลายขนาดตามจอ', en: 'Sources by screen size' },
      text: {
        th: '<code>srcSet</code> และ <code>sizes</code> ทำงานเหมือนบน <code>&lt;img&gt;</code>: browser เลือกไฟล์ที่พอดีกับความกว้างที่แสดงจริงและความละเอียดของจอ',
        en: '<code>srcSet</code> and <code>sizes</code> work as on an <code>&lt;img&gt;</code>: the browser picks the file that fits the shown width and the screen density.',
      },
    },
    templates: {
      title: { th: 'ปรับแต่งปุ่มและภาพเต็มจอ', en: 'Custom button and preview' },
      text: {
        th: 'template <code>indicator</code> แทนไอคอนบนปุ่มเปิด · <code>preview</code> แทนรูปในหน้าต่างเต็มจอ ได้ <code>let-src</code> พร้อม <code>class</code>, <code>style</code> (มีการหมุนและย่อขยายอยู่ใน transform) และ <code>previewCallback</code> สำหรับปิดหน้าต่าง ตัวอย่างนี้คลิกที่รูปแล้วปิด',
        en: 'The <code>indicator</code> template replaces the icon on the open button · <code>preview</code> replaces the full-screen picture. It gets <code>let-src</code> plus <code>class</code>, <code>style</code> (the rotation and zoom live in its transform) and <code>previewCallback</code>, which closes the view; here a click on the picture closes it.',
      },
    },
    error: {
      title: { th: 'รูปโหลดไม่ได้', en: 'When the picture fails' },
      text: {
        th: '<code>(onImageError)</code> ทำงานเมื่อโหลดรูปไม่สำเร็จ ใช้สลับเป็นรูปสำรองได้ · template <code>image</code> วาด <code>&lt;img&gt;</code> เอง ได้ <code>errorCallback</code> ไปผูกกับ <code>(error)</code> ของรูป เพื่อให้ <code>(onImageError)</code> ยังทำงาน ตัวอย่างนี้เริ่มจากไฟล์ที่ไม่มีอยู่จริง',
        en: '<code>(onImageError)</code> runs when the picture fails to load; use it to swap in a stand-in. The <code>image</code> template draws the <code>&lt;img&gt;</code> yourself and gets <code>errorCallback</code> to wire to its <code>(error)</code>, so <code>(onImageError)</code> still runs. This sample starts from a file that does not exist.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและการเข้าถึง', en: 'Keyboard and accessibility' },
      text: {
        th: 'ปุ่มเปิดเป็น <code>&lt;button&gt;</code> จริง ชื่อปุ่มมาจาก locale (“ดูภาพขยาย”) <code>Tab</code> ไปถึงแล้วกด <code>Enter</code> / <code>Space</code> เพื่อเปิด · ในหน้าต่างเต็มจอโฟกัสเริ่มที่ปุ่มปิด <code>Tab</code> วนอยู่ในปุ่มหมุน ย่อ ขยาย และปิด ซึ่งมีชื่อจาก locale ทุกปุ่ม · <code>Esc</code> ปิดแล้วโฟกัสกลับที่ปุ่มเปิด · หน้าต่างใช้ <code>alt</code> เป็นชื่อ จึงควรใส่ <code>alt</code> เสมอ',
        en: 'The open button is a real <code>&lt;button&gt;</code> named from the locale (“View larger image”); <code>Tab</code> reaches it and <code>Enter</code> / <code>Space</code> open it · in the full-screen view focus starts on the close button and <code>Tab</code> cycles through rotate, zoom and close, each named from the locale · <code>Esc</code> closes and focus returns to the open button · the view is named after <code>alt</code>, so always set <code>alt</code>.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-image&gt;</code> เป็น <code>&lt;wt-image&gt;</code> input เดิมอย่าง <code>src</code>, <code>alt</code>, <code>width</code>, <code>preview</code>, <code>imageClass</code> และ <code>(onImageError)</code> ใช้ต่อได้ template <code>pTemplate="indicator"</code> / <code>"image"</code> / <code>"preview"</code> ใช้ได้ ส่วน <code>appendTo</code>, <code>showTransitionOptions</code> และ <code>hideTransitionOptions</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-image&gt;</code> to <code>&lt;wt-image&gt;</code>. Existing inputs such as <code>src</code>, <code>alt</code>, <code>width</code>, <code>preview</code>, <code>imageClass</code> and <code>(onImageError)</code> keep working, and so do <code>pTemplate="indicator"</code> / <code>"image"</code> / <code>"preview"</code> templates. <code>appendTo</code>, <code>showTransitionOptions</code> and <code>hideTransitionOptions</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wt-image src="samples/school-thumb.svg" alt="อาคารเรียนของโรงเรียน" width="320" height="200" loading="lazy"
  imageClass="shadow-2" [imageStyle]="{ 'border-radius': '12px' }"></wt-image>`,
    preview: `<wt-image src="samples/school-thumb.svg" alt="อาคารเรียนของโรงเรียน" width="320" [preview]="true"
  (onShow)="logPreview('onShow')" (onHide)="logPreview('onHide')"></wt-image>`,
    large: `<wt-image src="samples/school-thumb.svg" previewImageSrc="samples/school-large.svg" alt="อาคารเรียนของโรงเรียน"
  width="240" [preview]="true"></wt-image>`,
    srcset: `<!-- จอกว้างแสดง 480px จอแคบเต็มความกว้าง -->
<wt-image src="samples/school-thumb.svg" srcSet="samples/school-thumb.svg 320w, samples/school-large.svg 1280w"
  sizes="(min-width: 768px) 480px, 100vw" alt="อาคารเรียนของโรงเรียน" [preview]="true"></wt-image>`,
    templates: `<wt-image src="samples/card-cover.svg" alt="ทะเลสาบยามเย็น" width="320" [preview]="true">
  <ng-template #indicator>
    <span class="flex align-items-center gap-2"><i class="wi wi-search"></i> ดูภาพเต็ม</span>
  </ng-template>
  <!-- คลิกที่รูปเพื่อปิด -->
  <ng-template #preview let-src let-imgClass="class" let-imgStyle="style" let-previewCallback="previewCallback">
    <img [src]="src" [class]="imgClass" [style]="imgStyle" alt="ทะเลสาบยามเย็น" (click)="previewCallback()" />
  </ng-template>
</wt-image>`,
    error: `<wt-image [preview]="true" (onImageError)="useStandIn()">
  <ng-template #image let-errorCallback="errorCallback">
    <img [src]="photoSrc" alt="รูปนักเรียน" width="160" height="160" (error)="errorCallback($event)" />
  </ng-template>
</wt-image>`,
  },
  ts: {
    preview: `previewEvents: string[] = [];

logPreview(event: string): void {
  this.previewEvents = [...this.previewEvents, event];
}`,
    error: `photoSrc = 'photos/student-15.jpg';   // ยังไม่มีรูปนี้

useStandIn(): void {
  // ไฟล์ที่หาไม่เจอ: ใช้รูปสำรองแทน
  this.photoSrc = 'samples/no-photo.svg';
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('src · alt', 'string', undefined, 'ไฟล์รูป และข้อความแทนรูป (ใช้เป็นชื่อของหน้าต่างเต็มจอด้วย)', 'The picture file, and its alternative text (also names the full-screen view)'),
        row('srcSet · sizes', 'string', undefined, 'หลายไฟล์ตามความกว้าง เหมือนบน <img>', 'Sources by width, as on an <img>'),
        row('width · height', 'string | number', undefined, 'ขนาดของ <img>', 'Size of the <img>'),
        row('loading', "'lazy' | 'eager'", undefined, 'โหลดเมื่อใกล้จะเห็น หรือโหลดทันที', 'Load when nearly in view, or at once'),
        row('imageClass · imageStyle', 'string · object', undefined, 'class / style ของ <img>', 'Class / style of the <img>'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของกล่องรอบรูป', 'Class / style of the box around it'),
        row('preview', 'boolean', 'false', 'ปุ่มทับรูปสำหรับดูเต็มจอ', 'A button over the picture that opens it full screen'),
        row('previewImageSrc · previewImageSrcSet · previewImageSizes', 'string', 'src', 'ไฟล์สำหรับหน้าต่างเต็มจอ', 'The file(s) for the full-screen view'),
        row('appendTo · showTransitionOptions · hideTransitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล (เปิดใน top layer)', 'Accepted so existing templates compile; no effect (it opens in the top layer)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onShow', 'void', undefined, 'เปิดหน้าต่างเต็มจอแล้ว', 'The full-screen view opened'),
        row('onHide', 'void', undefined, 'ปิดหน้าต่างเต็มจอแล้ว', 'The full-screen view closed'),
        row('onImageError', 'Event', undefined, 'โหลดรูปไม่สำเร็จ', 'The picture failed to load'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #preview, wtTemplate="preview" หรือ pTemplate="preview" ก็ได้',
        en: 'Write them as #preview, wtTemplate="preview" or pTemplate="preview".',
      },
      rows: [
        row('indicator', '—', undefined, 'เนื้อหาบนปุ่มเปิด (แทนไอคอนรูปตา)', 'Content of the open button (instead of the eye icon)'),
        row('image', 'errorCallback', undefined, 'วาด <img> เอง ผูก (error) กับ errorCallback เพื่อให้ onImageError ทำงาน', 'Draw the <img> yourself; wire (error) to errorCallback so onImageError still runs'),
        row('preview', '$implicit (src) · class · style · previewCallback', undefined, 'รูปในหน้าต่างเต็มจอ style มีการหมุนและย่อขยาย previewCallback ปิดหน้าต่าง', 'The full-screen picture; style carries the rotation and zoom, previewCallback closes the view'),
      ],
    },
  ],
  tokens: [
    tok('--wt-image-indicator-bg', 'พื้นของปุ่มเปิดที่ทับรูป (และไอคอนมุมบนจอสัมผัส)', 'Background of the open button over the picture (and the corner icon on touch screens)'),
    tok('--wt-image-indicator-color', 'สีไอคอนบนปุ่มเปิดและในหน้าต่างเต็มจอ', 'Icon colour on the open button and in the full-screen view'),
    tok('--wt-image-mask-bg', 'พื้นหลังของหน้าต่างเต็มจอ', 'Background of the full-screen view'),
    tok('--wt-image-action-bg', 'พื้นของปุ่มหมุน ย่อ ขยาย และปิด', 'Background of the rotate, zoom and close buttons'),
    tok('--wt-image-action-hover-bg', 'พื้นของปุ่มเหล่านั้นเมื่อชี้', 'Those buttons on hover'),
    tok('--wt-transition', 'ความเร็วที่ปุ่มเปิดค่อย ๆ ปรากฏ', 'How fast the open button fades in'),
  ],
};
