def run(ns, case):
    return ns['Solution']().twoSum(case['nums'], case['target'])
def check(actual, expected, case):
    return (isinstance(actual, list) and len(actual) == 2
            and all(type(i) is int and 0 <= i < len(case['nums']) for i in actual)
            and actual[0] != actual[1]
            and sum(case['nums'][i] for i in actual) == case['target'])
