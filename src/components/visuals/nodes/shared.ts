import { NODE_LIMIT } from "../node-snapshots";
export const LIMIT = NODE_LIMIT;
export const object = (v: unknown): Record<string, unknown> | null =>
  v !== null && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
export const text = (v: unknown): string =>
  v === null
    ? "None"
    : typeof v === "string"
      ? v
      : (JSON.stringify(v) ?? String(v));
export const ref = (v: unknown): string | null => {
  const record = object(v);
  if (!record) return null;
  if (typeof record.__nodeRef === "string") return record.__nodeRef;
  if (typeof record.__ref === "string") return record.__ref;
  if (typeof record.identity === "string") return record.identity;
  return record.stableIds === true && typeof record.root === "string"
    ? record.root
    : null;
};
