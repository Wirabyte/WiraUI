import { THAI_DOC } from '../../data/thai';
import { SimpleDemo } from './demos';

/* State behind the Thai pipes page (no wiraui import, like demos.ts). */
export abstract class ThaiDemo extends SimpleDemo {
  protected readonly doc = THAI_DOC;
  readonly born = new Date(2012, 4, 14);
  /** Five minutes before the page opened. */
  readonly sentAt = new Date(Date.now() - 5 * 60 * 1000);
  readonly yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  amount = 1250.5;
}
