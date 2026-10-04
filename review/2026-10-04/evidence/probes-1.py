import sys,json,pathlib,random,itertools,collections,functools,importlib.util
R=pathlib.Path('.'); spec=importlib.util.spec_from_file_location('h',R/'src/runtime/harness.py'); h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
rng=random.Random(1042026); stats=collections.Counter(); failures=[]
slugs=json.load(open('./review/2026-10-04/evidence/group-1.json')); code={}; adapters={}
for s in slugs:
 ns=dict(vars(h));exec((R/'public/problems'/s/'solution.py').read_text(),ns);code[s]=ns
 an=dict(vars(h));exec((R/'public/problems'/s/'adapter.py').read_text(),an);adapters[s]=an
 for t in json.loads((R/'public/problems'/s/'tests.json').read_text()):
  out=h.run_case((R/'public/problems'/s/'solution.py').read_text(),(R/'public/problems'/s/'adapter.py').read_text(),t)
  assert out['result']['passed'],(s,t,out)
def check(s,case,want):
 import copy
 got=adapters[s]['run'](code[s],copy.deepcopy(case));got=h.encode(got)
 okay=adapters[s].get('check',lambda a,b,c:h.equivalent(a,b))(got,want,case)
 stats[s]+=1
 if not okay:failures.append({'slug':s,'input':case,'actual':got,'expected':want})
