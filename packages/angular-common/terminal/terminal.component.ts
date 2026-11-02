import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWU_SKIP_VERSION_CHECK, WuConfig } from 'wiraui/config';
import { terminalHistoryAdd, terminalHistoryMove, terminalIsClear, WuLocale } from 'wiraui/core';
import { WuTerminalService } from './terminal.service';

/** A line on the screen: the command typed and the answer under it (`text` null: an answer with no command). */
export interface WuTerminalCommand {
  text: string | null;
  response?: string | null;
}

/**
 * A text console: `<wu-terminal welcomeMessage="ยินดีต้อนรับ" prompt="วิระ $">`. Enter sends the line through
 * `WuTerminalService` (`commandHandler`); the app answers with `sendResponse()` and the answer shows under it. ↑ / ↓ go
 * through earlier commands, the `clear` command (see `clearCommand`) empties the screen, and a click anywhere on the
 * box puts the cursor on the prompt.
 */
@Component({
  selector: 'wu-terminal',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-terminal-host', '(click)': 'hostClick()' },
})
export class WuTerminal implements AfterViewChecked, OnDestroy {
  /** Text at the top, before any command. */
  @Input() welcomeMessage?: string | null;
  /** Shown before each command, e.g. `'วิระ $'`. */
  @Input() prompt?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** Sets the answer to the last command (the service's `sendResponse()` does the same). */
  @Input() set response(v: string | null | undefined) {
    if (v) this.setResponse(String(v));
  }
  /** This command empties the screen instead of being sent. Default `'clear'`; `null` sends it like any other. */
  @Input() clearCommand: string | null = 'clear';
  /** Label of the command line. Default: the locale's "command". */
  @Input() ariaLabel?: string | null;

  @ViewChild('container') protected containerRef?: ElementRef<HTMLElement>;
  @ViewChild('input') protected inputRef?: ElementRef<HTMLInputElement>;

  commands: WuTerminalCommand[] = [];
  /** The line being typed. */
  command = '';
  private history: string[] = [];
  private historyIndex = 0;
  private draft = '';
  private scrollDown = false;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(WuConfig);
  private readonly service = inject(WuTerminalService);
  private readonly subscription = this.service.responseHandler.subscribe((r) => this.setResponse(r));
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterViewChecked(): void {
    if (!this.scrollDown) return;
    this.scrollDown = false;
    const box = this.containerRef?.nativeElement;
    if (box) box.scrollTop = box.scrollHeight;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }

  // ---------- public ----------

  /** Empties the screen (the history stays for ↑ / ↓). */
  clear(): void {
    this.commands = [];
    this.cdr.markForCheck();
  }

  /** Puts the cursor on the prompt. */
  focus(): void {
    this.inputRef?.nativeElement.focus({ preventScroll: true });
  }

  // ---------- events ----------

  hostClick(): void {
    // Selecting text to copy keeps the selection.
    const selected = this.doc.defaultView?.getSelection?.()?.toString();
    if (selected) return;
    this.focus();
  }

  typed(event: Event): void {
    this.command = (event.target as HTMLInputElement).value;
  }

  handleCommand(event: KeyboardEvent): void {
    if (event.isComposing) return;
    const input = event.target as HTMLInputElement;
    if (event.key === 'Enter') {
      event.preventDefault();
      const text = input.value;
      this.command = '';
      input.value = '';
      this.history = terminalHistoryAdd(this.history, text);
      this.historyIndex = this.history.length;
      this.draft = '';
      this.scrollDown = true;
      if (terminalIsClear(text, this.clearCommand)) {
        this.clear();
        return;
      }
      this.commands = [...this.commands, { text }];
      this.cdr.markForCheck();
      this.service.sendCommand(text);
      return;
    }
    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && this.history.length) {
      event.preventDefault();
      if (this.historyIndex >= this.history.length) this.draft = input.value;
      this.historyIndex = terminalHistoryMove(this.history, this.historyIndex, event.key === 'ArrowUp' ? -1 : 1);
      const line = this.historyIndex >= this.history.length ? this.draft : this.history[this.historyIndex];
      this.command = line;
      input.value = line;
      input.setSelectionRange?.(line.length, line.length);
    }
  }

  // ---------- internals ----------

  private setResponse(response: string): void {
    const last = this.commands[this.commands.length - 1];
    if (last) {
      this.commands = [...this.commands.slice(0, -1), { ...last, response }];
    } else {
      this.commands = [{ text: null, response }];
    }
    this.scrollDown = true;
    this.cdr.markForCheck();
  }
}
