def run(ns, case):
    return ns['Solution']().isSameTree(build_tree(case['p']), build_tree(case['q']))
