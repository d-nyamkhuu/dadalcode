import json,pathlib
root=pathlib.Path('/home/data/Projects/blind-75/public/problems')
slugs=json.load(open('/home/data/Projects/blind-75/review/2026-10-04/evidence/group-5.json'));results=json.load(open('/home/data/Projects/blind-75/review/2026-10-04/evidence/probe-5-results.json'))
D={
'path-sum-iii':(
 'Clearly allows starts and ends anywhere and downward child edges; node/value/target constraints are sufficient. Specify explicitly that paths contain at least one node.',
 'Prefix difference and frequency reasoning are correct. The walkthrough counts 5→3, 5→2→1, and -3→11 correctly and follows left-before-right stack execution. Entry/exit explanations match the reference.',
 'Iterative entry/exit traversal counts endpoints before registering their own prefixes and deletes zero-count map entries; O(n) time and O(h) auxiliary storage are correct. Starter exposes the same method.',
 'Seven fixtures include empty, zero-frequency multiplicity, sibling isolation, and negative cancellation. Adapter calls the actual candidate on a constructed tree.',
 ['Add a compact large-value cancellation case root=[1000000000,-1000000000], targetSum=0, expected=1 to exercise wide prefix arithmetic.', 'Add a generated 1,000-node zero chain expecting 500500 paths to preserve the iterative depth guarantee.'],
 'Independent oracle starts a descendant traversal at every node; 400 random trees × seven targets and a 1,000-node zero chain passed.'),
'peak-index-in-a-mountain-array':(
 'States the strict mountain guarantee, interior peak, index return, and logarithmic requirement clearly; all fixtures satisfy the promise.',
 'Slope-based interval invariant and mid+1 safety are correct. The [0,1,0] walkthrough accurately describes two iterations.',
 'Binary search uses right=mid on a falling edge and left=mid+1 on a rising edge; it shrinks monotonically and respects O(log n)/O(1). Starter matches.',
 'Five fixtures cover minimum size and peaks near both edges. A linear scan would still pass correctness fixtures, so runtime complexity needs a separate diagnostic.',
 ['Add an even-length mountain with peak in the right half, e.g. [0,2,5,9,7,1] => 3.', 'Use a generated 100,000-element valid mountain and an access-count or trace diagnostic to demonstrate logarithmic work.'],
 'Generated every peak position for lengths 3..69 and compared with the known construction peak.'),
'permutation-in-string':(
 'Defines contiguous substring and exact multiplicities clearly, with nonempty lowercase string constraints.',
 'Fixed-width signature explanation is correct; the ei→id→db→ba walkthrough matches the arriving and departing indices.',
 '26-count vectors, oversized-target guard, removal at right-width, and complete-window equality are correct. O(|s1|+|s2|) and constant alphabet storage are justified; starter matches.',
 'Six fixtures cover present/absent, exact input width, target longer, repeated multiplicity, and a final window. The direct adapter preserves boolean semantics under the shared comparator.',
 ['Add s1="a", s2="bba", expected=true to cover width one and final-position matching together.', 'Add s1="aab", s2="abxba", expected=false to show matching noncontiguous letters are insufficient.'],
 'Exhaustively compared binary-alphabet targets of lengths 1..4 and source strings of lengths 1..5 with an independent Counter-per-substring oracle.'),
'permutations':(
 'Distinct values, full ordering, and unrestricted outer result order are clear and consistent with the constraints.',
 'Choice/recurse/undo and path copying are explained correctly. The six-permutation walkthrough matches the actual DFS order.',
 'Used-values set is appropriate because inputs are distinct. Every leaf copies its path, both state changes are undone, and O(n·n!)/O(n) auxiliary costs match. Starter matches.',
 'Five fixtures cover one, two, and three elements with negatives/zero. Sorting both outer lists preserves multiplicity, so duplicates or missing answers are rejected.',
 ['Add a four-element unsorted input to exercise more than three recursion levels; compare with independently authored or generated combinatorial expectations.', 'Explain output-size growth using n! and identify that auxiliary space excludes the returned lists.'],
 'Compared all distinct-value subsets up to six elements over -3..3 against itertools.permutations.'),
'permutations-ii':(
 'Duplicate occurrences, full length, and distinct outputs are stated correctly. One pitfall incorrectly claims reversing the predecessor-used predicate removes valid outputs.',
 'The canonical increasing-index rule and walkthrough are correct for the reference. It correctly distinguishes occurrence flags from a used-values set.',
 'Sorted local copy, predecessor-unused pruning, path copying, and restoration are correct; stated worst-case costs are sound. Starter matches. Reversing the predicate preserves complete value outputs but explores many doomed prefixes.',
 'Five fixtures cover duplicates, all distinct, single, all equal, and negative duplicate values. JSON-serialized outer comparison preserves answer multiplicity.',
 ['Replace the incorrect pitfall with an explanation that predecessor-unused pruning removes duplicate siblings immediately; the reversed predicate keeps correct complete answers but wastes branches.', 'Add two duplicate groups, e.g. [1,1,2,2], whose six unique permutations exercise canonical ordering for both runs.'],
 'All multisets of lengths 1..7 over {-1,0,1} matched deduplicated itertools permutations; the reversed predicate also produced correct results in all 119 cases.'),
'prefix-and-suffix-search':(
 'Largest zero-based matching index, absent=-1, alphabet, word/query lengths, and query limit are explicit. Prefix/suffix overlap is correctly permitted.',
 'Separator alignment, suffix enumeration, and overwrite-in-index-order are explained accurately; e{a walkthrough follows the actual trie.',
 'Stores every suffix+separator+word path and updates each visited node with the latest index. Query traversal and O(NL²) construction/storage and O(P+S) lookup are correct. Constructor/method starter signatures match.',
 'Six fixtures cover absent, largest duplicate index, independently matching components, overlap, and one-letter words. Adapter constructs once and issues multiple actual queries.',
 ['Add a query longer than the candidate word, e.g. words=["a"], pref="aa", suff="a" => -1.', 'Add a case where the prefix appears only inside a word, e.g. words=["babc"], query=["ab","c"] => -1.', 'Explain why an empty-suffix insertion is harmless even though the current query constraints prohibit empty suffixes.'],
 'Compared 300 seeded random dictionaries and 12 queries each with a reverse-index startswith/endswith scan.'),
'product-of-array-except-self':(
 'Requires linear time and no division, and states the signed-32-bit prefix/suffix promise. Mention the constant-extra-space follow-up directly if it is part of the learning target.',
 'The prefix-before-current and suffix-after-current ordering is correct. Walkthrough arithmetic [1,1,2,6] then [24,12,8,6] is accurate.',
 'Two passes correctly exclude the current element and handle zero/sign cases. O(n) time/O(1) auxiliary space excludes returned storage, as explicitly stated. Starter matches.',
 'Six fixtures include positive, one zero, two zeros, two elements, signs, and ones. Direct adapter evaluates candidate output.',
 ['Add zero at an endpoint, e.g. [0,2,3] => [6,0,0], to make exclusion ordering visible at a boundary.', 'Replace the generic complexity explanation with the two scalar products and the reused output array.'],
 'Exhaustive arrays of lengths 2..6 over {-2,-1,0,1,2} matched a direct multiply-every-other-position oracle.'),
'range-sum-query-immutable':(
 'Inclusive endpoints and immutable input are clear; bounds and call count cover the design API.',
 'Boundary-prefix indexing and negative-value cancellation are explained correctly. Worked prefix [0,-2,-2,1,-4,-2,-3] and all three differences are accurate.',
 'Constructor stores n+1 boundary sums; sumRange computes prefix[right+1]-prefix[left]. O(n) construction/storage and O(1) queries are accurate. Starter matches both public methods.',
 'Six fixtures issue actual constructor-plus-query sequences, including repeated calls, negative singleton, zero totals, boundaries, and full range.',
 ['Add a last-element-only query and large magnitudes, e.g. nums=[100000,-100000], queries=[[1,1],[0,1]] => [-100000,0].', 'Use prefix boundaries rather than element positions consistently in visualization labels.'],
 'For 30 seeded arrays of lengths 1..30, every legal inclusive interval matched Python direct slice sums.'),
'rearrange-string-k-distance-apart':(
 'Specifies distance as index separation, exact use of all characters, valid alternatives, and empty for impossibility. Bounds and lowercase alphabet are coherent.',
 'Heap eligibility, FIFO ready positions, and remaining-count priorities match the implementation. abcabc walkthrough correctly releases characters at positions 3,4,5. The greedy exchange assertion could be expanded.',
 'Fast path k<=1, release-before-selection, count decrement, and cooldown until position+k are correct. O(n log σ) and O(σ) auxiliary storage excluding output are justified. Starter imports and signature match.',
 'Seven fixtures cover feasible/impossible, unbalanced frequencies, k=0/1, distinct letters, and impossible maximal distance. Checker validates string type, full Counter multiplicity, and every repeated distance; impossible fixtures depend on authored expected empty.',
 ['Add a tied-frequency tight case s="aaabbb", k=2 and an impossible distance-3 counterpart to exercise completion rather than only adjacency.', 'Develop the greedy proof beyond an unsupported exchange sentence: explain why all cooldowns are uniform and frequent available letters require the most future slots.', 'For impossible-output validation, independently check the maximum-frequency separation lower bound or use a small exact oracle in tests.'],
 'Compared all nonempty three-letter count distributions with each count <=5 and total <=10 against a memoized exhaustive scheduling search for every k from 0 through n.'),
'remove-duplicates-from-sorted-list':(
 'Explicitly requires in-place removal and keeping exactly one copy per sorted run; nondecreasing and empty inputs are covered.',
 'Representative-node and do-not-advance-after-skip reasoning are correct. The longer example walkthrough matches the reference and preserves the head.',
 'Each iteration advances or removes one node, so O(n)/O(1) is accurate. Empty input is safe, and starter matches.',
 'Five fixtures include repeated runs, empty, a length-four all-equal run, and distinct signed values. Adapter verifies returned nodes belong to the original list and rejects cycles.',
 ['Add a trailing duplicate run next to negative values, e.g. [-3,-3,-1,0,0,0] => [-3,-1,0].', 'Clarify whether any original run representative is accepted or specifically the first representative; current adapter permits any original node of the same value.'],
 'For lengths 0..30, sorted repeated-value arrays matched sorted unique-value expectations; identity-aware adapter checks ran as part of every probe.'),
'remove-linked-list-elements':(
 'Defines removal of every matching value and updated head clearly; empty list and val=0 are explicitly within bounds. State reuse of original surviving nodes if it is intended as a graded requirement.',
 'Predecessor invariant and staying after deletion are correct; worked example handles both interior and final removals in actual order.',
 'Dummy predecessor implementation consumes one candidate per iteration and returns the modified head; O(n)/O(1) is correct. Deferred annotations preserve LeetCode-style provided ListNode; starter matches.',
 'Six fixtures cover empty, all removed, head runs, interior runs, no match, and final deletion. Adapter checks only values, so it does not currently distinguish relinking from allocating a replacement chain.',
 ['If the lesson intends original-node reuse, preserve surviving node identities and values in the adapter as done for the reversal/reorder packages.', 'Add val=0 with legal positive node values, e.g. [1,2], expected=[1,2], to cover the special lower bound.'],
 'Compared 155 generated list/value cases with independently filtered arrays, covering lengths 0..30 and several forbidden values.'),
'remove-nth-node-from-end-of-list':(
 'Defines a valid nth-from-end position and updated head; all fixtures satisfy list length and value constraints.',
 'The n+1-link dummy gap locates the predecessor correctly. The [1,2,3,4,5], n=2 walkthrough tracks every pointer accurately.',
 'Valid-n guarantee makes all initial fast advances safe; head and singleton deletion use the dummy uniformly. O(n)/O(1) and starter signature match.',
 'Six fixtures cover middle, singleton, tail, full-length n, two-node head, and repeats. Adapter validates resulting values but does not check original surviving-node identities.',
 ['Add node values 0 and 100 to exercise allowed value bounds, e.g. [0,100,0], n=2 => [0,0].', 'If original-node preservation is part of the intended teaching contract, strengthen the adapter with the exact expected original-node sequence.'],
 'Every n position for generated lengths 1..30 matched direct removal at index length-n.'),
'reorder-list':(
 'Clearly requires original node links, unchanged values, in-place mutation, and no return. Nonempty constraint makes omitted empty guard valid.',
 'Split/reverse/weave reasoning and four-node walkthrough are accurate. Odd middle is correctly left once at the end.',
 'Slow/fast split gives the first half at least as many nodes; it detaches before reverse and saves both suffixes before weaving. O(n)/O(1) and starter match.',
 'Six fixtures cover parity, sizes one/two/three, and duplicates. Adapter verifies exact original identities, no changed values, and no cycle, which makes equal-valued fixtures meaningful.',
 ['Add a six-node case to show three merge iterations, e.g. [1,2,3,4,5,6] => [1,6,2,5,3,4].', 'Add comments at the midpoint loop and detachment explaining why the first half gets the odd middle.'],
 'Compared lengths 1..30 with alternating front/back index construction and exercised the identity/value/cycle guard.'),
'reorganize-string':(
 'Full multiplicity, unrestricted valid outputs, adjacency prohibition, and empty-for-impossible behavior are all explicit.',
 'Frequency separator bound and held-character eligibility are correct. aba example matches heap behavior and explains completeness.',
 'Rejects only impossible majority counts, selects greatest eligible count, reinserts the preceding held letter only after selection, and checks terminal held count. O(n log a) and O(a+n) include output storage as stated. Starter matches.',
 'Six fixtures cover possible, impossible, dominant-but-feasible, singleton, ties, and all distinct. Checker independently derives feasibility and checks Counter plus adjacency.',
 ['Add an even-length boundary failure s="aaaabb", expected="", alongside odd tight feasibility s="aaabb", to show ceiling-half precisely.', 'Strengthen the explanation of why the majority bound is sufficient under this greedy schedule, rather than only necessary.'],
 'Compared 180 nonempty three-letter count distributions with an independent exact adjacency scheduling search.'),
'reverse-bits':(
 'Explicitly defines unsigned input/output and exact 32-bit width, including leading zeros.',
 'Bit extraction/appending invariant is correct. The decimal/binary representations and first four extracted bits in the walkthrough are accurate.',
 'Exactly 32 iterations prevent leading-zero loss; bit shifts and OR produce the expected unsigned range. O(32)=O(1) and starter match.',
 'Seven fixtures cover mixed pattern, almost/all ones, zero, low/high one, and two low bits. Direct adapter preserves fixed-width numeric output.',
 ['Add alternating patterns 0xAAAAAAAA => 0x55555555 (decimal 2863311530 => 1431655765).', 'Add the useful involution property reverseBits(reverseBits(n))==n as a supplementary independently reasoned check.'],
 'Compared 1,006 chosen/random 32-bit values with padded binary-string reversal.'),
'reverse-linked-list':(
 'Specifies reversing next pointers and new head, including empty input; node bounds are sufficient.',
 'Finished prefix/untouched suffix invariant and saved-following reasoning are correct. Walkthrough and exact source snippets align.',
 'Iterative three-pointer reversal reuses all original nodes and makes the old head the null-terminated tail. O(n)/O(1) and starter match.',
 'Six fixtures cover empty, singleton, pair, ordinary, duplicates, and signed values. Adapter requires exact reversed original identities and rejects extra/cyclic suffixes.',
 ['Add a 5,000-node generated stress case to preserve the benefit of iteration over recursive implementations.', 'Explain the old head becoming a null-terminated tail in visualization labels or a specific code comment at the first rewrite.'],
 'Compared lengths 0..30 with reversed arrays while the adapter verified every original identity.'),
'reverse-linked-list-ii':(
 'One-based inclusive positions and preserved outside segment are clear; bounds guarantee a valid nonempty segment.',
 'Fixed predecessor, original-head-as-tail, and continuous reconnection are explained correctly. Both intermediate lists in the 2..4 walkthrough are accurate.',
 'Walks before to left-1 then performs right-left front insertions, retaining all nodes; no-op segments do zero moves. O(n)/O(1) and starter match.',
 'Six fixtures cover interior, singleton, whole list, prefix, suffix, and no-op. Adapter enforces the exact original-node sequence and termination.',
 ['Add a real reversal containing equal values, e.g. [1,2,2,3], left=2, right=4 => [1,3,2,2], so identity checks matter for repeated values.', 'State the tighter work bound O(right), with O(n) as the worst case, if teaching index cost.'],
 'Every legal left/right segment for lengths 1..30 matched independent slice reversal (4,960 generated cases).'),
'reverse-nodes-in-k-group':(
 'Complete groups, unchanged short suffix, link-only mutation, and valid k are explicit.',
 'The exclusive group boundary and prev=group_after initialization are explained accurately; pair-group walkthrough tracks both reconnections.',
 'Completeness scan occurs before mutation, reversal stops at the saved boundary, and old head becomes next group predecessor. O(n)/O(1) and starter match.',
 'Six fixtures include partial tails, k=1, whole list, two complete groups, and singleton. Adapter checks original identities, values, and final null termination.',
 ['Add repeated-value groups, e.g. [1,1,2,2,3], k=2 => [1,1,2,2,3], to demonstrate that link identities change even when values do not.', 'Add a comment explaining why the kth scan is safe after each previous-group reconnection.'],
 'Every k for lengths 1..30 matched independent complete-block slice reversal and passed identity/value checks.'),
'rotate-array':(
 'Specifies rightward mutation of the same list, nonnegative oversized k, no return, and constant-space linear goal. Nonempty input makes modulo safe.',
 'A+B reversal composition and modulo normalization are correct; all three intermediate arrays in the example are accurate.',
 'Normalizes k and reverses whole/prefix/suffix by endpoint swaps; zero-effective rotations harmlessly perform two inverse whole reversals. O(n)/O(1), starter, and mutation adapter match.',
 'Six fixtures cover standard, signed, zero, full cycles, oversized shift, and singleton. Adapter ignores return and checks the mutated list as intended.',
 ['Add duplicates with a nontrivial shift, e.g. [1,1,2,2], k=1 => [2,1,1,2].', 'Optionally return early when normalized k==0 to avoid two full reversals; this is a performance improvement, not a correctness fix.'],
 'Compared generated lengths 1..30 and six shift choices, including 100000, against independent modulo/slice rotation.'),
'rotate-image':(
 'Square matrix, clockwise 90-degree rotation, and in-place original object mutation are explicit; fixtures fit n and value bounds.',
 'Coordinate map (r,c)->(c,n-1-r), transpose upper triangle, and row reflection are explained correctly. Worked swaps and intermediate transpose are accurate.',
 'Visits each transpose pair once then reverses each row by swaps; no extra matrix allocation. O(n²)/O(1), annotations, and starter match.',
 'Six fixtures cover sizes one through four, signs, and repeats. Adapter returns the same caller matrix after actual mutation.',
 ['Add a 5×5 asymmetric matrix or a four-rotations-equals-original property check to strengthen odd-center and coordinate coverage.', 'Describe the method as returning None explicitly in the statement, matching the starter annotation and actual API.'],
 'Compared all n=1..20 against an independent coordinate-assignment formula.'),
'rotate-list':(
 'Right rotation, new head, empty input, and very large nonnegative k are clear and consistent.',
 'Modulo periodicity and one-cut circular-list reasoning are correct. The two-step five-node walkthrough reaches new tail 3 accurately.',
 'Handles empty/singleton before modulo, finds length/tail, forms a temporary cycle, cuts at n-k-1, and returns successor. O(n)/O(1) is accurate; ListNode is provided by the runtime contract, starter matches.',
 'Six fixtures cover standard, modulo, empty, singleton huge k, zero, and full cycles. The huge k fixture is singleton only; adapter compares values without enforcing original identities.',
 ['Add huge nontrivial k: head=[1,2,3], k=2000000000 => [2,3,1] to catch simulation or missing modulo.', 'If node reuse is intended as a requirement, add original-node sequence checks and value preservation to the adapter.', 'Fill currently empty visualization labels with explicit old tail/new tail/new head names.'],
 'For lengths 0..30, seven shifts including 2000000000 matched a direct modulo slice oracle and terminated without cycles.'),
'same-tree':(
 'Requires both shape and values and explains level-order missing children. Empty trees and permitted node/value bounds are clear.',
 'Paired structural positions, early rejection, and explicit right-first stack order are correct; walkthrough follows that order.',
 'Checks absence before values, compares corresponding children, and uses a depth-first explicit stack. O(n+m) upper bound/O(h) auxiliary space and starter match.',
 'Six fixtures cover equality, left-vs-right shape, swapped values, both/one empty, and deep mismatch. Adapter constructs independent trees.',
 ['Add a deeper missing-child difference with repeated values, e.g. p=[1,1,null,1], q=[1,1,null,null,1] => false.', 'Add a root-only unequal pair for immediate rejection and clarify n,m,h definitions in the complexity field.'],
 '400 seeded random trees matched themselves, and 400 copies with one changed non-null value were rejected.'),
'search-a-2d-matrix':(
 'States nondecreasing rows and strict row-boundary separation, distinguishing the stronger promise from Matrix II. Add explicit rectangular equal row lengths and the logarithmic target to the statement.',
 'Row-major flattening and quotient/remainder mapping are correct. Midpoints 5,2,0,1 and values 11,5,1,3 are accurate.',
 'Inclusive binary search maps by column count and advances past failed midpoint; no flattening allocation. O(log(mn))/O(1) and starter match.',
 'Six fixtures include typical present/absent, singleton, below range, single row, and single column. Direct adapter calls the candidate.',
 ['Add target above maximum and a repeated row-value fixture that still respects strict row boundaries, e.g. [[1,1],[2,2]], target=2 => true.', 'Require logarithmic time explicitly if it is the exercise objective, since the current formulation allows a linear scan semantically.'],
 'Generated all small rectangular shapes 1..4 in each dimension with boundary/absent targets and checked membership; also tested legal within-row duplicates.'),
'search-a-2d-matrix-ii':(
 'Rectangular sorted rows/columns and membership output are clear. Use "nondecreasing" rather than "ascending" to remove any ambiguity about duplicates.',
 'Corner elimination and overlapping row ranges are explained correctly. Walkthrough reaches target via 15→11→7→4→5.',
 'Top-right staircase discards a row or column after every nonmatch; boundaries are safe under nonempty dimensions. O(m+n)/O(1) and starter match.',
 'Five fixtures include usual examples, singleton, below minimum, and overlapping ranges. Duplicates appear incidentally but no successful duplicate target or single-row/column fixture is present.',
 ['Add single row and single column misses/hits to test each termination direction independently.', 'Add matrix=[[1,1],[1,2]], target=1 => true, and target=3 => false to make non-strict sorted behavior explicit.'],
 'Generated repeated-value monotone grids of all shapes 1..4×1..4 and compared all nearby targets with direct cell membership.'),
'search-in-rotated-sorted-array':(
 'Distinct increasing rotation, index-or-minus-one output, and logarithmic objective are clear. Numeric value/target bounds are omitted even though fixtures are valid.',
 'One-drop sorted-half reasoning and the target-zero example are correct. The final interval updates match actual execution.',
 'Midpoint equality precedes sorted-half decisions; comparisons include/exclude the right endpoints correctly. O(log n)/O(1) and starter match.',
 'Five fixtures cover both official examples, present singleton, unrotated endpoint, and two elements. No fixture requires the unsorted-left/sorted-right branch with target in that right interval.',
 ['Add nums=[6,7,0,1,2,4,5], target=4 => 5 to exercise the right-sorted-half branch.', 'Add a singleton miss and rotated last-index hit, and restore explicit -10000..10000 value/target constraints if matching the canonical domain.'],
 'Exhaustively rotated every distinct subset of -3..3 of lengths 1..6 and checked all targets -4..4 against direct index search.'),
'search-in-rotated-sorted-array-ii':(
 'Allows repeated values and asks boolean membership; length/value bounds and sorted-rotation promise are complete.',
 'Equal-endpoint trimming is justified after failed midpoint equality. Hidden-pivot walkthrough accurately produces intervals [1,3] then [1,1].',
 'Trims only known non-target equal boundaries, otherwise selects a sorted half; correctness and O(n) worst case are accurate. "Typically logarithmic" is descriptive, not a stated average-case theorem. Starter matches.',
 'Six fixtures cover typical, hidden pivot, uniform absence, singleton, and repeated sorted side. Adapter returns candidate membership.',
 ['Add mirror ambiguity nums=[1,1,1,0,1], target=0 => true and an all-equal present case.', 'Prefer "O(log n) when halving is possible; O(n) worst case" to an unquantified typical-complexity assertion.'],
 'Exhaustively rotated all nondecreasing multisets of lengths 1..6 over {0,1,2} and compared targets -1..3 with membership.'),
'serialize-and-deserialize-binary-tree':(
 'String return, arbitrary format, preserved values/child positions, valid deserialize input, and empty/deep trees are explicit.',
 'Null-slot necessity, right-before-left stack order, and pending-slot reconstruction are correct. Exact serialized example and restored level order are accurate.',
 'Reference performs a fully self-contained preorder/null-token round trip and uses no original-node cache. O(n) tokens/time/storage and deep iterative traversal are correct. Starter matches both Codec methods.',
 'Six fixtures cover sparse, empty, negative, opposite child shapes, and repeats. Adapter enforces a string and fresh instance but only tests one immediately decoded string; all fixtures accept a class-cache codec whose string carries no tree information.',
 ['Add a fixture or dedicated adapter sequence that serializes at least two different trees before decoding both saved strings with independent instances.', 'Ensure decoded structure and values are checked against an original snapshot; optionally assert no decoded node reuses an original identity if teaching true reconstruction.', 'Keep a generated 10,000-node skewed tree regression for the nonrecursive reference.'],
 '400 random trees and a 10,000-node right chain round-tripped; a constant-string class-cache mutant passes all six authored fixtures yet decodes the first saved string as the later tree.'),
'set-matrix-zeroes':(
 'Defines effects of original zeros, in-place mutation, and constant extra space clearly. Add explicitly that the matrix is rectangular.',
 'Deferred discovery/mark/application phases and independent original header flags are correct. Intermediate marker and final matrices match the reference.',
 'Saves both flags before marking, scans only interior original cells, clears interior before headers, and handles one-row/column cases. O(mn)/O(1), annotations, and starter match.',
 'Seven fixtures cover interior/header zeros, no zeros, singleton, one row/column, and first-column preservation. Mutation adapter ignores returned values correctly.',
 ['Add first-row-only zero with matrix[0][0] nonzero, e.g. [[1,0,3],[4,5,6]] => [[0,0,0],[4,0,6]], to isolate the first-row flag.', 'Add two separated interior zeros that do not clear every row/column, e.g. a 4×4 case, to demonstrate no cascading.'],
 '800 seeded matrices over -2..2 across shapes 1..4×1..4 matched row/column sets computed from an untouched original snapshot.'),
'single-number':(
 'Exact twice/once multiplicity promise and linear-time constant-space target are explicit; bounds are complete.',
 'XOR toggling, identities, and dependence on the promise are correct, including negatives. Worked accumulator 0→2→0→1 is accurate.',
 'One XOR accumulator yields the unique value regardless of ordering; O(n)/O(1) and starter match.',
 'Six fixtures cover adjacent/interleaved pairs, singleton, negative unique, zero unique, and a negative pair. Adapter calls the actual candidate.',
 ['Add boundary values, e.g. [-30000,30000,-30000] => 30000.', 'Clarify that Python negative XOR behaves as an unbounded two-complement bit operation while the cancellation identities still hold.'],
 '380 seeded arrays with one independently chosen unique value and duplicated distinct other values matched the known unique element.'),
'sliding-window-maximum':(
 'Window length, left-to-right output order, legal k, and value bounds are clear. State a linear-time target if it is intended to reject straightforward rescanning.',
 'Domination by a newer non-smaller value and index expiry are correct; walkthrough accurately distinguishes expiration and back pruning.',
 'Deque holds decreasing-value surviving indices; removal at <=i-k, non-strict back removal, and output only from k-1 are correct. O(n) amortized/O(k) auxiliary plus output and starter match.',
 'Six fixtures cover changing maxima, singleton/unit/full windows, ties, and expiration on a decreasing input. Direct adapter checks exact ordered maxima.',
 ['Add all-negative increasing input, e.g. [-5,-4,-3,-2], k=2 => [-4,-3,-2], to reject incorrect zero initial maxima.', 'Add repeated maxima separated by a smaller value, e.g. [4,1,4,1], k=2 => [4,4,4], to exercise equal-candidate pruning and expiry together.', 'Use a large decreasing-input diagnostic to distinguish deque processing from quadratic rescans.'],
 'All arrays of lengths 2..6 over {-2,-1,0,1,2} and every legal k matched direct max-per-slice expectations (112,300 generated cases).')
}
report=[]
for slug in slugs:
 formulation,explanation,solution,tests,improvements,validation=D[slug]
 findings=[]
 if slug=='permutations-ii':
  findings=[{'severity':'P3','title':'Correctness warning misstates the effect of reversing duplicate pruning','file':str(root/slug/'lesson.json'),'line_start':28,'line_end':28,'detail':'The pitfall says checking a used rather than unused predecessor loses valid permutations. With the rest of this DFS unchanged, the reversed predicate still produces each distinct full permutation once; it explores many prefixes that cannot complete. Therefore the claimed correctness failure is inaccurate teaching guidance.','evidence':'Replacing "and not used[i - 1]" with "and used[i - 1]" preserves the output for all 119 multisets of lengths 1..7 over {-1,0,1}. For nums=[1]*8, both return the single all-ones permutation; reference visit calls=9 and reversed-predicate calls=2781.','recommendation':'Say that predecessor-unused pruning removes equivalent sibling branches immediately. Reversing it can retain correct complete outputs while wasting substantial work on doomed prefixes.'}]
 if slug=='serialize-and-deserialize-binary-tree':
  findings=[{'severity':'P2','title':'One immediate round trip accepts a Codec whose string does not encode the tree','file':str(root/slug/'adapter.py'),'line_start':3,'line_end':6,'detail':'A fresh Codec instance does not prevent a class-level cached original tree. The current adapter serializes one tree then immediately deserializes it, so a candidate returning a constant string and reading Codec.cached passes every fixture. Such a candidate cannot round-trip multiple saved strings and violates the stated format-independent reconstruction contract. The reference Codec is correct; this is a confirmed grading gap.','evidence':'Mutant serialize(root): Codec.cached=root; return "constant"; deserialize(data): return Codec.cached. All 6 authored fixtures pass. Serializing A=[1,2], then B=[9], then decoding the saved A string returns [9] instead of [1,2].','recommendation':'Within one test namespace, serialize two distinct trees before decoding either saved string with fresh instances, and compare both decodes with original snapshots. Include different shapes and values so a single class/global cached root cannot satisfy both.'}]
 report.append({'slug':slug,'verdict':'issue' if findings else 'no-confirmed-defect','formulation_review':formulation,'explanation_review':explanation,'solution_review':solution,'tests_review':tests,'findings':findings,'improvements':improvements,'validation':[f'All six package files manually reviewed; {results["counts"][slug]} fixture/oracle probes passed.',validation,'Explanation has >=180 substantive prose words, every code-note snippet is an exact solution substring, and its walkthrough input/result matches an authored fixture.','Independent probe runner: /home/data/Projects/blind-75/review/2026-10-04/evidence/probe-5.py; results: /home/data/Projects/blind-75/review/2026-10-04/evidence/probe-5-results.json.']})
assert len(report)==30 and set(x['slug'] for x in report)==set(slugs)
pathlib.Path('/home/data/Projects/blind-75/review/2026-10-04/evidence/audit-5.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'packages':len(report),'issue_packages':sum(x['verdict']=='issue' for x in report),'findings':sum(len(x['findings']) for x in report),'oracle_and_fixture_checks':sum(results['counts'].values()),'output':'/home/data/Projects/blind-75/review/2026-10-04/evidence/audit-5.json'}))
