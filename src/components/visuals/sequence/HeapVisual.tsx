import {
  type SequenceVisualProps,
  HEAP_LIMIT,
  text,
  differs,
  Caption,
} from "./shared";
export function HeapVisual({
  value,
  previousValue,
  variable = "",
  label,
}: SequenceVisualProps & { value: unknown[] }) {
  const visible = value.slice(0, HEAP_LIMIT),
    previous = Array.isArray(previousValue) ? previousValue : undefined;
  const width = 640,
    levelCount = Math.max(1, Math.ceil(Math.log2(visible.length + 1))),
    height = levelCount * 82 + 12;
  const points = visible.map((_, index) => {
    const level = Math.floor(Math.log2(index + 1)),
      first = 2 ** level - 1,
      position = index - first;
    return { x: ((position + 0.5) / 2 ** level) * width, y: 34 + level * 82 };
  });
  return (
    <div className="seq-visual seq-heap-visual">
      <div className="seq-structure-meta">
        <span>Heap array → binary tree</span>
        <span>Stored priorities</span>
      </div>
      {visible.length ? (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={
            label ??
            `${variable} binary heap with ${value.length} captured entries`
          }
          className="seq-heap-tree"
        >
          {visible.slice(1).map((_, index) => {
            const child = points[index + 1],
              parent = points[Math.floor(index / 2)];
            return (
              <line
                key={index}
                x1={parent.x}
                y1={parent.y + 15}
                x2={child.x}
                y2={child.y - 18}
                className="seq-heap-edge"
              />
            );
          })}
          {visible.map((entry, index) => {
            const point = points[index],
              changed = differs(
                entry,
                previous?.[index],
                previous !== undefined,
              ),
              tuple = Array.isArray(entry),
              priority = tuple ? entry[0] : entry;
            return (
              <g
                key={index}
                className={`seq-heap-node ${index === 0 ? "seq-root" : ""} ${changed ? "seq-changed-node" : ""}`}
              >
                <title>{`Heap index ${index}: ${text(entry)}${changed ? "; changed since previous step" : ""}`}</title>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={levelCount > 4 ? 16 : 21}
                />
                <text
                  x={point.x}
                  y={point.y + 4}
                  textAnchor="middle"
                  className="seq-heap-priority"
                >
                  {text(priority).slice(0, 6)}
                </text>
                <text
                  x={point.x}
                  y={point.y + 36}
                  textAnchor="middle"
                  className="seq-heap-index"
                >
                  [{index}]
                  {tuple
                    ? ` ${entry.slice(1).map(text).join(", ").slice(0, 15)}`
                    : ""}
                </text>
              </g>
            );
          })}
        </svg>
      ) : (
        <div className="seq-empty">Empty heap</div>
      )}
      <Caption
        count={value.length}
        shown={visible.length}
        previousCount={previous?.length}
      />
      <div className="seq-heap-note">
        Children of index i: 2i + 1 and 2i + 2. Negative priorities are shown as
        stored.
      </div>
    </div>
  );
}
