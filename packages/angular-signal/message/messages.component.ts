import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WuMessage } from './message.component';
import { ɵWuMessagesBase } from './messages.base';

/** A stack of messages from an array: `<wu-messages [(value)]="msgs" [enableService]="false">`. */
@Component({
  selector: 'wu-messages',
  standalone: true,
  imports: [NgClass, NgStyle, WuMessage],
  template: `
    <div class="wu-messages p-messages p-component" [ngClass]="styleClass || ''" [ngStyle]="style || null" aria-live="polite">
      @for (m of messages; track m) {
        <wu-message [severity]="severityOf(m)" [icon]="iconOf(m)" [closable]="closableOf(m)" [life]="m.life || 0" (onClose)="remove(m)">
          @if (escape) {
            @if (m.summary) {
              <span class="wu-messages-summary p-message-summary">{{ m.summary }}</span>
            }
            @if (m.detail) {
              <span class="wu-messages-detail p-message-detail">{{ m.detail }}</span>
            }
          } @else {
            @if (m.summary) {
              <span class="wu-messages-summary p-message-summary" [innerHTML]="m.summary"></span>
            }
            @if (m.detail) {
              <span class="wu-messages-detail p-message-detail" [innerHTML]="m.detail"></span>
            }
          }
        </wu-message>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuMessages extends ɵWuMessagesBase {}
