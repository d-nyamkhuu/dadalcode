def run(ns, case):
    head = build_list(case['head'])
    survivors, node = [], head
    while node is not None:
        if node.val != case['val']:
            survivors.append((node, node.val))
        node = node.next
    result = ns['Solution']().removeElements(head, case['val'])
    values = []
    for original, value in survivors:
        if result is not original or type(result.val) is not int or result.val != value:
            raise ValueError('Preserve the original surviving nodes, values, and order')
        values.append(value)
        result = result.next
    if result is not None:
        raise ValueError('Unexpected extra nodes or cycle after removal')
    return values
