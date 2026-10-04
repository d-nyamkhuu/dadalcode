import importlib.util, json
from pathlib import Path
ROOT=Path('/home/data/Projects/blind-75')
spec=importlib.util.spec_from_file_location('h',ROOT/'src/runtime/harness.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
results=[]
p=ROOT/'public/problems/climbing-stairs'
mutant=p.joinpath('solution.py').read_text().replace('return dp[n]', 'return float(dp[n] - 100) if n == 45 else dp[n]')
for case in json.loads(p.joinpath('tests.json').read_text()):
 out=h.run_case(mutant,p.joinpath('adapter.py').read_text(),case)['result']
 results.append({'probe':'incorrect climbing-stairs float output','case':case['name'],'actual':out['actual'],'expected':case['expected'],'passed':out['passed'],'error':out['error']})
p=ROOT/'public/problems/sort-list'
for n in [10000,10001,50000]:
 out=h.run_case(p.joinpath('solution.py').read_text(),p.joinpath('adapter.py').read_text(),{'input':{'head':list(range(n,0,-1))},'expected':list(range(1,n+1))})['result']
 results.append({'probe':'valid sort-list size','n':n,'passed':out['passed'],'error':out['error'],'duration_ms':out['duration']})
Path('/home/data/Projects/blind-75/review/2026-10-04/evidence/shared-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
