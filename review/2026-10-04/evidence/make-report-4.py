import json,pathlib,re
ROOT=pathlib.Path('./public/problems');slugs=json.load(open('./review/2026-10-04/evidence/group-4.json'));counts=json.load(open('./review/2026-10-04/evidence/validation-4.json'))['counts']
D={}
def add(slug,f,e,s,t,imps,validation):D[slug]=dict(formulation_review=f,explanation_review=e,solution_review=s,tests_review=t,improvements=imps,validation=[validation])
add('median-of-two-sorted-arrays',
 'Sortedness, duplicate values, empty individual arrays, nonempty combined input, and even/odd median rules are specified correctly.',
 'The swap and failed i=0 partition in the odd example match execution exactly. Cross-boundary inequalities and fixed left size justify the binary search.',
 'Correct smaller-array partition search with infinity sentinels; no input mutation. Constant working space and logarithmic search are appropriate.',
 'Six correct cases cover odd/even totals, an empty first input, skewed lengths, duplicates, and negatives.',
 ['Add nums1=[1,2], nums2=[] => 1.5 to exercise swapping into an empty search array and even infinity boundaries.', 'Add a walkthrough where a_left>b_right moves high left, complementing the existing low-right example.', 'Label i and j as counts on the left side, and low/high as bounds on nums1 cuts.'],
 'Exhaustive sorted arrays drawn from {-2,0,2}, lengths 0..3, were compared with a separately merged-and-indexed oracle.')
add('meeting-rooms',
 'Half-open intervals, touching compatibility, empty schedules, and valid endpoint bounds are clear.',
 'Neighbor-only verification is justified by chaining nonoverlap inequalities; the early nested-overlap walkthrough is accurate.',
 'Correct sorted-copy scan. The reported O(n log n) time and O(n) space include sorting and preserve input order.',
 'Six correct tests cover unsorted input, empty/singleton schedules, touching ends, and nesting.',
 ['Add equal starts such as [[4,7],[4,5]] => false to expose tie handling.', 'Add a compatible unsorted three-meeting chain, e.g. [[6,8],[0,2],[2,6]] => true.', 'Show a successful walkthrough that links the neighbor checks into a complete attendable schedule.'],
 '150 generated schedules were checked using every pair of intervals, independent of the sorted-neighbor algorithm.')
add('meeting-rooms-ii',
 'Positive lengths and endpoint reuse are explicit. The printed [start,end] notation can be made consistent with the half-open scheduling semantics.',
 'Heap contents represent active meetings, and the peak explains why the final heap size is insufficient. All example heap states are correct.',
 'Correct removal of all expired meetings before pushing the new end; peak occupancy gives minimum rooms. O(n log n) time/O(n) space are accurate.',
 'Six correct cases exercise earlier peaks, nesting, equal endpoint reuse, singleton input, and unsorted schedules.',
 ['Write intervals as [start,end) to match the reuse rule and the meeting-rooms lesson.', 'Add [[0,2],[0,3],[0,4],[10,11]] => 3 to require removing several ended meetings before one new start.', 'Give the starter a docstring naming intervals and the returned integer room count.'],
 '150 random schedules were checked by counting active half-open intervals at every possible start/event time.')
add('merge-intervals',
 'Closed endpoints, overlapping-point merge, exact union coverage, and point intervals are specified correctly; output order is enforced flexibly by the adapter.',
 'The latest-component invariant, nesting protection, and example merged prefixes match implementation.',
 'Correct sorted sweep creates fresh output rows and does not mutate input rows. Complexity includes the sorted copy.',
 'Six correct fixtures cover closed touching, nested ranges, points, unsorted transitive chains, and separated points. Custom checker validates shape/types and preserves multiplicity.',
 ['Add identical intervals and a point contained within a wider interval, e.g. [[1,4],[1,4],[2,2]] => [[1,4]].', 'State that output order is unrestricted, matching the checker.', 'Explain with a small counterexample why extending with max(end) is required for nested intervals.'],
 '150 random unions were independently reconstructed from a doubled-coordinate point lattice; malformed/duplicated/missing checker outputs were rejected.')
