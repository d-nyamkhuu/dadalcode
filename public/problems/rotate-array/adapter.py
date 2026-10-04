def run(ns, case):
    nums = case['nums'][:]
    ns['Solution']().rotate(nums, case['k'])
    return nums
