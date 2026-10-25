export type WtSelectMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals';

export interface WtSelectChangeEvent {
  originalEvent: Event | null;
  value: unknown;
}

export interface WtSelectFilterEvent {
  originalEvent: Event;
  filter: string;
}
