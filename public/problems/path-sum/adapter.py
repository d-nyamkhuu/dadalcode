def run(ns, case):
    return ns['Solution']().hasPathSum(build_tree(case['root']),case['targetSum'])
