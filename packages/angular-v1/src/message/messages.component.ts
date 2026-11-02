import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WuMessage } from './message.component';
import { ɵWuMessagesBase } from './messages.base';

/** A stack of messages from an array: `<wu-messages [(value)]="msgs" [enableService]="false">`. */
@Component({
  selector: 'wu-messages',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, WuMessage],
  template: `
    <div class="wu-messages p-messages p-component" [ngClass]="styleClass || ''" [ngStyle]="style || null" aria-live="polite">
      <wu-message
        *ngFor="let m of messages"
        [severity]="severityOf(m)"
        [icon]="iconOf(m)"
        [closable]="closableOf(m)"
        [life]="m.life || 0"
        (onClose)="remove(m)"
      >
        <ng-container *ngIf="escape; else html">
          <span *ngIf="m.summary" class="wu-messages-summary p-message-summary">{{ m.summary }}</span>
          <span *ngIf="m.detail" class="wu-messages-detail p-message-detail">{{ m.detail }}</span>
        </ng-container>
        <ng-template #html>
          <span *ngIf="m.summary" class="wu-messages-summary p-message-summary" [innerHTML]="m.summary"></span>
          <span *ngIf="m.detail" class="wu-messages-detail p-message-detail" [innerHTML]="m.detail"></span>
        </ng-template>
      </wu-message>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuMessages extends ɵWuMessagesBase {}