add('merge-k-sorted-lists',
 'Empty collection/member lists, sorted inputs, total node count, and value limits are stated. If original-node reuse is mandatory, state it explicitly in the learner contract.',
 'The one-head-per-list invariant, safe list-number tie break, and successor-before-relink sequence are correct. The listed complexity omits scanning all k heads.',
 'Correct heap merge reuses original nodes, maintains at most one active entry per list, and terminates the output tail. Runtime is O(k + N log(k+1)), not solely O(N log(k+1)).',
 'Five correct cases cover ordinary merging, empty collection/member, duplicates, and negatives. Adapter checks values/cycles through list_values but does not establish original-node reuse.',
 ['Correct the time bound to O(k + N log(k+1)); explain initialization separately from N node pops.', 'Add [[],[0],[],[-1,2]] => [-1,0,2] and one nonempty list.', 'If relinking is a required outcome, collect original identities/values and verify every returned node appears exactly once without value changes.', 'Build initial head tuples and heapify to make initialization explicitly linear in k.'],
 '160 random list collections matched a sorted flattened-value oracle. An instrumented collection of 10,000 empty lists confirmed 10,000 head examinations when N=0.')
add('merge-two-binary-trees',
 'Overlap addition and one-sided subtree retention are correct; mutation/reuse permission currently appears in pitfalls rather than the statement.',
 'The right-before-left LIFO walkthrough correctly follows stack order. Reusing an entire one-sided subtree is justified.',
 'Correct iterative pair traversal avoids recursion limits and mutates the first tree only at overlaps. O(n+m) is a valid loose upper bound; only overlapping pairs are visited.',
 'Six correct cases cover mixed shapes, empty inputs, second-only branches, and negative sums.',
 ['Move the permission to mutate/reuse input nodes into the statement so learners can choose an allocating or relinking variant knowingly.', 'Define h as the maximum depth of the overlapping region and express traversal time as O(overlapping positions+1).', 'Add opposite one-sided branches, e.g. root1=[1,2], root2=[3,null,4] => [4,2,4].'],
 '160 random trees matched an independently allocating recursive merge oracle. Two overlapping 1,000-node chains passed without recursion errors.')
add('merge-two-sorted-lists',
 'Stable nondecreasing merge, original-node relinking, empty inputs, and value bounds are clear.',
 'The dummy-head argument and suffix splice are correct. Tie decisions and final suffix in the example match the <= implementation.',
 'Correct linear merge with constant auxiliary state. Adapter enforces all original identities once and rejects cycles, but uses quadratic membership scans.',
 'Six correct fixtures cover empty inputs, interleaving, duplicate heads, negative values, and disjoint ranges; identity checks strengthen value-only assertions.',
 ['Snapshot original values alongside identities and reject value overwriting, making the relinking requirement fully inspectable.', 'Replace any(result is node for node in nodes) with an original-id set for linear adapter traversal.', 'Add an empty-second case and a case where the second list supplies an entire lower-valued prefix.'],
 '160 generated pairs matched a sorted concatenation oracle while the existing adapter also checked node identity preservation.')
add('middle-of-the-linked-list',
 'Nonempty input, second middle for even lengths, and original-node result are stated precisely.',
 'Two-pointer link counts and the six-node walkthrough are accurate; the displayed suffix is correctly distinguished from the node return value.',
 'Correct slow/fast traversal uses O(1) space. Adapter verifies exact middle identity even when values repeat.',
 'Six correct fixtures cover odd/even lengths, singleton, length two, and repeated values.',
 ['Add the maximum 100-node input as a simple boundary case with expected suffix starting at index 50.', 'Snapshot original next links if the lesson promise that no links are modified should be enforced.', 'Use a starter docstring stating that the method returns a node, while the trainer displays that node\'s suffix values.'],
 '160 short lists were independently indexed at floor(n/2); the adapter verified the exact returned input node.')
