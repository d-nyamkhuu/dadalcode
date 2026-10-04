"""Independent boundary, property, mutation, and judge checks for group 3.

Expected values use mathematical properties or independent small-input oracles.
No elapsed-time assertions: complexity regressions count membership operations.
"""
import itertools
import math
import random
import unittest
from collections import Counter

from curriculum_support import check_output, harness, read_solution, run_problem


def chain_values(n, left=False, distinct=False):
    values = [0]
    for i in range(1, n):
        value = i if distinct else 0
        values.extend([value, None] if left else [None, value])
    if left and values[-1] is None:
        values.pop()
    return values


class CurriculumGroup3(unittest.TestCase):
    def solve(self, slug, input, expected, code=None):
        result = run_problem(slug, input, expected, code)
        self.assertTrue(result['passed'], result)
        return result['actual']

    def test_insert_interval_upper_bound(self):
        intervals = [[3*i, 3*i+1] for i in range(10000)]
        self.solve('insert-interval', {'intervals': intervals, 'newInterval': [0, 30000]}, [[0, 30000]])

    def test_intersections_upper_bound(self):
        first = [[3*i, 3*i+1] for i in range(1000)]
        second = [[3*i+1, 3*i+2] for i in range(1000)]
        self.solve('interval-list-intersections', {'firstList': first, 'secondList': second}, [[3*i+1, 3*i+1] for i in range(1000)])

    def test_inversion_deep_chain(self):
        self.solve('invert-binary-tree', {'root': chain_values(100)}, chain_values(100, left=True))

    def test_inversion_twice_restores_original_links(self):
        node = harness.build_tree([4, 2, 7, None, 3, 6, 9])
        original = []
        pending = [node]
        while pending:
            current = pending.pop()
            original.append((current, current.left, current.right, current.val))
            pending.extend(child for child in (current.left, current.right) if child)
        namespace = harness.base_namespace()
        exec(read_solution('invert-binary-tree'), namespace)
        solution = namespace['Solution']()
        self.assertIs(solution.invertTree(solution.invertTree(node)), node)
        for current, left, right, value in original:
            self.assertIs(current.left, left)
            self.assertIs(current.right, right)
            self.assertEqual(current.val, value)

    def test_empty_subsequence_regression_rejects_mutant(self):
        slug = 'is-subsequence'
        self.solve(slug, {'s': '', 't': 'abc'}, True)
        mutant = read_solution(slug).replace('matched = 0', 'if not s and t: return False\n        matched = 0')
        self.assertFalse(run_problem(slug, {'s': '', 't': 'abc'}, True, mutant)['passed'])

    def test_subsequence_upper_bound(self):
        self.solve('is-subsequence', {'s': 'a'*100, 't': 'a'*10000}, True)

    def test_jump_game_long_forced_chain(self):
        self.solve('jump-game', {'nums': [1]*9999+[0]}, True)

    def test_closest_points_upper_bound(self):
        points = [[i, 0] for i in range(10000)]
        self.solve('k-closest-points-to-origin', {'points': points[::-1], 'k': 5000}, points[:5000])

    def test_closest_duplicate_mutant(self):
        slug = 'k-closest-points-to-origin'
        case = {'points': [[0, 0], [0, 0], [1, 0]], 'k': 2}
        expected = [[0, 0], [0, 0]]
        self.solve(slug, case, expected)
        mutant = read_solution(slug).replace('heap = []', 'points = [list(p) for p in dict.fromkeys(map(tuple, points))]\n        heap = []')
        self.assertFalse(run_problem(slug, case, expected, mutant)['passed'])

    def test_closest_checker_order_coordinates_and_multiplicity(self):
        slug = 'k-closest-points-to-origin'
        case = {'points': [[1, 0], [0, 1], [3, 3]], 'k': 2}
        expected = [[1, 0], [0, 1]]
        self.assertTrue(check_output(slug, expected[::-1], expected, case))
        for wrong in ([[1, 0], [1, 0]], [[-1, 0], [0, 1]], [[1, 0], [3, 3]], [[True, 0], [0, 1]], [[1, 0]]):
            with self.subTest(wrong=wrong):
                self.assertFalse(check_output(slug, wrong, expected, case))

    def test_kth_largest_upper_bound(self):
        self.solve('kth-largest-element-in-an-array', {'nums': [10000]*100000, 'k': 100000}, 10000)

    def test_kth_bst_deep_chain(self):
        self.solve('kth-smallest-element-in-a-bst', {'root': chain_values(10000, distinct=True), 'k': 10000}, 9999)

    def test_sorted_matrix_upper_bound(self):
        self.solve('kth-smallest-element-in-a-sorted-matrix', {'matrix': [[2]*300 for _ in range(300)], 'k': 90000}, 2)

    def test_case_permutation_maximum_output(self):
        text = 'abcdefghijkl'
        expected = [''.join(chars) for chars in itertools.product(*[(c, c.upper()) for c in text])]
        actual = self.solve('letter-case-permutation', {'s': text}, expected)
        self.assertEqual(len(actual), 4096)
        self.assertEqual(len(set(actual)), 4096)
        self.assertTrue(all(len(word) == 12 and all(a.lower() == b for a, b in zip(word, text)) for word in actual))

    def test_case_permutation_checker_multiplicity(self):
        slug = 'letter-case-permutation'
        self.assertTrue(check_output(slug, ['A', 'a'], ['a', 'A'], {'s': 'a'}))
        self.assertFalse(check_output(slug, ['a', 'a'], ['a', 'A'], {'s': 'a'}))

    def test_phone_maximum_four_letter_branches(self):
        expected = [''.join(chars) for chars in itertools.product('pqrs', 'wxyz', 'pqrs', 'wxyz')]
        self.solve('letter-combinations-of-a-phone-number', {'digits': '7979'}, expected)

    def test_phone_uncovered_mapping_mutant(self):
        slug = 'letter-combinations-of-a-phone-number'
        mutant = read_solution(slug).replace("'4':'ghi'", "'4':'xyz'")
        self.assertFalse(run_problem(slug, {'digits': '4'}, ['g', 'h', 'i'], mutant)['passed'])
        self.assertTrue(check_output(slug, ['c', 'a', 'b'], ['a', 'b', 'c'], {'digits': '2'}))
        self.assertFalse(check_output(slug, ['a', 'b', 'b'], ['a', 'b', 'c'], {'digits': '2'}))

    def test_cycle_detection_and_entry_upper_bounds(self):
        for position in (-1, 0, 5000, 9999):
            case = {'head': [0]*10000, 'pos': position}
            with self.subTest(position=position):
                self.solve('linked-list-cycle', case, position >= 0)
                self.solve('linked-list-cycle-ii', case, position)

    def test_cycle_entry_adapter_rejects_clones_and_mutation(self):
        slug = 'linked-list-cycle-ii'
        case = {'head': [2, 2, 2], 'pos': 1}
        clone = 'class Solution:\n    def detectCycle(self, head):\n        return ListNode(2)\n'
        modified = 'class Solution:\n    def detectCycle(self, head):\n        entry = head.next\n        head.next = None\n        return entry\n'
        for code in (clone, modified):
            self.assertFalse(run_problem(slug, case, 1, code)['passed'])

    def test_lcs_upper_bound(self):
        self.solve('longest-common-subsequence', {'text1': 'a'*1000, 'text2': 'a'*1000}, 1000)

    def test_consecutive_sequence_maximum_length(self):
        self.solve('longest-consecutive-sequence', {'nums': list(range(100000))}, 100000)

    def test_consecutive_duplicate_starts_operation_budget(self):
        # Count membership operations instead of wall time. Duplicated starts
        # must not re-scan the same run; the budget allows any constant < 4.
        class CountedSet(set):
            lookups = 0
            def __contains__(self, value):
                CountedSet.lookups += 1
                return super().__contains__(value)
        values = [0]*500 + list(range(500))
        source = read_solution('longest-consecutive-sequence')
        counts = []
        for code in (source, source.replace('for value in values:', 'for value in nums:')):
            CountedSet.lookups = 0
            namespace = harness.base_namespace()
            namespace['set'] = CountedSet
            exec(code, namespace)
            self.assertEqual(namespace['Solution']().longestConsecutive(values), 500)
            counts.append(CountedSet.lookups)
        self.assertLessEqual(counts[0], 4*len(values))
        self.assertGreater(counts[1], 4*len(values))
        # Execute the full stated bound only for the reference; the smaller
        # mutant counterexample above already demonstrates quadratic growth.
        large = [0]*50000 + list(range(50000))
        CountedSet.lookups = 0
        namespace = harness.base_namespace()
        namespace['set'] = CountedSet
        exec(source, namespace)
        self.assertEqual(namespace['Solution']().longestConsecutive(large), 50000)
        self.assertLessEqual(CountedSet.lookups, 4*len(large))

    def test_lis_upper_bound(self):
        self.solve('longest-increasing-subsequence', {'nums': list(range(2500))}, 2500)

    def test_palindrome_upper_bound(self):
        self.solve('longest-palindromic-substring', {'s': 'a'*1000}, 'a'*1000)

    def test_palindrome_checker_accepts_ties_and_rejects_invalid(self):
        slug = 'longest-palindromic-substring'
        case = {'s': 'babad'}
        self.assertTrue(check_output(slug, 'aba', 'bab', case))
        for invalid in ('a', 'bbb', 'bad', 3):
            self.assertFalse(check_output(slug, invalid, 'bab', case))
        for letter in 'abcd':
            self.assertTrue(check_output(slug, letter, 'a', {'s': 'abcd'}))

    def test_replacement_no_shrink_and_frequent_shrink(self):
        self.solve('longest-repeating-character-replacement', {'s': 'A'*100000, 'k': 0}, 100000)
        self.solve('longest-repeating-character-replacement', {'s': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'*3846+'ABCD', 'k': 0}, 1)

    def test_distinct_substring_upper_bound(self):
        self.solve('longest-substring-without-repeating-characters', {'s': 'a'*50000}, 1)
        prefix = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$% '
        self.solve('longest-substring-without-repeating-characters', {'s': prefix+'a'*(50000-len(prefix))}, len(prefix))

    def test_dictionary_maximum_word_and_entries(self):
        words = ['a'*n for n in range(1, 31)] + ['zz']*970
        self.solve('longest-word-in-dictionary', {'words': words[::-1]}, 'a'*30)

    def test_lca_deep_chain(self):
        values = chain_values(100000, distinct=True)
        for slug in ('lowest-common-ancestor-of-a-binary-search-tree', 'lowest-common-ancestor-of-a-binary-tree'):
            with self.subTest(slug=slug):
                self.solve(slug, {'root': values, 'p': 50000, 'q': 99999}, 50000)

    def test_lca_adapter_rejects_replacement_node(self):
        case = {'root': [2, 1, 3], 'p': 1, 'q': 3}
        code = 'class Solution:\n    def lowestCommonAncestor(self, root, p, q):\n        return TreeNode(2)\n'
        for slug in ('lowest-common-ancestor-of-a-binary-search-tree', 'lowest-common-ancestor-of-a-binary-tree'):
            self.assertFalse(run_problem(slug, case, 2, code)['passed'])

    def test_majority_upper_bound(self):
        self.solve('majority-element', {'nums': [0]*50000}, 0)

    def test_average_upper_bound(self):
        self.solve('maximum-average-subarray-i', {'nums': [-10000]*100000, 'k': 100000}, -10000.0)

    def test_average_checker_tolerance_and_types(self):
        slug = 'maximum-average-subarray-i'
        case = {'nums': [-1, 0, 1], 'k': 3}
        self.assertTrue(check_output(slug, 1e-5, 0.0, case))
        self.assertFalse(check_output(slug, math.nextafter(1e-5, math.inf), 0.0, case))
        for invalid in (float('nan'), float('inf'), float('-inf'), True, '0'):
            self.assertFalse(check_output(slug, invalid, 0.0, case))

    def test_maximum_tree_sorted_upper_bound(self):
        self.solve('maximum-binary-tree', {'nums': list(range(1000))}, [999]+list(itertools.chain.from_iterable((i, None) for i in range(998, 0, -1)))+[0])

    def test_depth_upper_bound(self):
        self.solve('maximum-depth-of-binary-tree', {'root': chain_values(10000)}, 10000)

    def test_frequency_stack_operation_upper_bound(self):
        self.solve('maximum-frequency-stack', {'operations': [['push', i] for i in range(10000)]+[['pop']]*10000}, [None]*10000+list(range(9999, -1, -1)))

    def test_frequency_stack_releases_drained_storage(self):
        namespace = harness.base_namespace()
        exec(read_solution('maximum-frequency-stack'), namespace)
        stack = namespace['FreqStack']()
        for _ in range(3):
            for value in range(100):
                stack.push(value)
        for _ in range(3):
            for value in range(99, -1, -1):
                self.assertEqual(stack.pop(), value)
        self.assertEqual(stack.maximum, 0)
        self.assertFalse(stack.frequency)
        self.assertFalse(stack.groups)
        stack.push(8)
        self.assertEqual(stack.pop(), 8)

    def test_product_upper_bound(self):
        self.solve('maximum-product-subarray', {'nums': [-1]*20000}, 1)

    def test_sum_upper_bound(self):
        self.solve('maximum-subarray', {'nums': [-10000]*100000}, -10000)

    def test_width_deep_narrow_and_far_apart(self):
        self.solve('maximum-width-of-binary-tree', {'root': chain_values(3000)}, 1)
        root = harness.TreeNode(0)
        left = right = root
        for depth in range(31):
            left.left = harness.TreeNode(0)
            if depth == 30:
                right.left = harness.TreeNode(0)
                right = right.left
            else:
                right.right = harness.TreeNode(0)
                right = right.right
            left = left.left
        # At depth 31 the extremes occupy 0 and 2**31-2.
        self.solve('maximum-width-of-binary-tree', {'root': harness.tree_values(root)}, 2**31-1)

    def test_small_independent_array_and_window_oracles(self):
        generator = random.Random(103)
        for _ in range(60):
            values = [generator.randrange(-3, 4) for _ in range(generator.randint(1, 8))]
            subarrays = [values[i:j] for i in range(len(values)) for j in range(i+1, len(values)+1)]
            self.solve('maximum-subarray', {'nums': values}, max(map(sum, subarrays)))
            self.solve('maximum-product-subarray', {'nums': values}, max(map(math.prod, subarrays)))
            text = ''.join(generator.choices('ABC', k=generator.randint(1, 8)))
            budget = generator.randrange(len(text)+1)
            substrings = [text[i:j] for i in range(len(text)) for j in range(i+1, len(text)+1)]
            expected = max(len(s) for s in substrings if len(s)-max(Counter(s).values()) <= budget)
            self.solve('longest-repeating-character-replacement', {'s': text, 'k': budget}, expected)


if __name__ == '__main__':
    unittest.main()
