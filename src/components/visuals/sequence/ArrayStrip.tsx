import {
  type SequenceVisualProps,
  EMPTY_POINTERS,
  EMPTY_VARIABLES,
  ARRAY_LIMIT,
  text,
  differs,
  indexPointers,
  relatedPointers,
  Caption,
  PointerLegend,
} from "./shared";
export function ArrayStrip({
  value,
  previousValue,
  variable = "",
  pointers = EMPTY_POINTERS,
  variables = EMPTY_VARIABLES,
  label,
  kind,
  renderer,
  pointersAreScoped,
}: SequenceVisualProps & { value: unknown[] | string }) {
  const values = typeof value === "string" ? Array.from(value) : value;
  const previous =
    typeof previousValue === "string"
      ? Array.from(previousValue)
      : Array.isArray(previousValue)
        ? previousValue
        : undefined;
  const mapped = pointersAreScoped
    ? indexPointers(pointers)
    : relatedPointers(variable, pointers, variables);
  const active = mapped.filter(
    ([, index]) => index >= 0 && index < values.length,
  );
  const priority = [
    "mask",
    "col",
    "i",
    "right",
    "write",
    "read",
    "index",
    "value",
    "total",
    "end",
  ];
  const anchor =
    priority
      .map((name) => active.find(([key]) => key === name)?.[1])
      .find((index) => index !== undefined) ??
    active[0]?.[1] ??
    0;
  // Keep a stable page while stepping, and always include the active captured index.
  const start = Math.min(
    Math.max(0, values.length - ARRAY_LIMIT),
    Math.floor(anchor / ARRAY_LIMIT) * ARRAY_LIMIT,
  );
  const end = Math.min(values.length, start + ARRAY_LIMIT);
  const changedCount = values
    .slice(start, end)
    .filter((item, i) =>
      differs(item, previous?.[start + i], previous !== undefined),
    ).length;
  const left = mapped.find(([name]) => name === "left")?.[1],
    right = mapped.find(([name]) => name === "right")?.[1];
  // A bracket indicates actual index bounds only, without claiming an algorithmic window.
  const hasBounds = left !== undefined && right !== undefined && left <= right;
  return (
    <div
      className={`seq-visual seq-array-visual ${renderer === "dp" || (!renderer && kind === "dp" && /^(dp|counts|length|ways|remainder|reachable|tails|previous|current)$/.test(variable)) ? "seq-dp-strip" : ""} ${typeof value === "string" ? "seq-string-strip" : ""}`}
    >
      <div
        className="seq-array-scroll"
        role="group"
        aria-label={label ?? `${variable || "Sequence"} indexed values`}
      >
        <div className="seq-array-strip">
          {values.slice(start, end).map((item, offset) => {
            const index = start + offset;
            const here = mapped.filter(([, position]) => position === index);
            const changed = differs(
              item,
              previous?.[index],
              previous !== undefined,
            );
            const inside = hasBounds && index >= left! && index <= right!;
            return (
              <div
                className={`seq-array-slot ${inside ? "seq-within-bounds" : ""} ${inside && index === left ? "seq-bound-start" : ""} ${inside && index === right ? "seq-bound-end" : ""}`}
                key={index}
              >
                <span className="seq-cell-index">{index}</span>
                <div
                  className={`seq-cell ${here.length ? "seq-current" : ""} ${changed ? "seq-changed" : ""} ${item === true ? "seq-true" : ""}`}
                  title={text(item)}
                  aria-label={`Index ${index}: ${text(item)}${here.length ? `; ${here.map(([name]) => name).join(", ")}` : ""}${changed ? "; changed since previous step" : ""}`}
                >
                  <span>{text(item)}</span>
                  {changed && index < (previous?.length ?? 0) && (
                    <small className="seq-prior-value" title="Previous value">
                      was {text(previous![index]).slice(0, 12)}
                    </small>
                  )}
                </div>
                <div className="seq-cell-pointers">
                  {here.map(([name]) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Caption
        count={values.length}
        shown={Math.min(values.length, ARRAY_LIMIT)}
        unit={typeof value === "string" ? "characters" : "entries"}
        previousCount={previous?.length}
      >
        {values.length > ARRAY_LIMIT && (
          <span>
            Showing indices {start}–{end - 1}
          </span>
        )}
        {changedCount ? (
          <span className="seq-change-key">Changed since previous step</span>
        ) : null}
      </Caption>
      {values.length === 0 ? (
        <div className="seq-empty">Empty sequence</div>
      ) : null}
      <PointerLegend
        pointers={mapped}
        mapped={mapped}
        length={values.length}
        visibleStart={start}
        visibleEnd={end}
      />
    </div>
  );
}
