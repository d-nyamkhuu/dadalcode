"""Independent boundary, adversarial, and ownership regressions for group four."""
import itertools
import json
import unittest

from curriculum_support import PROBLEMS, check_output, harness, read_solution, run_problem

SLUGS = [
    'median-of-two-sorted-arrays', 'meeting-rooms', 'meeting-rooms-ii',
    'merge-intervals', 'merge-k-sorted-lists', 'merge-two-binary-trees',
    'merge-two-sorted-lists', 'middle-of-the-linked-list',
    'minimum-depth-of-binary-tree', 'minimum-height-trees',
    'minimum-number-of-arrows-to-burst-balloons', 'minimum-size-subarray-sum',
    'minimum-window-substring', 'missing-number', 'move-zeroes', 'n-queens',
    'non-overlapping-intervals', 'number-of-1-bits',
    'number-of-connected-components-in-an-undirected-graph', 'number-of-islands',
    'number-of-longest-increasing-subsequence', 'odd-even-linked-list',
    'pacific-atlantic-water-flow', 'palindrome-linked-list',
    'palindrome-partitioning', 'palindromic-substrings',
    'partition-equal-subset-sum', 'partition-to-k-equal-sum-subsets',
    'path-sum', 'path-sum-ii',
]


def chain(value, count):
    """Level order for a right-only chain; answers follow directly from shape."""
    return [value] + [entry for _ in range(count - 1) for entry in (None, value)]


