def run(ns, case):
    return ns['Solution']().findAllConcatenatedWordsInADict(case['words'])
def check(actual, expected, case):
    return isinstance(actual, list) and all(isinstance(w,str) for w in actual) and sorted(actual) == sorted(expected)
