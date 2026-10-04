def run(ns, case):
    return ns['Solution']().findMaxAverage(case['nums'], case['k'])

def check(actual, expected, case):
    import math
    return type(actual) in (int, float) and math.isfinite(actual) and abs(actual - expected) <= 1e-5
