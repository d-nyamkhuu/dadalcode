def run(ns, case):
    return ns['Solution']().combinationSum2(case['candidates'],case['target'])
def check(actual, expected, case):
    if not isinstance(actual,list) or any(not isinstance(row,list) or any(type(v) is not int for v in row) for row in actual):
        return False
    return sorted(tuple(sorted(row)) for row in actual)==sorted(tuple(sorted(row)) for row in expected)
