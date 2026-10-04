"""Keep authored lesson states grounded in executable reference examples."""
import copy
import json
import sys
import unittest

from curriculum_support import ROOT, PROBLEMS, harness, read_solution

sys.path.insert(0, str(ROOT / 'scripts'))
from content_contracts import validate_teaching_figures


def explanation(slug):
    return json.loads((PROBLEMS / slug / 'explanation.json').read_text())


def row_values(slug, panel, label):
    rows = explanation(slug)['figures'][0]['panels'][panel]['rows']
    return next(row['values'] for row in rows if row['label'] == label)


def trace(slug):
    folder = PROBLEMS / slug
    lesson = json.loads((folder / 'lesson.json').read_text())
    worked = explanation(slug)['walkthrough']
    output = harness.run_case(
        read_solution(slug), (folder / 'adapter.py').read_text(),
        {'name': 'Static figure verification', 'input': worked['input'], 'expected': worked['result']},
        trace=True, config=lesson['visualization'])
    assert output['result']['passed'], output['result']
    return [step['variables'] for step in output['steps']]


class TeachingFigureTests(unittest.TestCase):
    def test_curriculum_has_clear_decisions_and_valid_figures(self):
        catalog = json.loads((ROOT / 'src/data/catalog.json').read_text())
        for entry in catalog:
            with self.subTest(slug=entry['slug']):
                editorial = explanation(entry['slug'])
                self.assertTrue(editorial['keyDecision'].strip())
                validate_teaching_figures(editorial)

    def test_rejects_detached_steps_and_malformed_cells(self):
        good = explanation('two-sum')
        for mutation in ['step', 'highlight', 'labels', 'columns']:
            with self.subTest(mutation=mutation):
                invalid = copy.deepcopy(good)
                figure = invalid['figures'][0]
                row = figure['panels'][0]['rows'][0]
                if mutation == 'step':
                    figure['afterStep'] = len(invalid['walkthrough']['steps'])
                elif mutation == 'highlight':
                    row['highlight'] = [len(row['values'])]
                elif mutation == 'labels':
                    row['labels'] = ['only one label']
                else:
                    row['columns'] = 3
                with self.assertRaises(AssertionError):
                    validate_teaching_figures(invalid)

    def test_drawn_array_states_occur_in_the_reference(self):
        checkpoints = [
            ('sort-colors', 1, 'Array after swap', 'nums'),
            ('rotate-array', 1, 'After whole reversal', 'nums'),
            ('rotate-array', 1, 'After first-part reversal', 'nums'),
            ('rotate-image', 1, 'Transposed matrix', 'matrix'),
            ('set-matrix-zeroes', 1, 'After marker pass', 'matrix'),
            ('longest-increasing-subsequence', 2, 'Saved smallest endings', 'tails'),
            ('longest-common-subsequence', 2, 'Current DP row', 'current'),
            ('coin-change', 0, 'DP counts', 'dp'),
        ]
        for slug, panel, label, variable in checkpoints:
            with self.subTest(slug=slug, label=label):
                drawn = row_values(slug, panel, label)
                def matches(state):
                    values = state.get(variable)
                    if not isinstance(values, list):
                        return False
                    if values and isinstance(values[0], list):
                        values = [item for row in values for item in row]
                    # Coin Change shows the already-computed prefix before amount 6.
                    if slug == 'coin-change':
                        values = values[:len(drawn)]
                    return [str(value) for value in values] == drawn
                self.assertTrue(any(matches(state) for state in trace(slug)), f'{label} is not a reference state')

    def test_house_robber_figure_uses_the_correct_earlier_totals(self):
        before = [int(x) for x in row_values('house-robber', 0, 'Saved totals')]
        after = [int(x) for x in row_values('house-robber', 2, 'Next saved totals')]
        states = trace('house-robber')
        self.assertTrue(any(s.get('i') == 2 and [s.get('two_back'), s.get('one_back')] == before for s in states))
        self.assertTrue(any(s.get('i') == 2 and [s.get('two_back'), s.get('one_back')] == after for s in states))

    def test_median_cross_checks_represent_a_valid_cut(self):
        states = trace('median-of-two-sorted-arrays')
        cut = next(s for s in states if s.get('i') == 1 and s.get('j') == 1 and s.get('a_left') == 2 and s.get('b_left') == 1 and s.get('a_right') == 'inf' and s.get('b_right') == 3)
        self.assertLessEqual(cut['a_left'], cut['b_right'])
        self.assertEqual(max(cut['a_left'], cut['b_left']), int(row_values('median-of-two-sorted-arrays', 2, 'Median')[0].split('=')[-1]))

    def test_reversed_link_figure_preserves_both_chains(self):
        def chain(snapshot):
            nodes = {node['id']: node for node in snapshot['nodes']}
            at = snapshot['root']
            values = []
            while at is not None:
                node = nodes[at]
                values.append(str(node['value']))
                at = node['links'].get('next')
            return values + ['None']
        expected_reversed = row_values('reverse-linked-list', 2, 'Reversed part')
        expected_untouched = row_values('reverse-linked-list', 2, 'Untouched part')
        self.assertTrue(any(
            isinstance(s.get('previous'), dict) and isinstance(s.get('current'), dict)
            and chain(s['previous']) == expected_reversed and chain(s['current']) == expected_untouched
            for s in trace('reverse-linked-list')))


if __name__ == '__main__':
    unittest.main()
