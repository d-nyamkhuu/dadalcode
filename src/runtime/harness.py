"""Shared pure-Python fixture and tracing harness (CPython and Pyodide)."""
import json, sys, time, math, copy, traceback, contextlib, io, types, collections, heapq, bisect, functools, itertools, tokenize
from typing import *

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next

class Node:
    def __init__(self, val=0, neighbors=None):
        self.val, self.neighbors = val, [] if neighbors is None else neighbors

class Interval:
    def __init__(self, start=0, end=0):
        self.start, self.end = start, end

# Sort List permits 50,000 nodes. This output limit is independent of the much
# smaller visualization limits; cycle detection still rejects cyclic lists.
MAX_LINKED_LIST_OUTPUT_NODES = 50000

def build_tree(values):
    if not values or values[0] is None: return None
    root = TreeNode(values[0]); queue = collections.deque([root]); i = 1
    while queue and i < len(values):
        parent = queue.popleft()
        for side in ('left', 'right'):
            if i < len(values) and values[i] is not None:
                child = TreeNode(values[i]); setattr(parent, side, child); queue.append(child)
            i += 1
    return root

def tree_values(root):
    if root is None: return []
    result, queue, visited = [], collections.deque([root]), set()
    while queue:
        node = queue.popleft()
        if node is None: result.append(None); continue
        if id(node) in visited: raise ValueError('Tree contains a repeated node or cycle')
        visited.add(id(node)); result.append(node.val)
        queue.extend([node.left, node.right])
        if len(visited) > 10000: raise ValueError('Tree output is too large')
    while result and result[-1] is None: result.pop()
    return result

def build_list(values):
    dummy = ListNode(); tail = dummy
    for value in values: tail.next = ListNode(value); tail = tail.next
    return dummy.next

def list_values(head):
    values, visited = [], set()
    while head:
        if id(head) in visited: raise ValueError('Output linked list contains a cycle')
        visited.add(id(head)); values.append(head.val); head = head.next
        if len(values) > MAX_LINKED_LIST_OUTPUT_NODES: raise ValueError('Linked-list output is too large')
    return values

def encode(value, depth=0):
    if depth > 100: raise ValueError('Output nesting is too deep')
    if value is None or isinstance(value, (bool, int, str)): return value
    if isinstance(value, float):
        if not math.isfinite(value): return str(value)
        return value
    if hasattr(value, 'left') and hasattr(value, 'right') and hasattr(value, 'val'): return tree_values(value)
    if hasattr(value, 'next') and hasattr(value, 'val'): return list_values(value)
    if hasattr(value, 'start') and hasattr(value, 'end'): return [value.start, value.end]
    if isinstance(value, dict): return {str(k): encode(v, depth+1) for k,v in value.items()}
    if isinstance(value, (list,tuple,set,frozenset,collections.deque,types.GeneratorType,map,zip)):
        return [encode(v,depth+1) for v in value]
    if hasattr(value, '__dict__'): return encode(vars(value), depth+1)
    raise TypeError('Unsupported output type: '+type(value).__name__)

def equivalent(a,b):
    if isinstance(a,bool) or isinstance(b,bool): return type(a) is type(b) and a == b
    # An integer expected answer is exact even when the candidate returns a
    # float. Otherwise relative tolerance can hide large counting errors.
    # Genuine floating-answer problems use explicit adapter checks, including
    # when JSON/JavaScript represents a whole-number median as an integer.
    if isinstance(b,int): return isinstance(a,(int,float)) and a == b
    if isinstance(a,(int,float)) and isinstance(b,float):
        return math.isclose(a,b,rel_tol=1e-7,abs_tol=1e-9)
    if isinstance(a,list) and isinstance(b,list): return len(a)==len(b) and all(equivalent(x,y) for x,y in zip(a,b))
    if isinstance(a,dict) and isinstance(b,dict): return a.keys()==b.keys() and all(equivalent(a[k],b[k]) for k in a)
    return type(a) is type(b) and a==b

