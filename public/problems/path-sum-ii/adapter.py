def run(ns, case):
    return ns['Solution']().pathSum(build_tree(case['root']), case['targetSum'])
def check(actual, expected, case):
    return isinstance(actual, list) and all(isinstance(p, list) and all(type(x) is int for x in p) for p in actual) and sorted(actual) == sorted(expected)
