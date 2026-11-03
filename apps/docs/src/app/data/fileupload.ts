import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const FILEUPLOAD_DOC: ComponentDoc = {
  id: 'fileupload',
  title: 'FileUpload',
  group: 'Form',
  entry: 'fileupload',
  standalone: 'WuFileUpload',
  module: 'WuFileUploadModule',
  selector: 'wu-fileupload',
  description: {
    th: 'เลือกไฟล์หรือลากมาวาง ตรวจชนิดและขนาดไฟล์ให้พร้อมข้อความภาษาไทย แสดงรายการไฟล์พร้อมรูปย่อ แล้วให้โค้ดของแอปอัปโหลดเอง หรือส่งไปที่ url ก็ได้ มีทั้งแบบกล่องเต็มและแบบปุ่มเดียว',
    en: 'Choose files or drop them in. Type and size are checked with messages in the reader\'s language, chosen files are listed with thumbnails, and your own code uploads them (or the component posts them to a url). Comes as a full box or a single button.',
  },
  english: {
    'เลือกไฟล์': 'Choose files',
    'อัปโหลด': 'Upload',
    'เลือกไฟล์คะแนน': 'Choose score files',
    'ล้าง': 'Clear',
    'ล้างทั้งหมด': 'Clear all',
    'เลือกรูปนักเรียน': 'Choose a student photo',
    'แนบไฟล์': 'Attach files',
    'นำออก': 'Remove',
    'PDF หรือรูป ไม่เกิน 10 MB': 'PDF or pictures, up to 10 MB',
    'ลากใบรับรองหรือสำเนาบัตรมาวางที่นี่': 'Drop certificates or ID copies here',
    'ไฟล์ที่ส่งแล้ว': 'Files sent',
    'ไฟล์ที่ผ่าน': 'Files accepted',
    'ไม่ผ่าน': 'Rejected',
    'ส่งไปพร้อมฟอร์มตอนบันทึก': 'sent with the form on save',
    'ไฟล์ที่ผ่านการตรวจทั้งหมด': 'every file that passed the checks',
    'นำเข้าแล้ว ': 'Imported ',
    ' ไฟล์': ' files',
    'นำเข้าไม่สำเร็จ': 'Import failed',
    'หน้าเอกสารไม่ส่งไฟล์ไปไหน': 'the docs page sends nothing',
    'เฉพาะไฟล์ที่ผ่านการตรวจ': 'only the files that passed the checks',
    'ไฟล์ทั้งหมดที่เลือกอยู่': 'every file now chosen',
    'ข้อความที่แสดง': 'the message shown',
    'ไฟล์ที่ถูกปฏิเสธ (null เมื่อเกินจำนวน)': 'the file turned away (null for the limit)',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuFileUploadModule</code> ซึ่งรวม <code>wuTemplate</code> ไว้แล้ว) และ standalone (<code>WuFileUpload</code>) selector <code>wu-fileUpload</code> ก็ใช้ได้ การส่งไฟล์ไปที่ url ใช้ XMLHttpRequest จึงไม่ต้องตั้ง HttpClient',
        en: 'Works as an NgModule (<code>WuFileUploadModule</code>, which brings <code>wuTemplate</code>) or standalone (<code>WuFileUpload</code>). The <code>wu-fileUpload</code> selector works too. Posting to a url uses XMLHttpRequest, so no HttpClient setup is needed.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'แบบที่แอปใช้บ่อยที่สุด: <code>[customUpload]="true"</code> ให้ปุ่มอัปโหลดส่ง <code>(uploadHandler)</code> พร้อม <code>files</code> แอปอัปโหลดด้วย service ของตัวเอง เสร็จแล้วเรียก <code>clear()</code> ผ่าน template reference (<code>#fileUpload</code>) · <code>[multiple]="true"</code> เลือกหลายไฟล์ · <code>accept</code> ชนิดไฟล์ · <code>[maxFileSize]</code> ขนาดสูงสุดเป็นไบต์ (10485760 = 10 MB) · ลากไฟล์มาวางในกล่องได้ ไฟล์ซ้ำถูกข้าม รูปมีรูปย่อ ไฟล์ที่เลือกแล้วมีป้าย “รออัปโหลด” · ระหว่างส่ง <code>[disabled]="isApiSaving"</code> ล็อกปุ่มไว้',
        en: 'The way the apps use it most: <code>[customUpload]="true"</code> makes the upload button emit <code>(uploadHandler)</code> with the <code>files</code>; your service uploads them, then call <code>clear()</code> through a template reference (<code>#fileUpload</code>) · <code>[multiple]="true"</code> allows several files · <code>accept</code> limits the types · <code>[maxFileSize]</code> is the limit in bytes (10485760 = 10 MB) · files can be dropped on the box, duplicates are skipped, pictures get thumbnails and chosen files carry a “Pending” badge · <code>[disabled]="isApiSaving"</code> locks the buttons while sending.',
      },
    },
    validation: {
      title: { th: 'ตรวจไฟล์และข้อความ', en: 'Checks and messages' },
      text: {
        th: 'ไฟล์ที่ไม่ผ่าน <code>accept</code> หรือ <code>maxFileSize</code> ไม่ถูกเพิ่ม และมีข้อความที่ปิดได้ เช่น “รายงาน.pdf: ไม่รองรับไฟล์ชนิดนี้ (รองรับ .xlsx, .xls)” · <code>[fileLimit]</code> จำนวนไฟล์สูงสุด (นับไฟล์ที่อัปโหลดไปแล้วด้วย) · <code>(onSelect)</code> ได้ <code>files</code> เฉพาะไฟล์ที่ผ่าน และ <code>currentFiles</code> คือไฟล์ทั้งหมดที่เลือกอยู่ · <code>(onValidationFail)</code> บอกไฟล์ เหตุผล (<code>type</code> / <code>size</code> / <code>limit</code>) และข้อความ · เปลี่ยนข้อความได้ด้วย <code>invalidFileSizeMessageSummary</code> / <code>…Detail</code> และตัวอื่น ๆ · ตัวอย่างนี้ซ่อนปุ่มอัปโหลด (<code>[showUploadButton]="false"</code>) เพราะไฟล์ส่งไปพร้อมฟอร์ม ลองเลือกไฟล์ที่ไม่ใช่ Excel หรือใหญ่กว่า 1 MB',
        en: 'Files outside <code>accept</code> or over <code>maxFileSize</code> are not added and get a closable message such as “report.pdf: this file type is not allowed (allowed: .xlsx, .xls)” · <code>[fileLimit]</code> caps the number of files (uploaded ones count too) · <code>(onSelect)</code> brings <code>files</code>, only the ones that passed, and <code>currentFiles</code>, every file now chosen · <code>(onValidationFail)</code> gives the file, the reason (<code>type</code> / <code>size</code> / <code>limit</code>) and the message · change the texts with <code>invalidFileSizeMessageSummary</code> / <code>…Detail</code> and the rest · this example hides the upload button (<code>[showUploadButton]="false"</code>) because the files go with the form. Try a file that is not Excel, or one over 1 MB.',
      },
    },
    basicmode: {
      title: { th: 'แบบปุ่มเดียว', en: 'Basic mode' },
      text: {
        th: '<code>mode="basic"</code> เหลือปุ่มเลือกปุ่มเดียว เลือกแล้วแสดงชื่อไฟล์และปุ่ม × สำหรับล้าง แอปมักอ่านไฟล์จาก <code>(onSelect)</code> แล้วส่งไปพร้อมฟอร์ม · <code>[auto]="true"</code> อัปโหลดทันทีที่เลือก',
        en: '<code>mode="basic"</code> leaves a single choose button. Once a file is chosen it shows its name and an × to clear it. Apps usually read the file from <code>(onSelect)</code> and send it with the form · <code>[auto]="true"</code> uploads as soon as a file is chosen.',
      },
    },
    templates: {
      title: 'Templates',
      text: {
        th: '<code>empty</code> แทนข้อความ “ลากไฟล์มาวางที่นี่ หรือกดปุ่มเลือกไฟล์” · <code>file</code> วาดแต่ละไฟล์เอง (ได้ไฟล์เป็น <code>let-file</code> และ <code>index</code>) · <code>toolbar</code> ต่อท้ายแถบปุ่ม · <code>content</code> ได้ไฟล์และ callback (<code>chooseCallback</code>, <code>uploadCallback</code>, <code>clearCallback</code>, <code>removeFileCallback(event, index)</code> …) โดย v1 แสดงรายการไฟล์แล้วตามด้วย <code>content</code> แบบเดิม ส่วน v2 / v3 ให้ <code>content</code> แทนรายการ · <code>header</code> แทนแถบปุ่มทั้งแถบ (context เดียวกับ <code>content</code>)',
        en: '<code>empty</code> replaces the “Drag and drop files here” hint · <code>file</code> draws each file yourself (the file as <code>let-file</code>, plus <code>index</code>) · <code>toolbar</code> goes after the buttons · <code>content</code> gets the files and callbacks (<code>chooseCallback</code>, <code>uploadCallback</code>, <code>clearCallback</code>, <code>removeFileCallback(event, index)</code> …); v1 lists the files and then <code>content</code>, the classic order, while v2 / v3 let <code>content</code> replace the list · <code>header</code> replaces the whole button bar (same context as <code>content</code>).',
      },
    },
    server: {
      title: { th: 'ส่งไปที่ url', en: 'Posting to a url' },
      text: {
        th: 'ไม่ใส่ <code>customUpload</code> แล้วตั้ง <code>url</code>: ปุ่มอัปโหลด (หรือ <code>[auto]="true"</code>) ส่ง <code>FormData</code> ด้วย XMLHttpRequest ชื่อ field คือ <code>name</code> (ค่าเริ่มต้น <code>file</code>) มีแถบความคืบหน้า และไฟล์ที่ส่งสำเร็จมีป้าย “อัปโหลดแล้ว” · <code>method</code> เป็น <code>post</code> หรือ <code>put</code> · <code>[headers]</code> รับ HttpHeaders หรือ object ธรรมดา · <code>(onBeforeUpload)</code> เพิ่ม field ใน formData ได้ · <code>(onUpload)</code> / <code>(onError)</code> / <code>(onProgress)</code> · ตัวอย่างนี้เป็นโค้ดอย่างเดียว หน้าเอกสารไม่ส่งไฟล์ไปไหน',
        en: 'Leave out <code>customUpload</code> and set <code>url</code>: the upload button (or <code>[auto]="true"</code>) posts a <code>FormData</code> with XMLHttpRequest, the field named by <code>name</code> (default <code>file</code>), with a progress bar, and files that went through get a “Completed” badge · <code>method</code> is <code>post</code> or <code>put</code> · <code>[headers]</code> takes HttpHeaders or a plain object · <code>(onBeforeUpload)</code> can add fields to the formData · <code>(onUpload)</code> / <code>(onError)</code> / <code>(onProgress)</code> · this sample is code only: the docs page sends nothing.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและจอแคบ', en: 'Keyboard and phones' },
      text: {
        th: 'ปุ่มทุกปุ่มเป็น <code>&lt;button&gt;</code> จริง กด <code>Tab</code> ไปถึงแล้วกด <code>Enter</code> / <code>Space</code> · ปุ่มนำไฟล์ออกมีชื่อไฟล์อยู่ในชื่อปุ่ม (“ลบ รายงาน.pdf”) · ข้อความของไฟล์ที่ไม่ผ่านปิดได้ · บนจอแคบแถบปุ่มและแถวของไฟล์ขึ้นบรรทัดใหม่เอง ชื่อไฟล์ยาวตัดบรรทัดไม่ล้นจอ',
        en: 'Every button is a real <code>&lt;button&gt;</code>: <code>Tab</code> to it and press <code>Enter</code> / <code>Space</code> · the remove buttons carry the file name in their name (“Remove report.pdf”) · messages about rejected files can be closed · on phones the button bar and the file rows wrap, and long file names break instead of overflowing.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-fileUpload&gt;</code> เป็น <code>&lt;wu-fileupload&gt;</code> (หรือ <code>&lt;wu-fileUpload&gt;</code>) input ชื่อเดิม (<code>chooseLabel</code>, <code>maxFileSize</code>, <code>customUpload</code>, <code>chooseStyleClass</code> …) <code>pTemplate="content"</code> / <code>"empty"</code> ใช้ได้ class <code>p-fileupload-*</code> อยู่คู่กับ <code>wu-fileupload-*</code> และโค้ดที่เรียก <code>fileUpload.clear()</code> หรืออ่าน <code>fileUpload.files</code> ใช้ต่อได้ ส่วน <code>chooseButtonProps</code> / <code>uploadButtonProps</code> / <code>cancelButtonProps</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-fileUpload&gt;</code> to <code>&lt;wu-fileupload&gt;</code> (or <code>&lt;wu-fileUpload&gt;</code>). Inputs keep their names (<code>chooseLabel</code>, <code>maxFileSize</code>, <code>customUpload</code>, <code>chooseStyleClass</code> …), <code>pTemplate="content"</code> / <code>"empty"</code> work, the <code>p-fileupload-*</code> classes sit next to <code>wu-fileupload-*</code>, and code that calls <code>fileUpload.clear()</code> or reads <code>fileUpload.files</code> keeps working. <code>chooseButtonProps</code> / <code>uploadButtonProps</code> / <code>cancelButtonProps</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wu-fileupload #fileUpload name="documents" [multiple]="true" accept="image/*,application/pdf"
  [maxFileSize]="10485760" chooseLabel="เลือกไฟล์" uploadLabel="อัปโหลด" cancelLabel="ยกเลิก"
  [customUpload]="true" [disabled]="isApiSaving" (uploadHandler)="uploadDocuments($event, fileUpload)"></wu-fileupload>`,
    validation: `<wu-fileupload name="scores" accept=".xlsx,.xls" [maxFileSize]="1048576" [fileLimit]="3" [multiple]="true"
  chooseLabel="เลือกไฟล์คะแนน" cancelLabel="ล้าง" [showUploadButton]="false"
  (onSelect)="picked($event)" (onValidationFail)="rejected($event)"></wu-fileupload>`,
    basicmode: `<wu-fileupload mode="basic" name="photo" accept="image/*" [maxFileSize]="2097152"
  chooseLabel="เลือกรูปนักเรียน" (onSelect)="pickPhoto($event)" (onClear)="clearPhoto()"></wu-fileupload>`,
    templates: `<wu-fileupload #attachments name="attachments" [multiple]="true" accept="image/*,application/pdf"
  [maxFileSize]="10485760" chooseLabel="แนบไฟล์" cancelLabel="ล้างทั้งหมด" [showUploadButton]="false">
  <ng-template #toolbar>
    <small class="text-color-secondary">PDF หรือรูป ไม่เกิน 10 MB</small>
  </ng-template>
  <ng-template #file let-file let-i="index">
    <div class="flex align-items-center gap-2">
      <i class="wi wi-file"></i>
      <span class="flex-1">{{ file.name }}</span>
      <wu-button icon="wi wi-times" severity="danger" [text]="true" [rounded]="true" ariaLabel="นำออก"
        (onClick)="attachments.remove($event, i)"></wu-button>
    </div>
  </ng-template>
  <ng-template #empty>
    <div class="text-center">
      <i class="wi wi-upload"></i>
      <p>ลากใบรับรองหรือสำเนาบัตรมาวางที่นี่</p>
    </div>
  </ng-template>
</wu-fileupload>`,
    server: `<wu-fileupload name="file" url="/api/students/import" accept=".xlsx" [maxFileSize]="10485760"
  chooseLabel="เลือกไฟล์" [headers]="uploadHeaders" (onBeforeUpload)="addClass($event)"
  (onUpload)="imported($event)" (onError)="importFailed($event)"></wu-fileupload>`,
  },
  ts: {
    basic: `import { WuFileUpload, WuFileUploadHandlerEvent } from '@wirabyte/ui/fileupload';

isApiSaving = false;

uploadDocuments(event: WuFileUploadHandlerEvent, fileUpload: WuFileUpload): void {
  this.isApiSaving = true;
  const formData = new FormData();
  for (const file of event.files) formData.append('documents', file, file.name);
  this.documentService.upload(formData).subscribe(() => {
    this.isApiSaving = false;
    fileUpload.clear();
  });
}`,
    validation: `import { WuFileSelectEvent, WuFileValidationFailEvent } from '@wirabyte/ui/fileupload';

lastPicked = '';
lastProblem = '';

picked(event: WuFileSelectEvent): void {
  this.lastPicked = event.files.map((f) => f.name).join(', ');   // เฉพาะไฟล์ที่ผ่านการตรวจ
}

rejected(event: WuFileValidationFailEvent): void {
  this.lastProblem = event.reason;
}`,
    basicmode: `import { WuFileSelectEvent } from '@wirabyte/ui/fileupload';

photo: File | null = null;

pickPhoto(event: WuFileSelectEvent): void {
  this.photo = event.files[0] ?? null;   // ส่งไปพร้อมฟอร์มตอนบันทึก
}

clearPhoto(): void {
  this.photo = null;
}`,
    server: `import { WuFileBeforeUploadEvent, WuFileUploadErrorEvent, WuFileUploadEvent } from '@wirabyte/ui/fileupload';

uploadHeaders = { Authorization: 'Bearer ' + this.auth.token };
classId = 12;

addClass(event: WuFileBeforeUploadEvent): void {
  event.formData.append('classId', String(this.classId));
}

imported(event: WuFileUploadEvent): void {
  this.messageService.add({ severity: 'success', summary: 'นำเข้าแล้ว ' + event.files.length + ' ไฟล์' });
}

importFailed(event: WuFileUploadErrorEvent): void {
  this.messageService.add({ severity: 'error', summary: 'นำเข้าไม่สำเร็จ', detail: event.xhr.statusText });
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: { th: 'Inputs · ไฟล์และการอัปโหลด', en: 'Inputs · files and uploading' },
      rows: [
        row('mode', "'advanced' | 'basic'", "'advanced'", 'กล่องเต็ม หรือปุ่มเลือกปุ่มเดียว', 'The full box, or a single choose button'),
        row('multiple', BOOL, 'false', 'เลือกหลายไฟล์', 'Several files'),
        row('accept', 'string', undefined, "ชนิดไฟล์ที่รับ เช่น '.xlsx,.xls' หรือ 'image/*,application/pdf'", "Accepted types, e.g. '.xlsx,.xls' or 'image/*,application/pdf'"),
        row('maxFileSize', 'number', undefined, 'ขนาดสูงสุดต่อไฟล์เป็นไบต์ (10485760 = 10 MB)', 'Largest file in bytes (10485760 = 10 MB)'),
        row('fileLimit', 'number', undefined, 'จำนวนไฟล์สูงสุด นับไฟล์ที่อัปโหลดแล้วด้วย', 'Most files, uploaded ones included'),
        row('customUpload', BOOL, 'false', 'อัปโหลดเอง: ปุ่มอัปโหลดส่ง (uploadHandler) แทนการส่งไปที่ url', 'Upload yourself: the upload button emits (uploadHandler) instead of posting to url'),
        row('auto', BOOL, 'false', 'อัปโหลดทันทีที่เลือก', 'Upload as soon as files are chosen'),
        row('url · method · name', "string · 'post' | 'put' · string", "undefined · 'post' · 'file'", 'ที่อยู่ วิธี และชื่อ field ของ FormData', 'Address, method and FormData field name'),
        row('headers · withCredentials', 'HttpHeaders | Record<string, string> · boolean', 'undefined · false', 'header ของคำขอ และส่ง cookie ไปด้วย', 'Request headers, and send cookies'),
        row('files', 'File[]', '[]', 'ไฟล์ที่เลือกอยู่ (อ่านและตั้งได้)', 'The chosen files (read and write)'),
        row('disabled', BOOL, 'false', 'ปิดทั้งหมด', 'Disable everything'),
        row('invalidFileSizeMessageSummary · …Detail · invalidFileTypeMessageSummary · …Detail · invalidFileLimitMessageSummary · …Detail', 'string', 'locale', 'ข้อความของไฟล์ที่ไม่ผ่าน ({0} คือชื่อไฟล์ / ขนาด / ชนิด / จำนวน)', 'Messages for rejected files ({0} is the name / size / types / limit)'),
      ],
    },
    {
      id: 'api-look',
      title: { th: 'Inputs · ปุ่มและหน้าตา', en: 'Inputs · buttons and look' },
      rows: [
        row('chooseLabel · uploadLabel · cancelLabel', 'string', 'locale', 'ข้อความบนปุ่ม (ค่าเริ่มต้น เลือก · อัปโหลด · ยกเลิก)', 'Button texts (default Choose · Upload · Cancel)'),
        row('chooseIcon · uploadIcon · cancelIcon', 'string', undefined, 'class ของไอคอน (ไม่ใส่ใช้ไอคอน SVG ในตัว)', 'Icon classes (built-in SVG icons otherwise)'),
        row('showUploadButton · showCancelButton', BOOL, 'true', 'แสดงปุ่มอัปโหลด / ยกเลิก', 'Show the upload / cancel button'),
        row('chooseStyleClass · uploadStyleClass · cancelStyleClass · removeStyleClass', 'string', undefined, "class ของปุ่ม เช่น 'p-button-sm p-button-secondary'", "Button classes, e.g. 'p-button-sm p-button-secondary'"),
        row('previewWidth', 'number', '50', 'ความกว้างของรูปย่อ (px)', 'Thumbnail width (px)'),
        row('style · styleClass · tabindex', 'object · string · number', undefined, 'style / class ของกล่อง และ tabindex ของปุ่มเลือก', 'Box style / class, and the choose button tabindex'),
        row('chooseButtonProps · uploadButtonProps · cancelButtonProps', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onSelect', 'WuFileSelectEvent', undefined, 'เลือกไฟล์แล้ว (files คือไฟล์ที่ผ่านการตรวจ)', 'Files chosen (files are the ones that passed)'),
        row('uploadHandler', 'WuFileUploadHandlerEvent', undefined, 'กดอัปโหลด (customUpload)', 'Upload pressed (customUpload)'),
        row('onValidationFail', 'WuFileValidationFailEvent', undefined, 'ไฟล์ไม่ผ่านการตรวจ', 'A file was turned away'),
        row('onRemove · onClear', 'WuFileRemoveEvent · void', undefined, 'นำไฟล์ออกหนึ่งไฟล์ / ล้างทั้งหมด', 'One file removed / all cleared'),
        row('onBeforeUpload · onSend', 'WuFileBeforeUploadEvent · WuFileSendEvent', undefined, 'ก่อนส่ง (เพิ่ม field ได้) / กำลังส่ง', 'Before posting (add fields) / posting'),
        row('onProgress', 'WuFileProgressEvent', undefined, 'ความคืบหน้า 0–100', 'Progress 0–100'),
        row('onUpload · onError', 'WuFileUploadEvent · WuFileUploadErrorEvent', undefined, 'ส่งสำเร็จ (2xx) / ไม่สำเร็จ', 'Posted (2xx) / failed'),
        row('onRemoveUploadedFile', '{ file, index }', undefined, 'นำไฟล์ที่อัปโหลดแล้วออก', 'An uploaded file removed'),
        row('onImageError', 'Event', undefined, 'รูปย่อโหลดไม่ได้', 'A thumbnail failed to load'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #empty, wuTemplate="empty" หรือ pTemplate="empty" ก็ได้', en: 'Write them as #empty, wuTemplate="empty" or pTemplate="empty".' },
      rows: [
        row('file', '$implicit (file) · index', undefined, 'แต่ละไฟล์ที่เลือก', 'Each chosen file'),
        row('content', 'WuFileUploadContentContext', undefined, 'ใต้ (v1) หรือแทน (v2 / v3) รายการไฟล์', 'Under (v1) or instead of (v2 / v3) the file list'),
        row('header', 'WuFileUploadContentContext', undefined, 'แทนแถบปุ่มทั้งแถบ', 'Replaces the whole button bar'),
        row('toolbar', '—', undefined, 'ต่อท้ายแถบปุ่ม', 'After the buttons'),
        row('empty', '—', undefined, 'เมื่อยังไม่มีไฟล์', 'Before any file is chosen'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน template reference เช่น #fileUpload', en: 'Call them through a template reference such as #fileUpload.' },
      rows: [
        row('choose()', 'void', undefined, 'เปิดหน้าต่างเลือกไฟล์', 'Open the file chooser'),
        row('upload()', 'void', undefined, 'อัปโหลดไฟล์ที่เลือก (ไปที่ url หรือส่ง uploadHandler)', 'Upload the chosen files (to url, or through uploadHandler)'),
        row('clear()', 'void', undefined, 'ล้างไฟล์ที่เลือกและข้อความ', 'Clear the chosen files and the messages'),
        row('remove(event, index) · removeUploadedFile(index)', 'void', undefined, 'นำไฟล์ที่เลือก / ที่อัปโหลดแล้วออก', 'Remove a chosen / uploaded file'),
        row('files · uploadedFiles · progress · msgs', 'File[] · File[] · number · string[]', undefined, 'ไฟล์ที่เลือก ไฟล์ที่อัปโหลดแล้ว ความคืบหน้า และข้อความ', 'Chosen files, uploaded files, progress and messages'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WuFileSelectEvent, WuFileUploadHandlerEvent, WuFileValidationFailEvent } from '@wirabyte/ui/fileupload';

interface WuFileSelectEvent {
  originalEvent: Event;
  files: File[];           // เฉพาะไฟล์ที่ผ่านการตรวจ
  currentFiles: File[];    // ไฟล์ทั้งหมดที่เลือกอยู่
}
interface WuFileUploadHandlerEvent { files: File[] }
interface WuFileValidationFailEvent {
  file: File | null;       // ไฟล์ที่ถูกปฏิเสธ (null เมื่อเกินจำนวน)
  reason: 'type' | 'size' | 'limit';
  message: string;         // ข้อความที่แสดง
}
interface WuFileRemoveEvent { originalEvent: Event; file: File }
interface WuFileBeforeUploadEvent { formData: FormData }
interface WuFileSendEvent { xhr: XMLHttpRequest; formData: FormData }
interface WuFileProgressEvent { originalEvent: ProgressEvent; progress: number }
interface WuFileUploadEvent { originalEvent: Event | XMLHttpRequest; files: File[] }
interface WuFileUploadErrorEvent { xhr: XMLHttpRequest; files: File[] }
interface WuFileUploadContentContext {
  $implicit: File[];
  files: File[];
  uploadedFiles: File[];
  chooseCallback: () => void;
  clearCallback: () => void;
  uploadCallback: () => void;
  removeFileCallback: (event: Event, index: number) => void;
  removeUploadedFileCallback: (index: number) => void;
  progress: number;
  messages: string[];
}`,
    },
  ],
  tokens: [
    tok('--wu-fileupload-border-width', 'ขอบของกล่อง', 'Box border width'),
    tok('--wu-fileupload-radius', 'ความมนของกล่อง', 'Box radius'),
    tok('--wu-fileupload-header-padding', 'ระยะในแถบปุ่ม', 'Button bar padding'),
    tok('--wu-fileupload-header-border-width', 'ขอบของแถบปุ่ม', 'Button bar border width'),
    tok('--wu-fileupload-header-radius', 'ความมนของแถบปุ่ม', 'Button bar radius'),
    tok('--wu-fileupload-header-bg', 'พื้นของแถบปุ่ม', 'Button bar background'),
    tok('--wu-fileupload-content-padding', 'ระยะในพื้นที่วางไฟล์', 'Drop area padding'),
    tok('--wu-fileupload-content-border-width', 'ขอบของพื้นที่วางไฟล์', 'Drop area border width'),
    tok('--wu-fileupload-content-radius', 'ความมนของพื้นที่วางไฟล์', 'Drop area radius'),
    tok('--wu-fileupload-file-gap', 'ระยะระหว่างแถวของไฟล์', 'Gap between file rows'),
    tok('--wu-fileupload-thumb-radius', 'ความมนของรูปย่อ', 'Thumbnail radius'),
    tok('--wu-primary-color', 'เส้นประเมื่อลากไฟล์มาวาง และแถบความคืบหน้า', 'The dashed outline while dropping, and the progress bar'),
  ],
};
