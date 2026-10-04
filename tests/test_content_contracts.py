"""Authoring regressions that cannot be detected by running a correct reference."""
import copy
import ast
import importlib.util
import json
import tempfile
import unittest
import typing
from pathlib import Path
from curriculum_support import harness

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

    def test_public_parameter_and_return_types_are_required(self):
        for old, new in (('nums: list[int]', 'nums'), (' -> list[int]', '')):
            with self.subTest(annotation=old):
                package = copy.deepcopy(self.package)
                # Removing the type from both files must fail even if they match.
                for name in ('starter', 'solution'):
                    package[name] = package[name].replace(old, new)
                with self.assertRaisesRegex(AssertionError, 'type annotation'):
                    contracts.validate_package(**package)

    def test_public_annotation_mismatch_is_rejected(self):
        for old, new in (('target: int', 'target: str'),
                         (' -> list[int]', ' -> int')):
            with self.subTest(annotation=old):
                package = copy.deepcopy(self.package)
                package['starter'] = package['starter'].replace(old, new)
                with self.assertRaisesRegex(AssertionError, 'signatures differ'):
                    contracts.validate_package(**package)

    def test_constructor_and_keyword_only_types_are_required(self):
        for source in ('class Example:\n    def __init__(self): pass\n',
                       'def solve(*, values) -> int: pass\n',
                       'def solve(*values) -> int: pass\n',
                       'def solve(**values) -> int: pass\n'):
            with self.subTest(source=source):
                with self.assertRaisesRegex(AssertionError, 'type annotation'):
                    contracts.public_signatures(source)

    def test_all_curriculum_method_types_resolve_in_runtime(self):
        for package in sorted((ROOT / 'public/problems').iterdir()):
            if not package.is_dir():
                continue
            for filename in ('starter.py', 'solution.py'):
                path = package / filename
                with self.subTest(problem=package.name, file=filename):
                    source = path.read_text()
                    namespace = harness.base_namespace()
                    exec(compile(source, str(path), 'exec'), namespace)
                    for cls in ast.parse(source).body:
                        if not isinstance(cls, ast.ClassDef):
                            continue
                        for method in cls.body:
                            if not isinstance(method, ast.FunctionDef):
                                continue
                            hints = typing.get_type_hints(
                                getattr(namespace[cls.name], method.name),
                                globalns=namespace,
                            )
                            self.assertIn('return', hints)
                            for arg in method.args.args:
                                if arg.arg not in {'self', 'cls'}:
                                    self.assertIn(arg.arg, hints)

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
