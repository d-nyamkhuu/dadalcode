"""Boundary, complexity, and adversarial judge checks for curriculum review group 5."""
import functools
import itertools
import json
import random
import unittest
from pathlib import Path

from curriculum_support import check_output, read_solution, run_problem

ROOT = Path(__file__).resolve().parents[1]
GROUP = (
    'path-sum-iii',
    'peak-index-in-a-mountain-array',
    'permutation-in-string',
    'permutations',
    'permutations-ii',
    'prefix-and-suffix-search',
    'product-of-array-except-self',
    'range-sum-query-immutable',
    'rearrange-string-k-distance-apart',
    'remove-duplicates-from-sorted-list',
    'remove-linked-list-elements',
    'remove-nth-node-from-end-of-list',
    'reorder-list',
    'reorganize-string',
    'reverse-bits',
    'reverse-linked-list',
    'reverse-linked-list-ii',
    'reverse-nodes-in-k-group',
    'rotate-array',
    'rotate-image',
    'rotate-list',
    'same-tree',
    'search-a-2d-matrix',
    'search-a-2d-matrix-ii',
    'search-in-rotated-sorted-array',
    'search-in-rotated-sorted-array-ii',
    'serialize-and-deserialize-binary-tree',
    'set-matrix-zeroes',
    'single-number',
    'sliding-window-maximum',
)


class AccessList(list):
    """Count inspected elements, including the cost of slice-based rescans."""
    def __init__(self, values):
        super().__init__(values)
        self.reads = 0

    def __getitem__(self, index):
        if isinstance(index, slice):
            self.reads += len(range(*index.indices(len(self))))
        else:
            self.reads += 1
        return super().__getitem__(index)

    def __iter__(self):
        for index in range(len(self)):
            self.reads += 1
            yield list.__getitem__(self, index)


def exact_spacing_possible(counts, spacing):
    """Small independent full-state search; no heap or frequency bound is used."""
    @functools.lru_cache(None)
    def search(remaining, recent):
        if not any(remaining):
            return True
        for char, count in enumerate(remaining):
            if count and char not in recent:
                nxt = list(remaining)
                nxt[char] -= 1
                history = (recent + (char,))[-(spacing - 1):] if spacing > 1 else ()
                if search(tuple(nxt), history):
                    return True
        return False
    return search(tuple(counts), ())


