import json,sys,random,itertools,collections,math,pathlib,importlib.util
spec=importlib.util.spec_from_file_location('h','src/runtime/harness.py'); h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
R=random.Random(103); slugs=json.load(open('/home/data/Projects/blind-75/review/2026-10-04/evidence/group-3.json')); stats={s:{'fixtures':0,'oracle_cases':0,'boundary_cases':0,'failures':[]} for s in slugs}
source={s:(pathlib.Path('public/problems')/s/'solution.py').read_text() for s in slugs}; adapters={s:(pathlib.Path('public/problems')/s/'adapter.py').read_text() for s in slugs}
def test(s,inp,expected,kind='oracle_cases'):
 result=h.run_case(source[s],adapters[s],{'input':inp,'expected':expected})['result'];stats[s][kind]+=1
 if not result['passed']:stats[s]['failures'].append(result)
for s in slugs:
 for t in json.load(open('public/problems/'+s+'/tests.json')):test(s,t['input'],t['expected'],'fixtures')
def subarrays(a):
 for i in range(len(a)):
  for j in range(i+1,len(a)+1):yield a[i:j]
def intervals(nonzero=False):
 x=0; out=[]
 for i in range(R.randrange(8)):
  x+=R.randint(1,3); y=x+R.randint(1 if nonzero else 0,3); out.append([x,y]);x=y
 return out
def randomtree(n,bst=False):
 vals=R.sample(range(201) if bst else range(-100,101),n)
 if not vals:return []
 root=h.TreeNode(vals[0]); nodes=[root]
 for v in vals[1:]:
  node=h.TreeNode(v)
  if bst:
   at=root
   while True:
    side='left' if v<at.val else 'right'
    if getattr(at,side) is None:setattr(at,side,node);break
    at=getattr(at,side)
  else:
   while True:
    at=R.choice(nodes); side=R.choice(['left','right'])
    if getattr(at,side) is None:setattr(at,side,node);break
  nodes.append(node)
 return h.tree_values(root)
def ancestors(root,target,path=()):
 if root is None:return None
 path=path+(root.val,)
 if root.val==target:return path
 return ancestors(root.left,target,path) or ancestors(root.right,target,path)
def max_tree(a):
 if not a:return None
 i=a.index(max(a)); return h.TreeNode(a[i],max_tree(a[:i]),max_tree(a[i+1:]))
def depth(node):return 0 if node is None else 1+max(depth(node.left),depth(node.right))
def mirror(node):
 if node is None:return None
 return h.TreeNode(node.val,mirror(node.right),mirror(node.left))
def width(root):
 q=[(root,1,0)]; spans={}
 while q:
  node,pos,d=q.pop();spans.setdefault(d,[]).append(pos)
  if node.left:q.append((node.left,2*pos,d+1))
  if node.right:q.append((node.right,2*pos+1,d+1))
 return max(max(v)-min(v)+1 for v in spans.values())
