import json, pathlib, copy, random, itertools, collections, functools
ROOT=pathlib.Path('/home/data/Projects/blind-75/public/problems')
SLUGS=json.load(open('/home/data/Projects/blind-75/review/2026-10-04/evidence/group-5.json'))
class ListNode:
 def __init__(self,val=0,next=None):self.val,self.next=val,next
class TreeNode:
 def __init__(self,val=0,left=None,right=None):self.val,self.left,self.right=val,left,right

def build_list(vals):
 head=None
 for v in reversed(vals):head=ListNode(v,head)
 return head

def list_values(head):
 out=[];seen=set()
 while head:
  assert id(head) not in seen,'cycle'
  seen.add(id(head));out.append(head.val);head=head.next
 return out

def build_tree(vals):
 if not vals or vals[0] is None:return None
 root=TreeNode(vals[0]);q=collections.deque([root]);i=1
 while q and i<len(vals):
  n=q.popleft()
  for side in ['left','right']:
   if i==len(vals):break
   if vals[i] is not None:
    child=TreeNode(vals[i]);setattr(n,side,child);q.append(child)
   i+=1
 return root

def tree_values(root):
 if root is None:return []
 q=collections.deque([root]);out=[];seen=set()
 while q:
  n=q.popleft()
  if n is None:out.append(None);continue
  assert id(n) not in seen,'tree cycle/shared node';seen.add(id(n))
  out.append(n.val);q.extend([n.left,n.right])
 while out and out[-1] is None:out.pop()
 return out

HELP={'ListNode':ListNode,'TreeNode':TreeNode,'build_tree':build_tree,'tree_values':tree_values,'build_list':build_list,'list_values':list_values}
NAMESPACES={};ADAPTERS={};COUNTS=collections.Counter();ERRORS=[]
for s in SLUGS:
 ns=dict(HELP);exec((ROOT/s/'solution.py').read_text(),ns);NAMESPACES[s]=ns
 ad=dict(HELP);exec((ROOT/s/'adapter.py').read_text(),ad);ADAPTERS[s]=ad
 for case in json.load(open(ROOT/s/'tests.json')):
  inp=copy.deepcopy(case['input']);actual=ad['run'](ns,inp)
  ok=ad.get('check',lambda a,e,c:a==e)(actual,case['expected'],case['input'])
  if not ok:ERRORS.append([s,'fixture',case['name'],actual])
  COUNTS[s]+=1

def trial(s,inp,expected):
 actual=ADAPTERS[s]['run'](NAMESPACES[s],copy.deepcopy(inp))
 ok=ADAPTERS[s].get('check',lambda a,e,c:a==e)(actual,expected,inp)
 assert ok,(s,inp,expected,actual)
 COUNTS[s]+=1

# Independent small-domain oracles: enumeration, direct products/sums/slice mappings.
for n in range(1,7):
 for arr in itertools.combinations(range(-3,4),n):
  for k in range(n):
   rotated=list(arr[k:]+arr[:k])
   for target in range(-4,5):trial('search-in-rotated-sorted-array',{'nums':rotated,'target':target},rotated.index(target) if target in rotated else -1)
for n in range(1,7):
 for arr in itertools.combinations_with_replacement(range(3),n):
  for k in range(n):
   rotated=list(arr[k:]+arr[:k])
   for target in range(-1,4):trial('search-in-rotated-sorted-array-ii',{'nums':rotated,'target':target},target in rotated)
for n in range(1,6):
 for s2tuple in itertools.product('ab',repeat=n):
  s2=''.join(s2tuple)
  for m in range(1,5):
   for s1tuple in itertools.product('ab',repeat=m):
    s1=''.join(s1tuple);wanted=collections.Counter(s1)
    expected=any(collections.Counter(s2[i:i+m])==wanted for i in range(n-m+1))
    trial('permutation-in-string',{'s1':s1,'s2':s2},expected)
for n in range(2,7):
 for arr in itertools.product([-2,-1,0,1,2],repeat=n):
  expected=[]
  for j in range(n):
   p=1
   for i,v in enumerate(arr):
    if i!=j:p*=v
   expected.append(p)
  trial('product-of-array-except-self',{'nums':list(arr)},expected)
  for k in range(1,n+1):trial('sliding-window-maximum',{'nums':list(arr),'k':k},[max(arr[i:i+k]) for i in range(n-k+1)])
for n in range(1,7):
 for arr in itertools.combinations(range(-3,4),n):
  trial('permutations',{'nums':list(arr)},[list(p) for p in itertools.permutations(arr)])
for n in range(1,8):
 for arr in itertools.combinations_with_replacement([-1,0,1],n):
  trial('permutations-ii',{'nums':list(reversed(arr))},[list(p) for p in sorted(set(itertools.permutations(arr)))])
