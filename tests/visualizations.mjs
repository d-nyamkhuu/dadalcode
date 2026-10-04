import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const server = await createServer({
  root,
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: "error",
});
const checked = [];
const failures = [];
function test(name, fn) {
  try {
    fn();
    checked.push(name);
  } catch (error) {
    failures.push({ name, error: error.message });
  }
}
const props = (kind, focus = [], pointers = [], watch = []) => ({
  kind,
  focus,
  pointers,
  watch,
  labels: {},
});
const step = (variables, limits) => ({
  line: 1,
  event: "line",
  function: "test",
  depth: 1,
  explanation: "test",
  variables,
  limits,
});
const snapshot = (kind, nodes, rootId = nodes[0]?.id) => ({
  __kind: kind,
  nodes,
  root: rootId,
  identity: rootId,
  stableIds: true,
});
const n = (id, value, links = {}) => ({ id, value, links });
try {
  const Visual = (await server.ssrLoadModule("/src/components/VisualState.tsx"))
    .default;
  const Sequence = (
    await server.ssrLoadModule("/src/components/visuals/SequenceVisual.tsx")
  ).default;
  const Node = (
    await server.ssrLoadModule("/src/components/visuals/NodeVisual.tsx")
  ).default;
  const render = (Component, options) =>
    renderToStaticMarkup(React.createElement(Component, options));
  const v = (variables, config, input = {}, extra = {}) =>
    render(Visual, { step: step(variables), config, input, ...extra });
  const s = (options) => render(Sequence, options);
  const node = (options) => render(Node, options);
  const sections = (html) =>
    [
      ...html.matchAll(
        /<section class="structure"[^>]*>([\s\S]*?)<\/section>/g,
      ),
    ].map((m) => m[1]);
  test("median pointers scoped per input", () => {
    const parts = sections(
      v(
        { nums1: [1, 3], nums2: [2, 4], i: 1, j: 0 },
        props("array", ["nums1", "nums2"], ["i", "j"]),
      ),
    );
    assert.match(parts[0], /Index 1: 3; i/);
    assert.doesNotMatch(parts[0], /; j/);
    assert.match(parts[1], /Index 0: 2; j/);
    assert.doesNotMatch(parts[1], /; i/);
  });
  test("result does not inherit input index", () => {
    const parts = sections(
      v(
        { nums: [2, 7, 11], result: [0, 1], i: 2 },
        props("array", ["nums", "result"], ["i"]),
      ),
    );
    assert.match(parts[0], /Index 2: 11; i/);
    assert.doesNotMatch(parts[1], /seq-current/);
  });
  test("minwindow s pointers do not annotate t", () => {
    const parts = sections(
      v(
        { s: "ABCB", t: "ABC", left: 1, right: 3, best_start: 1 },
        props("array", ["s", "t"], ["left", "right", "best_start"]),
      ),
    );
    assert.match(parts[0], /seq-within-bounds/);
    assert.doesNotMatch(parts[1], /seq-current|seq-within-bounds/);
  });
  test("explicit pointer targets override heuristics", () => {
    const config = {
      ...props("array", ["buffer"], ["cursor"]),
      pointerTargets: { buffer: ["cursor"] },
    };
    assert.match(
      v({ buffer: [4, 5], cursor: 1 }, config),
      /Index 1: 5; cursor/,
    );
  });
  test("paired matrix positions only", () => {
    const html = s({
      kind: "grid",
      variable: "matrix",
      value: [
        [1, 2],
        [3, 4],
      ],
      pointers: { row: 1, col: 0, nr: 0, nc: 1 },
    });
    assert.equal((html.match(/; current cell/g) || []).length, 2);
    assert.match(html, /\[1, 0\] = 3; current cell/);
    assert.match(html, /\[0, 1\] = 2; current cell/);
  });
  test("unpaired coordinate does not color row", () => {
    assert.doesNotMatch(
      s({
        kind: "grid",
        variable: "matrix",
        value: [
          [1, 2],
          [3, 4],
        ],
        pointers: { row: 1 },
      }),
      /; current cell/,
    );
  });
  test("normal nums array in heap lesson stays array", () => {
    const html = s({ kind: "heap", variable: "nums", value: [1, 2, 3] });
    assert.match(html, /seq-array-visual/);
    assert.doesNotMatch(html, /seq-heap-tree/);
  });
  test("tuple heap priorities preserve negative sign", () => {
    const html = s({
      kind: "heap",
      variable: "lower",
      value: [
        [-8, 2],
        [-5, 3],
      ],
    });
    assert.match(html, /seq-heap-tree/);
    assert.match(html, />-8<\/text>/);
    assert.match(html, /Negative priorities are shown as/);
  });
  test("empty heap is still heap", () => {
    assert.match(
      s({ kind: "heap", variable: "heap", value: [] }),
      /Empty heap/,
    );
  });
  test("bit low32 and changed counts", () => {
    const html = s({ kind: "bits", variable: "n", value: 3, previousValue: 1 });
    assert.equal((html.match(/class="seq-bit /g) || []).length, 32);
    assert.match(html, /Bit 1: 1/);
    assert.equal((html.match(/seq-changed/g) || []).length, 1);
  });
  test("large traced bit integer says low32", () => {
    assert.match(
      s({ kind: "bits", variable: "result", value: 4294967296 }),
      /Showing the low 32 bits/,
    );
  });
  test("Interval objects use real shared scale", () => {
    const html = s({
      kind: "intervals",
      variable: "merged",
      value: [{ start: -5, end: 2 }],
      variables: { intervals: [{ start: 3, end: 10 }] },
    });
    assert.match(html, /Shared scale -5…10/);
    assert.match(html, /title="\[-5, 2\]"/);
  });
  test("empty intervals keep input scale", () => {
    assert.match(
      s({
        kind: "intervals",
        variable: "result",
        value: [],
        variables: { intervals: [[-4, 8]] },
      }),
      /Shared scale -4…8/,
    );
  });
  test("point interval has finite width", () => {
    const html = s({
      kind: "intervals",
      variable: "intervals",
      value: [[3, 3]],
    });
    assert.match(html, /seq-point-interval/);
    assert.doesNotMatch(html, /NaN|Infinity/);
  });
  test("array render limit disclosed", () => {
    assert.match(
      s({
        kind: "array",
        variable: "nums",
        value: Array.from({ length: 50 }, (_, i) => i),
      }),
      /50 captured entries · showing 32/,
    );
  });
  test("heap render limit disclosed", () => {
    assert.match(
      s({
        kind: "heap",
        variable: "heap",
        value: Array.from({ length: 40 }, (_, i) => i),
      }),
      /40 captured entries · showing 31/,
    );
  });
  test("matrix render limit disclosed", () => {
    assert.match(
      s({
        kind: "grid",
        variable: "matrix",
        value: Array.from({ length: 20 }, () => Array(25).fill(1)),
      }),
      /showing 16 × 20/,
    );
  });
  test("snapshot limit message is displayed", () => {
    const config = props("array", ["nums"]);
    const html = render(Visual, {
      step: step(
        { nums: [1, 2] },
        { nums: "Sequence capture limited to 40 entries" },
      ),
      config,
      input: {},
    });
    assert.match(html, /Sequence capture limited to 40 entries/);
  });
  const linked = snapshot("linked-list", [
    n("node-0", 7, { next: "node-1" }),
    n("node-1", 7, { next: "node-2" }),
    n("node-2", 9),
  ]);
  test("duplicate-valued linked nodes use identity pointer", () => {
    const html = node({
      value: linked,
      kind: "linked-list",
      variable: "head",
      variables: { current: { __nodeRef: "node-1" } },
    });
    assert.match(html, /7; identity node-1; pointers: current; current/);
    assert.doesNotMatch(html, /7; identity node-0; pointers: current/);
  });
  test("cyclic list renders self-edge", () => {
    assert.match(
      node({
        value: snapshot("linked-list", [n("node-0", 1, { next: "node-0" })]),
        kind: "linked-list",
        variable: "head",
      }),
      /next link from 1 to 1/,
    );
  });
  test("detached linked prefix is retained as forest", () => {
    const current = snapshot("linked-list", [
      n("node-1", 2, { next: "node-2" }),
      n("node-2", 3),
    ]);
    const previous = snapshot("linked-list", [n("node-0", 1)]);
    const html = node({
      value: current,
      kind: "linked-list",
      variable: "head",
      variables: { current, previous },
    });
    assert.match(html, /3 nodes/);
    assert.match(html, /identity node-0/);
  });
  test("tree frontier forests combine nodes", () => {
    const a = snapshot("tree", [n("node-0", 1)]),
      b = snapshot("tree", [n("node-1", 2)]);
    const html = node({
      value: [
        [a, 5],
        [b, 7],
      ],
      kind: "tree",
      variable: "stack",
      variables: {
        stack: [
          [a, 5],
          [b, 7],
        ],
      },
    });
    assert.match(html, /2 nodes/);
    assert.match(html, /identity node-0; frontier/);
    assert.match(html, /identity node-1; frontier/);
  });
  test("numeric graph vertices and queue status", () => {
    const html = node({
      value: [[1], []],
      kind: "graph",
      variable: "graph",
      input: { numCourses: 2 },
      variables: { queue: [1], course: 0 },
    });
    assert.match(html, /identity 0; pointers: course; current/);
    assert.match(html, /identity 1; frontier/);
  });
  test("graph prerequisite edges reverse input pair", () => {
    const html = node({
      value: [[1, 0]],
      kind: "graph",
      variable: "prerequisites",
      input: { numCourses: 2 },
    });
    assert.match(html, /1 link from 0 to 1/);
  });
  test("snapshot truncation is disclosed", () => {
    const data = { ...linked, truncated: true, totalNodes: 45 };
    assert.match(
      node({ value: data, kind: "linked-list", variable: "head" }),
      /42 additional nodes omitted/,
    );
  });
  test("removed link renders from previous step", () => {
    const curr = snapshot("linked-list", [
      n("node-0", 1),
      n("node-1", 2, { next: "node-0" }),
    ]);
    const prev = snapshot("linked-list", [
      n("node-0", 1, { next: "node-1" }),
      n("node-1", 2),
    ]);
    const html = node({
      value: curr,
      previousValue: prev,
      kind: "linked-list",
      variable: "head",
    });
    assert.match(html, /Removed next link/);
    assert.match(html, /next link from 2 to 1 \(changed\)/);
  });
  test("numeric visited set snapshots highlight IDs", () => {
    const html = node({
      value: [[1], [0, 2], [1]],
      kind: "graph",
      variable: "adjacency",
      input: {
        n: 3,
        edges: [
          [0, 1],
          [1, 2],
        ],
      },
      variables: { visited: [0, 2] },
    });
    assert.match(html, /0; identity 0; visited/);
    assert.match(html, /2; identity 2; visited/);
    assert.equal((html.match(/nv-node-visited/g) || []).length, 2);
  });
  test("numeric seen ID1 remains vertex1", () => {
    const html = node({
      value: [[], [], []],
      kind: "graph",
      variable: "graph",
      input: { n: 3 },
      variables: { seen: [1, 2] },
    });
    assert.match(html, /1; identity 1; visited/);
    assert.match(html, /2; identity 2; visited/);
    assert.doesNotMatch(html, /0; identity 0; visited/);
  });
  test("strictboolean visited arrays still map by index", () => {
    const html = node({
      value: [[], [], []],
      kind: "graph",
      variable: "graph",
      input: { n: 3 },
      variables: { visited: [true, false, true] },
    });
    assert.match(html, /0; identity 0; visited/);
    assert.match(html, /2; identity 2; visited/);
  });
  test("alien dictionary letter current and queue highlight IDs", () => {
    const html = node({
      value: { w: ["e"], e: [] },
      kind: "graph",
      variable: "graph",
      variables: { char: "w", queue: ["e"] },
    });
    assert.match(html, /w; identity w; pointers: char; current/);
    assert.match(html, /e; identity e; frontier/);
  });
  test("object node snapshots never bind by scalar values", () => {
    const html = node({
      value: snapshot("graph", [n("node-0", 0)]),
      kind: "graph",
      variable: "graph",
      variables: { course: 0 },
    });
    assert.doesNotMatch(html, /pointers: course/);
  });
  test("undirected adjacency input renders one plain edge", () => {
    const html = node({
      value: [[1], [0]],
      kind: "graph",
      variable: "adjacency",
      input: { n: 2, edges: [[0, 1]] },
    });
    assert.equal((html.match(/class="nv-edge"/g) || []).length, 1);
    assert.doesNotMatch(html, /marker-end=/);
  });
  test("course graph retains directed arrows", () => {
    const html = node({
      value: [[1], []],
      kind: "graph",
      variable: "graph",
      input: { numCourses: 2, prerequisites: [[1, 0]] },
    });
    assert.match(html, /marker-end=/);
  });
  test("sortable candidates are not mislabeled FIFO", () => {
    const html = s({
      value: ["aa", "ab", "ac"],
      variable: "candidates",
      kind: "trie",
    });
    assert.match(html, /seq-array-visual/);
    assert.doesNotMatch(html, /FIFO|LIFO/);
  });
  test("ambiguous frontier is not mislabeled FIFO", () => {
    const html = s({ value: [0, 2], variable: "frontier", kind: "graph" });
    assert.doesNotMatch(html, /FIFO|LIFO/);
  });
  test("trie cached index zero is a value, not a word endpoint", () => {
    const html = node({
      value: { a: { $: 0, __ref: "dict-1" }, __ref: "dict-0" },
      kind: "trie",
      variable: "trie",
    });
    assert.match(html, /largest matching index: 0/);
    assert.match(html, />index 0<\/text>/);
    assert.doesNotMatch(html, /complete word|Word endpoint/);
  });
  test("boolean trie end still marks a complete word", () => {
    const html = node({
      value: { a: { "#": true, __ref: "dict-1" }, __ref: "dict-0" },
      kind: "trie",
      variable: "trie",
    });
    assert.match(html, /complete word/);
    assert.match(html, /Word endpoint/);
  });
  test("flood fill retains marked land separately from water", () => {
    const html = v(
      {
        grid: [
          ["0", "0"],
          ["1", "0"],
        ],
        islands: 1,
        row: 0,
        col: 0,
        r: 0,
        c: 0,
      },
      props("grid", ["grid"]),
      {
        grid: [
          ["1", "0"],
          ["1", "0"],
        ],
      },
      { slug: "number-of-islands" },
    );
    assert.match(html, /\[0, 0\]: marked land/);
    assert.match(html, /\[0, 1\]: water/);
    assert.match(html, /\[1, 0\]: unvisited land/);
  });
  console.log(
    `Visualization regressions: ${checked.length} passed, ${failures.length} failures`,
  );
  if (failures.length) {
    console.error(failures);
    process.exitCode = 1;
  }
} finally {
  await server.close();
}
