def run(ns, case):
    head = build_list(case['head'])
    nodes, node = [], head
    while node is not None:
        nodes.append((node, node.val))
        node = node.next
    removed = len(nodes) - case['n']
    survivors = nodes[:removed] + nodes[removed + 1:]
    result = ns['Solution']().removeNthFromEnd(head, case['n'])
    values = []
    for original, value in survivors:
        if result is not original or type(result.val) is not int or result.val != value:
            raise ValueError('Remove the requested node by links; preserve every surviving original node and value')
        values.append(value)
        result = result.next
    if result is not None:
        raise ValueError('Unexpected extra nodes or cycle after removal')
    return values
