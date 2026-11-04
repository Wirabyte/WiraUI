import { SIGNATUREPAD_DOC } from '../../data/signaturepad';
import { SimpleDemo } from './demos';

/* State behind the SignaturePad page (no wiraui import, like demos.ts). */

/** What the page calls on a pad through its template ref (the same in every version). */
interface PadLike {
  toDataURL(type?: string, quality?: number): string | null;
}

export abstract class SignaturePadDemo extends SimpleDemo {
  protected readonly doc = SIGNATUREPAD_DOC;
  /** A PNG data URL, or null while the box is empty. */
  signature: string | null = null;
  initials: string | null = null;
  consent = { signature: null as string | null };
  submitted = false;
  sent = false;
  approver: string | null = null;
  jpeg: string | null = null;
  began = 0;
  ended = 0;
  cleared = 0;

  /** The start and the length of a data URL, so the page shows what the model holds without a wall of base64. */
  preview(value: string | null): string {
    return value ? `${value.slice(0, 22)}… (${value.length.toLocaleString('en-US')})` : 'null';
  }

  submit(valid: boolean | null): void {
    this.submitted = true;
    this.sent = !!valid;
  }

  exportJpeg(pad: PadLike): void {
    this.jpeg = pad.toDataURL('image/jpeg', 0.9);
  }
}