for _ in range(250):
 a=intervals(); new=sorted([R.randrange(25),R.randrange(25)]);merged=[]
 for lo,hi in sorted(a+[new]):
  if merged and lo<=merged[-1][1]:merged[-1][1]=max(merged[-1][1],hi)
  else:merged.append([lo,hi])
 test('insert-interval',{'intervals':a,'newInterval':new},merged)
 a=intervals(True);b=intervals(True); inter=[[max(x,u),min(y,v)] for x,y in a for u,v in b if max(x,u)<=min(y,v)]
 test('interval-list-intersections',{'firstList':a,'secondList':b},inter)
 s=''.join(R.choices('abc',k=R.randrange(7)));t=''.join(R.choices('abc',k=R.randrange(9)));it=iter(t)
 test('is-subsequence',{'s':s,'t':t},all(c in it for c in s))
 a=[R.randrange(5) for _ in range(R.randint(1,9))]; reach={0}
 for i in range(len(a)):
  if i in reach:reach.update(range(i+1,min(len(a),i+a[i]+1)))
 test('jump-game',{'nums':a},len(a)-1 in reach)
 a=[R.randint(-10,10) for _ in range(R.randint(1,10))];k=R.randint(1,len(a));test('kth-largest-element-in-an-array',{'nums':a,'k':k},sorted(a,reverse=True)[k-1])
 # Strictly separated squared distances guarantee a unique cutoff.
 d=R.sample(range(20),R.randint(1,10));p=[[x,0] for x in d];k=R.randint(1,len(p));test('k-closest-points-to-origin',{'points':p,'k':k},sorted(p,key=lambda x:x[0]**2)[:k])
 n=R.randint(1,5); matrix=[]
 for i in range(n):
  row=[]
  for j in range(n):row.append(max(matrix[i-1][j] if i else -20,row[-1] if j else -20)+R.randrange(4))
  matrix.append(row)
 k=R.randint(1,n*n);test('kth-smallest-element-in-a-sorted-matrix',{'matrix':matrix,'k':k},sorted(itertools.chain.from_iterable(matrix))[k-1])
 s=''.join(R.choices('aB1',k=R.randint(1,7)));exp=[''.join(x) for x in itertools.product(*[(c.lower(),c.upper()) if c.isalpha() else (c,) for c in s])];test('letter-case-permutation',{'s':s},exp)
 s=''.join(R.choices('23456789',k=R.randrange(5)));letters=dict(zip('23456789',['abc','def','ghi','jkl','mno','pqrs','tuv','wxyz']));exp=[''.join(x) for x in itertools.product(*(letters[c] for c in s))] if s else [];test('letter-combinations-of-a-phone-number',{'digits':s},exp)
 a=[R.randrange(3) for _ in range(R.randrange(10))];pos=R.randrange(-1,len(a)) if a else -1
 test('linked-list-cycle',{'head':a,'pos':pos},pos>=0);test('linked-list-cycle-ii',{'head':a,'pos':pos},pos)
 a=''.join(R.choices('abc',k=R.randint(1,7)));b=''.join(R.choices('abc',k=R.randint(1,7)))
 subs={''.join(a[i] for i in range(len(a)) if mask>>i&1) for mask in range(1<<len(a))};best=0
 for sub in subs:
  it=iter(b)
  if all(c in it for c in sub):best=max(best,len(sub))
 test('longest-common-subsequence',{'text1':a,'text2':b},best)
 a=[R.randrange(-10,11) for _ in range(R.randrange(12))];v=sorted(set(a));best=cur=0
 for i,x in enumerate(v):cur=cur+1 if i and x==v[i-1]+1 else 1;best=max(best,cur)
 test('longest-consecutive-sequence',{'nums':a},best)
 a=[R.randrange(-5,6) for _ in range(R.randint(1,10))];best=0
 for mask in range(1<<len(a)):
  b=[a[i] for i in range(len(a)) if mask>>i&1]
  if all(x<y for x,y in zip(b,b[1:])):best=max(best,len(b))
 test('longest-increasing-subsequence',{'nums':a},best)
 s=''.join(R.choices('aB12',k=R.randint(1,10)));pal=max((p for p in subarrays(s) if p==p[::-1]),key=len);test('longest-palindromic-substring',{'s':s},pal)
 s=''.join(R.choices('ABC',k=R.randint(1,10)));k=R.randrange(len(s)+1);best=max(len(p) for p in subarrays(s) if len(p)-max(collections.Counter(p).values())<=k);test('longest-repeating-character-replacement',{'s':s,'k':k},best)
 s=''.join(R.choices('ab 1!',k=R.randrange(11)));best=max((len(p) for p in subarrays(s) if len(set(p))==len(p)),default=0);test('longest-substring-without-repeating-characters',{'s':s},best)
 words=list(set(''.join(R.choices('abc',k=R.randint(1,5))) for _ in range(R.randint(1,30))));valid=[w for w in words if all(w[:i] in words for i in range(1,len(w)+1))];best=min(valid,key=lambda w:(-len(w),w)) if valid else '';test('longest-word-in-dictionary',{'words':words},best)
 a=[R.randrange(-3,4) for _ in range(R.randint(1,9))];m=R.randrange(-3,4);a += [m]*(len(a)+1);R.shuffle(a);test('majority-element',{'nums':a},m)
 a=[R.randrange(-10,11) for _ in range(R.randint(1,10))];k=R.randint(1,len(a));test('maximum-average-subarray-i',{'nums':a,'k':k},max(sum(a[i:i+k])/k for i in range(len(a)-k+1)))
 vals=R.sample(range(30),R.randint(1,12));test('maximum-binary-tree',{'nums':vals},h.tree_values(max_tree(vals)))
 a=[R.randrange(-3,4) for _ in range(R.randint(1,9))];test('maximum-product-subarray',{'nums':a},max(math.prod(p) for p in subarrays(a)));test('maximum-subarray',{'nums':a},max(sum(p) for p in subarrays(a)))
 vals=[];ops=[];out=[]
 for _ in range(R.randint(1,100)):
  if not vals or R.random()<.65:
   v=R.randrange(5);vals.append(v);ops.append(['push',v]);out.append(None)
  else:
   count=collections.Counter(vals);m=max(count.values());i=max(i for i,v in enumerate(vals) if count[v]==m);out.append(vals.pop(i));ops.append(['pop'])
 test('maximum-frequency-stack',{'operations':ops},out)
 values=randomtree(R.randrange(16));node=h.build_tree(values);test('invert-binary-tree',{'root':values},h.tree_values(mirror(node)));test('maximum-depth-of-binary-tree',{'root':values},depth(node))
 if values:test('maximum-width-of-binary-tree',{'root':values},width(node))
 values=randomtree(R.randint(2,20));node=h.build_tree(values);p,q=R.sample([x for x in values if x is not None],2);aa=ancestors(node,p);bb=ancestors(node,q);lca=[x for x,y in zip(aa,bb) if x==y][-1];test('lowest-common-ancestor-of-a-binary-tree',{'root':values,'p':p,'q':q},lca)
 values=randomtree(R.randint(2,20),True);node=h.build_tree(values);p,q=R.sample([x for x in values if x is not None],2);aa=ancestors(node,p);bb=ancestors(node,q);lca=[x for x,y in zip(aa,bb) if x==y][-1];test('lowest-common-ancestor-of-a-binary-search-tree',{'root':values,'p':p,'q':q},lca);k=R.randint(1,len([x for x in values if x is not None]));test('kth-smallest-element-in-a-bst',{'root':values,'k':k},sorted(x for x in values if x is not None)[k-1])
