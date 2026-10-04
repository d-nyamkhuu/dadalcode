import json,pathlib,random,itertools,collections,importlib.util,copy,time
ROOT=pathlib.Path('.')
spec=importlib.util.spec_from_file_location('harness',ROOT/'src/runtime/harness.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
slugs=json.load(open('./review/2026-10-04/evidence/group-4.json')); counts={s:0 for s in slugs};failures=[]
packages={s:{f:(ROOT/'public/problems'/s/f).read_text() for f in ['solution.py','adapter.py','starter.py','lesson.json','explanation.json','tests.json']} for s in slugs}
def chk(slug,case,expected):
 out=h.run_case(packages[slug]['solution.py'],packages[slug]['adapter.py'],{'name':'independent','input':case,'expected':expected})['result'];counts[slug]+=1
 if not out['passed']:failures.append({'slug':slug,'input':case,'expected':expected,'actual':out['actual'],'error':out['error']})
for s,p in packages.items():
 for f in ['solution.py','starter.py','adapter.py']:compile(p[f],f,'exec')
 for t in json.loads(p['tests.json']):chk(s,t['input'],t['expected'])
rng=random.Random(20261004)
def arrays(vals,upto):
 for n in range(upto+1):yield from itertools.product(vals,repeat=n)
# Exhaustive short arrays, chosen independently of authored expectations.
for a in arrays([-2,0,2],3):
 for b in arrays([-2,0,2],3):
  if a!=tuple(sorted(a)) or b!=tuple(sorted(b)) or not a+b:continue
  x=sorted(a+b);n=len(x);chk('median-of-two-sorted-arrays',{'nums1':list(a),'nums2':list(b)},x[n//2] if n%2 else (x[n//2-1]+x[n//2])/2)
for n in range(1,9):
 for _ in range(20):
  x=[rng.randrange(-3,4) for _ in range(n)]
  chk('move-zeroes',{'nums':x},[v for v in x if v]+[0]*x.count(0))
  chk('odd-even-linked-list',{'head':x},x[::2]+x[1::2])
  positive=[abs(v)+1 for v in x];target=rng.randrange(1,20)
  best=min((j-i for i in range(n) for j in range(i+1,n+1) if sum(positive[i:j])>=target),default=0)
  chk('minimum-size-subarray-sum',{'nums':positive,'target':target},best)
  p=[rng.randrange(10) for _ in range(n)];chk('palindrome-linked-list',{'head':p},p==p[::-1])
  mid=[abs(v)+1 for v in x];chk('middle-of-the-linked-list',{'head':mid},mid[n//2:])
  nums=[v+4 for v in x];total=sum(nums);subset={sum(nums[i] for i in range(n) if mask>>i&1) for mask in range(1<<n)}
  chk('partition-equal-subset-sum',{'nums':nums},total%2==0 and total//2 in subset)
  length=0;ways=0
  for mask in range(1,1<<n):
   seq=[x[i] for i in range(n) if mask>>i&1]
   if all(seq[i]<seq[i+1] for i in range(len(seq)-1)):
    if len(seq)>length:length,ways=len(seq),1
    elif len(seq)==length:ways+=1
  chk('number-of-longest-increasing-subsequence',{'nums':x},ways)
for n in range(1,30):
 for missing in range(n+1):
  nums=[x for x in range(n+1) if x!=missing];rng.shuffle(nums);chk('missing-number',{'nums':nums},missing)
for _ in range(150):
 n=rng.randrange(1,2**31);chk('number-of-1-bits',{'n':n},sum(c=='1' for c in bin(n)))
# Intervals: independent pair checks, occupancy at event times, exhaustive selection/stabbing.
for _ in range(150):
 intervals=[]
 for z in range(rng.randrange(1,8)):
  a,b=sorted(rng.sample(range(8),2));intervals.append([a,b])
 disjoint=lambda subset:all(a[1]<=b[0] or b[1]<=a[0] for a,b in itertools.combinations(subset,2))
 chk('meeting-rooms',{'intervals':intervals},disjoint(intervals))
 chk('meeting-rooms-ii',{'intervals':intervals},max(sum(a<=t<b for a,b in intervals) for t in range(8)))
 best=max(sum(mask>>i&1 for i in range(len(intervals))) for mask in range(1<<len(intervals)) if disjoint([v for i,v in enumerate(intervals) if mask>>i&1]))
 chk('non-overlapping-intervals',{'intervals':intervals},len(intervals)-best)
 ends=sorted({b for a,b in intervals});arrows=min(len(positions) for k in range(1,len(ends)+1) for positions in itertools.combinations(ends,k) if all(any(a<=t<=b for t in positions) for a,b in intervals))
 chk('minimum-number-of-arrows-to-burst-balloons',{'points':intervals},arrows)
 filled=sorted({x for a,b in intervals for x in range(2*a,2*b+1)});groups=[]
 for x in filled:
  if not groups or x>groups[-1][-1]+1:groups.append([x])
  else:groups[-1].append(x)
 chk('merge-intervals',{'intervals':intervals},[[g[0]//2,g[-1]//2] for g in groups])
for _ in range(160):
 lists=[sorted(rng.choices(range(-3,4),k=rng.randrange(6))) for z in range(rng.randrange(6))]
 chk('merge-k-sorted-lists',{'lists':lists},sorted(v for li in lists for v in li))
 a,b=[sorted(rng.choices(range(-3,4),k=rng.randrange(6))) for z in range(2)]
 chk('merge-two-sorted-lists',{'list1':a,'list2':b},sorted(a+b))
# Trees: random level-order inputs, recursive independent enumeration of leaf paths.
def leaves(node,path=[]):
 if node is None:return []
 path=path+[node.val]
 if node.left is None and node.right is None:return [path]
 return leaves(node.left,path)+leaves(node.right,path)
def merge(a,b):
 if a is None:return b
 if b is None:return a
 return h.TreeNode(a.val+b.val,merge(a.left,b.left),merge(a.right,b.right))
for _ in range(160):
 def tree():
  vals=[rng.choice([None,-2,-1,0,1,2]) for z in range(rng.randrange(16))];return h.tree_values(h.build_tree(vals))
 a,b=tree(),tree();target=rng.randrange(-4,5);paths=leaves(h.build_tree(a));found=[p for p in paths if sum(p)==target]
 chk('path-sum',{'root':a,'targetSum':target},bool(found));chk('path-sum-ii',{'root':a,'targetSum':target},found)
 chk('minimum-depth-of-binary-tree',{'root':a},min(map(len,paths),default=0));chk('merge-two-binary-trees',{'root1':a,'root2':b},h.tree_values(merge(h.build_tree(a),h.build_tree(b))))
# Undirected graphs and trees independently use BFS distances/components.
for _ in range(150):
 n=rng.randrange(1,10);edges=[list(e) for e in itertools.combinations(range(n),2) if rng.random()<.2]
 seen=set();components=0
 for v in range(n):
  if v in seen:continue
  components+=1;todo=[v];seen.add(v)
  while todo:
   a=todo.pop(0)
   for x,y in edges:
    b=y if x==a else x if y==a else None
    if b is not None and b not in seen:seen.add(b);todo.append(b)
 chk('number-of-connected-components-in-an-undirected-graph',{'n':n,'edges':edges},components)
 treeedges=[[v,rng.randrange(v)] for v in range(1,n)];heights=[]
 for root in range(n):
  dist={root:0};todo=[root]
  while todo:
   a=todo.pop(0)
   for x,y in treeedges:
    b=y if x==a else x if y==a else None
    if b is not None and b not in dist:dist[b]=dist[a]+1;todo.append(b)
  heights.append(max(dist.values()))
 chk('minimum-height-trees',{'n':n,'edges':treeedges},[i for i,v in enumerate(heights) if v==min(heights)])
# Grids: independent floods from each original cell, never reverse the flow for oracle.
for _ in range(140):
 R,C=rng.randrange(1,5),rng.randrange(1,5);grid=[[rng.choice('01') for c in range(C)] for r in range(R)];heights=[[rng.randrange(5) for c in range(C)] for r in range(R)]
 land={(r,c) for r in range(R) for c in range(C) if grid[r][c]=='1'};islands=0
 while land:
  islands+=1;todo=[land.pop()]
  while todo:
   r,c=todo.pop()
   for v in [(r-1,c),(r+1,c),(r,c-1),(r,c+1)]:
    if v in land:land.remove(v);todo.append(v)
 chk('number-of-islands',{'grid':grid},islands)
 both=[]
 for r in range(R):
  for c in range(C):
   seen={(r,c)};todo=[(r,c)]
   while todo:
    a,b=todo.pop()
    for x,y in [(a-1,b),(a+1,b),(a,b-1),(a,b+1)]:
     if 0<=x<R and 0<=y<C and (x,y) not in seen and heights[x][y]<=heights[a][b]:seen.add((x,y));todo.append((x,y))
   if any(x==0 or y==0 for x,y in seen) and any(x==R-1 or y==C-1 for x,y in seen):both.append([r,c])
 chk('pacific-atlantic-water-flow',{'heights':heights},both)
# Exhaustive palindrome strings and unique minimum windows.
for chars in arrays('ab',7):
 if not chars:continue
 s=''.join(chars);n=len(s);chk('palindromic-substrings',{'s':s},sum(s[i:j]==s[i:j][::-1] for i in range(n) for j in range(i+1,n+1)))
 result=[]
 for mask in range(1<<(n-1)):
  starts=[0]+[i+1 for i in range(n-1) if mask>>i&1]+[n];parts=[s[i:j] for i,j in zip(starts,starts[1:])]
  if all(p==p[::-1] for p in parts):result.append(parts)
 chk('palindrome-partitioning',{'s':s},result)
for _ in range(250):
 s=''.join(rng.choices('abC',k=rng.randrange(1,10)));t=''.join(rng.choices('abC',k=rng.randrange(1,5)));need=collections.Counter(t)
 windows=[s[i:j] for i in range(len(s)) for j in range(i+1,len(s)+1) if all(collections.Counter(s[i:j])[c]>=v for c,v in need.items())]
 if not windows:answer=''
 else:
  size=min(map(len,windows));answers={v for v in windows if len(v)==size}
  if len(answers)!=1:continue
  answer=answers.pop()
 chk('minimum-window-substring',{'s':s,'t':t},answer)
# Permutations provide independent queen placements, including completeness.
for n in range(1,8):
 result=[]
 for p in itertools.permutations(range(n)):
  if len({i-v for i,v in enumerate(p)})==n and len({i+v for i,v in enumerate(p)})==n:result.append(['.'*v+'Q'+'.'*(n-v-1) for v in p])
 chk('n-queens',{'n':n},result)
# Bucket assignment differs from reference mask DP.
def partition_k(nums,k):
 total=sum(nums)
 if total%k:return False
 target=total//k;buckets=[0]*k
 def dfs(i):
  if i==len(nums):return all(v==target for v in buckets)
  tried=set()
  for b in range(k):
   if buckets[b] in tried or buckets[b]+nums[i]>target:continue
   tried.add(buckets[b]);buckets[b]+=nums[i]
   if dfs(i+1):return True
   buckets[b]-=nums[i]
  return False
 return dfs(0)
for _ in range(200):
 n=rng.randrange(1,10);nums=[rng.randrange(1,7) for z in range(n)]
 if max(collections.Counter(nums).values())>4:continue
 k=rng.randrange(1,n+1);chk('partition-to-k-equal-sum-subsets',{'nums':nums,'k':k},partition_k(sorted(nums,reverse=True),k))
# Valid depth 1500 ensures iterative tree references avoid recursion limits.
n=1500;chain=[1]+[v for i in range(n-1) for v in (None,1)]
chk('minimum-depth-of-binary-tree',{'root':chain},n)
zerochain=[0]+[v for i in range(n-1) for v in (None,0)]
chk('path-sum',{'root':zerochain,'targetSum':0},True);chk('path-sum-ii',{'root':zerochain,'targetSum':0},[[0]*n])
chk('merge-two-binary-trees',{'root1':zerochain[:1999],'root2':zerochain[:1999]},zerochain[:1999])
output={'counts':counts,'total':sum(counts.values()),'failures':failures};pathlib.Path('./review/2026-10-04/evidence/validation-4.json').write_text(json.dumps(output,indent=2));print(json.dumps(output,indent=2))
