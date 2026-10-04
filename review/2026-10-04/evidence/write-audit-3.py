import json,pathlib
D={
'insert-interval':(
 'Defines sorted, disjoint, closed intervals and allows an empty list; endpoint-touching behavior is explicit. Clarify that newInterval endpoints obey the same numeric bounds.',
 'The three-region proof and walkthrough are correct, but the claimed transitive chain reaching intervals beyond the original insertion is impossible under pairwise-disjoint existing intervals.',
 'Correct O(n) three-phase scan with O(1) working state excluding fresh output pairs. Starter signature and direct adapter match; inputs are not unnecessarily mutated.',
 'Covers empty, containment, endpoint contact and insertion before all. Missing insertion after all and a disjoint middle insertion.',
 ['Add intervals=[[1,2],[4,5]], newInterval=[7,9] -> [[1,2],[4,5],[7,9]] and newInterval=[3,3] -> [[1,2],[3,3],[4,5]].','Rewrite the chain paragraph to explain merging the contiguous original overlap block; retain the expanding union endpoints as a clear implementation invariant.']),
'interval-list-intersections':(
 'Both list ordering and disjointness plus closed endpoint semantics are clear; empty lists are legal.',
 'Earlier-ending pointer discard proof is sound; walkthrough correctly includes touching intersections. Equality of end times can be explained explicitly.',
 'Correct linear two-pointer scan, constant working state. Advancing j on equal ends remains safe. Starter and adapter agree.',
 'Good coverage of endpoint-only, containment, disjointness and either empty input. Equal end times followed by more intervals are absent.',
 ['Add firstList=[[1,3],[5,7]], secondList=[[2,3],[4,6]] -> [[2,3],[5,6]] to exercise equal end times.','Explain why either pointer can advance on an end-time tie.']),
'invert-binary-tree':(
 'Clearly requires original root identity and swapped links rather than just equivalent values; empty tree is legal.',
 'Correct local-to-global mirror argument, stack explanation and involution observation.',
 'Correct iterative DFS with O(n) time and O(h) stack. Adapter verifies every original node, value, and swapped child identity, so clone-return solutions cannot pass. Starter matches.',
 'Balanced, empty, single, unilateral and asymmetric fixtures are useful. Strong identity checks exceed value-only output checks.',
 ['Add a 100-node one-sided fixture using only values within -100..100 to exercise iterative depth and full link preservation.','Use invert(invert(tree)) == original links as a generated property check, alongside the existing identity assertions.']),
'is-subsequence':(
 'Distinguishes subsequences from contiguous matches and permits both strings to be empty.',
 'Earliest-match greedy invariant is sound; prefix progress walkthrough is accurate.',
 'Correct O(len(t)) scan with guarded s indexing and constant state. Starter/direct adapter match. Returning early when all characters are found is optional.',
 'Covers order and repeated-character false cases, but only tests empty s when t is also empty.',
 ['Add s="", t="abc" -> true; a mutant returning false only for this situation passes all six current fixtures.','Add s="aa", t="aba" -> true to pair the existing repeated-letter rejection with a valid repeated match.','Optionally return immediately when matched reaches len(s), and return true immediately for empty s.']),
'jump-game':(
 'Maximum rather than mandatory jump lengths and nonempty arrays are clearly specified.',
 'Continuous reachable-prefix invariant and gap proof are correct; walkthrough provides a concrete successful route.',
 'Correct greedy O(n) scan and O(1) space, including singleton zero and crossing the final position. Starter/direct adapter match.',
 'Useful blocking-zero, no-first-move and zero-crossing cases. Maximum numeric jump and large input are absent.',
 ['Add nums=[100000,0,0] -> true to reinforce shorter-than-maximum landing semantics.','Keep a generated 10000-element [1,...,1,0] boundary test to guard against recursive alternatives exceeding available depth.']),
'k-closest-points-to-origin':(
 'Specifies Euclidean distance, output order freedom, k bounds and unique closest set. Explicitly state that duplicate coordinate pairs count as separate input occurrences.',
 'Squared-distance and negative-distance heap reasoning are correct. The multiplicity paragraph is valuable.',
 'Correct O(n log(k+1)) heap, O(k) storage. Index tie breaker safely retains original coordinates. Adapter validates shape, coordinate types, occurrence counts and optimal distance multiset; starter matches.',
 'Covers signs, origin, k=n and different ranks, but has no duplicate coordinates or equal-distance retained points.',
 ['Add points=[[0,0],[0,0],[1,0]], k=2 -> [[0,0],[0,0]]; a deduplicating mutant passes all current tests and fails this valid unique closest multiset.','Add points=[[1,0],[0,1],[3,3]], k=2, accepting either order of the first two points, to exercise harmless equal-distance heap ties.']),
'kth-largest-element-in-an-array':(
 'Rank versus distinct rank and multiplicity are explicit; k and value bounds are sufficient.',
 'Min-heap invariant and k=1/k=n observations are correct; sorting comparison is useful.',
 'Correct O(n log(k+1)) bounded min heap and O(k) state. Equal incoming root values can safely be ignored once full. Starter/direct adapter match.',
 'Includes duplicates, all equal, k=n, singleton and negative values. k=1 is only tested on singleton.',
 ['Add nums=[-3,10,4,10], k=1 -> 10 to test repeated maximum replacement with k=1.','Add a descending input with intermediate k to exercise the no-replacement branch after heap fill.']),
'kth-smallest-element-in-a-bst':(
 'One-based rank, nonempty BST and valid k are stated. Spell out whether duplicate keys are prohibited, since the BST ordering assumption is left implicit.',
 'Inorder iterator proof is accurate; useful update/query extension is appropriately identified as a different optimization.',
 'Correct O(h+k) early-stopping traversal, O(h) stack. No recursion-depth risk. Starter type annotations work with shared TreeNode injection; direct adapter matches.',
 'Covers minimum and maximum rank, singleton, both chain directions and an interior rank. Existing chains are shallow.',
 ['Add a valid 10000-node chain and k=10000 to verify advertised skew-tree behavior.','Give a walkthrough with k>1 to show the transition into a popped node\'s right subtree and back to waiting ancestors.']),
'kth-smallest-element-in-a-sorted-matrix':(
 'Square shape, row/column order, duplicate rank semantics and storage requirement are clear. Use nondecreasing instead of ascending to avoid suggesting strict order.',
 'Monotone threshold proof and bottom-left staircase are correct, including mid not necessarily being an entry.',
 'Correct constant-space value binary search, O(n log(R+1)) for nonzero range with constant work on all-equal input. Starter/direct adapter match.',
 'Strong cases for duplicates, gaps, negatives, singleton, first/last rank and all-equal matrix.',
 ['Add matrix=[[-1000000000,0],[0,1000000000]], k=3 -> 0 for full numeric range and duplicate boundary rank.','Include one annotated staircase count showing both row decrements and whole-column-prefix additions within a single midpoint.']),
'letter-case-permutation':(
 'English-only alphabet, unchanged digits and any output order are explicit; constraints bound recursion to 12.',
 'Cartesian-product explanation and undo invariant are correct; uppercase input handling is clear.',
 'Correct backtracking with O(n*2^L) output-sensitive time and O(n) working state. Sorted-list adapter comparison preserves multiplicity and accepts any order. Starter matches.',
 'Covers digits only, uppercase, mixed characters and small Cartesian products, but not the maximum number of branches.',
 ['Add s="abcdefghijkl" with 4096 distinct outputs and invariant checks for length and per-position lower/upper choices.','Document total output space as O(n*2^L), in addition to the already correct O(n) auxiliary bound.']),
'letter-combinations-of-a-phone-number':(
 'All eight mappings and the empty-input convention are fully specified; digits 0/1 are excluded.',
 'Independent choice/product explanation is correct; immutable prefixes correctly avoid sibling interference.',
 'Correct enumerator. O(n^2) auxiliary characters for live copied prefixes is an accurate Python-specific refinement. Starter and order-insensitive multiplicity-aware adapter match.',
 'Empty, repeated digit and both four-letter mappings are covered, but digits 4,5,6,8 never appear in any fixture.',
 ['Add digits="4568" with the independently generated product of ghi, jkl, mno, tuv; a wrong digit-4 mapping passes every current fixture.','Add digits="7979" to exercise maximum permitted length and all four-choice positions.']),
'linked-list-cycle':(
 'Fixture pos versus the actual head-only API and identity-based cycle definition are clear.',
 'Floyd meeting argument, safety guards and initial-equality warning are correct.',
 'Correct identity comparison after movement; O(n) time/O(1) space. Adapter builds fixtures with the intended tail connection and starter exposes only head.',
 'Covers empty, single acyclic, self-loop, two-node loop, internal entry and repeated acyclic values.',
 ['Add head=[1,2,3,4], pos=3 -> true to exercise a long prefix followed by a one-node tail cycle.','Retain generated 10000-node acyclic and tail-self-loop boundary tests to test termination and identity rather than short visual cases alone.']),
'linked-list-cycle-ii':(
 'Original-node identity, no-link-mutation contract and fixture-only pos are explicit. Return annotation could be Optional[ListNode] to reflect None.',
 'Two-phase modular-distance proof is sound and example correctly returns the entry rather than initial meeting.',
 'Correct Floyd detection and entry localization with O(1) state. Adapter verifies links unchanged and returned original identity; starter matches, though annotation omits None.',
 'Strong coverage of internal/head entries, repeated values, no cycle, empty and self-loop.',
 ['Change both solution and starter annotations to Optional[ListNode] for the nullable head and nullable result.','Add a long prefix followed by a single tail-node loop, and a longer cycle with entry far from head, to show the second phase is necessary.']),
'longest-common-subsequence':(
 'Clearly distinguishes subsequence order from adjacency and states nonempty lowercase inputs.',
 'Prefix recurrence, left-to-right dependency order and rolling rows are correct; walkthrough agrees with the implementation.',
 'Correct O(mn) time and O(len(text2)) two-row memory; starter/direct adapter match.',
 'Fixtures distinguish substring DP, repeated matches and order reversal. A mutant dropping the current-row left value is caught by Several choices.',
 ['Optionally swap input strings so the column dimension is the shorter one, reducing auxiliary memory to O(min(m,n)).','Add text1="a", text2="ba" -> 1 and reverse lengths to illustrate propagation across a row and across rows separately.','Keep a 1000-by-1000 repeated-letter boundary probe to verify full advertised input size.']),
'longest-consecutive-sequence':(
 'Expected linear-time requirement, duplicates, empty input and value-versus-index meaning are explicit.',
 'Unique-run-start counting and amortized nested-loop argument are correct.',
 'Correct expected O(n) set implementation and O(n) space. Iterating the set protects against duplicate run starts. Starter/direct adapter match.',
 'Covers negative values, empty, duplicates and separated runs, but small duplicates cannot distinguish repeated-start quadratic scanning.',
 ['Add an operation-count or runtime-regression probe using nums=[0]*50000 + list(range(50000)); changing for value in values to for value in nums passes all current fixtures but repeats the entire run 50000 times.','Add values near -1000000000 and 1000000000 to reinforce that arithmetic adjacency is independent of list positions.']),
'longest-increasing-subsequence':(
 'Strict increase and preserved index order with skipped elements are explicit; input is nonempty.',
 'Minimum-tail invariant and the warning that tails need not itself be a subsequence are sound.',
 'Correct bisect_left replacement algorithm, O(n log n) time/O(n) space. Starter imports the required helper and direct adapter matches.',
 'Duplicate strictness, descending input, singleton and skipping are covered. Switching to bisect_right is caught by All equal.',
 ['Add nums=[3,5,6,2,4] -> 3 and show final tails=[2,4,6], whose indices are out of order, to make the summary-not-reconstruction warning concrete.','Keep generated monotone 2500-element input as a boundary check.']),
'longest-palindromic-substring':(
 'Contiguous, nonempty input and any longest tied answer are clear; letters/digits permit case-sensitive examples.',
 'Odd/even centers, stopped-pointer bounds and one-time slice allocation are explained correctly.',
 'Correct O(n^2) center expansion and constant working state excluding output. Adapter verifies palindrome, containment and optimal fixture length while allowing ties; starter matches.',
 'Useful odd/even, repeated, whole, internal and singleton cases. Removing even centers is caught by three fixtures.',
 ['Add s="abcd" accepting any one-character answer, and s="aA1" to make case-sensitive distinct-character behavior explicit.','Test the checker with alternate optimum "aba" for babad and reject a shorter palindrome, an invented palindrome and a nonpalindrome of expected length.']),
'longest-repeating-character-replacement':(
 'Replacement budget is at most k; uppercase fixed alphabet and contiguous length are explicit.',
 'Exact majority-cost reasoning and repeated shrink walkthrough are correct; using recomputed maximum keeps displayed windows valid.',
 'Correct O(26n) scan and O(26) state. Existing zero-frequency keys remain bounded by the alphabet. Starter/direct adapter match.',
 'Budget zero/full, singleton, all different and changing majorities are tested; AABABBA forces multiple removals.',
 ['Add s="AAAA", k=0 -> 4 and a large 26-letter alternating input to cover the no-shrink and frequent-shrink extremes.','Mention that historical-maximum variants have a different window invariant so readers do not substitute stale counts into this exact-valid-window proof.']),
'longest-substring-without-repeating-characters':(
 'Contiguous distinct-character length, empty input, spaces and symbols are explicit.',
 'Last-occurrence jump and monotone left boundary proof are correct; historical dictionary entries are explained well.',
 'Correct O(n) scan with space bounded by distinct characters. Starter and direct adapter match.',
 'Excellent targeted cases: abba catches retreating left, pwwkew distinguishes subsequences, and spaces/punctuation are exercised.',
 ['Add a trailing all-distinct suffix case such as s="aaaaabcd" -> 4 to test the optimum after a long repeated prefix.','Use a generated 50000-character repeated input and a long unique-prefix/repeated-suffix input as practical boundary checks.']),
'longest-word-in-dictionary':(
 'Requires every nonempty prefix, specifies lexicographic tie and empty answer. Dictionary duplicates are not explicitly prohibited and implementation handles them.',
 'Length-ordered certification and strict-length tie update proof are correct; walkthrough reflects the sorted order.',
 'Correct sorted pass with prefix-set membership. Time bound accounts for Python character comparisons/copying. Space O(W*L) is conservative; stored strings reuse references, so O(W) container entries plus O(L) temporary characters describes auxiliary storage more precisely. Starter/adapter match.',
 'Covers missing first and middle prefixes, unsorted input and lexicographic ties.',
 ['Add duplicate dictionary entries such as words=["a","a","ab","abc"] -> "abc" to state whether repeated inputs are accepted.','Clarify total input storage versus auxiliary references in the O(W*L) space explanation.','Consider a shorter sentence defining W and L immediately next to the complexity labels.']),
'lowest-common-ancestor-of-a-binary-search-tree':(
 'Distinct existing targets, distinct keys, ancestor-self rule and original-node return contract are clear. Fixture p/q values are explained.',
 'Shared descent and first-split proof are correct; walkthrough has both a left and a right descent.',
 'Correct O(h) search/O(1) space. Adapter ensures original returned identity and starter signature matches.',
 'Root/lower splits, ancestor target, two nodes, negatives and reversed target order are covered. All existing trees are small.',
 ['Add an entirely rightward search fixture, e.g. root=[1,null,2,null,3,null,4], p=3, q=4 -> 3.','Keep a deep valid BST chain boundary check to ensure iterative O(h) behavior without recursion.']),
'lowest-common-ancestor-of-a-binary-tree':(
 'Distinct existing targets and unique values are stated; returning an original node is in pitfalls but can also be made explicit in the statement with fixture p/q encoding.',
 'Parent discovery and first upward-chain intersection proof are correct; the walkthrough intentionally uses a non-BST tree.',
 'Correct iterative O(n) parent-map algorithm, O(n) storage. Shared TreeNode objects are identity-hashable. Adapter verifies original-node result and starter matches.',
 'Covers separate branches, target ancestor, siblings, non-BST ordering, negatives and a shallow chain.',
 ['Explicitly state that trainer p and q are supplied as node values while the Python method receives node objects.','Add a deep chain near the 100000-node bound, or at least beyond Python recursion depth, to enforce the advertised iterative robustness.','Add reversed target order for an ancestor/descendant pair to confirm both upward walks handle the self-ancestor case.']),
'majority-element':(
 'Strict majority, nonempty input and existence guarantee are clear; no arbitrary no-majority case is required.',
 'Unequal-pair cancellation proof and vote-versus-frequency distinction are correct.',
 'Correct Boyer-Moore candidate scan with O(n) time and O(1) state; starter/direct adapter match.',
 'Good reset, late takeover, negative, singleton and zero-majority coverage.',
 ['Add nums=[2,1,2,1,2] -> 2 for repeated complete cancellations before the guaranteed winner.','Keep the existence guarantee next to any reuse example; add a verification pass only when extending to arbitrary arrays.']),
'maximum-average-subarray-i':(
 'Exact length k, absolute 1e-5 tolerance and numeric bounds are explicit.',
 'Fixed denominator, incremental sum and actual-first-window initialization are correct; walkthrough arithmetic is accurate.',
 'Correct O(n) scan/O(1) state without a temporary initial slice. Adapter accepts finite numeric answers within the stated tolerance and rejects bool, NaN and infinity; starter matches.',
 'Covers all-negative values, k=1, k=n, singleton and fractional result; zero-initialization mutant is caught.',
 ['Add nums=[10,0,0], k=2 -> 5.0 to make a best-first-window case explicit.','Test adapter tolerance at exactly 1e-5 and just beyond it, and test nonfinite/wrong-type outputs.']),
'maximum-binary-tree':(
 'Recursive maximum construction, distinctness and level-order trainer serialization are clear.',
 'Decreasing right-ancestor chain and last-popped-root reasoning are correct; mixed-input walkthrough illustrates both linking modes.',
 'Correct linear monotonic-stack construction. Working stack is O(n), constructed nodes O(n) output. Shared TreeNode injection supports solution/starter; adapter serializes with repeated-node protection.',
 'Mixed, ascending, descending, singleton and middle maximum cover core structure. Existing chains are only length three.',
 ['Add nums=[5,1,2,3,4] -> [5,null,4,3,null,2,null,1] to isolate repeated absorption under a surviving larger ancestor.','Keep a sorted 1000-value boundary probe to catch naive recursive implementations and verify the promised linear method.','Separate O(n) auxiliary stack from O(n) returned tree allocation in the space explanation.']),
'maximum-depth-of-binary-tree':(
 'Counts nodes along root-to-leaf paths rather than edges; empty tree behavior is explicit.',
 'Exact propagated-depth invariant and explanation that maximum internal depth cannot exceed maximum leaf depth are sound.',
 'Correct O(n) iterative DFS/O(h) stack. Deep skew traversal avoids recursion limits. Starter/direct adapter match.',
 'Empty, zero-valued singleton, balanced, both unilateral shapes and asymmetry are covered, but deepest fixture is four nodes.',
 ['Add a 10000-node chain with repeated legal values, expected depth 10000, to make the iterative-depth claim executable.','Shorten the headline to a brief teaching cue, e.g. Carry each node\'s depth on the stack; keep the longer detail in intuition.']),
'maximum-frequency-stack':(
 'Stateful API, active-frequency priority, most recent remaining occurrence tie rule and nonempty-pop guarantee are clear. Describe trainer operation arrays and null push results.',
 'Frequency-level event stacks and preserved lower-level history proof are correct; walkthrough recency ordering is accurate.',
 'Correct amortized O(1) operations and O(active pushes) state. Deleting zero-count keys and empty groups makes the stated active-storage bound accurate. Starter has all methods and adapter dispatch matches.',
 'Strong examples for ties, frequency, interleaving, zero values and reuse after becoming empty.',
 ['Add an interleaved re-push after a frequency-level drop, e.g. push 1, push 2, push 1, pop, push 1, pop, pop, pop -> null,null,null,1,null,1,2,1.','Explain that constructor is implicit in trainer operations and push returns None, which appears as null in expected output.','Keep a 20000-operation fill-and-drain probe and inspect that frequency/groups are empty after draining.']),
'maximum-product-subarray':(
 'Nonempty contiguous candidates, singleton validity and numeric/product bounds are clearly specified.',
 'Sign-sensitive extreme tracking, zero restart and preserving old values before simultaneous transitions are correct.',
 'Correct O(n) DP with O(1) working state under bounded products. Starter/direct adapter match.',
 'Positive prefix, zero-separated negatives, sign flip, negative singleton, restart and ones exercise the main recurrence; dropping minimum is caught by Two negatives.',
 ['Add nums=[-2,-3,-4] -> 12 for an odd all-negative run whose optimum excludes one endpoint.','Add nums=[-2,0,-3,-4] -> 12 to combine a reset with a minimum-to-maximum sign flip.']),
'maximum-subarray':(
 'Nonempty contiguous maximum sum and numeric bounds are explicit.',
 'Detailed explanation and correctness proof are sound, but lesson intuition reverses the consequence of a negative previous sum.',
 'Correct Kadane recurrence O(n)/O(1), initialized from a real element. Starter and direct adapter match.',
 'All-negative, zero, singleton, whole-array and early-optimum cases are strong; returning final ending instead of global best is caught by four fixtures.',
 ['Fix the intuition sentence to say a negative previous sum makes extending worse, so starting at the new value is better.','Add a two-value explanatory example nums=[-2,1] -> 1 to connect the corrected wording directly to the recurrence.']),
'maximum-width-of-binary-tree':(
 'Conceptual gaps, nonempty tree and bounded answer are explicit; width differs from count of present nodes.',
 'Common index translation proof and sparse example are correct; normalization prevents coordinate growth unrelated to actual width.',
 'Correct O(n) BFS with queue size bounded by real present nodes on adjacent levels. Starter and direct adapter match; no empty-root guard is required by current constraints.',
 'Useful gap, full, singleton and one-sided fixtures; deep narrow and large bounded sparse widths are absent.',
 ['Add a 3000-node one-sided chain with legal repeated values, expected width 1, to validate normalization across depth.','Add a sparse tree with far-separated extreme branches and width near the signed 32-bit bound while retaining few real nodes.','Use a symbol such as w_real for maximum number of present nodes at a level in the complexity label to distinguish queue space from conceptual width.'])}
