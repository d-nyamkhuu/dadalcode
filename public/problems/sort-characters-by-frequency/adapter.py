def run(ns, case):
    return ns["Solution"]().frequencySort(case['s'])


def check(actual, expected, case):
    from collections import Counter
    if not isinstance(actual, str) or Counter(actual) != Counter(case['s']):
        return False
    seen, sizes = set(), []
    i = 0
    while i < len(actual):
        char, j = actual[i], i
        if char in seen:
            return False
        seen.add(char)
        while j < len(actual) and actual[j] == char:
            j += 1
        sizes.append(j - i)
        i = j
    return sizes == sorted(sizes, reverse=True)
