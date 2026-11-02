export type WuSelectMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals';

export interface WuSelectChangeEvent {
  originalEvent: Event | null;
  value: unknown;
}

export interface WuSelectFilterEvent {
  originalEvent: Event;
  filter: string;
}
