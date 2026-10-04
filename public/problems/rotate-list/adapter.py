def run(ns, case):
    head = build_list(case['head'])
    nodes, node = [], head
    while node is not None:
        nodes.append((node, node.val))
        node = node.next
    shift = case['k'] % len(nodes) if nodes else 0
    order = nodes[-shift:] + nodes[:-shift] if shift else nodes
    result = ns['Solution']().rotateRight(head, case['k'])
    values = []
    for original, value in order:
        if result is not original or type(result.val) is not int or result.val != value:
            raise ValueError('Rotate original node links without replacing nodes or changing values')
        values.append(value)
        result = result.next
    if result is not None:
        raise ValueError('Unexpected extra nodes or an unbroken rotation cycle')
    return values