class CurriculumGroup5Tests(unittest.TestCase):
    def assert_reference(self, slug, inp, expected):
        result = run_problem(slug, inp, expected)
        self.assertTrue(result['passed'], f"{slug}: {result['error']} actual={result['actual']!r}")
        return result

    def test_all_authored_fixtures(self):
        for slug in GROUP:
            fixtures = json.loads((ROOT / 'public/problems' / slug / 'tests.json').read_text())
            for case in fixtures:
                with self.subTest(slug=slug, case=case['name']):
                    self.assert_reference(slug, case['input'], case['expected'])

    def test_path_sum_maximum_zero_chain(self):
        # A chain has n(n+1)/2 nonempty downward paths, all with sum zero.
        n = 1000
        values = [item for _ in range(n - 1) for item in (0, None)] + [0]
        self.assert_reference('path-sum-iii', {'root': values, 'targetSum': 0}, n * (n + 1) // 2)

    def test_codec_maximum_depth_and_saved_encodings(self):
        n = 10000
        values = [item for _ in range(n - 1) for item in (-1000, None)] + [-1000]
        self.assert_reference('serialize-and-deserialize-binary-tree', {'root': values}, values)

    def test_reverse_list_maximum_length(self):
        values = list(range(5000))
        self.assert_reference('reverse-linked-list', {'head': values}, list(reversed(values)))

    def test_peak_maximum_size_logarithmic_reads(self):
        n, peak = 100000, 70001
        values = AccessList(n - abs(i - peak) for i in range(n))
        namespace = {}
        exec(read_solution('peak-index-in-a-mountain-array'), namespace)
        self.assertEqual(namespace['Solution']().peakIndexInMountainArray(values), peak)
        self.assertLessEqual(values.reads, 2 * n.bit_length())

    def test_sliding_maximum_large_decreasing_linear_reads(self):
        n, width = 100000, 50000
        # Repeating each descending value five times stays inside [-10000,10000].
        values = AccessList(10000 - i // 5 for i in range(n))
        namespace = {}
        exec(read_solution('sliding-window-maximum'), namespace)
        result = namespace['Solution']().maxSlidingWindow(values, width)
        self.assertEqual(result, [10000 - i // 5 for i in range(n - width + 1)])
        self.assertLessEqual(values.reads, 6 * n)

    def test_reverse_bits_is_an_involution(self):
        namespace = {}
        exec(read_solution('reverse-bits'), namespace)
        reverse = namespace['Solution']().reverseBits
        rng = random.Random(75)
        values = [0, 1, 2**31, 2**32 - 1, 0xAAAAAAAA] + [rng.randrange(2**32) for _ in range(100)]
        for value in values:
            with self.subTest(value=value):
                expected = int(format(value, '032b')[::-1], 2)
                self.assertEqual(reverse(value), expected)
                self.assertEqual(reverse(reverse(value)), value)

    def test_rotate_image_odd_size_coordinates_and_four_turns(self):
        original = [[row * 5 + col for col in range(5)] for row in range(5)]
        expected = [[original[4 - col][row] for col in range(5)] for row in range(5)]
        self.assert_reference('rotate-image', {'matrix': original}, expected)
        namespace = {}
        exec(read_solution('rotate-image'), namespace)
        matrix = [row[:] for row in original]
        for _ in range(4):
            self.assertIsNone(namespace['Solution']().rotate(matrix))
        self.assertEqual(matrix, original)

    def test_spacing_bound_matches_exact_small_oracle(self):
        # Independently validate feasibility, especially empty outputs; expected
        # feasibility comes from exhaustive legal placements, not the candidate.
        for counts in itertools.product(range(4), repeat=3):
            if not sum(counts):
                continue
            text = ''.join(char * count for char, count in zip('abc', counts))
            for spacing in range(len(text) + 1):
                possible = exact_spacing_possible(counts, spacing)
                inp = {'s': text, 'k': spacing}
                self.assertEqual(check_output('rearrange-string-k-distance-apart', '', '', inp), not possible)
                self.assert_reference('rearrange-string-k-distance-apart', inp, text if possible else '')
            self.assert_reference('reorganize-string', {'s': text}, text if exact_spacing_possible(counts, 2) else '')

    def test_spacing_checkers_reject_bad_multiplicity_and_partial_outputs(self):
        for slug, inp in [('rearrange-string-k-distance-apart', {'s': 'aabb', 'k': 2}),
                          ('reorganize-string', {'s': 'aabb'})]:
            for actual in ['aba', 'aabb', 'ababab', '', 17]:
                with self.subTest(slug=slug, actual=actual):
                    self.assertFalse(check_output(slug, actual, 'abab', inp))
            self.assertTrue(check_output(slug, 'baba', 'abab', inp))

    def test_permutation_checkers_validate_shape_values_and_multiplicity(self):
        for slug, inp, expected in [
            ('permutations', {'nums': [0, 1]}, [[0, 1], [1, 0]]),
            ('permutations-ii', {'nums': [1, 1, 2]}, [[1, 1, 2], [1, 2, 1], [2, 1, 1]]),
        ]:
            self.assertTrue(check_output(slug, list(reversed(expected)), expected, inp))
            invalid = [expected[:-1], expected + [expected[0]], [None], [[1], ['x']], 'wrong']
            booleans = [[bool(v) if v in (0, 1) else v for v in row] for row in expected]
            for actual in invalid + [booleans]:
                with self.subTest(slug=slug, actual=actual):
                    self.assertFalse(check_output(slug, actual, expected, inp))

    def test_codec_rejects_constant_string_class_cache(self):
        code = '''class Codec:
    cached = None
    def serialize(self, root):
        Codec.cached = root
        return "constant"
    def deserialize(self, data):
        return Codec.cached
'''
        result = run_problem('serialize-and-deserialize-binary-tree', {'root': [1, 2]}, [1, 2], code=code)
        self.assertFalse(result['passed'])
        self.assertIn('saved encoding', result['error'])

    def test_codec_rejects_original_tree_identity_cache(self):
        code = '''class Codec:
    saved = {}
    def serialize(self, root):
        key = str(len(Codec.saved))
        Codec.saved[key] = root
        return key
    def deserialize(self, data):
        return Codec.saved[data]
'''
        result = run_problem('serialize-and-deserialize-binary-tree', {'root': [1, None, 2]}, [1, None, 2], code=code)
        self.assertFalse(result['passed'])
        self.assertIn('fresh namespace', result['error'])

    def test_codec_rejects_token_cache_of_clones(self):
        # Returning newly allocated trees is insufficient when the token itself
        # carries no values or child positions and needs persistent class state.
        code = '''class Codec:
    counter = 0
    cache = {}
    def serialize(self, root):
        def clone(node):
            return None if node is None else TreeNode(node.val, clone(node.left), clone(node.right))
        token = str(Codec.counter)
        Codec.counter += 1
        Codec.cache[token] = clone(root)
        return token
    def deserialize(self, data):
        return Codec.cache[data]
'''
        result = run_problem('serialize-and-deserialize-binary-tree', {'root': [1, 2, 3]}, [1, 2, 3], code=code)
        self.assertFalse(result['passed'])
        self.assertIn('fresh namespace', result['error'])

    def test_codec_accepts_independent_json_format(self):
        code = '''import json
class Codec:
    def serialize(self, root):
        def nested(node):
            return None if node is None else [node.val, nested(node.left), nested(node.right)]
        return json.dumps(nested(root))
    def deserialize(self, data):
        def restore(value):
            return None if value is None else TreeNode(value[0], restore(value[1]), restore(value[2]))
        return restore(json.loads(data))
'''
        for values in [[], [0], [1, None, 2, -3]]:
            with self.subTest(values=values):
                result = run_problem('serialize-and-deserialize-binary-tree', {'root': values}, values, code=code)
                self.assertTrue(result['passed'], result['error'])

    def test_removal_and_rotation_reject_allocated_replacements(self):
        helper = '''def make(values):
    head = None
    for value in reversed(values):
        head = ListNode(value, head)
    return head
'''
        mutants = [
            ('remove-linked-list-elements', {'head': [1, 2, 1], 'val': 2}, [1, 1],
             '    def removeElements(self, head, val):\n        return make([1, 1])\n'),
            ('remove-nth-node-from-end-of-list', {'head': [1, 2, 1], 'n': 2}, [1, 1],
             '    def removeNthFromEnd(self, head, n):\n        return make([1, 1])\n'),
            ('rotate-list', {'head': [1, 2, 1], 'k': 1}, [1, 1, 2],
             '    def rotateRight(self, head, k):\n        return make([1, 1, 2])\n'),
        ]
        for slug, inp, expected, method in mutants:
            with self.subTest(slug=slug):
                result = run_problem(slug, inp, expected, code=helper + 'class Solution:\n' + method)
                self.assertFalse(result['passed'])
                self.assertIn('original', result['error'])

    def test_removal_and_rotation_reject_cycles(self):
        mutants = [
            ('remove-linked-list-elements', {'head': [1], 'val': 0}, [1],
             '    def removeElements(self, head, val):\n        head.next = head\n        return head\n'),
            ('remove-nth-node-from-end-of-list', {'head': [1, 2], 'n': 1}, [1],
             '    def removeNthFromEnd(self, head, n):\n        head.next = head\n        return head\n'),
            ('rotate-list', {'head': [1], 'k': 0}, [1],
             '    def rotateRight(self, head, k):\n        head.next = head\n        return head\n'),
        ]
        for slug, inp, expected, method in mutants:
            with self.subTest(slug=slug):
                result = run_problem(slug, inp, expected, code='class Solution:\n' + method)
                self.assertFalse(result['passed'])
                self.assertIn('cycle', result['error'].lower())


if __name__ == '__main__':
    unittest.main()