slugs=json.load(open('./review/2026-10-04/evidence/group-3.json'));stats=json.load(open('./review/2026-10-04/evidence/probes-3-results.json'));mutations=json.load(open('./review/2026-10-04/evidence/mutations-3-results.json'));out=[]
for s in slugs:
 f,e,sol,t,improvements=D[s]; findings=[]
 if s=='insert-interval':
  findings.append({'severity':'P3','title':'Remove impossible overlap-chain example under disjoint input constraints','file':'public/problems/insert-interval/explanation.json','line_start':4,'line_end':4,'detail':'The paragraph claims merging one existing interval can extend the endpoint enough to reach a later existing interval that did not overlap the original insertion. If a merged existing interval ends at b, its next closed disjoint interval starts strictly after b; any later interval beyond the original insertion end therefore also lies beyond the merged end. Such a transitive chain requires overlaps among existing intervals and cannot occur for this problem. The implementation itself remains correct.','evidence':'For consecutive existing intervals I,J, disjoint closed sorted input implies I.end < J.start. If J.start > newInterval.end and I overlaps newInterval, then J.start > max(I.end,newInterval.end), so J cannot be newly reached by merging I.','recommendation':'Explain that all original overlaps form one contiguous block; maintain current min/max union bounds without claiming a newly reached disjoint interval. Update the matching chain comments/code note wording as part of the same editorial cleanup.'})
 if s=='maximum-subarray':
  findings.append({'severity':'P3','title':'Correct the reversed negative-prefix intuition','file':'public/problems/maximum-subarray/lesson.json','line_start':13,'line_end':13,'detail':'The intuition says a negative previous sum makes a fresh start worse. A fresh start omits the negative prefix, so extending is worse; the sentence contradicts the correct recurrence and detailed explanation.','evidence':'For nums=[-2,1], extending gives -2+1=-1 while restarting gives 1. The reference and oracle return 1.','recommendation':'Replace the sentence with: A negative previous sum makes extending worse than starting fresh at this value.'})
 st=stats[s];validation=[f"Read all six package files; all {st['fixtures']} supplied fixtures passed through src/runtime/harness.py.",f"{st['oracle_cases']} independently generated valid cases passed against a separate oracle (seed 103); zero failures."]
 if st['boundary_cases']:validation.append(f"{st['boundary_cases']} valid upper-bound/deep-input checks passed through the actual adapter.")
 if s in mutations:validation.append('Targeted mutant '+('survived all current fixtures; added independent counterexample or performance rationale is described in test improvements.' if mutations[s]['survives'] else 'was rejected by: '+', '.join(mutations[s]['caught_by'])+'.'))
 out.append({'slug':s,'verdict':'issue' if findings else 'no-confirmed-defect','formulation_review':f,'explanation_review':e,'solution_review':sol,'tests_review':t,'findings':findings,'improvements':improvements,'validation':validation})
pathlib.Path('./review/2026-10-04/evidence/audit-3.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)); print(json.dumps({'problems':len(out),'findings':sum(len(x['findings']) for x in out),'fixtures':sum(s['fixtures'] for s in stats.values()),'oracle_cases':sum(s['oracle_cases'] for s in stats.values()),'boundary_cases':sum(s['boundary_cases'] for s in stats.values())}))
