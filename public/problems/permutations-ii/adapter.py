def run(ns, case):
    return ns['Solution']().permuteUnique(case['nums'])


def check(actual, expected, case):
    if not isinstance(actual, list):
        return False
    if any(not isinstance(row, list) or any(type(value) is not int for value in row) for row in actual):
        return False
    # Outer order is free, but missing or duplicate full permutations remain invalid.
    return sorted(actual) == sorted(expected)
