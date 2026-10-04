import type { ReactNode } from "react";
import { type SequenceVisualProps, scalar } from "./sequence/shared";
export type { SequenceVisualProps } from "./sequence/shared";
import "./sequence.css";
import { ArrayStrip } from "./sequence/ArrayStrip";
import { MatrixVisual } from "./sequence/MatrixVisual";
import { StackQueue } from "./sequence/StackQueue";
import { HeapVisual } from "./sequence/HeapVisual";
import { BitsVisual } from "./sequence/BitsVisual";
import { intervalOf, IntervalVisual } from "./sequence/IntervalVisual";
/** Pure views of captured Python state. Unsupported objects use the caller's fallback. */
export default function SequenceVisual(
  props: SequenceVisualProps,
): ReactNode | null {
  const { value, variable = "", kind: defaultKind } = props;
  const renderer = props.renderer;
  const kind = renderer ?? defaultKind;
  if (Array.isArray(value)) {
    if (renderer === "heap") return <HeapVisual {...props} value={value} />;
    if (renderer === "stack" || renderer === "queue")
      return <StackQueue {...props} value={value} />;
    if (
      (renderer === "matrix" || renderer === "dp") &&
      value.length > 0 &&
      value.every((row) => Array.isArray(row) && row.every(scalar))
    )
      return <MatrixVisual {...props} value={value as unknown[][]} />;
    if ((renderer === "array" || renderer === "dp") && value.every(scalar))
      return <ArrayStrip {...props} value={value} />;
  }
  if (renderer === "string" && typeof value === "string")
    return <ArrayStrip {...props} value={value} />;
  if (
    renderer === "bits" &&
    typeof value === "number" &&
    Number.isFinite(value)
  )
    return <BitsVisual {...props} value={value} />;
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
