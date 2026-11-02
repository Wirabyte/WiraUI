import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';
const NUM = 'number';

export const IMAGECROPPER_DOC: ComponentDoc = {
  id: 'imagecropper',
  title: 'Image Cropper',
  group: 'Media',
  entry: 'imagecropper',
  standalone: 'WuImageCropper',
  module: 'WuImageCropperModule',
  selector: 'wu-imagecropper',
  description: {
    th: 'ตัดรูปก่อนอัปโหลด เช่น รูปโปรไฟล์หรือรูปหน้าปก รับรูปจากช่องเลือกไฟล์ ไฟล์ URL หรือ base64 ลากกรอบเลือกส่วนที่ต้องการ ซูม หมุน และพลิกได้ แล้วได้ผลลัพธ์เป็น Blob หรือ base64 ในขนาดที่กำหนด รูปจากกล้องมือถือถูกหมุนให้ตั้งตรงเอง',
    en: 'Crops a picture before upload, such as a profile photo or a cover. It takes a picture from a file input, a File, a URL or base64; drag the box over the part you want, zoom, turn and mirror, and get a Blob or base64 at the size you ask for. Photos from phone cameras are turned upright on their own.',
  },
  english: {
    'เลือกรูป': 'Choose a picture',
    'รูปที่ตัดแล้ว': 'Cropped picture',
    'เปิดรูปไม่ได้': 'The picture could not be opened',
    'component คืน URL เก่าให้เอง': 'the component frees the old URL itself',
    'อิสระ': 'Free',
    'รูปโปรไฟล์': 'Profile photo',
    'ไม่เกิน 400 px': 'at most 400 px',
    'หมุนซ้าย': 'Rotate left',
    'หมุนขวา': 'Rotate right',
    'พลิกแนวนอน': 'Flip',
    'ซูมเข้า': 'Zoom in',
    'ซูมออก': 'Zoom out',
    'เริ่มใหม่': 'Reset',
    'ตัดรูป': 'Crop',
    'null เมื่อยังไม่มีรูป': 'null while no picture is loaded',
    'บันทึกรูป': 'Save photo',
    'บันทึกแล้ว': 'Saved',
    'ครั้ง': 'times',
    'ถ้าใช้ output="base64" แปลงกลับเป็นไฟล์ด้วย': 'with output="base64", turn it back into a file with',
    'ตำแหน่งกรอบเป็นพิกเซลของรูป อ่านค่าหรือกำหนดเองได้': 'the box in image pixels: read it or set it',
    'กรอบขนาดตายตัว ย้ายได้แต่ปรับขนาดไม่ได้': 'a fixed-size box: it moves but does not resize',
    'ค่าเริ่มต้น': 'the default',
    'ใส่ใน <img> ได้ทันที': 'ready for an <img>',
    'ตำแหน่งบนจอ (CSS pixel)': 'on screen (CSS pixels)',
    'ตำแหน่งในรูป (พิกเซลของรูป หลังหมุน)': 'in the picture (image pixels, after turning)',
    '1 = ทั้งรูป': '1 = the whole picture',
    'องศา ตามเข็มนาฬิกา': 'degrees, clockwise',
    'ขนาดในไฟล์': 'size as stored in the file',
    'ขนาดหลังหมุนตาม EXIF': 'size upright, after the EXIF orientation',
    'ชื่อเดิมใช้ได้เหมือนกัน': 'the older names work too',
    'ทั้งหมด': 'Everything',
    'ซูม + หมุน': 'Zoom + turn',
    'หมุนอย่างเดียว': 'Turn only',
    'ไม่มี': 'None',
    'ปุ่มในแถบเครื่องมือ': 'Toolbar buttons',
    'ซูม | หมุนซ้าย หมุนขวา': 'zoom | rotate left, rotate right',
    'ไม่มีปุ่มในตัว (template tools ยังแสดง)': 'no built-in buttons (a tools template still shows)',
    'จากตัวแปร': 'from a variable',
    "'|' ขึ้นกลุ่มใหม่": "'|' starts a new group",
    'หรือรายการปุ่ม': 'or a list of buttons',
    'ใช้รูปนี้': 'Use this photo',
    'รูปที่เลือก': 'Chosen photo',
    'ชนิดผลลัพธ์': 'Result type',
    'Blob + objectUrl เหมาะกับการอัปโหลดผ่าน FormData': 'a Blob + objectUrl, for uploading in a FormData',
    'data URL เหมาะกับการเก็บเป็นข้อความหรือ JSON': 'a data URL, for keeping as text or in JSON',
    'เลือกชนิดเฉพาะครั้งตอนเรียก crop() เอง': 'pick the type for one call of crop()',
    'บันทึกเป็นข้อความ': 'Save as text',
    'ส่งขึ้น server': 'to the server',
    'เก็บใน JSON ได้': 'fits in JSON',
    'ครั้งนี้เป็น base64 ไม่ว่า output จะเป็นอะไร': 'base64 this time, whatever output says',
    'ตัวอักษร': 'characters',
    'ทุก wu-imagecropper ในแอปเริ่มจากค่านี้ input ที่ใส่บน component ชนะเสมอ': 'every wu-imagecropper in the app starts from these; an input on the component always wins',
    '…provider อื่นของแอป': "…the app's other providers",
    'ได้ base64 แบบ jpeg 85 และแถบ ซูม | หมุน จากค่าของทั้งแอป': 'base64, jpeg at 85 and a zoom | turn toolbar, from the app-wide values',
    'input บน component ชนะ: ตัวนี้ได้ blob แบบ png': 'inputs on the component win: this one gives a png blob',
    'ซ้าย + ขวา': 'left + right',
    'แนวนอน + แนวตั้ง': 'horizontal + vertical',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuImageCropperModule</code>) และ standalone (<code>WuImageCropper</code>) แท็กเขียนได้ทั้ง <code>wu-imagecropper</code>, <code>wu-imageCropper</code>, <code>wu-image-cropper</code> และ <code>image-cropper</code> (แท็กที่แอปใช้อยู่แล้ว) · <code>base64ToFile()</code> import จาก <code>wiraui/imagecropper</code> (หรือ <code>wiraui/core</code>) ได้',
        en: 'Works as an NgModule (<code>WuImageCropperModule</code>) or standalone (<code>WuImageCropper</code>). The tag can be <code>wu-imagecropper</code>, <code>wu-imageCropper</code>, <code>wu-image-cropper</code> or <code>image-cropper</code> (the tag apps already use) · <code>base64ToFile()</code> comes from <code>wiraui/imagecropper</code> (or <code>wiraui/core</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ส่ง event <code>(change)</code> ของ <code>&lt;input type="file"&gt;</code> เข้า <code>[imageChangedEvent]</code> แล้ว component เปิดไฟล์แรกเอง (หรือส่ง <code>[imageFile]</code>, <code>[imageURL]</code> หรือ <code>[imageBase64]</code> แทน ตัวอย่างนี้เริ่มจากรูปตัวอย่างผ่าน <code>[imageBase64]</code>) · ลากกรอบเพื่อย้าย ลากมุมหรือขอบเพื่อปรับขนาด แถบเครื่องมือด้านล่างซูม หมุน พลิก และเริ่มใหม่ · ทุกครั้งที่กรอบเปลี่ยน <code>(imageCropped)</code> ได้รูปที่ตัดแล้ว ค่าเริ่มต้นเป็น <code>blob</code> พร้อม <code>objectUrl</code> ที่ใส่ใน <code>&lt;img&gt;</code> ได้ทันที (component คืน URL เก่าให้เอง) และ <code>width</code> / <code>height</code> · <code>(loadImageFailed)</code> เมื่อเปิดรูปไม่ได้ · กล่องคงความสูงเท่าตอนที่รูปเปิดขึ้น หมุนรูปแล้วหน้าเว็บจึงไม่ขยับ (รูปที่หมุนถูกย่อให้พอดีในกล่อง)',
        en: 'Pass the <code>(change)</code> event of an <code>&lt;input type="file"&gt;</code> to <code>[imageChangedEvent]</code> and the component opens its first file (or pass <code>[imageFile]</code>, <code>[imageURL]</code> or <code>[imageBase64]</code>; this demo starts from a sample picture through <code>[imageBase64]</code>) · drag the box to move it and its corners or edges to resize it; the toolbar underneath zooms, turns, mirrors and resets · after every change <code>(imageCropped)</code> brings the cropped picture: a <code>blob</code> by default, with an <code>objectUrl</code> ready for an <code>&lt;img&gt;</code> (the component frees the old URL itself), plus <code>width</code> / <code>height</code> · <code>(loadImageFailed)</code> fires when the picture cannot be opened · the cropper keeps the height it had when the picture loaded, so turning the picture does not move the page (a turned picture is fitted inside).',
      },
    },
    ratio: {
      title: { th: 'สัดส่วนของกรอบ', en: 'Aspect ratio' },
      text: {
        th: '<code>[aspectRatio]</code> เป็นตัวเลข (<code>1</code>, <code>4 / 3</code>) หรือข้อความ (<code>\'4/3\'</code>, <code>\'16:9\'</code>) ค่าเริ่มต้น 1 · <code>[maintainAspectRatio]="false"</code> ปรับกรอบได้อิสระ · เปลี่ยนค่าระหว่างใช้งานได้',
        en: '<code>[aspectRatio]</code> is a number (<code>1</code>, <code>4 / 3</code>) or text (<code>\'4/3\'</code>, <code>\'16:9\'</code>), 1 by default · <code>[maintainAspectRatio]="false"</code> frees the box · both can change while the cropper is open.',
      },
    },
    round: {
      title: { th: 'กรอบวงกลม', en: 'Round box' },
      text: {
        th: '<code>[roundCropper]="true"</code> แสดงกรอบเป็นวงกลม เหมาะกับรูปโปรไฟล์ที่แสดงในวงกลม ผลลัพธ์ยังเป็นสี่เหลี่ยม จึงใส่ <code>border-radius: 50%</code> ตอนแสดง · <code>[hideResizeSquares]="true"</code> ซ่อนจุดจับ (ยังลากมุมและขอบได้)',
        en: '<code>[roundCropper]="true"</code> draws the box as a circle, for a profile photo shown in a circle; the result is still a rectangle, so show it with <code>border-radius: 50%</code> · <code>[hideResizeSquares]="true"</code> hides the handles (corners and edges can still be dragged).',
      },
    },
    toolbar: {
      title: { th: 'เลือกปุ่มในแถบเครื่องมือ', en: 'Choosing the toolbar tools' },
      text: {
        th: '<code>toolbar</code> เลือกปุ่มในตัวที่แถบเครื่องมือมี: <code>\'full\'</code> (ค่าเริ่มต้น ครบทุกปุ่ม), <code>\'none\'</code> (ไม่มีปุ่มในตัว แต่ template <code>tools</code> ยังแสดง) หรือรายการปุ่ม <code>zoomOut</code>, <code>zoomSlider</code>, <code>zoomIn</code>, <code>rotateLeft</code>, <code>rotateRight</code>, <code>flipHorizontal</code>, <code>flipVertical</code>, <code>reset</code> และชื่อย่อ <code>zoom</code> (ซูมออก + แถบเลื่อน + ซูมเข้า), <code>rotate</code> (หมุนซ้าย + ขวา), <code>flip</code> (พลิกแนวนอน + แนวตั้ง) · <code>\'|\'</code> ขึ้นกลุ่มใหม่ ถ้าไม่ใส่ ปุ่มซูมเป็นกลุ่มหนึ่งและที่เหลืออีกกลุ่ม · <code>[showToolbar]="false"</code> ยังซ่อนทั้งแถบได้เหมือนเดิม · เลือกชุดปุ่มด้านล่างเพื่อดูผล',
        en: '<code>toolbar</code> picks the built-in buttons: <code>\'full\'</code> (the default, every button), <code>\'none\'</code> (no built-in buttons, though a <code>tools</code> template still shows) or a list of <code>zoomOut</code>, <code>zoomSlider</code>, <code>zoomIn</code>, <code>rotateLeft</code>, <code>rotateRight</code>, <code>flipHorizontal</code>, <code>flipVertical</code>, <code>reset</code> and the shorthands <code>zoom</code> (zoom out + slider + zoom in), <code>rotate</code> (rotate left + right) and <code>flip</code> (horizontal + vertical) · <code>\'|\'</code> starts a new group; without it the zoom tools make one group and the rest another · <code>[showToolbar]="false"</code> still hides the whole bar · pick a set below to see it.',
      },
    },
    'tools-template': {
      title: { th: 'ปุ่มของแอปในแถบเครื่องมือ', en: 'Your own buttons in the toolbar' },
      text: {
        th: 'template ชื่อ <code>tools</code> (<code>&lt;ng-template #tools let-cropper&gt;</code> ใน v3 หรือ <code>wuTemplate="tools"</code> ใน v1 / v2) วาดเป็นกลุ่มสุดท้ายของแถบเครื่องมือ <code>let-cropper</code> คือตัว cropper เอง ปุ่มจึงเรียก <code>cropper.crop()</code>, <code>cropper.rotateRight()</code>, <code>cropper.zoomIn()</code>, <code>cropper.reset()</code> ฯลฯ ได้เลยโดยไม่ต้องมี template ref · ตัวอย่างแรกมีปุ่ม <b>ใช้รูปนี้</b> ที่ตัดรูปแล้วแสดงผล ตัวอย่างที่สองใช้ <code>toolbar="none"</code> แล้วมีเฉพาะปุ่มหมุนของแอปเอง',
        en: 'A template named <code>tools</code> (<code>&lt;ng-template #tools let-cropper&gt;</code> in v3, <code>wuTemplate="tools"</code> in v1 / v2) is drawn as the last group of the toolbar. <code>let-cropper</code> is the cropper itself, so buttons call <code>cropper.crop()</code>, <code>cropper.rotateRight()</code>, <code>cropper.zoomIn()</code>, <code>cropper.reset()</code> and so on with no template ref · the first demo has a <b>Use this photo</b> button that crops and shows the result; the second sets <code>toolbar="none"</code> and keeps only its own turn buttons.',
      },
    },
    'output-type': {
      title: { th: 'ผลเป็น Blob หรือ base64', en: 'Blob or base64 result' },
      text: {
        th: '<code>output</code> เลือกชนิดของผลใน <code>(imageCropped)</code>: <code>\'blob\'</code> (ค่าเริ่มต้น) ได้ <code>event.blob</code> กับ <code>event.objectUrl</code> เหมาะกับการอัปโหลดผ่าน <code>FormData</code> และแสดงใน <code>&lt;img&gt;</code> · <code>\'base64\'</code> ได้ <code>event.base64</code> เป็น data URL (<code>data:image/png;base64,…</code>) เหมาะกับการเก็บเป็นข้อความหรือใน JSON · เรียก <code>crop(\'base64\')</code> หรือ <code>crop(\'blob\')</code> เพื่อเลือกชนิดเฉพาะครั้งนั้น (คืน Promise ของ event เดียวกัน) · สลับชนิดหรือกดปุ่ม crop() ด้านล่างแล้วดูว่า event มีอะไรบ้าง',
        en: '<code>output</code> picks what <code>(imageCropped)</code> brings: <code>\'blob\'</code> (the default) gives <code>event.blob</code> and <code>event.objectUrl</code>, for uploading in a <code>FormData</code> and showing in an <code>&lt;img&gt;</code> · <code>\'base64\'</code> gives <code>event.base64</code>, a data URL (<code>data:image/png;base64,…</code>), for keeping as text or in JSON · <code>crop(\'base64\')</code> or <code>crop(\'blob\')</code> picks the type for that one call (a Promise of the same event) · switch the type or press a crop() button below and see what the event holds.',
      },
    },
    output: {
      title: { th: 'ขนาดและชนิดไฟล์', en: 'Size and file type' },
      text: {
        th: '<code>[resizeToWidth]</code> / <code>[resizeToHeight]</code> ย่อหรือขยายผลลัพธ์เป็นขนาดนั้น (0 = ขนาดของกรอบ ใส่ทั้งคู่ได้รูปที่พอดีทั้งสองด้าน) และ <code>[onlyScaleDown]="true"</code> ไม่ขยายรูปที่เล็กกว่า · <code>format</code> เป็น <code>png</code> (ค่าเริ่มต้น), <code>jpeg</code>, <code>webp</code>, <code>bmp</code> หรือ <code>ico</code> (สองแบบหลังออกมาเป็น png) และ <code>[imageQuality]</code> 0–100 (ค่าเริ่มต้น 92) ใช้กับ jpeg / webp · <code>backgroundColor</code> ใส่สีให้พื้นที่โปร่งใส (jpeg ที่ไม่ใส่ได้สีขาว) · <code>output="base64"</code> ได้ data URL แทน blob (ดูหัวข้อผลเป็น Blob หรือ base64) · ผลลัพธ์ใหญ่ได้ไม่เกิน 16.7 ล้านพิกเซล (ขีดจำกัดของ canvas บน iOS)',
        en: '<code>[resizeToWidth]</code> / <code>[resizeToHeight]</code> scale the result to that size (0 = the size of the box; with both, it fits inside both), and <code>[onlyScaleDown]="true"</code> never enlarges a smaller crop · <code>format</code> is <code>png</code> (the default), <code>jpeg</code>, <code>webp</code>, <code>bmp</code> or <code>ico</code> (the last two come out as png), and <code>[imageQuality]</code> 0–100 (92 by default) applies to jpeg / webp · <code>backgroundColor</code> fills transparent areas (jpeg without one gets white) · <code>output="base64"</code> gives a data URL instead of a blob (see Blob or base64 result) · the result is capped at 16.7 megapixels (the iOS canvas limit).',
      },
    },
    tools: {
      title: { th: 'ปุ่มของแอปเอง', en: 'Your own buttons' },
      text: {
        th: 'ปุ่มนอก cropper: <code>[showToolbar]="false"</code> ซ่อนแถบเครื่องมือในตัว (หรือเลือกบางปุ่มด้วย <code>toolbar</code>) แล้วทำปุ่มเองผ่าน template ref: <code>rotateLeft()</code>, <code>rotateRight()</code>, <code>flipHorizontal()</code>, <code>flipVertical()</code>, <code>zoomIn()</code>, <code>zoomOut()</code>, <code>resetCrop()</code> (กรอบกลับที่เดิม) และ <code>reset()</code> (ล้างการซูม หมุน และพลิกด้วย) · <code>[(transform)]</code> บอกค่าซูม มุม และการพลิก · <code>[autoCrop]="false"</code> ไม่ตัดเองทุกครั้งที่ขยับ แล้วเรียก <code>crop()</code> ซึ่งคืน Promise ของผลลัพธ์',
        en: 'Buttons outside the cropper: <code>[showToolbar]="false"</code> hides the built-in toolbar (or <code>toolbar</code> keeps some of its buttons); make your own buttons through a template ref: <code>rotateLeft()</code>, <code>rotateRight()</code>, <code>flipHorizontal()</code>, <code>flipVertical()</code>, <code>zoomIn()</code>, <code>zoomOut()</code>, <code>resetCrop()</code> (the box goes back) and <code>reset()</code> (zoom, turns and mirrors too) · <code>[(transform)]</code> tells the zoom, angle and mirroring · <code>[autoCrop]="false"</code> stops cropping on every change; call <code>crop()</code>, which returns a Promise of the result.',
      },
    },
    upload: {
      title: { th: 'อัปโหลด', en: 'Upload' },
      text: {
        th: 'ส่ง <code>event.blob</code> ขึ้น server ผ่าน <code>FormData</code> ได้เลย ปุ่มบันทึกใช้ <code>[loading]="isApiSaving"</code> · ถ้าใช้ <code>output="base64"</code> แปลงกลับเป็นไฟล์ด้วย <code>base64ToFile(event.base64)</code> ไม่ต้องเขียนฟังก์ชันเอง',
        en: 'Send <code>event.blob</code> to the server in a <code>FormData</code> as it is; the save button uses <code>[loading]="isApiSaving"</code> · with <code>output="base64"</code>, turn it back into a file with <code>base64ToFile(event.base64)</code> instead of a function of your own.',
      },
    },
    defaults: {
      title: { th: 'ค่าเริ่มต้นของทั้งแอป', en: 'App-wide defaults' },
      text: {
        th: '<code>provideImageCropperOptions()</code> จาก <code>wiraui/imagecropper</code> ตั้งค่าเริ่มต้นให้ทุก cropper ในแอป: <code>output</code>, <code>format</code>, <code>imageQuality</code>, <code>toolbar</code> และ <code>maxZoom</code> · ใส่ใน <code>providers</code> ของ <code>app.config.ts</code> (v3) หรือของ NgModule (v1 / v2) · input ที่ใส่บน component ชนะค่าเหล่านี้เสมอ',
        en: '<code>provideImageCropperOptions()</code> from <code>wiraui/imagecropper</code> sets the starting values of every cropper in the app: <code>output</code>, <code>format</code>, <code>imageQuality</code>, <code>toolbar</code> and <code>maxZoom</code> · put it in the <code>providers</code> of <code>app.config.ts</code> (v3) or of the NgModule (v1 / v2) · an input set on the component always wins over them.',
      },
    },
    limits: {
      title: { th: 'ขนาดกรอบ ตำแหน่ง และการหมุน', en: 'Box limits, position and turning' },
      text: {
        th: 'ขนาดของกรอบเป็นพิกเซลของรูป: <code>cropperMinWidth</code> / <code>cropperMinHeight</code> / <code>cropperMaxWidth</code> / <code>cropperMaxHeight</code> จำกัดขนาด และ <code>cropperStaticWidth</code> + <code>cropperStaticHeight</code> ทำกรอบขนาดตายตัว (ย้ายได้แต่ไม่มีจุดจับ) · <code>[(cropper)]</code> อ่านหรือกำหนดตำแหน่ง <code>{ x1, y1, x2, y2 }</code> · <code>[containWithinAspectRatio]="true"</code> เติมขอบให้รูปทั้งรูปอยู่ในกรอบได้ (สีจาก <code>backgroundColor</code>) · <code>[canvasRotation]</code> หมุนทีละ 90° ส่วน <code>rotation</code> (องศา), <code>zoom</code> และ <code>maxZoom</code> (ค่าเริ่มต้น 10) ตั้งจากโค้ดได้ · <code>alignImage="left"</code> วางรูปชิดซ้ายเมื่อรูปแคบกว่ากล่อง · <code>[disabled]="true"</code> ล็อกทั้งหมด · ความสูงของกล่องตั้งตอนที่รูปเปิด การหมุนจึงไม่ทำให้กล่องสูงขึ้นหรือหน้าเลื่อน',
        en: 'The box is measured in image pixels: <code>cropperMinWidth</code> / <code>cropperMinHeight</code> / <code>cropperMaxWidth</code> / <code>cropperMaxHeight</code> limit it, and <code>cropperStaticWidth</code> + <code>cropperStaticHeight</code> fix its size (it moves but has no handles) · <code>[(cropper)]</code> reads or sets its position, <code>{ x1, y1, x2, y2 }</code> · <code>[containWithinAspectRatio]="true"</code> pads the picture so all of it fits in the box (filled with <code>backgroundColor</code>) · <code>[canvasRotation]</code> turns by quarter turns, and <code>rotation</code> (degrees), <code>zoom</code> and <code>maxZoom</code> (10 by default) can be set from code · <code>alignImage="left"</code> puts a picture narrower than the box at the left · <code>[disabled]="true"</code> locks everything · the box\'s height is set when the picture opens, so turning never makes it taller or moves the page.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด มือถือ และ ARIA', en: 'Keyboard, touch and ARIA' },
      text: {
        th: 'กด Tab ไปที่กรอบแล้วใช้ลูกศรย้ายกรอบ (กด <code>Shift</code> ด้วยเลื่อนทีละ 10 เท่า) <code>Alt</code> + ลูกศรปรับขนาด และ <code>+</code> / <code>−</code> ขยาย / ย่อกรอบ · <code>Ctrl</code> + ล้อเมาส์ หรือถ่างสองนิ้วบนจอสัมผัส ซูมรูป และเมื่อซูมอยู่ ลากนอกกรอบเพื่อเลื่อนรูป · รูป JPEG จากกล้องมือถือถูกหมุนให้ตั้งตรงตาม EXIF เอง (<code>(imageLoaded)</code> บอกขนาดในไฟล์ ขนาดหลังหมุน และค่า EXIF) · กรอบเป็น <code>role="group"</code> ที่บอกขนาดปัจจุบัน ชื่อจาก <code>cropperFrameAriaLabel</code> หรือ locale (<code>cropArea</code>) พร้อมคำแนะนำการใช้คีย์บอร์ด และ <code>imageAltText</code> อธิบายรูปให้โปรแกรมอ่านจอ',
        en: 'Tab to the box and move it with the arrow keys (with <code>Shift</code>, ten times as far), resize it with <code>Alt</code> + arrows, and grow / shrink it with <code>+</code> / <code>−</code> · <code>Ctrl</code> + wheel, or a pinch on a touch screen, zooms, and while zoomed in, dragging outside the box pans · JPEG photos from phone cameras are turned upright from their EXIF orientation (<code>(imageLoaded)</code> tells the stored size, the upright size and the EXIF values) · the box is a <code>role="group"</code> that announces its size, named by <code>cropperFrameAriaLabel</code> or the locale (<code>cropArea</code>) with a keyboard hint, and <code>imageAltText</code> describes the picture to screen readers.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'แอปที่ใช้แท็ก <code>&lt;image-cropper&gt;</code> อยู่แล้ว: import <code>WuImageCropperModule</code> (หรือ <code>WuImageCropper</code>) แทน module เดิม แท็ก input และ event ใช้ชื่อเดิมได้ type ชื่อเดิม (<code>ImageCroppedEvent</code>, <code>ImageTransform</code>, <code>LoadedImage</code>, <code>Dimensions</code>, <code>OutputFormat</code>) import จาก <code>wiraui/imagecropper</code> เปลี่ยนแค่ path · ผลลัพธ์ค่าเริ่มต้นเป็น <code>blob</code> โค้ดที่อ่าน <code>event.base64</code> ให้ใส่ <code>output="base64"</code> · ฟังก์ชันแปลง base64 เป็นไฟล์ที่แอปเขียนเองเปลี่ยนเป็น <code>base64ToFile()</code> ได้ · <code>allowMoveImage</code>, <code>initialStepSize</code>, <code>checkImageType</code> และ <code>options</code> รับไว้เพื่อให้ template เดิมใช้ได้',
        en: 'Apps that already use the <code>&lt;image-cropper&gt;</code> tag: import <code>WuImageCropperModule</code> (or <code>WuImageCropper</code>) instead of the old module; the tag, inputs and events keep their names, and the types keep theirs too (<code>ImageCroppedEvent</code>, <code>ImageTransform</code>, <code>LoadedImage</code>, <code>Dimensions</code>, <code>OutputFormat</code>), imported from <code>wiraui/imagecropper</code>, so only the path changes · the result is a <code>blob</code> by default: code that reads <code>event.base64</code> adds <code>output="base64"</code> · a base64-to-file function of your own can become <code>base64ToFile()</code> · <code>allowMoveImage</code>, <code>initialStepSize</code>, <code>checkImageType</code> and <code>options</code> are accepted so existing templates compile.',
      },
    },
  },
  code: {
    basic: {
      v3: `<input type="file" accept="image/*" (change)="fileChangeEvent($event)" />
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1"
  (imageCropped)="imageCropped($event)" (loadImageFailed)="loadImageFailed()"></wu-imagecropper>
@if (isLoadFailed) {
  <p>เปิดรูปไม่ได้</p>
}
@if (croppedUrl) {
  <img [src]="croppedUrl" alt="รูปที่ตัดแล้ว" width="160" />
  <span>{{ croppedSize }}</span>
}`,
      classic: `<input type="file" accept="image/*" (change)="fileChangeEvent($event)" />
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1"
  (imageCropped)="imageCropped($event)" (loadImageFailed)="loadImageFailed()"></wu-imagecropper>
<p *ngIf="isLoadFailed">เปิดรูปไม่ได้</p>
<ng-container *ngIf="croppedUrl">
  <img [src]="croppedUrl" alt="รูปที่ตัดแล้ว" width="160" />
  <span>{{ croppedSize }}</span>
</ng-container>`,
    },
    ratio: `<wu-selectbutton [options]="ratios" optionLabel="label" optionValue="value" [(ngModel)]="ratio" [allowEmpty]="false"></wu-selectbutton>
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="ratio" [maintainAspectRatio]="ratio !== 'free'"
  (imageCropped)="imageCropped($event)"></wu-imagecropper>`,
    round: `<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1" [roundCropper]="true" [resizeToWidth]="256"
  (imageCropped)="imageCropped($event)"></wu-imagecropper>
<img [src]="croppedUrl" alt="รูปโปรไฟล์" width="96" height="96" style="border-radius: 50%" />`,
    output: `<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="4 / 3" format="jpeg" [imageQuality]="80"
  [resizeToWidth]="400" [onlyScaleDown]="true" backgroundColor="#ffffff"
  (imageCropped)="imageCropped($event)"></wu-imagecropper>`,
    tools: `<wu-imagecropper #photoCropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="16 / 9"
  [showToolbar]="false" [autoCrop]="false" [(transform)]="transform"></wu-imagecropper>
<wu-button label="หมุนซ้าย" icon="wi wi-undo" severity="secondary" [outlined]="true" (onClick)="photoCropper.rotateLeft()"></wu-button>
<wu-button label="หมุนขวา" icon="wi wi-refresh" severity="secondary" [outlined]="true" (onClick)="photoCropper.rotateRight()"></wu-button>
<wu-button label="พลิกแนวนอน" severity="secondary" [outlined]="true" (onClick)="photoCropper.flipHorizontal()"></wu-button>
<wu-button label="ซูมเข้า" icon="wi wi-plus" severity="secondary" [outlined]="true" (onClick)="photoCropper.zoomIn()"></wu-button>
<wu-button label="ซูมออก" icon="wi wi-minus" severity="secondary" [outlined]="true" (onClick)="photoCropper.zoomOut()"></wu-button>
<wu-button label="เริ่มใหม่" severity="secondary" [text]="true" (onClick)="photoCropper.reset()"></wu-button>
<wu-button label="ตัดรูป" icon="wi wi-check" (onClick)="cropNow(photoCropper)"></wu-button>`,
    toolbar: `<!-- ซูม | หมุนซ้าย หมุนขวา -->
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [toolbar]="['zoom', '|', 'rotateLeft', 'rotateRight']"
  (imageCropped)="imageCropped($event)"></wu-imagecropper>

<!-- หมุนอย่างเดียว -->
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [toolbar]="['rotate']"></wu-imagecropper>

<!-- ไม่มีปุ่มในตัว (template tools ยังแสดง) -->
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" toolbar="none"></wu-imagecropper>

<!-- จากตัวแปร -->
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [toolbar]="tools"></wu-imagecropper>`,
    'tools-template': {
      v3: `<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1">
  <ng-template #tools let-cropper>
    <wu-button label="ใช้รูปนี้" icon="wi wi-check" size="small" (onClick)="usePhoto(cropper)"></wu-button>
  </ng-template>
</wu-imagecropper>
@if (photoUrl) {
  <img [src]="photoUrl" alt="รูปที่เลือก" width="120" />
}`,
      classic: `<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1">
  <ng-template wuTemplate="tools" let-cropper>
    <wu-button label="ใช้รูปนี้" icon="wi wi-check" size="small" (onClick)="usePhoto(cropper)"></wu-button>
  </ng-template>
</wu-imagecropper>
<img *ngIf="photoUrl" [src]="photoUrl" alt="รูปที่เลือก" width="120" />`,
    },
    'tools-rotate': `<wu-imagecropper [imageChangedEvent]="imageChangedEvent" toolbar="none">
  <ng-template #tools let-cropper>
    <wu-button icon="wi wi-undo" severity="secondary" [text]="true" [rounded]="true" ariaLabel="หมุนซ้าย" (onClick)="cropper.rotateLeft()"></wu-button>
    <wu-button icon="wi wi-refresh" severity="secondary" [text]="true" [rounded]="true" ariaLabel="หมุนขวา" (onClick)="cropper.rotateRight()"></wu-button>
  </ng-template>
</wu-imagecropper>`,
    'output-type': `<!-- output="blob" (ค่าเริ่มต้น): Blob + objectUrl เหมาะกับการอัปโหลดผ่าน FormData -->
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" output="blob"
  (imageCropped)="blobCropped($event)"></wu-imagecropper>

<!-- output="base64": data URL เหมาะกับการเก็บเป็นข้อความหรือ JSON -->
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" output="base64"
  (imageCropped)="base64Cropped($event)"></wu-imagecropper>

<!-- เลือกชนิดเฉพาะครั้งตอนเรียก crop() เอง -->
<wu-imagecropper #photoCropper [imageChangedEvent]="imageChangedEvent" [autoCrop]="false"></wu-imagecropper>
<wu-button label="บันทึกเป็นข้อความ" icon="wi wi-save" (onClick)="saveAsText(photoCropper)"></wu-button>`,
    defaults: `<!-- ได้ base64 แบบ jpeg 85 และแถบ ซูม | หมุน จากค่าของทั้งแอป -->
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" (imageCropped)="imageCropped($event)"></wu-imagecropper>

<!-- input บน component ชนะ: ตัวนี้ได้ blob แบบ png -->
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" output="blob" format="png"
  (imageCropped)="imageCropped($event)"></wu-imagecropper>`,
    upload: `<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1" [resizeToWidth]="512" [onlyScaleDown]="true"
  (imageCropped)="photoCropped($event)"></wu-imagecropper>
<wu-button label="บันทึกรูป" icon="wi wi-upload" [loading]="isApiSaving" [disabled]="!photoBlob" (onClick)="savePhoto()"></wu-button>`,
    limits: `<wu-imagecropper [imageFile]="file" aspectRatio="16:9" [cropperMinWidth]="320" [cropperMaxWidth]="1920" [(cropper)]="cropBox"
  [containWithinAspectRatio]="true" backgroundColor="#ffffff" [canvasRotation]="1" alignImage="left"></wu-imagecropper>

<!-- กรอบขนาดตายตัว ย้ายได้แต่ปรับขนาดไม่ได้ -->
<wu-imagecropper [imageFile]="file" [cropperStaticWidth]="600" [cropperStaticHeight]="200"></wu-imagecropper>`,
  },
  ts: {
    basic: `import { WuImageCroppedEvent } from 'wiraui/imagecropper';

imageChangedEvent: Event | null = null;
croppedUrl = '';
croppedSize = '';
isLoadFailed = false;

fileChangeEvent(event: Event): void {
  this.imageChangedEvent = event;
  this.isLoadFailed = false;
}

imageCropped(event: WuImageCroppedEvent): void {
  this.croppedUrl = event.objectUrl ?? '';   // component คืน URL เก่าให้เอง
  this.croppedSize = event.width + ' × ' + event.height;
}

loadImageFailed(): void {
  this.isLoadFailed = true;
}`,
    ratio: `ratios = [
  { label: '1:1', value: '1' },
  { label: '4:3', value: '4/3' },
  { label: '16:9', value: '16/9' },
  { label: 'อิสระ', value: 'free' },
];
ratio = '4/3';`,
    output: `croppedSize = '';
fileSize = '';

imageCropped(event: WuImageCroppedEvent): void {
  this.croppedSize = event.width + ' × ' + event.height;   // ไม่เกิน 400 px
  this.fileSize = Math.round((event.blob?.size ?? 0) / 1024) + ' KB';
}`,
    tools: `import { WuImageCropper, WuImageTransform } from 'wiraui/imagecropper';

transform: WuImageTransform = { scale: 1, rotate: 0, flipH: false, flipV: false };
croppedUrl = '';

async cropNow(cropper: WuImageCropper): Promise<void> {
  const event = await cropper.crop();   // null เมื่อยังไม่มีรูป
  this.croppedUrl = event?.objectUrl ?? '';
}`,
    toolbar: `import { WuImageCropperToolbar } from 'wiraui/imagecropper';

// 'full' (ค่าเริ่มต้น) · 'none' · หรือรายการปุ่ม: '|' ขึ้นกลุ่มใหม่
tools: WuImageCropperToolbar = ['zoomOut', 'zoomIn', '|', 'rotate', '|', 'flipHorizontal', 'reset'];`,
    'tools-template': `import { WuImageCropper } from 'wiraui/imagecropper';

photoUrl = '';

async usePhoto(cropper: WuImageCropper): Promise<void> {
  const event = await cropper.crop();   // null เมื่อยังไม่มีรูป
  this.photoUrl = event?.objectUrl ?? '';
}`,
    'output-type': `import { WuImageCropper, WuImageCroppedEvent } from 'wiraui/imagecropper';

photoBlob: Blob | null = null;
previewUrl = '';
photoBase64 = '';

blobCropped(event: WuImageCroppedEvent): void {
  this.photoBlob = event.blob ?? null;       // ส่งขึ้น server: formData.append('photo', this.photoBlob)
  this.previewUrl = event.objectUrl ?? '';   // ใส่ใน <img> ได้ทันที
}

base64Cropped(event: WuImageCroppedEvent): void {
  this.photoBase64 = event.base64 ?? '';     // 'data:image/png;base64,…' เก็บใน JSON ได้
}

async saveAsText(cropper: WuImageCropper): Promise<void> {
  const event = await cropper.crop('base64');   // ครั้งนี้เป็น base64 ไม่ว่า output จะเป็นอะไร
  this.photoBase64 = event?.base64 ?? '';
}`,
    defaults: {
      v3: `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideImageCropperOptions } from 'wiraui/imagecropper';

export const appConfig: ApplicationConfig = {
  providers: [
    // …provider อื่นของแอป
    // ทุก wu-imagecropper ในแอปเริ่มจากค่านี้ input ที่ใส่บน component ชนะเสมอ
    provideImageCropperOptions({ output: 'base64', format: 'jpeg', imageQuality: 85, toolbar: ['zoom', '|', 'rotate'] }),
  ],
};`,
      classic: `// app.module.ts
import { NgModule } from '@angular/core';
import { provideImageCropperOptions, WuImageCropperModule } from 'wiraui/imagecropper';

@NgModule({
  imports: [WuImageCropperModule],
  providers: [
    // ทุก wu-imagecropper ในแอปเริ่มจากค่านี้ input ที่ใส่บน component ชนะเสมอ
    provideImageCropperOptions({ output: 'base64', format: 'jpeg', imageQuality: 85, toolbar: ['zoom', '|', 'rotate'] }),
  ],
})
export class AppModule {}`,
    },
    upload: `import { base64ToFile, WuImageCroppedEvent } from 'wiraui/imagecropper';

photoBlob: Blob | null = null;
isApiSaving = false;

photoCropped(event: WuImageCroppedEvent): void {
  this.photoBlob = event.blob ?? null;
  // ถ้าใช้ output="base64" แปลงกลับเป็นไฟล์ด้วย base64ToFile
  // this.photoBlob = base64ToFile(event.base64 ?? '');
}

savePhoto(): void {
  if (!this.photoBlob) return;
  const formData = new FormData();
  formData.append('photo', this.photoBlob, 'profile.png');
  this.isApiSaving = true;
  this.accountService.updateProfileImage(formData).subscribe({
    next: () => (this.isApiSaving = false),
    error: () => (this.isApiSaving = false),
  });
}`,
    limits: `import { CropperPosition } from 'wiraui/imagecropper';

file: File | null = null;
/** ตำแหน่งกรอบเป็นพิกเซลของรูป อ่านค่าหรือกำหนดเองได้ */
cropBox: CropperPosition = { x1: 0, y1: 0, x2: 1280, y2: 720 };`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('imageChangedEvent', 'Event', undefined, 'event (change) ของ input type="file" เปิดไฟล์แรกของ target', 'The (change) event of an input type="file"; its first file is opened'),
        row('imageFile', 'File | Blob', undefined, 'ไฟล์ที่เลือก หรือ Blob ของรูป', 'A picked file, or any image Blob'),
        row('imageURL', 'string', undefined, 'URL ของรูป (โดเมนเดียวกัน หรือเปิด CORS จึงอ่านผลลัพธ์ได้)', 'An image URL (same origin, or served with CORS so the result can be read)'),
        row('imageBase64', 'string', undefined, 'data URL หรือ base64 เปล่า', 'A data URL or bare base64'),
        row('format', "'png' | 'jpeg' | 'webp' | 'bmp' | 'ico'", "'png'", 'ชนิดของผลลัพธ์ (bmp / ico ออกมาเป็น png)', 'Type of the result (bmp / ico come out as png)'),
        row('imageQuality', NUM, '92', 'คุณภาพ 0–100 ของ jpeg / webp', 'Quality 0–100 for jpeg / webp'),
        row('output', "'blob' | 'base64'", "'blob'", 'ผลใน imageCropped: blob + objectUrl (อัปโหลดผ่าน FormData) หรือ base64 เป็น data URL (เก็บเป็นข้อความ)', 'What imageCropped brings: blob + objectUrl (upload in a FormData) or base64, a data URL (keep as text)'),
        row('resizeToWidth · resizeToHeight', NUM, '0', 'ขนาดผลลัพธ์เป็นพิกเซล (0 = ขนาดของกรอบ ใส่ทั้งคู่ได้รูปที่พอดีทั้งสองด้าน)', 'Result size in pixels (0 = the size of the box; with both, it fits inside both)'),
        row('onlyScaleDown', BOOL, 'false', 'ไม่ขยายกรอบที่เล็กกว่า resizeTo…', 'Never enlarge a crop smaller than resizeTo…'),
        row('backgroundColor', 'string', undefined, 'สีของพื้นที่โปร่งใส (jpeg ที่ไม่ใส่ได้สีขาว)', 'Fill for transparent areas (jpeg without one gets white)'),
        row('autoCrop', BOOL, 'true', 'ตัดเองทุกครั้งที่ขยับ (false: เรียก crop() เอง)', 'Crop after every change (false: call crop() yourself)'),
        row('aspectRatio', 'number | string', '1', "สัดส่วนกว้าง / สูง เช่น 4 / 3, '4/3', '16:9'", "Width / height, e.g. 4 / 3, '4/3', '16:9'"),
        row('maintainAspectRatio', BOOL, 'true', 'คงสัดส่วนตอนปรับขนาด', 'Keep the ratio while resizing'),
        row('containWithinAspectRatio', BOOL, 'false', 'เติมขอบให้รูปทั้งรูปอยู่ในกรอบได้', 'Pad the picture so all of it fits in the box'),
        row('cropperMinWidth · cropperMinHeight · cropperMaxWidth · cropperMaxHeight', NUM, '0', 'ขนาดต่ำสุด / สูงสุดของกรอบ (พิกเซลของรูป 0 = ไม่จำกัด)', 'Smallest / largest box (image pixels; 0 = none)'),
        row('cropperStaticWidth · cropperStaticHeight', NUM, '0', 'กรอบขนาดตายตัว (ใส่ทั้งคู่) ย้ายได้แต่ปรับขนาดไม่ได้', 'A fixed-size box (set both); it moves but does not resize'),
        row('roundCropper', BOOL, 'false', 'กรอบวงกลม (ผลลัพธ์ยังเป็นสี่เหลี่ยม)', 'A round box (the result is still a rectangle)'),
        row('hideResizeSquares', BOOL, 'false', 'ซ่อนจุดจับ (ยังลากมุมและขอบได้)', 'Hide the handles (corners and edges still drag)'),
        row('cropper', 'CropperPosition', undefined, 'ตำแหน่งกรอบในพิกเซลของรูป (สองทาง [(cropper)])', 'The box in image pixels (two-way [(cropper)])'),
        row('canvasRotation', NUM, '0', 'หมุนทีละ 90° ตามเข็มนาฬิกา (ติดลบ = ทวนเข็ม)', 'Quarter turns clockwise (negative = anticlockwise)'),
        row('transform', 'WuImageTransform', undefined, 'ซูม มุม และการพลิก (สองทาง [(transform)] แถบเครื่องมือเปลี่ยนค่านี้ด้วย)', 'Zoom, angle and mirroring (two-way [(transform)]; the toolbar changes it too)'),
        row('rotation · zoom', NUM, undefined, 'มุมเป็นองศา / ซูม (1 = ทั้งรูป) ใช้แทนค่าใน transform', 'Angle in degrees / zoom (1 = the whole picture); override transform'),
        row('maxZoom', NUM, '10', 'ซูมได้สูงสุด', 'Largest zoom'),
        row('alignImage', "'center' | 'left'", "'center'", 'ตำแหน่งของรูปที่แคบกว่ากล่อง', 'Where a picture narrower than the box sits'),
        row('showToolbar', BOOL, 'true', 'แถบเครื่องมือซูม หมุน พลิก และเริ่มใหม่ (false ซ่อนทั้งแถบ รวม template tools)', 'The zoom / turn / mirror / reset toolbar (false hides the whole bar, tools template included)'),
        row('toolbar', 'WuImageCropperToolbar', "'full'", "ปุ่มในตัวของแถบ: 'full', 'none' หรือรายการเช่น ['zoom', '|', 'rotateLeft', 'rotateRight'] ('|' ขึ้นกลุ่มใหม่)", "The toolbar's built-in buttons: 'full', 'none' or a list such as ['zoom', '|', 'rotateLeft', 'rotateRight'] ('|' starts a new group)"),
        row('disabled', BOOL, 'false', 'ล็อกกรอบและแถบเครื่องมือ', 'Locks the box and the toolbar'),
        row('ariaLabel · imageAltText · cropperFrameAriaLabel', 'string', 'locale', 'ชื่อของทั้ง component คำอธิบายรูป และชื่อของกรอบ', 'Name of the component, description of the picture, and name of the box'),
        STYLE_ROW,
        row('allowMoveImage · initialStepSize · checkImageType · options', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ (เมื่อซูมอยู่ ลากนอกกรอบเลื่อนรูปได้เสมอ)', 'Accepted so existing templates compile (while zoomed in, dragging outside the box always pans)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('imageCropped', 'WuImageCroppedEvent', undefined, 'รูปที่ตัดแล้ว (หลังทุกการเปลี่ยนแปลงเมื่อ autoCrop)', 'The cropped picture (after each change with autoCrop)'),
        row('startCropImage', 'void', undefined, 'เริ่มตัดรูป (ผลลัพธ์ตามมาใน imageCropped)', 'A crop has started (the result follows in imageCropped)'),
        row('imageLoaded', 'WuLoadedImage', undefined, 'เปิดรูปแล้ว พร้อมขนาดและค่า EXIF', 'The picture is open, with its sizes and EXIF values'),
        row('cropperReady', 'CropDimensions', undefined, 'รูปแสดงแล้ว ขนาดบนจอเป็น CSS pixel', 'The picture is shown; its size on screen in CSS pixels'),
        row('loadImageFailed', 'void', undefined, 'เปิดรูปไม่ได้', 'The picture could not be opened'),
        row('cropperChange', 'CropperPosition', undefined, 'คู่ของ [(cropper)] กรอบย้ายหรือเปลี่ยนขนาด', 'For [(cropper)]: the box moved or resized'),
        row('transformChange', 'WuImageTransform', undefined, 'คู่ของ [(transform)] ซูม หมุน หรือพลิกจากแถบเครื่องมือ คีย์บอร์ด ล้อเมาส์ หรือนิ้ว', 'For [(transform)]: zoom, turn or mirror from the toolbar, keys, wheel or pinch'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('crop(output?)', 'Promise<WuImageCroppedEvent | null>', undefined, 'ตัดตอนนี้ (ส่ง imageCropped ด้วย) null เมื่อยังไม่มีรูป output ใช้แทนค่าของ input ครั้งเดียว', 'Crops now (imageCropped fires too); null while no picture is loaded; output overrides the input for this call'),
        row('resetCrop()', 'void', undefined, 'กรอบกลับขนาดและที่เดิม ซูมกลับเป็น 1', 'The box goes back to its starting size and place, zoom back to 1'),
        row('reset()', 'void', undefined, 'ล้างการซูม หมุน และพลิก แล้ววางกรอบใหม่ (ปุ่มเริ่มใหม่ของแถบเครื่องมือ)', 'Undoes zoom, turns and mirrors and places the box again (the toolbar\'s reset)'),
        row('rotateLeft() · rotateRight()', 'void', undefined, 'หมุนทีละ 90°', 'Turn by a quarter'),
        row('flipHorizontal() · flipVertical()', 'void', undefined, 'พลิกแนวนอน / แนวตั้ง', 'Mirror horizontally / vertically'),
        row('zoomIn() · zoomOut()', 'void', undefined, 'ซูมเข้า / ออกทีละ 1.25 เท่า', 'Zoom in / out by 1.25'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #tools หรือ wuTemplate="tools" ก็ได้',
        en: 'Write it as #tools or wuTemplate="tools".',
      },
      rows: [
        row('tools', '$implicit (WuImageCropper)', undefined, 'ปุ่มของแอปเป็นกลุ่มสุดท้ายของแถบเครื่องมือ let-cropper เรียก crop(), rotateRight(), zoomIn(), reset() ฯลฯ ได้', "The app's own buttons as the toolbar's last group; let-cropper calls crop(), rotateRight(), zoomIn(), reset() and so on"),
      ],
    },
    {
      id: 'api-providers',
      title: 'Providers',
      typeLabel: { th: 'ค่า', en: 'Value' },
      rows: [
        row('provideImageCropperOptions(options)', 'WuImageCropperOptions', undefined, 'ค่าเริ่มต้นของทุก cropper ในแอป (output, format, imageQuality, toolbar, maxZoom) input บน component ชนะ', 'Starting values for every cropper in the app (output, format, imageQuality, toolbar, maxZoom); inputs on a component win'),
      ],
    },
    {
      id: 'api-helpers',
      title: { th: 'ฟังก์ชันช่วย', en: 'Helpers' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('base64ToFile(base64, type?)', 'Blob', undefined, 'data URL หรือ base64 เป็น Blob สำหรับ FormData (import จาก wiraui/imagecropper หรือ wiraui/core)', 'A data URL or base64 as a Blob for FormData (from wiraui/imagecropper or wiraui/core)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WuImageCropperFormat = 'png' | 'jpeg' | 'webp' | 'bmp' | 'ico';

type WuImageCropperTool =
  | 'zoomOut' | 'zoomSlider' | 'zoomIn' | 'rotateLeft' | 'rotateRight' | 'flipHorizontal' | 'flipVertical' | 'reset'
  | 'zoom' | 'rotate' | 'flip';   // zoom = zoomOut + zoomSlider + zoomIn · rotate = ซ้าย + ขวา · flip = แนวนอน + แนวตั้ง
type WuImageCropperToolbar = 'full' | 'none' | ReadonlyArray<WuImageCropperTool | '|'>;   // '|' ขึ้นกลุ่มใหม่

interface WuImageCropperOptions {   // provideImageCropperOptions()
  output?: 'blob' | 'base64';
  format?: WuImageCropperFormat;
  imageQuality?: number;
  toolbar?: WuImageCropperToolbar;
  maxZoom?: number;
}

interface WuImageCroppedEvent {
  blob?: Blob | null;          // output="blob" (ค่าเริ่มต้น)
  objectUrl?: string | null;   // ใส่ใน <img> ได้ทันที
  base64?: string | null;      // output="base64"
  width: number;
  height: number;
  cropperPosition: CropperPosition;   // ตำแหน่งบนจอ (CSS pixel)
  imagePosition: CropperPosition;     // ตำแหน่งในรูป (พิกเซลของรูป หลังหมุน)
}

interface WuImageTransform {
  scale?: number;    // 1 = ทั้งรูป
  rotate?: number;   // องศา ตามเข็มนาฬิกา
  flipH?: boolean;
  flipV?: boolean;
}

interface WuLoadedImage {
  original: { size: CropDimensions };      // ขนาดในไฟล์
  transformed: { size: CropDimensions };   // ขนาดหลังหมุนตาม EXIF
  exifTransform: { rotate: number; flip: boolean };
}

interface CropperPosition { x1: number; y1: number; x2: number; y2: number }
interface CropDimensions { width: number; height: number }

// ชื่อเดิมใช้ได้เหมือนกัน
type ImageCroppedEvent = WuImageCroppedEvent;
type ImageTransform = WuImageTransform;
type LoadedImage = WuLoadedImage;
type Dimensions = CropDimensions;
type OutputFormat = WuImageCropperFormat;`,
    },
  ],
  tokens: [
    tok('--wu-imagecropper-radius', 'มุมโค้งของกล่อง', 'Corner radius of the box'),
    tok('--wu-imagecropper-border-width', 'เส้นขอบของกล่อง', 'Border width of the box'),
    tok('--wu-imagecropper-bg', 'พื้นรอบรูป', 'Background around the picture'),
    tok('--wu-imagecropper-mask', 'สีมืดนอกกรอบ', 'The dim outside the crop box'),
    tok('--wu-imagecropper-line', 'เส้นขอบของกรอบ', 'Outline of the crop box'),
    tok('--wu-imagecropper-grid-color', 'เส้นตารางสามส่วนในกรอบ (แสดงตอนลาก)', 'The rule-of-thirds grid in the box (shown while dragging)'),
    tok('--wu-imagecropper-handle-size', 'ขนาดจุดจับ', 'Handle size'),
    tok('--wu-imagecropper-handle-bg', 'สีจุดจับ', 'Handle fill'),
    tok('--wu-imagecropper-handle-border', 'ขอบจุดจับ', 'Handle border'),
    tok('--wu-imagecropper-min-height', 'ความสูงต่ำสุดตอนยังไม่มีรูป', 'Minimum height while there is no picture'),
    tok('--wu-imagecropper-max-height', 'ความสูงสูงสุดของรูป', 'Maximum height of the picture'),
    tok('--wu-imagecropper-toolbar-padding', 'ระยะในแถบเครื่องมือ', 'Toolbar padding'),
    tok('--wu-imagecropper-toolbar-gap', 'ระยะระหว่างปุ่มในแถบเครื่องมือ', 'Gap between toolbar buttons'),
  ],
};
