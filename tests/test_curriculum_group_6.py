"""Independent boundary, contract, and oracle regressions for review group 6."""
import collections
import itertools
import json
import math
import random
import unittest

from curriculum_support import PROBLEMS, check_output, harness, read_solution, run_problem

SLUGS = (
    'sliding-window-median',
    'smallest-range-covering-elements-from-k-lists',
    'sort-characters-by-frequency',
    'sort-colors',
    'sort-list',
    'spiral-matrix',
    'squares-of-a-sorted-array',
    'subarray-product-less-than-k',
    'subsets',
    'subsets-ii',
    'substring-with-concatenation-of-all-words',
    'subtree-of-another-tree',
    'sudoku-solver',
    'sum-of-two-integers',
    'swap-nodes-in-pairs',
    'target-sum',
    'task-scheduler',
    'top-k-frequent-elements',
    'trapping-rain-water',
    'two-sum',
    'unique-paths',
    'valid-anagram',
    'valid-palindrome',
    'valid-parentheses',
    'validate-binary-search-tree',
    'word-break',
    'word-search',
    'word-search-ii',
    'word-squares',
)


class CurriculumGroup6Tests(unittest.TestCase):
    def assert_problem(self, slug, case, expected, code=None):
        result = run_problem(slug, case, expected, code)
        self.assertTrue(result['passed'], f"{slug}: {result['error']} actual={result['actual']!r}")
        return result['actual']

    def assert_rejected(self, slug, case, expected, code):
        result = run_problem(slug, case, expected, code)
        self.assertFalse(result['passed'], f'{slug}: invalid implementation accepted')
        return result

    def test_all_authored_fixtures(self):
        for slug in SLUGS:
            for fixture in json.loads((PROBLEMS / slug / 'tests.json').read_text()):
                with self.subTest(slug=slug, fixture=fixture['name']):
                    self.assert_problem(slug, fixture['input'], fixture['expected'])

    def test_large_linked_list_serialization(self):
        for size in (10001, 50000):
            with self.subTest(size=size):
                self.assert_problem('sort-list', {'head': list(range(size, 0, -1))}, list(range(1, size + 1)))

    def test_maximum_input_boundaries(self):
        self.assert_problem('sort-characters-by-frequency', {'s': 'a' * 499999 + 'b'}, 'a' * 499999 + 'b')
        self.assert_problem('subarray-product-less-than-k', {'nums': [1] * 30000, 'k': 2}, 30000 * 30001 // 2)
        values = list(range(100))
        paired = [value for i in range(0, 100, 2) for value in (i + 1, i)]
        self.assert_problem('swap-nodes-in-pairs', {'head': values}, paired)
        self.assert_problem('target-sum', {'nums': [0] * 20, 'target': 0}, 1 << 20)
        self.assert_problem('top-k-frequent-elements', {'nums': [7] * 99999 + [-1], 'k': 1}, [7])
        self.assert_problem('trapping-rain-water', {'height': [100000] + [0] * 19998 + [100000]}, 19998 * 100000)
        self.assert_problem('valid-anagram', {'s': 'a' * 50000, 't': 'a' * 50000}, True)
        nested = '(' * 5000 + ')' * 5000
        self.assert_problem('valid-parentheses', {'s': nested}, True)
        self.assert_problem('valid-parentheses', {'s': nested[:-1]}, False)
        self.assert_problem('word-break', {'s': 'a' * 299 + 'b', 'wordDict': ['a' * size for size in range(1, 21)]}, False)
        self.assert_problem('sliding-window-median', {'nums': list(range(100000)), 'k': 3}, list(range(1, 99999)))

    def test_subset_boundaries_and_shared_path_mutant(self):
        values = list(range(10))
        expected = [[values[i] for i in range(10) if mask & (1 << i)] for mask in range(1 << 10)]
        actual = self.assert_problem('subsets', {'nums': values}, expected)
        self.assertEqual(len(actual), 1024)
        self.assertEqual(len({tuple(sorted(row)) for row in actual}), 1024)
        for row in actual:
            self.assertEqual(len(row), len(set(row)))
        self.assert_problem('subsets-ii', {'nums': [1] * 10}, [[1] * size for size in range(11)])
        shared_path_code = read_solution('subsets').replace('result.append(path.copy())', 'result.append(path)')
        self.assert_rejected('subsets', {'nums': [1, 2]}, [[], [1], [2], [1, 2]], shared_path_code)

    def test_custom_checkers_reject_invalid_answers(self):
        self.assertTrue(check_output('sort-characters-by-frequency', 'eetr', 'eert', {'s': 'tree'}))
        self.assertFalse(check_output('sort-characters-by-frequency', 'abab', 'aabb', {'s': 'aabb'}))
        self.assertFalse(check_output('sort-characters-by-frequency', 'ttree', 'eert', {'s': 'tree'}))
        self.assertFalse(check_output('two-sum', [0, 0], [1, 2], {'nums': [3, 2, 4], 'target': 6}))
        expected = [['ball', 'area', 'lead', 'lady'], ['wall', 'area', 'lead', 'lady']]
        case = {'words': ['area', 'lead', 'wall', 'lady', 'ball']}
        self.assertFalse(check_output('word-squares', [sorted(row) for row in expected], expected, case))
        self.assertFalse(check_output('word-squares', expected + [expected[0]], expected, case))
        self.assertTrue(check_output('word-squares', list(reversed(expected)), expected, case))
        self.assertFalse(check_output('word-search-ii', ['a', 'a'], ['a'], {'board': [['a']], 'words': ['a']}))
        self.assertFalse(check_output('sliding-window-median', [float('nan')], [1], {'nums': [1], 'k': 1}))
        self.assertFalse(check_output('top-k-frequent-elements', [1, 1], [1, 2], {'nums': [1, 1, 2, 2, 3], 'k': 2}))

    def test_original_node_identity_is_enforced(self):
        case = {'head': [1, 2, 3, 4]}
        expected = [2, 1, 4, 3]
        value_swap = '''class Solution:
    def swapPairs(self, head):
        node = head
        while node and node.next:
            node.val, node.next.val = node.next.val, node.val
            node = node.next.next
        return head
'''
        replacement = '''class Solution:
    def swapPairs(self, head):
        values = []
        while head:
            values.append(head.val)
            head = head.next
        for i in range(0, len(values) - 1, 2):
            values[i], values[i + 1] = values[i + 1], values[i]
        dummy = ListNode()
        tail = dummy
        for value in values:
            tail.next = ListNode(value)
            tail = tail.next
        return dummy.next
'''
        for code in (value_swap, replacement):
            result = self.assert_rejected('swap-nodes-in-pairs', case, expected, code)
            self.assertIn('original nodes', result['error'])

    def test_explicit_source_restrictions(self):
        sum_case = {'a': 2, 'b': 3}
        for expression in ('return a + b', 'return a - (-b)', 'a += b\n        return a', 'a -= -b\n        return a'):
            code = 'class Solution:\n    def getSum(self, a, b):\n        ' + expression + '\n'
            result = self.assert_rejected('sum-of-two-integers', sum_case, 5, code)
            self.assertIn('addition or subtraction', result['error'])
        self.assert_problem('sum-of-two-integers', {'a': -5, 'b': -3}, -8)
        color_case = {'nums': [2, 0, 1]}
        snippets = ('nums[:] = sorted(nums)', 'nums.sort()', 'list.sort(nums)',
                    'alias = nums\n        alias.sort()',
                    'order = sorted\n        nums[:] = order(nums)',
                    'order = nums.sort\n        order()',
                    'order = list.sort\n        order(nums)',
                    'copy = list(nums)\n        copy.sort()\n        nums[:] = copy')
        for snippet in snippets:
            code = 'class Solution:\n    def sortColors(self, nums):\n        ' + snippet + '\n'
            result = self.assert_rejected('sort-colors', color_case, [0, 1, 2], code)
            self.assertIn('without sorted or list.sort', result['error'])
        # An unrelated user helper called sort is not the library operation.
        helper_code = '''class Helper:
    def sort(self):
        return None
class Solution:
    def sortColors(self, nums):
        Helper().sort()
        other = [3, 1]
        order = list.sort
        order(other)
        counts = [nums.count(value) for value in range(3)]
        nums[:] = [value for value in range(3) for _ in range(counts[value])]
'''
        self.assert_problem('sort-colors', color_case, [0, 1, 2], helper_code)
        count_expression = '[0] * values.count(0) + [1] * values.count(1) + [2] * values.count(2)'
        user_helpers = (
            f'def sorted(values):\n    return {count_expression}\nclass Solution:\n    def sortColors(self, nums):\n        nums[:] = sorted(nums)\n',
            f'class Solution:\n    def sortColors(self, nums):\n        def sorted(values):\n            return {count_expression}\n        nums[:] = sorted(nums)\n',
            f'class Solution:\n    def sortColors(self, nums):\n        sorted = lambda values: {count_expression}\n        nums[:] = sorted(nums)\n',
            f'class Solution:\n    def sortColors(self, nums):\n        order = sorted\n        order = lambda values: {count_expression}\n        nums[:] = order(nums)\n',
            f'class Solution:\n    def sortColors(self, nums, sorted=lambda values: {count_expression}):\n        nums[:] = sorted(nums)\n',
            f'class Solution:\n    def sortColors(self, nums):\n        def helper(sorted):\n            return sorted(nums)\n        nums[:] = helper(lambda values: {count_expression})\n',
        )
        for code in user_helpers:
            self.assert_problem('sort-colors', color_case, [0, 1, 2], code)

    def test_reference_board_restoration_after_success_and_failure(self):
        cases = (
            ('word-search', [['a', 'b']], 'ab', True),
            ('word-search', [['a', 'b']], 'ba', True),
            ('word-search', [['a', 'b'], ['c', 'a']], 'aab', False),
            ('word-search-ii', [['a', 'b']], ['ab'], ['ab']),
            ('word-search-ii', [['a', 'b'], ['c', 'a']], ['aa'], []),
        )
        for slug, initial, words, expected in cases:
            namespace = harness.base_namespace()
            exec(compile(read_solution(slug), '<reference>', 'exec'), namespace)
            board = [row[:] for row in initial]
            method = 'exist' if slug == 'word-search' else 'findWords'
            actual = getattr(namespace['Solution'](), method)(board, words)
            self.assertEqual(actual, expected)
            self.assertEqual(board, initial, f'{slug}: reference must restore the board')
        # Restoration is a reference quality promise, not part of the learner contract.
        code = 'class Solution:\n    def exist(self, board, word):\n        board[0][0] = "#"\n        return True\n'
        self.assert_problem('word-search', {'board': [['a']], 'word': 'a'}, True, code)

    def test_sudoku_group_validation_and_clues(self):
        fixtures = json.loads((PROBLEMS / 'sudoku-solver/tests.json').read_text())
        for fixture in fixtures:
            board = self.assert_problem('sudoku-solver', fixture['input'], fixture['expected'])
            rows = [list(row) for row in board]
            digits = set('123456789')
            self.assertTrue(all(set(row) == digits for row in rows))
            self.assertTrue(all({rows[r][c] for r in range(9)} == digits for c in range(9)))
            self.assertTrue(all({rows[r][c] for r in range(br, br + 3) for c in range(bc, bc + 3)} == digits
                                for br in (0, 3, 6) for bc in (0, 3, 6)))
        # One missing clue cannot be left empty even if the expected output were authored incorrectly.
        case = fixtures[2]['input']
        no_op = 'class Solution:\n    def solveSudoku(self, board):\n        pass\n'
        result = self.assert_rejected('sudoku-solver', case, case['board'], no_op)
        self.assertIn('completed row', result['error'])
        solved = fixtures[3]['input']
        changed_clue = 'class Solution:\n    def solveSudoku(self, board):\n        board[0][0] = "1"\n'
        result = self.assert_rejected('sudoku-solver', solved, solved['board'], changed_clue)
        self.assertIn('fixed clues', result['error'])

    def test_path_count_symmetry_against_combinations(self):
        for m in range(1, 11):
            for n in range(1, 11):
                expected = math.comb(m + n - 2, m - 1)
                forward = self.assert_problem('unique-paths', {'m': m, 'n': n}, expected)
                transposed = self.assert_problem('unique-paths', {'m': n, 'n': m}, expected)
                self.assertEqual(forward, transposed)

    def test_random_windows_against_enumeration(self):
        rng = random.Random(706)
        for _ in range(60):
            values = [rng.randrange(-5, 6) for _ in range(rng.randrange(1, 12))]
            k = rng.randrange(1, len(values) + 1)
            windows = [sorted(values[start:start + k]) for start in range(len(values) - k + 1)]
            expected = [window[k // 2] if k % 2 else (window[k // 2 - 1] + window[k // 2]) / 2 for window in windows]
            self.assert_problem('sliding-window-median', {'nums': values, 'k': k}, expected)
            positives = [rng.randrange(1, 8) for _ in range(rng.randrange(1, 9))]
            threshold = rng.randrange(40)
            expected = sum(math.prod(positives[start:end]) < threshold
                           for start in range(len(positives)) for end in range(start + 1, len(positives) + 1))
            self.assert_problem('subarray-product-less-than-k', {'nums': positives, 'k': threshold}, expected)
            rows = [sorted(rng.randrange(-5, 6) for _ in range(rng.randrange(1, 4))) for _ in range(rng.randrange(1, 4))]
            ranges = [(min(choice), max(choice)) for choice in itertools.product(*rows)]
            best = min(ranges, key=lambda pair: (pair[1] - pair[0], pair[0]))
            self.assert_problem('smallest-range-covering-elements-from-k-lists', {'nums': rows}, list(best))

    def test_word_squares_against_full_sequences(self):
        rng = random.Random(607)
        for length in range(1, 5):
            universe = [''.join(letters) for letters in itertools.product('ab', repeat=length)]
            for _ in range(12):
                words = rng.sample(universe, rng.randrange(1, min(6, len(universe)) + 1))
                expected = [list(square) for square in itertools.product(words, repeat=length)
                            if all(square[r][c] == square[c][r] for r in range(length) for c in range(length))]
                self.assert_problem('word-squares', {'words': words}, expected)

    def test_grid_words_against_visited_set_oracle(self):
        def exists(board, word):
            rows, cols = len(board), len(board[0])
            def visit(row, col, index, seen):
                if not (0 <= row < rows and 0 <= col < cols) or (row, col) in seen or board[row][col] != word[index]:
                    return False
                if index == len(word) - 1:
                    return True
                return any(visit(nr, nc, index + 1, seen | {(row, col)})
                           for nr, nc in ((row + 1, col), (row - 1, col), (row, col + 1), (row, col - 1)))
            return any(visit(row, col, 0, set()) for row in range(rows) for col in range(cols))
        rng = random.Random(676)
        for _ in range(40):
            board = [[rng.choice('abc') for _ in range(3)] for _ in range(2)]
            words = sorted({''.join(rng.choice('abc') for _ in range(rng.randrange(1, 7))) for _ in range(10)})
            expected = [word for word in words if exists(board, word)]
            self.assert_problem('word-search-ii', {'board': board, 'words': words}, expected)
            word = rng.choice(words)
            self.assert_problem('word-search', {'board': board, 'word': word}, exists(board, word))


if __name__ == '__main__':
    unittest.main()