add('minimum-depth-of-binary-tree',
 'Depth counts nodes, empty depth is zero, leaves require both absent children, and level-order serialization are all explicit.',
 'BFS early exit and the missing-child distinction are explained correctly; the near-left-leaf example matches the first popped leaf.',
 'Correct iterative BFS with O(n) worst-case time and O(w) frontier storage, avoiding deep-tree recursion limits.',
 'Six correct fixtures target empty/root-only trees, one-child chains, and a shallower right leaf.',
 ['Add a 1,500-node chain to make the declared large-depth support a persistent regression test.', 'Add a broad tree whose only minimum leaf lies near the end of its level to exercise complete level ordering.', 'Define w as the maximum tree width in the displayed complexity explanation.'],
 '160 random trees matched independently enumerated leaf-path lengths. A valid 1,500-depth single-child tree returned 1,500.')
add('minimum-height-trees',
 'Connected tree, n-1 unique edges, height in edges, singleton support, and order-independent output are specified; label range can be more explicit.',
 'Degree-one layers and diameter centers justify trimming; full-layer freezing and the two-center example match source.',
 'Correct iterative degree peeling handles both odd/even center counts, including a center enqueued before its last simultaneous neighbor is removed.',
 'Five correct fixtures cover stars, one/two vertices, a path with one center, and a branched tree with two centers. Checker preserves count and rejects malformed output.',
 ['Specify labels 0..n-1 and valid edge endpoint ranges.', 'Add a six-vertex path [[0,1],[1,2],[2,3],[3,4],[4,5]] => [2,3] to require multiple full peeling layers and two surviving centers.', 'Explain why a center with degree reduced to zero within the final layer can still remain in the queued answer.'],
 '150 random parent-generated trees matched independent BFS eccentricity minimization over every possible root; checker rejected missing/duplicate/invalid outputs.')
add('minimum-number-of-arrows-to-burst-balloons',
 'Closed intervals and inclusive hitting rules are precise, including signed 32-bit extreme coordinates.',
 'Earliest-ending exchange argument is valid, and the two-shot walkthrough accurately follows end ordering.',
 'Correct greedy endpoint stabbing with strict start>arrow comparison. O(n log n) time/O(n) sort storage are accurate.',
 'Six correct fixtures cover disjoint, touching, nested, singleton, and extreme-valued balloons.',
 ['Add duplicate balloons to confirm equal endpoints share a single arrow.', 'Explain why endpoint positions suffice even though arrows may otherwise be placed at any horizontal coordinate.', 'Add a case with equal ending coordinates but different starts to show sorting ties do not affect the greedy result.'],
 '150 random instances matched exhaustive combinations of endpoint shot positions, independently minimizing the number of arrows.')
add('minimum-size-subarray-sum',
 'Positive values, at-least threshold, contiguity, and zero for impossibility are clear and support the monotone window assumption.',
 'All totals and left-boundary changes in the 7-target example are correct; the explanation justifies forward-only pointers.',
 'Correct linear sliding window with repeated shrinking and an impossible-result sentinel; no additional collection is needed.',
 'Six correct fixtures cover exact/exceeded targets, singleton best windows, impossibility, complete-array best, and repeated shrinking.',
 ['Add nums=[1], target=2 => 0 and nums=[1], target=1 => 1 as explicit minimum-length boundaries.', 'Show the specific best-length update before each removal in the walkthrough rather than omitting non-improving candidates.', 'Name the two-pointer invariant total=sum(nums[left:right+1]) in the lesson.'],
 '160 random positive arrays matched exhaustive contiguous-range sums and minimum lengths.')
