import type { Visualization } from "../types";
import SequenceVisual from "./visuals/SequenceVisual";
import NodeVisual from "./visuals/NodeVisual";
import CollectionVisual from "./visuals/CollectionVisual";
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const clean = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(clean)
    : object(v)
      ? Object.fromEntries(
          Object.entries(v)
            .filter(([k]) => k !== "__ref")
            .map(([k, x]) => [k, clean(x)]),
        )
      : v;
export const display = (v: unknown): string =>
  v === undefined
    ? "—"
    : v === null
      ? "None"
      : typeof v === "string"
        ? v
        : typeof v === "boolean"
          ? v
            ? "True"
            : "False"
          : JSON.stringify(clean(v));
const isNode = (v: unknown) => object(v) && typeof v.__kind === "string";
const containsNode = (v: unknown, depth = 0): boolean =>
  depth < 4 &&
  (isNode(v) ||
    (Array.isArray(v) && v.some((x) => containsNode(x, depth + 1))));
export function isDiagram(value: unknown, variable: string, kind: string) {
  if (isNode(value)) return true;
  if (containsNode(value) && /stack|queue|frontier|nodes/.test(variable))
    return true;
  if (
    kind === "graph" &&
    /graph|adj|edges|prereq/i.test(variable) &&
    value &&
    typeof value === "object"
  )
    return true;
  if (
    kind === "trie" &&
    /node|root|structure|trie|frontier/i.test(variable) &&
    object(value)
  )
    return true;
  if (Array.isArray(value) && value.length) {
    if (kind === "tree" && /^(root|tree|p|q|subRoot)$/.test(variable))
      return true;
    if (kind === "linked-list" && /^(head|l1|l2|list)$/.test(variable))
      return true;
  }
  return false;
}
export function NodeReference({ value }: { value: unknown }) {
  if (!object(value) || !Array.isArray(value.nodes))
    return <code>{display(value)}</code>;
  const node = value.nodes.find((n: { id: string }) => n.id === value.root);
  return (
    <span className="node-reference">
      <b>{display(node?.value)}</b>
      <small>{String(value.root)}</small>
    </span>
  );
}
function GenericValue({
  value,
  previousValue,
}: {
  value: unknown;
  previousValue?: unknown;
}) {
  if (isNode(value)) return <NodeReference value={value} />;
  if (object(value)) {
    return (
      <CollectionVisual
        value={clean(value)}
        previousValue={clean(previousValue)}
        variable="Map"
        renderItem={(item) =>
          isNode(item) ? (
            <NodeReference value={item} />
          ) : (
            <span title={display(item)}>{display(item).slice(0, 220)}</span>
          )
        }
      />
    );
  }
  if (Array.isArray(value))
    return (
      <div className="generic-items">
        {value.slice(0, 24).map((v, i) => (
          <span key={i}>
            <small>{i}</small>
            {isNode(v) ? (
              <NodeReference value={v} />
            ) : (
              <code title={display(v)}>{display(v).slice(0, 100)}</code>
            )}
          </span>
        ))}
        {value.length > 24 && (
          <small>Showing 24 of {value.length} captured entries</small>
        )}
        {!value.length && <span className="empty-value">Empty</span>}
      </div>
    );
  return <span className="scalar">{display(value)}</span>;
}
export default function FigureRenderer({
  value,
  previousValue,
  previousVariables,
  variable,
  config,
  variables,
  input,
  compact = false,
  fitted = false,
}: {
  value: unknown;
  previousValue: unknown;
  previousVariables?: Record<string, unknown>;
  variable: string;
  config: Visualization;
  variables: Record<string, unknown>;
  input: Record<string, unknown>;
  compact?: boolean;
  fitted?: boolean;
}) {
  const renderer = config.renderers?.[variable];
  const kind = renderer ?? config.kind;
  if (compact && isNode(value)) return <NodeReference value={value} />;
  if (
    (isDiagram(value, variable, kind) ||
      (renderer !== undefined &&
        ["tree", "linked-list", "graph", "trie"].includes(renderer))) &&
    renderer !== "map" &&
    renderer !== "set"
  )
    return (
      <NodeVisual
        value={value}
        previousValue={previousValue}
        previousVariables={previousVariables}
        kind={kind}
        variable={variable}
        variables={variables}
        input={input}
        fitContents={fitted}
        explicitKind={renderer !== undefined}
      />
    );
  if (renderer === "map" || renderer === "set")
    return (
      <CollectionVisual
        value={clean(value)}
        previousValue={clean(previousValue)}
        variable={variable}
        kind={renderer}
        renderItem={(item) =>
          isNode(item) ? (
            <NodeReference value={item} />
          ) : (
            <span title={display(item)}>{display(item).slice(0, 220)}</span>
          )
        }
      />
    );
  const binding = config.pointerTargets?.[variable];
  const pointers = Object.fromEntries(
    (binding ?? config.pointers)
      .filter((k) => Number.isInteger(variables[k]))
      .map((k) => [k, variables[k] as number]),
  );
  const sequence = SequenceVisual({
    value,
    previousValue,
    kind: config.kind,
    renderer,
    variable,
    variables,
    pointers,
    pointersAreScoped: binding !== undefined,
  });
  return (
    sequence ?? <GenericValue value={value} previousValue={previousValue} />
  );
}
