def run(ns, case):
    root = build_tree(case['root'])
    stack, target = [root], None
    while stack:
        node = stack.pop()
        if node is None:
            continue
        # Resolve the actual node identity; a new equal-valued node is not part of this tree.
        if node.val == case['target']:
            target = node
        stack.extend([node.left, node.right])
    return ns['Solution']().distanceK(root, target, case['k'])


def check(actual, expected, case):
    import json
    if not isinstance(actual, list):
        return False
    return sorted(json.dumps(x, sort_keys=True) for x in actual) == sorted(json.dumps(x, sort_keys=True) for x in expected)
