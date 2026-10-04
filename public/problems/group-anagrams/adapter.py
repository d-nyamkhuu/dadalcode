def run(ns, case):
    return ns["Solution"]().groupAnagrams(case['strs'])


def check(actual, expected, case):
    if not isinstance(actual, list) or any(not isinstance(group, list) or any(not isinstance(word, str) for word in group) for group in actual):
        return False
    return sorted(sorted(group) for group in actual) == sorted(sorted(group) for group in expected)
