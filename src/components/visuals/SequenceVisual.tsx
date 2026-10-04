import type { ReactNode, CSSProperties } from "react";
import "./sequence.css";

export type SequenceVisualProps = {
  value: unknown;
  previousValue?: unknown;
  kind?: string;
  pointers?: Record<string, number>;
  variable?: string;
  variables?: Record<string, unknown>;
  label?: string;
  /** True when the caller already applied explicit variable-specific pointer mappings. */
  pointersAreScoped?: boolean;
};
type Pointer = [string, number];
const EMPTY_POINTERS: Record<string, number> = {};
const EMPTY_VARIABLES: Record<string, unknown> = {};
const ARRAY_LIMIT = 32;
const HEAP_LIMIT = 31;
const scalar = (value: unknown): boolean =>
  value === null || ["number", "string", "boolean"].includes(typeof value);
const text = (value: unknown): string => {
  if (value === null) return "None";
  if (value === undefined) return "—";
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "string")
    return value === " " ? "␠" : value === "" ? "∅" : value;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
};
const differs = (
  current: unknown,
  previous: unknown,
  comparable: boolean,
): boolean => comparable && text(current) !== text(previous);
const indexPointers = (pointers: Record<string, number>): Pointer[] =>
  Object.entries(pointers).filter(([, index]) => Number.isInteger(index));

/** Relate pointers to known trace variables, never to every displayed sequence. */
function relatedPointers(
  variable: string,
  pointers: Record<string, number>,
  variables: Record<string, unknown>,
): Pointer[] {
  let names: string[] = [];
  if (
    /^(nums|arr|values|height|heights|gas|cost|fruits|original|letters)$/.test(
      variable,
    )
  ) {
    names = [
      "i",
      "index",
      "read",
      "write",
      "left",
      "right",
      "mid",
      "low",
      "high",
      "slow",
      "fast",
      "finder",
      "home",
      "start",
      "end",
    ];
  } else if (variable === "nums1") names = ["i"];
  else if (variable === "nums2") names = ["j"];
  else if (variable === "prices") names = ["day", "i"];
  else if (variable === "s")
    names = [
      "i",
      "index",
      "left",
      "right",
      "center",
      "best_start",
      "before",
      "previous",
    ];
  else if (variable === "t")
    names = ["j", ...(typeof variables.matched === "number" ? ["i"] : [])];
  else if (variable === "s1") names = [];
  else if (variable === "s2") names = ["right", "left"];
  else if (variable === "text1")
    names = []; // DP row is a prefix length, not a character index.
  else if (variable === "text2") names = [];
  else if (
    variable === "word" ||
    variable === "text" ||
    variable === "sequence"
  )
    names = ["index", "i"];
  else if (variable === "reachable") names = ["subtotal", "end"];
  else if (variable === "dp") names = ["i", "value", "total", "end", "col"];
  else if (variable === "counts") names = ["i"];
  else if (variable === "length" || variable === "ways") names = ["i", "j"];
  else if (variable === "remainder") names = ["mask", "next_mask"];
  else if (variable === "tails") names = ["position"];
  else if (variable === "previous" || variable === "current") names = ["col"];
  else if (variable === "prefix")
    names = ["left", "right", "start", "mid", "end", "low", "high", "i", "j"];
  else if (variable === "buffer") names = ["i", "j"];
  else if (variable === "result") {
    if ("write" in pointers) names = ["write"];
    // Product-except-self writes the same positional output as its input.
    else if (
      typeof variables.prefix === "number" ||
      typeof variables.suffix === "number"
    )
      names = ["i"];
  }
  // Explicitly qualified pointers are also safe: nums_index addresses nums only.
  return indexPointers(pointers).filter(
    ([name]) => names.includes(name) || name.startsWith(variable + "_"),
  );
}

function Caption({
  count,
  shown,
  unit = "entries",
  previousCount,
  children,
}: {
  count: number;
  shown: number;
  unit?: string;
  previousCount?: number;
  children?: ReactNode;
}) {
  const delta = previousCount === undefined ? 0 : count - previousCount;
  return (
    <div className="seq-caption">
      <span>
        {count} captured {unit}
        {shown < count ? ` · showing ${shown}` : ""}
      </span>
      {delta !== 0 ? (
        <span className="seq-size-change">
          {delta > 0 ? "+" : ""}
          {delta} {unit}
        </span>
      ) : null}
      {children}
    </div>
  );
}
function PointerLegend({
  pointers,
  mapped,
  length,
}: {
  pointers: Pointer[];
  mapped: Pointer[];
  length: number;
}) {
  if (!pointers.length) return null;
  const mappedNames = new Set(mapped.map(([name]) => name));
  return (
    <div className="seq-index-legend" aria-label="Current index variables">
      {pointers.map(([name, index]) => (
        <span
          key={name}
          className={
            mappedNames.has(name) && index >= 0 && index < length
              ? "seq-index-linked"
              : ""
          }
        >
          <code>{name}</code>
          <b>{index}</b>
          {mappedNames.has(name) && (index < 0 || index >= length) ? (
            <small>outside captured range</small>
          ) : null}
        </span>
      ))}
    </div>
  );
}

