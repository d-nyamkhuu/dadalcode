def run(ns, case):
    head = build_list(case['head'])
    nodes, node = [], head
    while node is not None:
        nodes.append(node)
        node = node.next
    values_before = [node.val for node in nodes]
    result = ns['Solution']().oddEvenList(head)
    expected_order = nodes[::2] + nodes[1::2]
    values = []
    for expected_node in expected_order:
        if result is not expected_node:
            raise ValueError('Relink original odd-position nodes then even-position nodes in their original order')
        values.append(result.val)
        result = result.next
    if result is not None:
        raise ValueError('Returned list has additional nodes or a cycle')
    if [node.val for node in nodes] != values_before:
        raise ValueError('Do not change node values')
    return values
