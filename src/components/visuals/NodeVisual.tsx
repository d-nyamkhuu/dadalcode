import { useId, useMemo, useRef, type ReactNode } from "react";
import "./node.css";

type NodeRecord = {
  id: string;
  value: unknown;
  links: Record<string, string>;
  terminal?: boolean;
  storedIndex?: number;
};
type Model = {
  kind: string;
  nodes: NodeRecord[];
  root: string;
  stable: boolean;
  omitted: number;
  truncated: boolean;
  directed: boolean;
  scalarIds?: boolean;
};
type Point = { x: number; y: number };
type Props = {
  value: unknown;
  previousValue?: unknown;
  kind?: string;
  variable?: string;
  variables?: Record<string, unknown>;
  input?: Record<string, unknown>;
};
const LIMIT = 40;
const object = (v: unknown): Record<string, unknown> | null =>
  v !== null && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
const text = (v: unknown): string =>
  v === null
    ? "None"
    : typeof v === "string"
      ? v
      : (JSON.stringify(v) ?? String(v));
const ref = (v: unknown): string | null => {
  const record = object(v);
  if (!record) return null;
  if (typeof record.__nodeRef === "string") return record.__nodeRef;
  if (typeof record.__ref === "string") return record.__ref;
  if (typeof record.identity === "string") return record.identity;
  return record.stableIds === true && typeof record.root === "string"
    ? record.root
    : null;
};

function snapshotModel(value: unknown): Model | null {
  const data = object(value);
  if (
    !data ||
    !["tree", "linked-list", "graph"].includes(String(data.__kind)) ||
    !Array.isArray(data.nodes)
  )
    return null;
  const nodes: NodeRecord[] = [];
  for (const item of data.nodes.slice(0, LIMIT)) {
    const node = object(item),
      links = object(node?.links);
    if (!node || typeof node.id !== "string" || !links) continue;
    nodes.push({
      id: node.id,
      value: node.value,
      links: Object.fromEntries(
        Object.entries(links).filter(([, v]) => typeof v === "string"),
      ) as Record<string, string>,
    });
  }
  if (!nodes.length) return null;
  const total =
    typeof data.totalNodes === "number" ? data.totalNodes : data.nodes.length;
  return {
    kind: String(data.__kind),
    nodes,
    root: typeof data.root === "string" ? data.root : nodes[0].id,
    stable: data.stableIds === true,
    omitted: Math.max(0, total - nodes.length),
    truncated: Boolean(data.truncated) || total > nodes.length,
    directed: true,
  };
}

function graphModel(
  value: unknown,
  variable: string,
  input: Record<string, unknown>,
): Model | null {
  if (!/graph|adj|edges|prereq/i.test(variable)) return null;
  const map = new Map<string, NodeRecord>();
  const add = (id: string | number) => {
    const key = String(id);
    if (!map.has(key)) map.set(key, { id: key, value: id, links: {} });
    return map.get(key)!;
  };
  const count = input.numCourses ?? input.n;
  if (typeof count === "number")
    for (let i = 0; i < Math.min(count, 200); i++) add(i);
  if (Array.isArray(value) && /edges|prereq/i.test(variable)) {
    for (const item of value) {
      if (
        !Array.isArray(item) ||
        item.length !== 2 ||
        item.some((v) => typeof v !== "number" && typeof v !== "string")
      )
        continue;
      let [a, b] = item as (string | number)[];
      if (/prereq/i.test(variable)) [a, b] = [b, a];
      add(a).links[String(b)] = String(b);
      add(b);
    }
  } else if (value && typeof value === "object") {
    for (const [id, neighbors] of Object.entries(value)) {
      if (id.startsWith("__") || !Array.isArray(neighbors)) continue;
      const node = add(id);
      for (const neighbor of neighbors)
        if (typeof neighbor === "number" || typeof neighbor === "string") {
          node.links[String(neighbor)] = String(neighbor);
          add(neighbor);
        }
    }
  } else return null;
  if (!map.size) return null;
  const all = [...map.values()];
  const total =
    typeof count === "number" ? Math.max(count, all.length) : all.length;
  return {
    kind: "graph",
    nodes: all.slice(0, LIMIT),
    root: all[0].id,
    stable: true,
    omitted: Math.max(0, total - LIMIT),
    truncated: total > LIMIT,
    directed: !(
      /edges/i.test(variable) ||
      (/prereq/i.test(variable) === false &&
        "edges" in input &&
        !("numCourses" in input))
    ),
    scalarIds: true,
  };
}