class SnapshotContext:
    """Keep object identity stable for an entire trace, including detached nodes."""
    def __init__(self, trie=False):
        self.objects = {}
        self.trie = trie
        self.limits = set()
    def identity(self, value, prefix='node'):
        key = id(value)
        if key not in self.objects:
            # Retaining the object also prevents Python from recycling its id.
            self.objects[key] = (f'{prefix}-{len(self.objects)}', value)
        return self.objects[key][0]

def snapshot(value, depth=0, seen=None, context=None):
    if isinstance(value,float): return value if math.isfinite(value) else str(value)
    if value is None or isinstance(value,(bool,int)): return value
    if isinstance(value,str):
        if len(value)>400 and context: context.limits.add(f'Text shortened to 400 of {len(value)} characters')
        return value[:400]
    if depth > (16 if context and context.trie else 8):
        if context: context.limits.add('Deeper nested values collapsed')
        return '…'
    if seen is None: seen=set()
    if id(value) in seen: return '↻'
    seen=seen|{id(value)}
    if hasattr(value,'val') and any(hasattr(value,x) for x in ('next','left','neighbors')):
        kind = 'tree' if hasattr(value,'left') else ('graph' if hasattr(value,'neighbors') else 'linked-list')
        root_id = context.identity(value) if context else '0'
        nodes, queue, ids = [], collections.deque([value]), {id(value):root_id}
        while queue and len(nodes)<32:
            node=queue.popleft(); links={}
            neighbors = [('left',getattr(node,'left',None)),('right',getattr(node,'right',None))] if kind=='tree' else ([('next',getattr(node,'next',None))] if kind=='linked-list' else [(str(i),n) for i,n in enumerate(node.neighbors)])
            for label,child in neighbors:
                if child is not None:
                    if id(child) not in ids:
                        ids[id(child)]=context.identity(child) if context else str(len(ids)); queue.append(child)
                    links[label]=ids[id(child)]
            nodes.append({'id':ids[id(node)],'value':snapshot(node.val,depth+1,seen,context),'links':links})
        if queue and context: context.limits.add('Node snapshot limited to 32 reachable nodes')
        return {'__kind':kind,'nodes':nodes,'root':root_id,'identity':root_id,'stableIds':context is not None,'truncated':bool(queue)}
    if isinstance(value,dict):
        if len(value)>32 and context: context.limits.add(f'Map shows 32 of {len(value)} entries')
        result={(f'Node {k.val} [{context.identity(k) if context else i}]' if hasattr(k,'val') else str(k)[:60]):snapshot(v,depth+1,seen,context) for i,(k,v) in enumerate(list(value.items())[:32])}
        if context and context.trie: result['__ref']=context.identity(value,'dict')
        return result
    if isinstance(value,(list,tuple,set,frozenset,collections.deque)):
        if len(value)>40 and context: context.limits.add(f'Sequence shows 40 of {len(value)} entries')
        return [snapshot(v,depth+1,seen,context) for v in list(value)[:40]]
    if hasattr(value,'__dict__'):
        result={k:snapshot(v,depth+1,seen,context) for k,v in list(vars(value).items())[:24] if not callable(v)}
        if context and context.trie: result['__ref']=context.identity(value,'object')
        return result
    return repr(value)[:120]

class BoundedOutput(io.StringIO):
    def write(self,text):
        left=65536-self.tell()
        if left>0: super().write(text[:left])
        return len(text)

def base_namespace():
    ns={k:v for k,v in globals().items() if not k.startswith('_')}
    for module in (collections,heapq,bisect,functools,itertools,math):
        ns.update({k:v for k,v in vars(module).items() if not k.startswith('_')})
    ns.update({'__name__':'__solution__','inf':float('inf')})
    return ns

