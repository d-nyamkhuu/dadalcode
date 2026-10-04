def run(ns, case):
    return ns["Solution"]().levelOrder(build_tree(case["root"]))
