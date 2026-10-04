"""Independent boundary and judge regressions for the second review group."""
import itertools
import json
import math
from pathlib import Path
import unittest

from curriculum_support import check_output, read_solution, run_problem

ROOT = Path(__file__).resolve().parents[1]
SLUGS = (
    'count-unique-characters-of-all-substrings-of-a-given-string',
    'counting-bits',
    'course-schedule',
    'course-schedule-ii',
    'decode-ways',
    'design-add-and-search-words-data-structure',
    'design-search-autocomplete-system',
    'employee-free-time',
    'encode-and-decode-strings',
    'factor-combinations',
    'find-all-duplicates-in-an-array',
    'find-all-numbers-disappeared-in-an-array',
    'find-k-closest-elements',
    'find-k-pairs-with-smallest-sums',
    'find-median-from-data-stream',
    'find-minimum-in-rotated-sorted-array',
    'find-peak-element',
    'find-smallest-letter-greater-than-target',
    'find-the-duplicate-number',
    'first-missing-positive',
    'fruit-into-baskets',
    'gas-station',
    'generalized-abbreviation',
    'generate-parentheses',
    'graph-valid-tree',
    'group-anagrams',
    'house-robber',
    'house-robber-ii',
    'implement-trie-prefix-tree',
    'index-pairs-of-a-string',
)


