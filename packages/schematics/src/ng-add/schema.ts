export interface NgAddOptions {
  project?: string;
  style: 'auto' | 'scss' | 'css';
  structure: 'auto' | 'module' | 'standalone';
  preset: 'wira' | 'lanna' | 'siam' | 'nakhon';
  primary: string;
  font: 'auto' | 'Kanit' | 'Sarabun' | 'Prompt' | 'Noto Sans Thai' | 'IBM Plex Sans Thai' | 'Anuphan' | 'none';
  locale: 'th-buddhist' | 'th-gregorian' | 'en';
  darkMode: 'none' | 'class' | 'media';
  /** Tests only: replaces the range read from wiratheme's package.json. */
  angularRange?: string;
}
