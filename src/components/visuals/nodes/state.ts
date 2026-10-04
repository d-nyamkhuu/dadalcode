import type { Model } from "./types";
import { object, ref } from "./shared";
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
export function semanticState(
  model: Model,
  variables: Record<string, unknown>,
  _variable: string,
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
