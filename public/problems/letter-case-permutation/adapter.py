def run(ns, case):
    return ns['Solution']().letterCasePermutation(case['s'])
def check(actual, expected, case):
    return isinstance(actual,list) and all(isinstance(v,str) for v in actual) and sorted(actual)==sorted(expected)
