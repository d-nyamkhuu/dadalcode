def run(ns, case):
    head = build_list(case['head'])
    nodes, cur = [], head
    while cur: nodes.append(cur); cur = cur.next
    result = ns['Solution']().reverseList(head)
    values = []
    for node in reversed(nodes):
        if result is not node: raise ValueError('Reverse links of original nodes')
        values.append(result.val); result = result.next
    if result: raise ValueError('Unexpected cycle or additional nodes')
    return values
