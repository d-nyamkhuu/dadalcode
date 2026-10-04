import type { TraceStep, Visualization } from "../types";
import FigureRenderer, {
  display,
  isDiagram,
  NodeReference,
} from "./FigureRenderer";
import AlgorithmFocus from "./visuals/AlgorithmFocus";
import {
  capturedNodeIds,
  capturedTrieIds,
  collectListIds,
  isStableList,
  NODE_LIMIT,
} from "./visuals/node-snapshots";
import "./visuals/state.css";

// Keep the decision surface visible; supporting constraint tables stay in details.
const viewerFocus: Record<string, string[]> = {
  "longest-common-subsequence": ["previous", "current"],
  "sudoku-solver": ["board"],
  "n-queens": [],
  "word-squares": [],
};

const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const isNode = (v: unknown) => object(v) && typeof v.__kind === "string";

export default function VisualState({
  step,
  previousStep,
  config,
  input,
  slug = "",
  part = "all",
}: {
  step?: TraceStep;
  previousStep?: TraceStep;
  config: Visualization;
  input: Record<string, unknown>;
  slug?: string;
  /** Split the viewer into a fitted canvas, readable summary, and optional details. */
  part?: "all" | "primary" | "summary" | "details";
}) {
  const variables = step?.variables ?? input;
  const previous = previousStep?.variables ?? {};
  const context = { ...input, ...variables };
  const previousContext = { ...input, ...previous };
  const focus = config.focus.filter((k) => variables[k] !== undefined);
  const preferred = part === "all" ? undefined : viewerFocus[slug];
  const availablePreferred = preferred?.filter(
    (key) => variables[key] !== undefined,
  );
  const candidates =
    availablePreferred && (!preferred?.length || availablePreferred.length)
      ? availablePreferred
      : focus.length
        ? focus.slice(0, 3)
        : Object.keys(input).slice(0, 2);
  const main = candidates.filter(
    (key) =>
      config.renderers?.[key] !== undefined ||
      (!/^(stack|queue|frontier|seen|visited|processed|finished|copies)$/.test(
        key,
      ) &&
        (!object(context[key]) ||
          isDiagram(
            context[key],
            key,
            config.renderers?.[key] ?? config.kind,
          ))),
  );
  const selected = part === "all" || !main.length ? candidates : main;
  const listIds = new Set<string>();
  if (part !== "all" && config.kind === "linked-list") {
    for (const value of Object.values(context)) collectListIds(value, listIds);
  }
  const listKeys = selected.filter((key) => isStableList(context[key]));
  // Each list renderer includes the same captured forest. Render it once when
  // it fits its snapshot limit; larger forests retain separate captured roots.
  const sharedList =
    part !== "all" &&
    config.kind === "linked-list" &&
    listIds.size <= NODE_LIMIT
      ? (listKeys.find((key) => Object.hasOwn(input, key)) ?? listKeys[0])
      : undefined;
  const hasStructure =
    variables.structure !== undefined &&
    isDiagram(
      variables.structure,
      "structure",
      config.renderers?.structure ?? config.kind,
    );
  const trieIds = new Map(
    selected.map((key) => [
      key,
      config.kind === "trie" ? capturedTrieIds(context[key]) : undefined,
    ]),
  );
  const primary =
    part === "all"
      ? selected
      : selected.filter((key) => {
          if (sharedList && isStableList(context[key]))
            return key === sharedList;
          if (
            config.kind === "trie" &&
            hasStructure &&
            isDiagram(context[key], key, config.renderers?.[key] ?? config.kind)
          )
            return false;
          const currentTrie = trieIds.get(key);
          if (
            /^(node|current)$/.test(key) &&
            currentTrie &&
            selected.some(
              (other) =>
                /^(trie|root)$/.test(other) &&
                trieIds.get(other) &&
                [...currentTrie].every((id) => trieIds.get(other)!.has(id)),
            )
          )
            return false;
          if (
            !/^(node|current|parent|tail|target|tree)$/.test(key) ||
            !isNode(context[key])
          )
            return true;
          const identity = object(context[key]) ? context[key].root : undefined;
          const ids = capturedNodeIds(context[key]);
          return !selected.some((other) => {
            const value = context[other];
            const otherIds = capturedNodeIds(value);
            return (
              other !== key &&
              /^(root|tree|head|dummy|trie)$/.test(other) &&
              object(value) &&
              isNode(value) &&
              Array.isArray(value.nodes) &&
              value.nodes.some(
                (node: { id: string }) => node.id === identity,
              ) &&
              [...ids].every((id) => otherIds.has(id)) &&
              (key !== "tree" ||
                otherIds.size > ids.size ||
                selected.indexOf(other) < selected.indexOf(key))
            );
          });
        });
  const structureEntries =
    object(variables.structure) && !hasStructure
      ? Object.entries(variables.structure).filter(([key]) => key !== "__ref")
      : [];
  const structureIsDuplicate =
    part !== "all" &&
    structureEntries.length > 0 &&
    structureEntries.every(
      ([key, value]) =>
        primary.includes(key) && display(context[key]) === display(value),
    );
  const watched = [
    ...new Set([
      ...focus,
      ...config.watch,
      ...(structureIsDuplicate ? ["structure"] : []),
    ]),
  ].filter((k) => variables[k] !== undefined && !primary.includes(k));
  const pointers = config.pointers.filter(
    (k) => variables[k] !== undefined && !isNode(variables[k]),
  );
  const smallWatched = watched.filter(
    (key) =>
      !pointers.includes(key) &&
      (!variables[key] ||
        typeof variables[key] !== "object" ||
        isNode(variables[key]) ||
        (config.kind === "trie" &&
          /^(node|current)$/.test(key) &&
          capturedTrieIds(variables[key]))),
  );
  const detailedReturn =
    step?.event === "return" &&
    !isNode(variables.returnValue) &&
    ((variables.returnValue && typeof variables.returnValue === "object") ||
      Array.isArray(variables.returnValue) ||
      (typeof variables.returnValue === "string" &&
        variables.returnValue.length > 32));
  return (
    <div className={`visual-state visual-state-${part}`}>
      {(part === "all" || part === "primary") && (
        <>
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
          <div className="primary-structures">
            {primary
              .filter(
                (key) => !(slug === "number-of-islands" && key === "grid"),
              )
              .map((key) => (
                <section
                  className="structure"
                  key={key}
                  data-figure={config.renderers?.[key]}
                  data-diagram={
                    isDiagram(
                      context[key],
                      key,
                      config.renderers?.[key] ?? config.kind,
                    )
                      ? "nodes"
                      : undefined
                  }
                >
                  <div className="structure-label">
                    {key === sharedList && listKeys.length > 1
                      ? "Linked lists and pointers"
                      : (config.labels[key] ?? key)}
                  </div>
                  <FigureRenderer
                    value={
                      Object.hasOwn(variables, key)
                        ? variables[key]
                        : input[key]
                    }
                    previousValue={previous[key]}
                    previousVariables={previousContext}
                    variable={key}
                    config={config}
                    variables={context}
                    input={input}
                    fitted={part === "primary"}
                  />
                  {step?.limits?.[key] && (
                    <p className="snapshot-limit">{step.limits[key]}</p>
                  )}
                </section>
              ))}
            {variables.structure !== undefined &&
              !structureIsDuplicate &&
              !primary.includes("structure") && (
                <section
                  className="structure"
                  data-diagram={hasStructure ? "nodes" : undefined}
                >
                  <div className="structure-label">Data structure state</div>
                  <FigureRenderer
                    value={variables.structure}
                    previousValue={previous.structure}
                    previousVariables={previousContext}
                    variable="structure"
                    config={config}
                    variables={context}
                    input={input}
                    fitted={part === "primary"}
                  />
                  {step?.limits?.structure && (
                    <p className="snapshot-limit">{step.limits.structure}</p>
                  )}
                </section>
              )}
          </div>
        </>
      )}
      {(part === "all" || part === "summary") && pointers.length > 0 && (
        <div className="pointer-values" aria-label="Pointer values">
          {pointers.map((key) => (
            <span key={key}>
              <code>{key}</code>
              <b>{display(variables[key])}</b>
            </span>
          ))}
        </div>
      )}
      {part === "summary" && smallWatched.length > 0 && (
        <div className="summary-values">
          {smallWatched.map((key) => (
            <span
              key={key}
              title={isNode(variables[key]) ? key : display(variables[key])}
            >
              <code title={config.labels[key] ?? key}>{key}</code>
              {isNode(variables[key]) ? (
                <NodeReference value={variables[key]} />
              ) : config.kind === "trie" &&
                /^(node|current)$/.test(key) &&
                object(variables[key]) ? (
                <code>
                  {String(
                    variables[key].__ref ??
                      variables[key].__nodeRef ??
                      variables[key].identity,
                  )}
                </code>
              ) : (
                <b>{display(variables[key])}</b>
              )}
            </span>
          ))}
        </div>
      )}
      {(part === "all" || part === "details") && (
        <>
          {part === "details" && detailedReturn && (
            <section className="watch watch-wide">
              <span className="structure-label">
                {step.function} return value
              </span>
              <FigureRenderer
                value={variables.returnValue}
                previousValue={undefined}
                variable="returnValue"
                config={config}
                variables={context}
                input={input}
                compact
              />
              {step.limits?.returnValue && (
                <p className="snapshot-limit">{step.limits.returnValue}</p>
              )}
            </section>
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
                  <FigureRenderer
                    value={variables[key]}
                    previousValue={previous[key]}
                    previousVariables={previousContext}
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
          {part === "details" &&
            !detailedReturn &&
            !watched.length &&
            !(
              Array.isArray(variables._callStack) &&
              variables._callStack.length > 1
            ) && (
              <p className="empty-value">No additional state at this step.</p>
            )}
        </>
      )}
      {(part === "all" || part === "summary") && step?.event === "return" && (
        <div className="return-value">
          <span>
            {step.function} return value
            {part === "summary" && detailedReturn ? " · State details" : ""}
          </span>
          <code title={display(variables.returnValue)}>
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