def run_case(code, adapter, fixture, trace=False, config=None):
    config=config or {}; steps=[]; truncated=False
    validating=False
    snapshot_context=SnapshotContext(config.get('kind')=='trie')
    started=time.perf_counter(); output=BoundedOutput(); actual=None; error=None; passed=False
    lines=code.splitlines(); names=set(config.get('focus',[])+config.get('pointers',[])+config.get('watch',[]))
    comments={}
    try:
        comments={token.start[0]:token.string.lstrip('#').strip() for token in tokenize.generate_tokens(io.StringIO(code).readline) if token.type==tokenize.COMMENT}
    except (tokenize.TokenError,IndentationError): pass
    def tracer(frame,event,arg):
        nonlocal truncated
        if validating: return tracer
        if frame.f_code.co_filename!='<solution>': return tracer
        if event not in ('line','return'): return tracer
        if len(steps)>=2000: truncated=True; return None
        if frame.f_code.co_name=='<module>': return tracer
        values={}; limits={}; depth=0; stack=[]; cursor=frame
        def capture(key, value):
            snapshot_context.limits.clear()
            values[key]=snapshot(value,context=snapshot_context)
            if snapshot_context.limits: limits[key]='; '.join(sorted(snapshot_context.limits))
        while cursor:
            if cursor.f_code.co_filename=='<solution>':
                depth+=1; stack.append(cursor.f_code.co_name)
                for key,val in cursor.f_locals.items():
                    if key not in values and key!='self' and not key.startswith('__') and (key in names or not names):
                        try: capture(key,val)
                        except Exception: values[key]='[unavailable]'
                if 'self' in cursor.f_locals and vars(cursor.f_locals['self']):
                    try: capture('structure',vars(cursor.f_locals['self']))
                    except Exception: pass
            cursor=cursor.f_back
        if event=='return':
            try: capture('returnValue',arg)
            except Exception: pass
        line=frame.f_lineno; source=lines[line-1].strip() if 0<line<=len(lines) else ''
        explanation=''
        if line in comments: explanation=comments[line]
        if not explanation:
            previous=line-2
            while previous>=0 and not lines[previous].strip(): previous-=1
            if previous>=0 and lines[previous].strip().startswith('#'): explanation=lines[previous].strip().lstrip('#').strip()
        if not explanation:
            explanation=('Return from '+frame.f_code.co_name if event=='return' else 'Next: '+source)
        values['_callStack']=list(reversed(stack))[:12]
        steps.append({'line':line,'event':event,'function':frame.f_code.co_name,'depth':depth,'explanation':explanation,'variables':values,'limits':limits})
        return tracer
    try:
        ns=base_namespace(); adapter_ns=base_namespace()
        def fresh_solution_namespace():
            # Encoding adapters can prove that saved strings survive fresh
            # class/global state. These extra judge executions are not the
            # primary walkthrough and must not pollute its source-line trace.
            fresh=base_namespace()
            exec(compile(code,'<solution-validation>','exec'),fresh)
            return fresh
        adapter_ns['fresh_solution_namespace']=fresh_solution_namespace
        def validation_call(function,*args,**kwargs):
            # Extra judge probes must not appear as steps of the user's input.
            nonlocal validating
            previous=validating; validating=True
            try: return function(*args,**kwargs)
            finally: validating=previous
        adapter_ns['validation_call']=validation_call
        with contextlib.redirect_stdout(output),contextlib.redirect_stderr(output):
            exec(compile(adapter,'<adapter>','exec'),adapter_ns)
            # Optional, problem-specific teaching restrictions (for example,
            # bitwise addition without + or -) are checked before execution.
            if 'validate_source' in adapter_ns:
                adapter_ns['validate_source'](code)
            exec(compile(code,'<solution>','exec'),ns)
            if trace: sys.settrace(tracer)
            try: raw=adapter_ns['run'](ns,copy.deepcopy(fixture['input']))
            finally: sys.settrace(None)
            actual=encode(raw)
            if fixture.get('evaluateOnly',False): passed=True
            elif 'check' in adapter_ns: passed=bool(adapter_ns['check'](actual,copy.deepcopy(fixture.get('expected')),copy.deepcopy(fixture['input'])))
            else: passed=equivalent(actual,fixture.get('expected'))
    except Exception:
        sys.settrace(None); error=traceback.format_exc(limit=6)
    result={'name':fixture.get('name','Custom input'),'input':fixture['input'],'expected':fixture.get('expected'),'actual':actual,'passed':passed,'error':error,'stdout':output.getvalue(),'duration':round((time.perf_counter()-started)*1000,2)}
    return {'result':result,'steps':steps,'truncated':truncated}
