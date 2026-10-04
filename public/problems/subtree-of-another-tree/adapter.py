def run(ns, case):
    return ns['Solution']().isSubtree(build_tree(case['root']),build_tree(case['subRoot']))
