import { IMAGECROPPER_DOC } from '../../data/imagecropper';
import { SimpleDemo, wait } from './demos';

/*
 * State and handlers behind the Image Cropper page. Like demos.ts, no wiratheme import: the same template compiles
 * against v1, v2 and v3, so events and the cropper's methods are typed by their shape.
 */

/** What (imageCropped) and crop() bring. */
interface CropResult {
  blob?: Blob | null;
  objectUrl?: string | null;
  base64?: string | null;
  width: number;
  height: number;
}

/** What the demo's own buttons call on a cropper (template ref). */
interface CropperRef {
  crop(output?: 'blob' | 'base64'): Promise<CropResult | null>;
}

interface PictureTurn {
  scale?: number;
  rotate?: number;
  flipH?: boolean;
  flipV?: boolean;
}

/**
 * The starting picture: a school under the hills, drawn here so the demos show something before a file is chosen
 * (no network, no asset). 1200 × 800, so resizeToWidth has something to scale down.
 */
function drawSamplePhoto(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const g = canvas.getContext('2d');
  if (!g) return '';
  const round = (x: number, y: number, r: number) => {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  };
  const hill = (left: number, peakX: number, peakY: number, right: number, color: string) => {
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(left, 640);
    g.lineTo(peakX, peakY);
    g.lineTo(right, 640);
    g.closePath();
    g.fill();
  };

  const sky = g.createLinearGradient(0, 0, 0, 640);
  sky.addColorStop(0, '#38bdf8');
  sky.addColorStop(0.65, '#bae6fd');
  sky.addColorStop(1, '#fef3c7');
  g.fillStyle = sky;
  g.fillRect(0, 0, 1200, 640);
  g.fillStyle = '#fbbf24';
  round(960, 170, 80);
  g.fillStyle = 'rgba(255, 255, 255, 0.9)';
  for (const c of [
    { x: 170, y: 150 },
    { x: 500, y: 100 },
  ]) {
    round(c.x, c.y, 36);
    round(c.x + 44, c.y - 16, 46);
    round(c.x + 94, c.y, 34);
    g.fillRect(c.x, c.y, 94, 34);
  }
  hill(-80, 230, 330, 540, '#0f766e');
  hill(300, 640, 270, 1000, '#115e59');
  hill(820, 1080, 380, 1320, '#0f766e');

  const ground = g.createLinearGradient(0, 600, 0, 800);
  ground.addColorStop(0, '#65a30d');
  ground.addColorStop(1, '#3f6212');
  g.fillStyle = ground;
  g.fillRect(0, 600, 1200, 200);

  // The school: walls, roof, windows, door.
  g.fillStyle = '#f8fafc';
  g.fillRect(660, 460, 340, 190);
  g.fillStyle = '#dc2626';
  g.beginPath();
  g.moveTo(636, 465);
  g.lineTo(830, 360);
  g.lineTo(1024, 465);
  g.closePath();
  g.fill();
  g.fillStyle = '#1e3a8a';
  for (let i = 0; i < 4; i++) g.fillRect(690 + i * 80, 500, 46, 46);
  g.fillStyle = '#92400e';
  g.fillRect(800, 570, 60, 80);

  // A tree and a path.
  g.fillStyle = '#78350f';
  g.fillRect(232, 520, 28, 120);
  g.fillStyle = '#15803d';
  round(246, 490, 76);
  g.fillStyle = '#fde68a';
  g.beginPath();
  g.moveTo(810, 650);
  g.lineTo(850, 650);
  g.lineTo(980, 800);
  g.lineTo(700, 800);
  g.closePath();
  g.fill();
  return canvas.toDataURL('image/jpeg', 0.9);
}

export abstract class ImageCropperDemo extends SimpleDemo {
  protected readonly doc = IMAGECROPPER_DOC;
  readonly samplePhoto = drawSamplePhoto();
  readonly ratios = [
    { label: '1:1', value: '1' },
    { label: '4:3', value: '4/3' },
    { label: '16:9', value: '16/9' },
    { label: 'อิสระ', value: 'free' },
  ];
  readonly cropperBoxStyle = { width: '100%', maxWidth: '36rem' };
  readonly previewStyle = { display: 'block', maxWidth: '10rem', height: 'auto', border: '1px solid var(--docs-border)', borderRadius: '8px' };
  readonly avatarStyle = { display: 'block', width: '6rem', height: '6rem', border: '1px solid var(--docs-border)', borderRadius: '50%' };

  imageChangedEvent: Event | null = null;
  isLoadFailed = false;
  basicResult: CropResult | null = null;
  ratio = '4/3';
  ratioResult: CropResult | null = null;
  avatarResult: CropResult | null = null;
  resizedResult: CropResult | null = null;
  transform: PictureTurn = { scale: 1, rotate: 0, flipH: false, flipV: false };
  manualResult: CropResult | null = null;
  photoResult: CropResult | null = null;
  isApiSaving = false;
  savedCount = 0;

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.isLoadFailed = false;
  }

  loadImageFailed(): void {
    this.isLoadFailed = true;
  }

  basicCropped(event: CropResult): void {
    this.basicResult = event;
  }

  ratioCropped(event: CropResult): void {
    this.ratioResult = event;
  }

  avatarCropped(event: CropResult): void {
    this.avatarResult = event;
  }

  resizedCropped(event: CropResult): void {
    this.resizedResult = event;
  }

  /** [autoCrop]="false": crop() resolves with the result once it is ready. */
  cropNow(cropper: CropperRef): void {
    cropper.crop().then((event) => (this.manualResult = event));
  }

  photoCropped(event: CropResult): void {
    this.photoResult = event;
  }

  savePhoto(): void {
    if (!this.photoResult?.blob) return;
    this.isApiSaving = true;
    wait(900).then(() => {
      this.isApiSaving = false;
      this.savedCount++;
    });
  }

  sizeOf(result: CropResult | null): string {
    return result ? result.width + ' × ' + result.height : '-';
  }

  kb(result: CropResult | null): string {
    return result?.blob ? (result.blob.size / 1024).toFixed(1) + ' KB' : '-';
  }
}