function trieModel(value: unknown): Model | null {
  const record = object(value);
  if (!record) return null;
  const root = object(record.root) ?? object(record.trie) ?? record;
  const nodes: NodeRecord[] = [];
  const seen = new Map<object, string>();
  let omitted = 0;
  let truncated = false;
  function visit(
    item: Record<string, unknown>,
    label: string,
    path: string,
  ): string {
    const existing = seen.get(item);
    if (existing) return existing;
    const id = ref(item) ?? `trie:${path}`;
    seen.set(item, id);
    const terminal = [
      "#",
      "$",
      "end",
      "is_end",
      "isWord",
      "terminal",
      "word",
    ].some((key) => typeof item[key] !== "number" && Boolean(item[key]));
    const node: NodeRecord = {
      id,
      value: label,
      links: {},
      terminal,
      storedIndex: typeof item.$ === "number" ? item.$ : undefined,
    };
    nodes.push(node);
    const children = object(item.children) ?? item;
    for (const [letter, child] of Object.entries(children).sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      if (letter.length !== 1 || ["#", "$"].includes(letter)) continue;
      const next = object(child);
      if (!next) {
        if (child === "…" || child === "↻") truncated = true;
        continue;
      }
      if (nodes.length >= LIMIT) {
        omitted++;
        truncated = true;
        continue;
      }
      node.links[letter] = visit(next, letter, path + letter);
    }
    return id;
  }
  const rootId = visit(root, "∅", "");
  return {
    kind: "trie",
    nodes,
    root: rootId,
    stable: ref(root) !== null,
    omitted,
    truncated,
    directed: true,
  };
}

function inputNodes(
  value: unknown,
  kind: string,
  variable: string,
): Model | null {
  if (
    !Array.isArray(value) ||
    !value.length ||
    value.some(
      (v) => v !== null && typeof v !== "number" && typeof v !== "string",
    )
  )
    return null;
  if (kind === "linked-list" && /^(head|l1|l2|list)$/.test(variable)) {
    const nodes: NodeRecord[] = value
      .slice(0, LIMIT)
      .map<NodeRecord>((v, i) => ({
        id: `input:${i}`,
        value: v,
        links: (i + 1 < Math.min(value.length, LIMIT)
          ? { next: `input:${i + 1}` }
          : {}) as Record<string, string>,
      }));
    return {
      kind,
      nodes,
      root: "input:0",
      stable: false,
      omitted: Math.max(0, value.length - LIMIT),
      truncated: value.length > LIMIT,
      directed: true,
    };
  }
  if (
    kind === "tree" &&
    /^(root|tree|p|q|subRoot)$/.test(variable) &&
    value[0] !== null
  ) {
    const nodes: NodeRecord[] = [{ id: "input:0", value: value[0], links: {} }];
    let cursor = 1,
      parent = 0;
    while (
      parent < nodes.length &&
      cursor < value.length &&
      nodes.length < LIMIT
    ) {
      for (const side of ["left", "right"]) {
        const i = cursor++;
        if (i >= value.length) break;
        if (value[i] !== null) {
          const id = `input:${i}`;
          nodes[parent].links[side] = id;
          nodes.push({ id, value: value[i], links: {} });
        }
      }
      parent++;
    }
    const total = value.filter((v) => v !== null).length;
    return {
      kind,
      nodes,
      root: "input:0",
      stable: false,
      omitted: Math.max(0, total - nodes.length),
      truncated: total > nodes.length,
      directed: true,
    };
  }
  return null;
}
function modelFor(
  value: unknown,
  kind: string,
  variable: string,
  input: Record<string, unknown>,
): Model | null {
  const snapshot = snapshotModel(value);
  if (snapshot) return snapshot;
  if (kind === "graph") return graphModel(value, variable, input);
  if (
    kind === "trie" &&
    /node|root|structure|trie|frontier/i.test(variable) &&
    object(value)
  )
    return trieModel(value);
  return inputNodes(value, kind, variable);
}

