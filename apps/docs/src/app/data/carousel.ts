import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

/** The news the Carousel demos show (pictures from the docs' own samples). */
export const CAROUSEL_NEWS = [
  { id: 1, title: 'วันกีฬาสี', text: 'ขบวนพาเหรดและการแข่งขันวิ่งผลัด', image: 'samples/gallery-sports.svg', tag: 'กิจกรรม' },
  { id: 2, title: 'งานวันวิทยาศาสตร์', text: 'นิทรรศการโครงงานของนักเรียน ม.ต้น', image: 'samples/gallery-science.svg', tag: 'วิชาการ' },
  { id: 3, title: 'ห้องสมุดเปิดมุมใหม่', text: 'มุมอ่านหนังสือชั้นสองเปิดทุกวัน', image: 'samples/gallery-library.svg', tag: 'ประกาศ' },
  { id: 4, title: 'ซ้อมดนตรีไทย', text: 'วงดนตรีไทยซ้อมก่อนงานไหว้ครู', image: 'samples/gallery-music.svg', tag: 'กิจกรรม' },
  { id: 5, title: 'แปลงผักชุมนุมเกษตร', text: 'เก็บผักชุดแรกของภาคเรียน', image: 'samples/gallery-garden.svg', tag: 'ชุมนุม' },
  { id: 6, title: 'รับสมัครนักเรียนใหม่', text: 'เปิดรับสมัครชั้น ม.1 และ ม.4', image: 'samples/school-large.svg', tag: 'รับสมัคร' },
];

const NEWS_TS = `news = [
  { id: 1, title: 'วันกีฬาสี', text: 'ขบวนพาเหรดและการแข่งขันวิ่งผลัด', image: 'photos/sports.jpg', tag: 'กิจกรรม' },
  { id: 2, title: 'งานวันวิทยาศาสตร์', text: 'นิทรรศการโครงงานของนักเรียน ม.ต้น', image: 'photos/science.jpg', tag: 'วิชาการ' },
  // … ข่าวจาก API
];`;

const CARD = `  <ng-template #item let-news>
    <article class="news-card">
      <img [src]="news.image" [alt]="news.title" />
      <wt-tag [value]="news.tag"></wt-tag>
      <h3>{{ news.title }}</h3>
      <p>{{ news.text }}</p>
    </article>
  </ng-template>`;