add('minimum-window-substring',
 'Required multiplicity, case sensitivity, nonempty strings, missing output, and unique minimum answer are clear.',
 'Deficits, surplus counts, and missing-copy semantics match the source. The walkthrough is correct but skips several useful numeric transitions.',
 'Correct Counter deficit window; both boundaries advance only forward. Bounded alphabet gives the stated O(len(s)+len(t)) time/O(alphabet) auxiliary space.',
 'Six correct fixtures cover standard shrinking, duplicate requirements, case sensitivity, insufficiency, and absent required letters.',
 ['Expand the ADOBECODEBANC walkthrough with left values 1,6,9 and needed/missing changes so learners can inspect exactly which released copy invalidates each phase.', 'Explain that irrelevant s letters get negative Counter entries too; they remain harmless surplus while consuming and releasing.', 'Add s="bbaac", t="aac" => "aac" for a late window requiring repeated copies after discarded irrelevant prefixes.'],
 '233 generated strings/requirements with unique shortest answers were compared against brute-force substring Counter coverage; authored fixtures also passed.')
add('missing-number',
 'The exact 0..n domain, distinctness, single missing value, input length bound, and preferred resource bound are clear.',
 'XOR cancellation and n seeding are justified correctly; every arithmetic step in the [3,0,1] walkthrough matches the accumulator.',
 'Correct one-pass XOR cancellation with constant state, independent of input ordering.',
 'Six correct fixtures cover interior, final, and zero missing values plus both length-one cases.',
 ['Add a short displayed binary calculation of one accumulator update to make XOR cancellation accessible to beginners.', 'Add a 10,000-element permuted-domain boundary case outside the inspectable public examples.', 'Replace the starter\'s generic contract docstring with the exact distinct-domain assumption and integer result description.'],
 'Every missing value for lengths 1..29 was checked after an independently shuffled expected-domain permutation.')
add('move-zeroes',
 'In-place mutation, stable nonzero ordering, zero suffix, and no return value are explicit.',
 'Read/write invariant and zero-gap swap explanation are correct; all intermediate arrays match execution.',
 'Correct stable compaction by swapping, with O(n) time/O(1) space and implicit None return. Adapter inspects mutation of a copied argument.',
 'Six correct fixtures cover all/no/trailing zeros, singleton zero, mixed placement, signs, and repeated nonzeros.',
 ['Add a leading run of zeros followed by repeated nonzeros, e.g. [0,0,5,5] => [5,5,0,0].', 'If the explicit no-return contract is intended to be graded, capture the candidate result and check that it is None.', 'Describe the self-swap case write==read in a code comment so the trace does not imply a zero is always moved behind.'],
 '160 generated arrays matched independent stable nonzero filtering followed by the original number of zeros.')
add('n-queens',
 'Rows/columns/diagonals, Q/dot board format, all distinct boards, n=1..9, and any order are clear.',
 'Backtracking occupancy marks and diagonal coordinates are justified; the n=4 branch and mirrored solution match the search.',
 'Correct exhaustive conflict-free-prefix search; O(n) working state excludes exponential returned boards. Listed O(n!*n²) time is a safe bound including board construction.',
 'Five fixtures cover n=1..5, including both unsatisfiable sizes. Checker verifies geometry, shape, distinctness, and independently expected result count.',
 ['Add n=6 or n=7 to test deeper undo sequences beyond the current five-row case.', 'Present the time bound as search overhead plus O(S*n²) board construction for S solutions, then give the safe factorial upper bound.', 'Add one concrete rejected diagonal choice to the n=4 walkthrough, with its row-col or row+col key.'],
 'All valid column permutations for n=1..7 were independently enumerated; the reference/checker matched the complete solution sets. Malformed and duplicate boards were rejected.')
add('non-overlapping-intervals',
 'Removal count, positive intervals, negative coordinates, and compatible touching endpoints are correct.',
 'The exchange proof maximizes retained count, and stable tied-end ordering in the example matches sorted(key=end).',
 'Correct earliest-finish selection and complement count, with O(n log n) time/O(n) sorted-copy space.',
 'Six correct fixtures cover duplicate intervals, touching, nesting/short-chain preference, singleton negatives, and all-overlap schedules.',
 ['Add a negative-time compatible chain, e.g. [[-5,-3],[-3,-1],[-4,0]] => 1.', 'Explicitly compare this endpoint rule with merge-intervals, where touching closed intervals merge.', 'Expand the starter docstring to distinguish the returned removal count from a list of retained intervals.'],
 '150 generated schedules matched exhaustive compatible-subset maximization, independently counting the removed complement.')
