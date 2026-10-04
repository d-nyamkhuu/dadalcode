def run(ns, case):
    return ns['Solution']().findDuplicates(list(case['nums']))
def check(actual, expected, case):
    return isinstance(actual,list) and all(type(v)==int for v in actual) and sorted(actual)==sorted(expected)
