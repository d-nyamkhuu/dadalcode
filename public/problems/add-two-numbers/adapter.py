def run(ns, case):
    result = ns['Solution']().addTwoNumbers(build_list(case['l1']), build_list(case['l2']))
    return list_values(result)
