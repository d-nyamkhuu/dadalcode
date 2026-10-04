def run(ns, case):
    return tree_values(ns['Solution']().mergeTrees(build_tree(case['root1']), build_tree(case['root2'])))
