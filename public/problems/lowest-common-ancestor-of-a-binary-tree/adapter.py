def run(ns, case):
    root = build_tree(case['root'])
    nodes = {}
    stack = [root]
    while stack:
        node = stack.pop()
        nodes[node.val] = node
        stack.extend(child for child in (node.left,node.right) if child is not None)
    result = ns['Solution']().lowestCommonAncestor(root,nodes[case['p']],nodes[case['q']])
    if result is None or nodes.get(result.val) is not result:
        raise ValueError('Return an original ancestor node')
    return result.val
