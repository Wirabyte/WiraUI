// A small stand-in for the Figma plugin API that dist/code.js runs against (scripts/smoke.mjs, scripts/preview.mjs).
// It enforces the rules Figma itself checks at run time (fonts loaded before text, FILL sizing only inside auto
// layout, bindable fields only, variants only from components, sizes above zero, property references only inside
// components), so a mistake shows here instead of in the designer's file. It also keeps everything the plugin sets
// (instances are deep copies, effect styles and SVGs are remembered), so preview.mjs can draw the result as HTML.
import vm from 'node:vm';

const BINDABLE = new Set(['height', 'width', 'characters', 'itemSpacing', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'visible', 'cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'counterAxisSpacing', 'strokeWeight', 'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'opacity', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']);
const FONTS = ['Kanit', 'Sarabun', 'Prompt', 'IBM Plex Sans Thai', 'Anuphan', 'Roboto', 'Inter', 'JetBrains Mono', 'Noto Sans Thai'];
// Fields an instance takes over from its main component (everything but identity and tree links).
const OWN = new Set(['id', 'type', 'children', 'parent', 'mainComponent', 'componentProperties', 'setProperties']);

export function makeFigma() {
  let ids = 0;
  const loaded = new Set();
  const stats = { nodes: 0, variables: 0, components: 0, sets: 0, instances: 0, bound: 0 };
  const styles = new Map();
  const nodes = new Map();
  const fail = (msg) => {
    throw new Error(msg);
  };
  class Node {
    constructor(type) {
      this.id = `${++ids}:0`;
      this.type = type;
      this.name = type;
      this.children = [];
      this.parent = null;
      this.width = 100;
      this.height = 100;
      this.x = 0;
      this.y = 0;
      this.layoutMode = 'NONE';
      this.fills = [];
      this.strokes = [];
      this.boundVariables = {};
      this._refs = null;
      nodes.set(this.id, this);
      stats.nodes++;
    }
    appendChild(c) {
      if (c.parent) c.parent.children = c.parent.children.filter((x) => x !== c);
      c.parent = this;
      this.children.push(c);
    }
    insertChild(i, c) {
      if (c.parent) c.parent.children = c.parent.children.filter((x) => x !== c);
      c.parent = this;
      this.children.splice(i, 0, c);
    }
    remove() {
      if (this.parent) this.parent.children = this.parent.children.filter((x) => x !== this);
      this.parent = null;
    }
    resize(w, h) {
      if (!(w >= 0.01 && h >= 0.01)) fail(`resize(${w}, ${h}) on ${this.name}: sizes must be at least 0.01`);
      this.width = w;
      this.height = h;
      this._resized = true;
    }
    rescale(s) {
      if (!(s > 0)) fail('rescale needs a positive factor');
      this.width *= s;
      this.height *= s;
    }
    findAll(fn = () => true) {
      const out = [];
      const walk = (n) => {
        for (const c of n.children) {
          if (fn(c)) out.push(c);
          walk(c);
        }
      };
      walk(this);
      return out;
    }
    findOne(fn) {
      return this.findAll(fn)[0] || null;
    }
    findChild(fn) {
      return this.children.find(fn) || null;
    }
    setBoundVariable(field, v) {
      if (!BINDABLE.has(field)) fail(`setBoundVariable: "${field}" cannot be bound`);
      if (!v || v.resolvedType !== 'FLOAT') fail(`setBoundVariable(${field}) needs a FLOAT variable`);
      this.boundVariables[field] = v.id;
      stats.bound++;
    }
    set layoutSizingHorizontal(v) {
      if (v === 'FILL' && (!this.parent || this.parent.layoutMode === 'NONE')) fail(`${this.name}: FILL width needs an auto-layout parent`);
      this._lsh = v;
    }
    get layoutSizingHorizontal() {
      return this._lsh;
    }
    set layoutSizingVertical(v) {
      if (v === 'FILL' && (!this.parent || this.parent.layoutMode === 'NONE')) fail(`${this.name}: FILL height needs an auto-layout parent`);
      this._lsv = v;
    }
    get layoutSizingVertical() {
      return this._lsv;
    }
    set layoutWrap(v) {
      if (v === 'WRAP' && this.layoutMode !== 'HORIZONTAL') fail(`${this.name}: wrap needs horizontal auto layout`);
      this._wrap = v;
    }
    get layoutWrap() {
      return this._wrap;
    }
    set layoutPositioning(v) {
      if (v === 'ABSOLUTE' && (!this.parent || this.parent.layoutMode === 'NONE')) fail(`${this.name}: absolute positioning needs an auto-layout parent`);
      this._pos = v;
    }
    get layoutPositioning() {
      return this._pos;
    }
    set minWidth(v) {
      if (this.layoutMode === 'NONE' && (!this.parent || this.parent.layoutMode === 'NONE')) fail(`${this.name}: minWidth needs auto layout`);
      this._minW = v;
    }
    get minWidth() {
      return this._minW;
    }
    set componentPropertyReferences(v) {
      let p = this.parent;
      while (p && p.type !== 'COMPONENT') p = p.parent;
      if (!p || !p.parent || p.parent.type !== 'COMPONENT_SET') fail(`${this.name}: property references only inside a component set's variant`);
      for (const key of Object.values(v)) if (!p.parent._props.has(key)) fail(`unknown property key ${key}`);
      this._refs = v;
    }
    get componentPropertyReferences() {
      return this._refs;
    }
    async setTextStyleIdAsync(id) {
      if (!id) fail('empty text style id');
      this._textStyle = id;
    }
    async setEffectStyleIdAsync(id) {
      if (!id) fail('empty effect style id');
      this._effect = id;
    }
  }
  class Text extends Node {
    constructor() {
      super('TEXT');
      this._font = null;
    }
    set fontName(f) {
      if (!loaded.has(`${f.family}/${f.style}`)) fail(`font ${f.family} ${f.style} used before loadFontAsync`);
      this._font = f;
    }
    get fontName() {
      return this._font;
    }
    set characters(s) {
      if (!this._font) fail('characters set before fontName');
      if (this._bound) fail(`"${this.name}" is bound to a component property: set it with setProperties`);
      if (typeof s !== 'string') fail(`characters of ${this.name} must be a string`);
      this._chars = s;
    }
    get characters() {
      return this._chars;
    }
  }
  const setPropertiesOf = (i) => (values) => {
    for (const [k, value] of Object.entries(values)) {
      if (!(k in i.componentProperties)) fail(`setProperties: unknown property ${k}`);
      const type = i.componentProperties[k].type;
      if (type === 'TEXT' && typeof value !== 'string') fail(`setProperties: ${k} needs a string`);
      if (type === 'BOOLEAN' && typeof value !== 'boolean') fail(`setProperties: ${k} needs a boolean`);
      if (type === 'INSTANCE_SWAP' && !(typeof value === 'string' && nodes.get(value) && nodes.get(value).type === 'COMPONENT')) fail(`setProperties: ${k} needs a component id`);
      i.componentProperties[k].value = value;
    }
  };
  /** A deep copy of a component's layer, as an instance holds it. */
  const copyOf = (src) => {
    const c = src.type === 'TEXT' ? new Text() : new Node(src.type);
    for (const [k, v] of Object.entries(src)) if (!OWN.has(k)) c[k] = v;
    if (src.type === 'TEXT') c._bound = !!(src._refs && src._refs.characters);
    if (src.type === 'INSTANCE') {
      // A nested instance keeps its main component and the property values set on it (a label, a swapped icon).
      c.mainComponent = src.mainComponent;
      c.componentProperties = Object.fromEntries(Object.entries(src.componentProperties || {}).map(([k, v]) => [k, { ...v }]));
      c.setProperties = setPropertiesOf(c);
    }
    for (const ch of src.children) c.appendChild(copyOf(ch));
    return c;
  };
  class Component extends Node {
    constructor() {
      super('COMPONENT');
      stats.components++;
    }
    createInstance() {
      const i = new Node('INSTANCE');
      for (const [k, v] of Object.entries(this)) if (!OWN.has(k) && k !== '_refs') i[k] = v;
      i.mainComponent = this;
      const set = this.parent && this.parent.type === 'COMPONENT_SET' ? this.parent : null;
      const props = set ? [...set._props] : [];
      i.componentProperties = Object.fromEntries(props.map((k) => [k, { type: set._types.get(k), value: set._defaults.get(k) }]));
      i.setProperties = setPropertiesOf(i);
      for (const c of this.children) i.appendChild(copyOf(c));
      stats.instances++;
      return i;
    }
    addComponentProperty() {
      fail('properties go on the component set here');
    }
  }
  class ComponentSet extends Node {
    constructor() {
      super('COMPONENT_SET');
      this._props = new Set();
      this._types = new Map();
      this._defaults = new Map();
      stats.sets++;
    }
    addComponentProperty(name, type, value) {
      if (!['TEXT', 'BOOLEAN', 'INSTANCE_SWAP'].includes(type)) fail(`property type ${type}`);
      if (type === 'TEXT' && typeof value !== 'string') fail('TEXT property needs a string');
      if (type === 'BOOLEAN' && typeof value !== 'boolean') fail('BOOLEAN property needs a boolean');
      const key = `${name}#${ids++}:0`;
      if ([...this._props].some((k) => k.split('#')[0] === name)) fail(`${this.name}: two properties named ${name}`);
      this._props.add(key);
      this._types.set(key, type);
      this._defaults.set(key, value);
      return key;
    }
  }
  const pages = [];
  const variables = [];
  const figma = {
    root: { children: pages },
    currentPage: null,
    ui: { onmessage: null, postMessage: (m) => figma._messages.push(m) },
    _messages: [],
    showUI() {},
    notify() {},
    viewport: { scrollAndZoomIntoView() {} },
    async listAvailableFontsAsync() {
      return FONTS.flatMap((family) => ['Regular', 'Medium', 'SemiBold', 'Bold'].map((style) => ({ fontName: { family, style } })));
    },
    async loadFontAsync(f) {
      if (!FONTS.includes(f.family)) fail(`font ${f.family} is not available`);
      loaded.add(`${f.family}/${f.style}`);
    },
    createPage() {
      const p = new Node('PAGE');
      pages.push(p);
      return p;
    },
    async setCurrentPageAsync(p) {
      figma.currentPage = p;
    },
    createFrame() {
      const n = new Node('FRAME');
      (figma.currentPage || figma.createPage()).appendChild(n);
      return n;
    },
    createComponent() {
      const n = new Component();
      (figma.currentPage || figma.createPage()).appendChild(n);
      return n;
    },
    createText() {
      const n = new Text();
      (figma.currentPage || figma.createPage()).appendChild(n);
      return n;
    },
    createRectangle() {
      return new Node('RECTANGLE');
    },
    createEllipse() {
      return new Node('ELLIPSE');
    },
    createLine() {
      return new Node('LINE');
    },
    createNodeFromSvg(svg) {
      if (!svg.startsWith('<svg')) fail('not an SVG');
      const f = new Node('FRAME');
      f.width = f.height = 256;
      f._svg = svg;
      f.appendChild(new Node('VECTOR'));
      return f;
    },
    createComponentFromNode(n) {
      const c = new Component();
      for (const ch of [...n.children]) c.appendChild(ch);
      c.width = n.width;
      c.height = n.height;
      c._svg = n._svg;
      return c;
    },
    combineAsVariants(nodes, parent) {
      if (!nodes.length) fail('combineAsVariants with no nodes');
      for (const n of nodes) {
        if (n.type !== 'COMPONENT') fail('combineAsVariants takes components only');
        if (!/^[^=,]+=[^=,]+(, [^=,]+=[^=,]+)*$/.test(n.name)) fail(`variant name "${n.name}" is not Prop=Value, …`);
      }
      const names = new Set(nodes.map((n) => n.name));
      if (names.size !== nodes.length) fail(`two variants with the same name in ${nodes[0].name}`);
      const keys = (n) => n.name.split(', ').map((kv) => kv.split('=')[0]).join(',');
      if (new Set(nodes.map(keys)).size !== 1) fail(`variants of one set must share their property names: ${[...new Set(nodes.map(keys))].join(' | ')}`);
      const set = new ComponentSet();
      for (const n of nodes) set.appendChild(n);
      parent.appendChild(set);
      return set;
    },
    createTextStyle() {
      const s = { id: `S:${++ids}`, type: 'TEXT' };
      styles.set(s.id, s);
      return s;
    },
    createEffectStyle() {
      const s = { id: `S:${++ids}`, type: 'EFFECT', effects: [] };
      styles.set(s.id, s);
      return s;
    },
    variables: {
      createVariableCollection(name) {
        const modes = [{ modeId: `m${++ids}`, name: 'Mode 1' }];
        return {
          id: `C:${++ids}`,
          name,
          modes,
          renameMode(id, n) {
            const m = modes.find((x) => x.modeId === id);
            if (!m) fail('renameMode: unknown mode');
            m.name = n;
          },
          addMode(n) {
            const id = `m${++ids}`;
            modes.push({ modeId: id, name: n });
            return id;
          },
        };
      },
      createVariable(name, coll, type) {
        if (/[.{}]/.test(name)) fail(`variable name "${name}" has a character Figma refuses`);
        if (variables.some((v) => v.collection === coll && v.name === name)) fail(`duplicate variable ${name}`);
        const v = {
          id: `V:${++ids}`,
          name,
          collection: coll,
          resolvedType: type,
          values: {},
          setValueForMode(mode, value) {
            if (!coll.modes.some((m) => m.modeId === mode)) fail(`${name}: unknown mode`);
            if (type === 'COLOR' && (typeof value !== 'object' || !('r' in value))) fail(`${name}: colour value expected`);
            if (type === 'FLOAT' && typeof value !== 'number') fail(`${name}: number expected`);
            this.values[mode] = value;
          },
        };
        variables.push(v);
        stats.variables++;
        return v;
      },
      setBoundVariableForPaint(paint, field, v) {
        if (field !== 'color' || v.resolvedType !== 'COLOR') fail('paint binding needs a COLOR variable on "color"');
        stats.bound++;
        return { ...paint, boundVariables: { color: { type: 'VARIABLE_ALIAS', id: v.id } } };
      },
    },
    closePlugin() {},
  };
  return { figma, stats, pages, variables, styles, nodes };
}

/** Runs the built plugin for one preset; resolves with the mock's state, the messages and the vm context. */
export async function runKit(code, preset) {
  const mock = makeFigma();
  const { figma } = mock;
  const ctx = vm.createContext({ figma, __html__: '', setTimeout, console, Promise, Math, JSON, Object, Array, Set, Map, String, Number, Error });
  vm.runInContext(code, ctx);
  figma.ui.onmessage({ type: 'build', options: { preset, components: true, icons: true } });
  const t0 = Date.now();
  while (!figma._messages.some((m) => m.type === 'done' || m.type === 'error')) {
    if (Date.now() - t0 > 120000) throw new Error(`${preset}: timed out`);
    await new Promise((r) => setTimeout(r, 5));
  }
  return { ...mock, ctx, messages: figma._messages };
}

/** The presets the built plugin carries. */
export function presetsOf(code) {
  return JSON.parse(/var WU_DATA = (\{.*\});\r?\n/.exec(code)[1]).presets;
}
