import { Text } from './i18n';
import { ImportNames, Snippet } from './snippets';

export interface ApiRow {
  name: string;
  type: string;
  default?: string;
  description: Text;
}

export interface ApiGroup {
  id: string;
  title: Text;
  /** Column header for `type` (Inputs: "Type", Outputs: "Event"). */
  typeLabel?: Text;
  rows?: ApiRow[];
  /** Type declarations shown as code. */
  code?: string;
  note?: Text;
}

export interface TokenRow {
  name: string;
  description: Text;
}

/** Title and intro of one FEATURES section. `text` may hold inline HTML (<code>, <b>). */
export interface DocSectionText {
  title: Text;
  text?: Text;
}

export interface ComponentDoc extends ImportNames {
  id: string;
  title: string;
  group: string;
  selector: string;
  description: Text;
  /** FEATURES section titles and intros, by section id. */
  sections: Record<string, DocSectionText>;
  /** Code for each FEATURES section, by section id. */
  code: Record<string, Snippet>;
  /** TypeScript that goes with a section's template, by section id. */
  ts?: Record<string, Snippet>;
  api: ApiGroup[];
  tokens: TokenRow[];
  /** THEMING tab text for components with no tokens of their own (shown instead of the table). */
  themingNote?: Text;
  /** Component tokens settable from TypeScript: `components.<key>` in overrides. */
  overrides?: string;
}
