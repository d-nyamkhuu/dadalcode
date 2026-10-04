def run(ns, case):
    return ns['Solution']().findSubstring(case['s'], case['words'])
def check(actual, expected, case):
    return isinstance(actual, list) and all(type(x) is int for x in actual) and sorted(actual) == sorted(expected)
