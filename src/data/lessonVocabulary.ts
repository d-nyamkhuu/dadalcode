import type { ProblemDefinition } from "../types";

const vocabulary: [RegExp, string, string][] = [
  [
    /\b(?:index|indices)\b/i,
    "Index",
    "A position in an array or string. Python starts counting at 0, so index 2 is the third item.",
  ],
  [
    /\bcontiguous|continuous|substring|subarray\b/i,
    "Contiguous / substring / subarray",
    "Items next to each other, with no gaps. A substring is a continuous piece of a string; a subarray is a continuous piece of an array.",
  ],
  [
    /\bsubsequence\b/i,
    "Subsequence",
    "Items kept in their original order, possibly skipping some. In abcde, ace is a subsequence but not a substring.",
  ],
  [
    /\bprefix\b/i,
    "Prefix",
    "A beginning part. The prefixes of cars include c, ca, car, and cars; the empty beginning is also a prefix.",
  ],
  [
    /\bsuffix\b/i,
    "Suffix",
    "An ending part. The suffixes of cars include s, rs, ars, and cars; the empty ending is also a suffix.",
  ],
  [
    /\bcomplement\b/i,
    "Complement",
    "The part still needed. In Two Sum with target 9 and current value 7, the complement is 2.",
  ],
  [
    /\bpointer|reference\b/i,
    "Pointer / reference",
    "A variable that identifies a position or a node. Moving it changes which item it refers to; it does not move the stored item.",
  ],
  [
    /\bpredecessor\b/i,
    "Predecessor",
    "The item immediately before another item. In a linked list, its next link leads to that item.",
  ],
  [
    /\bdummy\b/i,
    "Dummy node",
    "An extra helper node before the real list head. It makes changes at the first real node work like changes elsewhere.",
  ],
  [
    /\binvariant\b/i,
    "Invariant",
    "A rule that stays true after every algorithm step. It explains why the next step is safe.",
  ],
  [
    /\binduction\b/i,
    "Induction",
    "A proof in two parts: show the starting case is correct, then show that a correct smaller case makes the next case correct.",
  ],
  [
    /\bdisjoint\b/i,
    "Disjoint",
    "Having no shared members. Disjoint groups can be counted separately without counting anything twice.",
  ],
  [
    /\bcanonical\b/i,
    "Canonical",
    "One chosen standard form. For example, write a combination in sorted order so other orderings do not count as new answers.",
  ],
  [
    /\bsibling\b/i,
    "Sibling choices",
    "Alternatives tried at the same search step. A deeper choice extends one alternative rather than competing with it.",
  ],
  [
    /\bdescendant\b/i,
    "Descendant",
    "A node reached by moving down through child links from another node.",
  ],
  [
    /\bprun(?:e|es|ing)\b/i,
    "Pruning",
    "Removing work that cannot help the answer, such as an impossible search branch or an expired heap entry.",
  ],
  [
    /\bgain\b/i,
    "Downward gain",
    "In the maximum-path-sum lesson, the best sum for one branch starting at a node and moving downward. A parent can extend only one such branch.",
  ],
  [
    /\bmonoton(?:ic|e)\b/i,
    "Monotonic",
    "Changing in only one direction, such as values that never decrease or a pointer that only moves forward.",
  ],
  [
    /\bamortized\b/i,
    "Amortized cost",
    "The average cost per operation across a whole sequence. One operation may be expensive even when the total cost is small.",
  ],
  [
    /\bheap\b/i,
    "Heap",
    "A structure that quickly exposes its smallest value (min-heap) or largest value (max-heap). The other values are not fully sorted.",
  ],
  [
    /\bqueue|\bFIFO\b/i,
    "Queue",
    "Waiting items processed first in, first out: the earliest added item is removed first.",
  ],
  [
    /\bdeque\b/i,
    "Deque",
    "A double-ended queue: items can be added or removed at either the front or the back.",
  ],
  [
    /\bstack\b/i,
    "Stack",
    "Waiting items processed last in, first out: the most recently added item is removed first.",
  ],
  [
    /\btrie\b/i,
    "Trie",
    "A tree of character paths. Words with the same beginning share the same path until their letters differ.",
  ],
  [
    /\bbacktrack|\bbacktracking\b/i,
    "Backtracking",
    "Try a choice, explore what follows, then undo the choice before trying another one.",
  ],
  [
    /\brecur(?:sion|sive|se)\b/i,
    "Recursion",
    "A function solving a smaller version of its task by calling itself. Each call has its own local state.",
  ],
  [
    /\bmemoization\b/i,
    "Memoization",
    "Saving an answer when first solving a subproblem, then reusing it if the same question appears again.",
  ],
  [
    /\bdynamic programming|\bdp\b/i,
    "Dynamic programming (DP)",
    "Save answers to smaller questions and use them to build larger answers, instead of solving the same smaller question repeatedly.",
  ],
  [
    /\bindegree|incoming edge\b/i,
    "Indegree",
    "The number of arrows pointing into a vertex. In course scheduling, it counts the prerequisites not yet completed.",
  ],
  [
    /\btopological\b/i,
    "Topological order",
    "An order where every arrow's source comes before its destination. For courses, prerequisites come first.",
  ],
  [
    /\bcomponent\b/i,
    "Connected component",
    "A group whose vertices or cells can reach one another through allowed connections. Different groups have no connecting path.",
  ],
  [
    /\bancestor\b/i,
    "Ancestor",
    "A node on the route from the root to a given node. Some problems also count a node as its own ancestor.",
  ],
  [
    /\bleaf|leaves\b/i,
    "Leaf",
    "A tree node with no children. Having only one missing child does not make a node a leaf.",
  ],
  [
    /\binorder\b/i,
    "Inorder",
    "Visit the left subtree, then the node, then the right subtree.",
  ],
  [
    /\bpreorder\b/i,
    "Preorder",
    "Visit the node, then its left subtree, then its right subtree.",
  ],
  [
    /\bpostorder\b/i,
    "Postorder",
    "Visit both child subtrees before visiting their parent.",
  ],
  [
    /\bDFS|depth.first\b/i,
    "Depth-first search (DFS)",
    "Explore one branch as far as possible before returning to another branch.",
  ],
  [
    /\bBFS|breadth.first\b/i,
    "Breadth-first search (BFS)",
    "Explore all nodes at the current distance before moving to the next distance, usually using a queue.",
  ],
  [
    /\bsentinel\b/i,
    "Sentinel",
    "A special value marking a boundary or a result that does not yet exist, such as infinity for an unreachable amount.",
  ],
  [
    /\bbit mask|bitmask|\bmask\b/i,
    "Bit mask",
    "Bits used as yes/no markers. A bit can record whether an input position is already used.",
  ],
  [
    /\bXOR\b/i,
    "XOR",
    "A bit operation that gives 1 when its two input bits differ. Two equal numbers cancel: x XOR x = 0.",
  ],
  [
    /\bbinary search\b/i,
    "Binary search",
    "Check a middle candidate, then discard a half that cannot contain the answer. Repeat on the remaining candidates.",
  ],
  [
    /\bbrute.force\b/i,
    "Brute force",
    "Try all possible candidates directly. This is often easy to understand, but may repeat too much work.",
  ],
];

export function lessonVocabulary(problem: ProblemDefinition) {
  const { lesson, explanation } = problem;
  const prose = [
    lesson.intuition,
    ...lesson.prerequisites,
    ...lesson.approach,
    lesson.correctness,
    lesson.bruteForce,
    lesson.complexity.explanation,
    ...lesson.pitfalls,
    ...(explanation?.intuition ?? []),
    ...(explanation?.walkthrough.steps ?? []),
    ...(explanation?.codeNotes.map(({ note }) => note) ?? []),
  ].join(" ");
  return vocabulary
    .filter(([pattern]) => pattern.test(prose))
    .map(([, term, meaning]) => ({ term, meaning }));
}
