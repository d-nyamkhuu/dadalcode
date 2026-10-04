import json, pathlib
root=pathlib.Path('/home/data/Projects/blind-75');slugs=json.load(open('/home/data/Projects/blind-75/review/2026-10-04/evidence/group-6.json'));validated=json.load(open('/home/data/Projects/blind-75/review/2026-10-04/evidence/probe-6-results.json'))['notes']
reviews={
'sliding-window-median':(
'Precise median definition, k bounds, signed-integer domain, and absolute-error contract. Window output order is implicit in the statement.',
'Logical versus physical heap sizes, duplicate multiplicity, pruning, and retained O(n) storage are explained correctly. Even-window walkthrough matches the algorithm.',
'Two heaps and delayed counts preserve partition and active-size invariants. Published O(n log n) time and O(n) auxiliary bounds correctly account for buried expired entries; starter and tolerant finite-number adapter match the method.',
'Seven fixtures cover odd/even windows, k=1, duplicates, equal values, extremes, and buried expiry; descending and full-window cases would strengthen coverage.',
['Explicitly say medians are returned in increasing window-start order.','Add descending input [6,5,4,3,2,1], k=3 -> [5,4,3,2], plus a full-length odd window.','Describe optional periodic heap rebuilding if an O(k) retained-space variant is desired.']),
'smallest-range-covering-elements-from-k-lists':(
'Clearly defines inclusive coverage, nonempty sorted lists, width, and smaller-left tie breaking.',
'The minimum-advancement exchange argument and exhaustion rule are sound; the example reaches [20,24] through the stated replacements.',
'Heap entries retain list/index identity and tracked high is valid because replacements never decrease. O(N log(k+1)) / O(k) correctly includes the one-list case. Starter and direct adapter agree.',
'Six fixtures exercise shared values, ties, negatives, singleton rows, and k=1. Duplicate values within individual lists and sharply unequal lengths are absent.',
['Define N as the total number of elements across all lists in the complexity explanation.','Add nums=[[1,1,5],[2,2,6]] -> [1,2] to exercise within-list duplicates.','Add an early-exhaustion case nums=[[0,100],[99]] -> [99,100].']),
'sort-characters-by-frequency':(
'Complete nonempty, case-sensitive, letter/digit contract; character blocks are required and ties are explicitly unrestricted.',
'Correctly distinguishes sorting distinct keys from occurrences and explains the deterministic secondary key without imposing it on submissions.',
'Counter, distinct-key sort, and joined blocks preserve multiplicities and order frequencies. O(n+u log u) time and output-inclusive O(n+u) space are accurate. Starter matches; semantic checker accepts legal tie permutations while rejecting split blocks.',
'Six fixtures cover ties, case, digits, singleton input, and mixed group sizes. Independent property checks confirm grouping and multiset preservation.',
['Add adapter regressions showing that eetr is accepted for tree while abab is rejected for aabb.','Name u<=62 under the stated alphabet, making the effectively linear bound explicit.','Include a long repeated-character input to guard against per-occurrence sorting or repeated string concatenation.']),
'sort-colors':(
'In-place output and no-library-sort requirement are clear; one-pass constant-space behavior is presented as the reference approach.',
'Four-region invariant is precise; explanation correctly leaves mid unchanged after exchanging a two. Walkthrough handles the incoming zero.',
'Dutch national flag implementation reduces the unknown interval every iteration, O(n) time/O(1) space. Starter returns None. Adapter examines the mutated input instead of a replacement return, correctly enforcing mutation.',
'Six fixtures cover reinspection after a two swap, reversed regions, only twos, and singleton zero. Only ones and already sorted input are useful additions.',
['Add [1,1,1] -> [1,1,1] and [0,0,1,2,2] -> unchanged.','If the no-library-sort rule is intended to be enforced by the trainer, add a source restriction check for sorted and list.sort; current fixtures validate the resulting mutation.']),
'sort-list':(
'Correct sorting goal, 0..50000-node bounds, value range, and reference O(n log n)/constant-space promise. The serialized array input convention is not stated here.',
'Bottom-up sorted-run invariant, run termination, dummy head, and uneven final runs are explained correctly.',
'Reference bottom-up merge sort is correct, stable on equal keys, iterative, and uses constant pointers. Direct 50000-node sorting succeeds. The adapter invokes shared list_values, whose 10000-node cap prevents valid larger inputs from returning.',
'Six short fixtures cover emptiness, singleton, duplicates, negatives, and odd lengths. They miss the advertised >10000 boundary and therefore do not catch the serialization failure.',
['Raise or parameterize the shared linked-list serialization cap to cover the documented 50000-node domain.','Add 10001-node and 50000-node descending-list regressions through the actual harness.','Document that head is provided as an array and ListNode is supplied by the trainer; optionally assert original-node conservation if node reuse becomes a mandatory contract.']),
'spiral-matrix':(
'Clockwise traversal starts at top left; rectangularity, nonempty dimensions, and allowed values are specified.',
'Correct perimeter-removal invariant and guards explain thin final rows/columns and avoid duplicate corners. The 3x3 walkthrough is exact.',
'Four inclusive boundaries traverse every cell exactly once. O(mn) time, constant auxiliary storage, and separate output storage are correct; starter and adapter match.',
'Five fixtures cover square, wide rectangle, row, column, and singleton. Independent direction-walk comparisons passed all 100 allowed dimension pairs.',
['Add a tall rectangle such as [[1,2],[3,4],[5,6],[7,8]] -> [1,2,4,6,8,7,5,3].','Add a 2x2 example to make corner de-duplication visible without an inner layer.']),
'squares-of-a-sorted-array':(
'Nondecreasing input, multiplicity preservation, integer range, and linear-time requirement are clear.',
'Endpoint maximum absolute value and reverse output fill are justified correctly; tied endpoint occurrences remain separate.',
'Two pointers consume one endpoint per slot and retain duplicate squares. O(n) time, O(1) auxiliary space, and O(n) output storage are accurate; starter/adapter match.',
'Six fixtures include mixed signs, negatives only, positives only, zero, and equal absolute values. Boundary magnitude and repeated zeros are absent.',
['Add [-10000,0,10000] -> [0,100000000,100000000].','Add [-1,0,0,1] -> [0,0,1,1] to combine ties and repeated zeros.']),
'subarray-product-less-than-k':(
'Strict inequality and positive factors >=1 are explicit; k=0 and k=1 are legal inputs.',
'Monotonic window proof, exact division, suffix counting, and the special threshold exit are sound. Example correctly excludes product 100.',
'Window enters/leaves each factor once, maintains a bounded integer product, and counts each valid suffix exactly once. O(n)/O(1) is accurate; starter/direct adapter agree.',
'Six fixtures cover equality, k<=1, ones, and an invalid large element. Independent enumeration passed 600 cases.',
['Add [1,1000,1,1], k=2 -> 4, proving the window can become empty and then recover.','Add a 30000-element all-ones boundary case with k=2 -> 450015000.']),
'subsets':(
'Distinct values, empty subset, and unrestricted inner/outer order are specified; constraints keep exponential output manageable.',
'Increasing-index uniqueness proof and copying partial paths correctly explain why every recursive state must be recorded.',
'Backtracking generates each subset once and copies results. O(n*2^n) time/output and O(n) auxiliary storage are accurate. Starter aligns; adapter validates nested integer lists, multiplicity, and order independence.',
'Six fixtures cover singleton, signed/unsorted inputs, zero, and three-element enumeration. Maximum-size output and aliasing protection can be made explicit.',
['Add a 10-distinct-value case asserting exactly 1024 unique subsets and legal member multiplicity.','Add a mutation test returning shared path references to ensure the empty-path/record-copy invariant remains observable.']),
'subsets-ii':(
'Multiset occurrence limits, empty subset, and unrestricted output order are clear; input may be unsorted.',
'Sibling versus descendant duplicate handling and the i>start condition are explained with a correct six-subset walkthrough.',
'Sorted copy avoids mutating input; increasing indices enforce occurrence limits and equal sibling skipping prevents duplicates. Worst-case O(n*2^n)/O(n) auxiliary bounds are correct. Adapter checks nested integer lists without silently deduplicating outputs.',
'Five fixtures cover one duplicate run, all equal, negatives/unsorted, singleton, and distinct values. Multiple duplicate groups deserve a dedicated case.',
['Add nums=[1,1,2,2], which must produce exactly nine subsets from independent multiplicities 0..2 for each value.','Add a 10-identical-value case to verify all 11 distinct multiplicities are retained.']),
'substring-with-concatenation-of-all-words':(
'Equal nonzero word lengths and duplicate quotas are explicit; all starting indices are requested. Returned index order should be expressly unrestricted, as the adapter accepts it.',
'Alignment scans, reset on unknown token, quota repair, and equality of total counts establish complete overlapping matching.',
'Token-window solution is correct including multiple duplicate removals and nonzero offsets. Python slicing/hash costs are included in O(n*w+m*w), with O(m*w) auxiliary upper bound. Starter/adapter match and sorted checker preserves duplicate multiplicity.',
'Six fixtures cover quota failure, duplicate success, overlap, nonzero alignment, short s, and the standard example.',
['Explicitly permit any output-index order, matching the offset-major implementation and checker.','Add an unknown-token reset between successes, e.g. s=barfooxxxfoobar, words=[bar,foo] -> [0,9].','Consider returning early when total concatenation length exceeds len(s), avoiding unnecessary scans.']),
'subtree-of-another-tree':(
'Exact structure, values, and all descendants are required; both input trees are explicitly nonempty.',
'Null-pair comparison and continuing after an unsuccessful repeated-value candidate are explained correctly; iterative stacks avoid recursion limits.',
'Outer candidate DFS plus paired equality is sound. O(nm) time and height-bounded stacks are appropriate; the function relies on the stated nonempty inputs. Starter and level-order tree adapter match.',
'Six fixtures cover extra descendants, wrong shape, repeated candidate, equal/different singleton. 2000-node skewed-tree stress succeeds.',
['Explain the level-order array/null input encoding for root and subRoot.','Add a near-match with a differing deepest leaf to exercise delayed comparison failure.','Offer null-marked serialization with linear matching as an advanced performance improvement for repeated-value adversarial trees.']),
'sudoku-solver':(
'Exactly 9x9, dots, fixed clues, valid unique solution, in-place mutation, and trainer row-string conversion are all specified.',
'MRV ordering and exact restoration of board plus three set families are sound. Diagonal-hole walkthrough is correct but demonstrates forced placements rather than a failed branch.',
'Row/column/box constraints and MRV backtracking correctly search legal assignments and preserve clues. Bounds are intentionally loose but valid; E<=81 limits recursion. Adapter checks shape and fixed clues before comparing output.',
'Nine fixtures include solved/near-solved boards, classic puzzle, digit permutations, and a sparse puzzle requiring backtracking; independent group/clue validity checks also pass.',
['Add a short explanation branch where a locally legal digit leads to zero candidates, followed by explicit restoration.','Supplement expected-board comparison with direct row/column/box validation so fixture mistakes are detectable.','Explain that the implementation breaks MRV scanning at a singleton for efficiency; a later zero-candidate cell is detected on the next level rather than immediately.']),
'sum-of-two-integers':(
'Addition/subtraction prohibition, input bounds, and signed-32-bit result are clear.',
'XOR/AND carry decomposition, finite masking for Python negatives, and complement-based signed conversion are correct.',
'Bit-only reference complies with the prohibition and terminates within the fixed-width bound. Starter matches; the output-only adapter does not enforce prohibited arithmetic source operations.',
'Eight fixtures cover negative/mixed signs, cancellation, lower bounds, carry, and zero. Independent 600-pair addition-oracle checks pass.',
['Add [-1,1] -> 0 to expose carry propagation through the complete masked word.','If arithmetic prohibition is enforced, inspect submitted AST for binary Add/Sub and augmented Add/Sub rather than relying on result fixtures.','Use a carry-producing example such as 3+5 in the walkthrough to show more than one iteration.']),
'swap-nodes-in-pairs':(
'Original-node rewiring, unchanged values, odd suffix, empty input, and serialized values are explicit.',
'Dummy predecessor and P->B->A->suffix rewiring are justified correctly, including assignment order and advancing to the pair tail.',
'Iterative pointer solution preserves identities and values in O(n)/O(1). Starter matches. Adapter unusually and correctly verifies exact returned-node identities plus unchanged original values, catching replacement/value-swap cheats.',
'Six fixtures include empty, singleton, even/odd lengths, equal values, and one pair; randomized identity assertions passed 600 cases.',
['Add the 100-node maximum to exercise many successive predecessor updates.','Retain an explicit adapter mutation test that swaps values or rebuilds nodes, demonstrating why identity validation matters.']),
 'target-sum':(
'Independent positional signs, zeros/equal-value multiplicities, negative target, total sum bound, and nonnegative input are clearly specified.',
'Fresh-round map, signed-state aggregation, and double counting plus/minus zero are correct; five-ones explanation gives the exact five assignments.',
'Each previous state contributes both sign extensions without reuse in the same round. O(n*(S+1))/O(S+1) handles S=0 correctly; starter/direct adapter align.',
'Six fixtures cover zero doubling, all zeros, parity impossibility, negative target, and singleton. Maximum-length all-zero check returns 1048576.',
['Add [0]*20, target=0 -> 1048576 to cover the maximum number of assignments.','Add nums=[1000], target=-1000 -> 1 and a target outside the reachable sum range -> 0.','Optional early exits for abs(target)>sum(nums) and incompatible parity reduce unnecessary state construction.']),
 'task-scheduler':(
'Identical labels require n intervening intervals, tasks may be reordered, and only minimum length is requested; domain excludes empty tasks.',
'Frequency-frame lower bound, tied maxima, and max(total tasks,frame) are correct. Achievability discussion is high level and could use a saturated-frame example.',
'Frequency formula is correct under the stated single-resource homogeneous cooldown model. O(N+26)/O(26) and starter/direct adapter match.',
'Six fixtures cover idle gaps, no cooldown, singleton with large cooldown, one label, enough fillers, and tied maxima. Exhaustive memoized scheduling checked 252 small frequency/cooldown states.',
['Add more tied leaders than frame width, e.g. A,A,B,B,C,C,D,D with n=1 -> 8, showing task count dominates.','Expand correctness with a concrete gap-filling construction for the no-idle case.','Clarify that time intervals are discrete unit durations; the formula does not model task-specific cooldowns.']),
 'top-k-frequent-elements':(
'Unique selected set, arbitrary output order, integer domain, and better-than-O(n log n) requirement are precise.',
'Bucket frequency indexing and the unique boundary argument explain correctness; deterministic ordering is unnecessary.',
'Counter plus n+1 buckets is linear, preserves distinct values, and stops inside the bucket. O(n) auxiliary bound includes empty buckets. Starter and integer-list/set-equivalent checker align.',
'Six fixtures cover unique leader, negatives, selected equal leaders, all-distinct full selection, singleton, and repeated-only value.',
['Add a 100000-element input with one dominant value to exercise the upper frequency bucket.','State that a bucket split at k cannot occur across an ambiguous tie for valid inputs because the selected set is guaranteed unique.','Mention a size-k heap alternative when n-sized bucket allocation is undesirable, documenting its different O(n+u log k) bound.']),
 'trapping-rain-water':(
'Nonnegative heights and unit widths correctly define volume; nonempty bounded input is explicit.',
'Smaller maintained maximum fixes one column, and refreshing maxima before subtraction avoids negative contributions. Standard six-unit walkthrough is correct.',
'Two-pointer running-max version handles both sides and final single column correctly in O(n)/O(1). Starter/direct adapter agree.',
'Six fixtures cover multiple basins, deep basin, increasing sequence, singleton, equal walls, and unequal walls. Independent per-column maxima comparisons passed 600 cases.',
['Add descending [4,3,2,1] -> 0 and all-flat [3,3,3] -> 0.','Add a high-wall case [100000,0,100000] -> 100000 and a maximum-length basin to exercise large totals.']),
 'two-sum':(
'Distinct indices, exactly one pair, index order freedom, and signed ranges are complete.',
'Processed-prefix dictionary invariant and lookup-before-insertion correctly prevent self-pairing while retaining duplicate-valued pairs.',
'Hash lookup returns the unique pair without reusing an index. Expected O(n) time/O(n) storage is appropriate; starter matches and semantic checker verifies index type, range, distinction, and sum.',
'Six fixtures cover later match, duplicates, zero pair, negative pair, and distant indices. Exhaustive short-array unique-target checks pass.',
['Add [-1000000000,1000000000], target=0 -> [0,1].','Explicitly qualify O(n) as expected hash-map time if discussing adversarial hashing.','Keep an adapter regression that rejects a repeated index such as [0,0], even when twice nums[0] equals target.']),
 'unique-paths':(
'Cell dimensions, right/down movement, no obstacles, and bounded answer are clear; the 1x1 route is correctly counted as one.',
'Disjoint last-move recurrence, boundary ones, and update order for compressed DP are justified accurately.',
'In-place row DP retains above/left values correctly, O(mn) time/O(n) storage. Starter/direct adapter agree; symmetric dimensions can reduce storage further.',
'Five fixtures cover one cell/row, square, and nonsquare grids; missing one-column and larger valid count cases are useful additions.',
['Add m=100,n=1 -> 1 and m=10,n=10 -> 48620.','Swap dimensions so the retained DP row has min(m,n) entries, improving auxiliary space to O(min(m,n)).','Add symmetry checks uniquePaths(m,n)==uniquePaths(n,m) against combinatorial counts.']),
 'valid-anagram':(
'Exact character multiplicities and lowercase nonempty domain are precise.',
'Equal lengths plus no consumption deficit is a correct sufficient argument, avoiding a redundant final zero scan.',
'Dictionary counts are correct and bounded by 26 letters in the stated domain; O(len(s)+len(t))/O(26). Starter/direct adapter align.',
'Five fixtures cover true rearrangement, missing letter, duplicate-count mismatch, unequal length, and singleton. Random sort-oracle comparisons passed 600 cases.',
['Add s=abcdefghijklmnopqrstuvwxyz,t=zyxwvutsrqponmlkjihgfedcba -> true.','Add a 50000-character repeated-letter case to exercise the input limit.','For the optional Unicode extension, distinguish code-point equality from Unicode normalization rather than implying visual-character equivalence.']),
 'valid-palindrome':(
'Ignoring non-alphanumeric characters, lowercase comparison, printable ASCII, and normalized-empty acceptance are explicit.',
'Outermost meaningful-pair invariant and bounds checks are correct; digits are retained and only-punctuation behavior is handled.',
'Two pointers skip ignored characters and compare lowercased ASCII in O(n)/O(1). Meeting on ignored text remains harmless. Starter/direct adapter agree.',
'Seven fixtures cover phrase, mismatch, punctuation/whitespace-only, digits, mixed case, and numeric palindrome; independent normalization/reversal checks pass.',
['Add a single meaningful character surrounded by punctuation, e.g. !!!A??? -> true.','Add mixed digit/case palindrome 1aA1 -> true and asymmetric punctuation around a mismatch.','Clarify any future non-ASCII extension would require its own case-folding and normalization policy.']),
 'valid-parentheses':(
'Types and strict latest-opener nesting are specified, and the domain contains only the six bracket symbols.',
'Stack prefix invariant correctly distinguishes crossing pairs from equal counts and checks both unmatched closers and leftover openers.',
'Matching-map/stack implementation is correct in O(n)/O(n). Unused enumerate index is cosmetic. Starter/direct adapter agree.',
'Seven fixtures exercise type mismatch, crossings, leading closer, leftover opener, adjacent types, and nested success.',
['Add a 10000-character deeply nested valid string, plus its truncated invalid form.','Simplify the unused index to for char in s if per-character index is not required for visualization.']),
 'validate-binary-search-tree':(
'Strict subtree ordering, signed 32-bit values, nonempty input, and duplicate invalidation are explicit.',
'Open ancestor bounds, infinite initial limits, and explicit stack explain global ordering and deep-tree safety correctly.',
'Each child inherits every ancestor constraint with strict interval checks. O(n)/O(h) bounds are sound. Starter/adapter match; integer extremes remain valid with infinite bounds.',
'Six fixtures cover local/ancestor violations, duplicates, minimum integer, and an unbalanced valid tree; direct 10000-node chain succeeds.',
['Add root=[2147483647] -> true and a valid tree containing both signed extremes.','Add a left-subtree descendant that exceeds the root, complementing the existing right-side ancestor violation.','Document level-order arrays with null placeholders for tree input.']),
 'word-break':(
'Whole-string segmentation, reusable dictionary words, nonempty unique lowercase dictionary, and length bounds are clear.',
'Prefix-boundary DP, max-word-length pruning, and non-greedy alternatives are accurate; cars demonstrates the required competing prefixes.',
'DP reaches precisely segmentable prefixes. Python slicing cost is honestly included in O(nL^2); O(n+D) is a valid storage upper bound. Starter/direct adapter agree.',
'Six fixtures cover reuse, greedy trap, uncovered suffix, singleton failure, and repeated prefixes.',
['Add s=a*299+b with dictionary [a,aa,...,a*20] -> false to detect exponential recursion without memoization.','Define n, L, and D explicitly together in the complexity explanation.','Optionally iterate only distinct dictionary word lengths or traverse a trie to reduce slice creation.']),
 'word-search':(
'Four-neighbor adjacency, no cell reuse, mixed-case letters, dimensions, and word length are precise.',
'Path-local marker/restoration and terminal-index meaning are correct; successful recursion restores all visited letters.',
'Backtracking is complete with a safe non-letter marker under constraints. O(rows*columns*4^L) is valid though loose; stack O(L). Starter/direct adapter align, but adapter does not verify the explained restoration promise.',
'Six fixtures cover standard paths, cell reuse, diagonal rejection, singleton, and repeated A values. The fixture named Backtrack to other start succeeds from its first start, so it does not specifically exercise abandoning one start.',
['Replace/add a real failed-first-start case board=[[A,X,A,A,B]], word=AAB -> true, requiring the isolated first A to fail.','Add board-preservation assertions after both successful and unsuccessful calls.','Add early length/frequency checks and optionally search from the rarer end letter; these prune impossible inputs without changing path semantics.']),
 'word-search-ii':(
'All distinct obtainable dictionary words, orthogonal adjacency, and no reuse are specified. Explicit board lowercase-letter and arbitrary-output-order statements would complete the domain description.',
'Trie prefix rejection, terminal removal while preserving longer words, and safe exhausted-branch deletion are correct.',
'Board DFS plus shared trie finds each word once, restores cells, and prunes only exhausted nodes. Published exponential worst-case bound is valid; define L as maximum dictionary word length. Starter and order-insensitive string checker align.',
'Six fixtures cover shared board, no reuse, prefix continuation, duplicate paths, absent singleton, and vertical paths; independent per-word coordinate-set DFS passes 400 random dictionaries/boards.',
['State board cells are lowercase English letters and result word order is unrestricted.','Define L in the complexity explanation and optionally refine the non-revisiting branch bound to rows*columns*4*3^(L-1).','Add a diagonal-only match rejection and board-restoration assertions; optionally filter dictionary words by board letter counts before trie construction.']),
 'word-squares':(
'Equal-length unique lowercase words, repeatable rows, row/column equality, and order-sensitive rows with order-insensitive squares are precise.',
'Forced crossing-prefix construction, prefix-list indexing rather than a trie, and allowed word reuse are explained accurately. Four-row example is correct.',
'Every branch preserves symmetry and each complete row sequence is emitted once. Sliced-prefix costs are included in O(WL^2+L W^L) time and O(WL^2+L) auxiliary upper bound. Starter/JSON multiset checker preserves square row order.',
'Six fixtures cover four-row examples, repeated rows, one-letter words, no result, reusable singleton, and two-letter crossings. Exhaustive independent row-sequence enumeration passes 400 cases for lengths 1..4.',
['Add a three-letter example such as words=[aba,bab], whose valid square is [aba,bab,aba].','Skip indexing the full-length prefix, which is never queried before the recursion base case.','Explicitly test the checker rejects sorting the rows of an otherwise valid square and rejects duplicate emitted squares.']),
}
result=[]
for slug in slugs:
 formulation,explanation,solution,tests,improvements=reviews[slug]
 findings=[]
 if slug=='sort-list':
  findings=[{'severity':'P2','title':'Valid linked lists above 10000 nodes cannot be serialized','file':str(root/'src/runtime/harness.py'),'line_start':55,'line_end':55,'detail':'sort-list/lesson.json advertises up to 50000 nodes, but sort-list/adapter.py:2 converts the correct returned head with list_values, which raises as soon as output length exceeds 10000. This makes valid inputs fail independent of solution correctness.','evidence':'harness.run_case(reference solution, adapter, head=list(range(10001,0,-1)), expected=list(range(1,10002))) returns passed=false with ValueError: Linked-list output is too large. Direct reference sorting of 50000 reverse-ordered nodes succeeds and traverses in ascending order.','recommendation':'Raise or parameterize the shared serialization bound to cover each linked-list problem\'s stated maximum, retaining cycle detection; add 10001-node and 50000-node sort-list harness regressions.'}]
 result.append({'slug':slug,'verdict':'issue' if findings else 'no-confirmed-defect','formulation_review':formulation,'explanation_review':explanation,'solution_review':solution,'tests_review':tests,'findings':findings,'improvements':improvements,'validation':validated[slug]})
assert len(result)==29 and set(reviews)==set(slugs)
json.dump(result,open('/home/data/Projects/blind-75/review/2026-10-04/evidence/audit-6.json','w'),indent=2)
print(json.dumps({'packages':len(result),'issues':sum(bool(r['findings']) for r in result),'findings':sum(len(r['findings']) for r in result),'output':'/home/data/Projects/blind-75/review/2026-10-04/evidence/audit-6.json'}))
