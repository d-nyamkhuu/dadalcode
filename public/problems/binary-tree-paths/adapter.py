def run(ns, case):
    return ns['Solution']().binaryTreePaths(build_tree(case['root']))
def check(actual, expected, case):
    return isinstance(actual,list) and all(isinstance(x,str) for x in actual) and sorted(actual)==sorted(expected)
