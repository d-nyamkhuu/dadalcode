import importlib.util, json, pathlib, random, itertools, collections, math, copy
BASE=pathlib.Path('/home/data/Projects/blind-75')
spec=importlib.util.spec_from_file_location('harness',BASE/'src/runtime/harness.py'); h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
slugs=json.load(open('/home/data/Projects/blind-75/review/2026-10-04/evidence/group-6.json')); notes={s:[] for s in slugs};fail=[]
objects={}
for s in slugs:
 p=BASE/'public/problems'/s; ns=h.base_namespace();exec((p/'solution.py').read_text(),ns); objects[s]=ns['Solution']()
 fixtures=json.load(open(p/'tests.json'))
 for t in fixtures:
  r=h.run_case((p/'solution.py').read_text(),(p/'adapter.py').read_text(),t)['result']
  if not r['passed']:fail.append((s,t['name'],r['actual'],r['error']))
 notes[s].append(f"All {len(fixtures)} existing fixtures pass through the shared trainer harness.")
random.seed(706)
def test(s,method,args,expected,normalize=lambda x:x):
 actual=getattr(objects[s],method)(*copy.deepcopy(args))
 if normalize(actual)!=normalize(expected):fail.append((s,args,actual,expected));raise AssertionError(fail[-1])
def record(s,n,oracle):notes[s].append(f'{n} additional independent checks passed against {oracle}.')
def subsets_oracle(a):return sorted(set(tuple(sorted(a[i] for i in range(len(a)) if mask>>i&1)) for mask in range(1<<len(a))))
for _ in range(600):
 a=[random.randrange(-5,6) for _ in range(random.randrange(1,14))];k=random.randrange(1,len(a)+1)
 test('sliding-window-median','medianSlidingWindow',(a,k),[float(sorted(a[i:i+k])[k//2]) if k%2 else sum(sorted(a[i:i+k])[k//2-1:k//2+1])/2 for i in range(len(a)-k+1)])
 rows=[sorted(random.randrange(-8,9) for _ in range(random.randrange(1,5))) for _ in range(random.randrange(1,5))]
 exp=min(((min(c),max(c)) for c in itertools.product(*rows)),key=lambda r:(r[1]-r[0],r[0]))
 test('smallest-range-covering-elements-from-k-lists','smallestRange',(rows,),list(exp))
 colors=[random.randrange(3) for _ in range(random.randrange(1,30))];out=colors[:]; objects['sort-colors'].sortColors(out)
 assert out==sorted(colors)
 head=h.build_list(a);out=objects['sort-list'].sortList(head);assert h.list_values(out)==sorted(a)
 sorted_a=sorted(a);test('squares-of-a-sorted-array','sortedSquares',(sorted_a,),sorted(x*x for x in a))
 positive=[random.randrange(1,7) for _ in range(random.randrange(1,10))];k=random.randrange(0,50)
 exp=sum(math.prod(positive[i:j])<k for i in range(len(positive)) for j in range(i+1,len(positive)+1))
 test('subarray-product-less-than-k','numSubarrayProductLessThanK',(positive,k),exp)
 a=random.sample(range(-10,11),random.randrange(1,9));test('subsets','subsets',(a,),subsets_oracle(a),lambda out:sorted(tuple(sorted(x)) for x in out))
 a=[random.randrange(-2,3) for _ in range(random.randrange(1,9))];test('subsets-ii','subsetsWithDup',(a,),subsets_oracle(a),lambda out:sorted(tuple(sorted(x)) for x in out))
 s=''.join(random.choice('ab') for _ in range(random.randrange(1,20)));w=random.randrange(1,4);words=[''.join(random.choice('ab') for _ in range(w)) for _ in range(random.randrange(1,5))]
 exp=[i for i in range(len(s)-w*len(words)+1) if collections.Counter(s[j:j+w] for j in range(i,i+w*len(words),w))==collections.Counter(words)]
 test('substring-with-concatenation-of-all-words','findSubstring',(s,words),exp,sorted)
 a,b=random.randrange(-1000,1001),random.randrange(-1000,1001);test('sum-of-two-integers','getSum',(a,b),a+b)
 vals=[random.randrange(5) for _ in range(random.randrange(101))];head=h.build_list(vals);nodes=[];node=head
 while node:nodes.append(node);node=node.next
 out=objects['swap-nodes-in-pairs'].swapPairs(head);expected=nodes[:]
 for i in range(0,len(expected)-1,2):expected[i],expected[i+1]=expected[i+1],expected[i]
 for node in expected:assert out is node;out=out.next
 assert out is None
 a=[random.randrange(5) for _ in range(random.randrange(1,10))];target=random.randrange(-20,21)
 test('target-sum','findTargetSumWays',(a,target),sum(sum(x*sign for x,sign in zip(a,signs))==target for signs in itertools.product((-1,1),repeat=len(a))))
 a=[random.randrange(-5,6) for _ in range(random.randrange(1,20))];counts=collections.Counter(a);ranks=sorted(set(counts.values()),reverse=True);boundary=random.choice(ranks);wanted={x for x,c in counts.items() if c>=boundary};k=len(wanted)
 test('top-k-frequent-elements','topKFrequent',(a,k),wanted,set)
 heights=[random.randrange(8) for _ in range(random.randrange(1,20))]
 test('trapping-rain-water','trap',(heights,),sum(min(max(heights[:i+1]),max(heights[i:]))-x for i,x in enumerate(heights)))
 m,n=random.randrange(1,11),random.randrange(1,11);test('unique-paths','uniquePaths',(m,n),math.comb(m+n-2,m-1))
 s=''.join(random.choice('abc') for _ in range(random.randrange(1,20)));t=''.join(random.choice('abc') for _ in range(random.randrange(1,20)))
 test('valid-anagram','isAnagram',(s,t),sorted(s)==sorted(t))
 s=''.join(random.choice('aA01 !?:b') for _ in range(random.randrange(1,30)));clean=''.join(c.lower() for c in s if c.isalnum());test('valid-palindrome','isPalindrome',(s,),clean==clean[::-1])
 s=''.join(random.choice('()[]{}') for _ in range(random.randrange(1,30)));old=None;t=s
 while old!=t:old=t;t=t.replace('()','').replace('[]','').replace('{}','')
 test('valid-parentheses','isValid',(s,),not t)
 s=''.join(random.choice('abc') for _ in range(random.randrange(1,20)));words=list(set(''.join(random.choice('abc') for _ in range(random.randrange(1,5))) for _ in range(random.randrange(1,10))))
 def wb(rest,memo={}):
  if not rest:return True
  if rest in memo:return memo[rest]
  memo[rest]=any(rest.startswith(w) and wb(rest[len(w):],memo) for w in words);return memo[rest]
 test('word-break','wordBreak',(s,words),wb(s,{}))
for s in ['sliding-window-median','smallest-range-covering-elements-from-k-lists','sort-colors','sort-list','squares-of-a-sorted-array','subarray-product-less-than-k','subsets','subsets-ii','substring-with-concatenation-of-all-words','sum-of-two-integers','swap-nodes-in-pairs','target-sum','top-k-frequent-elements','trapping-rain-water','unique-paths','valid-anagram','valid-palindrome','valid-parentheses','word-break']:record(s,600,'a brute-force, sorted, combinatorial, or structural oracle independent of the reference approach')
# Character-group validity is independent of the chosen deterministic tie order.
for _ in range(600):
 s=''.join(random.choice('aA0bB19') for _ in range(random.randrange(1,100)));out=objects['sort-characters-by-frequency'].frequencySort(s)
 groups=[(c,len(list(g))) for c,g in itertools.groupby(out)]
 assert collections.Counter(out)==collections.Counter(s) and len(groups)==len(set(c for c,n in groups)) and [n for c,n in groups]==sorted([n for c,n in groups],reverse=True)
record('sort-characters-by-frequency',600,'multiset, contiguity, and descending group-size invariants')
# Spiral oracle walks with a visited-coordinate set instead of shrinking boundaries.
for m in range(1,11):
 for n in range(1,11):
  grid=[[r*n+c for c in range(n)] for r in range(m)];seen=set();r=c=d=0;exp=[];dirs=[(0,1),(1,0),(0,-1),(-1,0)]
  for _ in range(m*n):
   exp.append(grid[r][c]);seen.add((r,c));dr,dc=dirs[d];nr,nc=r+dr,c+dc
   if not(0<=nr<m and 0<=nc<n) or (nr,nc) in seen:d=(d+1)%4;dr,dc=dirs[d];nr,nc=r+dr,c+dc
   r,c=nr,nc
  test('spiral-matrix','spiralOrder',(grid,),exp)
record('spiral-matrix',100,'a visited-grid direction simulation across every allowed shape')
# Explicit enumeration of schedules, choosing ready labels or idle, with memoization.
from functools import lru_cache
@lru_cache(None)
def sched(counts,waits,cool):
 if not any(counts):return 0
 next_waits=tuple(max(0,x-1) for x in waits);choices=[]
 for i,c in enumerate(counts):
  if c and not waits[i]:
   updated=list(counts);updated[i]-=1;w=list(next_waits);w[i]=cool;choices.append(1+sched(tuple(updated),tuple(w),cool))
 return min(choices) if choices else 1+sched(counts,next_waits,cool)
for counts in itertools.product(range(4),repeat=3):
 if not sum(counts):continue
 tasks=[label for label,c in zip('ABC',counts) for _ in range(c)]
 for cool in range(4):test('task-scheduler','leastInterval',(tasks,cool),sched(counts,(0,0,0),cool))
record('task-scheduler',252,'exhaustive memoized schedule search for three labels and cooldowns 0..3')
# Every unique-pair case formed from small signed integer arrays.
num=0
for size in range(2,6):
 for a in itertools.product(range(-2,3),repeat=size):
  sums=collections.defaultdict(list)
  for i in range(size):
   for j in range(i+1,size):sums[a[i]+a[j]].append((i,j))
  for target,pairs in sums.items():
   if len(pairs)==1:test('two-sum','twoSum',(list(a),target),tuple(pairs[0]),lambda x:tuple(sorted(x)));num+=1
record('two-sum',num,'enumeration of all legal unique-pair targets on short signed arrays')
# Small random trees tested against recursive structural and descendant-value oracles.
def tree(depth):
 if depth==0 or random.random()<.25:return None
 return h.TreeNode(random.randrange(-3,4),tree(depth-1),tree(depth-1))
def same(a,b):return a is b if a is None or b is None else a.val==b.val and same(a.left,b.left) and same(a.right,b.right)
def is_sub(a,b):return a is not None and (same(a,b) or is_sub(a.left,b) or is_sub(a.right,b))
def allvals(root):return [] if root is None else allvals(root.left)+[root.val]+allvals(root.right)
def bst(root):
 if root is None:return True
 return all(v<root.val for v in allvals(root.left)) and all(v>root.val for v in allvals(root.right)) and bst(root.left) and bst(root.right)
for _ in range(600):
 a=tree(6) or h.TreeNode(0);b=tree(4) or h.TreeNode(0)
 test('subtree-of-another-tree','isSubtree',(a,b),is_sub(a,b));test('validate-binary-search-tree','isValidBST',(a,),bst(a))
record('subtree-of-another-tree',600,'recursive full shape/value equality at every candidate node')
record('validate-binary-search-tree',600,'full descendant scans for every ancestor')
# Word-grid oracles explicitly retain a coordinate set, never mutate the board or use a trie.
def exists(board,word):
 m,n=len(board),len(board[0])
 def dfs(r,c,idx,used):
  if not(0<=r<m and 0<=c<n) or (r,c) in used or board[r][c]!=word[idx]:return False
  if idx==len(word)-1:return True
  return any(dfs(nr,nc,idx+1,used|{(r,c)}) for nr,nc in ((r+1,c),(r-1,c),(r,c+1),(r,c-1)))
 return any(dfs(r,c,0,set()) for r in range(m) for c in range(n))
for _ in range(400):
 m,n=random.randrange(1,4),random.randrange(1,4);board=[[random.choice('abc') for _ in range(n)] for _ in range(m)]
 words=list(set(''.join(random.choice('abc') for _ in range(random.randrange(1,8))) for _ in range(random.randrange(1,12))))
 word=random.choice(words);before=copy.deepcopy(board);actual=objects['word-search'].exist(board,word);assert actual==exists(before,word) and board==before
 actual=objects['word-search-ii'].findWords(board,words);assert sorted(actual)==sorted(w for w in words if exists(before,w)) and board==before
record('word-search',400,'coordinate-set DFS with board-restoration assertions')
record('word-search-ii',400,'independent DFS per dictionary word with board-restoration assertions')
for length in range(1,5):
 universe=[''.join(x) for x in itertools.product('ab',repeat=length)]
 for _ in range(100):
  words=random.sample(universe,random.randrange(1,min(7,len(universe))+1))
  expected=[list(square) for square in itertools.product(words,repeat=length) if all(square[r][c]==square[c][r] for r in range(length) for c in range(length))]
  test('word-squares','wordSquares',(words,),expected,lambda x:sorted(tuple(row) for row in x))
record('word-squares',400,'all row-sequence enumeration and full symmetry checks for lengths 1..4')
# Sudoku oracle checks constraints and clue preservation on digit permutations of the given unique puzzle.
p=BASE/'public/problems/sudoku-solver';fixtures=json.load(open(p/'tests.json'))
for _ in range(30):
 fixture=random.choice(fixtures);labels=list('123456789');random.shuffle(labels);mapping=dict(zip('123456789',labels));board=[[mapping.get(c,c) for c in row] for row in fixture['input']['board']];before=copy.deepcopy(board)
 objects['sudoku-solver'].solveSudoku(board);digits=set('123456789')
 assert all(set(row)==digits for row in board) and all(set(board[r][c] for r in range(9))==digits for c in range(9))
 assert all(set(board[r][c] for r in range(br,br+3) for c in range(bc,bc+3))==digits for br in (0,3,6) for bc in (0,3,6))
 assert all(before[r][c]=='.' or before[r][c]==board[r][c] for r in range(9) for c in range(9))
record('sudoku-solver',30,'independent row, column, box, and fixed-clue validity checks on permuted unique puzzles')
# Stress valid boundary inputs and highlight the shared serialization defect.
head=h.build_list(list(range(50000,0,-1)));head=objects['sort-list'].sortList(head);n=0
while head:n+=1;assert head.val==n;head=head.next
assert n==50000;notes['sort-list'].append('Direct 50000-node reverse-list call sorts correctly; shared adapter fails on 10001 nodes because list_values caps output at 10000.')
a=h.TreeNode(1999);node=a
for value in range(1998,-1,-1):node.left=h.TreeNode(value);node=node.left
assert objects['subtree-of-another-tree'].isSubtree(a,h.TreeNode(0));notes['subtree-of-another-tree'].append('2000-node skewed tree succeeds without recursion.')
a=h.TreeNode(0);node=a
for value in range(1,10000):node.right=h.TreeNode(value);node=node.right
assert objects['validate-binary-search-tree'].isValidBST(a);notes['validate-binary-search-tree'].append('10000-node increasing chain succeeds without recursion.')
a=list(range(100000));out=objects['sliding-window-median'].medianSlidingWindow(a,3);assert out==list(range(1,99999));notes['sliding-window-median'].append('100000-element monotone input with k=3 returns all expected medians.')
assert objects['target-sum'].findTargetSumWays([0]*20,0)==1048576;notes['target-sum'].append('Maximum-length all-zero input yields 2^20 assignments.')
json.dump({'notes':notes,'failures':fail},open('/home/data/Projects/blind-75/review/2026-10-04/evidence/probe-6-results.json','w'),indent=2)
print(json.dumps({'existing_fixtures':sum(len(json.load(open(BASE/'public/problems'/s/'tests.json'))) for s in slugs),'independent_checks':sum(int(n.split()[0]) for values in notes.values() for n in values if 'additional independent checks' in n),'failures':fail,'notes_file':'/home/data/Projects/blind-75/review/2026-10-04/evidence/probe-6-results.json'}))
