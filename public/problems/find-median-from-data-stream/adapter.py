from math import isclose, isfinite


def run(ns, case):
    obj = ns['MedianFinder']()
    result = [None]
    for operation, args in zip(case['operations'][1:], case['args'][1:]):
        result.append(getattr(obj, operation)(*args))
    return result


def check(actual, expected, case):
    if not isinstance(actual, list) or len(actual) != len(expected):
        return False
    for answer, target in zip(actual, expected):
        if target is None:
            if answer is not None:
                return False
        else:
            # JSON may represent a whole-number median as an int; both numeric
            # representations use the same tolerance, but bools are not numbers.
            if type(answer) not in (int, float):
                return False
            try:
                close = isfinite(answer) and isclose(answer, target, rel_tol=1e-7, abs_tol=1e-9)
            except OverflowError:
                # A malformed enormous integer cannot represent a valid median.
                return False
            if not close:
                return False
    return True
