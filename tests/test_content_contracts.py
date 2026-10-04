"""Authoring regressions that cannot be detected by running a correct reference."""
import copy
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('content_contracts', ROOT / 'scripts/content_contracts.py')
contracts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(contracts)


class ContentContracts(unittest.TestCase):
    def setUp(self):
        path = ROOT / 'public/problems/two-sum'
        self.package = {
            'lesson': json.loads((path / 'lesson.json').read_text()),
            'tests': json.loads((path / 'tests.json').read_text()),
            **{name: (path / f'{name}.py').read_text() for name in ('solution', 'starter', 'adapter')},
        }

    def test_fixture_cannot_bypass_judging(self):
        self.package['tests'][0]['evaluateOnly'] = True
        with self.assertRaisesRegex(AssertionError, 'evaluateOnly'):
            contracts.validate_package(**self.package)

    def test_rejects_duplicate_input_even_with_different_name(self):
        duplicate = copy.deepcopy(self.package['tests'][0])
        duplicate['name'] = 'Another name for the same example'
        self.package['tests'].append(duplicate)
        with self.assertRaisesRegex(AssertionError, 'Duplicate fixture input'):
            contracts.validate_package(**self.package)

    def test_rejects_duplicate_fixture_name(self):
        self.package['tests'][1]['name'] = self.package['tests'][0]['name']
        with self.assertRaisesRegex(AssertionError, 'Duplicate fixture name'):
            contracts.validate_package(**self.package)

    def test_rejects_nonfinite_expected_values(self):
        for value in (float('nan'), float('inf'), float('-inf')):
            with self.subTest(value=value):
                self.package['tests'][0]['expected'] = [value]
                with self.assertRaisesRegex(AssertionError, 'finite'):
                    contracts.validate_package(**self.package)

    def test_public_signatures_cannot_drift(self):
        self.package['starter'] = self.package['starter'].replace('target', 'goal')
        with self.assertRaisesRegex(AssertionError, 'signatures differ'):
            contracts.validate_package(**self.package)

    def test_review_is_invalidated_by_each_package_file(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            for name in contracts.PACKAGE_FILES:
                (path / name).write_text('reviewed content')
            hashes = contracts.package_hashes(path)
            review = {
                'reviewed': True, 'resolved': True, 'packageHashes': hashes,
                'editorialReview': {'reviewed': True, 'status': 'approved',
                                    'explanationHash': hashes['explanation.json']},
            }
            contracts.validate_review(path, review)
            for name in contracts.PACKAGE_FILES:
                with self.subTest(file=name):
                    (path / name).write_text('new unreviewed content')
                    with self.assertRaisesRegex(AssertionError, 'changed since review'):
                        contracts.validate_review(path, review)
                    (path / name).write_text('reviewed content')


if __name__ == '__main__':
    unittest.main()
