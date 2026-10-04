def run(ns, case):
    return ns['Solution']().getFactors(case['n'])


def check(actual, expected, case):
    if not isinstance(actual, list):
        return False
    for factors in actual:
        if not isinstance(factors, list) or len(factors) < 2:
            return False
        if any(type(value) is not int or not 2 <= value < case['n'] for value in factors):
            return False
        # Only the outer result order is unrestricted by the contract.
        if factors != sorted(factors):
            return False
    return sorted(tuple(factors) for factors in actual) == sorted(tuple(factors) for factors in expected)
