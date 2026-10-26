import { DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DOCS_TERMINAL } from '../../core/overlays';
import { CAROUSEL_DOC, CAROUSEL_NEWS } from '../../data/carousel';
import { IMAGECOMPARE_DOC } from '../../data/imagecompare';
import { INPUTOTP_DOC } from '../../data/inputotp';
import { KNOB_DOC } from '../../data/knob';
import { DocOrgNode, ORGANIZATIONCHART_DOC, wiraSchoolChart, wiraSchoolUnits } from '../../data/organizationchart';
import { SPLITTER_DOC } from '../../data/splitter';
import { TERMINAL_DOC } from '../../data/terminal';
import { drawSamplePhoto } from './demos-cropper';
import { SimpleDemo } from './demos';

/*
 * State and handlers behind the Terminal, ImageCompare, Carousel, Splitter, OrganizationChart, Knob and InputOtp
 * pages. Like demos.ts, no wiratheme import: the same templates compile against v1, v2 and v3, so services come in
 * through tokens each version module provides (DOCS_TERMINAL) and events are typed by their shape.
 */

/* ---------- Terminal ---------- */
export abstract class TerminalDemo extends SimpleDemo {
  protected readonly doc = TERMINAL_DOC;
  private readonly terminal = inject(DOCS_TERMINAL);
  lastCommand = '';

  constructor() {
    super();
    const subscription = this.terminal.commandHandler.subscribe((command) => this.answer(command));
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  /** The demo's commands, in either language: help, เวลา / date, ทักทาย / greet <name>. */
  answer(command: string): void {
    this.lastCommand = command;
    const [name, ...args] = command.trim().split(/\s+/);
    const word = name.toLowerCase();
    if (word === 'help') this.terminal.sendResponse(this.tx('คำสั่ง: เวลา, ทักทาย <ชื่อ>, clear'));
    else if (word === 'เวลา' || word === 'date') this.terminal.sendResponse(new Date().toLocaleString(this.en() ? 'en-GB' : 'th-TH'));
    else if (word === 'ทักทาย' || word === 'greet') this.terminal.sendResponse(this.tx('สวัสดี ') + (args.join(' ') || this.tx('วิระ')));
    else this.terminal.sendResponse(this.tx('ไม่รู้จักคำสั่ง: ') + name);
  }
}

/* ---------- ImageCompare ---------- */
export abstract class ImageCompareDemo extends SimpleDemo {
  protected readonly doc = IMAGECOMPARE_DOC;
  /** The drawn sample photo (no network); the "before" copy is the same picture in black and white. */
  readonly photo = drawSamplePhoto();
  divider = 30;
}

/* ---------- Carousel ---------- */
export abstract class CarouselDemo extends SimpleDemo {
  protected readonly doc = CAROUSEL_DOC;
  readonly news = CAROUSEL_NEWS;
  readonly responsiveOptions = [
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '640px', numVisible: 1, numScroll: 1 },
  ];
  /** The arrows with icons and names of their own (local() keeps one copy per language). */
  readonly prevProps = { icon: 'wi wi-arrow-left', ariaLabel: 'ข่าวก่อนหน้า' };
  readonly nextProps = { icon: 'wi wi-arrow-right', ariaLabel: 'ข่าวถัดไป' };
  page = 0;
  lastPage: number | null = null;
  allNews = 0;

  paged(event: { page: number }): void {
    this.lastPage = event.page;
  }

  openNews(): void {
    this.allNews++;
  }
}

/* ---------- Splitter ---------- */
export abstract class SplitterDemo extends SimpleDemo {
  protected readonly doc = SPLITTER_DOC;
  readonly rooms = ['ม.1/1', 'ม.1/2', 'ม.2/1'];
  sizes = [35, 65];
  lastSizes: number[] = [];

  resized(event: { sizes: number[] }): void {
    this.lastSizes = event.sizes.map((n) => Math.round(n));
  }

  roundSizes(sizes: number[]): string {
    return sizes.map((n) => Math.round(n)).join(' / ');
  }
}

/* ---------- OrganizationChart ---------- */
export abstract class OrganizationChartDemo extends SimpleDemo {
  protected readonly doc = ORGANIZATIONCHART_DOC;
  readonly chart = wiraSchoolChart();
  readonly units = wiraSchoolUnits();
  readonly teamUnits = wiraSchoolUnits();
  readonly foldUnits = wiraSchoolUnits();
  picked: DocOrgNode | null = null;
  team: DocOrgNode[] = [];
  lastEvent = '';

  constructor() {
    super();
    // The nodes are copied per language: start the picks again in the new one.
    this.onLang(() => {
      this.picked = null;
      this.team = [];
      this.lastEvent = '';
    });
  }

  selected(event: { node: { label?: string } }): void {
    this.lastEvent = 'onNodeSelect: ' + (event.node.label ?? '');
  }

  unselected(event: { node: { label?: string } }): void {
    this.lastEvent = 'onNodeUnselect: ' + (event.node.label ?? '');
  }

  folded(event: { node: { label?: string } }, open: boolean): void {
    this.lastEvent = (open ? 'onNodeExpand: ' : 'onNodeCollapse: ') + (event.node.label ?? '');
  }

  teamLabels(): string {
    return this.team.map((n) => n.label).join(', ') || '-';
  }
}

/* ---------- Knob ---------- */
export abstract class KnobDemo extends SimpleDemo {
  protected readonly doc = KNOB_DOC;
  volume = 40;
  lastVolume: number | null = null;
  progress = 60;
  temperature = 25;
  brightness = 70;
  score = 80;
  readonly form = new FormGroup({
    books: new FormControl(6, { nonNullable: true }),
  });

  volumeChanged(value: number): void {
    this.lastVolume = value;
  }
}

/* ---------- InputOtp ---------- */
export abstract class InputOtpDemo extends SimpleDemo {
  protected readonly doc = INPUTOTP_DOC;
  /** The code typed so far (named otpCode here: code is the page's samples). */
  otpCode = '';
  lastChange = '';
  verified = 0;
  password = '';
  room = '';
  wrongCode = '1234';
  ownCode = '';
  focusEvents = 0;

  codeChanged(event: { value: unknown }): void {
    this.lastChange = String(event.value ?? '');
  }

  verify(): void {
    this.verified++;
  }

  focused(): void {
    this.focusEvents++;
  }
}
