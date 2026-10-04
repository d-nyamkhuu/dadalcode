def run(ns, case):
    return ns['Solution']().zigzagLevelOrder(build_tree(case['root']))
