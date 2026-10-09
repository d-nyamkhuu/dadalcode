const labels: Record<string, string> = {
  a: "First number",
  b: "Second number",
  x: "Target value",
  s1: "Query text",
  s2: "Search text",
  nums: "Numbers",
  nums1: "First row",
  nums2: "Second row",
  arr: "Values",
  s: "Text",
  t: "Required text",
  strs: "Strings",
  wordDict: "Dictionary words",
  head: "Chain, in order",
  l1: "First number, ones digit first",
  l2: "Second number, ones digit first",
  list1: "First chain",
  list2: "Second chain",
  root: "Tree, level by level",
  p: "First target",
  q: "Second target",
  n: "Number",
  k: "Requested count",
  root1: "First tree, level by level",
  root2: "Second tree, level by level",
  subRoot: "Candidate tree, level by level",
  height: "Heights",
  digits: "Phone digits",
  chars: "Typed characters",
  times: "History counts",
  lower: "Minimum section sum",
  upper: "Maximum section sum",
  edges: "Connections",
  adjacency: "Neighbors by node",
  candidates: "Allowed values",
  queries: "Queries",
  m: "Rows",
  targetSum: "Target total",
  newInterval: "New interval",
  numCourses: "Course count",
  val: "Value to remove",
  pos: "Back-link position",
  args: "Operation inputs",
  operations: "Requested operations",
  text1: "First text",
  text2: "Second text",
};
const specificLabels: Record<string, Record<string, string>> = {
  "climbing-stairs": { n: "Stair count" },
  "n-queens": { n: "Board side length" },
  "generate-parentheses": { n: "Pair count" },
  combinations: { n: "Available numbers", k: "Selection size" },
  "combination-sum-iii": { n: "Target total", k: "Digit count" },
  "unique-paths": { n: "Columns" },
  "convert-1d-array-into-2d-array": { n: "Columns" },
  "counting-bits": { n: "Inclusive upper bound" },
  "task-scheduler": { n: "Cooldown" },
  "minimum-height-trees": { n: "Vertex count" },
  "graph-valid-tree": { n: "Vertex count" },
  "number-of-connected-components-in-an-undirected-graph": {
    n: "Vertex count",
  },
  "factor-combinations": { n: "Number to factor" },
  "rotate-list": { k: "Right shift" },
  "rotate-array": { k: "Right shift" },
  "all-nodes-distance-k-in-binary-tree": { k: "Edge distance" },
  "rearrange-string-k-distance-apart": { k: "Minimum equal-letter distance" },
  "subarray-product-less-than-k": { k: "Strict product threshold" },
  "longest-repeating-character-replacement": { k: "Replacement budget" },
  "maximum-average-subarray-i": { k: "Section length" },
  "sliding-window-median": { k: "Section length" },
  "sliding-window-maximum": { k: "Section length" },
  "partition-to-k-equal-sum-subsets": { k: "Group count" },
  "reverse-nodes-in-k-group": { k: "Reversal group size" },
};
const operationLabels: Record<string, string> = {
  Trie: "Create prefix index",
  WordDictionary: "Create word dictionary",
  WordFilter: "Create prefix/suffix index",
  AutocompleteSystem: "Create autocomplete",
  MedianFinder: "Create median tracker",
  FreqStack: "Create frequency stack",
  NumArray: "Create range-sum index",
  Codec: "Create text encoder",
  startsWith: "Check prefix",
  addWord: "Add word",
  f: "Find prefix/suffix match",
  input: "Type a character",
  insert: "Store a word",
  search: "Look up a word",
  addNum: "Add a number",
  push: "Add a value",
  pop: "Return the most frequent value",
  findMedian: "Read median",
  sumRange: "Sum section",
};
function describe(value: unknown): string {
  if (value === null) return "empty";
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (Array.isArray(value))
    return value.length
      ? `[${value.map(describe).join(", ")}]`
      : "empty collection";
  if (typeof value === "object")
    return Object.entries(value as Record<string, unknown>)
      .map(([name, item]) => `${labels[name] ?? name}: ${describe(item)}`)
      .join("; ");
  return String(value);
}
export function ConceptExampleInput({
  value,
  slug,
}: {
  value: Record<string, unknown>;
  slug: string;
}) {
  return (
    <dl className="concept-example-data">
      {Object.entries(value).map(([name, item]) => (
        <div key={name}>
          <dt>
            {specificLabels[slug]?.[name] ??
              labels[name] ??
              name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ")}
          </dt>
          <dd>
            {describe(
              name === "operations" && Array.isArray(item)
                ? item.map(
                    (operation) =>
                      operationLabels[String(operation)] ??
                      String(operation)
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .toLowerCase(),
                  )
                : item,
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
export function ConceptExampleOutput({ value }: { value: unknown }) {
  return <p className="concept-example-answer">{describe(value)}</p>;
}
