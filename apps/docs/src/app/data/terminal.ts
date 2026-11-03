import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

export const TERMINAL_DOC: ComponentDoc = {
  id: 'terminal',
  title: 'Terminal',
  group: 'Display',
  entry: 'terminal',
  standalone: 'WuTerminal',
  module: 'WuTerminalModule',
  selector: 'wu-terminal',
  description: {
    th: 'กล่องพิมพ์คำสั่งแบบ console: ผู้ใช้พิมพ์คำสั่งแล้วกด Enter แอปรับคำสั่งผ่าน WuTerminalService แล้วตอบกลับ คำตอบแสดงใต้คำสั่ง กด ↑ ↓ เรียกคำสั่งเดิม และคำสั่ง clear ล้างจอ เหมาะกับหน้าผู้ดูแลระบบหรือเครื่องมือของทีม',
    en: 'A console: people type a command and press Enter, the app gets it through WuTerminalService and answers, and the answer shows under the command. ↑ ↓ bring back earlier commands and clear empties the screen. For admin pages and team tools.',
  },
  english: {
    'ยินดีต้อนรับสู่ระบบวิระ พิมพ์ help เพื่อดูคำสั่ง': 'Welcome to Wira. Type help to see the commands.',
    'วิระ $': 'wira $',
    'วิระ': 'Wira',
    'เวลา': 'date',
    'ทักทาย': 'greet',
    'สวัสดี ': 'Hello ',
    'คำสั่ง: เวลา, ทักทาย <ชื่อ>, clear': 'Commands: date, greet <name>, clear',
    'ไม่รู้จักคำสั่ง: ': 'Unknown command: ',
    'คำสั่งล่าสุด': 'Last command',
    'คำสั่งของระบบ': 'System commands',
    'ล้างจอ': 'cls',
    'ล้างหน้าจอ': 'Clear the screen',
    'th-TH': 'en-GB',
    'ปิดคำสั่ง clear ส่งเป็นคำสั่งธรรมดา': 'clear off: it is sent like any other command',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuTerminalModule</code>) และ standalone (<code>WuTerminal</code>) · <code>WuTerminalService</code> มีให้ที่ root แล้ว ไม่ต้องใส่ใน <code>providers</code> (ชื่อเดิม <code>TerminalService</code> import ได้เหมือนกัน)',
        en: 'Works as an NgModule (<code>WuTerminalModule</code>) or standalone (<code>WuTerminal</code>) · <code>WuTerminalService</code> is provided in root, so it needs no <code>providers</code> entry (the older name <code>TerminalService</code> can be imported too).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>welcomeMessage</code> แสดงด้านบนก่อนคำสั่งแรก และ <code>prompt</code> แสดงหน้าคำสั่ง · คำสั่งที่กด Enter ส่งเข้า <code>commandHandler</code> ของ <code>WuTerminalService</code> (บรรทัดว่างไม่ส่ง) แอปตอบด้วย <code>sendResponse()</code> แล้วคำตอบแสดงใต้คำสั่งนั้น · ลองพิมพ์ <code>help</code>, <code>เวลา</code>, <code>ทักทาย วิระ</code> หรือ <code>clear</code>',
        en: '<code>welcomeMessage</code> shows at the top before the first command and <code>prompt</code> before each command · a command sent with Enter goes to <code>commandHandler</code> of <code>WuTerminalService</code> (blank lines are not sent); the app answers with <code>sendResponse()</code> and the answer shows under that command · try <code>help</code>, <code>date</code>, <code>greet Wira</code> or <code>clear</code>.',
      },
    },
    clear: {
      title: { th: 'คำสั่งล้างจอ', en: 'The clear command' },
      text: {
        th: 'คำสั่ง <code>clear</code> ล้างจอเองโดยไม่ส่งให้แอป เปลี่ยนคำได้ด้วย <code>clearCommand</code> (เช่น <code>clearCommand="ล้างจอ"</code>) หรือใส่ <code>[clearCommand]="null"</code> ให้ส่งเป็นคำสั่งธรรมดา · เรียก <code>clear()</code> ผ่าน template ref ได้ ประวัติคำสั่งยังอยู่ให้กด ↑ เรียกกลับ',
        en: '<code>clear</code> empties the screen without reaching the app. Change the word with <code>clearCommand</code> (e.g. <code>clearCommand="cls"</code>), or set <code>[clearCommand]="null"</code> to send it like any other command · <code>clear()</code> works through a template ref, and the history stays for ↑.',
      },
    },
    size: {
      title: { th: 'ขนาดและหน้าตา', en: 'Size and look' },
      text: {
        th: 'ความสูงตั้งด้วย token <code>--wu-terminal-height</code> (ค่าเริ่มต้น 18rem) หรือ <code>[style]="{ height: \'12rem\' }"</code> คำสั่งที่ยาวเกินกล่องเลื่อนในกล่อง และเลื่อนลงล่างสุดเองเมื่อมีคำตอบใหม่ · สี ฟอนต์ และขอบมาจาก token ของช่องกรอก จึงเข้ากับธีม',
        en: 'Set the height with the <code>--wu-terminal-height</code> token (18rem by default) or <code>[style]="{ height: \'12rem\' }"</code>; a long session scrolls inside the box and jumps to the bottom on each new answer · colours, font and border come from the field tokens, so it matches the theme.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: '<code>Enter</code> ส่งคำสั่ง · <code>↑</code> / <code>↓</code> เรียกคำสั่งก่อนหน้า / ถัดไป (กลับมาที่บรรทัดที่พิมพ์ค้างไว้ได้) · คลิกตรงไหนของกล่องก็ได้ เคอร์เซอร์ไปที่บรรทัดคำสั่ง (ยกเว้นตอนเลือกข้อความเพื่อคัดลอก) · รายการคำสั่งเป็น <code>role="log"</code> โปรแกรมอ่านจออ่านคำตอบใหม่ให้ และช่องพิมพ์มีชื่อจาก <code>ariaLabel</code> หรือ locale (<code>terminalInput</code>)',
        en: '<code>Enter</code> sends · <code>↑</code> / <code>↓</code> go to earlier / later commands (back to the line you were typing) · a click anywhere in the box puts the cursor on the command line (unless you are selecting text to copy) · the commands are a <code>role="log"</code>, so screen readers read new answers, and the command line is named by <code>ariaLabel</code> or the locale (<code>terminalInput</code>).',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-terminal&gt;</code> เป็น <code>&lt;wu-terminal&gt;</code> input <code>welcomeMessage</code> และ <code>prompt</code> ใช้ชื่อเดิม · <code>TerminalService</code> import จาก <code>@wirabyte/ui/terminal</code> ได้ (<code>commandHandler</code>, <code>responseHandler</code>, <code>sendCommand()</code>, <code>sendResponse()</code> เหมือนเดิม) และไม่ต้องใส่ใน <code>providers</code> อีก (ใส่ไว้ก็ยังได้ component นั้นจะได้ service ของตัวเอง)',
        en: 'Change <code>&lt;p-terminal&gt;</code> to <code>&lt;wu-terminal&gt;</code>; <code>welcomeMessage</code> and <code>prompt</code> keep their names · import <code>TerminalService</code> from <code>@wirabyte/ui/terminal</code> (<code>commandHandler</code>, <code>responseHandler</code>, <code>sendCommand()</code> and <code>sendResponse()</code> as before); it no longer needs a <code>providers</code> entry (one listed still works, and gives that component its own service).',
      },
    },
  },
  code: {
    basic: `<wu-terminal welcomeMessage="ยินดีต้อนรับสู่ระบบวิระ พิมพ์ help เพื่อดูคำสั่ง" prompt="วิระ $"
  [style]="{ height: '16rem' }"></wu-terminal>`,
    clear: `<wu-terminal #terminal prompt="วิระ $" clearCommand="ล้างจอ"></wu-terminal>
<wu-button label="ล้างหน้าจอ" icon="wi wi-eraser" severity="secondary" [outlined]="true" (onClick)="terminal.clear()"></wu-button>

<!-- ปิดคำสั่ง clear ส่งเป็นคำสั่งธรรมดา -->
<wu-terminal prompt="วิระ $" [clearCommand]="null"></wu-terminal>`,
  },
  ts: {
    basic: `import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WuTerminalService } from '@wirabyte/ui/terminal';

export class ConsoleComponent implements OnDestroy {
  private readonly subscription: Subscription;

  constructor(private terminalService: WuTerminalService) {
    this.subscription = this.terminalService.commandHandler.subscribe((command) => this.answer(command));
  }

  answer(command: string): void {
    const [name, ...args] = command.trim().split(/\\s+/);
    if (name === 'help') this.terminalService.sendResponse('คำสั่ง: เวลา, ทักทาย <ชื่อ>, clear');
    else if (name === 'เวลา') this.terminalService.sendResponse(new Date().toLocaleString('th-TH'));
    else if (name === 'ทักทาย') this.terminalService.sendResponse('สวัสดี ' + args.join(' '));
    else this.terminalService.sendResponse('ไม่รู้จักคำสั่ง: ' + name);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('welcomeMessage', 'string', undefined, 'ข้อความด้านบนก่อนคำสั่งแรก', 'Text at the top, before any command'),
        row('prompt', 'string', undefined, 'ข้อความหน้าคำสั่ง เช่น วิระ $', 'Shown before each command, e.g. wira $'),
        row('clearCommand', 'string | null', "'clear'", 'คำสั่งที่ล้างจอแทนการส่ง (null = ส่งเป็นคำสั่งธรรมดา)', 'The command that empties the screen instead of being sent (null: sent like any other)'),
        row('response', 'string', undefined, 'คำตอบของคำสั่งล่าสุด (เหมือน sendResponse())', 'The answer to the last command (as sendResponse() does)'),
        row('ariaLabel', 'string', 'locale', 'ชื่อของช่องพิมพ์คำสั่ง', 'Name of the command line'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('clear()', 'void', undefined, 'ล้างจอ (ประวัติคำสั่งยังอยู่)', 'Empties the screen (the history stays)'),
        row('focus()', 'void', undefined, 'ย้ายเคอร์เซอร์ไปที่บรรทัดคำสั่ง', 'Puts the cursor on the command line'),
      ],
    },
    {
      id: 'api-service',
      title: 'WuTerminalService',
      typeLabel: { th: 'ชนิด', en: 'Type' },
      note: { th: 'มีให้ที่ root ชื่อเดิม TerminalService ใช้ได้', en: 'Provided in root; the older name TerminalService works too.' },
      rows: [
        row('commandHandler', 'Observable<string>', undefined, 'คำสั่งที่ผู้ใช้กด Enter (บรรทัดว่างไม่ส่ง)', 'Each command entered (blank lines are not sent)'),
        row('responseHandler', 'Observable<string>', undefined, 'คำตอบแต่ละครั้ง', 'Each answer'),
        row('sendCommand(command)', 'void', undefined, 'ส่งคำสั่งเหมือนผู้ใช้พิมพ์', 'Sends a command as if typed'),
        row('sendResponse(response)', 'void', undefined, 'ตอบคำสั่งล่าสุด แสดงใต้คำสั่งนั้น', 'Answers the last command, shown under it'),
      ],
    },
  ],
  tokens: [
    tok('--wu-terminal-height', 'ความสูงของกล่อง', 'Height of the box'),
    tok('--wu-terminal-padding', 'ระยะในกล่อง', 'Padding'),
    tok('--wu-terminal-bg', 'พื้นกล่อง', 'Background'),
    tok('--wu-terminal-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wu-terminal-border-width', 'ความหนาขอบ', 'Border width'),
    tok('--wu-terminal-border-color', 'สีขอบ', 'Border colour'),
    tok('--wu-terminal-radius', 'มุมโค้ง', 'Corner radius'),
    tok('--wu-terminal-font-family', 'ฟอนต์', 'Font'),
    tok('--wu-terminal-prompt-color', 'สีของ prompt', 'Prompt colour'),
    tok('--wu-terminal-prompt-gap', 'ระยะระหว่าง prompt กับคำสั่ง', 'Gap between the prompt and the command'),
    tok('--wu-terminal-response-margin', 'ระยะรอบคำตอบ', 'Margin around an answer'),
  ],
};
