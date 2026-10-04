import type { FigureKind, Visualization } from "../types";

// Presentation is chosen per variable: the same lesson can contain an array,
// lookup table, frontier queue, and graph without giving them the same shape.
const renderers: Record<string, Record<string, FigureKind>> = {
  "two-sum": { nums: "array", seen: "map" },
  "contains-duplicate": { nums: "array", seen: "set" },
  "valid-anagram": { counts: "map" },
  "group-anagrams": { groups: "map" },
  "longest-substring-without-repeating-characters": {
    s: "string",
    last: "map",
  },
  "minimum-window-substring": { s: "string", t: "string", needed: "map" },
  "longest-repeating-character-replacement": { s: "string", counts: "map" },
  "valid-parentheses": { s: "string", stack: "stack" },
  "maximum-frequency-stack": { frequency: "map", groups: "map" },
  "course-schedule": { graph: "graph", indegree: "array", queue: "queue" },
  "course-schedule-ii": { graph: "graph", indegree: "array", queue: "queue" },
  "alien-dictionary": { graph: "graph", indegree: "map", queue: "queue" },
  "number-of-connected-components-in-an-undirected-graph": { graph: "graph" },
  permutations: { used: "set" },
  "permutations-ii": { used: "array" },
  "longest-word-in-dictionary": { buildable: "set" },
  "unique-paths": { dp: "dp" },
  "coin-change": { coins: "array", dp: "dp" },
  "longest-common-subsequence": {
    text1: "string",
    text2: "string",
    previous: "dp",
    current: "dp",
  },
  "partition-to-k-equal-sum-subsets": { nums: "array", remainder: "dp" },
  "counting-bits": { counts: "dp" },
  "meeting-rooms-ii": { intervals: "intervals", active_ends: "heap" },
  "sliding-window-median": {
    nums: "array",
    small: "heap",
    large: "heap",
    delayed: "map",
  },
  "find-median-from-data-stream": { lower: "heap", upper: "heap" },
  "sudoku-solver": { board: "matrix" },
  "word-search-ii": { board: "matrix", trie: "trie" },
  "spiral-matrix": { matrix: "matrix", result: "array" },
};

// Bind index names to their actual containers. A pointer may be a sentinel
// outside a container; its value still remains visible in the watch strip.
const bindings: Record<string, Record<string, string[]>> = {
  "squares-of-a-sorted-array": { nums: ["left", "right"], result: ["write"] },
  "median-of-two-sorted-arrays": { nums1: ["i"], nums2: ["j"] },
  "minimum-window-substring": {
    s: ["left", "right", "best_start"],
    t: [],
    needed: [],
  },
  "longest-common-subsequence": {
    text1: [],
    text2: [],
    previous: ["col"],
    current: ["col"],
  },
  "coin-change": { coins: [], dp: ["value"] },
  "combination-sum-iv": { nums: [], dp: ["total"] },
  "partition-to-k-equal-sum-subsets": {
    nums: ["i"],
    remainder: ["mask", "next_mask"],
  },
  "interval-list-intersections": {
    firstList: ["i"],
    secondList: ["j"],
    result: [],
  },
  "product-of-array-except-self": { nums: ["i"], result: ["i"] },
  "number-of-islands": {
    grid: ["row", "col", "r", "c", "nr", "nc"],
    queue: [],
  },
  "word-squares": { square: [], prefixes: [], result: [] },
  "n-queens": {
    placement: ["row"],
    columns: [],
    ascending: [],
    descending: [],
    result: [],
  },
};
export function visualizationFor(
  slug: string,
  config: Visualization,
): Visualization {
  if (!bindings[slug] && !renderers[slug]) return config;
  return {
    ...config,
    pointerTargets: { ...config.pointerTargets, ...bindings[slug] },
    renderers: { ...config.renderers, ...renderers[slug] },
  };
}
