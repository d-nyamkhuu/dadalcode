def run(ns, case):
    head = build_list(case['head'])
    nodes, cur = [], head
    while cur: nodes.append(cur); cur = cur.next
    original_values = [node.val for node in nodes]
    ns['Solution']().reorderList(head)
    order, left, right = [], 0, len(nodes)-1
    while left <= right:
        order.append(nodes[left]); left += 1
        if left <= right: order.append(nodes[right]); right -= 1
    values, cur = [], head
    for node in order:
        if cur is not node: raise ValueError('Reorder existing nodes by links')
        values.append(cur.val); cur = cur.next
    if cur or [node.val for node in nodes] != original_values: raise ValueError('Cycle or changed node values')
    return values
