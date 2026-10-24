import { COMPONENT_TOKENS, PRESET_NAMES, SEMANTIC_KEYS } from './catalog';
import { diff, normalize, ThemeConfig } from './config';
import { SHADES } from './color';
import { computeTokens, LAYER_ORDER, primaryPaletteOf, tokensToCss } from './tokens';

export const CORE_VERSION = '0.1.0';

/**
 * Every exported file carries the whole config on one line so any of them can be imported back.
 * The prefix is a contract shared with the prototype Designer: do not change it.
 */
export const CONFIG_MARKER = 'wiratheme-config';

export interface ExportOptions {
  date?: Date;
  generator?: string;
}

function stamp(o: ExportOptions): string {
  const d = o.date || new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear() + 543} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function generator(o: ExportOptions): string {
  return o.generator || `WiraTheme ${CORE_VERSION}`;
}
function configLine(c: ThemeConfig): string {
  return `${CONFIG_MARKER} ${JSON.stringify(c)}`;
}
function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}
function specOf(id: string, key: string) {
  const spec = COMPONENT_TOKENS.find((s) => s.id === id && s.key === key);
  if (!spec) throw new Error(`wiratheme: unknown component token ${id}.${key}`);
  return spec;
}

// ---------- SCSS ----------

export function toSCSS(c: ThemeConfig, o: ExportOptions = {}): string {
  const P = primaryPaletteOf(c);
  const L: string[] = [];
  L.push('// ─────────────────────────────────────────────────────────────');
  L.push('// WiraTheme · wiratheme.theme.scss');
  L.push(`// สร้างโดย ${generator(o)} · ${stamp(o)}`);
  L.push("// วิธีใช้: ใส่ @use 'theme/wiratheme.theme'; เป็นบรรทัดแรกของ src/styles.scss");
  L.push('// ─────────────────────────────────────────────────────────────');
  L.push('// ' + configLine(c));
  L.push('');
  L.push("@use 'wiratheme/theme' with (");
  L.push(`  $preset: '${c.preset}',`);
  L.push(`  $primary: (${c.primaryShades ? '' : '                 // สร้างจาก ' + c.primary}`);
  for (const s of SHADES) L.push(`    ${s}: ${P[s]},`);
  L.push('  ),');
  L.push(`  $surface: '${c.surface}',`);
  L.push('  $semantic: (');
  for (const k of SEMANTIC_KEYS) L.push(`    ${k}: ${c.semantic[k]},`);
  L.push('  ),');
  L.push(`  $font-family: ('${c.fontFamily}', sans-serif),`);
  L.push(`  $font-size: ${c.fontSize}px,`);
  L.push(`  $line-height: ${c.lineHeight},`);
  L.push(`  $radius: ${c.radius}px,`);
  L.push(`  $density: '${c.density}',            // 'compact' | 'normal' | 'comfortable'`);
  L.push(`  $shadow: '${c.shadow}',`);
  L.push(`  $focus-ring: '${c.focusRing}',`);
  L.push(`  $transition: ${c.transition}ms,`);
  L.push(`  $ripple: ${c.ripple},`);
  L.push(`  $dark-mode: '${c.darkMode}',           // 'none' | 'class' | 'media'`);
  L.push(`  $material: '${c.material}',`);
  const comps = diff(c).components || {};
  const ids = Object.keys(comps) as (keyof typeof comps)[];
  if (ids.length) {
    L.push('  $components: (');
    for (const id of ids) {
      const group = comps[id] || {};
      const parts = Object.keys(group).map((k) => {
        const spec = specOf(id, k);
        const v = group[k];
        return `${kebab(k)}: ${spec.type === 'px' ? v + 'px' : String(v)}`;
      });
      L.push(`    ${id}: (${parts.join(', ')}),`);
    }
    L.push('  ),');
  } else {
    L.push('  $components: (),                // ยังไม่มีค่าที่ต่างจาก preset');
  }
  L.push(');');
  return L.join('\n') + '\n';
}

// ---------- CSS ----------

export function toCSS(c: ThemeConfig, o: ExportOptions = {}): string {
  return [
    '/* ─────────────────────────────────────────────────────────────',
    '   WiraTheme · wiratheme.theme.css',
    `   สร้างโดย ${generator(o)} · ${stamp(o)}`,
    '   วิธีใช้: เพิ่มไฟล์นี้ใน angular.json → projects.<app>.architect.build.options.styles',
    '   ───────────────────────────────────────────────────────────── */',
    `/* ${configLine(c)} */`,
    '',
    LAYER_ORDER,
    '',
    tokensToCss(computeTokens(c), { darkMode: c.darkMode, extra: { 'theme-source': 'css' } }),
  ].join('\n');
}

// ---------- TypeScript ----------

