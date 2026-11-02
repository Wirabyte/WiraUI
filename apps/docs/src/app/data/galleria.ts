import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

/** Photos the Galleria demos share. */
export const GALLERY_PHOTOS = [
  { src: 'samples/gallery-sports.svg', alt: 'วันกีฬาสี', title: 'วันกีฬาสี', text: 'ขบวนพาเหรดและการแข่งขันวิ่งผลัด' },
  { src: 'samples/gallery-science.svg', alt: 'งานวันวิทยาศาสตร์', title: 'งานวันวิทยาศาสตร์', text: 'นิทรรศการโครงงานของนักเรียน ม.ต้น' },
  { src: 'samples/gallery-library.svg', alt: 'ห้องสมุด', title: 'ห้องสมุด', text: 'มุมอ่านหนังสือเปิดใหม่ชั้นสอง' },
  { src: 'samples/gallery-music.svg', alt: 'ห้องดนตรี', title: 'ห้องดนตรี', text: 'วงดนตรีไทยซ้อมก่อนงานไหว้ครู' },
  { src: 'samples/gallery-garden.svg', alt: 'สวนเกษตร', title: 'สวนเกษตร', text: 'แปลงผักของชุมนุมเกษตร' },
];

const PHOTOS_TS = `photos = [
  { src: 'photos/sports.jpg', alt: 'วันกีฬาสี', title: 'วันกีฬาสี', text: 'ขบวนพาเหรดและการแข่งขันวิ่งผลัด' },
  { src: 'photos/science.jpg', alt: 'งานวันวิทยาศาสตร์', title: 'งานวันวิทยาศาสตร์', text: 'นิทรรศการโครงงานของนักเรียน ม.ต้น' },
  // … ข้อมูลจาก API
];`;

