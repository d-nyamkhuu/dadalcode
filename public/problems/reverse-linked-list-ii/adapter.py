def run(ns, case):
    head = build_list(case['head'])
    nodes, current = [], head
    while current:
        nodes.append(current); current = current.next
    result = ns['Solution']().reverseBetween(head, case['left'], case['right'])
    desired = nodes[:case['left']-1] + nodes[case['left']-1:case['right']][::-1] + nodes[case['right']:]
    values = []
    for node in desired:
        if result is not node: raise ValueError('Reverse links of the existing nodes')
        values.append(result.val); result = result.next
    if result: raise ValueError('Unexpected extra nodes or cycle')
    return values
