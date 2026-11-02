export interface NgAddOptions {
  project?: string;
  style: 'auto' | 'scss' | 'css';
  structure: 'auto' | 'module' | 'standalone';
  /** `'auto'`, a preset id (`'mali'`) or a ready-made theme (`'sila-light-teal'`) this major offers. */
  theme: string;
  /** Add `wiraui/utils` (grid, flex, spacing …). */
  utils: boolean;
  primary: string;
  font: 'auto' | 'Kanit' | 'Sarabun' | 'Prompt' | 'Noto Sans Thai' | 'IBM Plex Sans Thai' | 'Anuphan' | 'Inter' | 'Roboto' | 'none';
  locale: 'th-buddhist' | 'th-gregorian' | 'en';
  darkMode: 'none' | 'class' | 'media';
  /** Tests only: replaces the range read from wiraui's package.json. */
  angularRange?: string;
}
