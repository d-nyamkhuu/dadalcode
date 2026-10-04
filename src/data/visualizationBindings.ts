import type { Visualization } from "../types";

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
  return bindings[slug]
    ? {
        ...config,
        pointerTargets: { ...config.pointerTargets, ...bindings[slug] },
      }
    : config;
}
