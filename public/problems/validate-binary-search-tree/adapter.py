def run(ns, case):
    return ns['Solution']().isValidBST(build_tree(case['root']))
