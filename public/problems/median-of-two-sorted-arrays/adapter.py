import math


def run(ns, case):
    return ns['Solution']().findMedianSortedArrays(case['nums1'], case['nums2'])


def check(actual, expected, case):
    # Medians are numeric measurements, including whole-valued medians. Preserve
    # the documented tolerance while rejecting booleans and nonfinite answers.
    return (type(actual) in (int, float) and math.isfinite(actual)
            and math.isclose(actual, expected, rel_tol=1e-7, abs_tol=1e-9))
