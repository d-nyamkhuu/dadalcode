import type { Model, NodeRecord } from "./types";
import { LIMIT, object } from "./shared";
export function snapshotModel(value: unknown): Model | null {
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
