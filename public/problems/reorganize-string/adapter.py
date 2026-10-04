from collections import Counter

def run(ns, case):
    return ns['Solution']().reorganizeString(case['s'])

def check(actual, expected, case):
    if not isinstance(actual, str):
        return False
    counts = Counter(case['s'])
    possible = max(counts.values()) <= (len(case['s']) + 1) // 2
    if not possible:
        return actual == ''
    return Counter(actual) == counts and all(a != b for a, b in zip(actual, actual[1:]))
