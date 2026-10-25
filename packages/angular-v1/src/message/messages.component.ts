import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WtMessage } from './message.component';
import { ɵWtMessagesBase } from './messages.base';

/** A stack of messages from an array: `<wt-messages [(value)]="msgs" [enableService]="false">`. */
@Component({
  selector: 'wt-messages',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, WtMessage],
  template: `
    <div class="wt-messages p-messages p-component" [ngClass]="styleClass || ''" [ngStyle]="style || null" aria-live="polite">
      <wt-message
        *ngFor="let m of messages"
        [severity]="severityOf(m)"
        [icon]="iconOf(m)"
        [closable]="closableOf(m)"
        [life]="m.life || 0"
        (onClose)="remove(m)"
      >
        <ng-container *ngIf="escape; else html">
          <span *ngIf="m.summary" class="wt-messages-summary p-message-summary">{{ m.summary }}</span>
          <span *ngIf="m.detail" class="wt-messages-detail p-message-detail">{{ m.detail }}</span>
        </ng-container>
        <ng-template #html>
          <span *ngIf="m.summary" class="wt-messages-summary p-message-summary" [innerHTML]="m.summary"></span>
          <span *ngIf="m.detail" class="wt-messages-detail p-message-detail" [innerHTML]="m.detail"></span>
        </ng-template>
      </wt-message>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtMessages extends ɵWtMessagesBase {}
