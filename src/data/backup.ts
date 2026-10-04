import { catalog } from "./problems";
import type { Progress } from "../types";

export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
export function downloadFile(
  name: string,
  content: string,
  type = "text/plain",
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function makeBackup(entries: Progress[]) {
  return JSON.stringify(
    {
      format: "loopcraft-progress",
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: entries.map(
        ({ slug, draft, status, updatedAt, lastResult }) => ({
          slug,
          draft,
          status,
          updatedAt,
          lastResult,
        }),
      ),
    },
    null,
    2,
  );
}
export function parseBackup(text: string): Progress[] {
  if (new Blob([text]).size > MAX_BACKUP_BYTES)
    throw new Error("Backup must be no larger than 5 MB.");
  const data = JSON.parse(text);
  if (
    data?.format !== "loopcraft-progress" ||
    data.version !== 1 ||
    !Array.isArray(data.entries) ||
    data.entries.length > catalog.length
  )
    throw new Error("Choose a Loopcraft progress backup (version 1).");
  const slugs = new Set(catalog.map((p) => p.slug)),
    seen = new Set<string>();
  return data.entries.map((entry: unknown) => {
    if (!entry || typeof entry !== "object")
      throw new Error("Invalid progress entry.");
    const e = entry as Record<string, unknown>;
    if (
      typeof e.slug !== "string" ||
      !slugs.has(e.slug) ||
      seen.has(e.slug) ||
      typeof e.draft !== "string" ||
      e.draft.length > 500000 ||
      !["started", "solved"].includes(String(e.status)) ||
      typeof e.updatedAt !== "number" ||
      !Number.isFinite(e.updatedAt) ||
      e.updatedAt < 0
    )
      throw new Error("Backup contains an invalid or duplicate problem entry.");
    seen.add(e.slug);
    let lastResult: Progress["lastResult"];
    if (e.lastResult !== undefined) {
      const r = e.lastResult as Progress["lastResult"];
      if (
        !r ||
        !Number.isInteger(r.passed) ||
        !Number.isInteger(r.total) ||
        r.passed < 0 ||
        r.total < 1 ||
        r.passed > r.total ||
        typeof r.at !== "number" ||
        !Number.isFinite(r.at) ||
        r.at < 0
      )
        throw new Error("Backup contains an invalid test result.");
      lastResult = { passed: r.passed, total: r.total, at: r.at };
    }
    return {
      slug: e.slug,
      draft: e.draft,
      status: e.status as Progress["status"],
      updatedAt: e.updatedAt,
      lastResult,
    };
  });
}
