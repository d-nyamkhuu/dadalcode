def run(ns, case):
    return ns['Solution']().pathSum(build_tree(case['root']), case['targetSum'])
