import math
def run(ns, case):
    return ns['Solution']().medianSlidingWindow(case['nums'], case['k'])
def check(actual, expected, case):
    return isinstance(actual,list) and len(actual)==len(expected) and all(type(a) in (int,float) and math.isfinite(a) and abs(a-b)<=1e-5 for a,b in zip(actual,expected))
