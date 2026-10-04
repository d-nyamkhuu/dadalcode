import type { TraceStep, Visualization } from "../types";
import SequenceVisual from "./visuals/SequenceVisual";
import NodeVisual from "./visuals/NodeVisual";
import AlgorithmFocus from "./visuals/AlgorithmFocus";
import "./visuals/state.css";

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
const display = (v: unknown): string =>
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
function isDiagram(value: unknown, variable: string, kind: string) {
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
function NodeReference({ value }: { value: unknown }) {
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
    const entries = Object.entries(value).filter(([k]) => k !== "__ref");
    if (!entries.length) return <span className="empty-value">Empty map</span>;
    return (
      <>
        <div className="map-wrap">
          <table className="map-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 24).map(([key, v]) => (
                <tr
                  key={key}
                  className={
                    object(previousValue) &&
                    display(previousValue[key]) !== display(v)
                      ? "changed-entry"
                      : ""
                  }
                >
                  <td>{key || "∅"}</td>
                  <td>
                    {isNode(v) ? (
                      <NodeReference value={v} />
                    ) : (
                      <span title={display(v)}>{display(v).slice(0, 220)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <span className="state-caption">
          {entries.length} captured entries
          {entries.length > 24 ? " · showing 24" : ""}
        </span>
      </>
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
function ValueView({
  value,
  previousValue,
  variable,
  config,
  variables,
  input,
  compact = false,
}: {
  value: unknown;
  previousValue: unknown;
  variable: string;
  config: Visualization;
  variables: Record<string, unknown>;
  input: Record<string, unknown>;
  compact?: boolean;
}) {
  if (compact && isNode(value)) return <NodeReference value={value} />;
  if (isDiagram(value, variable, config.kind))
    return (
      <NodeVisual
        value={value}
        previousValue={previousValue}
        kind={config.kind}
        variable={variable}
        variables={variables}
        input={input}
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
    variable,
    variables,
    pointers,
    pointersAreScoped: binding !== undefined,
  });
  return (
    sequence ?? <GenericValue value={value} previousValue={previousValue} />
  );
}
export default function VisualState({
  step,
  previousStep,
  config,
  input,
  slug = "",
}: {
  step?: TraceStep;
  previousStep?: TraceStep;
  config: Visualization;
  input: Record<string, unknown>;
  slug?: string;
}) {
  const variables = step?.variables ?? input;
  const previous = previousStep?.variables ?? {};
  const context = { ...input, ...variables };
  const focus = config.focus.filter((k) => variables[k] !== undefined);
  const primary = focus.length
    ? focus.slice(0, 3)
    : Object.keys(input).slice(0, 2);
  const watched = [...new Set([...focus.slice(3), ...config.watch])].filter(
    (k) => variables[k] !== undefined && !primary.includes(k),
  );
  const pointers = config.pointers.filter(
    (k) => variables[k] !== undefined && !isNode(variables[k]),
  );
  return (
    <div className="visual-state">
      <div className="state-legend">
        <span>
          <i className="legend-current" />
          Current position
        </span>
        <span>
          <i className="legend-change" />
          Changed since prior line
        </span>
      </div>
      <AlgorithmFocus slug={slug} variables={context} input={input} />
      {primary
        .filter((key) => !(slug === "number-of-islands" && key === "grid"))
        .map((key) => (
          <section className="structure" key={key}>
            <div className="structure-label">{config.labels[key] ?? key}</div>
            <ValueView
              value={
                Object.hasOwn(variables, key) ? variables[key] : input[key]
              }
              previousValue={previous[key]}
              variable={key}
              config={config}
              variables={context}
              input={input}
            />
            {step?.limits?.[key] && (
              <p className="snapshot-limit">{step.limits[key]}</p>
            )}
          </section>
        ))}
      {variables.structure !== undefined && !primary.includes("structure") && (
        <section className="structure">
          <div className="structure-label">Data structure state</div>
          <ValueView
            value={variables.structure}
            previousValue={previous.structure}
            variable="structure"
            config={config}
            variables={context}
            input={input}
          />
          {step?.limits?.structure && (
            <p className="snapshot-limit">{step.limits.structure}</p>
          )}
        </section>
      )}
      {pointers.length > 0 && (
        <div className="pointer-values" aria-label="Pointer values">
          {pointers.map((key) => (
            <span key={key}>
              <code>{key}</code>
              <b>{display(variables[key])}</b>
            </span>
          ))}
        </div>
      )}
      <div className="watch-grid">
        {watched
          .filter((k) => !pointers.includes(k))
          .map((key) => (
            <section
              className={`watch ${variables[key] !== null && typeof variables[key] === "object" && !isNode(variables[key]) ? "watch-wide" : ""}`}
              key={key}
            >
              <span className="structure-label">
                {config.labels[key] ?? key}
              </span>
              <ValueView
                value={variables[key]}
                previousValue={previous[key]}
                variable={key}
                config={config}
                variables={context}
                input={input}
                compact
              />
              {step?.limits?.[key] && (
                <p className="snapshot-limit">{step.limits[key]}</p>
              )}
            </section>
          ))}
      </div>
      {Array.isArray(variables._callStack) &&
        variables._callStack.length > 1 && (
          <div className="call-stack">
            <span className="structure-label">
              Active calls · outermost → innermost
            </span>
            {variables._callStack.map((fn, i) => (
              <span
                className={
                  i === (variables._callStack as unknown[]).length - 1
                    ? "active-call"
                    : ""
                }
                key={i}
              >
                {i + 1} · {String(fn)}
              </span>
            ))}
          </div>
        )}
      {step?.event === "return" && (
        <div className="return-value">
          <span>{step.function} return value</span>
          <code>
            {isNode(variables.returnValue) ? (
              <NodeReference value={variables.returnValue} />
            ) : (
              display(variables.returnValue)
            )}
          </code>
        </div>
      )}
    </div>
  );
}
