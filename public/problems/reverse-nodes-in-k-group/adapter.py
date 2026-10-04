def run(ns, case):
    head = build_list(case['head'])
    nodes = []
    node = head
    while node:
        nodes.append(node)
        node = node.next
    before_values = {id(node):node.val for node in nodes}
    result = ns['Solution']().reverseKGroup(head,case['k'])
    expected_nodes = []
    for start in range(0,len(nodes),case['k']):
        chunk = nodes[start:start+case['k']]
        expected_nodes.extend(reversed(chunk) if len(chunk)==case['k'] else chunk)
    current = result
    for original in expected_nodes:
        if current is not original or current.val != before_values[id(original)]:
            raise ValueError('Reverse original node links, not values or replacement nodes')
        current = current.next
    if current is not None:
        raise ValueError('Extra nodes or a cycle in output')
    return list_values(result)
