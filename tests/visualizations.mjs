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
  test("long DP pages include the active cell and compare original indices", () => {
    const values = Array(128).fill(-1),
      previous = [...values];
    values[48] = 3;
    const html = s({
      value: values,
      previousValue: previous,
      variable: "remainder",
      pointers: { mask: 48, next_mask: 96 },
    });
    assert.match(html, /Showing indices 32–63/);
    assert.match(html, /Index 48: 3; mask; changed since previous step/);
    assert.doesNotMatch(html, /aria-label="Index 0:/);
    assert.match(html, /outside displayed range/);
    assert.match(html, /128 captured entries · showing 32/);
  });
  test("sentinel pointers do not select an uncaptured page", () => {
    const html = s({
      value: Array(40).fill(0),
      variable: "dp",
      pointers: { i: 40 },
    });
    assert.match(html, /Showing indices 0–31/);
    assert.match(html, /outside captured range/);
  });
  test("focused LCS keeps both DP rows visible", () => {
    const parts = sections(
      v(
        {
          text1: "abc",
          text2: "ac",
          previous: [0, 1, 1],
          current: [0, 1, 2],
          col: 2,
        },
        props("dp", ["text1", "text2", "previous", "current"], ["col"]),
        {},
        { slug: "longest-common-subsequence", part: "primary" },
      ),
    );
    assert.equal(parts.length, 2);
    assert.match(parts[0], /previous/);
    assert.match(parts[1], /current/);
    assert.match(parts[1], /Index 2: 2; col/);
  });
  test("focused Sudoku keeps constraints in details", () => {
    const state = {
        board: [["1", "."]],
        rows: [[1]],
        cols: [[1]],
        boxes: [[1]],
      },
      config = props("grid", ["board", "rows", "cols"], [], ["boxes"]);
    const primary = v(
      state,
      config,
      {},
      { slug: "sudoku-solver", part: "primary" },
    );
    const details = v(
      state,
      config,
      {},
      { slug: "sudoku-solver", part: "details" },
    );
    assert.equal(sections(primary).length, 1);
    assert.match(primary, /board/);
    assert.match(details, /rows/);
    assert.match(details, /cols/);
    assert.match(details, /boxes/);
  });
  test("subtree aliases use the canonical tree while separate trees remain", () => {
    const nodes = [n("a", 1, { left: "b" }), n("b", 2)];
    const config = props("tree", ["root", "node"]);
    const state = {
      root: snapshot("tree", nodes),
      node: snapshot("tree", [nodes[1]], "b"),
    };
    assert.equal(sections(v(state, config, {}, { part: "primary" })).length, 1);
    assert.match(v(state, config, {}, { part: "summary" }), /node-reference/);
    assert.equal(
      sections(
        v(
          { p: state.root, q: state.node },
          props("tree", ["p", "q"]),
          {},
          { part: "primary" },
        ),
      ).length,
      2,
    );
  });
  test("trie fits a single canonical structure", () => {
    const trie = { a: { b: { "#": true } } };
    assert.equal(
      sections(
        v(
          { trie, node: trie.a, structure: trie },
          props("trie", ["trie", "node"]),
          {},
          { part: "primary" },
        ),
      ).length,
      1,
    );
    const html = node({ value: trie, kind: "trie", variable: "trie" });
    const positions = [
      ...html.matchAll(
        /class="nv-node[^"]*"[^>]*transform="translate\(([\d.]+) ([\d.]+)\)"/g,
      ),
    ].map((m) => [Number(m[1]), Number(m[2])]);
    assert.equal(positions.length, 3);
    assert(positions[1][0] > positions[0][0]);
    assert.equal(positions[1][1], positions[0][1]);
  });
  test("full collection returns remain available in state details", () => {
    const returned = {
      ...step(
        { returnValue: [1, 2, 3] },
        { returnValue: "Sequence capture limited to 3 entries" },
      ),
      event: "return",
    };
    const config = props("array");
    assert.match(
      v({}, config, {}, { step: returned, part: "summary" }),
      /return value · State details/,
    );
    const details = v({}, config, {}, { step: returned, part: "details" });
    assert.match(details, /Index 2: 3/);
    assert.match(details, /Sequence capture limited to 3 entries/);
    assert.doesNotMatch(details, /No additional state/);
  });
  test("combined list inputs render once with every pointer and node", () => {
    const l1 = snapshot("linked-list", [n("a", 1, { next: "b" }), n("b", 2)]);
    const l2 = snapshot("linked-list", [n("c", 3, { next: "d" }), n("d", 4)]);
    const dummy = snapshot("linked-list", [n("e", 0)]);
    const config = props("linked-list", ["l1", "l2", "dummy"]);
    const primary = v({ l1, l2, dummy }, config, {}, { part: "primary" });
    assert.equal(sections(primary).length, 1);
    assert.equal((primary.match(/class="nv-node /g) || []).length, 5);
    assert.match(primary, /Linked lists and pointers/);
    assert.match(primary, /pointers: l2/);
    assert.match(primary, /pointers: dummy/);
    assert.match(v({ l1, l2, dummy }, config, {}, { part: "summary" }), /l2/);
  });
  test("large list forests retain separate captured roots", () => {
    const lists = Object.fromEntries(
      ["l1", "l2"].map((key) => [
        key,
        snapshot(
          "linked-list",
          Array.from({ length: 40 }, (_, i) =>
            n(`${key}-${i}`, i, i < 39 ? { next: `${key}-${i + 1}` } : {}),
          ),
        ),
      ]),
    );
    const primary = v(
      lists,
      props("linked-list", ["l1", "l2"]),
      {},
      { part: "primary" },
    );
    assert.equal(sections(primary).length, 2);
    assert.match(primary, /additional nodes omitted/);
  });
  test("unnamed detached list pointers retain their captured chains", () => {
    const head = snapshot("linked-list", [n("a", 1, { next: "c" }), n("c", 3)]);
    const even_head = snapshot("linked-list", [
      n("b", 2, { next: "d" }),
      n("d", 4),
    ]);
    const html = node({
      value: head,
      kind: "linked-list",
      variables: { head, even_head },
    });
    assert.equal((html.match(/class="nv-node /g) || []).length, 4);
    assert.match(html, /pointers: even_head/);
  });
  test("list links skip intervening nodes with a clear arc", () => {
    const html = node({
      value: snapshot("linked-list", [
        n("a", 1, { next: "c" }),
        n("b", 2),
        n("c", 3),
      ]),
      kind: "linked-list",
    });
    assert.match(html, /d="M 106 100 Q 182 4 258 100"/);
    assert.match(html, /next link from 1 to 3/);
  });
  test("changes to secondary list chains remain highlighted", () => {
    const l1 = snapshot("linked-list", [n("a", 1)]);
    const oldDummy = snapshot("linked-list", [n("d", 0)]);
    const dummy = snapshot("linked-list", [
      n("d", 0, { next: "e" }),
      n("e", 7),
    ]);
    const html = node({
      value: l1,
      previousValue: l1,
      kind: "linked-list",
      variables: { l1, dummy },
      previousVariables: { l1, dummy: oldDummy },
    });
    assert.match(html, /nv-edge-changed/);
    assert.match(html, /next link from 0 to 7 \(changed\)/);
  });
  test("subtree aliases with additional captured nodes stay visible", () => {
    const root = snapshot("tree", [
      n("a", 1, { left: "b" }),
      n("b", 2, { left: "c" }),
    ]);
    const target = snapshot("tree", [n("b", 2, { left: "c" }), n("c", 3)], "b");
    const config = props("tree", ["root", "target"]);
    assert.equal(
      sections(v({ root, target }, config, {}, { part: "primary" })).length,
      2,
    );
    const complete = snapshot("tree", [...root.nodes, target.nodes[1]]);
    assert.equal(
      sections(v({ root: complete, target }, config, {}, { part: "primary" }))
        .length,
      1,
    );
  });
  test("plain trie pointers reuse the captured root without losing deeper state", () => {
    const leaf = { __ref: "dict-2", "#": true };
    const child = { __ref: "dict-1", b: leaf };
    const trie = { __ref: "dict-0", a: child };
    const config = props("trie", ["trie", "node"]);
    assert.equal(
      sections(v({ trie, node: child }, config, {}, { part: "primary" }))
        .length,
      1,
    );
    assert.match(
      v({ trie, node: child }, config, {}, { part: "summary" }),
      /dict-1/,
    );
    const limited = { __ref: "dict-0", a: { __ref: "dict-1", b: "…" } };
    assert.equal(
      sections(
        v({ trie: limited, node: child }, config, {}, { part: "primary" }),
      ).length,
      2,
    );
  });
  const choose = (
    await server.ssrLoadModule("/src/data/visualizationBindings.ts")
  ).visualizationFor;
  test("Two Sum keeps its lookup table beside the indexed input", () => {
    const config = choose("two-sum", props("array", ["nums", "seen"], ["i"]));
    const html = v(
      { nums: [2, 7], seen: { 2: 0 }, i: 1 },
      config,
      {},
      { part: "primary" },
    );
    assert.equal(sections(html).length, 2);
    assert.match(html, /collection-map/);
    assert.match(html, /Index 1: 7; i/);
  });
  test("explicit heap wins over interval shape in Meeting Rooms II", () => {
    const config = choose(
      "meeting-rooms-ii",
      props("intervals", ["active_ends"]),
    );
    const html = v({ active_ends: [3, 8] }, config);
    assert.match(html, /seq-heap-tree/);
    assert.doesNotMatch(html, /seq-interval-bar/);
  });
  test("explicit matrix override works inside an array lesson", () => {
    const html = v(
      {
        cells: [
          [1, 2],
          [3, 4],
        ],
        row: 1,
        col: 0,
      },
      {
        ...props("array", ["cells"], ["row", "col"]),
        renderers: { cells: "matrix" },
      },
    );
    assert.match(html, /seq-matrix-visual/);
    assert.match(html, /seq-crosshair/);
    assert.match(html, /seq-axis-current/);
  });
  test("membership changes ignore set iteration order", () => {
    const config = choose("contains-duplicate", props("array", ["seen"]));
    const html = v(
      { seen: [7, 2] },
      config,
      {},
      { previousStep: step({ seen: [2, 7] }) },
    );
    assert.match(html, /membership, unordered/);
    assert.doesNotMatch(html, /collection-added|collection-removed/);
    const changed = v(
      { seen: [7, 3] },
      config,
      {},
      { previousStep: step({ seen: [2, 7] }) },
    );
    assert.match(changed, /collection-added/);
    assert.match(changed, /Removed:/);
  });
  test("map edits show prior values and additions without leaking identity keys", () => {
    const html = v(
      { counts: { a: 2, b: 1, __ref: "internal" } },
      { ...props("array", ["counts"]), renderers: { counts: "map" } },
      {},
      { previousStep: step({ counts: { a: 1, c: 4 } }) },
    );
    assert.match(html, /collection-before/);
    assert.match(html, /collection-new/);
    assert.match(html, /1 removed since previous step/);
    assert.doesNotMatch(html, /internal/);
  });
  test("node value edits remain distinct from link edits", () => {
    const html = node({
      value: snapshot("tree", [n("a", 8)]),
      previousValue: snapshot("tree", [n("a", 4)]),
      kind: "tree",
    });
    assert.match(html, /value changed from 4/);
    assert.match(html, /nv-value-change/);
    assert.match(html, /Changed value/);
  });
  test("list figures expose null next pointers and split value cells", () => {
    const html = node({
      value: snapshot("linked-list", [n("a", 2)]),
      kind: "linked-list",
    });
    assert.match(html, /nv-list-divider/);
    assert.match(html, /nv-list-null/);
    assert.match(html, /next = None/);
  });
  test("DP presentation does not label the problem input as a DP row", () => {
    const input = s({ kind: "dp", variable: "nums", value: [2, 7] });
    assert.doesNotMatch(input, /seq-dp-strip/);
    assert.match(
      s({ kind: "dp", variable: "dp", value: [0, 1] }),
      /seq-dp-strip/,
    );
  });
  test("explicit node renderers support custom variable names", () => {
    const html = v(
      { hierarchy: [1, 2, 3] },
      { ...props("array", ["hierarchy"]), renderers: { hierarchy: "tree" } },
    );
    assert.match(html, /data-kind="tree"/);
    assert.equal((html.match(/class="nv-node /g) || []).length, 3);
  });
  test("duplicate heap snapshots move to details without losing captured state", () => {
    const state = { lower: [-2], upper: [3] };
    const variables = { ...state, structure: state };
    const config = choose(
      "find-median-from-data-stream",
      props("heap", ["lower", "upper"]),
    );
    const html = v(variables, config, {}, { part: "primary" });
    assert.equal((html.match(/seq-heap-tree/g) || []).length, 2);
    assert.doesNotMatch(html, /Data structure state/);
    assert.match(
      v(variables, config, {}, { part: "details" }),
      /collection-map/,
    );
  });
  test("unrelated numeric pointers do not repeat on result strips", () => {
    assert.doesNotMatch(
      s({
        kind: "grid",
        variable: "result",
        value: [1, 2],
        pointers: { row: 1, col: 0 },
      }),
      /seq-index-legend/,
    );
  });
  test("truncated list inputs retain unknown next links instead of claiming None", () => {
    const html = node({
      value: Array.from({ length: 48 }, (_, i) => i),
      kind: "linked-list",
      variable: "head",
    });
    assert.match(html, /additional nodes omitted/);
    assert.doesNotMatch(html, /next = None/);
  });
  test("user map keys starting with underscores remain visible", () => {
    assert.match(
      v({ counts: { __word: 2 } }, props("array", ["counts"])),
      /__word/,
    );
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
