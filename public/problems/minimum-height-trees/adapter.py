def run(ns, case):
    return ns['Solution']().findMinHeightTrees(case['n'], case['edges'])

def check(actual, expected, case):
    return isinstance(actual, list) and all(type(v) is int for v in actual) and sorted(actual) == sorted(expected)