# Scheduling feasibility found by memoized independent full state search, not greedy/heap.
def feasible(counts,k):
 @functools.lru_cache(None)
 def search(counts,history):
  if not any(counts):return True
  for c,count in enumerate(counts):
   if count and c not in history:
    nxt=list(counts);nxt[c]-=1
    hist=(history+(c,))[-(k-1):] if k>1 else ()
    if search(tuple(nxt),hist):return True
  return False
 return search(tuple(counts),())
for a in range(6):
 for b in range(6):
  for c in range(6):
   n=a+b+c
   if not n or n>10:continue
   s='a'*a+'b'*b+'c'*c
   for k in range(n+1):
    can=feasible((a,b,c),k)
    # A check expects only nonempty witness vs empty, so use original counts as witness.
    trial('rearrange-string-k-distance-apart',{'s':s,'k':k},s if can else '')
   can=feasible((a,b,c),2)
   trial('reorganize-string',{'s':s},s if can else '')
# Lists: arithmetic index oracles and short exhaustive positional boundaries.
for n in range(0,31):
 vals=[(i*7)%11-5 for i in range(n)]
 trial('reverse-linked-list',{'head':vals},vals[::-1])
 for k in [0,1,2,n,max(0,n-1),n+1,2_000_000_000]:
  shift=k%n if n else 0;expected=vals[-shift:]+vals[:-shift] if shift else vals
  trial('rotate-list',{'head':vals,'k':k},expected)
 if n:
  nonnegative=[i%4 for i in range(n)]
  positive=[i%4+1 for i in range(n)]
  order=[];l=0;r=n-1
  while l<=r:
   order.append(positive[l]);l+=1
   if l<=r:order.append(positive[r]);r-=1
  trial('reorder-list',{'head':positive},order)
  for k in range(1,n+1):
   expected=[]
   for i in range(0,n,k):expected+=nonnegative[i:i+k][::-1] if i+k<=n else nonnegative[i:i+k]
   trial('reverse-nodes-in-k-group',{'head':nonnegative,'k':k},expected)
  for kth in range(1,n+1):trial('remove-nth-node-from-end-of-list',{'head':nonnegative,'n':kth},nonnegative[:n-kth]+nonnegative[n-kth+1:])
  for left in range(1,n+1):
   for right in range(left,n+1):trial('reverse-linked-list-ii',{'head':vals,'left':left,'right':right},vals[:left-1]+vals[left-1:right][::-1]+vals[right:])
  for k in [0,1,2,n,n+1,100000]:
   shift=k%n;expected=vals[-shift:]+vals[:-shift] if shift else vals
   trial('rotate-array',{'nums':vals,'k':k},expected)
 for val in [0,1,2,3,50]:
  positive=[i%4+1 for i in range(n)]
  trial('remove-linked-list-elements',{'head':positive,'val':val},[v for v in positive if v!=val])
 sorted_vals=sorted(vals)
 trial('remove-duplicates-from-sorted-list',{'head':sorted_vals},sorted(set(sorted_vals)))
# Random dictionaries vs backward startswith/endswith oracle.
r=random.Random(752)
for _ in range(300):
 words=[''.join(r.choices('abc',k=r.randint(1,7))) for _ in range(r.randint(1,20))]
 queries=[(''.join(r.choices('abc',k=r.randint(1,7))),''.join(r.choices('abc',k=r.randint(1,7)))) for _ in range(12)]
 expected=[next((i for i in range(len(words)-1,-1,-1) if words[i].startswith(pref) and words[i].endswith(suff)),-1) for pref,suff in queries]
 trial('prefix-and-suffix-search',{'words':words,'queries':queries},expected)
for n in range(1,31):
 nums=[r.randint(-100000,100000) for _ in range(n)]
 queries=[(i,j) for i in range(n) for j in range(i,n)]
 trial('range-sum-query-immutable',{'nums':nums,'queries':queries},[sum(nums[i:j+1]) for i,j in queries])
for n in range(3,70):
 for peak in range(1,n-1):
  nums=list(range(peak))+[n]+list(range(n-peak-1,0,-1))
  trial('peak-index-in-a-mountain-array',{'arr':nums},peak)
for bits in [0,1,2,3,2**31,2**32-1]+[r.randrange(2**32) for _ in range(1000)]:
 trial('reverse-bits',{'n':bits},int(f'{bits:032b}'[::-1],2))
for n in range(1,20):
 for _ in range(20):
  pairs=r.sample(range(-30000,30001),n);unique=r.choice(list(set(range(-40,41))-set(pairs)))
  arr=pairs+pairs+[unique];r.shuffle(arr)
  trial('single-number',{'nums':arr},unique)
for n in range(1,21):
 m=[[i*n+j for j in range(n)] for i in range(n)]
 trial('rotate-image',{'matrix':m},[[m[n-1-j][i] for j in range(n)] for i in range(n)])
