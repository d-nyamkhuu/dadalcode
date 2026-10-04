import type { Model, Point } from "./types";
export function positionsFor(model: Model): Map<string, Point> {
  const positions = new Map<string, Point>(),
    byId = new Map(model.nodes.map((n) => [n.id, n]));
  if (model.kind === "linked-list") {
    model.nodes.forEach((n, i) =>
      positions.set(n.id, {
        x: 72 + (i % 6) * 112,
        y: 100 + Math.floor(i / 6) * 138,
      }),
    );
  } else if (model.kind === "tree" || model.kind === "trie") {
    let leaf = 0;
    const seen = new Set<string>();
    function place(id: string, depth: number): number {
      if (seen.has(id)) return positions.get(id)?.x ?? 72;
      seen.add(id);
      const node = byId.get(id);
      const links = node
        ? Object.entries(node.links).filter(([, to]) => byId.has(to))
        : [];
      const xs = links.map(([, to]) => place(to, depth + 1));
      const x = xs.length
        ? xs.reduce((a, b) => a + b, 0) / xs.length
        : 72 + leaf++ * 112;
      positions.set(
        id,
        model.kind === "trie"
          ? { x: 96 + depth * 96, y: (x * 128) / 112 }
          : { x, y: 96 + depth * 152 },
      );
      return x;
    }
    place(model.root, 0);
    for (const node of model.nodes) if (!seen.has(node.id)) place(node.id, 0);
    // Center narrow trees while allowing wide trees to scroll at a readable scale.
    const span =
      Math.max(...[...positions.values()].map((p) => p.x)) -
      Math.min(...[...positions.values()].map((p) => p.x));
    const shift = Math.max(0, (560 - span) / 2 - 72);
    if (model.kind === "tree") for (const p of positions.values()) p.x += shift;
  } else {
    const count = model.nodes.length;
    if (count <= 12) {
      const radius = Math.max(80, Math.min(240, count * 24));
      model.nodes.forEach((n, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        positions.set(n.id, {
          x: radius + 84 + Math.cos(angle) * radius,
          y: radius + 96 + Math.sin(angle) * radius,
        });
      });
    } else
      model.nodes.forEach((n, i) =>
        positions.set(n.id, {
          x: 72 + (i % 6) * 112,
          y: 96 + Math.floor(i / 6) * 152,
        }),
      );
  }
  return positions;
}
export function edgeGeometry(
  a: Point,
  b: Point,
  reverse: boolean,
  loop: boolean,
  arc = 0,
  list = false,
): { path: string; label: Point } {
  if (loop)
    return {
      path: `M ${a.x - 18} ${a.y - 22} C ${a.x - 68} ${a.y - 90}, ${a.x + 68} ${a.y - 90}, ${a.x + 22} ${a.y - 20}`,
      label: { x: a.x, y: a.y - 70 },
    };
  const dx = b.x - a.x,
    dy = b.y - a.y,
    length = Math.hypot(dx, dy) || 1;
  const radius = list
    ? Math.min(
        34 / Math.max(Math.abs(dx / length), 0.001),
        24 / Math.max(Math.abs(dy / length), 0.001),
      )
    : 28;
  const start = {
      x: a.x + (dx / length) * radius,
      y: a.y + (dy / length) * radius,
    },
    end = {
      x: b.x - (dx / length) * (radius + 4),
      y: b.y - (dy / length) * (radius + 4),
    };
  if (arc)
    return {
      path: `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${a.y - arc} ${end.x} ${end.y}`,
      label: { x: (start.x + end.x) / 2, y: a.y - arc / 2 },
    };
  if (reverse || (Math.abs(dy) > 100 && Math.abs(dx) > 150)) {
    const curve = reverse ? 30 : 38;
    const control = {
      x: (start.x + end.x) / 2 - (dy / length) * curve,
      y: (start.y + end.y) / 2 + (dx / length) * curve,
    };
    return {
      path: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`,
      label: {
        x: (start.x + end.x) / 2 - ((dy / length) * curve) / 2,
        y: (start.y + end.y) / 2 + ((dx / length) * curve) / 2,
      },
    };
  }
  return {
    path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
    label: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  };
}
