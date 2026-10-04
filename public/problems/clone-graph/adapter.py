def run(ns, case):
    adjacency = case['adjacency']
    nodes = [Node(i + 1) for i in range(len(adjacency))]
    for node, neighbors in zip(nodes, adjacency):
        node.neighbors = [nodes[value - 1] for value in neighbors]
    original_edges = [node.neighbors[:] for node in nodes]
    result = ns['Solution']().cloneGraph(nodes[0] if nodes else None)
    if not nodes:
        if result is not None:
            raise ValueError('Empty graph must clone to None')
        return []
    original_ids = {id(node) for node in nodes}
    found, pending = {}, [result]
    while pending:
        current = pending.pop()
        if current is None or id(current) in original_ids:
            raise ValueError('Clone nodes must be new objects')
        value = current.val
        if type(value) is not int or not 1 <= value <= len(nodes):
            raise ValueError('Clone values must match the original graph')
        if value in found:
            if found[value] is not current:
                raise ValueError('An original node must have only one clone')
            continue
        found[value] = current
        pending.extend(current.neighbors)
    if len(found) != len(nodes) or result.val != 1:
        raise ValueError('Every original node must be copied from the same entry')
    for node, neighbors in zip(nodes, original_edges):
        if len(node.neighbors) != len(neighbors) or any(a is not b for a, b in zip(node.neighbors, neighbors)) or node.val != nodes.index(node) + 1:
            raise ValueError('Cloning must not modify the original graph')
    return [sorted(neighbor.val for neighbor in found[i + 1].neighbors) for i in range(len(nodes))]
