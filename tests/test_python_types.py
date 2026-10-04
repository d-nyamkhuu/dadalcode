"""Keep learner-visible type contracts complete and faithful to the runner."""
import ast
import inspect
import json
import unittest

from curriculum_support import ROOT, harness


class ProvidedPythonTypes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.docs = json.loads((ROOT / 'src/data/pythonTypes.json').read_text())

    def test_every_problem_using_supplied_nodes_has_documentation(self):
        needed = {}
        for entry in json.loads((ROOT / 'src/data/catalog.json').read_text()):
            path = ROOT / 'public/problems' / entry['slug']
            trees = [ast.parse((path / name).read_text()) for name in
                     ('solution.py', 'starter.py', 'adapter.py')]
            names = {node.id for tree in trees for node in ast.walk(tree)
                     if isinstance(node, ast.Name)}
            defined = {node.name for tree in trees[:2] for node in ast.walk(tree)
                       if isinstance(node, ast.ClassDef)}
            required = (names & {'ListNode', 'TreeNode', 'Node', 'Interval'}) - defined
            for helper, kind in [('build_list', 'ListNode'), ('build_tree', 'TreeNode')]:
                if helper in names:
                    required.add(kind)
            if required:
                self.assertEqual(len(required), 1, 'Document every required type')
                needed[entry['slug']] = required.pop()
        actual = {slug: contract['type'] for slug, contract in self.docs['problems'].items()}
        self.assertEqual(actual, needed)
        for slug, contract in self.docs['problems'].items():
            with self.subTest(slug=slug):
                self.assertTrue(contract['input'].strip())
                self.assertIn(contract['type'], self.docs['types'])

    def test_displayed_definitions_match_runtime_constructors_and_fields(self):
        for name, definition in self.docs['types'].items():
            with self.subTest(type=name):
                namespace = {}
                exec(definition['code'], namespace)
                displayed, runtime = namespace[name], getattr(harness, name)
                self.assertEqual(inspect.signature(displayed), inspect.signature(runtime))
                self.assertEqual(vars(displayed()), vars(runtime()))
                arguments = {key: object() for key in inspect.signature(runtime).parameters}
                for instance in (displayed(**arguments), runtime(**arguments)):
                    self.assertEqual(vars(instance), arguments)
                if name == 'Node':
                    first, second = displayed(), displayed()
                    first.neighbors.append(first)
                    self.assertEqual(second.neighbors, [], 'Neighbor lists must not be shared')


if __name__ == '__main__':
    unittest.main()
