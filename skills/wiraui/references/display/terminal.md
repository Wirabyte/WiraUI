# Terminal

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-terminal` · `WuTerminalModule` / `WuTerminal` + `WuTerminalService` from `@wirabyte/ui/terminal`
Also accepted: `TerminalService` (older name, same import path), `<p-terminal>` migrates by tag rename.

Console box: the user types a command and presses Enter; the app receives it via `WuTerminalService.commandHandler` and answers with `sendResponse()`. ↑/↓ recall history; `clear` empties the screen. For admin pages/team tools.

```html
<wu-terminal welcomeMessage="ยินดีต้อนรับสู่ระบบวิระ พิมพ์ help เพื่อดูคำสั่ง" prompt="วิระ $"
  [style]="{ height: '16rem' }"></wu-terminal>
```
```ts
import { WuTerminalService } from '@wirabyte/ui/terminal';

export class ConsoleComponent implements OnDestroy {
  private readonly subscription: Subscription;
  constructor(private terminalService: WuTerminalService) {
    this.subscription = this.terminalService.commandHandler.subscribe((command) =>
      this.terminalService.sendResponse(command === 'help' ? 'คำสั่ง: เวลา, clear' : 'ไม่รู้จักคำสั่ง: ' + command));
  }
  ngOnDestroy(): void { this.subscription.unsubscribe(); }
}
```

**Inputs** — `welcomeMessage`: `string` — top text before first command · `prompt`: `string` — before each command · `clearCommand`: `string | null` = `'clear'` — command that empties the screen instead of being sent (`null` = sent like any other) · `response`: `string` — answer to the last command (as `sendResponse()`) · `ariaLabel`: `string` = locale · `styleClass` · `style`
**Methods** — `clear()` — empties screen (history stays; use via template ref `#terminal`) · `focus()` — cursor to command line
**Service `WuTerminalService`** (provided in root) — `commandHandler`: `Observable<string>` (each entered command, blank lines not sent) · `responseHandler`: `Observable<string>` · `sendCommand(command)`: send as if typed · `sendResponse(response)`: answer the last command, shown under it
**Tokens** — --wu-terminal-height (18rem), --wu-terminal-padding, --wu-terminal-bg, --wu-terminal-color, --wu-terminal-border-width, --wu-terminal-border-color, --wu-terminal-radius, --wu-terminal-font-family, --wu-terminal-prompt-color, --wu-terminal-prompt-gap, --wu-terminal-response-margin
**Gotchas**
- No `providers` entry needed for the service (a component-level one gives that component its own instance).
- Always unsubscribe from `commandHandler` in `ngOnDestroy`.
- The `clear` command never reaches your handler unless `[clearCommand]="null"`; rename it with `clearCommand="cls"`.
- Command list is `role="log"`; a long session scrolls inside the box and jumps to bottom on each answer.
