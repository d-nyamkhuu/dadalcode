from collections import Counter


def run(ns, case):
    return ns['Solution']().rearrangeString(case['s'], case['k'])


def check(actual, expected, case):
    if not isinstance(actual, str):
        return False
    counts = Counter(case['s'])
    most = max(counts.values())
    tied = sum(count == most for count in counts.values())
    # Independent equal-cooldown capacity bound; fixture spelling does not decide feasibility.
    possible = (most - 1) * case['k'] + tied <= len(case['s'])
    if not possible:
        return actual == ''
    if Counter(actual) != counts:
        return False
    last = {}
    for i, char in enumerate(actual):
        if char in last and i - last[char] < case['k']:
            return False
        last[char] = i
    return True
