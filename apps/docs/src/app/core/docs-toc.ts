import { Injectable, signal } from '@angular/core';
import { Text } from './i18n';

export interface TocEntry {
  id: string;
  title: Text;
  level: number;
}

/** Sections register here as they render, so the "On this page" list follows tabs and route changes. */
@Injectable({ providedIn: 'root' })
export class DocsToc {
  readonly entries = signal<TocEntry[]>([]);

  add(entry: TocEntry): void {
    this.entries.update((list) => [...list.filter((e) => e.id !== entry.id), entry]);
  }

  remove(id: string): void {
    this.entries.update((list) => list.filter((e) => e.id !== id));
  }
}