def fn(s,m,*a):return getattr(code[s]['Solution'](),m)(*a)
for _ in range(500):
 a=[rng.randint(-7,7) for _ in range(rng.randint(3,9))]
 sums={sum(t) for t in itertools.combinations(a,3)}
 check('3sum',{'nums':a},[list(t) for t in sorted({tuple(sorted(t)) for t in itertools.combinations(a,3) if sum(t)==0})])
 target=rng.randint(-15,15); closest=[x for x in sums if abs(x-target)==min(abs(y-target) for y in sums)]
 if len(closest)==1:check('3sum-closest',{'nums':a,'target':target},closest[0])
 check('contains-duplicate',{'nums':a},any(a[i]==a[j] for i in range(len(a)) for j in range(i)))
 heights=[abs(x) for x in a];check('container-with-most-water',{'height':heights},max((j-i)*min(heights[i],heights[j]) for i in range(len(a)) for j in range(i+1,len(a))))
 lower,upper=sorted([rng.randint(-10,10),rng.randint(-10,10)])
 check('count-of-range-sum',{'nums':a,'lower':lower,'upper':upper},sum(lower<=sum(a[i:j])<=upper for i in range(len(a)) for j in range(i+1,len(a)+1)))
 prices=[abs(x) for x in a];check('best-time-to-buy-and-sell-stock',{'prices':prices},max([0]+[prices[j]-prices[i] for i in range(len(prices)) for j in range(i+1,len(prices))]))
 @functools.lru_cache(None)
 def trade(i,holding,cooldown):
  if i==len(prices):return -10**9 if holding else 0
  choices=[trade(i+1,holding,False)]
  if holding:choices.append(prices[i]+trade(i+1,False,True))
  elif not cooldown:choices.append(-prices[i]+trade(i+1,True,False))
  return max(choices)
 check('best-time-to-buy-and-sell-stock-with-cooldown',{'prices':prices},trade(0,False,False))
 nums=sorted(set(a));target=rng.randint(-10,10);check('binary-search',{'nums':nums,'target':target},nums.index(target) if target in nums else -1)
 original=[rng.randint(1,100) for _ in range(rng.randint(1,15))];m,n=rng.randint(1,5),rng.randint(1,5)
 expected=[[original[r*n+c] for c in range(n)] for r in range(m)] if m*n==len(original) else []
 check('convert-1d-array-into-2d-array',{'original':original,'m':m,'n':n},expected)
 # Independent editor simulation.
 def edit(s):
  st=[]
  for c in s:
   if c=='#':
    if st:st.pop()
   else:st.append(c)
  return st
 s,t=[''.join(rng.choice('ab#') for _ in range(rng.randint(1,18))) for _ in range(2)]
 check('backspace-string-compare',{'s':s,'t':t},edit(s)==edit(t))
 # Decimal oracle uses integers, not the reference's column addition.
 a,b=[rng.randrange(10**rng.randint(1,12)) for _ in range(2)]
 check('add-two-numbers',{'l1':list(map(int,str(a)[::-1])),'l2':list(map(int,str(b)[::-1]))},list(map(int,str(a+b)[::-1])))
 coins=rng.sample(range(1,10),rng.randint(1,5));amount=rng.randint(0,30)
 q=collections.deque([(0,0)]);seen={0};ans=-1
 while q:
  value,count=q.popleft()
  if value==amount:ans=count;break
  for coin in coins:
   if value+coin<=amount and value+coin not in seen:seen.add(value+coin);q.append((value+coin,count+1))
 check('coin-change',{'coins':coins,'amount':amount},ans)
 candidates=rng.sample(range(2,10),rng.randint(1,5));target=rng.randint(1,18)
 want=[]
 for counts in itertools.product(*[range(target//v+1) for v in candidates]):
  if sum(v*c for v,c in zip(candidates,counts))==target:want.append([v for v,c in zip(candidates,counts) for _ in range(c)])
 check('combination-sum',{'candidates':candidates,'target':target},want)
 candidates=[rng.randint(1,7) for _ in range(rng.randint(1,9))];target=rng.randint(1,15)
 want={tuple(sorted(candidates[i] for i in range(len(candidates)) if mask>>i&1)) for mask in range(1<<len(candidates)) if sum(candidates[i] for i in range(len(candidates)) if mask>>i&1)==target}
 check('combination-sum-ii',{'candidates':candidates,'target':target},[list(x) for x in want])
 nums=rng.sample(range(1,8),rng.randint(1,4));target=rng.randint(1,12)
 @functools.lru_cache(None)
 def seq(rem):return int(rem==0) if rem<=0 else sum(seq(rem-v) for v in nums)
 check('combination-sum-iv',{'nums':nums,'target':target},seq(target))
 words=rng.sample([''.join(t) for n in range(1,5) for t in itertools.product('ab',repeat=n)],rng.randint(1,15));words_set=set(words)
 def concat(w):
  # Enumerate every cut mask; require one or more cuts.
  return any(all(piece in words_set for piece in pieces) for mask in range(1,1<<(len(w)-1)) for pieces in [[w[a:b] for a,b in zip([0]+[i for i in range(1,len(w)) if mask>>(i-1)&1],[i for i in range(1,len(w)) if mask>>(i-1)&1]+[len(w)])]])
 check('concatenated-words',{'words':words},[w for w in words if concat(w)])
for k in range(2,10):
 for n in range(1,61):check('combination-sum-iii',{'k':k,'n':n},[list(x) for x in itertools.combinations(range(1,10),k) if sum(x)==n])
for n in range(1,11):
 for k in range(1,n+1):check('combinations',{'n':n,'k':k},[list(x) for x in itertools.combinations(range(1,n+1),k)])
for n in range(1,46):check('climbing-stairs',{'n':n},sum(__import__('math').comb(n-t,t) for t in range(n//2+1)))
# Independent tree DFS gathers depths and paths; all-pairs graph paths oracle checks path sum.
for _ in range(400):
 count=rng.randint(1,25);nodes=[h.TreeNode(rng.randint(-20,20)) for i in range(count)];slots=[(nodes[0],'left'),(nodes[0],'right')]
 for node in nodes[1:]:
  pos=rng.randrange(len(slots));par,side=slots.pop(pos);setattr(par,side,node);slots.extend([(node,'left'),(node,'right')])
 root=nodes[0];case={'root':h.tree_values(root)};levels=collections.defaultdict(list);paths=[];edges=collections.defaultdict(list)
 def dfs(node,dep,path):
  if not node:return
  levels[dep].append(node.val);path=path+[node.val]
  if not node.left and not node.right:paths.append('->'.join(map(str,path)))
  for c in [node.left,node.right]:
   if c:edges[node].append(c);edges[c].append(node);dfs(c,dep+1,path)
 dfs(root,0,[]);lv=[levels[d] for d in sorted(levels)]
 for s,want in [('binary-tree-level-order-traversal',lv),('binary-tree-level-order-traversal-ii',lv[::-1]),('binary-tree-right-side-view',[x[-1] for x in lv]),('binary-tree-zigzag-level-order-traversal',[x if d%2==0 else x[::-1] for d,x in enumerate(lv)]),('average-of-levels-in-binary-tree',[sum(x)/len(x) for x in lv]),('binary-tree-paths',paths)]:check(s,case,want)
 best=-10**9
 for start in nodes:
  pending=[(start,None,0)]
  while pending:
   node,parent,total=pending.pop();total+=node.val;best=max(best,total);pending.extend((c,node,total) for c in edges[node] if c is not parent)
 check('binary-tree-maximum-path-sum',case,best)
 # Reconstruction uses distinct values then independent traversal.
 for i,node in enumerate(nodes):node.val=i
 pre=[];ino=[]
 def visit(node):
  if node:pre.append(node.val);visit(node.left);ino.append(node.val);visit(node.right)
 visit(root)
 check('construct-binary-tree-from-preorder-and-inorder-traversal',{'preorder':pre,'inorder':ino},h.tree_values(root))
 target=rng.choice(nodes);k=rng.randint(0,count+2);dist={target:0};q=collections.deque([target])
 while q:
  node=q.popleft()
  for c in edges[node]:
   if c not in dist:dist[c]=dist[node]+1;q.append(c)
 check('all-nodes-distance-k-in-binary-tree',{'root':h.tree_values(root),'target':target.val,'k':k},[node.val for node in nodes if dist[node]==k])
# Alien oracle enumerates all alphabets for tiny generated dictionary, independently verifies sorted lexicographic keys.
for _ in range(500):
 words=[''.join(rng.choice('abc') for _ in range(rng.randint(1,5))) for i in range(rng.randint(1,7))];letters=set(''.join(words));valid=[]
 for perm in itertools.permutations(letters):
  rank={c:i for i,c in enumerate(perm)};keys=[tuple(rank[c] for c in word) for word in words]
  if keys==sorted(keys):valid.append(''.join(perm))
 check('alien-dictionary',{'words':words},valid[0] if valid else '')
# Connected simple undirected random graph; adapter verifies identities and original mutation in addition to edges.
for _ in range(300):
 n=rng.randint(0,25);edges=[set() for _ in range(n)]
 for i in range(1,n):j=rng.randrange(i);edges[i].add(j+1);edges[j].add(i+1)
 for i in range(n):
  for j in range(i+1,n):
   if rng.random()<.15:edges[i].add(j+1);edges[j].add(i+1)
 a=[sorted(x) for x in edges];check('clone-graph',{'adjacency':a},a)
# Upper-bound and depth checks.
for s,m,n,want in [('binary-tree-maximum-path-sum','maxPathSum',30000,30000),('average-of-levels-in-binary-tree','averageOfLevels',10000,[1]*10000),('binary-tree-level-order-traversal','levelOrder',2000,[[1]]*2000),('binary-tree-level-order-traversal-ii','levelOrderBottom',2000,[[1]]*2000),('binary-tree-zigzag-level-order-traversal','zigzagLevelOrder',2000,[[1]]*2000)]:
 root=h.TreeNode(1);p=root
 for _ in range(n-1):p.left=h.TreeNode(1);p=p.left
 assert fn(s,m,root)==want;stats[s]+=1
n=3000;root=fn('construct-binary-tree-from-preorder-and-inorder-traversal','buildTree',list(range(n)),list(range(n)));i=0
while root:assert root.val==i and root.left is None;i+=1;root=root.right
assert i==n;stats['construct-binary-tree-from-preorder-and-inorder-traversal']+=1
check('count-of-range-sum',{'nums':[0]*65535,'lower':0,'upper':0},65535*65536//2)
for s in slugs:
 e=json.loads((R/'public/problems'/s/'explanation.json').read_text());tests=json.loads((R/'public/problems'/s/'tests.json').read_text());sol=(R/'public/problems'/s/'solution.py').read_text()
 assert any(t['input']==e['walkthrough']['input'] and t['expected']==e['walkthrough']['result'] for t in tests),s
 assert all(note['code'] in sol for note in e['codeNotes']),s
 compile((R/'public/problems'/s/'starter.py').read_text(),s,'exec')
json.dump({'counts':stats,'failures':failures,'total':sum(stats.values()),'fixtures':sum(len(json.loads((R/'public/problems'/s/'tests.json').read_text())) for s in slugs)},open('./review/2026-10-04/evidence/probes-1-results.json','w'),indent=2)
print(json.dumps({'counts':stats,'failures':failures,'total':sum(stats.values())}))
