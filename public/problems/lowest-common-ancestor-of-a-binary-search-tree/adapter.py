def run(ns, case):
    root = build_tree(case['root'])
    nodes, pending = {}, [root]
    while pending:
        node = pending.pop()
        if node is None:
            continue
        nodes[node.val] = node
        pending.extend([node.left, node.right])
    actual = ns['Solution']().lowestCommonAncestor(root, nodes[case['p']], nodes[case['q']])
    if actual is None or nodes.get(actual.val) is not actual:
        raise ValueError('Return an existing ancestor node by identity')
    return actual.val
