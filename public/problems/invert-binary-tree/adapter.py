def run(ns, case):
    root = build_tree(case['root'])
    original = []
    stack = [root] if root else []
    while stack:
        node = stack.pop()
        original.append((node, node.left, node.right, node.val))
        if node.left: stack.append(node.left)
        if node.right: stack.append(node.right)
    result = ns['Solution']().invertTree(root)
    if result is not root:
        raise ValueError('Return the original root with inverted links')
    for node, left, right, value in original:
        if node.left is not right or node.right is not left or node.val != value:
            raise ValueError('Invert child links while retaining each node and value')
    return tree_values(result)
