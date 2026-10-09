"""Curriculum-wide conceptual coverage and meaningful rejection contracts."""
import copy
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('concept_contracts', ROOT/'scripts/concept_contracts.py')
contracts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(contracts)

class ConceptContracts(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT/'src/data/catalog.json').read_text())
        cls.example = json.loads((ROOT/'public/problems/two-sum/explanation.json').read_text())

    def test_all_179_lessons_have_complete_distinct_visual_stories(self):
        self.assertEqual(len(self.catalog), 179)
        prompts, compositions = set(), set()
        for problem in self.catalog:
            slug = problem['slug']
            with self.subTest(slug=slug):
                explanation = json.loads((ROOT/'public/problems'/slug/'explanation.json').read_text())
                self.assertGreaterEqual(contracts.validate_concept(slug, explanation), 6)
                prompts.add(explanation['concept']['illustrations'][0]['prompt'])
                drawing = contracts.renderer_data(ROOT/'src/components/concepts/diagrams'/f'{slug}.ts')
                compositions.add(json.dumps(drawing, sort_keys=True))
        self.assertEqual(len(prompts), 179, 'Artwork prompts must be distinct by problem')
        self.assertEqual(len(compositions), 179, 'Authored diagrams must depict their own problem')

    def test_duplicate_scene_identity_is_rejected(self):
        bad = copy.deepcopy(self.example)
        bad['concept']['scenes'][1]['id'] = bad['concept']['scenes'][0]['id']
        with self.assertRaisesRegex(AssertionError, 'Scene IDs must be unique'):
            contracts.validate_concept('two-sum', bad)

    def test_code_dependent_narration_is_rejected(self):
        bad = copy.deepcopy(self.example)
        bad['concept']['scenes'][3]['narration'] = 'Read self.value and inspect the recorded local variable from the Python line.'
        with self.assertRaisesRegex(AssertionError, 'source syntax or variables'):
            contracts.validate_concept('two-sum', bad)

    def test_missing_or_clipped_visual_states_are_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            renderer = root/'src/components/concepts/diagrams/two-sum.ts'
            renderer.parent.mkdir(parents=True)
            source = ROOT/'src/components/concepts/diagrams/two-sum.ts'
            drawing = contracts.renderer_data(source)
            del drawing[self.example['concept']['scenes'][3]['id']]
            renderer.write_text('const drawings: ConceptDrawings = '+json.dumps(drawing)+';\nexport default drawings;')
            with self.assertRaisesRegex(AssertionError, 'Every scene'):
                contracts.validate_concept('two-sum', self.example, root)
            drawing = contracts.renderer_data(source)
            drawing[self.example['concept']['scenes'][3]['id']]['shapes'].append(dict(type='box', x=710,y=100,width=80,label='outside'))
            renderer.write_text('const drawings: ConceptDrawings = '+json.dumps(drawing)+';\nexport default drawings;')
            with self.assertRaisesRegex(AssertionError, 'clips horizontally'):
                contracts.validate_concept('two-sum', self.example, root)

    def test_artwork_and_generation_record_are_fingerprinted(self):
        fingerprint = contracts.concept_fingerprint('two-sum')
        self.assertEqual(len(fingerprint),3)
        self.assertTrue(any(name.endswith('concept.webp') for name in fingerprint))
        self.assertTrue(any(name.endswith('generation.json') for name in fingerprint))
        self.assertTrue(all(len(digest)==64 for digest in fingerprint.values()))

    def test_generated_parentheses_drawing_contains_every_fixture_answer(self):
        explanation = json.loads((ROOT/'public/problems/generate-parentheses/explanation.json').read_text())
        drawing = contracts.renderer_data(ROOT/'src/components/concepts/diagrams/generate-parentheses.ts')
        shapes = drawing['follow-every-legal-alternative']['shapes']
        answers = {s['label'] for s in shapes if s['type']=='box' and len(s['label'])==6 and set(s['label'])=={'(',')'}}
        self.assertEqual(answers, set(explanation['walkthrough']['result']))

    def test_duplicate_tree_values_do_not_add_nodes_to_a_highlighted_path(self):
        for slug, scene in [('path-sum','the-sibling-leaf-matches'), ('path-sum-iii','a-target-path-need-not-include-the-root')]:
            with self.subTest(slug=slug):
                explanation = json.loads((ROOT/'public/problems'/slug/'explanation.json').read_text())
                drawing = contracts.renderer_data(ROOT/'src/components/concepts/diagrams'/f'{slug}.ts')[scene]
                active = [s for s in drawing['shapes'] if s['type']=='circle' and s['tone']=='active']
                self.assertEqual(sum(int(s['label']) for s in active), explanation['walkthrough']['input']['targetSum'])
                self.assertEqual(len(active), 4 if slug=='path-sum' else 2)

    def test_review_rejects_each_changed_visual_fingerprint(self):
        from scripts.content_contracts import validate_review, package_hashes
        path = ROOT/'public/problems/two-sum'
        hashes = package_hashes(path)
        visuals = contracts.concept_fingerprint('two-sum')
        review = dict(reviewed=True, resolved=True, packageHashes=hashes,
            editorialReview=dict(reviewed=True,status='approved',explanationHash=hashes['explanation.json']),
            conceptReview=dict(reviewed=True,status='approved',visualHashes=visuals))
        validate_review(path, review)
        for filename in visuals:
            with self.subTest(file=filename):
                stale = copy.deepcopy(review)
                stale['conceptReview']['visualHashes'][filename] = '0'*64
                with self.assertRaisesRegex(AssertionError,'Concept visuals changed'):
                    validate_review(path,stale)

if __name__ == '__main__': unittest.main()