export const GALLERIA_DOC: ComponentDoc = {
  id: 'galleria',
  title: 'Galleria',
  group: 'Media',
  entry: 'galleria',
  standalone: 'WuGalleria',
  module: 'WuGalleriaModule',
  selector: 'wu-galleria',
  description: {
    th: 'แสดงรูปทีละรูป พร้อมรูปย่อ จุดบอกตำแหน่ง และลูกศร เลื่อนเองเป็นสไลด์ได้ (หยุดเมื่อชี้อยู่) วนกลับรูปแรกได้ ปัดบนจอสัมผัสได้ และเปิดเต็มจอได้',
    en: 'Shows images one at a time with thumbnails, dots and arrows. It can play by itself (pausing while the pointer is over it), wrap round, be swiped on touch screens and open full screen.',
  },
  english: {
    'วันกีฬาสี': 'Sports day',
    'ขบวนพาเหรดและการแข่งขันวิ่งผลัด': 'The parade and the relay race',
    'งานวันวิทยาศาสตร์': 'Science fair',
    'นิทรรศการโครงงานของนักเรียน ม.ต้น': 'Lower-secondary project exhibition',
    'ห้องสมุด': 'Library',
    'มุมอ่านหนังสือเปิดใหม่ชั้นสอง': 'The new reading corner upstairs',
    'ห้องดนตรี': 'Music room',
    'วงดนตรีไทยซ้อมก่อนงานไหว้ครู': 'The Thai music band rehearsing for Teachers’ Day',
    'สวนเกษตร': 'School garden',
    'แปลงผักของชุมนุมเกษตร': 'The farming club’s vegetable beds',
    'ภาพกิจกรรม': 'Activity photos',
    'เล่นสไลด์': 'Play',
    'หยุด': 'Stop',
    'ดูเต็มจอ': 'Full screen',
    'รูปที่': 'Photo',
    'ข้อมูลจาก API': 'data from the API',
    'จอกว้างไม่เกิน 768px: รูปย่อ 2 รูป': 'up to 768px wide: 2 thumbnails',
    'เปิดที่รูปที่กด': 'open at the photo pressed',
    'ใช้เมื่อหน้าต่างกว้างไม่เกินนี้': 'applies up to this window width',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuGalleriaModule</code>) และ standalone (<code>WuGalleria</code>)',
        en: 'Works as an NgModule (<code>WuGalleriaModule</code>) or standalone (<code>WuGalleria</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[value]</code> คือรายการรูป template <code>item</code> วาดรูปใหญ่ และ <code>thumbnail</code> วาดรูปย่อ (ได้ <code>let-photo</code> และ <code>index</code>) · <code>[numVisible]</code> คือจำนวนรูปย่อที่เห็น (ค่าเริ่มต้น 3) · <code>[(activeIndex)]</code> รูปที่แสดงอยู่ · คีย์บอร์ด: โฟกัสที่รูปแล้วกดลูกศรซ้ายขวา · บนจอสัมผัสปัดซ้ายขวาได้',
        en: '<code>[value]</code> is the list of photos; the <code>item</code> template draws the big one and <code>thumbnail</code> the small ones (both get <code>let-photo</code> and <code>index</code>) · <code>[numVisible]</code> is how many thumbnails show (3 by default) · <code>[(activeIndex)]</code> is the photo on show · keyboard: focus the photo and use the left and right arrows · swipe on touch screens.',
      },
    },
    indicators: {
      title: { th: 'จุดและลูกศร', en: 'Dots and arrows' },
      text: {
        th: '<code>[showThumbnails]="false"</code> ไม่มีรูปย่อ · <code>[showIndicators]="true"</code> มีจุดบอกตำแหน่ง (<code>[showIndicatorsOnItem]="true"</code> วางบนรูป และ <code>[changeItemOnIndicatorHover]="true"</code> เปลี่ยนรูปเมื่อชี้) · <code>[showItemNavigators]="true"</code> มีลูกศรบนรูป (<code>[showItemNavigatorsOnHover]="true"</code> แสดงเมื่อชี้) · <code>[circular]="true"</code> ต่อจากรูปสุดท้ายคือรูปแรก',
        en: '<code>[showThumbnails]="false"</code> drops the thumbnails · <code>[showIndicators]="true"</code> adds dots (<code>[showIndicatorsOnItem]="true"</code> puts them on the photo and <code>[changeItemOnIndicatorHover]="true"</code> changes photo on hover) · <code>[showItemNavigators]="true"</code> adds arrows on the photo (<code>[showItemNavigatorsOnHover]="true"</code> shows them on hover) · <code>[circular]="true"</code> wraps from the last photo to the first.',
      },
    },
    caption: {
      title: { th: 'คำบรรยาย หัวและท้าย', en: 'Caption, header and footer' },
      text: {
        th: 'template <code>caption</code> วางบนรูป (ได้รูปปัจจุบัน) · <code>header</code> และ <code>footer</code> อยู่เหนือ / ใต้ทั้งชุด · <code>indicator</code> แทนจุดได้ (ได้ลำดับ) · <code>[containerStyle]</code> / <code>containerClass</code> แต่งกรอบนอก',
        en: 'The <code>caption</code> template sits on the photo (it gets the current one) · <code>header</code> and <code>footer</code> go above / below the whole gallery · <code>indicator</code> replaces each dot (it gets the index) · <code>[containerStyle]</code> / <code>containerClass</code> style the outer frame.',
      },
    },
    position: {
      title: { th: 'ตำแหน่งรูปย่อและจอแคบ', en: 'Thumbnail position and narrow screens' },
      text: {
        th: '<code>thumbnailsPosition</code> และ <code>indicatorsPosition</code> เป็น <code>bottom</code>, <code>top</code>, <code>left</code> หรือ <code>right</code> (ด้านข้างตั้งความสูงด้วย <code>verticalThumbnailViewPortHeight</code>) · <code>[responsiveOptions]</code> เปลี่ยนจำนวนรูปย่อตามความกว้างหน้าต่าง: <code>{ breakpoint: \'768px\', numVisible: 2 }</code> ใช้เมื่อหน้าต่างกว้างไม่เกิน 768px',
        en: '<code>thumbnailsPosition</code> and <code>indicatorsPosition</code> are <code>bottom</code>, <code>top</code>, <code>left</code> or <code>right</code> (at the side, set the height with <code>verticalThumbnailViewPortHeight</code>) · <code>[responsiveOptions]</code> changes the number of thumbnails with the window width: <code>{ breakpoint: \'768px\', numVisible: 2 }</code> applies up to 768px.',
      },
    },
    autoplay: {
      title: { th: 'เล่นเป็นสไลด์', en: 'Slide show' },
      text: {
        th: '<code>[autoPlay]="true"</code> เลื่อนรูปเองทุก <code>transitionInterval</code> มิลลิวินาที (ค่าเริ่มต้น 4000) หยุดชั่วคราวเมื่อชี้อยู่ และหยุดเมื่อผู้ใช้เปลี่ยนรูปเอง · เรียก <code>startSlideShow()</code> / <code>stopSlideShow()</code> จาก template ref ได้ · ผู้ใช้ที่ตั้งลดการเคลื่อนไหวจะไม่เห็นภาพจาง',
        en: '<code>[autoPlay]="true"</code> moves on every <code>transitionInterval</code> milliseconds (4000 by default), pauses while the pointer is over it, and stops when the reader changes photo · call <code>startSlideShow()</code> / <code>stopSlideShow()</code> through a template ref · people who ask for reduced motion see no fade.',
      },
    },
    fullscreen: {
      title: { th: 'เต็มจอ', en: 'Full screen' },
      text: {
        th: '<code>[fullScreen]="true"</code> กับ <code>[(visible)]</code> เปิดเป็นชั้นเต็มจอ (เป็น dialog: โฟกัสอยู่ข้างใน หน้าเบื้องหลังกดไม่ได้) ปิดด้วยปุ่ม ×, <code>Esc</code> หรือคลิกพื้นหลัง แล้วโฟกัสกลับมาที่ปุ่มที่เปิด · ตั้ง <code>activeIndex</code> ก่อนเปิดเพื่อเริ่มที่รูปที่กด · <code>maskClass</code> แต่งพื้นหลัง',
        en: '<code>[fullScreen]="true"</code> with <code>[(visible)]</code> opens a full-screen layer (a dialog: focus stays inside and the page behind cannot be pressed). The × button, <code>Esc</code> or a click on the backdrop close it, and focus returns to the button that opened it · set <code>activeIndex</code> before opening to start at the photo pressed · <code>maskClass</code> styles the backdrop.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-galleria&gt;</code> เป็น <code>&lt;wu-galleria&gt;</code> input, template และ method ชื่อเดิม (<code>pTemplate="item"</code> ใช้ต่อได้) class <code>p-galleria-*</code> อยู่คู่กับ class <code>wu-galleria-*</code> · <code>baseZIndex</code> และ <code>transitionOptions</code> รับไว้แต่ไม่มีผล (ชั้นเต็มจออยู่ใน top layer)',
        en: 'Change <code>&lt;p-galleria&gt;</code> to <code>&lt;wu-galleria&gt;</code>; inputs, templates and methods keep their names (<code>pTemplate="item"</code> keeps working), and the <code>p-galleria-*</code> classes sit next to the <code>wu-galleria-*</code> ones · <code>baseZIndex</code> and <code>transitionOptions</code> are accepted and ignored (the full-screen layer is in the top layer).',
      },
    },
  },
  code: {
    basic: `<wu-galleria [value]="photos" [numVisible]="4" [(activeIndex)]="photoIndex" [containerStyle]="{ maxWidth: '40rem' }">
  <ng-template #item let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-photo" />
  </ng-template>
  <ng-template #thumbnail let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-thumb" />
  </ng-template>
</wu-galleria>`,
    indicators: `<wu-galleria [value]="photos" [showThumbnails]="false" [showIndicators]="true" [showIndicatorsOnItem]="true"
  [showItemNavigators]="true" [circular]="true" [containerStyle]="{ maxWidth: '40rem' }">
  <ng-template #item let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-photo" />
  </ng-template>
</wu-galleria>`,
    caption: `<wu-galleria [value]="photos" [showThumbnails]="false" [showItemNavigators]="true" [showItemNavigatorsOnHover]="true"
  [showIndicators]="true" [containerStyle]="{ maxWidth: '40rem' }">
  <ng-template #header>
    <h3 class="gallery-title">ภาพกิจกรรม</h3>
  </ng-template>
  <ng-template #item let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-photo" />
  </ng-template>
  <ng-template #caption let-photo>
    <b>{{ photo.title }}</b>
    <p>{{ photo.text }}</p>
  </ng-template>
</wu-galleria>`,
    position: `<wu-galleria [value]="photos" [numVisible]="4" [responsiveOptions]="responsiveOptions" thumbnailsPosition="left"
  verticalThumbnailViewPortHeight="280px" [containerStyle]="{ maxWidth: '40rem' }">
  <ng-template #item let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-photo" />
  </ng-template>
  <ng-template #thumbnail let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-thumb" />
  </ng-template>
</wu-galleria>`,
    autoplay: `<wu-galleria #slides [value]="photos" [showThumbnails]="false" [showIndicators]="true" [autoPlay]="true"
  [circular]="true" [transitionInterval]="3000" [containerStyle]="{ maxWidth: '40rem' }">
  <ng-template #item let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-photo" />
  </ng-template>
</wu-galleria>
<wu-button label="เล่นสไลด์" icon="wi wi-refresh" severity="secondary" (onClick)="slides.startSlideShow()"></wu-button>
<wu-button label="หยุด" icon="wi wi-times" severity="secondary" [outlined]="true" (onClick)="slides.stopSlideShow()"></wu-button>`,
    fullscreen: {
      v3: `<div class="photo-grid">
  @for (photo of photos; track photo.src; let i = $index) {
    <button type="button" class="photo-button" (click)="openPhoto(i)">
      <img [src]="photo.src" [alt]="photo.alt" />
    </button>
  }
</div>
<wu-galleria [value]="photos" [fullScreen]="true" [(visible)]="galleryOpen" [(activeIndex)]="photoIndex"
  [showThumbnails]="false" [showItemNavigators]="true" [circular]="true">
  <ng-template #item let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-full" />
  </ng-template>
</wu-galleria>`,
      classic: `<div class="photo-grid">
  <button *ngFor="let photo of photos; let i = index" type="button" class="photo-button" (click)="openPhoto(i)">
    <img [src]="photo.src" [alt]="photo.alt" />
  </button>
</div>
<wu-galleria [value]="photos" [fullScreen]="true" [(visible)]="galleryOpen" [(activeIndex)]="photoIndex"
  [showThumbnails]="false" [showItemNavigators]="true" [circular]="true">
  <ng-template wuTemplate="item" let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-full" />
  </ng-template>
</wu-galleria>`,
    },
  },
  ts: {
    basic: `${PHOTOS_TS}
photoIndex = 0;`,
    position: `import { WuGalleriaResponsiveOptions } from 'wiraui/galleria';

responsiveOptions: WuGalleriaResponsiveOptions[] = [
  { breakpoint: '768px', numVisible: 2 },   // จอกว้างไม่เกิน 768px: รูปย่อ 2 รูป
];`,
    fullscreen: `galleryOpen = false;
photoIndex = 0;

/** เปิดที่รูปที่กด */
openPhoto(index: number): void {
  this.photoIndex = index;
  this.galleryOpen = true;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'any[]', undefined, 'รายการรูป', 'The photos'),
        row('activeIndex', 'number', '0', 'รูปที่แสดง (สองทาง [(activeIndex)])', 'The photo on show (two-way [(activeIndex)])'),
        row('numVisible', 'number', '3', 'จำนวนรูปย่อที่เห็น', 'Thumbnails in view'),
        row('responsiveOptions', 'WuGalleriaResponsiveOptions[]', undefined, 'จำนวนรูปย่อตามความกว้างหน้าต่าง', 'Thumbnails by window width'),
        row('showThumbnails · showThumbnailNavigators', BOOL, 'true · true', 'แถบรูปย่อและลูกศรของแถบ', 'The thumbnail strip and its arrows'),
        row('showIndicators · showIndicatorsOnItem · changeItemOnIndicatorHover', BOOL, 'false', 'จุดบอกตำแหน่ง วางบนรูป และเปลี่ยนรูปเมื่อชี้', 'Dots, on the photo, and change on hover'),
        row('showItemNavigators · showItemNavigatorsOnHover', BOOL, 'false', 'ลูกศรบนรูป และแสดงเมื่อชี้เท่านั้น', 'Arrows on the photo, and only on hover'),
        row('circular', BOOL, 'false', 'วนจากรูปสุดท้ายไปรูปแรก', 'Wrap from the last photo to the first'),
        row('autoPlay · transitionInterval', 'boolean · number', 'false · 4000', 'เลื่อนเองและเวลาต่อรูป (มิลลิวินาที)', 'Play by itself, and the time per photo (ms)'),
        row('thumbnailsPosition · indicatorsPosition', "'bottom' | 'top' | 'left' | 'right'", "'bottom'", 'ตำแหน่งรูปย่อ / จุด', 'Where the thumbnails / dots go'),
        row('verticalThumbnailViewPortHeight', 'string', "'300px'", 'ความสูงของแถบรูปย่อเมื่ออยู่ด้านข้าง', 'Height of the thumbnail strip at the side'),
        row('fullScreen · visible', BOOL, 'false', 'ชั้นเต็มจอ เปิดด้วย [(visible)]', 'Full-screen layer, opened with [(visible)]'),
        row('containerStyle · containerClass · maskClass', 'object · string · string', undefined, 'แต่งกรอบนอกและพื้นหลังเต็มจอ', 'Style the frame and the full-screen backdrop'),
        STYLE_ROW,
        row('baseZIndex · transitionOptions · showTransitionOptions · hideTransitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('activeIndexChange', 'number', undefined, 'คู่ของ [(activeIndex)]', 'For [(activeIndex)]'),
        row('visibleChange', 'boolean', undefined, 'คู่ของ [(visible)] (ปิดชั้นเต็มจอ)', 'For [(visible)] (the full-screen layer closed)'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wuTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wuTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (photo) · index', undefined, 'รูปใหญ่', 'The big photo'),
        row('thumbnail', '$implicit (photo) · index', undefined, 'รูปย่อ', 'A thumbnail'),
        row('caption', '$implicit (photo)', undefined, 'คำบรรยายบนรูป', 'The caption on the photo'),
        row('indicator', '$implicit (index)', undefined, 'แต่ละจุด', 'Each dot'),
        row('header · footer', '—', undefined, 'เหนือ / ใต้ทั้งชุด', 'Above / below the gallery'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [
        row('startSlideShow() · stopSlideShow()', 'void', undefined, 'เริ่ม / หยุดเล่นสไลด์', 'Start / stop the slide show'),
        row('isAutoPlayActive()', 'boolean', undefined, 'กำลังเล่นอยู่หรือไม่', 'Whether it is playing'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuGalleriaResponsiveOptions {
  breakpoint: string;   // '768px': ใช้เมื่อหน้าต่างกว้างไม่เกินนี้
  numVisible: number;
}`,
    },
  ],
  tokens: [
    tok('--wu-galleria-radius', 'ความมนของรูป', 'Photo radius'),
    tok('--wu-galleria-nav-size', 'ขนาดลูกศร', 'Arrow size'),
    tok('--wu-galleria-indicator-size', 'ขนาดจุด', 'Dot size'),
    tok('--wu-galleria-indicator-bg', 'สีจุด', 'Dot colour'),
    tok('--wu-galleria-indicator-active-bg', 'สีจุดของรูปปัจจุบัน', 'Colour of the current dot'),
    tok('--wu-galleria-thumbnail-gap', 'ระยะระหว่างรูปย่อ', 'Gap between thumbnails'),
    tok('--wu-galleria-thumbnail-radius', 'ความมนของรูปย่อ', 'Thumbnail radius'),
  ],
};
