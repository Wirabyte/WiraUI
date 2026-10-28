import { describe, expect, it } from 'vitest';
import { estimateTextWidth, FLOW_TEXT_KEYS, flowEdgeName, flowFormat, flowFromJSON, flowNodeName, flowText, flowToJSON, flowToSvg } from '../src/flow';
import { EN_LOCALE, TH_LOCALE } from '../src/thai/locale';
import type { FlowEdge, FlowNode } from '../src/flow';

const nodes: FlowNode[] = [
  { id: 'a', position: { x: 0, y: 0 }, width: 100, height: 40, data: { label: 'เริ่ม' }, dragging: true },
  { id: 'b', position: { x: 200, y: 0 }, width: 100, height: 40, data: { label: 'จบ <ok>' }, selected: true },
];
const edges: FlowEdge[] = [{ id: 'ab', source: 'a', target: 'b', label: 'ไป & กลับ', markerEnd: 'arrowclosed' }];

describe('flow export: JSON', () => {
  it('writes plain data without drag flags', () => {
    const json = flowToJSON(nodes, edges, { x: 10, y: 20, zoom: 1.5 });
    expect(json.viewport).toEqual({ x: 10, y: 20, zoom: 1.5 });
    expect(json.nodes[0]).toEqual({ id: 'a', position: { x: 0, y: 0 }, width: 100, height: 40, data: { label: 'เริ่ม' } });
    expect(json.nodes[1].selected).toBe(true);
    // A copy: changing it leaves the diagram alone.
    json.nodes[0].position.x = 999;
    expect(nodes[0].position.x).toBe(0);
    expect(JSON.parse(JSON.stringify(json))).toEqual(json);
    expect(flowToJSON([], []).viewport).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('copes with data that loops back on itself', () => {
    const loopy: { self?: unknown } = {};
    loopy.self = loopy;
    const json = flowToJSON([{ id: 'x', position: { x: 0, y: 0 }, data: loopy }], []);
    expect(json.nodes[0].id).toBe('x');
  });

  it('reads JSON text or objects back', () => {
    const text = JSON.stringify(flowToJSON(nodes, edges, { x: 1, y: 2, zoom: 3 }));
    const back = flowFromJSON(text);
    expect(back?.nodes.map((n) => n.id)).toEqual(['a', 'b']);
    expect(back?.edges[0]).toMatchObject({ id: 'ab', source: 'a', target: 'b', label: 'ไป & กลับ' });
    expect(back?.viewport).toEqual({ x: 1, y: 2, zoom: 3 });
    expect(flowFromJSON({ nodes: [], edges: [] })).toEqual({ nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } });
    expect(flowFromJSON({})).toEqual({ nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } });
  });

  it('refuses things that are not a diagram', () => {
    expect(flowFromJSON('{not json')).toBeNull();
    expect(flowFromJSON('[1,2]')).toBeNull();
    expect(flowFromJSON(42)).toBeNull();
    expect(flowFromJSON({ nodes: 'x' })).toBeNull();
    expect(flowFromJSON({ nodes: [], edges: {} })).toBeNull();
  });

  it('leaves out broken entries and fixes small mistakes', () => {
    const back = flowFromJSON({
      nodes: [
        { id: 1, position: { x: '5', y: 6 } },
        { id: 'noPos' },
        { id: 'bad', position: { x: 'a', y: 0 } },
        { id: '1', position: { x: 0, y: 0 } },
        { id: 'child', position: { x: 0, y: 0 }, parentId: 'gone' },
        null,
      ],
      edges: [
        { id: 'e1', source: 1, target: 'child' },
        { id: 'e2', source: '1', target: 'missing' },
        { id: 'e1', source: 'child', target: '1' },
        { source: '1', target: 'child' },
      ],
      viewport: { x: 'oops', zoom: 2 },
    });
    expect(back?.nodes).toEqual([
      { id: '1', position: { x: 5, y: 6 } },
      { id: 'child', position: { x: 0, y: 0 } },
    ]);
    expect(back?.edges).toEqual([{ id: 'e1', source: '1', target: 'child' }]);
    expect(back?.viewport).toEqual({ x: 0, y: 0, zoom: 2 });
    const keep = flowFromJSON({ nodes: [{ id: 'a', position: { x: 0, y: 0 } }], edges: [{ id: 'e', source: 'a', target: 'nope' }] }, { dropDangling: false });
    expect(keep?.edges).toHaveLength(1);
  });
});