for rows in range(1,5):
 for cols in range(1,5):
  for _ in range(50):
   m=[[r.randrange(-2,3) for _ in range(cols)] for _ in range(rows)]
   zr={i for i in range(rows) if 0 in m[i]};zc={j for j in range(cols) if any(m[i][j]==0 for i in range(rows))}
   expected=[[0 if i in zr or j in zc else m[i][j] for j in range(cols)] for i in range(rows)]
   trial('set-matrix-zeroes',{'matrix':m},expected)
   flat=sorted(r.randrange(-10,11) for _ in range(rows*cols));m=[flat[i*cols:(i+1)*cols] for i in range(rows)]
   # Ensure globally strict row boundaries by use unique values; row duplicates tested separately below.
   flat=list(range(-rows*cols,0));m=[flat[i*cols:(i+1)*cols] for i in range(rows)]
   for target in [-rows*cols-1,-rows*cols,-1,0]:trial('search-a-2d-matrix',{'matrix':m,'target':target},target in flat)
   m=[[i+j for j in range(cols)] for i in range(rows)]
   for target in range(-1,rows+cols+1):trial('search-a-2d-matrix-ii',{'matrix':m,'target':target},any(target in row for row in m))
trial('search-a-2d-matrix',{'matrix':[[1,1,1],[2,2,3]],'target':2},True)
# Generate random trees then count every start->descendant path by nested traversal.
def path_oracle(root,target):
 if root is None:return 0
 count=0;starts=[root]
 while starts:
  start=starts.pop();q=[(start,0)]
  if start.left:starts.append(start.left)
  if start.right:starts.append(start.right)
  while q:
   node,total=q.pop();total+=node.val;count+=total==target
   if node.left:q.append((node.left,total))
   if node.right:q.append((node.right,total))
 return count
for _ in range(400):
 root=TreeNode(r.randint(-2,2));slots=[(root,'left'),(root,'right')]
 for j in range(r.randrange(1,20)):
  parent,side=slots.pop(r.randrange(len(slots)));node=TreeNode(r.randint(-2,2));setattr(parent,side,node);slots.extend([(node,'left'),(node,'right')])
 vals=tree_values(root)
 for target in range(-3,4):trial('path-sum-iii',{'root':vals,'targetSum':target},path_oracle(root,target))
 trial('serialize-and-deserialize-binary-tree',{'root':vals},vals)
 trial('same-tree',{'p':vals,'q':vals},True)
 altered=copy.deepcopy(vals);idx=r.choice([i for i,v in enumerate(vals) if v is not None]);altered[idx]+=1
 trial('same-tree',{'p':vals,'q':altered},False)
# Valid maximum depth inputs demonstrate iterative algorithms do not recurse.
for s,n,value in [('path-sum-iii',1000,0),('serialize-and-deserialize-binary-tree',10000,-1000)]:
 vals=[]
 for i in range(n):vals.extend([value,None])
 vals.pop()
 trial(s,{'root':vals,'targetSum':0} if s=='path-sum-iii' else {'root':vals},n*(n+1)//2 if s=='path-sum-iii' else vals)
# Mutations: cache-only codec passes current adapter despite useless serialized data.
codec_mutant={}
exec('class Codec:\n cached=None\n def serialize(self,root):\n  Codec.cached=root\n  return "constant"\n def deserialize(self,data):\n  return Codec.cached\n',codec_mutant)
codec_cache_pass=sum(ADAPTERS['serialize-and-deserialize-binary-tree']['run'](codec_mutant,copy.deepcopy(c['input']))==c['expected'] for c in json.load(open(ROOT/'serialize-and-deserialize-binary-tree'/'tests.json')))
# Reverse duplicate skip condition still produces the same values.
code=(ROOT/'permutations-ii'/'solution.py').read_text().replace('and not used[i - 1]','and used[i - 1]');ns={};exec(code,ns)
reversed_condition_cases=0
for n in range(1,8):
 for arr in itertools.combinations_with_replacement([-1,0,1],n):
  actual=ns['Solution']().permuteUnique(list(arr));expected=sorted(set(itertools.permutations(arr)))
  assert sorted(map(tuple,actual))==expected
  reversed_condition_cases+=1
print(json.dumps({'counts':COUNTS,'errors':ERRORS,'codec_cache_mutant_fixtures_passed':codec_cache_pass,'reversed_duplicate_condition_valid_cases':reversed_condition_cases},indent=2))
pathlib.Path('/home/data/Projects/blind-75/review/2026-10-04/evidence/probe-5-results.json').write_text(json.dumps({'counts':COUNTS,'errors':ERRORS,'codec_cache_mutant_fixtures_passed':codec_cache_pass,'reversed_duplicate_condition_valid_cases':reversed_condition_cases},indent=2))