add('number-of-1-bits',
 'The positive signed-31-bit domain and Hamming-weight meaning are unambiguous; zero is correctly excluded from fixtures.',
 'All binary transitions 11->10->8->0 and one-increment-per-cleared-bit reasoning are accurate.',
 'Correct lowest-set-bit clearing loop, bounded by 31 iterations. previous is intentionally trace state rather than an algorithm necessity.',
 'Seven correct fixtures cover sparse/dense values, minimum, maximum, low/high separated bits, and a power of two.',
 ['Explain previous as the pre-clearing value used by the visualization, so its otherwise unused assignment has a visible purpose.', 'Use a side-by-side before/after binary display to show exactly which least-significant set bit disappeared.', 'Add a second high single-bit case such as 1<<30 => 1 to exercise the upper sparse boundary.'],
 '150 randomly chosen valid integers matched independently counted one characters in their binary representations.')
add('number-of-connected-components-in-an-undirected-graph',
 'Vertex labels, isolated vertices, undirected edges, no duplicate/self edges, and size limits are clear; public premium statement is linked.',
 'Traversal starts correspond exactly to components, and discovery marking correctly avoids cyclic duplicate work.',
 'Correct iterative DFS over every vertex and both edge directions, with O(n+e) time/storage.',
 'Six correct fixtures cover disconnected/connected graphs, all isolated, singleton, cyclic input, and several pairs.',
 ['Add an edge specified in reversed orientation, e.g. n=3, edges=[[2,0]] => 2, to make the undirected requirement visible.', 'Add a disconnected group with a cycle plus a chain plus an isolated vertex.', 'Include a maximum-length chain to guard the explicit iterative-depth benefit.'],
 '150 random simple undirected graphs matched an independent edge-scan BFS component oracle.')
add('number-of-islands',
 'Character cell types, rectangular nonempty bounds, four-direction connectivity, and diagonal separation are precise; mutation permission is implicit in the lesson approach.',
 'The flood components in the three-island walkthrough are correct, including diagonal separation and discovery-time marking.',
 'Correct iterative BFS marks each original land cell once. O(RC) time and O(RC) worst-case queue-space upper bound are safe.',
 'Six correct fixtures cover mixed components, all-land/water singletons, diagonal separation, and a single row.',
 ['State directly that the reference mutates grid cells to record visitation and mention a visited-set variant for callers retaining the grid.', 'Add a single-column test and a land ring enclosing water to exercise shapes unlike the existing row/solid examples.', 'Add a long snake island near the grid size bound to preserve the iterative traversal guarantee.'],
 '140 random grids matched independently extracted connected components using the original land-coordinate set.')
add('number-of-longest-increasing-subsequence',
 'Index-distinct subsequences, strict increase, skipped positions, value/length bounds, and answer bound are clear.',
 'Length replacement versus tied-count addition is correct, and all predecessor contributions in the two-LIS example are sound.',
 'Correct endpoint length/count DP with O(n²) time/O(n) space; final aggregation counts every longest endpoint.',
 'Six correct cases cover duplicates, monotone descending values, singleton, multiple optimal choices, and several endpoints.',
 ['Add [1,2,1,2] => 3, which has optimal paths ending at more than one value-2 position and tests final count aggregation explicitly.', 'Show full length and ways arrays after each endpoint in the worked example.', 'Add a case where a late improved length must replace a previously accumulated shorter count.'],
 '160 short arrays were checked by enumerating every nonempty index subset and counting only globally longest strictly increasing sequences.')
