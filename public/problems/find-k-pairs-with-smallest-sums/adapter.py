from collections import Counter
def run(ns, case):
    return ns['Solution']().kSmallestPairs(case['nums1'], case['nums2'], case['k'])
def check(actual, expected, case):
    if not isinstance(actual,list) or len(actual)!=len(expected) or any(not isinstance(p,list) or len(p)!=2 or any(type(v)!=int for v in p) for p in actual):
        return False
    first, second = Counter(case['nums1']), Counter(case['nums2'])
    for (a,b), count in Counter(map(tuple,actual)).items():
        if count > first[a]*second[b]:
            return False
    return sorted(sum(p) for p in actual) == sorted(sum(p) for p in expected)
