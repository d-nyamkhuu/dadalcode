def run(ns, case):
    return ns['Solution']().kthSmallest(build_tree(case['root']), case['k'])
