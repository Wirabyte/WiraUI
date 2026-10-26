/** `(onChange)`: the code as typed so far and the event behind it. */
export interface WtInputOtpChangeEvent {
  originalEvent: Event;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

/** Handlers a custom `input` template wires to its own field: `(input)="events.input($event)"` and so on. */
export interface WtInputOtpTemplateEvents {
  input: (event: Event) => void;
  keydown: (event: Event) => void;
  focus: (event: Event) => void;
  blur: (event: Event) => void;
  paste: (event: Event) => void;
}

/** Context of the `input` template: `let-token`, `let-events="events"`, `let-index="index"` (1 for the first box). */
export interface WtInputOtpInputTemplateContext {
  $implicit: string;
  events: WtInputOtpTemplateEvents;
  index: number;
}

export type InputOtpChangeEvent = WtInputOtpChangeEvent;
export type InputOtpTemplateEvents = WtInputOtpTemplateEvents;
export type InputOtpInputTemplateContext = WtInputOtpInputTemplateContext;
