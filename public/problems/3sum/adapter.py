def run(ns, case):
    return ns['Solution']().threeSum(case['nums'])
def check(actual, expected, case):
    if not isinstance(actual, list) or any(not isinstance(x,list) or len(x)!=3 or any(type(v)!=int for v in x) for x in actual):
        return False
    return sorted(tuple(sorted(x)) for x in actual) == sorted(tuple(sorted(x)) for x in expected)
