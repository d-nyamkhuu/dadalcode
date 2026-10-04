"""Independent boundary, output-validator, and curriculum regressions for group 1."""
import itertools
import json
import random
import unittest
from pathlib import Path

from curriculum_support import check_output, harness, read_solution, run_problem

ROOT = Path(__file__).resolve().parents[1]
SLUGS = ('3sum', '3sum-closest', 'add-two-numbers', 'alien-dictionary', 'all-nodes-distance-k-in-binary-tree', 'average-of-levels-in-binary-tree', 'backspace-string-compare', 'best-time-to-buy-and-sell-stock', 'best-time-to-buy-and-sell-stock-with-cooldown', 'binary-search', 'binary-tree-level-order-traversal', 'binary-tree-level-order-traversal-ii', 'binary-tree-maximum-path-sum', 'binary-tree-paths', 'binary-tree-right-side-view', 'binary-tree-zigzag-level-order-traversal', 'climbing-stairs', 'clone-graph', 'coin-change', 'combination-sum', 'combination-sum-ii', 'combination-sum-iii', 'combination-sum-iv', 'combinations', 'concatenated-words', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'container-with-most-water', 'contains-duplicate', 'convert-1d-array-into-2d-array', 'count-of-range-sum')


class CurriculumGroup1(unittest.TestCase):
    def assert_problem(self, slug, case, expected, code=None):
        result = run_problem(slug, case, expected, code)
        self.assertIsNone(result['error'], result['error'])
        self.assertTrue(result['passed'], result)

    def test_all_authored_cases(self):
        for slug in SLUGS:
            fixtures = json.loads((ROOT / 'public/problems' / slug / 'tests.json').read_text())
            for fixture in fixtures:
                with self.subTest(slug=slug, name=fixture['name']):
                    self.assert_problem(slug, fixture['input'], fixture['expected'])

    def test_hundred_digit_carry(self):
        # 10**100 - 1 plus one is 10**100, expressed least significant first.
        self.assert_problem('add-two-numbers', {'l1': [9] * 100, 'l2': [1]}, [0] * 100 + [1])

    def test_deep_iterative_tree_traversals(self):
        # A chain's level order is one value at every depth, independent of traversal code.
        for slug in ('binary-tree-level-order-traversal', 'binary-tree-level-order-traversal-ii',
                     'binary-tree-zigzag-level-order-traversal'):
            with self.subTest(slug=slug):
                self.assert_problem(slug, {'root': [1] + [None, 1] * 1999}, [[1]] * 2000)
        self.assert_problem('average-of-levels-in-binary-tree',
                            {'root': [1] + [None, 1] * 9999}, [1] * 10000)
        self.assert_problem('binary-tree-maximum-path-sum',
                            {'root': [1] + [None, 1] * 29999}, 30000)

    def test_wide_level_order(self):
        # A complete 2047-node tree would exceed this problem's domain; use 1023.
        values = list(range(-511, 512))
        levels = [values[(1 << depth) - 1:(1 << (depth + 1)) - 1] for depth in range(10)]
        self.assert_problem('binary-tree-level-order-traversal', {'root': values}, levels)

    def test_maximum_reconstruction_depth(self):
        values = list(range(3000))
        encoded = [0] + [item for value in values[1:] for item in (None, value)]
        self.assert_problem('construct-binary-tree-from-preorder-and-inorder-traversal',
                            {'preorder': values, 'inorder': values}, encoded)

    def test_maximum_coin_amount(self):
        # Every coin contributes 25: exactly 10000/25 coins are necessary and sufficient.
        self.assert_problem('coin-change', {'coins': [25], 'amount': 10000}, 400)

    def test_large_exact_range_count(self):
        # All nonempty subarrays of a zero array qualify: sum_{i=1}^n i.
        length = 65535
        self.assert_problem('count-of-range-sum',
                            {'nums': [0] * length, 'lower': 0, 'upper': 0},
                            length * (length + 1) // 2)

    def test_integer_answers_reject_nearby_float_mutants(self):
        for slug, case, answer in (
            ('climbing-stairs', {'n': 45}, 1836311903),
            ('combination-sum-iv', {'nums': [1, 2], 'target': 45}, 1836311903),
            ('count-of-range-sum', {'nums': [0] * 65535, 'lower': 0, 'upper': 0}, 2147450880),
        ):
            with self.subTest(slug=slug):
                self.assertFalse(check_output(slug, float(answer - 100), answer, case))
                self.assertFalse(check_output(slug, True, answer, case))
        mutant = read_solution('climbing-stairs').replace(
            'return dp[n]', 'return float(dp[n] - 100) if n == 45 else dp[n]')
        result = run_problem('climbing-stairs', {'n': 45}, 1836311903, mutant)
        self.assertIsNone(result['error'])
        self.assertFalse(result['passed'])

    def test_average_absolute_tolerance(self):
        slug = 'average-of-levels-in-binary-tree'
        case = {'root': [0]}
        for sign in (-1, 1):
            self.assertTrue(check_output(slug, [sign * 9.999e-6], [0], case))
            self.assertFalse(check_output(slug, [sign * 1.001e-5], [0], case))
        for actual in ([float('nan')], [float('inf')], [True], [], [0, 0]):
            self.assertFalse(check_output(slug, actual, [0], case))

    def test_alien_validator_accepts_unconstrained_order(self):
        case = {'words': ['abx', 'acy']}
        # b must precede c; x versus y has no ordering constraint.
        self.assertTrue(check_output('alien-dictionary', 'aybcx', 'abxcy', case))
        self.assertFalse(check_output('alien-dictionary', 'abcx', 'abxcy', case))
        self.assertFalse(check_output('alien-dictionary', 'abccx', 'abxcy', case))
        self.assertFalse(check_output('alien-dictionary', 'acbxy', 'abxcy', case))

    def test_combination_validators_preserve_multiplicity(self):
        cases = (
            ('3sum', {'nums': [-2, 0, 2]}, [[-2, 0, 2]]),
            ('combination-sum', {'candidates': [2], 'target': 4}, [[2, 2]]),
            ('combination-sum-ii', {'candidates': [1, 1], 'target': 2}, [[1, 1]]),
            ('combination-sum-iii', {'k': 3, 'n': 6}, [[1, 2, 3]]),
            ('combinations', {'n': 3, 'k': 3}, [[1, 2, 3]]),
        )
        for slug, case, expected in cases:
            with self.subTest(slug=slug):
                self.assertTrue(check_output(slug, [expected[0][::-1]], expected, case))
                self.assertFalse(check_output(slug, expected + expected, expected, case))
                self.assertFalse(check_output(slug, [], expected, case))
                invalid = [[float(value) for value in expected[0]]]
                self.assertFalse(check_output(slug, invalid, expected, case))

    def test_clone_validator_rejects_alias_and_mutation(self):
        case = {'adjacency': [[2, 4], [1, 3], [2, 4], [1, 3]]}
        mutants = {
            'returns original': 'class Solution:\n    def cloneGraph(self, node):\n        return node\n',
            'mutates original value': read_solution('clone-graph').replace(
                'return copies[node]', 'node.val = 999\n        return copies[node]'),
            'duplicates shared vertex': read_solution('clone-graph').replace(
                'return copies[node]',
                'original_three = next(original for original in copies if original.val == 3)\n'
                '        original_four = next(original for original in copies if original.val == 4)\n'
                '        extra = Node(3, copies[original_three].neighbors[:])\n'
                '        copies[original_four].neighbors = [extra if neighbor.val == 3 else neighbor '
                'for neighbor in copies[original_four].neighbors]\n'
                '        return copies[node]'),
        }
        for name, mutant in mutants.items():
            with self.subTest(mutant=name):
                result = run_problem('clone-graph', case, case['adjacency'], mutant)
                self.assertFalse(result['passed'])
                self.assertIsNotNone(result['error'])

    def test_reshape_rows_do_not_share_mutable_storage(self):
        # Inspect before JSON encoding, which intentionally loses Python object identities.
        namespace = harness.base_namespace()
        exec(read_solution('convert-1d-array-into-2d-array'), namespace)
        original = [7, 7, 7, 7]
        rows = namespace['Solution']().construct2DArray(original, 2, 2)
        self.assertIsNot(rows[0], rows[1])
        rows[0][0] = 99
        self.assertEqual(rows[1], [7, 7])
        self.assertEqual(original, [7, 7, 7, 7])

    def test_small_independent_enumeration_oracles(self):
        rng = random.Random(1042026)
        for _ in range(100):
            values = [rng.randint(-5, 5) for _ in range(rng.randint(3, 9))]
            triplets = sorted({tuple(sorted(items)) for items in itertools.combinations(values, 3)
                               if sum(items) == 0})
            self.assert_problem('3sum', {'nums': values}, [list(items) for items in triplets])
            lower, upper = sorted((rng.randint(-8, 8), rng.randint(-8, 8)))
            count = sum(lower <= sum(values[start:end]) <= upper
                        for start in range(len(values)) for end in range(start + 1, len(values) + 1))
            self.assert_problem('count-of-range-sum',
                                {'nums': values, 'lower': lower, 'upper': upper}, count)
        for size in range(2, 10):
            for target in range(1, 61):
                expected = [list(items) for items in itertools.combinations(range(1, 10), size)
                            if sum(items) == target]
                self.assert_problem('combination-sum-iii', {'k': size, 'n': target}, expected)


if __name__ == '__main__':
    unittest.main()
