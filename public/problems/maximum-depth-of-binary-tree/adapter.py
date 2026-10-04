def run(ns, case):
    return ns['Solution']().maxDepth(build_tree(case['root']))
