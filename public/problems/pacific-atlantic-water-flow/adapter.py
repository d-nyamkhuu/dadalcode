def run(ns, case):
    return ns['Solution']().pacificAtlantic(case['heights'])
def check(actual, expected, case):
    return isinstance(actual,list) and all(isinstance(p,list) and len(p)==2 and all(type(v)==int for v in p) for p in actual) and sorted(map(tuple,actual))==sorted(map(tuple,expected))