describe('flow export: SVG', () => {
  it('draws boxes, edges, arrowheads and labels', () => {
    const svg = flowToSvg(nodes, edges, { title: 'แผนภาพ' });
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="340" height="80" viewBox="0 0 340 80"')).toBe(true);
    expect(svg).toContain('<title>แผนภาพ</title>');
    expect(svg.match(/<rect [^>]*rx="6"/g)).toHaveLength(2);
    expect(svg).toContain('<marker id="wt-flow-svg-marker-arrowclosed-');
    // The curve stops short of the arrowhead and runs straight into it.
    expect(svg).toMatch(/<path d="M50,40 C[^"]+ 250,-9.7 L250,0" fill="none" stroke="#94a3b8" stroke-width="1.5" marker-end="url\(#wt-flow-svg-marker-arrowclosed-[^"]+\)"\/>/);
    // Text is escaped.
    expect(svg).toContain('จบ &lt;ok&gt;');
    expect(svg).toContain('ไป &amp; กลับ');
    expect(svg).not.toContain('<ok>');
    expect(svg.endsWith('</g></svg>')).toBe(true);
  });

  it('uses the colours and padding given, and a background when asked', () => {
    const svg = flowToSvg(nodes, edges, { padding: 0, background: '#000', nodeBackground: 'red', edgeColor: 'blue', fontSize: 14 });
    expect(svg).toContain('width="300" height="40"');
    expect(svg).toContain('<rect width="100%" height="100%" fill="#000"/>');
    expect(svg).toContain('fill="red"');
    expect(svg).toContain('stroke="blue"');
    expect(svg).toContain('font-size="14"');
  });

  it('starts edges at the measured handles', () => {
    const handles = new Map([
      ['a', { source: [{ id: null, type: 'source' as const, position: 'right' as const, x: 95, y: 15, width: 10, height: 10 }], target: [] }],
      ['b', { source: [], target: [{ id: null, type: 'target' as const, position: 'left' as const, x: -5, y: 15, width: 10, height: 10 }] }],
    ]);
    const svg = flowToSvg(nodes, edges, { handles, padding: 0 });
    expect(svg).toContain('<path d="M105,20 C145.15,20 145.15,20 185.3,20 L195,20"');
  });

  it('draws groups first and leaves hidden things out', () => {
    const svg = flowToSvg(
      [
        { id: 'n', position: { x: 10, y: 10 }, parentId: 'g', width: 50, height: 20, data: { label: 'ใน' } },
        { id: 'g', type: 'group', position: { x: 0, y: 0 }, width: 200, height: 100, data: { label: 'กลุ่ม' } },
        { id: 'h', position: { x: 500, y: 500 }, width: 50, height: 20, hidden: true },
      ],
      [{ id: 'nh', source: 'n', target: 'h' }]
    );
    expect(svg.indexOf('data-id="g"')).toBeLessThan(svg.indexOf('data-id="n"'));
    expect(svg).not.toContain('data-id="h"');
    expect(svg).not.toContain('<path');
    // The child is placed inside its group.
    expect(svg).toContain('<rect x="10" y="10" width="50" height="20"');
    expect(svg).toContain('text-anchor="start"');
  });

  it('draws an empty diagram as an empty picture', () => {
    expect(flowToSvg([], [])).toBe('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" font-family="sans-serif" font-size="12"><g transform="translate(20,20)"></g></svg>');
  });

  it('estimates text width without counting Thai marks above and below the line', () => {
    expect(estimateTextWidth('กิ', 10)).toBeCloseTo(5.8);
    expect(estimateTextWidth('ab', 10)).toBeCloseTo(11.6);
  });
});

describe('flow texts', () => {
  it('reads the locale first, then Thai or English by the locale code', () => {
    expect(flowText({ code: 'th' }, 'flowZoomIn')).toBe('ซูมเข้า');
    expect(flowText({ code: 'en' }, 'flowZoomIn')).toBe('Zoom in');
    expect(flowText(null, 'flowFitView')).toBe('พอดีหน้าจอ');
    expect(flowText({ code: 'en', flowZoomIn: 'Closer' } as { code: string }, 'flowZoomIn')).toBe('Closer');
    // Both built-in locales have every flow text.
    for (const key of FLOW_TEXT_KEYS) {
      expect(TH_LOCALE[key].length, key).toBeGreaterThan(0);
      expect(EN_LOCALE[key].length, key).toBeGreaterThan(0);
    }
  });

  it('fills in placeholders', () => {
    expect(flowFormat('ย้าย {name} ไปที่ {x}, {y}', { name: 'วิระ', x: 10, y: 20 })).toBe('ย้าย วิระ ไปที่ 10, 20');
    expect(flowFormat('{a} {b}', { a: 1 })).toBe('1 {b}');
  });

  it('names nodes and edges for screen readers', () => {
    expect(flowNodeName({ id: 'n1', position: { x: 0, y: 0 }, data: { label: 'ฝ่ายวิชาการ' } })).toBe('ฝ่ายวิชาการ');
    expect(flowNodeName({ id: 'n1', position: { x: 0, y: 0 }, ariaLabel: 'กล่อง', data: { label: 'x' } })).toBe('กล่อง');
    expect(flowNodeName({ id: 'n1', position: { x: 0, y: 0 }, data: { label: '  ' } })).toBe('n1');
    expect(flowNodeName(null)).toBe('');
    const a: FlowNode = { id: 'a', position: { x: 0, y: 0 }, data: { label: 'ก' } };
    const b: FlowNode = { id: 'b', position: { x: 0, y: 0 }, data: { label: 'ข' } };
    expect(flowEdgeName({ id: 'e', source: 'a', target: 'b' }, a, b)).toBe('จาก ก ไป ข');
    expect(flowEdgeName({ id: 'e', source: 'a', target: 'b', label: 'อนุมัติ' }, a, b, { code: 'en' })).toBe('อนุมัติ, From ก to ข');
    expect(flowEdgeName({ id: 'e', source: 'a', target: 'b', ariaLabel: 'สายหลัก' }, a, b)).toBe('สายหลัก');
    expect(flowEdgeName({ id: 'e', source: 'a', target: 'zz' }, a, null)).toBe('จาก ก ไป zz');
  });
});
