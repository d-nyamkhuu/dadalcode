def run(ns, case):
    return ns["Solution"]().minDepth(build_tree(case["root"]))
