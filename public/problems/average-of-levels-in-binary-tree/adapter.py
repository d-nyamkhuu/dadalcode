def run(ns, case):
    return ns["Solution"]().averageOfLevels(build_tree(case["root"]))


def check(actual, expected, case):
    import math
    return (isinstance(actual, list) and len(actual) == len(expected)
            and all(type(a) in (int, float) and math.isfinite(a) and abs(a - b) <= 1e-5
                    for a, b in zip(actual, expected)))
