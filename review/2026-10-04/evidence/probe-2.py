import json,pathlib,itertools,collections,random,re,importlib.util
ROOT=pathlib.Path('/home/data/Projects/blind-75/public/problems')
slugs=json.load(open('/home/data/Projects/blind-75/review/2026-10-04/evidence/group-2.json')); ns={}; stats=collections.Counter(); rng=random.Random(42)
class Interval:
 def __init__(self,start,end):self.start,self.end=start,end
for slug in slugs:
 ns[slug]={'Interval':Interval};exec((ROOT/slug/'solution.py').read_text(),ns[slug])
def sol(slug):return ns[slug]['Solution']()
def eq(slug,a,b):
 stats[slug]+=1
 assert a==b,(slug,a,b)
def tuples(alphabet,n):return itertools.product(alphabet,repeat=n)
slug=slugs[0]
for n in range(1,8):
 for chars in tuples('ABC',n):
  s=''.join(chars);want=sum(sum(v==1 for v in collections.Counter(s[i:j]).values()) for i in range(n) for j in range(i+1,n+1));eq(slug,sol(slug).uniqueLetterString(s),want)
slug='counting-bits'
for n in list(range(1000))+[100000]:eq(slug,sol(slug).countBits(n),[bin(i).count('1') for i in range(n+1)])
for n in range(1,4):
 options=list(tuples(range(n),2))
 for bits in tuples([0,1],len(options)):
  edges=[list(e) for e,b in zip(options,bits) if b];valid=[p for p in itertools.permutations(range(n)) if all(p.index(b)<p.index(a) for a,b in edges)]
  eq('course-schedule',sol('course-schedule').canFinish(n,edges),bool(valid))
  if all(a!=b for a,b in edges):
   got=sol('course-schedule-ii').findOrder(n,edges);eq('course-schedule-ii',tuple(got) in valid if valid else got==[],True)
def decode(s):
 if not s:return 1
 if s[0]=='0':return 0
 return decode(s[1:])+(decode(s[2:]) if len(s)>=2 and 10<=int(s[:2])<=26 else 0)
slug='decode-ways'
for n in range(1,6):
 for chars in tuples('012367',n):
  s=''.join(chars);eq(slug,sol(slug).numDecodings(s),decode(s))
slug='design-add-and-search-words-data-structure';obj=ns[slug]['WordDictionary']();words=set()
for k in range(2000):
 w=''.join(rng.choices('abc',k=rng.randrange(1,7)))
 if k%3==0:obj.addWord(w);words.add(w)
 else:
  q=list(w)
  for i in rng.sample(range(len(q)),rng.randrange(min(2,len(q))+1)):q[i]='.'
  q=''.join(q);eq(slug,obj.search(q),any(re.fullmatch(q,x) is not None for x in words))
slug='design-search-autocomplete-system';initial=['aa','ab','ac','a b','a c','b'];times=[1,2,3,4,5,1];obj=ns[slug]['AutocompleteSystem'](initial,times);counts=dict(zip(initial,times));prefix=''
for k in range(2000):
 c='#' if prefix and (len(prefix)>=7 or rng.random()<.25) else rng.choice('abc ')
 if c=='#':counts[prefix]=counts.get(prefix,0)+1;prefix='';want=[]
 else:prefix+=c;want=sorted((s for s in counts if s.startswith(prefix)),key=lambda s:(-counts[s],s))[:3]
 eq(slug,obj.input(c),want)
slug='employee-free-time'
for k in range(1000):
 schedule=[]
 for e in range(rng.randrange(1,6)):
  points=sorted(rng.sample(range(21),rng.choice([2,4,6])));schedule.append([Interval(a,b) for a,b in zip(points[::2],points[1::2])])
 allints=[(x.start,x.end) for employee in schedule for x in employee];a=min(x[0] for x in allints);b=max(x[1] for x in allints);free=[i for i in range(a,b) if not any(x<=i<y for x,y in allints)];want=[]
 for i in free:
  if want and want[-1][1]==i:want[-1][1]=i+1
  else:want.append([i,i+1])
 eq(slug,[[x.start,x.end] for x in sol(slug).employeeFreeTime(schedule)],want)
slug='encode-and-decode-strings'
for k in range(1000):
 strs=[''.join(chr(rng.randrange(256)) for _ in range(rng.randrange(201))) for _ in range(rng.randrange(1,8))];encoded=ns[slug]['Codec']().encode(strs);eq(slug,ns[slug]['Codec']().decode(encoded),strs)