function gatherSnapshots(value: unknown, output: Model[], depth = 0): void {
  if (depth > 5) return;
  const model = snapshotModel(value);
  if (model) {
    output.push(model);
    return;
  }
  if (Array.isArray(value))
    for (const item of value) gatherSnapshots(item, output, depth + 1);
}
function combinedModel(
  value: unknown,
  kind: string,
  variable: string,
  input: Record<string, unknown>,
  variables: Record<string, unknown>,
): Model | null {
  let base = modelFor(value, kind, variable, input);
  const forest: Model[] = [];
  if (
    !base &&
    Array.isArray(value) &&
    /stack|queue|frontier|nodes/.test(variable)
  ) {
    gatherSnapshots(value, forest);
    if (forest.length) base = forest[0];
  }
  if (!base) return null;
  const components = forest.length ? forest : [base];
  if (base.kind === "linked-list" && base.stable) {
    for (const [name, item] of Object.entries(variables)) {
      if (
        /^(head|current|previous|prev|following|next_node|slow|fast|entrance|tail|new_head|new_tail|left|right|dummy|l1|l2)$/.test(
          name,
        )
      )
        gatherSnapshots(item, components);
    }
  }
  if (components.length === 1) return base;
  const nodes = new Map<string, NodeRecord>();
  let omitted = 0,
    truncated = false;
  for (const component of components)
    if (component.kind === base.kind && component.stable === base.stable) {
      for (const node of component.nodes)
        if (!nodes.has(node.id)) nodes.set(node.id, node);
      omitted = Math.max(omitted, component.omitted);
      truncated ||= component.truncated;
    }
  const all = [...nodes.values()];
  return {
    ...base,
    nodes: all.slice(0, LIMIT),
    omitted: omitted + Math.max(0, all.length - LIMIT),
    truncated: truncated || all.length > LIMIT,
  };
}

