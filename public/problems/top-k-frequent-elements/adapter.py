def run(ns, case):
    return ns['Solution']().topKFrequent(case['nums'],case['k'])
def check(actual, expected, case):
    return isinstance(actual,list) and len(actual)==case['k'] and all(type(v) is int for v in actual) and sorted(actual)==sorted(expected)
