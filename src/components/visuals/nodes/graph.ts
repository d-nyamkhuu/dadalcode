import type { Model, NodeRecord } from "./types";
import { LIMIT } from "./shared";
export function graphModel(
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
