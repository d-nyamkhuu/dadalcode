import type { CSSProperties } from "react";
import {
  type SequenceVisualProps,
  EMPTY_POINTERS,
  EMPTY_VARIABLES,
  differs,
  indexPointers,
  relatedPointers,
  Caption,
  PointerLegend,
} from "./shared";
export function intervalOf(value: unknown): [number, number] | null {
  const candidate = Array.isArray(value)
    ? value
    : value && typeof value === "object" && "start" in value && "end" in value
      ? [(value as { start: unknown }).start, (value as { end: unknown }).end]
      : null;
  return candidate &&
    candidate.length === 2 &&
    candidate.every((x) => typeof x === "number" && Number.isFinite(x)) &&
    candidate[0] <= candidate[1]
    ? (candidate as [number, number])
    : null;
}
export function IntervalVisual({
  value,
  previousValue,
  variables = EMPTY_VARIABLES,
  label,
  variable = "",
  pointers = EMPTY_POINTERS,
  pointersAreScoped,
}: SequenceVisualProps & { value: [number, number][] }) {
  const all: [number, number][] = [...value];
  // Only actual interval-shaped structures contribute; an empty result retains input scale.
  for (const [name, other] of Object.entries(variables)) {
    if (
      !/interval|firstList|secondList|busy|merged|result|points|schedule/i.test(
        name,
      )
    )
      continue;
    const single = intervalOf(other);
    if (single) all.push(single);
    else if (Array.isArray(other))
      for (const entry of other) {
        const interval = intervalOf(entry);
        if (interval) all.push(interval);
      }
  }
  if (
    typeof variables.start === "number" &&
    typeof variables.end === "number" &&
    variables.start <= variables.end
  )
    all.push([variables.start, variables.end]);
  let min = 0,
    max = 1;
  if (all.length) {
    min = all[0][0];
    max = all[0][1];
    for (const [a, b] of all) {
      min = Math.min(min, a);
      max = Math.max(max, b);
    }
  }
  if (max === min) {
    min -= 1;
    max += 1;
  }
  const span = max - min,
    previous = Array.isArray(previousValue) ? previousValue : undefined;
  const ticks = Array.from(
    { length: 5 },
    (_, i) => min + ((max - min) * i) / 4,
  );
  const mapped = pointersAreScoped
    ? indexPointers(pointers)
    : relatedPointers(variable, pointers, variables);
  return (
    <div
      className="seq-visual seq-interval-visual"
      role="group"
      aria-label={label ?? "Intervals on a shared numeric scale"}
    >
      <div className="seq-interval-axis">
        <span className="seq-axis-label">Index</span>
        <div>
          {ticks.map((tick, i) => (
            <span style={{ left: `${i * 25}%` }} key={i}>
              {Number.isInteger(tick) ? tick : Number(tick.toFixed(2))}
            </span>
          ))}
        </div>
      </div>
      <div className="seq-interval-rows">
        {value.slice(0, 16).map(([start, end], index) => {
          const changed = differs(
            value[index],
            previous?.[index],
            previous !== undefined,
          );
          return (
            <div className="seq-interval-row" key={index}>
              <span className="seq-interval-index">
                <small>{index}</small>
                <code>
                  {start} – {end}
                </code>
              </span>
              <div className="seq-interval-track">
                <div
                  className={`seq-interval-bar ${changed ? "seq-changed" : ""} ${mapped.some(([, position]) => position === index) ? "seq-current" : ""} ${start === end ? "seq-point-interval" : ""}`}
                  style={
                    {
                      left: `${((start - min) / span) * 100}%`,
                      width: `${((end - start) / span) * 100}%`,
                    } as CSSProperties
                  }
                  title={`[${start}, ${end}]`}
                >
                  <i />
                  <i />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!value.length ? <div className="seq-empty">No intervals</div> : null}
      <Caption
        count={value.length}
        shown={Math.min(16, value.length)}
        unit="intervals"
        previousCount={previous?.length}
      >
        <span>
          Shared scale {min}…{max}
        </span>
      </Caption>
      <PointerLegend
        pointers={mapped}
        mapped={mapped}
        length={value.length}
        visibleEnd={Math.min(16, value.length)}
      />
    </div>
  );
}
