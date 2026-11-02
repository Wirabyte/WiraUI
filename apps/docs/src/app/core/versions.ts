import { Text } from './i18n';

export type DocVersionId = 'v1' | 'v2' | 'v3';

export interface DocVersion {
  id: DocVersionId;
  major: number;
  /** Angular majors this wiraui major installs on. */
  angular: string;
  label: string;
  status: 'maintenance' | 'active' | 'latest';
  /** One-line description of the version's themes. */
  look: Text;
  /** Longer note for the presets page. */
  lookDetail: Text;
  api: string;
  controlFlow: string;
}

export const DOC_VERSIONS: DocVersion[] = [
  {
    id: 'v1',
    major: 1,
    angular: '15–17',
    label: 'v1 · Angular 15–17',
    status: 'maintenance',
    look: { th: 'ธีม Sila, Arun, Sayan, Ratri, Material', en: 'Sila, Arun, Sayan, Ratri, Material themes' },
    lookDetail: {
      th: 'ธีมแบบคลาสสิก: sila-light / sila-dark, arun, sayan, ratri และ md (Material) แยก light / dark และสีหลักไว้ในชื่อ ค่าเริ่มต้นคือ sila-light-teal ชื่อโฟลเดอร์เดียวกับที่แอปเดิมใช้ จึงได้หน้าตาเดิมกลับมา',
      en: 'Classic themes: sila-light / sila-dark, arun, sayan, ratri and md (Material), with light / dark and the primary colour in the name. The default is sila-light-teal. Folder names match what existing apps already use, so they keep their look.',
    },
    api: '@Input() / @Output()',
    controlFlow: '*ngIf / *ngFor',
  },
  {
    id: 'v2',
    major: 2,
    angular: '18–20',
    label: 'v2 · Angular 18–20',
    status: 'active',
    look: { th: 'Mali, Sila, Material, Phet', en: 'Mali, Sila, Material, Phet' },
    lookDetail: {
      th: 'preset: Mali (ค่าเริ่มต้น), Sila, Material และ Phet ทุกตัวมี light / dark ในตัว สลับด้วย class .wu-dark หรือ darkModeSelector',
      en: 'Presets: Mali (default), Sila, Material and Phet. Each has light and dark built in, switched with the .wu-dark class or darkModeSelector.',
    },
    api: 'input() / model() / output()',
    controlFlow: '@if / @for',
  },
  {
    id: 'v3',
    major: 3,
    angular: '21+',
    label: 'v3 · Angular 21+',
    status: 'latest',
    look: { th: 'Wira, Lanna, Siam, Nakhon, Glass + Mali, Sila, Material, Phet', en: 'Wira, Lanna, Siam, Nakhon, Glass + Mali, Sila, Material, Phet' },
    lookDetail: {
      th: 'ธีมของ WiraUI เอง: Wira (ค่าเริ่มต้น), Lanna, Siam, Nakhon และ Glass แบบ Liquid Glass พร้อม preset ของ v2 (Mali, Sila, Material, Phet)',
      en: "WiraUI's own themes: Wira (the default), Lanna, Siam, Nakhon and the Liquid Glass theme Glass, plus v2's presets (Mali, Sila, Material, Phet).",
    },
    api: 'input() / model() / output() + Signal Forms',
    controlFlow: '@if / @for',
  },
];

export const VERSION_STORE = 'wiraui-docs-version';

export function docVersion(id: DocVersionId): DocVersion {
  return DOC_VERSIONS.find((v) => v.id === id) || DOC_VERSIONS[2];
}

/** 'v2' from '/v2/components/button?tab=api'. */
export function versionOfUrl(url: string): DocVersionId | null {
  const m = /^\/(v[123])(?=[/?#]|$)/.exec(url);
  return m ? (m[1] as DocVersionId) : null;
}

export function rememberedVersion(): DocVersionId {
  try {
    const v = localStorage.getItem(VERSION_STORE);
    if (v === 'v1' || v === 'v2' || v === 'v3') return v;
  } catch {
    /* storage blocked */
  }
  return 'v3';
}

export function rememberVersion(id: DocVersionId): void {
  try {
    localStorage.setItem(VERSION_STORE, id);
  } catch {
    /* storage blocked */
  }
}
