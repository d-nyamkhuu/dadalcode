def run(ns, case):
    return ns['Solution']().partition(case['s'])
def check(actual, expected, case):
    if not isinstance(actual,list) or any(not isinstance(row,list) or any(not isinstance(v,str) for v in row) for row in actual):
        return False
    return sorted(tuple(row) for row in actual)==sorted(tuple(row) for row in expected)
