def run(ns, case):
    return ns['Solution']().merge(case['intervals'])
def check(actual, expected, case):
    if not isinstance(actual,list) or any(not isinstance(x,list) or len(x)!=2 or any(type(v) is not int for v in x) for x in actual):
        return False
    return sorted(actual) == sorted(expected)