export const CAROUSEL_DOC: ComponentDoc = {
  id: 'carousel',
  title: 'Carousel',
  group: 'Media',
  entry: 'carousel',
  standalone: 'WtCarousel',
  module: 'WtCarouselModule',
  selector: 'wt-carousel',
  description: {
    th: 'แสดงรายการทีละหลายชิ้นในแถวที่เลื่อนได้ เช่น ข่าวประชาสัมพันธ์ ผลงาน หรือสินค้า มีลูกศรและแถบบอกหน้า เปลี่ยนจำนวนที่เห็นตามความกว้างจอ เลื่อนเองได้ วนกลับได้ ปัดบนจอสัมผัสได้ และวางแนวตั้งได้',
    en: 'Shows a few items at a time in a row that slides, such as news, work or products, with arrows and page bars. It shows fewer items on narrower screens, can play by itself and wrap around, takes swipes, and can run vertically.',
  },
  english: {
    'วันกีฬาสี': 'Sports day',
    'ขบวนพาเหรดและการแข่งขันวิ่งผลัด': 'The parade and the relay races',
    'งานวันวิทยาศาสตร์': 'Science day',
    'นิทรรศการโครงงานของนักเรียน ม.ต้น': 'Lower-secondary project fair',
    'ห้องสมุดเปิดมุมใหม่': 'A new library corner',
    'มุมอ่านหนังสือชั้นสองเปิดทุกวัน': 'The reading corner upstairs opens every day',
    'ซ้อมดนตรีไทย': 'Thai music rehearsal',
    'วงดนตรีไทยซ้อมก่อนงานไหว้ครู': 'The Thai music band rehearses for Teachers’ Day',
    'แปลงผักชุมนุมเกษตร': 'The farm club’s vegetable beds',
    'เก็บผักชุดแรกของภาคเรียน': 'The first harvest of the term',
    'รับสมัครนักเรียนใหม่': 'Admissions open',
    'เปิดรับสมัครชั้น ม.1 และ ม.4': 'Applications for grades 7 and 10',
    'กิจกรรม': 'Activity',
    'วิชาการ': 'Academic',
    'ประกาศ': 'Notice',
    'ชุมนุม': 'Club',
    'รับสมัคร': 'Admissions',
    'ข่าวประชาสัมพันธ์': 'School news',
    'ดูข่าวทั้งหมด': 'See all news',
    'ข่าวจาก API': 'news from the API',
    'หน้าที่': 'Page',
    'หน้าแรก': 'First page',
    'หน้าสุดท้าย': 'Last page',
    'ข่าวก่อนหน้า': 'Previous news',
    'ข่าวถัดไป': 'Next news',
    'จอกว้างไม่เกิน 1024px เห็น 2 ชิ้น ไม่เกิน 640px เห็น 1 ชิ้น': 'up to 1024px wide: 2 items; up to 640px: 1',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtCarouselModule</code> มี <code>wtTemplate</code>, <code>&lt;wt-header&gt;</code> และ <code>&lt;wt-footer&gt;</code> ให้ด้วย) และ standalone (<code>WtCarousel</code>)',
        en: 'Works as an NgModule (<code>WtCarouselModule</code>, which brings <code>wtTemplate</code>, <code>&lt;wt-header&gt;</code> and <code>&lt;wt-footer&gt;</code>) or standalone (<code>WtCarousel</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[value]</code> คือรายการทั้งหมด และ template <code>item</code> วาดแต่ละชิ้น (ได้ <code>let-item</code> และ <code>let-index="index"</code>) · <code>[numVisible]</code> คือจำนวนชิ้นที่เห็นพร้อมกัน และ <code>[numScroll]</code> คือจำนวนที่เลื่อนต่อครั้ง (ค่าเริ่มต้น 1 ทั้งคู่) · ลูกศรสองข้างและแถบด้านล่างเปลี่ยนหน้า แถบมีเท่าจำนวนหน้า · <code>[responsiveOptions]</code> เปลี่ยนจำนวนเมื่อจอแคบลง: <code>{ breakpoint, numVisible, numScroll }</code> แต่ละข้อใช้เมื่อกว้างเท่ากับหรือน้อยกว่า <code>breakpoint</code> ตัวอย่างนี้เห็น 3 ชิ้น 2 ชิ้นบนจอกลาง และ 1 ชิ้นบนมือถือ',
        en: '<code>[value]</code> holds the items and the <code>item</code> template draws each one (it gets <code>let-item</code> and <code>let-index="index"</code>) · <code>[numVisible]</code> is how many show at once and <code>[numScroll]</code> how many each move goes by (1 for both by default) · the arrows and the bars underneath change page, one bar per page · <code>[responsiveOptions]</code> changes the numbers on narrower screens: each <code>{ breakpoint, numVisible, numScroll }</code> applies at or below its <code>breakpoint</code>; this demo shows 3 items, 2 on mid-size screens and 1 on phones.',
      },
    },
    circular: {
      title: { th: 'วนรอบและเล่นเอง', en: 'Circular and autoplay' },
      text: {
        th: '<code>[circular]="true"</code> ต่อจากหน้าสุดท้ายเป็นหน้าแรก (ต้องมีรายการมากกว่าที่เห็นได้) · <code>[autoplayInterval]</code> เป็นมิลลิวินาทีระหว่างหน้า (0 = ไม่เล่นเอง) เล่นเองแบบวนรอบ หยุดชั่วคราวเมื่อชี้หรือโฟกัสอยู่ และหยุดถาวรเมื่อผู้ใช้กดเปลี่ยนหน้าเอง · ผู้ใช้ที่ตั้งลดการเคลื่อนไหวเห็นการเปลี่ยนหน้าทันทีไม่มีสไลด์',
        en: '<code>[circular]="true"</code> goes from the last page to the first (it needs more items than fit) · <code>[autoplayInterval]</code> is the milliseconds between pages (0 = no autoplay); it plays round and round, pauses while hovered or focused, and stops for good once the user changes page · people who ask for reduced motion get the change without the slide.',
      },
    },
    vertical: {
      title: { th: 'แนวตั้ง', en: 'Vertical' },
      text: {
        th: '<code>orientation="vertical"</code> เลื่อนขึ้นลง ลูกศรอยู่บนและล่าง และ <code>verticalViewPortHeight</code> กำหนดความสูงของช่องที่เห็น (ค่าเริ่มต้น <code>\'300px\'</code>) · เหมาะกับข่าวสั้นด้านข้างหน้า',
        en: '<code>orientation="vertical"</code> slides up and down with the arrows above and below, and <code>verticalViewPortHeight</code> sets the height of the window (<code>\'300px\'</code> by default) · for short news at the side of a page.',
      },
    },
    page: {
      title: { th: 'หน้าปัจจุบัน', en: 'The current page' },
      text: {
        th: '<code>[(page)]</code> ผูกหน้าที่เห็น (เริ่มที่ 0) ตั้งจากโค้ดได้ และ <code>(onPage)</code> บอก <code>{ page }</code> ทุกครั้งที่หน้าเปลี่ยน',
        en: '<code>[(page)]</code> binds the page in view (0 first) and can be set from code; <code>(onPage)</code> tells <code>{ page }</code> each time the page changes.',
      },
    },
    templates: {
      title: { th: 'Template และปุ่ม', en: 'Templates and buttons' },
      text: {
        th: 'template <code>header</code> / <code>footer</code> (หรือ <code>&lt;wt-header&gt;</code> / <code>&lt;wt-footer&gt;</code>) วางเหนือและใต้แถบ · <code>previousicon</code> / <code>nexticon</code> วาดไอคอนลูกศรเอง หรือใช้ <code>prevButtonProps</code> / <code>nextButtonProps</code> ใส่ <code>icon</code> และ <code>ariaLabel</code> · <code>[showNavigators]="false"</code> / <code>[showIndicators]="false"</code> ซ่อนลูกศร / แถบ · <code>contentClass</code>, <code>indicatorsContentClass</code>, <code>indicatorStyleClass</code> และ <code>indicatorStyle</code> แต่งแต่ละส่วน',
        en: 'The <code>header</code> / <code>footer</code> templates (or <code>&lt;wt-header&gt;</code> / <code>&lt;wt-footer&gt;</code>) sit above and below · <code>previousicon</code> / <code>nexticon</code> draw the arrows, or <code>prevButtonProps</code> / <code>nextButtonProps</code> set an <code>icon</code> and an <code>ariaLabel</code> · <code>[showNavigators]="false"</code> / <code>[showIndicators]="false"</code> hide the arrows / bars · <code>contentClass</code>, <code>indicatorsContentClass</code>, <code>indicatorStyleClass</code> and <code>indicatorStyle</code> style each part.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด มือถือ และ ARIA', en: 'Keyboard, touch and ARIA' },
      text: {
        th: 'ปัดซ้ายขวา (หรือขึ้นลงในแนวตั้ง) บนจอสัมผัสเพื่อเปลี่ยนหน้า · แถบบอกหน้าเป็นจุด Tab จุดเดียว ใช้ <code>←</code> <code>→</code> <code>Home</code> <code>End</code> เลื่อนระหว่างแถบ แล้ว <code>Enter</code> / <code>Space</code> ไปหน้านั้น · ทั้งชุดเป็น <code>role="region"</code> ที่บอกว่าเป็นภาพสไลด์ แต่ละชิ้นบอกลำดับ (“รายการที่ 2 จาก 6”) ชิ้นที่ไม่อยู่ในหน้าจอถูกซ่อนจากโปรแกรมอ่านจอ และเมื่อเล่นเองจะไม่อ่านทุกครั้งที่เปลี่ยน',
        en: 'Swipe sideways (or up and down when vertical) on a touch screen to change page · the page bars are one Tab stop: <code>←</code> <code>→</code> <code>Home</code> <code>End</code> move along them, <code>Enter</code> / <code>Space</code> go to that page · the whole thing is a <code>role="region"</code> announced as a carousel, each item tells its place (“slide 2 of 6”), items out of view are hidden from screen readers, and autoplay does not announce every change.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-carousel&gt;</code> เป็น <code>&lt;wt-carousel&gt;</code> input และ event ใช้ชื่อเดิมทั้งหมด (<code>value</code>, <code>page</code>, <code>numVisible</code>, <code>numScroll</code>, <code>responsiveOptions</code>, <code>orientation</code>, <code>verticalViewPortHeight</code>, <code>circular</code>, <code>autoplayInterval</code>, <code>showIndicators</code>, <code>showNavigators</code>, <code>onPage</code>) และ <code>pTemplate="item"</code> / <code>header</code> / <code>footer</code> ใช้ได้เหมือนเดิม',
        en: 'Change <code>&lt;p-carousel&gt;</code> to <code>&lt;wt-carousel&gt;</code>; every input and event keeps its name (<code>value</code>, <code>page</code>, <code>numVisible</code>, <code>numScroll</code>, <code>responsiveOptions</code>, <code>orientation</code>, <code>verticalViewPortHeight</code>, <code>circular</code>, <code>autoplayInterval</code>, <code>showIndicators</code>, <code>showNavigators</code>, <code>onPage</code>), and <code>pTemplate="item"</code> / <code>header</code> / <code>footer</code> keep working.',
      },
    },
  },
  code: {
    basic: `<wt-carousel [value]="news" [numVisible]="3" [numScroll]="1" [responsiveOptions]="responsiveOptions">
${CARD}
</wt-carousel>`,
    circular: `<wt-carousel [value]="news" [numVisible]="3" [numScroll]="1" [circular]="true" [autoplayInterval]="3000"
  [responsiveOptions]="responsiveOptions">
${CARD}
</wt-carousel>`,
    vertical: `<wt-carousel [value]="news" orientation="vertical" verticalViewPortHeight="320px" [style]="{ maxWidth: '24rem' }">
${CARD}
</wt-carousel>`,
    page: {
      v3: `<wt-carousel [value]="news" [numVisible]="2" [numScroll]="2" [(page)]="page" (onPage)="paged($event)">
${CARD}
</wt-carousel>
<wt-button label="หน้าแรก" icon="wi wi-angle-double-left" severity="secondary" [outlined]="true" (onClick)="page = 0"></wt-button>
<wt-button label="หน้าสุดท้าย" icon="wi wi-angle-double-right" iconPos="right" severity="secondary" [outlined]="true" (onClick)="page = 2"></wt-button>
@if (lastPage !== null) {
  <span>onPage: {{ lastPage }}</span>
}`,
      classic: `<wt-carousel [value]="news" [numVisible]="2" [numScroll]="2" [(page)]="page" (onPage)="paged($event)">
${CARD.replace('<ng-template #item', '<ng-template wtTemplate="item"')}
</wt-carousel>
<wt-button label="หน้าแรก" icon="wi wi-angle-double-left" severity="secondary" [outlined]="true" (onClick)="page = 0"></wt-button>
<wt-button label="หน้าสุดท้าย" icon="wi wi-angle-double-right" iconPos="right" severity="secondary" [outlined]="true" (onClick)="page = 2"></wt-button>
<span *ngIf="lastPage !== null">onPage: {{ lastPage }}</span>`,
    },
    templates: `<wt-carousel [value]="news" [numVisible]="3" [numScroll]="3" [responsiveOptions]="responsiveOptions"
  [prevButtonProps]="{ icon: 'wi wi-arrow-left', ariaLabel: 'ข่าวก่อนหน้า' }"
  [nextButtonProps]="{ icon: 'wi wi-arrow-right', ariaLabel: 'ข่าวถัดไป' }">
  <ng-template #header>
    <h2>ข่าวประชาสัมพันธ์</h2>
  </ng-template>
${CARD}
  <ng-template #footer>
    <wt-button label="ดูข่าวทั้งหมด" icon="wi wi-arrow-right" iconPos="right" [text]="true" (onClick)="openNews()"></wt-button>
  </ng-template>
</wt-carousel>`,
  },
  ts: {
    basic: NEWS_TS + `

responsiveOptions = [
  { breakpoint: '1024px', numVisible: 2, numScroll: 1 },   // จอกว้างไม่เกิน 1024px เห็น 2 ชิ้น ไม่เกิน 640px เห็น 1 ชิ้น
  { breakpoint: '640px', numVisible: 1, numScroll: 1 },
];`,
    page: `page = 0;
lastPage: number | null = null;

paged(event: { page: number }): void {
  this.lastPage = event.page;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'any[]', '[]', 'รายการทั้งหมด', 'The items'),
        row('page', 'number', '0', 'หน้าที่เห็น เริ่มที่ 0 (สองทาง [(page)])', 'The page in view, 0 first (two-way [(page)])'),
        row('numVisible', 'number', '1', 'จำนวนชิ้นที่เห็นพร้อมกัน', 'Items in view at once'),
        row('numScroll', 'number', '1', 'จำนวนชิ้นที่เลื่อนต่อครั้ง', 'Items each move goes by'),
        row('responsiveOptions', 'CarouselResponsiveOptions[]', undefined, "จำนวนที่เห็นเมื่อจอแคบลง [{ breakpoint: '768px', numVisible: 1, numScroll: 1 }]", "Numbers for narrower screens: [{ breakpoint: '768px', numVisible: 1, numScroll: 1 }]"),
        row('orientation', "'horizontal' | 'vertical'", "'horizontal'", 'เลื่อนแนวนอนหรือแนวตั้ง', 'Slide sideways or up and down'),
        row('verticalViewPortHeight', 'string', "'300px'", 'ความสูงของช่องที่เห็นในแนวตั้ง', 'Height of the window when vertical'),
        row('circular', BOOL, 'false', 'ต่อจากหน้าสุดท้ายเป็นหน้าแรก', 'Wrap from the last page to the first'),
        row('autoplayInterval', 'number', '0', 'มิลลิวินาทีระหว่างหน้าเมื่อเล่นเอง (0 = ไม่เล่น)', 'Milliseconds between pages when playing (0: off)'),
        row('showIndicators · showNavigators', BOOL, 'true', 'แสดงแถบบอกหน้า · ลูกศร', 'Show the page bars · the arrows'),
        row('prevButtonProps · nextButtonProps', '{ icon?, ariaLabel?, styleClass? }', undefined, 'ไอคอนและชื่อของปุ่มลูกศร', 'Icon and name of the arrow buttons'),
        row('contentClass · indicatorsContentClass · indicatorStyleClass', 'string', undefined, 'class ของส่วนรายการ แถวแถบ และแต่ละแถบ', 'Classes of the items part, the bar row and each bar'),
        row('indicatorsContentStyle · indicatorStyle', 'object', undefined, 'style ของแถวแถบ และแต่ละแถบ', 'Styles of the bar row and each bar'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onPage', '{ page: number }', undefined, 'หน้าที่เห็นเปลี่ยน', 'The page in view changed'),
        row('pageChange', 'number', undefined, 'สำหรับ [(page)]', 'For [(page)]'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #item, wtTemplate="item" หรือ pTemplate="item" ก็ได้ · header / footer ใช้ <wt-header> / <wt-footer> แทนได้',
        en: 'Write them as #item, wtTemplate="item" or pTemplate="item" · header / footer can be <wt-header> / <wt-footer> instead.',
      },
      rows: [
        row('item', '$implicit (item), index', undefined, 'แต่ละชิ้น', 'Each item'),
        row('header · footer', '—', undefined, 'เหนือและใต้แถบ', 'Above and below the carousel'),
        row('previousicon · nexticon', '—', undefined, 'ไอคอนในปุ่มลูกศร', 'Icons inside the arrow buttons'),
      ],
    },
  ],
  tokens: [
    tok('--wt-carousel-content-gap', 'ระยะระหว่างลูกศรกับรายการ', 'Gap between the arrows and the items'),
    tok('--wt-carousel-nav-size', 'ขนาดปุ่มลูกศร', 'Arrow button size'),
    tok('--wt-carousel-nav-color', 'สีลูกศร', 'Arrow colour'),
    tok('--wt-carousel-nav-hover-bg', 'พื้นปุ่มลูกศรเมื่อชี้', 'Arrow button background on hover'),
    tok('--wt-carousel-nav-hover-color', 'สีลูกศรเมื่อชี้', 'Arrow colour on hover'),
    tok('--wt-carousel-indicator-list-padding', 'ระยะรอบแถวแถบบอกหน้า', 'Padding around the bar row'),
    tok('--wt-carousel-indicator-gap', 'ระยะระหว่างแถบ', 'Gap between bars'),
    tok('--wt-carousel-indicator-width', 'ความกว้างของแถบ', 'Bar width'),
    tok('--wt-carousel-indicator-height', 'ความสูงของแถบ', 'Bar height'),
    tok('--wt-carousel-indicator-radius', 'มุมโค้งของแถบ', 'Bar corner radius'),
    tok('--wt-carousel-indicator-bg', 'สีแถบ', 'Bar colour'),
    tok('--wt-carousel-indicator-hover-bg', 'สีแถบเมื่อชี้', 'Bar colour on hover'),
    tok('--wt-carousel-indicator-active-bg', 'สีแถบของหน้าปัจจุบัน', 'Bar colour of the current page'),
    tok('--wt-carousel-transition-duration', 'เวลาของการเลื่อน', 'Slide duration'),
  ],
};