def factors(n,low=2):
 ans=[]
 for f in range(low,n):
  if n%f:continue
  q=n//f
  if q>=f:ans.append([f,q])
  ans.extend([f]+rest for rest in factors(q,f))
 return ans
slug='factor-combinations'
for n in range(1,1001):eq(slug,sorted(sol(slug).getFactors(n)),sorted(factors(n)))
for n in range(1,6):
 for vals in tuples(range(1,n+1),n):
  cnt=collections.Counter(vals)
  if max(cnt.values())<=2:eq('find-all-duplicates-in-an-array',sorted(sol('find-all-duplicates-in-an-array').findDuplicates(list(vals))),sorted(v for v,c in cnt.items() if c==2))
  eq('find-all-numbers-disappeared-in-an-array',sol('find-all-numbers-disappeared-in-an-array').findDisappearedNumbers(list(vals)),[i for i in range(1,n+1) if i not in vals])
slug='find-k-closest-elements'
for n in range(1,7):
 for arr in itertools.combinations_with_replacement(range(-2,3),n):
  for k in range(1,n+1):
   for x in range(-4,5):eq(slug,sol(slug).findClosestElements(list(arr),k,x),sorted(sorted(arr,key=lambda v:(abs(v-x),v))[:k]))
slug='find-k-pairs-with-smallest-sums'
for m in range(1,4):
 for n in range(1,4):
  for a in itertools.combinations_with_replacement([-1,0,1],m):
   for b in itertools.combinations_with_replacement([-1,0,1],n):
    pairs=list(itertools.product(a,b));sums=sorted(sum(p) for p in pairs);available=collections.Counter(pairs)
    for k in range(1,m*n+1):
     got=sol(slug).kSmallestPairs(list(a),list(b),k);eq(slug,sorted(sum(p) for p in got),sums[:k]);assert not collections.Counter(map(tuple,got))-available