function positionsFor(model: Model): Map<string, Point> {
  const positions = new Map<string, Point>(),
    byId = new Map(model.nodes.map((n) => [n.id, n]));
  if (model.kind === "linked-list") {
    model.nodes.forEach((n, i) =>
      positions.set(n.id, {
        x: 72 + (i % 6) * 112,
        y: 100 + Math.floor(i / 6) * 138,
      }),
    );
  } else if (model.kind === "tree" || model.kind === "trie") {
    let leaf = 0;
    const seen = new Set<string>();
    function place(id: string, depth: number): number {
      if (seen.has(id)) return positions.get(id)?.x ?? 72;
      seen.add(id);
      const node = byId.get(id);
      const links = node
        ? Object.entries(node.links).filter(([, to]) => byId.has(to))
        : [];
      const xs = links.map(([, to]) => place(to, depth + 1));
      const x = xs.length
        ? xs.reduce((a, b) => a + b, 0) / xs.length
        : 72 + leaf++ * 112;
      positions.set(id, { x, y: 96 + depth * 152 });
      return x;
    }
    place(model.root, 0);
    for (const node of model.nodes) if (!seen.has(node.id)) place(node.id, 0);
    // Center narrow trees while allowing wide trees to scroll at a readable scale.
    const span =
      Math.max(...[...positions.values()].map((p) => p.x)) -
      Math.min(...[...positions.values()].map((p) => p.x));
    const shift = Math.max(0, (560 - span) / 2 - 72);
    for (const p of positions.values()) p.x += shift;
  } else {
    const count = model.nodes.length;
    if (count <= 12) {
      const radius = Math.max(80, Math.min(240, count * 24));
      model.nodes.forEach((n, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        positions.set(n.id, {
          x: radius + 84 + Math.cos(angle) * radius,
          y: radius + 96 + Math.sin(angle) * radius,
        });
      });
    } else
      model.nodes.forEach((n, i) =>
        positions.set(n.id, {
          x: 72 + (i % 6) * 112,
          y: 96 + Math.floor(i / 6) * 152,
        }),
      );
  }
  return positions;
}
function references(value: unknown, output: Set<string>, depth = 0): void {
  if (depth > 5 || value === null) return;
  const identity = ref(value);
  if (identity) {
    output.add(identity);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) references(item, output, depth + 1);
    return;
  }
  const record = object(value);
  if (record)
    for (const [key, item] of Object.entries(record))
      if (!key.startsWith("__")) {
        const keyRef = key.match(/\[(node-[^\]]+)\]$/);
        if (keyRef) output.add(keyRef[1]);
        references(item, output, depth + 1);
      }
}
function semanticState(
  model: Model,
  variables: Record<string, unknown>,
  variable: string,
) {
  const ids = new Set(model.nodes.map((n) => n.id));
  const current = new Set<string>(),
    visited = new Set<string>(),
    frontier = new Set<string>(),
    pointers = new Map<string, string[]>();
  // Raw adjacency models use vertex labels; node snapshots use object identities.
  const scalarGraph = model.kind === "graph" && model.scalarIds === true;
  function getIds(value: unknown, indexed = false): Set<string> {
    const result = new Set<string>();
    if (model.stable) references(value, result);
    if (scalarGraph) {
      const visit = (v: unknown, depth = 0) => {
        if (depth > 4) return;
        if (typeof v === "number" || typeof v === "string") {
          if (ids.has(String(v))) result.add(String(v));
        } else if (Array.isArray(v)) {
          if (indexed && v.every((x) => typeof x === "boolean"))
            v.forEach((x, i) => {
              if (x === true) result.add(String(i));
            });
          else v.forEach((x) => visit(x, depth + 1));
        } else {
          const o = object(v);
          if (o)
            for (const [k, x] of Object.entries(o)) {
              if (indexed && (x === true || x === 1) && ids.has(k))
                result.add(k);
            }
        }
      };
      visit(value);
    }
    return result;
  }
  for (const [name, value] of Object.entries(variables)) {
    if (name.startsWith("_")) continue;
    if (/^(seen|visited|processed|finished|copies)$/.test(name))
      for (const id of getIds(value, true)) visited.add(id);
    else if (/queue|frontier|ready|stack/.test(name))
      for (const id of getIds(value)) frontier.add(id);
    else if (
      value !== null &&
      (ref(value) !== null ||
        (scalarGraph &&
          /^(node|current|course|vertex|neighbor|dependent|source|target|u|v|char)$/.test(
            name,
          )))
    ) {
      for (const id of getIds(value))
        if (ids.has(id)) {
          const names = pointers.get(id) ?? [];
          if (!names.includes(name)) names.push(name);
          pointers.set(id, names);
          if (
            /^(node|current|course|vertex|u|v|char)$/.test(name) &&
            !/^(root|head|dummy)$/.test(name)
          )
            current.add(id);
        }
    }
  }
  return { current, visited, frontier, pointers };
}

