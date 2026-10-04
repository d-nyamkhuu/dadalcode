import type { Model, NodeRecord } from "./types";
import { LIMIT, object } from "./shared";
import { snapshotModel } from "./snapshot";
import { graphModel } from "./graph";
import { trieModel } from "./trie";
import { inputNodes } from "./input";
export function modelFor(
  value: unknown,
  kind: string,
  variable: string,
  input: Record<string, unknown>,
  explicitKind = false,
): Model | null {
  const snapshot = snapshotModel(value);
  if (snapshot) return snapshot;
  if (kind === "graph")
    return graphModel(
      value,
      explicitKind && !/graph|adj|edges|prereq/i.test(variable)
        ? "graph"
        : variable,
      input,
    );
  if (
    kind === "trie" &&
    (explicitKind || /node|root|structure|trie|frontier/i.test(variable)) &&
    object(value)
  )
    return trieModel(value);
  return inputNodes(
    value,
    kind,
    explicitKind
      ? kind === "tree"
        ? "root"
        : kind === "linked-list"
          ? "head"
          : variable
      : variable,
  );
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
export function combinedModel(
  value: unknown,
  kind: string,
  variable: string,
  input: Record<string, unknown>,
  variables: Record<string, unknown>,
  explicitKind = false,
): Model | null {
  let base = modelFor(value, kind, variable, input, explicitKind);
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
    // Detached prefixes and suffixes remain part of the captured list state,
    // regardless of the algorithm's names for their pointers.
    for (const item of Object.values(variables))
      gatherSnapshots(item, components);
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
