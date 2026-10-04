def run(ns, case):
    return ns['Solution']().longestPalindrome(case['s'])
def check(actual, expected, case):
    return isinstance(actual, str) and len(actual) == len(expected) and actual in case['s'] and actual == actual[::-1]
