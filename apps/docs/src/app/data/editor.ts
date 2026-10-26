import { ApiRow, ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/** The tool names the toolbar takes, with what each does (the Properties tab and the toolbar section list them). */
export const EDITOR_TOOL_ROWS: ApiRow[] = [
  row('undo · redo', 'tool', undefined, 'เลิกทำ / ทำซ้ำ', 'Undo / redo'),
  row('heading · fontSize · fontFamily', 'tool', undefined, 'เมนูรูปแบบย่อหน้า (ย่อหน้า หัวข้อ 1–6 ข้อความอ้างอิง บล็อกโค้ด) ขนาด และแบบตัวอักษร', 'Block style menu (paragraph, Heading 1–6, Blockquote, Code block), size and font menus'),
  row('bold · italic · underline · strike · subscript · superscript · code', 'tool', undefined, 'รูปแบบตัวอักษร', 'Text styles'),
  row('color · highlight', 'tool', undefined, 'สีตัวอักษรและสีพื้นหลังข้อความ', 'Text colour and highlight'),
  row('bulletList · orderedList · indent · outdent', 'tool', undefined, 'รายการและการเยื้อง', 'Lists and indent'),
  row('align · alignLeft · alignCenter · alignRight · alignJustify', 'tool', undefined, 'จัดแนว (เมนูเดียว หรือปุ่มแยก)', 'Alignment (one menu, or separate buttons)'),
  row('link · image · table · blockquote · codeBlock · hr', 'tool', undefined, 'ลิงก์ รูป ตาราง ข้อความอ้างอิง บล็อกโค้ด และเส้นคั่น', 'Links, pictures, tables, quotes, code blocks and rules'),
  row('clear · source · fullscreen', 'tool', undefined, 'ล้างรูปแบบ ดูโค้ด HTML และเต็มจอ (Esc ออก)', 'Clear formatting, the HTML source and full screen (Esc leaves)'),
];

const HEADER_TEMPLATE = `<wt-editor name="policy" [(ngModel)]="policy" [style]="{ height: '320px' }">
  <ng-template #header>
    <span class="ql-formats">
      <select class="ql-size"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <select class="ql-header">
        <option value="1"></option>
        <option value="2"></option>
        <option selected></option>
      </select>
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <select class="ql-align">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
      </select>
    </span>
    <span class="ql-formats">
      <button class="ql-blockquote"></button>
      <button class="ql-link"></button>
      <button class="ql-clean"></button>
    </span>
  </ng-template>
</wt-editor>`;

export const EDITOR_DOC: ComponentDoc = {
  id: 'editor',
  title: 'Editor',
  group: 'Form',
  entry: 'editor',
  standalone: 'WtEditor',
  module: 'WtEditorModule',
  forms: true,
  selector: 'wt-editor',
  description: {
    th: 'ช่องพิมพ์ข้อความแบบจัดรูปแบบได้ ค่าเป็น HTML ผูกด้วย ngModel มีแถบเครื่องมือหลายชุด ตาราง ลิงก์ รูปภาพ (ฝังในเนื้อหาหรืออัปโหลด) วางจาก Word ได้โดยไม่เละ และแสดงเนื้อหาที่บันทึกไว้ด้วยหน้าตาเดียวกัน',
    en: 'A rich-text field whose value is HTML, bound with ngModel. It has toolbar presets, tables, links and pictures (embedded or uploaded), cleans what is pasted from Word, and shows saved content with the same look.',
  },
  english: {
    'โรงเรียนเปิดรับสมัครนักเรียน': 'Applications are now open',
    'ปีการศึกษา 2569': 'for the 2026 school year',
    'พิมพ์เนื้อหาข่าว': 'Write the news',
    'เนื้อหาข่าว': 'News text',
    'ประกาศ': 'Notice',
    'นโยบายการใช้ข้อมูลส่วนบุคคล': 'Privacy policy',
    'โรงเรียนเก็บข้อมูลเท่าที่จำเป็นต่อการเรียนการสอน': 'The school keeps only the data teaching needs',
    'จัดกิจกรรมวันไหว้ครู': 'Teachers’ Day ceremony',
    'วันพฤหัสบดีที่ 18 มิถุนายน': 'Thursday 18 June',
    'แต่งกายชุดนักเรียน': 'Wear school uniform',
    'นำพานไหว้ครูของห้อง': 'Bring the class offering',
    'ห้อง': 'Class',
    'จำนวน': 'Students',
    'ตารางสอบกลางภาค': 'Midterm timetable',
    'วิชา': 'Subject',
    'วันสอบ': 'Date',
    'คณิตศาสตร์': 'Math',
    'วิทยาศาสตร์': 'Science',
    'จันทร์ 6 ก.ค.': 'Mon 6 Jul',
    'อังคาร 7 ก.ค.': 'Tue 7 Jul',
    'เรียน ผู้ปกครอง': 'Dear parents',
    'ขอเชิญประชุมผู้ปกครองวันเสาร์นี้ เวลา 9.00 น.': 'You are invited to the parents’ meeting this Saturday at 9 am.',
    'ใส่จดหมายตัวอย่าง': 'Insert a sample letter',
    'ไปที่เนื้อหา': 'Focus the text',
    'ข่าวจาก API': 'news from the API',
    'จาก API': 'from the API',
    'ว่างเปล่าคือ null': 'null when empty',
    'ย่อหน้า': 'paragraph',
    'รูปอัปโหลดแล้ว': 'Image uploaded',
    'ได้ URL ของรูปกลับมา': 'resolves with the picture URL',
    'ทั้งแอป: ทุก wt-editor ใช้ค่านี้': 'the whole app: every wt-editor uses these',
    'ล่าสุด': 'Last event',
    'โหมด': 'Mode',
    'อัปโหลดไปที่ url: ไฟล์ส่งเป็น multipart แล้วอ่าน URL จากคำตอบ': 'upload to a url: the file goes as multipart and the URL is read from the answer',
    'app.config.ts หรือ providers ของ AppModule': 'app.config.ts or the AppModule providers',
    'ข้อความอ้างอิงอยู่ในเมนู ไม่มีบล็อกโค้ด': 'Blockquote in the menu, no Code block',
    'ห้องสอบ': 'Room',
    'ตามตารางที่ปรับความกว้างไว้': 'with the column widths set',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WtEditorModule</code> รวม <code>wt-editor</code>, <code>wtEditorContent</code> (แสดงเนื้อหาที่บันทึกไว้) และ <code>wtTemplate</code> ไว้แล้ว ถ้าเป็น standalone ให้ import <code>WtEditor</code> (กับ <code>WtEditorContent</code>) ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> ไม่ต้องติดตั้งไลบรารีอื่นเพิ่ม',
        en: '<code>WtEditorModule</code> brings <code>wt-editor</code>, <code>wtEditorContent</code> (for showing saved content) and <code>wtTemplate</code>. Standalone: import <code>WtEditor</code> (and <code>WtEditorContent</code>). Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>; nothing else needs installing.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ค่าเป็น HTML ผูกด้วย <code>[(ngModel)]</code> (<code>formControlName</code> ก็ได้) และเป็น <code>null</code> เมื่อลบข้อความหมด แอปจึงเช็ก <code>!newsBody</code> ได้เหมือนเดิม · <code>[style]="{ height: \'320px\' }"</code> คือความสูงของพื้นที่พิมพ์ · แถบเครื่องมือค่าเริ่มต้นคือชุด <code>standard</code> และติดอยู่ด้านบนเมื่อเลื่อนหน้า (<code>[stickyToolbar]="false"</code> ปิด) · <code>Ctrl</code> / <code>⌘</code> + <code>B</code> <code>I</code> <code>U</code> ตัวหนา เอียง ขีดเส้นใต้ · ปุ่มบันทึกใช้ <code>[loading]="isApiSaving"</code> และ <code>[disabled]="!newsBody"</code>',
        en: 'The value is HTML, bound with <code>[(ngModel)]</code> (<code>formControlName</code> works too), and <code>null</code> once all text is deleted, so apps can still test <code>!newsBody</code> · <code>[style]="{ height: \'320px\' }"</code> is the height of the writing area · the default toolbar is the <code>standard</code> set and sticks to the top while the page scrolls (<code>[stickyToolbar]="false"</code> turns that off) · <code>Ctrl</code> / <code>⌘</code> + <code>B</code> <code>I</code> <code>U</code> for bold, italic, underline · the save button uses <code>[loading]="isApiSaving"</code> and <code>[disabled]="!newsBody"</code>.',
      },
    },
    toolbar: {
      title: { th: 'ชุดแถบเครื่องมือและเลือกเครื่องมือเอง', en: 'Toolbar presets and your own list' },
      text: {
        th: '<code>toolbar</code> รับชื่อชุด <code>\'basic\'</code>, <code>\'standard\'</code> (ค่าเริ่มต้น), <code>\'full\'</code> หรือ <code>\'none\'</code> หรือรายชื่อเครื่องมือที่คั่นกลุ่มด้วย <code>\'|\'</code> (หรือ array ของกลุ่ม) ชื่อที่ไม่รู้จักถูกข้าม ลองสลับชุดด้านล่าง รายชื่อเครื่องมือทั้งหมดอยู่ในแท็บคุณสมบัติ',
        en: '<code>toolbar</code> takes a preset, <code>\'basic\'</code>, <code>\'standard\'</code> (default), <code>\'full\'</code> or <code>\'none\'</code>, or a list of tools with <code>\'|\'</code> between groups (or an array of groups); unknown names are skipped. Switch presets below; the Properties tab lists every tool.',
      },
    },
    options: {
      title: { th: 'ตั้งค่าเครื่องมือ', en: 'Tool options' },
      text: {
        th: '<code>[toolOptions]</code> ตั้งระดับหัวข้อที่เลือกได้ (<code>headings</code>: 0 คือย่อหน้า 1–6 คือหัวข้อ 1–6 ชื่อในเมนูเป็นภาษาของผู้อ่าน) รูปแบบอื่นท้ายเมนูเดียวกัน (<code>blocks</code>: ค่าเริ่มต้น <code>[\'blockquote\', \'codeBlock\']</code> คือข้อความอ้างอิงและบล็อกโค้ด ใส่ <code>[]</code> ถ้าไม่ต้องการ) ขนาดและแบบตัวอักษร ชุดสี สีพื้นหลัง การจัดแนวที่ให้เลือก ขนาดตารางในแผงแทรกตารางและค่าเริ่มต้นของแถวหัวตาราง และลิงก์ (เปิดแท็บใหม่ โปรโตคอลที่อนุญาตเพิ่ม) ลองเปิดเมนูหัวข้อ สี และตาราง',
        en: '<code>[toolOptions]</code> sets the heading levels on offer (<code>headings</code>: 0 is a paragraph, 1–6 Heading 1–6; the menu names come in the reader\'s language), the other block styles at the end of the same menu (<code>blocks</code>: by default <code>[\'blockquote\', \'codeBlock\']</code>, Blockquote and Code block; <code>[]</code> for none), font sizes and families, the text and highlight colours, the alignments, the grid of the insert-table panel and whether its header row starts ticked, and links (new tab, extra protocols). Open the heading, colour and table menus.',
      },
    },
    header: {
      title: { th: 'แถบเครื่องมือแบบเดิมของทีม', en: 'Your existing toolbar markup' },
      text: {
        th: 'template <code>header</code> ที่ template เดิมใช้อยู่ทำงานได้ทันที ปุ่ม <code>ql-*</code> ได้ไอคอนและคำสั่ง ส่วน select <code>ql-header</code>, <code>ql-size</code>, <code>ql-font</code>, <code>ql-color</code>, <code>ql-background</code> และ <code>ql-align</code> กลายเป็นเมนูตามค่าของ option ปุ่มที่ไม่รองรับ (เช่น <code>ql-video</code>) ถูกซ่อน ปุ่มที่ใช้งานอยู่มี class <code>ql-active</code>',
        en: 'The <code>header</code> template your existing templates use works as it is: <code>ql-*</code> buttons get icons and actions, and the <code>ql-header</code>, <code>ql-size</code>, <code>ql-font</code>, <code>ql-color</code>, <code>ql-background</code> and <code>ql-align</code> selects become menus built from their option values. Unsupported buttons (such as <code>ql-video</code>) are hidden, and active buttons get <code>ql-active</code>.',
      },
    },
    images: {
      title: { th: 'รูปภาพ', en: 'Pictures' },
      text: {
        th: 'ไม่ตั้งอะไรเลย รูปที่เลือก ลากมาวาง หรือวางจากคลิปบอร์ดถูกฝังเป็น base64 ในเนื้อหา · ตั้ง <code>[imageUpload]</code> เพื่ออัปโหลดแทน: <code>url</code> ส่งไฟล์เป็น multipart (field <code>file</code>) แล้วอ่าน URL จากคำตอบตาม <code>responseUrl</code> (เช่น <code>\'data.url\'</code>) หรือฟังก์ชัน <code>upload(file)</code> ของแอปที่คืน Promise ของ URL · ระหว่างอัปโหลดแสดงรูปจางไว้ก่อน และยังไม่อยู่ในค่าจนเสร็จ · <code>maxSize</code> / <code>accept</code> ตรวจไฟล์และแสดงข้อความ · กดที่รูปเพื่อเปิดเมนู (แทรกในบรรทัด ชิดซ้าย กึ่งกลาง ชิดขวา ความกว้าง 25–100 % คำอธิบายรูป ลบ) และลากมุมเพื่อปรับขนาด ตัวอย่างนี้ใช้ <code>upload</code> ที่จำลองการอัปโหลด หน้าเอกสารไม่ส่งไฟล์ไปไหน',
        en: 'With nothing set, pictures that are chosen, dropped or pasted are embedded in the content as base64 · set <code>[imageUpload]</code> to upload instead: <code>url</code> sends the file as multipart (field <code>file</code>) and reads the URL from the answer at <code>responseUrl</code> (such as <code>\'data.url\'</code>), or your own <code>upload(file)</code> returns a Promise of the URL · while uploading a faded picture shows, and it is not in the value until it is done · <code>maxSize</code> / <code>accept</code> check the files and show a message · click a picture for its menu (in line, left, centre, right, 25–100 % width, alternative text, remove) and drag its corner to resize. This example uses an <code>upload</code> that pretends to upload; the docs page sends nothing.',
      },
    },
    defaults: {
      title: { th: 'ค่าเริ่มต้นทั้งแอป', en: 'App-wide defaults' },
      text: {
        th: '<code>provideEditorOptions()</code> ตั้งแถบเครื่องมือ การตั้งค่าเครื่องมือ และการอัปโหลดรูปให้ทุก <code>wt-editor</code> ในครั้งเดียว ค่าที่ตั้งบน component ยังชนะ',
        en: '<code>provideEditorOptions()</code> sets the toolbar, tool options and picture upload for every <code>wt-editor</code> at once; what a component sets still wins.',
      },
    },
    tables: {
      title: { th: 'ตาราง', en: 'Tables' },
      text: {
        th: 'ปุ่มตารางเปิดแผงแทรกตาราง: ชี้หรือใช้ลูกศรบนตารางย่อเพื่อเลือกขนาด หรือพิมพ์จำนวนแถว / คอลัมน์ แล้วเลือกว่าจะมีแถวหัวตารางหรือไม่ก่อนกดแทรก · ตารางใหม่กว้างเต็มบรรทัด และคอลัมน์กว้างเท่ากันเป็น % จึงพอดีทุกจอ · ลากคร่อมเซลล์ (หรือ <code>Shift</code> + คลิก) เพื่อเลือกหลายเซลล์ แล้วกด "รวมเซลล์ที่เลือก" · ลากเส้นขอบคอลัมน์เพื่อปรับความกว้าง (เส้นขวาสุดปรับความกว้างของตาราง) · เมื่อเคอร์เซอร์อยู่ในตาราง แถบเครื่องมือตารางขึ้นมาที่ตาราง: แทรกแถวบน / ล่าง คอลัมน์ซ้าย / ขวา รวม / แยกเซลล์ แถวหัวตาราง และลบแถว / คอลัมน์ / ตาราง (ปุ่มตารางบนแถบหลักเปิดคำสั่งชุดเดียวกัน) การเพิ่มหรือลบแถวและคอลัมน์รักษาความกว้างที่ปรับไว้ · <code>Tab</code> / <code>Shift</code> + <code>Tab</code> ไปมาระหว่างเซลล์ และ <code>Tab</code> ที่เซลล์สุดท้ายเพิ่มแถว',
        en: 'The table tool opens the insert panel: point or use the arrows on the small grid to pick a size, or type the rows / columns, and choose whether it has a header row before inserting · new tables take the full width of the text, with even columns in %, so they fit any screen · drag across cells (or <code>Shift</code> + click) to pick several, then use "Merge selected cells" · drag a column\'s edge to resize it (the last edge resizes the table) · while the caret is in a table, a table toolbar appears at the table: rows above / below, columns left / right, merge / split cells, header row, and delete row / column / table (the table tool in the main toolbar opens the same commands); adding or removing rows and columns keeps the widths you set · <code>Tab</code> / <code>Shift</code> + <code>Tab</code> move between cells, and <code>Tab</code> in the last cell adds a row.',
      },
    },
    view: {
      title: { th: 'แสดงเนื้อหาที่บันทึกไว้', en: 'Showing saved content' },
      text: {
        th: '<code>&lt;div wtEditorContent [innerHTML]="announcement"&gt;</code> แสดง HTML ที่บันทึกด้วยหน้าตาเดียวกับในช่องพิมพ์ ทั้งหัวข้อ รายการ ข้อความอ้างอิง ตาราง รูป และ class เดิม <code>ql-align-*</code>, <code>ql-indent-*</code>, <code>ql-size-*</code>, <code>ql-font-*</code> ที่เนื้อหาเก่ามีอยู่ รายการจุดที่บันทึกเป็น <code>&lt;ol&gt;&lt;li data-list="bullet"&gt;</code> ก็แสดงเป็นจุด',
        en: '<code>&lt;div wtEditorContent [innerHTML]="announcement"&gt;</code> shows saved HTML with the same look as the editor: headings, lists, quotes, tables, pictures and the older <code>ql-align-*</code>, <code>ql-indent-*</code>, <code>ql-size-*</code> and <code>ql-font-*</code> classes that stored content carries. Bullet lists saved as <code>&lt;ol&gt;&lt;li data-list="bullet"&gt;</code> show as bullets too.',
      },
    },
    readonly: {
      title: { th: 'อ่านอย่างเดียว', en: 'Read-only' },
      text: {
        th: '<code>[readonly]="true"</code> แก้ไขไม่ได้และปิดปุ่มทุกปุ่ม (ยังเลือกและคัดลอกข้อความได้) ฟอร์มที่ <code>disable()</code> ก็ได้ผลแบบเดียวกัน',
        en: '<code>[readonly]="true"</code> blocks editing and disables every tool (text can still be selected and copied); a form control that is <code>disable()</code>d does the same.',
      },
    },
    count: {
      title: { th: 'นับคำและตัวอักษร', en: 'Word and character count' },
      text: {
        th: '<code>[showCount]="true"</code> แสดงจำนวนคำและตัวอักษรใต้ช่อง อัปเดตตามที่พิมพ์',
        en: '<code>[showCount]="true"</code> shows the word and character count under the field, updated as you type.',
      },
    },
    events: {
      title: { th: 'Event และ API', en: 'Events and the API' },
      text: {
        th: '<code>(onInit)</code> ส่ง <code>editor</code> ซึ่งเป็น API ของช่อง (<code>getHTML()</code>, <code>getText()</code>, <code>setHTML()</code>, <code>insertHTML()</code>, <code>insertText()</code>, <code>focus()</code>, <code>undo()</code>, <code>clipboard.dangerouslyPasteHTML()</code> …) หรือใช้ <code>#ed="wtEditor"</code> แล้วเรียก <code>ed.getEditor()</code> (<code>ed.getQuill()</code> สำหรับโค้ดเดิม และ <code>ed.api</code> ก็ได้ object เดียวกัน) ซึ่ง <code>root</code> คือ element ที่พิมพ์ได้ · <code>(onTextChange)</code> ได้ <code>htmlValue</code>, <code>textValue</code> และ <code>source</code> (<code>user</code> / <code>api</code>) · <code>(onSelectionChange)</code> ได้ตำแหน่งที่เลือก · <code>(onFocus)</code> / <code>(onBlur)</code>',
        en: '<code>(onInit)</code> brings <code>editor</code>, the field\'s API (<code>getHTML()</code>, <code>getText()</code>, <code>setHTML()</code>, <code>insertHTML()</code>, <code>insertText()</code>, <code>focus()</code>, <code>undo()</code>, <code>clipboard.dangerouslyPasteHTML()</code> …), or use <code>#ed="wtEditor"</code> and call <code>ed.getEditor()</code> (<code>ed.getQuill()</code> for code moving over; <code>ed.api</code> is the same object), whose <code>root</code> is the editing element · <code>(onTextChange)</code> brings <code>htmlValue</code>, <code>textValue</code> and <code>source</code> (<code>user</code> / <code>api</code>) · <code>(onSelectionChange)</code> the selected range · <code>(onFocus)</code> / <code>(onBlur)</code>.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด การวาง และ ARIA', en: 'Keyboard, pasting and ARIA' },
      text: {
        th: '<code>Ctrl</code> / <code>⌘</code> + <code>B</code> <code>I</code> <code>U</code> · <code>Ctrl</code> / <code>⌘</code> + <code>K</code> ลิงก์ · <code>Ctrl</code> / <code>⌘</code> + <code>Z</code> เลิกทำ และ <code>Ctrl</code> + <code>Y</code> หรือ <code>Ctrl</code> / <code>⌘</code> + <code>Shift</code> + <code>Z</code> ทำซ้ำ · แถบเครื่องมือเป็นจุด Tab เดียว เลื่อนด้วยลูกศร เมนูใช้ลูกศรและ <code>Esc</code> · กดลิงก์เพื่อเปิด balloon (เปิด แก้ไข ยกเลิกลิงก์) <code>Ctrl</code> + คลิกเปิดลิงก์ ลิงก์ที่ไม่ปลอดภัย (<code>javascript:</code>) ถูกปฏิเสธ · วางจาก Word, Google Docs หรือเว็บ เนื้อหาถูกล้าง (ไม่มี script หรือ style อื่นนอกจากสี การจัดแนว และขนาด) ข้อความหลายบรรทัดกลายเป็นย่อหน้า · ช่องพิมพ์เป็น <code>role="textbox"</code> แบบ <code>aria-multiline</code> ตั้งชื่อด้วย <code>ariaLabel</code> หรือ <code>ariaLabelledBy</code>',
        en: '<code>Ctrl</code> / <code>⌘</code> + <code>B</code> <code>I</code> <code>U</code> · <code>Ctrl</code> / <code>⌘</code> + <code>K</code> for a link · <code>Ctrl</code> / <code>⌘</code> + <code>Z</code> undoes, <code>Ctrl</code> + <code>Y</code> or <code>Ctrl</code> / <code>⌘</code> + <code>Shift</code> + <code>Z</code> redoes · the toolbar is one Tab stop moved with the arrows; menus take the arrows and <code>Esc</code> · click a link for its balloon (open, edit, remove), <code>Ctrl</code> + click opens it, and unsafe links (<code>javascript:</code>) are refused · pasting from Word, Google Docs or the web is cleaned (no scripts, no styles except colour, alignment and size) and plain lines become paragraphs · the writing area is an <code>aria-multiline</code> <code>role="textbox"</code>; name it with <code>ariaLabel</code> or <code>ariaLabelledBy</code>.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-editor&gt;</code> เป็น <code>&lt;wt-editor&gt;</code> ค่าที่บันทึกไว้แสดงได้เหมือนเดิม เพราะ HTML ใหม่ใช้ class ชุดเดิม (<code>ql-align-*</code>, <code>ql-indent-*</code>, <code>ql-size-*</code>, <code>ql-font-*</code>) · template <code>pTemplate="header"</code> ใช้ต่อได้ · <code>(onTextChange)</code>, <code>(onSelectionChange)</code> และ <code>(onInit)</code> ชื่อเดิม (<code>delta</code> เป็น <code>null</code>) · <code>getEditor()</code> และ <code>getQuill()</code> ยังเรียกได้ คืน API ของช่องที่ <code>root</code> คือ element ที่พิมพ์ได้ (คำสั่งที่มีอยู่ในแท็บคุณสมบัติ) · <code>formats</code>, <code>modules</code>, <code>bounds</code>, <code>scrollingContainer</code> และ <code>debug</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-editor&gt;</code> to <code>&lt;wt-editor&gt;</code>. Saved values show as before, because the new HTML uses the same classes (<code>ql-align-*</code>, <code>ql-indent-*</code>, <code>ql-size-*</code>, <code>ql-font-*</code>) · <code>pTemplate="header"</code> keeps working · <code>(onTextChange)</code>, <code>(onSelectionChange)</code> and <code>(onInit)</code> keep their names (<code>delta</code> is <code>null</code>) · <code>getEditor()</code> and <code>getQuill()</code> still work and return the field\'s API, whose <code>root</code> is the editing element (the Properties tab lists its calls) · <code>formats</code>, <code>modules</code>, <code>bounds</code>, <code>scrollingContainer</code> and <code>debug</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wt-editor name="newsBody" [(ngModel)]="newsBody" [style]="{ height: '320px' }" placeholder="พิมพ์เนื้อหาข่าว"></wt-editor>
<wt-button label="บันทึก" icon="wi wi-save" [loading]="isApiSaving" [disabled]="!newsBody" (onClick)="saveNews()"></wt-button>`,
    toolbar: `<wt-selectbutton name="preset" [(ngModel)]="preset" [options]="presets" [allowEmpty]="false"></wt-selectbutton>
<wt-editor name="presetBody" [(ngModel)]="presetBody" [toolbar]="preset" [style]="{ height: '160px' }"></wt-editor>

<wt-editor name="customBody" [(ngModel)]="customBody" [toolbar]="tools" [style]="{ height: '160px' }"></wt-editor>`,
    options: `<wt-editor name="noticeBody" [(ngModel)]="noticeBody" toolbar="full" [toolOptions]="toolOptions"
  [style]="{ height: '200px' }"></wt-editor>`,
    header: HEADER_TEMPLATE,
    images: `<wt-editor name="newsBody" [(ngModel)]="newsBody" [toolbar]="['bold', 'italic', '|', 'image', '|', 'undo', 'redo']"
  [imageUpload]="imageUpload" [style]="{ height: '240px' }" (onImageUpload)="imageUploaded($event)"
  (onImageUploadError)="imageFailed($event)"></wt-editor>`,
    defaults: `<!-- อัปโหลดไปที่ url: ไฟล์ส่งเป็น multipart แล้วอ่าน URL จากคำตอบ -->
<wt-editor name="newsBody" [(ngModel)]="newsBody"
  [imageUpload]="{ url: '/api/news/images', responseUrl: 'data.url', maxSize: 2097152 }"></wt-editor>`,
    tables: `<wt-editor name="timetable" [(ngModel)]="timetable" [toolbar]="['bold', '|', 'table', '|', 'undo', 'redo']"
  [toolOptions]="{ table: { rows: 6, cols: 6, headerRow: true } }" [style]="{ height: '260px' }"></wt-editor>`,
    view: `<div wtEditorContent [innerHTML]="announcement"></div>`,
    readonly: `<wt-editor name="policy" [ngModel]="policy" [readonly]="true" toolbar="basic"></wt-editor>`,
    count: `<wt-editor name="summary" [(ngModel)]="summary" toolbar="basic" [showCount]="true" [style]="{ height: '120px' }"></wt-editor>`,
    events: `<wt-editor #ed="wtEditor" name="letter" [(ngModel)]="letter" toolbar="basic" [style]="{ height: '160px' }"
  (onInit)="editorReady($event)" (onTextChange)="textChanged($event)"></wt-editor>
<wt-button label="ใส่จดหมายตัวอย่าง" icon="wi wi-file" severity="secondary" (onClick)="useLetterTemplate()"></wt-button>
<wt-button label="ไปที่เนื้อหา" severity="secondary" [text]="true" (onClick)="ed.getEditor().focus()"></wt-button>`,
  },
  ts: {
    basic: `newsBody: string | null = '<p>โรงเรียนเปิดรับสมัครนักเรียน <strong>ปีการศึกษา 2569</strong></p>';   // ว่างเปล่าคือ null
isApiSaving = false;

saveNews(): void {
  this.isApiSaving = true;
  this.newsService.save({ body: this.newsBody }).subscribe(() => {
    this.isApiSaving = false;
  });
}`,
    toolbar: `import { EditorToolbar } from 'wiratheme/editor';

presets = ['basic', 'standard', 'full', 'none'];
preset: EditorToolbar = 'full';
tools: EditorToolbar = ['bold', 'italic', '|', 'bulletList', 'orderedList', '|', 'link', 'image', 'table'];`,
    options: `import { EditorToolOptions } from 'wiratheme/editor';

toolOptions: EditorToolOptions = {
  headings: [0, 2, 3],   // 0 = ย่อหน้า
  colors: ['#1e293b', '#0f766e', '#b91c1c', '#1d4ed8'],
  highlights: ['#fef9c3', '#dcfce7'],
  alignments: ['left', 'center', 'right'],
  blocks: ['blockquote'],   // ข้อความอ้างอิงอยู่ในเมนู ไม่มีบล็อกโค้ด
  table: { rows: 6, cols: 6, headerRow: true },
  link: { newTab: true },
};`,
    images: `import { WtEditorImageUpload, WtEditorImageUploadErrorEvent } from 'wiratheme/editor';

imageUpload: WtEditorImageUpload = { upload: this.uploadImage.bind(this), maxSize: 1048576 };
lastEvent = '';

/** ได้ URL ของรูปกลับมา */
uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  return firstValueFrom(this.newsService.uploadImage(formData)).then((res) => res.url);
}

imageUploaded(event: { file: File; url: string }): void {
  this.lastEvent = 'onImageUpload: ' + event.file.name;
}

imageFailed(event: WtEditorImageUploadErrorEvent): void {
  this.lastEvent = 'onImageUploadError: ' + event.reason;
}`,
    defaults: `// app.config.ts หรือ providers ของ AppModule: ทั้งแอป: ทุก wt-editor ใช้ค่านี้
import { provideEditorOptions } from 'wiratheme/editor';

providers: [
  provideEditorOptions({
    toolbar: 'standard',
    toolOptions: { headings: [0, 1, 2, 3] },
    imageUpload: { url: '/api/upload', responseUrl: 'data.url', maxSize: 2097152 },
  }),
],`,
    tables: `// ตามตารางที่ปรับความกว้างไว้
timetable = '<p>ตารางสอบกลางภาค</p><table style="width: 100%"><colgroup><col style="width: 40%"><col style="width: 35%"><col style="width: 25%"></colgroup>'
  + '<thead><tr><th>วิชา</th><th>วันสอบ</th><th>ห้องสอบ</th></tr></thead>'
  + '<tbody><tr><td>คณิตศาสตร์</td><td>จันทร์ 6 ก.ค.</td><td>311</td></tr><tr><td>วิทยาศาสตร์</td><td>อังคาร 7 ก.ค.</td><td>312</td></tr></tbody></table>';`,
    view: `announcement = '<h2>จัดกิจกรรมวันไหว้ครู</h2><p class="ql-align-center">วันพฤหัสบดีที่ 18 มิถุนายน</p>'
  + '<ul><li>แต่งกายชุดนักเรียน</li><li>นำพานไหว้ครูของห้อง</li></ul>';   // ข่าวจาก API`,
    events: `import { WtEditorApi, WtEditorInitEvent, WtEditorTextChangeEvent } from 'wiratheme/editor';

letter: string | null = null;
lastEvent = '';
private editor: WtEditorApi | null = null;

editorReady(event: WtEditorInitEvent): void {
  this.editor = event.editor;
}

useLetterTemplate(): void {
  this.editor?.setHTML('<p>เรียน ผู้ปกครอง</p><p>ขอเชิญประชุมผู้ปกครองวันเสาร์นี้ เวลา 9.00 น.</p>');
}

textChanged(event: WtEditorTextChangeEvent): void {
  this.lastEvent = event.source + ' · ' + event.textValue.length;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('ngModel · formControlName', 'string | null', 'null', 'ค่าเป็น HTML ว่างเปล่าคือ null', 'The value as HTML; null when empty'),
        row('toolbar', "'basic' | 'standard' | 'full' | 'none' | EditorTool[] | EditorTool[][]", "'standard'", "ชุดเครื่องมือ หรือรายชื่อเครื่องมือที่คั่นกลุ่มด้วย '|'", "A preset, or a list of tools with '|' between groups"),
        row('toolOptions', 'EditorToolOptions', undefined, 'ระดับหัวข้อ รูปแบบย่อหน้าอื่น (blocks) ขนาด แบบตัวอักษร สี การจัดแนว ตาราง และลิงก์', 'Headings, other block styles (blocks), sizes, fonts, colours, alignments, table and links'),
        row('imageUpload', 'WtEditorImageUpload', 'base64', 'ฝังรูปเป็น base64 หรืออัปโหลดไปที่ url / upload()', 'Embed pictures as base64, or upload them to url / upload()'),
        row('placeholder', 'string', undefined, 'ข้อความเมื่อยังว่าง', 'Text shown while empty'),
        row('readonly', BOOL, 'false', 'แก้ไขไม่ได้ ปิดปุ่มทุกปุ่ม', 'No editing; every tool disabled'),
        row('style', 'object', undefined, "style ของพื้นที่พิมพ์ เช่น { height: '320px' }", "Style of the writing area, e.g. { height: '320px' }"),
        row('styleClass', 'string', undefined, 'class ของกล่องนอก', 'Class of the outer box'),
        row('showCount', BOOL, 'false', 'จำนวนคำและตัวอักษรใต้ช่อง', 'Word and character count under the field'),
        row('stickyToolbar', BOOL, 'true', 'แถบเครื่องมือติดด้านบนเมื่อเลื่อน', 'The toolbar sticks to the top while scrolling'),
        row('ariaLabel · ariaLabelledBy · id', 'string', undefined, 'ชื่อและ id ของพื้นที่พิมพ์', 'Name and id of the writing area'),
        row('formats · modules · bounds · scrollingContainer · debug', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-tools',
      title: { th: 'เครื่องมือ', en: 'Tools' },
      typeLabel: { th: 'ชนิด', en: 'Kind' },
      note: { th: "ใช้ชื่อเหล่านี้ใน [toolbar] คั่นกลุ่มด้วย '|'", en: "Use these names in [toolbar], with '|' between groups." },
      rows: EDITOR_TOOL_ROWS,
    },
    {
      id: 'api-upload',
      title: 'WtEditorImageUpload',
      rows: [
        row('mode', "'base64' | 'upload'", "'base64'", 'ฝังในเนื้อหา หรืออัปโหลด (มี url หรือ upload จะเป็น upload)', 'Embed, or upload (url or upload means upload)'),
        row('url · fieldName · method', "string · string · 'POST' | 'PUT'", "undefined · 'file' · 'POST'", 'ที่อยู่ ชื่อ field และวิธีส่ง', 'Address, field name and method'),
        row('headers · withCredentials', 'HttpHeaders | object · boolean', undefined, 'header ของคำขอ และส่ง cookie ไปด้วย', 'Request headers, and send cookies'),
        row('responseUrl', 'string | (response) => string', "'url', 'data.url', 'location', 'path'", 'ตำแหน่งของ URL ในคำตอบ', 'Where the URL is in the answer'),
        row('baseUrl', 'string', undefined, 'ต่อหน้า URL แบบ relative', 'Prefixed to a relative URL'),
        row('maxSize · accept', 'number · string', 'undefined · png, jpeg, gif, webp', 'ขนาดสูงสุด (ไบต์) และชนิดรูปที่รับ', 'Largest size (bytes) and accepted types'),
        row('upload', '(file: File) => Promise<string>', undefined, 'แอปอัปโหลดเองแล้วคืน URL (ชนะ url)', 'The app uploads and resolves with the URL (wins over url)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onTextChange', 'WtEditorTextChangeEvent', undefined, 'เนื้อหาเปลี่ยน', 'The content changed'),
        row('onSelectionChange', 'WtEditorSelectionChangeEvent', undefined, 'ตำแหน่งที่เลือกเปลี่ยน', 'The selection changed'),
        row('onInit', 'WtEditorInitEvent', undefined, 'ช่องพร้อมใช้ ได้ API ของช่อง', 'The field is ready, with its API'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'โฟกัสเข้า / ออก', 'Focus in / out'),
        row('onImageUpload', '{ file, url }', undefined, 'อัปโหลดรูปเสร็จ', 'A picture finished uploading'),
        row('onImageUploadError', 'WtEditorImageUploadErrorEvent', undefined, "รูปไม่ผ่าน ('size' / 'type') หรืออัปโหลดไม่สำเร็จ ('upload')", "A picture was turned away ('size' / 'type') or failed to upload ('upload')"),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #header, wtTemplate="header" หรือ pTemplate="header" ก็ได้', en: 'Write it as #header, wtTemplate="header" or pTemplate="header".' },
      rows: [row('header', '—', undefined, 'แถบเครื่องมือของแอปเอง (ปุ่มและ select ql-*)', 'Your own toolbar (ql-* buttons and selects)')],
    },
    {
      id: 'api-component-methods',
      title: 'Methods',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน template ref: #ed="wtEditor" แล้ว ed.getEditor()', en: 'Call them through a template ref: #ed="wtEditor", then ed.getEditor().' },
      rows: [
        row('getEditor() · getQuill()', 'WtEditorApi', undefined, 'API ของช่อง (object เดียวกับ ed.api และ event.editor ของ onInit) root คือ element ที่พิมพ์ได้ getQuill() มีไว้ให้โค้ดเดิม', 'The field\'s API (the same object as ed.api and onInit\'s event.editor); its root is the editing element. getQuill() is there for code moving over'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'API ของช่อง', en: 'Editor API' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'จาก (onInit) เป็น event.editor หรือ #ed="wtEditor" แล้ว ed.getEditor() (หรือ ed.api)', en: 'From (onInit) as event.editor, or #ed="wtEditor" then ed.getEditor() (or ed.api).' },
      rows: [
        row('getHTML() · getSemanticHTML() · getText() · getLength()', 'string · string · string · number', undefined, 'เนื้อหาเป็น HTML ข้อความ และความยาว', 'The content as HTML, as text, and its length'),
        row('setHTML(html) · insertHTML(html) · insertText(text)', 'void', undefined, 'แทนเนื้อหา / แทรกที่ตำแหน่งเคอร์เซอร์ (HTML ถูกล้างก่อน)', 'Replace the content / insert at the caret (HTML is cleaned)'),
        row('focus() · blur() · hasFocus()', 'void · void · boolean', undefined, 'โฟกัส', 'Focus'),
        row('enable(enabled?) · disable()', 'void', undefined, 'เปิด / ปิดการแก้ไข', 'Turn editing on / off'),
        row('undo() · redo()', 'void', undefined, 'เลิกทำ / ทำซ้ำ', 'Undo / redo'),
        row('clipboard.dangerouslyPasteHTML(html)', 'void', undefined, 'แทนเนื้อหาแบบเดิม (ยังถูกล้าง)', 'Replace the content the older way (still cleaned)'),
        row('root', 'HTMLElement', undefined, 'element ที่พิมพ์ได้ (contenteditable)', 'The editing element (contenteditable)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WtEditorInitEvent, WtEditorTextChangeEvent, provideEditorOptions } from 'wiratheme/editor';

interface WtEditorTextChangeEvent {
  htmlValue: string | null;   // ว่างเปล่าคือ null
  textValue: string;
  delta: null;
  source: 'user' | 'api';
}
interface WtEditorSelectionChangeEvent {
  range: { index: number; length: number } | null;
  oldRange: { index: number; length: number } | null;
  source: 'user';
}
interface WtEditorInitEvent { editor: WtEditorApi }
interface WtEditorImageUploadErrorEvent { file: File; reason: 'size' | 'type' | 'upload'; message: string }
interface EditorToolOptions {
  headings?: number[];   // 0 = ย่อหน้า
  blocks?: Array<'blockquote' | 'codeBlock'>;
  fontSizes?: { label: string; value: string }[];
  fontFamilies?: { label: string; value: string }[];
  colors?: string[];
  highlights?: string[];
  alignments?: Array<'left' | 'center' | 'right' | 'justify'>;
  table?: { rows?: number; cols?: number; headerRow?: boolean };
  link?: { newTab?: boolean; protocols?: string[] };
}
function provideEditorOptions(options: { toolbar?: EditorToolbar; toolOptions?: EditorToolOptions; imageUpload?: WtEditorImageUpload }): Provider;`,
    },
  ],
  tokens: [
    tok('--wt-editor-radius', 'ความมนของกล่อง', 'Box radius'),
    tok('--wt-editor-toolbar-bg', 'พื้นของแถบเครื่องมือ', 'Toolbar background'),
    tok('--wt-editor-toolbar-padding', 'ระยะในแถบเครื่องมือ', 'Toolbar padding'),
    tok('--wt-editor-tool-size', 'ขนาดปุ่มเครื่องมือ', 'Tool button size'),
    tok('--wt-editor-tool-radius', 'ความมนของปุ่มเครื่องมือ', 'Tool button radius'),
    tok('--wt-editor-tool-hover-bg', 'พื้นปุ่มเมื่อชี้', 'Tool on hover'),
    tok('--wt-editor-tool-on-bg', 'พื้นปุ่มที่ใช้งานอยู่ (เช่น ตัวหนา)', 'Active tool background (bold on …)'),
    tok('--wt-editor-tool-on-color', 'สีปุ่มที่ใช้งานอยู่', 'Active tool colour'),
    tok('--wt-editor-content-padding-y', 'ระยะบนล่างของพื้นที่พิมพ์', 'Writing area vertical padding'),
    tok('--wt-editor-content-padding-x', 'ระยะซ้ายขวาของพื้นที่พิมพ์', 'Writing area horizontal padding'),
    tok('--wt-editor-content-min-height', 'ความสูงขั้นต่ำของพื้นที่พิมพ์', 'Minimum writing area height'),
    tok('--wt-editor-sticky-top', 'ระยะจากขอบบนเมื่อแถบเครื่องมือติด (เช่น ความสูงของแถบเมนูของแอป)', 'Offset of the sticky toolbar (such as your app bar height)'),
    tok('--wt-primary-color', 'เส้นโฟกัส มุมปรับขนาดรูป และตารางที่เลือก', 'Focus ring, picture resize handle and the picked grid'),
  ],
};
