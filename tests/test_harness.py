import importlib.util, pathlib, unittest, json
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('harness',ROOT/'src/runtime/harness.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)

class HarnessRegressions(unittest.TestCase):
    def test_integer_answers_are_exact(self):
        self.assertFalse(h.equivalent(1836311903,1836311803))
        self.assertFalse(h.equivalent(1836311803.0,1836311903))
        self.assertFalse(h.equivalent([1836311803.0],[1836311903]))
        self.assertFalse(h.equivalent({'count':1836311803.0},{'count':1836311903}))
        self.assertFalse(h.equivalent(1.00000001,1))
        self.assertTrue(h.equivalent(2.0,2))
        self.assertFalse(h.equivalent(True,1))
        self.assertTrue(h.equivalent(0.1+0.2,0.3))

    def test_nonfinite_answers_are_not_numbers(self):
        for value in (float('inf'),float('-inf'),float('nan')):
            self.assertFalse(h.equivalent(value,1))
            self.assertFalse(h.equivalent(value,1.0))

    def test_list_output_limit_covers_curriculum_and_preserves_cycle_checks(self):
        values=list(range(50000))
        self.assertEqual(h.list_values(h.build_list(values)),values)
        with self.assertRaisesRegex(ValueError,'too large'):
            h.list_values(h.build_list(values+[50000]))
        head=h.build_list(range(10001));tail=head
        while tail.next:tail=tail.next
        tail.next=head
        with self.assertRaisesRegex(ValueError,'cycle'):
            h.list_values(head)

    def test_source_contract_is_checked_before_candidate_execution(self):
        adapter="def validate_source(code):\n    raise ValueError('Forbidden operation')\ndef run(ns, case): return ns['solve']()"
        out=h.run_case("raise RuntimeError('candidate executed')",adapter,{'input':{},'expected':None})['result']
        self.assertFalse(out['passed'])
        self.assertIn('Forbidden operation',out['error'])
        self.assertNotIn('candidate executed',out['error'])

    def test_fresh_decoder_namespace_does_not_share_class_or_global_cache(self):
        code="cache = []\nclass Codec:\n    cached = []\n    def record(self):\n        cache.append(1)\n        self.cached.append(1)\n        return len(cache), len(self.cached)\n"
        adapter="def run(ns, case):\n    first = ns['Codec']().record()\n    fresh = fresh_solution_namespace()\n    return [first, fresh['Codec']().record()]\n"
        out=h.run_case(code,adapter,{'input':{},'expected':[[1,1],[1,1]]},trace=True)
        self.assertTrue(out['result']['passed'],out['result'])
        self.assertEqual(sum(s['event']=='return' and s['function']=='record' for s in out['steps']),1)

    def test_extra_grading_calls_do_not_pollute_primary_trace(self):
        code='def solve(value):\n    return value\n'
        adapter="def run(ns, case):\n    first = ns['solve'](case['value'])\n    validation_call(ns['solve'], 999)\n    try:\n        validation_call(lambda: 1 / 0)\n    except ZeroDivisionError:\n        pass\n    return ns['solve'](first)\n"
        out=h.run_case(code,adapter,{'input':{'value':7},'expected':7},trace=True)
        self.assertTrue(out['result']['passed'],out['result'])
        returns=[s['variables']['returnValue'] for s in out['steps'] if s['event']=='return']
        self.assertEqual(returns,[7,7])

    def test_trace_sentinels_are_valid_json(self):
        value=h.snapshot({'low':float('-inf'),'high':float('inf'),'unset':float('nan')})
        self.assertEqual(json.loads(json.dumps(value,allow_nan=False))['low'],'-inf')

    def test_oracle_execution_is_explicit(self):
        code='def solve():\n    return [1, 2]\n'
        adapter="def run(ns, case): return ns['solve']()\ndef check(actual, expected, case): return sorted(actual)==sorted(expected)\n"
        out=h.run_case(code,adapter,{'input':{},'expected':None,'evaluateOnly':True},True)
        self.assertIsNone(out['result']['error']);self.assertEqual(out['result']['actual'],[1,2]);self.assertTrue(out['steps'])
        ordinary=h.run_case('def solve():\n    return None\n',"def run(ns, case): return ns['solve']()",{'input':{},'expected':None})
        self.assertTrue(ordinary['result']['passed'])

    def test_hash_in_string_is_not_a_comment(self):
        code="def solve():\n    # Mark this cell as visited.\n    marker = '#'\n    return marker\n"
        out=h.run_case(code,"def run(ns, case): return ns['solve']()",{'input':{},'expected':'#'},True)
        self.assertEqual(next(s for s in out['steps'] if s['line']==3)['explanation'],'Mark this cell as visited.')

    def test_fixtures_do_not_leak_mutation(self):
        fixture={'input':{'a':[1,2]},'expected':[1,2,3]}
        out=h.run_case('def solve(a):\n    a.append(3)\n    return a',"def run(ns, case): return ns['solve'](case['a'])",fixture)
        self.assertTrue(out['result']['passed']);self.assertEqual(fixture['input']['a'],[1,2])

    def test_cycles_cannot_hang_serialization(self):
        node=h.ListNode(1);node.next=node
        with self.assertRaises(ValueError):h.list_values(node)
        self.assertEqual(h.snapshot(node)['nodes'][0]['links']['next'],'0')

    def test_trace_identity_survives_detaching_duplicate_nodes(self):
        context=h.SnapshotContext()
        first=h.ListNode(7); second=h.ListNode(7); first.next=second
        before=h.snapshot(first,context=context)
        second_view=h.snapshot(second,context=context)
        self.assertNotEqual(before['root'],second_view['root'])
        self.assertEqual(before['nodes'][0]['links']['next'],second_view['root'])
        first.next=None;second.next=first
        after=h.snapshot(second,context=context)
        self.assertEqual(after['nodes'][0]['links']['next'],before['root'])
        self.assertTrue(after['stableIds'])

    def test_trie_identity_and_truncation_are_explicit(self):
        context=h.SnapshotContext(trie=True)
        child={};root={'a':child}
        tree=h.snapshot(root,context=context)
        self.assertEqual(tree['a']['__ref'],h.snapshot(child,context=context)['__ref'])
        h.snapshot(list(range(60)),context=context)
        self.assertIn('Sequence shows 40 of 60 entries',context.limits)

    def test_trace_states_are_before_executing_line(self):
        out=h.run_case('def solve():\n    a = [1]\n    a.append(2)\n    return a',"def run(ns, case): return ns['solve']()",{'input':{},'expected':[1,2]},True)
        before=next(s for s in out['steps'] if s['line']==3)
        self.assertEqual(before['variables']['a'],[1])
        self.assertEqual(out['steps'][-1]['variables']['returnValue'],[1,2])

if __name__=='__main__':unittest.main()
