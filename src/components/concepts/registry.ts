import type { ConceptDrawings } from "../../types";
export const diagramLoaders: Record<
  string,
  () => Promise<{ default: ConceptDrawings }>
> = {
  "two-sum": () => import("./diagrams/two-sum"),
  "add-two-numbers": () => import("./diagrams/add-two-numbers"),
  "longest-substring-without-repeating-characters": () =>
    import("./diagrams/longest-substring-without-repeating-characters"),
  "median-of-two-sorted-arrays": () =>
    import("./diagrams/median-of-two-sorted-arrays"),
  "longest-palindromic-substring": () =>
    import("./diagrams/longest-palindromic-substring"),
  "container-with-most-water": () =>
    import("./diagrams/container-with-most-water"),
  "3sum": () => import("./diagrams/3sum"),
  "3sum-closest": () => import("./diagrams/3sum-closest"),
  "letter-combinations-of-a-phone-number": () =>
    import("./diagrams/letter-combinations-of-a-phone-number"),
  "remove-nth-node-from-end-of-list": () =>
    import("./diagrams/remove-nth-node-from-end-of-list"),
  "merge-two-sorted-lists": () => import("./diagrams/merge-two-sorted-lists"),
  "generate-parentheses": () => import("./diagrams/generate-parentheses"),
  "merge-k-sorted-lists": () => import("./diagrams/merge-k-sorted-lists"),
  "swap-nodes-in-pairs": () => import("./diagrams/swap-nodes-in-pairs"),
  "reverse-nodes-in-k-group": () =>
    import("./diagrams/reverse-nodes-in-k-group"),
  "substring-with-concatenation-of-all-words": () =>
    import("./diagrams/substring-with-concatenation-of-all-words"),
  "search-in-rotated-sorted-array": () =>
    import("./diagrams/search-in-rotated-sorted-array"),
  "sudoku-solver": () => import("./diagrams/sudoku-solver"),
  "combination-sum": () => import("./diagrams/combination-sum"),
  "combination-sum-ii": () => import("./diagrams/combination-sum-ii"),
  "first-missing-positive": () => import("./diagrams/first-missing-positive"),
  "trapping-rain-water": () => import("./diagrams/trapping-rain-water"),
  permutations: () => import("./diagrams/permutations"),
  "permutations-ii": () => import("./diagrams/permutations-ii"),
  "rotate-image": () => import("./diagrams/rotate-image"),
  "n-queens": () => import("./diagrams/n-queens"),
  "maximum-subarray": () => import("./diagrams/maximum-subarray"),
  "spiral-matrix": () => import("./diagrams/spiral-matrix"),
  "jump-game": () => import("./diagrams/jump-game"),
  "merge-intervals": () => import("./diagrams/merge-intervals"),
  "insert-interval": () => import("./diagrams/insert-interval"),
  "rotate-list": () => import("./diagrams/rotate-list"),
  "unique-paths": () => import("./diagrams/unique-paths"),
  "climbing-stairs": () => import("./diagrams/climbing-stairs"),
  "set-matrix-zeroes": () => import("./diagrams/set-matrix-zeroes"),
  "search-a-2d-matrix": () => import("./diagrams/search-a-2d-matrix"),
  "sort-colors": () => import("./diagrams/sort-colors"),
  "minimum-window-substring": () =>
    import("./diagrams/minimum-window-substring"),
  combinations: () => import("./diagrams/combinations"),
  subsets: () => import("./diagrams/subsets"),
  "word-search": () => import("./diagrams/word-search"),
  "search-in-rotated-sorted-array-ii": () =>
    import("./diagrams/search-in-rotated-sorted-array-ii"),
  "remove-duplicates-from-sorted-list": () =>
    import("./diagrams/remove-duplicates-from-sorted-list"),
  "subsets-ii": () => import("./diagrams/subsets-ii"),
  "decode-ways": () => import("./diagrams/decode-ways"),
  "reverse-linked-list-ii": () => import("./diagrams/reverse-linked-list-ii"),
  "validate-binary-search-tree": () =>
    import("./diagrams/validate-binary-search-tree"),
  "same-tree": () => import("./diagrams/same-tree"),
  "binary-tree-level-order-traversal": () =>
    import("./diagrams/binary-tree-level-order-traversal"),
  "binary-tree-zigzag-level-order-traversal": () =>
    import("./diagrams/binary-tree-zigzag-level-order-traversal"),
  "maximum-depth-of-binary-tree": () =>
    import("./diagrams/maximum-depth-of-binary-tree"),
  "construct-binary-tree-from-preorder-and-inorder-traversal": () =>
    import("./diagrams/construct-binary-tree-from-preorder-and-inorder-traversal"),
  "binary-tree-level-order-traversal-ii": () =>
    import("./diagrams/binary-tree-level-order-traversal-ii"),
  "minimum-depth-of-binary-tree": () =>
    import("./diagrams/minimum-depth-of-binary-tree"),
  "path-sum": () => import("./diagrams/path-sum"),
  "path-sum-ii": () => import("./diagrams/path-sum-ii"),
  "best-time-to-buy-and-sell-stock": () =>
    import("./diagrams/best-time-to-buy-and-sell-stock"),
  "binary-tree-maximum-path-sum": () =>
    import("./diagrams/binary-tree-maximum-path-sum"),
  "longest-consecutive-sequence": () =>
    import("./diagrams/longest-consecutive-sequence"),
  "palindrome-partitioning": () => import("./diagrams/palindrome-partitioning"),
  "gas-station": () => import("./diagrams/gas-station"),
  "single-number": () => import("./diagrams/single-number"),
  "word-break": () => import("./diagrams/word-break"),
  "linked-list-cycle": () => import("./diagrams/linked-list-cycle"),
  "linked-list-cycle-ii": () => import("./diagrams/linked-list-cycle-ii"),
  "reorder-list": () => import("./diagrams/reorder-list"),
  "sort-list": () => import("./diagrams/sort-list"),
  "maximum-product-subarray": () =>
    import("./diagrams/maximum-product-subarray"),
  "find-minimum-in-rotated-sorted-array": () =>
    import("./diagrams/find-minimum-in-rotated-sorted-array"),
  "find-peak-element": () => import("./diagrams/find-peak-element"),
  "majority-element": () => import("./diagrams/majority-element"),
  "house-robber": () => import("./diagrams/house-robber"),
  "binary-tree-right-side-view": () =>
    import("./diagrams/binary-tree-right-side-view"),
  "number-of-islands": () => import("./diagrams/number-of-islands"),
  "remove-linked-list-elements": () =>
    import("./diagrams/remove-linked-list-elements"),
  "reverse-linked-list": () => import("./diagrams/reverse-linked-list"),
  "course-schedule": () => import("./diagrams/course-schedule"),
  "implement-trie-prefix-tree": () =>
    import("./diagrams/implement-trie-prefix-tree"),
  "minimum-size-subarray-sum": () =>
    import("./diagrams/minimum-size-subarray-sum"),
  "course-schedule-ii": () => import("./diagrams/course-schedule-ii"),
  "word-search-ii": () => import("./diagrams/word-search-ii"),
  "house-robber-ii": () => import("./diagrams/house-robber-ii"),
  "kth-largest-element-in-an-array": () =>
    import("./diagrams/kth-largest-element-in-an-array"),
  "combination-sum-iii": () => import("./diagrams/combination-sum-iii"),
  "contains-duplicate": () => import("./diagrams/contains-duplicate"),
  "invert-binary-tree": () => import("./diagrams/invert-binary-tree"),
  "kth-smallest-element-in-a-bst": () =>
    import("./diagrams/kth-smallest-element-in-a-bst"),
  "palindrome-linked-list": () => import("./diagrams/palindrome-linked-list"),
  "lowest-common-ancestor-of-a-binary-search-tree": () =>
    import("./diagrams/lowest-common-ancestor-of-a-binary-search-tree"),
  "lowest-common-ancestor-of-a-binary-tree": () =>
    import("./diagrams/lowest-common-ancestor-of-a-binary-tree"),
  "product-of-array-except-self": () =>
    import("./diagrams/product-of-array-except-self"),
  "sliding-window-maximum": () => import("./diagrams/sliding-window-maximum"),
  "search-a-2d-matrix-ii": () => import("./diagrams/search-a-2d-matrix-ii"),
  "meeting-rooms": () => import("./diagrams/meeting-rooms"),
  "meeting-rooms-ii": () => import("./diagrams/meeting-rooms-ii"),
  "factor-combinations": () => import("./diagrams/factor-combinations"),
  "binary-tree-paths": () => import("./diagrams/binary-tree-paths"),
  "graph-valid-tree": () => import("./diagrams/graph-valid-tree"),
  "missing-number": () => import("./diagrams/missing-number"),
  "alien-dictionary": () => import("./diagrams/alien-dictionary"),
  "move-zeroes": () => import("./diagrams/move-zeroes"),
  "find-the-duplicate-number": () =>
    import("./diagrams/find-the-duplicate-number"),
  "find-median-from-data-stream": () =>
    import("./diagrams/find-median-from-data-stream"),
  "serialize-and-deserialize-binary-tree": () =>
    import("./diagrams/serialize-and-deserialize-binary-tree"),
  "longest-increasing-subsequence": () =>
    import("./diagrams/longest-increasing-subsequence"),
  "range-sum-query-immutable": () =>
    import("./diagrams/range-sum-query-immutable"),
  "best-time-to-buy-and-sell-stock-with-cooldown": () =>
    import("./diagrams/best-time-to-buy-and-sell-stock-with-cooldown"),
  "minimum-height-trees": () => import("./diagrams/minimum-height-trees"),
  "generalized-abbreviation": () =>
    import("./diagrams/generalized-abbreviation"),
  "coin-change": () => import("./diagrams/coin-change"),
  "number-of-connected-components-in-an-undirected-graph": () =>
    import("./diagrams/number-of-connected-components-in-an-undirected-graph"),
  "count-of-range-sum": () => import("./diagrams/count-of-range-sum"),
  "odd-even-linked-list": () => import("./diagrams/odd-even-linked-list"),
  "counting-bits": () => import("./diagrams/counting-bits"),
  "top-k-frequent-elements": () => import("./diagrams/top-k-frequent-elements"),
  "rearrange-string-k-distance-apart": () =>
    import("./diagrams/rearrange-string-k-distance-apart"),
  "find-k-pairs-with-smallest-sums": () =>
    import("./diagrams/find-k-pairs-with-smallest-sums"),
  "combination-sum-iv": () => import("./diagrams/combination-sum-iv"),
  "kth-smallest-element-in-a-sorted-matrix": () =>
    import("./diagrams/kth-smallest-element-in-a-sorted-matrix"),
  "is-subsequence": () => import("./diagrams/is-subsequence"),
  "partition-equal-subset-sum": () =>
    import("./diagrams/partition-equal-subset-sum"),
  "pacific-atlantic-water-flow": () =>
    import("./diagrams/pacific-atlantic-water-flow"),
  "longest-repeating-character-replacement": () =>
    import("./diagrams/longest-repeating-character-replacement"),
  "word-squares": () => import("./diagrams/word-squares"),
  "non-overlapping-intervals": () =>
    import("./diagrams/non-overlapping-intervals"),
  "path-sum-iii": () => import("./diagrams/path-sum-iii"),
  "find-all-duplicates-in-an-array": () =>
    import("./diagrams/find-all-duplicates-in-an-array"),
  "find-all-numbers-disappeared-in-an-array": () =>
    import("./diagrams/find-all-numbers-disappeared-in-an-array"),
  "sort-characters-by-frequency": () =>
    import("./diagrams/sort-characters-by-frequency"),
  "minimum-number-of-arrows-to-burst-balloons": () =>
    import("./diagrams/minimum-number-of-arrows-to-burst-balloons"),
  "concatenated-words": () => import("./diagrams/concatenated-words"),
  "sliding-window-median": () => import("./diagrams/sliding-window-median"),
  "target-sum": () => import("./diagrams/target-sum"),
  "permutation-in-string": () => import("./diagrams/permutation-in-string"),
  "subtree-of-another-tree": () => import("./diagrams/subtree-of-another-tree"),
  "merge-two-binary-trees": () => import("./diagrams/merge-two-binary-trees"),
  "task-scheduler": () => import("./diagrams/task-scheduler"),
  "smallest-range-covering-elements-from-k-lists": () =>
    import("./diagrams/smallest-range-covering-elements-from-k-lists"),
  "average-of-levels-in-binary-tree": () =>
    import("./diagrams/average-of-levels-in-binary-tree"),
  "design-search-autocomplete-system": () =>
    import("./diagrams/design-search-autocomplete-system"),
  "maximum-average-subarray-i": () =>
    import("./diagrams/maximum-average-subarray-i"),
  "palindromic-substrings": () => import("./diagrams/palindromic-substrings"),
  "maximum-binary-tree": () => import("./diagrams/maximum-binary-tree"),
  "find-k-closest-elements": () => import("./diagrams/find-k-closest-elements"),
  "maximum-width-of-binary-tree": () =>
    import("./diagrams/maximum-width-of-binary-tree"),
  "number-of-longest-increasing-subsequence": () =>
    import("./diagrams/number-of-longest-increasing-subsequence"),
  "partition-to-k-equal-sum-subsets": () =>
    import("./diagrams/partition-to-k-equal-sum-subsets"),
  "subarray-product-less-than-k": () =>
    import("./diagrams/subarray-product-less-than-k"),
  "longest-word-in-dictionary": () =>
    import("./diagrams/longest-word-in-dictionary"),
  "find-smallest-letter-greater-than-target": () =>
    import("./diagrams/find-smallest-letter-greater-than-target"),
  "prefix-and-suffix-search": () =>
    import("./diagrams/prefix-and-suffix-search"),
  "employee-free-time": () => import("./diagrams/employee-free-time"),
  "reorganize-string": () => import("./diagrams/reorganize-string"),
  "binary-search": () => import("./diagrams/binary-search"),
  "letter-case-permutation": () => import("./diagrams/letter-case-permutation"),
  "count-unique-characters-of-all-substrings-of-a-given-string": () =>
    import("./diagrams/count-unique-characters-of-all-substrings-of-a-given-string"),
  "backspace-string-compare": () =>
    import("./diagrams/backspace-string-compare"),
  "peak-index-in-a-mountain-array": () =>
    import("./diagrams/peak-index-in-a-mountain-array"),
  "all-nodes-distance-k-in-binary-tree": () =>
    import("./diagrams/all-nodes-distance-k-in-binary-tree"),
  "middle-of-the-linked-list": () =>
    import("./diagrams/middle-of-the-linked-list"),
  "maximum-frequency-stack": () => import("./diagrams/maximum-frequency-stack"),
  "fruit-into-baskets": () => import("./diagrams/fruit-into-baskets"),
  "k-closest-points-to-origin": () =>
    import("./diagrams/k-closest-points-to-origin"),
  "squares-of-a-sorted-array": () =>
    import("./diagrams/squares-of-a-sorted-array"),
  "interval-list-intersections": () =>
    import("./diagrams/interval-list-intersections"),
  "index-pairs-of-a-string": () => import("./diagrams/index-pairs-of-a-string"),
  "convert-1d-array-into-2d-array": () =>
    import("./diagrams/convert-1d-array-into-2d-array"),
  "valid-anagram": () => import("./diagrams/valid-anagram"),
  "group-anagrams": () => import("./diagrams/group-anagrams"),
  "encode-and-decode-strings": () =>
    import("./diagrams/encode-and-decode-strings"),
  "valid-palindrome": () => import("./diagrams/valid-palindrome"),
  "valid-parentheses": () => import("./diagrams/valid-parentheses"),
  "design-add-and-search-words-data-structure": () =>
    import("./diagrams/design-add-and-search-words-data-structure"),
  "clone-graph": () => import("./diagrams/clone-graph"),
  "number-of-1-bits": () => import("./diagrams/number-of-1-bits"),
  "reverse-bits": () => import("./diagrams/reverse-bits"),
  "sum-of-two-integers": () => import("./diagrams/sum-of-two-integers"),
  "longest-common-subsequence": () =>
    import("./diagrams/longest-common-subsequence"),
  "rotate-array": () => import("./diagrams/rotate-array"),
};
