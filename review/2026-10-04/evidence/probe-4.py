import importlib.util,pathlib,json
ROOT=pathlib.Path('/home/data/Projects/blind-75');spec=importlib.util.spec_from_file_location('harness',ROOT/'src/runtime/harness.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
checks=[]
class CountHeads:
 def __init__(self,k):self.k=k;self.reads=0
 def __iter__(self):
  for _ in range(self.k):self.reads+=1;yield None
ns=h.base_namespace();exec((ROOT/'public/problems/merge-k-sorted-lists/solution.py').read_text(),ns)
heads=CountHeads(10000);result=ns['Solution']().mergeKLists(heads);checks.append({'probe':'merge-k initialization cost','k':10000,'N':0,'heads_examined':heads.reads,'result':result})
class Coord(tuple):
 comparisons=0
 def __lt__(self,other):Coord.comparisons+=1;return tuple.__lt__(self,other)
coords={(r,c) for r in range(200) for c in range(200)};sorted(Coord(p) for p in coords)
checks.append({'probe':'Pacific output sort','flat_grid':[200,200],'returned_cells':len(coords),'tuple_comparisons':Coord.comparisons})
# Preserve restoration and identity guarantees separately from the default outputs.
ns=h.base_namespace();exec((ROOT/'public/problems/palindrome-linked-list/solution.py').read_text(),ns)
for vals in [[1,2,2,1],[1,2,3,2,1],[1,2,3,4,1],[1,2]]:
 head=h.build_list(vals);nodes=[];cur=head
 while cur:nodes.append(cur);cur=cur.next
 links=[n.next for n in nodes];answer=ns['Solution']().isPalindrome(head)
 checks.append({'probe':'palindrome restoration','values':vals,'answer':answer,'links_restored':all(node.next is following for node,following in zip(nodes,links))})
# Duplicate-valued routes: multiset output must preserve both occurrences.
p=ROOT/'public/problems/path-sum-ii';case={'name':'duplicate routes','input':{'root':[1,2,2],'targetSum':3},'expected':[[1,2],[1,2]]}
checks.append({'probe':'duplicate path values','result':h.run_case((p/'solution.py').read_text(),(p/'adapter.py').read_text(),case)['result']})
# Adapters with explicit check must reject bad shapes, extra output, and duplicates.
for slug in ['merge-intervals','minimum-height-trees','n-queens','pacific-atlantic-water-flow','palindrome-partitioning','path-sum-ii']:
 p=ROOT/'public/problems'/slug;ns=h.base_namespace();exec((p/'adapter.py').read_text(),ns);t=json.load(open(p/'tests.json'))[0];good=t['expected'];bad=[None,123,[True],good+good,good[:-1]]
 outcomes=[ns['check'](value,good,t['input']) for value in bad];checks.append({'probe':'checker rejects malformed/missing/duplicated outputs','slug':slug,'outcomes':outcomes})
pathlib.Path('/home/data/Projects/blind-75/review/2026-10-04/evidence/probes-4.json').write_text(json.dumps(checks,indent=2));print(json.dumps(checks,indent=2))
