def run(ns, case):
    return ns['Solution']().permute(case['nums'])


def check(actual, expected, case):
    if not isinstance(actual, list):
        return False
    # Validate shape and integer values before sorting so malformed answers fail cleanly.
    if any(not isinstance(row, list) or any(type(value) is not int for value in row) for row in actual):
        return False
    return sorted(actual) == sorted(expected)