function ArrayStrip({
  value,
  previousValue,
  variable = "",
  pointers = EMPTY_POINTERS,
  variables = EMPTY_VARIABLES,
  label,
  kind,
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
  const changedCount = values
    .slice(0, ARRAY_LIMIT)
    .filter((item, i) =>
      differs(item, previous?.[i], previous !== undefined),
    ).length;
  const left = mapped.find(([name]) => name === "left")?.[1],
    right = mapped.find(([name]) => name === "right")?.[1];
  // A bracket indicates actual index bounds only, without claiming an algorithmic window.
  const hasBounds = left !== undefined && right !== undefined && left <= right;
  return (
    <div
      className={`seq-visual seq-array-visual ${kind === "dp" ? "seq-dp-strip" : ""}`}
    >
      <div
        className="seq-array-scroll"
        role="group"
        aria-label={label ?? `${variable || "Sequence"} indexed values`}
      >
        <div className="seq-array-strip">
          {values.slice(0, ARRAY_LIMIT).map((item, index) => {
            const here = mapped.filter(([, position]) => position === index);
            const changed = differs(
              item,
              previous?.[index],
              previous !== undefined,
            );
            const inside = hasBounds && index >= left! && index <= right!;
            return (
              <div
                className={`seq-array-slot ${inside ? "seq-within-bounds" : ""}`}
                key={index}
              >
                <span className="seq-cell-index">{index}</span>
                <div
                  className={`seq-cell ${here.length ? "seq-current" : ""} ${changed ? "seq-changed" : ""} ${item === true ? "seq-true" : ""}`}
                  title={text(item)}
                  aria-label={`Index ${index}: ${text(item)}${here.length ? `; ${here.map(([name]) => name).join(", ")}` : ""}${changed ? "; changed since previous step" : ""}`}
                >
                  <span>{text(item)}</span>
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
        {changedCount ? (
          <span className="seq-change-key">Changed since previous step</span>
        ) : null}
      </Caption>
      {values.length === 0 ? (
        <div className="seq-empty">Empty sequence</div>
      ) : null}
      <PointerLegend
        pointers={indexPointers(pointers)}
        mapped={mapped}
        length={values.length}
      />
    </div>
  );
}

function MatrixVisual({
  value,
  previousValue,
  pointers = EMPTY_POINTERS,
  variable,
  label,
}: SequenceVisualProps & { value: unknown[][] }) {
  const previous = Array.isArray(previousValue) ? previousValue : undefined;
  const rows = Math.min(value.length, 16),
    columns = Math.max(0, ...value.map((row) => row.length));
  const pairs = [
    ["row", "col"],
    ["r", "c"],
    ["nr", "nc"],
  ]
    .filter(
      ([r, c]) =>
        Number.isInteger(pointers[r]) && Number.isInteger(pointers[c]),
    )
    .map(([r, c]) => ({
      row: pointers[r],
      col: pointers[c],
      rowName: r,
      colName: c,
    }));
  const mapped: Pointer[] = pairs.flatMap(
    (pair) =>
      [
        [pair.rowName, pair.row],
        [pair.colName, pair.col],
      ] as Pointer[],
  );
  return (
    <div className="seq-visual seq-matrix-visual">
      <div className="seq-matrix-scroll">
        <table
          className="seq-matrix"
          aria-label={label ?? `${variable || "Matrix"} row and column values`}
        >
          <thead>
            <tr>
              <th scope="col" className="seq-matrix-corner">
                r / c
              </th>
              {Array.from({ length: Math.min(columns, 20) }, (_, col) => (
                <th scope="col" key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.slice(0, rows).map((row, r) => (
              <tr key={r}>
                <th scope="row">{r}</th>
                {row.slice(0, 20).map((cell, c) => {
                  const active = pairs.some(
                    (pair) => pair.row === r && pair.col === c,
                  );
                  const oldRow = Array.isArray(previous?.[r])
                    ? previous[r]
                    : undefined;
                  const changed = differs(
                    cell,
                    oldRow?.[c],
                    previous !== undefined,
                  );
                  return (
                    <td
                      key={c}
                      className={`${active ? "seq-current" : ""} ${changed ? "seq-changed" : ""} ${cell === true ? "seq-true" : ""}`}
                      title={`[${r}, ${c}] = ${text(cell)}${active ? "; current cell" : ""}`}
                    >
                      <span>{text(cell)}</span>
                      {active ? <i className="seq-matrix-dot" /> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="seq-caption">
        <span>
          {value.length} captured rows × {columns} columns
          {rows < value.length || columns > 20
            ? ` · showing ${rows} × ${Math.min(columns, 20)}`
            : ""}
        </span>
        <span className="seq-change-key">Changed values marked in amber</span>
      </div>
      <PointerLegend
        pointers={indexPointers(pointers)}
        mapped={mapped}
        length={Math.max(rows, columns)}
      />
    </div>
  );
}

function StackQueue({
  value,
  previousValue,
  variable = "",
  label,
}: SequenceVisualProps & { value: unknown[] }) {
  const queue = /queue|cooldown/.test(variable);
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

function HeapVisual({
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

function BitsVisual({
  value,
  previousValue,
  variable,
  label,
}: SequenceVisualProps & { value: number }) {
  const unsigned = value >>> 0,
    bits = unsigned.toString(2).padStart(32, "0");
  const oldBits =
    typeof previousValue === "number"
      ? (previousValue >>> 0).toString(2).padStart(32, "0")
      : undefined;
  return (
    <div
      className="seq-visual seq-bits-visual"
      role="group"
      aria-label={label ?? `${variable || "Value"} as 32 bits`}
    >
      <div className="seq-bit-groups">
        {Array.from({ length: 4 }, (_, group) => (
          <div className="seq-byte" key={group}>
            <div className="seq-byte-indices">
              <span>{31 - group * 8}</span>
              <span>{24 - group * 8}</span>
            </div>
            <div className="seq-byte-bits">
              {Array.from({ length: 8 }, (_, offset) => {
                const i = group * 8 + offset,
                  changed = oldBits !== undefined && bits[i] !== oldBits[i];
                return (
                  <span
                    key={i}
                    className={`seq-bit ${bits[i] === "1" ? "seq-bit-one" : ""} ${changed ? "seq-changed" : ""}`}
                    title={`Bit ${31 - i}: ${bits[i]}`}
                  >
                    {bits[i]}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="seq-caption">
        <span>32-bit view · most significant bit first</span>
        <code>
          {value} · 0x{unsigned.toString(16).padStart(8, "0")}
        </code>
      </div>
      {value !== unsigned ? (
        <div className="seq-heap-note">
          Showing the low 32 bits of the traced integer.
        </div>
      ) : null}
    </div>
  );
}
function intervalOf(value: unknown): [number, number] | null {
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
function IntervalVisual({
  value,
  previousValue,
  variables = EMPTY_VARIABLES,
  label,
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
              <span className="seq-interval-index">{index}</span>
              <div className="seq-interval-track">
                <div
                  className={`seq-interval-bar ${changed ? "seq-changed" : ""} ${start === end ? "seq-point-interval" : ""}`}
                  style={
                    {
                      left: `${((start - min) / span) * 100}%`,
                      width: `${((end - start) / span) * 100}%`,
                    } as CSSProperties
                  }
                  title={`[${start}, ${end}]`}
                >
                  <i />
                  <span>
                    {start} – {end}
                  </span>
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
    </div>
  );
}

/** Pure views of captured Python state. Unsupported objects use the caller's fallback. */
export default function SequenceVisual(
  props: SequenceVisualProps,
): ReactNode | null {
  const { value, variable = "", kind } = props;
  if (kind === "bits" && typeof value === "number" && Number.isFinite(value))
    return <BitsVisual {...props} value={value} />;
  if (Array.isArray(value)) {
    if (kind === "intervals") {
      const single = intervalOf(value);
      if (single) return <IntervalVisual {...props} value={[single]} />;
      const intervals = value.map(intervalOf);
      if (intervals.every((interval) => interval !== null)) {
        const previous = Array.isArray(props.previousValue)
          ? props.previousValue.map(intervalOf)
          : undefined;
        return (
          <IntervalVisual
            {...props}
            value={intervals as [number, number][]}
            previousValue={previous}
          />
        );
      }
    }
    if (/^(heap|pq|lower|upper|small|large|active_ends)$/.test(variable))
      return <HeapVisual {...props} value={value} />;
    if (/^(stack|queue|cooldown)$/.test(variable))
      return <StackQueue {...props} value={value} />;
    const matrixVariable = /^(matrix|board|grid|heights|dp|table|result)$/.test(
      variable,
    );
    if (
      value.length > 0 &&
      matrixVariable &&
      (kind === "grid" || kind === "dp") &&
      value.every((row) => Array.isArray(row) && row.every(scalar))
    )
      return <MatrixVisual {...props} value={value as unknown[][]} />;
    if (value.every(scalar)) return <ArrayStrip {...props} value={value} />;
    return null;
  }
  if (kind === "intervals") {
    const interval = intervalOf(value);
    if (interval) return <IntervalVisual {...props} value={[interval]} />;
  }
  if (
    typeof value === "string" &&
    /^(s|s1|s2|t|word|text|text1|text2|sequence|digits|letters)$/.test(variable)
  )
    return <ArrayStrip {...props} value={value} />;
  return null;
}
