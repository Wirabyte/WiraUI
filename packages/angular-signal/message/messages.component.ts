import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WtMessage } from './message.component';
import { ɵWtMessagesBase } from './messages.base';

/** A stack of messages from an array: `<wt-messages [(value)]="msgs" [enableService]="false">`. */
@Component({
  selector: 'wt-messages',
  standalone: true,
  imports: [NgClass, NgStyle, WtMessage],
  template: `
    <div class="wt-messages p-messages p-component" [ngClass]="styleClass || ''" [ngStyle]="style || null" aria-live="polite">
      @for (m of messages; track m) {
        <wt-message [severity]="severityOf(m)" [icon]="iconOf(m)" [closable]="closableOf(m)" [life]="m.life || 0" (onClose)="remove(m)">
          @if (escape) {
            @if (m.summary) {
              <span class="wt-messages-summary p-message-summary">{{ m.summary }}</span>
            }
            @if (m.detail) {
              <span class="wt-messages-detail p-message-detail">{{ m.detail }}</span>
            }
          } @else {
            @if (m.summary) {
              <span class="wt-messages-summary p-message-summary" [innerHTML]="m.summary"></span>
            }
            @if (m.detail) {
              <span class="wt-messages-detail p-message-detail" [innerHTML]="m.detail"></span>
            }
          }
        </wt-message>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtMessages extends ɵWtMessagesBase {}
