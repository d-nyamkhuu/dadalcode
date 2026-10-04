import { useId, useMemo, useRef, type ReactNode } from "react";
import "./node.css";
import type { Props, Point } from "./nodes/types";
import { text, object } from "./nodes/shared";
import { combinedModel, modelFor } from "./nodes/models";
import { positionsFor, edgeGeometry } from "./nodes/layout";
import { semanticState } from "./nodes/state";
export default function NodeVisual({
  value,
  previousValue,
  kind = "",
  variable = "",
  variables = {},
  previousVariables,
  input = {},
  fitContents = false,
  explicitKind = false,
}: Props): ReactNode | null {
  const marker = useId().replace(/:/g, "");
  const model = useMemo(
    () => combinedModel(value, kind, variable, input, variables, explicitKind),
    [value, kind, variable, input, variables, explicitKind],
  );
  const previous = useMemo(
    () =>
      previousVariables
        ? combinedModel(
            previousValue,
            kind,
            variable,
            input,
            previousVariables,
            explicitKind,
          )
        : modelFor(previousValue, kind, variable, input, explicitKind),
    [previousValue, kind, variable, input, previousVariables, explicitKind],
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
    const activeIds = new Set(model.nodes.map((node) => node.id));
    const retainedIds = new Set([
      ...activeIds,
      ...(previous?.nodes.map((node) => node.id) ?? []),
    ]);
    for (const id of cache.current.positions.keys())
      if (!retainedIds.has(id)) cache.current.positions.delete(id);
    for (const [id, p] of calculated)
      if (!cache.current.positions.has(id)) {
        const anchors = [...cache.current.positions]
          .filter(([id]) => activeIds.has(id))
          .map(([, point]) => point);
        const occupied = anchors.some(
          (q) => Math.hypot(q.x - p.x, q.y - p.y) < 72,
        );
        if (occupied) {
          if (model.kind === "tree" || model.kind === "trie") {
            // Add a free sibling lane instead of extending the whole tree below
            // every cached node. Retain anchors that are still on screen.
            do {
              if (model.kind === "trie") p.y += 128;
              else p.x += 112;
            } while (
              anchors.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 72)
            );
          } else p.y = Math.max(...anchors.map((q) => q.y)) + 112;
        }
        cache.current.positions.set(id, p);
      }
  }
  const positions = cache.current.positions;
  const visible = model.nodes.map((n) => positions.get(n.id)!).filter(Boolean);
  const listArc = (a: Point, b: Point) =>
    model.kind === "linked-list" &&
    Math.abs(a.y - b.y) < 1 &&
    visible.some(
      (point) =>
        Math.abs(point.y - a.y) < 35 &&
        point.x > Math.min(a.x, b.x) + 35 &&
        point.x < Math.max(a.x, b.x) - 35,
    )
      ? Math.max(96, Math.abs(a.x - b.x) / 4)
      : 0;
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
  const changedValues = new Set(
    model.nodes
      .filter(
        (node) =>
          compare &&
          previousNodes.has(node.id) &&
          text(previousNodes.get(node.id)!.value) !== text(node.value),
      )
      .map((node) => node.id),
  );
  // Preserve cached coordinates, but omit empty margins in the fitted viewer.
  // Include removed-link endpoints, pointer badges, and self loops in the bounds.
  const bounds = model.nodes.map((node) => {
    const p = positions.get(node.id)!;
    const badges = state.pointers.get(node.id) ?? [];
    const loop = Object.values(node.links).includes(node.id);
    const halfWidth = Math.max(
      loop ? 85 : 64,
      ...badges.slice(0, 3).map((name) => (name.length * 6 + 16) / 2 + 8),
    );
    const bottom = Math.max(
      40,
      node.storedIndex !== undefined ? 56 : 0,
      badges.length
        ? 54 +
            (Math.min(3, badges.length) - 1) * 21 +
            (node.storedIndex !== undefined ? 21 : 0)
        : 0,
      badges.length > 3 ? 116 : 0,
    );
    return {
      left: p.x - halfWidth,
      right: p.x + halfWidth,
      top: p.y - (loop ? 110 : 85),
      bottom: p.y + bottom,
    };
  });
  for (const edge of oldEdges)
    for (const id of [edge.from, edge.to]) {
      const p = positions.get(id)!;
      bounds.push({
        left: p.x - 85,
        right: p.x + 85,
        top: p.y - 105,
        bottom: p.y + 40,
      });
    }
  const croppedLeft = bounds.length
    ? Math.min(...bounds.map((b) => b.left))
    : 0;
  const top = bounds.length ? Math.min(...bounds.map((b) => b.top)) : 0;
  const croppedWidth = Math.max(1, ...bounds.map((b) => b.right - croppedLeft));
  const croppedHeight = Math.max(1, ...bounds.map((b) => b.bottom - top));
  const viewBox =
    fitContents && bounds.length
      ? `${croppedLeft} ${top} ${croppedWidth} ${croppedHeight}`
      : `0 0 ${width} ${height}`;
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
                ? "Value | next pointer · ∅ = None"
                : model.directed
                  ? "Directed adjacency links"
                  : "Undirected adjacency links"}
        </span>
      </div>
      <div className="nv-scroll">
        <svg
          className="nv-svg"
          viewBox={viewBox}
          style={{
            minWidth: fitContents ? 0 : Math.min(width, 900),
            width: fitContents ? croppedWidth : undefined,
            maxWidth: fitContents ? "100%" : undefined,
            marginInline: fitContents ? "auto" : undefined,
          }}
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
            const geometry = edgeGeometry(
              a,
              b,
              true,
              e.from === e.to,
              listArc(a, b),
              model.kind === "linked-list",
            );
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
            const geometry = edgeGeometry(
              a,
              b,
              reverse,
              e.from === e.to,
              listArc(a, b),
              model.kind === "linked-list",
            );
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
              labelLimit = model.kind === "linked-list" ? 4 : 7,
              short =
                label.length > labelLimit
                  ? label.slice(0, labelLimit - 1) + "…"
                  : label;
            const dangling = Object.values(n.links).some(
              (to) => !nodeMap.has(to),
            );
            return (
              <g
                key={n.id}
                className={`nv-node ${status ? `nv-node-${status}` : ""} ${changedValues.has(n.id) ? "nv-node-changed" : ""}`}
                transform={`translate(${p.x} ${p.y})`}
              >
                <title>{`${label}; identity ${n.id}${badges.length ? `; pointers: ${badges.join(", ")}` : ""}${status ? `; ${status}` : ""}${changedValues.has(n.id) ? `; value changed from ${text(previousNodes.get(n.id)!.value)}` : ""}${model.kind === "linked-list" && !Object.keys(n.links).length ? "; next = None" : ""}${n.terminal ? "; complete word" : ""}${n.storedIndex !== undefined ? `; largest matching index: ${n.storedIndex}` : ""}`}</title>
                {state.frontier.has(n.id) ? (
                  <circle r="34" className="nv-frontier-ring" />
                ) : null}
                {model.kind === "linked-list" ? (
                  <>
                    <rect
                      x="-34"
                      y="-24"
                      width="68"
                      height="48"
                      rx="8"
                      className="nv-node-circle"
                    />
                    <path d="M 10 -24 V 24" className="nv-list-divider" />
                    {Object.keys(n.links).length ? (
                      <circle cx="22" r="3" className="nv-list-port" />
                    ) : (
                      <text
                        x="22"
                        y="5"
                        textAnchor="middle"
                        className="nv-list-null"
                      >
                        ∅
                      </text>
                    )}
                  </>
                ) : (
                  <circle r="27" className="nv-node-circle" />
                )}
                {n.terminal ? (
                  <circle r="22" className="nv-terminal-ring" />
                ) : null}
                <text
                  x={model.kind === "linked-list" ? -11 : 0}
                  y="5"
                  textAnchor="middle"
                  className="nv-node-value"
                >
                  {short}
                </text>
                {changedValues.has(n.id) && (
                  <path
                    d={
                      model.kind === "linked-list"
                        ? "M -24 16 H 0"
                        : "M -12 16 H 12"
                    }
                    className="nv-value-change"
                  />
                )}
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
        {state.frontier.size > 0 && (
          <span>
            <i className="nv-key-frontier" />
            Queued / stacked
          </span>
        )}
        {state.visited.size > 0 && (
          <span>
            <i className="nv-key-visited" />
            Visited
          </span>
        )}
        {changedValues.size > 0 && (
          <span>
            <i className="nv-key-changed" />
            Changed value
          </span>
        )}
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
