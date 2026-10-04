def run(ns, case):
    root = build_tree(case['root'])
    original = tree_values(root)
    original_nodes, pending = {}, [root] if root else []
    while pending:
        node = pending.pop()
        original_nodes[id(node)] = node
        if node.left:
            pending.append(node.left)
        if node.right:
            pending.append(node.right)

    # Save the primary encoding before another serialization can overwrite a cache.
    data = ns['Codec']().serialize(root)
    if not isinstance(data, str):
        raise TypeError('serialize must return a string')
    probe_values = [0] if original != [0] else [1, -1]
    probe = build_tree(probe_values)
    probe_data = validation_call(ns['Codec']().serialize, probe)
    if not isinstance(probe_data, str):
        raise TypeError('serialize must return a string for every tree')

    # A new source namespace removes every class/global cache. Strings alone must suffice.
    try:
        independent = fresh_solution_namespace()['Codec']().deserialize(data)
    except Exception as exc:
        raise ValueError('A saved encoding must decode in a fresh namespace without class or global caches') from exc
    if tree_values(independent) != original:
        raise ValueError('A saved encoding must reconstruct its tree in a fresh solution namespace')
    try:
        restored_probe = fresh_solution_namespace()['Codec']().deserialize(probe_data)
    except Exception as exc:
        raise ValueError('Every saved encoding must decode independently without class or global caches') from exc
    if tree_values(restored_probe) != probe_values:
        raise ValueError('Each saved encoding must independently preserve its own values and child positions')

    # Finish with the ordinary primary decode so its result and execution trace stay visible.
    result = ns['Codec']().deserialize(data)
    values = tree_values(result)
    if values != original:
        raise ValueError('A saved encoding must still reconstruct its original tree after another serialize call')
    pending = [result] if result else []
    while pending:
        node = pending.pop()
        if original_nodes.get(id(node)) is node:
            raise ValueError('deserialize must reconstruct from its string, not return cached original nodes')
        if node.left:
            pending.append(node.left)
        if node.right:
            pending.append(node.right)
    return values