function tsBody(c: ThemeConfig, indent: string): { body: string; usesPalette: boolean } {
  const d = diff(c);
  const sem: string[] = [];
  let usesPalette = false;
  if (d.primaryShades) {
    const P = d.primaryShades;
    sem.push(`primary: { ${SHADES.map((s) => `${s}: '${P[s]}'`).join(', ')} },`);
  } else if (d.primary) {
    sem.push(`primary: palette('${d.primary}'),`);
    usesPalette = true;
  }
  if (d.surface) sem.push(`surface: '{${d.surface}}',`);
  if (d.semantic) {
    for (const k of SEMANTIC_KEYS) {
      const v = d.semantic[k];
      if (v) {
        sem.push(`${k}: palette('${v}'),`);
        usesPalette = true;
      }
    }
  }
  if (d.fontFamily) sem.push(`fontFamily: "'${d.fontFamily}', sans-serif",`);
  if (d.fontSize !== undefined) sem.push(`fontSize: '${d.fontSize}px',`);
  if (d.lineHeight !== undefined) sem.push(`lineHeight: '${d.lineHeight}',`);
  if (d.radius !== undefined) sem.push(`radius: '${d.radius}px',`);
  if (d.density) sem.push(`density: '${d.density}',`);
  if (d.shadow) sem.push(`shadow: '${d.shadow}',`);
  if (d.focusRing) sem.push(`focusRing: '${d.focusRing}',`);
  if (d.transition !== undefined) sem.push(`transition: '${d.transition}ms',`);
  if (d.material) sem.push(`material: '${d.material}',`);

  const lines: string[] = [];
  const i2 = indent + '  ';
  if (sem.length) {
    lines.push(`${indent}semantic: {`);
    for (const s of sem) lines.push(i2 + s);
    lines.push(`${indent}},`);
  }
  if (d.components) {
    lines.push(`${indent}components: {`);
    const comps = d.components;
    for (const id of Object.keys(comps) as (keyof typeof comps)[]) {
      const group = comps[id] || {};
      const parts = Object.keys(group).map((k) => {
        const spec = specOf(id, k);
        const v = group[k];
        return `${k}: ${spec.type === 'px' ? `'${v}px'` : String(v)}`;
      });
      lines.push(`${i2}${id}: { ${parts.join(', ')} },`);
    }
    lines.push(`${indent}},`);
  }
  if (!lines.length) lines.push(`${indent}// ยังไม่มีค่าที่ต่างจาก preset ${PRESET_NAMES[c.preset]}`);
  return { body: lines.join('\n'), usesPalette };
}

export function toTSOverrides(c: ThemeConfig, o: ExportOptions = {}): string {
  const { body, usesPalette } = tsBody(c, '  ');
  return [
    '// WiraTheme · wiratheme.overrides.ts',
    `// สร้างโดย ${generator(o)} · ${stamp(o)}`,
    '// ใช้คู่กับไฟล์ธีมหลัก (SCSS/CSS): ค่าในไฟล์นี้จะทับธีมหลักผ่าน @layer wiratheme.overrides',
    '// ' + configLine(c),
    '',
    `import { ${usesPalette ? 'defineOverrides, palette' : 'defineOverrides'} } from 'wiratheme/config';`,
    '',
    'export const wiraOverrides = defineOverrides({',
    body,
    '});',
    '',
  ].join('\n');
}

export function toTSPreset(c: ThemeConfig, o: ExportOptions = {}): string {
  const cls = PRESET_NAMES[c.preset];
  const { body, usesPalette } = tsBody(c, '  ');
  return [
    '// WiraTheme · wiratheme.preset.ts',
    `// สร้างโดย ${generator(o)} · ${stamp(o)}`,
    '// ใช้แบบ TS อย่างเดียว ไม่ต้องมีไฟล์ธีม SCSS/CSS',
    '// ' + configLine(c),
    '',
    `import { ${usesPalette ? 'definePreset, palette' : 'definePreset'} } from 'wiratheme/config';`,
    `import { ${cls} } from 'wiratheme/presets';`,
    '',
    `export const AppTheme = definePreset(${cls}, {`,
    body,
    '});',
    '',
  ].join('\n');
}

// ---------- JSON ----------

export function toJSON(c: ThemeConfig, o: ExportOptions = {}): string {
  const d = o.date || new Date();
  return JSON.stringify({ wiratheme: CORE_VERSION, createdAt: d.toISOString(), config: c, tokens: computeTokens(c) }, null, 2) + '\n';
}

// ---------- import ----------

/** Reads a config back from any exported file (SCSS, CSS, TS or JSON). Throws `empty`, `no-config` or `bad-config`. */
export function parseImport(text: string): ThemeConfig {
  const src = String(text || '').trim();
  if (!src) throw new Error('empty');
  try {
    const obj = JSON.parse(src);
    if (obj && obj.config) return normalize(obj.config);
    if (obj && obj.preset) return normalize(obj);
  } catch (e) {
    /* not plain JSON; look for the marker line */
  }
  const m = new RegExp(CONFIG_MARKER + '\\s+(\\{.*\\})').exec(src);
  if (!m) throw new Error('no-config');
  let parsed: unknown;
  try {
    parsed = JSON.parse(m[1]);
  } catch (e) {
    throw new Error('bad-config');
  }
  return normalize(parsed);
}
