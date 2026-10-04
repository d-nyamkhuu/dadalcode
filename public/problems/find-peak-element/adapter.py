def run(ns, case):
    return ns['Solution']().findPeakElement(case['nums'])
def check(actual, expected, case):
    nums = case['nums']
    return type(actual) is int and 0 <= actual < len(nums) and (actual == 0 or nums[actual] > nums[actual - 1]) and (actual == len(nums)-1 or nums[actual] > nums[actual+1])
