/** Small regex highlighter for the code samples. Output is escaped HTML with <span class="tk-*"> tokens. */
export type CodeLang = 'ts' | 'html' | 'scss' | 'css' | 'bash' | 'json' | 'text';

type Rule = [cls: string, re: RegExp];

const TS: Rule[] = [
  ['c', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  ['s', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/],
  ['d', /@[A-Za-z]+/],
  [
    'k',
    /\b(?:import|from|export|const|let|var|class|interface|type|extends|implements|new|return|function|async|await|if|else|for|of|in|true|false|null|undefined|this|readonly|private|protected|public|static|void|as|keyof|typeof)\b/,
  ],
  ['n', /\b\d+(?:\.\d+)?\b/],
  ['t', /\b[A-Z][A-Za-z0-9_]*\b/],
  ['f', /\b[a-zA-Zɵ_$][\w$]*(?=\s*\()/],
];

const SCSS: Rule[] = [
  ['c', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  ['s', /'[^'\n]*'|"[^"\n]*"/],
  ['k', /@[a-z-]+|!important|\b(?:with|as)\b/],
  ['v', /\$[\w-]+|--[\w-]+/],
  ['a', /\b[a-z-]+(?=\s*:(?!:))/],
  ['n', /#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|ms|s|%)?\b/],
  ['f', /\b[a-z-]+(?=\()/],
];

const BASH: Rule[] = [
  ['c', /#[^\n]*/],
  ['s', /'[^'\n]*'|"[^"\n]*"/],
  ['k', /(?:^|(?<=\n))\s*(?:ng|npm|npx|pnpm|node|yarn|git)\b/],
  ['a', /\s--?[\w-]+(?:=[^\s]+)?/],
];

const JSON_RULES: Rule[] = [
  ['c', /\/\/[^\n]*/],
  ['a', /"(?:\\.|[^"\\])*"(?=\s*:)/],
  ['s', /"(?:\\.|[^"\\])*"/],
  ['n', /\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b/],
];

function combine(rules: Rule[]): RegExp {
  return new RegExp(rules.map(([, re]) => `(${re.source})`).join('|'), 'g');
}

const COMPILED: Partial<Record<CodeLang, [Rule[], RegExp]>> = {
  ts: [TS, combine(TS)],
  scss: [SCSS, combine(SCSS)],
  css: [SCSS, combine(SCSS)],
  bash: [BASH, combine(BASH)],
  json: [JSON_RULES, combine(JSON_RULES)],
};

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const span = (cls: string, text: string) => `<span class="tk-${cls}">${escapeHtml(text)}</span>`;

function byRules(code: string, rules: Rule[], re: RegExp): string {
  let out = '';
  let last = 0;
  re.lastIndex = 0;
  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (!m[0]) {
      re.lastIndex++;
      continue;
    }
    const group = m.slice(1).findIndex((g) => g !== undefined);
    out += escapeHtml(code.slice(last, m.index)) + span(rules[group][0], m[0]);
    last = m.index + m[0].length;
  }
  return out + escapeHtml(code.slice(last));
}

const TAG = /<!--[\s\S]*?-->|<\/?[a-zA-Z][\w:-]*(?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*\/?>/g;
const ATTR = /(\s+)([^\s=>/]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+))?/g;

function html(code: string): string {
  let out = '';
  let last = 0;
  TAG.lastIndex = 0;
  for (let m = TAG.exec(code); m; m = TAG.exec(code)) {
    out += text(code.slice(last, m.index));
    const tag = m[0];
    if (tag.startsWith('<!--')) {
      out += span('c', tag);
    } else {
      const name = /^<\/?[\w:-]+/.exec(tag)![0];
      const end = /\s*\/?>$/.exec(tag)![0];
      const attrs = tag.slice(name.length, tag.length - end.length);
      out += span('k', name);
      out += attrs.replace(ATTR, (_all, ws: string, attr: string, eq?: string, val?: string) =>
        escapeHtml(ws) + span('a', attr) + (eq ? escapeHtml(eq) + span('s', val || '') : '')
      );
      out += span('k', end);
    }
    last = m.index + tag.length;
  }
  return out + text(code.slice(last));
}

/** Text between tags: {{ interpolation }} and @if / @for blocks. */
function text(s: string): string {
  return s
    .split(/(\{\{[\s\S]*?\}\})/)
    .map((part, i) =>
      i % 2 ? span('i', part) : escapeHtml(part).replace(/@(if|else|for|switch|case|default|empty)\b/g, '<span class="tk-k">@$1</span>')
    )
    .join('');
}

export function highlight(code: string, lang: CodeLang): string {
  if (lang === 'html') return html(code);
  const c = COMPILED[lang];
  return c ? byRules(code, c[0], c[1]) : escapeHtml(code);
}