class CurriculumGroup2(unittest.TestCase):
    def assert_case(self, slug, input, expected, code=None):
        result = run_problem(slug, input, expected, code)
        self.assertIsNone(result['error'], result)
        self.assertTrue(result['passed'], result)
        return result['actual']

    def test_owned_authored_fixtures(self):
        for slug in SLUGS:
            for case in json.loads((ROOT / 'public/problems' / slug / 'tests.json').read_text()):
                with self.subTest(slug=slug, case=case['name']):
                    self.assert_case(slug, case['input'], case['expected'])

    def test_counting_bits_at_maximum(self):
        n = 100000
        # Independently count the textual binary digits, without the DP recurrence.
        self.assert_case('counting-bits', {'n': n}, [bin(i).count('1') for i in range(n + 1)])

    def test_maximum_course_chains(self):
        n = 2000
        chain = [[i, i - 1] for i in range(1, n)]
        self.assert_case('course-schedule', {'numCourses': n, 'prerequisites': chain}, True)
        self.assert_case('course-schedule-ii', {'numCourses': n, 'prerequisites': chain}, list(range(n)))
        self.assert_case('course-schedule', {'numCourses': n, 'prerequisites': chain + [[0, n - 1]]}, False)

    def test_topological_alternatives_and_invalid_permutations(self):
        slug = 'course-schedule-ii'
        case = {'numCourses': 4, 'prerequisites': [[1, 0], [2, 0], [3, 1], [3, 2]]}
        expected = [0, 1, 2, 3]
        self.assertTrue(check_output(slug, [0, 2, 1, 3], expected, case))
        for invalid in ([0, 1, 1, 3], [0, 3, 2, 1], [0, 1, 2], [False, 1, 2, 3]):
            self.assertFalse(check_output(slug, invalid, expected, case))

    def test_word_dictionary_maximum_length_and_two_wildcards(self):
        word = 'a' * 25
        self.assert_case('design-add-and-search-words-data-structure', {
            'operations': ['WordDictionary', 'addWord', 'search', 'search', 'search'],
            'args': [[], [word], ['.' + 'a' * 23 + '.'], ['.' + 'a' * 23 + 'b'], ['a' * 24]],
        }, [None, None, True, False, False])

    def test_autocomplete_results_do_not_expose_cache(self):
        namespace = {}
        exec(read_solution('design-search-autocomplete-system'), namespace)
        system = namespace['AutocompleteSystem'](['aa', 'ab', 'ac'], [3, 2, 1])
        returned = system.input('a')
        returned.clear()
        system.input('a')
        system.input('#')
        self.assertEqual(system.input('a'), ['aa', 'ab', 'ac'])

    def test_codec_three_digit_header_and_maximum_records(self):
        payload = 'x' * 200
        # Payload lengths and following record boundaries are authored directly.
        words = [payload, '', '#', '12#next']
        self.assert_case('encode-and-decode-strings', {'strs': words}, words)
        all_codes = ''.join(chr(code) for code in range(256))
        words = [all_codes[:200], all_codes[200:]] + [''] * 198
        self.assert_case('encode-and-decode-strings', {'strs': words}, words)

    def test_codec_rejects_class_or_global_cache_instead_of_encoding(self):
        candidates = [
            "class Codec:\n    saved = []\n    def encode(self, strs):\n        Codec.saved = list(strs)\n        return 'constant'\n    def decode(self, text):\n        return Codec.saved\n",
            "saved = []\nclass Codec:\n    def encode(self, strs):\n        global saved\n        saved = list(strs)\n        return 'constant'\n    def decode(self, text):\n        return saved\n",
        ]
        words = ['Hello', 'World']
        for candidate in candidates:
            with self.subTest(candidate=candidate):
                result = run_problem('encode-and-decode-strings', {'strs': words}, words, candidate)
                self.assertFalse(result['passed'])
                self.assertIn('fresh solution namespace', result['error'])

    def test_codec_accepts_independent_alternative_framing(self):
        # Length-colon framing is valid even though the teaching reference uses #.
        candidate = """class Codec:
    def encode(self, strs):
        return ''.join(str(len(word)) + ':' + word for word in strs)
    def decode(self, text):
        result = []
        cursor = 0
        while cursor < len(text):
            separator = text.index(':', cursor)
            length = int(text[cursor:separator])
            cursor = separator + 1
            result.append(text[cursor:cursor + length])
            cursor += length
        return result
"""
        words = ['', ':#12:', 'line\nnext', 'x' * 200]
        self.assert_case('encode-and-decode-strings', {'strs': words}, words, candidate)

    def test_factor_order_and_invalid_combinations(self):
        slug = 'factor-combinations'
        case = {'n': 12}
        expected = [[2, 2, 3], [2, 6], [3, 4]]
        self.assertTrue(check_output(slug, [[3, 4], [2, 6], [2, 2, 3]], expected, case))
        for invalid in (
            [[6, 2], [3, 2, 2], [4, 3]],
            [[2, 6], [2, 2, 3], [3, 4], [3, 4]],
            [[2, 6], [3, 4]],
            [[2, 6], [2, 2, 3], [2, 5]],
            [[True, 2, 3], [2, 6], [3, 4]],
            [[12], [2, 6], [3, 4]],
        ):
            self.assertFalse(check_output(slug, invalid, expected, case))

    def test_k_pairs_maximum_rows_with_small_k(self):
        self.assert_case('find-k-pairs-with-smallest-sums', {
            'nums1': list(range(100000)), 'nums2': [-1], 'k': 3,
        }, [[0, -1], [1, -1], [2, -1]])

    def test_pair_ties_and_multiplicity_checker(self):
        slug = 'find-k-pairs-with-smallest-sums'
        case = {'nums1': [1, 2], 'nums2': [1, 2], 'k': 2}
        self.assertTrue(check_output(slug, [[1, 1], [2, 1]], [[1, 1], [1, 2]], case))
        self.assertFalse(check_output(slug, [[1, 1], [1, 1]], [[1, 1], [1, 2]], case))

    def test_median_finite_tolerance_is_numeric_type_independent(self):
        slug = 'find-median-from-data-stream'
        case = {'operations': ['MedianFinder', 'addNum', 'findMedian'], 'args': [[], [2], []]}
        for expected_median in (2, 2.0):
            self.assertTrue(check_output(slug, [None, None, 2.0000001], [None, None, expected_median], case))
            self.assertTrue(check_output(slug, [None, None, 2], [None, None, expected_median], case))
            for wrong in (2.000001, True, float('nan'), float('inf'), float('-inf'), None, '2', [], 10 ** 1000):
                self.assertFalse(check_output(slug, [None, None, wrong], [None, None, expected_median], case))
        self.assertFalse(check_output(slug, [False, None, 2], [None, None, 2], case))
        self.assertTrue(check_output(slug, [None, None, 5e-10], [None, None, 0], case))
        self.assertFalse(check_output(slug, [None, None, 2e-9], [None, None, 0], case))

    def test_peak_checker_accepts_both_peaks(self):
        case = {'nums': [1, 2, 1, 3, 5, 6, 4]}
        for peak in (1, 5):
            self.assertTrue(check_output('find-peak-element', peak, 5, case))
        for invalid in (0, 2, 6, True, 7):
            self.assertFalse(check_output('find-peak-element', invalid, 5, case))

    def test_long_duplicate_tail_and_no_mutation_guard(self):
        n = 2000
        values = list(range(1, n + 1)) + [n - 2]
        self.assert_case('find-the-duplicate-number', {'nums': values}, n - 2)
        mutating = 'class Solution:\n    def findDuplicate(self, nums):\n        nums.sort()\n        return 2\n'
        result = run_problem('find-the-duplicate-number', {'nums': [2, 1, 2]}, 2, mutating)
        self.assertFalse(result['passed'])
        self.assertIn('must not be modified', result['error'])

    def test_gas_station_rejects_reset_at_zero(self):
        wrong = read_solution('gas-station').replace('if tank < 0:', 'if tank <= 0:')
        result = run_problem('gas-station', {'gas': [0], 'cost': [0]}, 0, wrong)
        self.assertFalse(result['passed'])
        self.assertEqual(result['actual'], 1)

    def test_ten_letter_abbreviations_against_bitmasks(self):
        word = 'abcdefghij'
        expected = []
        for mask in range(1 << len(word)):
            tokens, omitted = [], 0
            for i, char in enumerate(word):
                if mask & (1 << i):
                    if omitted:
                        tokens.append(str(omitted))
                        omitted = 0
                    tokens.append(char)
                else:
                    omitted += 1
            if omitted:
                tokens.append(str(omitted))
            expected.append(''.join(tokens))
        actual = self.assert_case('generalized-abbreviation', {'word': word}, expected)
        self.assertEqual(len(actual), 1024)
        self.assertEqual(len(set(actual)), 1024)
        self.assertIn('10', actual)
        self.assertIn('1b8', actual)

    def test_eight_pair_parentheses_against_balanced_binary_strings(self):
        n = 8
        expected = []
        # Enumerate all binary strings; independently reject invalid prefix balance.
        for choices in itertools.product('()', repeat=2 * n):
            balance = 0
            for char in choices:
                balance += 1 if char == '(' else -1
                if balance < 0:
                    break
            else:
                if balance == 0:
                    expected.append(''.join(choices))
        self.assertEqual(len(expected), math.comb(2 * n, n) // (n + 1))
        self.assertEqual(len(expected), 1430)
        actual = self.assert_case('generate-parentheses', {'n': n}, expected)
        self.assertEqual(len(set(actual)), 1430)

    def test_maximum_graph_chain(self):
        n = 2000
        self.assert_case('graph-valid-tree', {'n': n, 'edges': [[i, i - 1] for i in range(1, n)]}, True)

    def test_long_z_anagram_counts(self):
        words = ['z' * 100, 'z' * 99 + 'a', 'a' + 'z' * 99, 'z' * 99]
        self.assert_case('group-anagrams', {'strs': words}, [[words[0]], [words[1], words[2]], [words[3]]])

    def test_maximum_trie_word_and_prefix(self):
        word = 'a' * 2000
        prefix = word[:-1]
        self.assert_case('implement-trie-prefix-tree', {
            'operations': ['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search', 'search'],
            'args': [[], [word], [word], [prefix], [prefix], [prefix], [prefix], [word]],
        }, [None, None, True, False, True, None, True, True])

    def test_index_pairs_text_and_word_length_limits(self):
        text, word = 'a' * 100, 'a' * 50
        # A length-50 word begins at every start 0..50, with an inclusive end.
        expected = [[start, start + 49] for start in range(51)]
        self.assert_case('index-pairs-of-a-string', {'text': text, 'words': [word]}, expected)


if __name__ == '__main__':
    unittest.main()
