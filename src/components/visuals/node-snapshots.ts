export const NODE_LIMIT = 40;

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

export function capturedNodeIds(value: unknown): Set<string> {
  if (!record(value) || !Array.isArray(value.nodes)) return new Set();
  return new Set(
    value.nodes
      .slice(0, NODE_LIMIT)
      .flatMap((node) =>
        record(node) && typeof node.id === "string" ? [node.id] : [],
      ),
  );
}

export function isStableList(value: unknown): boolean {
  return (
    record(value) && value.__kind === "linked-list" && value.stableIds === true
  );
}

/** Match the list renderer's captured forest, including unnamed detached pointers. */
export function collectListIds(
  value: unknown,
  ids: Set<string>,
  depth = 0,
): void {
  if (depth > 5) return;
  if (isStableList(value)) {
    for (const id of capturedNodeIds(value)) ids.add(id);
  } else if (Array.isArray(value)) {
    for (const item of value) collectListIds(item, ids, depth + 1);
  }
}

/** Stable dictionary identities for the same bounded prefix tree the renderer draws. */
export function capturedTrieIds(value: unknown): Set<string> | undefined {
  if (!record(value)) return;
  const root = record(value.root)
    ? value.root
    : record(value.trie)
      ? value.trie
      : value;
  const ids = new Set<string>(),
    seen = new Set<Record<string, unknown>>();
  let stable = true;
  function visit(node: Record<string, unknown>) {
    if (seen.has(node) || ids.size >= NODE_LIMIT) return;
    seen.add(node);
    const id =
      typeof node.__nodeRef === "string"
        ? node.__nodeRef
        : typeof node.__ref === "string"
          ? node.__ref
          : typeof node.identity === "string"
            ? node.identity
            : undefined;
    if (!id) {
      stable = false;
      return;
    }
    ids.add(id);
    const children = record(node.children) ? node.children : node;
    for (const [letter, child] of Object.entries(children).sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      if (letter.length === 1 && !["#", "$"].includes(letter) && record(child))
        visit(child);
    }
  }
  visit(root);
  return stable && ids.size ? ids : undefined;
}