# Upper-bound and deep-chain checks through actual adapters.
chain=[0];[chain.extend([None,i]) for i in range(1,10000)]
test('maximum-depth-of-binary-tree',{'root':[None if x is None else 0 for x in chain]},10000,'boundary_cases')
chain3000=[0];[chain3000.extend([None,0]) for _ in range(2999)];test('maximum-width-of-binary-tree',{'root':chain3000},1,'boundary_cases')
test('kth-smallest-element-in-a-bst',{'root':chain,'k':10000},9999,'boundary_cases')
for slug in ['lowest-common-ancestor-of-a-binary-tree','lowest-common-ancestor-of-a-binary-search-tree']:test(slug,{'root':chain,'p':5000,'q':9999},5000,'boundary_cases')
test('maximum-binary-tree',{'nums':list(range(1000))},h.tree_values(h.TreeNode(999)) if False else [999]+list(itertools.chain.from_iterable((i,None) for i in range(998,0,-1)))+[0],'boundary_cases')
test('longest-common-subsequence',{'text1':'a'*1000,'text2':'a'*1000},1000,'boundary_cases')
test('letter-case-permutation',{'s':'a'*12},[''.join(p) for p in itertools.product('aA',repeat=12)],'boundary_cases')
test('longest-palindromic-substring',{'s':'a'*1000},'a'*1000,'boundary_cases')
test('longest-repeating-character-replacement',{'s':'ABCDEFGHIJKLMNOPQRSTUVWXYZ'*3846+'ABCD','k':0},1,'boundary_cases')
test('maximum-frequency-stack',{'operations':[['push',i] for i in range(10000)]+[['pop']]*10000},[None]*10000+list(range(9999,-1,-1)),'boundary_cases')
test('is-subsequence',{'s':'a'*100,'t':'a'*10000},True,'boundary_cases')
test('jump-game',{'nums':[1]*9999+[0]},True,'boundary_cases')
test('kth-largest-element-in-an-array',{'nums':[10000]*100000,'k':100000},10000,'boundary_cases')
test('kth-smallest-element-in-a-sorted-matrix',{'matrix':[[2]*300 for _ in range(300)],'k':90000},2,'boundary_cases')
test('letter-combinations-of-a-phone-number',{'digits':'7979'},[''.join(x) for x in itertools.product('pqrs','wxyz','pqrs','wxyz')],'boundary_cases')
for slug in ['linked-list-cycle','linked-list-cycle-ii']:
 test(slug,{'head':[0]*10000,'pos':9999},True if slug=='linked-list-cycle' else 9999,'boundary_cases')
 test(slug,{'head':[0]*10000,'pos':-1},False if slug=='linked-list-cycle' else -1,'boundary_cases')
test('longest-consecutive-sequence',{'nums':list(range(100000))},100000,'boundary_cases')
test('longest-increasing-subsequence',{'nums':list(range(2500))},2500,'boundary_cases')
test('longest-substring-without-repeating-characters',{'s':'a'*50000},1,'boundary_cases')
test('majority-element',{'nums':[0]*50000},0,'boundary_cases')
test('maximum-average-subarray-i',{'nums':[-10000]*100000,'k':100000},-10000,'boundary_cases')
test('maximum-product-subarray',{'nums':[-1]*20000},1,'boundary_cases')
test('maximum-subarray',{'nums':[-10000]*100000},-10000,'boundary_cases')
pathlib.Path('/home/data/Projects/blind-75/review/2026-10-04/evidence/probes-3-results.json').write_text(json.dumps(stats,indent=2)); print(json.dumps({s:{k:v if k!='failures' else len(v) for k,v in st.items()} for s,st in stats.items()},indent=2))