function edgeGeometry(
  a: Point,
  b: Point,
  reverse: boolean,
  loop: boolean,
): { path: string; label: Point } {
  if (loop)
    return {
      path: `M ${a.x - 18} ${a.y - 22} C ${a.x - 68} ${a.y - 90}, ${a.x + 68} ${a.y - 90}, ${a.x + 22} ${a.y - 20}`,
      label: { x: a.x, y: a.y - 70 },
    };
  const dx = b.x - a.x,
    dy = b.y - a.y,
    length = Math.hypot(dx, dy) || 1;
  const start = { x: a.x + (dx / length) * 28, y: a.y + (dy / length) * 28 },
    end = { x: b.x - (dx / length) * 32, y: b.y - (dy / length) * 32 };
  if (reverse || (Math.abs(dy) > 100 && Math.abs(dx) > 150)) {
    const curve = reverse ? 30 : 38;
    const control = {
      x: (start.x + end.x) / 2 - (dy / length) * curve,
      y: (start.y + end.y) / 2 + (dx / length) * curve,
    };
    return {
      path: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`,
      label: {
        x: (start.x + end.x) / 2 - ((dy / length) * curve) / 2,
        y: (start.y + end.y) / 2 + ((dx / length) * curve) / 2,
      },
    };
  }
  return {
    path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
    label: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  };
}

export default function NodeVisual({
  value,
  previousValue,
  kind = "",
  variable = "",
  variables = {},
  input = {},
}: Props): ReactNode | null {
  const marker = useId().replace(/:/g, "");
  const model = useMemo(
    () => combinedModel(value, kind, variable, input, variables),
    [value, kind, variable, input, variables],
  );
  const previous = useMemo(
    () => modelFor(previousValue, kind, variable, input),
    [previousValue, kind, variable, input],
  );
  const cache = useRef<{ kind: string; positions: Map<string, Point> }>({
    kind: "",
    positions: new Map(),
  });
  if (!model) return null;
  const calculated = positionsFor(model);
  // Keep identities in place while links change; reset when the structure is replaced.
  const overlap =
    model.stable && model.nodes.some((n) => cache.current.positions.has(n.id));
  if (cache.current.kind !== model.kind || !overlap)
    cache.current = { kind: model.kind, positions: calculated };
  else {
    for (const [id, p] of calculated)
      if (!cache.current.positions.has(id)) {
        const occupied = [...cache.current.positions.values()].some(
          (q) => Math.hypot(q.x - p.x, q.y - p.y) < 72,
        );
        if (occupied) {
          const maxY = Math.max(
            ...[...cache.current.positions.values()].map((q) => q.y),
          );
          p.y = maxY + 112;
        }
        cache.current.positions.set(id, p);
      }
  }
  const positions = cache.current.positions;
  const visible = model.nodes.map((n) => positions.get(n.id)!).filter(Boolean);
  const width = Math.max(560, ...visible.map((p) => p.x + 88)),
    height = Math.max(230, ...visible.map((p) => p.y + 132));
  const state = semanticState(model, variables, variable);
  const previousNodes = new Map(previous?.nodes.map((n) => [n.id, n]) ?? []);
  const compare = Boolean(
    previous && model.stable && previous.stable && previous.kind === model.kind,
  );
  const currentEdges = new Set(
    model.nodes.flatMap((n) =>
      Object.entries(n.links).map(([label, to]) => `${n.id}|${label}|${to}`),
    ),
  );
  const oldEdges = compare
    ? previous!.nodes
        .flatMap((n) =>
          Object.entries(n.links).map(([label, to]) => ({
            from: n.id,
            label,
            to,
          })),
        )
        .filter(
          (e) =>
            !currentEdges.has(`${e.from}|${e.label}|${e.to}`) &&
            positions.has(e.from) &&
            positions.has(e.to),
        )
    : [];
  const nodeMap = new Map(model.nodes.map((n) => [n.id, n]));
  let changedCount = 0;
  const edges = model.nodes.flatMap((n) =>
    Object.entries(n.links).map(([label, to]) => {
      const changed =
        compare &&
        previousNodes.has(n.id) &&
        previousNodes.get(n.id)!.links[label] !== to;
      if (changed) changedCount++;
      return { from: n.id, label, to, changed };
    }),
  );
  const identityUnavailable =
    !model.stable &&
    variables &&
    Object.values(variables).some((v) => object(v)?.__kind);
  return (
    <div className="nv-root" data-kind={model.kind}>
      <div className="nv-summary">
        <span>
          {model.nodes.length} {model.nodes.length === 1 ? "node" : "nodes"}
        </span>
        <span>
          {model.kind === "trie"
            ? "Prefix links"
            : model.kind === "tree"
              ? "Left / right children"
              : model.kind === "linked-list"
                ? "Next pointers"
                : "Adjacency links"}
        </span>
      </div>
      <div className="nv-scroll">
        <svg
          className="nv-svg"
          viewBox={`0 0 ${width} ${height}`}
          style={{ minWidth: Math.min(width, 900) }}
          role="img"
          aria-label={`${model.kind} diagram: ${model.nodes.length} visible nodes${model.truncated ? ", additional nodes omitted" : ""}`}
        >
          <defs>
            {["normal", "changed", "removed"].map((type) => (
              <marker
                key={type}
                id={`${marker}-${type}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  className={`nv-arrow nv-arrow-${type}`}
                />
              </marker>
            ))}
          </defs>
          {oldEdges.map((e) => {
            const a = positions.get(e.from)!,
              b = positions.get(e.to)!;
            const geometry = edgeGeometry(a, b, true, e.from === e.to);
            return (
              <path
                key={`old-${e.from}-${e.label}-${e.to}`}
                d={geometry.path}
                className="nv-edge nv-edge-removed"
                markerEnd={
                  model.directed ? `url(#${marker}-removed)` : undefined
                }
              >
                <title>{`Removed ${e.label} link`}</title>
              </path>
            );
          })}
          {edges.map((e) => {
            // Cached anchors may outlive omitted nodes; current links need two
            // currently visible endpoints, unlike explicit removed-link history.
            if (!nodeMap.has(e.from) || !nodeMap.has(e.to)) return null;
            const a = positions.get(e.from),
              b = positions.get(e.to);
            if (!a || !b) return null;
            if (
              !model.directed &&
              e.from > e.to &&
              Object.values(nodeMap.get(e.to)?.links ?? {}).includes(e.from)
            )
              return null;
            const reverse = Object.values(
              nodeMap.get(e.to)?.links ?? {},
            ).includes(e.from);
            const geometry = edgeGeometry(a, b, reverse, e.from === e.to);
            const label =
              model.kind === "tree"
                ? e.label === "left"
                  ? "L"
                  : "R"
                : model.kind === "trie"
                  ? e.label
                  : "";
            return (
              <g key={`${e.from}-${e.label}-${e.to}`}>
                <path
                  d={geometry.path}
                  className={`nv-edge${e.changed ? " nv-edge-changed" : ""}`}
                  markerEnd={
                    model.directed
                      ? `url(#${marker}-${e.changed ? "changed" : "normal"})`
                      : undefined
                  }
                >
                  <title>{`${e.label} link from ${text(nodeMap.get(e.from)?.value)} to ${text(nodeMap.get(e.to)?.value)}${e.changed ? " (changed)" : ""}`}</title>
                </path>
                {label ? (
                  <g>
                    <rect
                      x={geometry.label.x - 10}
                      y={geometry.label.y - 10}
                      width="20"
                      height="20"
                      rx="6"
                      className="nv-edge-label-bg"
                    />
                    <text
                      x={geometry.label.x}
                      y={geometry.label.y + 4}
                      textAnchor="middle"
                      className="nv-edge-label"
                    >
                      {label}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
          {model.nodes.map((n) => {
            const p = positions.get(n.id)!;
            const badges = state.pointers.get(n.id) ?? [];
            const status = state.current.has(n.id)
              ? "current"
              : state.frontier.has(n.id)
                ? "frontier"
                : state.visited.has(n.id)
                  ? "visited"
                  : "";
            const label = text(n.value),
              short = label.length > 7 ? label.slice(0, 6) + "…" : label;
            const dangling = Object.values(n.links).some(
              (to) => !nodeMap.has(to),
            );
            return (
              <g
                key={n.id}
                className={`nv-node ${status ? `nv-node-${status}` : ""}`}
                transform={`translate(${p.x} ${p.y})`}
              >
                <title>{`${label}; identity ${n.id}${badges.length ? `; pointers: ${badges.join(", ")}` : ""}${status ? `; ${status}` : ""}${n.terminal ? "; complete word" : ""}${n.storedIndex !== undefined ? `; largest matching index: ${n.storedIndex}` : ""}`}</title>
                {state.frontier.has(n.id) ? (
                  <circle r="34" className="nv-frontier-ring" />
                ) : null}
                <circle r="27" className="nv-node-circle" />
                {n.terminal ? (
                  <circle r="22" className="nv-terminal-ring" />
                ) : null}
                <text y="5" textAnchor="middle" className="nv-node-value">
                  {short}
                </text>
                {n.id === model.root ? (
                  <text y="-42" textAnchor="middle" className="nv-origin-label">
                    {model.kind === "linked-list"
                      ? "entry"
                      : model.kind === "graph"
                        ? "entry"
                        : "root"}
                  </text>
                ) : null}
                {n.storedIndex !== undefined && (
                  <text y="44" textAnchor="middle" className="nv-stored-index">
                    index {n.storedIndex}
                  </text>
                )}
                {badges.slice(0, 3).map((name, i) => {
                  const badgeWidth = Math.max(38, name.length * 6 + 16);
                  return (
                    <g
                      key={name}
                      transform={`translate(0 ${42 + i * 21 + (n.storedIndex !== undefined ? 21 : 0)})`}
                    >
                      <rect
                        x={-badgeWidth / 2}
                        y="-10"
                        width={badgeWidth}
                        height="18"
                        rx="5"
                        className={`nv-badge${/^(node|current|course|vertex|u|v|char)$/.test(name) ? " nv-badge-current" : ""}`}
                      />
                      <text y="3" textAnchor="middle" className="nv-badge-text">
                        {name}
                      </text>
                    </g>
                  );
                })}
                {badges.length > 3 ? (
                  <text y="105" textAnchor="middle" className="nv-more-label">
                    +{badges.length - 3} pointers
                  </text>
                ) : null}
                {dangling ? (
                  <text x="35" y="3" className="nv-more-label">
                    …
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="nv-legend">
        <span>
          <i className="nv-key-current" />
          Current pointer
        </span>
        <span>
          <i className="nv-key-frontier" />
          Queued / stacked
        </span>
        <span>
          <i className="nv-key-visited" />
          Visited
        </span>
        {model.nodes.some((n) => n.terminal) ? (
          <span>
            <i className="nv-key-terminal" />
            Word endpoint
          </span>
        ) : null}
        {model.nodes.some((n) => n.storedIndex !== undefined) && (
          <span>Index = largest matching word index</span>
        )}
        {compare && (changedCount || oldEdges.length) ? (
          <>
            <span>
              <i className="nv-key-changed" />
              Changed link
            </span>
            <span>
              <i className="nv-key-removed" />
              Removed link
            </span>
          </>
        ) : null}
      </div>
      {model.truncated ? (
        <div className="nv-note">
          {model.omitted > 0
            ? `${model.omitted} additional ${model.kind === "trie" ? "branches" : "nodes"} omitted from this view.`
            : "Additional nodes are omitted from this snapshot."}
        </div>
      ) : null}
      {identityUnavailable ? (
        <div className="nv-note">
          Pointer highlights need node identities; equal values are kept
          distinct.
        </div>
      ) : null}
    </div>
  );
}
