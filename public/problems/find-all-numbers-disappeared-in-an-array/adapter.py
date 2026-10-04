def run(ns, case):
    return ns['Solution']().findDisappearedNumbers(case['nums'])

def check(actual, expected, case):
    return isinstance(actual, list) and all(type(value) is int for value in actual) and sorted(actual) == sorted(expected)
