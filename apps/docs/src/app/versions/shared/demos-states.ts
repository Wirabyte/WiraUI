import { EMPTYSTATE_DOC, ERRORPAGE_DOC, RESULT_DOC } from '../../data/states';
import { SimpleDemo } from './demos';

/* State behind the EmptyState and Result pages (no wiratheme import, like demos.ts). */

export abstract class EmptyStateDemo extends SimpleDemo {
  protected readonly doc = EMPTYSTATE_DOC;
  readonly types = ['nodata', 'search', 'inbox', 'folder', 'error', 'offline'];
  /** The empty class of the table sample. */
  readonly students: { code: string; name: string; room: string }[] = [];
  added = 0;
}

export abstract class ResultDemo extends SimpleDemo {
  protected readonly doc = RESULT_DOC;
}

export abstract class ErrorPageDemo extends SimpleDemo {
  protected readonly doc = ERRORPAGE_DOC;
  readonly looks = [
    { label: 'ทางการ', value: 'formal' },
    { label: 'Kawaii', value: 'kawaii' },
  ];
  readonly codes = [400, 401, 403, 404, 408, 429, 500, 502, 503];
  look = 'formal';
  status = 404;
  last = '-';

  /** The docs stay put: show which button was pressed instead of following it. */
  picked(e: { action: string; originalEvent: Event }): void {
    e.originalEvent.preventDefault();
    this.last = e.action;
  }
}
