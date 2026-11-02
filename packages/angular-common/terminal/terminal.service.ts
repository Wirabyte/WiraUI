import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Carries commands from a wu-terminal to the app and answers back: subscribe to `commandHandler`, reply with
 * `sendResponse()`. Provided in root, so it works without being listed; an app (or a component) that lists it in
 * `providers` gets its own copy, as before.
 */
@Injectable({ providedIn: 'root' })
export class WuTerminalService {
  private readonly commandSource = new Subject<string>();
  private readonly responseSource = new Subject<string>();

  /** Each command the user enters (blank lines are not sent). */
  readonly commandHandler: Observable<string> = this.commandSource.asObservable();
  /** Each answer, shown under the last command. */
  readonly responseHandler: Observable<string> = this.responseSource.asObservable();

  sendCommand(command: string): void {
    if (command) this.commandSource.next(command);
  }

  /** Shows `response` under the last command. Numbers are shown as text; empty answers are ignored. */
  sendResponse(response: string | number | null | undefined): void {
    if (response === null || response === undefined || response === '') return;
    this.responseSource.next(String(response));
  }
}
