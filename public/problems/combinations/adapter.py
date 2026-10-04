def run(ns, case):
    return ns["Solution"]().combine(case['n'], case['k'])


def check(actual, expected, case):
    if not isinstance(actual, list) or any(not isinstance(x, list) or any(type(v) is not int for v in x) for x in actual): return False
    return sorted(sorted(x) for x in actual) == sorted(sorted(x) for x in expected)
