import type { ReactNode } from "react";
import type { FigureKind } from "../../../types";
export type SequenceVisualProps = {
  value: unknown;
  previousValue?: unknown;
  kind?: string;
  renderer?: FigureKind;
  pointers?: Record<string, number>;
  variable?: string;
  variables?: Record<string, unknown>;
  label?: string;
  /** True when the caller already applied explicit variable-specific pointer mappings. */
  pointersAreScoped?: boolean;
};
export type Pointer = [string, number];
export const EMPTY_POINTERS: Record<string, number> = {};
export const EMPTY_VARIABLES: Record<string, unknown> = {};
export const ARRAY_LIMIT = 32;
export const HEAP_LIMIT = 31;
export const scalar = (value: unknown): boolean =>
  value === null || ["number", "string", "boolean"].includes(typeof value);
export const text = (value: unknown): string => {
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
export const differs = (
  current: unknown,
  previous: unknown,
  comparable: boolean,
): boolean => comparable && text(current) !== text(previous);
export const indexPointers = (pointers: Record<string, number>): Pointer[] =>
  Object.entries(pointers).filter(([, index]) => Number.isInteger(index));

/** Relate pointers to known trace variables, never to every displayed sequence. */
export function relatedPointers(
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
  else if (variable === "firstList") names = ["i"];
  else if (variable === "secondList") names = ["j"];
  else if (variable === "intervals" || variable === "busy") names = ["i"];
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

export function Caption({
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
export function PointerLegend({
  pointers,
  mapped,
  length,
  visibleStart = 0,
  visibleEnd = length,
}: {
  pointers: Pointer[];
  mapped: Pointer[];
  length: number;
  visibleStart?: number;
  visibleEnd?: number;
}) {
  if (!pointers.length) return null;
  const mappedNames = new Set(mapped.map(([name]) => name));
  return (
    <div className="seq-index-legend" aria-label="Current index variables">
      {pointers.map(([name, index]) => (
        <span
          key={name}
          className={
            mappedNames.has(name) && index >= visibleStart && index < visibleEnd
              ? "seq-index-linked"
              : ""
          }
        >
          <code>{name}</code>
          <b>{index}</b>
          {mappedNames.has(name) && (index < 0 || index >= length) ? (
            <small>outside captured range</small>
          ) : mappedNames.has(name) &&
            (index < visibleStart || index >= visibleEnd) ? (
            <small>outside displayed range</small>
          ) : null}
        </span>
      ))}
    </div>
  );
}
