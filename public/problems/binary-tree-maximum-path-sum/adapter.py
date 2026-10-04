def run(ns, case):
    return ns['Solution']().maxPathSum(build_tree(case['root']))
