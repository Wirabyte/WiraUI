import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';
const NUM = 'number';

export const IMAGECROPPER_DOC: ComponentDoc = {
  id: 'imagecropper',
  title: 'Image Cropper',
  group: 'Media',
  entry: 'imagecropper',
  standalone: 'WtImageCropper',
  module: 'WtImageCropperModule',
  selector: 'wt-imagecropper',
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
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtImageCropperModule</code>) และ standalone (<code>WtImageCropper</code>) แท็กเขียนได้ทั้ง <code>wt-imagecropper</code>, <code>wt-imageCropper</code>, <code>wt-image-cropper</code> และ <code>image-cropper</code> (แท็กที่แอปใช้อยู่แล้ว) · <code>base64ToFile()</code> import จาก <code>wiratheme/imagecropper</code> (หรือ <code>wiratheme/core</code>) ได้',
        en: 'Works as an NgModule (<code>WtImageCropperModule</code>) or standalone (<code>WtImageCropper</code>). The tag can be <code>wt-imagecropper</code>, <code>wt-imageCropper</code>, <code>wt-image-cropper</code> or <code>image-cropper</code> (the tag apps already use) · <code>base64ToFile()</code> comes from <code>wiratheme/imagecropper</code> (or <code>wiratheme/core</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ส่ง event <code>(change)</code> ของ <code>&lt;input type="file"&gt;</code> เข้า <code>[imageChangedEvent]</code> แล้ว component เปิดไฟล์แรกเอง (หรือส่ง <code>[imageFile]</code>, <code>[imageURL]</code> หรือ <code>[imageBase64]</code> แทน ตัวอย่างนี้เริ่มจากรูปตัวอย่างผ่าน <code>[imageBase64]</code>) · ลากกรอบเพื่อย้าย ลากมุมหรือขอบเพื่อปรับขนาด แถบเครื่องมือด้านล่างซูม หมุน พลิก และเริ่มใหม่ · ทุกครั้งที่กรอบเปลี่ยน <code>(imageCropped)</code> ได้รูปที่ตัดแล้ว ค่าเริ่มต้นเป็น <code>blob</code> พร้อม <code>objectUrl</code> ที่ใส่ใน <code>&lt;img&gt;</code> ได้ทันที (component คืน URL เก่าให้เอง) และ <code>width</code> / <code>height</code> · <code>(loadImageFailed)</code> เมื่อเปิดรูปไม่ได้',
        en: 'Pass the <code>(change)</code> event of an <code>&lt;input type="file"&gt;</code> to <code>[imageChangedEvent]</code> and the component opens its first file (or pass <code>[imageFile]</code>, <code>[imageURL]</code> or <code>[imageBase64]</code>; this demo starts from a sample picture through <code>[imageBase64]</code>) · drag the box to move it and its corners or edges to resize it; the toolbar underneath zooms, turns, mirrors and resets · after every change <code>(imageCropped)</code> brings the cropped picture: a <code>blob</code> by default, with an <code>objectUrl</code> ready for an <code>&lt;img&gt;</code> (the component frees the old URL itself), plus <code>width</code> / <code>height</code> · <code>(loadImageFailed)</code> fires when the picture cannot be opened.',
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
    output: {
      title: { th: 'ขนาดและชนิดไฟล์', en: 'Size and file type' },
      text: {
        th: '<code>[resizeToWidth]</code> / <code>[resizeToHeight]</code> ย่อหรือขยายผลลัพธ์เป็นขนาดนั้น (0 = ขนาดของกรอบ ใส่ทั้งคู่ได้รูปที่พอดีทั้งสองด้าน) และ <code>[onlyScaleDown]="true"</code> ไม่ขยายรูปที่เล็กกว่า · <code>format</code> เป็น <code>png</code> (ค่าเริ่มต้น), <code>jpeg</code>, <code>webp</code>, <code>bmp</code> หรือ <code>ico</code> (สองแบบหลังออกมาเป็น png) และ <code>[imageQuality]</code> 0–100 (ค่าเริ่มต้น 92) ใช้กับ jpeg / webp · <code>backgroundColor</code> ใส่สีให้พื้นที่โปร่งใส (jpeg ที่ไม่ใส่ได้สีขาว) · <code>output="base64"</code> ได้ data URL แทน blob · ผลลัพธ์ใหญ่ได้ไม่เกิน 16.7 ล้านพิกเซล (ขีดจำกัดของ canvas บน iOS)',
        en: '<code>[resizeToWidth]</code> / <code>[resizeToHeight]</code> scale the result to that size (0 = the size of the box; with both, it fits inside both), and <code>[onlyScaleDown]="true"</code> never enlarges a smaller crop · <code>format</code> is <code>png</code> (the default), <code>jpeg</code>, <code>webp</code>, <code>bmp</code> or <code>ico</code> (the last two come out as png), and <code>[imageQuality]</code> 0–100 (92 by default) applies to jpeg / webp · <code>backgroundColor</code> fills transparent areas (jpeg without one gets white) · <code>output="base64"</code> gives a data URL instead of a blob · the result is capped at 16.7 megapixels (the iOS canvas limit).',
      },
    },
    tools: {
      title: { th: 'ปุ่มของแอปเอง', en: 'Your own buttons' },
      text: {
        th: '<code>[showToolbar]="false"</code> ซ่อนแถบเครื่องมือในตัว แล้วทำปุ่มเองผ่าน template ref: <code>rotateLeft()</code>, <code>rotateRight()</code>, <code>flipHorizontal()</code>, <code>flipVertical()</code>, <code>zoomIn()</code>, <code>zoomOut()</code>, <code>resetCrop()</code> (กรอบกลับที่เดิม) และ <code>reset()</code> (ล้างการซูม หมุน และพลิกด้วย) · <code>[(transform)]</code> บอกค่าซูม มุม และการพลิก · <code>[autoCrop]="false"</code> ไม่ตัดเองทุกครั้งที่ขยับ แล้วเรียก <code>crop()</code> ซึ่งคืน Promise ของผลลัพธ์',
        en: '<code>[showToolbar]="false"</code> hides the built-in toolbar; make your own buttons through a template ref: <code>rotateLeft()</code>, <code>rotateRight()</code>, <code>flipHorizontal()</code>, <code>flipVertical()</code>, <code>zoomIn()</code>, <code>zoomOut()</code>, <code>resetCrop()</code> (the box goes back) and <code>reset()</code> (zoom, turns and mirrors too) · <code>[(transform)]</code> tells the zoom, angle and mirroring · <code>[autoCrop]="false"</code> stops cropping on every change; call <code>crop()</code>, which returns a Promise of the result.',
      },
    },
    upload: {
      title: { th: 'อัปโหลด', en: 'Upload' },
      text: {
        th: 'ส่ง <code>event.blob</code> ขึ้น server ผ่าน <code>FormData</code> ได้เลย ปุ่มบันทึกใช้ <code>[loading]="isApiSaving"</code> · ถ้าใช้ <code>output="base64"</code> แปลงกลับเป็นไฟล์ด้วย <code>base64ToFile(event.base64)</code> ไม่ต้องเขียนฟังก์ชันเอง',
        en: 'Send <code>event.blob</code> to the server in a <code>FormData</code> as it is; the save button uses <code>[loading]="isApiSaving"</code> · with <code>output="base64"</code>, turn it back into a file with <code>base64ToFile(event.base64)</code> instead of a function of your own.',
      },
    },
    limits: {
      title: { th: 'ขนาดกรอบ ตำแหน่ง และการหมุน', en: 'Box limits, position and turning' },
      text: {
        th: 'ขนาดของกรอบเป็นพิกเซลของรูป: <code>cropperMinWidth</code> / <code>cropperMinHeight</code> / <code>cropperMaxWidth</code> / <code>cropperMaxHeight</code> จำกัดขนาด และ <code>cropperStaticWidth</code> + <code>cropperStaticHeight</code> ทำกรอบขนาดตายตัว (ย้ายได้แต่ไม่มีจุดจับ) · <code>[(cropper)]</code> อ่านหรือกำหนดตำแหน่ง <code>{ x1, y1, x2, y2 }</code> · <code>[containWithinAspectRatio]="true"</code> เติมขอบให้รูปทั้งรูปอยู่ในกรอบได้ (สีจาก <code>backgroundColor</code>) · <code>[canvasRotation]</code> หมุนทีละ 90° ส่วน <code>rotation</code> (องศา), <code>zoom</code> และ <code>maxZoom</code> (ค่าเริ่มต้น 10) ตั้งจากโค้ดได้ · <code>alignImage="left"</code> วางรูปชิดซ้ายเมื่อรูปแคบกว่ากล่อง · <code>[disabled]="true"</code> ล็อกทั้งหมด',
        en: 'The box is measured in image pixels: <code>cropperMinWidth</code> / <code>cropperMinHeight</code> / <code>cropperMaxWidth</code> / <code>cropperMaxHeight</code> limit it, and <code>cropperStaticWidth</code> + <code>cropperStaticHeight</code> fix its size (it moves but has no handles) · <code>[(cropper)]</code> reads or sets its position, <code>{ x1, y1, x2, y2 }</code> · <code>[containWithinAspectRatio]="true"</code> pads the picture so all of it fits in the box (filled with <code>backgroundColor</code>) · <code>[canvasRotation]</code> turns by quarter turns, and <code>rotation</code> (degrees), <code>zoom</code> and <code>maxZoom</code> (10 by default) can be set from code · <code>alignImage="left"</code> puts a picture narrower than the box at the left · <code>[disabled]="true"</code> locks everything.',
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
        th: 'แอปที่ใช้แท็ก <code>&lt;image-cropper&gt;</code> อยู่แล้ว: import <code>WtImageCropperModule</code> (หรือ <code>WtImageCropper</code>) แทน module เดิม แท็ก input และ event ใช้ชื่อเดิมได้ type ชื่อเดิม (<code>ImageCroppedEvent</code>, <code>ImageTransform</code>, <code>LoadedImage</code>, <code>Dimensions</code>, <code>OutputFormat</code>) import จาก <code>wiratheme/imagecropper</code> เปลี่ยนแค่ path · ผลลัพธ์ค่าเริ่มต้นเป็น <code>blob</code> โค้ดที่อ่าน <code>event.base64</code> ให้ใส่ <code>output="base64"</code> · ฟังก์ชันแปลง base64 เป็นไฟล์ที่แอปเขียนเองเปลี่ยนเป็น <code>base64ToFile()</code> ได้ · <code>allowMoveImage</code>, <code>initialStepSize</code>, <code>checkImageType</code> และ <code>options</code> รับไว้เพื่อให้ template เดิมใช้ได้',
        en: 'Apps that already use the <code>&lt;image-cropper&gt;</code> tag: import <code>WtImageCropperModule</code> (or <code>WtImageCropper</code>) instead of the old module; the tag, inputs and events keep their names, and the types keep theirs too (<code>ImageCroppedEvent</code>, <code>ImageTransform</code>, <code>LoadedImage</code>, <code>Dimensions</code>, <code>OutputFormat</code>), imported from <code>wiratheme/imagecropper</code>, so only the path changes · the result is a <code>blob</code> by default: code that reads <code>event.base64</code> adds <code>output="base64"</code> · a base64-to-file function of your own can become <code>base64ToFile()</code> · <code>allowMoveImage</code>, <code>initialStepSize</code>, <code>checkImageType</code> and <code>options</code> are accepted so existing templates compile.',
      },
    },
  },
  code: {
    basic: {
      v3: `<input type="file" accept="image/*" (change)="fileChangeEvent($event)" />
<wt-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1"
  (imageCropped)="imageCropped($event)" (loadImageFailed)="loadImageFailed()"></wt-imagecropper>
@if (isLoadFailed) {
  <p>เปิดรูปไม่ได้</p>
}
@if (croppedUrl) {
  <img [src]="croppedUrl" alt="รูปที่ตัดแล้ว" width="160" />
  <span>{{ croppedSize }}</span>
}`,
      classic: `<input type="file" accept="image/*" (change)="fileChangeEvent($event)" />
<wt-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1"
  (imageCropped)="imageCropped($event)" (loadImageFailed)="loadImageFailed()"></wt-imagecropper>
<p *ngIf="isLoadFailed">เปิดรูปไม่ได้</p>
<ng-container *ngIf="croppedUrl">
  <img [src]="croppedUrl" alt="รูปที่ตัดแล้ว" width="160" />
  <span>{{ croppedSize }}</span>
</ng-container>`,
    },
    ratio: `<wt-selectbutton [options]="ratios" optionLabel="label" optionValue="value" [(ngModel)]="ratio" [allowEmpty]="false"></wt-selectbutton>
<wt-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="ratio" [maintainAspectRatio]="ratio !== 'free'"
  (imageCropped)="imageCropped($event)"></wt-imagecropper>`,
    round: `<wt-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1" [roundCropper]="true" [resizeToWidth]="256"
  (imageCropped)="imageCropped($event)"></wt-imagecropper>
<img [src]="croppedUrl" alt="รูปโปรไฟล์" width="96" height="96" style="border-radius: 50%" />`,
    output: `<wt-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="4 / 3" format="jpeg" [imageQuality]="80"
  [resizeToWidth]="400" [onlyScaleDown]="true" backgroundColor="#ffffff"
  (imageCropped)="imageCropped($event)"></wt-imagecropper>`,
    tools: `<wt-imagecropper #photoCropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="16 / 9"
  [showToolbar]="false" [autoCrop]="false" [(transform)]="transform"></wt-imagecropper>
<wt-button label="หมุนซ้าย" icon="pi pi-undo" severity="secondary" [outlined]="true" (onClick)="photoCropper.rotateLeft()"></wt-button>
<wt-button label="หมุนขวา" icon="pi pi-refresh" severity="secondary" [outlined]="true" (onClick)="photoCropper.rotateRight()"></wt-button>
<wt-button label="พลิกแนวนอน" severity="secondary" [outlined]="true" (onClick)="photoCropper.flipHorizontal()"></wt-button>
<wt-button label="ซูมเข้า" icon="pi pi-plus" severity="secondary" [outlined]="true" (onClick)="photoCropper.zoomIn()"></wt-button>
<wt-button label="ซูมออก" icon="pi pi-minus" severity="secondary" [outlined]="true" (onClick)="photoCropper.zoomOut()"></wt-button>
<wt-button label="เริ่มใหม่" severity="secondary" [text]="true" (onClick)="photoCropper.reset()"></wt-button>
<wt-button label="ตัดรูป" icon="pi pi-check" (onClick)="cropNow(photoCropper)"></wt-button>`,
    upload: `<wt-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1" [resizeToWidth]="512" [onlyScaleDown]="true"
  (imageCropped)="photoCropped($event)"></wt-imagecropper>
<wt-button label="บันทึกรูป" icon="pi pi-upload" [loading]="isApiSaving" [disabled]="!photoBlob" (onClick)="savePhoto()"></wt-button>`,
    limits: `<wt-imagecropper [imageFile]="file" aspectRatio="16:9" [cropperMinWidth]="320" [cropperMaxWidth]="1920" [(cropper)]="cropBox"
  [containWithinAspectRatio]="true" backgroundColor="#ffffff" [canvasRotation]="1" alignImage="left"></wt-imagecropper>

<!-- กรอบขนาดตายตัว ย้ายได้แต่ปรับขนาดไม่ได้ -->
<wt-imagecropper [imageFile]="file" [cropperStaticWidth]="600" [cropperStaticHeight]="200"></wt-imagecropper>`,
  },
  ts: {
    basic: `import { WtImageCroppedEvent } from 'wiratheme/imagecropper';

imageChangedEvent: Event | null = null;
croppedUrl = '';
croppedSize = '';
isLoadFailed = false;

fileChangeEvent(event: Event): void {
  this.imageChangedEvent = event;
  this.isLoadFailed = false;
}

imageCropped(event: WtImageCroppedEvent): void {
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

imageCropped(event: WtImageCroppedEvent): void {
  this.croppedSize = event.width + ' × ' + event.height;   // ไม่เกิน 400 px
  this.fileSize = Math.round((event.blob?.size ?? 0) / 1024) + ' KB';
}`,
    tools: `import { WtImageCropper, WtImageTransform } from 'wiratheme/imagecropper';

transform: WtImageTransform = { scale: 1, rotate: 0, flipH: false, flipV: false };
croppedUrl = '';

async cropNow(cropper: WtImageCropper): Promise<void> {
  const event = await cropper.crop();   // null เมื่อยังไม่มีรูป
  this.croppedUrl = event?.objectUrl ?? '';
}`,
    upload: `import { base64ToFile, WtImageCroppedEvent } from 'wiratheme/imagecropper';

photoBlob: Blob | null = null;
isApiSaving = false;

photoCropped(event: WtImageCroppedEvent): void {
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
    limits: `import { CropperPosition } from 'wiratheme/imagecropper';

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
        row('output', "'blob' | 'base64'", "'blob'", 'blob พร้อม objectUrl หรือ data URL', 'A blob with an objectUrl, or a data URL'),
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
        row('transform', 'WtImageTransform', undefined, 'ซูม มุม และการพลิก (สองทาง [(transform)] แถบเครื่องมือเปลี่ยนค่านี้ด้วย)', 'Zoom, angle and mirroring (two-way [(transform)]; the toolbar changes it too)'),
        row('rotation · zoom', NUM, undefined, 'มุมเป็นองศา / ซูม (1 = ทั้งรูป) ใช้แทนค่าใน transform', 'Angle in degrees / zoom (1 = the whole picture); override transform'),
        row('maxZoom', NUM, '10', 'ซูมได้สูงสุด', 'Largest zoom'),
        row('alignImage', "'center' | 'left'", "'center'", 'ตำแหน่งของรูปที่แคบกว่ากล่อง', 'Where a picture narrower than the box sits'),
        row('showToolbar', BOOL, 'true', 'แถบเครื่องมือซูม หมุน พลิก และเริ่มใหม่', 'The zoom / turn / mirror / reset toolbar'),
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
        row('imageCropped', 'WtImageCroppedEvent', undefined, 'รูปที่ตัดแล้ว (หลังทุกการเปลี่ยนแปลงเมื่อ autoCrop)', 'The cropped picture (after each change with autoCrop)'),
        row('startCropImage', 'void', undefined, 'เริ่มตัดรูป (ผลลัพธ์ตามมาใน imageCropped)', 'A crop has started (the result follows in imageCropped)'),
        row('imageLoaded', 'WtLoadedImage', undefined, 'เปิดรูปแล้ว พร้อมขนาดและค่า EXIF', 'The picture is open, with its sizes and EXIF values'),
        row('cropperReady', 'CropDimensions', undefined, 'รูปแสดงแล้ว ขนาดบนจอเป็น CSS pixel', 'The picture is shown; its size on screen in CSS pixels'),
        row('loadImageFailed', 'void', undefined, 'เปิดรูปไม่ได้', 'The picture could not be opened'),
        row('cropperChange', 'CropperPosition', undefined, 'คู่ของ [(cropper)] กรอบย้ายหรือเปลี่ยนขนาด', 'For [(cropper)]: the box moved or resized'),
        row('transformChange', 'WtImageTransform', undefined, 'คู่ของ [(transform)] ซูม หมุน หรือพลิกจากแถบเครื่องมือ คีย์บอร์ด ล้อเมาส์ หรือนิ้ว', 'For [(transform)]: zoom, turn or mirror from the toolbar, keys, wheel or pinch'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('crop(output?)', 'Promise<WtImageCroppedEvent | null>', undefined, 'ตัดตอนนี้ (ส่ง imageCropped ด้วย) null เมื่อยังไม่มีรูป output ใช้แทนค่าของ input ครั้งเดียว', 'Crops now (imageCropped fires too); null while no picture is loaded; output overrides the input for this call'),
        row('resetCrop()', 'void', undefined, 'กรอบกลับขนาดและที่เดิม ซูมกลับเป็น 1', 'The box goes back to its starting size and place, zoom back to 1'),
        row('reset()', 'void', undefined, 'ล้างการซูม หมุน และพลิก แล้ววางกรอบใหม่ (ปุ่มเริ่มใหม่ของแถบเครื่องมือ)', 'Undoes zoom, turns and mirrors and places the box again (the toolbar\'s reset)'),
        row('rotateLeft() · rotateRight()', 'void', undefined, 'หมุนทีละ 90°', 'Turn by a quarter'),
        row('flipHorizontal() · flipVertical()', 'void', undefined, 'พลิกแนวนอน / แนวตั้ง', 'Mirror horizontally / vertically'),
        row('zoomIn() · zoomOut()', 'void', undefined, 'ซูมเข้า / ออกทีละ 1.25 เท่า', 'Zoom in / out by 1.25'),
      ],
    },
    {
      id: 'api-helpers',
      title: { th: 'ฟังก์ชันช่วย', en: 'Helpers' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('base64ToFile(base64, type?)', 'Blob', undefined, 'data URL หรือ base64 เป็น Blob สำหรับ FormData (import จาก wiratheme/imagecropper หรือ wiratheme/core)', 'A data URL or base64 as a Blob for FormData (from wiratheme/imagecropper or wiratheme/core)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtImageCropperFormat = 'png' | 'jpeg' | 'webp' | 'bmp' | 'ico';

interface WtImageCroppedEvent {
  blob?: Blob | null;          // output="blob" (ค่าเริ่มต้น)
  objectUrl?: string | null;   // ใส่ใน <img> ได้ทันที
  base64?: string | null;      // output="base64"
  width: number;
  height: number;
  cropperPosition: CropperPosition;   // ตำแหน่งบนจอ (CSS pixel)
  imagePosition: CropperPosition;     // ตำแหน่งในรูป (พิกเซลของรูป หลังหมุน)
}

interface WtImageTransform {
  scale?: number;    // 1 = ทั้งรูป
  rotate?: number;   // องศา ตามเข็มนาฬิกา
  flipH?: boolean;
  flipV?: boolean;
}

interface WtLoadedImage {
  original: { size: CropDimensions };      // ขนาดในไฟล์
  transformed: { size: CropDimensions };   // ขนาดหลังหมุนตาม EXIF
  exifTransform: { rotate: number; flip: boolean };
}

interface CropperPosition { x1: number; y1: number; x2: number; y2: number }
interface CropDimensions { width: number; height: number }

// ชื่อเดิมใช้ได้เหมือนกัน
type ImageCroppedEvent = WtImageCroppedEvent;
type ImageTransform = WtImageTransform;
type LoadedImage = WtLoadedImage;
type Dimensions = CropDimensions;
type OutputFormat = WtImageCropperFormat;`,
    },
  ],
  tokens: [
    tok('--wt-imagecropper-radius', 'มุมโค้งของกล่อง', 'Corner radius of the box'),
    tok('--wt-imagecropper-border-width', 'เส้นขอบของกล่อง', 'Border width of the box'),
    tok('--wt-imagecropper-bg', 'พื้นรอบรูป', 'Background around the picture'),
    tok('--wt-imagecropper-mask', 'สีมืดนอกกรอบ', 'The dim outside the crop box'),
    tok('--wt-imagecropper-line', 'เส้นขอบของกรอบ', 'Outline of the crop box'),
    tok('--wt-imagecropper-grid-color', 'เส้นตารางสามส่วนในกรอบ (แสดงตอนลาก)', 'The rule-of-thirds grid in the box (shown while dragging)'),
    tok('--wt-imagecropper-handle-size', 'ขนาดจุดจับ', 'Handle size'),
    tok('--wt-imagecropper-handle-bg', 'สีจุดจับ', 'Handle fill'),
    tok('--wt-imagecropper-handle-border', 'ขอบจุดจับ', 'Handle border'),
    tok('--wt-imagecropper-min-height', 'ความสูงต่ำสุดตอนยังไม่มีรูป', 'Minimum height while there is no picture'),
    tok('--wt-imagecropper-max-height', 'ความสูงสูงสุดของรูป', 'Maximum height of the picture'),
    tok('--wt-imagecropper-toolbar-padding', 'ระยะในแถบเครื่องมือ', 'Toolbar padding'),
    tok('--wt-imagecropper-toolbar-gap', 'ระยะระหว่างปุ่มในแถบเครื่องมือ', 'Gap between toolbar buttons'),
  ],
};
