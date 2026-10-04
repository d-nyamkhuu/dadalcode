def run(ns, case):
    obj = ns['NumArray'](case['nums'])
    return [obj.sumRange(left, right) for left, right in case['queries']]
