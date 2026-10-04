import { type SequenceVisualProps, text, differs, Caption } from "./shared";
export function StackQueue({
  value,
  previousValue,
  variable = "",
  label,
  renderer,
}: SequenceVisualProps & { value: unknown[] }) {
  const queue =
    renderer === "queue" ||
    (renderer !== "stack" && /queue|cooldown/.test(variable));
  const previous = Array.isArray(previousValue) ? previousValue : undefined;
  const limit = 16;
  const start = queue ? 0 : Math.max(0, value.length - limit);
  const visible = value.slice(start, start + limit);
  return (
    <div
      className={`seq-visual seq-linear-structure ${queue ? "seq-queue" : "seq-stack"}`}
      role="group"
      aria-label={label ?? `${variable} ${queue ? "queue" : "stack"}`}
    >
      <div className="seq-structure-meta">
        <span>{queue ? "Front → back" : "Top → bottom"}</span>
        <span>{queue ? "FIFO" : "LIFO"}</span>
      </div>
      <div className="seq-structure-items">
        {(queue ? visible : [...visible].reverse()).map(
          (entry, displayedIndex) => {
            const actualIndex = queue
              ? start + displayedIndex
              : start + visible.length - displayedIndex - 1;
            const changed = differs(
              entry,
              previous?.[actualIndex],
              previous !== undefined,
            );
            return (
              <div
                className={`seq-structure-item ${displayedIndex === 0 ? "seq-current" : ""} ${changed ? "seq-changed" : ""}`}
                key={actualIndex}
                title={text(entry)}
              >
                <span className="seq-structure-index">{actualIndex}</span>
                <code>{text(entry)}</code>
                <small>
                  {displayedIndex === 0
                    ? queue
                      ? "front"
                      : "top"
                    : queue && actualIndex === value.length - 1
                      ? "back"
                      : ""}
                </small>
              </div>
            );
          },
        )}
      </div>
      {!value.length ? (
        <div className="seq-empty">Empty {queue ? "queue" : "stack"}</div>
      ) : null}
      <Caption
        count={value.length}
        shown={visible.length}
        previousCount={previous?.length}
      >
        {visible.length < value.length ? (
          <span>
            {queue ? "First" : "Last"} {visible.length} entries
          </span>
        ) : null}
      </Caption>
    </div>
  );
}