add('odd-even-linked-list',
 'Position parity, one-based positions, stable groups, original-node reuse, empty input, and value range are clear.',
 'Two parallel tail links and final concatenation are explained accurately; odd-length example source order is matched.',
 'Correct O(n)/O(1) relinking. Strong adapter enforces exact original-node order, immutable values, no extras, and no cycles.',
 'Five correct fixtures cover odd lists, empty/singleton input, and an even list with all-even values to distinguish position from value parity.',
 ['Add a two-node case to inspect the loop-skipped concatenation boundary.', 'Add duplicate values with an even length, e.g. [5,5,5,5,5,5], to keep the identity-based grouping assertion visible.', 'Show the final even tail becoming None in an even-length walkthrough, alongside the existing odd-length example.'],
 '160 random arrays matched index-based odd/even regrouping while the adapter also enforced exact original-node identity and unchanged values.')
add('pacific-atlantic-water-flow',
 'Ocean borders, orthogonal downhill/equal movement, and height/dimension bounds are correct; allowed output order should be explicit.',
 'Reverse-edge reachability and equal-height expansion are correct. The walkthrough acknowledges unordered seed processing. The stated linear total time omits sorted output.',
 'Both iterative reverse traversals are correct; line 19 sorts K resulting coordinates, making total time O(RC + K log K), worst-case O(RC log(RC)).',
 'Six correct fixtures cover singleton, plateau, row/column boundaries, and direction-sensitive slopes. Custom checker accepts any ordering and rejects duplicates.',
 ['Remove sorted from the return expression to preserve the taught O(RC) algorithm, then update the exact code-note snippet.', 'Alternatively keep deterministic sorting and report O(RC + K log K), K=number of returned coordinates.', 'State any-order output and add meaningful labels for heights, Pacific reachability, Atlantic reachability, and traversal coordinates.', 'Add a basin surrounded by high cells to distinguish cells reaching neither ocean from the intersection.'],
 '140 random grids matched independent downhill exploration from every cell. Sorting the same 40,000-coordinate set order as a flat 200x200 grid required 559,285 tuple comparisons; custom checker does not require sorting.')
add('palindrome-linked-list',
 'Nonempty decimal-valued lists and palindrome boolean are clear. Restoration is a reference property, not explicitly a learner requirement in the statement.',
 'Midpoint parity, reverse-before-compare, mismatch exit, and suffix restoration are correctly explained; even example matches execution.',
 'Correct O(n)/O(1) implementation restores next links after both successful comparison and early mismatch, with no recursion depth risk.',
 'Six correct fixtures cover odd/even, singleton, equal zeros, and mirrored/inner mismatch. Adapter checks only the boolean, so restoration is not graded.',
 ['Decide whether input restoration is part of the learner contract; if so, state it and snapshot next links in the adapter.', 'Add an even palindrome whose mismatch occurs at the second compared pair, e.g. [1,2,3,1] => false.', 'Add a 100,000-node direct boundary probe without serializing a returned list, since only a boolean is required.'],
 '160 generated lists matched reversed-value comparison. Direct identity/link snapshots confirmed restoration for even/odd matches and mismatches.')
add('palindrome-partitioning',
 'All partitions must be nonempty contiguous pieces covering the full lowercase string, and order is unrestricted.',
 'Palindrome table length order, substring base cases, DFS cuts, and aab recursion/undo example are all correct.',
 'Correct O(n²) preprocessing followed by exhaustive cut enumeration; the stated output-inclusive O(n²+n*2^n) time and O(n²) working-space upper bound are appropriate.',
 'Six correct cases cover singleton, repeated strings, odd/even whole palindromes, and no longer palindromes. Checker handles ordering while preserving multiplicity.',
 ['Add length-16 all-identical input as an output-count/performance probe: 2^15 partitions, independently determined by cut masks.', 'Explain that each complete path must be copied because backtracking mutates the shared path list afterward.', 'Add a longer mixed string such as aabb to show multiple independent palindromic cut choices.'],
 'Every nonempty binary string through length seven matched independent cut-mask partition enumeration; malformed/missing/duplicate checker outputs were rejected.')
