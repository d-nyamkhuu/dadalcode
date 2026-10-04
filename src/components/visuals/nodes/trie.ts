import type { Model, NodeRecord } from "./types";
import { LIMIT, object, ref } from "./shared";
export function trieModel(value: unknown): Model | null {
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
