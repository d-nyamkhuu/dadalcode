import json,pathlib
R=pathlib.Path('.'); results=json.load(open('./review/2026-10-04/evidence/probes-1-results.json')); slugs=json.load(open('./review/2026-10-04/evidence/group-1.json'))
D={
'3sum':(
'Clearly distinguishes value-triplet uniqueness from three distinct input positions; valid constraints and unrestricted result order.',
'Two-pointer elimination and duplicate skipping are correct. Walkthrough has a small arithmetic wording error: the largest pair is 1+2=3, while its triple with anchor -4 totals -1.',
'Sorted copy, distinct anchors, monotone pointer movements, and both duplicate skips are correct. O(n²) time and O(n) auxiliary plus output match Python implementation. Starter matches signature; checker validates integer triples and preserves multiplicity.',
'Five valid cases cover canonical mixed values, no match, zero duplicates, two matches, and positive-only early stop.',
['Correct the walkthrough to say "even -4+1+2=-1", and state that pointer values sum to zero together with the anchor.', 'Add [-2,-2,0,0,2,2] -> [[-2,0,2]] to exercise duplicate skipping on both ends; add [-5,-4,-3] -> [] for negative-only exhaustion.']),
'3sum-closest':(
'Precisely states distinct positions, return sum, and uniqueness of closest sum; constraints fit the initialized three-value candidate.',
'The distinction between eliminating dominated candidates and guaranteeing an improving next candidate is particularly useful; arithmetic and pointer sequence are correct.',
'best starts from an actual triple; every candidate is compared before moving and exact matches return safely. O(n²) time/O(n) auxiliary are accurate; starter and direct adapter align.',
'Five valid cases include negatives, duplicate zeros, minimum length, exact match, and target far outside feasible sums. Uniqueness assumptions hold.',
['Add a repeated-value exact-sum case such as [-1,-1,-1,2,2], target 0 -> 0, plus an upper value-bound case [-1000,1000,1000], target 10000 -> 1000.', 'State explicitly that sorted(nums) leaves the input untouched and mention unique sum does not require a unique index triple.']),
'add-two-numbers':(
'Correctly defines reversed decimal digits, nonempty lists, nonnegative values, and no leading zeros; trainer arrays map naturally to linked lists.',
'Column invariant and walkthrough 342+465=807 are accurate; divmod order and final carry are explained. "tail always points to the final real digit" needs an initial-state qualification because tail initially is dummy.',
'Handles unequal lengths, chained carries, zero, and final extra digit with bounded per-column arithmetic. O(max(m,n)) time, O(1) auxiliary excluding output; matching starter and list serializer.',
'Six valid cases cover zero, final carry, unequal lengths, long carry chain, and internal zero. Adapter checks structure through cycle-aware list serialization.',
['Add the mirror unequal-length case l1=[5], l2=[1,2,3] -> [6,2,3]; current unequal-length fixtures all make l1 longer.', 'Add a generated 100-digit carry chain for the upper bound, and qualify the tail invariant as applying after the first append.']),
'alien-dictionary':(
'Formulates observed alphabet, arbitrary valid output, invalid prefix, and inconsistency correctly; premium problem includes public statement link.',
'First mismatch, isolated letters, edge deduplication, cycle rejection, and chain walkthrough agree with Kahn traversal.',
'Deduplicated graph and indegrees are correct; sorted neighbor iteration is harmless with fixed 26-letter alphabet. O(C+V+E) time and O(V+E) space apply. Custom checker tests all adjacent comparisons and full alphabet uniqueness.',
'Seven valid cases include cycle, invalid prefix, isolated alphabet, repeated edge evidence, and identical words. Alternative valid orders are accepted.',
['Add ["ab","ac"] to ensure letters after the first mismatch do not create extra ordering constraints, and ["ab","abc"] as a valid prefix pair.', 'Describe sorted(graph[char]) as reproducible traversal order, with the fixed 26-letter alphabet bounding its extra work; add an adapter probe for missing or duplicate characters.']),
'all-nodes-distance-k-in-binary-tree':(
'Explicitly defines shortest edge distance, k=0, unique node values, existing target, and trainer target-by-value encoding.',
'Parent-map conversion and seen-on-enqueue accurately explain why subtree-only traversal fails; frontier arithmetic and traversal order match implementation.',
'Iterative parent collection plus BFS safely visits each node at most once and stops expansion at k. O(n) time/space are accurate; adapter resolves target object identity and order-insensitive checker preserves duplicates.',
'Six valid cases cover parent/descendant movement, no result, k=0, root frontier, upward chain, and k=1000.',
['Add a target leaf with a cousin across an ancestor, for example root=[0,1,2,3,4,5,6], target=3, k=4 -> [5,6].', 'Give the starter docstring the target-node identity requirement and explain why the adapter uses the actual node rather than constructing another node with the same value.']),
'average-of-levels-in-binary-tree':(
'Correct mean per depth and 1e-5 absolute acceptance rule; nonempty tree and signed 32-bit values are clearly stated.',
'Frozen queue-size denominator and avoidance of mean-of-means are accurate. All three worked averages are correct.',
'BFS integer sum before division is correct and handles negative and large values; O(n) time/O(w) auxiliary/O(h) output. Adapter rejects nonnumeric/nonfinite values and honors stated tolerance.',
'Six valid cases cover fractional, sparse, singleton, negative, chain, and maximal repeated values. Largest population imbalance is absent.',
['Add root=[0,1,3,2,null,4,9], yielding [0,2,5], to catch averaging child-group means instead of weighting each node.', 'Add a validator-boundary test around +/-1e-5 and retain the explicit absolute tolerance in the statement.']),
'backspace-string-compare':(
'Precisely states erasure of last surviving letter and empty-editor backspace behavior; input bounds match reverse scanning.',
'Reverse skip budget, exhaustion, and chained deletions are correct; walkthrough follows helper execution.',
'Monotone reverse indices and local skip counters are correct, O(len(s)+len(t)) time/O(1) space. After scanning past start, exhausted indices are exactly -1; starter/adapter signatures match.',
'Six valid cases cover equal survivors, total erasure, mismatch, excess leading backspaces, one-sided exhaustion, and chained deletion.',
['Add s="a#", t="####" -> true for both exhausted with unequal backspace counts; add s="abc", t="ab" -> false for unequal surviving lengths without backspaces.', 'Add a short comment at skip increment/decrement explaining budget accumulation and consumption, since these are the method’s key decisions.']),
'best-time-to-buy-and-sell-stock':(
'Correct at-most-one transaction, strictly later sale, and zero-profit fallback; singleton and zero prices allowed.',
'Running minimum invariant and order of selling then updating cheapest are precise; walkthrough returns profit 5 correctly.',
'One forward scan with earlier cheapest price returns the maximum legal profit; O(n) time/O(1) auxiliary. Starter and direct adapter match.',
'Six valid cases cover falling/flat markets, singleton, later cheaper purchase, zero prices, and typical profitable sequence.',
['Add [1,3,2,5] -> 4 to explicitly distinguish one transaction from accumulating both profitable swings (which would produce 5).', 'Add [10000,0,10000] -> 10000 for value bounds, and put a helpful contract-specific docstring in the starter.']),
'best-time-to-buy-and-sell-stock-with-cooldown':(
'Correct unlimited transaction model with one share and a full day after sale without purchase.',
'hold/sold/rest semantics, impossible states, and old-state dependencies are correct. Example’s hold=1 comes from the sale at price 2 after resting at price 3.',
'All next states read yesterday’s states and final answer excludes unrealized holding. O(n)/O(1) are accurate; direct adapter and starter match.',
'Six valid cases cover cooldown trap, singleton, falling prices, two days, waiting before another buy, and zero prices.',
['Add [1,4,0,5] -> 5, which forces the algorithm to skip an earlier profitable sale to avoid blocking a better later purchase.', 'Expand the walkthrough into a small day/hold/sold/rest table so the profit 1 funding the price-0 buy is visibly traced to the earlier sale.']),
'binary-search':(
'Clearly requires ascending distinct integers, index output, -1 absence, and logarithmic time; input bounds are sufficient.',
'Inclusive interval invariant and exclusion of failed mid guarantee progress; worked indices 2 then 4 are correct.',
'Correct O(log n) time/O(1) auxiliary and inclusive termination. Minimal starter and direct adapter agree.',
'Six valid cases cover found/absent interior, singleton hit/miss, and both endpoints; no absent-above-upper-bound case.',
['Add nums=[1,2,3], target=4 -> -1 and a two-element target-at-second-position case to catch boundary updates.', 'Explain midpoint overflow only as a language-dependent consideration if expanding the lesson; Python integer midpoint is already safe.']),
'binary-tree-level-order-traversal':(
'Complete contract for root-to-deepest depth groups, within-level left-to-right order, empty tree, and null-gap trainer representation.',
'Frozen frontier and left-before-right queue reasoning are correct; worked groups match execution.',
'Deque BFS is correct with O(n) time, O(w) auxiliary and O(n) output; queue may span adjacent levels as lesson explicitly acknowledges. Starter/adapter match.',
'Six valid cases cover branching, singleton, empty, right chain, sparse level, and repeated values.',
['Add a four-level sparse tree whose last level has children under different parents to reinforce parent order and frozen size.', 'Use a 2000-node generated chain and a wide generated tree as scalability checks outside the inspectable fixtures.']),
'binary-tree-level-order-traversal-ii':(
'Correct bottom-up depth grouping while keeping left-to-right values; allows empty trees in constraints.',
'Explicit outer-only reversal and queue-level separation are accurate; example values and order are correct.',
'Linear BFS plus shallow outer reversal is correct; O(n) total storage includes output. Starter and serialization adapter match.',
'Five valid cases cover branching, singleton, empty, left chain, and a full level with four distinct values.',
['Add sparse root=[1,2,3,null,4,5,null] -> [[4,5],[2,3],[1]] to ensure omitted children do not scramble order.', 'Refine space to O(w) auxiliary plus O(n) output and note the shallow reverse creates an additional O(h) list of row references.']),
'binary-tree-maximum-path-sum':(
'Nonempty simple path may start/end anywhere and omit root; constraints require tall-tree robustness up to 30000 nodes.',
'Highest-node path decomposition and one-branch parent gain are exact; 42-versus-34 walkthrough is correct.',
'Explicit postorder handles skewed trees without recursion limits, clamps child gains but never node itself, and supports all-negative trees. O(n) time/space accurate; starter and adapter align.',
'Six valid cases include root path, root-avoiding path, singleton negative, all-negative, discarded negative branch, and best child path.',
['Add zero-valued root=[0,-1,-2] -> 0 to reinforce nonempty-path handling despite zero baseline.', 'Retain a generated 30000-node chain as a regression for the stated reason to use an explicit stack; the upper-bound probe passed.']),
'binary-tree-paths':(
'Precisely requires root-to-leaf strings, -> separator, true leaf definition, and unrestricted order; repeated values are valid.',
'Backtracking invariant, immutable string capture, and repeated-path multiplicity are accurate; example path restoration is correct.',
'Shared list DFS is safe within the 100-node bound; O(n+L) time and O(h) auxiliary plus output match string generation. Adapter preserves duplicate strings and accepts arbitrary order.',
'Six valid cases cover singleton, both one-child directions, negative values, branching, and duplicate value paths.',
['Add a deeper fork root=[1,2,3,4,5,6,7] to catch stale path values across multiple siblings.', 'Clarify in starter documentation that equal path strings from distinct leaves must both be returned; avoid set-based output.']),
'binary-tree-right-side-view':(
'Correctly describes visibility by depth and explicit deep-left-subtree visibility; empty input allowed.',
'Last node of normal BFS level matches visibility; deep-left example correctly returns [1,3,4,5].',
'Deque BFS freezes level size and records last entry, O(n) time/O(w+h) including result. Starter and adapter match.',
'Five valid cases cover sparse rightmost nodes, right chain, empty, deeper left branch, and full tree.',
['Add a singleton and repeated node values so visual identity is not confused with value uniqueness.', 'Describe queue storage as O(w) even though its intermediate contents can span adjacent levels, then distinguish the O(h) output.']),
'binary-tree-zigzag-level-order-traversal':(
'Correct depth-group membership and alternating first-left/next-right directions; null input supported via node-count constraint.',
'Correct separation of traversal order from output direction and precise range(len(queue)) freezing explanation.',
'Normal BFS and alternating level.reverse() produce correct O(n) time, O(w) auxiliary plus O(n) output. Starter and adapter match.',
'Six valid cases cover ordinary branching, singleton, empty, full tree, chain, and sparse ordering.',
['Add four full levels with at least two values at the fourth depth to prove direction toggles beyond the initial reversal.', 'State the trainer’s null-gap tree representation explicitly in the formulation and split space into auxiliary versus output.']),
'climbing-stairs':(
'Clearly counts ordered sequences ending exactly at n from stair 0; 1<=n<=45 protects dp[1].',
'Disjoint final-step partition and empty-prefix seed are correct; walkthrough table and eight routes to n=5 match recurrence.',
'Full DP table correctly favors inspectability over O(1) rolling storage. O(n) time/space stated accurately; adapter and starter match.',
'Six valid cases include both examples, minimal n, medium n, and exact maximal integer 1836311903.',
['Add n=4 -> 5 as an inspectable bridge between worked recurrence steps; provide rolling-state optimization as an optional follow-up.', 'Preserve exact integer grading at the maximum n: a close but unequal float must not pass via a shared relative tolerance.']),
'clone-graph':(
'Explicitly requires new identities, preserved values and edges, null for empty, connected simple undirected graph, and 1-indexed trainer adjacency.',
'Memo-before-traversal explanation correctly preserves cycles and shared identity; four-node-cycle walkthrough matches BFS.',
'BFS clone mapping is correct, O(V+E) time/O(V) auxiliary plus output. Adapter checks new identities, uniqueness, node reachability, matching values, adjacency, entry, and original mutation.',
'Six valid cases cover cycles, singleton, empty, one edge, triangle, and star; serialization preserves edges and rejects original reuse.',
['Add a longer path or diamond to complement short cycles and exercise repeated shared-neighbor discovery with unequal degrees.', 'Add adapter mutation probes for returning original input, creating two clones of a shared vertex, or changing original adjacency; current checker already rejects these.']),
'coin-change':(
'Correct minimum-count objective, arbitrary reuse, impossibility sentinel, positive denominations, and amount zero; distinctness is an explicit local restriction.',
'Final-coin partition and greedy counterexample [1,3,4], amount 6 are correct; costs in DP walkthrough are accurate.',
'Ascending amounts and min across final coins return optimum; amount+1 safely represents unreachable states. O(amount*coins)/O(amount) accurate; starter and direct adapter match.',
'Six valid cases cover canonical optimum, impossible parity, zero amount, greedy trap, exact coin, and too-large denominations.',
['Add unsorted denominations [4,1,3], amount=6 -> 2 to prevent learners accidentally relying on supplied order.', 'Add coins=[2147483647,1], amount=2 -> 2 and a generated amount=10000 case to cover upper limits without huge readable fixtures.']),
'combination-sum':(
'Clearly states unique value combinations, unlimited reuse, distinct positive candidates, and order independence; bounds keep recursion depth <=20.',
'Nondecreasing recursion and same-index reuse are correct; worked [2,2,3] and [7] example follows search.',
'Sorted copy, over-budget break, and path copying are correct. Stated exponential upper bound is conservative and auxiliary O(n+d) accurate. Custom checker validates ints and multiplicity.',
'Six valid cases cover reuse, multiple combinations, no match, exact singleton, unsorted input, and repeated usage.',
['Add candidates=[2,4], target=8 -> [[2,2,2,2],[2,2,4],[4,4]] to combine reuse, uniqueness, and different depths.', 'Give the complexity variables n and d explicit definitions beside the formula, and optionally introduce an output-sensitive search-node bound.']),
'combination-sum-ii':(
'Correct distinction between repeated values and one use per input index; order and uniqueness requirements are clear.',
'Equal siblings versus legal deeper duplicates is well explained, and four worked combinations are arithmetically correct.',
'Start advances by one, skips duplicates per depth, and copies result paths. Exponential time bound/O(n) auxiliary are conservative and correct; checker guards integer rows and output multiplicity.',
'Six valid cases cover duplicated candidates, impossible total, singleton, multiple equal copies, and no index reuse.',
['Add candidates=[1,1,2,2], target=4 -> [[1,1,2],[2,2]] to exercise multiplicity across several duplicated values.', 'Add an optional tighter target-depth discussion because positive values and target<=30 cap recursion depth independently of n.']),
'combination-sum-iii':(
'Correct exactly-k distinct digits 1..9 and n total; input ranges agree with digit universe.',
'Exact length plus sum leaf and remaining-slot pruning are accurate; [1,2,3] rejection and [1,2,4] acceptance are correct.',
'Increasing digits and upper loop bound reserve enough remaining values. All 480 valid (k,n) pairs passed independent enumeration. O(k*C(9,k)) upper bound/O(k) auxiliary correct.',
'Six valid cases cover unique triple, multiple triples, too-small sum, all digits, largest pair, and impossible large total.',
['Add k=3,n=6 -> [[1,2,3]] and k=9,n=44 -> [] for exact minimum and near-all-digit impossibility.', 'Show optional minimum/maximum feasible suffix-sum pruning as a follow-up, explaining it improves search without changing correctness.']),
'combination-sum-iv':(
'Explicitly counts ordered sequences, reusable distinct positive values, and signed-32-bit final answer; avoids title ambiguity.',
'Final-value partition and totals-before-values loop order are correct; dp=[1,1,2,4,7] arithmetic is accurate.',
'Ascending total DP correctly counts order with O(target*len(nums)) arithmetic operations and O(target) entries; starter/adapter match.',
'Six valid cases cover order differences, impossible targets, one reusable value, two permutations, and gaps.',
['Add nums=[4],target=4 -> 1 for the single-element base transition and nums=[1,2],target=45 -> 1836311903 for exact integer handling.', 'Mention that only the final count is promised to fit 32 bits; Python handles intermediate counts automatically, including unreachable target residues with large reachable counts.']),
'combinations':(
'Complete set-enumeration contract, distinct range values, order independence, and 1<=k<=n.',
'Canonical increasing representation and n-needed+1 feasibility bound are correct; all six n=4,k=2 pairs enumerated correctly.',
'Backtracking reserves enough suffix values, copies results, and avoids duplication. O(k*C(n,k)) time/O(k) auxiliary correct; custom checker protects multiplicity and integer types.',
'Five valid cases cover singleton universe, one selection, k=n, k=1, and intermediate k.',
['Add n=5,k=3 to exercise a deeper branching recursion tree beyond k=2 and the single-chain k=n case.', 'Explain output itself can be large at n=20,k=10 and distinguish unavoidable result construction from auxiliary path memory.']),
'concatenated-words':(
'Correct at least-two shorter nonempty dictionary pieces, unique words, repeated component use, and lowercase bounds.',
'Reachable boundary semantics and exclusion of only the whole-word transition correctly enforce the minimum number of pieces; animal decompositions are valid.',
'Full dictionary DP is order-independent, permits concatenated components, and excludes self-only acceptance. Python substring copying supports O(sum L³) time; space bound is conservative. Checker preserves answer multiplicity.',
'Six valid cases cover canonical dictionary, self-only rejection, repeated components, unsplittable suffix, and input-order independence.',
['Add words=["ab","aba","bab","ababa"] -> ["ababa"] to ensure search considers more than one segmentation boundary rather than greedy matching.', 'Shorten the long headline and replace the complexity explanation’s repetition of the formula with why substring creation and hashing each cost O(segment length).']),
'construct-binary-tree-from-preorder-and-inorder-traversal':(
'Valid same-tree traversals and unique values make reconstruction unambiguous; 3000-node bound motivates iteration.',
'Preorder introduction versus inorder completion correctly explains left attachment and popping to the last completed root; example matches actual shape.',
'Iterative stack algorithm is correct with O(n) time/O(h) auxiliary plus nodes. Pre-index loop avoids slicing traversal arrays. Starter and cycle-aware tree serializer align.',
'Six valid cases cover singleton, branching, both chain directions, right-left attachment, and full tree.',
['Add an alternating zigzag chain to exercise repeated switches between left attachment and ancestor popping.', 'Explain the while-loop index cannot exhaust inorder while another preorder node remains under the valid-traversal promise; retain generated length-3000 chain regression.']),
'container-with-most-water':(
'Correct width-times-shorter-height objective, non-tilted walls, and at least two positions; constraints include zero heights.',
'Shorter-wall domination proof is sound; areas 8,49,18,40 in the example are correct. Final walkthrough compression could show the remaining actual steps.',
'Correct linear two-pointer elimination with tie handled by moving left; O(n) time/O(1) auxiliary. Starter/adapter match.',
'Six valid cases cover minimal input, zeros, increasing heights, tall interior pair, ties, and canonical maximum.',
['Add decreasing heights [4,3,2,1] -> 4 to exercise repeated right-pointer movement, and [10000,0,10000] -> 20000 for boundary values.', 'Expand the final walkthrough with remaining areas 16,15,4,6 to avoid suggesting merely narrowing always decreases the area.']),
'contains-duplicate':(
'Precisely asks whether any integer repeats, including negative/zero values; nonempty and numerical bounds are complete.',
'Check-before-insert membership invariant and return-false completion proof are correct; example identifies a nonadjacent duplicate.',
'Hash-set scan correct with O(n) expected time/O(n) space; starter and direct adapter match.',
'Six valid cases include singleton, repeated zero, negative duplicate, unsorted distinct values, and typical positives.',
['Add [1000000000,-1000000000,1000000000] -> true for both numerical endpoints and a late duplicate after a longer distinct prefix.', 'Add a comment explaining seen.add remembers first occurrences and clarify that "expected" qualifies hash-table time rather than correctness.']),
'convert-1d-array-into-2d-array':(
'Clearly defines m rows/n columns, row-major preservation, and [] when total cells mismatch; dimensions are positive.',
'Consecutive disjoint slices and independent rows are correctly explained; square example gives the right offsets.',
'Length check before allocation and row slices are correct. O(mn) valid/O(1) invalid time and O(1) auxiliary excluding output are accurate. Starter/direct adapter align.',
'Six valid cases cover square, row, column, both mismatch directions, and non-square ordering.',
['Add original=[7],m=1,n=1 -> [[7]] plus repeated original values to reinforce grouping rather than deduplication.', 'If independent mutable rows are part of the teaching goal, add an identity/aliasing probe before JSON encoding; equal-valued JSON rows alone cannot detect shared references.']),
'count-of-range-sum':(
'Correct nonempty contiguous sums and inclusive bounds; signed-32-bit values need wider prefix arithmetic, which Python provides.',
'Original-position halves preserve i<j while sorted values permit monotonic windows. Worked three qualifying ranges are correct; low/high source notes explain inclusivity.',
'Reusable buffer merge-sort counting is correct, O(n log n)/O(n). Both pointers move monotonically within each merge; recursive depth is logarithmic. Starter/direct adapter match.',
'Six valid cases cover zero multiplicity, exact equal bounds, negative interval, no results, singleton, and mixed signs.',
['Add nums=[2147483647,-2147483648],lower=-1,upper=-1 -> 1 to exercise large prefix values and cancellation.', 'Show one concrete low/high interval on sorted halves [-2,0] and [2,3], including why pointers never reset; add a generated 65535-zero count 2147450880 for integer accuracy.'])
}
rows=[]
for s in slugs:
 f,e,sol,t,imps=D[s]
 findings=[]
 if s=='3sum':
  findings=[{'severity':'P3','title':'Distinguish the largest pair sum from the anchored triple sum','file':str(R/'public/problems'/s/'explanation.json'),'line_start':20,'line_end':21,'detail':'The walkthrough says the largest available pair sums to -1. That pair is 1 and 2, so its sum is 3; only the complete triple -4+1+2 has sum -1. The following step similarly omits the anchor when stating the pointers sum to zero. The returned answer is correct, but literal arithmetic in the teaching example is misleading.','evidence':'For sorted [-4,-1,-1,0,1,2], max remaining pair=1+2=3 and anchored triple=-4+3=-1; for anchor -1 the pair -1+2=1 and full triple -1-1+2=0.','recommendation':'Write "even -4+1+2=-1" and "anchor -1 with pointer values -1 and 2 totals zero".'}]
 fixture_count=len(json.load(open(R/'public/problems'/s/'tests.json')))
 validations=[f'{fixture_count} authored fixtures passed reference+adapter through shared harness.',f'{results["counts"][s]} independent oracle/boundary probes passed; see ./review/2026-10-04/evidence/probes-1.py and probes-1-results.json.','All six files read; starter compiled; worked input/result matched an authored fixture; all codeNotes snippets exist in solution.']
 rows.append({'slug':s,'verdict':'issue' if findings else 'no-confirmed-defect','formulation_review':f,'explanation_review':e,'solution_review':sol,'tests_review':t,'findings':findings,'improvements':imps,'validation':validations})
assert len(rows)==len(slugs)==30
json.dump(rows,open('./review/2026-10-04/evidence/audit-1.json','w'),indent=2,ensure_ascii=False)
print(json.dumps({'packages':len(rows),'with_findings':sum(bool(r['findings']) for r in rows),'findings':sum(len(r['findings']) for r in rows),'independent_probes':results['total'],'fixtures':results['fixtures']}))