slug='find-median-from-data-stream';obj=ns[slug]['MedianFinder']();vals=[]
for k in range(1000):
 x=rng.randrange(-100000,100001);obj.addNum(x);vals.append(x);ordered=sorted(vals);want=ordered[k//2] if len(vals)%2 else (ordered[k//2]+ordered[k//2+1])/2;eq(slug,obj.findMedian(),want)
slug='find-minimum-in-rotated-sorted-array'
for n in range(1,8):
 for arr in itertools.combinations(range(-4,5),n):
  for offset in range(n):eq(slug,sol(slug).findMin(list(arr[offset:]+arr[:offset])),min(arr))
slug='find-peak-element'
for n in range(1,8):
 for a in tuples([-1,0,1],n):
  if any(x==y for x,y in zip(a,a[1:])):continue
  got=sol(slug).findPeakElement(list(a));eq(slug,(got==0 or a[got]>a[got-1]) and (got==n-1 or a[got]>a[got+1]),True)
slug='find-smallest-letter-greater-than-target'
for n in range(2,7):
 for a in itertools.combinations_with_replacement('abcde',n):
  if len(set(a))<2:continue
  for target in 'abcdef':eq(slug,sol(slug).nextGreatestLetter(list(a),target),next((x for x in a if x>target),a[0]))
slug='find-the-duplicate-number'
for n in range(1,6):
 for vals in tuples(range(1,n+1),n+1):
  repeated=[x for x,c in collections.Counter(vals).items() if c>1]
  if len(repeated)!=1:continue
  original=list(vals);eq(slug,sol(slug).findDuplicate(original),repeated[0]);assert original==list(vals)
slug='first-missing-positive'
for n in range(1,6):
 for a in tuples([-2,-1,0,1,2,3,4,5],n):eq(slug,sol(slug).firstMissingPositive(list(a)),next(i for i in range(1,n+2) if i not in a))
slug='fruit-into-baskets'
for n in range(1,6):
 for a in tuples(range(n),n):eq(slug,sol(slug).totalFruit(list(a)),max(j-i for i in range(n) for j in range(i+1,n+1) if len(set(a[i:j]))<=2))
slug='gas-station'
for n in range(1,9):
 for a in tuples([-1,0,1],n):
  valid=[start for start in range(n) if all(sum(a[(start+j)%n] for j in range(i+1))>=0 for i in range(n))]
  if len(valid)>1:continue
  eq(slug,sol(slug).canCompleteCircuit([max(0,x) for x in a],[max(0,-x) for x in a]),valid[0] if valid else -1)
slug='generalized-abbreviation'
for n in range(1,11):
 word=('ab'*6)[:n];want=[]
 for keep in tuples([0,1],n):
  ans='';run=0
  for c,k in zip(word,keep):
   if k:ans+=(str(run) if run else '')+c;run=0
   else:run+=1
  want.append(ans+(str(run) if run else ''))
 eq(slug,sorted(sol(slug).generateAbbreviations(word)),sorted(want))
slug='generate-parentheses'
for n in range(1,7):
 want=[]
 for a in tuples('()',2*n):
  bal=0
  for c in a:
   bal+=1 if c=='(' else -1
   if bal<0:break
  else:
   if bal==0:want.append(''.join(a))
 eq(slug,sorted(sol(slug).generateParenthesis(n)),sorted(want))
slug='graph-valid-tree'
for n in range(1,6):
 options=list(itertools.combinations(range(n),2))
 for bits in tuples([0,1],len(options)):
  edges=[list(e) for e,b in zip(options,bits) if b];parent=list(range(n));cycle=False
  def find(x):
   while parent[x]!=x:x=parent[x]
   return x
  for a,b in edges:
   ra,rb=find(a),find(b)
   if ra==rb:cycle=True
   else:parent[ra]=rb
  eq(slug,sol(slug).validTree(n,edges),not cycle and len({find(x) for x in range(n)})==1)
slug='group-anagrams'
for k in range(1000):
 words=[''.join(rng.choices('abc',k=rng.randrange(7))) for _ in range(rng.randrange(1,15))];want={}
 for w in words:want.setdefault(''.join(sorted(w)),[]).append(w)
 eq(slug,sorted(sorted(x) for x in sol(slug).groupAnagrams(words)),sorted(sorted(x) for x in want.values()))
for n in range(1,7):
 for a in tuples(range(4),n):
  answers=[];circular=[]
  for mask in range(1<<n):
   if any(mask&(1<<i) and mask&(1<<(i+1)) for i in range(n-1)):continue
   amount=sum(x for i,x in enumerate(a) if mask&(1<<i));answers.append(amount)
   if n==1 or not(mask&1 and mask&(1<<(n-1))):circular.append(amount)
  eq('house-robber',sol('house-robber').rob(list(a)),max(answers));eq('house-robber-ii',sol('house-robber-ii').rob(list(a)),max(circular))
slug='implement-trie-prefix-tree';obj=ns[slug]['Trie']();words=set()
for k in range(2000):
 w=''.join(rng.choices('abc',k=rng.randrange(1,9)))
 if k%3==0:obj.insert(w);words.add(w)
 elif k%3==1:eq(slug,obj.search(w),w in words)
 else:eq(slug,obj.startsWith(w),any(x.startswith(w) for x in words))
w='a'*2000;obj.insert(w);eq(slug,obj.search(w),True);eq(slug,obj.search(w[:-1]),False);eq(slug,obj.startsWith(w[:-1]),True)
slug='index-pairs-of-a-string'
for k in range(1000):
 text=''.join(rng.choices('abc',k=rng.randrange(1,21)));words=list(set(''.join(rng.choices('abc',k=rng.randrange(1,8))) for _ in range(rng.randrange(1,15))));want=[[i,j] for i in range(len(text)) for j in range(i,len(text)) if text[i:j+1] in words];eq(slug,sol(slug).indexPairs(text,words),want)
# Reproduce acceptance of factors violating the package's stated sorted-inner-list contract.
adapter={};exec((ROOT/'factor-combinations'/'adapter.py').read_text(),adapter)
probe={'actual':[[6,2],[3,2,2],[4,3]],'expected':[[2,2,3],[2,6],[3,4]],'case':{'n':12}}
assert adapter['check'](**probe)
print(json.dumps({'oracle_counts':dict(stats),'oracle_total':sum(stats.values()),'factor_checker_unsorted_accepted':True},indent=2))
pathlib.Path('/home/data/Projects/blind-75/review/2026-10-04/evidence/probe-2-results.json').write_text(json.dumps({'oracle_counts':dict(stats),'oracle_total':sum(stats.values()),'factor_checker_unsorted_accepted':True},indent=2))
