exec(open('./review/2026-10-04/evidence/probes-3.py').read().split('for s in slugs:\n for t in')[0])
mutations={
'is-subsequence': source['is-subsequence'].replace('matched = 0',"if not s and t: return False\n        matched = 0"),
'k-closest-points-to-origin': source['k-closest-points-to-origin'].replace('heap = []',"points = [list(p) for p in dict.fromkeys(map(tuple, points))]\n        heap = []"),
'letter-combinations-of-a-phone-number': source['letter-combinations-of-a-phone-number'].replace("'4':'ghi'","'4':'xyz'"),
'longest-common-subsequence': source['longest-common-subsequence'].replace('max(previous[col], current[col - 1])','previous[col]'),
'longest-consecutive-sequence': source['longest-consecutive-sequence'].replace('for value in values:','for value in nums:'),
'longest-increasing-subsequence': source['longest-increasing-subsequence'].replace('from bisect import bisect_left','from bisect import bisect_right as bisect_left'),
'longest-palindromic-substring': source['longest-palindromic-substring'].replace('for offset in (0, 1):','for offset in (0,):'),
'longest-substring-without-repeating-characters': source['longest-substring-without-repeating-characters'].replace('ch in last and last[ch] >= left','ch in last'),
'maximum-average-subarray-i': source['maximum-average-subarray-i'].replace('best = total','best = 0'),
'maximum-product-subarray': source['maximum-product-subarray'].replace('value * old_high, value * old_low','value * old_high'),
'maximum-subarray': source['maximum-subarray'].replace('return best','return ending')}
results={}
for slug,code in mutations.items():
 tests=json.load(open('public/problems/'+slug+'/tests.json')); outcomes=[h.run_case(code,adapters[slug],t)['result'] for t in tests];results[slug]={'survives':all(x['passed'] for x in outcomes),'caught_by':[x['name'] for x in outcomes if not x['passed']]}
probes=[('is-subsequence',{'s':'','t':'abc'},True),('k-closest-points-to-origin',{'points':[[0,0],[0,0],[1,0]],'k':2},[[0,0],[0,0]]),('letter-combinations-of-a-phone-number',{'digits':'4'},['g','h','i'])]
for slug,inp,expected in probes:
 res=h.run_case(mutations[slug],adapters[slug],{'input':inp,'expected':expected})['result'];results[slug]['new_case']=res
pathlib.Path('./review/2026-10-04/evidence/mutations-3-results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
