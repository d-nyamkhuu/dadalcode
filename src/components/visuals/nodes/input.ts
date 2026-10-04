import type { Model, NodeRecord } from "./types";
import { LIMIT } from "./shared";
export function inputNodes(
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
        links: (i + 1 < value.length
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
