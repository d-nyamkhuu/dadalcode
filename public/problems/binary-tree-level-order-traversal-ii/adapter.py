def run(ns, case):
    return ns['Solution']().levelOrderBottom(build_tree(case['root']))