add('palindromic-substrings',
 'Contiguity, positional multiplicity, lowercase input, and n=1..1000 are correct.',
 'Unique center/radius counting and failed-expansion reasoning are sound. The abc walkthrough is correct but illustrates no successful multi-character expansion.',
 'Correct odd/even center expansion with O(n²) worst-case time and O(1) space; center index parity is mapped correctly.',
 'Six correct fixtures cover singleton, repeated strings, nested even palindromes, and overlapping odd palindromes.',
 ['Use aaa or abba for the main walkthrough so both expanding radii and even centers are visible.', 'Clarify that even center indices denote odd-length centers and odd center indices denote even-length gaps.', 'Add s="a"*1000 => 500500 as a maximum-size count probe.', 'Add descriptive labels to the currently empty visualization labels map.'],
 'Every nonempty binary string through length seven matched exhaustive substring reversal tests.')
add('partition-equal-subset-sum',
 'Every occurrence assigned once, positive values, and size/value bounds are stated. Equal halves reduce correctly to a 0/1 subset problem.',
 'The descending-state-update proof prevents same-occurrence reuse; all reachable-set examples and duplicate handling are correct.',
 'Correct boolean target-sum DP with O(n*T) time/O(T) storage; odd totals return before allocation.',
 'Six correct fixtures include parity rejection, impossible even totals, duplicates, singleton, and a forward-update reuse trap.',
 ['Add a large value exceeding half the even total, e.g. [10,1,1] => false, to exercise an empty descending loop.', 'Optionally return early once reachable[target] becomes true; later positive elements cannot invalidate an already chosen subset.', 'Explain why zeros/negative values are excluded and why only subtotals <=target are stored.'],
 '160 random positive arrays matched exhaustive subset-sum enumeration.')
add('partition-to-k-equal-sum-subsets',
 'Exactly k nonempty equal groups, positivity, per-value multiplicity bound, small n, and unordered groups are clear.',
 'Used-mask remainder compression is justified by the fixed used sum. The example shows a valid transition path rather than the entire increasing-mask execution order.',
 'Correct O(n*2^n) bitmask DP; target cannot be zero under constraints, reachable masks move to strictly larger indices, and each occurrence has its own bit.',
 'Eight correct fixtures cover divisibility, divisible impossibility, singleton/equal groups, k=1, oversized values, and duplicate occurrences.',
 ['Label the walkthrough as a valid path through the DP state graph and show when masks 0001,1001,1111 are visited by the increasing-mask loop.', 'Explain why next_mask>mask makes one forward table pass sufficient.', 'Move the official four-group and indivisible examples into the first two public-fixture positions; retain the complementary-groups walkthrough test later.', 'Add readable mask/remainder labels to the currently empty labels map.'],
 '196 valid generated instances matched an independent symmetry-pruned bucket-assignment oracle, respecting the four-occurrences-per-value constraint.')
add('path-sum',
 'Only complete root-to-leaf paths qualify; empty input, negative values, and target/value bounds are correct.',
 'Running-total invariant, child push order, and both leaf sums in the successful left path are accurate. Negative continuation correctly forbids excess-sum pruning.',
 'Correct iterative DFS gives O(n) time/O(h) pending-stack space and no recursion dependence.',
 'Six correct fixtures cover empty zero, root-only match, internal-prefix rejection, absent answer, and negative continuation.',
 ['Add a case whose first explored branch fails but a later right leaf matches, to verify sibling totals remain independent.', 'Persist a 1,500-node zero-valued chain targeting zero as a deep-tree regression.', 'Clarify the optional-root type in the signature/docstring because empty trees are valid.'],
 '160 random trees matched independently enumerated root-to-leaf sums. A 1,500-depth zero chain returned true without recursion errors.')
