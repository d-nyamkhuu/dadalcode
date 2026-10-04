def run(ns, case):
    head = build_list(case['head'])
    originals, node = [], head
    while node is not None:
        originals.append(node)
        node = node.next
    original_values = [node.val for node in originals]
    result = ns['Solution']().swapPairs(head)
    values = list_values(result)
    expected_nodes = originals[:]
    for i in range(0, len(expected_nodes) - 1, 2):
        expected_nodes[i], expected_nodes[i + 1] = expected_nodes[i + 1], expected_nodes[i]
    returned, node = [], result
    while node is not None:
        returned.append(node)
        node = node.next
    if len(returned) != len(expected_nodes) or any(a is not b for a, b in zip(returned, expected_nodes)):
        raise ValueError('Swap the original nodes in pairs; do not replace or reorder other nodes')
    if [node.val for node in originals] != original_values:
        raise ValueError('Node values must remain unchanged')
    return values
