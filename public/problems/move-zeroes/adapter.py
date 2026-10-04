def run(ns, case):
    nums = case['nums'][:]
    result = ns['Solution']().moveZeroes(nums)
    if result is not None:
        raise ValueError('moveZeroes must communicate its result by mutation and return None')
    return nums