add('path-sum-ii',
 'Complete root-to-leaf value paths, empty input, negative values, and target bounds are clear; output order/multiplicity can be made explicit in the statement.',
 'Immutable copied-prefix ownership and running totals are correct. The example accurately follows left-first DFS and retains both qualifying routes.',
 'Correct iterative traversal preserves duplicate-valued routes. The stated O(n*h) time/storage bounds are safe but space is loose and path copies can make a single chain quadratic.',
 'Six correct fixtures cover typical multiple paths, no matches, empty/root-only, internal-prefix rejection, and negatives. Checker preserves duplicate multiplicity, but no authored fixture exercises identical value paths.',
 ['Add root=[1,2,2], targetSum=3 => [[1,2],[1,2]] to prevent deduplicating distinct routes.', 'State that returned route order is unrestricted and identical value paths must appear once for each distinct leaf route.', 'Use iterative enter/exit events with one shared path, copying only matching leaf outputs, to improve traversal time to O(n+total returned path length).', 'Separate auxiliary pending-path space O(h²) from returned-output storage rather than reporting only the loose O(n*h) aggregate.'],
 '160 random trees matched independent leaf-path enumeration. A 1,500-depth zero chain and duplicate-valued sibling paths both returned correctly.')
findings={
'merge-k-sorted-lists':[{'severity':'P2','title':'Include the scan of k input heads in the runtime bound','file':str(ROOT/'merge-k-sorted-lists/lesson.json'),'line_start':24,'line_end':26,'detail':'N is total node count, while k also includes empty lists. The solution always enumerates every list head (solution.py:6), so initialization is Theta(k) even when N is zero or very small. O(N log(k+1)) alone does not describe valid all-empty or sparse collections.','evidence':'A CountHeads iterable containing 10,000 empty members recorded 10,000 head examinations while returning None for N=0. See ./review/2026-10-04/evidence/probe-4.py and probes-4.json.','recommendation':'State O(k + N log(k+1)) time, identifying the input scan and heap operations separately. Optionally initialize with heapify for linear initial heap building.'}],
'pacific-atlantic-water-flow':[{'severity':'P2','title':'Sorted output adds a logarithmic factor to the taught linear traversal','file':str(ROOT/'pacific-atlantic-water-flow/solution.py'),'line_start':19,'line_end':19,'detail':'The two traversals are linear, but the final return sorts the entire reachability intersection. If K cells reach both oceans, total time is O(RC + K log K). A flat grid has K=RC, so lesson.json:23 understates the worst-case runtime as O(RC).','evidence':'All 40,000 cells of a valid flat 200x200 grid reach both oceans. Instrumenting lexicographic sorting over the same set iteration order counted 559,285 tuple comparisons. The adapter accepts arbitrary coordinate ordering. See ./review/2026-10-04/evidence/probe-4.py and probes-4.json.','recommendation':'Return [list(cell) for cell in pacific & atlantic] without sorting to preserve O(RC), and update the exact explanation code snippet. Alternatively retain sorting and report O(RC + K log K) explicitly.'}]
}
reports=[]
for slug in slugs:
 p=ROOT/slug;e=json.load(open(p/'explanation.json'));code=(p/'solution.py').read_text();tests=json.load(open(p/'tests.json'))
 assert all(note['code'] in code for note in e['codeNotes'])
 assert len(e['intuition'])>=2 and len(e['walkthrough']['steps'])>=4
 assert any(t['input']==e['walkthrough']['input'] and t['expected']==e['walkthrough']['result'] for t in tests)
 prose=e['intuition']+e['walkthrough']['steps']+[note['note'] for note in e['codeNotes']];assert sum(len(re.findall(r'\S+',s)) for s in prose)>=180
 r={'slug':slug,'verdict':'issue' if slug in findings else 'no-confirmed-defect',**D[slug],'findings':findings.get(slug,[])}
 r['validation'].append(f"All {len(tests)} authored fixtures passed; {counts[slug]} total authored/independent oracle cases passed. All six files, Python syntax, exact explanation snippets, walkthrough fixture agreement, constraints, and visualization variable declarations were reviewed.")
 reports.append(r)
path=pathlib.Path('./review/2026-10-04/evidence/audit-4.json');path.write_text(json.dumps(reports,indent=2,ensure_ascii=False));print(json.dumps({'file':str(path),'problems':len(reports),'confirmed_findings':sum(len(r['findings']) for r in reports),'total_checks':sum(counts.values())}))
