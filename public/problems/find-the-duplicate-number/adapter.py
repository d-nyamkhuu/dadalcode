def run(ns, case):
    nums = list(case['nums'])
    result = ns['Solution']().findDuplicate(nums)
    if nums != case['nums']:
        raise AssertionError('nums must not be modified')
    return result