class CurriculumGroupFour(unittest.TestCase):
    def assert_problem(self, slug, input, expected, code=None):
        result = run_problem(slug, input, expected, code)
        self.assertTrue(result['passed'], f'{slug}: {result["error"] or result["actual"]}')

    def test_all_authored_fixtures(self):
        for slug in SLUGS:
            for fixture in json.loads((PROBLEMS / slug / 'tests.json').read_text()):
                with self.subTest(slug=slug, name=fixture['name']):
                    self.assert_problem(slug, fixture['input'], fixture['expected'])

    def test_median_numeric_tolerance_and_nonfinite_rejection(self):
        case = {'nums1': [1, 3], 'nums2': [2]}
        for value in (2, 2.0, 2.00000005):
            self.assertTrue(check_output('median-of-two-sorted-arrays', value, 2, case))
        for value in (2.00001, True, float('inf'), float('-inf'), float('nan'), '2'):
            self.assertFalse(check_output('median-of-two-sorted-arrays', value, 2, case))
        self.assert_problem('median-of-two-sorted-arrays', case, 2,
                            'class Solution:\n def findMedianSortedArrays(self, a, b): return 2.00000005')

    def test_maximum_sorted_arrays(self):
        self.assert_problem('median-of-two-sorted-arrays',
                            {'nums1': list(range(0, 2000, 2)), 'nums2': list(range(1, 2000, 2))}, 999.5)

    def test_large_interval_schedules(self):
        touching = [[i, i + 1] for i in range(10000)]
        self.assert_problem('meeting-rooms', {'intervals': touching[::-1]}, True)
        self.assert_problem('meeting-rooms-ii', {'intervals': [[0, i + 1] for i in range(10000)]}, 10000)
        self.assert_problem('merge-intervals', {'intervals': [[0, i + 1] for i in range(10000)]}, [[0, 10000]])
        self.assert_problem('minimum-number-of-arrows-to-burst-balloons',
                            {'points': [[2 * i, 2 * i + 1] for i in range(100000)]}, 100000)
        self.assert_problem('non-overlapping-intervals',
                            {'intervals': [[i, i + 1] for i in range(-50000, 50000)]}, 0)

    def test_large_linked_list_packages(self):
        self.assert_problem('merge-k-sorted-lists', {'lists': [[] for _ in range(10000)]}, [])
        self.assert_problem('merge-k-sorted-lists', {'lists': [[0] for _ in range(10000)]}, [0] * 10000)
        self.assert_problem('merge-two-sorted-lists',
                            {'list1': list(range(0, 100, 2)), 'list2': list(range(1, 100, 2))}, list(range(100)))
        self.assert_problem('middle-of-the-linked-list', {'head': list(range(1, 101))}, list(range(51, 101)))
        original = list(range(10000))
        self.assert_problem('odd-even-linked-list', {'head': original}, original[::2] + original[1::2])

    def test_merge_judges_reject_replacement_nodes(self):
        cases = [
            ('merge-k-sorted-lists', 'mergeKLists', {'lists': [[1, 2], [0, 3]]}),
            ('merge-two-sorted-lists', 'mergeTwoLists', {'list1': [1, 2], 'list2': [0, 3]}),
        ]
        for slug, method, case in cases:
            code = ('class Solution:\n def ' + method + '(self, *args):\n'
                    '  head=ListNode(0); tail=head\n'
                    '  for v in [0,1,2,3]: tail.next=ListNode(v); tail=tail.next\n'
                    '  return head.next\n')
            result = run_problem(slug, case, [0, 1, 2, 3], code)
            self.assertFalse(result['passed'])
            self.assertIn('original', result['error'])

    def test_merge_judges_reject_value_rewriting(self):
        body = ('  nodes=[]\n'
                '  for head in heads:\n'
                '   while head is not None: nodes.append(head); head=head.next\n'
                '  for i,node in enumerate(nodes):\n'
                '   node.val=i; node.next=nodes[i+1] if i+1<len(nodes) else None\n'
                '  return nodes[0]\n')
        cases = [
            ('merge-k-sorted-lists', 'class Solution:\n def mergeKLists(self, heads):\n', {'lists': [[1, 2], [0, 3]]}),
            ('merge-two-sorted-lists', 'class Solution:\n def mergeTwoLists(self, a, b):\n  heads=[a,b]\n', {'list1': [1, 2], 'list2': [0, 3]}),
        ]
        for slug, prefix, case in cases:
            result = run_problem(slug, case, [0, 1, 2, 3], prefix + body)
            self.assertFalse(result['passed'])
            self.assertIn('values', result['error'])

    def test_merge_judges_reject_cycle_and_omission(self):
        for code in ('class Solution:\n def mergeKLists(self, heads): return heads[0]',
                     'class Solution:\n def mergeKLists(self, heads):\n  heads[0].next=heads[0]\n  return heads[0]'):
            self.assertFalse(run_problem('merge-k-sorted-lists', {'lists': [[1], [2]]}, [1, 2], code)['passed'])

    def test_middle_reference_preserves_links_and_values(self):
        ns = harness.base_namespace()
        exec(read_solution('middle-of-the-linked-list'), ns)
        head = harness.build_list([7, 7, 7, 7])
        nodes, node = [], head
        while node is not None:
            nodes.append(node)
            node = node.next
        before = [(node.next, node.val) for node in nodes]
        self.assertIs(ns['Solution']().middleNode(head), nodes[2])
        for node, (following, value) in zip(nodes, before):
            self.assertIs(node.next, following)
            self.assertEqual(node.val, value)

    def test_iterative_tree_depths(self):
        self.assert_problem('minimum-depth-of-binary-tree', {'root': chain(1, 1500)}, 1500)
        self.assert_problem('minimum-depth-of-binary-tree', {'root': chain(1, 100000)}, 100000)
        self.assert_problem('merge-two-binary-trees',
                            {'root1': chain(1, 1000), 'root2': chain(1, 1000)}, chain(2, 1000))
        self.assert_problem('path-sum', {'root': chain(0, 5000), 'targetSum': 0}, True)
        self.assert_problem('path-sum-ii', {'root': chain(0, 1500), 'targetSum': 0}, [[0] * 1500])

    def test_large_tree_and_graph_paths(self):
        self.assert_problem('minimum-height-trees',
                            {'n': 20000, 'edges': [[i, i + 1] for i in range(19999)]}, [9999, 10000])
        self.assert_problem('number-of-connected-components-in-an-undirected-graph',
                            {'n': 2000, 'edges': [[i + 1, i] for i in range(1999)]}, 1)

    def test_large_positive_windows(self):
        self.assert_problem('minimum-size-subarray-sum', {'target': 100000, 'nums': [1] * 100000}, 100000)
        self.assert_problem('minimum-window-substring', {'s': 'a' * 99999 + 'b', 't': 'ab'}, 'ab')

    def test_missing_number_maximum_permutation(self):
        missing = 8765
        values = [v for v in range(10000, -1, -1) if v != missing]
        self.assert_problem('missing-number', {'nums': values}, missing)

    def test_move_zeroes_maximum_and_return_contract(self):
        self.assert_problem('move-zeroes', {'nums': [0, 1] * 5000}, [1] * 5000 + [0] * 5000)
        code = 'class Solution:\n def moveZeroes(self, nums):\n  nums[:]=[1,0]\n  return nums'
        result = run_problem('move-zeroes', {'nums': [0, 1]}, [1, 0], code)
        self.assertFalse(result['passed'])
        self.assertIn('return None', result['error'])

    def test_deeper_queens_against_permutation_oracle(self):
        # Every board has a unique column permutation; diagonal sets independently certify it.
        for n in (6, 7):
            boards = []
            for columns in itertools.permutations(range(n)):
                if len({r - c for r, c in enumerate(columns)}) == n and len({r + c for r, c in enumerate(columns)}) == n:
                    boards.append(['.' * c + 'Q' + '.' * (n - c - 1) for c in columns])
            self.assert_problem('n-queens', {'n': n}, boards)

    def test_grid_snake_and_flat_ocean_boundaries(self):
        # Full even rows joined alternately at the left/right edge create one connected snake.
        grid = [['1' if r % 2 == 0 or c == (299 if r % 4 == 1 else 0) else '0'
                 for c in range(300)] for r in range(300)]
        self.assert_problem('number-of-islands', {'grid': grid}, 1)
        expected = [[r, c] for r in range(200) for c in range(200)]
        result = run_problem('pacific-atlantic-water-flow', {'heights': [[2] * 200 for _ in range(200)]}, expected)
        self.assertTrue(result['passed'], result['error'])
        self.assertEqual(result['actual'], expected)  # deterministic order comes from a linear scan

    def test_longest_subsequence_and_subset_bounds(self):
        self.assert_problem('number-of-longest-increasing-subsequence', {'nums': list(range(2000))}, 1)
        self.assert_problem('partition-equal-subset-sum', {'nums': [100] * 200}, True)
        # Four copies of 1/4 and 2/3 make eight independent groups summing to five.
        self.assert_problem('partition-to-k-equal-sum-subsets', {'nums': [1, 2, 3, 4] * 4, 'k': 8}, True)
        self.assert_problem('number-of-1-bits', {'n': 2147483647}, 31)

    def test_palindrome_reference_restores_original_links(self):
        ns = harness.base_namespace()
        exec(read_solution('palindrome-linked-list'), ns)
        for values in ([1, 2, 2, 1], [1, 2, 3, 2, 1], [1, 2, 3, 1], [1, 2]):
            head = harness.build_list(values)
            nodes, node = [], head
            while node is not None:
                nodes.append(node)
                node = node.next
            links = [node.next for node in nodes]
            self.assertEqual(ns['Solution']().isPalindrome(head), list(values) == list(values)[::-1])
            for node, following, value in zip(nodes, links, values):
                self.assertIs(node.next, following)
                self.assertEqual(node.val, value)

    def test_palindrome_maximum_boolean_input(self):
        self.assert_problem('palindrome-linked-list', {'head': [7] * 100000}, True)

    def test_palindrome_partition_maximum_by_cut_masks(self):
        s, n = 'a' * 16, 16
        partitions = []
        for mask in range(1 << (n - 1)):
            cuts = [0] + [i + 1 for i in range(n - 1) if mask & (1 << i)] + [n]
            partitions.append([s[a:b] for a, b in zip(cuts, cuts[1:])])
        self.assertEqual(len(partitions), 32768)
        self.assert_problem('palindrome-partitioning', {'s': s}, partitions)

    def test_palindromic_substrings_maximum(self):
        # Every interval in a repeated-character string is palindromic.
        self.assert_problem('palindromic-substrings', {'s': 'a' * 1000}, 1000 * 1001 // 2)

    def test_order_independent_checkers_reject_mutations(self):
        for slug in ('merge-intervals', 'minimum-height-trees', 'n-queens',
                     'pacific-atlantic-water-flow', 'palindrome-partitioning', 'path-sum-ii'):
            fixture = json.loads((PROBLEMS / slug / 'tests.json').read_text())[0]
            expected, case = fixture['expected'], fixture['input']
            with self.subTest(slug=slug):
                self.assertTrue(check_output(slug, expected[::-1], expected, case))
                for actual in (None, [True], expected[:-1], expected + expected):
                    self.assertFalse(check_output(slug, actual, expected, case))
        case = {'root': [1, 2, 2], 'targetSum': 3}
        self.assertFalse(check_output('path-sum-ii', [[1, 2]], [[1, 2], [1, 2]], case))


if __name__ == '__main__':
    unittest.main()
