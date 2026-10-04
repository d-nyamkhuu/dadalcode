import entries from "./catalog.json";
import type { CatalogEntry, ProblemDefinition } from "../types";
export const catalog = entries as CatalogEntry[];
const cache = new Map<string, Promise<ProblemDefinition>>();
export function loadProblem(slug: string) {
  if (cache.has(slug)) return cache.get(slug)!;
  const entry = catalog.find((p) => p.slug === slug);
  if (!entry) return Promise.reject(new Error("Problem not found."));
  const base = `${import.meta.env.BASE_URL}problems/${slug}/`;
  const pending = Promise.all(
    [
      "lesson.json",
      "solution.py",
      "starter.py",
      "adapter.py",
      "tests.json",
      "explanation.json",
    ].map(async (name) => {
      const response = await fetch(base + name);
      if (!response.ok)
        throw new Error(`Could not load ${entry.title}. Please retry.`);
      return name.endsWith(".json") ? response.json() : response.text();
    }),
  ).then(([lesson, solution, starter, adapter, tests, explanation]) => ({
    ...entry,
    lesson,
    solution,
    starter,
    adapter,
    tests,
    explanation,
  }));
  cache.set(slug, pending);
  pending.catch(() => cache.delete(slug));
  return pending;
}
